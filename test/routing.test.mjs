import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  coderabbitTemplate,
  createTempRepo,
  localQwenTemplate,
  runBandit,
  writeLocalQwenProfile,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

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
evaluation_window:
status:
outcome:
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
  "docs/templates/coderabbit-review.md": coderabbitTemplate
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
        "Required product direction, UAT, policy, business, or cost/risk input is missing.",
      severity: "blocker",
      default_action: "halt_for_operator_input",
      escalation_target: "operator",
      required_evidence: ["operator-input-status"]
    }
  ]
};

test("validate fails closed when the smell trigger catalog is missing", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/smell-triggers\.json/
  );
});

test("validate fails closed when the routing decision template is missing", async () => {
  const repo = await createInitializedRepo({
    omitTemplate: "docs/templates/routing-decision.md"
  });
  await writeSmellCatalog(repo, validSmellCatalog);

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/routing-decision\.md/
  );
});

test("validate fails closed when the smell trigger catalog has duplicate IDs", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, {
    ...validSmellCatalog,
    smells: [validSmellCatalog.smells[0], validSmellCatalog.smells[0]]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Duplicate smell trigger ID: BANDIT-SMELL-ADVERSARIAL-REVIEW/
  );
});

test("validate fails closed when a smell trigger uses an unsupported action", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, {
    ...validSmellCatalog,
    smells: [
      {
        ...validSmellCatalog.smells[0],
        default_action: "ask_operator"
      }
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported smell trigger action: ask_operator/);
});

test("validate fails closed when a routing decision references an unknown smell ID", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);
  await writeWorkBrief(repo, "BANDIT-900", "Routing Fixture", "Ready");
  await writeRoutingDecision(repo, "BANDIT-900", {
    smellIds: ["BANDIT-SMELL-UNKNOWN"]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Unknown smell trigger ID in routing decision: BANDIT-SMELL-UNKNOWN/
  );
});

test("validate fails closed when a routing decision hides missing operator input", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);
  await writeWorkBrief(repo, "BANDIT-901", "Operator Boundary Fixture", "Ready");
  await writeRoutingDecision(repo, "BANDIT-901", {
    smellIds: ["BANDIT-SMELL-OPERATOR-INPUT-BOUNDARY"],
    operatorInputStatus: "required_missing",
    finalDecision: "Proceed with local implementation anyway."
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Routing decision has unresolved operator-owned input: BANDIT-901/
  );
});

test("route prints the recorded routing decision without inferring new policy", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);
  await writeWorkBrief(repo, "BANDIT-902", "Route Output Fixture", "Ready");
  await writeRoutingDecision(repo, "BANDIT-902");

  const result = await runBandit(repo, ["route", "BANDIT-902"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Work item: BANDIT-902/);
  assert.match(result.stdout, /Decision kind: reviewer/);
  assert.match(result.stdout, /Selected route: local-qwen-baseline/);
  assert.match(result.stdout, /BANDIT-SMELL-ADVERSARIAL-REVIEW/);
  assert.match(result.stdout, /Escalation outcome: baseline_only/);
  assert.match(result.stdout, /docs\/work\/BANDIT-902\/brief\.md/);
  assert.match(result.stdout, /Operator input: none_required/);
});

test("route reports usage when the work item ID is omitted", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);

  const result = await runBandit(repo, ["route"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit route <work-item-id>/);
});

test("route fails closed when the work item is unknown", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);

  const result = await runBandit(repo, ["route", "BANDIT-404"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Work item not found: BANDIT-404/);
});

test("route fails closed when the routing decision artifact is missing", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);
  await writeWorkBrief(repo, "BANDIT-903", "Missing Routing Decision", "Ready");

  const result = await runBandit(repo, ["route", "BANDIT-903"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing routing decision artifact: docs\/work\/BANDIT-903\/routing-decision\.md/
  );
});

test("route fails closed when the routing decision references unknown smell IDs", async () => {
  const repo = await createInitializedRepo();
  await writeSmellCatalog(repo, validSmellCatalog);
  await writeWorkBrief(repo, "BANDIT-904", "Unknown Smell Route", "Ready");
  await writeRoutingDecision(repo, "BANDIT-904", {
    smellIds: ["BANDIT-SMELL-UNKNOWN"]
  });

  const result = await runBandit(repo, ["route", "BANDIT-904"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Unknown smell trigger ID in routing decision: BANDIT-SMELL-UNKNOWN/
  );
});

async function createInitializedRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, options);
  await writeLocalQwenProfile(repo);

  return repo;
}

async function writeValidTemplates(optionsRepo, options = {}) {
  for (const [templatePath, content] of Object.entries(validTemplates)) {
    if (templatePath === options.omitTemplate) {
      continue;
    }

    const destination = path.join(optionsRepo, templatePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content, "utf8");
  }
}

async function writeSmellCatalog(repo, catalog) {
  const destination = path.join(repo, ".bandit/policy/smell-triggers.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

async function writeRoutingDecision(repo, workItemId, options = {}) {
  const smellIds =
    options.smellIds ?? ["BANDIT-SMELL-ADVERSARIAL-REVIEW"];
  const evidence = options.evidence ?? [`docs/work/${workItemId}/brief.md`];
  const operatorInputStatus =
    options.operatorInputStatus ?? "none_required";
  const finalDecision =
    options.finalDecision ?? "Use the local Qwen baseline reviewer.";
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "routing-decision.md"),
    `# Routing Decision: ${workItemId}

work_item: ${workItemId}
decision_kind: reviewer
selected_route: local-qwen-baseline
applicable_smell_ids:
${smellIds.map((id) => `  - ${id}`).join("\n")}
evidence_used:
${evidence.map((item) => `  - ${item}`).join("\n")}
operator_input_status: ${operatorInputStatus}
bootstrap_gaps:
  - CodeRabbit automation unavailable during bootstrap.
escalation_outcome: baseline_only
final_decision: ${finalDecision}
`,
    "utf8"
  );
}
