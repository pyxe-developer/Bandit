import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  requireResolvedOperatorInput,
  requireSharedVerdict,
  requireSourceDriftStatus
} from "./landing-gate-values.js";
import {
  hasMetadataField,
  parseMetadataFields,
  readList,
  readScalar,
  type ParsedFields
} from "./metadata.js";
import { readWorkItem, readWorkItems } from "./work-items.js";

export type ReviewEvidence = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  reviewSubjectHash: string;
  verificationState: string;
  verificationEvidence: string[];
  coderabbitState: string;
  coderabbitReplacementEvidence: string[];
  localQwenState: string;
  localQwenReplacementEvidence: string[];
  escalatedReviewRequired: boolean;
  escalatedReviewState: string;
  escalatedReviewRationale: string;
  pmDisposition: string;
  pmDispositionRationale: string;
  nonBlockingFindingsRouting: string[];
  operatorInputStatus: string;
  uatStatus: string;
  cleanCodeStatus: string;
  sourceDriftStatus: string;
  bootstrapGaps: string[];
};

type OptionalArtifact = {
  content: string;
  displayPath: string;
};

const REVIEW_EVIDENCE_FILE = "review-evidence.md";

const REQUIRED_REVIEW_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "verification_state",
  "coderabbit_state",
  "local_qwen_state",
  "escalated_review_required",
  "escalated_review_state",
  "escalated_review_rationale",
  "pm_disposition",
  "operator_input_status",
  "uat_status",
  "clean_code_status",
  "source_drift_status"
];

const REQUIRED_REVIEW_LISTS = [
  "verification_evidence",
  "bootstrap_gaps"
];

export async function validateReviewEvidenceArtifacts(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalReviewEvidence(repoRoot, workItem.id);

    if (artifact && hasMetadataField(artifact.content, "contract_version")) {
      parseReviewEvidence(artifact.content, artifact.displayPath, workItem.id);
    }
  }
}

export async function readReviewEvidence(
  repoRoot: string,
  workItemId: string
) {
  await readWorkItem(repoRoot, workItemId);

  const displayPath = reviewEvidenceDisplayPath(workItemId);
  const content = await readRequiredReviewEvidence(
    repoRoot,
    workItemId,
    displayPath
  );

  return parseReviewEvidence(content, displayPath, workItemId);
}

function parseReviewEvidence(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): ReviewEvidence {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_REVIEW_SCALARS) {
    requireScalar(fields, field);
  }

  for (const field of REQUIRED_REVIEW_LISTS) {
    requireList(fields, field);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(`Unsupported review evidence contract version: ${contractVersion}`);
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed review evidence: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  requireSourceDriftStatus(sourceDriftStatus);

  const verificationState = readScalar(fields, "verification_state");
  const coderabbitState = readScalar(fields, "coderabbit_state");
  const localQwenState = readScalar(fields, "local_qwen_state");
  const escalatedReviewState = readScalar(fields, "escalated_review_state");
  const pmDisposition = readScalar(fields, "pm_disposition");
  const uatStatus = readScalar(fields, "uat_status");
  const cleanCodeStatus = readScalar(fields, "clean_code_status");

  requireSharedVerdict("verification state", verificationState);
  requireSharedVerdict("CodeRabbit state", coderabbitState);
  requireSharedVerdict("local Qwen state", localQwenState);
  requireSharedVerdict("escalated review state", escalatedReviewState);
  requireSharedVerdict("PM disposition", pmDisposition);
  requireSharedVerdict("UAT status", uatStatus);
  requireSharedVerdict("clean-code status", cleanCodeStatus);

  const operatorInputStatus = readScalar(fields, "operator_input_status");
  requireResolvedOperatorInput(
    "Review evidence",
    expectedWorkItemId,
    operatorInputStatus
  );

  const escalatedReviewRequired = parseBoolean(
    readScalar(fields, "escalated_review_required"),
    "escalated_review_required"
  );
  const coderabbitReplacementEvidence = readList(
    fields,
    "coderabbit_replacement_evidence"
  );
  const localQwenReplacementEvidence = readList(
    fields,
    "local_qwen_replacement_evidence"
  );
  const escalatedReviewRationale = readScalar(
    fields,
    "escalated_review_rationale"
  );

  if (coderabbitState === "bootstrap_gap") {
    requireReplacementEvidence(
      "CodeRabbit bootstrap_gap",
      coderabbitReplacementEvidence
    );
  }

  if (localQwenState === "bootstrap_gap") {
    requireReplacementEvidence(
      "local Qwen bootstrap_gap",
      localQwenReplacementEvidence
    );
  }

  if (escalatedReviewRequired && escalatedReviewState === "not_applicable") {
    throw new Error(
      "Escalated review is required but escalated_review_state is not_applicable"
    );
  }

  if (escalatedReviewState === "bootstrap_gap" && !escalatedReviewRationale) {
    throw new Error("Escalated review bootstrap_gap requires rationale");
  }

  return {
    contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    reviewSubjectHash: readScalar(fields, "review_subject_hash"),
    verificationState,
    verificationEvidence: readList(fields, "verification_evidence"),
    coderabbitState,
    coderabbitReplacementEvidence,
    localQwenState,
    localQwenReplacementEvidence,
    escalatedReviewRequired,
    escalatedReviewState,
    escalatedReviewRationale,
    pmDisposition,
    pmDispositionRationale: readScalar(fields, "pm_disposition_rationale"),
    nonBlockingFindingsRouting: readList(
      fields,
      "non_blocking_findings_routing"
    ),
    operatorInputStatus,
    uatStatus,
    cleanCodeStatus,
    sourceDriftStatus,
    bootstrapGaps: readList(fields, "bootstrap_gaps")
  };
}

async function readOptionalReviewEvidence(
  repoRoot: string,
  workItemId: string
): Promise<OptionalArtifact | null> {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(REVIEW_EVIDENCE_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, REVIEW_EVIDENCE_FILE), "utf8"),
      displayPath: reviewEvidenceDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readRequiredReviewEvidence(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, REVIEW_EVIDENCE_FILE),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing review evidence artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireScalar(fields: ParsedFields, field: string) {
  if (!readScalar(fields, field)) {
    throw new Error(`Review evidence missing required field: ${field}`);
  }
}

function requireList(fields: ParsedFields, field: string) {
  if (readList(fields, field).length === 0) {
    throw new Error(`Review evidence missing required field: ${field}`);
  }
}

function requireReplacementEvidence(label: string, evidence: string[]) {
  if (evidence.length === 0) {
    throw new Error(`${label} requires replacement evidence`);
  }
}

function parseBoolean(value: string, field: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Review evidence field ${field} must be true or false`);
}

function reviewEvidenceDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/review-evidence.md`;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
