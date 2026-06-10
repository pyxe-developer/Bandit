import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  findContourCell,
  readBoundaryContourPolicy,
  type BoundaryContour
} from "./boundary-autonomy.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BoundaryCellMovement = {
  contractVersion: number;
  workItem: string;
  sourceHead: string;
  boundaryContourPath: string;
  boundaryContourVersion: string;
  cellId: string;
  fromAutonomyLevel: string;
  toAutonomyLevel: string;
  movementDirection: string;
  movementReason: string;
  linkedWorkflowTrial: string;
  linkedBoundaryEscapeDisposition: string;
  operatorDecisionStatus: string;
  rationale: string;
};

type MovementDirection = "expansion" | "contraction";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GIT_COMMIT_SHA_PATTERN = /^[a-f0-9]{40}$/;
const BOUNDARY_CONTOUR_PATH = ".bandit/policy/boundary-contour.json";
const AUTONOMY_LADDER = [
  "block",
  "operator_supervision",
  "notify_and_revert",
  "auto_land"
];
const MOVEMENT_DIRECTIONS = new Set(["expansion", "contraction"]);
const OPERATOR_DECISION_STATUSES = new Set([
  "not_required",
  "none_required",
  "operator_input_required",
  "pending",
  "approved",
  "rejected"
]);
const REQUIRED_WORKFLOW_GUARDRAIL_FIELDS = [
  "predeclared_decision_criteria",
  "metric",
  "baseline",
  "evaluation_window",
  "reevaluation_window",
  "proxy_risk_notes",
  "improvement_decision"
];

// ---------------------------------------------------------------------------
// Field validation
// Returns an array of error strings; empty means valid.
// ---------------------------------------------------------------------------

export function validateBoundaryCellMovementFields(
  raw: Record<string, unknown>,
  displayPath: string,
  expectedWorkItemId?: string,
  contour?: BoundaryContour
): string[] {
  const errors: string[] = [];

  const contractVersion = Number(raw.contract_version ?? raw.contractVersion ?? 0);
  if (contractVersion !== 1) {
    errors.push(`${displayPath}: unsupported contract_version ${contractVersion}`);
    return errors;
  }

  const workItem = String(raw.work_item ?? raw.workItem ?? "");
  if (isBlank(workItem)) {
    errors.push(`${displayPath}: work_item is missing`);
  } else if (expectedWorkItemId && workItem !== expectedWorkItemId) {
    errors.push(
      `${displayPath}: work_item ${workItem} does not match ${expectedWorkItemId}`
    );
  }

  const sourceHead = String(raw.source_head ?? raw.sourceHead ?? "");
  if (isBlank(sourceHead)) {
    errors.push(`${displayPath}: source_head is missing`);
  } else if (!GIT_COMMIT_SHA_PATTERN.test(sourceHead)) {
    errors.push(
      `${displayPath}: source_head must be a 40-character hex git commit sha`
    );
  }

  const boundaryContourPath = String(
    raw.boundary_contour_path ?? raw.boundaryContourPath ?? ""
  );
  if (isBlank(boundaryContourPath)) {
    errors.push(`${displayPath}: boundary_contour_path is missing`);
  } else if (boundaryContourPath !== BOUNDARY_CONTOUR_PATH) {
    errors.push(
      `${displayPath}: boundary_contour_path must be ${BOUNDARY_CONTOUR_PATH}`
    );
  }

  const boundaryContourVersion = String(
    raw.boundary_contour_version ?? raw.boundaryContourVersion ?? ""
  );
  if (isBlank(boundaryContourVersion)) {
    errors.push(`${displayPath}: boundary_contour_version is missing`);
  } else if (contour && boundaryContourVersion !== contour.contourVersion) {
    errors.push(
      `${displayPath}: boundary_contour_version ${boundaryContourVersion} does not match active contour ${contour.contourVersion}`
    );
  }

  const cellId = String(raw.cell_id ?? raw.cellId ?? "");
  if (isBlank(cellId)) {
    errors.push(`${displayPath}: cell_id is missing`);
  } else if (contour && !findContourCell(contour, cellId)) {
    errors.push(`${displayPath}: unknown cell_id ${cellId}`);
  }

  const fromAutonomyLevel = String(raw.from_autonomy_level ?? raw.fromAutonomyLevel ?? "");
  const toAutonomyLevel = String(raw.to_autonomy_level ?? raw.toAutonomyLevel ?? "");
  const movementDirection = String(raw.movement_direction ?? raw.movementDirection ?? "");

  const fromIndex = AUTONOMY_LADDER.indexOf(fromAutonomyLevel);
  const toIndex = AUTONOMY_LADDER.indexOf(toAutonomyLevel);

  if (isBlank(fromAutonomyLevel)) {
    errors.push(`${displayPath}: from_autonomy_level is missing`);
  } else if (fromIndex === -1) {
    errors.push(`${displayPath}: invalid from_autonomy_level ${fromAutonomyLevel}`);
  }

  if (isBlank(toAutonomyLevel)) {
    errors.push(`${displayPath}: to_autonomy_level is missing`);
  } else if (toIndex === -1) {
    errors.push(`${displayPath}: invalid to_autonomy_level ${toAutonomyLevel}`);
  }

  if (isBlank(movementDirection)) {
    errors.push(`${displayPath}: movement_direction is missing`);
  } else if (!MOVEMENT_DIRECTIONS.has(movementDirection)) {
    errors.push(`${displayPath}: unsupported movement_direction "${movementDirection}"`);
  } else if (fromIndex !== -1 && toIndex !== -1) {
    if (movementDirection === "expansion" && toIndex <= fromIndex) {
      errors.push(
        `${displayPath}: movement_direction expansion contradicts from_autonomy_level ${fromAutonomyLevel} and to_autonomy_level ${toAutonomyLevel}`
      );
    } else if (movementDirection === "contraction" && toIndex >= fromIndex) {
      errors.push(
        `${displayPath}: movement_direction contraction contradicts from_autonomy_level ${fromAutonomyLevel} and to_autonomy_level ${toAutonomyLevel}`
      );
    }
  }

  const linkedWorkflowTrial = String(
    raw.linked_workflow_trial ?? raw.linkedWorkflowTrial ?? ""
  );
  if (movementDirection === "expansion" && !linkedWorkflowTrial) {
    errors.push(
      `${displayPath}: expansion requires linked_workflow_trial evidence`
    );
  }

  const linkedBoundaryEscapeDisposition = String(
    raw.linked_boundary_escape_disposition ??
      raw.linkedBoundaryEscapeDisposition ??
      ""
  );
  if (movementDirection === "contraction" && isBlank(linkedBoundaryEscapeDisposition)) {
    errors.push(
      `${displayPath}: contraction requires linked_boundary_escape_disposition evidence`
    );
  }

  const operatorDecisionStatus = String(
    raw.operator_decision_status ?? raw.operatorDecisionStatus ?? ""
  );
  if (isBlank(operatorDecisionStatus)) {
    errors.push(`${displayPath}: operator_decision_status is missing`);
  } else if (!OPERATOR_DECISION_STATUSES.has(operatorDecisionStatus)) {
    errors.push(
      `${displayPath}: unsupported operator_decision_status ${operatorDecisionStatus}`
    );
  }

  if (movementDirection === "expansion") {
    errors.push(...workflowTrialGuardrailProblems(raw, displayPath));
    if (operatorDecisionStatus !== "approved") {
      errors.push(
        `${displayPath}: expansion requires operator_decision_status approved`
      );
    }
  }

  const movementReason = String(raw.movement_reason ?? raw.movementReason ?? "");
  if (movementDirection === "expansion" && movementReason === "zero_observed_escapes") {
    errors.push(
      `${displayPath}: zero observed escapes alone cannot justify autonomy expansion`
    );
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Aggregate validator — scans all work items for optional movement artifacts.
// ---------------------------------------------------------------------------

export async function validateBoundaryCellMovementArtifacts(
  repoRoot: string
): Promise<void> {
  const { readWorkItems } = await import("./work-items.js");
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    await validateBoundaryCellMovementForWorkItem(repoRoot, workItem.id);
  }
}

async function validateBoundaryCellMovementForWorkItem(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const displayPath = boundaryCellMovementDisplayPath(workItemId);
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
      throw new Error(`Boundary Cell Movement: ${displayPath}: invalid JSON`);
    }
    throw error;
  }

  if (!isRecord(raw)) {
    throw new Error(`Boundary Cell Movement: ${displayPath} must be an object`);
  }

  const contour = await readBoundaryContourPolicy(repoRoot);
  const errors = validateBoundaryCellMovementFields(
    raw,
    displayPath,
    workItemId,
    contour
  );
  const firstError = errors[0];
  if (firstError !== undefined) {
    const prefix = `${displayPath}: `;
    throw new Error(`Boundary Cell Movement: ${stripPrefix(firstError, prefix)}`);
  }
}

// ---------------------------------------------------------------------------
// Optional reader
// ---------------------------------------------------------------------------

export async function readOptionalBoundaryCellMovement(
  repoRoot: string,
  workItemId: string
): Promise<BoundaryCellMovement | null> {
  const filePath = path.join(
    repoRoot,
    boundaryCellMovementDisplayPath(workItemId)
  );

  let raw: unknown;
  try {
    const content = await readFile(filePath, "utf8");
    raw = JSON.parse(content);
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }

  if (!isRecord(raw)) {
    return null;
  }

  return {
    contractVersion: Number(raw.contract_version ?? 0),
    workItem: String(raw.work_item ?? ""),
    sourceHead: String(raw.source_head ?? ""),
    boundaryContourPath: String(raw.boundary_contour_path ?? ""),
    boundaryContourVersion: String(raw.boundary_contour_version ?? ""),
    cellId: String(raw.cell_id ?? ""),
    fromAutonomyLevel: String(raw.from_autonomy_level ?? ""),
    toAutonomyLevel: String(raw.to_autonomy_level ?? ""),
    movementDirection: String(raw.movement_direction ?? ""),
    movementReason: String(raw.movement_reason ?? ""),
    linkedWorkflowTrial: String(raw.linked_workflow_trial ?? ""),
    linkedBoundaryEscapeDisposition: String(raw.linked_boundary_escape_disposition ?? ""),
    operatorDecisionStatus: String(raw.operator_decision_status ?? ""),
    rationale: String(raw.rationale ?? "")
  };
}

// ---------------------------------------------------------------------------
// Confirmed-escape contraction gate (used by land-check)
// ---------------------------------------------------------------------------

export async function gatherEscapeContractionProblems(
  repoRoot: string,
  workItemId: string,
  authorizingBoundaryCell: string,
  landingAutonomyLevel: string
): Promise<string[]> {
  const dispositionPath = path.join(
    repoRoot,
    `docs/work/${workItemId}/boundary-escape-disposition.json`
  );

  let dispositionRaw: unknown;
  try {
    const content = await readFile(dispositionPath, "utf8");
    dispositionRaw = JSON.parse(content);
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }

  if (!isRecord(dispositionRaw)) {
    return [];
  }

  const dispositionVerdict = String(
    dispositionRaw.disposition_verdict ?? dispositionRaw.dispositionVerdict ?? ""
  );

  if (dispositionVerdict !== "confirmed_escape") {
    return [];
  }

  const movement = await readOptionalBoundaryCellMovement(repoRoot, workItemId);
  if (!movement) {
    return [
      `Boundary Cell Movement: confirmed escape for cell ${authorizingBoundaryCell} requires contraction evidence before ${landingAutonomyLevel} can proceed`
    ];
  }

  return contractionMovementProblems(
    movement,
    workItemId,
    authorizingBoundaryCell,
    landingAutonomyLevel
  );
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function boundaryCellMovementDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/boundary-cell-movement.json`;
}

function workflowTrialGuardrailProblems(
  raw: Record<string, unknown>,
  displayPath: string
) {
  const problems: string[] = [];
  const guardrails =
    raw.workflow_trial_guardrails ?? raw.workflowTrialGuardrails ?? null;

  if (!isRecord(guardrails)) {
    return [
      `${displayPath}: expansion requires workflow_trial_guardrails evidence`
    ];
  }

  for (const field of REQUIRED_WORKFLOW_GUARDRAIL_FIELDS) {
    const value = guardrails[field];
    if (typeof value !== "string" || isBlank(value)) {
      problems.push(
        `${displayPath}: workflow_trial_guardrails.${field} is required for expansion`
      );
    }
  }

  const hasEffectContext = [
    guardrails.minimum_detectable_effect,
    guardrails.uncertainty
  ].some((value) => typeof value === "string" && !isBlank(value));
  if (!hasEffectContext) {
    problems.push(
      `${displayPath}: expansion requires minimum_detectable_effect or uncertainty context`
    );
  }

  if (guardrails.improvement_decision !== "operator_reviewed") {
    problems.push(
      `${displayPath}: expansion requires operator-reviewed improvement decision`
    );
  }

  return problems;
}

function contractionMovementProblems(
  movement: BoundaryCellMovement,
  workItemId: string,
  authorizingBoundaryCell: string,
  landingAutonomyLevel: string
) {
  const problems: string[] = [];
  if (movement.cellId !== authorizingBoundaryCell) {
    problems.push(
      `Boundary Cell Movement: confirmed escape for cell ${authorizingBoundaryCell} requires contraction evidence for the same cell`
    );
  }
  if (movement.movementDirection !== "contraction") {
    problems.push(
      `Boundary Cell Movement: confirmed escape for cell ${authorizingBoundaryCell} requires contraction movement evidence`
    );
  }
  if (movement.fromAutonomyLevel !== landingAutonomyLevel) {
    problems.push(
      `Boundary Cell Movement: contraction must start from ${landingAutonomyLevel} for confirmed escape cell ${authorizingBoundaryCell}`
    );
  }
  if (
    movement.linkedBoundaryEscapeDisposition !==
    `docs/work/${workItemId}/boundary-escape-disposition.json`
  ) {
    problems.push(
      `Boundary Cell Movement: contraction must link docs/work/${workItemId}/boundary-escape-disposition.json`
    );
  }
  return problems;
}

function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isBlank(value: string) {
  return value.trim().length === 0;
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as Record<string, unknown>).code === "ENOENT"
  );
}
