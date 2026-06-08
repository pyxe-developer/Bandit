import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { canonicalJson } from "./gate-determinism.js";

const POLICY_DISPLAY_PATH =
  ".bandit/policy/evidence-bundle-attestation.json" as const;
const POLICY_ID = "evidence-bundle-attestation";
const COMMAND_NAME = "evidence-bundle";
const DEFAULT_REQUIRED_FRESHNESS_STATES = ["current"] as const;
const MISSING_FRESHNESS_STATE = "missing";
const SUPPORTED_LANDING_VERDICTS = new Set(["safe-to-land"]);
const PRODUCT_FACING_WORK_TYPES = new Set([
  "slice",
  "feature",
  "product",
  "product-slice"
]);

// Bundle membership is declared once, in the order reported to callers, so the
// attestation, policy presence checks, and bundle hash all agree on the
// covered evidence types.
const BUNDLE_MEMBERSHIP = [
  "source_subject",
  "red_evidence",
  "test_evidence",
  "implementation_evidence",
  "review_evidence",
  "risk_classification",
  "supply_chain_gate",
  "uat",
  "landing_verdict",
  "landing_action",
  "policy_versions",
  "command_versions",
  "freshness_metadata"
] as const;

// File-backed bundle inputs are loaded from declared repo-local paths. Derived
// members (source subject, policy versions, command versions, freshness
// metadata) are computed from these inputs and the policy rather than read.
type FileArtifactSpec = {
  id: string;
  required: boolean;
  relativePath: (workItem: string) => string;
};

const FILE_ARTIFACTS: FileArtifactSpec[] = [
  {
    id: "red_evidence",
    required: true,
    relativePath: (w) => `docs/work/${w}/red-evidence.md`
  },
  {
    id: "test_evidence",
    required: true,
    relativePath: (w) => `docs/artifact-inputs/${w}-red-evidence.json`
  },
  {
    id: "implementation_evidence",
    required: true,
    relativePath: (w) => `docs/work/${w}/implementation-evidence.md`
  },
  {
    id: "review_evidence",
    required: true,
    relativePath: (w) => `docs/work/${w}/review-evidence.md`
  },
  {
    id: "risk_classification",
    required: true,
    relativePath: (w) =>
      `.bandit/policy/risk-classifications/${w}-risk-classification.json`
  },
  {
    id: "supply_chain_gate",
    required: true,
    relativePath: (w) =>
      `.bandit/policy/supply-chain-gates/${w}-supply-chain-gate.json`
  },
  {
    id: "uat",
    required: false,
    relativePath: (w) => `docs/work/${w}/uat.json`
  },
  {
    id: "landing_verdict",
    required: true,
    relativePath: (w) => `docs/work/${w}/landing-verdict.md`
  },
  {
    id: "landing_action",
    required: true,
    relativePath: (w) => `docs/work/${w}/landing-action.md`
  }
];

export type EvidenceBundleAttestationReport = {
  status: "pass";
  work_item: string;
  policy: typeof POLICY_DISPLAY_PATH;
  bundle_hash: string;
  bundle_membership: string[];
  evidence: Record<string, RawRecord>;
  read_only: {
    no_gate_authority_replacement: boolean;
    no_trust_verifier_cutover: boolean;
  };
  policy_versions: Record<string, number>;
  command_versions: Record<string, number>;
  freshness_metadata: RawRecord;
};

type ParsedPolicy = {
  policyVersion: number;
  commandVersion: number;
  authority: ParsedAuthority;
  requiredFreshnessStates: string[];
  declaredEvidenceTypeIds: Set<string>;
};

type ParsedAuthority = {
  readOnly: boolean;
  canReplaceLandingAuthority: boolean;
  canReplaceTrustVerifierCutover: boolean;
  canMutateReviewRouting: boolean;
  canMutateGapStatus: boolean;
};

type LoadedArtifact = {
  displayPath: string;
  required: boolean;
  record: RawRecord | null;
};

type BundleContext = {
  workItem: string;
  productFacing: boolean;
  artifacts: Map<string, LoadedArtifact>;
};

type RawRecord = Record<string, unknown>;

// Read-only attestation: it loads declared repo-local evidence, fails closed on
// any missing, stale, unsupported, or mismatched input, and otherwise reports a
// deterministic bundle hash. It never mutates live gate, routing, or gap state.
export async function attestEvidenceBundle(
  repoRoot: string,
  workItem: string
): Promise<EvidenceBundleAttestationReport> {
  const policy = await loadPolicy(repoRoot);
  const context = await loadBundleContext(repoRoot, workItem);

  const problems: string[] = [];
  checkPolicyAuthority(policy.authority, problems);
  checkPolicyMembership(policy.declaredEvidenceTypeIds, problems);
  checkRequiredArtifacts(context, policy.requiredFreshnessStates, problems);
  checkUatApplicability(context, policy.requiredFreshnessStates, problems);
  checkLandingConsistency(context, problems);

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return buildReport(context, policy);
}

function checkPolicyAuthority(
  authority: ParsedAuthority,
  problems: string[]
): void {
  const readOnlyAndScoped =
    authority.readOnly &&
    !authority.canReplaceLandingAuthority &&
    !authority.canReplaceTrustVerifierCutover &&
    !authority.canMutateReviewRouting &&
    !authority.canMutateGapStatus;

  if (!readOnlyAndScoped) {
    problems.push(
      "evidence bundle attestation must be read-only and cannot replace gate authority"
    );
  }
}

function checkPolicyMembership(
  declaredEvidenceTypeIds: Set<string>,
  problems: string[]
): void {
  for (const id of BUNDLE_MEMBERSHIP) {
    if (!declaredEvidenceTypeIds.has(id)) {
      problems.push(`missing required evidence type: ${id}`);
    }
  }
}

function checkRequiredArtifacts(
  context: BundleContext,
  requiredFreshnessStates: string[],
  problems: string[]
): void {
  for (const spec of FILE_ARTIFACTS) {
    if (!spec.required) {
      continue;
    }
    const artifact = context.artifacts.get(spec.id);
    if (!artifact) {
      continue;
    }
    checkArtifactFreshness(spec.id, artifact, requiredFreshnessStates, problems);
  }
}

function checkArtifactFreshness(
  id: string,
  artifact: LoadedArtifact,
  requiredFreshnessStates: string[],
  problems: string[]
): void {
  if (!artifact.record) {
    problems.push(`missing required bundle input: ${artifact.displayPath}`);
    return;
  }

  const freshness = asString(artifact.record.freshness_state);
  if (freshness.length === 0 || freshness === MISSING_FRESHNESS_STATE) {
    problems.push(`missing required bundle input: ${artifact.displayPath}`);
    return;
  }

  if (!requiredFreshnessStates.includes(freshness)) {
    const reason = asString(artifact.record.staleness_reason) || freshness;
    problems.push(`stale bundle input: ${id} (${reason})`);
  }
}

// UAT is conditional: required only for product-facing slices and reported as
// not applicable for non-product chores.
function checkUatApplicability(
  context: BundleContext,
  requiredFreshnessStates: string[],
  problems: string[]
): void {
  if (!context.productFacing) {
    return;
  }

  const uat = context.artifacts.get("uat")?.record ?? null;
  const freshness = uat ? asString(uat.freshness_state) : MISSING_FRESHNESS_STATE;
  if (!uat || !requiredFreshnessStates.includes(freshness)) {
    problems.push("missing required bundle input: UAT evidence");
  }
}

function checkLandingConsistency(
  context: BundleContext,
  problems: string[]
): void {
  const landing = context.artifacts.get("landing_verdict")?.record ?? null;
  if (!landing) {
    return;
  }

  const verdict = asString(landing.verdict);
  if (verdict.length > 0 && !SUPPORTED_LANDING_VERDICTS.has(verdict)) {
    problems.push(`unsupported landing verdict: ${verdict}`);
  }

  const review = context.artifacts.get("review_evidence")?.record ?? null;
  if (!review) {
    return;
  }

  const landingHash = asString(landing.review_subject_hash);
  const reviewHash = asString(review.review_subject_hash);
  if (landingHash !== reviewHash) {
    problems.push(
      `landing verdict mismatch: review_subject_hash ${landingHash} does not match review evidence ${reviewHash}`
    );
  }
}

function buildReport(
  context: BundleContext,
  policy: ParsedPolicy
): EvidenceBundleAttestationReport {
  const evidence = buildEvidenceMap(context, policy);
  const policyVersions = { [POLICY_ID]: policy.policyVersion };
  const commandVersions = { [COMMAND_NAME]: policy.commandVersion };
  const membership = [...BUNDLE_MEMBERSHIP];

  return {
    status: "pass",
    work_item: context.workItem,
    policy: POLICY_DISPLAY_PATH,
    bundle_hash: hashBundle(
      context.workItem,
      membership,
      evidence,
      policyVersions,
      commandVersions
    ),
    bundle_membership: membership,
    evidence,
    read_only: {
      no_gate_authority_replacement:
        policy.authority.readOnly &&
        !policy.authority.canReplaceLandingAuthority &&
        !policy.authority.canMutateReviewRouting &&
        !policy.authority.canMutateGapStatus,
      no_trust_verifier_cutover: !policy.authority.canReplaceTrustVerifierCutover
    },
    policy_versions: policyVersions,
    command_versions: commandVersions,
    freshness_metadata: buildFreshnessMetadata(evidence)
  };
}

function buildEvidenceMap(
  context: BundleContext,
  policy: ParsedPolicy
): Record<string, RawRecord> {
  const record = (id: string): RawRecord =>
    context.artifacts.get(id)?.record ?? {};
  const review = record("review_evidence");

  return {
    source_subject: {
      freshness_state: "current",
      review_subject_hash: asString(review.review_subject_hash),
      source_head: asString(review.source_head)
    },
    red_evidence: freshnessOf(record("red_evidence"), {
      source_artifacts: asStringArray(record("red_evidence").source_artifacts)
    }),
    test_evidence: freshnessOf(record("test_evidence"), {
      command: asString(record("test_evidence").command)
    }),
    implementation_evidence: freshnessOf(record("implementation_evidence"), {
      source_artifacts: asStringArray(
        record("implementation_evidence").source_artifacts
      )
    }),
    review_evidence: freshnessOf(review, {
      review_subject_hash: asString(review.review_subject_hash),
      source_head: asString(review.source_head),
      staleness_reason: asString(review.staleness_reason)
    }),
    risk_classification: freshnessOf(record("risk_classification"), {
      risk_tier: asString(record("risk_classification").risk_tier)
    }),
    supply_chain_gate: freshnessOf(record("supply_chain_gate"), {
      verdict: asString(record("supply_chain_gate").verdict)
    }),
    uat: buildUatEvidence(context),
    landing_verdict: freshnessOf(record("landing_verdict"), {
      verdict: asString(record("landing_verdict").verdict),
      review_subject_hash: asString(record("landing_verdict").review_subject_hash)
    }),
    landing_action: freshnessOf(record("landing_action"), {
      action: asString(record("landing_action").action),
      commit_sha: asString(record("landing_action").commit_sha)
    }),
    policy_versions: {
      freshness_state: "current",
      [POLICY_ID]: policy.policyVersion
    },
    command_versions: {
      freshness_state: "current",
      [COMMAND_NAME]: policy.commandVersion
    },
    freshness_metadata: { freshness_state: "current" }
  };
}

function buildUatEvidence(context: BundleContext): RawRecord {
  const uat = context.artifacts.get("uat")?.record ?? null;
  if (!context.productFacing) {
    return { applicability: "not_applicable", freshness_state: "not_applicable" };
  }
  return {
    applicability: "required",
    freshness_state: uat ? asString(uat.freshness_state) : MISSING_FRESHNESS_STATE
  };
}

function freshnessOf(record: RawRecord, extra: RawRecord): RawRecord {
  return { freshness_state: asString(record.freshness_state), ...extra };
}

function buildFreshnessMetadata(
  evidence: Record<string, RawRecord>
): RawRecord {
  const states: Record<string, string> = {};
  for (const id of BUNDLE_MEMBERSHIP) {
    states[id] = asString(evidence[id]?.freshness_state);
  }
  return { freshness_state: "current", states };
}

function hashBundle(
  workItem: string,
  membership: string[],
  evidence: Record<string, RawRecord>,
  policyVersions: Record<string, number>,
  commandVersions: Record<string, number>
): string {
  const canonical = canonicalJson({
    work_item: workItem,
    membership,
    evidence,
    policy_versions: policyVersions,
    command_versions: commandVersions
  });
  return createHash("sha256").update(canonical).digest("hex");
}

async function loadBundleContext(
  repoRoot: string,
  workItem: string
): Promise<BundleContext> {
  const artifacts = new Map<string, LoadedArtifact>();
  for (const spec of FILE_ARTIFACTS) {
    const displayPath = spec.relativePath(workItem);
    artifacts.set(spec.id, {
      displayPath,
      required: spec.required,
      record: await loadJsonArtifact(repoRoot, displayPath)
    });
  }

  return {
    workItem,
    productFacing: await isProductFacing(repoRoot, workItem),
    artifacts
  };
}

async function isProductFacing(
  repoRoot: string,
  workItem: string
): Promise<boolean> {
  const briefPath = path.join(repoRoot, `docs/work/${workItem}/brief.md`);
  let content: string;
  try {
    content = await readFile(briefPath, "utf8");
  } catch {
    return false;
  }
  const match = content.match(/work_type:\s*(\S+)/);
  const workType = match?.[1] ?? "chore";
  return PRODUCT_FACING_WORK_TYPES.has(workType);
}

async function loadPolicy(repoRoot: string): Promise<ParsedPolicy> {
  const raw = await loadJsonArtifact(repoRoot, POLICY_DISPLAY_PATH);
  if (!raw) {
    throw new Error(
      `missing required bundle input: ${POLICY_DISPLAY_PATH}`
    );
  }

  const authority = isRecord(raw.authority) ? raw.authority : {};
  const commandVersions = isRecord(raw.command_versions)
    ? raw.command_versions
    : {};
  const requiredFreshnessStates = asStringArray(raw.required_freshness_states);

  return {
    policyVersion: asNumber(raw.policy_version),
    commandVersion: asNumber(commandVersions[COMMAND_NAME]),
    authority: {
      readOnly: authority.read_only === true,
      canReplaceLandingAuthority: authority.can_replace_landing_authority === true,
      canReplaceTrustVerifierCutover:
        authority.can_replace_trust_verifier_cutover === true,
      canMutateReviewRouting: authority.can_mutate_review_routing === true,
      canMutateGapStatus: authority.can_mutate_gap_status === true
    },
    requiredFreshnessStates:
      requiredFreshnessStates.length > 0
        ? requiredFreshnessStates
        : [...DEFAULT_REQUIRED_FRESHNESS_STATES],
    declaredEvidenceTypeIds: new Set(
      asRecordArray(raw.evidence_types).map((type) => asString(type.id))
    )
  };
}

async function loadJsonArtifact(
  repoRoot: string,
  relativePath: string
): Promise<RawRecord | null> {
  let content: string;
  try {
    content = await readFile(path.join(repoRoot, relativePath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }

  const parsed = parseJsonContent(content);
  return isRecord(parsed) ? parsed : null;
}

function parseJsonContent(content: string): unknown {
  const fenced = extractJsonFence(content);
  try {
    return JSON.parse(fenced ?? content);
  } catch {
    return null;
  }
}

function extractJsonFence(content: string): string | null {
  const fence = "```json";
  const start = content.indexOf(fence);
  if (start === -1) {
    return null;
  }
  const bodyStart = start + fence.length;
  const end = content.indexOf("```", bodyStart);
  if (end === -1) {
    return null;
  }
  return content.slice(bodyStart, end);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function asRecordArray(value: unknown): RawRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
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
