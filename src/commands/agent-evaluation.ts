import { validateAgentEvaluationHarness } from "../state/agent-evaluation-harness.js";

export async function agentEvaluation(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(agentEvaluationUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit agent-evaluation validate [--json]");
  }

  const report = await validateAgentEvaluationHarness(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Agent evaluation harness is valid.\n" };
}

function agentEvaluationUsage() {
  return "Usage: bandit agent-evaluation <validate>";
}
