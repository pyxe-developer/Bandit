import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const policyPath = ".bandit/policy/reviewer-calibration.json";
const packetPath =
  "docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json";
const qwenProfilePath = ".bandit/reviewers/local-qwen.json";
const landingPolicyPath = ".bandit/policy/landing-agent.json";

test("reviewer calibration accepts replay-only seeded packets and deterministic scoring output", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteCalibrationEvidence(repo);

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "pass");
  assert.equal(report.policy, policyPath);
  assert.deepEqual(report.packets, ["BANDIT-075-reviewer-packet-001"]);
  assert.equal(report.scorecard.primary_metric, "blocker_recall");
  assert.equal(report.scorecard.blocker_recall, 1);
  assert.equal(report.scorecard.actionable_precision, 1);
  assert.equal(report.scorecard.useful_finding_yield, 1);
  assert.equal(report.scorecard.false_positive_rate, 0);
  assert.deepEqual(report.provider_evidence_statuses, ["provider_timeout"]);
  assert.equal(report.boundaries.replay_only, true);
  assert.equal(report.boundaries.no_live_routing, true);
});

test("reviewer calibration rejects policies that can affect live reviewer routing", async () => {
  const repo = await createInitializedRepo();
  const policy = completeCalibrationPolicy({
    no_live_routing: false,
    automatic_reviewer_routing_changes: true
  });
  await writeCompleteCalibrationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration must be replay-only and cannot mutate live reviewer routing/
  );
});

test("reviewer calibration rejects packet sets without repo-derived Bandit failure modes", async () => {
  const repo = await createInitializedRepo();
  const packet = completeCalibrationPacket({
    packet_source: "generic_coding_task",
    failure_mode_category: "generic_style_issue",
    source_artifacts: ["docs/external/generic-benchmark.md"]
  });
  await writeCompleteCalibrationEvidence(repo, { packet });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration requires repo-derived Bandit workflow failure-mode packets before generic benchmark tasks/
  );
});

test("reviewer calibration rejects packets without blocker and non-issue gold labels", async () => {
  const repo = await createInitializedRepo();
  const packet = completeCalibrationPacket({
    seeded_cases: [
      {
        case_id: "seeded-blocker-direct-qwen",
        label: "blocker",
        expected_finding_class: "unauthorized_reviewer_route",
        severity: "blocker",
        rationale: "Direct qwen CLI reviewer evidence is forbidden."
      }
    ]
  });
  await writeCompleteCalibrationEvidence(repo, { packet });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration packet BANDIT-075-reviewer-packet-001 must include gold-labeled seeded blockers and seeded non-issues/
  );
});

test("reviewer calibration rejects policies that do not name any packets", async () => {
  const repo = await createInitializedRepo();
  const policy = completeCalibrationPolicy({ packets: [] });
  await writeCompleteCalibrationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration policy must name at least one packet/
  );
});

test("reviewer calibration rejects packets with missing failure-mode provenance", async () => {
  const repo = await createInitializedRepo();
  const packet = completeCalibrationPacket({
    failure_mode_category: "",
    source_artifacts: []
  });
  await writeCompleteCalibrationEvidence(repo, { packet });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration packet BANDIT-075-reviewer-packet-001 must include failure_mode_category and source_artifacts/
  );
});

test("reviewer calibration rejects seeded cases missing required gold-label fields", async () => {
  const repo = await createInitializedRepo();
  const packet = completeCalibrationPacket({
    seeded_cases: [
      {
        case_id: "seeded-blocker-direct-qwen",
        label: "blocker",
        expected_finding_class: "",
        severity: "blocker",
        rationale: "Direct qwen CLI reviewer evidence is forbidden."
      },
      {
        case_id: "seeded-non-issue-mlx-adapter",
        label: "non_issue",
        expected_finding_class: "authorized_mlx_adapter_route",
        severity: "none",
        rationale: "The configured MLX adapter route is authorized."
      }
    ]
  });
  await writeCompleteCalibrationEvidence(repo, { packet });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration packet BANDIT-075-reviewer-packet-001 seeded case seeded-blocker-direct-qwen missing required field: expected_finding_class/
  );
});

test("reviewer calibration rejects raw finding count as the primary scoring metric", async () => {
  const repo = await createInitializedRepo();
  const policy = completeCalibrationPolicy({
    scorecard: {
      ...completeCalibrationPolicy().scorecard,
      primary_metric: "raw_finding_count",
      raw_finding_count_primary: true
    }
  });
  await writeCompleteCalibrationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewer calibration scorecard must prioritize blocker_recall and cannot use raw finding count as the primary score/
  );
});

test("reviewer calibration rejects direct qwen CLI reviewer eligibility", async () => {
  const repo = await createInitializedRepo();
  const policy = completeCalibrationPolicy({
    reviewer_eligibility: {
      ...completeCalibrationPolicy().reviewer_eligibility,
      allowed_routes: [
        {
          reviewer_id: "local-qwen-baseline",
          route: "direct_qwen_cli",
          command: "qwen"
        }
      ]
    }
  });
  await writeCompleteCalibrationEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /direct qwen CLI is not an authorized Bandit reviewer route/
  );
});

test("reviewer calibration is read-only for live reviewer and landing policies", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteCalibrationEvidence(repo);
  await writeJson(repo, qwenProfilePath, {
    type: "openai_compatible",
    contract_version: 1,
    profile_id: "local-qwen-baseline",
    route: "mlx_openai_adapter"
  });
  await writeJson(repo, landingPolicyPath, {
    version: 1,
    authority: "cli_owned_landing_agent",
    supported_actions: ["local_record"]
  });
  const qwenBefore = await readFile(path.join(repo, qwenProfilePath), "utf8");
  const landingBefore = await readFile(path.join(repo, landingPolicyPath), "utf8");

  const result = await runBandit(repo, [
    "reviewer-calibration",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.equal(await readFile(path.join(repo, qwenProfilePath), "utf8"), qwenBefore);
  assert.equal(
    await readFile(path.join(repo, landingPolicyPath), "utf8"),
    landingBefore
  );
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  return repo;
}

async function writeCompleteCalibrationEvidence(repo, options = {}) {
  await writeJson(
    repo,
    policyPath,
    options.policy ?? completeCalibrationPolicy()
  );
  await writeJson(
    repo,
    packetPath,
    options.packet ?? completeCalibrationPacket()
  );
}

function completeCalibrationPolicy(overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "reviewer-calibration",
    replay_only: true,
    no_live_routing: true,
    automatic_reviewer_routing_changes: false,
    packet_schema: {
      required_fields: [
        "packet_id",
        "packet_source",
        "failure_mode_category",
        "source_artifacts",
        "seeded_cases",
        "reviewer_outputs"
      ],
      required_seeded_case_fields: [
        "case_id",
        "label",
        "expected_finding_class",
        "severity",
        "rationale"
      ],
      allowed_labels: ["blocker", "non_issue"]
    },
    packet_source_policy: {
      require_repo_derived_bandit_failure_modes: true,
      generic_only_first_harness_acceptance: false
    },
    reviewer_eligibility: {
      allowed_routes: [
        {
          reviewer_id: "local-qwen-baseline",
          route: "mlx_openai_adapter",
          config_path: ".bandit/reviewers/local-qwen.json",
          command: "node bin/omlx-chat-completions.mjs"
        },
        {
          reviewer_id: "coderabbit-cli",
          route: "coderabbit_cli",
          command: "coderabbit review --agent"
        }
      ],
      forbidden_routes: ["direct_qwen_cli"],
      provider_refusal_handling:
        "record_as_calibration_evidence_without_live_gate_waiver"
    },
    scorecard: {
      primary_metric: "blocker_recall",
      required_metrics: [
        "blocker_recall",
        "actionable_precision",
        "useful_finding_yield",
        "false_positive_rate",
        "tool_friction",
        "latency",
        "cost"
      ],
      raw_finding_count_primary: false
    },
    boundaries: {
      can_mutate_live_reviewer_routing: false,
      can_mutate_landing_authority: false,
      requires_separate_policy_promotion: true
    },
    packets: [packetPath],
    ...overrides
  };
}

function completeCalibrationPacket(overrides = {}) {
  return {
    contract_version: 1,
    packet_id: "BANDIT-075-reviewer-packet-001",
    packet_source: "repo_derived_bandit_failure_mode",
    failure_mode_category: "unauthorized_reviewer_route",
    source_artifacts: [
      "docs/work/BANDIT-075/brief.md",
      "docs/work/BANDIT-075/qwen-formation-review.md"
    ],
    seeded_cases: [
      {
        case_id: "seeded-blocker-direct-qwen",
        label: "blocker",
        expected_finding_class: "unauthorized_reviewer_route",
        severity: "blocker",
        rationale: "Direct qwen CLI reviewer evidence is forbidden."
      },
      {
        case_id: "seeded-non-issue-mlx-adapter",
        label: "non_issue",
        expected_finding_class: "authorized_mlx_adapter_route",
        severity: "none",
        rationale: "The configured MLX adapter route is authorized."
      }
    ],
    reviewer_outputs: [
      {
        reviewer_id: "local-qwen-baseline",
        route: "mlx_openai_adapter",
        status: "completed",
        tool_friction: "none",
        latency_ms: 1200,
        cost_usd: 0,
        findings: [
          {
            case_id: "seeded-blocker-direct-qwen",
            finding_class: "unauthorized_reviewer_route",
            severity: "blocker",
            actionable: true
          }
        ]
      },
      {
        reviewer_id: "coderabbit-cli",
        route: "coderabbit_cli",
        status: "provider_timeout",
        tool_friction: "provider_timeout_after_600s",
        latency_ms: null,
        cost_usd: null,
        findings: []
      }
    ],
    ...overrides
  };
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
