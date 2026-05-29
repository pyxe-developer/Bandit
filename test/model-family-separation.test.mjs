import assert from "node:assert/strict";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
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

const modelFamilyPolicyPath = ".bandit/policy/model-family-separation.json";
const modelFamilyTemplatePath = "docs/templates/model-family-separation.md";

test("validate fails closed when the model-family separation policy is missing", async () => {
  const repo = await createInitializedModelFamilyRepo();
  await writeCompleteModelFamilyFixture(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/model-family-separation\.json/
  );
});

test("validate fails closed when the model-family separation template is missing", async () => {
  const repo = await createInitializedModelFamilyRepo();
  await writeCompleteModelFamilyFixture(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/model-family-separation\.md/
  );
});

test("validate rejects registered model-family decisions without evidence", async () => {
  const repo = await createInitializedModelFamilyRepo();
  await writeCompleteModelFamilyFixture(repo, { omitEvidence: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required model-family separation evidence: docs\/model-family-separation\/BANDIT-990-model-family-separation\.json/
  );
});

test("validate rejects missing Stage 2 Test Writer ownership fields", async () => {
  const repo = await createInitializedModelFamilyRepo();
  const evidence = completeModelFamilyEvidence();
  delete evidence.stage2_red_evidence.test_writer_identity;
  await writeCompleteModelFamilyFixture(repo, { evidence });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Stage 2 RED evidence must record test writer identity, red author model family, material edit status, acceptance mapping owner, and zero Stage 3 test-edit authority/
  );
});

test("validate rejects invalid Stage 2 Test Writer ownership values", async (t) => {
  const cases = [
    ["test_writer_identity", null],
    ["test_writer_identity", ""],
    ["test_writer_identity", "   "],
    ["red_author_model_family", null],
    ["red_author_model_family", ""],
    ["red_author_model_family", "   "],
    ["codex_materially_edited_tests", null],
    ["acceptance_mapping_owner", null],
    ["acceptance_mapping_owner", ""],
    ["acceptance_mapping_owner", "   "],
    ["stage3_test_edit_authority", null],
    ["stage3_test_edit_authority", ""],
    ["stage3_test_edit_authority", "   "]
  ];

  for (const [field, value] of cases) {
    await t.test(`${field}=${JSON.stringify(value)}`, async () => {
      const repo = await createInitializedModelFamilyRepo();
      const evidence = completeModelFamilyEvidence();
      evidence.stage2_red_evidence[field] = value;
      await writeCompleteModelFamilyFixture(repo, { evidence });

      const result = await runBandit(repo, ["validate"]);

      assert.equal(result.code, 1);
      assert.match(
        result.stderr,
        /Stage 2 RED evidence must record test writer identity, red author model family, material edit status, acceptance mapping owner, and zero Stage 3 test-edit authority/
      );
    });
  }
});

test("validate rejects missing or blank Stage 3 model family before routing checks", async (t) => {
  const cases = [undefined, null, "", "   "];

  for (const value of cases) {
    await t.test(`model_family=${JSON.stringify(value)}`, async () => {
      const repo = await createInitializedModelFamilyRepo();
      const evidence = completeModelFamilyEvidence();
      if (value === undefined) {
        delete evidence.stage3_implementation_evidence.model_family;
      } else {
        evidence.stage3_implementation_evidence.model_family = value;
      }
      await writeCompleteModelFamilyFixture(repo, { evidence });

      const result = await runBandit(repo, ["validate"]);

      assert.equal(result.code, 1);
      assert.match(
        result.stderr,
        /Stage 3 implementation evidence must record a non-empty model_family before model-family routing checks/
      );
    });
  }
});

test("validate rejects same-family RED and Stage 3 implementation routing", async () => {
  const repo = await createInitializedModelFamilyRepo();
  const evidence = completeModelFamilyEvidence();
  evidence.stage3_implementation_evidence.model_family = "codex";
  evidence.stage3_implementation_evidence.writer_identity = "codex_pm";
  await writeCompleteModelFamilyFixture(repo, { evidence });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Codex-authored RED evidence requires Stage 3 implementation by a different model family/
  );
});

test("validate rejects non-Claude bootstrap Writer routing after Codex RED evidence", async () => {
  const repo = await createInitializedModelFamilyRepo();
  const evidence = completeModelFamilyEvidence();
  evidence.stage2_red_evidence.stage3_writer_routing = {
    writer_identity: "qwen_process_adapter",
    model_family: "qwen",
    adapter: "process_adapter"
  };
  evidence.stage3_implementation_evidence.writer_identity = "qwen_process_adapter";
  evidence.stage3_implementation_evidence.model_family = "qwen";
  await writeCompleteModelFamilyFixture(repo, { evidence });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Codex-authored bootstrap RED evidence must route Stage 3 implementation to Claude through the Process Adapter path/
  );
});

test("validate rejects Stage 3 Writer edits to test-owned surfaces", async () => {
  const repo = await createInitializedModelFamilyRepo();
  const evidence = completeModelFamilyEvidence();
  evidence.stage3_implementation_evidence.implementation_diff_files.push(
    "test/model-family-separation.test.mjs"
  );
  evidence.stage3_implementation_evidence.writer_touched_test_surfaces = [
    "test/model-family-separation.test.mjs"
  ];
  evidence.stage3_implementation_evidence.test_surface_edit_status = "touched";
  await writeCompleteModelFamilyFixture(repo, { evidence });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Stage 3 Writer touched forbidden test-owned surface: test\/model-family-separation\.test\.mjs/
  );
});

test("validate requires full invalidation and revert before rerun after Writer test edits", async () => {
  const repo = await createInitializedModelFamilyRepo();
  const evidence = completeModelFamilyEvidence();
  evidence.stage3_implementation_evidence.writer_touched_test_surfaces = [
    "docs/work/BANDIT-990/red-evidence.md"
  ];
  evidence.stage3_implementation_evidence.test_surface_edit_status = "touched";
  evidence.invalidation.contaminated_attempt_status = "partial_repair";
  evidence.invalidation.complete_revert_evidence = [];
  await writeCompleteModelFamilyFixture(repo, { evidence });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Writer test-surface edits require invalidating the entire Stage 3 attempt and recording complete revert evidence before rerun/
  );
});

test("validate rejects Claude self-escalation for Claude-authored implementation", async () => {
  const repo = await createInitializedModelFamilyRepo();
  const evidence = completeModelFamilyEvidence();
  evidence.escalation.claude_authored_escalation_target = "claude";
  evidence.escalation.claude_self_review_allowed = true;
  await writeCompleteModelFamilyFixture(repo, { evidence });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Claude-authored implementation escalation must route to Codex PM, not Claude/
  );
});

test("validate accepts complete model-family separation evidence", async () => {
  const repo = await createInitializedModelFamilyRepo();
  await writeCompleteModelFamilyFixture(repo);

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 0, result.stderr);
});

async function createInitializedModelFamilyRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  await copyCommittedDirectory(repo, "docs/evaluation");
  await writeLocalQwenProfile(repo);
  return repo;
}

async function writeCompleteModelFamilyFixture(repo, options = {}) {
  const workItemId = options.workItemId ?? "BANDIT-990";
  await writeWorkBrief(repo, workItemId, "Model-Family Separation Fixture");
  await writeFileAt(repo, `docs/work/${workItemId}/red-evidence.md`, "# RED Evidence\n");
  await writeFileAt(
    repo,
    `docs/work/${workItemId}/implementation-evidence.md`,
    "# Implementation Evidence\n"
  );

  if (options.omitTemplate) {
    await rm(path.join(repo, modelFamilyTemplatePath), { force: true });
  } else {
    await writeModelFamilyTemplate(repo);
  }

  const evidencePath = modelFamilyEvidencePath(workItemId);
  const evidence = options.evidence ?? completeModelFamilyEvidence(workItemId);

  if (!options.omitEvidence) {
    await writeJson(repo, evidencePath, evidence);
  }

  if (options.omitPolicy) {
    await rm(path.join(repo, modelFamilyPolicyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    modelFamilyPolicyPath,
    options.policy ?? completeModelFamilyPolicy(workItemId, evidencePath)
  );
}

function completeModelFamilyPolicy(
  workItemId = "BANDIT-990",
  evidencePath = modelFamilyEvidencePath(workItemId)
) {
  return {
    contract_version: 1,
    policy_id: "bootstrap-model-family-separation",
    bootstrap_stage3_writer: {
      required_after_codex_red: "claude",
      adapter: "process_adapter"
    },
    test_ownership_boundary: {
      stage3_writer_test_surface_authority: "none",
      contaminated_attempt_behavior: "invalidate_and_full_revert_before_rerun",
      forbidden_surface_patterns: [
        "test/**",
        "test/helpers/**",
        "docs/work/*/red-evidence.md",
        "docs/specs/*red-evidence*.json",
        "acceptance-mapping"
      ]
    },
    escalation: {
      claude_authored_implementation_target: "codex_pm",
      claude_self_review_allowed: false
    },
    release_authorized_decisions: [
      {
        work_item: workItemId,
        decision_kind: "model_family_separation",
        evidence_path: evidencePath
      }
    ]
  };
}

function completeModelFamilyEvidence(workItemId = "BANDIT-990") {
  return {
    contract_version: 1,
    work_item: workItemId,
    source_artifacts: [
      "CONTEXT.md",
      "CLEAN_CODE.md",
      "docs/verification/STAGE_RUBRICS.md",
      `docs/work/${workItemId}/brief.md`,
      `docs/work/${workItemId}/red-evidence.md`
    ],
    stage2_red_evidence: {
      test_writer_identity: "codex_pm",
      red_author_model_family: "codex",
      codex_materially_edited_tests: true,
      acceptance_mapping_owner: "test_writer",
      stage3_test_edit_authority: "none",
      stage3_writer_routing: {
        writer_identity: "claude_process_adapter",
        model_family: "claude",
        adapter: "process_adapter"
      }
    },
    stage3_implementation_evidence: {
      writer_identity: "claude_process_adapter",
      model_family: "claude",
      allowed_write_surfaces: [
        ".bandit/policy/model-family-separation.json",
        "docs/templates/model-family-separation.md",
        "src/state/model-family-separation.ts",
        "src/commands/validate.ts",
        "src/commands/cockpit.ts",
        "src/commands/land-check.ts"
      ],
      forbidden_write_surfaces: [
        "test/**",
        "test/helpers/**",
        "docs/work/*/red-evidence.md",
        "docs/specs/*red-evidence*.json",
        "acceptance-mapping"
      ],
      implementation_diff_files: [
        ".bandit/policy/model-family-separation.json",
        "docs/templates/model-family-separation.md",
        "src/state/model-family-separation.ts",
        "src/commands/validate.ts"
      ],
      writer_touched_test_surfaces: [],
      writer_touched_acceptance_mappings: [],
      test_surface_edit_status: "none"
    },
    invalidation: {
      required_when_writer_touches_test_surface: true,
      contaminated_attempt_status: "not_applicable",
      complete_revert_evidence: []
    },
    escalation: {
      claude_authored_escalation_target: "codex_pm",
      claude_self_review_allowed: false,
      pm_disposition_required_for_model_family_or_test_ownership_findings: true
    },
    bootstrap_orchestration_boundary: {
      enforcement: "artifact_and_diff_gate",
      process_adapter_path: true,
      live_true_agent_orchestration_claimed: false
    },
    evidence_paths: [
      modelFamilyPolicyPath,
      modelFamilyTemplatePath,
      modelFamilyEvidencePath(workItemId),
      `docs/work/${workItemId}/red-evidence.md`,
      `docs/work/${workItemId}/implementation-evidence.md`
    ]
  };
}

function modelFamilyEvidencePath(workItemId) {
  return `docs/model-family-separation/${workItemId}-model-family-separation.json`;
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeModelFamilyTemplate(repo) {
  await writeFileAt(
    repo,
    modelFamilyTemplatePath,
    `# Model-Family Separation Template

work_item:
source_artifacts:
stage2_red_evidence:
  test_writer_identity:
  red_author_model_family:
  codex_materially_edited_tests:
  acceptance_mapping_owner:
  stage3_test_edit_authority:
  stage3_writer_routing:
stage3_implementation_evidence:
  writer_identity:
  model_family:
  allowed_write_surfaces:
  forbidden_write_surfaces:
  implementation_diff_files:
  writer_touched_test_surfaces:
  writer_touched_acceptance_mappings:
  test_surface_edit_status:
invalidation:
  contaminated_attempt_status:
  complete_revert_evidence:
escalation:
  claude_authored_escalation_target:
  claude_self_review_allowed:
bootstrap_orchestration_boundary:
`
  );
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}
