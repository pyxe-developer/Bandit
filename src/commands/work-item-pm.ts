import {
  hasFormationApprovedTransition,
  readFormationApprovedEvidence
} from "../state/coordination-log.js";
import { recheckFormationEvidenceForStart } from "../state/formation-gate.js";

export async function workItemPm(repoRoot: string, args: string[]) {
  const [subcommand, workItemId, ...rest] = args;

  if (subcommand === "start") {
    if (!workItemId || rest.length > 0) {
      throw new Error("Usage: bandit work-item-pm start <work-item-id>");
    }
    return checkStartReadiness(repoRoot, workItemId);
  }

  throw new Error("Usage: bandit work-item-pm <start> <work-item-id>");
}

async function checkStartReadiness(repoRoot: string, workItemId: string) {
  const formationApproved = await hasFormationApprovedTransition(repoRoot, workItemId);

  if (!formationApproved) {
    const formationReviewPath = `docs/work/${workItemId}/formation-review.md`;
    throw new Error(
      `Work item ${workItemId} is not ready to start.\n` +
        `Missing required transition: formation_approved\n` +
        `Required formation review artifact: ${formationReviewPath}\n` +
        `Run: bandit repo-pm approve-formation ${workItemId}`
    );
  }

  const evidencePaths = await readFormationApprovedEvidence(repoRoot, workItemId);
  await recheckFormationEvidenceForStart(repoRoot, workItemId, evidencePaths);

  return {
    output: `Work item ${workItemId} is formation-approved and ready to start.\n`
  };
}
