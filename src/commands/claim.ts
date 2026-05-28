import { simulateClaimSafetyFromEvidencePath } from "../state/claim-safety-simulation.js";
import { validateClaimAuthority } from "../state/claim-authority.js";

export async function claim(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  if (action === "simulate") {
    return simulate(repoRoot, options);
  }

  throw new Error(claimUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit claim validate [--json]");
  }

  const report = await validateClaimAuthority(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Claim authority is valid.\n" };
}

async function simulate(repoRoot: string, args: string[]) {
  const [evidencePath, ...options] = args;

  if (!evidencePath || options.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit claim simulate <evidence-path> [--json]");
  }

  const report = await simulateClaimSafetyFromEvidencePath(repoRoot, evidencePath);

  if (options.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Claim safety simulation passed.\n" };
}

function claimUsage() {
  return "Usage: bandit claim <validate|simulate>";
}
