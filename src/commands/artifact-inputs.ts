import { validateArtifactInputTaxonomy } from "../state/artifact-inputs.js";

export async function artifactInputs(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit artifact-inputs <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  const wantsJson = args.length === 1 && args[0] === "--json";
  const hasNoOptions = args.length === 0;

  if (!hasNoOptions && !wantsJson) {
    throw new Error("Usage: bandit artifact-inputs validate [--json]");
  }

  const report = await validateArtifactInputTaxonomy(repoRoot);

  if (wantsJson) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Artifact input taxonomy is valid.\n" };
}
