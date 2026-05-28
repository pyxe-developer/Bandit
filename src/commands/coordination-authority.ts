import { validateCoordinationAuthority } from "../state/coordination-authority.js";

export async function coordinationAuthority(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(coordinationAuthorityUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit coordination-authority validate [--json]");
  }

  const report = await validateCoordinationAuthority(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Coordination event-log authority is valid.\n" };
}

function coordinationAuthorityUsage() {
  return "Usage: bandit coordination-authority <validate>";
}
