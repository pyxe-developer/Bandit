import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type RiskClassificationValidationReport = {
  status: "pass";
  policy: typeof RISK_CLASSIFICATION_POLICY_DISPLAY_PATH;
  classifications: string[];
  selected_review_depths: string[];
  operator_supervision: string[];
  auto_landing_eligibility: string[];
};

type RawRecord = Record<string, unknown>;

type RiskPolicy = {
  requiredSignalGroups: string[];
  allowedReviewDepths: string[];
  neverAutoLandableSurfaces: string[];
  releaseAuthorizedDecisions: RiskDecision[];
};

type RiskDecision = {
  workItem: string;
  decisionKind: string;
  evidencePath: string;
};

type RiskClassification = {
  workItem: string;
  changedSurfaces: RawRecord[];
  hardExclusions: RawRecord[];
  blastRadiusSignals: RawRecord[];
  staticAnalysisSignals: RawRecord[];
  sourceTrustState: RawRecord | null;
  inputQuarantineState: RawRecord | null;
  supplyChainState: RawRecord | null;
  smellTriggerInputs: RawRecord[];
  selectedReviewDepth: string;
  operatorSupervision: RawRecord;
  autoLanding: RawRecord;
};

const RISK_CLASSIFICATION_POLICY_DISPLAY_PATH =
  ".bandit/policy/risk-classification.json";
const RISK_CLASSIFICATION_TEMPLATE_DISPLAY_PATH =
  "docs/templates/layered-risk-classification.md";
const REQUIRED_SIGNAL_GROUPS = [
  "changed_surfaces",
  "hard_exclusions",
  "blast_radius_signals",
  "static_analysis_signals",
  "source_trust_state",
  "input_quarantine_state",
  "supply_chain_state",
  "smell_trigger_inputs"
];
const DEFAULT_REVIEW_DEPTHS = [
  "baseline_qwen",
  "pre_pr_coderabbit_plus_qwen",
  "escalated_adversarial"
];
const NEVER_AUTO_LANDABLE_SURFACES = [
  "authentication",
  "sessions",
  "authorization",
  "payment",
  "billing",
  "refunds",
  "production_data",
  "schema_migrations",
  "secrets",
  "credentials",
  "ci_or_release_workflow",
  "dependency_or_fetched_prompt_execution",
  "privacy",
  "telemetry",
  "export",
  "destructive_operations",
  "external_side_effecting_automation"
];
const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "changed_surfaces",
  "hard_exclusions",
  "never_auto_landable_surfaces",
  "blast_radius_signals",
  "static_analysis_signals",
  "source_trust_state",
  "input_quarantine_state",
  "supply_chain_state",
  "smell_trigger_inputs",
  "selected_review_depth",
  "operator_supervision",
  "auto_landing",
  "rationale",
  "evidence_paths"
];
const RISK_STATES = new Set(["unknown", "unavailable", "stale", "missing"]);

export async function writeDefaultRiskClassificationPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "layered-risk-classification",
    required_signal_groups: REQUIRED_SIGNAL_GROUPS,
    allowed_review_depths: DEFAULT_REVIEW_DEPTHS,
    never_auto_landable_surfaces: NEVER_AUTO_LANDABLE_SURFACES,
    release_authorized_decisions: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultRiskClassificationTemplate(
  repoRoot: string
) {
  const filePath = path.join(repoRoot, RISK_CLASSIFICATION_TEMPLATE_DISPLAY_PATH);
  const template = `# Layered Risk Classification Template

work_item:
changed_surfaces:
hard_exclusions:
never_auto_landable_surfaces:
blast_radius_signals:
static_analysis_signals:
source_trust_state:
input_quarantine_state:
supply_chain_state:
smell_trigger_inputs:
selected_review_depth:
operator_supervision:
auto_landing:
rationale:
evidence_paths:
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

export async function validateRiskClassificationGate(
  repoRoot: string
): Promise<RiskClassificationValidationReport> {
  const policy = await readRiskClassificationPolicy(repoRoot);
  await validateRiskClassificationTemplate(repoRoot);
  const classifications = await validateRiskDecisions(repoRoot, policy);

  return {
    status: "pass",
    policy: RISK_CLASSIFICATION_POLICY_DISPLAY_PATH,
    classifications: classifications.map((classification) => classification.workItem),
    selected_review_depths: classifications.map(
      (classification) => classification.selectedReviewDepth
    ),
    operator_supervision: classifications.map((classification) =>
      formatOperatorSupervision(classification)
    ),
    auto_landing_eligibility: classifications.map((classification) =>
      formatAutoLandingEligibility(classification)
    )
  };
}

export async function autoLandingRiskClassificationProblems(
  repoRoot: string,
  workItemId: string
) {
  const policy = await readRiskClassificationPolicy(repoRoot);
  await validateRiskClassificationTemplate(repoRoot);
  const decision = policy.releaseAuthorizedDecisions.find(
    (candidate) =>
      candidate.workItem === workItemId &&
      candidate.decisionKind === "auto_landing"
  );

  if (!decision) {
    return [`missing layered risk-classification evidence for ${workItemId}`];
  }

  const classification = await readClassificationEvidence(
    repoRoot,
    decision.evidencePath,
    workItemId
  );
  const problems = validateRiskClassification(classification, policy);

  if (problems.length > 0) {
    return problems;
  }

  if (!readRequiredBoolean(classification.autoLanding, "eligible", "auto_landing")) {
    return [
      `layered risk-classification blocks auto-landing for ${workItemId}: ${readRequiredString(
        classification.autoLanding,
        "refusal_rationale",
        "auto_landing"
      )}`
    ];
  }

  return [];
}

async function validateRiskDecisions(repoRoot: string, policy: RiskPolicy) {
  const classifications: RiskClassification[] = [];
  const problems: string[] = [];

  for (const decision of policy.releaseAuthorizedDecisions) {
    const classification = await readClassificationEvidence(
      repoRoot,
      decision.evidencePath,
      decision.workItem
    );
    problems.push(...validateRiskClassification(classification, policy));
    classifications.push(classification);
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return classifications;
}

async function readRiskClassificationPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredFile(
    paths.riskClassificationPolicy,
    RISK_CLASSIFICATION_POLICY_DISPLAY_PATH,
    "policy"
  );

  return parseRiskClassificationPolicy(content);
}

async function validateRiskClassificationTemplate(repoRoot: string) {
  const templatePath = path.join(
    repoRoot,
    RISK_CLASSIFICATION_TEMPLATE_DISPLAY_PATH
  );
  const content = await readRequiredFile(
    templatePath,
    RISK_CLASSIFICATION_TEMPLATE_DISPLAY_PATH,
    "template"
  );

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${RISK_CLASSIFICATION_TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

function parseRiskClassificationPolicy(content: string): RiskPolicy {
  const parsed = parseJsonObject(content, "risk classification policy");

  if (parsed.contract_version !== 1) {
    throw new Error(
      "Malformed risk classification policy: missing contract_version 1"
    );
  }

  if (parsed.policy_id !== "layered-risk-classification") {
    throw new Error(
      "Malformed risk classification policy: policy_id must be layered-risk-classification"
    );
  }

  const requiredSignalGroups = readRequiredStringList(
    parsed,
    "required_signal_groups",
    "risk classification policy"
  );
  for (const signalGroup of REQUIRED_SIGNAL_GROUPS) {
    if (!requiredSignalGroups.includes(signalGroup)) {
      throw new Error(
        `Malformed risk classification policy: required_signal_groups must include ${signalGroup}`
      );
    }
  }

  const allowedReviewDepths = readRequiredStringList(
    parsed,
    "allowed_review_depths",
    "risk classification policy"
  );
  const neverAutoLandableSurfaces = readRequiredStringList(
    parsed,
    "never_auto_landable_surfaces",
    "risk classification policy"
  );
  for (const surface of NEVER_AUTO_LANDABLE_SURFACES) {
    if (!neverAutoLandableSurfaces.includes(surface)) {
      throw new Error(
        `Malformed risk classification policy: never_auto_landable_surfaces must include ${surface}`
      );
    }
  }

  return {
    requiredSignalGroups,
    allowedReviewDepths,
    neverAutoLandableSurfaces,
    releaseAuthorizedDecisions: readRiskDecisions(parsed)
  };
}

function readRiskDecisions(policy: RawRecord): RiskDecision[] {
  return readRequiredRecordList(
    policy,
    "release_authorized_decisions",
    "risk classification policy"
  ).map((decision) => ({
    workItem: readRequiredString(
      decision,
      "work_item",
      "risk classification decision"
    ),
    decisionKind: readRequiredString(
      decision,
      "decision_kind",
      "risk classification decision"
    ),
    evidencePath: readRequiredString(
      decision,
      "evidence_path",
      "risk classification decision"
    )
  }));
}

async function readClassificationEvidence(
  repoRoot: string,
  evidencePath: string,
  expectedWorkItem: string
): Promise<RiskClassification> {
  const content = await readRequiredFile(
    path.join(repoRoot, evidencePath),
    evidencePath,
    "layered risk-classification evidence"
  );
  const parsed = parseJsonObject(content, "risk classification evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed risk classification for ${expectedWorkItem}: missing contract_version 1`
    );
  }

  const workItem = readRequiredString(
    parsed,
    "work_item",
    "risk classification evidence"
  );
  if (workItem !== expectedWorkItem) {
    throw new Error(
      `Malformed risk classification for ${expectedWorkItem}: work_item does not match`
    );
  }

  return {
    workItem,
    changedSurfaces: readRequiredRecordList(
      parsed,
      "changed_surfaces",
      `risk classification for ${workItem}`
    ),
    hardExclusions: readRequiredRecordList(
      parsed,
      "hard_exclusions",
      `risk classification for ${workItem}`
    ),
    blastRadiusSignals: readRequiredRecordList(
      parsed,
      "blast_radius_signals",
      `risk classification for ${workItem}`
    ),
    staticAnalysisSignals: readRequiredRecordList(
      parsed,
      "static_analysis_signals",
      `risk classification for ${workItem}`
    ),
    sourceTrustState: readOptionalRecord(parsed, "source_trust_state"),
    inputQuarantineState: readOptionalRecord(parsed, "input_quarantine_state"),
    supplyChainState: readOptionalRecord(parsed, "supply_chain_state"),
    smellTriggerInputs: readRequiredRecordList(
      parsed,
      "smell_trigger_inputs",
      `risk classification for ${workItem}`
    ),
    selectedReviewDepth: readRequiredString(
      parsed,
      "selected_review_depth",
      `risk classification for ${workItem}`
    ),
    operatorSupervision: readRequiredRecord(
      parsed,
      "operator_supervision",
      `risk classification for ${workItem}`
    ),
    autoLanding: readRequiredRecord(
      parsed,
      "auto_landing",
      `risk classification for ${workItem}`
    )
  };
}

function validateRiskClassification(
  classification: RiskClassification,
  policy: RiskPolicy
) {
  const problems: string[] = [];

  if (!policy.allowedReviewDepths.includes(classification.selectedReviewDepth)) {
    problems.push(
      `unsupported selected_review_depth: ${classification.selectedReviewDepth}`
    );
  }

  if (!classification.supplyChainState) {
    problems.push(
      `risk classification for ${classification.workItem} requires supply_chain_state disposition`
    );
  }

  if (usesSmellTriggersAsSoleAuthority(classification)) {
    problems.push(
      `risk classification for ${classification.workItem} cannot use smell triggers as sole authority`
    );
  }

  if (
    isRiskState(classification.sourceTrustState) ||
    isRiskState(classification.inputQuarantineState)
  ) {
    problems.push(
      "unknown or unavailable source-trust and input-quarantine states are explicit risk states"
    );
  }

  if (isRiskState(classification.supplyChainState)) {
    problems.push(
      `risk classification for ${classification.workItem} has unresolved supply-chain state`
    );
  }

  problems.push(...neverAutoLandableProblems(classification, policy));
  problems.push(...highRiskSignalProblems(classification));

  return problems;
}

function usesSmellTriggersAsSoleAuthority(classification: RiskClassification) {
  return (
    classification.smellTriggerInputs.length > 0 &&
    classification.blastRadiusSignals.length === 0 &&
    classification.staticAnalysisSignals.length === 0 &&
    isRiskState(classification.sourceTrustState) &&
    isRiskState(classification.inputQuarantineState) &&
    isRiskState(classification.supplyChainState)
  );
}

function neverAutoLandableProblems(
  classification: RiskClassification,
  policy: RiskPolicy
) {
  const problems: string[] = [];
  const autoLandingEligible = readRequiredBoolean(
    classification.autoLanding,
    "eligible",
    "auto_landing"
  );

  for (const surface of classification.changedSurfaces) {
    const surfaceName = readRequiredString(
      surface,
      "surface",
      `risk classification for ${classification.workItem} changed_surfaces`
    );
    const explicitlyNeverAutoLandable = readRequiredBoolean(
      surface,
      "never_auto_landable",
      `risk classification for ${classification.workItem} changed_surfaces`
    );
    if (
      autoLandingEligible &&
      (explicitlyNeverAutoLandable ||
        policy.neverAutoLandableSurfaces.includes(surfaceName))
    ) {
      problems.push(
        `never-auto-landable surface ${surfaceName} cannot be marked auto-landable`
      );
    }
  }

  return problems;
}

function highRiskSignalProblems(classification: RiskClassification) {
  const problems: string[] = [];

  for (const signal of classification.blastRadiusSignals) {
    if (readOptionalString(signal, "risk") === "high") {
      const signalId = readRequiredString(
        signal,
        "signal_id",
        `risk classification for ${classification.workItem} blast_radius_signals`
      );
      if (!hasRaisedRiskHandling(classification)) {
        problems.push(
          `high-risk blast-radius signal ${signalId} must raise review depth, require operator supervision, or block auto-landing`
        );
      }
    }
  }

  for (const signal of classification.staticAnalysisSignals) {
    if (readOptionalString(signal, "risk") === "high") {
      const signalId =
        readOptionalString(signal, "signal_id") ??
        readRequiredString(
          signal,
          "tool",
          `risk classification for ${classification.workItem} static_analysis_signals`
        );
      if (!hasRaisedRiskHandling(classification)) {
        problems.push(
          `high-risk static-analysis signal ${signalId} must raise review depth, require operator supervision, or block auto-landing`
        );
      }
    }
  }

  return problems;
}

function hasRaisedRiskHandling(classification: RiskClassification) {
  return (
    classification.selectedReviewDepth !== "baseline_qwen" ||
    readRequiredBoolean(
      classification.operatorSupervision,
      "required",
      "operator_supervision"
    ) ||
    !readRequiredBoolean(classification.autoLanding, "eligible", "auto_landing")
  );
}

function isRiskState(stateRecord: RawRecord | null) {
  if (!stateRecord) {
    return true;
  }

  const state = readOptionalString(stateRecord, "state");
  return !state || RISK_STATES.has(state);
}

function formatOperatorSupervision(classification: RiskClassification) {
  const status = readRequiredBoolean(
    classification.operatorSupervision,
    "required",
    "operator_supervision"
  )
    ? "required"
    : "not_required";

  return `${classification.workItem}:${status}`;
}

function formatAutoLandingEligibility(classification: RiskClassification) {
  const status = readRequiredBoolean(
    classification.autoLanding,
    "eligible",
    "auto_landing"
  )
    ? "eligible"
    : "blocked";

  return `${classification.workItem}:${status}`;
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
  kind: string
) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      const prefix =
        kind === "policy"
          ? "Missing required policy"
          : kind === "template"
            ? "Missing required template"
            : "Missing required layered risk-classification evidence";
      throw new Error(`${prefix}: ${displayPath}`);
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
    throw new Error(`Malformed ${label}: ${field} must be object`);
  }

  return value;
}

function readOptionalRecord(record: RawRecord, field: string) {
  const value = record[field];
  if (value === undefined) {
    return null;
  }
  if (!isRecord(value)) {
    throw new Error(`Malformed risk classification evidence: ${field} must be object`);
  }

  return value;
}

function readRequiredRecordList(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(`Malformed ${label}: ${field} must be an object list`);
  }

  return value;
}

function readRequiredStringList(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string" || entry.trim() === "")
  ) {
    throw new Error(`Malformed ${label}: ${field} must be a string list`);
  }

  return value;
}

function readRequiredString(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Malformed ${label}: ${field} must be string`);
  }

  return value;
}

function readOptionalString(record: RawRecord, field: string) {
  const value = record[field];
  return typeof value === "string" ? value : null;
}

function readRequiredBoolean(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${label}: ${field} must be boolean`);
  }

  return value;
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
