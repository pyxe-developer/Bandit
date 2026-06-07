import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseMetadataFields, readScalar, readList } from "./metadata.js";
import { getBanditPaths } from "./paths.js";
import { readWorkItem, readWorkItems, type WorkItem } from "./work-items.js";

export const ORACLE_PROVENANCE_POLICY_DISPLAY_PATH =
  ".bandit/policy/verification-oracle-provenance.json";

const ORACLE_PROVENANCE_TEMPLATE_DISPLAY_PATH =
  "docs/templates/verification-oracle-provenance.md";

const SELF_REPORTED_ORACLE_TYPE = "self_reported_or_derived";

const TEMPLATE_REQUIRED_FIELDS = [
  "work_item",
  "target_surface",
  "claim",
  "oracle_type",
  "oracle_source",
  "owner_or_authority_role",
  "independence_class",
  "freshness_source",
  "command",
  "claim_mapping",
  "source_drift_status"
];

export type VerificationOracleProvenanceReport = {
  status: "pass";
  policy: typeof ORACLE_PROVENANCE_POLICY_DISPLAY_PATH;
  checked_work_items: string[];
  covered_claims: string[];
};

type OracleProvenancePolicy = {
  coveredSurfaces: string[];
  coveredClaims: string[];
  supportedOracleTypes: string[];
  independentOracleTypes: string[];
  requiredFields: string[];
  requireCommandForOracleTypes: string[];
  lowRiskSelfReportedClaims: string[];
};

type OracleProvenanceBriefContext = {
  workItemId: string;
  riskTier: string;
  strategy: string;
  disposition: string;
  coveredSurfaces: string[];
  coveredClaims: string[];
};

type RawRecord = Record<string, unknown>;

export async function validateVerificationOracleProvenance(
  repoRoot: string,
  workItemId?: string
): Promise<VerificationOracleProvenanceReport> {
  const policy = await readRequiredPolicy(repoRoot);
  const workItems = workItemId
    ? [await readWorkItem(repoRoot, workItemId)]
    : await readWorkItems(repoRoot);

  const problems: string[] = [];
  const checked: string[] = [];
  const coveredClaims: string[] = [];

  for (const workItem of workItems) {
    const context = parseBriefContext(workItem);
    if (!gateApplies(context)) {
      continue;
    }

    checked.push(context.workItemId);
    for (const claim of context.coveredClaims) {
      if (!coveredClaims.includes(claim)) {
        coveredClaims.push(claim);
      }
    }
    problems.push(...(await validateWorkItem(repoRoot, context, policy)));
  }

  if (checked.length > 0) {
    const templateProblem = await readTemplateProblem(repoRoot);
    if (templateProblem) {
      problems.push(templateProblem);
    }
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return {
    status: "pass",
    policy: ORACLE_PROVENANCE_POLICY_DISPLAY_PATH,
    checked_work_items: checked,
    covered_claims: coveredClaims
  };
}

export async function landingOracleProvenanceProblems(
  repoRoot: string,
  workItemId: string
): Promise<string[]> {
  const policy = await readOptionalPolicy(repoRoot);
  if (!policy) {
    return [];
  }

  const workItem = await readWorkItem(repoRoot, workItemId);
  const context = parseBriefContext(workItem);

  if (!gateApplies(context) || !context.coveredClaims.includes("safe-to-land")) {
    return [];
  }

  const evidence = await readOptionalEvidence(repoRoot, workItemId);
  const problems: string[] = [];

  for (const surface of context.coveredSurfaces) {
    if (!hasCurrentIndependentEvidence(evidence, "safe-to-land", surface, policy)) {
      problems.push(
        `safe-to-land requires current oracle provenance evidence for covered claim safe-to-land on ${surface}`
      );
    }
  }

  return problems;
}

async function validateWorkItem(
  repoRoot: string,
  context: OracleProvenanceBriefContext,
  policy: OracleProvenancePolicy
): Promise<string[]> {
  const problems: string[] = [];
  const coveredList = context.coveredSurfaces.join(", ");

  if (!context.strategy && !context.disposition) {
    problems.push(
      `${context.workItemId}: covered oracle surfaces (${coveredList}) are missing oracle provenance strategy or explicit disposition`
    );
    return problems;
  }

  if (!context.strategy && context.disposition) {
    return problems;
  }

  const evidence = await readOptionalEvidence(repoRoot, context.workItemId);
  if (!evidence) {
    return problems;
  }

  problems.push(...evidenceProblems(context.workItemId, evidence, policy));
  return problems;
}

function evidenceProblems(
  workItemId: string,
  content: string,
  policy: OracleProvenancePolicy
): string[] {
  const fields = parseMetadataFields(content);
  const problems: string[] = [];

  for (const field of policy.requiredFields) {
    if (!readScalar(fields, field)) {
      problems.push(
        `${workItemId} oracle provenance evidence missing ${field}`
      );
    }
  }

  const oracleType = readScalar(fields, "oracle_type");
  const independenceClass = readScalar(fields, "independence_class");
  const claim = readScalar(fields, "claim");
  const oracleSource = readScalar(fields, "oracle_source");

  if (oracleType && !policy.supportedOracleTypes.includes(oracleType)) {
    problems.push(
      `${workItemId} oracle provenance evidence has unsupported oracle_type ${oracleType}`
    );
  }

  if (
    policy.requireCommandForOracleTypes.includes(oracleType) &&
    !readScalar(fields, "command")
  ) {
    problems.push(
      `${workItemId} ${oracleType} oracle provenance evidence missing command`
    );
  }

  if (oracleSource === ownOracleArtifact(workItemId)) {
    problems.push(
      `${workItemId}: circular self-attestation - oracle_source points to its own generated oracle-provenance evidence`
    );
  }

  const isSelfReported =
    oracleType === SELF_REPORTED_ORACLE_TYPE ||
    independenceClass === SELF_REPORTED_ORACLE_TYPE;

  if (isSelfReported && requiresIndependence(claim, policy)) {
    problems.push(
      `${workItemId}: ${claim} requires independent oracle provenance; ${SELF_REPORTED_ORACLE_TYPE} evidence cannot self-attest this trust claim`
    );
  }

  return problems;
}

function hasCurrentIndependentEvidence(
  content: string | null,
  claim: string,
  surface: string,
  policy: OracleProvenancePolicy
): boolean {
  if (!content) {
    return false;
  }

  const fields = parseMetadataFields(content);

  if (readScalar(fields, "claim") !== claim) {
    return false;
  }

  if (readScalar(fields, "target_surface") !== surface) {
    return false;
  }

  if (readScalar(fields, "source_drift_status") !== "current") {
    return false;
  }

  for (const field of policy.requiredFields) {
    if (!readScalar(fields, field)) {
      return false;
    }
  }

  const oracleType = readScalar(fields, "oracle_type");
  const independenceClass = readScalar(fields, "independence_class");

  if (
    oracleType === SELF_REPORTED_ORACLE_TYPE ||
    independenceClass === SELF_REPORTED_ORACLE_TYPE
  ) {
    return false;
  }

  if (!policy.independentOracleTypes.includes(oracleType)) {
    return false;
  }

  if (
    policy.requireCommandForOracleTypes.includes(oracleType) &&
    !readScalar(fields, "command")
  ) {
    return false;
  }

  return true;
}

function requiresIndependence(claim: string, policy: OracleProvenancePolicy) {
  return (
    policy.coveredClaims.includes(claim) &&
    !policy.lowRiskSelfReportedClaims.includes(claim)
  );
}

function gateApplies(context: OracleProvenanceBriefContext): boolean {
  return context.riskTier === "high" && context.coveredSurfaces.length > 0;
}

function parseBriefContext(workItem: WorkItem): OracleProvenanceBriefContext {
  const fields = parseMetadataFields(workItem.content);

  return {
    workItemId: workItem.id,
    riskTier: readScalar(fields, "risk_tier"),
    strategy: readScalar(fields, "oracle_provenance_strategy"),
    disposition: readScalar(fields, "oracle_provenance_disposition"),
    coveredSurfaces: readList(fields, "covered_oracle_surfaces"),
    coveredClaims: readList(fields, "covered_oracle_claims")
  };
}

function ownOracleArtifact(workItemId: string) {
  return `docs/work/${workItemId}/oracle-provenance-evidence.md`;
}

async function readOptionalEvidence(
  repoRoot: string,
  workItemId: string
): Promise<string | null> {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, "oracle-provenance-evidence.md"),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readTemplateProblem(repoRoot: string): Promise<string | null> {
  let content: string;
  try {
    content = await readFile(
      path.join(repoRoot, ORACLE_PROVENANCE_TEMPLATE_DISPLAY_PATH),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      return `Missing required template: ${ORACLE_PROVENANCE_TEMPLATE_DISPLAY_PATH}`;
    }
    throw error;
  }

  const missing = TEMPLATE_REQUIRED_FIELDS.filter(
    (field) => !new RegExp(`^${field}:`, "m").test(content)
  );

  if (missing.length > 0) {
    return `Malformed template: ${ORACLE_PROVENANCE_TEMPLATE_DISPLAY_PATH}; missing required field: ${missing.join(", ")}`;
  }

  return null;
}

async function readRequiredPolicy(
  repoRoot: string
): Promise<OracleProvenancePolicy> {
  const policy = await readOptionalPolicy(repoRoot);
  if (!policy) {
    throw new Error(
      `Missing required policy: ${ORACLE_PROVENANCE_POLICY_DISPLAY_PATH}`
    );
  }

  return policy;
}

async function readOptionalPolicy(
  repoRoot: string
): Promise<OracleProvenancePolicy | null> {
  const paths = getBanditPaths(repoRoot);
  let content: string;
  try {
    content = await readFile(paths.verificationOracleProvenancePolicy, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }

  return parsePolicy(content);
}

function parsePolicy(content: string): OracleProvenancePolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      "Malformed verification-oracle-provenance policy: invalid JSON"
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      "Malformed verification-oracle-provenance policy: expected object"
    );
  }

  return {
    coveredSurfaces: readStringList(parsed.covered_surfaces),
    coveredClaims: readStringList(parsed.covered_claims),
    supportedOracleTypes: readStringList(parsed.supported_oracle_types),
    independentOracleTypes: readStringList(parsed.independent_oracle_types),
    requiredFields: readStringList(parsed.required_fields),
    requireCommandForOracleTypes: readStringList(
      parsed.require_command_for_oracle_types
    ),
    lowRiskSelfReportedClaims: readStringList(
      parsed.low_risk_self_reported_claims
    )
  };
}

export async function writeDefaultVerificationOracleProvenancePolicy(
  filePath: string
) {
  const policy = {
    version: 1,
    covered_surfaces: [
      "brief",
      "review-evidence",
      "landing-verdict",
      "cockpit-status",
      "session-context",
      "trust-verify"
    ],
    covered_claims: ["pass", "safe-to-land", "trusted", "current", "ready"],
    supported_oracle_types: [
      "independent_external_artifact",
      "independent_repo_artifact",
      "independent_command_output",
      "replay_packet",
      "reviewer_finding",
      "invariant_or_property",
      "trusted_source_artifact",
      "self_reported_or_derived"
    ],
    independent_oracle_types: [
      "independent_external_artifact",
      "independent_repo_artifact",
      "independent_command_output",
      "replay_packet",
      "reviewer_finding",
      "invariant_or_property",
      "trusted_source_artifact"
    ],
    required_fields: [
      "target_surface",
      "claim",
      "oracle_type",
      "oracle_source",
      "owner_or_authority_role",
      "independence_class",
      "freshness_source",
      "claim_mapping",
      "source_drift_status"
    ],
    require_command_for_oracle_types: [
      "independent_command_output",
      "replay_packet"
    ],
    low_risk_self_reported_claims: ["metadata-present"]
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultVerificationOracleProvenanceTemplate(
  repoRoot: string
) {
  const filePath = path.join(repoRoot, ORACLE_PROVENANCE_TEMPLATE_DISPLAY_PATH);
  const template = `# Verification Oracle Provenance

work_item:
target_surface:
claim:
oracle_type:
oracle_source:
owner_or_authority_role:
independence_class:
freshness_source:
command:
claim_mapping:
source_drift_status:
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

function readStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
