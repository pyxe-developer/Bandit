import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  writeEscalatedReview
} from "../state/escalated-review.js";
import { readCurrentGitHead } from "../state/git.js";
import { readEscalatedReviewerProfile } from "../state/escalated-reviewer-profiles.js";
import { readRoutingDecision } from "../state/routing-decisions.js";
import { readSmellCatalog } from "../state/smell-triggers.js";
import { readWorkItem } from "../state/work-items.js";

type EscalatedReviewFixture = {
  source_head?: string;
  provider_status?: string;
  verdict?: string;
  findings_status?: string;
  summary?: string;
};

type RunOptions = {
  workItemId?: string;
  fixturePath?: string;
};

export async function escalatedReview(repoRoot: string, args: string[] = []) {
  if (args[0] !== "run") {
    throw new Error("Usage: bandit escalated-review run <work-item-id>");
  }

  return runEscalatedReview(repoRoot, parseRunOptions(args.slice(1)));
}

async function runEscalatedReview(repoRoot: string, options: RunOptions) {
  const workItemId = options.workItemId;
  if (!workItemId) {
    throw new Error("Usage: bandit escalated-review run <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);

  const smellCatalog = await readSmellCatalog(repoRoot);
  const routingDecision = await readRoutingDecision(
    repoRoot,
    workItemId,
    smellCatalog.smellIds
  );
  const profile = await readEscalatedReviewerProfile(
    repoRoot,
    routingDecision.selectedRoute
  );
  const currentHead = (await readCurrentGitHead(repoRoot)) ?? "unknown";

  if (profile.provider !== "fixture") {
    await writeBlockedEscalatedReview(repoRoot, {
      workItemId,
      sourceHead: currentHead,
      profileId: profile.profileId,
      triggerRationale: routingDecision.finalDecision,
      credentialEnvVar: profile.credentialEnvVar
    });
    throw new Error(
      [
        "Escalated reviewer blocked: missing explicit provider setup",
        profile.credentialEnvVar ? `missing credential: ${profile.credentialEnvVar}` : null,
        "operator-owned input required: provider setup, credentials, and cost approval"
      ].filter(Boolean).join("; ")
    );
  }

  let fixture: EscalatedReviewFixture;
  try {
    fixture = await readFixture(
      repoRoot,
      options.fixturePath ?? profile.fixturePath
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      await writeUnavailableEscalatedReview(repoRoot, {
        workItemId,
        sourceHead: currentHead,
        profileId: profile.profileId,
        triggerRationale: routingDecision.finalDecision,
        reason: "fixture not found"
      });
      throw new Error("Escalated reviewer unavailable: fixture not found");
    }

    if (error instanceof SyntaxError) {
      throw new Error("Malformed escalated reviewer output");
    }

    throw error;
  }

  const sourceHead = fixture.source_head ?? currentHead;
  const sourceDriftStatus = sourceDrift(sourceHead, currentHead);
  const verdict = fixture.verdict ?? "blocker";
  const findingsStatus = fixture.findings_status ?? "inconclusive";
  const disposition = fixture.summary ?? "Fixture escalated reviewer returned no summary.";

  validateFixtureOutput(fixture);

  if (
    fixture.provider_status === "timeout" ||
    fixture.provider_status === "unavailable"
  ) {
    const reason =
      fixture.provider_status === "timeout"
        ? "provider_timeout"
        : "provider_unavailable";
    await writeUnavailableEscalatedReview(repoRoot, {
      workItemId,
      sourceHead,
      profileId: profile.profileId,
      triggerRationale: routingDecision.finalDecision,
      reason
    });
    throw new Error(`Escalated reviewer unavailable: ${reason}`);
  }

  const artifactPath = await writeEscalatedReview(repoRoot, {
    workItemId,
    sourceHead,
    profileId: profile.profileId,
    triggerRationale: routingDecision.finalDecision,
    availabilityStatus: "available",
    reviewerVerdict: verdict,
    disposition,
    sourceDriftStatus,
    bootstrapGapEvidence: ["none"]
  });

  if (sourceDriftStatus !== "current") {
    throw new Error("Escalated review evidence is stale");
  }

  if (verdict !== "pass" || isBlockingFindingsStatus(findingsStatus)) {
    throw new Error(`Escalated reviewer verdict blocks landing: ${verdict}`);
  }

  return {
    output: `Escalated review recorded: ${artifactPath}\n`
  };
}

function parseRunOptions(args: string[]): RunOptions {
  const [workItemId, ...optionArgs] = args;
  const options: RunOptions = { workItemId };

  for (let index = 0; index < optionArgs.length; index += 1) {
    const arg = optionArgs[index];
    const value = optionArgs[index + 1];

    if (arg === "--fixture" && value) {
      options.fixturePath = value;
      index += 1;
      continue;
    }

    throw new Error("Usage: bandit escalated-review run <work-item-id> --fixture <path>");
  }

  return options;
}

async function readFixture(repoRoot: string, fixturePath?: string) {
  if (!fixturePath) {
    throw new Error("Usage: bandit escalated-review run <work-item-id> --fixture <path>");
  }

  const resolvedPath = path.isAbsolute(fixturePath)
    ? fixturePath
    : path.join(repoRoot, fixturePath);
  const content = await readFile(resolvedPath, "utf8");
  return JSON.parse(content) as EscalatedReviewFixture;
}

function validateFixtureOutput(fixture: EscalatedReviewFixture) {
  if (!fixture.verdict || !fixture.findings_status || !fixture.summary) {
    throw new Error("Malformed escalated reviewer output");
  }
}

async function writeBlockedEscalatedReview(
  repoRoot: string,
  input: {
    workItemId: string;
    sourceHead: string;
    profileId: string;
    triggerRationale: string;
    credentialEnvVar?: string;
  }
) {
  await writeEscalatedReview(repoRoot, {
    workItemId: input.workItemId,
    sourceHead: input.sourceHead,
    profileId: input.profileId,
    triggerRationale: input.triggerRationale,
    availabilityStatus: "unavailable",
    reviewerVerdict: "blocker",
    disposition: [
      "Missing explicit escalated reviewer provider setup.",
      input.credentialEnvVar ? `Missing credential environment variable: ${input.credentialEnvVar}.` : null,
      "Operator-owned input required: provider setup, credentials, and cost approval."
    ].filter(Boolean).join(" "),
    sourceDriftStatus: sourceDrift(input.sourceHead, input.sourceHead),
    bootstrapGapEvidence: ["none"]
  });
}

async function writeUnavailableEscalatedReview(
  repoRoot: string,
  input: {
    workItemId: string;
    sourceHead: string;
    profileId: string;
    triggerRationale: string;
    reason: string;
  }
) {
  await writeEscalatedReview(repoRoot, {
    workItemId: input.workItemId,
    sourceHead: input.sourceHead,
    profileId: input.profileId,
    triggerRationale: input.triggerRationale,
    availabilityStatus: "unavailable",
    reviewerVerdict: "blocker",
    disposition:
      input.reason === "fixture not found"
        ? "Fixture provider unavailable: fixture not found."
        : `Provider unavailable: ${input.reason}.`,
    sourceDriftStatus: sourceDrift(input.sourceHead, input.sourceHead),
    bootstrapGapEvidence: ["none"]
  });
}

function sourceDrift(sourceHead: string, currentHead: string) {
  if (sourceHead === "unknown" || currentHead === "unknown") {
    return "unavailable";
  }

  return sourceHead === currentHead ? "current" : "stale";
}

function isBlockingFindingsStatus(findingsStatus: string) {
  return ["open", "unresolved", "inconclusive", "unavailable"].includes(
    findingsStatus
  );
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
