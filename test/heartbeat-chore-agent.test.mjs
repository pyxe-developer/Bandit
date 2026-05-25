import assert from "node:assert/strict";
import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
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
const committedPolicyRoot = path.join(repoRoot, ".bandit/policy");

test("heartbeat inspect reports eligible active bootstrap-gap chores without mutating state", async () => {
  const repo = await createInitializedRepo();
  await writeHeartbeatPolicy(repo, validHeartbeatPolicy());
  await writeChoreBrief(
    repo,
    "BANDIT-001",
    "Heartbeat Candidate",
    "Brief Created"
  );
  await writeBootstrapGapLedger(repo, [
    bootstrapGap({
      id: "BANDIT-GAP-HEARTBEAT-CHORE-AGENT",
      status: "active",
      disposition: "active_chore",
      linked_work_item: "BANDIT-001",
      next_action: "Create RED evidence for BANDIT-001."
    })
  ]);
  const eventsBefore = await readFile(
    path.join(repo, ".bandit/events.jsonl"),
    "utf8"
  );

  const result = await runBandit(repo, ["heartbeat", "inspect", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.action, "inspect");
  assert.equal(output.policy, ".bandit/policy/heartbeat-chore-agent.json");
  assert.deepEqual(output.candidates, [
    {
      work_item: "BANDIT-001",
      status: "eligible",
      reason: "active bootstrap-gap chore",
      allowed_next_action: "create_red_evidence",
      evidence: [
        "docs/work/BANDIT-001/brief.md",
        ".bandit/bootstrap-gaps.json",
        ".bandit/policy/heartbeat-chore-agent.json"
      ]
    }
  ]);
  assert.equal(
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8"),
    eventsBefore
  );
});

test("heartbeat inspect reports due retrospective-derived improvement evaluations", async () => {
  const repo = await createInitializedRepo();
  await writeHeartbeatPolicy(repo, validHeartbeatPolicy());
  await writeImprovementChoreBrief(repo, "BANDIT-002", {
    status: "Evaluation Pending",
    evaluation_window: "due_on: 2026-05-25",
    outcome: "pending"
  });

  const result = await runBandit(repo, [
    "heartbeat",
    "inspect",
    "--as-of",
    "2026-05-25",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(output.candidates, [
    {
      work_item: "BANDIT-002",
      status: "eligible",
      reason: "due improvement evaluation",
      allowed_next_action: "record_improvement_evaluation",
      evidence: [
        "docs/work/BANDIT-002/brief.md",
        ".bandit/policy/heartbeat-chore-agent.json"
      ]
    }
  ]);
});

test("heartbeat inspect marks feature slices requiring UAT as ineligible", async () => {
  const repo = await createInitializedRepo();
  await writeHeartbeatPolicy(repo, validHeartbeatPolicy());
  await writeFeatureSliceBrief(repo, "BANDIT-003", {
    status: "Review Recorded"
  });

  const result = await runBandit(repo, ["heartbeat", "inspect", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(output.candidates, [
    {
      work_item: "BANDIT-003",
      status: "ineligible",
      reason: "feature slice requires operator-owned UAT",
      allowed_next_action: null,
      evidence: ["docs/work/BANDIT-003/brief.md"]
    }
  ]);
});

test("heartbeat inspect reports operator-input blocked chores without guessing", async () => {
  const repo = await createInitializedRepo();
  await writeHeartbeatPolicy(repo, validHeartbeatPolicy());
  await writeChoreBrief(repo, "BANDIT-004", "Blocked Chore", "Blocked");
  await writeBootstrapGapLedger(repo, [
    bootstrapGap({
      id: "BANDIT-GAP-PAID-REVIEWER",
      status: "operator_input_blocked",
      disposition: "operator_input_blocker",
      linked_work_item: "BANDIT-004",
      source_artifacts: ["docs/work/BANDIT-004/brief.md"],
      rationale: "Missing paid reviewer budget approval.",
      next_action: "Wait for operator cost approval."
    })
  ]);

  const result = await runBandit(repo, ["heartbeat", "inspect", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(output.candidates, [
    {
      work_item: "BANDIT-004",
      status: "operator_input_blocked",
      reason: "Missing paid reviewer budget approval.",
      required_input: "Wait for operator cost approval.",
      allowed_next_action: null,
      evidence: [
        "docs/work/BANDIT-004/brief.md",
        ".bandit/bootstrap-gaps.json"
      ]
    }
  ]);
});

test("heartbeat refuses unsupported automation actions before touching state", async () => {
  const repo = await createInitializedRepo();
  await writeHeartbeatPolicy(repo, validHeartbeatPolicy());
  await writeChoreBrief(
    repo,
    "BANDIT-005",
    "Landing Refusal",
    "Review Recorded"
  );
  const eventsBefore = await readFile(
    path.join(repo, ".bandit/events.jsonl"),
    "utf8"
  );

  const result = await runBandit(repo, ["heartbeat", "land", "BANDIT-005"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Heartbeat chore agent cannot perform unsupported action: land/
  );
  assert.equal(
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8"),
    eventsBefore
  );
});

test("heartbeat fails closed when policy would allow hidden workflow authority", async () => {
  const repo = await createInitializedRepo();
  await writeHeartbeatPolicy(repo, {
    ...validHeartbeatPolicy(),
    allowed_actions: ["inspect", "land"]
  });
  await writeChoreBrief(repo, "BANDIT-006", "Malformed Policy", "Brief Created");

  const result = await runBandit(repo, ["heartbeat", "inspect", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Heartbeat policy cannot allow hidden workflow authority: land/
  );
  assert.equal(
    await pathExists(path.join(repo, "docs/work/BANDIT-006/red-evidence.md")),
    false
  );
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });
  await cp(committedPolicyRoot, path.join(repo, ".bandit/policy"), {
    recursive: true
  });
  await writeLocalQwenProfile(repo);
  return repo;
}

async function writeHeartbeatPolicy(repo, policy) {
  const destination = path.join(repo, ".bandit/policy/heartbeat-chore-agent.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

function validHeartbeatPolicy() {
  return {
    contract_version: 1,
    policy_id: "heartbeat-chore-agent",
    allowed_actions: ["inspect", "prepare_evidence"],
    forbidden_actions: [
      "land",
      "merge",
      "push",
      "deploy",
      "feature_implementation",
      "uat_approval"
    ],
    eligible_work_kinds: ["chore", "improvement_chore"],
    required_state_sources: [
      "docs/work",
      ".bandit/bootstrap-gaps.json",
      ".bandit/policy/heartbeat-chore-agent.json"
    ],
    dirty_worktree_behavior: "fail_closed",
    operator_input_behavior: "report_and_halt"
  };
}

async function writeChoreBrief(repo, id, title, status) {
  const content = `# ${id}: ${title}

## Status

${status}

## Non-Product Work

Exercise one low-risk workflow maintenance path.

## Origin

Bootstrap gap routing.

## Operator Input Status

No operator input is required.
`;
  await writeBrief(repo, id, content);
}

async function writeFeatureSliceBrief(repo, id, { status }) {
  const content = `# ${id}: Feature Slice

## Status

${status}

## Goal

Change product behavior that requires operator-owned acceptance.

## UAT Status

Not approved.
`;
  await writeBrief(repo, id, content);
}

async function writeImprovementChoreBrief(repo, id, overrides = {}) {
  const metadata = {
    origin: "retrospective",
    source_work_item: "BANDIT-001",
    source_artifacts: "docs/work/BANDIT-001/retrospective.md",
    lesson: "Evaluate whether a workflow improvement worked.",
    hypothesis: "Due evaluations reduce forgotten process experiments.",
    metric: "overdue_improvement_evaluations",
    baseline: "No heartbeat command reports due evaluations.",
    expected_direction: "decrease",
    evaluation_window: "due_on: 2026-05-25",
    status: "Evaluation Pending",
    outcome: "pending",
    ...overrides
  };
  const content = `# ${id}: Improvement Evaluation

origin: ${metadata.origin}
source_work_item: ${metadata.source_work_item}
source_artifacts: ${metadata.source_artifacts}
lesson: ${metadata.lesson}
hypothesis: ${metadata.hypothesis}
metric: ${metadata.metric}
baseline: ${metadata.baseline}
expected_direction: ${metadata.expected_direction}
evaluation_window: ${metadata.evaluation_window}
status: ${metadata.status}
outcome: ${metadata.outcome}

## Status

${metadata.status}

## Notes

Improvement metadata is repo-native evidence for heartbeat inspection.
`;
  await writeBrief(repo, id, content);
}

async function writeBrief(repo, id, content) {
  const workDir = path.join(repo, "docs/work", id);
  await mkdir(workDir, { recursive: true });
  await writeFile(path.join(workDir, "brief.md"), content, "utf8");
}

async function writeBootstrapGapLedger(repo, gaps) {
  const destination = path.join(repo, ".bandit/bootstrap-gaps.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(
    destination,
    `${JSON.stringify({ version: 1, gaps }, null, 2)}\n`,
    "utf8"
  );
}

function bootstrapGap(overrides = {}) {
  return {
    id: "BANDIT-GAP-HEARTBEAT-CHORE-AGENT",
    title: "Heartbeat Chore Agent",
    status: "open",
    disposition: "queued_chore_candidate",
    source_work_item: "BANDIT-011",
    source_artifacts: ["docs/work/BANDIT-001/brief.md"],
    linked_work_item: null,
    rationale: "Gap is queued for bootstrap hardening.",
    verification_target: null,
    next_action: "Create a dedicated bootstrap-gap chore.",
    ...overrides
  };
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error.code === "ENOENT" || error.code === "ENOTDIR")
    ) {
      return false;
    }
    throw error;
  }
}
