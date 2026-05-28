import { validateGitMutations } from "../state/git-mutations.js";

export async function gitMutation(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(gitMutationUsage());
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit git-mutation validate [--json]");
  }

  const report = await validateGitMutations(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Git Mutation Serializer is valid.\n" };
}

function gitMutationUsage() {
  return "Usage: bandit git-mutation <validate>";
}
