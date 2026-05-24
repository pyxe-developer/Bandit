import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const committedTemplateRoot = path.join(repoRoot, "docs/templates");

const localQwenTemplate = `# Local Qwen Review Template

contract_version:
work_item:
source_head:
profile_id:
runtime:
model:
run_status:
reviewer_verdict:
findings_status:
findings_disposition:
operator_input_status:
source_drift_status:
executable_evidence:
bootstrap_gaps:
`;

const validSmellCatalog = {
  version: 1,
  smells: [
    {
      id: "BANDIT-SMELL-ADVERSARIAL-REVIEW",
      name: "Adversarial Review Required",
      category: "review_gate",
      trigger: "A PR or slice requires baseline local Qwen review.",
      severity: "blocker",
      default_action: "require_qwen_review",
      escalation_target: "local-qwen-baseline",
      required_evidence: ["local-qwen-review.md"]
    }
  ]
};

test("validate fails closed when the local Qwen reviewer profile is missing", async () => {
  const repo = await createInitializedRepo({ omitProfile: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing local Qwen reviewer profile: \.bandit\/reviewers\/local-qwen\.json/
  );
});

test("validate fails closed when the local Qwen review template is missing", async () => {
  const repo = await createInitializedRepo({
    omitTemplate: "docs/templates/local-qwen-review.md"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/local-qwen-review\.md/
  );
});

test("validate fails closed when the local Qwen profile omits the prompt contract", async () => {
  const repo = await createInitializedRepo({
    profileOptions: { omitFields: ["prompt_contract"] }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen profile missing required field: prompt_contract/);
});

test("validate fails closed when the local Qwen profile uses an unsupported runtime", async () => {
  const repo = await createInitializedRepo({
    profileOptions: { overrides: { runtime: "paid_api" } }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported local Qwen runtime: paid_api/);
});

test("validate fails closed when local Qwen evidence references the wrong work item", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-950", "Wrong Qwen Evidence");
  await writeLocalQwenReview(repo, "BANDIT-950", {
    workItem: "BANDIT-OTHER"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Malformed local Qwen review: docs\/work\/BANDIT-950\/local-qwen-review\.md; work_item does not match BANDIT-950/
  );
});

test("validate fails closed when local Qwen evidence uses an unsupported reviewer verdict", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-951", "Unsupported Qwen Verdict");
  await writeLocalQwenReview(repo, "BANDIT-951", {
    reviewerVerdict: "clean"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported local Qwen reviewer verdict: clean/);
});

test("validate fails closed when local Qwen evidence hides unresolved operator input", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-952", "Operator Input Qwen Evidence");
  await writeLocalQwenReview(repo, "BANDIT-952", {
    operatorInputStatus: "required_missing"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Local Qwen review has unresolved operator-owned input: BANDIT-952/
  );
});

test("validate fails closed when a local Qwen pass lacks executable evidence", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-953", "Qwen Pass Without Evidence");
  await writeLocalQwenReview(repo, "BANDIT-953", {
    omitExecutableEvidence: true
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen pass requires executable evidence/);
});

test("validate preserves compatibility for historical work items without local Qwen evidence", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-954", "Historical Work Item");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Bandit state is valid/);
});

test("qwen-review reports usage when the work item ID is omitted", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["qwen-review"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit qwen-review <work-item-id>/);
});

test("qwen-review fails closed when the work item is unknown", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["qwen-review", "BANDIT-404"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Work item not found: BANDIT-404/);
});

test("qwen-review fails closed when the local Qwen profile is missing", async () => {
  const repo = await createInitializedRepo({ omitProfile: true });
  await writeWorkBrief(repo, "BANDIT-955", "Missing Qwen Profile");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-955"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing local Qwen reviewer profile: \.bandit\/reviewers\/local-qwen\.json/
  );
});

test("qwen-review fails closed when the configured runtime is unavailable", async () => {
  const repo = await createInitializedRepo({
    profileOptions: {
      overrides: {
        command: {
          executable: "definitely-missing-qwen-command-for-bandit-tests",
          args: []
        }
      }
    }
  });
  await writeWorkBrief(repo, "BANDIT-956", "Unavailable Qwen Runtime");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-956"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Configured local Qwen runtime is unavailable/);
});

test("qwen-review fails closed when the reviewer exits nonzero", async () => {
  const repo = await createInitializedRepo();
  await writeReviewerFixture(
    repo,
    "process.stderr.write('review failed\\n'); process.exit(42);"
  );
  await writeWorkBrief(repo, "BANDIT-957", "Nonzero Qwen Reviewer");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-957"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen reviewer exited nonzero/);
});

test("qwen-review fails closed when the reviewer output is inconclusive", async () => {
  const repo = await createInitializedRepo();
  await writeReviewerFixture(repo, "process.stdout.write('not-json');");
  await writeWorkBrief(repo, "BANDIT-958", "Inconclusive Qwen Output");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-958"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen reviewer output was inconclusive/);
});

test("qwen-review fails closed when the worktree is dirty", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await writeReviewerFixture(
    repo,
    "process.stdout.write(JSON.stringify({ verdict: 'pass', findings: [], summary: 'Fixture pass' }));"
  );
  await writeWorkBrief(repo, "BANDIT-964", "Dirty Qwen Review");
  await commitAll(repo, "Fixture source");
  await writeFile(path.join(repo, "dirty.txt"), "dirty\n", "utf8");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-964"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Local Qwen review requires a clean worktree before source-head evidence can be recorded/
  );
});

test("qwen-review sends work item evidence and source diff to the reviewer", async () => {
  const repo = await createInitializedRepo({
    profileOptions: {
      overrides: {
        command: {
          executable: process.execPath,
          args: ["qwen-fixture.mjs", "{{prompt}}"]
        }
      }
    }
  });
  await initGitRepo(repo);
  await writeReviewerFixture(
    repo,
    [
      "const prompt = process.argv[2] ?? '';",
      "if (!prompt.includes('docs/work/BANDIT-965/implementation-evidence.md')) process.exit(11);",
      "if (!prompt.includes('Implementation marker for prompt coverage')) process.exit(12);",
      "if (!prompt.includes('Source diff range:')) process.exit(13);",
      "if (!prompt.includes('diff --git')) process.exit(14);",
      "process.stdout.write(JSON.stringify({ verdict: 'pass', findings: [], summary: 'Prompt included evidence and diff' }));"
    ].join("\n")
  );
  await writeWorkBrief(repo, "BANDIT-965", "Prompt Qwen Review");
  await writeWorkBrief(repo, "BANDIT-964", "Previous Slice");
  await writeLandingAction(repo, "BANDIT-964", await commitAll(repo, "Previous landed slice"));
  await writeImplementationEvidence(repo, "BANDIT-965");
  await writeFile(path.join(repo, "source.txt"), "source change\n", "utf8");
  await commitAll(repo, "Current slice source");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-965"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Local Qwen review: pass/);
});

test("qwen-review writes repo-native evidence for a passing fixture review", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  await writeReviewerFixture(
    repo,
    "process.stdout.write(JSON.stringify({ verdict: 'pass', findings: [], summary: 'Fixture pass' }));"
  );
  await writeWorkBrief(repo, "BANDIT-959", "Passing Qwen Review");
  await commitAll(repo, "Fixture source");

  const result = await runBandit(repo, ["qwen-review", "BANDIT-959"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Local Qwen review: pass/);
  assert.match(
    result.stdout,
    /Evidence: docs\/work\/BANDIT-959\/local-qwen-review\.md/
  );

  const artifact = await readFile(
    path.join(repo, "docs/work/BANDIT-959/local-qwen-review.md"),
    "utf8"
  );
  assert.match(artifact, /work_item: BANDIT-959/);
  assert.match(artifact, /profile_id: local-qwen-baseline/);
  assert.match(artifact, /reviewer_verdict: pass/);
  assert.match(artifact, /operator_input_status: none_required/);
});

test("land-check reports the current local Qwen pass and evidence artifact", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-960", "Current Qwen Pass");
  await writeReviewEvidence(repo, "BANDIT-960", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-960", {
    sourceHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-960", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-960"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Local Qwen: pass/);
  assert.match(
    result.stdout,
    /Local Qwen evidence: docs\/work\/BANDIT-960\/local-qwen-review\.md/
  );
  assert.match(result.stdout, /Local Qwen profile: local-qwen-baseline/);
});

test("land-check fails closed when local Qwen evidence is stale", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const oldHead = await commitAll(repo, "Initial state");
  await writeFile(path.join(repo, "changed.txt"), "changed\n", "utf8");
  const currentHead = await commitAll(repo, "Change after Qwen review");
  await writeWorkBrief(repo, "BANDIT-961", "Stale Qwen Evidence");
  await writeReviewEvidence(repo, "BANDIT-961", {
    sourceHead: currentHead,
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-961", {
    sourceHead: currentHead,
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-961", { sourceHead: oldHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-961"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen review evidence is stale/);
});

test("land-check fails closed when local Qwen evidence is blocked", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-962", "Blocked Qwen Evidence");
  await writeReviewEvidence(repo, "BANDIT-962", {
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-962", {
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-962", {
    reviewerVerdict: "blocker"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-962"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen reviewer verdict blocks landing: blocker/);
});

test("land-check fails closed when local Qwen evidence is inconclusive", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-963", "Inconclusive Qwen Evidence");
  await writeReviewEvidence(repo, "BANDIT-963", {
    localQwenState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-963", {
    localQwenState: "pass"
  });
  await writeLocalQwenReview(repo, "BANDIT-963", {
    runStatus: "inconclusive",
    reviewerVerdict: "blocker",
    findingsStatus: "inconclusive"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-963"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen review is inconclusive/);
});

async function createInitializedRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyTemplates(repo, options.omitTemplate);

  if (!options.omitProfile) {
    await writeLocalQwenProfile(repo, options.profileOptions);
  }

  await writeSmellCatalog(repo, validSmellCatalog);

  return repo;
}

async function copyTemplates(repo, omitTemplate) {
  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });

  await writeFile(
    path.join(repo, "docs/templates/local-qwen-review.md"),
    localQwenTemplate,
    "utf8"
  );

  if (omitTemplate) {
    await rm(path.join(repo, omitTemplate), { force: true });
  }
}

async function writeSmellCatalog(repo, catalog) {
  const destination = path.join(repo, ".bandit/policy/smell-triggers.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

async function writeLocalQwenProfile(repo, options = {}) {
  const profile = {
    contract_version: 1,
    profile_id: "local-qwen-baseline",
    version: 1,
    runtime: "command",
    command: {
      executable: process.execPath,
      args: ["qwen-fixture.mjs"]
    },
    model: "fixture-qwen",
    prompt_contract: {
      role: "read_only_adversarial_reviewer",
      required_outputs: ["verdict", "findings", "summary"]
    },
    timeout_ms: 30000,
    permissions: {
      filesystem: "read_only",
      network: "disabled",
      can_edit_files: false,
      can_request_tools: false
    },
    output_contract: {
      format: "json",
      required_fields: ["verdict", "findings", "summary"]
    },
    unavailable_runtime_behavior: "fail_closed_or_bootstrap_gap",
    ...options.overrides
  };

  for (const field of options.omitFields ?? []) {
    delete profile[field];
  }

  const destination = path.join(repo, ".bandit/reviewers/local-qwen.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
}

async function writeLocalQwenReview(repo, workItemId, options = {}) {
  const contentLines = [
    `# Local Qwen Review: ${workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${options.workItem ?? workItemId}`,
    `source_head: ${options.sourceHead ?? "unknown"}`,
    "profile_id: local-qwen-baseline",
    "runtime: command",
    "model: fixture-qwen",
    `run_status: ${options.runStatus ?? "completed"}`,
    `reviewer_verdict: ${options.reviewerVerdict ?? "pass"}`,
    `findings_status: ${options.findingsStatus ?? "none"}`,
    "findings_disposition: no unresolved findings",
    `operator_input_status: ${options.operatorInputStatus ?? "none_required"}`,
    "source_drift_status: current",
    "executable_evidence:",
    ...(options.omitExecutableEvidence
      ? []
      : ["  - qwen-review command exited 0 using fixture reviewer."]),
    "bootstrap_gaps:",
    "  - none"
  ];

  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "local-qwen-review.md"),
    `${contentLines.join("\n")}\n`,
    "utf8"
  );
}

async function writeReviewerFixture(repo, script) {
  await writeFile(path.join(repo, "qwen-fixture.mjs"), `${script}\n`, "utf8");
}

async function writeImplementationEvidence(repo, workItemId) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "implementation-evidence.md"),
    "# Implementation Evidence\n\nImplementation marker for prompt coverage.\n",
    "utf8"
  );
}

async function writeLandingAction(repo, workItemId, commitSha) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "landing-action.md"),
    `# ${workItemId} Landing Action

| Field | Value |
|---|---|
| Landed commit | \`${commitSha}\` |
`,
    "utf8"
  );
}

async function writeReviewEvidence(repo, workItemId, options = {}) {
  const content = `# Review Evidence: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
verification_state: pass
verification_evidence:
  - node --test test/local-qwen-review.test.mjs
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - Manual PM review replaces unavailable CodeRabbit during bootstrap.
local_qwen_state: ${options.localQwenState ?? "bootstrap_gap"}
local_qwen_replacement_evidence:
  - Local Qwen runtime is unavailable during bootstrap.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: No smell trigger requires escalation beyond the local baseline.
pm_disposition: pass
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - Manual PM review replaces unavailable final gates during bootstrap.
`;

  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(path.join(workDir, "review-evidence.md"), content, "utf8");
}

async function writeLandingVerdict(repo, workItemId, options = {}) {
  const content = `# Landing Verdict: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
review_evidence: docs/work/${workItemId}/review-evidence.md
tests_status: pass
clean_code_status: pass
coderabbit_state: bootstrap_gap
local_qwen_state: ${options.localQwenState ?? "bootstrap_gap"}
escalated_review_state: not_applicable
uat_status: not_applicable
source_drift_status: current
operator_input_status: none_required
landing_agent_state: bootstrap_gap
landing_agent_replacement_evidence:
  - Manual PM review replaces unavailable Landing Agent during bootstrap.
final_verdict: safe-to-land
rationale: Evidence is explicit and unavailable final gates are recorded as bootstrap gaps.
`;

  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(path.join(workDir, "landing-verdict.md"), content, "utf8");
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
