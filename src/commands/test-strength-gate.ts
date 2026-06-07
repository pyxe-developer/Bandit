import { validateTestStrengthGate } from "../state/test-strength-gate.js";

export async function testStrengthGate(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(testStrengthGateUsage());
}

async function validate(repoRoot: string, args: string[]) {
  const [workItemId, ...rest] = args;

  if (rest.length > 0) {
    throw new Error("Usage: bandit test-strength-gate validate [work-item-id]");
  }

  const report = await validateTestStrengthGate(repoRoot, workItemId);
  const checkedLines =
    report.checked_work_items.length > 0
      ? report.checked_work_items.map((id) => `  - ${id}`)
      : ["  - none"];

  return {
    output: ["Test strength gate: pass", "Checked work items:", ...checkedLines]
      .join("\n")
      .concat("\n")
  };
}

function testStrengthGateUsage() {
  return "Usage: bandit test-strength-gate <validate> [work-item-id]";
}
