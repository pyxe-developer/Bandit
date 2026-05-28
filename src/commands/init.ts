import { mkdir, stat } from "node:fs/promises";
import { writeDefaultAgentEvaluationPolicy } from "../state/agent-evaluation-harness.js";
import { writeDefaultAutoLandingPolicy } from "../state/auto-landing-policy.js";
import { writeDefaultBootstrapGapLedger } from "../state/bootstrap-gaps.js";
import { writeDefaultConfig } from "../state/config.js";
import { appendLifecycleEvent } from "../state/events.js";
import { writeDefaultHeartbeatPolicy } from "../state/heartbeat-policy.js";
import { writeDefaultInputQuarantinePolicy } from "../state/input-quarantine.js";
import { writeDefaultLandingAgentContract } from "../state/landing-agent-contract.js";
import { getBanditPaths } from "../state/paths.js";
import {
  writeDefaultRiskClassificationPolicy,
  writeDefaultRiskClassificationTemplate
} from "../state/risk-classification.js";
import { writeDefaultSkillLifecyclePolicy } from "../state/skill-lifecycle-contracts.js";
import { writeDefaultStage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
import {
  writeDefaultSupplyChainGatePolicy,
  writeDefaultSupplyChainGateTemplate
} from "../state/supply-chain-gate.js";

export async function initBandit(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const alreadyInitialized = await pathExists(paths.config);
  const bootstrapGapsExist = await pathExists(paths.bootstrapGaps);
  const agentEvaluationPolicyExists = await pathExists(
    paths.agentEvaluationPolicy
  );
  const autoLandingPolicyExists = await pathExists(paths.autoLandingPolicy);
  const heartbeatPolicyExists = await pathExists(paths.heartbeatPolicy);
  const inputQuarantinePolicyExists = await pathExists(
    paths.inputQuarantinePolicy
  );
  const landingAgentContractExists = await pathExists(paths.landingAgentContract);
  const riskClassificationPolicyExists = await pathExists(
    paths.riskClassificationPolicy
  );
  const riskClassificationTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/layered-risk-classification.md`
  );
  const skillLifecyclePolicyExists = await pathExists(
    paths.skillLifecyclePolicy
  );
  const stage4EvidenceHeadPolicyExists = await pathExists(
    paths.stage4EvidenceHeadPolicy
  );
  const supplyChainPolicyExists = await pathExists(paths.supplyChainPolicy);
  const supplyChainTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/supply-chain-gate.md`
  );

  await mkdir(paths.stateRoot, { recursive: true });

  if (!bootstrapGapsExist) {
    await writeDefaultBootstrapGapLedger(paths.bootstrapGaps);
  }

  if (!agentEvaluationPolicyExists) {
    await writeDefaultAgentEvaluationPolicy(paths.agentEvaluationPolicy);
  }

  if (!autoLandingPolicyExists) {
    await writeDefaultAutoLandingPolicy(paths.autoLandingPolicy);
  }

  if (!heartbeatPolicyExists) {
    await writeDefaultHeartbeatPolicy(paths.heartbeatPolicy);
  }

  if (!inputQuarantinePolicyExists) {
    await writeDefaultInputQuarantinePolicy(paths.inputQuarantinePolicy);
  }

  if (!landingAgentContractExists) {
    await writeDefaultLandingAgentContract(paths.landingAgentContract);
  }

  if (!riskClassificationPolicyExists) {
    await writeDefaultRiskClassificationPolicy(paths.riskClassificationPolicy);
  }

  if (!riskClassificationTemplateExists) {
    await writeDefaultRiskClassificationTemplate(repoRoot);
  }

  if (!skillLifecyclePolicyExists) {
    await writeDefaultSkillLifecyclePolicy(paths.skillLifecyclePolicy);
  }

  if (!stage4EvidenceHeadPolicyExists) {
    await writeDefaultStage4EvidenceHeadPolicy(paths.stage4EvidenceHeadPolicy);
  }

  if (!supplyChainPolicyExists) {
    await writeDefaultSupplyChainGatePolicy(paths.supplyChainPolicy);
  }

  if (!supplyChainTemplateExists) {
    await writeDefaultSupplyChainGateTemplate(repoRoot);
  }

  if (alreadyInitialized) {
    await appendLifecycleEvent(paths.events, {
      type: "repo_init_skipped",
      work_item: null,
      message: "Bandit repo-native state already existed"
    });
    return { message: "Bandit state already initialized." };
  }

  await writeDefaultConfig(paths.config);
  await appendLifecycleEvent(paths.events, {
    type: "repo_initialized",
    work_item: null,
    message: "Initialized Bandit repo-native state"
  });

  return { message: "Initialized Bandit state." };
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
