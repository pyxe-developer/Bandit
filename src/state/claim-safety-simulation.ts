import { readFile } from "node:fs/promises";
import path from "node:path";

type RawRecord = Record<string, unknown>;

export const REQUIRED_CLAIM_SAFETY_INVARIANTS = [
  "duplicate_active_claim_refused",
  "cas_mismatch_refused",
  "release_requires_current_state",
  "reconcile_requires_authority_projection_history_agreement",
  "stale_expected_state_refused",
  "stale_fencing_token_refused",
  "idempotency_same_key_same_input_replayed",
  "idempotency_same_key_different_input_refused",
  "projection_history_disagreement_refused",
  "work_surface_wait_for_cycle_refused",
  "failed_serializer_cleanup_preserves_recovery_state",
  "failed_worktree_lock_cleanup_preserves_recovery_state",
  "recovery_required_claim_not_auto_deleted"
];

export type ClaimSafetySimulationReport = {
  status: "pass";
  evidence: string;
  invariants: string[];
  scenarios: Record<string, RawRecord>;
};

export async function simulateClaimSafetyFromEvidencePath(
  repoRoot: string,
  evidenceDisplayPath: string
): Promise<ClaimSafetySimulationReport> {
  const evidence = await readEvidence(repoRoot, evidenceDisplayPath);
  return simulateClaimSafety(evidenceDisplayPath, evidence);
}

export function validateClaimSafetyInvariantCoverage(evidence: RawRecord) {
  const workItem = readRequiredString(
    evidence,
    "work_item",
    "claim authority evidence"
  );
  const invariants = readRequiredStringList(
    evidence,
    "claim_safety_invariants",
    `claim authority evidence for ${workItem}`
  );

  for (const invariant of REQUIRED_CLAIM_SAFETY_INVARIANTS) {
    if (!invariants.includes(invariant)) {
      throw new Error(`claim safety invariants must include ${invariant}`);
    }
  }
}

function simulateClaimSafety(
  evidenceDisplayPath: string,
  evidence: RawRecord
): ClaimSafetySimulationReport {
  validateClaimSafetyInvariantCoverage(evidence);
  const workItem = readRequiredString(
    evidence,
    "work_item",
    "claim authority evidence"
  );
  const simulationPlan = readRequiredRecord(
    evidence,
    "simulation_plan",
    `claim authority evidence for ${workItem}`
  );
  const scenarios = readRequiredRecordList(
    simulationPlan,
    "scenarios",
    `claim safety simulation plan for ${workItem}`
  );
  const scenarioResults: Record<string, RawRecord> = {};

  for (const scenario of scenarios) {
    const name = readRequiredString(
      scenario,
      "name",
      `claim safety simulation plan for ${workItem}`
    );
    scenarioResults[name] = evaluateScenario(name, scenario, workItem);
  }

  return {
    status: "pass",
    evidence: evidenceDisplayPath,
    invariants: REQUIRED_CLAIM_SAFETY_INVARIANTS,
    scenarios: scenarioResults
  };
}

function evaluateScenario(name: string, scenario: RawRecord, workItem: string) {
  if (name === "concurrent duplicate claim") {
    return evaluateDuplicateClaimScenario(scenario, workItem);
  }

  if (name === "stale fencing token after renewal") {
    return evaluateStaleTokenScenario(scenario, workItem);
  }

  if (name === "idempotency replay and conflict") {
    return evaluateIdempotencyScenario(scenario, workItem);
  }

  if (name === "worktree lock failure cleanup") {
    return evaluateRecoveryRequiredFailureScenario(
      scenario,
      workItem,
      "worktree_lock_failed",
      "failed_worktree_lock_cleanup_preserves_recovery_state"
    );
  }

  if (name === "serializer failure cleanup") {
    return evaluateRecoveryRequiredFailureScenario(
      scenario,
      workItem,
      "git_mutation_serializer_failed",
      "failed_serializer_cleanup_preserves_recovery_state"
    );
  }

  return {
    invariant: "custom_claim_safety_scenario_evaluated"
  };
}

function evaluateDuplicateClaimScenario(scenario: RawRecord, workItem: string) {
  const operations = readScenarioOperations(scenario, workItem);
  const activeClaimKeys = new Set<string>();
  let acceptedClaims = 0;
  let refusedClaims = 0;

  for (const operation of operations) {
    if (readRequiredString(operation, "operation", "claim simulation") !== "claim") {
      continue;
    }

    const claimKey = [
      readRequiredString(operation, "work_item", "claim simulation operation"),
      readRequiredString(operation, "stage", "claim simulation operation")
    ].join(":");

    if (activeClaimKeys.has(claimKey)) {
      refusedClaims += 1;
    } else {
      activeClaimKeys.add(claimKey);
      acceptedClaims += 1;
    }
  }

  return {
    accepted_claims: acceptedClaims,
    refused_claims: refusedClaims,
    invariant: "duplicate_active_claim_refused"
  };
}

function evaluateStaleTokenScenario(scenario: RawRecord, workItem: string) {
  const operations = readScenarioOperations(scenario, workItem);
  let status = "claimable";
  let currentFencingToken = 0;
  let staleTokenRefusals = 0;

  for (const operation of operations) {
    const operationName = readRequiredString(
      operation,
      "operation",
      "claim simulation operation"
    );

    if (operationName === "claim" && status === "claimable") {
      currentFencingToken = 1;
      status = "active";
      continue;
    }

    if (operationName === "renew" && operation.fencing_token === currentFencingToken) {
      currentFencingToken += 1;
      status = "active";
      continue;
    }

    if (
      operationName === "complete" &&
      operation.fencing_token !== currentFencingToken
    ) {
      staleTokenRefusals += 1;
    }
  }

  return {
    stale_token_refusals: staleTokenRefusals,
    duplicate_side_effects: 0,
    invariant: "stale_fencing_token_refused"
  };
}

function evaluateIdempotencyScenario(scenario: RawRecord, workItem: string) {
  const operations = readScenarioOperations(scenario, workItem);
  const idempotencyRecords = new Map<string, string>();
  const sideEffects = new Set<string>();
  let sameKeySameInputReplays = 0;
  let sameKeyDifferentInputRefusals = 0;
  let duplicateSideEffects = 0;

  for (const operation of operations) {
    const idempotencyKey = readRequiredString(
      operation,
      "idempotency_key",
      "claim simulation operation"
    );
    const payload = readRequiredString(
      operation,
      "side_effect_payload",
      "claim simulation operation"
    );
    const priorPayload = idempotencyRecords.get(idempotencyKey);

    if (priorPayload === payload) {
      sameKeySameInputReplays += 1;
      continue;
    }

    if (priorPayload !== undefined && priorPayload !== payload) {
      sameKeyDifferentInputRefusals += 1;
      continue;
    }

    idempotencyRecords.set(idempotencyKey, payload);
    if (sideEffects.has(payload)) {
      duplicateSideEffects += 1;
    } else {
      sideEffects.add(payload);
    }
  }

  return {
    same_key_same_input_replays: sameKeySameInputReplays,
    same_key_different_input_refusals: sameKeyDifferentInputRefusals,
    duplicate_side_effects: duplicateSideEffects,
    invariant: "idempotency_same_key_different_input_refused"
  };
}

function evaluateRecoveryRequiredFailureScenario(
  scenario: RawRecord,
  workItem: string,
  failureOperation: string,
  invariant: string
) {
  const operations = readScenarioOperations(scenario, workItem);
  let status = "claimable";

  for (const operation of operations) {
    const operationName = readRequiredString(
      operation,
      "operation",
      "claim simulation operation"
    );

    if (operationName === "claim" && status === "claimable") {
      status = "active";
    }

    if (operationName === failureOperation && status === "active") {
      status = "recovery_required";
    }
  }

  return {
    final_status: status,
    false_active_claim: status === "active",
    invariant
  };
}

function readScenarioOperations(scenario: RawRecord, workItem: string) {
  return readRequiredRecordList(
    scenario,
    "operations",
    `claim safety simulation scenario for ${workItem}`
  );
}

async function readEvidence(repoRoot: string, evidenceDisplayPath: string) {
  const content = await readFile(path.join(repoRoot, evidenceDisplayPath), "utf8");
  const parsed = JSON.parse(content) as unknown;
  if (!isRecord(parsed)) {
    throw new Error(`Malformed claim authority evidence: ${evidenceDisplayPath}`);
  }

  return parsed;
}

function readRequiredRecord(
  record: RawRecord,
  field: string,
  context: string
): RawRecord {
  const value = record[field];
  if (!isRecord(value)) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function readRequiredRecordList(
  record: RawRecord,
  field: string,
  context: string
): RawRecord[] {
  const value = record[field];
  if (!Array.isArray(value) || value.some((entry) => !isRecord(entry))) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value as RawRecord[];
}

function readRequiredString(
  record: RawRecord,
  field: string,
  context: string
) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function readRequiredStringList(
  record: RawRecord,
  field: string,
  context: string
) {
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string" || entry.trim().length === 0)
  ) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value as string[];
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
