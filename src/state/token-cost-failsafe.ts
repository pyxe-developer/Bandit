import { readFile } from "node:fs/promises";
import path from "node:path";

export type TokenCostFailsafeValidationReport = {
  status: "pass";
  policy: string;
  provider_pricing_evidence: string[];
  spend_classes: string[];
  soft_budget_bands: string[];
  recurring_routes: string[];
  failsafe_triggers: string[];
  continuation_decisions: string[];
};

type RawRecord = Record<string, unknown>;

const POLICY_DISPLAY_PATH = ".bandit/policy/token-cost-failsafe.json";
const TEMPLATE_DISPLAY_PATH = "docs/templates/token-cost-failsafe.md";

const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "policy",
  "provider_pricing_evidence",
  "benchmark_evaluation_spend",
  "recurring_paid_routes",
  "soft_budget_bands",
  "abnormal_run_triggers",
  "trace_cost_signal_boundary",
  "continuation_decisions",
  "stage_capability_profiles",
  "source_artifacts"
];

const REQUIRED_PROVIDER_PRICING_FIELDS = [
  "pricing_source",
  "captured_date",
  "effective_date",
  "freshness_or_expiry_rule",
  "expected_per_run_cost",
  "spend_class",
  "approval_owner"
];

const VALID_CONTINUATION_DECISIONS = new Set([
  "continue",
  "reroute",
  "pause",
  "stop",
  "operator_cost_risk_approval"
]);

export async function validateTokenCostFailsafe(
  repoRoot: string
): Promise<TokenCostFailsafeValidationReport> {
  await validateTemplate(repoRoot);
  const content = await readRequiredPolicy(repoRoot);
  return parseAndValidatePolicy(content);
}

export async function validateTokenCostFailsafePolicy(
  repoRoot: string
): Promise<void> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return;
    throw error;
  }
  await validateTemplate(repoRoot);
  parseAndValidatePolicy(content);
}

async function validateTemplate(repoRoot: string) {
  const templatePath = path.join(repoRoot, TEMPLATE_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(templatePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${TEMPLATE_DISPLAY_PATH}`);
    }
    throw error;
  }

  const missingFields = REQUIRED_TEMPLATE_FIELDS.filter(
    (field) => !new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Malformed template: ${TEMPLATE_DISPLAY_PATH}; missing required fields: ${missingFields.join(", ")}`
    );
  }
}

async function readRequiredPolicy(repoRoot: string): Promise<string> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  try {
    return await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
    }
    throw error;
  }
}

function parseAndValidatePolicy(content: string): TokenCostFailsafeValidationReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed token-cost failsafe policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error(
      "Malformed token-cost failsafe policy: missing contract_version 1"
    );
  }

  if (parsed.policy_id !== "token-cost-failsafe") {
    throw new Error(
      "Malformed token-cost failsafe policy: policy_id must be token-cost-failsafe"
    );
  }

  const providerPricingIds = validateProviderPricingEvidence(parsed);
  const spendClassIds = collectSpendClassIds(parsed);
  validateBenchmarkEvaluationSpend(parsed);
  const recurringRouteIds = validateRecurringPaidRoutes(parsed);
  const softBudgetBandIds = validateSoftBudgetBands(parsed);
  const failsafeTriggers = collectFailsafeTriggers(parsed);
  validateFailsafeTrips(parsed);
  validateTraceCostSignalBoundary(parsed);
  const continuationDecisions = collectContinuationDecisions(parsed);

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    provider_pricing_evidence: providerPricingIds,
    spend_classes: spendClassIds,
    soft_budget_bands: softBudgetBandIds,
    recurring_routes: recurringRouteIds,
    failsafe_triggers: failsafeTriggers,
    continuation_decisions: continuationDecisions
  };
}

function validateProviderPricingEvidence(policy: RawRecord): string[] {
  if (!Array.isArray(policy.provider_pricing_evidence)) return [];
  const ids: string[] = [];

  for (const item of policy.provider_pricing_evidence as unknown[]) {
    if (!isRecord(item)) continue;
    const id = typeof item.id === "string" ? item.id : "unknown";

    const missingField = REQUIRED_PROVIDER_PRICING_FIELDS.find((field) => {
      const value = item[field];
      return value == null || (typeof value === "string" && value.trim() === "");
    });

    if (missingField) {
      throw new Error(
        `provider-pricing evidence ${id} requires pricing source, captured date, effective date, freshness or expiry rule, expected per-run cost, spend class, and approval owner`
      );
    }

    ids.push(id);
  }

  return ids;
}

function collectSpendClassIds(policy: RawRecord): string[] {
  if (!Array.isArray(policy.spend_classes)) return [];
  return (policy.spend_classes as unknown[])
    .filter(isRecord)
    .map((item) => (typeof item.id === "string" ? item.id : ""))
    .filter((id) => id.length > 0);
}

function validateBenchmarkEvaluationSpend(policy: RawRecord): void {
  if (!Array.isArray(policy.benchmark_evaluation_spend)) return;

  for (const item of policy.benchmark_evaluation_spend as unknown[]) {
    if (!isRecord(item)) continue;

    const approval = item.approval;
    const nonRecurringDisposition = item.non_recurring_routing_disposition;

    const hasValidApproval =
      typeof approval === "string" &&
      approval.trim().length > 0 &&
      approval !== "missing";

    const hasValidDisposition =
      typeof nonRecurringDisposition === "string" &&
      nonRecurringDisposition.trim().length > 0;

    if (!hasValidApproval || !hasValidDisposition) {
      throw new Error(
        "one-off benchmark or evaluation spend requires current provider-pricing evidence, expected per-run cost, per-run approval or active spend-class approval, and explicit non-recurring routing disposition"
      );
    }
  }
}

function validateRecurringPaidRoutes(policy: RawRecord): string[] {
  if (!Array.isArray(policy.recurring_paid_routes)) return [];
  const ids: string[] = [];

  for (const item of policy.recurring_paid_routes as unknown[]) {
    if (!isRecord(item)) continue;
    const id = typeof item.id === "string" ? item.id : "unknown";

    const hasSpendClassApproval =
      typeof item.spend_class_approval === "string" &&
      item.spend_class_approval.trim().length > 0 &&
      item.spend_class_approval !== "missing";

    const hasPromotionThreshold = item.promotion_threshold != null;

    const hasApplicability =
      typeof item.applies_to_stage_capability_profile === "string" &&
      item.applies_to_stage_capability_profile.trim().length > 0;

    if (!hasSpendClassApproval || !hasPromotionThreshold || !hasApplicability) {
      throw new Error(
        "recurring paid routes require provider-pricing evidence, spend-class approval, scoped promotion threshold, and route applicability"
      );
    }

    ids.push(id);
  }

  return ids;
}

function validateSoftBudgetBands(policy: RawRecord): string[] {
  if (!Array.isArray(policy.soft_budget_bands)) return [];
  const ids: string[] = [];

  for (const item of policy.soft_budget_bands as unknown[]) {
    if (!isRecord(item)) continue;
    const id = typeof item.id === "string" ? item.id : "unknown";

    if (
      item.budget_mode === "hard_cap" ||
      item.normal_variance_policy === "stop_immediately"
    ) {
      throw new Error(
        "soft budget bands must be generous abnormal-run failsafes, not tight caps that force repeated failed attempts"
      );
    }

    ids.push(id);
  }

  return ids;
}

function collectFailsafeTriggers(policy: RawRecord): string[] {
  if (!Array.isArray(policy.abnormal_run_triggers)) return [];
  return (policy.abnormal_run_triggers as unknown[]).filter(
    (item): item is string => typeof item === "string"
  );
}

function validateFailsafeTrips(policy: RawRecord): void {
  if (!Array.isArray(policy.failsafe_trips)) return;

  for (const item of policy.failsafe_trips as unknown[]) {
    if (!isRecord(item)) continue;

    const continuationDecision = item.continuation_decision;
    if (
      typeof continuationDecision !== "string" ||
      !VALID_CONTINUATION_DECISIONS.has(continuationDecision)
    ) {
      throw new Error(
        "failsafe trips require continue, reroute, pause, stop, or operator-owned cost/risk approval evidence"
      );
    }
  }
}

function validateTraceCostSignalBoundary(policy: RawRecord): void {
  const boundary = policy.trace_cost_signal_boundary;
  if (!isRecord(boundary)) return;

  if (boundary.can_satisfy_required_workflow_artifacts === true) {
    throw new Error(
      "trace-backed token and cost signals cannot replace canonical workflow artifacts, approvals, landing evidence, UAT, or retrospective evidence"
    );
  }
}

function collectContinuationDecisions(policy: RawRecord): string[] {
  if (!Array.isArray(policy.continuation_decisions)) return [];
  return (policy.continuation_decisions as unknown[]).filter(
    (item): item is string => typeof item === "string"
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
