import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type OperatorBoundaryValidationReport = {
  status: "pass";
  policy: typeof OPERATOR_BOUNDARY_POLICY_DISPLAY_PATH;
  decisions: string[];
  operator_blocking_gates: string[];
  drift_routes: string[];
  smell_triggers: string[];
};

type RawRecord = Record<string, unknown>;

type OperatorBoundaryPolicy = {
  operatorBlockingGates: string[];
  codexOwnedTechnicalDecisions: string[];
  derivableOperationalDrift: string[];
  repairOverreachRefusals: string[];
  smellTriggerAlignment: string[];
  releaseAuthorizedDecisions: OperatorBoundaryDecision[];
};

type OperatorBoundaryDecision = {
  workItem: string;
  decisionKind: string;
  evidencePath: string;
};

type OperatorBoundaryEvidence = {
  workItem: string;
  sourceArtifacts: string[];
  classification: RawRecord;
  mechanicalRepair: RawRecord;
  operatorEscalation: RawRecord;
  repairOverreachRefusals: string[];
  smellDispositions: RawRecord[];
};

const OPERATOR_BOUNDARY_POLICY_DISPLAY_PATH =
  ".bandit/policy/operator-boundary.json";
const OPERATOR_BOUNDARY_TEMPLATE_DISPLAY_PATH =
  "docs/templates/operator-boundary.md";
const POLICY_ID = "operator-fail-closed-boundary";
const OPERATOR_BLOCKING_GATES = [
  "product_direction",
  "uat_approval_or_stale_uat",
  "policy_change",
  "business_tradeoff",
  "explicit_cost_or_risk_approval",
  "irreversible_operational_risk_approval",
  "safety_critical_release_authorization",
  "genuinely_ambiguous_scope"
];
const CODEX_OWNED_TECHNICAL_DECISIONS = [
  "technical_routing",
  "implementation_mechanics",
  "agent_or_tool_selection",
  "skill_scoping",
  "review_depth",
  "test_strategy",
  "artifact_structure",
  "git_plumbing"
];
const DERIVABLE_OPERATIONAL_DRIFT = [
  "missing_derivable_metadata",
  "malformed_supported_artifact",
  "registry_or_ledger_drift",
  "projection_mismatch",
  "current_context_or_roadmap_bookkeeping_drift",
  "workflow_status_disagreement"
];
const REPAIR_OVERREACH_REFUSALS = [
  "invent_product_scope",
  "grant_uat_or_product_approval",
  "override_policy",
  "resolve_ambiguous_cost_or_risk",
  "approve_spend",
  "perform_irreversible_operational_action",
  "force_resolve_unsafe_claim_recovery",
  "break_dependencies",
  "change_merge_push_deploy_authority"
];
const SMELL_TRIGGER_ALIGNMENT = [
  "BANDIT-SMELL-OPERATOR-INPUT-BOUNDARY",
  "BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE",
  "BANDIT-SMELL-TECHNICAL-QUESTION-ESCALATION",
  "BANDIT-SMELL-MECHANICAL-REPAIR-OVERREACH"
];
const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "operator_blocking_gates",
  "codex_owned_technical_decisions",
  "derivable_operational_drift",
  "cli_owned_mechanical_repair",
  "repair_overreach_refusals",
  "operator_escalation_overuse_smells",
  "required_evidence",
  "source_artifacts",
  "escalation_targets",
  "evidence_paths"
];
const REPAIR_EVIDENCE_ERROR =
  "requires approved source artifacts, observed current state or report hash, expected-current-state check, exact intended repair, immutable transition or lifecycle evidence, and post-repair validation";
const REPAIR_OVERREACH_MESSAGES = new Map<string, string>([
  ["invent_product_scope", "mechanical repair cannot invent product scope"],
  [
    "grant_uat_or_product_approval",
    "mechanical repair cannot grant UAT or product approval"
  ],
  ["override_policy", "mechanical repair cannot override policy"],
  [
    "resolve_ambiguous_cost_or_risk",
    "mechanical repair cannot resolve ambiguous cost or risk"
  ],
  ["approve_spend", "mechanical repair cannot approve spend"],
  [
    "perform_irreversible_operational_action",
    "mechanical repair cannot perform irreversible operational action"
  ],
  [
    "force_resolve_unsafe_claim_recovery",
    "mechanical repair cannot force-resolve unsafe claim recovery"
  ],
  ["break_dependencies", "mechanical repair cannot break dependencies"],
  [
    "change_merge_push_deploy_authority",
    "mechanical repair cannot change merge, push, or deploy authority"
  ]
]);

export async function writeDefaultOperatorBoundaryPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: POLICY_ID,
    operator_blocking_gates: OPERATOR_BLOCKING_GATES,
    codex_owned_technical_decisions: CODEX_OWNED_TECHNICAL_DECISIONS,
    derivable_operational_drift: DERIVABLE_OPERATIONAL_DRIFT,
    repair_overreach_refusals: REPAIR_OVERREACH_REFUSALS,
    smell_trigger_alignment: SMELL_TRIGGER_ALIGNMENT,
    release_authorized_decisions: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultOperatorBoundaryTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, OPERATOR_BOUNDARY_TEMPLATE_DISPLAY_PATH);
  const template = `# Operator Fail-Closed Boundary Template

work_item:
operator_blocking_gates:
codex_owned_technical_decisions:
derivable_operational_drift:
cli_owned_mechanical_repair:
repair_overreach_refusals:
operator_escalation_overuse_smells:
required_evidence:
source_artifacts:
escalation_targets:
evidence_paths:
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

export async function validateOperatorBoundary(
  repoRoot: string
): Promise<OperatorBoundaryValidationReport> {
  const policy = await readOperatorBoundaryPolicy(repoRoot);
  await validateOperatorBoundaryTemplate(repoRoot);
  const decisions = await validateOperatorBoundaryDecisions(repoRoot, policy);

  return {
    status: "pass",
    policy: OPERATOR_BOUNDARY_POLICY_DISPLAY_PATH,
    decisions: decisions.map((decision) => decision.workItem),
    operator_blocking_gates: policy.operatorBlockingGates,
    drift_routes: decisions.map(formatDriftRoute),
    smell_triggers: policy.smellTriggerAlignment
  };
}

async function readOperatorBoundaryPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredFile(
    paths.operatorBoundaryPolicy,
    OPERATOR_BOUNDARY_POLICY_DISPLAY_PATH,
    "policy"
  );

  return parsePolicy(content);
}

async function validateOperatorBoundaryTemplate(repoRoot: string) {
  const content = await readRequiredFile(
    path.join(repoRoot, OPERATOR_BOUNDARY_TEMPLATE_DISPLAY_PATH),
    OPERATOR_BOUNDARY_TEMPLATE_DISPLAY_PATH,
    "template"
  );

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${OPERATOR_BOUNDARY_TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

function parsePolicy(content: string): OperatorBoundaryPolicy {
  const parsed = parseJsonObject(content, "operator-boundary policy");

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed operator-boundary policy: missing contract_version 1");
  }

  if (parsed.policy_id !== POLICY_ID) {
    throw new Error(
      `Malformed operator-boundary policy: policy_id must be ${POLICY_ID}`
    );
  }

  const operatorBlockingGates = readRequiredStringList(
    parsed,
    "operator_blocking_gates",
    "operator-boundary policy"
  );
  const codexOwnedTechnicalDecisions = readRequiredStringList(
    parsed,
    "codex_owned_technical_decisions",
    "operator-boundary policy"
  );
  const derivableOperationalDrift = readRequiredStringList(
    parsed,
    "derivable_operational_drift",
    "operator-boundary policy"
  );
  const repairOverreachRefusals = readRequiredStringList(
    parsed,
    "repair_overreach_refusals",
    "operator-boundary policy"
  );
  const smellTriggerAlignment = readRequiredStringList(
    parsed,
    "smell_trigger_alignment",
    "operator-boundary policy"
  );

  requirePolicyValues(
    operatorBlockingGates,
    OPERATOR_BLOCKING_GATES,
    "operator_blocking_gates"
  );
  requirePolicyValues(
    codexOwnedTechnicalDecisions,
    CODEX_OWNED_TECHNICAL_DECISIONS,
    "codex_owned_technical_decisions"
  );
  requirePolicyValues(
    derivableOperationalDrift,
    DERIVABLE_OPERATIONAL_DRIFT,
    "derivable_operational_drift"
  );
  requirePolicyValues(
    repairOverreachRefusals,
    REPAIR_OVERREACH_REFUSALS,
    "repair_overreach_refusals"
  );
  for (const smellId of SMELL_TRIGGER_ALIGNMENT) {
    if (!smellTriggerAlignment.includes(smellId)) {
      throw new Error(
        `operator-boundary policy must cover smell trigger ${smellId}`
      );
    }
  }

  return {
    operatorBlockingGates,
    codexOwnedTechnicalDecisions,
    derivableOperationalDrift,
    repairOverreachRefusals,
    smellTriggerAlignment,
    releaseAuthorizedDecisions: readDecisions(parsed)
  };
}

function requirePolicyValues(
  actualValues: string[],
  requiredValues: string[],
  field: string
) {
  for (const requiredValue of requiredValues) {
    if (!actualValues.includes(requiredValue)) {
      throw new Error(`${field} must include ${requiredValue}`);
    }
  }
}

function readDecisions(policy: RawRecord): OperatorBoundaryDecision[] {
  return readRequiredRecordList(
    policy,
    "release_authorized_decisions",
    "operator-boundary policy"
  ).map((decision) => {
    const decisionKind = readRequiredString(
      decision,
      "decision_kind",
      "operator-boundary decision"
    );
    if (decisionKind !== "operator_boundary") {
      throw new Error(`Unsupported operator-boundary decision kind: ${decisionKind}`);
    }

    return {
      workItem: readRequiredString(
        decision,
        "work_item",
        "operator-boundary decision"
      ),
      decisionKind,
      evidencePath: readRequiredString(
        decision,
        "evidence_path",
        "operator-boundary decision"
      )
    };
  });
}

async function validateOperatorBoundaryDecisions(
  repoRoot: string,
  policy: OperatorBoundaryPolicy
) {
  const decisions: OperatorBoundaryEvidence[] = [];
  const problems: string[] = [];

  for (const decision of policy.releaseAuthorizedDecisions) {
    const evidence = await readOperatorBoundaryEvidence(
      repoRoot,
      decision.evidencePath,
      decision.workItem
    );
    problems.push(...operatorBoundaryProblems(evidence, policy));
    decisions.push(evidence);
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return decisions;
}

async function readOperatorBoundaryEvidence(
  repoRoot: string,
  evidencePath: string,
  expectedWorkItem: string
): Promise<OperatorBoundaryEvidence> {
  const content = await readRequiredFile(
    path.join(repoRoot, evidencePath),
    evidencePath,
    "operator-boundary evidence"
  );
  const parsed = parseJsonObject(content, "operator-boundary evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed operator-boundary evidence for ${expectedWorkItem}: missing contract_version 1`
    );
  }

  const workItem = readRequiredString(
    parsed,
    "work_item",
    "operator-boundary evidence"
  );
  if (workItem !== expectedWorkItem) {
    throw new Error(
      `Malformed operator-boundary evidence for ${expectedWorkItem}: work_item does not match`
    );
  }

  if (
    readRequiredString(
      parsed,
      "boundary_kind",
      "operator-boundary evidence"
    ) !== "operator_fail_closed_boundary"
  ) {
    throw new Error(
      `Malformed operator-boundary evidence for ${expectedWorkItem}: boundary_kind must be operator_fail_closed_boundary`
    );
  }

  return {
    workItem,
    sourceArtifacts: readRequiredStringList(
      parsed,
      "source_artifacts",
      `operator-boundary evidence for ${workItem}`
    ),
    classification: readRequiredRecord(
      parsed,
      "classification",
      `operator-boundary evidence for ${workItem}`
    ),
    mechanicalRepair: readRequiredRecord(
      parsed,
      "mechanical_repair",
      `operator-boundary evidence for ${workItem}`
    ),
    operatorEscalation: readRequiredRecord(
      parsed,
      "operator_escalation",
      `operator-boundary evidence for ${workItem}`
    ),
    repairOverreachRefusals: readRequiredStringList(
      parsed,
      "repair_overreach_refusals",
      `operator-boundary evidence for ${workItem}`
    ),
    smellDispositions: readRequiredRecordList(
      parsed,
      "smell_dispositions",
      `operator-boundary evidence for ${workItem}`
    )
  };
}

function operatorBoundaryProblems(
  evidence: OperatorBoundaryEvidence,
  policy: OperatorBoundaryPolicy
) {
  const problems: string[] = [];

  if (evidence.sourceArtifacts.length === 0) {
    problems.push(`operator-boundary evidence for ${evidence.workItem} requires source artifacts`);
  }

  problems.push(...classificationProblems(evidence, policy));
  problems.push(...mechanicalRepairProblems(evidence, policy));
  problems.push(...repairOverreachRefusalProblems(evidence, policy));
  problems.push(...smellDispositionProblems(evidence, policy));

  return problems;
}

function classificationProblems(
  evidence: OperatorBoundaryEvidence,
  policy: OperatorBoundaryPolicy
) {
  const problems: string[] = [];
  const operatorGate = readRequiredString(
    evidence.classification,
    "operator_blocking_gate",
    `operator-boundary classification for ${evidence.workItem}`
  );
  const codexDecision = readRequiredString(
    evidence.classification,
    "codex_owned_technical_decision",
    `operator-boundary classification for ${evidence.workItem}`
  );
  const drift = readRequiredString(
    evidence.classification,
    "derivable_operational_drift",
    `operator-boundary classification for ${evidence.workItem}`
  );
  const escalationTarget = readRequiredString(
    evidence.operatorEscalation,
    "target",
    `operator-boundary escalation for ${evidence.workItem}`
  );
  const missingOperatorInput = readRequiredBoolean(
    evidence.operatorEscalation,
    "missing_operator_input",
    `operator-boundary escalation for ${evidence.workItem}`
  );

  if (operatorGate !== "none" && !policy.operatorBlockingGates.includes(operatorGate)) {
    problems.push(`unsupported operator-blocking gate ${operatorGate}`);
  }

  if (!policy.codexOwnedTechnicalDecisions.includes(codexDecision)) {
    problems.push(`unsupported Codex-owned technical decision ${codexDecision}`);
  }

  if (!policy.derivableOperationalDrift.includes(drift)) {
    problems.push(`unsupported derivable operational drift ${drift}`);
  }

  if (
    policy.derivableOperationalDrift.includes(drift) &&
    escalationTarget === "operator" &&
    !missingOperatorInput
  ) {
    problems.push(
      `derivable operational drift ${drift} must route to Codex PM or CLI-owned mechanical repair, not operator`
    );
  }

  return problems;
}

function mechanicalRepairProblems(
  evidence: OperatorBoundaryEvidence,
  policy: OperatorBoundaryPolicy
) {
  const problems: string[] = [];

  if (!hasCompleteRepairEvidence(evidence.mechanicalRepair)) {
    problems.push(`mechanical repair for ${evidence.workItem} ${REPAIR_EVIDENCE_ERROR}`);
  }

  const overreachAttempts = readOptionalStringList(
    evidence.mechanicalRepair,
    "overreach_attempts"
  );
  for (const attempt of overreachAttempts) {
    if (!policy.repairOverreachRefusals.includes(attempt)) {
      problems.push(`unsupported mechanical repair overreach attempt ${attempt}`);
      continue;
    }
    problems.push(
      REPAIR_OVERREACH_MESSAGES.get(attempt) ??
        `mechanical repair cannot ${attempt.replaceAll("_", " ")}`
    );
  }

  return problems;
}

function hasCompleteRepairEvidence(mechanicalRepair: RawRecord) {
  return (
    hasNonEmptyStringList(mechanicalRepair, "approved_source_artifacts") &&
    hasNonEmptyString(mechanicalRepair, "observed_current_state_or_report_hash") &&
    hasNonEmptyString(mechanicalRepair, "expected_current_state_check") &&
    hasNonEmptyString(mechanicalRepair, "exact_intended_repair") &&
    hasNonEmptyString(
      mechanicalRepair,
      "immutable_transition_or_lifecycle_evidence"
    ) &&
    hasNonEmptyString(mechanicalRepair, "post_repair_validation")
  );
}

function repairOverreachRefusalProblems(
  evidence: OperatorBoundaryEvidence,
  policy: OperatorBoundaryPolicy
) {
  const problems: string[] = [];

  for (const refusal of policy.repairOverreachRefusals) {
    if (!evidence.repairOverreachRefusals.includes(refusal)) {
      problems.push(
        `operator-boundary evidence for ${evidence.workItem} must refuse repair overreach ${refusal}`
      );
    }
  }

  return problems;
}

function smellDispositionProblems(
  evidence: OperatorBoundaryEvidence,
  policy: OperatorBoundaryPolicy
) {
  const problems: string[] = [];

  for (const disposition of evidence.smellDispositions) {
    const smellId = readRequiredString(
      disposition,
      "smell_id",
      `operator-boundary smell disposition for ${evidence.workItem}`
    );
    if (!policy.smellTriggerAlignment.includes(smellId)) {
      problems.push(`operator-boundary evidence references unsupported smell ${smellId}`);
    }
    readRequiredString(
      disposition,
      "escalation_target",
      `operator-boundary smell disposition for ${evidence.workItem}`
    );
    if (!hasNonEmptyStringList(disposition, "required_evidence")) {
      problems.push(
        `operator-boundary smell disposition ${smellId} requires evidence fields`
      );
    }
  }

  return problems;
}

function formatDriftRoute(evidence: OperatorBoundaryEvidence) {
  return `${evidence.workItem}:${readRequiredString(
    evidence.mechanicalRepair,
    "route",
    `operator-boundary mechanical repair for ${evidence.workItem}`
  )}`;
}

function parseJsonObject(content: string, label: string): RawRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Malformed ${label}: invalid JSON`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`Malformed ${label}: expected object`);
  }

  return parsed;
}

async function readRequiredFile(
  filePath: string,
  displayPath: string,
  kind: "policy" | "template" | "operator-boundary evidence"
) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      if (kind === "operator-boundary evidence") {
        throw new Error(`Missing required operator-boundary evidence: ${displayPath}`);
      }
      throw new Error(`Missing required ${kind}: ${displayPath}`);
    }
    throw error;
  }
}

function readRequiredRecord(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (!isRecord(value)) {
    throw new Error(`Malformed ${label}: missing ${field}`);
  }
  return value;
}

function readRequiredRecordList(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (!Array.isArray(value) || value.some((entry) => !isRecord(entry))) {
    throw new Error(`Malformed ${label}: missing ${field}`);
  }
  return value as RawRecord[];
}

function readRequiredString(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Malformed ${label}: missing ${field}`);
  }
  return value.trim();
}

function readRequiredStringList(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string" || entry.trim().length === 0)
  ) {
    throw new Error(`Malformed ${label}: missing ${field}`);
  }
  return value.map((entry) => entry.trim());
}

function readOptionalStringList(record: RawRecord, field: string) {
  const value = record[field];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
}

function readRequiredBoolean(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${label}: missing ${field}`);
  }
  return value;
}

function hasNonEmptyString(record: RawRecord, field: string) {
  const value = record[field];
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyStringList(record: RawRecord, field: string) {
  const value = record[field];
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === "string" && entry.trim().length > 0)
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
