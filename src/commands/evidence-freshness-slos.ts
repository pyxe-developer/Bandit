import { validateEvidenceFreshnessSlos } from "../state/evidence-freshness-slos.js";

export async function evidenceFreshnessSlos(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit evidence-freshness-slos <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  const wantsJson = args.length === 1 && args[0] === "--json";
  const hasNoOptions = args.length === 0;

  if (!hasNoOptions && !wantsJson) {
    throw new Error("Usage: bandit evidence-freshness-slos validate [--json]");
  }

  const report = await validateEvidenceFreshnessSlos(repoRoot);

  if (wantsJson) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Evidence freshness SLO policy is valid.\n" };
}
