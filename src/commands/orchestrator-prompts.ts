import { validateOrchestratorPrompts } from "../state/orchestrator-prompts.js";

export async function orchestratorPrompts(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit orchestrator-prompts <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit orchestrator-prompts validate [--json]");
  }

  const report = await validateOrchestratorPrompts(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Orchestrator prompt contracts are valid.\n" };
}
