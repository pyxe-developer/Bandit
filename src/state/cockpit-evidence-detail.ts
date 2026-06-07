import type { CockpitStatus } from "./cockpit-status.js";

// Presentation-only projection of the current cockpit status payload into a
// Stage 0 through Stage 6 gate matrix and an evidence drilldown. This boundary
// derives display rows from repo-native CLI evidence; it never parses or
// mutates canonical artifacts and carries no workflow authority.

export type GateMatrixRow = {
  id: string;
  label: string;
  status: string;
  owner_or_authority_role: string;
  sources: string[];
  freshness_state: string;
  reason: string;
  next_repair_route: string;
};

export type EvidenceDetailRow = {
  id: string;
  label: string;
  status: string;
  sources: string[];
  reason: string;
};

export type CockpitEvidenceDetail = {
  kind: "cockpit_evidence_detail";
  authority: "presentation_derived_non_canonical";
  gate_matrix: GateMatrixRow[];
  detail_rows: EvidenceDetailRow[];
  writes_repo_artifacts: false;
  approves_uat: false;
  decides_landing_safety: false;
  mutation_forms: never[];
};

type StageDefinition = {
  id: string;
  label: string;
  default_owner: string;
};

type StageTrustSignal = {
  owner_or_authority_role?: string;
  freshness_state?: string;
  staleness_reason?: string;
};

type RawGate = {
  status: string;
  source?: string;
  sources?: string[];
};

const GATE_STAGES: StageDefinition[] = [
  {
    id: "stage_0_context_readiness",
    label: "Stage 0 context readiness",
    default_owner: "codex_pm"
  },
  { id: "stage_1_brief", label: "Stage 1 brief", default_owner: "codex_pm" },
  {
    id: "stage_2_red_evidence",
    label: "Stage 2 RED evidence",
    default_owner: "test_writer"
  },
  {
    id: "stage_3_implementation",
    label: "Stage 3 implementation",
    default_owner: "writer"
  },
  { id: "stage_4_review", label: "Stage 4 review", default_owner: "reviewer" },
  { id: "stage_5_landing", label: "Stage 5 landing", default_owner: "landing_agent" },
  {
    id: "stage_6_retrospective",
    label: "Stage 6 retrospective",
    default_owner: "codex_pm"
  }
];

const MISSING_REPAIR_ROUTE: Record<string, string> = {
  stage_0_context_readiness: "Confirm Stage 0 context readiness sources.",
  stage_1_brief: "Record the Stage 1 brief and formation evidence.",
  stage_2_red_evidence: "Record Test Writer-owned RED evidence before implementation.",
  stage_3_implementation: "Record Stage 3 implementation evidence.",
  stage_4_review: "Record Stage 4 reviewer evidence.",
  stage_5_landing: "Record the Stage 5 landing verdict and action.",
  stage_6_retrospective: "Record the Stage 6 retrospective and closeout."
};

const STALE_REPAIR_ROUTE: Record<string, string> = {
  stage_4_review: "Refresh review evidence for the current review subject.",
  stage_5_landing: "Refresh the landing verdict for the current subject."
};

const UAT_REASON = "Feature UAT is required before landing once implementation exists.";

export function buildCockpitEvidenceDetail(
  status: CockpitStatus
): CockpitEvidenceDetail {
  return {
    kind: "cockpit_evidence_detail",
    authority: "presentation_derived_non_canonical",
    gate_matrix: buildGateMatrix(status),
    detail_rows: buildDetailRows(status),
    writes_repo_artifacts: false,
    approves_uat: false,
    decides_landing_safety: false,
    mutation_forms: []
  };
}

function buildGateMatrix(status: CockpitStatus): GateMatrixRow[] {
  const signals = readStageSignals(status);
  const gates = status.gates as unknown as Record<string, RawGate>;

  return GATE_STAGES.map((stage) => {
    const gate = gates[stage.id];
    const gateStatus = gate?.status ?? "missing";
    const signal = signals[stage.id];
    const freshnessState =
      signal?.freshness_state ?? defaultFreshnessState(gateStatus);
    const reason = signal?.staleness_reason ?? defaultReason(gateStatus);

    return {
      id: stage.id,
      label: stage.label,
      status: gateStatus,
      owner_or_authority_role: signal?.owner_or_authority_role ?? stage.default_owner,
      sources: gateSources(gate),
      freshness_state: freshnessState,
      reason,
      next_repair_route: repairRoute(stage.id, gateStatus, freshnessState)
    };
  });
}

function buildDetailRows(status: CockpitStatus): EvidenceDetailRow[] {
  return [
    buildReviewEvidenceRow(status),
    buildLandingReadinessRow(status),
    buildUatRow(status),
    buildCoordinationRow(status),
    buildBootstrapGapsRow(status),
    buildStaleEvidenceRow(status),
    buildTrustSignalsRow(status)
  ];
}

function buildReviewEvidenceRow(status: CockpitStatus): EvidenceDetailRow {
  const signal = readStageSignals(status).stage_4_review;
  const gate = (status.gates as unknown as Record<string, RawGate>).stage_4_review;
  const gateStatus = gate?.status ?? "missing";

  return {
    id: "review_evidence",
    label: "Review evidence",
    status: signal?.freshness_state ?? defaultFreshnessState(gateStatus),
    sources: gateSources(gate),
    reason: signal?.staleness_reason ?? defaultReason(gateStatus)
  };
}

function buildLandingReadinessRow(status: CockpitStatus): EvidenceDetailRow {
  return {
    id: "landing_readiness",
    label: "Landing readiness",
    status: status.landing_readiness.status,
    sources: [status.landing_readiness.source],
    reason: status.landing_readiness.reason
  };
}

function buildUatRow(status: CockpitStatus): EvidenceDetailRow {
  return {
    id: "uat",
    label: "UAT",
    status: status.uat.status,
    sources: [status.uat.source],
    reason: UAT_REASON
  };
}

function buildCoordinationRow(status: CockpitStatus): EvidenceDetailRow {
  if (status.coordination) {
    return {
      id: "coordination",
      label: "Coordination",
      status: status.coordination.current_state,
      sources: [status.coordination.source],
      reason: status.coordination.next_action ?? "Coordination state is recorded."
    };
  }

  return {
    id: "coordination",
    label: "Coordination",
    status: "not_recorded",
    sources: [status.active_work_item.source],
    reason: "Coordination log is not recorded."
  };
}

function buildBootstrapGapsRow(status: CockpitStatus): EvidenceDetailRow {
  const firstGap = status.bootstrap_gaps.gaps[0];
  if (firstGap) {
    return {
      id: "bootstrap_gaps",
      label: "Bootstrap gaps",
      status: status.bootstrap_gaps.status,
      sources: uniqueStrings([
        status.bootstrap_gaps.source,
        ...firstGap.source_artifacts
      ]),
      reason: `${firstGap.id}: ${firstGap.next_action}`
    };
  }

  return {
    id: "bootstrap_gaps",
    label: "Bootstrap gaps",
    status: status.bootstrap_gaps.status,
    sources: [status.bootstrap_gaps.source],
    reason: "No open bootstrap gaps."
  };
}

function buildStaleEvidenceRow(status: CockpitStatus): EvidenceDetailRow {
  const staleEvidence = status.stale_evidence;
  if (staleEvidence.length > 0) {
    return {
      id: "stale_evidence",
      label: "Stale evidence",
      status: "stale",
      sources: uniqueStrings(staleEvidence.map((item) => item.source)),
      reason: staleEvidence.map((item) => item.basis).join(", ")
    };
  }

  return {
    id: "stale_evidence",
    label: "Stale evidence",
    status: "clear",
    sources: [],
    reason: "No stale evidence."
  };
}

function buildTrustSignalsRow(status: CockpitStatus): EvidenceDetailRow {
  const signals = readStageSignals(status);
  const stageIds = Object.keys(signals);
  const sources = uniqueStrings(
    stageIds.map((stageId) => (signals[stageId] as { source?: string })?.source)
  );

  return {
    id: "evidence_trust_signals",
    label: "Evidence Trust Signals",
    status: stageIds.length > 0 ? "available" : "unavailable",
    sources,
    reason: `Artifact-specific Evidence Trust Signals are available for ${stageIds.length} stage gates.`
  };
}

function readStageSignals(status: CockpitStatus): Record<string, StageTrustSignal> {
  return (status.evidence_trust_signals?.gates ?? {}) as unknown as Record<
    string,
    StageTrustSignal
  >;
}

function gateSources(gate: RawGate | undefined): string[] {
  if (!gate) return [];
  if (gate.sources) return gate.sources;
  return gate.source ? [gate.source] : [];
}

function defaultFreshnessState(gateStatus: string): string {
  return gateStatus === "pass" ? "current" : "missing";
}

function defaultReason(gateStatus: string): string {
  return gateStatus === "pass" ? "none" : "missing_required_stage_evidence";
}

function repairRoute(
  stageId: string,
  gateStatus: string,
  freshnessState: string
): string {
  if (gateStatus === "pass" && freshnessState === "current") {
    return "No repair required.";
  }
  if (freshnessState === "stale") {
    return STALE_REPAIR_ROUTE[stageId] ?? "Refresh stage evidence for the current subject.";
  }
  return MISSING_REPAIR_ROUTE[stageId] ?? "Record the required stage evidence.";
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  );
}
