import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const ROLE_CONTRACTS_POLICY_PATH = ".bandit/policy/role-contracts.json";

test("role-contracts validation accepts complete governed role contracts", async () => {
  const repo = await createInitializedRepo();
  await writeRoleContractsPolicy(repo);

  const result = await runBandit(repo, [
    "role-contracts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: ROLE_CONTRACTS_POLICY_PATH,
    roles: [
      "repo_pm",
      "work_item_pm",
      "test_writer",
      "implementation_writer",
      "reviewer",
      "landing_agent",
      "closeout_agent"
    ],
    manifest_authority: "append_only_evidence",
    projection_authority: "derived_non_canonical"
  });
});

test("role-contracts validation rejects missing authority fields", async () => {
  const repo = await createInitializedRepo();
  const policy = completeRoleContractsPolicy();
  delete policy.roles[2].authority_boundary;
  delete policy.roles[2].owner;
  await writeRoleContractsPolicy(repo, policy);

  const result = await runBandit(repo, [
    "role-contracts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role contract test_writer requires role_id, version, authority_boundary, allowed_stages, required_inputs, allowed_tools_or_command_families, allowed_write_surface_families, forbidden_actions, required_output_summary, validation_commands, escalation_paths, rollback_or_supersession_rule, and owner/
  );
});

test("role-contracts validation rejects Stage 3 test-surface authority", async () => {
  const repo = await createInitializedRepo();
  const policy = completeRoleContractsPolicy();
  const implementationWriter = policy.roles.find(
    (role) => role.role_id === "implementation_writer"
  );
  implementationWriter.allowed_write_surface_families.push("test_surfaces");
  implementationWriter.forbidden_actions =
    implementationWriter.forbidden_actions.filter(
      (action) => action !== "edit_tests"
    );
  await writeRoleContractsPolicy(repo, policy);

  const result = await runBandit(repo, [
    "role-contracts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /implementation_writer role contract cannot authorize tests, test helpers, fixtures, RED evidence, or acceptance mappings/
  );
});

test("role-contracts validation rejects role authority over canonical workflow state", async () => {
  const repo = await createInitializedRepo();
  const policy = completeRoleContractsPolicy();
  policy.authority_boundary.manifests_can_satisfy_coordination_history = true;
  await writeRoleContractsPolicy(repo, policy);

  const result = await runBandit(repo, [
    "role-contracts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /role contracts and role-run manifests cannot replace coordination history, review evidence, landing evidence, or closeout evidence/
  );
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writeRoleContractsPolicy(repo, policy = completeRoleContractsPolicy()) {
  await writeJson(repo, ROLE_CONTRACTS_POLICY_PATH, policy);
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
