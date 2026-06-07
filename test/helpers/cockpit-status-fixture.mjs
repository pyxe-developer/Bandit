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

export function liveCockpitStatusFixture() {
  return {
    kind: "workflow_cockpit_status",
    authority: "derived_non_canonical",
    current_phase: {
      value: "Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    active_work_item: {
      id: "BANDIT-067",
      source: "docs/work/BANDIT-067/brief.md"
    },
    next_action: {
      value: "Write Test Writer-owned Stage 2 RED evidence for BANDIT-067 before implementation.",
      source: "docs/roadmap/CURRENT_CONTEXT.md",
      agreement: {
        status: "pass",
        compared_with: "docs/roadmap/ROADMAP.md",
        basis: "normalized_text"
      }
    },
    required_operator_input: {
      value: "none_required",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    blockers: [],
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
        source: "docs/work/BANDIT-067/brief.md"
      },
      stage_2_red_evidence: {
        status: "missing",
        source: "docs/work/BANDIT-067/red-evidence.md"
      },
      stage_3_implementation: {
        status: "missing",
        source: "docs/work/BANDIT-067/implementation-evidence.md"
      },
      stage_4_review: {
        status: "missing",
        source: "docs/work/BANDIT-067/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-067/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-067/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "implementation evidence is not recorded",
      source: "docs/work/BANDIT-067/implementation-evidence.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-067/brief.md"
    },
    improvement_health: {
      status: "pending_candidates",
      source: "docs/work/BANDIT-063/qwen-finding-disposition.md",
      sources: ["docs/work/BANDIT-063/qwen-finding-disposition.md"],
      candidates: ["BANDIT-063-PLAN-STALENESS-HARDENING"]
    },
    coordination: {
      current_state: "orchestration_plan_recorded",
      next_action: null,
      source: "docs/work/BANDIT-067/coordination-log.jsonl"
    },
    stale_evidence: []
  };
}

export function evidenceDrilldownStatusFixture() {
  return {
    ...liveCockpitStatusFixture(),
    active_work_item: {
      id: "BANDIT-068",
      source: "docs/work/BANDIT-068/brief.md"
    },
    next_action: {
      value: "Run Work Item PM plan-mode orchestration for BANDIT-068.",
      source: "docs/roadmap/CURRENT_CONTEXT.md",
      agreement: {
        status: "pass",
        compared_with: "docs/roadmap/ROADMAP.md",
        basis: "normalized_text"
      }
    },
    bootstrap_gaps: {
      status: "open",
      source: ".bandit/bootstrap-gaps.json",
      gaps: [
        {
          id: "BANDIT-GAP-LIVE-CODERABBIT",
          status: "resolved",
          next_action: "Record provider-timeout replacement evidence when CodeRabbit is unavailable.",
          source_artifacts: [
            "docs/work/BANDIT-068/coderabbit-formation-review.md"
          ]
        }
      ]
    },
    gates: {
      stage_0_context_readiness: {
        status: "pass",
        sources: ["docs/roadmap/CURRENT_CONTEXT.md", "docs/roadmap/ROADMAP.md"]
      },
      stage_1_brief: {
        status: "pass",
        source: "docs/work/BANDIT-068/brief.md"
      },
      stage_2_red_evidence: {
        status: "missing",
        source: "docs/work/BANDIT-068/red-evidence.md"
      },
      stage_3_implementation: {
        status: "missing",
        source: "docs/work/BANDIT-068/implementation-evidence.md"
      },
      stage_4_review: {
        status: "missing",
        source: "docs/work/BANDIT-068/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-068/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-068/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "implementation evidence is not recorded",
      source: "docs/work/BANDIT-068/implementation-evidence.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-068/brief.md"
    },
    coordination: {
      current_state: "orchestration_plan_recorded",
      next_action: null,
      source: "docs/work/BANDIT-068/coordination-log.jsonl"
    },
    stale_evidence: [
      {
        kind: "review_subject_hash",
        status: "stale",
        source: "docs/work/BANDIT-068/review-evidence.md",
        basis: "review_subject_hash_status"
      }
    ],
    evidence_trust_signals: {
      authority: "derived_non_canonical",
      gates: {
        stage_1_brief: {
          artifact_type: "brief",
          source: "docs/work/BANDIT-068/brief.md",
          owner_or_authority_role: "codex_pm",
          freshness_state: "current",
          staleness_reason: "none",
          evidence_slo: ".bandit/policy/evidence-freshness-slos.json"
        },
        stage_2_red_evidence: {
          artifact_type: "red_evidence",
          source: "docs/work/BANDIT-068/red-evidence.md",
          owner_or_authority_role: "test_writer",
          freshness_state: "missing",
          staleness_reason: "missing_required_stage_evidence",
          evidence_slo: ".bandit/policy/evidence-freshness-slos.json"
        },
        stage_3_implementation: {
          artifact_type: "implementation_evidence",
          source: "docs/work/BANDIT-068/implementation-evidence.md",
          owner_or_authority_role: "writer",
          freshness_state: "missing",
          staleness_reason: "missing_required_stage_evidence",
          evidence_slo: ".bandit/policy/evidence-freshness-slos.json"
        },
        stage_4_review: {
          artifact_type: "review_evidence",
          source: "docs/work/BANDIT-068/review-evidence.md",
          owner_or_authority_role: "reviewer",
          freshness_state: "stale",
          staleness_reason: "review_subject_hash_drift",
          evidence_slo: ".bandit/policy/evidence-freshness-slos.json"
        },
        stage_5_landing: {
          artifact_type: "landing_verdict",
          source: "docs/work/BANDIT-068/landing-verdict.md",
          owner_or_authority_role: "landing_agent",
          freshness_state: "missing",
          staleness_reason: "missing_required_stage_evidence",
          evidence_slo: ".bandit/policy/evidence-freshness-slos.json"
        },
        stage_6_retrospective: {
          artifact_type: "retrospective",
          source: "docs/work/BANDIT-068/retrospective.md",
          owner_or_authority_role: "codex_pm",
          freshness_state: "missing",
          staleness_reason: "missing_required_stage_evidence",
          evidence_slo: ".bandit/policy/evidence-freshness-slos.json"
        }
      }
    }
  };
}
