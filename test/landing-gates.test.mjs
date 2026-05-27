import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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

const baseTemplates = {
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
workflow_trial:
policy_change:
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
  "docs/templates/coderabbit-review.md": coderabbitTemplate
};

const validSmellCatalog = {
  version: 1,
  smells: [
    {
      id: "BANDIT-SMELL-ADVERSARIAL-REVIEW",
      name: "Adversarial Review Required",
      category: "review_gate",
      trigger: "A PR or slice requires baseline adversarial review.",
      severity: "blocker",
      default_action: "require_qwen_review",
      escalation_target: "local-qwen-baseline",
      required_evidence: ["review-evidence.md"]
    }
  ]
};

const escalatedSmellCatalog = {
  version: 1,
  smells: [
    validSmellCatalog.smells[0],
    {
      id: "BANDIT-SMELL-ESCALATED-REVIEW",
      name: "Escalated Review Required",
      category: "review_gate",
      trigger: "A PR or slice requires stronger review beyond baseline local Qwen.",
      severity: "blocker",
      default_action: "require_escalated_review",
      escalation_target: "escalated-adversarial-placeholder",
      required_evidence: ["escalated-review.md"]
    }
  ]
};

test("validate fails closed when the review evidence template is missing", async () => {
  const repo = await createInitializedRepo({
    omitTemplate: "docs/templates/review-evidence.md"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/review-evidence\.md/
  );
});

test("validate fails closed when the landing verdict template is missing", async () => {
  const repo = await createInitializedRepo({
    omitTemplate: "docs/templates/landing-verdict.md"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/landing-verdict\.md/
  );
});

test("validate fails closed when new-contract review evidence uses an unsupported gate verdict", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-900", "Malformed Review Evidence");
  await writeReviewEvidence(repo, "BANDIT-900", {
    coderabbitState: "clean"
  });
  await writeLandingVerdict(repo, "BANDIT-900");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported CodeRabbit state: clean/);
});

test("validate preserves compatibility for historical work items without new-contract landing artifacts", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-901", "Historical Work Item");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Bandit state is valid/);
});

test("land-check prints recorded gate state and final decision for current evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-902", "Valid Landing Evidence");
  await writeReviewEvidence(repo, "BANDIT-902", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-902", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-902"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Work item: BANDIT-902/);
  assert.match(result.stdout, /Source head: [a-f0-9]+/);
  assert.match(result.stdout, /Current head: [a-f0-9]+/);
  assert.match(result.stdout, /Source drift: current/);
  assert.match(result.stdout, /CodeRabbit: bootstrap_gap/);
  assert.match(result.stdout, /Local Qwen: bootstrap_gap/);
  assert.match(result.stdout, /Escalated review: not_applicable/);
  assert.match(result.stdout, /UAT: not_applicable/);
  assert.match(result.stdout, /Clean code: pass/);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check fails closed when safe-to-land claims passing UAT without approval evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-915", "Missing UAT Approval");
  await writeReviewEvidence(repo, "BANDIT-915", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-915", {
    sourceHead,
    uatStatus: "pass"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-915"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing UAT approval artifact: docs\/work\/BANDIT-915\/uat-approval\.md/
  );
});

test("land-check fails closed when passing UAT evidence is stale", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-916", "Stale UAT Approval");
  await writeReviewEvidence(repo, "BANDIT-916", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-916", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeUatApproval(repo, "BANDIT-916", { sourceHead });
  await writeFile(path.join(repo, "changed-after-uat.txt"), "changed\n", "utf8");
  const currentHead = await commitAll(repo, "Change after UAT");
  await writeReviewEvidence(repo, "BANDIT-916", {
    sourceHead: currentHead,
    uatStatus: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-916", {
    sourceHead: currentHead,
    uatStatus: "pass"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-916"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /UAT approval evidence is stale/);
});

test("land-check accepts current passing UAT approval evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-917", "Current UAT Approval");
  await writeReviewEvidence(repo, "BANDIT-917", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-917", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeUatApproval(repo, "BANDIT-917", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-917"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /UAT: pass/);
  assert.match(
    result.stdout,
    /UAT evidence: docs\/work\/BANDIT-917\/uat-approval\.md/
  );
  assert.match(result.stdout, /UAT environment: staging/);
});

test("validate fails closed for malformed UAT approval metadata", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-918", "Malformed UAT Approval");
  await writeUatApproval(repo, "BANDIT-918", {
    approvalStatus: "accepted"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported UAT approval status: accepted/);
});

test("uat approve fails closed when operator approval inputs are missing", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-919", "Missing UAT Inputs");

  const result = await runBandit(repo, ["uat", "approve", "BANDIT-919"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Usage: bandit uat approve <work-item-id> --environment <name> --approved-by <operator-reference> --notes <approval-notes>/
  );
});

test("uat approve writes approval evidence for the current source head", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-920", "Record UAT Approval");

  const result = await runBandit(repo, [
    "uat",
    "approve",
    "BANDIT-920",
    "--environment",
    "staging",
    "--approved-by",
    "operator:matthew",
    "--notes",
    "Approved checkout workflow."
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(
    result.stdout,
    /UAT approval recorded: docs\/work\/BANDIT-920\/uat-approval\.md/
  );

  const approval = await readFile(
    path.join(repo, "docs/work/BANDIT-920/uat-approval.md"),
    "utf8"
  );
  assert.match(approval, /work_item: BANDIT-920/);
  assert.match(approval, new RegExp(`source_head: ${sourceHead}`));
  assert.match(approval, /environment: staging/);
  assert.match(approval, /approval_status: pass/);
  assert.match(approval, /approved_by: operator:matthew/);
  assert.match(approval, /source_drift_status: current/);
});

test("auto-land-check reports a safe chore as eligible without UAT", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-921", "Eligible Chore");
  await writeReviewEvidence(repo, "BANDIT-921", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-921", { sourceHead });

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-921"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Work item: BANDIT-921/);
  assert.match(result.stdout, /Auto-landing eligibility: eligible/);
  assert.match(result.stdout, /Auto-landing class: chore/);
  assert.match(result.stdout, /UAT requirement: not_applicable/);
});

test("auto-land-check reports a UAT-approved feature slice as eligible", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-922", "Eligible Feature Slice");
  await writeReviewEvidence(repo, "BANDIT-922", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-922", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeUatApproval(repo, "BANDIT-922", { sourceHead });

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-922"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Work item: BANDIT-922/);
  assert.match(result.stdout, /Auto-landing eligibility: eligible/);
  assert.match(result.stdout, /Auto-landing class: feature_slice/);
  assert.match(result.stdout, /UAT requirement: current_pass/);
});

test("auto-land-check blocks feature slices without current UAT approval", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-923", "Missing Feature UAT");
  await writeReviewEvidence(repo, "BANDIT-923", {
    sourceHead,
    uatStatus: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-923", {
    sourceHead,
    uatStatus: "pass"
  });

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-923"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Auto-landing blocked: safe-to-land requires current UAT approval evidence/
  );
});

test("auto-land-check reports usage when the work item ID is omitted", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["auto-land-check"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit auto-land-check <work-item-id>/);
});

test("auto-land-check fails closed when the work item is unknown", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-924"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Auto-landing blocked: Work item not found: BANDIT-924/);
});

test("auto-land-check does not mutate git state or repo artifacts", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-925", "Read Only Eligibility");
  await writeReviewEvidence(repo, "BANDIT-925", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-925", { sourceHead });
  const beforeStatus = await runGit(repo, ["status", "--short"]);
  const beforeHead = await runGit(repo, ["rev-parse", "HEAD"]);

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-925"]);
  const afterStatus = await runGit(repo, ["status", "--short"]);
  const afterHead = await runGit(repo, ["rev-parse", "HEAD"]);

  assert.equal(result.code, 0, result.stderr);
  assert.equal(afterStatus.stdout, beforeStatus.stdout);
  assert.equal(afterHead.stdout, beforeHead.stdout);
});

test("validate fails closed when the Landing Agent contract is missing", async () => {
  const repo = await createInitializedRepo();
  await rm(path.join(repo, ".bandit/policy/landing-agent.json"), { force: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing Landing Agent contract/);
});

test("land records landing action evidence for an eligible chore", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-926", "Landing Agent Eligible Chore");
  await writeReviewEvidence(repo, "BANDIT-926", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-926", { sourceHead });

  const result = await runBandit(repo, [
    "land",
    "BANDIT-926",
    "--action",
    "local-record"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(
    result.stdout,
    /Landing action recorded: docs\/work\/BANDIT-926\/landing-action\.md/
  );
  assert.match(result.stdout, /Action type: local_record/);

  const landingAction = await readFile(
    path.join(repo, "docs/work/BANDIT-926/landing-action.md"),
    "utf8"
  );
  assert.match(landingAction, /# BANDIT-926 Landing Action/);
  assert.match(landingAction, /`landed`/);
  assert.match(landingAction, /local_record/);
  assert.match(landingAction, new RegExp(sourceHead));
});

test("land blocks feature slices without current UAT approval", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-927", "Landing Agent Missing UAT");
  await writeReviewEvidence(repo, "BANDIT-927", {
    sourceHead,
    uatStatus: "pass"
  });
  // The aggregate gate can claim pass only when a current UAT artifact exists.
  await writeLandingVerdict(repo, "BANDIT-927", {
    sourceHead,
    uatStatus: "pass"
  });

  const result = await runBandit(repo, [
    "land",
    "BANDIT-927",
    "--action",
    "local-record"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Landing blocked: safe-to-land requires current UAT approval evidence/
  );
});

test("land blocks a dirty worktree before writing landing evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-928", "Landing Agent Dirty Worktree");
  await writeReviewEvidence(repo, "BANDIT-928", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-928", { sourceHead });
  await writeFile(path.join(repo, "dirty.txt"), "uncommitted\n", "utf8");

  const result = await runBandit(repo, [
    "land",
    "BANDIT-928",
    "--action",
    "local-record"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Landing blocked: worktree is dirty/);
});

test("land refuses unsupported remote or deploy actions", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-929", "Landing Agent Unsupported Action");
  await writeReviewEvidence(repo, "BANDIT-929", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-929", { sourceHead });

  const result = await runBandit(repo, ["land", "BANDIT-929", "--action", "push"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported landing action: push/);
});

test("land refuses unsupported landing options", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["land", "BANDIT-930", "--merge"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported landing option: --merge/);
});

test("validate fails closed when the auto-landing policy artifact is malformed", async () => {
  const repo = await createInitializedRepo();
  await writeAutoLandingPolicy(repo, {
    chores: "yes"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed auto-landing policy/);
});

test("land-check reports usage when the work item ID is omitted", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["land-check"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit land-check <work-item-id>/);
});

test("land-check fails closed when the work item is unknown", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["land-check", "BANDIT-404"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Work item not found: BANDIT-404/);
});

test("land-check fails closed when review evidence is missing", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-903", "Missing Review Evidence");
  await writeLandingVerdict(repo, "BANDIT-903");

  const result = await runBandit(repo, ["land-check", "BANDIT-903"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing review evidence artifact: docs\/work\/BANDIT-903\/review-evidence\.md/
  );
});

test("land-check fails closed when landing verdict evidence is missing", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-904", "Missing Landing Verdict");
  await writeReviewEvidence(repo, "BANDIT-904");

  const result = await runBandit(repo, ["land-check", "BANDIT-904"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing landing verdict artifact: docs\/work\/BANDIT-904\/landing-verdict\.md/
  );
});

test("land-check fails closed when required review gate fields are missing", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-905", "Missing Gate Fields");
  await writeReviewEvidence(repo, "BANDIT-905", {
    omitLine: "coderabbit_state"
  });
  await writeLandingVerdict(repo, "BANDIT-905");

  const result = await runBandit(repo, ["land-check", "BANDIT-905"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Review evidence missing required field: coderabbit_state/);
});

test("land-check fails closed when safe-to-land omits required passing tests", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-906", "Missing Tests");
  await writeReviewEvidence(repo, "BANDIT-906", {
    verificationState: "not_applicable"
  });
  await writeLandingVerdict(repo, "BANDIT-906", {
    testsStatus: "not_applicable"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-906"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /safe-to-land requires tests_status and verification_state pass/
  );
});

test("land-check fails closed when safe-to-land records tests as a bootstrap gap", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-910", "Bootstrap Tests");
  await writeReviewEvidence(repo, "BANDIT-910", {
    verificationState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-910", {
    testsStatus: "bootstrap_gap"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-910"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /safe-to-land requires tests_status and verification_state pass/
  );
});

test("land-check accepts explicit bootstrap gaps with replacement evidence during bootstrap", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-907", "Bootstrap Gap Evidence");
  await writeReviewEvidence(repo, "BANDIT-907");
  await writeLandingVerdict(repo, "BANDIT-907");

  const result = await runBandit(repo, ["land-check", "BANDIT-907"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /CodeRabbit: bootstrap_gap/);
  assert.match(result.stdout, /Local Qwen: bootstrap_gap/);
  assert.match(result.stdout, /Bootstrap gaps:/);
  assert.match(result.stdout, /Manual PM review replaces unavailable final gates/);
});

test("land-check fails closed when routing requires escalated review with no placeholder artifact", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await writeWorkBrief(repo, "BANDIT-911", "Missing Escalated Review Evidence");
  await writeRoutingDecision(repo, "BANDIT-911", {
    selectedRoute: "escalated-adversarial-placeholder",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require escalated adversarial review placeholder evidence."
  });
  await writeReviewEvidence(repo, "BANDIT-911", {
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-911", {
    escalatedReviewState: "bootstrap_gap"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-911"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /safe-to-land requires current escalated review placeholder evidence/
  );
});

test("land-check accepts current escalated review bootstrap-gap placeholder evidence", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-912", "Current Escalated Review Placeholder");
  await writeRoutingDecision(repo, "BANDIT-912", {
    selectedRoute: "escalated-adversarial-placeholder",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require escalated adversarial review placeholder evidence."
  });
  await writeReviewEvidence(repo, "BANDIT-912", {
    sourceHead,
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-912", {
    sourceHead,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeEscalatedReview(repo, "BANDIT-912", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-912"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Escalated review: bootstrap_gap/);
  assert.match(
    result.stdout,
    /Escalated review evidence: docs\/work\/BANDIT-912\/escalated-review\.md/
  );
  assert.match(
    result.stdout,
    /Escalated review profile: escalated-adversarial-placeholder/
  );
});

test("land-check fails closed when escalated review placeholder evidence is stale", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-913", "Stale Escalated Review Placeholder");
  await writeRoutingDecision(repo, "BANDIT-913", {
    selectedRoute: "escalated-adversarial-placeholder",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require escalated adversarial review placeholder evidence."
  });
  await writeReviewEvidence(repo, "BANDIT-913", {
    sourceHead,
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-913", {
    sourceHead,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeEscalatedReview(repo, "BANDIT-913", { sourceHead });
  await writeFile(path.join(repo, "changed.txt"), "changed\n", "utf8");
  await commitAll(repo, "Change after escalated review");

  const result = await runBandit(repo, ["land-check", "BANDIT-913"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Escalated review evidence is stale/);
});

test("land-check leaves escalated review not_applicable when no smell requires it", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-914", "No Escalated Review Required");
  await writeReviewEvidence(repo, "BANDIT-914");
  await writeLandingVerdict(repo, "BANDIT-914");

  const result = await runBandit(repo, ["land-check", "BANDIT-914"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Escalated review: not_applicable/);
  assert.doesNotMatch(result.stdout, /Escalated review evidence:/);
});

test("escalated-review records fixture-backed pass evidence for required escalation", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-942", "Live Escalated Review Fixture");
  await writeRoutingDecision(repo, "BANDIT-942", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-pass.json"
  });
  await mkdir(path.join(repo, "fixtures"), { recursive: true });
  await writeFile(
    path.join(repo, "fixtures/escalated-review-pass.json"),
    JSON.stringify(
      {
        verdict: "pass",
        findings_status: "none",
        summary: "Fixture reviewer found no blockers."
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-942",
    "--fixture",
    "fixtures/escalated-review-pass.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(
    result.stdout,
    /Escalated review recorded: docs\/work\/BANDIT-942\/escalated-review\.md/
  );

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-942/escalated-review.md"),
    "utf8"
  );
  assert.match(evidence, /work_item: BANDIT-942/);
  assert.match(evidence, new RegExp(`source_head: ${sourceHead}`));
  assert.match(evidence, /profile_id: security-reviewer-fixture/);
  assert.match(evidence, /availability_status: available/);
  assert.match(evidence, /reviewer_verdict: pass/);
  assert.match(evidence, /source_drift_status: current/);
});

test("escalated-review fails closed when paid provider setup is not explicitly configured", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-943", "Missing Escalated Review Setup");
  await writeRoutingDecision(repo, "BANDIT-943", {
    selectedRoute: "security-reviewer-paid",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured paid escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-paid",
    provider: "openai",
    model: "o4-mini",
    requireExplicitSetup: true,
    envVar: "BANDIT_ESCALATED_REVIEWER_API_KEY"
  });

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-943"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Escalated reviewer blocked: missing explicit provider setup/
  );
  assert.match(result.stderr, /BANDIT_ESCALATED_REVIEWER_API_KEY/);
  assert.match(
    result.stderr,
    /operator-owned input required: provider setup, credentials, and cost approval/
  );
});

test("escalated-review records blocker fixture evidence and fails closed", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-944", "Escalated Review Blocker");
  await writeRoutingDecision(repo, "BANDIT-944", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-blocker.json"
  });
  await mkdir(path.join(repo, "fixtures"), { recursive: true });
  await writeFile(
    path.join(repo, "fixtures/escalated-review-blocker.json"),
    JSON.stringify(
      {
        verdict: "blocker",
        findings_status: "open",
        summary: "Fixture reviewer found an unresolved trust-boundary bug."
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-944",
    "--fixture",
    "fixtures/escalated-review-blocker.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Escalated reviewer verdict blocks landing: blocker/);

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-944/escalated-review.md"),
    "utf8"
  );
  assert.match(evidence, new RegExp(`source_head: ${sourceHead}`));
  assert.match(evidence, /reviewer_verdict: blocker/);
  assert.match(evidence, /source_drift_status: current/);
});

test("escalated-review records stale fixture evidence and fails closed", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const staleHead = await commitAll(repo, "Initial state");
  await writeFile(path.join(repo, "changed.txt"), "changed\n", "utf8");
  await commitAll(repo, "Change after fixture source");
  await writeWorkBrief(repo, "BANDIT-945", "Stale Escalated Review");
  await writeRoutingDecision(repo, "BANDIT-945", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-stale.json"
  });
  await mkdir(path.join(repo, "fixtures"), { recursive: true });
  await writeFile(
    path.join(repo, "fixtures/escalated-review-stale.json"),
    JSON.stringify(
      {
        source_head: staleHead,
        verdict: "pass",
        findings_status: "none",
        summary: "Fixture reviewer passed an older source head."
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-945",
    "--fixture",
    "fixtures/escalated-review-stale.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Escalated review evidence is stale/);

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-945/escalated-review.md"),
    "utf8"
  );
  assert.match(evidence, new RegExp(`source_head: ${staleHead}`));
  assert.match(evidence, /reviewer_verdict: pass/);
  assert.match(evidence, /source_drift_status: stale/);
});

test("escalated-review records unavailable fixture evidence and fails closed", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-946", "Unavailable Escalated Review");
  await writeRoutingDecision(repo, "BANDIT-946", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-unavailable.json"
  });

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-946",
    "--fixture",
    "fixtures/escalated-review-unavailable.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Escalated reviewer unavailable: fixture not found/);

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-946/escalated-review.md"),
    "utf8"
  );
  assert.match(evidence, /availability_status: unavailable/);
  assert.match(evidence, /reviewer_verdict: blocker/);
  assert.match(evidence, /Fixture provider unavailable: fixture not found/);
});

test("escalated-review records timed-out fixture evidence and fails closed", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-947", "Timed Out Escalated Review");
  await writeRoutingDecision(repo, "BANDIT-947", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-timeout.json"
  });
  await mkdir(path.join(repo, "fixtures"), { recursive: true });
  await writeFile(
    path.join(repo, "fixtures/escalated-review-timeout.json"),
    JSON.stringify(
      {
        provider_status: "timeout",
        verdict: "blocker",
        findings_status: "unavailable",
        summary: "Fixture provider timed out before returning a usable review."
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-947",
    "--fixture",
    "fixtures/escalated-review-timeout.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Escalated reviewer unavailable: provider_timeout/);

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-947/escalated-review.md"),
    "utf8"
  );
  assert.match(evidence, /availability_status: unavailable/);
  assert.match(evidence, /reviewer_verdict: blocker/);
  assert.match(evidence, /Provider unavailable: provider_timeout/);
});

test("escalated-review fails closed on malformed fixture output", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-948", "Malformed Escalated Review");
  await writeRoutingDecision(repo, "BANDIT-948", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-malformed.json"
  });
  await mkdir(path.join(repo, "fixtures"), { recursive: true });
  await writeFile(
    path.join(repo, "fixtures/escalated-review-malformed.json"),
    "{not-json",
    "utf8"
  );

  const result = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-948",
    "--fixture",
    "fixtures/escalated-review-malformed.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed escalated reviewer output/);
  await assert.rejects(
    readFile(path.join(repo, "docs/work/BANDIT-948/escalated-review.md"), "utf8"),
    /ENOENT/
  );
});

test("escalated-review live pass evidence satisfies land-check integration", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-949", "Live Escalated Review Land Check");
  await writeRoutingDecision(repo, "BANDIT-949", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-pass.json"
  });
  await mkdir(path.join(repo, "fixtures"), { recursive: true });
  await writeFile(
    path.join(repo, "fixtures/escalated-review-pass.json"),
    JSON.stringify(
      {
        verdict: "pass",
        findings_status: "none",
        summary: "Fixture reviewer found no blockers."
      },
      null,
      2
    ),
    "utf8"
  );
  await writeReviewEvidence(repo, "BANDIT-949", {
    sourceHead,
    escalatedReviewRequired: true,
    escalatedReviewState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-949", {
    sourceHead,
    escalatedReviewState: "pass"
  });

  const reviewResult = await runBandit(repo, [
    "escalated-review",
    "run",
    "BANDIT-949",
    "--fixture",
    "fixtures/escalated-review-pass.json"
  ]);
  assert.equal(reviewResult.code, 0, reviewResult.stderr);

  const landCheck = await runBandit(repo, ["land-check", "BANDIT-949"]);

  assert.equal(landCheck.code, 0, landCheck.stderr);
  assert.match(landCheck.stdout, /Escalated review: pass/);
  assert.match(
    landCheck.stdout,
    /Escalated review profile: security-reviewer-fixture/
  );
});

test("land-check rejects placeholder escalated evidence when live routing is configured", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-950", "Configured Live Escalation");
  await writeRoutingDecision(repo, "BANDIT-950", {
    selectedRoute: "security-reviewer-fixture",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require configured escalated adversarial review."
  });
  await writeEscalatedReviewerProfile(repo, {
    profileId: "security-reviewer-fixture",
    provider: "fixture",
    fixturePath: "fixtures/escalated-review-pass.json"
  });
  await writeReviewEvidence(repo, "BANDIT-950", {
    sourceHead,
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-950", {
    sourceHead,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeEscalatedReview(repo, "BANDIT-950", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-950"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /safe-to-land requires live escalated review pass for configured reviewer security-reviewer-fixture/
  );
});

test("land-check fails closed when safe-to-land evidence is stale", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-908", "Stale Evidence");
  await writeReviewEvidence(repo, "BANDIT-908", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-908", { sourceHead });
  await writeFile(path.join(repo, "changed.txt"), "changed\n", "utf8");
  await commitAll(repo, "Change after review");

  const result = await runBandit(repo, ["land-check", "BANDIT-908"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Review evidence is stale/);
  assert.match(result.stderr, /safe-to-land cannot proceed with stale source evidence/);
});

test("land-check reports unavailable current head explicitly when Git metadata is absent", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-909", "No Git Metadata");
  await writeReviewEvidence(repo, "BANDIT-909", {
    sourceDriftStatus: "not_applicable"
  });
  await writeLandingVerdict(repo, "BANDIT-909", {
    finalVerdict: "needs-repair",
    sourceDriftStatus: "not_applicable"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-909"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Current head: unavailable/);
  assert.match(result.stdout, /Source drift: not_applicable/);
  assert.match(result.stdout, /Final verdict: needs-repair/);
});

test("land-check accepts terminal Stage 4 after disposition-only evidence updates", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  const implementationHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-931", "Disposition Only Stage 4");
  await writeRoutingDecision(repo, "BANDIT-931", {
    selectedRoute: "escalated-adversarial-placeholder",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require escalated adversarial review placeholder evidence."
  });
  await writeCodeRabbitReview(repo, "BANDIT-931", {
    sourceHead: implementationHead
  });
  await writeLocalQwenReview(repo, "BANDIT-931", {
    sourceHead: implementationHead
  });
  await writeEscalatedReview(repo, "BANDIT-931", {
    sourceHead: implementationHead
  });
  await commitAll(repo, "Stage 4 review accepted implementation");
  await writeFile(
    path.join(repo, "docs/work/BANDIT-931/qwen-disposition.md"),
    "# Qwen Disposition\n\nPM disposition records a procedural finding follow-up.\n",
    "utf8"
  );
  const dispositionHead = await commitAll(repo, "Record PM disposition");
  await writeReviewEvidence(repo, "BANDIT-931", {
    sourceHead: dispositionHead,
    coderabbitState: "pass",
    localQwenState: "pass",
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-931", {
    sourceHead: dispositionHead,
    coderabbitState: "pass",
    localQwenState: "pass",
    escalatedReviewState: "bootstrap_gap"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-931"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check accepts glob Stage 4 disposition-only path patterns", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  await initGitRepo(repo);
  await writeStage4EvidenceHeadPolicy(repo, {
    terminalDispositionOnlyPathPatterns: [
      "glob:docs/work/<work_item_id>/*.md",
      "exact:docs/roadmap/CURRENT_CONTEXT.md",
      "exact:docs/roadmap/ROADMAP.md",
      "exact:.bandit/bootstrap-gaps.json"
    ]
  });
  const implementationHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-938", "Glob Disposition Path");
  await writeRoutingDecision(repo, "BANDIT-938", {
    selectedRoute: "escalated-adversarial-placeholder",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require escalated adversarial review placeholder evidence."
  });
  await writeCodeRabbitReview(repo, "BANDIT-938", {
    sourceHead: implementationHead
  });
  await writeLocalQwenReview(repo, "BANDIT-938", {
    sourceHead: implementationHead
  });
  await writeEscalatedReview(repo, "BANDIT-938", {
    sourceHead: implementationHead
  });
  await commitAll(repo, "Stage 4 review accepted implementation");
  await writeFile(
    path.join(repo, "docs/work/BANDIT-938/qwen-disposition.md"),
    "# Qwen Disposition\n\nPM disposition records a procedural finding follow-up.\n",
    "utf8"
  );
  const dispositionHead = await commitAll(repo, "Record PM disposition");
  await writeReviewEvidence(repo, "BANDIT-938", {
    sourceHead: dispositionHead,
    coderabbitState: "pass",
    localQwenState: "pass",
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-938", {
    sourceHead: dispositionHead,
    coderabbitState: "pass",
    localQwenState: "pass",
    escalatedReviewState: "bootstrap_gap"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-938"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check keeps blocking when implementation source changes after review", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const implementationHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-932", "Source Drift After Review");
  await writeReviewEvidence(repo, "BANDIT-932", {
    sourceHead: implementationHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-932", {
    sourceHead: implementationHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-932", {
    sourceHead: implementationHead
  });
  await commitAll(repo, "Stage 4 review accepted implementation");
  await writeFile(path.join(repo, "src-change.ts"), "export const changed = true;\n");
  await commitAll(repo, "Change implementation after review");

  const result = await runBandit(repo, ["land-check", "BANDIT-932"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen review evidence is stale/);
  assert.match(
    result.stderr,
    /safe-to-land cannot proceed with stale source evidence/
  );
});

test("land-check requires PM rationale for accepted Local Qwen findings", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-933", "Missing PM Finding Rationale");
  await writeReviewEvidence(repo, "BANDIT-933", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-933", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-933", {
    sourceHead,
    findingsStatus: "open",
    findingsDisposition: "Accepted by PM without recorded rationale."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-933"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /PM disposition rationale is required/);
});

test("land-check rejects boilerplate PM rationale markers for Local Qwen findings", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-934", "Boilerplate PM Finding Rationale");
  await writeReviewEvidence(repo, "BANDIT-934", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-934", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-934", {
    sourceHead,
    findingsStatus: "open",
    findingsDisposition: "Rationale: pending"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-934"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /PM disposition rationale is required/);
});

test("land-check accepts concrete PM rationale for Local Qwen findings", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-935", "Concrete PM Finding Rationale");
  await writeReviewEvidence(repo, "BANDIT-935", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-935", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-935", {
    sourceHead,
    findingsStatus: "open",
    findingsDisposition:
      "Accepted because this is a procedural hardening follow-up with no source behavior change."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-935"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check accepts concise concrete PM rationale for Local Qwen findings", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-937", "Concise PM Finding Rationale");
  await writeReviewEvidence(repo, "BANDIT-937", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-937", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-937", {
    sourceHead,
    findingsStatus: "open",
    findingsDisposition: "Accepted because docs only."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-937"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check accepts structured PM rationale for Local Qwen findings", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-939", "Structured PM Finding Rationale");
  await writeReviewEvidence(repo, "BANDIT-939", {
    sourceHead,
    localQwenState: "pass",
    pmDispositionRationale:
      "Codex PM accepted the procedural Local Qwen finding as docs-only follow-up."
  });
  await writeLandingVerdict(repo, "BANDIT-939", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-939", {
    sourceHead,
    findingsStatus: "open",
    findingsDisposition: "Accepted."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-939"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check accepts non-blocking Local Qwen findings with durable routing", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-940", "Non-Blocking Routed Finding");
  await writeReviewEvidence(repo, "BANDIT-940", {
    sourceHead,
    localQwenState: "non_blocking",
    pmDispositionRationale:
      "Codex PM accepted the Local Qwen hardening finding as safe to defer because implementation behavior is accepted and the finding is routed to a durable follow-up.",
    nonBlockingFindingsRouting: [
      "follow_up_chore_candidate: docs/work/BANDIT-022/follow-up-chores.md#heartbeat-gap-next-action-token-mapping"
    ]
  });
  await writeLandingVerdict(repo, "BANDIT-940", {
    sourceHead,
    localQwenState: "non_blocking"
  });
  await writeLocalQwenReview(repo, "BANDIT-940", {
    sourceHead,
    reviewerVerdict: "non_blocking",
    findingsStatus: "open",
    findingsDisposition:
      "Accepted because this is future hardening with durable follow-up routing."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-940"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Local Qwen: non_blocking/);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check blocks non-blocking Local Qwen findings without durable routing", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-941", "Unrouted Non-Blocking Finding");
  await writeReviewEvidence(repo, "BANDIT-941", {
    sourceHead,
    localQwenState: "non_blocking",
    pmDispositionRationale:
      "Codex PM accepted the Local Qwen hardening finding as safe to defer."
  });
  await writeLandingVerdict(repo, "BANDIT-941", {
    sourceHead,
    localQwenState: "non_blocking"
  });
  await writeLocalQwenReview(repo, "BANDIT-941", {
    sourceHead,
    reviewerVerdict: "non_blocking",
    findingsStatus: "open",
    findingsDisposition:
      "Accepted because this is future hardening, but no follow-up routing is recorded."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-941"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /non-blocking review findings require durable follow-up routing/
  );
});

test("land-check keeps blocker Local Qwen findings blocked even with routing", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-942", "Blocking Finding");
  await writeReviewEvidence(repo, "BANDIT-942", {
    sourceHead,
    localQwenState: "blocker",
    pmDispositionRationale:
      "Codex PM cannot route a blocker-level Local Qwen finding as safe to defer.",
    nonBlockingFindingsRouting: [
      "follow_up_chore_candidate: docs/work/BANDIT-022/follow-up-chores.md#heartbeat-gap-next-action-token-mapping"
    ]
  });
  await writeLandingVerdict(repo, "BANDIT-942", {
    sourceHead,
    localQwenState: "blocker"
  });
  await writeLocalQwenReview(repo, "BANDIT-942", {
    sourceHead,
    reviewerVerdict: "blocker",
    findingsStatus: "open",
    findingsDisposition:
      "Blocking behavior risk cannot be deferred to a follow-up chore."
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-942"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen reviewer verdict blocks landing: blocker/);
});

test("land-check fails closed when review changed paths cannot be resolved", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Implementation accepted");
  await writeWorkBrief(repo, "BANDIT-936", "Missing Review Base");
  await writeReviewEvidence(repo, "BANDIT-936", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-936", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-936", {
    sourceHead: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-936"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Local Qwen review changed-path check failed: missing_base_revision/
  );
  assert.match(result.stderr, /Local Qwen review evidence is stale/);
  assert.match(
    result.stderr,
    /safe-to-land cannot proceed with stale source evidence/
  );
});

test("land-check reports shallow repository changed-path failures explicitly", async () => {
  const origin = await createInitializedRepo();
  await initGitRepo(origin);
  const missingBaseHead = await commitAll(origin, "Implementation accepted");
  await writeFile(path.join(origin, "implementation-change.txt"), "changed\n");
  const currentHead = await commitAll(origin, "Change after implementation");
  const shallowRepo = await createTempRepo();
  await rm(shallowRepo, { recursive: true, force: true });
  await runGit(path.dirname(shallowRepo), [
    "clone",
    "--depth",
    "1",
    `file://${origin}`,
    shallowRepo
  ]);
  await writeWorkBrief(
    shallowRepo,
    "BANDIT-940",
    "Shallow Changed Path Diagnostics"
  );
  await writeReviewEvidence(shallowRepo, "BANDIT-940", {
    sourceHead: currentHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(shallowRepo, "BANDIT-940", {
    sourceHead: currentHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(shallowRepo, "BANDIT-940", {
    sourceHead: missingBaseHead
  });

  const result = await runBandit(shallowRepo, ["land-check", "BANDIT-940"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Local Qwen review changed-path check failed: missing_base_revision_shallow_repository/
  );
  assert.match(result.stderr, /Local Qwen review evidence is stale/);
});

test("land-check reuses git repository state while classifying changed-path failures", async () => {
  const repo = await createInitializedRepo({
    smellCatalog: escalatedSmellCatalog
  });
  const fakeGitDir = await createTempRepo();
  const fakeGitLog = path.join(fakeGitDir, "git-args.log");
  const currentHead = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  const missingBaseHead = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const fakeGitPath = path.join(fakeGitDir, "git");
  await writeFile(
    fakeGitPath,
    `#!/usr/bin/env node
const { appendFileSync } = require("node:fs");
const args = process.argv.slice(2);
appendFileSync(process.env.FAKE_GIT_LOG, args.join(" ") + "\\n");
if (args[0] === "rev-parse" && args[1] === "HEAD") {
  process.stdout.write(process.env.FAKE_CURRENT_HEAD + "\\n");
  process.exit(0);
}
if (args[0] === "diff") {
  process.stderr.write("fatal: bad object ${missingBaseHead}\\n");
  process.exit(128);
}
if (args[0] === "config" && args[1] === "--get-regexp") {
  process.exit(1);
}
if (args[0] === "rev-parse" && args[1] === "--is-shallow-repository") {
  process.stdout.write("false\\n");
  process.exit(0);
}
process.stderr.write("unexpected fake git call: " + args.join(" ") + "\\n");
process.exit(1);
`,
    { encoding: "utf8", mode: 0o755 }
  );
  await chmod(fakeGitPath, 0o755);
  await writeWorkBrief(repo, "BANDIT-941", "Changed Path Probe Reuse");
  await writeRoutingDecision(repo, "BANDIT-941", {
    selectedRoute: "escalated-adversarial-placeholder",
    smellIds: ["BANDIT-SMELL-ESCALATED-REVIEW"],
    escalationOutcome: "require_escalated_review",
    finalDecision: "Require escalated adversarial review placeholder evidence."
  });
  await writeReviewEvidence(repo, "BANDIT-941", {
    sourceHead: currentHead,
    coderabbitState: "pass",
    localQwenState: "pass",
    escalatedReviewRequired: true,
    escalatedReviewState: "bootstrap_gap"
  });
  await writeLandingVerdict(repo, "BANDIT-941", {
    sourceHead: currentHead,
    coderabbitState: "pass",
    localQwenState: "pass",
    escalatedReviewState: "bootstrap_gap"
  });
  await writeCodeRabbitReview(repo, "BANDIT-941", {
    sourceHead: missingBaseHead
  });
  await writeLocalQwenReview(repo, "BANDIT-941", {
    sourceHead: missingBaseHead
  });
  await writeEscalatedReview(repo, "BANDIT-941", {
    sourceHead: missingBaseHead
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-941"], {
    env: {
      PATH: `${fakeGitDir}${path.delimiter}${process.env.PATH}`,
      FAKE_CURRENT_HEAD: currentHead,
      FAKE_GIT_LOG: fakeGitLog
    }
  });
  const gitCalls = await readFile(fakeGitLog, "utf8");
  const promisorProbeCount = gitCalls
    .split("\n")
    .filter((line) => line.startsWith("config --get-regexp")).length;
  const shallowProbeCount = gitCalls
    .split("\n")
    .filter((line) => line === "rev-parse --is-shallow-repository").length;

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /CodeRabbit review changed-path check failed: missing_base_revision/
  );
  assert.match(
    result.stderr,
    /Local Qwen review changed-path check failed: missing_base_revision/
  );
  assert.match(
    result.stderr,
    /Escalated review changed-path check failed: missing_base_revision/
  );
  assert.equal(promisorProbeCount, 1);
  assert.equal(shallowProbeCount, 1);
});

test("land-check accepts evidence-only head changes when review subject hash matches", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await mkdir(path.join(repo, "src"), { recursive: true });
  await writeFile(path.join(repo, "src/review-subject.ts"), "export const value = 1;\n");
  await writeWorkBrief(repo, "BANDIT-960", "Review Subject Hash Freshness");
  const reviewedHead = await commitAll(repo, "Implementation accepted");
  const hash = await runBandit(repo, ["review-subject-hash", "BANDIT-960"]);
  const reviewSubjectHash = readReviewSubjectHash(hash.stdout);
  await writeReviewEvidence(repo, "BANDIT-960", {
    sourceHead: reviewedHead,
    reviewSubjectHash,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-960", {
    sourceHead: reviewedHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-960", { sourceHead: reviewedHead });
  await writeFile(
    path.join(repo, "docs/work/BANDIT-960/retrospective.md"),
    "# Retrospective\n\nEvidence-only closeout.\n",
    "utf8"
  );
  await commitAll(repo, "Evidence-only closeout");

  const result = await runBandit(repo, ["land-check", "BANDIT-960"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

test("land-check fails closed when review subject hash changes after source edits", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await mkdir(path.join(repo, "src"), { recursive: true });
  await writeFile(path.join(repo, "src/review-subject.ts"), "export const value = 1;\n");
  await writeWorkBrief(repo, "BANDIT-961", "Review Subject Hash Source Drift");
  const reviewedHead = await commitAll(repo, "Implementation accepted");
  const hash = await runBandit(repo, ["review-subject-hash", "BANDIT-961"]);
  const reviewSubjectHash = readReviewSubjectHash(hash.stdout);
  await writeReviewEvidence(repo, "BANDIT-961", {
    sourceHead: reviewedHead,
    reviewSubjectHash,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-961", {
    sourceHead: reviewedHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-961", { sourceHead: reviewedHead });
  await writeFile(path.join(repo, "src/review-subject.ts"), "export const value = 2;\n");
  await commitAll(repo, "Implementation changed after review");

  const result = await runBandit(repo, ["land-check", "BANDIT-961"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Review subject hash is stale/);
  assert.match(result.stderr, /safe-to-land cannot proceed with stale source evidence/);
});

test("land-check fails closed when review subject hash changes after policy edits", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await writeWorkBrief(repo, "BANDIT-962", "Review Subject Hash Policy Drift");
  const reviewedHead = await commitAll(repo, "Implementation accepted");
  const hash = await runBandit(repo, ["review-subject-hash", "BANDIT-962"]);
  const reviewSubjectHash = readReviewSubjectHash(hash.stdout);
  await writeReviewEvidence(repo, "BANDIT-962", {
    sourceHead: reviewedHead,
    reviewSubjectHash,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-962", {
    sourceHead: reviewedHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-962", { sourceHead: reviewedHead });
  await writeStage4EvidenceHeadPolicy(repo, {
    terminalDispositionOnlyPathPatterns: ["docs/work/<work_item_id>/"]
  });
  await commitAll(repo, "Review policy changed after review");

  const result = await runBandit(repo, ["land-check", "BANDIT-962"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Review subject hash is stale/);
});

test("land-check accepts reviewer evidence heads when final review subject hash matches", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await writeFile(path.join(repo, "CONTEXT.md"), "# Context\n\nInitial vocabulary.\n", "utf8");
  await writeWorkBrief(repo, "BANDIT-963", "Review Subject Hash Reviewer Freshness");
  const reviewedHead = await commitAll(repo, "Implementation accepted");
  await writeLocalQwenReview(repo, "BANDIT-963", { sourceHead: reviewedHead });
  await writeFile(
    path.join(repo, "CONTEXT.md"),
    "# Context\n\nReview subject hash vocabulary update.\n",
    "utf8"
  );
  const hash = await runBandit(repo, ["review-subject-hash", "BANDIT-963"]);
  const reviewSubjectHash = readReviewSubjectHash(hash.stdout);
  await writeReviewEvidence(repo, "BANDIT-963", {
    sourceHead: reviewedHead,
    reviewSubjectHash,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-963", {
    sourceHead: reviewedHead,
    localQwenState: "pass"
  });
  await commitAll(repo, "Hash-based review evidence closeout");

  const result = await runBandit(repo, ["land-check", "BANDIT-963"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Final verdict: safe-to-land/);
});

async function createInitializedRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeTemplates(repo, options);
  await writeLocalQwenProfile(repo);
  await writeSmellCatalog(repo, options.smellCatalog ?? validSmellCatalog);
  await writeLandingAgentContract(repo);

  return repo;
}

function readReviewSubjectHash(output) {
  const match = output.match(/^Review subject hash: ([a-f0-9]{64})$/m);
  assert.ok(match, output);
  return match[1];
}

async function writeTemplates(repo, options = {}) {
  for (const [templatePath, content] of Object.entries(baseTemplates)) {
    if (templatePath === options.omitTemplate) {
      continue;
    }

    const destination = path.join(repo, templatePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content, "utf8");
  }
}

async function writeSmellCatalog(repo, catalog) {
  const destination = path.join(repo, ".bandit/policy/smell-triggers.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

async function writeAutoLandingPolicy(repo, overrides = {}) {
  const policy = {
    version: 1,
    require_safe_to_land: true,
    require_current_source: true,
    allow_chores: true,
    allow_feature_slices_with_current_uat: true,
    perform_merge: false,
    ...overrides
  };
  const destination = path.join(repo, ".bandit/policy/auto-landing.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

async function writeStage4EvidenceHeadPolicy(repo, overrides = {}) {
  const policy = {
    version: 1,
    terminalDispositionOnlyPathPatterns: [
      "docs/work/<work_item_id>/",
      "docs/roadmap/CURRENT_CONTEXT.md",
      "docs/roadmap/ROADMAP.md",
      ".bandit/bootstrap-gaps.json"
    ],
    ...overrides
  };
  const destination = path.join(repo, ".bandit/policy/stage4-evidence-head.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

async function writeLandingAgentContract(repo, overrides = {}) {
  const contract = {
    version: 1,
    authority: "cli_owned_landing_agent",
    supported_actions: ["local_record"],
    cli_actions: ["local-record"],
    require_auto_land_eligible: true,
    require_clean_worktree: true,
    allowed_dirty_paths: ["docs/work/<work_item_id>/"],
    write_landing_action: true,
    allow_merge: false,
    allow_push: false,
    allow_deploy: false,
    operator_owned_boundaries: [
      "product_uat",
      "policy_change",
      "business_tradeoff",
      "cost_override",
      "risk_override"
    ],
    ...overrides
  };
  const destination = path.join(repo, ".bandit/policy/landing-agent.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
}

async function writeReviewEvidence(repo, workItemId, options = {}) {
  const nonBlockingFindingsRouting =
    options.nonBlockingFindingsRouting?.map((entry) => `  - ${entry}`) ?? [];
  const contentLines = [
    `# Review Evidence: ${workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${workItemId}`,
    `source_head: ${options.sourceHead ?? "unknown"}`,
    options.reviewSubjectHash
      ? `review_subject_hash: ${options.reviewSubjectHash}`
      : null,
    `verification_state: ${options.verificationState ?? "pass"}`,
    "verification_evidence:",
    "  - node --test test/landing-gates.test.mjs",
    `coderabbit_state: ${options.coderabbitState ?? "bootstrap_gap"}`,
    "coderabbit_replacement_evidence:",
    "  - Manual PM review replaces unavailable final gates during bootstrap.",
    `local_qwen_state: ${options.localQwenState ?? "bootstrap_gap"}`,
    "local_qwen_replacement_evidence:",
    "  - Local Qwen runtime is unavailable during bootstrap.",
    `escalated_review_required: ${options.escalatedReviewRequired ?? false}`,
    `escalated_review_state: ${options.escalatedReviewState ?? "not_applicable"}`,
    `escalated_review_rationale: ${options.escalatedReviewRationale ?? "No smell trigger requires escalation beyond the baseline bootstrap gap."}`,
    "pm_disposition: pass",
    options.pmDispositionRationale
      ? `pm_disposition_rationale: ${options.pmDispositionRationale}`
      : null,
    nonBlockingFindingsRouting.length > 0
      ? "non_blocking_findings_routing:"
      : null,
    ...nonBlockingFindingsRouting,
    "operator_input_status: none_required",
    `uat_status: ${options.uatStatus ?? "not_applicable"}`,
    "clean_code_status: pass",
    `source_drift_status: ${options.sourceDriftStatus ?? "current"}`,
    "bootstrap_gaps:",
    "  - Manual PM review replaces unavailable final gates during bootstrap."
  ].filter(
    (line) => line !== null && !line.startsWith(`${options.omitLine}:`)
  );

  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "review-evidence.md"),
    `${contentLines.join("\n")}\n`,
    "utf8"
  );
}

async function writeLandingVerdict(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "landing-verdict.md"),
    `# Landing Verdict: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
review_evidence: docs/work/${workItemId}/review-evidence.md
tests_status: ${options.testsStatus ?? "pass"}
clean_code_status: pass
coderabbit_state: ${options.coderabbitState ?? "bootstrap_gap"}
local_qwen_state: ${options.localQwenState ?? "bootstrap_gap"}
escalated_review_state: ${options.escalatedReviewState ?? "not_applicable"}
uat_status: ${options.uatStatus ?? "not_applicable"}
source_drift_status: ${options.sourceDriftStatus ?? "current"}
operator_input_status: none_required
landing_agent_state: bootstrap_gap
landing_agent_replacement_evidence:
  - Manual PM review replaces unavailable final gates during bootstrap.
final_verdict: ${options.finalVerdict ?? "safe-to-land"}
rationale: Evidence is explicit and unavailable final gates are recorded as bootstrap gaps.
`,
    "utf8"
  );
}

async function writeCodeRabbitReview(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "coderabbit-review.md"),
    `# CodeRabbit Review: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
provider: coderabbit
review_target: pull_request
review_state: ${options.reviewState ?? "completed"}
coderabbit_verdict: ${options.coderabbitVerdict ?? "pass"}
findings_status: ${options.findingsStatus ?? "none"}
findings_disposition: ${options.findingsDisposition ?? "no unresolved CodeRabbit findings"}
operator_input_status: none_required
source_drift_status: ${options.sourceDriftStatus ?? "current"}
executable_evidence:
  - coderabbit-review command exited 0 using fixture evidence.
bootstrap_gaps:
  - none
`,
    "utf8"
  );
}

async function writeLocalQwenReview(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "local-qwen-review.md"),
    `# Local Qwen Review: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
profile_id: local-qwen-baseline
runtime: command
model: fixture-qwen
run_status: ${options.runStatus ?? "completed"}
reviewer_verdict: ${options.reviewerVerdict ?? "pass"}
findings_status: ${options.findingsStatus ?? "none"}
findings_disposition: ${options.findingsDisposition ?? "no unresolved findings"}
operator_input_status: none_required
source_drift_status: ${options.sourceDriftStatus ?? "current"}
executable_evidence:
  - qwen-review command exited 0 using fixture reviewer.
bootstrap_gaps:
  - none
`,
    "utf8"
  );
}

async function writeUatApproval(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "uat-approval.md"),
    `# UAT Approval: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
environment: ${options.environment ?? "staging"}
approval_status: ${options.approvalStatus ?? "pass"}
approved_by: ${options.approvedBy ?? "operator:matthew"}
approved_at: ${options.approvedAt ?? "2026-05-24T12:00:00.000Z"}
source_drift_status: ${options.sourceDriftStatus ?? "current"}
notes: ${options.notes ?? "Operator approved the named environment."}
`,
    "utf8"
  );
}

async function writeRoutingDecision(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "routing-decision.md"),
    `# Routing Decision: ${workItemId}

work_item: ${workItemId}
decision_kind: reviewer
selected_route: ${options.selectedRoute ?? "local-qwen-baseline"}
applicable_smell_ids:
${(options.smellIds ?? ["BANDIT-SMELL-ADVERSARIAL-REVIEW"]).map((id) => `  - ${id}`).join("\n")}
evidence_used:
  - docs/work/${workItemId}/brief.md
operator_input_status: none_required
bootstrap_gaps:
  - Live escalated reviewer integration is unavailable during bootstrap.
escalation_outcome: ${options.escalationOutcome ?? "require_qwen_review"}
final_decision: ${options.finalDecision ?? "Use the local Qwen baseline reviewer."}
`,
    "utf8"
  );
}

async function writeEscalatedReview(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "escalated-review.md"),
    `# Escalated Review: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
profile_id: ${options.profileId ?? "escalated-adversarial-placeholder"}
trigger_rationale: ${options.triggerRationale ?? "Recorded smell trigger requires review beyond baseline local Qwen."}
availability_status: ${options.availabilityStatus ?? "bootstrap_gap"}
reviewer_verdict: ${options.reviewerVerdict ?? "bootstrap_gap"}
disposition: ${options.disposition ?? "Live escalated reviewer unavailable; placeholder evidence records the bootstrap gap."}
source_drift_status: ${options.sourceDriftStatus ?? "current"}
bootstrap_gap_evidence:
  - No live escalated adversarial reviewer integration exists yet.
`,
    "utf8"
  );
}

async function writeEscalatedReviewerProfile(repo, options = {}) {
  const profile = {
    contract_version: 1,
    profile_id: options.profileId ?? "security-reviewer-fixture",
    version: 1,
    provider: options.provider ?? "fixture",
    model: options.model ?? "fixture-security-reviewer",
    role: "escalated_adversarial_reviewer",
    runtime: "command",
    fixture_path: options.fixturePath,
    require_explicit_setup: options.requireExplicitSetup ?? false,
    credential_env_var: options.envVar,
    permissions: {
      filesystem: "read_only",
      network: options.provider === "fixture" ? "disabled" : "provider_only",
      can_edit_files: false,
      can_request_tools: false
    },
    output_contract: {
      format: "json",
      required_fields: ["verdict", "findings_status", "summary"]
    },
    unavailable_runtime_behavior: "fail_closed_or_operator_blocker"
  };

  const destination = path.join(
    repo,
    ".bandit/reviewers/escalated-reviewers.json"
  );
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(
    destination,
    `${JSON.stringify({ version: 1, profiles: [profile] }, null, 2)}\n`,
    "utf8"
  );
}

async function initGitRepo(repo) {
  await runGit(repo, ["init"]);
  await runGit(repo, ["config", "user.email", "bandit@example.test"]);
  await runGit(repo, ["config", "user.name", "Bandit Test"]);
}

async function commitAll(repo, message) {
  await runGit(repo, ["add", "."]);
  await runGit(repo, ["commit", "-m", message]);
  const result = await runGit(repo, ["rev-parse", "HEAD"]);
  return result.stdout.trim();
}

function runGit(cwd, args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}
