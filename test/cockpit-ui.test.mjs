import assert from "node:assert/strict";
import test from "node:test";
import { cockpitStatusFixture, desktopViewport } from "./helpers/cockpit-status-fixture.mjs";

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

test("cockpit shell renders guarded controls from pre-derived action affordances", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());
  const shell = renderCockpitShell(
    {
      ...viewModel,
      action_affordances: [
        {
          id: "validate_repo",
          label: "Validate",
          command_family: "bandit validate",
          enabled: true,
          reason: "Read-only validation is available through CLI Authority."
        },
        {
          id: "inspect_evidence",
          label: "Evidence",
          command_family: "bandit show",
          enabled: true,
          reason: "Evidence inspection is read-only and source-linked."
        },
        {
          id: "run_review_gate",
          label: "Review Gate",
          command_family: "bandit qwen-review",
          enabled: true,
          reason: "Pre-derived action affordance controls render state."
        },
        {
          id: "check_landing_readiness",
          label: "Landing Check",
          command_family: "bandit land-check",
          enabled: false,
          reason: "implementation evidence is not recorded"
        },
        {
          id: "record_uat",
          label: "Record UAT",
          command_family: "bandit uat",
          enabled: false,
          reason: "UAT is unavailable until an operator-facing implementation exists."
        }
      ]
    },
    desktopViewport()
  );

  assert.deepEqual(shell.controls.find((control) => control.id === "run_review_gate"), {
    id: "run_review_gate",
    role: "button",
    label: "Review Gate",
    command_family: "bandit qwen-review",
    disabled: false,
    "aria-disabled": "false",
    reason: "Pre-derived action affordance controls render state."
  });
});

test("cockpit shell renders explicit light queue context without mutation controls", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const shell = renderCockpitShell(buildCockpitViewModel(cockpitStatusFixture()), desktopViewport());

  assert.deepEqual(shell.queue_context, {
    heading: "Queue context",
    status: "clear",
    summary: "No open bootstrap gaps; 1 improvement candidate is visible.",
    sources: [
      ".bandit/bootstrap-gaps.json",
      "docs/work/BANDIT-032/retrospective.md",
      "docs/roadmap/CURRENT_CONTEXT.md"
    ],
    mutation_forms: [],
    excluded_authority: [
      "intake_ledger_management",
      "scheduler_execution",
      "claimability_decision",
      "workstream_queue_management"
    ]
  });
});
