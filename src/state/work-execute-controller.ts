import { getStageRoute, type StageRoute } from "./stage-route-registry.ts";

export type WorkItemEvidence = {
  brief: string;
  orchestration_plan: string | null;
  red_evidence: string | null;
};

export type WorkItem = {
  id: string;
  coordination_state: string;
  evidence: WorkItemEvidence;
};

type BlockedAction = {
  status: "blocked";
  stop_condition: string;
  next_command: string;
  required_evidence: string[];
};

type ReadyAction = {
  status: "ready";
  route: StageRoute;
  stage_reached: string;
  canonical_state_owner: "repo_native_artifacts";
  role_input_packet: { authority: "derived_non_canonical" };
};

export type WorkExecuteControllerAction = BlockedAction | ReadyAction;

// Coordination states that the work-execute controller is willing to
// attempt to derive a route for. Append-only coordination history is the
// source of truth; the selection validator and the resolver both project
// from that history. Anything outside this set is either pre-formation
// (handled by the adapter pre-gate) or a contradictory state the resolver
// must fail closed on.
const EXECUTABLE_COORDINATION_STATES: ReadonlySet<string> = new Set([
  "formation_approved",
  "orchestration_plan_recorded",
  "red_recorded"
]);

const NEXT_SAFE_COMMAND = "bandit work-execute";
const START_PM_COMMAND_PREFIX = "node ./bin/bandit.mjs work-item-pm start";

// Operator-facing label for a stage the controller is ready to advance
// into. Kept here so the controller remains the single source of truth
// for the stage-to-label mapping; the adapter passes it through.
function stageReachedFor(stage: string): string {
  switch (stage) {
    case "stage_2_red":
      return "Stage 2: ready_for_red";
    case "stage_3_implementation":
      return "Stage 3: implementation_required";
    default:
      throw new Error(
        `Missing stage_reached label for authorized stage route: ${stage}`
      );
  }
}

function readyAction(route: StageRoute): ReadyAction {
  return {
    status: "ready",
    route,
    stage_reached: stageReachedFor(route.stage),
    canonical_state_owner: "repo_native_artifacts",
    role_input_packet: { authority: "derived_non_canonical" }
  };
}

function blockedAction(
  stopCondition: string,
  requiredEvidence: string[],
  nextCommand = NEXT_SAFE_COMMAND
): BlockedAction {
  return {
    status: "blocked",
    stop_condition: stopCondition,
    next_command: nextCommand,
    required_evidence: requiredEvidence
  };
}

export function validateWorkExecuteControllerSelection(
  workItems: WorkItem[]
): void {
  if (workItems.length === 0) {
    throw new Error("no current formed Work Item is eligible");
  }
  if (workItems.length > 1) {
    throw new Error(
      "more than one formed Work Item is eligible; cannot select"
    );
  }
  const item = workItems[0];
  if (
    item === undefined ||
    !EXECUTABLE_COORDINATION_STATES.has(item.coordination_state)
  ) {
    throw new Error(
      `Work Item selection requires an executable coordination state ` +
        `(formation_approved, orchestration_plan_recorded, or red_recorded); ` +
        `found: ${item?.coordination_state ?? "none"}`
    );
  }
}

export function resolveWorkExecuteControllerAction(params: {
  workItem: WorkItem;
}): WorkExecuteControllerAction {
  const { workItem } = params;

  // Plan-mode evidence is the gate. Without an accepted orchestration
  // plan, work-execute cannot derive any executable route, regardless of
  // the caller-supplied requested stage.
  if (!workItem.evidence.orchestration_plan) {
    return {
      status: "blocked",
      stop_condition: "missing_plan_mode",
      next_command: `${START_PM_COMMAND_PREFIX} ${workItem.id}`,
      required_evidence: [
        `docs/work/${workItem.id}/orchestration-plan.md`,
        `docs/work/${workItem.id}/coordination-log.jsonl`
      ]
    };
  }

  // Derive the stage from the latest accepted coordination state. Any
  // coordination state the controller does not explicitly know how to
  // advance through fails closed with unsupported_coordination_state
  // rather than fabricating readiness.
  switch (workItem.coordination_state) {
    case "formation_approved":
      return blockedAction(
        "orchestration_plan_not_recorded",
        [
          `docs/work/${workItem.id}/orchestration-plan.md`,
          `docs/work/${workItem.id}/coordination-log.jsonl`
        ],
        `${START_PM_COMMAND_PREFIX} ${workItem.id}`
      );
    case "orchestration_plan_recorded":
      return readyAction(getStageRoute("stage_2_red"));
    case "red_recorded":
      if (!workItem.evidence.red_evidence) {
        return blockedAction("missing_red_evidence", [
          `docs/work/${workItem.id}/red-evidence.md`,
          `docs/work/${workItem.id}/coordination-log.jsonl`
        ]);
      }
      return readyAction(getStageRoute("stage_3_implementation"));
    default:
      return blockedAction(
        "unsupported_coordination_state",
        [`docs/work/${workItem.id}/coordination-log.jsonl`]
      );
  }
}
