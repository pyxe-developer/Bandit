import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit
} from "./helpers/bandit-cli.mjs";

test("coordination status derives slice state, next action, actor, and safe triggers", async () => {
  const repo = await createCoordinationRepo("slice");
  await writeEvidence(repo, "BANDIT-001", "red-evidence.md");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      accountable_actor: "Test Writer",
      next_action: "Write RED evidence",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    }),
    stepTransition({
      sequence: 2,
      state: "red_recorded",
      accountable_actor: "Writer",
      next_action: "Implement coordination log foundation",
      evidence: ["docs/work/BANDIT-001/red-evidence.md"],
      safe_triggers: ["implementation_allowed"]
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "status",
    "BANDIT-001",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    work_item: "BANDIT-001",
    work_type: "slice",
    current_state: "red_recorded",
    next_action: "Implement coordination log foundation",
    accountable_actor: "Writer",
    accepted_block: null,
    safe_trigger_points: ["implementation_allowed"],
    evidence: ["docs/work/BANDIT-001/red-evidence.md"]
  });
});

test("coordination status supports chore core states through closed", async () => {
  const repo = await createCoordinationRepo("chore");
  for (const evidence of [
    "red-evidence.md",
    "implementation-evidence.md",
    "review-evidence.md",
    "landing-verdict.md",
    "landing-action.md",
    "retrospective.md"
  ]) {
    await writeEvidence(repo, "BANDIT-001", evidence);
  }
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({ sequence: 2, state: "red_recorded", evidence: ["docs/work/BANDIT-001/red-evidence.md"] }),
    stepTransition({ sequence: 3, state: "implementation_recorded", evidence: ["docs/work/BANDIT-001/implementation-evidence.md"] }),
    stepTransition({ sequence: 4, state: "review_recorded", evidence: ["docs/work/BANDIT-001/review-evidence.md"] }),
    stepTransition({ sequence: 5, state: "landing_verdict_recorded", evidence: ["docs/work/BANDIT-001/landing-verdict.md"] }),
    stepTransition({ sequence: 6, state: "landed", evidence: ["docs/work/BANDIT-001/landing-action.md"] }),
    stepTransition({ sequence: 7, state: "retrospective_recorded", evidence: ["docs/work/BANDIT-001/retrospective.md"] }),
    stepTransition({
      sequence: 8,
      state: "closed",
      next_action: null,
      accountable_actor: null,
      evidence: ["docs/work/BANDIT-001/retrospective.md"],
      safe_triggers: ["work_item_closed"]
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "status",
    "BANDIT-001",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.equal(status.work_type, "chore");
  assert.equal(status.current_state, "closed");
  assert.equal(status.next_action, null);
  assert.deepEqual(status.safe_trigger_points, ["work_item_closed"]);
});

test("actor coordination events cannot complete workflow stages or emit safe triggers", async () => {
  const repo = await createCoordinationRepo("slice");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      accountable_actor: "Test Writer",
      next_action: "Write RED evidence",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    }),
    actorEvent({
      sequence: 2,
      actor_event_type: "complete",
      message: "RED evidence finished in chat."
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "status",
    "BANDIT-001",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.equal(status.current_state, "brief_created");
  assert.equal(status.next_action, "Write RED evidence");
  assert.deepEqual(status.safe_trigger_points, []);
});

test("coordination status reports accepted block state and resume condition", async () => {
  const repo = await createCoordinationRepo("chore");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    }),
    stepTransition({
      sequence: 2,
      state: "blocked",
      next_action: "Wait for operator cost approval",
      accountable_actor: "operator",
      evidence: ["docs/work/BANDIT-001/brief.md"],
      accepted_block: {
        owner: "operator",
        required_input: "Approve paid escalated reviewer budget",
        resume_condition: "Budget approval recorded in the work item"
      }
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "status",
    "BANDIT-001",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.equal(status.current_state, "blocked");
  assert.deepEqual(status.accepted_block, {
    owner: "operator",
    required_input: "Approve paid escalated reviewer budget",
    resume_condition: "Budget approval recorded in the work item"
  });
  assert.deepEqual(status.safe_trigger_points, []);
});

async function createCoordinationRepo(workType) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  const workDir = path.join(repo, "docs/work/BANDIT-001");
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "brief.md"),
    `# BANDIT-001: Coordination Fixture

work_type: ${workType}

## Status

Brief Created

## Goal

Test coordination state derivation.
`,
    "utf8"
  );
  return repo;
}

async function writeEvidence(repo, workItem, fileName) {
  await writeFile(
    path.join(repo, "docs/work", workItem, fileName),
    `# ${workItem} ${fileName}\n\nFixture evidence.\n`,
    "utf8"
  );
}

async function writeCoordinationLog(repo, workItem, events) {
  const logDir = path.join(repo, "docs/work", workItem);
  await mkdir(logDir, { recursive: true });
  await writeFile(
    path.join(logDir, "coordination-log.jsonl"),
    events.map((event) => JSON.stringify(event)).join("\n") + "\n",
    "utf8"
  );
}

function stepTransition(overrides = {}) {
  return {
    version: 1,
    event_type: "step_transition",
    work_item: "BANDIT-001",
    sequence: 1,
    timestamp: "2026-05-25T12:00:00.000Z",
    actor: "codex_pm",
    source: "test",
    state: "brief_created",
    accountable_actor: "Writer",
    next_action: "Continue work",
    evidence: ["docs/work/BANDIT-001/brief.md"],
    safe_triggers: [],
    ...overrides
  };
}

function actorEvent(overrides = {}) {
  return {
    version: 1,
    event_type: "actor_event",
    actor_event_type: "claim",
    work_item: "BANDIT-001",
    sequence: 1,
    timestamp: "2026-05-25T12:00:00.000Z",
    actor: "codex_pm",
    source: "test",
    evidence: [],
    ...overrides
  };
}
