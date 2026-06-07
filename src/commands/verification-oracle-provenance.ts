import { validateVerificationOracleProvenance } from "../state/verification-oracle-provenance.js";

export async function verificationOracleProvenance(
  repoRoot: string,
  args: string[]
) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(verificationOracleProvenanceUsage());
}

async function validate(repoRoot: string, args: string[]) {
  let json = false;
  const positional: string[] = [];

  for (const arg of args) {
    if (arg === "--json") {
      json = true;
      continue;
    }
    positional.push(arg);
  }

  if (positional.length > 1) {
    throw new Error(
      "Usage: bandit verification-oracle-provenance validate [--json] [work-item-id]"
    );
  }

  const report = await validateVerificationOracleProvenance(
    repoRoot,
    positional[0]
  );

  if (json) {
    return { output: `${JSON.stringify(report)}\n` };
  }

  const checkedLines =
    report.checked_work_items.length > 0
      ? report.checked_work_items.map((id) => `  - ${id}`)
      : ["  - none"];

  return {
    output: [
      "Verification oracle provenance gate: pass",
      "Checked work items:",
      ...checkedLines
    ]
      .join("\n")
      .concat("\n")
  };
}

function verificationOracleProvenanceUsage() {
  return "Usage: bandit verification-oracle-provenance <validate> [--json] [work-item-id]";
}
