import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readCoordinationStatus } from "./coordination-log.js";
import { getBanditPaths } from "./paths.js";

export type CoordinationAuthorityValidationReport = {
  status: "pass";
  policy: typeof COORDINATION_AUTHORITY_POLICY_DISPLAY_PATH;
  decisions: string[];
  canonical_history: string[];
  projections: string[];
  claim_authority: string[];
};

type RawRecord = Record<string, unknown>;

type CoordinationAuthorityPolicy = {
  releaseAuthorizedDecisions: CoordinationAuthorityDecision[];
};

type CoordinationAuthorityDecision = {
  workItem: string;
  decisionKind: string;
  evidencePath: string;
};

type CoordinationAuthorityEvidence = {
  workItem: string;
  canonicalHistory: RawRecord;
  actorEventNonAuthority: RawRecord;
  projectionSurfaces: RawRecord[];
  historyReplay: RawRecord;
  claimAuthorityException: RawRecord;
};

const COORDINATION_AUTHORITY_POLICY_DISPLAY_PATH =
  ".bandit/policy/coordination-authority.json";
const COORDINATION_AUTHORITY_TEMPLATE_DISPLAY_PATH =
  "docs/templates/coordination-authority.md";
const POLICY_ID = "coordination-event-log-authority";
const CANONICAL_HISTORY = "per_work_item_append_only_coordination_log";
const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "canonical_history",
  "accepted_workflow_event_families",
  "actor_event_non_authority",
  "projection_surfaces",
  "allowed_mutation_paths",
  "history_replay",
  "projection_reconciliation",
  "claim_authority_exception",
  "rationale",
  "evidence_paths"
];
const PROJECTION_SURFACES = [
  "current_state_view",
  "cockpit_status",
  "state_index",
  "sqlite_cache",
  "in_flight_registry",
  "derived_status_report"
];
const ALLOWED_PROJECTION_MUTATION_PATHS = [
  "rebuild_from_history",
  "cli_append_or_reconcile",
  "fail_closed_mechanical_repair"
];

export async function writeDefaultCoordinationAuthorityPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: POLICY_ID,
    canonical_history: CANONICAL_HISTORY,
    authoritative_event_families: ["step_transition"],
    actor_event_authority: "context_only",
    projection_surfaces: PROJECTION_SURFACES,
    allowed_projection_mutation_paths: ALLOWED_PROJECTION_MUTATION_PATHS,
    claim_authority_exception: {
      authority: "cas_claim_authority",
      status: "future_scoped"
    },
    release_authorized_decisions: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultCoordinationAuthorityTemplate(repoRoot: string) {
  const filePath = path.join(
    repoRoot,
    COORDINATION_AUTHORITY_TEMPLATE_DISPLAY_PATH
  );
  const template = `# Coordination Event Log Authority Template

work_item:
canonical_history:
accepted_workflow_event_families:
actor_event_non_authority:
projection_surfaces:
allowed_mutation_paths:
history_replay:
projection_reconciliation:
claim_authority_exception:
rationale:
evidence_paths:
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

export async function validateCoordinationAuthority(
  repoRoot: string
): Promise<CoordinationAuthorityValidationReport> {
  const policy = await readCoordinationAuthorityPolicy(repoRoot);
  await validateCoordinationAuthorityTemplate(repoRoot);
  const decisions = await validateCoordinationAuthorityDecisions(repoRoot, policy);

  return {
    status: "pass",
    policy: COORDINATION_AUTHORITY_POLICY_DISPLAY_PATH,
    decisions: decisions.map((decision) => decision.workItem),
    canonical_history: decisions.map((decision) => formatCanonicalHistory(decision)),
    projections: decisions.flatMap((decision) => formatProjections(decision)),
    claim_authority: decisions.map((decision) => formatClaimAuthority(decision))
  };
}

async function readCoordinationAuthorityPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredFile(
    paths.coordinationAuthorityPolicy,
    COORDINATION_AUTHORITY_POLICY_DISPLAY_PATH,
    "policy"
  );

  return parsePolicy(content);
}

async function validateCoordinationAuthorityTemplate(repoRoot: string) {
  const content = await readRequiredFile(
    path.join(repoRoot, COORDINATION_AUTHORITY_TEMPLATE_DISPLAY_PATH),
    COORDINATION_AUTHORITY_TEMPLATE_DISPLAY_PATH,
    "template"
  );

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${COORDINATION_AUTHORITY_TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

function parsePolicy(content: string): CoordinationAuthorityPolicy {
  const parsed = parseJsonObject(content, "coordination authority policy");

  if (parsed.contract_version !== 1) {
    throw new Error(
      "Malformed coordination authority policy: missing contract_version 1"
    );
  }

  if (parsed.policy_id !== POLICY_ID) {
    throw new Error(
      `Malformed coordination authority policy: policy_id must be ${POLICY_ID}`
    );
  }

  if (
    readRequiredString(
      parsed,
      "canonical_history",
      "coordination authority policy"
    ) !== CANONICAL_HISTORY
  ) {
    throw new Error(
      `Malformed coordination authority policy: canonical_history must be ${CANONICAL_HISTORY}`
    );
  }

  const eventFamilies = readRequiredStringList(
    parsed,
    "authoritative_event_families",
    "coordination authority policy"
  );
  if (!eventFamilies.includes("step_transition")) {
    throw new Error(
      "Malformed coordination authority policy: authoritative_event_families must include step_transition"
    );
  }

  if (
    readRequiredString(
      parsed,
      "actor_event_authority",
      "coordination authority policy"
    ) !== "context_only"
  ) {
    throw new Error(
      "Malformed coordination authority policy: actor_event_authority must be context_only"
    );
  }

  const projectionSurfaces = readRequiredStringList(
    parsed,
    "projection_surfaces",
    "coordination authority policy"
  );
  for (const surface of PROJECTION_SURFACES) {
    if (!projectionSurfaces.includes(surface)) {
      throw new Error(
        `Malformed coordination authority policy: projection_surfaces must include ${surface}`
      );
    }
  }

  const allowedMutationPaths = readRequiredStringList(
    parsed,
    "allowed_projection_mutation_paths",
    "coordination authority policy"
  );
  for (const mutationPath of ALLOWED_PROJECTION_MUTATION_PATHS) {
    if (!allowedMutationPaths.includes(mutationPath)) {
      throw new Error(
        `Malformed coordination authority policy: allowed_projection_mutation_paths must include ${mutationPath}`
      );
    }
  }

  const claimAuthority = readRequiredRecord(
    parsed,
    "claim_authority_exception",
    "coordination authority policy"
  );
  if (
    readRequiredString(
      claimAuthority,
      "authority",
      "coordination authority policy claim_authority_exception"
    ) !== "cas_claim_authority"
  ) {
    throw new Error(
      "Malformed coordination authority policy: claim_authority_exception authority must be cas_claim_authority"
    );
  }
  if (
    readRequiredString(
      claimAuthority,
      "status",
      "coordination authority policy claim_authority_exception"
    ) !== "future_scoped"
  ) {
    throw new Error(
      "Malformed coordination authority policy: claim_authority_exception status must be future_scoped"
    );
  }

  return {
    releaseAuthorizedDecisions: readDecisions(parsed)
  };
}

function readDecisions(policy: RawRecord): CoordinationAuthorityDecision[] {
  return readRequiredRecordList(
    policy,
    "release_authorized_decisions",
    "coordination authority policy"
  ).map((decision) => {
    const decisionKind = readRequiredString(
      decision,
      "decision_kind",
      "coordination authority decision"
    );
    if (decisionKind !== "projection_boundary") {
      throw new Error(
        `Unsupported coordination authority decision kind: ${decisionKind}`
      );
    }

    return {
      workItem: readRequiredString(
        decision,
        "work_item",
        "coordination authority decision"
      ),
      decisionKind,
      evidencePath: readRequiredString(
        decision,
        "evidence_path",
        "coordination authority decision"
      )
    };
  });
}

async function validateCoordinationAuthorityDecisions(
  repoRoot: string,
  policy: CoordinationAuthorityPolicy
) {
  const decisions: CoordinationAuthorityEvidence[] = [];
  const problems: string[] = [];

  for (const decision of policy.releaseAuthorizedDecisions) {
    const evidence = await readAuthorityEvidence(
      repoRoot,
      decision.evidencePath,
      decision.workItem
    );
    problems.push(...(await coordinationAuthorityProblems(repoRoot, evidence)));
    decisions.push(evidence);
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return decisions;
}

async function readAuthorityEvidence(
  repoRoot: string,
  evidencePath: string,
  expectedWorkItem: string
): Promise<CoordinationAuthorityEvidence> {
  const content = await readRequiredFile(
    path.join(repoRoot, evidencePath),
    evidencePath,
    "coordination authority evidence"
  );
  const parsed = parseJsonObject(content, "coordination authority evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed coordination authority evidence for ${expectedWorkItem}: missing contract_version 1`
    );
  }

  const workItem = readRequiredString(
    parsed,
    "work_item",
    "coordination authority evidence"
  );
  if (workItem !== expectedWorkItem) {
    throw new Error(
      `Malformed coordination authority evidence for ${expectedWorkItem}: work_item does not match`
    );
  }

  return {
    workItem,
    canonicalHistory: readRequiredRecord(
      parsed,
      "canonical_history",
      `coordination authority evidence for ${workItem}`
    ),
    actorEventNonAuthority: readRequiredRecord(
      parsed,
      "actor_event_non_authority",
      `coordination authority evidence for ${workItem}`
    ),
    projectionSurfaces: readRequiredRecordList(
      parsed,
      "projection_surfaces",
      `coordination authority evidence for ${workItem}`
    ),
    historyReplay: readRequiredRecord(
      parsed,
      "history_replay",
      `coordination authority evidence for ${workItem}`
    ),
    claimAuthorityException: readRequiredRecord(
      parsed,
      "claim_authority_exception",
      `coordination authority evidence for ${workItem}`
    )
  };
}

async function coordinationAuthorityProblems(
  repoRoot: string,
  evidence: CoordinationAuthorityEvidence
) {
  const problems: string[] = [];
  const status = await readCoordinationStatus(repoRoot, evidence.workItem);
  const historySource = readRequiredString(
    evidence.canonicalHistory,
    "workflow_position_source",
    `coordination authority evidence for ${evidence.workItem} canonical_history`
  );
  const replaySource = readRequiredString(
    evidence.historyReplay,
    "source_history",
    `coordination authority evidence for ${evidence.workItem} history_replay`
  );

  if (historySource !== replaySource) {
    problems.push(
      `coordination authority history replay source mismatch for ${evidence.workItem}`
    );
  }

  problems.push(...actorEventNonAuthorityProblems(evidence));
  problems.push(...projectionSurfaceProblems(evidence, status.current_state));
  problems.push(...claimAuthorityExceptionProblems(evidence));

  return problems;
}

function actorEventNonAuthorityProblems(evidence: CoordinationAuthorityEvidence) {
  const mayAdvanceWorkflowState = readRequiredBoolean(
    evidence.actorEventNonAuthority,
    "may_advance_workflow_state",
    `coordination authority evidence for ${evidence.workItem} actor_event_non_authority`
  );
  const maySatisfyGates = readRequiredBoolean(
    evidence.actorEventNonAuthority,
    "may_satisfy_gates",
    `coordination authority evidence for ${evidence.workItem} actor_event_non_authority`
  );
  const mayEmitSafeTriggers = readRequiredBoolean(
    evidence.actorEventNonAuthority,
    "may_emit_safe_triggers",
    `coordination authority evidence for ${evidence.workItem} actor_event_non_authority`
  );

  if (mayAdvanceWorkflowState || maySatisfyGates || mayEmitSafeTriggers) {
    return [
      "actor coordination events cannot advance workflow stages, satisfy gates, or emit safe triggers"
    ];
  }

  return [];
}

function projectionSurfaceProblems(
  evidence: CoordinationAuthorityEvidence,
  currentState: string
) {
  const problems: string[] = [];

  for (const surface of evidence.projectionSurfaces) {
    const name = readRequiredString(
      surface,
      "name",
      `coordination authority projection for ${evidence.workItem}`
    );
    const authority = readRequiredString(
      surface,
      "authority",
      `coordination authority projection ${name}`
    );
    const sourceHistoryRefs = readRequiredStringList(
      surface,
      "source_history_refs",
      `coordination authority projection ${name}`
    );
    const claimAuthorityRefs = readRequiredStringList(
      surface,
      "claim_authority_refs",
      `coordination authority projection ${name}`
    );
    const mutationPath = readRequiredString(
      surface,
      "mutation_path",
      `coordination authority projection ${name}`
    );
    const grantsClaims = readRequiredBoolean(
      surface,
      "grants_release_authorized_claims",
      `coordination authority projection ${name}`
    );
    const reportedCurrentState = readOptionalString(surface, "reported_current_state");

    if (authority !== "derived_non_canonical") {
      problems.push(`projection ${name} cannot claim canonical workflow authority`);
    }

    if (sourceHistoryRefs.length === 0 && claimAuthorityRefs.length === 0) {
      problems.push(
        `projection ${name} requires source_history_refs or claim_authority_refs`
      );
    }

    if (mutationPath === "direct_projection_write") {
      problems.push(
        `projection ${name} cannot mutate release-authorized workflow state directly`
      );
    }

    if (reportedCurrentState && reportedCurrentState !== currentState) {
      problems.push(
        `projection ${name} disagrees with append-only history for ${evidence.workItem}`
      );
    }

    if (grantsClaims && claimAuthorityRefs.length === 0) {
      if (
        name === "in_flight_registry" ||
        surface.surface === "in_flight_registry"
      ) {
        problems.push(
          "in-flight registry cannot grant release-authorized writable claims without CAS claim-authority backing"
        );
      } else {
        problems.push(
          `projection ${name} cannot grant release-authorized writable claims without CAS claim-authority backing`
        );
      }
    }
  }

  return problems;
}

function claimAuthorityExceptionProblems(evidence: CoordinationAuthorityEvidence) {
  const authority = readRequiredString(
    evidence.claimAuthorityException,
    "authority",
    `coordination authority evidence for ${evidence.workItem} claim_authority_exception`
  );
  const referencePaths = readRequiredStringList(
    evidence.claimAuthorityException,
    "reference_paths",
    `coordination authority evidence for ${evidence.workItem} claim_authority_exception`
  );
  const projectionsMayGrantClaims = readRequiredBoolean(
    evidence.claimAuthorityException,
    "projections_may_grant_claims",
    `coordination authority evidence for ${evidence.workItem} claim_authority_exception`
  );

  if (
    authority.startsWith(".bandit/") ||
    referencePaths.some((reference) => reference.startsWith(".bandit/")) ||
    (projectionsMayGrantClaims && authority !== "cas_claim_authority")
  ) {
    return [".bandit claim or registry files cannot be independent claim authority"];
  }

  return [];
}

function formatCanonicalHistory(evidence: CoordinationAuthorityEvidence) {
  return `${evidence.workItem}:${readRequiredString(
    evidence.canonicalHistory,
    "workflow_position_source",
    `coordination authority evidence for ${evidence.workItem} canonical_history`
  )}`;
}

function formatProjections(evidence: CoordinationAuthorityEvidence) {
  return evidence.projectionSurfaces.map((surface) => {
    const name = readRequiredString(
      surface,
      "name",
      `coordination authority projection for ${evidence.workItem}`
    );
    const authority = readRequiredString(
      surface,
      "authority",
      `coordination authority projection ${name}`
    );
    return `${evidence.workItem}:${name}:${authority}`;
  });
}

function formatClaimAuthority(evidence: CoordinationAuthorityEvidence) {
  const status = readRequiredString(
    evidence.claimAuthorityException,
    "status",
    `coordination authority evidence for ${evidence.workItem} claim_authority_exception`
  );
  return `${evidence.workItem}:${status}`;
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
  kind: "policy" | "template" | "coordination authority evidence"
) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      if (kind === "coordination authority evidence") {
        throw new Error(
          `Missing required coordination authority evidence: ${displayPath}`
        );
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

function readOptionalString(record: RawRecord, field: string) {
  const value = record[field];
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
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

function readRequiredBoolean(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${label}: missing ${field}`);
  }
  return value;
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
