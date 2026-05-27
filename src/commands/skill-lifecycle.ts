import { validateSkillLifecycleContracts } from "../state/skill-lifecycle-contracts.js";

export async function skillLifecycle(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(skillLifecycleUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit skill-lifecycle validate [--json]");
  }

  const report = await validateSkillLifecycleContracts(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Skill lifecycle contracts are valid.\n" };
}

function skillLifecycleUsage() {
  return "Usage: bandit skill-lifecycle <validate>";
}
