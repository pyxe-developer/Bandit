import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  resolveWorkExecuteControllerAction,
  type WorkItem
} from "../state/work-execute-controller.js";

export type WorkExecuteAdapterResult = {
  stdout?: string;
  stderr?: string;
  code: number;
};

export async function banditWorkExecute(
  repoRoot: string,
  args: string[]
): Promise<WorkExecuteAdapterResult> {
  const wantsJson = args.includes("--json");

  const workItemId = await readActiveWorkItemId(repoRoot);
  if (!workItemId) {
    const payload = {
      kind: "bandit_work_execute_result",
      delegate: "work_item_pm_execute_controller",
      status: "blocked",
      work_item: null,
      blocker: "No active formed work item found in CURRENT_CONTEXT.md",
      required_operator_input: "none_required",
      next_safe_command: "bandit work-create"
    };
    if (wantsJson) {
      return { stderr: JSON.stringify(payload) + "\n", code: 1 };
    }
    return { stderr: "No active formed work item.\n", code: 1 };
  }

  const hasFormationApproved = await hasFormationApprovedInLog(repoRoot, workItemId);
  if (!hasFormationApproved) {
    const payload = {
      kind: "bandit_work_execute_result",
      delegate: "work_item_pm_execute_controller",
      status: "blocked",
      work_item: workItemId,
      blocker:
        "Work Item " +
        workItemId +
        " requires formation_approved state before work-execute can proceed",
      required_operator_input: "none_required",
      next_safe_command: "bandit work-create"
    };
    if (wantsJson) {
      return { stderr: JSON.stringify(payload) + "\n", code: 1 };
    }
    return {
      stderr: "Work Item " + workItemId + " requires formation_approved.\n",
      code: 1
    };
  }

  const orchestrationPlanRelPath =
    "docs/work/" + workItemId + "/orchestration-plan.md";
  const orchestrationPlanExists = await fileExists(
    path.join(repoRoot, orchestrationPlanRelPath)
  );
  const redEvidenceRelPath = "docs/work/" + workItemId + "/red-evidence.md";
  const redEvidenceExists = await fileExists(
    path.join(repoRoot, redEvidenceRelPath)
  );
  const latestState =
    (await readLatestCoordinationState(repoRoot, workItemId)) ?? "formation_approved";

  const workItem: WorkItem = {
    id: workItemId,
    coordination_state: latestState,
    evidence: {
      brief: "docs/work/" + workItemId + "/brief.md",
      orchestration_plan: orchestrationPlanExists ? orchestrationPlanRelPath : null,
      red_evidence: redEvidenceExists ? redEvidenceRelPath : null
    }
  };

  const action = resolveWorkExecuteControllerAction({
    workItem
  });

  if (action.status === "blocked") {
    const payload = {
      kind: "bandit_work_execute_result",
      delegate: "work_item_pm_execute_controller",
      status: "blocked",
      work_item: workItemId,
      stage_reached: "Stage 1: " + latestState,
      blocker: action.stop_condition,
      evidence_required: action.required_evidence,
      required_operator_input: "none_required",
      next_safe_command: action.next_command
    };
    if (wantsJson) {
      return { stderr: JSON.stringify(payload) + "\n", code: 1 };
    }
    return { stderr: "Blocked: " + action.stop_condition + "\n", code: 1 };
  }

  const payload = {
    kind: "bandit_work_execute_result",
    delegate: "work_item_pm_execute_controller",
    status: "ready",
    work_item: workItemId,
    stage_reached: action.stage_reached,
    required_operator_input: "none_required",
    route: action.route,
    canonical_state_owner: action.canonical_state_owner,
    role_input_packet: action.role_input_packet,
    next_safe_command: "bandit work-execute"
  };
  if (wantsJson) {
    return { stdout: JSON.stringify(payload) + "\n", code: 0 };
  }
  return {
    stdout: "Work Item PM execute controller: ready " + workItemId + "\n",
    code: 0
  };
}

async function readActiveWorkItemId(repoRoot: string): Promise<string | null> {
  try {
    const content = await readFile(
      path.join(repoRoot, "docs/roadmap/CURRENT_CONTEXT.md"),
      "utf8"
    );
    const match = content.match(/\*\*Active work item:\*\* `([^`]+)`/);
    return match?.[1]?.trim() ?? null;
  } catch {
    return null;
  }
}

async function hasFormationApprovedInLog(
  repoRoot: string,
  workItemId: string
): Promise<boolean> {
  try {
    const content = await readFile(
      path.join(repoRoot, "docs/work", workItemId, "coordination-log.jsonl"),
      "utf8"
    );
    for (const line of content.split(/\r?\n/)) {
      const t = line.trim();
      if (!t) continue;
      try {
        const p = JSON.parse(t) as Record<string, unknown>;
        if (p["event_type"] === "step_transition" && p["state"] === "formation_approved") {
          return true;
        }
      } catch {
        continue;
      }
    }
  } catch {
    // file missing or unreadable
  }
  return false;
}

async function readLatestCoordinationState(
  repoRoot: string,
  workItemId: string
): Promise<string | null> {
  try {
    const content = await readFile(
      path.join(repoRoot, "docs/work", workItemId, "coordination-log.jsonl"),
      "utf8"
    );
    let latestSeq = -1;
    let latestState: string | null = null;
    for (const line of content.split(/\r?\n/)) {
      const t = line.trim();
      if (!t) continue;
      try {
        const p = JSON.parse(t) as Record<string, unknown>;
        if (p["event_type"] !== "step_transition") continue;
        if (typeof p["sequence"] !== "number" || p["sequence"] <= latestSeq) continue;
        latestSeq = p["sequence"] as number;
        latestState = typeof p["state"] === "string" ? (p["state"] as string) : null;
      } catch {
        continue;
      }
    }
    return latestState;
  } catch {
    return null;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}
