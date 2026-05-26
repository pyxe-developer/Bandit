import { readCockpitStatus } from "../state/cockpit-status.js";

export async function cockpit(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action !== "status" || options.some((option) => option !== "--json")) {
    throw new Error("Usage: bandit cockpit status [--json]");
  }

  const status = await readCockpitStatus(repoRoot);

  if (options.includes("--json")) {
    return { output: `${JSON.stringify(status, null, 2)}\n` };
  }

  return {
    output: [
      `Phase: ${status.current_phase.value}`,
      `Active work item: ${status.active_work_item.id}`,
      `Next action: ${status.next_action.value}`,
      `Required operator input: ${status.required_operator_input.value}`,
      `Bootstrap gaps: ${status.bootstrap_gaps.status}`,
      `Landing readiness: ${status.landing_readiness.status}`
    ].join("\n").concat("\n")
  };
}
