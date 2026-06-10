import { readFile } from "node:fs/promises";
import { validateAgentEvaluationHarness } from "../state/agent-evaluation-harness.js";
import {
  validateProjectionConsistency,
  type MetamorphicCrossProjectionReport
} from "../state/projection-consistency.js";
import { validateAutoLandingPolicy } from "../state/auto-landing-policy.js";
import { validateBootstrapGaps } from "../state/bootstrap-gaps.js";
import { validateClaimAuthority } from "../state/claim-authority.js";
import { validateCodeRabbitReviewArtifacts } from "../state/coderabbit-review.js";
import { validateCoordinationAuthority } from "../state/coordination-authority.js";
import { validateCoordinationLogs } from "../state/coordination-log.js";
import { validateConfig } from "../state/config.js";
import { validateEscalatedReviewArtifacts } from "../state/escalated-review.js";
import { validateEvidenceFreshnessSlosPolicy } from "../state/evidence-freshness-slos.js";
import { validateEventLog } from "../state/events.js";
import {
  validateGateDeterminismFlakeGate,
  type GateDeterminismFlakeGateReport
} from "../state/gate-determinism.js";
import { validateGitMutations } from "../state/git-mutations.js";
import { validateHeartbeatPolicy } from "../state/heartbeat-policy.js";
import { validateInputQuarantineGate } from "../state/input-quarantine.js";
import { validateLandingVerdictArtifacts } from "../state/landing-verdicts.js";
import { validateLandingAgentContract } from "../state/landing-agent-contract.js";
import { validateLocalQwenReviewArtifacts } from "../state/local-qwen-review.js";
import { validateModelFamilySeparation } from "../state/model-family-separation.js";
import { validateOperatorBoundary } from "../state/operator-boundary.js";
import { validateOrchestratorPromptsPolicy } from "../state/orchestrator-prompts.js";
import { getBanditPaths } from "../state/paths.js";
import { validateReviewEvidenceArtifacts } from "../state/review-evidence.js";
import { validateLocalQwenProfile } from "../state/reviewer-profiles.js";
import { validateRiskClassificationGate } from "../state/risk-classification.js";
import { validateRoutingDecisions } from "../state/routing-decisions.js";
import { readSmellCatalog } from "../state/smell-triggers.js";
import { validateStage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
import { validateSkillLifecycleContracts } from "../state/skill-lifecycle-contracts.js";
import { validateStageCapabilityScopePolicy } from "../state/stage-capability-scope.js";
import { validateSupplyChainGate } from "../state/supply-chain-gate.js";
import { validateArtifactInputsPolicy } from "../state/artifact-inputs.js";
import { validateBoundaryAutonomyTemplates } from "../state/boundary-autonomy.js";
import {
  validateAttributionJoinKeyArtifacts
} from "../state/attribution-join-key.js";
import { validateBoundaryEscapeArtifacts } from "../state/boundary-escape.js";
import { validateBoundaryCellMovementArtifacts } from "../state/boundary-cell-movement.js";
import { validateRoleContractsPolicy } from "../state/role-contracts.js";
import { validateTokenCostFailsafePolicy } from "../state/token-cost-failsafe.js";
import { validateTrustVerifierCutoverGates } from "../state/trust-verifier-cutover-gates.js";
import { validateTemplates } from "../state/templates.js";
import { validateUatApprovalArtifacts } from "../state/uat-approval.js";
import { validateWorkItems } from "../state/work-items.js";

export async function validateBandit(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const config = await readRequiredFile(paths.config, ".bandit/config.toml");
  validateConfig(config);

  const eventLog = await readRequiredFile(paths.events, ".bandit/events.jsonl");
  validateEventLog(eventLog);

  await validateWorkItems(repoRoot);
  await validateTemplates(repoRoot);
  await validateOperatorBoundary(repoRoot);
  await validateOrchestratorPromptsPolicy(repoRoot);
  await validateInputQuarantineGate(repoRoot);
  await validateRiskClassificationGate(repoRoot);
  await validateSupplyChainGate(repoRoot);
  await validateCoordinationAuthority(repoRoot);
  await validateClaimAuthority(repoRoot);
  await validateGitMutations(repoRoot);
  await validateSkillLifecycleContracts(repoRoot);
  await validateStageCapabilityScopePolicy(repoRoot);
  await validateTokenCostFailsafePolicy(repoRoot);
  await validateEvidenceFreshnessSlosPolicy(repoRoot);
  await validateAgentEvaluationHarness(repoRoot);
  await validateLocalQwenProfile(repoRoot);
  const smellCatalog = await readSmellCatalog(repoRoot);
  await validateRoutingDecisions(repoRoot, smellCatalog.smellIds);
  await validateCodeRabbitReviewArtifacts(repoRoot);
  await validateLocalQwenReviewArtifacts(repoRoot);
  await validateEscalatedReviewArtifacts(repoRoot);
  await validateReviewEvidenceArtifacts(repoRoot);
  await validateLandingVerdictArtifacts(repoRoot);
  await validateUatApprovalArtifacts(repoRoot);
  await validateModelFamilySeparation(repoRoot);
  await validateBootstrapGaps(repoRoot);
  await validateAutoLandingPolicy(repoRoot);
  await validateHeartbeatPolicy(repoRoot);
  await validateLandingAgentContract(repoRoot);
  await validateStage4EvidenceHeadPolicy(repoRoot);
  await validateCoordinationLogs(repoRoot);
  await validateRoleContractsPolicy(repoRoot);
  await validateArtifactInputsPolicy(repoRoot);
  await validateTrustVerifierCutoverGates(repoRoot);
  await validateBoundaryAutonomyTemplates(repoRoot);
  await validateAttributionJoinKeyArtifacts(repoRoot);
  await validateBoundaryEscapeArtifacts(repoRoot);
  await validateBoundaryCellMovementArtifacts(repoRoot);
  const gateDeterminismFlakeGate = await validateGateDeterminismFlakeGate(
    repoRoot
  );
  const metamorphicCrossProjectionChecks =
    await validateProjectionConsistency(repoRoot);

  return {
    message: "Bandit state is valid.",
    gateDeterminismFlakeGate,
    metamorphicCrossProjectionChecks
  };
}

export type BanditValidationResult = {
  message: string;
  gateDeterminismFlakeGate: GateDeterminismFlakeGateReport;
  metamorphicCrossProjectionChecks: MetamorphicCrossProjectionReport;
};

async function readRequiredFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required state: ${displayPath}`);
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
