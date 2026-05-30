import { validateTokenCostFailsafe } from "../state/token-cost-failsafe.js";

export async function tokenCostFailsafe(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit token-cost-failsafe <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit token-cost-failsafe validate [--json]");
  }

  const report = await validateTokenCostFailsafe(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Token-cost failsafe policy is valid.\n" };
}
