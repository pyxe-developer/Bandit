import {
  readCoordinationStatus,
  validateCoordinationLog
} from "../state/coordination-log.js";

export async function coordination(repoRoot: string, args: string[]) {
  const [action, workItemId, ...options] = args;

  if (action === "validate") {
    if (!workItemId || options.length > 0) {
      throw new Error("Usage: bandit coordination validate <work-item-id>");
    }

    await validateCoordinationLog(repoRoot, workItemId);
    return { output: `Coordination log is valid: ${workItemId}\n` };
  }

  if (action === "status") {
    if (!workItemId || options.some((option) => option !== "--json")) {
      throw new Error("Usage: bandit coordination status <work-item-id> [--json]");
    }

    const status = await readCoordinationStatus(repoRoot, workItemId);
    if (options.includes("--json")) {
      return { output: `${JSON.stringify(status, null, 2)}\n` };
    }

    return {
      output: [
        `Work item: ${status.work_item}`,
        `Work type: ${status.work_type}`,
        `Current state: ${status.current_state}`,
        `Next action: ${status.next_action ?? "none"}`,
        `Accountable actor: ${status.accountable_actor ?? "none"}`,
        `Safe trigger points: ${status.safe_trigger_points.join(", ") || "none"}`
      ].join("\n").concat("\n")
    };
  }

  throw new Error("Usage: bandit coordination <validate|status> <work-item-id> [--json]");
}
