import assert from "node:assert/strict";
import test from "node:test";

async function loadViewModelModule() {
  return import("../src/state/cockpit-view-model.ts");
}

async function loadRenderModule() {
  return import("../src/cockpit/render.ts");
}

test("cockpit shell renders the attention-first home with traceable status and guarded controls", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());
  const shell = renderCockpitShell(viewModel, desktopViewport());

  assert.equal(shell.title, "Bandit Workflow Cockpit");
  assert.deepEqual(shell.landmarks, ["navigation", "main", "complementary"]);
  assert.deepEqual(
    shell.attention_navigation.map((item) => item.id),
    [
      "operator_input_required",
      "blocked_or_stale",
      "active_work_next_action",
      "landing_readiness",
      "improvement_health",
      "queue_context"
    ]
  );
  assert.deepEqual(shell.primary_panel, {
    heading: "Operator input required",
    work_item: "BANDIT-033",
    next_action: "Write Stage 2 RED evidence for BANDIT-033.",
    evidence_cue: "blocked_by_operator_input",
    source: "docs/roadmap/CURRENT_CONTEXT.md"
  });
  assert.equal(shell.controls.every((control) => control.command_family), true);
  assert.equal(shell.links.some((link) => link.href === "docs/work/BANDIT-033/brief.md"), true);
});

test("cockpit shell exposes accessible disabled states and keyboard order", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const shell = renderCockpitShell(buildCockpitViewModel(cockpitStatusFixture()), desktopViewport());
  const reviewGate = shell.controls.find((control) => control.id === "run_review_gate");

  assert.deepEqual(reviewGate, {
    id: "run_review_gate",
    role: "button",
    label: "Review Gate",
    command_family: "bandit qwen-review",
    disabled: true,
    "aria-disabled": "true",
    reason: "Stage 2 RED evidence is missing.",
    described_by: "run_review_gate_reason"
  });
  assert.deepEqual(shell.keyboard.focus_order, [
    "attention_operator_input_required",
    "attention_blocked_or_stale",
    "attention_active_work_next_action",
    "validate_repo",
    "inspect_evidence",
    "run_review_gate",
    "check_landing_readiness",
    "record_uat",
    "evidence_drilldown"
  ]);
});

test("cockpit shell maintains responsive layout constraints without overlap or text clipping", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());
  const desktop = renderCockpitShell(viewModel, desktopViewport());
  const mobile = renderCockpitShell(viewModel, { width: 390, height: 844 });

  assert.deepEqual(desktop.layout, {
    viewport: "desktop",
    columns: ["attention", "work", "evidence"],
    min_control_size_px: 36,
    text_overflow: false,
    overlaps: []
  });
  assert.deepEqual(mobile.layout, {
    viewport: "mobile",
    columns: ["attention", "work", "evidence"],
    stack_order: ["attention", "work", "actions", "evidence"],
    min_control_size_px: 44,
    text_overflow: false,
    source_paths_wrap: true,
    overlaps: []
  });
});

test("cockpit evidence drilldown shows source paths without mutation forms or hidden state", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const shell = renderCockpitShell(buildCockpitViewModel(cockpitStatusFixture()), desktopViewport());

  assert.deepEqual(shell.evidence_drilldown, {
    heading: "Evidence",
    sources: [
      "docs/roadmap/CURRENT_CONTEXT.md",
      "docs/roadmap/ROADMAP.md",
      "docs/work/BANDIT-033/brief.md",
      "docs/work/BANDIT-033/red-evidence.md",
      "docs/work/BANDIT-032/retrospective.md"
    ],
    shows_hash_state: true,
    shows_gate_basis: true,
    mutation_forms: [],
    canonical_state_owner: "repo_native_artifacts_via_bandit_cli"
  });
});

function desktopViewport() {
  return { width: 1440, height: 900 };
}

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
