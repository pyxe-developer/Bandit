import { readFile } from "node:fs/promises";
import {
  readCodeRabbitReview,
  writeCodeRabbitReview
} from "../state/coderabbit-review.js";
import { readCurrentGitHead } from "../state/git.js";
import { readWorkItem } from "../state/work-items.js";

type LiveCodeRabbitFinding = {
  severity?: string;
  status?: string;
  body?: string;
  disposition?: string;
};

type LiveCodeRabbitFixture = {
  sourceHead?: string;
  baseRevision?: string;
  availabilityStatus?: string;
  prNumber?: number;
  reviewState?: string;
  verdict?: string;
  findings?: LiveCodeRabbitFinding[];
  providerError?: string;
};

type LiveOptions = {
  workItemId?: string;
  prNumber?: string;
  fixturePath?: string;
};

type PrePrOptions = {
  workItemId?: string;
  baseRevision?: string;
  fixturePath?: string;
};

export async function coderabbitReview(repoRoot: string, args: string[] = []) {
  if (args[0] === "pre-pr") {
    return prePrCodeRabbitReview(repoRoot, parsePrePrOptions(args.slice(1)));
  }

  if (args[0] === "live") {
    return liveCodeRabbitReview(repoRoot, parseLiveOptions(args.slice(1)));
  }

  const workItemId = args[0];
  if (!workItemId) {
    throw new Error("Usage: bandit coderabbit-review <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);

  const evidence = await readCodeRabbitReview(repoRoot, workItemId);

  return {
    output: [
      `CodeRabbit review: ${evidence.coderabbitVerdict}`,
      `Evidence: ${evidence.displayPath}`,
      `Provider: ${evidence.provider}`,
      `Review state: ${evidence.reviewState}`,
      `Findings: ${evidence.findingsStatus}`
    ].join("\n").concat("\n")
  };
}

async function prePrCodeRabbitReview(repoRoot: string, options: PrePrOptions) {
  const workItemId = options.workItemId;
  if (!workItemId) {
    throw new Error("Usage: bandit coderabbit-review pre-pr <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);

  const fixture = await readPrePrFixture(repoRoot, workItemId, options);
  const baseRevision = options.baseRevision ?? fixture.baseRevision;
  if (!baseRevision) {
    throw new Error(prePrUsage());
  }

  const sourceHead =
    fixture.sourceHead ?? (await readCurrentGitHead(repoRoot)) ?? "unknown";
  const currentHead = (await readCurrentGitHead(repoRoot)) ?? "unknown";
  const sourceDrift = sourceDriftStatus(sourceHead, currentHead);
  const providerError = redactSecrets(fixture.providerError ?? "", [
    readCredential()
  ]);
  const executableEvidence = [`coderabbit review --agent --base ${baseRevision}`];
  const availabilityStatus = fixture.availabilityStatus ?? "available";

  if (availabilityStatus === "missing_cli") {
    await writeCodeRabbitReview(repoRoot, {
      workItemId,
      sourceHead,
      provider: "coderabbit-agent-pre-pr",
      reviewTarget: `local-diff:${baseRevision}`,
      reviewState: "blocked",
      coderabbitVerdict: "blocker",
      findingsStatus: "unavailable",
      findingsDisposition: "CodeRabbit CLI missing",
      operatorInputStatus: "operator_input_blocked",
      sourceDriftStatus: sourceDrift,
      executableEvidence,
      bootstrapGaps: [
        "Pre-PR CodeRabbit review requires operator-owned CodeRabbit CLI installation."
      ]
    });
    throw new Error(
      "CodeRabbit pre-PR review unavailable: CodeRabbit CLI missing"
    );
  }

  if (availabilityStatus === "missing_auth") {
    await writeCodeRabbitReview(repoRoot, {
      workItemId,
      sourceHead,
      provider: "coderabbit-agent-pre-pr",
      reviewTarget: `local-diff:${baseRevision}`,
      reviewState: "blocked",
      coderabbitVerdict: "blocker",
      findingsStatus: "unavailable",
      findingsDisposition:
        "Missing required operator input: CodeRabbit authentication",
      operatorInputStatus: "operator_input_blocked",
      sourceDriftStatus: sourceDrift,
      executableEvidence,
      bootstrapGaps: [
        "Pre-PR CodeRabbit review requires operator-owned CodeRabbit authentication."
      ]
    });
    throw new Error("Missing required operator input: CodeRabbit authentication");
  }

  const reviewState = fixture.reviewState ?? "completed";
  const verdict = fixture.verdict ?? "pass";
  const findings = fixture.findings ?? [];
  const findingsStatus = normalizePrePrFindingsStatus(findings);
  const unavailable = reviewState === "unavailable" || reviewState === "failed";
  const timedOut = reviewState === "timeout";
  const artifactPath = await writeCodeRabbitReview(repoRoot, {
    workItemId,
    sourceHead,
    provider: "coderabbit-agent-pre-pr",
    reviewTarget: `local-diff:${baseRevision}`,
    reviewState,
    coderabbitVerdict: unavailable || timedOut ? "blocker" : verdict,
    findingsStatus: unavailable || timedOut ? "unavailable" : findingsStatus,
    findingsDisposition: findingsDisposition(findings, providerError),
    operatorInputStatus: "none_required",
    sourceDriftStatus: sourceDrift,
    executableEvidence,
    bootstrapGaps:
      unavailable || timedOut
        ? ["Pre-PR CodeRabbit provider did not return completed review evidence."]
        : ["none"]
  });

  if (timedOut) {
    throw new Error("CodeRabbit pre-PR review unavailable: review timed out");
  }

  if (unavailable) {
    throw new Error(
      providerError
        ? `CodeRabbit pre-PR review unavailable: ${providerError}`
        : "CodeRabbit pre-PR review unavailable"
    );
  }

  if (sourceDrift !== "current") {
    throw new Error("CodeRabbit pre-PR review evidence is stale");
  }

  if (
    verdict === "blocker" ||
    findingsStatus === "unresolved" ||
    findingsStatus === "open"
  ) {
    throw new Error("CodeRabbit pre-PR review has unresolved actionable findings");
  }

  return {
    output: [
      `CodeRabbit pre-PR review: ${verdict}`,
      `Evidence: ${artifactPath}`
    ].join("\n").concat("\n")
  };
}

async function readPrePrFixture(
  repoRoot: string,
  workItemId: string,
  options: PrePrOptions
): Promise<LiveCodeRabbitFixture> {
  if (!options.fixturePath) {
    throw new Error(prePrUsage());
  }

  const content = await readFile(options.fixturePath, "utf8");
  try {
    return JSON.parse(content) as LiveCodeRabbitFixture;
  } catch {
    const sourceHead = (await readCurrentGitHead(repoRoot)) ?? "unknown";
    const currentHead = (await readCurrentGitHead(repoRoot)) ?? "unknown";
    const baseRevision = options.baseRevision ?? "unknown";

    await writeCodeRabbitReview(repoRoot, {
      workItemId,
      sourceHead,
      provider: "coderabbit-agent-pre-pr",
      reviewTarget: `local-diff:${baseRevision}`,
      reviewState: "failed",
      coderabbitVerdict: "blocker",
      findingsStatus: "unavailable",
      findingsDisposition: "Malformed CodeRabbit pre-PR output",
      operatorInputStatus: "none_required",
      sourceDriftStatus: sourceDriftStatus(sourceHead, currentHead),
      executableEvidence: [`coderabbit review --agent --base ${baseRevision}`],
      bootstrapGaps: [
        "Pre-PR CodeRabbit provider returned malformed output; no pass was claimed."
      ]
    });
    throw new Error(
      "CodeRabbit pre-PR review unavailable: malformed provider output"
    );
  }
}

async function liveCodeRabbitReview(repoRoot: string, options: LiveOptions) {
  const workItemId = options.workItemId;
  if (!workItemId) {
    throw new Error("Usage: bandit coderabbit-review live <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);

  const fixture = await readFixture(options.fixturePath);
  const prNumber = options.prNumber ?? formatPrNumber(fixture.prNumber);
  const sourceHead =
    fixture.sourceHead ?? (await readCurrentGitHead(repoRoot)) ?? "unknown";
  const currentHead = (await readCurrentGitHead(repoRoot)) ?? "unknown";
  const sourceDrift = sourceDriftStatus(sourceHead, currentHead);

  if (!prNumber) {
    await writeCodeRabbitReview(repoRoot, {
      workItemId,
      sourceHead,
      provider: "coderabbit-live",
      reviewTarget: "missing-pr-context",
      reviewState: "blocked",
      coderabbitVerdict: "blocker",
      findingsStatus: "unavailable",
      findingsDisposition: "Missing PR context for live CodeRabbit review",
      operatorInputStatus: "operator_input_blocked",
      sourceDriftStatus: sourceDrift,
      executableEvidence: [
        "coderabbit-review live refused before provider access because PR context was not provided."
      ],
      bootstrapGaps: [
        "Live CodeRabbit review requires operator-owned GitHub pull request context."
      ]
    });
    throw new Error("Missing PR context for live CodeRabbit review");
  }

  const credential = readCredential();

  if (!credential) {
    await writeCodeRabbitReview(repoRoot, {
      workItemId,
      sourceHead,
      provider: "coderabbit-live",
      reviewTarget: `github-pr-${prNumber}`,
      reviewState: "blocked",
      coderabbitVerdict: "blocker",
      findingsStatus: "unavailable",
      findingsDisposition: "Missing required operator input: GITHUB_TOKEN",
      operatorInputStatus: "operator_input_blocked",
      sourceDriftStatus: sourceDrift,
      executableEvidence: [
        "coderabbit-review live refused before provider access because GITHUB_TOKEN was not provided."
      ],
      bootstrapGaps: [
        "Live CodeRabbit review requires operator-owned GitHub or CodeRabbit credential setup."
      ]
    });
    throw new Error("Missing required operator input: GITHUB_TOKEN");
  }

  const providerError = redactSecrets(fixture.providerError ?? "", [
    credential
  ]);
  const reviewState = fixture.reviewState ?? "completed";
  const verdict = fixture.verdict ?? "pass";
  const findings = fixture.findings ?? [];
  const findingsStatus = normalizeFindingsStatus(findings);
  const unavailable = reviewState === "unavailable" || reviewState === "failed";
  const artifactPath = await writeCodeRabbitReview(repoRoot, {
    workItemId,
    sourceHead,
    provider: "coderabbit-live",
    reviewTarget: `github-pr-${prNumber}`,
    reviewState,
    coderabbitVerdict: unavailable ? "blocker" : verdict,
    findingsStatus: unavailable ? "unavailable" : findingsStatus,
    findingsDisposition: findingsDisposition(findings, providerError),
    operatorInputStatus: "none_required",
    sourceDriftStatus: sourceDrift,
    executableEvidence: executableEvidence(reviewState, verdict, providerError),
    bootstrapGaps: unavailable
      ? ["Live CodeRabbit provider state was unavailable; no pass was claimed."]
      : ["none"]
  });

  if (unavailable) {
    throw new Error(
      providerError
        ? `CodeRabbit live review unavailable: ${providerError}`
        : "CodeRabbit live review unavailable"
    );
  }

  if (sourceDrift !== "current") {
    throw new Error("CodeRabbit review evidence is stale");
  }

  if (
    verdict !== "pass" ||
    findingsStatus === "unresolved" ||
    findingsStatus === "open"
  ) {
    throw new Error("CodeRabbit review has unresolved actionable findings");
  }

  return {
    output: [
      "CodeRabbit live review: pass",
      `Evidence: ${artifactPath}`
    ].join("\n").concat("\n")
  };
}

function parsePrePrOptions(args: string[]): PrePrOptions {
  const [workItemId, ...optionArgs] = args;
  const options: PrePrOptions = { workItemId };

  for (let index = 0; index < optionArgs.length; index += 1) {
    const arg = optionArgs[index];
    const value = optionArgs[index + 1];

    if (arg === "--base" && value) {
      options.baseRevision = value;
      index += 1;
      continue;
    }

    if (arg === "--fixture" && value) {
      options.fixturePath = value;
      index += 1;
      continue;
    }

    throw new Error(prePrUsage());
  }

  return options;
}

function prePrUsage() {
  return [
    "Usage: bandit coderabbit-review pre-pr <work-item-id>",
    "--base <revision>",
    "--fixture <path>"
  ].join(" ");
}

function parseLiveOptions(args: string[]): LiveOptions {
  const [workItemId, ...optionArgs] = args;
  const options: LiveOptions = { workItemId };

  for (let index = 0; index < optionArgs.length; index += 1) {
    const arg = optionArgs[index];
    const value = optionArgs[index + 1];

    if (arg === "--pr" && value) {
      options.prNumber = value;
      index += 1;
      continue;
    }

    if (arg === "--fixture" && value) {
      options.fixturePath = value;
      index += 1;
      continue;
    }

    throw new Error("Usage: bandit coderabbit-review live <work-item-id> --pr <number> --fixture <path>");
  }

  return options;
}

async function readFixture(
  fixturePath?: string,
  usage = "Usage: bandit coderabbit-review live <work-item-id> --pr <number> --fixture <path>"
): Promise<LiveCodeRabbitFixture> {
  if (!fixturePath) {
    throw new Error(usage);
  }

  const content = await readFile(fixturePath, "utf8");
  return JSON.parse(content) as LiveCodeRabbitFixture;
}

function readCredential() {
  if (process.env.CODERABBIT_TOKEN) {
    return process.env.CODERABBIT_TOKEN;
  }

  return process.env.GITHUB_TOKEN ?? "";
}

function formatPrNumber(prNumber?: number) {
  return typeof prNumber === "number" ? String(prNumber) : undefined;
}

function sourceDriftStatus(sourceHead: string, currentHead: string) {
  if (sourceHead === "unknown" || currentHead === "unknown") {
    return "unavailable";
  }

  return sourceHead === currentHead ? "current" : "stale";
}

function normalizeFindingsStatus(findings: LiveCodeRabbitFinding[]) {
  if (findings.length === 0) {
    return "none";
  }

  return findings.some((finding) => finding.status === "unresolved")
    ? "unresolved"
    : "open";
}

function normalizePrePrFindingsStatus(findings: LiveCodeRabbitFinding[]) {
  if (findings.length === 0) {
    return "none";
  }

  if (findings.some(isUnresolvedActionableFinding)) {
    return "unresolved";
  }

  return findings.every((finding) => finding.status === "resolved")
    ? "resolved"
    : "open";
}

function isUnresolvedActionableFinding(finding: LiveCodeRabbitFinding) {
  if (finding.status !== "unresolved") {
    return false;
  }

  return finding.severity !== "info";
}

function findingsDisposition(
  findings: LiveCodeRabbitFinding[],
  providerError: string
) {
  if (providerError) {
    return `provider error redacted: ${providerError}`;
  }

  if (findings.length === 0) {
    return "no unresolved CodeRabbit findings";
  }

  return findings
    .map(
      (finding) =>
        finding.disposition ??
        finding.body ??
        `${finding.severity ?? "finding"} ${finding.status ?? "open"}`
    )
    .join("; ");
}

function executableEvidence(
  reviewState: string,
  verdict: string,
  providerError: string
) {
  if (providerError) {
    return [
      `CodeRabbit live provider returned an unavailable state; provider error redacted: ${providerError}`
    ];
  }

  return [`coderabbit-review live normalized ${reviewState} review state with ${verdict} verdict.`];
}

function redactSecrets(value: string, secrets: string[]) {
  let redacted = value;
  for (const secret of secrets) {
    if (secret) {
      redacted = redacted.split(secret).join("[REDACTED]");
    }
  }

  return redacted.replace(/ghp_[A-Za-z0-9_]+/g, "[REDACTED]");
}
