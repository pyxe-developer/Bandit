import type { CockpitStatus } from "../state/cockpit-status.js";

// Deterministic saved snapshot of `node ./bin/bandit.mjs cockpit status --json`
// captured for BANDIT-083 at the orchestration_plan_recorded point of the workflow.
// This snapshot is non-canonical browser-presentation input only: workflow
// authority remains in repo-native artifacts via the Bandit CLI. Regenerate it
// from the live CLI payload when the static preview should reflect a newer
// workflow position.
export function previewCockpitStatusSnapshot(): CockpitStatus {
  return {
    kind: "workflow_cockpit_status",
    authority: "derived_non_canonical",
    current_phase: {
      value:
        "Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    active_work_item: {
      id: "BANDIT-083",
      source: "docs/work/BANDIT-083/brief.md"
    },
    next_action: {
      value:
        "Dispatch Stage 3 implementation for Bandit Cockpit UI Polish From Attached Design (BANDIT-083).",
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
        source: "docs/work/BANDIT-083/brief.md"
      },
      stage_2_red_evidence: {
        status: "pass",
        source: "docs/work/BANDIT-083/red-evidence.md"
      },
      stage_3_implementation: {
        status: "missing",
        source: "docs/work/BANDIT-083/implementation-evidence.md"
      },
      stage_4_review: {
        status: "missing",
        source: "docs/work/BANDIT-083/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-083/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-083/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "implementation evidence is not recorded",
      source: "docs/work/BANDIT-083/implementation-evidence.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-083/brief.md"
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
      source: "docs/work/BANDIT-083/coordination-log.jsonl"
    },
    stale_evidence: []
  };
}
