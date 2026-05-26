export function desktopViewport() {
  return { width: 1440, height: 900 };
}

export function cockpitStatusFixture() {
  return {
    kind: "workflow_cockpit_status",
    authority: "derived_non_canonical",
    current_phase: {
      value: "Phase 8 - Workflow Cockpit kickoff",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    active_work_item: {
      id: "BANDIT-033",
      source: "docs/work/BANDIT-033/brief.md"
    },
    next_action: {
      value: "Write Stage 2 RED evidence for BANDIT-033.",
      source: "docs/roadmap/CURRENT_CONTEXT.md",
      agreement: {
        status: "pass",
        compared_with: "docs/roadmap/ROADMAP.md",
        basis: "work_item_and_stage"
      }
    },
    required_operator_input: {
      value: "required",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    blockers: [
      {
        kind: "operator_input_required",
        status: "blocked",
        summary: "Operator must approve external reviewer setup.",
        source: "docs/roadmap/CURRENT_CONTEXT.md"
      }
    ],
    bootstrap_gaps: {
      status: "none",
      source: ".bandit/bootstrap-gaps.json",
      gaps: []
    },
    gates: {
      stage_0_context_readiness: {
        status: "pass",
        sources: ["docs/roadmap/CURRENT_CONTEXT.md", "docs/roadmap/ROADMAP.md"]
      },
      stage_1_brief: {
        status: "pass",
        source: "docs/work/BANDIT-033/brief.md"
      },
      stage_2_red_evidence: {
        status: "missing",
        source: "docs/work/BANDIT-033/red-evidence.md"
      },
      stage_3_implementation: {
        status: "missing",
        source: "docs/work/BANDIT-033/implementation-evidence.md"
      },
      stage_4_review: {
        status: "missing",
        source: "docs/work/BANDIT-033/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-033/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-033/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "implementation evidence is not recorded",
      source: "docs/work/BANDIT-033/implementation-evidence.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-033/brief.md"
    },
    improvement_health: {
      status: "pending_candidates",
      source: "docs/work/BANDIT-032/retrospective.md",
      sources: ["docs/work/BANDIT-032/retrospective.md"],
      candidates: ["BANDIT-032-COCKPIT-STATUS-COVERAGE-HARDENING"]
    },
    coordination: null,
    stale_evidence: [
      {
        kind: "review_evidence",
        status: "stale",
        source: "docs/work/BANDIT-033/review-evidence.md",
        basis: "source_drift_status"
      }
    ]
  };
}
