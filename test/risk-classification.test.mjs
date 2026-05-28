import assert from "node:assert/strict";
import { execFile } from "node:child_process";
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

const riskPolicyPath = ".bandit/policy/risk-classification.json";
const riskTemplatePath = "docs/templates/layered-risk-classification.md";

test("validate fails closed when the layered risk-classification policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteRiskClassificationEvidence(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/risk-classification\.json/
  );
});

test("validate fails closed when the layered risk-classification template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteRiskClassificationEvidence(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/layered-risk-classification\.md/
  );
});

test("risk classification rejects smell-trigger-only decisions", async () => {
  const repo = await createInitializedRepo();
  const classification = completeRiskClassification();
  classification.blast_radius_signals = [];
  classification.static_analysis_signals = [];
  classification.source_trust_state = { state: "unknown", evidence_path: "" };
  classification.input_quarantine_state = { state: "unknown", evidence_path: "" };
  classification.supply_chain_state = { state: "unknown", evidence_path: "" };
  classification.smell_trigger_inputs = [
    {
      smell_id: "BANDIT-SMELL-ADVERSARIAL-REVIEW",
      severity: "blocker"
    }
  ];
  await writeCompleteRiskClassificationEvidence(repo, { classification });

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /risk classification for BANDIT-950 cannot use smell triggers as sole authority/
  );
});

test("risk classification rejects never-auto-landable surfaces marked auto-landable", async () => {
  const repo = await createInitializedRepo();
  const classification = completeRiskClassification();
  classification.changed_surfaces[0] = {
    path: "src/auth/session.ts",
    surface: "authentication",
    risk: "high",
    never_auto_landable: true
  };
  classification.auto_landing = {
    eligible: true,
    refusal_rationale: "Reviewer gates passed."
  };
  await writeCompleteRiskClassificationEvidence(repo, { classification });

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /never-auto-landable surface authentication cannot be marked auto-landable/
  );
});

test("risk classification escalates high-risk signals without smell-list concurrence", async () => {
  const repo = await createInitializedRepo();
  const classification = completeRiskClassification();
  classification.blast_radius_signals = [
    {
      signal_id: "production_data_access",
      risk: "high",
      evidence_path: "docs/work/BANDIT-950/brief.md"
    }
  ];
  classification.smell_trigger_inputs = [];
  classification.selected_review_depth = "baseline_qwen";
  classification.operator_supervision = {
    required: false,
    route: "none",
    rationale: "No smell trigger matched."
  };
  classification.auto_landing = {
    eligible: true,
    refusal_rationale: "No smell trigger matched."
  };
  await writeCompleteRiskClassificationEvidence(repo, { classification });

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /high-risk blast-radius signal production_data_access must raise review depth, require operator supervision, or block auto-landing/
  );
});

test("risk classification rejects unknown source-trust and input-quarantine states", async () => {
  const repo = await createInitializedRepo();
  const classification = completeRiskClassification();
  classification.source_trust_state = { state: "unknown", evidence_path: "" };
  classification.input_quarantine_state = {
    state: "unavailable",
    evidence_path: ""
  };
  await writeCompleteRiskClassificationEvidence(repo, { classification });

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /unknown or unavailable source-trust and input-quarantine states are explicit risk states/
  );
});

test("risk classification rejects missing supply-chain-state disposition", async () => {
  const repo = await createInitializedRepo();
  const classification = completeRiskClassification();
  delete classification.supply_chain_state;
  await writeCompleteRiskClassificationEvidence(repo, { classification });

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /risk classification for BANDIT-950 requires supply_chain_state disposition/
  );
});

test("risk classification rejects malformed selected review depth", async () => {
  const repo = await createInitializedRepo();
  const classification = completeRiskClassification();
  classification.selected_review_depth = "quick_pass";
  await writeCompleteRiskClassificationEvidence(repo, { classification });

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /unsupported selected_review_depth: quick_pass/);
});

test("risk classification accepts a complete low-risk classification", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteRiskClassificationEvidence(repo);

  const result = await runBandit(repo, [
    "risk-classification",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: riskPolicyPath,
    classifications: ["BANDIT-950"],
    selected_review_depths: ["pre_pr_coderabbit_plus_qwen"],
    operator_supervision: ["BANDIT-950:not_required"],
    auto_landing_eligibility: ["BANDIT-950:eligible"]
  });
});

test("auto-land-check refuses safe-to-land evidence without layered risk classification", async () => {
  const repo = await createInitializedRepo();
  await writeRiskClassificationTemplate(repo);
  await writeJson(repo, riskPolicyPath, completeRiskPolicy("BANDIT-951", {
    release_authorized_decisions: []
  }));
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-951", "Missing Risk Classification");
  await writeReviewEvidence(repo, "BANDIT-951", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-951", { sourceHead });

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-951"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Auto-landing blocked: missing layered risk-classification evidence for BANDIT-951/
  );
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

async function writeCompleteRiskClassificationEvidence(repo, options = {}) {
  if (options.omitTemplate) {
    await rm(path.join(repo, riskTemplatePath), { force: true });
  } else {
    await writeRiskClassificationTemplate(repo);
  }

  const workItemId = options.workItemId ?? "BANDIT-950";
  const classification =
    options.classification ?? completeRiskClassification(workItemId);
  await writeJson(repo, classificationPath(workItemId), classification);

  if (options.omitPolicy) {
    await rm(path.join(repo, riskPolicyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    riskPolicyPath,
    options.policy ?? completeRiskPolicy(workItemId)
  );
}

async function writeRiskClassificationTemplate(repo) {
  await writeFileAt(
    repo,
    riskTemplatePath,
    `# Layered Risk Classification Template

work_item:
changed_surfaces:
hard_exclusions:
never_auto_landable_surfaces:
blast_radius_signals:
static_analysis_signals:
source_trust_state:
input_quarantine_state:
supply_chain_state:
smell_trigger_inputs:
selected_review_depth:
operator_supervision:
auto_landing:
rationale:
evidence_paths:
`
  );
}

function completeRiskPolicy(workItemId = "BANDIT-950", overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "layered-risk-classification",
    required_signal_groups: [
      "changed_surfaces",
      "hard_exclusions",
      "blast_radius_signals",
      "static_analysis_signals",
      "source_trust_state",
      "input_quarantine_state",
      "supply_chain_state",
      "smell_trigger_inputs"
    ],
    allowed_review_depths: [
      "baseline_qwen",
      "pre_pr_coderabbit_plus_qwen",
      "escalated_adversarial"
    ],
    never_auto_landable_surfaces: [
      "authentication",
      "sessions",
      "authorization",
      "payment",
      "billing",
      "refunds",
      "production_data",
      "schema_migrations",
      "secrets",
      "credentials",
      "ci_or_release_workflow",
      "dependency_or_fetched_prompt_execution",
      "privacy",
      "telemetry",
      "export",
      "destructive_operations",
      "external_side_effecting_automation"
    ],
    release_authorized_decisions: [
      {
        work_item: workItemId,
        decision_kind: "auto_landing",
        evidence_path: classificationPath(workItemId)
      }
    ],
    ...overrides
  };
}

function completeRiskClassification(workItemId = "BANDIT-950", overrides = {}) {
  return {
    contract_version: 1,
    work_item: workItemId,
    changed_surfaces: [
      {
        path: `docs/work/${workItemId}/brief.md`,
        surface: "documentation",
        risk: "low",
        never_auto_landable: false
      }
    ],
    hard_exclusions: [],
    blast_radius_signals: [
      {
        signal_id: "docs_only",
        risk: "low",
        evidence_path: `docs/work/${workItemId}/brief.md`
      }
    ],
    static_analysis_signals: [
      {
        tool: "typecheck",
        state: "pass",
        risk: "low",
        evidence_path: "npm run typecheck"
      }
    ],
    source_trust_state: {
      state: "trusted_local_repo",
      evidence_path: ".bandit/policy/input-quarantine.json"
    },
    input_quarantine_state: {
      state: "not_applicable",
      evidence_path: ".bandit/policy/input-quarantine.json"
    },
    supply_chain_state: {
      state: "not_touched",
      evidence_path: "package-lock.json"
    },
    smell_trigger_inputs: [],
    selected_review_depth: "pre_pr_coderabbit_plus_qwen",
    operator_supervision: {
      required: false,
      route: "none",
      rationale: "Low-risk repo-native documentation classification."
    },
    auto_landing: {
      eligible: true,
      refusal_rationale: "none"
    },
    rationale:
      "Complete low-risk classification includes all layered signals before auto-landing eligibility.",
    evidence_paths: [
      riskPolicyPath,
      riskTemplatePath,
      `docs/work/${workItemId}/brief.md`
    ],
    ...overrides
  };
}

function classificationPath(workItemId) {
  return `docs/risk/layered/${workItemId}-risk-classification.json`;
}

async function writeReviewEvidence(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "review-evidence.md"),
    `# Review Evidence: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
verification_state: pass
verification_evidence:
  - node --test test/risk-classification.test.mjs
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - Manual PM review replaces unavailable final gates during bootstrap.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - Local Qwen runtime is unavailable during bootstrap.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: No smell trigger requires escalation beyond baseline gates.
pm_disposition: pass
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

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
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
