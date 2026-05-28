import assert from "node:assert/strict";
import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  coderabbitTemplate,
  createTempRepo,
  localQwenTemplate,
  runBandit,
  writeLocalQwenProfile
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const committedTemplateRoot = path.join(repoRoot, "docs/templates");

const requiredTemplateFiles = [
  "docs/templates/feature-prd.md",
  "docs/templates/slice.md",
  "docs/templates/chore.md",
  "docs/templates/improvement-chore.md",
  "docs/templates/improvement-evaluation.md",
  "docs/templates/routing-decision.md",
  "docs/templates/review-evidence.md",
  "docs/templates/landing-verdict.md",
  "docs/templates/local-qwen-review.md",
  "docs/templates/coderabbit-review.md",
  "docs/templates/skill-lifecycle-contract.md",
  "docs/templates/coordination-authority.md",
  "docs/templates/operator-boundary.md"
];

const validTemplates = {
  "docs/templates/feature-prd.md": `# Feature PRD Template

## Problem
## User
## Goals
## Non-Goals
## Stories Or Workflows
## Acceptance Criteria
## Out Of Scope
## Test Or Verification Strategy
## Decomposition Notes
`,
  "docs/templates/slice.md": `# Slice Template

## Goal
## Scope
## Out Of Scope
## Acceptance Criteria
## Test Plan
## CLEAN_CODE.md Read Evidence
## Stage-Rubric Checklist
## Bootstrap Gaps
## Expected Files
## First Implementation Order
## Smell Triggers
## Required Evidence
## Operator Input Status
`,
  "docs/templates/chore.md": `# Chore Template

## Non-Product Work
## Origin
## Scope
## Acceptance Criteria
## Verification Plan
## Expected Files
## Required Evidence
## Operator Input Status
`,
  "docs/templates/improvement-chore.md": `# Retrospective-Derived Improvement Chore Template

origin:
source_work_item:
source_artifacts:
lesson:
hypothesis:
metric:
baseline:
expected_direction:
decision_criteria:
minimum_detectable_effect:
uncertainty:
evaluation_window:
reevaluation_window:
proxy_risk:
status:
evaluation_result:
outcome:
`,
  "docs/templates/improvement-evaluation.md": `# Improvement Evaluation Template

candidate_id:
source_artifacts:
metric:
baseline:
observed_metric_evidence:
comparison_to_baseline:
result:
decision:
decision_criteria_comparison:
reevaluation_window:
proxy_risk_disposition:
rationale:
routing_action:
`,
  "docs/templates/routing-decision.md": `# Routing Decision Template

work_item:
decision_kind:
selected_route:
applicable_smell_ids:
evidence_used:
operator_input_status:
bootstrap_gaps:
escalation_outcome:
final_decision:
`,
  "docs/templates/review-evidence.md": `# Review Evidence Template

contract_version:
work_item:
source_head:
verification_state:
verification_evidence:
coderabbit_state:
coderabbit_replacement_evidence:
local_qwen_state:
local_qwen_replacement_evidence:
escalated_review_required:
escalated_review_state:
escalated_review_rationale:
pm_disposition:
pm_disposition_rationale:
non_blocking_findings_routing:
operator_input_status:
uat_status:
clean_code_status:
source_drift_status:
bootstrap_gaps:
`,
  "docs/templates/landing-verdict.md": `# Landing Verdict Template

contract_version:
work_item:
source_head:
review_evidence:
tests_status:
clean_code_status:
coderabbit_state:
local_qwen_state:
escalated_review_state:
uat_status:
source_drift_status:
operator_input_status:
landing_agent_state:
landing_agent_replacement_evidence:
final_verdict:
rationale:
`,
  "docs/templates/local-qwen-review.md": localQwenTemplate,
  "docs/templates/coderabbit-review.md": coderabbitTemplate,
  "docs/templates/skill-lifecycle-contract.md": `# Skill Lifecycle Contract Template

skill_id:
owner:
version:
changelog:
intended_stages:
required_tools:
forbidden_actions:
evaluation_packets:
rollback_criteria:
stage_bindings:
installed_skill_drift:
`,
  "docs/templates/coordination-authority.md": `# Coordination Event Log Authority Template

work_item:
canonical_history:
accepted_workflow_event_families:
actor_event_non_authority:
projection_surfaces:
allowed_mutation_paths:
history_replay:
projection_reconciliation:
claim_authority_exception:
rationale:
evidence_paths:
`,
  "docs/templates/operator-boundary.md": `# Operator Fail-Closed Boundary Template

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
};

const validSmellCatalog = {
  version: 1,
  smells: [
    {
      id: "BANDIT-SMELL-ADVERSARIAL-REVIEW",
      name: "Adversarial Review Required",
      category: "review_gate",
      trigger:
        "A PR or slice requires a baseline adversarial review before landing.",
      severity: "blocker",
      default_action: "require_qwen_review",
      escalation_target: "local-qwen-baseline",
      required_evidence: ["review-evidence.md"]
    },
    {
      id: "BANDIT-SMELL-OPERATOR-INPUT-BOUNDARY",
      name: "Operator Input Boundary",
      category: "operator_boundary",
      trigger:
        "Required product direction, UAT, policy, business, explicit cost/risk, irreversible operational-risk, or genuinely ambiguous scope input is missing.",
      severity: "blocker",
      default_action: "halt_for_operator_input",
      escalation_target: "operator",
      required_evidence: ["operator-input-status"]
    },
    {
      id: "BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE",
      name: "Operator Escalation Overuse",
      category: "operator_boundary",
      trigger:
        "Derivable operational drift is escalated to the operator even though approved repo artifacts determine the intended state.",
      severity: "blocker",
      default_action: "repair_artifact",
      escalation_target: "codex-pm",
      required_evidence: [
        "operational-drift-evidence",
        "approved-source-artifacts",
        "operator-gate-not-required",
        "mechanical-repair-path"
      ]
    },
    {
      id: "BANDIT-SMELL-TECHNICAL-QUESTION-ESCALATION",
      name: "Technical Question Escalation",
      category: "operator_boundary",
      trigger:
        "A workflow asks the operator to decide routine technical routing when repo evidence and accepted policy are sufficient.",
      severity: "blocker",
      default_action: "repair_artifact",
      escalation_target: "codex-pm",
      required_evidence: [
        "codex-owned-technical-decision",
        "repo-evidence",
        "accepted-policy",
        "operator-gate-not-required"
      ]
    },
    {
      id: "BANDIT-SMELL-MECHANICAL-REPAIR-OVERREACH",
      name: "Mechanical Repair Overreach",
      category: "operator_boundary",
      trigger:
        "A mechanical repair path invents product scope, grants approvals, overrides policy, resolves ambiguous cost/risk, performs irreversible operational action, or force-resolves unsafe claim recovery.",
      severity: "blocker",
      default_action: "halt_for_operator_input",
      escalation_target: "operator",
      required_evidence: [
        "operator-owned-gate",
        "repair-overreach-evidence",
        "halted-action"
      ]
    }
  ]
};

test("validate passes for initialized repo-native state with committed work artifact templates", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedTemplates(repo);
  await writeSmellCatalog(repo, validSmellCatalog);
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Bandit state is valid/);
});

test("validate fails closed when config is missing", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await rm(path.join(repo, ".bandit/config.toml"));

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required state: \.bandit\/config\.toml/);
});

test("validate fails closed when config is malformed", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeFile(path.join(repo, ".bandit/config.toml"), "not valid\n");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed config/);
  assert.match(result.stderr, /state_version = 1/);
  assert.match(result.stderr, /work_item_prefix = "BANDIT"/);
});

test("validate fails closed when event log is missing", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await rm(path.join(repo, ".bandit/events.jsonl"));

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required state: \.bandit\/events\.jsonl/);
});

test("validate fails closed when event log contains malformed JSONL", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeFile(path.join(repo, ".bandit/events.jsonl"), "{not-json}\n");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed event log at line 1/);
});

for (const templatePath of requiredTemplateFiles) {
  test(`validate fails closed when ${templatePath} is missing`, async () => {
    const repo = await createTempRepo();
    await runBandit(repo, ["init"]);
    await writeValidTemplates(repo, { omit: templatePath });

    const result = await runBandit(repo, ["validate"]);

    assert.equal(result.code, 1);
    assert.match(
      result.stderr,
      new RegExp(`Missing required template: ${escapeRegExp(templatePath)}`)
    );
  });
}

test("validate fails closed when the Feature PRD template omits required sections", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/feature-prd.md": `# Feature PRD Template

## Problem
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/feature-prd\.md/);
  assert.match(result.stderr, /missing required field: user/);
});

test("validate fails closed when the Slice template omits clean-code evidence", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/slice.md": `# Slice Template

## Goal
## Scope
## Acceptance Criteria
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/slice\.md/);
  assert.match(result.stderr, /missing required field: CLEAN_CODE\.md read evidence/);
});

test("validate fails closed when the Chore template does not distinguish non-product work", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/chore.md": `# Chore Template

## Origin
## Scope
## Acceptance Criteria
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/chore\.md/);
  assert.match(result.stderr, /missing required field: non-product work/);
});

test("validate fails closed when improvement chore metadata is incomplete", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/improvement-chore.md": `# Retrospective-Derived Improvement Chore Template

origin:
lesson:
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/improvement-chore\.md/);
  assert.match(result.stderr, /missing required field: hypothesis/);
  assert.match(result.stderr, /missing required field: metric/);
  assert.match(result.stderr, /missing required field: baseline/);
  assert.match(result.stderr, /missing required field: evaluation_window/);
});

async function copyCommittedTemplates(repo) {
  try {
    await access(committedTemplateRoot);
  } catch (error) {
    if (isMissingPathError(error)) {
      assert.fail("Missing required template directory: docs/templates");
    }
    throw error;
  }

  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });
}

async function writeValidTemplates(repo, options = {}) {
  for (const [templatePath, content] of Object.entries(validTemplates)) {
    if (templatePath === options.omit) {
      await rm(path.join(repo, templatePath), { force: true });
      continue;
    }

    const finalContent = options.override?.[templatePath] ?? content;
    const destination = path.join(repo, templatePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, finalContent, "utf8");
  }
}

async function writeSmellCatalog(repo, catalog) {
  const destination = path.join(repo, ".bandit/policy/smell-triggers.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
