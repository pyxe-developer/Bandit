import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { autoLandCheck } from "./auto-land-check.js";
import { readLandingReadiness } from "./land-check.js";
import { readGitStatusShort } from "../state/git.js";
import { readLandingAgentContract } from "../state/landing-agent-contract.js";

type LandOptions = {
  action: string;
};

const SUPPORTED_ACTION = "local-record";
const RECORDED_ACTION = "local_record";

export async function land(repoRoot: string, args: string[]) {
  const workItemId = args[0];

  if (!workItemId) {
    throw new Error("Usage: bandit land <work-item-id> --action local-record");
  }

  const options = parseLandOptions(args.slice(1));
  const contract = await readLandingAgentContract(repoRoot);

  if (options.action !== SUPPORTED_ACTION) {
    throw new Error(`Unsupported landing action: ${options.action}`);
  }

  if (!contract.supportedActions.includes(RECORDED_ACTION)) {
    throw new Error(`Unsupported landing action: ${options.action}`);
  }

  const status = await readGitStatusShort(repoRoot);
  if (status === null) {
    throw new Error("Landing blocked: unable to inspect git worktree");
  }

  if (hasUnrelatedDirtyPaths(status, workItemId)) {
    throw new Error("Landing blocked: worktree is dirty");
  }

  try {
    await autoLandCheck(repoRoot, workItemId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message.replace(/^Auto-landing blocked:/, "Landing blocked:"));
  }

  const { reviewEvidence, landingVerdict, readiness } =
    await readLandingReadiness(repoRoot, workItemId);
  assertCurrentReadinessForLanding(readiness);

  const displayPath = `docs/work/${workItemId}/landing-action.md`;
  await writeLandingActionArtifact(repoRoot, displayPath, {
    workItemId,
    actionType: RECORDED_ACTION,
    sourceHead: reviewEvidence.sourceHead,
    currentHead: readiness.currentHead,
    finalVerdict: landingVerdict.finalVerdict
  });

  return {
    output: [
      `Landing action recorded: ${displayPath}`,
      `Action type: ${RECORDED_ACTION}`,
      `Work item: ${workItemId}`,
      `Source head: ${reviewEvidence.sourceHead}`,
      `Current head: ${readiness.currentHead ?? "unavailable"}`
    ].join("\n").concat("\n")
  };
}

function parseLandOptions(args: string[]): LandOptions {
  let action: string | null = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg !== "--action") {
      throw new Error(`Unsupported landing option: ${arg}`);
    }

    const value = args[index + 1];
    if (!value) {
      throw new Error("Usage: bandit land <work-item-id> --action local-record");
    }

    action = value;
    index += 1;
  }

  if (!action) {
    throw new Error("Usage: bandit land <work-item-id> --action local-record");
  }

  return { action };
}

function assertCurrentReadinessForLanding(readiness: {
  sourceDriftStatus: string;
  problems: string[];
}) {
  if (readiness.sourceDriftStatus !== "current") {
    throw new Error("Landing blocked: source evidence is stale");
  }

  if (readiness.problems.length > 0) {
    throw new Error(`Landing blocked: ${readiness.problems.join("\n")}`);
  }
}

async function writeLandingActionArtifact(
  repoRoot: string,
  displayPath: string,
  fields: {
    workItemId: string;
    actionType: string;
    sourceHead: string;
    currentHead: string | null;
    finalVerdict: string;
  }
) {
  const filePath = path.join(repoRoot, displayPath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    `# ${fields.workItemId} Landing Action

## Status

\`landed\`

## Landing Action

| Field | Value |
|---|---|
| Action type | ${fields.actionType} |
| Source head | \`${fields.sourceHead}\` |
| Current head | \`${fields.currentHead ?? "unavailable"}\` |
| Final verdict | ${fields.finalVerdict} |

## Landing Agent Evidence

| Command | Result |
|---|---|
| \`bandit auto-land-check ${fields.workItemId}\` | \`pass\` - eligible under repo-native auto-landing policy. |
| \`bandit land ${fields.workItemId} --action local-record\` | \`pass\` - local landing action evidence recorded. |

## Next Slice Boundary

This work item has landing action evidence for the supported local-record
Landing Agent path. The next work item may not begin until retrospective,
bootstrap-gap disposition, and roadmap context closeout are recorded.
`,
    "utf8"
  );
}

function hasUnrelatedDirtyPaths(status: string, workItemId: string) {
  if (status.length === 0) {
    return false;
  }

  const allowedWorkItemPrefix = `docs/work/${workItemId}/`;
  return status
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .some((line) => {
      const filePath = line.slice(3).trim();
      return !filePath.startsWith(allowedWorkItemPrefix);
    });
}
