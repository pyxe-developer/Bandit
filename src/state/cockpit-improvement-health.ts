import type { ImprovementCandidate, WorkflowTrialGuardrails } from "./improvements.ts";

export type ImprovementHealthInput = {
  status: string;
  source: string;
  sources: string[];
  candidates: ImprovementCandidate[];
  candidate_id_fallback?: string[];
};

export type GuardrailPresentation = {
  status: "complete" | "missing_metadata";
  decision_criteria: string;
  uncertainty: string;
  reevaluation_window: string;
  proxy_risk: string;
};

export type ImprovementHealthRow = {
  id: string;
  status: string;
  outcome: string;
  state: "pending" | "evaluated" | "missing_metadata";
  source_work_item: string;
  source_artifacts: string[];
  metric: string;
  baseline: string;
  expected_direction: string;
  evaluation_window: string;
  guardrails: GuardrailPresentation;
  next_route: string;
};

export type ImprovementHealthSummary = {
  total: number;
  pending: number;
  evaluated: number;
  keep: number;
  revise: number;
  revert: number;
  double_down: number;
  missing_metadata: number;
};

export type CockpitImprovementHealthSurface = {
  kind: "cockpit_improvement_health_surface";
  authority: "presentation_derived_non_canonical";
  summary: ImprovementHealthSummary;
  rows: ImprovementHealthRow[];
  writes_repo_artifacts: false;
  evaluates_candidates: false;
  records_outcomes: false;
  schedules_work: false;
  changes_policy: false;
};

const MISSING_GUARDRAIL = "missing";

const NEXT_ROUTE_MISSING_GUARDRAILS =
  "Record workflow-trial guardrail metadata before presenting this as healthy.";
const NEXT_ROUTE_EVALUATED =
  "Review keep decision and re-evaluation window from source evidence.";
const NEXT_ROUTE_PENDING =
  "Wait for the recorded evaluation window or route through improvements evaluation.";

export function buildCockpitImprovementHealthSurface(
  input: ImprovementHealthInput
): CockpitImprovementHealthSurface {
  const candidateRows = input.candidates.map(buildRow);
  const fallbackRows = candidateRows.length === 0
    ? (input.candidate_id_fallback ?? []).map((id) =>
        buildFallbackRow(id, input.source, input.sources)
      )
    : [];
  const rows = [...candidateRows, ...fallbackRows].sort((a, b) => a.id.localeCompare(b.id));

  return {
    kind: "cockpit_improvement_health_surface",
    authority: "presentation_derived_non_canonical",
    summary: buildSummary(rows),
    rows,
    writes_repo_artifacts: false,
    evaluates_candidates: false,
    records_outcomes: false,
    schedules_work: false,
    changes_policy: false
  };
}

function buildRow(candidate: ImprovementCandidate): ImprovementHealthRow {
  if (!candidate.workflow_trial_guardrails) {
    return {
      id: candidate.id,
      status: candidate.status,
      outcome: candidate.outcome,
      state: "missing_metadata",
      source_work_item: candidate.source_work_item,
      source_artifacts: candidate.source_artifacts,
      metric: candidate.metric,
      baseline: candidate.baseline,
      expected_direction: candidate.expected_direction,
      evaluation_window: candidate.evaluation_window,
      guardrails: missingGuardrails(),
      next_route: NEXT_ROUTE_MISSING_GUARDRAILS
    };
  }

  const state = candidate.status === "evaluated"
    ? "evaluated" as const
    : "pending" as const;

  return {
    id: candidate.id,
    status: candidate.status,
    outcome: candidate.outcome,
    state,
    source_work_item: candidate.source_work_item,
    source_artifacts: candidate.source_artifacts,
    metric: candidate.metric,
    baseline: candidate.baseline,
    expected_direction: candidate.expected_direction,
    evaluation_window: candidate.evaluation_window,
    guardrails: presentGuardrails(candidate.workflow_trial_guardrails),
    next_route: state === "evaluated" ? NEXT_ROUTE_EVALUATED : NEXT_ROUTE_PENDING
  };
}

function buildFallbackRow(id: string, source: string, sources: string[]): ImprovementHealthRow {
  const sourceArtifacts = sources.length > 0 ? sources : source ? [source] : [];
  return {
    id,
    status: "candidate",
    outcome: "pending",
    state: "missing_metadata",
    source_work_item: source,
    source_artifacts: sourceArtifacts,
    metric: "not available",
    baseline: "not available",
    expected_direction: "not available",
    evaluation_window: "not available",
    guardrails: missingGuardrails(),
    next_route: NEXT_ROUTE_MISSING_GUARDRAILS
  };
}

function missingGuardrails(): GuardrailPresentation {
  return {
    status: "missing_metadata",
    decision_criteria: MISSING_GUARDRAIL,
    uncertainty: MISSING_GUARDRAIL,
    reevaluation_window: MISSING_GUARDRAIL,
    proxy_risk: MISSING_GUARDRAIL
  };
}

function presentGuardrails(guardrails: WorkflowTrialGuardrails): GuardrailPresentation {
  const uncertainty =
    guardrails.minimum_detectable_effect ??
    guardrails.uncertainty ??
    "not specified";

  return {
    status: "complete",
    decision_criteria: guardrails.decision_criteria,
    uncertainty,
    reevaluation_window: guardrails.reevaluation_window,
    proxy_risk: guardrails.proxy_risk
  };
}

function buildSummary(rows: ImprovementHealthRow[]): ImprovementHealthSummary {
  const summary = {
    total: rows.length,
    pending: 0,
    evaluated: 0,
    keep: 0,
    revise: 0,
    revert: 0,
    double_down: 0,
    missing_metadata: 0
  };

  for (const row of rows) {
    if (row.state === "missing_metadata") {
      summary.missing_metadata++;
    } else if (row.state === "evaluated") {
      summary.evaluated++;
      if (row.outcome === "keep") summary.keep++;
      else if (row.outcome === "revise") summary.revise++;
      else if (row.outcome === "revert") summary.revert++;
      else if (row.outcome === "double_down") summary.double_down++;
    } else {
      summary.pending++;
    }
  }

  return summary;
}
