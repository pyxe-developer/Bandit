import assert from "node:assert/strict";
import { execFile } from "node:child_process";
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

async function createInitializedRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeTemplates(repo, options);
  await writeLocalQwenProfile(repo);
  await writeSmellCatalog(repo, options.smellCatalog ?? validSmellCatalog);

  return repo;
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

async function writeReviewEvidence(repo, workItemId, options = {}) {
  const contentLines = [
    `# Review Evidence: ${workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${workItemId}`,
    `source_head: ${options.sourceHead ?? "unknown"}`,
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
    "operator_input_status: none_required",
    "uat_status: not_applicable",
    "clean_code_status: pass",
    `source_drift_status: ${options.sourceDriftStatus ?? "current"}`,
    "bootstrap_gaps:",
    "  - Manual PM review replaces unavailable final gates during bootstrap."
  ].filter((line) => !line.startsWith(`${options.omitLine}:`));

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
coderabbit_state: bootstrap_gap
local_qwen_state: bootstrap_gap
escalated_review_state: ${options.escalatedReviewState ?? "not_applicable"}
uat_status: not_applicable
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
