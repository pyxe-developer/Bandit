import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit, writeWorkBrief } from "./helpers/bandit-cli.mjs";

const POLICY_PATH = ".bandit/policy/agent-observability.json";
const TRACE_PATH =
  "docs/agent-observability/BANDIT-053-agent-observability-trace.json";

test("agent-observability validate accepts a complete trace policy and trace fixture", async () => {
  const repo = await createInitializedAgentObservabilityRepo();
  await writeCompleteAgentObservabilityFixture(repo);

  const result = await runBandit(repo, [
    "agent-observability",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "pass");
  assert.equal(report.policy, POLICY_PATH);
  assert.deepEqual(report.traces, [TRACE_PATH]);
  assert.equal(report.authority, "derived_non_canonical");
});

test("agent-observability validate requires operation span work item and stage correlation", async () => {
  const repo = await createInitializedAgentObservabilityRepo();
  const trace = completeAgentObservabilityTrace();
  delete trace.spans[0].correlation.work_item;
  delete trace.spans[0].correlation.stage;
  await writeCompleteAgentObservabilityFixture(repo, { trace });

  const result = await runBandit(repo, [
    "agent-observability",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /operation span correlation requires work_item and stage/
  );
});

test("agent-observability project reports non-canonical cost, latency, retry, and failure signals", async () => {
  const repo = await createInitializedAgentObservabilityRepo();
  await writeCompleteAgentObservabilityFixture(repo);

  const result = await runBandit(repo, [
    "agent-observability",
    "project",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.authority, "derived_non_canonical");
  assert.equal(report.cost_signals.total_tokens, 1900);
  assert.equal(report.latency_signals.total_ms, 4300);
  assert.equal(report.retry_signals.total_retries, 1);
  assert.deepEqual(report.failure_patterns, ["tool_timeout"]);
});

test("agent-observability validate rejects trace or projection authority over canonical repo artifacts", async () => {
  const repo = await createInitializedAgentObservabilityRepo();
  const policy = completeAgentObservabilityPolicy();
  policy.projection_boundary.can_satisfy_required_workflow_artifacts = true;
  await writeCompleteAgentObservabilityFixture(repo, { policy });

  const result = await runBandit(repo, [
    "agent-observability",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /observability traces and projections cannot replace canonical repo artifacts/
  );
});

test("agent-observability validate keeps external trace payloads data-only", async () => {
  const repo = await createInitializedAgentObservabilityRepo();
  const trace = completeAgentObservabilityTrace();
  trace.spans[0].external_payload = {
    source: "github_issue",
    handling: "instruction_bearing"
  };
  await writeCompleteAgentObservabilityFixture(repo, { trace });

  const result = await runBandit(repo, [
    "agent-observability",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /external trace payloads must remain data-only/
  );
});

async function createInitializedAgentObservabilityRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writeCompleteAgentObservabilityFixture(repo, options = {}) {
  await writeWorkBrief(repo, "BANDIT-053", "Agent Observability Traces");
  await writeFileAt(repo, "docs/work/BANDIT-053/red-evidence.md", "# RED Evidence\n");

  await writeJson(
    repo,
    POLICY_PATH,
    options.policy ?? completeAgentObservabilityPolicy()
  );
  await writeJson(
    repo,
    TRACE_PATH,
    options.trace ?? completeAgentObservabilityTrace()
  );
}

function completeAgentObservabilityPolicy() {
  return {
    contract_version: 1,
    policy_id: "agent-observability-traces",
    trace_shape: {
      required_fields: [
        "trace_id",
        "work_item",
        "stage",
        "actor",
        "started_at",
        "ended_at",
        "outcome",
        "spans"
      ],
      required_span_fields: [
        "span_id",
        "operation_kind",
        "started_at",
        "ended_at",
        "correlation",
        "outcome"
      ],
      operation_kinds: [
        "wake_decision",
        "claim_operation",
        "tool_call",
        "reviewer_run",
        "model_call",
        "validation_gate",
        "failure",
        "closeout_outcome"
      ]
    },
    correlation_requirements: [
      "work_item",
      "stage",
      "actor_identity",
      "source_artifacts",
      "authorizing_boundary"
    ],
    projection_boundary: {
      authority: "derived_non_canonical",
      can_satisfy_required_workflow_artifacts: false
    },
    token_cost_boundary: {
      signal_only: true,
      can_authorize_paid_routing: false
    },
    input_quarantine_boundary: {
      external_payloads: "data_only"
    }
  };
}

function completeAgentObservabilityTrace() {
  return {
    contract_version: 1,
    trace_id: "trace-bandit-053-red",
    work_item: "BANDIT-053",
    stage: "Stage 2",
    actor: {
      identity: "codex_pm",
      role: "Test Writer"
    },
    started_at: "2026-05-29T08:30:00Z",
    ended_at: "2026-05-29T08:30:04Z",
    outcome: "red_recorded",
    source_artifacts: [
      "docs/work/BANDIT-053/brief.md",
      "docs/work/BANDIT-053/red-evidence.md"
    ],
    spans: [
      {
        span_id: "span-wake-noop",
        operation_kind: "wake_decision",
        started_at: "2026-05-29T08:30:00Z",
        ended_at: "2026-05-29T08:30:01Z",
        correlation: {
          work_item: "BANDIT-053",
          stage: "Stage 2",
          wake_decision: "no_op",
          actor_identity: "codex_pm",
          authorizing_boundary: "docs/roadmap/CURRENT_CONTEXT.md"
        },
        latency_ms: 1000,
        retry_count: 0,
        token_count: 0,
        outcome: "no_op"
      },
      {
        span_id: "span-model-call",
        operation_kind: "model_call",
        started_at: "2026-05-29T08:30:01Z",
        ended_at: "2026-05-29T08:30:04Z",
        correlation: {
          work_item: "BANDIT-053",
          stage: "Stage 2",
          actor_identity: "codex_pm",
          model_profile: "codex_pm",
          authorizing_boundary: "docs/work/BANDIT-053/brief.md"
        },
        latency_ms: 3000,
        retry_count: 1,
        token_count: 1900,
        failure_type: "tool_timeout",
        outcome: "failed_then_recovered"
      },
      {
        span_id: "span-validation",
        operation_kind: "validation_gate",
        started_at: "2026-05-29T08:30:04Z",
        ended_at: "2026-05-29T08:30:04Z",
        correlation: {
          work_item: "BANDIT-053",
          stage: "Stage 2",
          actor_identity: "codex_pm",
          source_artifacts: ["test/agent-observability.test.mjs"],
          authorizing_boundary: "docs/verification/STAGE_RUBRICS.md"
        },
        latency_ms: 300,
        retry_count: 0,
        token_count: 0,
        outcome: "red_expected"
      }
    ]
  };
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const target = path.join(repo, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}
