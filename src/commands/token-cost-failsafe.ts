import { validateTokenCostFailsafe } from "../state/token-cost-failsafe.js";

export async function tokenCostFailsafe(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit token-cost-failsafe <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  const wantsJson = args.length === 1 && args[0] === "--json";
  const hasNoOptions = args.length === 0;

  if (!hasNoOptions && !wantsJson) {
    throw new Error("Usage: bandit token-cost-failsafe validate [--json]");
  }

  const report = await validateTokenCostFailsafe(repoRoot);

  if (wantsJson) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Token-cost failsafe policy is valid.\n" };
}
