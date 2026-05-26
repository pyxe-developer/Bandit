import type { CockpitStatus } from "./cockpit-status.js";

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
  evidence_drilldown: {
    sources: string[];
    shows_hash_state: boolean;
    shows_gate_basis: boolean;
  };
  status_cues: StatusCue[];
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

export function buildCockpitViewModel(status: CockpitStatus): CockpitViewModel {
  const activeStage = readActiveStage(status);
  const attentionCategories = ATTENTION_CATEGORY_ORDER.map((categoryId) =>
    buildAttentionCategory(categoryId, status)
  );

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
      sources: buildEvidenceSources(status),
      shows_hash_state: true,
      shows_gate_basis: true
    },
    status_cues: buildStatusCues(status),
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

function buildAttentionCategory(categoryId: AttentionCategoryId, status: CockpitStatus) {
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
    status: status.bootstrap_gaps.status,
    source: status.bootstrap_gaps.source
  };
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

function buildGateStrip(status: CockpitStatus) {
  return Object.entries(status.gates)
    .slice(0, 4)
    .map(([gateId, gate]) => ({
      id: gateId,
      status: gate.status,
      confidence: gateConfidence(gateId, gate)
    }));
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

function buildStatusCues(status: CockpitStatus): StatusCue[] {
  return [
    {
      id: "current_phase",
      label: "Phase",
      status: status.current_phase.value,
      source: status.current_phase.source
    },
    {
      id: "next_action",
      label: "Next action",
      status: status.next_action.agreement.status,
      source: status.next_action.source
    },
    {
      id: "bootstrap_gaps",
      label: "Bootstrap gaps",
      status: status.bootstrap_gaps.status,
      source: status.bootstrap_gaps.source
    },
    {
      id: "landing_readiness",
      label: "Landing",
      status: status.landing_readiness.status,
      source: status.landing_readiness.source
    },
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
