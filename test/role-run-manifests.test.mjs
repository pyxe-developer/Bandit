import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const ROLE_CONTRACTS_POLICY_PATH = ".bandit/policy/role-contracts.json";
const ROLE_RUN_MANIFEST_PATH =
  "docs/role-runs/BANDIT-058/stage3-implementation.json";

test("role-runs validation accepts complete append-only run manifests", async () => {
  const repo = await createRoleRunRepo();
  await writeRoleRunManifest(repo);

  const result = await runBandit(repo, [
    "role-runs",
    "validate",
    "BANDIT-058",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    work_item: "BANDIT-058",
    manifests: [ROLE_RUN_MANIFEST_PATH],
    role_contracts: ROLE_CONTRACTS_POLICY_PATH,
    authority: "append_only_evidence",
    projection_authority: "derived_non_canonical"
  });
});

test("role-runs validation rejects role and stage mismatches", async () => {
  const repo = await createRoleRunRepo();
  const manifest = completeRoleRunManifest();
  manifest.stage = "stage3_implementation";
  manifest.role_contract_ref = {
    role_id: "reviewer",
    version: "1.0.0"
  };
  await writeRoleRunManifest(repo, manifest);

  const result = await runBandit(repo, [
    "role-runs",
    "validate",
    "BANDIT-058",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role-run manifest stage3-implementation references role reviewer, which is not allowed for stage stage3_implementation/
  );
});

test("role-runs validation rejects stale contract versions", async () => {
  const repo = await createRoleRunRepo();
  const manifest = completeRoleRunManifest();
  manifest.role_contract_ref.version = "2.0.0";
  await writeRoleRunManifest(repo, manifest);

  const result = await runBandit(repo, [
    "role-runs",
    "validate",
    "BANDIT-058",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role-run manifest stage3-implementation references stale or missing role contract implementation_writer@2\.0\.0/
  );
});

test("role-runs validation rejects missing source artifacts and base revision", async () => {
  const repo = await createRoleRunRepo();
  const manifest = completeRoleRunManifest();
  manifest.base_revision = "";
  manifest.source_artifacts = [
    "docs/work/BANDIT-058/brief.md",
    "docs/work/BANDIT-058/missing-red-evidence.md"
  ];
  await writeRoleRunManifest(repo, manifest);

  const result = await runBandit(repo, [
    "role-runs",
    "validate",
    "BANDIT-058",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role-run manifest stage3-implementation requires base_revision and existing source artifacts/
  );
});

test("role-runs validation rejects forbidden or out-of-surface target files", async () => {
  const repo = await createRoleRunRepo();
  const manifest = completeRoleRunManifest();
  manifest.allowed_target_files.push("test/role-contracts.test.mjs");
  await writeRoleRunManifest(repo, manifest);

  const result = await runBandit(repo, [
    "role-runs",
    "validate",
    "BANDIT-058",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role-run manifest stage3-implementation target test\/role-contracts\.test\.mjs is outside the implementation_writer contract write surfaces or matches a forbidden pattern/
  );
});

test("role-runs validation rejects manifest authority over canonical state", async () => {
  const repo = await createRoleRunRepo();
  const manifest = completeRoleRunManifest();
  manifest.authority_boundary.can_satisfy_coordination_history = true;
  await writeRoleRunManifest(repo, manifest);

  const result = await runBandit(repo, [
    "role-runs",
    "validate",
    "BANDIT-058",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role-run manifests cannot satisfy coordination history, review evidence, landing evidence, UAT, or retrospective evidence/
  );
});

async function createRoleRunRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  await writeRoleContractsPolicy(repo);
  await writeFileAt(repo, "docs/work/BANDIT-058/brief.md", "# BANDIT-058\n");
  await writeFileAt(
    repo,
    "docs/work/BANDIT-058/red-evidence.md",
    "# RED Evidence\n"
  );
  await writeFileAt(
    repo,
    "docs/work/BANDIT-058/stage3-input-packet.md",
    "# Stage 3 Input Packet\n"
  );
  return repo;
}

async function writeRoleContractsPolicy(repo, policy = completeRoleContractsPolicy()) {
  await writeJson(repo, ROLE_CONTRACTS_POLICY_PATH, policy);
}

async function writeRoleRunManifest(repo, manifest = completeRoleRunManifest()) {
  await writeJson(repo, ROLE_RUN_MANIFEST_PATH, manifest);
}

function completeRoleRunManifest() {
  return {
    contract_version: 1,
    manifest_id: "stage3-implementation",
    work_item_id: "BANDIT-058",
    stage: "stage3_implementation",
    role_contract_ref: {
      role_id: "implementation_writer",
      version: "1.0.0"
    },
    capability_profile: "claude-implementation-writer-stage3",
    subagent_identity: "claude-sonnet-4-6-process-adapter",
    base_revision: "bfd4b95",
    allowed_target_files: [
      "src/state/role-contracts.ts",
      "src/state/role-run-manifests.ts",
      "src/commands/role-contracts.ts",
      "src/commands/role-runs.ts",
      "src/commands/validate.ts",
      "src/cli.ts",
      ".bandit/policy/role-contracts.json",
      "docs/templates/role-contract.md",
      "docs/templates/role-run-manifest.md",
      "docs/work/BANDIT-058/implementation-evidence.md",
      "docs/specs/BANDIT-058-implementation-evidence.json"
    ],
    forbidden_file_patterns: [
      "test/**",
      "docs/work/BANDIT-058/red-evidence.md",
      "docs/specs/BANDIT-058-red-evidence.json"
    ],
    required_input_packet_ref: "docs/work/BANDIT-058/stage3-input-packet.md",
    required_summary_path: "docs/work/BANDIT-058/implementation-evidence.md",
    validation_commands: [
      "node --test test/role-contracts.test.mjs",
      "node --test test/role-run-manifests.test.mjs",
      "npm run typecheck",
      "npm run bandit -- validate"
    ],
    source_artifacts: [
      "docs/work/BANDIT-058/brief.md",
      "docs/work/BANDIT-058/red-evidence.md"
    ],
    authority_boundary: {
      append_only_evidence: true,
      projection_authority: "derived_non_canonical",
      can_satisfy_coordination_history: false,
      can_satisfy_review_or_landing_evidence: false
    }
  };
}

function completeRoleContractsPolicy() {
  return {
    contract_version: 1,
    policy_id: "role-contracts",
    authority_boundary: {
      manifests_are_append_only_evidence: true,
      projections_are_derived_non_canonical: true,
      manifests_can_satisfy_coordination_history: false,
      manifests_can_satisfy_review_or_landing_evidence: false
    },
    roles: [
      roleContract("repo_pm", ["stage1_brief", "formation_review"], [
        "docs/specs/**",
        "docs/work/**/brief.md",
        "docs/work/**/formation-review.md",
        "docs/work/**/coordination-log.jsonl",
        "docs/roadmap/**",
        "STATUS.md",
        ".bandit/bootstrap-gaps.json"
      ]),
      roleContract("work_item_pm", ["stage2_red_evidence"], [
        "docs/work/**/coordination-log.jsonl",
        "docs/roadmap/**",
        "STATUS.md"
      ]),
      roleContract("test_writer", ["stage2_red_evidence"], [
        "test/**",
        "docs/work/**/red-evidence.md",
        "docs/specs/*red-evidence*.json"
      ]),
      roleContract(
        "implementation_writer",
        ["stage3_implementation"],
        [
          "src/**",
          "docs/templates/**",
          ".bandit/policy/role-contracts.json",
          "docs/work/**/implementation-evidence.md",
          "docs/specs/*implementation-evidence*.json"
        ],
        [
          "edit_tests",
          "edit_test_helpers",
          "edit_fixtures",
          "edit_red_evidence",
          "edit_acceptance_mappings"
        ]
      ),
      roleContract("reviewer", ["stage4_review"], [
        "docs/work/**/coderabbit-review.md",
        "docs/work/**/local-qwen-review.md",
        "docs/work/**/review-evidence.md",
        "docs/specs/*coderabbit-review-output*.json"
      ]),
      roleContract("landing_agent", ["stage5_landing"], [
        "docs/work/**/landing-verdict.md",
        "docs/work/**/landing-action.md",
        "docs/specs/*landing-verdict*.json",
        ".bandit/policy/risk-classifications/**",
        ".bandit/policy/supply-chain-gates/**"
      ]),
      roleContract("closeout_agent", ["stage6_retrospective"], [
        "docs/work/**/retrospective.md",
        "docs/specs/*retrospective*.json",
        ".bandit/bootstrap-gaps.json",
        "docs/roadmap/**",
        "STATUS.md"
      ])
    ]
  };
}

function roleContract(
  roleId,
  allowedStages,
  allowedWriteSurfaceFamilies,
  forbiddenActions = ["merge", "push", "deploy", "edit_installed_global_skill"]
) {
  return {
    role_id: roleId,
    version: "1.0.0",
    authority_boundary: `${roleId} may write only its declared stage evidence and cannot replace canonical workflow history.`,
    allowed_stages: allowedStages,
    required_inputs: [
      "approved_brief",
      "current_context",
      "stage_rubric",
      "role_run_manifest"
    ],
    allowed_tools_or_command_families: ["node", "npm", "bandit"],
    allowed_write_surface_families: allowedWriteSurfaceFamilies,
    forbidden_actions: forbiddenActions,
    required_output_summary: `docs/work/<ID>/${roleId}-summary.md`,
    validation_commands: ["npm run bandit -- validate", "git diff --check"],
    escalation_paths: ["codex_pm", "operator_owned_input"],
    rollback_or_supersession_rule:
      "Supersede with a newer versioned contract and keep prior run manifests append-only.",
    owner: "codex_pm"
  };
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, contents) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
}
