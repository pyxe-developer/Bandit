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
  canonical_state_owner: "repo_native_artifacts";
  role_input_packet: { authority: "derived_non_canonical" };
};

export type WorkExecuteControllerAction = BlockedAction | ReadyAction;

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
  if (item === undefined || item.coordination_state !== "formation_approved") {
    throw new Error(
      `Work Item selection requires formation_approved state; ` +
        `found: ${item?.coordination_state ?? "none"}`
    );
  }
}

export function resolveWorkExecuteControllerAction(params: {
  workItem: WorkItem;
  requestedStage: string;
}): WorkExecuteControllerAction {
  const { workItem, requestedStage } = params;

  if (!workItem.evidence.orchestration_plan) {
    return {
      status: "blocked",
      stop_condition: "missing_plan_mode",
      next_command: `node ./bin/bandit.mjs work-item-pm start ${workItem.id}`,
      required_evidence: [
        `docs/work/${workItem.id}/orchestration-plan.md`,
        `docs/work/${workItem.id}/coordination-log.jsonl`
      ]
    };
  }

  const route = getStageRoute(requestedStage);

  return {
    status: "ready",
    route,
    canonical_state_owner: "repo_native_artifacts",
    role_input_packet: { authority: "derived_non_canonical" }
  };
}
