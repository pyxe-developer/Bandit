import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { readLocalQwenProfile } from "../state/reviewer-profiles.js";
import type { LocalQwenProfile } from "../state/reviewer-profiles.js";
import {
  readCurrentGitHead,
  readGitDiff,
  readGitShow,
  readGitStatusShort,
  readLatestCommitForPath
} from "../state/git.js";
import { writeLocalQwenReview } from "../state/local-qwen-review.js";
import { readWorkItem } from "../state/work-items.js";

type ReviewerOutput = {
  verdict: string;
  findings: ReviewerFinding[];
  summary: string;
  confidence?: string;
};

type ReviewerFinding = string | Record<string, unknown>;

export async function qwenReview(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit qwen-review <work-item-id>");
  }

  const workItem = await readWorkItem(repoRoot, workItemId);
  const profile = await readLocalQwenProfile(repoRoot);
  const sourceHead = (await readCurrentGitHead(repoRoot)) ?? "unknown";
  const statusShort = await readGitStatusShort(repoRoot);
  if (statusShort) {
    throw new Error("Local Qwen review requires a clean worktree before source-head evidence can be recorded");
  }

  const prompt = buildReviewPrompt(
    workItemId,
    workItem.title ?? workItemId,
    workItem.content,
    await readReviewPacket(repoRoot, workItemId)
  );
  const output = await runReviewerCommand(repoRoot, profile, prompt);
  const findingsStatus = output.findings.length === 0 ? "none" : "open";
  const findingsDisposition =
    output.findings.length === 0
      ? "no unresolved findings"
      : output.findings.map(formatFindingDisposition).join("; ");
  const artifactPath = await writeLocalQwenReview(repoRoot, {
    workItemId,
    sourceHead,
    profileId: profile.profileId,
    runtime: profile.runtime,
    model: profile.model,
    runStatus: "completed",
    reviewerVerdict: output.verdict,
    findingsStatus,
    findingsDisposition,
    structuredFindings: output.findings,
    sourceDriftStatus: sourceHead === "unknown" ? "unavailable" : "current",
    executableEvidence: [
      `qwen-review command exited 0 using ${profile.profileId}.`,
      output.confidence
        ? `${output.summary} Confidence: ${output.confidence}.`
        : output.summary
    ],
    bootstrapGaps: ["none"]
  });

  if (output.verdict !== "pass") {
    throw new Error(`Local Qwen reviewer verdict blocks landing: ${output.verdict}`);
  }

  return {
    output: [
      `Local Qwen review: ${output.verdict}`,
      `Evidence: ${artifactPath}`
    ].join("\n").concat("\n")
  };
}

function runReviewerCommand(
  repoRoot: string,
  profile: LocalQwenProfile,
  prompt: string
): Promise<ReviewerOutput> {
  const command = prepareReviewerCommand(profile.command.args, prompt);

  return new Promise((resolve, reject) => {
    const child = execFile(
      profile.command.executable,
      command.args,
      {
        cwd: repoRoot,
        timeout: profile.timeoutMs,
        maxBuffer: 1024 * 1024
      },
      (error, stdout, stderr) => {
        if (isMissingPathError(error)) {
          reject(new Error("Configured local Qwen runtime is unavailable"));
          return;
        }

        if (isTimeoutError(error)) {
          reject(new Error("Local Qwen reviewer timed out"));
          return;
        }

        if (error) {
          reject(
            new Error(
              `Local Qwen reviewer exited nonzero${stderr.trim() ? `: ${stderr.trim()}` : ""}`
            )
          );
          return;
        }

        try {
          resolve(parseReviewerOutput(stdout));
        } catch {
          reject(new Error("Local Qwen reviewer output was inconclusive"));
        }
      }
    );

    if (command.stdin) {
      child.stdin?.end(command.stdin);
    }
  });
}

function parseReviewerOutput(stdout: string): ReviewerOutput {
  const parsed = parseJsonObject(stdout);
  const candidate = unwrapReviewerPayload(parsed);

  if (!isRecord(candidate)) {
    throw new Error("Reviewer output was not an object");
  }

  if (
    typeof candidate.verdict !== "string" ||
    !["pass", "non_blocking", "blocker"].includes(candidate.verdict)
  ) {
    throw new Error("Reviewer output missing supported verdict");
  }

  if (!Array.isArray(candidate.findings)) {
    throw new Error("Reviewer output missing findings list");
  }

  if (candidate.findings.some((finding) => !isReviewerFinding(finding))) {
    throw new Error("Reviewer output findings must be strings or structured objects");
  }

  if (candidate.verdict === "pass" && candidate.findings.length > 0) {
    throw new Error("Reviewer pass output must not include findings");
  }

  if (typeof candidate.summary !== "string" || candidate.summary.trim().length === 0) {
    throw new Error("Reviewer output missing summary");
  }

  return {
    verdict: candidate.verdict,
    findings: candidate.findings.map(normalizeReviewerFinding),
    summary: candidate.summary,
    confidence:
      typeof candidate.confidence === "string" && candidate.confidence.trim().length > 0
        ? candidate.confidence.trim()
        : undefined
  };
}

function isReviewerFinding(value: unknown): value is ReviewerFinding {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return (
    isRecord(value) &&
    typeof value.issue === "string" &&
    value.issue.trim().length > 0
  );
}

function normalizeReviewerFinding(finding: ReviewerFinding): ReviewerFinding {
  if (typeof finding === "string") {
    return finding;
  }

  return Object.fromEntries(
    Object.entries(finding).filter(([, value]) => value !== undefined)
  );
}

function formatFindingDisposition(finding: ReviewerFinding) {
  if (typeof finding === "string") {
    return finding;
  }

  for (const field of ["issue", "summary", "message", "title"]) {
    const value = finding[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return JSON.stringify(finding);
}

function unwrapReviewerPayload(parsed: unknown): unknown {
  if (!isRecord(parsed)) {
    return parsed;
  }

  if ("verdict" in parsed) {
    return parsed;
  }

  for (const key of ["response", "text", "content", "output"]) {
    const value = parsed[key];
    if (typeof value === "string") {
      return parseJsonObject(value);
    }
  }

  return parsed;
}

function parseJsonObject(value: string): unknown {
  const trimmed = value.trim();
  const jsonText = extractFencedJson(trimmed) ?? trimmed;
  return JSON.parse(jsonText);
}

function extractFencedJson(value: string) {
  const match = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return match?.[1]?.trim() ?? null;
}

function prepareReviewerCommand(args: string[], prompt: string) {
  let stdin: string | undefined;

  const expandedArgs = args.map((arg) => {
    if (arg === "{{prompt_stdin}}") {
      stdin = prompt;
      return "-";
    }

    return arg.replaceAll("{{prompt}}", prompt);
  });

  return { args: expandedArgs, stdin };
}

async function readReviewPacket(repoRoot: string, workItemId: string) {
  const artifactContents = await readWorkItemArtifacts(repoRoot, workItemId);
  const redEvidenceHead = await readLatestCommitForPath(
    repoRoot,
    `docs/work/${workItemId}/red-evidence.md`
  );
  const previousLandingHead = await readPreviousLandingHead(repoRoot, workItemId);
  const sourceDiffBase = previousLandingHead ?? redEvidenceHead;
  const sourceDiff = sourceDiffBase
    ? await readGitDiff(repoRoot, sourceDiffBase)
    : await readGitShow(repoRoot);
  const sourceDiffRange = sourceDiffBase
    ? `${sourceDiffBase}..HEAD`
    : "HEAD";

  return {
    artifactContents,
    sourceDiff: sourceDiff ?? "Git source diff unavailable.",
    sourceDiffRange
  };
}

async function readWorkItemArtifacts(repoRoot: string, workItemId: string) {
  const artifactNames = [
    "red-evidence.md",
    "implementation-evidence.md"
  ];
  const artifacts: string[] = [];

  for (const artifactName of artifactNames) {
    const displayPath = `docs/work/${workItemId}/${artifactName}`;
    const content = await readOptionalText(path.join(repoRoot, displayPath));
    if (content) {
      artifacts.push([
        `## ${displayPath}`,
        "",
        content.trim()
      ].join("\n"));
    }
  }

  return artifacts.length > 0
    ? artifacts.join("\n\n")
    : "No RED or implementation evidence artifacts were present.";
}

async function readOptionalText(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readPreviousLandingHead(repoRoot: string, workItemId: string) {
  const previousWorkItem = previousWorkItemId(workItemId);
  if (!previousWorkItem) {
    return null;
  }

  const landingAction = await readOptionalText(
    path.join(repoRoot, "docs/work", previousWorkItem, "landing-action.md")
  );
  const landedCommit = landingAction?.match(
    /\|\s*(?:Landed commit|Final implementation source head)\s*\|\s*`([0-9a-f]{7,40})`\s*\|/i
  );

  return landedCommit?.[1] ?? null;
}

function previousWorkItemId(workItemId: string) {
  const match = workItemId.match(/^([A-Z][A-Z0-9]*-)(\d+)$/);
  if (!match) {
    return null;
  }

  const [, prefix, numberText] = match as [string, string, string];
  const previousNumber = Number(numberText) - 1;
  if (!Number.isInteger(previousNumber) || previousNumber < 1) {
    return null;
  }

  return `${prefix}${String(previousNumber).padStart(numberText.length, "0")}`;
}

function buildReviewPrompt(
  workItemId: string,
  title: string,
  briefContent: string,
  packet: { artifactContents: string; sourceDiff: string; sourceDiffRange: string }
) {
  return [
    `Review Bandit work item ${workItemId}: ${title}.`,
    "Act as a read-only adversarial reviewer.",
    "Review the work item contract, RED evidence, implementation evidence, and source diff below.",
    "Look for blocker and non-blocking issues in spec alignment, fail-closed behavior, source-of-truth boundaries, stale evidence handling, and clean-code compliance.",
    "",
    "## Work Item Brief",
    "",
    briefContent,
    "",
    "## Work Item Evidence",
    "",
    packet.artifactContents,
    "",
    "## Source Diff",
    "",
    `Source diff range: ${packet.sourceDiffRange}`,
    "",
    packet.sourceDiff,
    "",
    "Return only JSON with fields: verdict, findings, summary.",
    "Allowed verdict values: pass, non_blocking, blocker.",
    "Use verdict pass only when no blocker or non-blocking finding remains.",
    "When verdict is pass, findings must be [].",
    "When findings is not empty, verdict must be non_blocking or blocker.",
    "Findings must be an array of strings, not objects.",
    "Do not include pass findings or informational findings.",
    "Do not edit files or request tools."
  ].join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function isTimeoutError(error: unknown) {
  return error instanceof Error && "signal" in error && error.signal === "SIGTERM";
}
