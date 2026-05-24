export const SHARED_VERDICT_VALUES = new Set([
  "pass",
  "blocker",
  "non_blocking",
  "not_applicable",
  "bootstrap_gap"
]);

export const FINAL_LANDING_VERDICTS = new Set([
  "safe-to-land",
  "needs-repair",
  "blocked",
  "requires operator approval"
]);

export const SOURCE_DRIFT_STATUSES = new Set([
  "current",
  "stale",
  "not_applicable",
  "unavailable"
]);

export const RESOLVED_OPERATOR_INPUT_STATUSES = new Set([
  "none_required",
  "provided",
  "not_applicable"
]);

export function requireSharedVerdict(label: string, value: string) {
  if (!SHARED_VERDICT_VALUES.has(value)) {
    throw new Error(`Unsupported ${label}: ${value}`);
  }
}

export function requireSourceDriftStatus(value: string) {
  if (!SOURCE_DRIFT_STATUSES.has(value)) {
    throw new Error(`Unsupported source drift status: ${value}`);
  }
}

export function requireResolvedOperatorInput(
  artifactLabel: string,
  workItemId: string,
  value: string
) {
  if (!RESOLVED_OPERATOR_INPUT_STATUSES.has(value)) {
    throw new Error(
      `${artifactLabel} has unresolved operator-owned input: ${workItemId}`
    );
  }
}
