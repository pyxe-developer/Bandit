import assert from "node:assert/strict";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createTempRepo, runBandit, writeWorkBrief } from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

const tokenCostPolicyPath = ".bandit/policy/token-cost-failsafe.json";
const tokenCostTemplatePath = "docs/templates/token-cost-failsafe.md";
const stageCapabilityPolicyPath = ".bandit/policy/stage-capability-scope.json";

test("token-cost-failsafe validation accepts a complete failsafe policy", async () => {
  const repo = await createInitializedTokenCostRepo();
  await writeCompleteTokenCostFixture(repo);

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: tokenCostPolicyPath,
    provider_pricing_evidence: ["provider-pricing-qwen-local"],
    spend_classes: ["benchmark_evaluation"],
    soft_budget_bands: ["deep_review_abnormal_run"],
    recurring_routes: ["stage4-review-paid-escalation"],
    failsafe_triggers: [
      "unexpected_token_growth",
      "repeated_wake_noop",
      "reviewer_runtime_loop",
      "missing_trace_cost_signal",
      "stale_provider_pricing",
      "missing_spend_approval",
      "missing_continuation_decision"
    ],
    continuation_decisions: ["pause", "reroute", "operator_cost_risk_approval"]
  });
});

test("token-cost-failsafe validation rejects stale provider-pricing evidence", async () => {
  const repo = await createInitializedTokenCostRepo();
  const policy = completeTokenCostPolicy();
  delete policy.provider_pricing_evidence[0].freshness_or_expiry_rule;
  await writeCompleteTokenCostFixture(repo, { policy });

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /provider-pricing evidence provider-pricing-qwen-local requires pricing source, captured date, effective date, freshness or expiry rule, expected per-run cost, spend class, and approval owner/
  );
});

test("token-cost-failsafe validation rejects one-off benchmark spend without approval and non-recurring disposition", async () => {
  const repo = await createInitializedTokenCostRepo();
  const policy = completeTokenCostPolicy();
  policy.benchmark_evaluation_spend[0].approval = "missing";
  policy.benchmark_evaluation_spend[0].non_recurring_routing_disposition = "";
  await writeCompleteTokenCostFixture(repo, { policy });

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /one-off benchmark or evaluation spend requires current provider-pricing evidence, expected per-run cost, per-run approval or active spend-class approval, and explicit non-recurring routing disposition/
  );
});

test("token-cost-failsafe validation rejects recurring paid routes without scoped promotion and spend approval", async () => {
  const repo = await createInitializedTokenCostRepo();
  const policy = completeTokenCostPolicy();
  delete policy.recurring_paid_routes[0].promotion_threshold;
  policy.recurring_paid_routes[0].spend_class_approval = "missing";
  await writeCompleteTokenCostFixture(repo, { policy });

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /recurring paid routes require provider-pricing evidence, spend-class approval, scoped promotion threshold, and route applicability/
  );
});

test("token-cost-failsafe validation rejects tight hard caps disguised as soft budget bands", async () => {
  const repo = await createInitializedTokenCostRepo();
  const policy = completeTokenCostPolicy();
  policy.soft_budget_bands[0].budget_mode = "hard_cap";
  policy.soft_budget_bands[0].normal_variance_policy = "stop_immediately";
  await writeCompleteTokenCostFixture(repo, { policy });

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /soft budget bands must be generous abnormal-run failsafes, not tight caps that force repeated failed attempts/
  );
});

test("token-cost-failsafe validation rejects failsafe trips without continuation decisions", async () => {
  const repo = await createInitializedTokenCostRepo();
  const policy = completeTokenCostPolicy();
  policy.failsafe_trips[0].continuation_decision = "missing";
  await writeCompleteTokenCostFixture(repo, { policy });

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /failsafe trips require continue, reroute, pause, stop, or operator-owned cost\/risk approval evidence/
  );
});

test("token-cost-failsafe validation keeps trace cost signals non-canonical", async () => {
  const repo = await createInitializedTokenCostRepo();
  const policy = completeTokenCostPolicy();
  policy.trace_cost_signal_boundary.can_satisfy_required_workflow_artifacts = true;
  await writeCompleteTokenCostFixture(repo, { policy });

  const result = await runBandit(repo, [
    "token-cost-failsafe",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /trace-backed token and cost signals cannot replace canonical workflow artifacts, approvals, landing evidence, UAT, or retrospective evidence/
  );
});

test("work-item create renders token-cost failsafe scope into generated briefs", async () => {
  const repo = await createInitializedTokenCostRepo();
  await writeCompleteTokenCostFixture(repo);
  const specPath = "docs/specs/create-token-cost-chore.json";
  await writeJson(
    repo,
    specPath,
    validChoreSpec({
      token_cost_failsafe: {
        policy: tokenCostPolicyPath,
        soft_budget_bands: ["deep_review_abnormal_run"],
        provider_pricing_evidence: ["provider-pricing-qwen-local"],
        spend_classes: ["benchmark_evaluation"],
        continuation_decisions: ["pause", "reroute"],
        stage_capability_profiles: ["stage4_review"]
      }
    })
  );

  const result = await runBandit(repo, ["work-item", "create", specPath]);

  assert.equal(result.code, 0, result.stderr);
  const brief = await readFile(
    path.join(repo, "docs/work/BANDIT-001/brief.md"),
    "utf8"
  );
  assert.match(brief, /^## Token-Cost Failsafe$/m);
  assert.match(brief, /policy: \.bandit\/policy\/token-cost-failsafe\.json/);
  assert.match(brief, /deep_review_abnormal_run/);
  assert.match(brief, /provider-pricing-qwen-local/);
  assert.match(brief, /stage4_review/);
});

async function createInitializedTokenCostRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  return repo;
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeCompleteTokenCostFixture(repo, options = {}) {
  await writeWorkBrief(repo, "BANDIT-055", "Token-Cost Failsafe");
  await writeFileAt(repo, "docs/work/BANDIT-055/red-evidence.md", "# RED Evidence\n");
  await writeTokenCostTemplate(repo);
  await writeJson(repo, tokenCostPolicyPath, options.policy ?? completeTokenCostPolicy());
  await writeJson(repo, stageCapabilityPolicyPath, completeStageCapabilityPolicy());
}

async function writeTokenCostTemplate(repo) {
  await writeFileAt(
    repo,
    tokenCostTemplatePath,
    `# Token-Cost Failsafe

work_item:
policy:
provider_pricing_evidence:
benchmark_evaluation_spend:
recurring_paid_routes:
soft_budget_bands:
abnormal_run_triggers:
trace_cost_signal_boundary:
continuation_decisions:
stage_capability_profiles:
source_artifacts:
`
  );
}

function completeTokenCostPolicy() {
  return {
    contract_version: 1,
    policy_id: "token-cost-failsafe",
    provider_pricing_evidence: [
      {
        id: "provider-pricing-qwen-local",
        provider: "local-qwen",
        model_or_profile: "local-qwen-baseline",
        pricing_source: "docs/work/BANDIT-055/provider-pricing-evidence.md",
        captured_date: "2026-05-30",
        effective_date: "2026-05-30",
        freshness_or_expiry_rule: "refresh before recurring paid route promotion",
        expected_per_run_cost: "0.00 USD",
        spend_class: "benchmark_evaluation",
        approval_owner: "operator"
      }
    ],
    spend_classes: [
      {
        id: "benchmark_evaluation",
        approval_state: "active_spend_class_approval",
        approval_owner: "operator",
        expected_cost_ceiling: "5.00 USD"
      }
    ],
    benchmark_evaluation_spend: [
      {
        id: "one-off-paid-reviewer-eval",
        provider_pricing_evidence: "provider-pricing-qwen-local",
        expected_per_run_cost: "0.00 USD",
        approval: "active_spend_class_approval",
        non_recurring_routing_disposition: "benchmark_only_no_live_routing"
      }
    ],
    recurring_paid_routes: [
      {
        id: "stage4-review-paid-escalation",
        provider_pricing_evidence: "provider-pricing-qwen-local",
        spend_class_approval: "active_spend_class_approval",
        promotion_threshold: {
          locked_holdout_blocker_recall_improvement_over_qwen: ">= 10 percentage points",
          false_positive_ceiling: "<= 5 percent",
          expected_cost_ceiling: "5.00 USD"
        },
        applies_to_stage_capability_profile: "stage4_review"
      }
    ],
    soft_budget_bands: [
      {
        id: "deep_review_abnormal_run",
        budget_mode: "generous_abnormal_run_failsafe",
        normal_variance_policy: "allow_deep_review_variance",
        trigger_thresholds: {
          unexpected_token_growth_ratio: 3,
          repeated_retry_count: 3,
          repeated_wake_noop_count: 2,
          reviewer_runtime_loop_count: 2
        }
      }
    ],
    abnormal_run_triggers: [
      "unexpected_token_growth",
      "repeated_wake_noop",
      "reviewer_runtime_loop",
      "missing_trace_cost_signal",
      "stale_provider_pricing",
      "missing_spend_approval",
      "missing_continuation_decision"
    ],
    trace_cost_signal_boundary: {
      required_when_available: true,
      authority: "observability_only",
      can_satisfy_required_workflow_artifacts: false,
      can_replace_approvals_or_landing_evidence: false
    },
    failsafe_trips: [
      {
        id: "qwen-loop-token-spike",
        trigger: "unexpected_token_growth",
        trace_source: "docs/agent-observability/BANDIT-055-token-spike.json",
        continuation_decision: "pause",
        continuation_evidence: "docs/work/BANDIT-055/continuation-decision.md"
      }
    ],
    continuation_decisions: ["pause", "reroute", "operator_cost_risk_approval"]
  };
}

function completeStageCapabilityPolicy() {
  return {
    contract_version: 1,
    policy_id: "stage-capability-scope",
    authority_roles: ["test_writer", "writer", "reviewer", "landing_agent"],
    no_new_agent_roles_for_capabilities: true,
    soft_budget_bands: [
      {
        id: "deep_review_abnormal_run",
        purpose: "token-cost abnormal-run failsafe reference",
        continuation_authority: "operator_owned_when_cost_or_risk_changes"
      }
    ],
    stages: [
      {
        stage_id: "stage4_review",
        claimable: true,
        executable: true,
        authority_role: "reviewer",
        required_skills: [
          {
            skill_id: "bandit",
            version: "1.0.0",
            load_bearing: true,
            lifecycle_contract: "bandit@1.0.0"
          }
        ],
        allowed_tools: ["coderabbit-review", "qwen-review"],
        inputs: ["docs/work/<ID>/implementation-evidence.md"],
        outputs: ["docs/work/<ID>/review-evidence.md"],
        evidence: [
          "provider-pricing-evidence-if-paid",
          "spend-class-approval-if-paid",
          "token-cost-failsafe",
          "agent-trace-cost-signal",
          "budget-continuation-decision"
        ],
        forbidden_actions: ["merge", "push", "deploy", "approve_spend"],
        soft_budget_band: "deep_review_abnormal_run",
        token_cost_failsafe: tokenCostPolicyPath
      }
    ]
  };
}

function validChoreSpec(overrides = {}) {
  return {
    kind: "chore",
    title: "Create Token-Cost Failsafe Chore Brief",
    status: "Brief Created",
    non_product_work: "Create one workflow maintenance chore from explicit input.",
    origin: "Token-cost failsafe policy must be explicit before paid or high-token execution.",
    scope: ["Create exactly one chore brief."],
    acceptance_criteria: ["The chore brief renders token-cost failsafe evidence."],
    verification_plan: ["Run focused work-item creation tests."],
    expected_files: ["docs/work/<ID>/brief.md"],
    required_evidence: ["docs/work/<ID>/implementation-evidence.md"],
    operator_input_status: "No operator input is required.",
    stage_capability_scope: {
      policy: stageCapabilityPolicyPath,
      stages: ["stage4_review"],
      authority_roles: ["reviewer"],
      required_skills: ["bandit@1.0.0"],
      forbidden_actions: ["merge", "push", "deploy", "approve_spend"]
    },
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
