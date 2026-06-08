import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Spec-to-evidence traceability is derived gate evidence. It reads a policy
// artifact, a work-item brief, and a per-work-item traceability matrix, then
// reports whether every covered acceptance criterion maps to concrete behavior
// evidence, command evidence, another supported evidence type, or an explicit
// disposition with rationale. It never mutates acceptance criteria, landing
// authority, Trust Verifier authority, reviewer routing, or gap status.

export const SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH =
  ".bandit/policy/spec-to-evidence-traceability.json";

const SUPPORTED_EVIDENCE_TYPES = [
  "behavior_test",
  "command",
  "invariant",
  "uat",
  "reviewer",
  "replay",
  "implementation_detail"
];
const DISPOSITION_VALUES = ["none", "bootstrap_gap", "no_action"];
const REQUIRED_FIELDS = [
  "criterion_id",
  "criterion",
  "source_artifacts",
  "evidence_summary"
];
const COVERED_RISK_TIERS = ["bootstrap_chore", "low", "material"];
const BOOTSTRAP_CHORE_RISK_TIER = "bootstrap_chore";
const IMPLEMENTATION_DETAIL_EVIDENCE = "implementation_detail";
const NO_DISPOSITION = "none";
const MIN_SUMMARY_CHARACTERS = 20;
const MIN_SUMMARY_WORDS = 4;

export type TraceabilityCriterionReport = {
  id: string;
  criterion: string;
  evidence_type: string | null;
  disposition: string;
  source_artifacts: string[];
};

export type TraceabilityReport = {
  status: "pass";
  work_item: string;
  policy: typeof SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH;
  covered_risk_tier: string;
  acceptance_criteria: TraceabilityCriterionReport[];
  read_only: {
    no_landing_authority: boolean;
    no_trust_verifier_cutover: boolean;
    no_acceptance_criteria_mutation: boolean;
  };
  policy_versions: Record<string, number>;
};

export type TraceabilityEvaluation =
  | { ok: true; report: TraceabilityReport }
  | { ok: false; diagnostics: string[] };

type TraceabilityPolicy = {
  policyId: string;
  version: number;
  coveredRiskTiers: string[];
  requiredFields: string[];
  supportedEvidenceTypes: string[];
  dispositionValues: string[];
  authority: TraceabilityAuthority;
};

type TraceabilityAuthority = {
  readOnly: boolean;
  canMutateAcceptanceCriteria: boolean;
  canReplaceLandingAuthority: boolean;
  canApproveTrustVerifierCutover: boolean;
};

type AcceptanceCriterion = {
  id: string;
  text: string;
};

type RawRecord = Record<string, unknown>;

export async function evaluateSpecToEvidenceTraceability(
  repoRoot: string,
  workItemId: string
): Promise<TraceabilityEvaluation> {
  const policyResult = await loadPolicy(repoRoot);
  if (!policyResult.ok) {
    return { ok: false, diagnostics: policyResult.diagnostics };
  }
  const policy = policyResult.policy;

  const authorityDiagnostics = checkAuthorityBoundary(policy.authority);
  if (authorityDiagnostics.length > 0) {
    return { ok: false, diagnostics: authorityDiagnostics };
  }

  const briefResult = await loadBrief(repoRoot, workItemId, policy);
  if (!briefResult.ok) {
    return { ok: false, diagnostics: briefResult.diagnostics };
  }

  const matrixResult = await loadMatrixEntries(repoRoot, workItemId);
  if (!matrixResult.ok) {
    return { ok: false, diagnostics: matrixResult.diagnostics };
  }

  return mapCriteriaToEvidence(
    workItemId,
    policy,
    briefResult.riskTier,
    briefResult.criteria,
    matrixResult.entries
  );
}

function mapCriteriaToEvidence(
  workItemId: string,
  policy: TraceabilityPolicy,
  riskTier: string,
  criteria: AcceptanceCriterion[],
  entries: Map<string, RawRecord>
): TraceabilityEvaluation {
  const diagnostics: string[] = [];
  const reports: TraceabilityCriterionReport[] = [];

  for (const criterion of criteria) {
    const entry = entries.get(criterion.id);
    if (!entry) {
      diagnostics.push(`missing traceability mapping: ${criterion.id}`);
      continue;
    }

    const evaluated = evaluateEntry(policy, criterion, entry);
    diagnostics.push(...evaluated.diagnostics);
    if (evaluated.report) {
      reports.push(evaluated.report);
    }
  }

  if (diagnostics.length > 0) {
    return { ok: false, diagnostics };
  }

  return {
    ok: true,
    report: {
      status: "pass",
      work_item: workItemId,
      policy: SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH,
      covered_risk_tier: riskTier,
      acceptance_criteria: reports,
      read_only: {
        no_landing_authority: !policy.authority.canReplaceLandingAuthority,
        no_trust_verifier_cutover:
          !policy.authority.canApproveTrustVerifierCutover,
        no_acceptance_criteria_mutation:
          !policy.authority.canMutateAcceptanceCriteria
      },
      policy_versions: { [policy.policyId]: policy.version }
    }
  };
}

type EntryEvaluation = {
  diagnostics: string[];
  report: TraceabilityCriterionReport | null;
};

function evaluateEntry(
  policy: TraceabilityPolicy,
  criterion: AcceptanceCriterion,
  entry: RawRecord
): EntryEvaluation {
  const sourceArtifacts = readStringArray(entry.source_artifacts);
  const evidenceType = readString(entry.evidence_type);
  const disposition = readString(entry.disposition) ?? NO_DISPOSITION;

  if (!evidenceType && disposition !== NO_DISPOSITION) {
    return evaluateDisposition(policy, criterion, entry, sourceArtifacts);
  }

  return evaluateEvidence(
    policy,
    criterion,
    entry,
    evidenceType,
    disposition,
    sourceArtifacts
  );
}

function evaluateEvidence(
  policy: TraceabilityPolicy,
  criterion: AcceptanceCriterion,
  entry: RawRecord,
  evidenceType: string | null,
  disposition: string,
  sourceArtifacts: string[]
): EntryEvaluation {
  const diagnostics: string[] = [];

  if (sourceArtifacts.length === 0) {
    diagnostics.push(
      `missing source artifacts: ${criterion.id}`
    );
  }

  if (!evidenceType) {
    diagnostics.push(`missing traceability mapping: ${criterion.id}`);
    return { diagnostics, report: null };
  }

  if (!policy.supportedEvidenceTypes.includes(evidenceType)) {
    diagnostics.push(`unsupported evidence type: ${evidenceType}`);
    return { diagnostics, report: null };
  }

  const evidenceSummary = readString(entry.evidence_summary);
  if (isVague(evidenceSummary)) {
    diagnostics.push(`vague traceability evidence: ${criterion.id}`);
  }

  if (evidenceType === IMPLEMENTATION_DETAIL_EVIDENCE) {
    const rationale = readString(entry.rationale);
    if (isVague(rationale)) {
      diagnostics.push(
        `implementation-detail evidence cannot prove behavior without explicit rationale: ${criterion.id}`
      );
    }
  }

  if (diagnostics.length > 0) {
    return { diagnostics, report: null };
  }

  return {
    diagnostics,
    report: {
      id: criterion.id,
      criterion: criterion.text,
      evidence_type: evidenceType,
      disposition,
      source_artifacts: sourceArtifacts
    }
  };
}

function evaluateDisposition(
  policy: TraceabilityPolicy,
  criterion: AcceptanceCriterion,
  entry: RawRecord,
  sourceArtifacts: string[]
): EntryEvaluation {
  const diagnostics: string[] = [];
  const disposition = readString(entry.disposition) ?? NO_DISPOSITION;

  if (!policy.dispositionValues.includes(disposition)) {
    diagnostics.push(`unsupported disposition: ${disposition}`);
    return { diagnostics, report: null };
  }

  if (sourceArtifacts.length === 0) {
    diagnostics.push(`missing source artifacts: ${criterion.id}`);
  }

  const rationale = readString(entry.rationale);
  if (isVague(rationale)) {
    diagnostics.push(`disposition rationale is too vague: ${criterion.id}`);
  }

  if (diagnostics.length > 0) {
    return { diagnostics, report: null };
  }

  return {
    diagnostics,
    report: {
      id: criterion.id,
      criterion: criterion.text,
      evidence_type: null,
      disposition,
      source_artifacts: sourceArtifacts
    }
  };
}

function checkAuthorityBoundary(authority: TraceabilityAuthority): string[] {
  const diagnostics: string[] = [];
  if (!authority.readOnly) {
    diagnostics.push("traceability policy must declare read_only authority");
  }
  if (authority.canMutateAcceptanceCriteria) {
    diagnostics.push("traceability policy must not mutate acceptance criteria");
  }
  if (authority.canReplaceLandingAuthority) {
    diagnostics.push("traceability policy must not replace landing authority");
  }
  if (authority.canApproveTrustVerifierCutover) {
    diagnostics.push(
      "traceability policy must not approve Trust Verifier cutover"
    );
  }
  return diagnostics;
}

type PolicyLoad =
  | { ok: true; policy: TraceabilityPolicy }
  | { ok: false; diagnostics: string[] };

async function loadPolicy(repoRoot: string): Promise<PolicyLoad> {
  const policyPath = path.join(repoRoot, SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH);
  const raw = await readJsonFile(policyPath);
  if (!raw.ok) {
    return {
      ok: false,
      diagnostics: [
        raw.missing
          ? `missing traceability policy: ${SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH}`
          : `malformed traceability policy: ${SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH}`
      ]
    };
  }

  const record = raw.value;
  const version = readNumber(record.version);
  const policyId = readString(record.policy_id);
  const authority = isRecord(record.authority) ? record.authority : null;
  if (version === null || !policyId || !authority) {
    return {
      ok: false,
      diagnostics: [
        `malformed traceability policy: ${SPEC_TO_EVIDENCE_POLICY_DISPLAY_PATH}`
      ]
    };
  }

  return {
    ok: true,
    policy: {
      policyId,
      version,
      coveredRiskTiers: readStringArray(record.covered_risk_tiers),
      requiredFields: readStringArray(record.required_fields),
      supportedEvidenceTypes: readStringArray(record.supported_evidence_types),
      dispositionValues: readStringArray(record.disposition_values),
      authority: {
        readOnly: readBoolean(authority.read_only),
        canMutateAcceptanceCriteria: readBoolean(
          authority.can_mutate_acceptance_criteria
        ),
        canReplaceLandingAuthority: readBoolean(
          authority.can_replace_landing_authority
        ),
        canApproveTrustVerifierCutover: readBoolean(
          authority.can_approve_trust_verifier_cutover
        )
      }
    }
  };
}

type BriefLoad =
  | { ok: true; riskTier: string; criteria: AcceptanceCriterion[] }
  | { ok: false; diagnostics: string[] };

async function loadBrief(
  repoRoot: string,
  workItemId: string,
  policy: TraceabilityPolicy
): Promise<BriefLoad> {
  const displayPath = `docs/work/${workItemId}/brief.md`;
  let content: string;
  try {
    content = await readFile(path.join(repoRoot, displayPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return { ok: false, diagnostics: [`missing work-item brief: ${displayPath}`] };
    }
    throw error;
  }

  const riskTier = readRiskTier(content);
  if (!riskTier) {
    return {
      ok: false,
      diagnostics: [`missing risk_tier in brief: ${displayPath}`]
    };
  }
  if (!policy.coveredRiskTiers.includes(riskTier)) {
    return {
      ok: false,
      diagnostics: [`uncovered risk tier: ${riskTier}`]
    };
  }

  const criteria = readAcceptanceCriteria(content);
  if (criteria.length === 0) {
    return {
      ok: false,
      diagnostics: [`no acceptance criteria found in brief: ${displayPath}`]
    };
  }

  return { ok: true, riskTier, criteria };
}

type MatrixLoad =
  | { ok: true; entries: Map<string, RawRecord> }
  | { ok: false; diagnostics: string[] };

async function loadMatrixEntries(
  repoRoot: string,
  workItemId: string
): Promise<MatrixLoad> {
  const displayPath = `docs/work/${workItemId}/spec-to-evidence-traceability.json`;
  const raw = await readJsonFile(path.join(repoRoot, displayPath));
  if (!raw.ok) {
    return {
      ok: false,
      diagnostics: [
        raw.missing
          ? `missing traceability matrix: ${displayPath}`
          : `malformed traceability matrix: ${displayPath}`
      ]
    };
  }

  const traceability = raw.value.traceability;
  if (!Array.isArray(traceability)) {
    return {
      ok: false,
      diagnostics: [`malformed traceability matrix: ${displayPath}`]
    };
  }

  const entries = new Map<string, RawRecord>();
  for (const candidate of traceability) {
    if (!isRecord(candidate)) {
      continue;
    }
    const criterionId = readString(candidate.criterion_id);
    if (criterionId) {
      entries.set(criterionId, candidate);
    }
  }

  return { ok: true, entries };
}

function readRiskTier(content: string): string | null {
  const match = content.match(/^risk_tier:\s*(\S+)\s*$/im);
  if (match && match[1]) {
    return match[1];
  }
  // Existing Bandit chore briefs omit an explicit risk_tier. Infer the covered
  // bootstrap_chore tier from work_type so derived traceability stays read-only
  // without forcing edits to the work-item brief.
  const workType = content.match(/^work_type:\s*(\S+)\s*$/im);
  if (workType && workType[1]?.toLowerCase() === "chore") {
    return BOOTSTRAP_CHORE_RISK_TIER;
  }
  return null;
}

function readAcceptanceCriteria(content: string): AcceptanceCriterion[] {
  const criteria: AcceptanceCriterion[] = [];
  let inAcceptanceSection = false;
  let ordinal = 0;

  for (const line of content.split(/\r?\n/)) {
    if (/^##\s+/.test(line)) {
      inAcceptanceSection = /^##\s+Acceptance Criteria\s*$/i.test(line);
      continue;
    }
    if (!inAcceptanceSection) {
      continue;
    }

    const labeled = line.match(/^-\s+(AC\d+):\s*(.+?)\s*$/i);
    if (labeled && labeled[1] && labeled[2]) {
      ordinal += 1;
      criteria.push({ id: labeled[1].toUpperCase(), text: labeled[2] });
      continue;
    }

    // Existing Bandit chore briefs use plain prose acceptance bullets without
    // ACn labels. Synthesize deterministic AC1/AC2/... ids from bullet order so
    // the traceability matrix can map evidence without rewriting the brief.
    const bullet = line.match(/^-\s+(.+?)\s*$/);
    if (bullet && bullet[1]) {
      ordinal += 1;
      criteria.push({ id: `AC${ordinal}`, text: bullet[1] });
    }
  }

  return criteria;
}

function isVague(value: string | null): boolean {
  const text = (value ?? "").trim();
  if (text.length < MIN_SUMMARY_CHARACTERS) {
    return true;
  }
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < MIN_SUMMARY_WORDS) {
    return true;
  }
  if (/^(tests?|code|coverage|artifacts?|it)\b.*\b(exist|exists|present|high|passes?|pass)\b/i.test(text)) {
    return true;
  }
  return false;
}

type JsonLoad =
  | { ok: true; value: RawRecord }
  | { ok: false; missing: boolean };

async function readJsonFile(filePath: string): Promise<JsonLoad> {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return { ok: false, missing: true };
    }
    throw error;
  }

  try {
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed)) {
      return { ok: false, missing: false };
    }
    return { ok: true, value: parsed };
  } catch {
    return { ok: false, missing: false };
  }
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readBoolean(value: unknown): boolean {
  return value === true;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export function defaultSpecToEvidenceTraceabilityPolicy() {
  return {
    contract_version: 1,
    policy_id: "spec-to-evidence-traceability",
    version: 1,
    covered_risk_tiers: COVERED_RISK_TIERS,
    required_fields: REQUIRED_FIELDS,
    supported_evidence_types: SUPPORTED_EVIDENCE_TYPES,
    disposition_values: DISPOSITION_VALUES,
    authority: {
      read_only: true,
      can_mutate_acceptance_criteria: false,
      can_replace_landing_authority: false,
      can_approve_trust_verifier_cutover: false
    }
  };
}

export async function writeDefaultSpecToEvidenceTraceabilityPolicy(
  policyPath: string
): Promise<void> {
  await writeFile(
    policyPath,
    `${JSON.stringify(defaultSpecToEvidenceTraceabilityPolicy(), null, 2)}\n`,
    "utf8"
  );
}
