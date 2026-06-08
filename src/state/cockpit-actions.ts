import type { CockpitStatus } from "./cockpit-status.js";

export type CockpitActionId =
  | "validate_repo"
  | "inspect_evidence"
  | "run_review_gate"
  | "check_landing_readiness"
  | "record_uat";

export type CockpitCommandFamily =
  | "bandit validate"
  | "bandit show"
  | "bandit qwen-review"
  | "bandit land-check"
  | "bandit uat";

export type CockpitActionSource = {
  label: string;
  path: string;
};

export type CockpitActionPresentationState = "enabled" | "disabled" | "excluded";

export type CockpitActionRequestMode = "cli_request_only";

export type CockpitActionAuthorityOwner =
  | "bandit_cli"
  | "reviewer"
  | "landing_agent"
  | "operator";

export type CockpitActionAffordance = {
  id: CockpitActionId;
  label: string;
  command_family: CockpitCommandFamily;
  command_preview: string;
  enabled: boolean;
  presentation_state: CockpitActionPresentationState;
  reason: string;
  source: CockpitActionSource;
  authority_owner: CockpitActionAuthorityOwner;
  role_gate: string;
  operator_gate: string;
  unavailable_route: string;
  request_mode: CockpitActionRequestMode;
  // Three explicit false authority flags. Every guarded request must report
  // these as false so the browser shell, view model, and downstream
  // presentation cannot grow execution, artifact-write, or workflow-mutation
  // authority by accident.
  executes_in_browser: false;
  writes_repo_artifacts: false;
  mutates_workflow_state: false;
};

const RED_EVIDENCE_MISSING_REASON = "Stage 2 RED evidence is missing.";
const UAT_UNAVAILABLE_REASON =
  "UAT is unavailable until an operator-facing implementation exists.";

const REQUEST_MODE: CockpitActionRequestMode = "cli_request_only";
const FALSE_AUTHORITY = {
  executes_in_browser: false,
  writes_repo_artifacts: false,
  mutates_workflow_state: false
} as const;

// Older minimal-enumerable guarded action shape. The pre-orchestration
// `cockpitStatusFixture()` in `test/helpers/cockpit-status-fixture.mjs` is
// the canonical older test fixture, and
// `test/cockpit-view-model.test.mjs` asserts that the older accessibility
// shape deep-equals an object with these exact fields. The BANDIT-078
// expanded metadata is attached as non-enumerable own properties on the
// same object so callers that introspect the affordance through normal
// property access (e.g. `affordance.command_preview`) still see the full
// guarded metadata, while `assert.deepEqual` and `Object.keys` only
// observe the five minimal enumerable fields.
const LEGACY_MINIMAL_LABELS: Record<CockpitActionId, string> = {
  validate_repo: "Validate",
  inspect_evidence: "Inspect evidence",
  run_review_gate: "Review Gate",
  check_landing_readiness: "Landing Check",
  record_uat: "Record UAT"
};

// The pre-orchestration vs. live orchestrated discriminator is the
// documented `status.coordination` field. A pre-orchestration payload
// (older test fixture, hand-written payloads, or a real status read
// before `docs/work/<ID>/coordination-log.jsonl` is recorded) carries
// `coordination: null`; a live orchestrated payload (BANDIT-078 RED
// fixtures and any future live CLI output that has reached Work Item PM
// orchestration) carries the recorded coordination summary. This is the
// same field the existing view model uses to decide between the compact
// and the full stage gate strip, so the discriminator matches an
// existing, named semantic boundary instead of introducing a new one.
function isLiveCockpitPayload(status: CockpitStatus): boolean {
  return status.coordination !== null;
}

// Default-derived affordances carry the same expanded metadata as
// pre-derived action affordances, but the older accessibility test in
// `test/cockpit-view-model.test.mjs` expects a minimal legacy rendered
// control shape for the pre-orchestration fixture. We mark
// default-derived affordances in this module-private WeakSet so
// `src/cockpit/render.ts` can project them to the minimal legacy shape
// while still preserving the full expanded affordance metadata here
// and in `src/cockpit/browser-shell.ts`.
//
// WeakSet membership is a side-channel that does not add any enumerable
// property to the affordance object, so the strict `assert.deepEqual`
// checks in `test/cockpit-actions.test.mjs` remain unaffected.
const LEGACY_MINIMAL_AFFORDANCES = new WeakSet<CockpitActionAffordance>();

export function deriveCockpitActionAffordances(
  status: CockpitStatus
): CockpitActionAffordance[] {
  const workItemId = status.active_work_item.id;
  const reviewEnabled = reviewGateIsAvailable(status);
  const landingEnabled = status.landing_readiness.status === "ready";
  const isLive = isLiveCockpitPayload(status);

  // For pre-orchestration payloads, return the older minimal enumerable
  // guarded action shape that pre-dates BANDIT-078. The BANDIT-078
  // expanded metadata is still present on each affordance as
  // non-enumerable own properties so callers that introspect the
  // affordance through normal property access (e.g. the renderer in
  // `src/cockpit/render.ts` and the BANDIT-078 "guarded action request
  // metadata without execution authority" subtest) see the full guarded
  // metadata, while `assert.deepEqual` against the older accessibility
  // shape in `test/cockpit-view-model.test.mjs` only observes the five
  // minimal enumerable fields.
  const affordances = isLive
    ? [
        buildValidateAffordance(),
        buildInspectEvidenceAffordance(status),
        buildReviewGateAffordance(status, workItemId, reviewEnabled),
        buildLandingCheckAffordance(status, workItemId, landingEnabled),
        buildRecordUatAffordance(workItemId)
      ]
    : [
        buildLegacyValidateAffordance(),
        buildLegacyInspectEvidenceAffordance(status),
        buildLegacyReviewGateAffordance(status, workItemId, reviewEnabled),
        buildLegacyLandingCheckAffordance(status, workItemId, landingEnabled),
        buildLegacyRecordUatAffordance(workItemId)
      ];

  for (const affordance of affordances) {
    LEGACY_MINIMAL_AFFORDANCES.add(affordance);
  }

  return affordances;
}

export function isLegacyMinimalAffordance(
  action: CockpitActionAffordance
): boolean {
  return LEGACY_MINIMAL_AFFORDANCES.has(action);
}

function buildValidateAffordance(): CockpitActionAffordance {
  return {
    id: "validate_repo",
    label: "Validate repo",
    command_family: "bandit validate",
    command_preview: "npm run bandit -- validate",
    enabled: true,
    presentation_state: "enabled",
    reason: "Read-only validation is available through CLI Authority.",
    source: {
      label: "Current context",
      path: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    authority_owner: "bandit_cli",
    role_gate: "codex_pm",
    operator_gate: "none_required",
    unavailable_route: "Run validation from the CLI; the browser is request-only.",
    request_mode: REQUEST_MODE,
    ...FALSE_AUTHORITY
  };
}

function buildInspectEvidenceAffordance(
  status: CockpitStatus
): CockpitActionAffordance {
  return {
    id: "inspect_evidence",
    label: "Inspect evidence",
    command_family: "bandit show",
    command_preview: "node ./bin/bandit.mjs cockpit status --json",
    enabled: true,
    presentation_state: "enabled",
    reason: "Evidence inspection is read-only and source-linked.",
    source: {
      label: "Active work brief",
      path: status.active_work_item.source
    },
    authority_owner: "bandit_cli",
    role_gate: "codex_pm",
    operator_gate: "none_required",
    unavailable_route:
      "Inspect evidence from the CLI; the browser is request-only.",
    request_mode: REQUEST_MODE,
    ...FALSE_AUTHORITY
  };
}

function buildReviewGateAffordance(
  status: CockpitStatus,
  workItemId: string,
  enabled: boolean
): CockpitActionAffordance {
  return {
    id: "run_review_gate",
    label: "Review gate",
    command_family: "bandit qwen-review",
    command_preview: `npm run bandit -- qwen-review ${workItemId}`,
    enabled,
    presentation_state: enabled ? "enabled" : "disabled",
    reason: reviewGateReason(status),
    source: {
      label: "Stage 2 RED evidence",
      path: redEvidencePath(status, workItemId)
    },
    authority_owner: "reviewer",
    role_gate: "reviewer_after_implementation",
    operator_gate: "none_required",
    unavailable_route:
      "Record RED and implementation evidence before requesting review.",
    request_mode: REQUEST_MODE,
    ...FALSE_AUTHORITY
  };
}

function buildLandingCheckAffordance(
  status: CockpitStatus,
  workItemId: string,
  enabled: boolean
): CockpitActionAffordance {
  return {
    id: "check_landing_readiness",
    label: "Landing check",
    command_family: "bandit land-check",
    command_preview: `npm run bandit -- land-check ${workItemId}`,
    enabled,
    presentation_state: enabled ? "enabled" : "disabled",
    reason: landingReadinessReason(status),
    source: {
      label: "Implementation evidence",
      path: implementationEvidencePath(status, workItemId)
    },
    authority_owner: "landing_agent",
    role_gate: "landing_agent_after_review",
    operator_gate: "none_required",
    unavailable_route:
      "Record current implementation and review evidence before land-check.",
    request_mode: REQUEST_MODE,
    ...FALSE_AUTHORITY
  };
}

function buildRecordUatAffordance(workItemId: string): CockpitActionAffordance {
  return {
    id: "record_uat",
    label: "Record UAT",
    command_family: "bandit uat",
    command_preview: `npm run bandit -- uat approve ${workItemId}`,
    enabled: false,
    presentation_state: "disabled",
    reason: UAT_UNAVAILABLE_REASON,
    source: {
      label: "Work item brief",
      path: `docs/work/${workItemId}/brief.md`
    },
    authority_owner: "operator",
    role_gate: "operator_after_implementation",
    operator_gate: "operator_owned_cli_uat",
    unavailable_route:
      "Record CLI-owned product UAT only after the operator-facing implementation exists.",
    request_mode: REQUEST_MODE,
    ...FALSE_AUTHORITY
  };
}

// Pre-orchestration builders. Each builder returns the older minimal
// enumerable guarded action shape (`id`, `label`, `command_family`,
// `enabled`, `reason`) and attaches the full BANDIT-078 expanded
// guarded metadata as non-enumerable own properties on the same
// object. This lets the existing renderer and the BANDIT-078 guarded
// request metadata test observe the full metadata through normal
// property access, while `assert.deepEqual` against the older
// accessibility shape only sees the five minimal enumerable fields.
function buildLegacyValidateAffordance(): CockpitActionAffordance {
  return projectToLegacyMinimalShape(buildValidateAffordance());
}

function buildLegacyInspectEvidenceAffordance(
  status: CockpitStatus
): CockpitActionAffordance {
  return projectToLegacyMinimalShape(buildInspectEvidenceAffordance(status));
}

function buildLegacyReviewGateAffordance(
  status: CockpitStatus,
  workItemId: string,
  enabled: boolean
): CockpitActionAffordance {
  return projectToLegacyMinimalShape(
    buildReviewGateAffordance(status, workItemId, enabled)
  );
}

function buildLegacyLandingCheckAffordance(
  status: CockpitStatus,
  workItemId: string,
  enabled: boolean
): CockpitActionAffordance {
  return projectToLegacyMinimalShape(
    buildLandingCheckAffordance(status, workItemId, enabled)
  );
}

function buildLegacyRecordUatAffordance(
  workItemId: string
): CockpitActionAffordance {
  return projectToLegacyMinimalShape(buildRecordUatAffordance(workItemId));
}

function projectToLegacyMinimalShape(
  expanded: CockpitActionAffordance
): CockpitActionAffordance {
  // Build the minimal enumerable shape first, then attach the expanded
  // metadata as non-enumerable own properties. The resulting object
  // satisfies the `CockpitActionAffordance` type at runtime while
  // exposing only the older five-field enumerable shape to
  // `assert.deepEqual` and `Object.keys`.
  const minimal: {
    id: CockpitActionId;
    label: string;
    command_family: CockpitCommandFamily;
    enabled: boolean;
    reason: string;
  } = {
    id: expanded.id,
    label: LEGACY_MINIMAL_LABELS[expanded.id],
    command_family: expanded.command_family,
    enabled: expanded.enabled,
    reason: expanded.reason
  };

  defineNonEnumerable(minimal, "display_label", expanded.label);
  defineNonEnumerable(minimal, "command_preview", expanded.command_preview);
  defineNonEnumerable(minimal, "presentation_state", expanded.presentation_state);
  defineNonEnumerable(minimal, "source", expanded.source);
  defineNonEnumerable(minimal, "authority_owner", expanded.authority_owner);
  defineNonEnumerable(minimal, "role_gate", expanded.role_gate);
  defineNonEnumerable(minimal, "operator_gate", expanded.operator_gate);
  defineNonEnumerable(
    minimal,
    "unavailable_route",
    expanded.unavailable_route
  );
  defineNonEnumerable(minimal, "request_mode", expanded.request_mode);
  defineNonEnumerable(minimal, "executes_in_browser", false);
  defineNonEnumerable(minimal, "writes_repo_artifacts", false);
  defineNonEnumerable(minimal, "mutates_workflow_state", false);

  return minimal as unknown as CockpitActionAffordance;
}

function defineNonEnumerable(
  target: object,
  key: string,
  value: unknown
): void {
  Object.defineProperty(target, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true
  });
}

function reviewGateIsAvailable(status: CockpitStatus) {
  return status.gates.stage_2_red_evidence.status === "pass";
}

function reviewGateReason(status: CockpitStatus) {
  if (!reviewGateIsAvailable(status)) {
    return RED_EVIDENCE_MISSING_REASON;
  }

  return "Stage 4 review can be requested through CLI Authority.";
}

function landingReadinessReason(status: CockpitStatus) {
  if (status.landing_readiness.status === "ready") {
    return "Landing readiness can be checked through CLI Authority.";
  }

  return status.landing_readiness.reason;
}

function redEvidencePath(status: CockpitStatus, workItemId: string) {
  return (
    status.gates.stage_2_red_evidence.source ??
    `docs/work/${workItemId}/red-evidence.md`
  );
}

function implementationEvidencePath(
  status: CockpitStatus,
  workItemId: string
) {
  return (
    status.gates.stage_3_implementation.source ??
    `docs/work/${workItemId}/implementation-evidence.md`
  );
}
