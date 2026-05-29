import { validateWorktreeBootstrap } from "../state/worktree-bootstrap.js";

const VALIDATE_OPTIONS = new Set(["--json"]);

export async function worktreeBootstrap(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(worktreeBootstrapUsage());
}

async function validate(repoRoot: string, args: string[]) {
  const invalidOption = args.find((arg) => !VALIDATE_OPTIONS.has(arg));
  if (invalidOption) {
    throw new Error("Usage: bandit worktree-bootstrap validate [--json]");
  }

  const report = await validateWorktreeBootstrap(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Worktree bootstrap contract is valid.\n" };
}

function worktreeBootstrapUsage() {
  return "Usage: bandit worktree-bootstrap <validate>";
}
