import {
  appendFormationApprovedStepTransition
} from "../state/coordination-log.js";
import {
  formationReviewArtifactPaths,
  inspectFormationReviewContent,
  requireFormationReviewArtifacts,
  validateFormationBrief
} from "../state/formation-gate.js";
import { createWorkItem } from "./work-item-create.js";

export async function repoPm(repoRoot: string, args: string[]): Promise<{ output: string }> {
  const [subcommand, ...subArgs] = args;

  if (subcommand === "create-work-item") {
    if (!subArgs[0] || subArgs.length !== 1) {
      throw new Error("Usage: bandit repo-pm create-work-item <spec-path>");
    }
    return createWorkItem(repoRoot, ["create", subArgs[0]]);
  }

  if (subcommand === "approve-formation") {
    if (!subArgs[0] || subArgs.length !== 1) {
      throw new Error("Usage: bandit repo-pm approve-formation <work-item-id>");
    }
    return approveFormation(repoRoot, subArgs[0]);
  }

  throw new Error(
    "Usage: bandit repo-pm <create-work-item|approve-formation> [args]"
  );
}

async function approveFormation(repoRoot: string, workItemId: string) {
  await validateFormationBrief(repoRoot, workItemId);
  await requireFormationReviewArtifacts(repoRoot, workItemId);
  const reviewArtifacts = formationReviewArtifactPaths(workItemId);
  await inspectFormationReviewContent(repoRoot, reviewArtifacts);
  await appendFormationApprovedStepTransition(repoRoot, workItemId, reviewArtifacts);

  return {
    output: `Formation approved: ${workItemId}\nformation_approved transition recorded in coordination log.\n`
  };
}
