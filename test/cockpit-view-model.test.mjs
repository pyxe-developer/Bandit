import assert from "node:assert/strict";
import test from "node:test";

async function loadViewModelModule() {
  return import("../src/state/cockpit-view-model.ts");
}

async function loadActionModule() {
  return import("../src/state/cockpit-actions.ts");
}

test("cockpit view model prioritizes attention categories from operator risk to queue context", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());

  assert.equal(viewModel.kind, "attention_first_cockpit_view_model");
  assert.equal(viewModel.authority, "presentation_derived_non_canonical");
  assert.deepEqual(
    viewModel.attention_categories.map((category) => category.id),
    [
      "operator_input_required",
      "blocked_or_stale",
      "active_work_next_action",
      "landing_readiness",
      "improvement_health",
      "queue_context"
    ]
  );
  assert.deepEqual(viewModel.primary_attention, {
    category: "operator_input_required",
    work_item: "BANDIT-033",
    title: "External reviewer setup is blocked",
    next_action: "Operator must approve external reviewer setup.",
    confidence: {
      state: "blocked_by_operator_input",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    }
  });
});

test("cockpit view model maps gate, stale, improvement, and evidence source cues without unexplained green state", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());

  assert.deepEqual(viewModel.active_work, {
    id: "BANDIT-033",
    stage: "stage_2_red_evidence",
    next_action: "Write Stage 2 RED evidence for BANDIT-033.",
    source: "docs/work/BANDIT-033/brief.md"
  });
  assert.deepEqual(
    viewModel.gate_strip.map((gate) => ({
      id: gate.id,
      status: gate.status,
      confidence: gate.confidence
    })),
    [
      {
        id: "stage_0_context_readiness",
        status: "pass",
        confidence: {
          state: "source_linked",
          sources: ["docs/roadmap/CURRENT_CONTEXT.md", "docs/roadmap/ROADMAP.md"]
        }
      },
      {
        id: "stage_1_brief",
        status: "pass",
        confidence: { state: "source_linked", source: "docs/work/BANDIT-033/brief.md" }
      },
      {
        id: "stage_2_red_evidence",
        status: "missing",
        confidence: { state: "missing_evidence", source: "docs/work/BANDIT-033/red-evidence.md" }
      },
      {
        id: "stage_3_implementation",
        status: "missing",
        confidence: {
          state: "blocked_until_prior_gate",
          source: "docs/work/BANDIT-033/implementation-evidence.md"
        }
      }
    ]
  );
  assert.deepEqual(viewModel.evidence_drilldown.sources, [
    "docs/roadmap/CURRENT_CONTEXT.md",
    "docs/roadmap/ROADMAP.md",
    "docs/work/BANDIT-033/brief.md",
    "docs/work/BANDIT-033/red-evidence.md",
    "docs/work/BANDIT-032/retrospective.md"
  ]);
  assert.equal(viewModel.status_cues.every((cue) => cue.source || cue.sources), true);
});

test("cockpit guarded actions expose only CLI-backed requests and disabled reasons", async () => {
  const { deriveCockpitActionAffordances } = await loadActionModule();

  const actions = deriveCockpitActionAffordances(cockpitStatusFixture());

  assert.deepEqual(actions.map((action) => action.id), [
    "validate_repo",
    "inspect_evidence",
    "run_review_gate",
    "check_landing_readiness",
    "record_uat"
  ]);
  assert.deepEqual(actions.find((action) => action.id === "validate_repo"), {
    id: "validate_repo",
    label: "Validate",
    command_family: "bandit validate",
    enabled: true,
    reason: "Read-only validation is available through CLI Authority."
  });
  assert.deepEqual(actions.find((action) => action.id === "run_review_gate"), {
    id: "run_review_gate",
    label: "Review Gate",
    command_family: "bandit qwen-review",
    enabled: false,
    reason: "Stage 2 RED evidence is missing."
  });
  assert.deepEqual(actions.find((action) => action.id === "record_uat"), {
    id: "record_uat",
    label: "Record UAT",
    command_family: "bandit uat",
    enabled: false,
    reason: "UAT is unavailable until an operator-facing implementation exists."
  });
  assert.equal(actions.some((action) => /merge|push|deploy|policy/i.test(action.id)), false);
});

test("cockpit presentation data cannot become canonical workflow authority", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());

  assert.equal(viewModel.canonical_state_owner, "repo_native_artifacts_via_bandit_cli");
  assert.deepEqual(viewModel.prohibited_authority, [
    "browser_storage",
    "fixture_data",
    "generated_ui_state",
    "local_cache",
    "state_index",
    "web_component_state"
  ]);
  assert.equal(viewModel.writes_repo_artifacts, false);
  assert.equal(viewModel.approves_uat, false);
  assert.equal(viewModel.decides_landing_safety, false);
});

function cockpitStatusFixture() {
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
