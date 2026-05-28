import { validateSupplyChainGate } from "../state/supply-chain-gate.js";

export async function supplyChainGate(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(supplyChainGateUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit supply-chain-gate validate [--json]");
  }

  const report = await validateSupplyChainGate(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Supply-chain gate is valid.\n" };
}

function supplyChainGateUsage() {
  return "Usage: bandit supply-chain-gate <validate>";
}
