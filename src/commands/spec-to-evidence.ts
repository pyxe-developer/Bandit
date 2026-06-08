import {
  evaluateSpecToEvidenceTraceability,
  type TraceabilityReport
} from "../state/spec-to-evidence-traceability.js";

export type SpecToEvidenceResult = {
  stdout?: string;
  stderr?: string;
  code?: number;
};

export async function specToEvidence(
  repoRoot: string,
  args: string[]
): Promise<SpecToEvidenceResult> {
  const [action, workItemId, ...rest] = args;

  if (action !== "validate") {
    return usageError();
  }

  if (!workItemId || rest.some((option) => option !== "--json")) {
    return usageError();
  }

  const wantsJson = rest.includes("--json");
  const evaluation = await evaluateSpecToEvidenceTraceability(
    repoRoot,
    workItemId
  );

  if (!evaluation.ok) {
    return { stderr: `${evaluation.diagnostics.join("\n")}\n`, code: 1 };
  }

  if (wantsJson) {
    return { stdout: `${JSON.stringify(evaluation.report, null, 2)}\n` };
  }

  return { stdout: renderHumanSummary(evaluation.report) };
}

function renderHumanSummary(report: TraceabilityReport): string {
  const lines = [
    `Spec-to-evidence traceability: ${report.status}`,
    `Work item: ${report.work_item}`,
    `Covered risk tier: ${report.covered_risk_tier}`,
    "Acceptance criteria:"
  ];

  for (const criterion of report.acceptance_criteria) {
    const proof = criterion.evidence_type
      ? `evidence_type=${criterion.evidence_type}`
      : `disposition=${criterion.disposition}`;
    lines.push(`  ${criterion.id}: ${proof}`);
  }

  return `${lines.join("\n")}\n`;
}

function usageError(): SpecToEvidenceResult {
  return {
    stderr: "Usage: bandit spec-to-evidence validate <work-item-id> [--json]\n",
    code: 1
  };
}
