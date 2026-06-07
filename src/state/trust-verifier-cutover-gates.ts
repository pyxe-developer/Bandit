import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

const POLICY_DISPLAY_PATH = ".bandit/policy/trust-verifier-cutover-gates.json";

const SUPPORTED_TRUST_GOALS = new Set([
  "stage_transition",
  "landing",
  "closeout",
  "evidence_refresh"
]);

const APPROVED_OPERATOR_APPROVAL_STATUS = "approved";

const REQUIRED_GATE_STRING_FIELDS = [
  "old_authoritative_gate",
  "proposed_trust_verifier",
  "stricter_failure_behavior",
  "report_format",
  "rollback_or_fallback",
  "evidence_freshness_boundary",
  "reviewer_finding_routing_boundary"
];

type RawRecord = Record<string, unknown>;

type CutoverGateSummary = { trust_goal: string; status: string };

export type TrustVerifierCutoverGateReport = {
  status: "pass";
  verdict: "pass";
  policy: typeof POLICY_DISPLAY_PATH;
  compatibility_period: boolean;
  old_gates_authoritative: boolean;
  approved_trust_goals: string[];
  cutover_gates: CutoverGateSummary[];
};

export async function writeDefaultTrustVerifierCutoverGatesPolicy(
  filePath: string
): Promise<void> {
  const policy = {
    version: 1,
    compatibility_period: true,
    old_gates_authoritative: true,
    approved_trust_goals: [],
    cutover_gates: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateTrustVerifierCutoverGates(
  repoRoot: string
): Promise<TrustVerifierCutoverGateReport> {
  const paths = getBanditPaths(repoRoot);
  const policy = parsePolicy(
    await readRequiredFile(paths.trustVerifierCutoverGatesPolicy)
  );

  const problems = collectProblems(policy);
  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return {
    status: "pass",
    verdict: "pass",
    policy: POLICY_DISPLAY_PATH,
    compatibility_period: policy.compatibilityPeriod,
    old_gates_authoritative: policy.oldGatesAuthoritative,
    approved_trust_goals: policy.approvedTrustGoals,
    cutover_gates: policy.cutoverGates.map((gate) => ({
      trust_goal: readOptionalString(gate, "trust_goal") ?? "(unspecified)",
      status: readOptionalString(gate, "status") ?? "(unspecified)"
    }))
  };
}

type CutoverGatesPolicy = {
  compatibilityPeriod: boolean;
  oldGatesAuthoritative: boolean;
  approvedTrustGoals: string[];
  cutoverGates: RawRecord[];
};

function parsePolicy(content: string): CutoverGatesPolicy {
  const parsed = parseJsonObject(content);

  if (parsed.version !== 1) {
    throw new Error(
      "Malformed trust-verifier cutover-gates policy: missing version 1"
    );
  }

  return {
    compatibilityPeriod: readRequiredBoolean(parsed, "compatibility_period"),
    oldGatesAuthoritative: readRequiredBoolean(parsed, "old_gates_authoritative"),
    approvedTrustGoals: readRequiredStringList(parsed, "approved_trust_goals"),
    cutoverGates: readRequiredRecordList(parsed, "cutover_gates")
  };
}

function collectProblems(policy: CutoverGatesPolicy): string[] {
  const problems: string[] = [];

  for (const gate of policy.cutoverGates) {
    problems.push(...gateProblems(gate));
  }

  return problems;
}

function gateProblems(gate: RawRecord): string[] {
  const problems: string[] = [];
  const label = readOptionalString(gate, "trust_goal") ?? "(unspecified)";

  const trustGoal = readOptionalString(gate, "trust_goal");
  if (trustGoal === null) {
    problems.push(`cutover gate ${label}: missing trust_goal`);
  } else if (!SUPPORTED_TRUST_GOALS.has(trustGoal)) {
    problems.push(`cutover gate ${label}: unsupported trust_goal ${trustGoal}`);
  }

  for (const field of REQUIRED_GATE_STRING_FIELDS) {
    if (readOptionalString(gate, field) === null) {
      problems.push(`cutover gate ${label}: missing ${field}`);
    }
  }

  if (!hasNonEmptyStringList(gate, "parity_evidence")) {
    problems.push(`cutover gate ${label}: missing parity_evidence`);
  }

  const operatorApproval = readOptionalRecord(gate, "operator_approval");
  if (operatorApproval === null) {
    problems.push(`cutover gate ${label}: missing operator_approval`);
  }

  if (isCutoverClaim(gate) && !isOperatorApproved(operatorApproval)) {
    problems.push(
      `implicit cutover claim for ${label}: bandit trust verify cannot be canonical, wrap, or replace an old gate without operator-approved cutover evidence`
    );
    const approvalStatus = operatorApproval
      ? readOptionalString(operatorApproval, "status") ?? "absent"
      : "absent";
    problems.push(
      `cutover gate ${label}: operator approval status is ${approvalStatus}`
    );
  }

  return problems;
}

function isCutoverClaim(gate: RawRecord): boolean {
  const status = readOptionalString(gate, "status");
  const wrapperBehavior = readOptionalString(gate, "wrapper_behavior");

  return (
    status === "canonical" ||
    status === "wrapper" ||
    status === "replaced" ||
    wrapperBehavior === "replace_old_gate" ||
    wrapperBehavior === "wrap_old_gate"
  );
}

function isOperatorApproved(operatorApproval: RawRecord | null): boolean {
  if (operatorApproval === null) {
    return false;
  }

  return (
    readOptionalString(operatorApproval, "status") ===
      APPROVED_OPERATOR_APPROVAL_STATUS &&
    readOptionalString(operatorApproval, "evidence") !== null
  );
}

async function readRequiredFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
    }
    throw error;
  }
}

function parseJsonObject(content: string): RawRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      "Malformed trust-verifier cutover-gates policy: invalid JSON"
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      "Malformed trust-verifier cutover-gates policy: expected object"
    );
  }

  return parsed;
}

function readRequiredBoolean(record: RawRecord, field: string): boolean {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(
      `Malformed trust-verifier cutover-gates policy: ${field} must be boolean`
    );
  }

  return value;
}

function readRequiredStringList(record: RawRecord, field: string): string[] {
  const value = record[field];
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(
      `Malformed trust-verifier cutover-gates policy: ${field} must be a string list`
    );
  }

  return value as string[];
}

function readRequiredRecordList(record: RawRecord, field: string): RawRecord[] {
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(
      `Malformed trust-verifier cutover-gates policy: ${field} must be an object list`
    );
  }

  return value;
}

function hasNonEmptyStringList(record: RawRecord, field: string): boolean {
  const value = record[field];
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === "string" && entry.trim().length > 0)
  );
}

function readOptionalRecord(record: RawRecord, field: string): RawRecord | null {
  const value = record[field];
  return isRecord(value) ? value : null;
}

function readOptionalString(record: RawRecord, field: string): string | null {
  const value = record[field];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
