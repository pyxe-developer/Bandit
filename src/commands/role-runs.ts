import { validateRoleRunManifests } from "../state/role-run-manifests.js";

export async function roleRuns(repoRoot: string, args: string[]) {
  const [action, ...rest] = args;

  if (action === "validate") {
    return validate(repoRoot, rest);
  }

  throw new Error("Usage: bandit role-runs <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  const [workItemId, ...options] = args;

  if (!workItemId) {
    throw new Error("Usage: bandit role-runs validate <work-item-id> [--json]");
  }

  const wantsJson = options.length === 1 && options[0] === "--json";
  const hasNoOptions = options.length === 0;

  if (!hasNoOptions && !wantsJson) {
    throw new Error("Usage: bandit role-runs validate <work-item-id> [--json]");
  }

  const report = await validateRoleRunManifests(repoRoot, workItemId);

  if (wantsJson) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: `Role run manifests for ${workItemId} are valid.\n` };
}
