import { readBootstrapGaps } from "../state/bootstrap-gaps.js";

export async function listBootstrapGaps(repoRoot: string) {
  const ledger = await readBootstrapGaps(repoRoot);

  if (ledger.gaps.length === 0) {
    return { output: "No bootstrap gaps found.\n" };
  }

  return {
    output: ledger.gaps
      .map((gap) =>
        [
          gap.id,
          gap.status,
          gap.disposition,
          gap.sourceWorkItem,
          gap.linkedWorkItem || "unlinked",
          gap.nextAction
        ].join(" | ")
      )
      .join("\n")
      .concat("\n")
  };
}
