export type ArtifactKind =
  | "red_evidence"
  | "implementation_evidence"
  | "landing_verdict"
  | "retrospective";

export const SUPPORTED_KINDS = new Set([
  "red_evidence",
  "implementation_evidence",
  "landing_verdict",
  "retrospective"
]);

export const OUTPUT_FILES: Record<ArtifactKind, string> = {
  red_evidence: "red-evidence.md",
  implementation_evidence: "implementation-evidence.md",
  landing_verdict: "landing-verdict.md",
  retrospective: "retrospective.md"
};

const ARTIFACT_LABELS: Record<ArtifactKind, string> = {
  red_evidence: "RED Evidence",
  implementation_evidence: "Implementation Evidence",
  landing_verdict: "Landing Verdict",
  retrospective: "Retrospective"
};

const LANDING_VERDICT_FIELDS = [
  "contract_version",
  "work_item",
  "source_head",
  "review_evidence",
  "tests_status",
  "clean_code_status",
  "coderabbit_state",
  "local_qwen_state",
  "escalated_review_state",
  "uat_status",
  "source_drift_status",
  "operator_input_status",
  "landing_agent_state",
  "landing_agent_replacement_evidence",
  "final_verdict",
  "rationale"
];

export function renderArtifact(
  workItem: string,
  kind: ArtifactKind,
  spec: Record<string, unknown>
) {
  switch (kind) {
    case "red_evidence":
      return renderRedEvidence(workItem, spec);
    case "implementation_evidence":
      return renderImplementationEvidence(workItem, spec);
    case "landing_verdict":
      return renderLandingVerdict(workItem, spec);
    case "retrospective":
      return renderRetrospective(workItem, spec);
  }
}

function renderRedEvidence(workItem: string, spec: Record<string, unknown>) {
  const status = requireString(spec, "status");
  const stage = requireString(spec, "stage");
  const summary = requireString(spec, "summary");
  const testCommand = requireString(spec, "test_command");
  const observedOutput = requireStringList(spec, "observed_output");
  const acceptanceCriteriaMapping = requireMappingRows(
    spec,
    "acceptance_criteria_mapping"
  );
  const nextAction = requireString(spec, "next_action");

  return `# ${workItem} ${ARTIFACT_LABELS.red_evidence}

## Status

\`${status}\` for ${stage}.

${summary}

## Test Command

\`\`\`sh
${testCommand}
\`\`\`

## Observed Output

\`\`\`text
${observedOutput.join("\n")}
\`\`\`

## Acceptance Criteria Mapping

${renderTable(["Criterion", "Evidence"], acceptanceCriteriaMapping)}

## Next Action

${nextAction}
`;
}

function renderImplementationEvidence(
  workItem: string,
  spec: Record<string, unknown>
) {
  const status = requireString(spec, "status");
  const summary = requireString(spec, "summary");
  const implementationSummary = requireStringList(spec, "implementation_summary");
  const verification = requireStringList(spec, "verification");
  const cleanCodeCheck = requireCleanCodeRows(spec, "clean_code_check");
  const nextAction = requireString(spec, "next_action");

  return `# ${workItem} ${ARTIFACT_LABELS.implementation_evidence}

## Status

\`${status}\`

${summary}

## Implementation Summary

${renderList(implementationSummary)}

## Verification

${renderList(verification)}

## Clean-Code Self-Check

${renderTable(["Rubric", "Verdict", "Evidence"], cleanCodeCheck)}

## Next Action

${nextAction}
`;
}

function renderLandingVerdict(workItem: string, spec: Record<string, unknown>) {
  const lines = LANDING_VERDICT_FIELDS.map(
    (field) => `${field}: ${requireString(spec, field)}`
  );

  return `# ${workItem} ${ARTIFACT_LABELS.landing_verdict}

${lines.join("\n")}
`;
}

function renderRetrospective(workItem: string, spec: Record<string, unknown>) {
  const outcome = requireString(spec, "outcome");
  const whatWorked = requireStringList(spec, "what_worked");
  const lessonsAndDispositions = requireRetrospectiveRows(
    spec,
    "lessons_and_dispositions"
  );
  const improvementChores = requireString(spec, "improvement_chores");
  const crossModelTension = requireString(spec, "cross_model_tension");
  const bootstrapGapsRemaining = requireStringList(
    spec,
    "bootstrap_gaps_remaining"
  );

  return `# ${workItem} ${ARTIFACT_LABELS.retrospective}

## Outcome

${outcome}

## What Worked

${renderList(whatWorked)}

## Lessons And Dispositions

${renderTable(["Lesson", "Disposition", "Rationale"], lessonsAndDispositions)}

## Improvement Chores

${improvementChores}

## Cross-Model Tension

${crossModelTension}

## Bootstrap Gaps Remaining

${renderList(bootstrapGapsRemaining)}
`;
}

function requireMappingRows(spec: Record<string, unknown>, field: string) {
  const rows = requireRecordList(spec, field);

  return rows.map((row) => [
    requireString(row, "criterion"),
    requireString(row, "evidence")
  ]);
}

function requireCleanCodeRows(spec: Record<string, unknown>, field: string) {
  const rows = requireRecordList(spec, field);

  return rows.map((row) => [
    requireString(row, "rubric"),
    requireString(row, "verdict"),
    requireString(row, "evidence")
  ]);
}

function requireRetrospectiveRows(
  spec: Record<string, unknown>,
  field: string
) {
  const rows = requireRecordList(spec, field);

  return rows.map((row) => [
    requireString(row, "lesson"),
    requireString(row, "disposition"),
    requireString(row, "rationale")
  ]);
}

function requireRecordList(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (!Array.isArray(value) || value.length === 0 || !value.every(isRecord)) {
    throw new Error(`Artifact spec missing required field: ${field}`);
  }

  return value;
}

function requireStringList(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((entry) => typeof entry === "string" && entry.trim().length > 0)
  ) {
    throw new Error(`Artifact spec missing required field: ${field}`);
  }

  return value;
}

function requireString(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Artifact spec missing required field: ${field}`);
  }

  return value;
}

function renderList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderTable(headers: string[], rows: string[][]) {
  const header = `| ${headers.join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

  return `${header}\n${divider}\n${body}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
