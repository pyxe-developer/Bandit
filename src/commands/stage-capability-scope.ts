import { validateStageCapabilityScope } from "../state/stage-capability-scope.js";

export async function stageCapabilityScope(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit stage-capability-scope <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit stage-capability-scope validate [--json]");
  }

  const report = await validateStageCapabilityScope(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Stage capability scope policy is valid.\n" };
}
