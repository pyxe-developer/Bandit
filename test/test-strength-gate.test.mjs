import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const binPath = path.join(repoRoot, "bin/bandit.mjs");

test("test-strength-gate validate rejects covered surfaces without a strategy or disposition", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-950", {
    title: "Covered Gate Work",
    coveredSurfaces: ["landing-gate"],
    strategy: ""
  });

  const result = await runBandit(repo, ["test-strength-gate", "validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /BANDIT-950/);
  assert.match(result.stderr, /missing test-strength strategy or explicit disposition/);
});

test("test-strength-gate validate accepts mutation evidence with required adequacy fields", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-951", {
    title: "Mutation Evidence Work",
    coveredSurfaces: ["artifact-validator"],
    strategy: "mutation"
  });
  await writeTestStrengthEvidence(repo, "BANDIT-951", {
    mode: "mutation",
    targetSurface: "artifact-validator",
    command: "npm run test-strength -- --surface artifact-validator",
    score: "82",
    threshold: "80",
    survivingMutants: "none",
    excludedMutants: "equivalent markdown whitespace mutant",
    freshnessSource: "current source head",
    wrongBehaviors: ["accepts missing required metadata"]
  });

  const result = await runBandit(repo, ["test-strength-gate", "validate"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Test strength gate: pass/);
  assert.match(result.stdout, /BANDIT-951/);
});

test("test-strength-gate validate rejects Stage 2 RED evidence without intended failure and assertion adequacy", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-952", {
    title: "Weak RED Evidence Work",
    coveredSurfaces: ["state-transition"],
    strategy: "table_driven_adversarial"
  });
  await writeFile(
    path.join(repo, "docs/work/BANDIT-952/red-evidence.md"),
    `# BANDIT-952 RED Evidence

contract_version: 1
work_item: BANDIT-952
test_strength_strategy: table_driven_adversarial
intended_failure_reason:
assertion_adequacy_mapping:
`,
    "utf8"
  );

  const result = await runBandit(repo, [
    "test-strength-gate",
    "validate",
    "BANDIT-952"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /RED evidence missing intended_failure_reason/);
  assert.match(result.stderr, /RED evidence missing assertion_adequacy_mapping/);
});

test("land-check fails closed when a covered high-risk surface lacks current test-strength evidence", async () => {
  const repo = await createInitializedRepo();
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-953", {
    title: "Landing Gate Work",
    coveredSurfaces: ["landing-gate"],
    strategy: "mutation"
  });
  await writeReviewEvidence(repo, "BANDIT-953", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-953", { sourceHead });

  const result = await runBandit(repo, ["land-check", "BANDIT-953"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /safe-to-land requires current test-strength evidence for covered surface landing-gate/
  );
});

function runBandit(cwd, args) {
  return new Promise((resolve) => {
    execFile(process.execPath, [binPath, ...args], { cwd }, (error, stdout, stderr) => {
      resolve({
        code: typeof error?.code === "number" ? error.code : 0,
        stdout,
        stderr
      });
    });
  });
}

async function createInitializedRepo() {
  const repo = await mkdtemp(path.join(tmpdir(), "bandit-test-strength-"));
  await runBandit(repo, ["init"]);
  await writeBasePolicies(repo);
  return repo;
}

async function writeBasePolicies(repo) {
  await writeJson(repo, ".bandit/policy/smell-triggers.json", {
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
  });
  await writeJson(repo, ".bandit/reviewers/local-qwen.json", {
    type: "openai_compatible",
    contract_version: 1,
    profile_id: "local-qwen-baseline",
    version: 1,
    provider: "fixture",
    provider_base_url: "http://127.0.0.1:8001/v1",
    runtime: "command",
    command: {
      executable: process.execPath,
      args: ["qwen-fixture.mjs", "{{prompt}}"]
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
    unavailable_runtime_behavior: "fail_closed_or_bootstrap_gap"
  });
  await writeJson(repo, ".bandit/policy/landing-agent.json", {
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
    ]
  });
  await writeJson(repo, ".bandit/policy/test-strength-gate.json", {
    version: 1,
    covered_surfaces: [
      "landing-gate",
      "review-routing",
      "claim-authority",
      "state-transition",
      "artifact-validator",
      "evidence-freshness",
      "role-coordination",
      "serializer",
      "guarded-authority-boundary"
    ],
    acceptable_evidence_modes: [
      "mutation",
      "property_fault_injection",
      "table_driven_adversarial",
      "explicit_disposition"
    ],
    risk_tiers: {
      high: {
        require_test_strength_evidence: true
      }
    }
  });
}

async function writeWorkBrief(repo, id, options) {
  const workDir = path.join(repo, "docs/work", id);
  await mkdir(workDir, { recursive: true });
  const coveredSurfaces = options.coveredSurfaces
    .map((surface) => `  - ${surface}`)
    .join("\n");
  await writeFile(
    path.join(workDir, "brief.md"),
    `# ${id}: ${options.title}

## Status

Ready

work_type: chore
risk_tier: high
test_strength_strategy: ${options.strategy}
covered_test_strength_surfaces:
${coveredSurfaces}
`,
    "utf8"
  );
}

async function writeTestStrengthEvidence(repo, id, evidence) {
  const wrongBehaviors = evidence.wrongBehaviors
    .map((behavior) => `  - ${behavior}`)
    .join("\n");
  await writeFile(
    path.join(repo, `docs/work/${id}/test-strength-evidence.md`),
    `# Test Strength Evidence: ${id}

contract_version: 1
work_item: ${id}
mode: ${evidence.mode}
target_surface: ${evidence.targetSurface}
command: ${evidence.command}
score: ${evidence.score}
threshold: ${evidence.threshold}
surviving_mutant_disposition: ${evidence.survivingMutants}
excluded_mutants: ${evidence.excludedMutants}
freshness_source: ${evidence.freshnessSource}
wrong_behaviors_rejected:
${wrongBehaviors}
`,
    "utf8"
  );
}

async function writeReviewEvidence(repo, id, options = {}) {
  await writeFile(
    path.join(repo, `docs/work/${id}/review-evidence.md`),
    `# Review Evidence: ${id}

contract_version: 1
work_item: ${id}
source_head: ${options.sourceHead ?? "unknown"}
verification_state: pass
verification_evidence:
  - node --test test/test-strength-gate.test.mjs
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - Manual PM review replaces unavailable final gates during bootstrap.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - Local Qwen runtime is unavailable during bootstrap.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: No smell trigger requires escalation beyond baseline.
pm_disposition: pass
pm_disposition_rationale: No unresolved reviewer findings.
non_blocking_findings_routing:
  - none
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - Manual PM review replaces unavailable final gates during bootstrap.
`,
    "utf8"
  );
}

async function writeLandingVerdict(repo, id, options = {}) {
  await writeFile(
    path.join(repo, `docs/work/${id}/landing-verdict.md`),
    `# Landing Verdict: ${id}

contract_version: 1
work_item: ${id}
source_head: ${options.sourceHead ?? "unknown"}
review_evidence: docs/work/${id}/review-evidence.md
tests_status: pass
clean_code_status: pass
coderabbit_state: bootstrap_gap
local_qwen_state: bootstrap_gap
escalated_review_state: not_applicable
uat_status: not_applicable
source_drift_status: current
operator_input_status: none_required
landing_agent_state: bootstrap_gap
landing_agent_replacement_evidence:
  - Manual PM review replaces unavailable final gates during bootstrap.
final_verdict: safe-to-land
rationale: Evidence is explicit and unavailable final gates are recorded as bootstrap gaps.
`,
    "utf8"
  );
}

async function initGitRepo(repo) {
  await execGit(repo, ["init"]);
  await execGit(repo, ["config", "user.email", "bandit@example.test"]);
  await execGit(repo, ["config", "user.name", "Bandit Test"]);
}

async function commitAll(repo, message) {
  await execGit(repo, ["add", "."]);
  await execGit(repo, ["commit", "-m", message]);
  const result = await execGit(repo, ["rev-parse", "HEAD"]);
  return result.stdout.trim();
}

function execGit(repo, args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd: repo }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function writeJson(repo, displayPath, value) {
  const destination = path.join(repo, displayPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
