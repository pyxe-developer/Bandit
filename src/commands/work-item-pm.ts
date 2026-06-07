import {
  appendOrchestrationPlanRecordedStepTransition,
  hasFormationApprovedTransition,
  hasOrchestrationPlanRecordedTransition,
  readFormationApprovedEvidence
} from "../state/coordination-log.js";
import { recheckFormationEvidenceForStart } from "../state/formation-gate.js";
import {
  orchestrationPlanPath,
  requireOrchestrationPlan
} from "../state/work-item-pm-plan.js";

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

  await requireOrchestrationPlan(repoRoot, workItemId);

  if (!(await hasOrchestrationPlanRecordedTransition(repoRoot, workItemId))) {
    await appendOrchestrationPlanRecordedStepTransition(
      repoRoot,
      workItemId,
      orchestrationPlanPath(workItemId)
    );
  }

  return {
    output:
      `Work item ${workItemId} is formation-approved with a recorded plan-mode ` +
      `artifact and ready to start orchestration.\n`
  };
}
