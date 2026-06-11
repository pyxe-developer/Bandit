import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveWorkExecuteControllerAction,
  validateWorkExecuteControllerSelection
} from "../src/state/work-execute-controller.ts";

const formedWorkItem = {
  id: "BANDIT-096",
  coordination_state: "formation_approved",
  evidence: {
    brief: "docs/work/BANDIT-096/brief.md",
    orchestration_plan: null,
    red_evidence: null
  }
};

test("execute controller refuses missing, ambiguous, or unformed work item selection", () => {
  assert.throws(
    () => validateWorkExecuteControllerSelection([]),
    /no current formed Work Item/i
  );

  assert.throws(
    () =>
      validateWorkExecuteControllerSelection([
        formedWorkItem,
        { ...formedWorkItem, id: "BANDIT-097" }
      ]),
    /more than one formed Work Item/i
  );

  assert.throws(
    () =>
      validateWorkExecuteControllerSelection([
        { ...formedWorkItem, coordination_state: "brief_created" }
      ]),
    /formation_approved/i
  );
});

test("execute controller requires plan-mode evidence before RED route", () => {
  const action = resolveWorkExecuteControllerAction({
    workItem: formedWorkItem,
    requestedStage: "stage_2_red"
  });

  assert.equal(action.status, "blocked");
  assert.equal(action.stop_condition, "missing_plan_mode");
  assert.equal(action.next_command, "node ./bin/bandit.mjs work-item-pm start BANDIT-096");
  assert.deepEqual(action.required_evidence, [
    "docs/work/BANDIT-096/orchestration-plan.md",
    "docs/work/BANDIT-096/coordination-log.jsonl"
  ]);
});

test("execute controller selects authorized routes after plan-mode evidence", () => {
  const action = resolveWorkExecuteControllerAction({
    workItem: {
      ...formedWorkItem,
      coordination_state: "orchestration_plan_recorded",
      evidence: {
        ...formedWorkItem.evidence,
        orchestration_plan: "docs/work/BANDIT-096/orchestration-plan.md"
      }
    },
    requestedStage: "stage_2_red"
  });

  assert.equal(action.status, "ready");
  assert.equal(action.route.stage, "stage_2_red");
  assert.equal(action.route.authority_role, "test_writer");
  assert.equal(action.canonical_state_owner, "repo_native_artifacts");
  assert.equal(action.role_input_packet.authority, "derived_non_canonical");
});
