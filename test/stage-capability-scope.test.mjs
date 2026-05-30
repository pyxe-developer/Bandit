import assert from "node:assert/strict";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

const stageCapabilityPolicyPath = ".bandit/policy/stage-capability-scope.json";
const stageCapabilityTemplatePath = "docs/templates/stage-capability-scope.md";

test("stage capability scope validation accepts complete stage declarations", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteStageCapabilityScopeEvidence(repo);

  const result = await runBandit(repo, [
    "stage-capability-scope",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: stageCapabilityPolicyPath,
    stages: [
      "stage2_red_evidence",
      "stage3_implementation",
      "stage4_review",
      "stage5_landing",
      "stage6_retrospective"
    ],
    authority_roles: [
      "test_writer",
      "writer",
      "reviewer",
      "landing_agent",
      "codex_pm"
    ],
    required_skill_contracts: ["bandit@1.0.0"],
    forbidden_actions: [
      "edit_tests",
      "edit_test_helpers",
      "edit_fixtures",
      "edit_red_evidence",
      "edit_acceptance_mappings",
      "merge",
      "push",
      "deploy",
      "edit_installed_global_skill",
      "paid_reviewer_routing",
      "external_service_setup"
    ],
    soft_budget_bands: ["normal_long_running_stage"]
  });
});

test("stage capability scope validation rejects missing required stage fields", async () => {
  const repo = await createInitializedRepo();
  const policy = completeStageCapabilityScopePolicy();
  delete policy.stages[0].authority_role;
  await writeCompleteStageCapabilityScopeEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "stage-capability-scope",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /stage capability scope stage2_red_evidence requires authority_role, required_skills, allowed_tools, inputs, outputs, evidence, and forbidden_actions/
  );
});

test("stage capability scope validation rejects load-bearing skills without lifecycle contracts", async () => {
  const repo = await createInitializedRepo();
  const policy = completeStageCapabilityScopePolicy();
  policy.stages[0].required_skills[0].lifecycle_contract = "";
  await writeCompleteStageCapabilityScopeEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "stage-capability-scope",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /load-bearing skill bandit for stage2_red_evidence requires a skill lifecycle contract reference/
  );
});

test("stage capability scope validation rejects Stage 3 writer test-surface authority", async () => {
  const repo = await createInitializedRepo();
  const policy = completeStageCapabilityScopePolicy();
  policy.stages[1].allowed_tools.push("edit_tests");
  policy.stages[1].forbidden_actions = policy.stages[1].forbidden_actions.filter(
    (action) => action !== "edit_tests"
  );
  await writeCompleteStageCapabilityScopeEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "stage-capability-scope",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Stage 3 Writer capability scope cannot authorize edits to tests, test helpers, fixtures, RED evidence, or acceptance mappings/
  );
});

test("work-item create refuses specs without stage capability scope evidence", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Existing Baseline", "Landed");
  await writeCompleteStageCapabilityScopeEvidence(repo);
  const specPath = "docs/specs/create-chore-without-stage-capability.json";
  await writeJson(repo, specPath, validChoreSpec());

  const result = await runBandit(repo, ["work-item", "create", specPath]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Work item spec missing required field: stage_capability_scope/
  );

  await rm(path.join(repo, "docs/work/BANDIT-002"), {
    force: true,
    recursive: true
  });
});

test("work-item create renders stage capability scope into generated briefs", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteStageCapabilityScopeEvidence(repo);
  const specPath = "docs/specs/create-chore-with-stage-capability.json";
  await writeJson(
    repo,
    specPath,
    validChoreSpec({
      stage_capability_scope: {
        policy: stageCapabilityPolicyPath,
        stages: ["stage2_red_evidence", "stage3_implementation"],
        authority_roles: ["test_writer", "writer"],
        required_skills: ["bandit@1.0.0"],
        forbidden_actions: [
          "edit_tests",
          "edit_test_helpers",
          "edit_fixtures",
          "edit_red_evidence",
          "edit_acceptance_mappings",
          "merge",
          "push",
          "deploy"
        ]
      }
    })
  );

  const result = await runBandit(repo, ["work-item", "create", specPath]);

  assert.equal(result.code, 0, result.stderr);
  const brief = await readFile(
    path.join(repo, "docs/work/BANDIT-001/brief.md"),
    "utf8"
  );
  assert.match(brief, /^## Stage Capability Scope$/m);
  assert.match(brief, /policy: \.bandit\/policy\/stage-capability-scope\.json/);
  assert.match(brief, /stage2_red_evidence/);
  assert.match(brief, /stage3_implementation/);
  assert.match(brief, /edit_acceptance_mappings/);
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  await copyCommittedDirectory(repo, "docs/evaluation");
  await writeLocalQwenProfile(repo);
  return repo;
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeCompleteStageCapabilityScopeEvidence(repo, options = {}) {
  await writeStageCapabilityTemplate(repo);
  await writeJson(
    repo,
    stageCapabilityPolicyPath,
    options.policy ?? completeStageCapabilityScopePolicy()
  );
}

async function writeStageCapabilityTemplate(repo) {
  await writeFileAt(
    repo,
    stageCapabilityTemplatePath,
    `# Stage Capability Scope

work_item:
policy:
stage_id:
authority_role:
required_skills:
allowed_tools:
inputs:
outputs:
evidence:
forbidden_actions:
skill_lifecycle_contracts:
soft_budget_bands:
source_artifacts:
`
  );
}

function completeStageCapabilityScopePolicy() {
  const commonForbiddenActions = [
    "merge",
    "push",
    "deploy",
    "edit_installed_global_skill",
    "paid_reviewer_routing",
    "external_service_setup"
  ];
  const testSurfaceForbiddenActions = [
    "edit_tests",
    "edit_test_helpers",
    "edit_fixtures",
    "edit_red_evidence",
    "edit_acceptance_mappings"
  ];

  return {
    contract_version: 1,
    policy_id: "stage-capability-scope",
    authority_roles: [
      "codex_pm",
      "test_writer",
      "writer",
      "reviewer",
      "landing_agent"
    ],
    no_new_agent_roles_for_capabilities: true,
    soft_budget_bands: [
      {
        id: "normal_long_running_stage",
        purpose: "abnormal-run failsafe metadata only",
        continuation_authority: "operator_owned_when_cost_or_risk_changes"
      }
    ],
    stages: [
      stageDeclaration({
        stage_id: "stage2_red_evidence",
        authority_role: "test_writer",
        allowed_tools: ["node_test", "apply_patch"],
        inputs: ["docs/work/<ID>/brief.md", "CLEAN_CODE.md"],
        outputs: [
          "test/<scope>.test.mjs",
          "docs/work/<ID>/red-evidence.md",
          "docs/specs/<ID>-red-evidence.json"
        ],
        evidence: [
          "RED test command output",
          "acceptance criteria mapping",
          "model-family separation routing"
        ],
        forbidden_actions: commonForbiddenActions
      }),
      stageDeclaration({
        stage_id: "stage3_implementation",
        authority_role: "writer",
        allowed_tools: ["apply_patch", "node_test", "typecheck"],
        inputs: [
          "docs/work/<ID>/brief.md",
          "docs/work/<ID>/red-evidence.md"
        ],
        outputs: [
          "implementation files",
          "docs/work/<ID>/implementation-evidence.md",
          "docs/work/<ID>/writer-report.md"
        ],
        evidence: [
          "focused tests pass",
          "clean-code self-check",
          "writer identity and model family"
        ],
        forbidden_actions: [
          ...testSurfaceForbiddenActions,
          ...commonForbiddenActions
        ]
      }),
      stageDeclaration({
        stage_id: "stage4_review",
        authority_role: "reviewer",
        allowed_tools: [
          "coderabbit-review",
          "qwen-review",
          "review-subject-hash"
        ],
        inputs: [
          "implementation diff",
          "docs/work/<ID>/implementation-evidence.md"
        ],
        outputs: [
          "docs/work/<ID>/coderabbit-review.md",
          "docs/work/<ID>/local-qwen-review.md",
          "docs/work/<ID>/review-evidence.md"
        ],
        evidence: ["CodeRabbit state", "Local Qwen state", "PM disposition"],
        forbidden_actions: [
          "edit_implementation",
          ...testSurfaceForbiddenActions,
          ...commonForbiddenActions
        ]
      }),
      stageDeclaration({
        stage_id: "stage5_landing",
        authority_role: "landing_agent",
        allowed_tools: ["land-check", "land"],
        inputs: [
          "docs/work/<ID>/review-evidence.md",
          "current source head"
        ],
        outputs: [
          "docs/work/<ID>/landing-verdict.md",
          "docs/work/<ID>/landing-action.md"
        ],
        evidence: ["landing verdict", "landing action commit SHA"],
        forbidden_actions: [
          "approve_uat",
          "push",
          "deploy",
          "paid_reviewer_routing",
          "external_service_setup"
        ]
      }),
      stageDeclaration({
        stage_id: "stage6_retrospective",
        authority_role: "codex_pm",
        allowed_tools: ["artifact", "validate", "gaps"],
        inputs: [
          "docs/work/<ID>/landing-action.md",
          "docs/work/<ID>/review-evidence.md"
        ],
        outputs: [
          "docs/work/<ID>/retrospective.md",
          "docs/roadmap/CURRENT_CONTEXT.md",
          "docs/roadmap/ROADMAP.md",
          "STATUS.md"
        ],
        evidence: ["retrospective", "improvement dispositions"],
        forbidden_actions: commonForbiddenActions
      })
    ]
  };
}

function stageDeclaration(overrides) {
  return {
    stage_id: "stage",
    claimable: true,
    executable: true,
    authority_role: "codex_pm",
    required_skills: [
      {
        skill_id: "bandit",
        version: "1.0.0",
        load_bearing: true,
        lifecycle_contract: "bandit@1.0.0"
      }
    ],
    allowed_tools: [],
    inputs: [],
    outputs: [],
    evidence: [],
    forbidden_actions: [],
    soft_budget_band: "normal_long_running_stage",
    ...overrides
  };
}

function validChoreSpec(overrides = {}) {
  return {
    kind: "chore",
    title: "Create Stage-Scoped Chore Brief",
    status: "Brief Created",
    non_product_work: "Create one workflow maintenance chore from explicit input.",
    origin: "Stage Capability Scope must be explicit before executable stages.",
    scope: ["Create exactly one chore brief."],
    acceptance_criteria: [
      "The chore brief renders stage capability scope evidence."
    ],
    verification_plan: ["Run focused work-item creation tests."],
    expected_files: ["docs/work/<ID>/brief.md"],
    required_evidence: ["docs/work/<ID>/implementation-evidence.md"],
    operator_input_status: "No operator input is required.",
    ...overrides
  };
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
