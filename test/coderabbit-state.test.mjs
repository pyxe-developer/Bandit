import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
const committedTemplateRoot = path.join(repoRoot, "docs/templates");

const coderabbitTemplate = `# CodeRabbit Review Template

contract_version:
work_item:
source_head:
provider:
review_target:
review_state:
coderabbit_verdict:
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
      id: "BANDIT-SMELL-CODERABBIT-WAIVER",
      name: "CodeRabbit Waiver Or Request Changes",
      category: "review_gate",
      trigger: "CodeRabbit has actionable comments, stale status, unresolved request changes, or a proposed waiver.",
      severity: "blocker",
      default_action: "require_pm_disposition",
      escalation_target: "codex-pm",
      required_evidence: ["coderabbit-state", "pm-disposition"]
    }
  ]
};

test("validate fails closed when the CodeRabbit review template is missing", async () => {
  const repo = await createInitializedRepo({ omitTemplate: "docs/templates/coderabbit-review.md" });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/coderabbit-review\.md/
  );
});

test("validate fails closed when CodeRabbit evidence references the wrong work item", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-970", "Wrong CodeRabbit Evidence");
  await writeCodeRabbitReview(repo, "BANDIT-970", {
    workItem: "BANDIT-OTHER"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Malformed CodeRabbit review: docs\/work\/BANDIT-970\/coderabbit-review\.md; work_item does not match BANDIT-970/
  );
});

test("validate fails closed when CodeRabbit evidence uses an unsupported verdict", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-971", "Unsupported CodeRabbit Verdict");
  await writeCodeRabbitReview(repo, "BANDIT-971", {
    coderabbitVerdict: "clean"
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported CodeRabbit review verdict: clean/);
});

test("validate fails closed when a CodeRabbit pass lacks executable evidence", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-972", "CodeRabbit Pass Without Evidence");
  await writeCodeRabbitReview(repo, "BANDIT-972", {
    omitExecutableEvidence: true
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /CodeRabbit pass requires executable evidence/);
});

test("coderabbit-review reports usage when the work item ID is omitted", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["coderabbit-review"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit coderabbit-review <work-item-id>/);
});

test("coderabbit-review fails closed when the work item is unknown", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["coderabbit-review", "BANDIT-404"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Work item not found: BANDIT-404/);
});

test("land-check fails closed when CodeRabbit pass lacks current CodeRabbit evidence", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-973", "Missing CodeRabbit Evidence");
  await writeReviewEvidence(repo, "BANDIT-973", {
    coderabbitState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-973", {
    coderabbitState: "pass"
  });

  const result = await runBandit(repo, ["land-check", "BANDIT-973"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /safe-to-land requires current CodeRabbit review evidence/
  );
});

test("land-check reports the current CodeRabbit pass and evidence artifact", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-974", "Current CodeRabbit Pass");
  await writeReviewEvidence(repo, "BANDIT-974", {
    sourceHead,
    coderabbitState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-974", {
    sourceHead,
    coderabbitState: "pass"
  });
  await writeCodeRabbitReview(repo, "BANDIT-974", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-974"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /CodeRabbit: pass/);
  assert.match(
    result.stdout,
    /CodeRabbit evidence: docs\/work\/BANDIT-974\/coderabbit-review\.md/
  );
  assert.match(result.stdout, /CodeRabbit provider: coderabbit/);
});

test("land-check fails closed when CodeRabbit evidence is stale", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const oldHead = await commitAll(repo, "Initial state");
  await writeFile(path.join(repo, "changed.txt"), "changed\n", "utf8");
  const currentHead = await commitAll(repo, "Change after CodeRabbit review");
  await writeWorkBrief(repo, "BANDIT-975", "Stale CodeRabbit Evidence");
  await writeReviewEvidence(repo, "BANDIT-975", {
    sourceHead: currentHead,
    coderabbitState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-975", {
    sourceHead: currentHead,
    coderabbitState: "pass"
  });
  await writeCodeRabbitReview(repo, "BANDIT-975", { sourceHead: oldHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-975"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /CodeRabbit review evidence is stale/);
});

test("coderabbit-review live reports usage when the work item ID is omitted", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["coderabbit-review", "live"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Usage: bandit coderabbit-review live <work-item-id>/
  );
});

test("coderabbit-review live captures clean current review evidence from a fixture", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-976", "Live CodeRabbit Clean Review");
  const fixturePath = await writeLiveCodeRabbitFixture(repo, {
    sourceHead,
    prNumber: 123,
    reviewState: "completed",
    verdict: "pass",
    findings: []
  });
  const secret = "ghp_live_secret_123";

  const result = await runBanditWithEnv(
    repo,
    [
      "coderabbit-review",
      "live",
      "BANDIT-976",
      "--pr",
      "123",
      "--fixture",
      fixturePath
    ],
    { GITHUB_TOKEN: secret }
  );

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /CodeRabbit live review: pass/);
  assert.match(
    result.stdout,
    /Evidence: docs\/work\/BANDIT-976\/coderabbit-review\.md/
  );

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-976/coderabbit-review.md"),
    "utf8"
  );
  assert.match(evidence, /provider: coderabbit-live/);
  assert.match(evidence, /review_target: github-pr-123/);
  assert.match(evidence, new RegExp(`source_head: ${sourceHead}`));
  assert.match(evidence, /coderabbit_verdict: pass/);
  assert.doesNotMatch(evidence, new RegExp(secret));
});

test("coderabbit-review live records request changes as blocking evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-977", "Live CodeRabbit Request Changes");
  const fixturePath = await writeLiveCodeRabbitFixture(repo, {
    sourceHead,
    prNumber: 124,
    reviewState: "completed",
    verdict: "blocker",
    findings: [
      {
        severity: "blocker",
        status: "unresolved",
        body: "CodeRabbit requested changes on the landing gate."
      }
    ]
  });

  const result = await runBanditWithEnv(
    repo,
    [
      "coderabbit-review",
      "live",
      "BANDIT-977",
      "--pr",
      "124",
      "--fixture",
      fixturePath
    ],
    { GITHUB_TOKEN: "ghp_request_changes_secret" }
  );

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /CodeRabbit review has unresolved actionable findings/
  );

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-977/coderabbit-review.md"),
    "utf8"
  );
  assert.match(evidence, /coderabbit_verdict: blocker/);
  assert.match(evidence, /findings_status: unresolved/);
  assert.match(evidence, /operator_input_status: none_required/);
});

test("coderabbit-review live fails closed when PR context is missing", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-978", "Live CodeRabbit Missing PR");
  const fixturePath = await writeLiveCodeRabbitFixture(repo, {
    sourceHead,
    reviewState: "completed",
    verdict: "pass",
    findings: []
  });

  const result = await runBanditWithEnv(
    repo,
    ["coderabbit-review", "live", "BANDIT-978", "--fixture", fixturePath],
    { GITHUB_TOKEN: "ghp_missing_pr_secret" }
  );

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing PR context for live CodeRabbit review/);

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-978/coderabbit-review.md"),
    "utf8"
  );
  assert.match(evidence, /review_target: missing-pr-context/);
  assert.match(evidence, /review_state: blocked/);
  assert.match(evidence, /coderabbit_verdict: blocker/);
  assert.match(evidence, /Missing PR context for live CodeRabbit review/);
});

test("coderabbit-review live records missing credentials as operator input blocked evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-979", "Live CodeRabbit Missing Credential");
  const fixturePath = await writeLiveCodeRabbitFixture(repo, {
    sourceHead,
    prNumber: 125,
    reviewState: "completed",
    verdict: "pass",
    findings: []
  });

  const result = await runBanditWithEnv(repo, [
    "coderabbit-review",
    "live",
    "BANDIT-979",
    "--pr",
    "125",
    "--fixture",
    fixturePath
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required operator input: GITHUB_TOKEN/);

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-979/coderabbit-review.md"),
    "utf8"
  );
  assert.match(evidence, /coderabbit_verdict: blocker/);
  assert.match(evidence, /operator_input_status: operator_input_blocked/);
  assert.match(evidence, /GITHUB_TOKEN/);
  assert.doesNotMatch(evidence, /ghp_/);
});

test("coderabbit-review live redacts credential values from provider errors", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-980", "Live CodeRabbit Redaction");
  const secret = "ghp_redaction_secret_456";
  const fixturePath = await writeLiveCodeRabbitFixture(repo, {
    sourceHead,
    prNumber: 126,
    reviewState: "unavailable",
    verdict: "blocker",
    providerError: `CodeRabbit rejected token ${secret}`
  });

  const result = await runBanditWithEnv(
    repo,
    [
      "coderabbit-review",
      "live",
      "BANDIT-980",
      "--pr",
      "126",
      "--fixture",
      fixturePath
    ],
    { GITHUB_TOKEN: secret }
  );

  assert.equal(result.code, 1);
  assert.match(result.stderr, /CodeRabbit live review unavailable/);
  assert.doesNotMatch(result.stderr, new RegExp(secret));

  const evidence = await readFile(
    path.join(repo, "docs/work/BANDIT-980/coderabbit-review.md"),
    "utf8"
  );
  assert.match(evidence, /review_state: unavailable/);
  assert.match(evidence, /provider error redacted/);
  assert.doesNotMatch(evidence, new RegExp(secret));
});

test("land-check consumes live-normalized CodeRabbit pass evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-981", "Live CodeRabbit Land Check");
  await writeReviewEvidence(repo, "BANDIT-981", {
    sourceHead,
    coderabbitState: "pass"
  });
  await writeLandingVerdict(repo, "BANDIT-981", {
    sourceHead,
    coderabbitState: "pass"
  });
  const fixturePath = await writeLiveCodeRabbitFixture(repo, {
    sourceHead,
    prNumber: 127,
    reviewState: "completed",
    verdict: "pass",
    findings: []
  });

  const liveResult = await runBanditWithEnv(
    repo,
    [
      "coderabbit-review",
      "live",
      "BANDIT-981",
      "--pr",
      "127",
      "--fixture",
      fixturePath
    ],
    { GITHUB_TOKEN: "ghp_land_check_secret" }
  );
  assert.equal(liveResult.code, 0, liveResult.stderr);

  const landCheck = await runBandit(repo, ["land-check", "BANDIT-981"]);

  assert.equal(landCheck.code, 0, landCheck.stderr);
  assert.match(landCheck.stdout, /CodeRabbit: pass/);
  assert.match(landCheck.stdout, /CodeRabbit provider: coderabbit-live/);
});

async function createInitializedRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyTemplates(repo, options.omitTemplate);
  await writeLocalQwenProfile(repo);
  await writeSmellCatalog(repo, validSmellCatalog);

  return repo;
}

async function copyTemplates(repo, omitTemplate) {
  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });

  if (omitTemplate !== "docs/templates/coderabbit-review.md") {
    await writeFile(
      path.join(repo, "docs/templates/coderabbit-review.md"),
      coderabbitTemplate,
      "utf8"
    );
  }

  if (omitTemplate) {
    await rm(path.join(repo, omitTemplate), { force: true });
  }
}

async function writeSmellCatalog(repo, catalog) {
  const destination = path.join(repo, ".bandit/policy/smell-triggers.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

async function writeCodeRabbitReview(repo, workItemId, options = {}) {
  const contentLines = [
    `# CodeRabbit Review: ${workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${options.workItem ?? workItemId}`,
    `source_head: ${options.sourceHead ?? "unknown"}`,
    "provider: coderabbit",
    "review_target: direct-main-bootstrap",
    `review_state: ${options.reviewState ?? "completed"}`,
    `coderabbit_verdict: ${options.coderabbitVerdict ?? "pass"}`,
    `findings_status: ${options.findingsStatus ?? "none"}`,
    "findings_disposition: no unresolved CodeRabbit findings",
    `operator_input_status: ${options.operatorInputStatus ?? "none_required"}`,
    "source_drift_status: current",
    "executable_evidence:",
    ...(options.omitExecutableEvidence
      ? []
      : ["  - CodeRabbit state was captured from a deterministic fixture."]),
    "bootstrap_gaps:",
    "  - none"
  ];

  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "coderabbit-review.md"),
    `${contentLines.join("\n")}\n`,
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
  - node --test test/coderabbit-state.test.mjs
coderabbit_state: ${options.coderabbitState ?? "bootstrap_gap"}
coderabbit_replacement_evidence:
  - Manual PM review replaces unavailable CodeRabbit during bootstrap.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - Local Qwen runtime is unavailable during bootstrap.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: No smell trigger requires escalation beyond the baseline bootstrap gap.
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
coderabbit_state: ${options.coderabbitState ?? "bootstrap_gap"}
local_qwen_state: bootstrap_gap
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

async function writeLiveCodeRabbitFixture(repo, fixture) {
  const destination = path.join(repo, ".bandit/fixtures/coderabbit-live.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");
  return destination;
}

function runBanditWithEnv(cwd, args, env = {}) {
  const binPath = path.join(repoRoot, "bin/bandit.mjs");

  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [binPath, ...args],
      {
        cwd,
        env: {
          ...process.env,
          GITHUB_TOKEN: "",
          CODERABBIT_TOKEN: "",
          ...env
        }
      },
      (error, stdout, stderr) => {
        resolve({
          code: typeof error?.code === "number" ? error.code : 0,
          stdout,
          stderr
        });
      }
    );
  });
}
