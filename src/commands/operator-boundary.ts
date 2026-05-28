import { validateOperatorBoundary } from "../state/operator-boundary.js";

export async function operatorBoundary(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(operatorBoundaryUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit operator-boundary validate [--json]");
  }

  const report = await validateOperatorBoundary(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Operator fail-closed boundary is valid.\n" };
}

function operatorBoundaryUsage() {
  return "Usage: bandit operator-boundary <validate>";
}
