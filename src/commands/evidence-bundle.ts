import { attestEvidenceBundle } from "../state/evidence-bundle-attestation.js";
import { canonicalJson } from "../state/gate-determinism.js";

export async function evidenceBundle(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "attest") {
    return attest(repoRoot, options);
  }

  throw new Error(evidenceBundleUsage());
}

async function attest(repoRoot: string, options: string[]) {
  const [workItem, ...flags] = options;
  if (!workItem || flags.some((flag) => flag !== "--json")) {
    throw new Error("Usage: bandit evidence-bundle attest <WORK_ITEM> [--json]");
  }

  const report = await attestEvidenceBundle(repoRoot, workItem);

  if (flags.includes("--json")) {
    return { output: `${canonicalJson(report)}\n` };
  }

  return {
    output: `Evidence bundle attestation pass: ${report.work_item} ${report.bundle_hash}\n`
  };
}

function evidenceBundleUsage() {
  return "Usage: bandit evidence-bundle <attest>";
}
