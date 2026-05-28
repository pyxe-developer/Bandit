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

const operatorPolicyPath = ".bandit/policy/operator-boundary.json";
const operatorTemplatePath = "docs/templates/operator-boundary.md";

test("validate fails closed when the operator boundary policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteOperatorBoundaryEvidence(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/operator-boundary\.json/
  );
});

test("validate fails closed when the operator boundary template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteOperatorBoundaryEvidence(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/operator-boundary\.md/
  );
});

test("operator boundary validation rejects registered decisions without evidence", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteOperatorBoundaryEvidence(repo, { omitEvidence: true });

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required operator-boundary evidence: docs\/operator-boundary\/BANDIT-970-operator-boundary\.json/
  );
});

test("operator boundary validation rejects missing operator-owned gate families", async () => {
  const repo = await createInitializedRepo();
  const policy = completeOperatorBoundaryPolicy();
  policy.operator_blocking_gates = policy.operator_blocking_gates.filter(
    (gate) => gate !== "business_tradeoff"
  );
  await writeCompleteOperatorBoundaryEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /operator_blocking_gates must include business_tradeoff/
  );
});

test("operator boundary validation rejects derivable drift routed to the operator", async () => {
  const repo = await createInitializedRepo();
  const boundary = completeOperatorBoundaryEvidence();
  boundary.operator_escalation = {
    target: "operator",
    missing_operator_input: false,
    rationale: "Projection status disagrees with append-only history."
  };
  await writeCompleteOperatorBoundaryEvidence(repo, { boundary });

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /derivable operational drift projection_mismatch must route to Codex PM or CLI-owned mechanical repair, not operator/
  );
});

test("operator boundary validation rejects missing mechanical repair evidence fields", async () => {
  const repo = await createInitializedRepo();
  const boundary = completeOperatorBoundaryEvidence();
  delete boundary.mechanical_repair.expected_current_state_check;
  await writeCompleteOperatorBoundaryEvidence(repo, { boundary });

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /mechanical repair for BANDIT-970 requires approved source artifacts, observed current state or report hash, expected-current-state check, exact intended repair, immutable transition or lifecycle evidence, and post-repair validation/
  );
});

test("operator boundary validation rejects mechanical repair overreach", async () => {
  const repo = await createInitializedRepo();
  const boundary = completeOperatorBoundaryEvidence();
  boundary.mechanical_repair.overreach_attempts = [
    "grant_uat_or_product_approval"
  ];
  await writeCompleteOperatorBoundaryEvidence(repo, { boundary });

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /mechanical repair cannot grant UAT or product approval/
  );
});

test("operator boundary validation rejects missing operator-boundary smell alignment", async () => {
  const repo = await createInitializedRepo();
  const policy = completeOperatorBoundaryPolicy();
  policy.smell_trigger_alignment = policy.smell_trigger_alignment.filter(
    (smell) => smell !== "BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE"
  );
  await writeCompleteOperatorBoundaryEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /operator-boundary policy must cover smell trigger BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE/
  );
});

test("operator boundary validation accepts a complete low-risk boundary policy", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteOperatorBoundaryEvidence(repo);

  const result = await runBandit(repo, [
    "operator-boundary",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: operatorPolicyPath,
    decisions: ["BANDIT-970"],
    operator_blocking_gates: [
      "product_direction",
      "uat_approval_or_stale_uat",
      "policy_change",
      "business_tradeoff",
      "explicit_cost_or_risk_approval",
      "irreversible_operational_risk_approval",
      "safety_critical_release_authorization",
      "genuinely_ambiguous_scope"
    ],
    drift_routes: ["BANDIT-970:codex_pm_or_cli_mechanical_repair"],
    smell_triggers: [
      "BANDIT-SMELL-OPERATOR-INPUT-BOUNDARY",
      "BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE",
      "BANDIT-SMELL-TECHNICAL-QUESTION-ESCALATION",
      "BANDIT-SMELL-MECHANICAL-REPAIR-OVERREACH"
    ]
  });
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
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

async function writeCompleteOperatorBoundaryEvidence(repo, options = {}) {
  await writeWorkBrief(repo, "BANDIT-970", "Operator Boundary Fixture");

  if (options.omitTemplate) {
    await rm(path.join(repo, operatorTemplatePath), { force: true });
  } else {
    await writeOperatorBoundaryTemplate(repo);
  }

  if (options.omitPolicy) {
    await rm(path.join(repo, operatorPolicyPath), { force: true });
  } else {
    await writeJson(
      repo,
      operatorPolicyPath,
      options.policy ?? completeOperatorBoundaryPolicy()
    );
  }

  if (!options.omitEvidence) {
    await writeJson(
      repo,
      "docs/operator-boundary/BANDIT-970-operator-boundary.json",
      options.boundary ?? completeOperatorBoundaryEvidence()
    );
  }
}

async function writeOperatorBoundaryTemplate(repo) {
  await writeText(
    repo,
    operatorTemplatePath,
    `# Operator Fail-Closed Boundary Template

work_item:
operator_blocking_gates:
codex_owned_technical_decisions:
derivable_operational_drift:
cli_owned_mechanical_repair:
repair_overreach_refusals:
operator_escalation_overuse_smells:
required_evidence:
source_artifacts:
escalation_targets:
evidence_paths:
`
  );
}

function completeOperatorBoundaryPolicy() {
  return {
    contract_version: 1,
    policy_id: "operator-fail-closed-boundary",
    operator_blocking_gates: [
      "product_direction",
      "uat_approval_or_stale_uat",
      "policy_change",
      "business_tradeoff",
      "explicit_cost_or_risk_approval",
      "irreversible_operational_risk_approval",
      "safety_critical_release_authorization",
      "genuinely_ambiguous_scope"
    ],
    codex_owned_technical_decisions: [
      "technical_routing",
      "implementation_mechanics",
      "agent_or_tool_selection",
      "skill_scoping",
      "review_depth",
      "test_strategy",
      "artifact_structure",
      "git_plumbing"
    ],
    derivable_operational_drift: [
      "missing_derivable_metadata",
      "malformed_supported_artifact",
      "registry_or_ledger_drift",
      "projection_mismatch",
      "current_context_or_roadmap_bookkeeping_drift",
      "workflow_status_disagreement"
    ],
    repair_overreach_refusals: [
      "invent_product_scope",
      "grant_uat_or_product_approval",
      "override_policy",
      "resolve_ambiguous_cost_or_risk",
      "approve_spend",
      "perform_irreversible_operational_action",
      "force_resolve_unsafe_claim_recovery",
      "break_dependencies",
      "change_merge_push_deploy_authority"
    ],
    smell_trigger_alignment: [
      "BANDIT-SMELL-OPERATOR-INPUT-BOUNDARY",
      "BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE",
      "BANDIT-SMELL-TECHNICAL-QUESTION-ESCALATION",
      "BANDIT-SMELL-MECHANICAL-REPAIR-OVERREACH"
    ],
    release_authorized_decisions: [
      {
        work_item: "BANDIT-970",
        decision_kind: "operator_boundary",
        evidence_path: "docs/operator-boundary/BANDIT-970-operator-boundary.json"
      }
    ]
  };
}

function completeOperatorBoundaryEvidence() {
  return {
    contract_version: 1,
    work_item: "BANDIT-970",
    boundary_kind: "operator_fail_closed_boundary",
    source_artifacts: [
      "AGENTS.md",
      "CONTEXT.md",
      "docs/work/BANDIT-970/brief.md",
      "docs/verification/STAGE_RUBRICS.md",
      ".bandit/policy/smell-triggers.json"
    ],
    classification: {
      operator_blocking_gate: "none",
      codex_owned_technical_decision: "artifact_structure",
      derivable_operational_drift: "projection_mismatch"
    },
    mechanical_repair: {
      route: "codex_pm_or_cli_mechanical_repair",
      approved_source_artifacts: [
        "docs/work/BANDIT-970/brief.md",
        "docs/roadmap/CURRENT_CONTEXT.md"
      ],
      observed_current_state_or_report_hash: "sha256:projection-mismatch-fixture",
      expected_current_state_check:
        "append-only coordination history records red_recorded while projection reports brief_created",
      exact_intended_repair:
        "recompute projection from approved append-only coordination history",
      atomic_apply_or_no_change: true,
      immutable_transition_or_lifecycle_evidence: ".bandit/events.jsonl",
      post_repair_validation: "npm run bandit -- validate",
      overreach_attempts: []
    },
    operator_escalation: {
      target: "codex_pm",
      missing_operator_input: false,
      rationale:
        "The drift is derivable from approved repo artifacts and does not cross an operator-owned gate."
    },
    repair_overreach_refusals: [
      "invent_product_scope",
      "grant_uat_or_product_approval",
      "override_policy",
      "resolve_ambiguous_cost_or_risk",
      "approve_spend",
      "perform_irreversible_operational_action",
      "force_resolve_unsafe_claim_recovery",
      "break_dependencies",
      "change_merge_push_deploy_authority"
    ],
    smell_dispositions: [
      {
        smell_id: "BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE",
        escalation_target: "codex-pm",
        required_evidence: [
          "operational-drift-evidence",
          "approved-source-artifacts",
          "operator-gate-not-required",
          "mechanical-repair-path"
        ]
      },
      {
        smell_id: "BANDIT-SMELL-TECHNICAL-QUESTION-ESCALATION",
        escalation_target: "codex-pm",
        required_evidence: [
          "codex-owned-technical-decision",
          "repo-evidence",
          "accepted-policy",
          "operator-gate-not-required"
        ]
      },
      {
        smell_id: "BANDIT-SMELL-MECHANICAL-REPAIR-OVERREACH",
        escalation_target: "operator",
        required_evidence: [
          "operator-owned-gate",
          "repair-overreach-evidence",
          "halted-action"
        ]
      }
    ]
  };
}

async function writeJson(repo, relativePath, value) {
  await writeText(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeText(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
