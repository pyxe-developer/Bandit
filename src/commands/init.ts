import { copyFile, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeDefaultAgentEvaluationPolicy } from "../state/agent-evaluation-harness.js";
import {
  type ProjectProfile,
  readProjectProfile,
  readProjectProfileWithRawReviewers
} from "../state/project-profile.js";
import {
  type ReviewerAdapterInput,
  recordNoReviewerBootstrapGap,
  scaffoldReviewerAdapter,
  validateTypedReviewerAdapter
} from "../state/reviewer-adapters.js";
import { writeDefaultBoundaryContourPolicy } from "../state/boundary-autonomy.js";
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
  writeDefaultOrchestratorPromptTemplate,
  writeDefaultRepoPmPromptTemplate
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

export async function initBandit(repoRoot: string, profilePath?: string) {
  const profileSourcePath = profilePath ?? null;
  const loadedProfile = profileSourcePath
    ? await loadProfile(repoRoot, profileSourcePath)
    : null;
  const profile = loadedProfile?.profile ?? null;
  const rawReviewerEntries = loadedProfile?.rawReviewerEntries ?? [];

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
  const repoPmPromptTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/repo-pm-formation-prompt.md`
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
  const boundaryContourPolicyExists = await pathExists(
    paths.boundaryContourPolicy
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

  if (!repoPmPromptTemplateExists) {
    await writeDefaultRepoPmPromptTemplate(repoRoot);
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

  if (!boundaryContourPolicyExists) {
    await writeDefaultBoundaryContourPolicy(paths.boundaryContourPolicy);
  }

  // Ensure PRD-004 boundary evidence templates exist. These are created by
  // seedDistributionDefaults for installed packages. For the source checkout,
  // seedDistributionDefaults is skipped but the templates are already committed.
  // For fresh temp repos, write them explicitly to guarantee validate passes.
  const boundaryPredictionTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/boundary-prediction-record.md`
  );
  if (!boundaryPredictionTemplateExists) {
    await mkdir(`${repoRoot}/docs/templates`, { recursive: true });
    await writeFile(
      `${repoRoot}/docs/templates/boundary-prediction-record.md`,
      `contract_version:
work_item:
source_head:
review_subject_hash:
boundary_contour_version:
boundary_contour_path:
risk_tier:
evidence_strength_tier:
landing_autonomy_level:
authorizing_boundary_cell:
risk_classification_evidence:
  -
relied_on_evidence_artifacts:
  - path:
    hash:
    freshness_state:
predicted_safety_outcome:
operator_supervision_status:
rationale:
`,
      "utf8"
    );
  }

  const notifyAndRevertTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/notify-and-revert-artifact.md`
  );
  if (!notifyAndRevertTemplateExists) {
    await mkdir(`${repoRoot}/docs/templates`, { recursive: true });
    await writeFile(
      `${repoRoot}/docs/templates/notify-and-revert-artifact.md`,
      `contract_version:
work_item:
source_head:
landing_autonomy_level: notify_and_revert
rollback_path:
  command:
  verification:
operator_attention_reason:
follow_up_or_expiry:
  state:
  follow_up_work_item:
  expiry_date:
boundary_prediction_record: docs/work/<work_item_id>/boundary-prediction.json
source_drift_status:
rationale:
`,
      "utf8"
    );
  }

  const attributionJoinKeyTemplateExists = await pathExists(
    `${repoRoot}/docs/templates/attribution-join-key.md`
  );
  if (!attributionJoinKeyTemplateExists) {
    await mkdir(`${repoRoot}/docs/templates`, { recursive: true });
    await writeFile(
      `${repoRoot}/docs/templates/attribution-join-key.md`,
      `contract_version:
artifact_kind:
artifact_path:
work_item:
actor_identity:
role_or_profile:
model:
model_version:
profile_hash:
review_subject_hash:
evidence_artifact_hashes:
  - path:
    hash:
touched_surface:
boundary_prediction_record:
authorizing_boundary_cell:
landing_autonomy_level:
purpose:
artifact_state:
attribution_join_hash:
`,
      "utf8"
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

  if (profile && profileSourcePath) {
    const typedReviewerPairs = pairTypedProfileReviewers(
      profileSourcePath,
      profile.reviewers,
      rawReviewerEntries
    );
    const typedReviewers = validateTypedProfileReviewers(
      profileSourcePath,
      typedReviewerPairs
    );
    if (profile.reviewers.length === 0) {
      await recordNoReviewerBootstrapGap(
        repoRoot,
        `${profile.workItemPrefix}-${String(profile.starterWorkItem.number).padStart(3, "0")}`
      );
    } else {
      for (const reviewer of typedReviewers) {
        await scaffoldReviewerAdapter(repoRoot, reviewer);
      }
    }
  }

  if (profile) {
    await seedProfileGovernance(repoRoot, profile);
    await writeProfileConfig(paths.config, profile.workItemPrefix);
    await writeProfileTemplate(repoRoot);
  } else {
    await seedStarterGovernance(repoRoot);
    await writeDefaultConfig(paths.config);
  }

  await appendLifecycleEvent(paths.events, {
    type: "repo_initialized",
    work_item: null,
    message: "Initialized Bandit repo-native state"
  });

  return { message: "Initialized Bandit state." };
}

async function loadProfile(
  repoRoot: string,
  profilePath: string
): Promise<{
  profile: ProjectProfile;
  rawReviewerEntries: unknown[];
}> {
  const absolutePath = path.isAbsolute(profilePath)
    ? profilePath
    : path.resolve(repoRoot, profilePath);
  return readProjectProfileWithRawReviewers(absolutePath);
}

type TypedReviewerPair = {
  declared: ProjectProfile["reviewers"][number];
  raw: Record<string, unknown>;
};

function pairTypedProfileReviewers(
  profilePath: string,
  declaredReviewers: ProjectProfile["reviewers"],
  rawEntries: unknown[]
): TypedReviewerPair[] {
  return declaredReviewers.map((declared, index) => {
    const raw = rawEntries[index];
    if (!isRecord(raw)) {
      throw new Error(
        `Invalid profile field: reviewers[${index}] (missing raw reviewer entry for typed validation in ${profilePath})`
      );
    }
    return { declared, raw };
  });
}

function validateTypedProfileReviewers(
  profilePath: string,
  reviewerPairs: TypedReviewerPair[]
): Array<{
  id: string;
  type: "openai_compatible" | "cli_command" | "human";
  provider: string;
  required: boolean;
  [field: string]: unknown;
}> {
  if (reviewerPairs.length === 0) {
    return [];
  }

  return reviewerPairs.map(({ declared, raw }, index) => {
    if (
      raw.id !== declared.id ||
      raw.provider !== declared.provider ||
      raw.required !== declared.required
    ) {
      throw new Error(
        `Invalid profile field: reviewers[${index}] (parsed reviewer entry diverged from raw reviewer entry in ${profilePath})`
      );
    }
    const id = readReviewerInputString(raw, "id", profilePath, index);
    const type = readReviewerInputString(raw, "type", profilePath, index);
    const provider = readReviewerInputString(raw, "provider", profilePath, index);
    const required = readReviewerInputBoolean(
      raw,
      "required",
      profilePath,
      index
    );
    const reviewerInput: ReviewerAdapterInput = {
      ...raw,
      id,
      type,
      provider,
      required
    };
    return validateTypedReviewerAdapter(reviewerInput, index);
  });
}

function readReviewerInputString(
  raw: Record<string, unknown>,
  field: string,
  profilePath: string,
  index: number
) {
  const value = raw[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].${field} (must be a non-empty string in ${profilePath})`
    );
  }
  return value;
}

function readReviewerInputBoolean(
  raw: Record<string, unknown>,
  field: string,
  profilePath: string,
  index: number
) {
  const value = raw[field];
  if (typeof value !== "boolean") {
    throw new Error(
      `Invalid profile field: reviewers[${index}].${field} (must be a boolean in ${profilePath})`
    );
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function writeProfileConfig(configPath: string, workItemPrefix: string) {
  const content = `state_version = 1\nwork_item_prefix = "${workItemPrefix}"\n`;
  await writeFile(configPath, content, { flag: "wx" });
}

const PROJECT_PROFILE_TEMPLATE = `# project-profile.md
#
# Project profile template for Bandit-governed repositories.
# Copy this file, fill in the fields, and pass it to \`bandit init --profile <file>\`.
#
# Profile is a JSON file. Save as <your-project>-profile.json before running init.

{
  "contract_version": 1,
  "name": "Your Project Name",
  "work_item_prefix": "PROJ",
  "starter_work_item": {
    "number": 1,
    "title": "Consumer Onboarding Starter",
    "current_stage": "Stage 1: starter_ready",
    "next_action": "Complete Stage 1 brief formation for PROJ-001."
  },
  "roadmap_seed": {
    "current_phase": "Project Bootstrap",
    "planned_work": [
      { "kind": "slice", "id": "PROJ-002", "title": "First Delivery Slice" }
    ]
  },
  "reviewers": [
    {
      "id": "local-qwen-baseline",
      "type": "openai_compatible",
      "provider": "omlx-openai-compatible",
      "required": true,
      "provider_base_url": "http://127.0.0.1:8001/v1",
      "model": "Qwen3.6-35B-A3B-MLX-8bit",
      "command": {
        "executable": "node",
        "args": ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
      }
    }
  ],
  "policy_tiers": ["core"],
  "harnesses": ["codex"]
}
`;

async function writeProfileTemplate(repoRoot: string) {
  const templatePath = path.join(repoRoot, "docs/templates/project-profile.md");
  if (await pathExists(templatePath)) {
    return;
  }
  await mkdir(path.dirname(templatePath), { recursive: true });
  await writeFile(templatePath, PROJECT_PROFILE_TEMPLATE, "utf8");
}

function buildProfileStarterBrief(starterId: string, title: string): string {
  return `# ${starterId}: ${title}

## Status

Starter ready.

## Goal

Provide a project-specific starter work item so \`bandit validate\`,
\`bandit cockpit status --json\`, and \`bandit session-context current --json\`
all succeed on day 1.

## Scope

- Create \`docs/work/${starterId}/brief.md\` as a starter work item brief.
- Preserve any existing user-owned governance files.

## Acceptance Criteria

- The brief exists and parses as a non-closed active work item.

## Required Operator Input

No operator-owned input is required.
`;
}

function buildProfileCurrentContext(
  starterId: string,
  title: string,
  currentPhase: string,
  nextAction: string,
  currentStage: string
): string {
  return `# Current Context

## Status

**Phase:** ${currentPhase}.

**Current next action:** ${nextAction}

\`${starterId}\` is the starter work item. Stage 1 brief
formation is the next required gate.

## Active Work

**Active work item:** \`${starterId}\` - ${title}.

The current stage is ${currentStage}. Do not start Stage 2 test design,
Stage 3 implementation, or unrelated work before the Stage 1 brief is recorded.

## Required Operator Input

No operator-owned input is required for the starter onboarding step.
`;
}

function buildProfileRoadmap(
  starterId: string,
  title: string,
  currentPhase: string,
  nextAction: string,
  plannedWork: ProjectProfile["roadmapSeed"]["plannedWork"]
): string {
  const plannedSection =
    plannedWork.length > 0
      ? plannedWork
          .map(
            (entry) =>
              `- \`[${entry.kind === "slice" ? "Slice" : "Gap"}]\` \`${entry.id}\` - ${entry.title}.`
          )
          .join("\n")
      : "(none planned yet)";

  return `# Roadmap

## Current Position

**Current phase:** ${currentPhase}.

**Current next step:** ${nextAction}

\`${starterId}\` is the starter work item. Stage 1 brief
formation is the next required gate.

## Next Work Item

- \`[Slice]\` \`${starterId}\` - ${title}.

## Planned Work

${plannedSection}

## Completed Work

(none yet)
`;
}

function buildProfileStatus(
  starterId: string,
  title: string,
  currentStage: string,
  nextAction: string
): string {
  return `# Status

## Current Work Item

**Current work item:** \`${starterId}\` - ${title}.

**Current status:** ${currentStage}.

**Next action:** ${nextAction}

**Required operator input:** none_required.

## Last Five Recent Items

1. \`${starterId}\` - ${title} (active).
`;
}

async function seedProfileGovernance(
  repoRoot: string,
  profile: ProjectProfile
) {
  const prefix = profile.workItemPrefix;
  const num = profile.starterWorkItem.number;
  const starterId = `${prefix}-${String(num).padStart(3, "0")}`;
  const { title, currentStage, nextAction } = profile.starterWorkItem;
  const { currentPhase, plannedWork } = profile.roadmapSeed;

  const governanceFiles = [
    { relativePath: "AGENTS.md", contents: STARTER_AGENTS_MD },
    { relativePath: "CONTEXT.md", contents: STARTER_CONTEXT_MD },
    { relativePath: "CLEAN_CODE.md", contents: STARTER_CLEAN_CODE_MD },
    {
      relativePath: "docs/plans/BOOTSTRAP_METHODOLOGY.md",
      contents: STARTER_BOOTSTRAP_METHODOLOGY_MD
    },
    {
      relativePath: "docs/verification/STAGE_RUBRICS.md",
      contents: STARTER_STAGE_RUBRICS_MD
    },
    {
      relativePath: "docs/roadmap/CURRENT_CONTEXT.md",
      contents: buildProfileCurrentContext(
        starterId,
        title,
        currentPhase,
        nextAction,
        currentStage
      )
    },
    {
      relativePath: "docs/roadmap/ROADMAP.md",
      contents: buildProfileRoadmap(
        starterId,
        title,
        currentPhase,
        nextAction,
        plannedWork
      )
    },
    {
      relativePath: "STATUS.md",
      contents: buildProfileStatus(starterId, title, currentStage, nextAction)
    },
    {
      relativePath: `docs/work/${starterId}/brief.md`,
      contents: buildProfileStarterBrief(starterId, title)
    }
  ];

  for (const file of governanceFiles) {
    const destination = path.join(repoRoot, file.relativePath);
    if (await pathExists(destination)) {
      continue;
    }
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.contents, "utf8");
  }

  const readmePath = path.join(repoRoot, "README.md");
  if (await pathExists(readmePath)) {
    const onboardingPath = path.join(repoRoot, "docs/BANDIT_ONBOARDING.md");
    if (!(await pathExists(onboardingPath))) {
      await mkdir(path.dirname(onboardingPath), { recursive: true });
      await writeFile(onboardingPath, STARTER_ONBOARDING_MD, "utf8");
    }
  } else {
    await writeFile(readmePath, STARTER_ONBOARDING_MD, "utf8");
  }
}

const SEED_FILES = [
  ".bandit/policy/smell-triggers.json",
  ".bandit/reviewers/local-qwen.json"
];

// Starter governance artifacts created in a fresh consumer repository so
// `bandit init` followed by `bandit validate`, `bandit cockpit status --json`,
// and `bandit session-context current --json` all succeed on day 1.
//
// The starter content is intentionally consumer-neutral: it does not import
// Bandit's active work history, internal roadmap queue, reviewer evidence, or
// private local assumptions. Each file is written only when missing so
// existing user-owned governance files are preserved.
const STARTER_AGENTS_MD = `# AGENTS.md

Operating instructions for agents working in this Bandit-governed repository.

## Role

The Work Item PM role is held by your operator-selected PM agent. Configured agents and providers carry out routine technical routing decisions: which skill
to use, which agent should run, when work should be split, when review should
escalate, and whether a gate is satisfied. Do not ask the operator to make
ordinary code-safety or model-routing decisions when repo evidence and policy
are sufficient.

Ask the operator for product direction, UAT, business tradeoffs, explicit
cost/risk overrides, policy changes, and genuinely ambiguous scope.

If required operator-owned input is missing, call it out directly and halt the
blocked action. State the exact input needed, why repo artifacts cannot answer
it, and what will happen next after the input is provided.

## Core Workflow

1. Run work through explicit agents, gates, and artifacts.
2. Capture retrospectives, cross-model tension, review outcomes, and smells.
3. Convert lessons into tagged improvement chores or explicit no-action decisions.
4. Evaluate those chores with metrics and baselines.
5. Keep, revise, revert, or double down.

## Default Technical Direction

- CLI authority first.
- Repo-native \`.bandit/\` state is canonical.
- Local Qwen is the baseline adversarial reviewer for every PR.

## Clean-Code And Verification Rule

\`CLEAN_CODE.md\` is mandatory. Read it before every slice. Use
\`docs/verification/STAGE_RUBRICS.md\` to verify each stage. Verifier output
should use the shared verdict values: \`pass\`, \`blocker\`, \`non_blocking\`,
\`not_applicable\`, and \`bootstrap_gap\`.

## Bootstrap Gap Default

Any newly identified bootstrap gap must be recorded in the bootstrap-gap
ledger. Address open gaps before unrelated product work.
`;

const STARTER_CONTEXT_MD = `# Context

This is a consumer-neutral glossary. Replace it with terminology tuned to your
repository as you grow your Bandit governance.

## Language

**Bandit**: A repo-native trust layer for agentic software delivery.

**Agentic Software Delivery**: Software delivery where AI systems perform
planning, editing, review, landing, or maintenance work under explicit trust,
evidence, and operator-boundary contracts.

**Trust Layer**: A CLI-enforced project-portable contract that constrains,
observes, and verifies whether agentic software delivery work can be trusted.

**Workflow Cockpit**: A read-only derived view over Bandit state that exposes
current phase, active work, blockers, gates, and coordination summary without
owning canonical state.

Replace this glossary with the full terminology and history your repository
needs.
`;

const STARTER_CLEAN_CODE_MD = `# CLEAN_CODE.md

Clean code is mandatory in Bandit.

Clean code is code that can be understood, verified, changed, and extended by
someone other than the original author. In an agentic workflow, this matters
even more: unreadable code creates hidden risk, weakens review, and makes
future agents worse.

## Mandatory Slice Rule

Before every slice:

- The Work Item PM must read this file.
- The slice brief must record that \`CLEAN_CODE.md\` was read.
- The spec and acceptance criteria must be shaped so clean-code compliance can
  be evaluated.

Before every slice lands:

- The Work Item PM must perform a clean-code compliance check.
- The landing evidence must answer whether the slice complies with this rubric.
- Any blocker-level clean-code finding must be fixed before landing.
- Any accepted non-blocking clean-code concern must become a tagged improvement
  chore, follow-up, or explicit no-action decision.

## Bandit Clean-Code Rubric

1. **Spec alignment**: code implements the approved spec without redefining
   the product contract.
2. **Small surface area**: the diff is no larger than the slice requires.
3. **Simple design**: the solution uses the simplest structure that satisfies
   the spec.
4. **Explicit state**: workflow state, gates, approvals, and side effects are
   visible in named artifacts or functions.
5. **No hidden authority**: helpers, indexes, and UI do not secretly own
   canonical state.
6. **Testable behavior**: important behavior is covered by tests or a recorded
   bootstrap verification gap.
7. **Readable flow**: a reviewer can follow command paths, state transitions,
   and failure paths without reconstructing intent from chat.
8. **Locality**: related logic lives together; unrelated refactors are
   excluded.
9. **Failure clarity**: refusals, blocked gates, stale evidence, and
   unavailable agents fail closed with clear messages.
10. **No role erosion**: Test Writer, Implementation Writer, Reviewer, Landing
    Agent, and Work Item PM boundaries are preserved.
11. **Improvement capture**: any workflow lesson is converted into a tagged
    improvement chore or explicit no-action decision.
`;

const STARTER_BOOTSTRAP_METHODOLOGY_MD = `# Bootstrap Methodology

## Purpose

This repository uses Bandit's progressive-hardening approach: discipline is
applied manually from the first slice and then converted into CLI commands,
agents, and cockpit views as soon as the shape is stable.

## Core Rule

Do not wait for Bandit to exist before using Bandit discipline.

Every slice should leave durable repo-native evidence:

- Scope and acceptance criteria.
- Test plan or verification plan.
- \`CLEAN_CODE.md\` read evidence.
- Known missing gates.
- Implementation evidence.
- Review and landing evidence.
- Retrospective.
- Improvement chores or explicit no-action decisions.

## Slice Boundary

Every slice must land before the next slice begins. A safe-to-land verdict is
not the same as landed. Landed means a complete landing verdict plus a focused
commit and \`docs/work/<ID>/landing-action.md\` recording the actual landed
commit SHA.

## Build Order

1. Manual policy.
2. Structured artifact.
3. CLI command.
4. Specialized agent or skill.
5. Cockpit view.

## Verification Strategy

Bandit uses three verification layers:

1. Spec-driven verification: the implementation must satisfy the approved
   spec and acceptance criteria.
2. Test-driven verification: important behavior must be covered by tests or an
   explicit bootstrap gap.
3. Rubric-driven verification: the implementation must comply with
   \`CLEAN_CODE.md\` and any applicable workflow rubrics before landing.

## Retrospective Rule

Every slice ends with a retrospective that classifies lessons as:

- Improvement chore.
- Cross-model tension entry.
- Smell catalog update.
- No-action decision.

An actionable lesson without a tagged chore is incomplete.
`;

const STARTER_STAGE_RUBRICS_MD = `# Stage Rubrics

## Purpose

Bandit verification is stage-based. Each stage has a rubric that configured PM roles,
specialized verifiers, and reviewers can use to decide whether work may
proceed.

The goal is not to create ceremony. The goal is to make verification repeatable
enough that agents can enforce it.

## Verdict Values

Use these verdicts consistently:

- \`pass\`: stage satisfies the rubric.
- \`blocker\`: stage cannot proceed or land until fixed.
- \`non_blocking\`: real issue, but safe to proceed with a tagged follow-up or
  improvement chore.
- \`not_applicable\`: stage does not apply and the reason is recorded.
- \`bootstrap_gap\`: final Bandit gate does not exist yet; replacement evidence
  is recorded honestly.

## Stage 0: Context Readiness

**Objective:** Anyone can answer where the project is and what is next.

**Required evidence:**

- \`docs/roadmap/CURRENT_CONTEXT.md\` names current phase, active work, next
  action, blockers, and bootstrap gaps.
- \`docs/roadmap/ROADMAP.md\` maps current, next, planned, and completed work
  with short descriptions only, and labels current/next/planned items as
  \`[Gap]\` or \`[Slice]\`.
- Root \`STATUS.md\` gives the operator a concise current-status view.

**Blockers:**

- Current phase or next action is unclear.
- Active work item cannot be identified.
- \`STATUS.md\` is missing or stale.
- Context must be reconstructed from chat.

## Stage 1: Work-Item Brief And Spec

**Objective:** The work has an explicit contract before implementation starts.

**Required evidence:** goal, scope, out of scope, acceptance criteria, test
plan, \`CLEAN_CODE.md\` read evidence, bootstrap gaps, expected files,
implementation order, operator input status, and forbidden actions.

## Stage 2: Test Design And RED Evidence

**Objective:** Important behavior is covered by tests or recorded bootstrap
gaps before implementation begins.

**Required evidence:** focused tests or verification scripts, RED evidence,
and acceptance mapping.

## Stage 3: Implementation

**Objective:** The minimum source change needed to satisfy the approved spec
lands behind passing tests.

**Required evidence:** implementation evidence, focused test results, and
clean-code self-check.

## Stage 4: Review

**Objective:** Reviewers evaluate the slice before it lands.

**Required evidence:** CodeRabbit, Local Qwen, risk classification,
supply-chain gate, aggregate review evidence, and review-subject hash.

## Stage 5: Landing

**Objective:** The slice lands behind a clean commit and recorded landing
action.

**Required evidence:** landing verdict, \`land-check\`, landing action with
commit SHA, and refreshed review-subject/source-head evidence.

## Stage 6: Retrospective

**Objective:** The slice produces retrospective and improvement/no-action
disposition evidence.

**Required evidence:** retrospective, structured improvement mining, durable
disposition for every lesson, and synchronized routing/status files.
`;

const STARTER_CURRENT_CONTEXT_MD = `# Current Context

## Status

**Phase:** 0 - Consumer Onboarding.

**Current next action:** Complete Stage 1 brief formation for BANDIT-001.

\`BANDIT-001\` is the consumer-neutral starter work item. Stage 1 brief
formation is the next required gate.

## Active Work

**Active work item:** \`BANDIT-001\` - Consumer Onboarding Starter.

The current stage is Stage 1: starter_ready. Do not start Stage 2 test design,
Stage 3 implementation, or unrelated work before the Stage 1 brief is recorded.

## Required Operator Input

No operator-owned input is required for the starter onboarding step.
`;

const STARTER_ROADMAP_MD = `# Roadmap

## Current Position

**Current phase:** Phase 0 - Consumer Onboarding.

**Current next step:** Complete Stage 1 brief formation for BANDIT-001.

\`BANDIT-001\` is the consumer-neutral starter work item. Stage 1 brief
formation is the next required gate.

## Next Work Item

- \`[Slice]\` \`BANDIT-001\` - Consumer Onboarding Starter.

## Planned Work

- \`[Slice]\` \`BANDIT-002\` - TBD.

## Completed Work

(none yet)
`;

const STARTER_STATUS_MD = `# Status

## Current Work Item

**Current work item:** \`BANDIT-001\` - Consumer Onboarding Starter.

**Current status:** Stage 1: starter_ready.

**Next action:** Complete Stage 1 brief formation for BANDIT-001.

**Required operator input:** none_required.

## Last Five Recent Items

1. \`BANDIT-001\` - Consumer Onboarding Starter (active).
`;

const STARTER_STARTER_BRIEF_MD = `# BANDIT-001: Consumer Onboarding Starter

## Status

Starter ready.

## Goal

Provide a consumer-neutral starter work item that \`bandit init\` creates in a
fresh repository so \`bandit validate\`, \`bandit cockpit status --json\`, and
\`bandit session-context current --json\` all succeed on day 1.

## Scope

- Create \`docs/work/BANDIT-001/brief.md\` as a starter work item brief.
- Do not import Bandit's active work history, internal roadmap queue, or
  private local assumptions.
- Preserve any existing user-owned governance files.

## Acceptance Criteria

- The brief exists and parses as a non-closed active work item.
- The brief does not import Bandit's active project state.

## Required Operator Input

No operator-owned input is required.
`;

const STARTER_ONBOARDING_MD = `# Bandit Onboarding

This repository uses [Bandit](https://github.com/pyxe-developer/Bandit), a
repo-native trust layer for agentic software delivery.

## What Bandit Governs

Bandit enforces explicit workflow stages for all agentic work. Every stage
requires durable evidence before it proceeds.

- **Governance strictness**: each stage gate must pass before work advances.
- **Role ownership**: configured agents, providers, and operator-selected role
  owners are declared in \`AGENTS.md\`.
- **Model/provider choices**: your configured providers and local models are set
  by operator-owned decisions recorded in your repository governance files.
- **Local Qwen**: Bandit uses Local Qwen as the baseline adversarial reviewer
  for every PR. Configure your local endpoint in
  \`.bandit/reviewers/local-qwen.json\`.
- **Operator-owned decisions**: product direction, UAT, business tradeoffs,
  cost/risk overrides, and policy changes require explicit operator input.

## Getting Started

Install Bandit as a dev dependency:

\`\`\`sh
npm install -D bandit-workflow
\`\`\`

Initialize Bandit state in this repository:

\`\`\`sh
npx --no-install bandit init
\`\`\`

Validate the initialized state:

\`\`\`sh
npx --no-install bandit validate
\`\`\`

Check the workflow cockpit:

\`\`\`sh
npx --no-install bandit cockpit status --json
\`\`\`
`;

const STARTER_GOVERNANCE_FILES: ReadonlyArray<{
  relativePath: string;
  contents: string;
}> = [
  { relativePath: "AGENTS.md", contents: STARTER_AGENTS_MD },
  { relativePath: "CONTEXT.md", contents: STARTER_CONTEXT_MD },
  { relativePath: "CLEAN_CODE.md", contents: STARTER_CLEAN_CODE_MD },
  {
    relativePath: "docs/plans/BOOTSTRAP_METHODOLOGY.md",
    contents: STARTER_BOOTSTRAP_METHODOLOGY_MD
  },
  {
    relativePath: "docs/verification/STAGE_RUBRICS.md",
    contents: STARTER_STAGE_RUBRICS_MD
  },
  {
    relativePath: "docs/roadmap/CURRENT_CONTEXT.md",
    contents: STARTER_CURRENT_CONTEXT_MD
  },
  { relativePath: "docs/roadmap/ROADMAP.md", contents: STARTER_ROADMAP_MD },
  { relativePath: "STATUS.md", contents: STARTER_STATUS_MD },
  {
    relativePath: "docs/work/BANDIT-001/brief.md",
    contents: STARTER_STARTER_BRIEF_MD
  }
];

async function seedStarterGovernance(repoRoot: string) {
  for (const file of STARTER_GOVERNANCE_FILES) {
    const destination = path.join(repoRoot, file.relativePath);
    if (await pathExists(destination)) {
      continue;
    }
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.contents, "utf8");
  }

  const readmePath = path.join(repoRoot, "README.md");
  if (await pathExists(readmePath)) {
    const onboardingPath = path.join(repoRoot, "docs/BANDIT_ONBOARDING.md");
    if (!(await pathExists(onboardingPath))) {
      await mkdir(path.dirname(onboardingPath), { recursive: true });
      await writeFile(onboardingPath, STARTER_ONBOARDING_MD, "utf8");
    }
  } else {
    await writeFile(readmePath, STARTER_ONBOARDING_MD, "utf8");
  }
}

async function seedDistributionDefaults(repoRoot: string) {
  const packageRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  );

  if (path.resolve(packageRoot) === path.resolve(repoRoot)) {
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
