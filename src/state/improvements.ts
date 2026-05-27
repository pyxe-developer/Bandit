import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseMetadataFields, readList, readScalar } from "./metadata.js";

export type ImprovementCandidate = {
  id: string;
  source_work_item: string;
  status: string;
  outcome: string;
  metric: string;
  baseline: string;
  expected_direction: string;
  evaluation_window: string;
  source_artifacts: string[];
  workflow_trial_guardrails?: WorkflowTrialGuardrails;
};

export type ImprovementEvaluation = {
  candidate_id: string;
  result: ImprovementResult;
  decision: ImprovementDecision;
  routing_action: string;
};

export type WorkflowTrialGuardrails = {
  decision_criteria: string;
  minimum_detectable_effect?: string;
  uncertainty?: string;
  reevaluation_window: string;
  proxy_risk: string;
};

type CandidateRecord = ImprovementCandidate & {
  displayPath: string;
  policyChanging: boolean;
};

type Artifact = {
  displayPath: string;
  content: string;
};

type ValidationIssue = {
  field: string;
  message: string;
};

export type ImprovementResult =
  | "effective"
  | "ineffective"
  | "inconclusive"
  | "reverted"
  | "double_down";

export type ImprovementDecision = "keep" | "revise" | "revert" | "double_down";

const REQUIRED_CANDIDATE_FIELDS = [
  "source_work_item",
  "source_artifacts",
  "hypothesis",
  "metric",
  "baseline",
  "expected_direction",
  "evaluation_window",
  "status",
  "outcome"
] as const;
const REQUIRED_EVALUATION_FIELDS = [
  "candidate_id",
  "source_artifacts",
  "metric",
  "baseline",
  "observed_metric_evidence",
  "comparison_to_baseline",
  "result",
  "decision",
  "rationale",
  "routing_action"
] as const;
const SUPPORTED_RESULTS = new Set([
  "effective",
  "ineffective",
  "inconclusive",
  "reverted",
  "double_down"
]);
const SUPPORTED_DECISIONS = new Set(["keep", "revise", "revert", "double_down"]);
const POLICY_CHANGE_TRUE_VALUES = new Set(["true", "yes", "required"]);

export async function readImprovementCandidates(repoRoot: string) {
  const artifacts = await readWorkMarkdownArtifacts(repoRoot);
  const candidates = artifacts.flatMap(readCandidatesFromArtifact);

  for (const candidate of candidates) {
    await validateCandidateSourceArtifacts(repoRoot, candidate);
  }

  return candidates
    .map(
      ({
        displayPath: _displayPath,
        policyChanging: _policyChanging,
        ...candidate
      }) => candidate
    )
    .sort((first, second) => first.id.localeCompare(second.id));
}

export async function validateImprovementEvaluation(
  repoRoot: string,
  candidateId: string,
  evidencePath: string
): Promise<ImprovementEvaluation> {
  const candidate = await findImprovementCandidate(repoRoot, candidateId);
  const artifact = await readRepoArtifact(repoRoot, evidencePath);
  const fields = parseMetadataFields(artifact);
  const issues = collectRequiredFieldIssues(fields, REQUIRED_EVALUATION_FIELDS);
  const evidenceCandidateId = readScalar(fields, "candidate_id");

  if (evidenceCandidateId && evidenceCandidateId !== candidate.id) {
    issues.push({
      field: "candidate_id",
      message: `Improvement evidence candidate mismatch: ${evidenceCandidateId}`
    });
  }

  const result = readScalar(fields, "result");
  if (result && !SUPPORTED_RESULTS.has(result)) {
    issues.push({
      field: "result",
      message: `Unsupported improvement result: ${result}`
    });
  }

  const decision = readScalar(fields, "decision");
  if (decision && !SUPPORTED_DECISIONS.has(decision)) {
    issues.push({
      field: "decision",
      message: `Unsupported improvement decision: ${decision}`
    });
  }

  if (candidate.policyChanging || isPolicyChangingWorkflowTrial(fields)) {
    issues.push(...collectPolicyEvaluationGuardrailIssues(fields));
  }

  const sourceArtifacts = readList(fields, "source_artifacts");
  for (const sourceArtifact of sourceArtifacts) {
    await assertRepoPathExists(
      repoRoot,
      sourceArtifact,
      `Missing improvement source artifact: ${sourceArtifact}`
    );
  }

  if (issues.length > 0) {
    throw new Error(issues.map((issue) => issue.message).join("\n"));
  }

  return {
    candidate_id: candidate.id,
    result: result as ImprovementResult,
    decision: decision as ImprovementDecision,
    routing_action: readScalar(fields, "routing_action")
  };
}

async function findImprovementCandidate(repoRoot: string, candidateId: string) {
  const artifacts = await readWorkMarkdownArtifacts(repoRoot);
  const candidates = artifacts.flatMap(readCandidatesFromArtifact);
  const candidate = candidates.find((item) => item.id === candidateId);

  if (!candidate) {
    throw new Error(`Improvement candidate not found: ${candidateId}`);
  }

  await validateCandidateSourceArtifacts(repoRoot, candidate);
  return candidate;
}

async function readWorkMarkdownArtifacts(repoRoot: string) {
  const workRoot = path.join(repoRoot, "docs/work");
  const artifacts: Artifact[] = [];
  const workItemDirs = await readDirectoryEntries(workRoot);

  for (const workItemDir of workItemDirs) {
    if (!workItemDir.isDirectory()) {
      continue;
    }

    const artifactRoot = path.join(workRoot, workItemDir.name);
    const artifactEntries = await readDirectoryEntries(artifactRoot);
    for (const artifactEntry of artifactEntries) {
      if (!artifactEntry.isFile() || !artifactEntry.name.endsWith(".md")) {
        continue;
      }

      const absolutePath = path.join(artifactRoot, artifactEntry.name);
      const displayPath = normalizeDisplayPath(path.relative(repoRoot, absolutePath));
      artifacts.push({
        displayPath,
        content: await readFile(absolutePath, "utf8")
      });
    }
  }

  return artifacts.sort((first, second) =>
    first.displayPath.localeCompare(second.displayPath)
  );
}

function readCandidatesFromArtifact(artifact: Artifact): CandidateRecord[] {
  return splitCandidateSections(artifact.content).map(({ id, content }) => {
    const fields = parseMetadataFields(content);
    const issues = collectRequiredFieldIssues(fields, REQUIRED_CANDIDATE_FIELDS);
    const policyChanging = isPolicyChangingWorkflowTrial(fields);
    const workflowTrialGuardrails = policyChanging
      ? readWorkflowTrialGuardrails(fields)
      : undefined;

    if (policyChanging) {
      issues.push(...collectWorkflowTrialGuardrailIssues(fields));
    }

    if (issues.length > 0) {
      throw new Error(
        formatValidationIssues(artifact.displayPath, issues)
      );
    }

    return {
      id,
      source_work_item: readScalar(fields, "source_work_item"),
      status: readScalar(fields, "status"),
      outcome: readScalar(fields, "outcome"),
      metric: readScalar(fields, "metric"),
      baseline: readScalar(fields, "baseline"),
      expected_direction: readScalar(fields, "expected_direction"),
      evaluation_window: readScalar(fields, "evaluation_window"),
      source_artifacts: readList(fields, "source_artifacts"),
      ...(workflowTrialGuardrails
        ? { workflow_trial_guardrails: workflowTrialGuardrails }
        : {}),
      policyChanging,
      displayPath: artifact.displayPath
    };
  });
}

function splitCandidateSections(content: string) {
  const matches = Array.from(content.matchAll(/^### Chore Candidate:\s+`([^`]+)`\s*$/gm));
  const explicitCandidates = matches.flatMap((match, index) => {
    const id = match[1]?.trim();
    if (!id || match.index === undefined) {
      return [];
    }

    const nextMatch = matches[index + 1];
    const endIndex = nextMatch?.index ?? content.length;
    return [
      {
        id,
        content: content.slice(match.index, endIndex)
      }
    ];
  });

  return explicitCandidates.concat(splitLegacyImprovementSections(content));
}

function splitLegacyImprovementSections(content: string) {
  const matches = Array.from(content.matchAll(/^## Improvement Chores\s*$/gm));
  return matches.flatMap((match, index) => {
    if (match.index === undefined) {
      return [];
    }

    const sectionBodyStart = match.index + match[0].length;
    const nextImprovementSectionStart = matches[index + 1]?.index ?? content.length;
    const nextHeadingOffset = content.slice(sectionBodyStart).search(/^## /m);
    const nextHeadingStart =
      nextHeadingOffset === -1 ? content.length : sectionBodyStart + nextHeadingOffset;
    const sectionEnd = Math.min(nextImprovementSectionStart, nextHeadingStart);
    const section = content.slice(match.index, sectionEnd);

    if (/^### Chore Candidate:/m.test(section)) {
      return [];
    }

    const fields = parseMetadataFields(section);
    const id = readScalar(fields, "linked_work_item");
    if (!id || readScalar(fields, "outcome") !== "pending") {
      return [];
    }

    return [
      {
        id,
        content: section
      }
    ];
  });
}

function collectRequiredFieldIssues(
  fields: ReturnType<typeof parseMetadataFields>,
  requiredFields: readonly string[]
) {
  const issues: ValidationIssue[] = [];

  for (const field of requiredFields) {
    const hasValue =
      field === "source_artifacts"
        ? readList(fields, field).length > 0
        : readScalar(fields, field).length > 0;

    if (!hasValue) {
      issues.push({
        field,
        message: `missing required improvement metadata: ${field}`
      });
    }
  }

  return issues;
}

function collectWorkflowTrialGuardrailIssues(
  fields: ReturnType<typeof parseMetadataFields>
) {
  const issues = collectRequiredFieldIssues(fields, [
    "decision_criteria",
    "reevaluation_window",
    "proxy_risk"
  ]);

  if (
    readScalar(fields, "minimum_detectable_effect").length === 0 &&
    readScalar(fields, "uncertainty").length === 0
  ) {
    issues.push({
      field: "minimum_detectable_effect, uncertainty",
      message:
        "missing required workflow trial guardrail metadata: minimum_detectable_effect, uncertainty"
    });
  }

  return issues.map((issue) =>
    issue.message.startsWith("missing required improvement metadata")
      ? {
          ...issue,
          message: `missing required workflow trial guardrail metadata: ${issue.field}`
        }
      : issue
  );
}

function collectPolicyEvaluationGuardrailIssues(
  fields: ReturnType<typeof parseMetadataFields>
) {
  return collectRequiredFieldIssues(fields, [
    "decision_criteria_comparison",
    "reevaluation_window",
    "proxy_risk_disposition"
  ]).map((issue) => ({
    ...issue,
    message: `missing required workflow trial guardrail metadata: ${issue.field}`
  }));
}

function readWorkflowTrialGuardrails(
  fields: ReturnType<typeof parseMetadataFields>
): WorkflowTrialGuardrails {
  const minimumDetectableEffect = readScalar(fields, "minimum_detectable_effect");
  const uncertainty = readScalar(fields, "uncertainty");

  return {
    decision_criteria: readScalar(fields, "decision_criteria"),
    ...(minimumDetectableEffect
      ? { minimum_detectable_effect: minimumDetectableEffect }
      : {}),
    ...(uncertainty ? { uncertainty } : {}),
    reevaluation_window: readScalar(fields, "reevaluation_window"),
    proxy_risk: readScalar(fields, "proxy_risk")
  };
}

function isPolicyChangingWorkflowTrial(
  fields: ReturnType<typeof parseMetadataFields>
) {
  const origin = readScalar(fields, "origin").toLowerCase();
  return (
    origin === "workflow_trial" ||
    isTruthyMetadata(fields, "workflow_trial") ||
    isTruthyMetadata(fields, "policy_change") ||
    isTruthyMetadata(fields, "policy_changing")
  );
}

function isTruthyMetadata(
  fields: ReturnType<typeof parseMetadataFields>,
  field: string
) {
  return POLICY_CHANGE_TRUE_VALUES.has(readScalar(fields, field).toLowerCase());
}

function formatValidationIssues(displayPath: string, issues: ValidationIssue[]) {
  const requiredImprovementFields = issues
    .filter((issue) =>
      issue.message.startsWith("missing required improvement metadata")
    )
    .map((issue) => issue.field);
  const otherMessages = issues
    .filter(
      (issue) => !issue.message.startsWith("missing required improvement metadata")
    )
    .map((issue) => issue.message);

  return [
    ...(requiredImprovementFields.length > 0
      ? [
          `${displayPath} missing required improvement metadata: ${requiredImprovementFields.join(", ")}`
        ]
      : []),
    ...otherMessages
  ].join("\n");
}

async function validateCandidateSourceArtifacts(
  repoRoot: string,
  candidate: CandidateRecord
) {
  for (const sourceArtifact of candidate.source_artifacts) {
    await assertRepoPathExists(
      repoRoot,
      sourceArtifact,
      `Missing improvement source artifact: ${sourceArtifact}`
    );
  }
}

async function readRepoArtifact(repoRoot: string, inputPath: string) {
  const artifactPath = resolveRepoPath(repoRoot, inputPath);
  try {
    return await readFile(artifactPath.absolutePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Improvement evaluation evidence not found: ${artifactPath.displayPath}`);
    }
    throw error;
  }
}

async function assertRepoPathExists(
  repoRoot: string,
  inputPath: string,
  errorMessage: string
) {
  const resolved = resolveRepoPath(repoRoot, inputPath);
  try {
    await access(resolved.absolutePath);
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(errorMessage);
    }
    throw error;
  }
}

function resolveRepoPath(repoRoot: string, inputPath: string) {
  const absolutePath = path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(repoRoot, inputPath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Improvement artifact path must stay within repository: ${inputPath}`);
  }

  return {
    absolutePath,
    displayPath: normalizeDisplayPath(relativePath)
  };
}

async function readDirectoryEntries(directoryPath: string) {
  try {
    return await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }
}

function normalizeDisplayPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
