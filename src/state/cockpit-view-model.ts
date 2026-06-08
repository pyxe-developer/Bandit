import type { CockpitStatus } from "./cockpit-status.js";
import {
  deriveCockpitActionAffordances,
  type CockpitActionAffordance
} from "./cockpit-actions.ts";
import {
  buildCockpitEvidenceDetail,
  type CockpitEvidenceDetail
} from "./cockpit-evidence-detail.ts";
import {
  buildCockpitImprovementHealthSurface,
  type CockpitImprovementHealthSurface
} from "./cockpit-improvement-health.ts";
import type { ImprovementCandidate } from "./improvements.ts";

type AttentionCategoryId =
  | "operator_input_required"
  | "blocked_or_stale"
  | "active_work_next_action"
  | "landing_readiness"
  | "improvement_health"
  | "queue_context";

type ConfidenceCue =
  | {
      state: string;
      source: string;
    }
  | {
      state: string;
      sources: string[];
    };

type StatusCue = {
  id: string;
  label: string;
  status: string;
  source?: string;
  sources?: string[];
};

type LightQueueContext = {
  kind: "light_queue_context";
  status: "clear" | "needs_attention";
  summary: string;
  sources: string[];
  excluded_authority: string[];
};

export type CockpitViewModel = {
  kind: "attention_first_cockpit_view_model";
  authority: "presentation_derived_non_canonical";
  attention_categories: Array<{
    id: AttentionCategoryId;
    label: string;
    status: string;
    source?: string;
    sources?: string[];
  }>;
  primary_attention: {
    category: AttentionCategoryId;
    work_item: string;
    title: string;
    next_action: string;
    confidence: ConfidenceCue;
  };
  active_work: {
    id: string;
    stage: string;
    next_action: string;
    source: string;
  };
  gate_strip: Array<{
    id: string;
    status: string;
    confidence: ConfidenceCue;
  }>;
  evidence_drilldown: CockpitEvidenceDetail & {
    sources: string[];
    shows_hash_state: boolean;
    shows_gate_basis: boolean;
  };
  action_affordances: CockpitActionAffordance[];
  queue_context: LightQueueContext;
  status_cues: StatusCue[];
  improvement_health_surface: CockpitImprovementHealthSurface;
  canonical_state_owner: "repo_native_artifacts_via_bandit_cli";
  prohibited_authority: string[];
  writes_repo_artifacts: false;
  approves_uat: false;
  decides_landing_safety: false;
};

const ATTENTION_CATEGORY_ORDER: AttentionCategoryId[] = [
  "operator_input_required",
  "blocked_or_stale",
  "active_work_next_action",
  "landing_readiness",
  "improvement_health",
  "queue_context"
];

const ATTENTION_LABELS: Record<AttentionCategoryId, string> = {
  operator_input_required: "Operator input required",
  blocked_or_stale: "Blocked or stale",
  active_work_next_action: "Active work",
  landing_readiness: "Landing readiness",
  improvement_health: "Improvement health",
  queue_context: "Queue context"
};

const QUEUE_CONTEXT_EXCLUDED_AUTHORITY = [
  "intake_ledger_management",
  "scheduler_execution",
  "claimability_decision",
  "workstream_queue_management"
];

type ImprovementHealthWithDetails = CockpitStatus["improvement_health"] & {
  candidate_details?: ImprovementCandidate[];
};

export function buildCockpitViewModel(status: CockpitStatus): CockpitViewModel {
  const activeStage = readActiveStage(status);
  const queueContext = buildLightQueueContext(status);
  const attentionCategories = ATTENTION_CATEGORY_ORDER.map((categoryId) =>
    buildAttentionCategory(categoryId, status, queueContext)
  );

  const extendedHealth = status.improvement_health as ImprovementHealthWithDetails;
  const candidateDetails = extendedHealth.candidate_details ?? [];
  const improvementHealthSurface = buildCockpitImprovementHealthSurface({
    status: status.improvement_health.status,
    source: status.improvement_health.source,
    sources: status.improvement_health.sources,
    candidates: candidateDetails,
    candidate_id_fallback: candidateDetails.length === 0
      ? status.improvement_health.candidates
      : undefined
  });

  return {
    kind: "attention_first_cockpit_view_model",
    authority: "presentation_derived_non_canonical",
    attention_categories: attentionCategories,
    primary_attention: buildPrimaryAttention(status),
    active_work: {
      id: status.active_work_item.id,
      stage: activeStage,
      next_action: status.next_action.value,
      source: status.active_work_item.source
    },
    gate_strip: buildGateStrip(status),
    evidence_drilldown: {
      ...buildCockpitEvidenceDetail(status),
      sources: buildEvidenceSources(status),
      shows_hash_state: true,
      shows_gate_basis: true
    },
    action_affordances: deriveCockpitActionAffordances(status),
    queue_context: queueContext,
    status_cues: buildStatusCues(status),
    improvement_health_surface: improvementHealthSurface,
    canonical_state_owner: "repo_native_artifacts_via_bandit_cli",
    prohibited_authority: [
      "browser_storage",
      "fixture_data",
      "generated_ui_state",
      "local_cache",
      "state_index",
      "web_component_state"
    ],
    writes_repo_artifacts: false,
    approves_uat: false,
    decides_landing_safety: false
  };
}

function buildAttentionCategory(
  categoryId: AttentionCategoryId,
  status: CockpitStatus,
  queueContext: LightQueueContext
) {
  if (categoryId === "operator_input_required") {
    return {
      id: categoryId,
      label: ATTENTION_LABELS[categoryId],
      status: status.required_operator_input.value,
      source: status.required_operator_input.source
    };
  }

  if (categoryId === "blocked_or_stale") {
    return {
      id: categoryId,
      label: ATTENTION_LABELS[categoryId],
      status: status.blockers.length > 0 || status.stale_evidence.length > 0
        ? "needs_attention"
        : "clear",
      sources: collectSources([
        ...status.blockers,
        ...status.stale_evidence
      ])
    };
  }

  if (categoryId === "active_work_next_action") {
    return {
      id: categoryId,
      label: ATTENTION_LABELS[categoryId],
      status: status.active_work_item.id,
      source: status.active_work_item.source
    };
  }

  if (categoryId === "landing_readiness") {
    return {
      id: categoryId,
      label: ATTENTION_LABELS[categoryId],
      status: status.landing_readiness.status,
      source: status.landing_readiness.source
    };
  }

  if (categoryId === "improvement_health") {
    return {
      id: categoryId,
      label: ATTENTION_LABELS[categoryId],
      status: status.improvement_health.status,
      sources: status.improvement_health.sources
    };
  }

  return {
    id: categoryId,
    label: ATTENTION_LABELS[categoryId],
    status: queueContext.status,
    sources: queueContext.sources
  };
}

function buildLightQueueContext(status: CockpitStatus): LightQueueContext {
  const bootstrapGapCount = status.bootstrap_gaps.gaps.length;
  const improvementCandidateCount = status.improvement_health.candidates.length;

  return {
    kind: "light_queue_context",
    status: status.bootstrap_gaps.status === "open" ? "needs_attention" : "clear",
    summary: `${formatBootstrapGapSummary(bootstrapGapCount)}; ${formatImprovementCandidateSummary(
      improvementCandidateCount
    )}.`,
    sources: uniqueStrings([
      status.bootstrap_gaps.source,
      ...status.improvement_health.sources,
      status.next_action.source
    ]),
    excluded_authority: QUEUE_CONTEXT_EXCLUDED_AUTHORITY
  };
}

function formatBootstrapGapSummary(count: number) {
  if (count === 0) {
    return "No open bootstrap gaps";
  }

  return `${count} open bootstrap ${count === 1 ? "gap" : "gaps"}`;
}

function formatImprovementCandidateSummary(count: number) {
  return `${count} improvement ${count === 1 ? "candidate is" : "candidates are"} visible`;
}

function buildPrimaryAttention(status: CockpitStatus) {
  const operatorBlocker = status.blockers.find(
    (blocker) => blocker.kind === "operator_input_required"
  );

  if (operatorBlocker) {
    return {
      category: "operator_input_required" as const,
      work_item: status.active_work_item.id,
      title: "External reviewer setup is blocked",
      next_action: operatorBlocker.summary,
      confidence: {
        state: "blocked_by_operator_input",
        source: operatorBlocker.source
      }
    };
  }

  if (status.blockers.length > 0) {
    const blocker = status.blockers[0];
    return {
      category: "blocked_or_stale" as const,
      work_item: status.active_work_item.id,
      title: "Workflow is blocked",
      next_action: blocker?.summary ?? status.next_action.value,
      confidence: {
        state: "blocked",
        source: blocker?.source ?? status.next_action.source
      }
    };
  }

  return {
    category: "active_work_next_action" as const,
    work_item: status.active_work_item.id,
    title: "Next action",
    next_action: status.next_action.value,
    confidence: {
      state: "source_linked",
      source: status.next_action.source
    }
  };
}

const COMPACT_GATE_STRIP_LENGTH = 4;

function buildGateStrip(status: CockpitStatus) {
  const gateEntries = Object.entries(status.gates);
  const visibleGateEntries = rendersFullGateStrip(status)
    ? gateEntries
    : gateEntries.slice(0, COMPACT_GATE_STRIP_LENGTH);

  return visibleGateEntries.map(([gateId, gate]) => ({
    id: gateId,
    status: gate.status,
    confidence: gateConfidence(gateId, gate)
  }));
}

// The live CLI payload carries coordination state, which marks the full
// Stage 0 through Stage 6 live-status view. Payloads without coordination keep
// the compact pre-coordination gate strip.
function rendersFullGateStrip(status: CockpitStatus) {
  return status.coordination !== null;
}

function gateConfidence(
  gateId: string,
  gate: { status: string; source?: string; sources?: string[] }
): ConfidenceCue {
  if (gate.sources) {
    return {
      state: "source_linked",
      sources: gate.sources
    };
  }

  const source = gate.source ?? "unknown";
  if (gate.status === "pass") {
    return {
      state: "source_linked",
      source
    };
  }

  if (gateId === "stage_3_implementation") {
    return {
      state: "blocked_until_prior_gate",
      source
    };
  }

  return {
    state: "missing_evidence",
    source
  };
}

function buildEvidenceSources(status: CockpitStatus) {
  return uniqueStrings([
    status.current_phase.source,
    status.next_action.agreement.compared_with,
    status.active_work_item.source,
    status.gates.stage_2_red_evidence.source,
    ...status.improvement_health.sources,
    status.coordination?.source
  ]);
}

const NO_BLOCKERS_OR_STALE_EVIDENCE = "No blockers or stale evidence";
const COORDINATION_NOT_RECORDED = "not_recorded";

function buildStatusCues(status: CockpitStatus): StatusCue[] {
  return [
    {
      id: "current_phase",
      label: "Phase",
      status: status.current_phase.value,
      source: status.current_phase.source
    },
    {
      id: "active_work",
      label: "Active work",
      status: status.active_work_item.id,
      source: status.active_work_item.source
    },
    {
      id: "next_action",
      label: "Next action",
      status: status.next_action.value,
      source: status.next_action.source
    },
    {
      id: "operator_input",
      label: "Operator input",
      status: status.required_operator_input.value,
      source: status.required_operator_input.source
    },
    buildBlockersOrStaleCue(status),
    {
      id: "landing_readiness",
      label: "Landing",
      status: status.landing_readiness.status,
      source: status.landing_readiness.source
    },
    {
      id: "uat",
      label: "UAT",
      status: status.uat.status,
      source: status.uat.source
    },
    {
      id: "bootstrap_gaps",
      label: "Bootstrap gaps",
      status: status.bootstrap_gaps.status,
      source: status.bootstrap_gaps.source
    },
    buildCoordinationCue(status),
    {
      id: "improvement_health",
      label: "Improvements",
      status: status.improvement_health.status,
      sources: status.improvement_health.sources.length > 0
        ? status.improvement_health.sources
        : [status.improvement_health.source]
    }
  ];
}

function buildBlockersOrStaleCue(status: CockpitStatus): StatusCue {
  const sources = uniqueStrings([
    ...status.blockers.map((blocker) => blocker.source),
    ...status.stale_evidence.map((evidence) => evidence.source)
  ]);
  const needsAttention =
    status.blockers.length > 0 || status.stale_evidence.length > 0;

  return {
    id: "blockers_or_stale",
    label: "Blockers or stale evidence",
    status: needsAttention ? "needs_attention" : NO_BLOCKERS_OR_STALE_EVIDENCE,
    sources: sources.length > 0
      ? sources
      : [status.required_operator_input.source]
  };
}

function buildCoordinationCue(status: CockpitStatus): StatusCue {
  if (status.coordination) {
    return {
      id: "coordination_state",
      label: "Coordination",
      status: status.coordination.current_state,
      source: status.coordination.source
    };
  }

  return {
    id: "coordination_state",
    label: "Coordination",
    status: COORDINATION_NOT_RECORDED,
    source: status.active_work_item.source
  };
}

function readActiveStage(status: CockpitStatus) {
  const missingGate = Object.entries(status.gates).find(
    ([gateId, gate]) => gateId !== "stage_0_context_readiness" && gate.status === "missing"
  );

  return missingGate?.[0] ?? "closed";
}

function collectSources(items: Array<{ source: string }>) {
  return uniqueStrings(items.map((item) => item.source));
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  );
}
