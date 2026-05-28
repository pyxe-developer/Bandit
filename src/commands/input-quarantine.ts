import { validateInputQuarantineGate } from "../state/input-quarantine.js";

export async function inputQuarantine(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(inputQuarantineUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit input-quarantine validate [--json]");
  }

  const report = await validateInputQuarantineGate(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Input quarantine gate is valid.\n" };
}

function inputQuarantineUsage() {
  return "Usage: bandit input-quarantine <validate>";
}
