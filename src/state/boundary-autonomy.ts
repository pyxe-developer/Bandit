import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiskTier = "trivial" | "low_reversible" | "material_risk" | "never_auto_landable";
export type EvidenceStrengthTier =
  | "author_assertion"
  | "author_controlled_checks"
  | "independent_automated"
  | "independent_review"
  | "decorrelated_adversarial"
  | "operator_supervised_or_proven_track_record";
export type LandingAutonomyLevel = "block" | "operator_supervision" | "notify_and_revert" | "auto_land";

export type BoundaryContour = {
  contractVersion: number;
  policyId: string;
  contourVersion: string;
  defaultMovementPolicy: string;
  riskTiers: RiskTier[];
  evidenceStrengthTiers: EvidenceStrengthTier[];
  landingAutonomyLevels: LandingAutonomyLevel[];
  cells: BoundaryContourCell[];
};

export type BoundaryContourCell = {
  cellId: string;
  riskTier: RiskTier;
  minimumEvidenceStrengthTier: EvidenceStrengthTier;
  landingAutonomyLevel: LandingAutonomyLevel;
  requiresRollbackPath: boolean;
  requiresOperatorSupervision: boolean;
  neverAutoLandable: boolean;
  movementPolicy: string;
  rationale: string;
};

export type BoundaryPredictionRecord = {
  contractVersion: number;
  workItem: string;
  sourceHead: string;
  reviewSubjectHash: string;
  boundaryContourVersion: string;
  boundaryContourPath: string;
  riskTier: RiskTier;
  evidenceStrengthTier: EvidenceStrengthTier;
  landingAutonomyLevel: LandingAutonomyLevel;
  authorizingBoundaryCell: string;
  riskClassificationEvidence: string[];
  reliedOnEvidenceArtifacts: EvidenceArtifact[];
  predictedSafetyOutcome: string;
  operatorSupervisionStatus: string;
  rationale: string;
};

export type EvidenceArtifact = {
  path: string;
  hash: string;
  freshnessState: string;
};

export type NotifyAndRevertArtifact = {
  contractVersion: number;
  workItem: string;
  sourceHead: string;
  landingAutonomyLevel: LandingAutonomyLevel;
  rollbackPath: RollbackPath;
  operatorAttentionReason: string;
  followUpOrExpiry: FollowUpOrExpiry;
  boundaryPredictionRecord: string;
  sourceDriftStatus: string;
  rationale: string;
};

export type RollbackPath = {
  command: string;
  verification: string;
};

export type FollowUpOrExpiry = {
  state: string;
  followUpWorkItem: string;
  expiryDate: string;
};

// ---------------------------------------------------------------------------
// Boundary Contour Policy
// ---------------------------------------------------------------------------

const BOUNDARY_CONTOUR_DISPLAY_PATH = ".bandit/policy/boundary-contour.json";

const VALID_RISK_TIERS: RiskTier[] = [
  "trivial",
  "low_reversible",
  "material_risk",
  "never_auto_landable"
];
const VALID_EVIDENCE_STRENGTH_TIERS: EvidenceStrengthTier[] = [
  "author_assertion",
  "author_controlled_checks",
  "independent_automated",
  "independent_review",
  "decorrelated_adversarial",
  "operator_supervised_or_proven_track_record"
];
const VALID_AUTONOMY_LEVELS: LandingAutonomyLevel[] = [
  "block",
  "operator_supervision",
  "notify_and_revert",
  "auto_land"
];

// Autonomy ladder for strength comparison
const AUTONOMY_LADDER: LandingAutonomyLevel[] = [
  "block",
  "operator_supervision",
  "notify_and_revert",
  "auto_land"
];

function autonomyLevelStrength(level: LandingAutonomyLevel): number {
  return AUTONOMY_LADDER.indexOf(level);
}

/**
 * Parse and validate the boundary contour policy.
 * Throws on malformed data so CLI fails closed.
 */
export function parseBoundaryContourPolicy(content: string): BoundaryContour {
  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    throw new Error("Malformed Boundary Contour policy: invalid JSON");
  }

  if (!isRecord(raw)) {
    throw new Error("Malformed Boundary Contour policy: root must be an object");
  }

  const contractVersion = requireNumber(raw, "contract_version");
  if (contractVersion !== 1) {
    throw new Error(
      `Unsupported Boundary Contour contract version: ${contractVersion}`
    );
  }

  const policyId = requireString(raw, "policy_id");
  const contourVersion = requireString(raw, "contour_version");
  const defaultMovementPolicy = requireString(raw, "default_movement_policy");

  const riskTiers = requireEnumArray<RiskTier>(
    raw,
    "risk_tiers",
    VALID_RISK_TIERS
  );
  const evidenceStrengthTiers = requireEnumArray<EvidenceStrengthTier>(
    raw,
    "evidence_strength_tiers",
    VALID_EVIDENCE_STRENGTH_TIERS
  );
  const landingAutonomyLevels = requireEnumArray<LandingAutonomyLevel>(
    raw,
    "landing_autonomy_levels",
    VALID_AUTONOMY_LEVELS
  );

  if (!Array.isArray(raw.cells)) {
    throw new Error("Malformed Boundary Contour policy: cells must be an array");
  }

  const cells: BoundaryContourCell[] = [];
  const cellIds = new Set<string>();

  for (const cellRaw of raw.cells) {
    if (!isRecord(cellRaw)) {
      throw new Error("Malformed Boundary Contour policy: cell must be an object");
    }

    const cellId = requireString(cellRaw, "cell_id");
    if (cellIds.has(cellId)) {
      throw new Error(
        `Malformed Boundary Contour policy: duplicate cell_id ${cellId}`
      );
    }
    cellIds.add(cellId);

    const riskTier = requireEnum<RiskTier>(cellRaw, "risk_tier", VALID_RISK_TIERS);
    const minimumEvidenceStrengthTier = requireEnum<EvidenceStrengthTier>(
      cellRaw,
      "minimum_evidence_strength_tier",
      VALID_EVIDENCE_STRENGTH_TIERS
    );
    const landingAutonomyLevel = requireEnum<LandingAutonomyLevel>(
      cellRaw,
      "landing_autonomy_level",
      VALID_AUTONOMY_LEVELS
    );
    const requiresRollbackPath = requireBoolean(cellRaw, "requires_rollback_path");
    const requiresOperatorSupervision = requireBoolean(
      cellRaw,
      "requires_operator_supervision"
    );
    const neverAutoLandable = requireBoolean(cellRaw, "never_auto_landable");
    const movementPolicy = requireString(cellRaw, "movement_policy");
    const rationale = requireString(cellRaw, "rationale");

    // PRD-004 hard rule: material_risk and never_auto_landable tiers may not
    // reach notify_and_revert or auto_land.
    if (riskTier === "material_risk") {
      if (
        landingAutonomyLevel === "notify_and_revert" ||
        landingAutonomyLevel === "auto_land"
      ) {
        throw new Error(
          `Boundary Contour cell ${cellId} cannot grant ${landingAutonomyLevel} to material_risk`
        );
      }
    }
    if (riskTier === "never_auto_landable") {
      if (
        landingAutonomyLevel === "notify_and_revert" ||
        landingAutonomyLevel === "auto_land"
      ) {
        throw new Error(
          `Boundary Contour cell ${cellId} cannot grant ${landingAutonomyLevel} to never_auto_landable`
        );
      }
    }

    // PRD-004 rule: low_reversible notify_and_revert cells must require rollback path.
    if (riskTier === "low_reversible" && landingAutonomyLevel === "notify_and_revert") {
      if (!requiresRollbackPath) {
        throw new Error(
          `Boundary Contour cell ${cellId}: low_reversible notify_and_revert requires requires_rollback_path to be true`
        );
      }
    }

    cells.push({
      cellId,
      riskTier,
      minimumEvidenceStrengthTier,
      landingAutonomyLevel,
      requiresRollbackPath,
      requiresOperatorSupervision,
      neverAutoLandable,
      movementPolicy,
      rationale
    });
  }

  return {
    contractVersion,
    policyId,
    contourVersion,
    defaultMovementPolicy,
    riskTiers,
    evidenceStrengthTiers,
    landingAutonomyLevels,
    cells
  };
}

/**
 * Read and validate the boundary contour policy from the repo.
 */
export async function readBoundaryContourPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.boundaryContourPolicy,
    BOUNDARY_CONTOUR_DISPLAY_PATH
  );
  return parseBoundaryContourPolicy(content);
}

/**
 * Find a contour cell by cell_id.
 */
export function findContourCell(
  contour: BoundaryContour,
  cellId: string
): BoundaryContourCell | null {
  return contour.cells.find((c) => c.cellId === cellId) ?? null;
}

/**
 * Validate a boundary prediction record against the contour.
 * The record parameter accepts both the typed object and a raw snake_case record
 * from JSON parsing. Uses snake_case field access for flexibility.
 */
export function validateBoundaryPredictionRecord(
  record: BoundaryPredictionRecord | Record<string, unknown>,
  contour: BoundaryContour
): string[] {
  const errors: string[] = [];
  const r = record as Record<string, unknown>;

  const contractVersion = Number(r.contract_version ?? r.contractVersion ?? 0);
  if (contractVersion !== 1) {
    errors.push("Boundary Prediction Record: unsupported contract_version");
  }

  if (!r.work_item && !r.workItem) {
    errors.push("Boundary Prediction Record: missing work_item");
  }

  if (!r.source_head && !r.sourceHead) {
    errors.push("Boundary Prediction Record: missing source_head");
  }

  if (!r.review_subject_hash && !r.reviewSubjectHash) {
    errors.push("Boundary Prediction Record: missing review_subject_hash");
  }

  const boundaryContourVersion = String(r.boundary_contour_version ?? r.boundaryContourVersion ?? "");
  if (!boundaryContourVersion) {
    errors.push("Boundary Prediction Record: missing boundary_contour_version");
  } else if (boundaryContourVersion !== contour.contourVersion) {
    errors.push(
      `Boundary Prediction Record: boundary_contour_version ${boundaryContourVersion} does not match loaded contour version ${contour.contourVersion}`
    );
  }

  const boundaryContourPath = String(r.boundary_contour_path ?? r.boundaryContourPath ?? "");
  if (!boundaryContourPath) {
    errors.push("Boundary Prediction Record: missing boundary_contour_path");
  } else if (boundaryContourPath !== BOUNDARY_CONTOUR_DISPLAY_PATH) {
    errors.push(
      `Boundary Prediction Record: boundary_contour_path must be ${BOUNDARY_CONTOUR_DISPLAY_PATH}, got ${boundaryContourPath}`
    );
  }

  const riskTier = String(r.risk_tier ?? r.riskTier ?? "");
  if (!riskTier) {
    errors.push("Boundary Prediction Record: missing risk_tier");
  } else if (!VALID_RISK_TIERS.includes(riskTier as RiskTier)) {
    errors.push(`Boundary Prediction Record: unsupported risk_tier ${riskTier}`);
  }

  const evidenceStrengthTier = String(r.evidence_strength_tier ?? r.evidenceStrengthTier ?? "");
  if (!evidenceStrengthTier) {
    errors.push("Boundary Prediction Record: missing evidence_strength_tier");
  } else if (!VALID_EVIDENCE_STRENGTH_TIERS.includes(evidenceStrengthTier as EvidenceStrengthTier)) {
    errors.push(
      `Boundary Prediction Record: unsupported evidence_strength_tier ${evidenceStrengthTier}`
    );
  }

  const landingAutonomyLevel = String(r.landing_autonomy_level ?? r.landingAutonomyLevel ?? "");
  if (!landingAutonomyLevel) {
    errors.push("Boundary Prediction Record: missing landing_autonomy_level");
  } else if (!VALID_AUTONOMY_LEVELS.includes(landingAutonomyLevel as LandingAutonomyLevel)) {
    errors.push(
      `Boundary Prediction Record: unsupported landing_autonomy_level ${landingAutonomyLevel}`
    );
  }

  const predictedSafetyOutcome = String(r.predicted_safety_outcome ?? r.predictedSafetyOutcome ?? "");
  if (!predictedSafetyOutcome) {
    errors.push("Boundary Prediction Record: missing predicted_safety_outcome");
  }

  const operatorSupervisionStatus = String(r.operator_supervision_status ?? r.operatorSupervisionStatus ?? "");
  if (!operatorSupervisionStatus) {
    errors.push("Boundary Prediction Record: missing operator_supervision_status");
  }

  const rationale = String(r.rationale ?? "");
  if (!rationale) {
    errors.push("Boundary Prediction Record: missing rationale");
  }

  const riskClassificationEvidence = r.risk_classification_evidence ?? r.riskClassificationEvidence;
  if (!Array.isArray(riskClassificationEvidence) || riskClassificationEvidence.length === 0) {
    errors.push("Boundary Prediction Record: risk_classification_evidence must be non-empty");
  } else {
    for (let i = 0; i < riskClassificationEvidence.length; i++) {
      const entry = String(riskClassificationEvidence[i] ?? "");
      if (!entry) {
        errors.push(
          `Boundary Prediction Record: risk_classification_evidence[${i}] must be non-blank`
        );
      }
    }
  }

  const reliedOn = r.relied_on_evidence_artifacts ?? r.reliedOnEvidenceArtifacts;
  if (!Array.isArray(reliedOn) || reliedOn.length === 0) {
    errors.push("Boundary Prediction Record: relied_on_evidence_artifacts must be non-empty");
  } else {
    for (let i = 0; i < reliedOn.length; i++) {
      const artifact = reliedOn[i];
      if (!isRecord(artifact)) {
        errors.push(
          `Boundary Prediction Record: relied_on_evidence_artifacts[${i}] must be an object`
        );
      } else {
        const artifactPath = String(artifact.path ?? "");
        const artifactHash = String(artifact.hash ?? "");
        const artifactFreshness = String(artifact.freshness_state ?? artifact.freshnessState ?? "");
        if (!artifactPath) {
          errors.push(
            `Boundary Prediction Record: relied_on_evidence_artifacts[${i}].path must be non-blank`
          );
        }
        if (!artifactHash) {
          errors.push(
            `Boundary Prediction Record: relied_on_evidence_artifacts[${i}].hash must be non-blank`
          );
        }
        if (!artifactFreshness) {
          errors.push(
            `Boundary Prediction Record: relied_on_evidence_artifacts[${i}].freshness_state must be non-blank`
          );
        }
      }
    }
  }

  const authorizingBoundaryCell = String(r.authorizing_boundary_cell ?? r.authorizingBoundaryCell ?? "");
  if (!authorizingBoundaryCell) {
    errors.push("Boundary Prediction Record: missing authorizing_boundary_cell");
  } else {
    const cell = findContourCell(contour, authorizingBoundaryCell);
    if (!cell) {
      errors.push(
        `Boundary Prediction Record: authorizing_boundary_cell ${authorizingBoundaryCell} does not exist in contour`
      );
    } else {
      // risk_tier must match the authorizing cell's risk_tier
      if (riskTier && riskTier !== cell.riskTier) {
        errors.push(
          `Boundary Prediction Record: risk_tier ${riskTier} does not match authorizing cell ${authorizingBoundaryCell} risk_tier ${cell.riskTier}`
        );
      }

      // evidence_strength_tier must be >= cell's minimumEvidenceStrengthTier
      if (evidenceStrengthTier) {
        const recordTierIdx = VALID_EVIDENCE_STRENGTH_TIERS.indexOf(evidenceStrengthTier as EvidenceStrengthTier);
        const cellMinTierIdx = VALID_EVIDENCE_STRENGTH_TIERS.indexOf(cell.minimumEvidenceStrengthTier);
        if (recordTierIdx < cellMinTierIdx) {
          errors.push(
            `Boundary Prediction Record: evidence_strength_tier ${evidenceStrengthTier} is weaker than authorizing cell ${authorizingBoundaryCell} minimum ${cell.minimumEvidenceStrengthTier}`
          );
        }
      }

      if (landingAutonomyLevel) {
        const recordLevel = landingAutonomyLevel as LandingAutonomyLevel;
        const cellLevelStrength = autonomyLevelStrength(cell.landingAutonomyLevel);
        const recordLevelStrength = autonomyLevelStrength(recordLevel);
        if (recordLevelStrength > cellLevelStrength) {
          errors.push(
            `Boundary Prediction Record: landing_autonomy_level ${recordLevel} is stronger than authorizing cell ${authorizingBoundaryCell} permits (${cell.landingAutonomyLevel})`
          );
        }
      }
    }
  }

  return errors;
}

/**
 * Validate a notify-and-revert artifact.
 * Accepts both the typed object and a raw snake_case record from JSON parsing.
 */
export function validateNotifyAndRevertArtifact(
  artifact: NotifyAndRevertArtifact | Record<string, unknown>,
  workItemId: string
): string[] {
  const errors: string[] = [];
  const a = artifact as Record<string, unknown>;

  const contractVersion = Number(a.contract_version ?? a.contractVersion ?? 0);
  if (contractVersion !== 1) {
    errors.push("Notify-And-Revert Artifact: unsupported contract_version");
  }

  if (!a.work_item && !a.workItem) {
    errors.push("Notify-And-Revert Artifact: missing work_item");
  }

  if (!a.source_head && !a.sourceHead) {
    errors.push("Notify-And-Revert Artifact: missing source_head");
  }

  const al = String(a.landing_autonomy_level ?? a.landingAutonomyLevel ?? "");
  if (al !== "notify_and_revert") {
    errors.push(
      `Notify-And-Revert Artifact: landing_autonomy_level must be notify_and_revert, got ${al}`
    );
  }

  const rpRaw = a.rollback_path ?? a.rollbackPath;
  if (!isRecord(rpRaw)) {
    errors.push("Notify-And-Revert Artifact: missing rollback_path");
  } else {
    if (!rpRaw.command) {
      errors.push("Notify-And-Revert Artifact: rollback_path.command is required");
    }
    if (!rpRaw.verification) {
      errors.push("Notify-And-Revert Artifact: rollback_path.verification is required");
    }
  }

  if (!a.operator_attention_reason && !a.operatorAttentionReason) {
    errors.push("Notify-And-Revert Artifact: missing operator_attention_reason");
  }

  const foeRaw = a.follow_up_or_expiry ?? a.followUpOrExpiry;
  if (!isRecord(foeRaw)) {
    errors.push("Notify-And-Revert Artifact: missing follow_up_or_expiry");
  } else if (!foeRaw.state) {
    errors.push("Notify-And-Revert Artifact: follow_up_or_expiry.state is required");
  }

  const boundaryPredictionRecord = String(a.boundary_prediction_record ?? a.boundaryPredictionRecord ?? "");
  if (!boundaryPredictionRecord) {
    errors.push("Notify-And-Revert Artifact: missing boundary_prediction_record");
  } else {
    const expectedPath = `docs/work/${workItemId}/boundary-prediction.json`;
    if (boundaryPredictionRecord !== expectedPath) {
      errors.push(
        `Notify-And-Revert Artifact: boundary_prediction_record must be ${expectedPath}, got ${boundaryPredictionRecord}`
      );
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Read boundary prediction record from JSON file
// ---------------------------------------------------------------------------

export async function readBoundaryPredictionRecord(
  repoRoot: string,
  workItemId: string
): Promise<BoundaryPredictionRecord> {
  const displayPath = boundaryPredictionRecordDisplayPath(workItemId);
  const content = await readRequiredJsonFile(
    path.join(repoRoot, "docs/work", workItemId, "boundary-prediction.json"),
    displayPath
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Malformed Boundary Prediction Record: ${displayPath}; invalid JSON`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`Malformed Boundary Prediction Record: ${displayPath}; must be an object`);
  }

  return parseBoundaryPredictionRecordFromObject(parsed, displayPath, workItemId);
}

export async function readOptionalBoundaryPredictionRecord(
  repoRoot: string,
  workItemId: string
): Promise<BoundaryPredictionRecord | null> {
  try {
    return await readBoundaryPredictionRecord(repoRoot, workItemId);
  } catch {
    return null;
  }
}

function parseBoundaryPredictionRecordFromObject(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId: string
): BoundaryPredictionRecord {
  const workItem = String(raw.work_item ?? raw.workItem ?? "");
  if (workItem && workItem !== expectedWorkItemId) {
    throw new Error(
      `Boundary Prediction Record ${displayPath}: work_item ${workItem} does not match ${expectedWorkItemId}`
    );
  }

  return {
    contractVersion: Number(raw.contract_version ?? raw.contractVersion ?? 0),
    workItem,
    sourceHead: String(raw.source_head ?? raw.sourceHead ?? ""),
    reviewSubjectHash: String(raw.review_subject_hash ?? raw.reviewSubjectHash ?? ""),
    boundaryContourVersion: String(
      raw.boundary_contour_version ?? raw.boundaryContourVersion ?? ""
    ),
    boundaryContourPath: String(
      raw.boundary_contour_path ?? raw.boundaryContourPath ?? ""
    ),
    riskTier: String(raw.risk_tier ?? raw.riskTier ?? "") as RiskTier,
    evidenceStrengthTier: String(
      raw.evidence_strength_tier ?? raw.evidenceStrengthTier ?? ""
    ) as EvidenceStrengthTier,
    landingAutonomyLevel: String(
      raw.landing_autonomy_level ?? raw.landingAutonomyLevel ?? ""
    ) as LandingAutonomyLevel,
    authorizingBoundaryCell: String(
      raw.authorizing_boundary_cell ?? raw.authorizingBoundaryCell ?? ""
    ),
    riskClassificationEvidence: ((): string[] => {
      const arr = (raw.risk_classification_evidence ?? raw.riskClassificationEvidence) as unknown;
      return Array.isArray(arr) ? arr.map(String) : [];
    })(),
    reliedOnEvidenceArtifacts: ((): EvidenceArtifact[] => {
      const arr = (raw.relied_on_evidence_artifacts ?? raw.reliedOnEvidenceArtifacts) as unknown;
      return Array.isArray(arr)
        ? arr.map((a: unknown) => {
            if (isRecord(a)) {
              return {
                path: String(a.path ?? ""),
                hash: String(a.hash ?? ""),
                freshnessState: String(a.freshness_state ?? a.freshnessState ?? "")
              };
            }
            return { path: "", hash: "", freshnessState: "" };
          })
        : [];
    })(),
    predictedSafetyOutcome: String(
      raw.predicted_safety_outcome ?? raw.predictedSafetyOutcome ?? ""
    ),
    operatorSupervisionStatus: String(
      raw.operator_supervision_status ?? raw.operatorSupervisionStatus ?? ""
    ),
    rationale: String(raw.rationale ?? "")
  };
}

// ---------------------------------------------------------------------------
// Read notify-and-revert artifact from JSON file
// ---------------------------------------------------------------------------

export async function readNotifyAndRevertArtifact(
  repoRoot: string,
  workItemId: string
): Promise<NotifyAndRevertArtifact> {
  const displayPath = notifyAndRevertArtifactDisplayPath(workItemId);
  const content = await readRequiredJsonFile(
    path.join(repoRoot, "docs/work", workItemId, "notify-and-revert-artifact.json"),
    displayPath
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      `Malformed Notify-And-Revert Artifact: ${displayPath}; invalid JSON`
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      `Malformed Notify-And-Revert Artifact: ${displayPath}; must be an object`
    );
  }

  return parseNotifyAndRevertArtifactFromObject(parsed, displayPath, workItemId);
}

export async function readOptionalNotifyAndRevertArtifact(
  repoRoot: string,
  workItemId: string
): Promise<NotifyAndRevertArtifact | null> {
  try {
    return await readNotifyAndRevertArtifact(repoRoot, workItemId);
  } catch {
    return null;
  }
}

function parseNotifyAndRevertArtifactFromObject(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId: string
): NotifyAndRevertArtifact {
  const workItem = String(raw.work_item ?? raw.workItem ?? "");
  if (workItem && workItem !== expectedWorkItemId) {
    throw new Error(
      `Notify-And-Revert Artifact ${displayPath}: work_item ${workItem} does not match ${expectedWorkItemId}`
    );
  }

  const rpRaw = raw.rollback_path ?? raw.rollbackPath;
  const rollbackPath = isRecord(rpRaw)
    ? {
        command: String(rpRaw.command ?? ""),
        verification: String(rpRaw.verification ?? "")
      }
    : { command: "", verification: "" };

  const foeRaw = raw.follow_up_or_expiry ?? raw.followUpOrExpiry;
  const followUpOrExpiry = isRecord(foeRaw)
    ? {
        state: String(foeRaw.state ?? ""),
        followUpWorkItem: String(foeRaw.follow_up_work_item ?? foeRaw.followUpWorkItem ?? ""),
        expiryDate: String(foeRaw.expiry_date ?? foeRaw.expiryDate ?? "")
      }
    : { state: "", followUpWorkItem: "", expiryDate: "" };

  return {
    contractVersion: Number(raw.contract_version ?? raw.contractVersion ?? 0),
    workItem,
    sourceHead: String(raw.source_head ?? raw.sourceHead ?? ""),
    landingAutonomyLevel: String(
      raw.landing_autonomy_level ?? raw.landingAutonomyLevel ?? ""
    ) as LandingAutonomyLevel,
    rollbackPath,
    operatorAttentionReason: String(
      raw.operator_attention_reason ?? raw.operatorAttentionReason ?? ""
    ),
    followUpOrExpiry,
    boundaryPredictionRecord: String(
      raw.boundary_prediction_record ?? raw.boundaryPredictionRecord ?? ""
    ),
    sourceDriftStatus: String(raw.source_drift_status ?? raw.sourceDriftStatus ?? ""),
    rationale: String(raw.rationale ?? "")
  };
}

// ---------------------------------------------------------------------------
// Boundary autonomy gating helpers for land-check
// ---------------------------------------------------------------------------

export type BoundaryAutonomyProblems = {
  missingBoundaryPredictionRecord: boolean;
  missingNotifyAndRevertArtifact: boolean;
  boundaryPredictionRecordErrors: string[];
  notifyAndRevertArtifactErrors: string[];
};

/**
 * Gather boundary-autonomy problems for a landing verdict that claims
 * notify_and_revert or auto_land autonomy.
 * Returns a flat list of problem strings for land-check output.
 */
export async function gatherBoundaryAutonomyProblems(
  repoRoot: string,
  workItemId: string,
  landingAutonomyLevel: string | undefined
): Promise<string[]> {
  const problems: string[] = [];

  if (!landingAutonomyLevel) {
    return problems;
  }

  const needsPredictionRecord =
    landingAutonomyLevel === "auto_land" || landingAutonomyLevel === "notify_and_revert";

  if (needsPredictionRecord) {
    const predictionRecord = await readOptionalBoundaryPredictionRecord(
      repoRoot,
      workItemId
    );
    if (!predictionRecord) {
      problems.push(
        `Missing Boundary Prediction Record: docs/work/${workItemId}/boundary-prediction.json`
      );
    } else {
      const contour = await readBoundaryContourPolicy(repoRoot);
      const errors = validateBoundaryPredictionRecord(predictionRecord, contour);
      if (errors.length > 0) {
        problems.push(...errors);
      }
    }
  }

  if (landingAutonomyLevel === "notify_and_revert") {
    const narArtifact = await readOptionalNotifyAndRevertArtifact(
      repoRoot,
      workItemId
    );
    if (!narArtifact) {
      problems.push(
        `Missing Notify-And-Revert Artifact: docs/work/${workItemId}/notify-and-revert-artifact.json`
      );
    } else {
      const errors = validateNotifyAndRevertArtifact(narArtifact, workItemId);
      if (errors.length > 0) {
        problems.push(...errors);
      }
    }
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Default policy writer for init
// ---------------------------------------------------------------------------

const INITIAL_CONTOUR_POLICY = {
  contract_version: 1,
  policy_id: "boundary-contour",
  contour_version: "initial-conservative-v1",
  default_movement_policy: "asymmetric",
  risk_tiers: [
    "trivial",
    "low_reversible",
    "material_risk",
    "never_auto_landable"
  ],
  evidence_strength_tiers: [
    "author_assertion",
    "author_controlled_checks",
    "independent_automated",
    "independent_review",
    "decorrelated_adversarial",
    "operator_supervised_or_proven_track_record"
  ],
  landing_autonomy_levels: ["block", "operator_supervision", "notify_and_revert", "auto_land"],
  cells: [
    {
      cell_id: "trivial-author-assertion",
      risk_tier: "trivial",
      minimum_evidence_strength_tier: "author_assertion",
      landing_autonomy_level: "operator_supervision",
      requires_rollback_path: false,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Trivial docs-only changes with author assertion may proceed under operator_supervision."
    },
    {
      cell_id: "trivial-independent-automated",
      risk_tier: "trivial",
      minimum_evidence_strength_tier: "independent_automated",
      landing_autonomy_level: "auto_land",
      requires_rollback_path: false,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Trivial changes with automated independent checks may auto-land."
    },
    {
      cell_id: "trivial-independent-review",
      risk_tier: "trivial",
      minimum_evidence_strength_tier: "independent_review",
      landing_autonomy_level: "auto_land",
      requires_rollback_path: false,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Trivial changes with independent review may auto-land."
    },
    {
      cell_id: "low-reversible-author-controlled-checks",
      risk_tier: "low_reversible",
      minimum_evidence_strength_tier: "author_controlled_checks",
      landing_autonomy_level: "operator_supervision",
      requires_rollback_path: false,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Low-reversible work with author-controlled checks may proceed under operator_supervision."
    },
    {
      cell_id: "low-reversible-independent-review",
      risk_tier: "low_reversible",
      minimum_evidence_strength_tier: "independent_review",
      landing_autonomy_level: "notify_and_revert",
      requires_rollback_path: true,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Low-reversible work with independent review may reach notify_and_revert only with explicit rollback path."
    },
    {
      cell_id: "low-reversible-decorrelated-adversarial",
      risk_tier: "low_reversible",
      minimum_evidence_strength_tier: "decorrelated_adversarial",
      landing_autonomy_level: "notify_and_revert",
      requires_rollback_path: true,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Low-reversible work with decorrelated adversarial review may reach notify_and_revert with rollback path."
    },
    {
      cell_id: "low-reversible-operator-supervised",
      risk_tier: "low_reversible",
      minimum_evidence_strength_tier: "operator_supervised_or_proven_track_record",
      landing_autonomy_level: "operator_supervision",
      requires_rollback_path: false,
      requires_operator_supervision: false,
      never_auto_landable: false,
      movement_policy: "expandable_without_trial",
      rationale: "Low-reversible work with operator supervision or proven track record remains under operator_supervision."
    },
    {
      cell_id: "material-risk-all-tiers",
      risk_tier: "material_risk",
      minimum_evidence_strength_tier: "author_assertion",
      landing_autonomy_level: "operator_supervision",
      requires_rollback_path: false,
      requires_operator_supervision: true,
      never_auto_landable: false,
      movement_policy: "operator_required",
      rationale: "Material-risk work caps at operator_supervision regardless of evidence strength. notify_and_revert and auto_land are forbidden."
    },
    {
      cell_id: "never-auto-landable-all",
      risk_tier: "never_auto_landable",
      minimum_evidence_strength_tier: "author_assertion",
      landing_autonomy_level: "block",
      requires_rollback_path: false,
      requires_operator_supervision: true,
      never_auto_landable: true,
      movement_policy: "operator_required",
      rationale: "Never-auto-landable surfaces are hard exclusions. notify_and_revert and auto_land are forbidden."
    }
  ]
};

export async function writeDefaultBoundaryContourPolicy(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(INITIAL_CONTOUR_POLICY, null, 2)}\n`, "utf8");
}

// ---------------------------------------------------------------------------
// Template validation for validate command
// ---------------------------------------------------------------------------

export async function validateBoundaryAutonomyTemplates(repoRoot: string) {
  // The templates are validated via the general templates.ts validator.
  // Here we ensure the boundary-contour policy file is present and valid.
  await readBoundaryContourPolicy(repoRoot);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function requireString(raw: Record<string, unknown>, field: string): string {
  const value = raw[field];
  if (typeof value !== "string") {
    throw new Error(`Boundary Contour: ${field} must be a string`);
  }
  return value;
}

function requireNumber(raw: Record<string, unknown>, field: string): number {
  const value = raw[field];
  if (typeof value !== "number") {
    throw new Error(`Boundary Contour: ${field} must be a number`);
  }
  return value;
}

function requireBoolean(raw: Record<string, unknown>, field: string): boolean {
  const value = raw[field];
  if (typeof value !== "boolean") {
    throw new Error(`Boundary Contour: ${field} must be a boolean`);
  }
  return value;
}

function requireEnum<T extends string>(
  raw: Record<string, unknown>,
  field: string,
  validValues: T[]
): T {
  const value = raw[field];
  if (typeof value !== "string") {
    throw new Error(`Boundary Contour: ${field} must be a string`);
  }
  if (!validValues.includes(value as T)) {
    throw new Error(`Boundary Contour: unsupported ${field} ${value}`);
  }
  return value as T;
}

function requireEnumArray<T extends string>(
  raw: Record<string, unknown>,
  field: string,
  validValues: T[]
): T[] {
  const value = raw[field];
  if (!Array.isArray(value)) {
    throw new Error(`Boundary Contour: ${field} must be an array`);
  }
  const result: T[] = [];
  for (const item of value) {
    if (typeof item !== "string") {
      throw new Error(`Boundary Contour: ${field} items must be strings`);
    }
    if (!validValues.includes(item as T)) {
      throw new Error(`Boundary Contour: unsupported ${field} value ${item}`);
    }
    result.push(item as T);
  }
  return result;
}

async function readRequiredPolicyFile(
  filePath: string,
  displayPath: string
): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${displayPath}`);
    }
    throw error;
  }
}

async function readRequiredJsonFile(
  filePath: string,
  displayPath: string
): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing artifact: ${displayPath}`);
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

// ---------------------------------------------------------------------------
// Display paths
// ---------------------------------------------------------------------------

function boundaryPredictionRecordDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/boundary-prediction.json`;
}

function notifyAndRevertArtifactDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/notify-and-revert-artifact.json`;
}

// ---------------------------------------------------------------------------
// Paths helper (inline to avoid circular dep)
// ---------------------------------------------------------------------------

function getBanditPaths(repoRoot: string) {
  return {
    boundaryContourPolicy: path.join(repoRoot, ".bandit/policy/boundary-contour.json")
  };
}