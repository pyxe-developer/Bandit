import { runRepoPmCreateController } from "../state/work-create-controller.js";

export type WorkCreateAdapterResult = {
  stdout?: string;
  stderr?: string;
  code: number;
};

type WorkCreatePayload = {
  kind: "bandit_work_create_result";
  delegate: "repo_pm_create_controller";
  status: string;
  work_item: string | null;
  stage_reached: string | null;
  required_operator_input: "none_required";
  blocker: string | null;
  stage2_started: false;
  next_safe_command: string;
  evidence_written: string[];
};

export async function banditWorkCreate(
  repoRoot: string,
  args: string[]
): Promise<WorkCreateAdapterResult> {
  const wantsJson = args.includes("--json");

  const outcome = await runRepoPmCreateController(repoRoot);

  if (!outcome.ok) {
    const payload: WorkCreatePayload = {
      kind: "bandit_work_create_result",
      delegate: "repo_pm_create_controller",
      status: "blocked",
      work_item: null,
      stage_reached: null,
      required_operator_input: "none_required",
      blocker: outcome.error.diagnostic,
      stage2_started: false,
      next_safe_command: "bandit work-create",
      evidence_written: []
    };
    if (wantsJson) {
      return { stderr: JSON.stringify(payload) + "\n", code: 1 };
    }
    return { stderr: outcome.error.diagnostic + "\n", code: 1 };
  }

  const result = outcome.result;
  const workItemId = result.work_item;

  const stageReached =
    result.status === "brief_created"
      ? "Stage 1: brief_created"
      : "Stage 1: formation_approved";

  const nextSafeCommand =
    result.status === "already_formed" ? "bandit work-execute" : "bandit work-create";

  const evidenceWritten =
    result.status === "brief_created"
      ? [
          "docs/work/" + workItemId + "/brief.md",
          "docs/work/" + workItemId + "/coordination-log.jsonl"
        ]
      : [];

  const payload: WorkCreatePayload = {
    kind: "bandit_work_create_result",
    delegate: "repo_pm_create_controller",
    status: result.status,
    work_item: workItemId,
    stage_reached: stageReached,
    required_operator_input: "none_required",
    blocker: null,
    stage2_started: false,
    next_safe_command: nextSafeCommand,
    evidence_written: evidenceWritten
  };

  if (wantsJson) {
    return { stdout: JSON.stringify(payload) + "\n", code: 0 };
  }
  return {
    stdout:
      "Repo PM create controller: " +
      result.status +
      " " +
      workItemId +
      "\n" +
      result.next_action +
      "\n",
    code: 0
  };
}
