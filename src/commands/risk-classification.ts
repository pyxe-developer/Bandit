import { validateRiskClassificationGate } from "../state/risk-classification.js";

export async function riskClassification(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(riskClassificationUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit risk-classification validate [--json]");
  }

  const report = await validateRiskClassificationGate(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Layered risk classification gate is valid.\n" };
}

function riskClassificationUsage() {
  return "Usage: bandit risk-classification <validate>";
}
