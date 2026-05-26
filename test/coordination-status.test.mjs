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

test("coordination status reports satisfied feature UAT typed extension", async () => {
  const repo = await createCoordinationRepo("slice");
  await writeEvidence(repo, "BANDIT-001", "review-evidence.md");
  await writeUatApproval(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      accountable_actor: "Test Writer",
      next_action: "Write RED evidence",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    }),
    stepTransition({
      sequence: 2,
      state: "review_recorded",
      accountable_actor: "Codex PM",
      next_action: "Record operator UAT approval",
      evidence: ["docs/work/BANDIT-001/review-evidence.md"],
      safe_triggers: ["feature_uat_required"]
    }),
    stepTransition({
      sequence: 3,
      state: "feature_uat_approved",
      accountable_actor: "Landing Agent",
      next_action: "Record landing verdict",
      evidence: ["docs/work/BANDIT-001/uat-approval.md"],
      safe_triggers: ["landing_verdict_allowed"]
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
    current_state: "feature_uat_approved",
    next_action: "Record landing verdict",
    accountable_actor: "Landing Agent",
    accepted_block: null,
    safe_trigger_points: ["landing_verdict_allowed"],
    evidence: ["docs/work/BANDIT-001/uat-approval.md"],
    typed_extension: {
      name: "feature_uat",
      status: "satisfied",
      required_evidence: ["docs/work/BANDIT-001/uat-approval.md"],
      evidence: ["docs/work/BANDIT-001/uat-approval.md"]
    }
  });
});

test("coordination status reports satisfied chore disposition typed extension", async () => {
  const repo = await createCoordinationRepo("chore");
  await writeEvidence(repo, "BANDIT-001", "landing-action.md");
  await writeChoreDisposition(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    }),
    stepTransition({
      sequence: 2,
      state: "landed",
      accountable_actor: "Codex PM",
      next_action: "Record chore disposition",
      evidence: ["docs/work/BANDIT-001/landing-action.md"],
      safe_triggers: ["chore_disposition_required"]
    }),
    stepTransition({
      sequence: 3,
      state: "chore_disposition_recorded",
      accountable_actor: "Codex PM",
      next_action: "Record retrospective",
      evidence: ["docs/work/BANDIT-001/chore-disposition.md"],
      safe_triggers: ["retrospective_allowed"]
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
    work_type: "chore",
    current_state: "chore_disposition_recorded",
    next_action: "Record retrospective",
    accountable_actor: "Codex PM",
    accepted_block: null,
    safe_trigger_points: ["retrospective_allowed"],
    evidence: ["docs/work/BANDIT-001/chore-disposition.md"],
    typed_extension: {
      name: "chore_disposition",
      status: "satisfied",
      required_evidence: ["docs/work/BANDIT-001/chore-disposition.md"],
      evidence: ["docs/work/BANDIT-001/chore-disposition.md"]
    }
  });
});

test("actor events cannot satisfy typed extension state or emit extension safe triggers", async () => {
  const repo = await createCoordinationRepo("slice");
  await writeEvidence(repo, "BANDIT-001", "review-evidence.md");
  await writeUatApproval(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    }),
    stepTransition({
      sequence: 2,
      state: "review_recorded",
      accountable_actor: "operator",
      next_action: "Record operator UAT approval",
      evidence: ["docs/work/BANDIT-001/review-evidence.md"],
      safe_triggers: ["feature_uat_required"]
    }),
    actorEvent({
      sequence: 3,
      actor_event_type: "complete",
      evidence: ["docs/work/BANDIT-001/uat-approval.md"]
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
  assert.equal(status.current_state, "review_recorded");
  assert.deepEqual(status.safe_trigger_points, ["feature_uat_required"]);
  assert.equal(status.typed_extension?.status, "required");
  assert.notDeepEqual(status.safe_trigger_points, ["landing_verdict_allowed"]);
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

test("coordination status reports recent actor context without granting workflow authority", async () => {
  const repo = await createCoordinationRepo("slice");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      accountable_actor: "Test Writer",
      next_action: "Write RED evidence",
      evidence: ["docs/work/BANDIT-001/brief.md"],
      safe_triggers: ["red_evidence_required"]
    }),
    actorEvent({
      sequence: 2,
      actor_event_type: "claim",
      actor: "codex_pm",
      summary: "Claim Stage 2 RED evidence"
    }),
    actorEvent({
      sequence: 3,
      actor_event_type: "handoff",
      actor: "codex_pm",
      target_actor: "Writer",
      summary: "RED tests are ready for Writer"
    }),
    actorEvent({
      sequence: 4,
      actor_event_type: "block",
      actor: "codex_pm",
      blocked_owner: "operator",
      resume_condition: "Budget approval recorded in work item evidence",
      summary: "Waiting for operator budget approval"
    }),
    actorEvent({
      sequence: 5,
      actor_event_type: "repair-request",
      actor: "Reviewer",
      repair_scope: "coordination event validation",
      summary: "Repair missing refusal path"
    }),
    actorEvent({
      sequence: 6,
      actor_event_type: "resume",
      actor: "codex_pm",
      summary: "Operator budget approval recorded"
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
  assert.deepEqual(status.safe_trigger_points, ["red_evidence_required"]);
  assert.deepEqual(status.accepted_block, null);
  assert.deepEqual(status.actor_context, {
    latest_advisory_claim: {
      actor: "codex_pm",
      summary: "Claim Stage 2 RED evidence",
      sequence: 2
    },
    latest_handoff: {
      actor: "codex_pm",
      target_actor: "Writer",
      summary: "RED tests are ready for Writer",
      sequence: 3
    },
    latest_block_event: {
      actor: "codex_pm",
      blocked_owner: "operator",
      resume_condition: "Budget approval recorded in work item evidence",
      summary: "Waiting for operator budget approval",
      sequence: 4
    },
    pending_repair_request: {
      actor: "Reviewer",
      repair_scope: "coordination event validation",
      summary: "Repair missing refusal path",
      sequence: 5
    },
    latest_resume: {
      actor: "codex_pm",
      summary: "Operator budget approval recorded",
      sequence: 6
    }
  });
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

async function writeUatApproval(repo, workItem) {
  await writeFile(
    path.join(repo, "docs/work", workItem, "uat-approval.md"),
    `# UAT Approval: ${workItem}

contract_version: 1
work_item: ${workItem}
source_head: fixture-source-head
environment: operator-cli
approval_status: pass
approved_by: operator
approved_at: 2026-05-25T12:00:00.000Z
source_drift_status: current
notes: Fixture UAT approval.
`,
    "utf8"
  );
}

async function writeChoreDisposition(repo, workItem) {
  await writeFile(
    path.join(repo, "docs/work", workItem, "chore-disposition.md"),
    `# Chore Disposition: ${workItem}

contract_version: 1
work_item: ${workItem}
disposition_status: pass
disposition_kind: no_action
rationale: Fixture disposition proves product UAT is not applicable.
improvement_metadata_status: not_applicable
`,
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
