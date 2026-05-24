import { readFile } from "node:fs/promises";
import { validateConfig } from "../state/config.js";
import { readCurrentGitHead } from "../state/git.js";
import { getBanditPaths } from "../state/paths.js";
import { writeUatApproval } from "../state/uat-approval.js";
import { readWorkItem } from "../state/work-items.js";

const UAT_APPROVE_USAGE =
  "Usage: bandit uat approve <work-item-id> --environment <name> --approved-by <operator-reference> --notes <approval-notes>";

type ApprovalArgs = {
  workItemId?: string;
  environment?: string;
  approvedBy?: string;
  notes?: string;
};

export async function uat(repoRoot: string, args: string[]) {
  if (args[0] !== "approve") {
    throw new Error("Usage: bandit uat <approve>");
  }

  const approvalArgs = parseApprovalArgs(args.slice(1));
  if (
    !approvalArgs.workItemId ||
    !approvalArgs.environment ||
    !approvalArgs.approvedBy ||
    !approvalArgs.notes
  ) {
    throw new Error(UAT_APPROVE_USAGE);
  }

  await requireInitializedRepo(repoRoot);
  await readWorkItem(repoRoot, approvalArgs.workItemId);

  const sourceHead = await readCurrentGitHead(repoRoot);
  if (!sourceHead) {
    throw new Error(
      "Cannot record UAT approval because current git source head is unavailable"
    );
  }

  const artifactPath = await writeUatApproval(repoRoot, {
    workItemId: approvalArgs.workItemId,
    sourceHead,
    environment: approvalArgs.environment,
    approvedBy: approvalArgs.approvedBy,
    notes: approvalArgs.notes
  });

  return {
    output: `UAT approval recorded: ${artifactPath}\n`
  };
}

function parseApprovalArgs(args: string[]): ApprovalArgs {
  const parsed: ApprovalArgs = {
    workItemId: args[0]
  };

  for (let index = 1; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];

    if (!flag || !value) {
      break;
    }

    if (flag === "--environment") {
      parsed.environment = value;
      continue;
    }

    if (flag === "--approved-by") {
      parsed.approvedBy = value;
      continue;
    }

    if (flag === "--notes") {
      parsed.notes = value;
    }
  }

  return parsed;
}

async function requireInitializedRepo(repoRoot: string) {
  try {
    validateConfig(await readFile(getBanditPaths(repoRoot).config, "utf8"));
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error("Bandit repo is not initialized. Run bandit init first.");
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
