import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { appendLifecycleEvent } from "../state/events.js";
import { getBanditPaths } from "../state/paths.js";

type ArtifactKind =
  | "red_evidence"
  | "implementation_evidence"
  | "landing_verdict"
  | "retrospective";

type ArtifactSpec = {
  kind: ArtifactKind;
  workItem: string;
  content: string;
  outputFile: string;
};

const SUPPORTED_KINDS = new Set([
  "red_evidence",
  "implementation_evidence",
  "landing_verdict",
  "retrospective"
]);

const OUTPUT_FILES: Record<ArtifactKind, string> = {
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

export async function createArtifact(repoRoot: string, args: string[]) {
  if (args[0] !== "create" || !args[1] || args.length !== 2) {
    throw new Error("Usage: bandit artifact create <spec-path>");
  }

  const specLocation = resolveRepoPath(repoRoot, args[1]);
  const rawSpec = await readSpec(specLocation.absolutePath, specLocation.displayPath);
  const spec = validateSpec(rawSpec);
  const workDir = path.join(repoRoot, "docs/work", spec.workItem);
  const artifactPath = path.join(workDir, spec.outputFile);
  const artifactDisplayPath = normalizeDisplayPath(
    path.relative(repoRoot, artifactPath)
  );

  await assertWorkItemExists(workDir, spec.workItem);
  await assertArtifactPathIsFree(artifactPath, artifactDisplayPath);
  await mkdir(workDir, { recursive: true });
  await writeFile(artifactPath, spec.content, { flag: "wx" });
  await appendLifecycleEvent(getBanditPaths(repoRoot).events, {
    type: "artifact_created",
    work_item: spec.workItem,
    message: `Created ${spec.kind} artifact at ${artifactDisplayPath}`
  });

  return {
    output: `Created artifact: ${artifactDisplayPath}\n`
  };
}

function resolveRepoPath(repoRoot: string, inputPath: string) {
  const absolutePath = path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(repoRoot, inputPath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Artifact spec path must stay within repository: ${inputPath}`);
  }

  return {
    absolutePath,
    displayPath: normalizeDisplayPath(relativePath)
  };
}

async function readSpec(filePath: string, displayPath: string) {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Artifact spec not found: ${displayPath}`);
    }
    throw error;
  }

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error(`Malformed artifact spec JSON: ${displayPath}`);
  }
}

function validateSpec(rawSpec: unknown): ArtifactSpec {
  if (!isRecord(rawSpec)) {
    throw new Error("Artifact spec must be an object");
  }

  const kind = requireKind(rawSpec);
  const workItem = requireString(rawSpec, "work_item");

  return {
    kind,
    workItem,
    outputFile: OUTPUT_FILES[kind],
    content: renderArtifact(workItem, kind, rawSpec)
  };
}

function requireKind(spec: Record<string, unknown>) {
  const kind = requireString(spec, "kind");

  if (!SUPPORTED_KINDS.has(kind)) {
    throw new Error(`Unsupported artifact spec kind: ${kind}`);
  }

  return kind as ArtifactKind;
}

function renderArtifact(
  workItem: string,
  kind: ArtifactKind,
  spec: Record<string, unknown>
) {
  if (kind === "red_evidence") {
    return renderRedEvidence(workItem, spec);
  }

  if (kind === "implementation_evidence") {
    return renderImplementationEvidence(workItem, spec);
  }

  if (kind === "landing_verdict") {
    return renderLandingVerdict(workItem, spec);
  }

  return renderRetrospective(workItem, spec);
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
  const fields = [
    "contract_version",
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

  const lines = fields.map((field) => `${field}: ${requireScalar(spec, field)}`);

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

async function assertWorkItemExists(workDir: string, workItem: string) {
  if (!(await pathExists(path.join(workDir, "brief.md")))) {
    throw new Error(`Unknown work item: ${workItem}`);
  }
}

async function assertArtifactPathIsFree(
  artifactPath: string,
  artifactDisplayPath: string
) {
  if (await pathExists(artifactPath)) {
    throw new Error(
      `Refusing to overwrite existing artifact path: ${artifactDisplayPath}`
    );
  }
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

function requireScalar(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (
    (typeof value !== "string" || value.trim().length === 0) &&
    typeof value !== "number" &&
    typeof value !== "boolean"
  ) {
    throw new Error(`Artifact spec missing required field: ${field}`);
  }

  return String(value);
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

function normalizeDisplayPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    (error.code === "ENOENT" || error.code === "ENOTDIR")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
