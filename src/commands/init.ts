import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeDefaultAgentEvaluationPolicy } from "../state/agent-evaluation-harness.js";
import { writeDefaultAutoLandingPolicy } from "../state/auto-landing-policy.js";
import { writeDefaultBootstrapGapLedger } from "../state/bootstrap-gaps.js";
import {
  writeDefaultClaimAuthorityPolicy,
  writeDefaultClaimAuthorityTemplate
} from "../state/claim-authority.js";
import { writeDefaultConfig } from "../state/config.js";
import { appendLifecycleEvent } from "../state/events.js";
import {
  writeDefaultGitMutationPolicy,
  writeDefaultGitMutationTemplate
} from "../state/git-mutations.js";
import { writeDefaultHeartbeatPolicy } from "../state/heartbeat-policy.js";
import {
  writeDefaultCoordinationAuthorityPolicy,
  writeDefaultCoordinationAuthorityTemplate
} from "../state/coordination-authority.js";
import { writeDefaultInputQuarantinePolicy } from "../state/input-quarantine.js";
import { writeDefaultLandingAgentContract } from "../state/landing-agent-contract.js";
import {
  writeDefaultOperatorBoundaryPolicy,
  writeDefaultOperatorBoundaryTemplate
} from "../state/operator-boundary.js";
import {
  writeDefaultOrchestratorPromptsPolicy,
  writeDefaultOrchestratorPromptTemplate
} from "../state/orchestrator-prompts.js";
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
import { writeDefaultGateDeterminismFlakeGatePolicy } from "../state/gate-determinism.js";
import { writeDefaultReplayRegressionCorpusPolicy } from "../state/replay-regression-corpus.js";
import { writeDefaultTestStrengthGatePolicy } from "../state/test-strength-gate.js";
import {
  writeDefaultVerificationOracleProvenancePolicy,
  writeDefaultVerificationOracleProvenanceTemplate
} from "../state/verification-oracle-provenance.js";
import { writeDefaultTrustVerifierCutoverGatesPolicy } from "../state/trust-verifier-cutover-gates.js";

export async function initBandit(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const alreadyInitialized = await pathExists(paths.config);
  const bootstrapGapsExist = await pathExists(paths.bootstrapGaps);
  const agentEvaluationPolicyExists = await pathExists(
    paths.agentEvaluationPolicy
  );
  const autoLandingPolicyExists = await pathExists(paths.autoLandingPolicy);
  const claimAuthorityPolicyExists = await pathExists(paths.claimAuthorityPolicy);
  const claimAuthorityTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/claim-authority.md`
  );
  const coordinationAuthorityPolicyExists = await pathExists(
    paths.coordinationAuthorityPolicy
  );
  const coordinationAuthorityTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/coordination-authority.md`
  );
  const gitMutationPolicyExists = await pathExists(paths.gitMutationPolicy);
  const gitMutationTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/git-mutation-serializer.md`
  );
  const heartbeatPolicyExists = await pathExists(paths.heartbeatPolicy);
  const inputQuarantinePolicyExists = await pathExists(
    paths.inputQuarantinePolicy
  );
  const landingAgentContractExists = await pathExists(paths.landingAgentContract);
  const operatorBoundaryPolicyExists = await pathExists(
    paths.operatorBoundaryPolicy
  );
  const operatorBoundaryTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/operator-boundary.md`
  );
  const orchestratorPromptsPolicyExists = await pathExists(
    paths.orchestratorPromptsPolicy
  );
  const orchestratorPromptTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/work-item-pm-orchestrator-prompt.md`
  );
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
  const gateDeterminismFlakeGatePolicyExists = await pathExists(
    paths.gateDeterminismFlakeGatePolicy
  );
  const replayRegressionCorpusPolicyExists = await pathExists(
    paths.replayRegressionCorpusPolicy
  );
  const testStrengthGatePolicyExists = await pathExists(
    paths.testStrengthGatePolicy
  );
  const verificationOracleProvenancePolicyExists = await pathExists(
    paths.verificationOracleProvenancePolicy
  );
  const verificationOracleProvenanceTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/verification-oracle-provenance.md`
  );
  const trustVerifierCutoverGatesPolicyExists = await pathExists(
    paths.trustVerifierCutoverGatesPolicy
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

  if (!claimAuthorityPolicyExists) {
    await writeDefaultClaimAuthorityPolicy(paths.claimAuthorityPolicy);
  }

  if (!claimAuthorityTemplateExists) {
    await writeDefaultClaimAuthorityTemplate(repoRoot);
  }

  if (!coordinationAuthorityPolicyExists) {
    await writeDefaultCoordinationAuthorityPolicy(
      paths.coordinationAuthorityPolicy
    );
  }

  if (!coordinationAuthorityTemplateExists) {
    await writeDefaultCoordinationAuthorityTemplate(repoRoot);
  }

  if (!gitMutationPolicyExists) {
    await writeDefaultGitMutationPolicy(paths.gitMutationPolicy);
  }

  if (!gitMutationTemplateExists) {
    await writeDefaultGitMutationTemplate(repoRoot);
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

  if (!operatorBoundaryPolicyExists) {
    await writeDefaultOperatorBoundaryPolicy(paths.operatorBoundaryPolicy);
  }

  if (!operatorBoundaryTemplateExists) {
    await writeDefaultOperatorBoundaryTemplate(repoRoot);
  }

  if (!orchestratorPromptsPolicyExists) {
    await writeDefaultOrchestratorPromptsPolicy(paths.orchestratorPromptsPolicy);
  }

  if (!orchestratorPromptTemplateExists) {
    await writeDefaultOrchestratorPromptTemplate(repoRoot);
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

  if (!gateDeterminismFlakeGatePolicyExists) {
    await writeDefaultGateDeterminismFlakeGatePolicy(
      paths.gateDeterminismFlakeGatePolicy
    );
  }

  if (!replayRegressionCorpusPolicyExists) {
    await writeDefaultReplayRegressionCorpusPolicy(
      paths.replayRegressionCorpusPolicy
    );
  }

  if (!testStrengthGatePolicyExists) {
    await writeDefaultTestStrengthGatePolicy(paths.testStrengthGatePolicy);
  }

  if (!verificationOracleProvenancePolicyExists) {
    await writeDefaultVerificationOracleProvenancePolicy(
      paths.verificationOracleProvenancePolicy
    );
  }

  if (!verificationOracleProvenanceTemplateExists) {
    await writeDefaultVerificationOracleProvenanceTemplate(repoRoot);
  }

  if (!trustVerifierCutoverGatesPolicyExists) {
    await writeDefaultTrustVerifierCutoverGatesPolicy(
      paths.trustVerifierCutoverGatesPolicy
    );
  }

  await seedDistributionDefaults(repoRoot);

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

const SEED_FILES = [
  ".bandit/policy/smell-triggers.json",
  ".bandit/reviewers/local-qwen.json"
];

// When Bandit runs as an installed dependency, a fresh consumer repo needs the
// canonical starter templates and default reviewer/smell artifacts so that
// `bandit init` followed by `bandit validate` succeeds. The Bandit development
// checkout already commits these files, so seeding is scoped to installed
// packages and never overwrites files the consumer already has.
async function seedDistributionDefaults(repoRoot: string) {
  const packageRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  );

  if (!isInstalledPackage(packageRoot)) {
    return;
  }

  await seedTemplates(packageRoot, repoRoot);

  for (const relativePath of SEED_FILES) {
    await copyMissingFile(
      path.join(packageRoot, relativePath),
      path.join(repoRoot, relativePath)
    );
  }
}

function isInstalledPackage(packageRoot: string): boolean {
  return packageRoot.split(path.sep).includes("node_modules");
}

async function seedTemplates(packageRoot: string, repoRoot: string) {
  const sourceDir = path.join(packageRoot, "docs/templates");
  let templateFiles: string[];
  try {
    templateFiles = await readdir(sourceDir);
  } catch (error) {
    if (isMissingPathError(error)) {
      return;
    }
    throw error;
  }

  for (const fileName of templateFiles) {
    if (!fileName.endsWith(".md")) {
      continue;
    }

    await copyMissingFile(
      path.join(sourceDir, fileName),
      path.join(repoRoot, "docs/templates", fileName)
    );
  }
}

async function copyMissingFile(source: string, destination: string) {
  if (path.resolve(source) === path.resolve(destination)) {
    return;
  }

  if (await pathExists(destination)) {
    return;
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
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
