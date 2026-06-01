import { validateRoleContracts } from "../state/role-contracts.js";

export async function roleContracts(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit role-contracts <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  const wantsJson = args.length === 1 && args[0] === "--json";
  const hasNoOptions = args.length === 0;

  if (!hasNoOptions && !wantsJson) {
    throw new Error("Usage: bandit role-contracts validate [--json]");
  }

  const report = await validateRoleContracts(repoRoot);

  if (wantsJson) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Role contracts policy is valid.\n" };
}
