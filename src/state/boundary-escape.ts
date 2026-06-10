import { readFile } from "node:fs/promises";
import path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EscapeEvidenceArtifact = {
  path: string;
  hash: string;
  freshnessState: string;
};

export type TouchedSurface = {
  path: string;
  surface: string;
};

export type EscapeCandidate = {
  contractVersion: number;
  workItem: string;
  sourceHead: string;
  reviewSubjectHash: string;
  boundaryPredictionRecord: string;
  attributionJoinKey: string;
  observedOutcome: string;
  expectedBoundaryOutcome: string;
  escapeSignal: string;
  touchedSurface: TouchedSurface;
  evidenceArtifacts: EscapeEvidenceArtifact[];
  reporter: string;
  candidateStatus: string;
};

export type BoundaryEscapeDisposition = {
  contractVersion: number;
  workItem: string;
  candidate: string;
  attributionStatus: string;
  dispositionVerdict: string;
  rationale: string;
  requiredOperatorInputStatus: string;
  evidenceReviewed: string[];
  result: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const GIT_COMMIT_SHA_PATTERN = /^[a-f0-9]{40}$/;

const SUPPORTED_CANDIDATE_STATUSES = new Set([
  "candidate",
  "closed_no_escape",
  "confirmed_escape"
]);

const SUPPORTED_ESCAPE_SIGNALS = new Set([
  "source_drift_after_review",
  "source_drift_before_review",
  "unexpected_model_output",
  "boundary_breach",
  "reviewer_bypass"
]);

const SUPPORTED_ATTRIBUTION_STATUSES = new Set([
  "attributed_to_boundary",
  "not_attributed",
  "ambiguous"
]);

const SUPPORTED_DISPOSITION_VERDICTS = new Set([
  "confirmed_escape",
  "no_escape",
  "needs_repair",
  "operator_input_required"
]);

// ---------------------------------------------------------------------------
// Escape Candidate field validation
// Returns an array of error strings; empty means valid.
// ---------------------------------------------------------------------------

export function validateEscapeCandidateFields(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId?: string
): string[] {
  const errors: string[] = [];

  const contractVersion = Number(raw.contract_version ?? raw.contractVersion ?? 0);
  if (contractVersion !== 1) {
    errors.push(`${displayPath}: unsupported contract_version ${contractVersion}`);
    return errors;
  }

  const workItem = String(raw.work_item ?? raw.workItem ?? "");
  if (!workItem) {
    errors.push(`${displayPath}: work_item is missing`);
  } else if (expectedWorkItemId && workItem !== expectedWorkItemId) {
    errors.push(
      `${displayPath}: work_item ${workItem} does not match ${expectedWorkItemId}`
    );
  }

  const sourceHead = String(raw.source_head ?? raw.sourceHead ?? "");
  if (!sourceHead) {
    errors.push(`${displayPath}: source_head is missing`);
  } else if (!GIT_COMMIT_SHA_PATTERN.test(sourceHead)) {
    errors.push(
      `${displayPath}: source_head must be a 40-character hex git commit sha`
    );
  }

  const reviewSubjectHash = String(raw.review_subject_hash ?? raw.reviewSubjectHash ?? "");
  if (!reviewSubjectHash) {
    errors.push(`${displayPath}: review_subject_hash is missing`);
  } else if (!SHA256_HEX_PATTERN.test(reviewSubjectHash)) {
    errors.push(`${displayPath}: review_subject_hash must be a sha256 hex digest`);
  }

  const candidateStatus = String(raw.candidate_status ?? raw.candidateStatus ?? "");
  if (!candidateStatus) {
    errors.push(`${displayPath}: candidate_status is missing`);
  } else if (!SUPPORTED_CANDIDATE_STATUSES.has(candidateStatus)) {
    errors.push(`${displayPath}: unsupported candidate_status "${candidateStatus}"`);
  }

  const escapeSignal = String(raw.escape_signal ?? raw.escapeSignal ?? "");
  if (!escapeSignal) {
    errors.push(`${displayPath}: escape_signal is missing`);
  } else if (!SUPPORTED_ESCAPE_SIGNALS.has(escapeSignal)) {
    errors.push(`${displayPath}: unsupported escape_signal "${escapeSignal}"`);
  }

  const touchedSurface = raw.touched_surface ?? raw.touchedSurface;
  if (!isRecord(touchedSurface)) {
    errors.push(`${displayPath}: touched_surface must be an object`);
  } else {
    if (!String(touchedSurface.path ?? "")) {
      errors.push(`${displayPath}: touched_surface.path is missing`);
    }
    if (!String(touchedSurface.surface ?? "")) {
      errors.push(`${displayPath}: touched_surface.surface is missing`);
    }
  }

  const evidenceArtifacts = raw.evidence_artifacts ?? raw.evidenceArtifacts;
  if (!Array.isArray(evidenceArtifacts)) {
    errors.push(`${displayPath}: evidence_artifacts must be an array`);
  } else if (evidenceArtifacts.length === 0) {
    errors.push(`${displayPath}: evidence_artifacts must be non-empty`);
  } else {
    for (let i = 0; i < evidenceArtifacts.length; i++) {
      const artifact = evidenceArtifacts[i];
      if (!isRecord(artifact)) {
        errors.push(`${displayPath}: evidence_artifacts[${i}] must be an object`);
      } else {
        const hash = String(artifact.hash ?? "");
        if (!hash) {
          errors.push(
            `${displayPath}: evidence_artifacts[${i}].hash must be non-blank`
          );
        } else if (!SHA256_HEX_PATTERN.test(hash)) {
          errors.push(
            `${displayPath}: evidence_artifacts[${i}].hash must be a sha256 hex digest`
          );
        }
      }
    }
  }

  const bpr = String(raw.boundary_prediction_record ?? raw.boundaryPredictionRecord ?? "");
  if (bpr && !isValidWorkItemPath(bpr)) {
    errors.push(
      `${displayPath}: boundary_prediction_record must be a relative path under docs/work/`
    );
  }

  const ajk = String(raw.attribution_join_key ?? raw.attributionJoinKey ?? "");
  if (ajk && !isValidWorkItemPath(ajk)) {
    errors.push(
      `${displayPath}: attribution_join_key must be a relative path under docs/work/`
    );
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Boundary Escape Disposition field validation
// Returns an array of error strings; empty means valid.
// ---------------------------------------------------------------------------

export function validateBoundaryEscapeDispositionFields(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId?: string
): string[] {
  const errors: string[] = [];

  const contractVersion = Number(raw.contract_version ?? raw.contractVersion ?? 0);
  if (contractVersion !== 1) {
    errors.push(`${displayPath}: unsupported contract_version ${contractVersion}`);
    return errors;
  }

  const workItem = String(raw.work_item ?? raw.workItem ?? "");
  if (!workItem) {
    errors.push(`${displayPath}: work_item is missing`);
  } else if (expectedWorkItemId && workItem !== expectedWorkItemId) {
    errors.push(
      `${displayPath}: work_item ${workItem} does not match ${expectedWorkItemId}`
    );
  }

  const candidate = String(raw.candidate ?? "");
  if (!candidate) {
    errors.push(`${displayPath}: candidate is missing`);
  }

  const attributionStatus = String(raw.attribution_status ?? raw.attributionStatus ?? "");
  if (!attributionStatus) {
    errors.push(`${displayPath}: attribution_status is missing`);
  } else if (!SUPPORTED_ATTRIBUTION_STATUSES.has(attributionStatus)) {
    errors.push(`${displayPath}: unsupported attribution_status "${attributionStatus}"`);
  }

  const dispositionVerdict = String(raw.disposition_verdict ?? raw.dispositionVerdict ?? "");
  if (!dispositionVerdict) {
    errors.push(`${displayPath}: disposition_verdict is missing`);
  } else if (!SUPPORTED_DISPOSITION_VERDICTS.has(dispositionVerdict)) {
    errors.push(`${displayPath}: unsupported disposition_verdict "${dispositionVerdict}"`);
  }

  const rationale = String(raw.rationale ?? "");
  if (!rationale) {
    errors.push(
      `${displayPath}: rationale (Codex PM attribution-review rationale) is missing`
    );
  }

  const requiredOperatorInputStatus = String(
    raw.required_operator_input_status ?? raw.requiredOperatorInputStatus ?? ""
  );
  if (!requiredOperatorInputStatus) {
    errors.push(`${displayPath}: required_operator_input_status is missing`);
  }

  const evidenceReviewed = raw.evidence_reviewed ?? raw.evidenceReviewed;
  if (!Array.isArray(evidenceReviewed) || evidenceReviewed.length === 0) {
    errors.push(`${displayPath}: evidence_reviewed must be non-empty`);
  }

  if (dispositionVerdict === "operator_input_required") {
    if (requiredOperatorInputStatus !== "required") {
      errors.push(
        `${displayPath}: operator_input_required requires required_operator_input_status required`
      );
    }
  }

  if (dispositionVerdict && dispositionVerdict !== "operator_input_required") {
    if (requiredOperatorInputStatus === "required") {
      errors.push(
        `${displayPath}: required_operator_input_status required is only valid for operator_input_required verdict`
      );
    }
  }

  const result = String(raw.result ?? "");
  if (result && dispositionVerdict && result !== dispositionVerdict) {
    errors.push(
      `${displayPath}: result ${result} does not agree with disposition_verdict ${dispositionVerdict}`
    );
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Aggregate validator — scans all work items for optional escape artifacts.
// ---------------------------------------------------------------------------

export async function validateBoundaryEscapeArtifacts(repoRoot: string): Promise<void> {
  const { readWorkItems } = await import("./work-items.js");
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    await validateEscapeCandidateForWorkItem(repoRoot, workItem.id);
    await validateBoundaryEscapeDispositionForWorkItem(repoRoot, workItem.id);
  }
}

async function validateEscapeCandidateForWorkItem(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const displayPath = escapeCandidateDisplayPath(workItemId);
  const filePath = path.join(repoRoot, displayPath);

  let raw: unknown;
  try {
    const content = await readFile(filePath, "utf8");
    raw = JSON.parse(content);
  } catch (error) {
    if (isMissingPathError(error)) {
      return;
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Escape Candidate: ${displayPath}: invalid JSON`);
    }
    throw error;
  }

  if (!isRecord(raw)) {
    throw new Error(`Escape Candidate: ${displayPath} must be an object`);
  }

  const errors = validateEscapeCandidateFields(raw, displayPath, workItemId);
  const firstError = errors[0];
  if (firstError !== undefined) {
    const prefix = `${displayPath}: `;
    throw new Error(`Escape Candidate: ${stripPrefix(firstError, prefix)}`);
  }
}

async function validateBoundaryEscapeDispositionForWorkItem(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const displayPath = boundaryEscapeDispositionDisplayPath(workItemId);
  const filePath = path.join(repoRoot, displayPath);

  let raw: unknown;
  try {
    const content = await readFile(filePath, "utf8");
    raw = JSON.parse(content);
  } catch (error) {
    if (isMissingPathError(error)) {
      return;
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Boundary Escape Disposition: ${displayPath}: invalid JSON`);
    }
    throw error;
  }

  if (!isRecord(raw)) {
    throw new Error(`Boundary Escape Disposition: ${displayPath} must be an object`);
  }

  const errors = validateBoundaryEscapeDispositionFields(raw, displayPath, workItemId);
  const firstError = errors[0];
  if (firstError !== undefined) {
    const prefix = `${displayPath}: `;
    throw new Error(`Boundary Escape Disposition: ${stripPrefix(firstError, prefix)}`);
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function escapeCandidateDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/escape-candidate.json`;
}

function boundaryEscapeDispositionDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/boundary-escape-disposition.json`;
}

function isValidWorkItemPath(value: string): boolean {
  return value.startsWith("docs/work/") && value.endsWith(".json");
}

function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as Record<string, unknown>).code === "ENOENT";
}
