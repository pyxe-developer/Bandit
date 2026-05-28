import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

type RawRecord = Record<string, unknown>;

type GitMutationPolicy = {
  sharedGitMutationAllowList: string[];
  requiredEvidenceFields: string[];
  releaseAuthorizedDecisions: GitMutationDecision[];
};

type GitMutationDecision = {
  workItem: string;
  evidencePath: string;
};

type GitMutationEvidenceSource = {
  evidencePath: string;
  expectedWorkItem: string | null;
};

type GitMutationEvidence = {
  workItem: string;
  evidencePath: string;
  raw: RawRecord;
};

export type GitMutationValidationReport = {
  status: "pass";
  policy: typeof GIT_MUTATION_POLICY_DISPLAY_PATH;
  template: typeof GIT_MUTATION_TEMPLATE_DISPLAY_PATH;
  decisions: string[];
  evidence: string[];
  allow_list: string[];
  guard?: {
    strategy: string;
    max_concurrent_holders: number;
    timeout_behavior: string;
    stale_lock_behavior: string;
  };
  claim_authority?: string;
  worktree_locks?: {
    immediate_after_create: boolean;
    unlock_authority: string;
  };
  parallel_write_authorization?: string;
};

export const GIT_MUTATION_POLICY_DISPLAY_PATH =
  ".bandit/policy/git-mutations.json";
export const GIT_MUTATION_TEMPLATE_DISPLAY_PATH =
  "docs/templates/git-mutation-serializer.md";

const POLICY_ID = "git-mutation-serializer";
const REQUIRED_SHARED_GIT_MUTATIONS = [
  "worktree_add",
  "worktree_remove",
  "worktree_prune",
  "worktree_lock",
  "worktree_unlock",
  "branch_ref_maintenance_outside_claim_cas",
  "packed_refs_maintenance"
];
const REQUIRED_EVIDENCE_FIELDS = [
  "operation_id",
  "operation",
  "work_item",
  "stage",
  "claim_id",
  "writer_owner",
  "started_at",
  "completed_at",
  "result",
  "contention_status",
  "stale_lock_status",
  "diagnostics",
  "source_artifacts"
];
const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "source_artifacts",
  "serializer_boundary",
  "shared_git_mutation_allow_list",
  "single_writer_guard",
  "contention_scenarios",
  "release_authorized_path_checks",
  "claim_owned_worktree_locks",
  "failure_cleanup",
  "timeout_and_stale_lock",
  "trace_fields",
  "parallel_write_authorization",
  "evidence_paths"
];
const CLAIM_OPERATIONS = [
  "grant",
  "renew",
  "release",
  "complete",
  "block",
  "fail",
  "recover",
  "transfer"
];

export async function writeDefaultGitMutationPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: POLICY_ID,
    serializer_boundary: {
      authority: "cli_single_writer_guard",
      lock_scope: "shared_git_plumbing",
      claim_authority: "separate_refs_bandit_cas"
    },
    shared_git_mutation_allow_list: REQUIRED_SHARED_GIT_MUTATIONS,
    required_evidence_fields: REQUIRED_EVIDENCE_FIELDS,
    release_authorized_decisions: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultGitMutationTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, GIT_MUTATION_TEMPLATE_DISPLAY_PATH);
  const template = `# Git Mutation Serializer Template

work_item:
source_artifacts:
serializer_boundary:
shared_git_mutation_allow_list:
single_writer_guard:
contention_scenarios:
release_authorized_path_checks:
claim_owned_worktree_locks:
failure_cleanup:
timeout_and_stale_lock:
trace_fields:
parallel_write_authorization:
evidence_paths:
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

export async function validateGitMutations(
  repoRoot: string
): Promise<GitMutationValidationReport> {
  const policy = await readGitMutationPolicy(repoRoot);
  await validateGitMutationTemplate(repoRoot);
  const evidence = await readGitMutationEvidence(repoRoot, policy);
  const firstEvidence = evidence[0];

  return {
    status: "pass",
    policy: GIT_MUTATION_POLICY_DISPLAY_PATH,
    template: GIT_MUTATION_TEMPLATE_DISPLAY_PATH,
    decisions: evidence.map((entry) => entry.workItem),
    evidence: evidence.map((entry) => entry.evidencePath),
    allow_list: firstEvidence
      ? readRequiredStringList(
          firstEvidence.raw,
          "shared_git_mutation_allow_list",
          `git mutation serializer evidence for ${firstEvidence.workItem}`
        )
      : policy.sharedGitMutationAllowList,
    ...(firstEvidence ? gitMutationEvidenceSummary(firstEvidence) : {})
  };
}

async function readGitMutationPolicy(repoRoot: string): Promise<GitMutationPolicy> {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredFile(
    paths.gitMutationPolicy,
    GIT_MUTATION_POLICY_DISPLAY_PATH,
    "policy"
  );
  const parsed = parseJsonObject(content, "git mutation policy");

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed git mutation policy: missing contract_version 1");
  }

  if (parsed.policy_id !== POLICY_ID) {
    throw new Error(`Malformed git mutation policy: policy_id must be ${POLICY_ID}`);
  }

  const sharedGitMutationAllowList = readRequiredStringList(
    parsed,
    "shared_git_mutation_allow_list",
    "git mutation policy"
  );
  const requiredEvidenceFields = readRequiredStringList(
    parsed,
    "required_evidence_fields",
    "git mutation policy"
  );

  const problems = [
    ...missingRequiredValues(
      sharedGitMutationAllowList,
      REQUIRED_SHARED_GIT_MUTATIONS,
      "shared .git mutation allow-list must include"
    ),
    ...missingRequiredValues(
      requiredEvidenceFields,
      REQUIRED_EVIDENCE_FIELDS,
      "git mutation serializer evidence fields must include"
    )
  ];

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return {
    sharedGitMutationAllowList,
    requiredEvidenceFields,
    releaseAuthorizedDecisions: readPolicyDecisions(parsed)
  };
}

async function validateGitMutationTemplate(repoRoot: string) {
  const content = await readRequiredFile(
    path.join(repoRoot, GIT_MUTATION_TEMPLATE_DISPLAY_PATH),
    GIT_MUTATION_TEMPLATE_DISPLAY_PATH,
    "template"
  );

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${GIT_MUTATION_TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

function readPolicyDecisions(policy: RawRecord): GitMutationDecision[] {
  return readRequiredRecordList(
    policy,
    "release_authorized_decisions",
    "git mutation policy"
  ).map((decision) => {
    const decisionKind = readRequiredString(
      decision,
      "decision_kind",
      "git mutation decision"
    );
    if (decisionKind !== "git_mutation_serializer") {
      throw new Error(`Unsupported git mutation decision kind: ${decisionKind}`);
    }

    return {
      workItem: readRequiredString(decision, "work_item", "git mutation decision"),
      evidencePath: readRequiredString(
        decision,
        "evidence_path",
        "git mutation decision"
      )
    };
  });
}

async function readGitMutationEvidence(
  repoRoot: string,
  policy: GitMutationPolicy
) {
  const evidenceSources = await collectEvidenceSources(repoRoot, policy);
  const evidence: GitMutationEvidence[] = [];
  const problems: string[] = [];

  for (const source of evidenceSources) {
    const raw = await readEvidenceFile(repoRoot, source);
    const workItem = readRequiredString(
      raw,
      "work_item",
      "git mutation serializer evidence"
    );
    const entry = {
      workItem,
      evidencePath: source.evidencePath,
      raw
    };
    evidence.push(entry);
    problems.push(...gitMutationEvidenceProblems(entry));
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return evidence;
}

async function collectEvidenceSources(
  repoRoot: string,
  policy: GitMutationPolicy
) {
  const evidenceSources = new Map<string, string | null>();

  for (const decision of policy.releaseAuthorizedDecisions) {
    evidenceSources.set(decision.evidencePath, decision.workItem);
  }

  for (const evidencePath of await discoverGitMutationEvidence(repoRoot)) {
    if (!evidenceSources.has(evidencePath)) {
      evidenceSources.set(evidencePath, null);
    }
  }

  return [...evidenceSources].map(
    ([evidencePath, expectedWorkItem]): GitMutationEvidenceSource => ({
      evidencePath,
      expectedWorkItem
    })
  );
}

async function discoverGitMutationEvidence(repoRoot: string) {
  const displayRoot = "docs/git-mutations";
  const absoluteRoot = path.join(repoRoot, displayRoot);

  try {
    const entries = await readdir(absoluteRoot, { withFileTypes: true });
    return entries
      .filter(
        (entry) => entry.isFile() && entry.name.endsWith("-git-mutation-serializer.json")
      )
      .map((entry) => `${displayRoot}/${entry.name}`)
      .sort();
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }
}

async function readEvidenceFile(
  repoRoot: string,
  source: GitMutationEvidenceSource
) {
  const content = await readRequiredFile(
    path.join(repoRoot, source.evidencePath),
    source.evidencePath,
    "git mutation serializer evidence"
  );
  const parsed = parseJsonObject(content, "git mutation serializer evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed git mutation serializer evidence: ${source.evidencePath}; missing contract_version 1`
    );
  }

  const workItem = readRequiredString(
    parsed,
    "work_item",
    "git mutation serializer evidence"
  );
  if (source.expectedWorkItem && workItem !== source.expectedWorkItem) {
    throw new Error(
      `Malformed git mutation serializer evidence for ${source.expectedWorkItem}: work_item does not match`
    );
  }

  return parsed;
}

function gitMutationEvidenceProblems(evidence: GitMutationEvidence) {
  return [
    ...allowListProblems(evidence),
    ...releaseAuthorizedBypassProblems(evidence),
    ...singleWriterGuardProblems(evidence),
    ...serializerAuthorityProblems(evidence),
    ...worktreeLockProblems(evidence),
    ...failureCleanupProblems(evidence),
    ...timeoutAndStaleLockProblems(evidence),
    ...traceFieldProblems(evidence),
    ...parallelWriteAuthorizationProblems(evidence)
  ];
}

function allowListProblems(evidence: GitMutationEvidence) {
  const allowList = readRequiredStringList(
    evidence.raw,
    "shared_git_mutation_allow_list",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  return missingRequiredValues(
    allowList,
    REQUIRED_SHARED_GIT_MUTATIONS,
    "shared .git mutation allow-list must include"
  );
}

function releaseAuthorizedBypassProblems(evidence: GitMutationEvidence) {
  const checks = readRequiredRecordList(
    evidence.raw,
    "release_authorized_path_checks",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const problems: string[] = [];

  for (const check of checks) {
    const releaseAuthorized = readRequiredBoolean(
      check,
      "release_authorized",
      `git mutation serializer evidence for ${evidence.workItem} release_authorized_path_checks`
    );
    const usesSerializer = readRequiredBoolean(
      check,
      "uses_serializer",
      `git mutation serializer evidence for ${evidence.workItem} release_authorized_path_checks`
    );
    const operation = readRequiredString(
      check,
      "operation",
      `git mutation serializer evidence for ${evidence.workItem} release_authorized_path_checks`
    );

    if (releaseAuthorized && !usesSerializer) {
      problems.push(
        `release-authorized shared git mutation ${operation} must use Git Mutation Serializer`
      );
    }
  }

  return problems;
}

function singleWriterGuardProblems(evidence: GitMutationEvidence) {
  const guard = readRequiredRecord(
    evidence.raw,
    "single_writer_guard",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const maxConcurrentHolders = readRequiredNumber(
    guard,
    "max_concurrent_holders",
    `git mutation serializer evidence for ${evidence.workItem} single_writer_guard`
  );
  const requiredForReleaseAuthorizedPaths = readRequiredBoolean(
    guard,
    "required_for_release_authorized_paths",
    `git mutation serializer evidence for ${evidence.workItem} single_writer_guard`
  );
  const contentionScenarios = readRequiredRecordList(
    evidence.raw,
    "contention_scenarios",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const scenarioAllowsConcurrentHolder = contentionScenarios.some((scenario) => {
    const expectedResult = readRequiredRecord(
      scenario,
      "expected_result",
      `git mutation serializer evidence for ${evidence.workItem} contention_scenarios`
    );
    return (
      readRequiredNumber(
        expectedResult,
        "max_concurrent_holders",
        `git mutation serializer evidence for ${evidence.workItem} contention_scenarios expected_result`
      ) > 1
    );
  });

  if (
    maxConcurrentHolders !== 1 ||
    !requiredForReleaseAuthorizedPaths ||
    scenarioAllowsConcurrentHolder
  ) {
    return [
      "single-writer guard must allow at most one concurrent shared .git mutation holder"
    ];
  }

  return [];
}

function serializerAuthorityProblems(evidence: GitMutationEvidence) {
  const boundary = readRequiredRecord(
    evidence.raw,
    "serializer_boundary",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const claimAuthorityBackend = readRequiredString(
    boundary,
    "claim_authority_backend",
    `git mutation serializer evidence for ${evidence.workItem} serializer_boundary`
  );
  const claimAuthorityPrimitive = readRequiredString(
    boundary,
    "claim_authority_primitive",
    `git mutation serializer evidence for ${evidence.workItem} serializer_boundary`
  );
  const canonicalWorkflowAuthority = readRequiredBoolean(
    boundary,
    "canonical_workflow_authority",
    `git mutation serializer evidence for ${evidence.workItem} serializer_boundary`
  );
  const serializerHasClaimAuthority = CLAIM_OPERATIONS.some((operation) =>
    readRequiredBoolean(
      boundary,
      `serializer_can_${operation}_claims`,
      `git mutation serializer evidence for ${evidence.workItem} serializer_boundary`
    )
  );

  if (
    canonicalWorkflowAuthority ||
    claimAuthorityBackend !== "refs/bandit/*" ||
    claimAuthorityPrimitive !== "git update-ref --stdin" ||
    serializerHasClaimAuthority
  ) {
    return [
      "Git Mutation Serializer cannot grant, renew, release, complete, block, fail, recover, or transfer claims"
    ];
  }

  return [];
}

function worktreeLockProblems(evidence: GitMutationEvidence) {
  const locks = readRequiredRecord(
    evidence.raw,
    "claim_owned_worktree_locks",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const requiredReasonFields = readRequiredStringList(
    locks,
    "required_reason_fields",
    `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
  );
  const forbiddenReasonFields = readRequiredStringList(
    locks,
    "forbidden_reason_fields",
    `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
  );
  const lockImmediately = readRequiredBoolean(
    locks,
    "lock_immediately_after_create",
    `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
  );
  const unlockAuthority = readRequiredString(
    locks,
    "unlock_authority",
    `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
  );
  const workerOwnedUnlock = readRequiredString(
    locks,
    "worker_owned_unlock",
    `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
  );
  const requiresHandoffOrCleanup = readRequiredBoolean(
    locks,
    "requires_handoff_verification_or_cleanup_evidence",
    `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
  );

  if (requiredReasonFields.includes("fencing_token")) {
    return ["claim-owned worktree lock reason must not include fencing_token"];
  }

  if (!forbiddenReasonFields.includes("fencing_token")) {
    return ["claim-owned worktree lock reason must not include fencing_token"];
  }

  const missingLockFields = missingRequiredValues(
    requiredReasonFields,
    ["claim_id", "work_item", "stage"],
    "claim-owned worktree lock reason must include"
  );
  if (missingLockFields.length > 0) {
    return missingLockFields;
  }

  if (
    !lockImmediately ||
    unlockAuthority !== "repo_pm_coordinator_only" ||
    !requiresHandoffOrCleanup
  ) {
    return [
      "claim-owned worktree creation must lock immediately and unlock only through Repo PM Coordinator cleanup"
    ];
  }

  if (workerOwnedUnlock !== "refused") {
    return ["worker-owned unlock of claim-owned worktree must be refused"];
  }

  return [];
}

function failureCleanupProblems(evidence: GitMutationEvidence) {
  const cleanup = readRequiredRecord(
    evidence.raw,
    "failure_cleanup",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const falseActiveClaimAllowed = readRequiredBoolean(
    cleanup,
    "false_active_claim_allowed",
    `git mutation serializer evidence for ${evidence.workItem} failure_cleanup`
  );

  if (falseActiveClaimAllowed) {
    return ["worktree lock failure cleanup must not leave a false active claim"];
  }

  const cleanupBehavior = readRequiredString(
    cleanup,
    "worktree_lock_failure_behavior",
    `git mutation serializer evidence for ${evidence.workItem} failure_cleanup`
  );
  const cleanupRoutes = readRequiredStringList(
    cleanup,
    "allowed_claim_cleanup_routes",
    `git mutation serializer evidence for ${evidence.workItem} failure_cleanup`
  );
  const cleanupEvidenceFields = readRequiredStringList(
    cleanup,
    "cleanup_evidence_fields",
    `git mutation serializer evidence for ${evidence.workItem} failure_cleanup`
  );

  if (
    cleanupBehavior !== "record_failure_and_route_claim_cleanup" ||
    missingRequiredValues(cleanupRoutes, ["release", "fail", "block", "recovery_required"], "cleanup routes must include").length > 0 ||
    missingRequiredValues(cleanupEvidenceFields, ["operation", "work_item", "claim_id", "stage", "failure", "cleanup_route", "source_artifacts"], "cleanup evidence fields must include").length > 0
  ) {
    return ["worktree lock failure cleanup must record evidence and route claim cleanup"];
  }

  return [];
}

function timeoutAndStaleLockProblems(evidence: GitMutationEvidence) {
  const timeout = readRequiredRecord(
    evidence.raw,
    "timeout_and_stale_lock",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const timeoutBehavior = readRequiredString(
    timeout,
    "timeout_behavior",
    `git mutation serializer evidence for ${evidence.workItem} timeout_and_stale_lock`
  );
  const staleLockRecoveryRequires = readRequiredStringList(
    timeout,
    "stale_lock_recovery_requires",
    `git mutation serializer evidence for ${evidence.workItem} timeout_and_stale_lock`
  );
  const ambiguousStaleLockBehavior = readRequiredString(
    timeout,
    "ambiguous_stale_lock_behavior",
    `git mutation serializer evidence for ${evidence.workItem} timeout_and_stale_lock`
  );

  if (
    timeoutBehavior !== "fail_closed" ||
    ambiguousStaleLockBehavior !== "fail_closed" ||
    missingRequiredValues(
      staleLockRecoveryRequires,
      ["stale_lock_evidence", "owner_liveness_check", "pm_repair_or_recovery_event"],
      "stale lock recovery requires"
    ).length > 0
  ) {
    return ["serializer timeout behavior must fail closed"];
  }

  return [];
}

function traceFieldProblems(evidence: GitMutationEvidence) {
  const traceFields = readRequiredStringList(
    evidence.raw,
    "trace_fields",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  return missingRequiredValues(
    traceFields,
    REQUIRED_EVIDENCE_FIELDS,
    "git mutation serializer trace fields must include"
  );
}

function parallelWriteAuthorizationProblems(evidence: GitMutationEvidence) {
  const authorization = readRequiredRecord(
    evidence.raw,
    "parallel_write_authorization",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const status = readRequiredString(
    authorization,
    "status",
    `git mutation serializer evidence for ${evidence.workItem} parallel_write_authorization`
  );
  const missingGates = readRequiredStringList(
    authorization,
    "missing_gates",
    `git mutation serializer evidence for ${evidence.workItem} parallel_write_authorization`
  );

  if (
    status !== "blocked_until_full_gate" ||
    !missingGates.includes("BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT")
  ) {
    return [
      "parallel writable workstreams must remain blocked until Git Mutation Serializer and Worktree Bootstrap Contract gates pass"
    ];
  }

  return [];
}

function gitMutationEvidenceSummary(evidence: GitMutationEvidence) {
  const guard = readRequiredRecord(
    evidence.raw,
    "single_writer_guard",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const boundary = readRequiredRecord(
    evidence.raw,
    "serializer_boundary",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const locks = readRequiredRecord(
    evidence.raw,
    "claim_owned_worktree_locks",
    `git mutation serializer evidence for ${evidence.workItem}`
  );
  const authorization = readRequiredRecord(
    evidence.raw,
    "parallel_write_authorization",
    `git mutation serializer evidence for ${evidence.workItem}`
  );

  return {
    guard: {
      strategy: readRequiredString(
        guard,
        "strategy",
        `git mutation serializer evidence for ${evidence.workItem} single_writer_guard`
      ),
      max_concurrent_holders: readRequiredNumber(
        guard,
        "max_concurrent_holders",
        `git mutation serializer evidence for ${evidence.workItem} single_writer_guard`
      ),
      timeout_behavior: readRequiredString(
        guard,
        "timeout_behavior",
        `git mutation serializer evidence for ${evidence.workItem} single_writer_guard`
      ),
      stale_lock_behavior: readRequiredString(
        guard,
        "stale_lock_behavior",
        `git mutation serializer evidence for ${evidence.workItem} single_writer_guard`
      )
    },
    claim_authority: `${readRequiredString(
      boundary,
      "claim_authority_backend",
      `git mutation serializer evidence for ${evidence.workItem} serializer_boundary`
    )}:${readRequiredString(
      boundary,
      "claim_authority_primitive",
      `git mutation serializer evidence for ${evidence.workItem} serializer_boundary`
    )}`,
    worktree_locks: {
      immediate_after_create: readRequiredBoolean(
        locks,
        "lock_immediately_after_create",
        `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
      ),
      unlock_authority: readRequiredString(
        locks,
        "unlock_authority",
        `git mutation serializer evidence for ${evidence.workItem} claim_owned_worktree_locks`
      )
    },
    parallel_write_authorization: readRequiredString(
      authorization,
      "status",
      `git mutation serializer evidence for ${evidence.workItem} parallel_write_authorization`
    )
  };
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

function readRequiredString(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function readRequiredBoolean(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function readRequiredNumber(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (typeof value !== "number") {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function missingRequiredValues(
  actual: string[],
  required: string[],
  messagePrefix: string
) {
  return required
    .filter((entry) => !actual.includes(entry))
    .map((entry) => `${messagePrefix} ${entry}`);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
