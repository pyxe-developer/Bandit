import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { validateClaimSafetyInvariantCoverage } from "./claim-safety-simulation.js";
import {
  validateProjectionArtifacts,
  type ProjectionSummary
} from "./claim-projections.js";
import { getBanditPaths } from "./paths.js";
import {
  validateWorkSurfaceWaitForGraph,
  type WorkSurfaceGraphSummary
} from "./work-surface-graph.js";

type RawRecord = Record<string, unknown>;

export type ClaimAuthorityValidationReport = {
  status: "pass";
  policy: typeof CLAIM_AUTHORITY_POLICY_DISPLAY_PATH;
  template: typeof CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH;
  decisions: string[];
  evidence: string[];
  backends: string[];
  projections: string[];
  fencing: string[];
  idempotency: string[];
  parallel_write_authorization: string[];
  work_surface_wait_for_graph?: WorkSurfaceGraphSummary;
};

type ClaimAuthorityPolicy = {
  releaseAuthorizedDecisions: ClaimAuthorityDecision[];
};

type ClaimAuthorityDecision = {
  workItem: string;
  evidencePath: string;
};

type ClaimAuthorityEvidence = {
  workItem: string;
  evidencePath: string;
  raw: RawRecord;
  backend: RawRecord;
  projections: ProjectionSummary[];
  workSurfaceSummary: WorkSurfaceGraphSummary;
};

export const CLAIM_AUTHORITY_POLICY_DISPLAY_PATH =
  ".bandit/policy/claim-authority.json";
export const CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH =
  "docs/templates/claim-authority.md";

const POLICY_ID = "cas-fenced-claim-authority";
const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "source_artifacts",
  "claim_authority_backend",
  "claim_state_values",
  "claim_record_fields",
  "operations",
  "projection_artifacts",
  "reconciliation",
  "fencing",
  "idempotency",
  "work_surface_wait_for_graph",
  "claim_safety_invariants",
  "simulation_plan",
  "parallel_write_authorization",
  "evidence_paths"
];
const REQUIRED_CLAIM_RECORD_FIELDS = [
  "claim_id",
  "work_item",
  "stage",
  "declared_work_surfaces",
  "owner",
  "status",
  "expected_state",
  "fencing_token",
  "idempotency_keys",
  "recovery_metadata",
  "projection_ref",
  "reconciliation_evidence"
];
const STATE_CHANGING_OPERATIONS = [
  "claim",
  "renew",
  "release",
  "fail",
  "block",
  "complete",
  "recover"
];

export async function writeDefaultClaimAuthorityPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: POLICY_ID,
    authority_backend: {
      authority: "git_refs",
      ref_namespace: "refs/bandit/*",
      transaction_primitive: "git update-ref --stdin",
      compare_and_swap: "required"
    },
    projection_surfaces: [
      ".bandit/claims/",
      "in_flight_registry",
      "cockpit_status",
      "state_index"
    ],
    required_claim_record_fields: REQUIRED_CLAIM_RECORD_FIELDS,
    required_state_change_fields_after_token: [
      "expected_current_state",
      "fencing_token",
      "idempotency_key"
    ],
    release_authorized_decisions: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultClaimAuthorityTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH);
  const template = `# Claim Authority Template

work_item:
source_artifacts:
claim_authority_backend:
claim_state_values:
claim_record_fields:
operations:
projection_artifacts:
reconciliation:
fencing:
idempotency:
work_surface_wait_for_graph:
claim_safety_invariants:
simulation_plan:
parallel_write_authorization:
evidence_paths:
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

export async function validateClaimAuthority(
  repoRoot: string
): Promise<ClaimAuthorityValidationReport> {
  const policy = await readClaimAuthorityPolicy(repoRoot);
  await validateClaimAuthorityTemplate(repoRoot);
  const evidence = await readClaimAuthorityEvidence(repoRoot, policy);
  const firstWorkSurfaceSummary = evidence[0]?.workSurfaceSummary;

  return {
    status: "pass",
    policy: CLAIM_AUTHORITY_POLICY_DISPLAY_PATH,
    template: CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH,
    decisions: evidence.map((entry) => entry.workItem),
    evidence: evidence.map((entry) => entry.evidencePath),
    backends: evidence.map((entry) => formatBackend(entry)),
    projections: evidence.flatMap((entry) => formatProjections(entry)),
    fencing: evidence.map((entry) => formatFencing(entry)),
    idempotency: evidence.map((entry) => formatIdempotency(entry)),
    parallel_write_authorization: evidence.map((entry) =>
      formatParallelWriteAuthorization(entry)
    ),
    ...(firstWorkSurfaceSummary
      ? { work_surface_wait_for_graph: firstWorkSurfaceSummary }
      : {})
  };
}

async function readClaimAuthorityPolicy(
  repoRoot: string
): Promise<ClaimAuthorityPolicy> {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredFile(
    paths.claimAuthorityPolicy,
    CLAIM_AUTHORITY_POLICY_DISPLAY_PATH,
    "policy"
  );
  const parsed = parseJsonObject(content, "claim authority policy");

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed claim authority policy: missing contract_version 1");
  }

  if (parsed.policy_id !== POLICY_ID) {
    throw new Error(
      `Malformed claim authority policy: policy_id must be ${POLICY_ID}`
    );
  }

  validatePolicyBackend(parsed);
  ensureIncludesAll(
    readRequiredStringList(
      parsed,
      "required_claim_record_fields",
      "claim authority policy"
    ),
    REQUIRED_CLAIM_RECORD_FIELDS,
    "Malformed claim authority policy: required_claim_record_fields must include"
  );

  return {
    releaseAuthorizedDecisions: readPolicyDecisions(parsed)
  };
}

async function validateClaimAuthorityTemplate(repoRoot: string) {
  const content = await readRequiredFile(
    path.join(repoRoot, CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH),
    CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH,
    "template"
  );

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${CLAIM_AUTHORITY_TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

function validatePolicyBackend(policy: RawRecord) {
  const backend = readRequiredRecord(
    policy,
    "authority_backend",
    "claim authority policy"
  );
  const authority = readRequiredString(
    backend,
    "authority",
    "claim authority policy authority_backend"
  );
  const refNamespace = readRequiredString(
    backend,
    "ref_namespace",
    "claim authority policy authority_backend"
  );
  const transactionPrimitive = readRequiredString(
    backend,
    "transaction_primitive",
    "claim authority policy authority_backend"
  );
  const compareAndSwap = readRequiredString(
    backend,
    "compare_and_swap",
    "claim authority policy authority_backend"
  );

  if (
    authority !== "git_refs" ||
    refNamespace !== "refs/bandit/*" ||
    transactionPrimitive !== "git update-ref --stdin" ||
    compareAndSwap !== "required"
  ) {
    throw new Error(
      "active writable claim authority must use refs/bandit/* with git update-ref --stdin CAS transactions"
    );
  }
}

function readPolicyDecisions(policy: RawRecord): ClaimAuthorityDecision[] {
  return readRequiredRecordList(
    policy,
    "release_authorized_decisions",
    "claim authority policy"
  ).map((decision) => {
    const decisionKind = readRequiredString(
      decision,
      "decision_kind",
      "claim authority decision"
    );
    if (decisionKind !== "claim_authority") {
      throw new Error(`Unsupported claim authority decision kind: ${decisionKind}`);
    }

    return {
      workItem: readRequiredString(
        decision,
        "work_item",
        "claim authority decision"
      ),
      evidencePath: readRequiredString(
        decision,
        "evidence_path",
        "claim authority decision"
      )
    };
  });
}

async function readClaimAuthorityEvidence(
  repoRoot: string,
  policy: ClaimAuthorityPolicy
) {
  const evidencePaths = await collectEvidencePaths(repoRoot, policy);
  const evidence: ClaimAuthorityEvidence[] = [];
  const problems: string[] = [];

  for (const [evidencePath, expectedWorkItem] of evidencePaths) {
    const raw = await readAuthorityEvidence(repoRoot, evidencePath, expectedWorkItem);
    const validated = validateAuthorityEvidence(evidencePath, raw);
    evidence.push(validated);
    problems.push(...claimAuthorityProblems(validated));
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return evidence;
}

async function collectEvidencePaths(
  repoRoot: string,
  policy: ClaimAuthorityPolicy
) {
  const evidencePaths = new Map<string, string | null>();

  for (const decision of policy.releaseAuthorizedDecisions) {
    evidencePaths.set(decision.evidencePath, decision.workItem);
  }

  for (const evidencePath of await discoverClaimAuthorityEvidence(repoRoot)) {
    if (!evidencePaths.has(evidencePath)) {
      evidencePaths.set(evidencePath, null);
    }
  }

  return evidencePaths;
}

async function discoverClaimAuthorityEvidence(repoRoot: string) {
  const displayRoot = "docs/claim-authority";
  const absoluteRoot = path.join(repoRoot, displayRoot);

  try {
    const entries = await readdir(absoluteRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith("-claim-authority.json"))
      .map((entry) => `${displayRoot}/${entry.name}`)
      .sort();
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }
}

async function readAuthorityEvidence(
  repoRoot: string,
  evidencePath: string,
  expectedWorkItem: string | null
) {
  const content = await readRequiredFile(
    path.join(repoRoot, evidencePath),
    evidencePath,
    "claim authority evidence"
  );
  const parsed = parseJsonObject(content, "claim authority evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed claim authority evidence: ${evidencePath}; missing contract_version 1`
    );
  }

  const workItem = readRequiredString(
    parsed,
    "work_item",
    "claim authority evidence"
  );
  if (expectedWorkItem && workItem !== expectedWorkItem) {
    throw new Error(
      `Malformed claim authority evidence for ${expectedWorkItem}: work_item does not match`
    );
  }

  return parsed;
}

function validateAuthorityEvidence(
  evidencePath: string,
  raw: RawRecord
): ClaimAuthorityEvidence {
  const workItem = readRequiredString(raw, "work_item", "claim authority evidence");
  const backend = readRequiredRecord(
    raw,
    "claim_authority_backend",
    `claim authority evidence for ${workItem}`
  );
  const projections = validateProjectionArtifacts(
    workItem,
    raw.projection_artifacts
  );
  const workSurfaceSummary = validateWorkSurfaceWaitForGraph(
    workItem,
    raw.work_surface_wait_for_graph
  );

  return {
    workItem,
    evidencePath,
    raw,
    backend,
    projections,
    workSurfaceSummary
  };
}

function claimAuthorityProblems(evidence: ClaimAuthorityEvidence) {
  const problems: string[] = [];

  problems.push(...backendProblems(evidence));
  problems.push(...claimRecordFieldProblems(evidence));
  problems.push(...operationProblems(evidence));
  problems.push(...reconciliationProblems(evidence));
  problems.push(...fencingProblems(evidence));
  problems.push(...idempotencyProblems(evidence));
  problems.push(...parallelWriteAuthorizationProblems(evidence));
  validateClaimSafetyInvariantCoverage(evidence.raw);

  return problems;
}

function backendProblems(evidence: ClaimAuthorityEvidence) {
  const authority = readRequiredString(
    evidence.backend,
    "authority",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  );
  const refNamespace = readRequiredString(
    evidence.backend,
    "ref_namespace",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  );
  const transactionPrimitive = readRequiredString(
    evidence.backend,
    "transaction_primitive",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  );
  const compareAndSwap = readRequiredString(
    evidence.backend,
    "compare_and_swap",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  );
  const plainBanditFilesAreProjection = readRequiredBoolean(
    evidence.backend,
    "plain_bandit_files_are_projection",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  );

  if (
    authority !== "git_refs" ||
    refNamespace !== "refs/bandit/*" ||
    transactionPrimitive !== "git update-ref --stdin" ||
    compareAndSwap !== "required" ||
    !plainBanditFilesAreProjection
  ) {
    return [
      "active writable claim authority must use refs/bandit/* with git update-ref --stdin CAS transactions"
    ];
  }

  return [];
}

function claimRecordFieldProblems(evidence: ClaimAuthorityEvidence) {
  const fields = readRequiredStringList(
    evidence.raw,
    "claim_record_fields",
    `claim authority evidence for ${evidence.workItem}`
  );
  return REQUIRED_CLAIM_RECORD_FIELDS.filter((field) => !fields.includes(field)).map(
    (field) =>
      `claim authority evidence for ${evidence.workItem} must include claim record field ${field}`
  );
}

function operationProblems(evidence: ClaimAuthorityEvidence) {
  const operations = readRequiredRecordList(
    evidence.raw,
    "operations",
    `claim authority evidence for ${evidence.workItem}`
  );
  const problems: string[] = [];

  for (const requiredOperation of STATE_CHANGING_OPERATIONS) {
    const operation = operations.find(
      (candidate) => candidate.name === requiredOperation
    );

    if (!operation) {
      problems.push(
        `claim authority evidence for ${evidence.workItem} must define ${requiredOperation}`
      );
      continue;
    }

    const authority = readRequiredString(
      operation,
      "authority",
      `claim authority operation ${requiredOperation}`
    );
    const requiresExpectedState = readRequiredBoolean(
      operation,
      "requires_expected_current_state",
      `claim authority operation ${requiredOperation}`
    );
    const requiresFencingToken = readRequiredBoolean(
      operation,
      "requires_current_fencing_token_after_issuance",
      `claim authority operation ${requiredOperation}`
    );
    const requiresIdempotencyKey = readRequiredBoolean(
      operation,
      "requires_idempotency_key_after_issuance",
      `claim authority operation ${requiredOperation}`
    );

    if (
      authority !== "git_update_ref_cas" ||
      !requiresExpectedState ||
      !requiresFencingToken ||
      !requiresIdempotencyKey
    ) {
      problems.push(
        `${requiredOperation} requires expected current state, current fencing token after issuance, and idempotency key after issuance`
      );
    }
  }

  return problems;
}

function reconciliationProblems(evidence: ClaimAuthorityEvidence) {
  const reconciliation = readRequiredRecord(
    evidence.raw,
    "reconciliation",
    `claim authority evidence for ${evidence.workItem}`
  );
  const gitRefsState = readRequiredString(
    reconciliation,
    "git_refs_state",
    `claim authority evidence for ${evidence.workItem} reconciliation`
  );
  const projectionState = readRequiredString(
    reconciliation,
    "projection_state",
    `claim authority evidence for ${evidence.workItem} reconciliation`
  );
  const coordinationHistoryState = readRequiredString(
    reconciliation,
    "coordination_history_state",
    `claim authority evidence for ${evidence.workItem} reconciliation`
  );
  const disagreementBehavior = readRequiredString(
    reconciliation,
    "disagreement_behavior",
    `claim authority evidence for ${evidence.workItem} reconciliation`
  );
  const operatorEscalation = readRequiredString(
    reconciliation,
    "operator_escalation",
    `claim authority evidence for ${evidence.workItem} reconciliation`
  );

  if (
    gitRefsState !== projectionState ||
    gitRefsState !== coordinationHistoryState
  ) {
    return [
      `claim authority, projection, and coordination history disagree for ${evidence.workItem}`
    ];
  }

  if (
    disagreementBehavior !== "fail_closed_recovery_or_pm_repair" ||
    operatorEscalation !== "only_operator_owned_gate"
  ) {
    return [
      `claim authority disagreement for ${evidence.workItem} must route to recovery or PM repair unless an operator-owned gate is missing`
    ];
  }

  return [];
}

function fencingProblems(evidence: ClaimAuthorityEvidence) {
  const fencing = readRequiredRecord(
    evidence.raw,
    "fencing",
    `claim authority evidence for ${evidence.workItem}`
  );
  const tokenModel = readRequiredString(
    fencing,
    "token_model",
    `claim authority evidence for ${evidence.workItem} fencing`
  );
  const requiredAfterIssuance = readRequiredBoolean(
    fencing,
    "required_after_issuance",
    `claim authority evidence for ${evidence.workItem} fencing`
  );
  const staleTokenBehavior = readRequiredString(
    fencing,
    "stale_token_behavior",
    `claim authority evidence for ${evidence.workItem} fencing`
  );

  if (
    tokenModel !== "monotonic" ||
    !requiredAfterIssuance ||
    staleTokenBehavior !== "refuse_state_change"
  ) {
    return [
      `claim authority fencing for ${evidence.workItem} must use monotonic tokens and refuse stale state changes`
    ];
  }

  return [];
}

function idempotencyProblems(evidence: ClaimAuthorityEvidence) {
  const idempotency = readRequiredRecord(
    evidence.raw,
    "idempotency",
    `claim authority evidence for ${evidence.workItem}`
  );
  const requiredAfterTokenIssuance = readRequiredBoolean(
    idempotency,
    "required_after_token_issuance",
    `claim authority evidence for ${evidence.workItem} idempotency`
  );
  const sameKeySameInput = readRequiredString(
    idempotency,
    "same_key_same_input",
    `claim authority evidence for ${evidence.workItem} idempotency`
  );
  const sameKeyDifferentInput = readRequiredString(
    idempotency,
    "same_key_different_input",
    `claim authority evidence for ${evidence.workItem} idempotency`
  );

  if (
    !requiredAfterTokenIssuance ||
    sameKeySameInput !== "replay_prior_result" ||
    sameKeyDifferentInput !== "refuse"
  ) {
    return [
      `claim authority idempotency for ${evidence.workItem} must replay same-key same-input calls and refuse same-key different-input calls`
    ];
  }

  return [];
}

function parallelWriteAuthorizationProblems(evidence: ClaimAuthorityEvidence) {
  const authorization = readRequiredRecord(
    evidence.raw,
    "parallel_write_authorization",
    `claim authority evidence for ${evidence.workItem}`
  );
  const status = readRequiredString(
    authorization,
    "status",
    `claim authority evidence for ${evidence.workItem} parallel_write_authorization`
  );
  const missingGates = readRequiredStringList(
    authorization,
    "missing_gates",
    `claim authority evidence for ${evidence.workItem} parallel_write_authorization`
  );

  if (
    status !== "blocked_until_full_gate" ||
    !missingGates.includes("BANDIT-GAP-GIT-MUTATION-SERIALIZER") ||
    !missingGates.includes("BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT")
  ) {
    return [
      `parallel writable workstreams must remain blocked for ${evidence.workItem} until Git Mutation Serializer and Worktree Bootstrap Contract gates pass`
    ];
  }

  return [];
}

function formatBackend(evidence: ClaimAuthorityEvidence) {
  return `${evidence.workItem}:${readRequiredString(
    evidence.backend,
    "ref_namespace",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  )}:${readRequiredString(
    evidence.backend,
    "transaction_primitive",
    `claim authority evidence for ${evidence.workItem} claim_authority_backend`
  )}`;
}

function formatProjections(evidence: ClaimAuthorityEvidence) {
  return evidence.projections.map(
    (projection) =>
      `${evidence.workItem}:${projection.path}:${projection.authority}`
  );
}

function formatFencing(evidence: ClaimAuthorityEvidence) {
  const fencing = readRequiredRecord(
    evidence.raw,
    "fencing",
    `claim authority evidence for ${evidence.workItem}`
  );
  return `${evidence.workItem}:${readRequiredString(
    fencing,
    "token_model",
    `claim authority evidence for ${evidence.workItem} fencing`
  )}`;
}

function formatIdempotency(evidence: ClaimAuthorityEvidence) {
  const idempotency = readRequiredRecord(
    evidence.raw,
    "idempotency",
    `claim authority evidence for ${evidence.workItem} idempotency`
  );
  const status = readRequiredBoolean(
    idempotency,
    "required_after_token_issuance",
    `claim authority evidence for ${evidence.workItem} idempotency`
  )
    ? "required_after_token_issuance"
    : "not_required";
  return `${evidence.workItem}:${status}`;
}

function formatParallelWriteAuthorization(evidence: ClaimAuthorityEvidence) {
  const authorization = readRequiredRecord(
    evidence.raw,
    "parallel_write_authorization",
    `claim authority evidence for ${evidence.workItem} parallel_write_authorization`
  );
  return `${evidence.workItem}:${readRequiredString(
    authorization,
    "status",
    `claim authority evidence for ${evidence.workItem} parallel_write_authorization`
  )}`;
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
      throw new Error(`Missing required ${kind}: ${displayPath}`);
    }
    throw error;
  }
}

function parseJsonObject(content: string, context: string): RawRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Malformed ${context}: invalid JSON`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`Malformed ${context}: expected object`);
  }

  return parsed;
}

function ensureIncludesAll(
  values: string[],
  requiredValues: string[],
  messagePrefix: string
) {
  for (const value of requiredValues) {
    if (!values.includes(value)) {
      throw new Error(`${messagePrefix} ${value}`);
    }
  }
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

function readRequiredBoolean(
  record: RawRecord,
  field: string,
  context: string
) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
