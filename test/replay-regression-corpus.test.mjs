import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const binPath = path.join(repoRoot, "bin/bandit.mjs");

test("replay-regression-corpus validate emits deterministic replay output and preserves live state", async () => {
  const repo = await createInitializedRepo();
  await writeReplayPolicy(repo, {
    dispositions: [
      disposition("dropped_bootstrap_metadata"),
      disposition("parser_wording_drift"),
      disposition("weak_reviewer_disposition"),
      disposition("stale_routing_text")
    ]
  });
  await writeReplayPacket(repo, "provider-timeout-refusal.json", {
    id: "provider-timeout-refusal",
    failure_mode: "provider_timeout_refusal",
    source_artifacts: ["docs/work/BANDIT-072/coderabbit-formation-review.md"],
    expected_gate: "stage4_review",
    expected_verdict: "bootstrap_gap",
    simulated_gate: {
      verdict: "bootstrap_gap",
      diagnostics: ["provider timeout recorded without claiming pass"]
    }
  });
  await writeReplayPacket(repo, "stale-review-subject-hash.json", {
    id: "stale-review-subject-hash",
    failure_mode: "stale_review_subject_hash",
    source_artifacts: ["docs/work/BANDIT-019/retrospective.md"],
    expected_gate: "stage4_review",
    expected_verdict: "blocker",
    simulated_gate: {
      verdict: "blocker",
      diagnostics: ["review subject hash mismatch"]
    }
  });
  await writeReplayPacket(repo, "dirty-worktree.json", {
    id: "dirty-worktree",
    failure_mode: "dirty_worktree",
    source_artifacts: ["docs/work/BANDIT-064/local-qwen-review.md"],
    expected_gate: "reviewer_runtime",
    expected_verdict: "blocker",
    simulated_gate: {
      verdict: "blocker",
      diagnostics: ["dirty worktree blocks reviewer refresh"]
    }
  });
  await writeLiveStateSentinels(repo);
  const before = await readLiveStateSentinels(repo);

  const result = await runBandit(repo, [
    "replay-regression-corpus",
    "validate",
    "--json"
  ]);
  const after = await readLiveStateSentinels(repo);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(after, before);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: ".bandit/policy/replay-regression-corpus.json",
    packet_count: 3,
    covered_failure_modes: [
      "dirty_worktree",
      "provider_timeout_refusal",
      "stale_review_subject_hash"
    ],
    dispositioned_failure_modes: [
      "dropped_bootstrap_metadata",
      "parser_wording_drift",
      "stale_routing_text",
      "weak_reviewer_disposition"
    ],
    packets: [
      {
        id: "dirty-worktree",
        failure_mode: "dirty_worktree",
        source_artifacts: ["docs/work/BANDIT-064/local-qwen-review.md"],
        expected_gate: "reviewer_runtime",
        expected_verdict: "blocker",
        actual_verdict: "blocker",
        diagnostics: ["dirty worktree blocks reviewer refresh"]
      },
      {
        id: "provider-timeout-refusal",
        failure_mode: "provider_timeout_refusal",
        source_artifacts: ["docs/work/BANDIT-072/coderabbit-formation-review.md"],
        expected_gate: "stage4_review",
        expected_verdict: "bootstrap_gap",
        actual_verdict: "bootstrap_gap",
        diagnostics: ["provider timeout recorded without claiming pass"]
      },
      {
        id: "stale-review-subject-hash",
        failure_mode: "stale_review_subject_hash",
        source_artifacts: ["docs/work/BANDIT-019/retrospective.md"],
        expected_gate: "stage4_review",
        expected_verdict: "blocker",
        actual_verdict: "blocker",
        diagnostics: ["review subject hash mismatch"]
      }
    ],
    replay_only: {
      read_only: true,
      no_live_routing: true,
      no_policy_promotion: true
    }
  });
});

test("replay-regression-corpus validate rejects malformed packets and replay authority expansion", async () => {
  const repo = await createInitializedRepo();
  await writeReplayPolicy(repo, {
    requiredFailureModes: ["stale_review_subject_hash"]
  });
  await writeJson(repo, "docs/replay-packets/bad-packet.json", {
    schema_version: 99,
    id: "bad-packet",
    failure_mode: "stale_review_subject_hash",
    source_artifacts: [],
    expected_gate: "stage4_review",
    expected_verdict: "blocker",
    command_version: 1,
    replay_only: {
      read_only: true,
      no_live_routing: true,
      no_policy_promotion: false
    },
    simulated_gate: {
      verdict: "blocker",
      diagnostics: []
    }
  });

  const result = await runBandit(repo, [
    "replay-regression-corpus",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /bad-packet/);
  assert.match(result.stderr, /unsupported schema_version 99/);
  assert.match(result.stderr, /missing source_artifacts/);
  assert.match(result.stderr, /missing policy_version/);
  assert.match(result.stderr, /replay_only.no_policy_promotion must be true/);
  assert.match(result.stderr, /simulated_gate.diagnostics must list at least one diagnostic/);
});

test("replay-regression-corpus validate requires packet schema authority fields", async () => {
  const repo = await createInitializedRepo();
  await writeReplayPolicy(repo, {
    requiredFailureModes: ["stale_review_subject_hash"]
  });
  await writeJson(repo, "docs/replay-packets/missing-authority.json", {
    schema_version: 1,
    id: "missing-authority",
    source_artifacts: ["docs/work/BANDIT-019/review-evidence.md"],
    policy_version: 1,
    replay_only: {
      no_policy_promotion: true
    },
    simulated_gate: {
      verdict: "blocker",
      diagnostics: ["review subject hash mismatch"]
    }
  });

  const result = await runBandit(repo, [
    "replay-regression-corpus",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing-authority/);
  assert.match(result.stderr, /missing failure_mode/);
  assert.match(result.stderr, /missing expected_gate/);
  assert.match(result.stderr, /missing expected_verdict/);
  assert.match(result.stderr, /missing command_version/);
  assert.match(result.stderr, /replay_only.read_only must be true/);
  assert.match(result.stderr, /replay_only.no_live_routing must be true/);
});

test("replay-regression-corpus validate rejects packet values outside policy taxonomy", async () => {
  const repo = await createInitializedRepo();
  await writeReplayPolicy(repo, {
    requiredFailureModes: ["stale_review_subject_hash"]
  });
  await writeReplayPacket(repo, "outside-taxonomy.json", {
    id: "outside-taxonomy",
    failure_mode: "ungrounded_chat_memory",
    source_artifacts: ["docs/work/BANDIT-019/review-evidence.md"],
    expected_gate: "paid_model_router",
    expected_verdict: "promote",
    simulated_gate: {
      verdict: "promote",
      diagnostics: ["packet attempted live policy promotion"]
    }
  });

  const result = await runBandit(repo, [
    "replay-regression-corpus",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /outside-taxonomy/);
  assert.match(result.stderr, /failure_mode ungrounded_chat_memory is not in policy required_failure_modes/);
  assert.match(result.stderr, /expected_gate paid_model_router is not in policy expected_gates/);
  assert.match(result.stderr, /expected_verdict promote is not in policy expected_verdicts/);
});

test("replay-regression-corpus validate fails closed when an expected blocker is missed", async () => {
  const repo = await createInitializedRepo();
  await writeReplayPolicy(repo, {
    requiredFailureModes: ["stale_review_subject_hash"]
  });
  await writeReplayPacket(repo, "missed-stale-review-hash.json", {
    id: "missed-stale-review-hash",
    failure_mode: "stale_review_subject_hash",
    source_artifacts: ["docs/work/BANDIT-019/review-evidence.md"],
    expected_gate: "stage4_review",
    expected_verdict: "blocker",
    simulated_gate: {
      verdict: "pass",
      diagnostics: ["gate accepted stale review evidence"]
    }
  });

  const result = await runBandit(repo, [
    "replay-regression-corpus",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missed-stale-review-hash/);
  assert.match(result.stderr, /expected verdict blocker but replay produced pass/);
  assert.match(result.stderr, /known failure mode would not fail closed/);
});

test("replay-regression-corpus validate requires every required failure mode to be packeted or dispositioned", async () => {
  const repo = await createInitializedRepo();
  await writeReplayPolicy(repo, {
    requiredFailureModes: [
      "stale_review_subject_hash",
      "provider_timeout_refusal",
      "dirty_worktree"
    ],
    dispositions: [disposition("provider_timeout_refusal")]
  });
  await writeReplayPacket(repo, "stale-review-subject-hash.json", {
    id: "stale-review-subject-hash",
    failure_mode: "stale_review_subject_hash",
    source_artifacts: ["docs/work/BANDIT-019/retrospective.md"],
    expected_gate: "stage4_review",
    expected_verdict: "blocker",
    simulated_gate: {
      verdict: "blocker",
      diagnostics: ["review subject hash mismatch"]
    }
  });

  const result = await runBandit(repo, [
    "replay-regression-corpus",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /required failure mode dirty_worktree is missing a replay packet or explicit disposition/
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
  const repo = await mkdtemp(path.join(tmpdir(), "bandit-replay-corpus-"));
  await runBandit(repo, ["init"]);
  return repo;
}

async function writeReplayPolicy(repo, options = {}) {
  await writeJson(repo, ".bandit/policy/replay-regression-corpus.json", {
    version: 1,
    packet_schema_version: 1,
    command_version: 1,
    required_failure_modes: options.requiredFailureModes ?? [
      "stale_review_subject_hash",
      "provider_timeout_refusal",
      "dirty_worktree",
      "dropped_bootstrap_metadata",
      "parser_wording_drift",
      "weak_reviewer_disposition",
      "stale_routing_text"
    ],
    expected_verdicts: ["pass", "blocker", "non_blocking", "bootstrap_gap"],
    expected_gates: [
      "stage4_review",
      "stage5_landing",
      "coordination_validate",
      "session_context",
      "reviewer_runtime"
    ],
    replay_only: {
      read_only: true,
      no_live_routing: true,
      no_policy_promotion: true
    },
    failure_mode_dispositions: options.dispositions ?? []
  });
}

async function writeReplayPacket(repo, fileName, overrides) {
  await writeJson(repo, `docs/replay-packets/${fileName}`, {
    schema_version: 1,
    policy_version: 1,
    command_version: 1,
    replay_only: {
      read_only: true,
      no_live_routing: true,
      no_policy_promotion: true
    },
    ...overrides
  });
}

function disposition(failureMode) {
  return {
    failure_mode: failureMode,
    disposition: "explicit_no_action",
    source_artifact: "docs/work/BANDIT-072/brief.md",
    rationale: `${failureMode} is acknowledged for this focused replay fixture set`
  };
}

async function writeLiveStateSentinels(repo) {
  await writeJson(repo, ".bandit/bootstrap-gaps.json", {
    version: 1,
    gaps: [
      {
        id: "BANDIT-GAP-SENTINEL",
        title: "Sentinel",
        status: "active",
        linked_work_item: "BANDIT-999",
        source_artifacts: ["docs/work/BANDIT-999/brief.md"],
        next_action: "Do not mutate during replay validation."
      }
    ]
  });
  await writeFileAt(
    repo,
    "docs/work/BANDIT-999/coordination-log.jsonl",
    `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: "BANDIT-999",
      sequence: 1,
      timestamp: "2026-06-07T00:00:00Z",
      actor: "repo_pm",
      source: "sentinel",
      state: "brief_created",
      evidence: ["docs/work/BANDIT-999/brief.md"],
      safe_triggers: ["formation_required"],
      next_action: "Do not mutate during replay validation.",
      accountable_actor: "repo_pm",
      accepted_block: null
    })}\n`
  );
  await writeFileAt(
    repo,
    "docs/roadmap/CURRENT_CONTEXT.md",
    "# Current Context\n\nSentinel content must not change.\n"
  );
}

async function readLiveStateSentinels(repo) {
  return {
    gaps: await readFile(path.join(repo, ".bandit/bootstrap-gaps.json"), "utf8"),
    coordination: await readFile(
      path.join(repo, "docs/work/BANDIT-999/coordination-log.jsonl"),
      "utf8"
    ),
    currentContext: await readFile(
      path.join(repo, "docs/roadmap/CURRENT_CONTEXT.md"),
      "utf8"
    )
  };
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, contents) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
}
