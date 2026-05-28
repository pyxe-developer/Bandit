import { readFile } from "node:fs/promises";
import { validateAgentEvaluationHarness } from "../state/agent-evaluation-harness.js";
import { validateAutoLandingPolicy } from "../state/auto-landing-policy.js";
import { validateBootstrapGaps } from "../state/bootstrap-gaps.js";
import { validateCodeRabbitReviewArtifacts } from "../state/coderabbit-review.js";
import { validateCoordinationLogs } from "../state/coordination-log.js";
import { validateConfig } from "../state/config.js";
import { validateEscalatedReviewArtifacts } from "../state/escalated-review.js";
import { validateEventLog } from "../state/events.js";
import { validateHeartbeatPolicy } from "../state/heartbeat-policy.js";
import { validateInputQuarantineGate } from "../state/input-quarantine.js";
import { validateLandingVerdictArtifacts } from "../state/landing-verdicts.js";
import { validateLandingAgentContract } from "../state/landing-agent-contract.js";
import { validateLocalQwenReviewArtifacts } from "../state/local-qwen-review.js";
import { getBanditPaths } from "../state/paths.js";
import { validateReviewEvidenceArtifacts } from "../state/review-evidence.js";
import { validateLocalQwenProfile } from "../state/reviewer-profiles.js";
import { validateRiskClassificationGate } from "../state/risk-classification.js";
import { validateRoutingDecisions } from "../state/routing-decisions.js";
import { readSmellCatalog } from "../state/smell-triggers.js";
import { validateStage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
import { validateSkillLifecycleContracts } from "../state/skill-lifecycle-contracts.js";
import { validateSupplyChainGate } from "../state/supply-chain-gate.js";
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
  await validateInputQuarantineGate(repoRoot);
  await validateRiskClassificationGate(repoRoot);
  await validateSupplyChainGate(repoRoot);
  await validateSkillLifecycleContracts(repoRoot);
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
  await validateBootstrapGaps(repoRoot);
  await validateAutoLandingPolicy(repoRoot);
  await validateHeartbeatPolicy(repoRoot);
  await validateLandingAgentContract(repoRoot);
  await validateStage4EvidenceHeadPolicy(repoRoot);
  await validateCoordinationLogs(repoRoot);

  return { message: "Bandit state is valid." };
}

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
