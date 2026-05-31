import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const EVIDENCE_FRESHNESS_POLICY_PATH = ".bandit/policy/evidence-freshness-slos.json";
const TEMPLATE_PATH = "docs/templates/evidence-freshness-slos.md";

const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "policy",
  "artifact_types",
  "trust_signal_requirements",
  "derived_projection_rules",
  "source_artifacts"
];

const REQUIRED_ARTIFACT_TYPES = [
  "tests",
  "coderabbit_review",
  "local_qwen_review",
  "landing_verdict",
  "derived_projection"
];

const REQUIRED_TRUST_SIGNAL_REQUIREMENTS = [
  "source_artifact",
  "owner_or_authority_role",
  "freshness_state",
  "staleness_reason"
];

type RawRecord = Record<string, unknown>;

export type EvidenceTrustSignal = {
  artifact_type: string;
  source: string;
  owner_or_authority_role: string;
  freshness_state: EvidenceFreshnessState;
  staleness_reason: string;
  evidence_slo: string;
};

export type EvidenceFreshnessState = "current" | "stale" | "missing";

export type EvidenceFreshnessValidationReport = {
  status: "pass";
  policy: string;
  artifact_types: string[];
  trust_signal_requirements: string[];
  derived_projections: string[];
};

export async function validateEvidenceFreshnessSlos(
  repoRoot: string
): Promise<EvidenceFreshnessValidationReport> {
  await validateTemplate(repoRoot);
  const content = await readRequiredPolicy(repoRoot);
  return parseAndValidatePolicy(content);
}

export async function validateEvidenceFreshnessSlosPolicy(repoRoot: string): Promise<void> {
  const content = await readOptionalPolicy(repoRoot);
  if (content === null) return;

  await validateTemplate(repoRoot);
  parseAndValidatePolicy(content);
}

export async function evidenceFreshnessPolicyExists(repoRoot: string): Promise<boolean> {
  return pathExists(repoRoot, EVIDENCE_FRESHNESS_POLICY_PATH);
}

export function buildGateTrustSignal(
  artifactType: string,
  source: string,
  ownerOrAuthorityRole: string,
  fileExistsOrFreshnessState: boolean | EvidenceFreshnessState,
  stalenessReason?: string
): Omit<EvidenceTrustSignal, "evidence_slo"> {
  // Projection builders add the fixed policy provenance through withEvidenceSlo.
  const freshnessState = resolveFreshnessState(fileExistsOrFreshnessState);

  return {
    artifact_type: artifactType,
    source,
    owner_or_authority_role: ownerOrAuthorityRole,
    freshness_state: freshnessState,
    staleness_reason: stalenessReason ?? defaultStalenessReason(freshnessState)
  };
}

export function withEvidenceSlo(
  signal: Omit<EvidenceTrustSignal, "evidence_slo">
): EvidenceTrustSignal {
  return {
    ...signal,
    evidence_slo: EVIDENCE_FRESHNESS_POLICY_PATH
  };
}

export function readScalarStatus(content: string, key: string): string | null {
  const escapedKey = escapeRegExp(key);
  const match = content.match(new RegExp(`^${escapedKey}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? null;
}

export async function pathExists(repoRoot: string, displayPath: string): Promise<boolean> {
  try {
    await stat(path.join(repoRoot, displayPath));
    return true;
  } catch (error) {
    if (isMissingPathError(error)) return false;
    throw error;
  }
}

function resolveFreshnessState(
  fileExistsOrFreshnessState: boolean | EvidenceFreshnessState
): EvidenceFreshnessState {
  if (typeof fileExistsOrFreshnessState !== "boolean") {
    return fileExistsOrFreshnessState;
  }
  return fileExistsOrFreshnessState ? "current" : "missing";
}

function defaultStalenessReason(freshnessState: EvidenceFreshnessState): string {
  if (freshnessState === "current") return "none";
  if (freshnessState === "missing") return "missing_required_stage_evidence";
  return "stale_dependency";
}

async function validateTemplate(repoRoot: string) {
  const templatePath = path.join(repoRoot, TEMPLATE_PATH);
  let content: string;
  try {
    content = await readFile(templatePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${TEMPLATE_PATH}`);
    }
    throw error;
  }

  const missingFields = REQUIRED_TEMPLATE_FIELDS.filter(
    (field) => !new RegExp(`^\\s*(?:-\\s*)?${escapeRegExp(field)}:`, "im").test(content)
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Malformed template: ${TEMPLATE_PATH}; missing required fields: ${missingFields.join(", ")}`
    );
  }
}

async function readRequiredPolicy(repoRoot: string): Promise<string> {
  const content = await readPolicyFile(repoRoot);
  if (content === null) {
    throw new Error(`Missing required policy: ${EVIDENCE_FRESHNESS_POLICY_PATH}`);
  }
  return content;
}

async function readOptionalPolicy(repoRoot: string): Promise<string | null> {
  return readPolicyFile(repoRoot);
}

async function readPolicyFile(repoRoot: string): Promise<string | null> {
  const policyPath = path.join(repoRoot, EVIDENCE_FRESHNESS_POLICY_PATH);
  try {
    return await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return null;
    throw error;
  }
}

function parseAndValidatePolicy(content: string): EvidenceFreshnessValidationReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed evidence freshness SLO policy: invalid JSON");
  }

  if (!isRecord(parsed)) {
    throw new Error("Malformed evidence freshness SLO policy: expected object");
  }

  if (!Object.hasOwn(parsed, "contract_version")) {
    throw new Error("Malformed evidence freshness SLO policy: missing contract_version 1");
  }

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed evidence freshness SLO policy: contract_version must be 1");
  }

  if (parsed.policy_id !== "evidence-freshness-slos") {
    throw new Error(
      "Malformed evidence freshness SLO policy: policy_id must be evidence-freshness-slos"
    );
  }

  const artifactTypeIds = validateArtifactTypes(parsed);
  const trustSignalRequirements = collectTrustSignalRequirements(parsed);
  const derivedProjections = validateDerivedProjectionRules(parsed);

  return {
    status: "pass",
    policy: EVIDENCE_FRESHNESS_POLICY_PATH,
    artifact_types: artifactTypeIds,
    trust_signal_requirements: trustSignalRequirements,
    derived_projections: derivedProjections
  };
}

function validateArtifactTypes(policy: RawRecord): string[] {
  if (!Array.isArray(policy.artifact_types) || policy.artifact_types.length === 0) {
    throw new Error(
      "Malformed evidence freshness SLO policy: artifact_types must define required trusted evidence types"
    );
  }

  const ids: string[] = [];

  for (const item of policy.artifact_types as unknown[]) {
    if (!isRecord(item)) {
      throw new Error("Malformed evidence freshness SLO policy: artifact_types entries must be objects");
    }

    const id = requireNonEmptyString(
      item.id,
      "evidence freshness SLO artifact types require a non-empty string id"
    );

    const hasSourceArtifacts =
      Array.isArray(item.source_artifacts) &&
      (item.source_artifacts as unknown[]).length > 0;
    const hasOwner =
      (typeof item.owner === "string" && item.owner.trim().length > 0) ||
      (typeof item.authority_role === "string" && item.authority_role.trim().length > 0);

    if (!hasSourceArtifacts || !hasOwner) {
      throw new Error(
        `evidence freshness SLO ${id} requires source artifact and owner or authority role`
      );
    }

    if (Array.isArray(item.allowed_freshness_states)) {
      const states = item.allowed_freshness_states as unknown[];
      if (
        !states.includes("current") ||
        !states.includes("stale") ||
        !states.includes("missing")
      ) {
        throw new Error(
          "freshness states must include current, stale, and missing for trusted evidence signals"
        );
      }
    }

    if (Array.isArray(item.staleness_reasons)) {
      if ((item.staleness_reasons as unknown[]).length === 0) {
        throw new Error(
          "trusted evidence signals require explicit staleness reason behavior"
        );
      }
    }

    ids.push(id);
  }

  const missingTypes = REQUIRED_ARTIFACT_TYPES.filter((id) => !ids.includes(id));
  if (missingTypes.length > 0) {
    throw new Error(
      `Malformed evidence freshness SLO policy: missing required artifact_types: ${missingTypes.join(", ")}`
    );
  }

  return ids;
}

function collectTrustSignalRequirements(policy: RawRecord): string[] {
  if (
    !Array.isArray(policy.trust_signal_requirements) ||
    policy.trust_signal_requirements.length === 0
  ) {
    throw new Error(
      "Malformed evidence freshness SLO policy: trust_signal_requirements must define required trust signal fields"
    );
  }

  const requirements = (policy.trust_signal_requirements as unknown[]).map(
    (item) =>
      requireNonEmptyString(
        item,
        "Malformed evidence freshness SLO policy: trust_signal_requirements entries must be non-empty strings"
      )
  );

  const missingRequirements = REQUIRED_TRUST_SIGNAL_REQUIREMENTS.filter(
    (requirement) => !requirements.includes(requirement)
  );
  if (missingRequirements.length > 0) {
    throw new Error(
      `Malformed evidence freshness SLO policy: missing required trust_signal_requirements: ${missingRequirements.join(", ")}`
    );
  }

  return requirements;
}

function validateDerivedProjectionRules(policy: RawRecord): string[] {
  if (
    !Array.isArray(policy.derived_projection_rules) ||
    policy.derived_projection_rules.length === 0
  ) {
    throw new Error(
      "Malformed evidence freshness SLO policy: derived_projection_rules must define fail-closed projection rules"
    );
  }

  const projections: string[] = [];

  for (const item of policy.derived_projection_rules as unknown[]) {
    if (!isRecord(item)) {
      throw new Error(
        "Malformed evidence freshness SLO policy: derived_projection_rules entries must be objects"
      );
    }

    const projection = requireNonEmptyString(
      item.projection,
      "derived projection rules require a non-empty projection id"
    );
    requireNonEmptyStringList(
      item.source_artifacts,
      "derived projection rules require source artifacts"
    );
    requireNonEmptyStringList(
      item.dependent_evidence,
      "derived projection rules require dependent evidence"
    );

    if (
      item.propagate_missing_or_stale_dependencies !== true ||
      item.cannot_upgrade_missing_dependency_to_trusted !== true
    ) {
      throw new Error(
        "derived projections must propagate missing or stale source dependencies and cannot upgrade them to trusted status"
      );
    }

    projections.push(projection);
  }

  return projections;
}

function requireNonEmptyString(value: unknown, message: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(message);
  }
  return value.trim();
}

function requireNonEmptyStringList(value: unknown, message: string): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error(message);
  }
  return value.map((item) => item.trim());
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
