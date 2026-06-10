import { readFile } from "node:fs/promises";
import path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AttributionJoinKey = {
  contractVersion: number;
  artifactKind: string;
  artifactPath: string;
  workItem: string;
  actorIdentity: string;
  roleOrProfile: string;
  model: string;
  modelVersion: string;
  profileHash: string;
  reviewSubjectHash: string;
  evidenceArtifactHashes: EvidenceArtifactHash[];
  touchedSurface: string;
  boundaryPredictionRecord: string;
  authorizingBoundaryCell: string;
  landingAutonomyLevel: string;
  purpose: string;
  artifactState: string;
  attributionJoinHash: string;
};

export type EvidenceArtifactHash = {
  path: string;
  hash: string;
};

// ---------------------------------------------------------------------------
// SHA-256 hex digest validation
// ---------------------------------------------------------------------------

const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

const SUPPORTED_ARTIFACT_KINDS = new Set(["landing", "model_call", "tool_call", "escape"]);


function isValidSha256Hex(value: string): boolean {
  return SHA256_HEX_PATTERN.test(value);
}

// ---------------------------------------------------------------------------
// Parse attribution join key from raw parsed JSON object
// Accepts both camelCase (typed) and snake_case (raw JSON) field access.
// ---------------------------------------------------------------------------

function parseAttributionJoinKeyFromObject(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId?: string
): AttributionJoinKey {
  const errors = validateAttributionJoinKeyFields(raw, displayPath, expectedWorkItemId);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return {
    contractVersion: Number(raw.contract_version ?? raw.contractVersion ?? 0),
    artifactKind: String(raw.artifact_kind ?? raw.artifactKind ?? ""),
    artifactPath: String(raw.artifact_path ?? raw.artifactPath ?? ""),
    workItem: String(raw.work_item ?? raw.workItem ?? ""),
    actorIdentity: String(raw.actor_identity ?? raw.actorIdentity ?? ""),
    roleOrProfile: String(raw.role_or_profile ?? raw.roleOrProfile ?? ""),
    model: String(raw.model ?? ""),
    modelVersion: String(raw.model_version ?? raw.modelVersion ?? ""),
    profileHash: String(raw.profile_hash ?? raw.profileHash ?? ""),
    reviewSubjectHash: String(raw.review_subject_hash ?? raw.reviewSubjectHash ?? ""),
    evidenceArtifactHashes: ((): EvidenceArtifactHash[] => {
      const arr = (raw.evidence_artifact_hashes ?? raw.evidenceArtifactHashes) as unknown;
      return Array.isArray(arr)
        ? arr.map((a: unknown) => {
            if (typeof a === "object" && a !== null) {
              const obj = a as Record<string, unknown>;
              return {
                path: String(obj.path ?? ""),
                hash: String(obj.hash ?? "")
              };
            }
            return { path: "", hash: "" };
          })
        : [];
    })(),
    touchedSurface: String(raw.touched_surface ?? raw.touchedSurface ?? ""),
    boundaryPredictionRecord: String(
      raw.boundary_prediction_record ?? raw.boundaryPredictionRecord ?? ""
    ),
    authorizingBoundaryCell: String(
      raw.authorizing_boundary_cell ?? raw.authorizingBoundaryCell ?? ""
    ),
    landingAutonomyLevel: String(
      raw.landing_autonomy_level ?? raw.landingAutonomyLevel ?? ""
    ),
    purpose: String(raw.purpose ?? ""),
    artifactState: String(raw.artifact_state ?? raw.artifactState ?? ""),
    attributionJoinHash: String(raw.attribution_join_hash ?? raw.attributionJoinHash ?? "")
  };
}

// ---------------------------------------------------------------------------
// Field-level validation for attribution join key artifacts
// Returns an array of error strings; empty means valid.
// ---------------------------------------------------------------------------

export function validateAttributionJoinKeyFields(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId?: string
): string[] {
  const errors: string[] = [];

  const contractVersion = Number(raw.contract_version ?? raw.contractVersion ?? 0);
  if (contractVersion !== 1) {
    errors.push(
      `${displayPath}: unsupported contract_version ${contractVersion}`
    );
    // Stop field-level checks on unsupported version to avoid noise.
    return errors;
  }

  if (!isRecord(raw)) {
    errors.push(`${displayPath}: must be an object`);
    return errors;
  }

  // work_item must match expected work item ID if provided.
  const workItem = String(raw.work_item ?? raw.workItem ?? "");
  if (!workItem) {
    errors.push(`${displayPath}: work_item is missing`);
  } else if (expectedWorkItemId && workItem !== expectedWorkItemId) {
    errors.push(
      `${displayPath}: work_item ${workItem} does not match ${expectedWorkItemId}`
    );
  }

  // actor_identity must be non-blank.
  const actorIdentity = String(raw.actor_identity ?? raw.actorIdentity ?? "");
  if (!actorIdentity) {
    errors.push(`${displayPath}: actor_identity is missing`);
  }

  // review_subject_hash must be a valid SHA-256 hex digest.
  const reviewSubjectHash = String(raw.review_subject_hash ?? raw.reviewSubjectHash ?? "");
  if (!reviewSubjectHash) {
    errors.push(`${displayPath}: review_subject_hash is missing`);
  } else if (!isValidSha256Hex(reviewSubjectHash)) {
    errors.push(
      `${displayPath}: review_subject_hash must be a sha256 hex digest`
    );
  }

  // evidence_artifact_hashes must be present and each hash must be a valid SHA-256 hex digest.
  const evidenceArtifactHashes = raw.evidence_artifact_hashes ?? raw.evidenceArtifactHashes;
  if (!Array.isArray(evidenceArtifactHashes)) {
    errors.push(
      `${displayPath}: evidence_artifact_hashes must be an array`
    );
  } else {
    for (let i = 0; i < evidenceArtifactHashes.length; i++) {
      const artifact = evidenceArtifactHashes[i];
      if (!isRecord(artifact)) {
        errors.push(
          `${displayPath}: evidence_artifact_hashes[${i}] must be an object`
        );
      } else {
        const hash = String(artifact.hash ?? "");
        if (!hash) {
          errors.push(
            `${displayPath}: evidence_artifact_hashes[${i}].hash must be non-blank`
          );
        } else if (!isValidSha256Hex(hash)) {
          errors.push(
            `${displayPath}: evidence_artifact_hashes[${i}].hash must be a sha256 hex digest`
          );
        }
      }
    }
  }

  // authorizing_boundary_cell must be non-blank.
  const authorizingBoundaryCell = String(
    raw.authorizing_boundary_cell ?? raw.authorizingBoundaryCell ?? ""
  );
  if (!authorizingBoundaryCell) {
    errors.push(
      `${displayPath}: authorizing_boundary_cell is missing`
    );
  }

  // landing_autonomy_level must be non-blank.
  const landingAutonomyLevel = String(
    raw.landing_autonomy_level ?? raw.landingAutonomyLevel ?? ""
  );
  if (!landingAutonomyLevel) {
    errors.push(
      `${displayPath}: landing_autonomy_level is missing`
    );
  }

  // artifact_kind must be a supported value.
  const artifactKind = String(raw.artifact_kind ?? raw.artifactKind ?? "");
  if (!artifactKind) {
    errors.push(`${displayPath}: artifact_kind is missing`);
  } else if (!SUPPORTED_ARTIFACT_KINDS.has(artifactKind)) {
    errors.push(
      `${displayPath}: unsupported artifact_kind "${artifactKind}"; supported values: ${[...SUPPORTED_ARTIFACT_KINDS].join(", ")}`
    );
  }

  // When artifact_kind is landing, require additional fields.
  if (artifactKind === "landing") {
    const artifactPath = String(raw.artifact_path ?? raw.artifactPath ?? "");
    if (!artifactPath) {
      errors.push(`${displayPath}: artifact_path is required for landing artifacts`);
    }

    const roleOrProfile = String(raw.role_or_profile ?? raw.roleOrProfile ?? "");
    if (!roleOrProfile) {
      errors.push(`${displayPath}: role_or_profile is required for landing artifacts`);
    }

    const touchedSurface = String(raw.touched_surface ?? raw.touchedSurface ?? "");
    if (!touchedSurface) {
      errors.push(`${displayPath}: touched_surface is required for landing artifacts`);
    }

    const boundaryPredictionRecord = String(
      raw.boundary_prediction_record ?? raw.boundaryPredictionRecord ?? ""
    );
    if (!boundaryPredictionRecord) {
      errors.push(
        `${displayPath}: boundary_prediction_record is required for landing artifacts`
      );
    }

    const purpose = String(raw.purpose ?? "");
    if (!purpose) {
      errors.push(`${displayPath}: purpose is required for landing artifacts`);
    }

    const artifactState = String(raw.artifact_state ?? raw.artifactState ?? "");
    if (!artifactState) {
      errors.push(`${displayPath}: artifact_state is required for landing artifacts`);
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Read attribution join key from JSON file
// ---------------------------------------------------------------------------

export async function readAttributionJoinKey(
  repoRoot: string,
  workItemId: string,
  displayPath = attributionJoinKeyDisplayPath(workItemId)
): Promise<AttributionJoinKey> {
  const content = await readRequiredJsonFile(
    resolveAttributionJoinKeyPath(repoRoot, workItemId, displayPath),
    displayPath
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`${displayPath}: invalid JSON`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`${displayPath}: must be an object`);
  }

  return parseAttributionJoinKeyFromObject(parsed, displayPath, workItemId);
}

export async function readOptionalAttributionJoinKey(
  repoRoot: string,
  workItemId: string,
  displayPath = attributionJoinKeyDisplayPath(workItemId)
): Promise<AttributionJoinKey | null> {
  try {
    return await readAttributionJoinKey(repoRoot, workItemId, displayPath);
  } catch (error) {
    // Only skip (return null) when the file does not exist.
    // Detect missing files by the "Missing Attribution Join Key:" prefix in the
    // error message; re-throw on malformed JSON or other validation errors.
    if (
      error instanceof Error &&
      error.message.startsWith("Missing Attribution Join Key:")
    ) {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Validate attribution join key artifacts for validate command
// Checks every work item that has a landing-attribution-join-key.json file.
// ---------------------------------------------------------------------------

export async function validateAttributionJoinKeyArtifacts(
  repoRoot: string
): Promise<void> {
  const { readWorkItems } = await import("./work-items.js");
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const displayPath = attributionJoinKeyDisplayPath(workItem.id);
    let key = null;
    try {
      key = await readOptionalAttributionJoinKey(repoRoot, workItem.id);
    } catch (error) {
      // File not found or malformed JSON: strip path prefix, strip any existing
      // "Attribution Join Key:" wrapper (from field errors), then re-wrap once.
      if (error instanceof Error) {
        const msg = error.message;
        let stripped = msg.startsWith(`${displayPath}: `)
          ? msg.slice(`${displayPath}: `.length)
          : msg;
        const ajkPrefix = "Attribution Join Key: ";
        if (stripped.startsWith(ajkPrefix)) {
          stripped = stripped.slice(ajkPrefix.length);
        }
        throw new Error(`Attribution Join Key: ${stripped}`);
      }
      throw error;
    }
    if (!key) {
      // No attribution join key artifact for this work item; nothing to validate.
      continue;
    }
    try {
      // Validate field-level correctness using spread of camelCase typed object.
      const errors = validateAttributionJoinKeyFields(
        { contract_version: key.contractVersion, ...key },
        displayPath,
        workItem.id
      );
      if (errors.length > 0) {
        const joined = errors.join("; ");
        // Field errors already include "Attribution Join Key" prefix via displayPath;
        // re-throw without additional wrapping to avoid double "Attribution Join Key:".
        throw new Error(joined);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Attribution Join Key: ${error.message}`);
      }
      throw error;
    }
  }
}

// ---------------------------------------------------------------------------
// Validate landing attribution join key against a boundary prediction record.
// Called from land-check when boundary autonomy is claimed.
// Fails closed: if attribution join key is required but missing, add problem.
// If attribution join key is present, validate it and cross-check with BPR.
// ---------------------------------------------------------------------------

export async function gatherLandingAttributionProblems(
  repoRoot: string,
  workItemId: string,
  boundaryPredictionRecord: {
    authorizingBoundaryCell: string;
    landingAutonomyLevel: string;
    reviewSubjectHash: string;
    workItem: string;
    boundaryPredictionRecord: string;
  },
  attributionJoinKeyPath?: string
): Promise<string[]> {
  const problems: string[] = [];
  const displayPath = attributionJoinKeyPath ?? attributionJoinKeyDisplayPath(workItemId);


  const attributionJoinKey = await readOptionalAttributionJoinKey(
    repoRoot,
    workItemId,
    displayPath
  );

  if (!attributionJoinKey) {
    problems.push(`Missing Attribution Join Key: ${displayPath}`);
    return problems;
  }

  // Validate attribution join key fields.
  const errors = validateAttributionJoinKeyFields(
    { contract_version: attributionJoinKey.contractVersion, ...attributionJoinKey },
    displayPath,
    workItemId
  );

  // Cross-check: authorizing_boundary_cell must match BPR.
  if (
    attributionJoinKey.authorizingBoundaryCell !==
    boundaryPredictionRecord.authorizingBoundaryCell
  ) {
    errors.push(
      `Attribution Join Key: authorizing_boundary_cell ${attributionJoinKey.authorizingBoundaryCell} does not match Boundary Prediction Record authorizing_boundary_cell ${boundaryPredictionRecord.authorizingBoundaryCell}`
    );
  }

  // Cross-check: landing_autonomy_level must match BPR.
  if (
    attributionJoinKey.landingAutonomyLevel !==
    boundaryPredictionRecord.landingAutonomyLevel
  ) {
    errors.push(
      `Attribution Join Key: landing_autonomy_level ${attributionJoinKey.landingAutonomyLevel} does not match Boundary Prediction Record landing_autonomy_level ${boundaryPredictionRecord.landingAutonomyLevel}`
    );
  }

  // Cross-check: work_item must match BPR work item.
  if (attributionJoinKey.workItem !== boundaryPredictionRecord.workItem) {
    errors.push(
      `Attribution Join Key: work_item ${attributionJoinKey.workItem} does not match Boundary Prediction Record work_item ${boundaryPredictionRecord.workItem}`
    );
  }

  // Cross-check: review_subject_hash must match the Boundary Prediction Record.
  if (!attributionJoinKey.reviewSubjectHash) {
    errors.push(
      `Attribution Join Key: review_subject_hash is missing`
    );
  } else if (
    attributionJoinKey.reviewSubjectHash !==
    boundaryPredictionRecord.reviewSubjectHash
  ) {
    errors.push(
      `Attribution Join Key: review_subject_hash ${attributionJoinKey.reviewSubjectHash} does not match Boundary Prediction Record review_subject_hash ${boundaryPredictionRecord.reviewSubjectHash}`
    );
  }

  // Cross-check: boundary_prediction_record path must be consistent.
  if (!attributionJoinKey.boundaryPredictionRecord) {
    errors.push(
      `Attribution Join Key: boundary_prediction_record is missing`
    );
  } else if (attributionJoinKey.boundaryPredictionRecord !== boundaryPredictionRecord.boundaryPredictionRecord) {
    errors.push(
      `Attribution Join Key: boundary_prediction_record ${attributionJoinKey.boundaryPredictionRecord} does not match Boundary Prediction Record path ${boundaryPredictionRecord.boundaryPredictionRecord}`
    );
  }

  if (errors.length > 0) {
    problems.push(...errors);
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Deterministic attribution_join_hash derivation from canonical tuple
// Field order: stable, deterministic, and changes when any field changes.
// The structured tuple is canonical; the hash is derived lookup data only.
// ---------------------------------------------------------------------------

/**
 * Derive a deterministic attribution_join_hash from a canonical attribution join key.
 * Uses JSON canonicalization (stable field ordering) before hashing to ensure
 * the derived hash changes whenever any canonical field changes.
 *
 * The hash is derived lookup data only. It is not canonical evidence; the
 * structured tuple fields are the canonical evidence. Callers should use
 * this hash for quick lookups and equality checks, but the structured tuple
 * remains the source of truth for attribution.
 */
export async function deriveAttributionJoinHash(key: AttributionJoinKey): Promise<string> {
  // Canonical field order for deterministic derivation.
  const canonical = {
    contract_version: key.contractVersion,
    artifact_kind: key.artifactKind,
    artifact_path: key.artifactPath,
    work_item: key.workItem,
    actor_identity: key.actorIdentity,
    role_or_profile: key.roleOrProfile,
    model: key.model,
    model_version: key.modelVersion,
    profile_hash: key.profileHash,
    review_subject_hash: key.reviewSubjectHash,
    evidence_artifact_hashes: key.evidenceArtifactHashes,
    touched_surface: key.touchedSurface,
    boundary_prediction_record: key.boundaryPredictionRecord,
    authorizing_boundary_cell: key.authorizingBoundaryCell,
    landing_autonomy_level: key.landingAutonomyLevel,
    purpose: key.purpose,
    artifact_state: key.artifactState
  };

  // Stable JSON canonicalization (deterministic field order).
  const canonicalJson = JSON.stringify(canonical);

  // Derive SHA-256 hex digest.
  return sha256Hex(canonicalJson);
}

// ---------------------------------------------------------------------------
// Minimal SHA-256 implementation for hash derivation
// ---------------------------------------------------------------------------

async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function attributionJoinKeyDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/landing-attribution-join-key.json`;
}

function resolveAttributionJoinKeyPath(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  const expectedPrefix = `docs/work/${workItemId}/`;
  if (
    path.isAbsolute(displayPath) ||
    displayPath.includes("..") ||
    !displayPath.startsWith(expectedPrefix)
  ) {
    throw new Error(
      `Invalid Attribution Join Key path: ${displayPath}; expected path under ${expectedPrefix}`
    );
  }

  return path.join(repoRoot, displayPath);
}

async function readRequiredJsonFile(
  filePath: string,
  displayPath: string
): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing Attribution Join Key: ${displayPath}`);
    }
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
