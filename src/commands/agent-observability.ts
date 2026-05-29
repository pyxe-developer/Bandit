import {
  projectAgentObservability,
  validateAgentObservability
} from "../state/agent-observability.js";

export async function agentObservability(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  if (action === "project") {
    return project(repoRoot, options);
  }

  throw new Error("Usage: bandit agent-observability <validate|project>");
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit agent-observability validate [--json]");
  }

  const report = await validateAgentObservability(repoRoot);
  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Agent observability traces are valid.\n" };
}

async function project(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit agent-observability project [--json]");
  }

  const report = await projectAgentObservability(repoRoot);
  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Agent observability projection generated.\n" };
}
