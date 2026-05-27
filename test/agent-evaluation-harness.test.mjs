import assert from "node:assert/strict";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const committedTemplateRoot = path.join(repoRoot, "docs/templates");

const policyPath = ".bandit/policy/agent-evaluation-harness.json";
const packetTemplatePath = "docs/templates/agent-evaluation-packet.md";
const resultTemplatePath = "docs/templates/agent-evaluation-result.md";
const calibrationReadmePath = "docs/evaluation/agents/calibration/README.md";
const holdoutReadmePath = "docs/evaluation/agents/holdout/README.md";
const calibrationPacketPath =
  "docs/evaluation/agents/calibration/reviewer-packet-001.md";
const holdoutPacketPath =
  "docs/evaluation/agents/holdout/reviewer-packet-001.md";
const skillLifecyclePolicyPath =
  ".bandit/policy/skill-lifecycle-contracts.json";
const skillEvaluationPacketPath = "docs/evaluation/skills/bandit-cold-start.md";
const skillDriftEvidencePath =
  "docs/evaluation/skills/bandit-installed-skill-drift.md";

test("validate fails closed when the agent evaluation harness policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteAgentEvaluationEvidence(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/agent-evaluation-harness\.json/
  );
});

test("validate fails closed when the agent evaluation packet template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteAgentEvaluationEvidence(repo, {
    omitPacketTemplate: true
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/agent-evaluation-packet\.md/
  );
});

test("agent evaluation validation rejects contracts that can affect live routing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteAgentEvaluationEvidence(repo, {
    policy: completeAgentEvaluationPolicy({
      replay_only: false,
      automatic_policy_changes: true
    })
  });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /agent evaluation harness must be replay_only and must not allow automatic policy changes/
  );
});

test("agent evaluation validation rejects packet sets without calibration and locked holdout separation", async () => {
  const repo = await createInitializedRepo();
  const policy = completeAgentEvaluationPolicy();
  policy.benchmark_registry.packet_sets = [
    policy.benchmark_registry.packet_sets[0]
  ];
  await writeCompleteAgentEvaluationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /agent evaluation packet sets must include distinct calibration and locked_holdout evidence classes/
  );
});

test("agent evaluation validation rejects reviewer packets without gold labels and seeded cases", async () => {
  const repo = await createInitializedRepo();
  const policy = completeAgentEvaluationPolicy();
  policy.benchmark_registry.reviewer_packets[0].gold_labels = [];
  policy.benchmark_registry.reviewer_packets[0].seeded_non_issues = [];
  await writeCompleteAgentEvaluationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer benchmark packet BANDIT-039-reviewer-packet-001 must include gold labels, seeded blockers, seeded non-issues, expected observations, and scoring labels/
  );
});

test("agent evaluation validation rejects scorecards without required review-quality and cost metrics", async () => {
  const repo = await createInitializedRepo();
  const policy = completeAgentEvaluationPolicy();
  policy.scorecard.required_metrics = ["blocker_recall"];
  await writeCompleteAgentEvaluationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /scorecard missing required metric: missed_blockers/
  );
});

test("agent evaluation validation rejects one-off paid reviewer benchmarks without pricing evidence and approval", async () => {
  const repo = await createInitializedRepo();
  const policy = completeAgentEvaluationPolicy();
  policy.paid_reviewer_policy.one_off_benchmark_calls[0].approval = "";
  await writeCompleteAgentEvaluationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /one-off paid reviewer benchmark calls require current Provider Pricing Evidence and per-run approval or active spend-class approval/
  );
});

test("agent evaluation validation rejects recurring paid reviewer promotion without locked holdout thresholds", async () => {
  const repo = await createInitializedRepo();
  const policy = completeAgentEvaluationPolicy();
  delete policy.paid_reviewer_policy.recurring_promotion_thresholds[0]
    .minimum_blocker_recall_improvement_over_qwen;
  await writeCompleteAgentEvaluationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /recurring paid reviewer promotion thresholds require locked-holdout blocker-recall improvement over Qwen, false-positive ceiling, cost ceiling, spend-class approval, and scoped risk or stage capability profile/
  );
});

test("agent evaluation validation rejects skill variants without Skill Lifecycle Contract identity", async () => {
  const repo = await createInitializedRepo();
  const policy = completeAgentEvaluationPolicy();
  policy.benchmark_registry.benchmark_subjects[1].lifecycle_contract_path = "";
  await writeCompleteAgentEvaluationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /skill variant bandit-skill-v1 must reference stable Skill Lifecycle Contract identity and version evidence/
  );
});

test("agent evaluation validation accepts a complete replay-only benchmark contract", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteAgentEvaluationEvidence(repo);

  const result = await runBandit(repo, [
    "agent-evaluation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: policyPath,
    packet_sets: [
      {
        packet_set_id: "bandit-reviewer-calibration-v1",
        evidence_class: "calibration",
        version: "2026-05-27"
      },
      {
        packet_set_id: "bandit-reviewer-holdout-v1",
        evidence_class: "locked_holdout",
        version: "2026-05-27"
      }
    ],
    reviewer_packets: ["BANDIT-039-reviewer-packet-001"],
    benchmark_subjects: ["local-qwen-baseline", "bandit-skill-v1"],
    promotion_thresholds: ["paid-reviewer-high-risk-stage4"]
  });
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedTemplates(repo);
  await writeSmellCatalog(repo);
  await writeLocalQwenProfile(repo);
  return repo;
}

async function copyCommittedTemplates(repo) {
  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });
}

async function writeCompleteAgentEvaluationEvidence(repo, options = {}) {
  await writeCompleteSkillLifecycleEvidence(repo);

  if (options.omitPacketTemplate) {
    await rm(path.join(repo, packetTemplatePath), { force: true });
  } else {
    await writeFileAt(
      repo,
      packetTemplatePath,
      `# Agent Evaluation Packet Template

packet_id:
packet_source:
benchmark_mode:
benchmark_subject:
expected_observations:
gold_labels:
seeded_blockers:
seeded_non_issues:
scoring_labels:
result_artifact_path:
`
    );
  }

  await writeFileAt(
    repo,
    resultTemplatePath,
    `# Agent Evaluation Result Template

run_id:
packet_set_id:
subject_id:
scorecard:
blocker_recall:
missed_blockers:
actionable_precision:
useful_finding_yield:
false_positive_rate:
tool_friction:
latency:
provider_pricing_backed_expected_cost:
pricing_freshness_or_expiry:
spend_approval_state:
`
  );
  await writeFileAt(
    repo,
    calibrationReadmePath,
    "# Agent Evaluation Calibration Packets\n\nVisible packets for calibration only.\n"
  );
  await writeFileAt(
    repo,
    holdoutReadmePath,
    "# Agent Evaluation Locked Holdout Packets\n\nVersioned locked packets for promotion evidence.\n"
  );
  await writeFileAt(
    repo,
    calibrationPacketPath,
    "# Reviewer Packet 001\n\nRepo-derived calibration packet.\n"
  );
  await writeFileAt(
    repo,
    holdoutPacketPath,
    "# Reviewer Packet 001\n\nRepo-derived locked holdout packet.\n"
  );

  if (options.omitPolicy) {
    await rm(path.join(repo, policyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    policyPath,
    options.policy ?? completeAgentEvaluationPolicy()
  );
}

async function writeCompleteSkillLifecycleEvidence(repo) {
  await writeJson(repo, skillLifecyclePolicyPath, {
    contract_version: 1,
    policy_id: "skill-lifecycle-contracts",
    installed_skills_are_canonical: false,
    contracts: [
      {
        skill_id: "bandit",
        owner: "Codex PM",
        version: "1.0.0",
        changelog: [
          {
            date: "2026-05-27",
            summary: "Stable lifecycle identity for benchmark subjects."
          }
        ],
        intended_stages: ["stage2_red_evidence", "stage3_implementation"],
        required_tools: ["shell", "apply_patch"],
        forbidden_actions: ["approve_uat", "merge", "push", "deploy"],
        evaluation_packets: [skillEvaluationPacketPath],
        rollback_criteria: [
          "Benchmark packet replay detects a blocker-level regression."
        ],
        stage_bindings: [
          {
            stage: "stage2_red_evidence",
            capability: "route_next_bandit_stage",
            authority: "stage_scoped_capability"
          }
        ],
        installed_skill_drift: {
          evidence_path: skillDriftEvidencePath,
          expected_sha256: "b".repeat(64),
          required_before_policy_use: true
        }
      }
    ]
  });
  await writeFileAt(
    repo,
    skillEvaluationPacketPath,
    "# Bandit Skill Cold-Start Evaluation Packet\n\nRestore Bandit context from repo evidence.\n"
  );
  await writeFileAt(
    repo,
    skillDriftEvidencePath,
    `# Bandit Installed Skill Drift Evidence

skill_id: bandit
artifact_sha256: ${"b".repeat(64)}
disposition: matches_repo_contract
`
  );
}

function completeAgentEvaluationPolicy(overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "agent-evaluation-harness",
    replay_only: true,
    automatic_policy_changes: false,
    benchmark_registry: {
      packet_sets: [
        {
          packet_set_id: "bandit-reviewer-calibration-v1",
          evidence_class: "calibration",
          version: "2026-05-27",
          visibility: "visible",
          packet_paths: [calibrationPacketPath]
        },
        {
          packet_set_id: "bandit-reviewer-holdout-v1",
          evidence_class: "locked_holdout",
          version: "2026-05-27",
          visibility: "locked",
          packet_paths: [holdoutPacketPath]
        }
      ],
      benchmark_subjects: [
        {
          subject_id: "local-qwen-baseline",
          subject_type: "reviewer_profile",
          profile_path: ".bandit/reviewers/local-qwen.json"
        },
        {
          subject_id: "bandit-skill-v1",
          subject_type: "skill_variant",
          skill_id: "bandit",
          version: "1.0.0",
          lifecycle_contract_path: skillLifecyclePolicyPath
        }
      ],
      run_definitions: [
        {
          run_id: "reviewer-calibration-qwen",
          mode: "replay_only",
          subject_id: "local-qwen-baseline",
          packet_set_ids: ["bandit-reviewer-calibration-v1"],
          result_path:
            "docs/evaluation/agents/results/reviewer-calibration-qwen.md",
          allowed_effects: ["write_result_artifact"],
          forbidden_effects: [
            "live_work",
            "reviewer_routing",
            "model_routing",
            "skill_policy",
            "cost_policy",
            "paid_reviewer_policy",
            "workflow_policy"
          ]
        }
      ],
      reviewer_packets: [
        {
          packet_id: "BANDIT-039-reviewer-packet-001",
          source_work_item: "BANDIT-038",
          source_artifacts: ["docs/work/BANDIT-038/review-evidence.md"],
          derivation: "repo_derived",
          failure_mode: "skill_lifecycle_contract_drift",
          packet_path: calibrationPacketPath,
          gold_labels: ["blocker:missing_skill_version"],
          seeded_blockers: ["missing stable skill lifecycle version"],
          seeded_non_issues: ["template wording preference"],
          expected_observations: [
            "Reviewer flags missing skill lifecycle version evidence."
          ],
          scoring_labels: ["blocker_recall", "false_positive_rate"]
        }
      ]
    },
    scorecard: {
      primary_metric: "blocker_recall",
      required_metrics: [
        "blocker_recall",
        "missed_blockers",
        "actionable_precision",
        "useful_finding_yield",
        "false_positive_rate",
        "tool_friction",
        "latency",
        "provider_pricing_backed_expected_cost",
        "pricing_freshness_or_expiry",
        "spend_approval_state"
      ]
    },
    paid_reviewer_policy: {
      one_off_benchmark_calls: [
        {
          subject_id: "paid-opus-reviewer",
          spend_class: "benchmark_evaluation",
          provider_pricing_evidence_id: "opus-reviewer-2026-05-27",
          approval: "per_run_approval_required"
        }
      ],
      recurring_promotion_thresholds: [
        {
          threshold_id: "paid-reviewer-high-risk-stage4",
          applies_to_risk_class: "high_risk_review",
          applies_to_stage_capability_profile: "stage4_review",
          evidence_class: "locked_holdout",
          minimum_blocker_recall_improvement_over_qwen: 0.15,
          false_positive_rate_ceiling: 0.2,
          expected_cost_ceiling: "5.00 USD",
          provider_pricing_evidence_id: "opus-reviewer-2026-05-27",
          spend_class_approval: "operator_supervised_required"
        }
      ],
      provider_pricing_evidence: [
        {
          pricing_evidence_id: "opus-reviewer-2026-05-27",
          provider: "anthropic",
          model_or_profile: "opus-reviewer",
          pricing_source: "operator-provided benchmark fixture",
          captured_date: "2026-05-27",
          effective_date: "2026-05-27",
          freshness_rule: "expires_after_30_days",
          expected_per_run_cost: "3.00 USD",
          spend_class: "benchmark_evaluation",
          approval_owner: "operator"
        }
      ]
    },
    ...overrides
  };
}

async function writeSmellCatalog(repo) {
  await writeJson(repo, ".bandit/policy/smell-triggers.json", {
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
      }
    ]
  });
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
