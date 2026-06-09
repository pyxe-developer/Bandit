import assert from "node:assert/strict";
import test from "node:test";
import {
  cockpitStatusFixture,
  desktopViewport,
  evidenceDrilldownStatusFixture
} from "./helpers/cockpit-status-fixture.mjs";

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
          label: "Validate repo",
          command_family: "bandit validate",
          command_preview: "npm run bandit -- validate",
          enabled: true,
          presentation_state: "enabled",
          reason: "Read-only validation is available through CLI Authority.",
          source: {
            label: "Current context",
            path: "docs/roadmap/CURRENT_CONTEXT.md"
          },
          authority_owner: "bandit_cli",
          role_gate: "codex_pm",
          operator_gate: "none_required",
          unavailable_route: "Run validation from the CLI; the browser is request-only.",
          request_mode: "cli_request_only",
          executes_in_browser: false,
          writes_repo_artifacts: false,
          mutates_workflow_state: false
        },
        {
          id: "inspect_evidence",
          label: "Evidence",
          command_family: "bandit show",
          command_preview: "node ./bin/bandit.mjs cockpit status --json",
          enabled: true,
          presentation_state: "enabled",
          reason: "Evidence inspection is read-only and source-linked.",
          source: {
            label: "Active work brief",
            path: "docs/work/BANDIT-033/brief.md"
          },
          authority_owner: "bandit_cli",
          role_gate: "codex_pm",
          operator_gate: "none_required",
          unavailable_route: "Inspect evidence from the CLI; the browser is request-only.",
          request_mode: "cli_request_only",
          executes_in_browser: false,
          writes_repo_artifacts: false,
          mutates_workflow_state: false
        },
        {
          id: "run_review_gate",
          label: "Review Gate",
          command_family: "bandit qwen-review",
          command_preview: "npm run bandit -- qwen-review BANDIT-033",
          enabled: true,
          presentation_state: "enabled",
          reason: "Pre-derived action affordance controls render state.",
          source: {
            label: "Stage 4 review evidence",
            path: "docs/work/BANDIT-033/review-evidence.md"
          },
          authority_owner: "reviewer",
          role_gate: "reviewer_after_implementation",
          operator_gate: "none_required",
          unavailable_route: "Record RED and implementation evidence before requesting review.",
          request_mode: "cli_request_only",
          executes_in_browser: false,
          writes_repo_artifacts: false,
          mutates_workflow_state: false
        },
        {
          id: "check_landing_readiness",
          label: "Landing Check",
          command_family: "bandit land-check",
          command_preview: "npm run bandit -- land-check BANDIT-033",
          enabled: false,
          presentation_state: "disabled",
          reason: "implementation evidence is not recorded",
          source: {
            label: "Implementation evidence",
            path: "docs/work/BANDIT-033/implementation-evidence.md"
          },
          authority_owner: "landing_agent",
          role_gate: "landing_agent_after_review",
          operator_gate: "none_required",
          unavailable_route: "Record current implementation and review evidence before land-check.",
          request_mode: "cli_request_only",
          executes_in_browser: false,
          writes_repo_artifacts: false,
          mutates_workflow_state: false
        },
        {
          id: "record_uat",
          label: "Record UAT",
          command_family: "bandit uat",
          command_preview: "npm run bandit -- uat approve BANDIT-033",
          enabled: false,
          presentation_state: "disabled",
          reason: "UAT is unavailable until an operator-facing implementation exists.",
          source: {
            label: "Work item brief",
            path: "docs/work/BANDIT-033/brief.md"
          },
          authority_owner: "operator",
          role_gate: "operator_after_implementation",
          operator_gate: "operator_owned_cli_uat",
          unavailable_route: "Record CLI-owned product UAT only after the operator-facing implementation exists.",
          request_mode: "cli_request_only",
          executes_in_browser: false,
          writes_repo_artifacts: false,
          mutates_workflow_state: false
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
    command_preview: "npm run bandit -- qwen-review BANDIT-033",
    disabled: false,
    "aria-disabled": "false",
    reason: "Pre-derived action affordance controls render state.",
    source: {
      label: "Stage 4 review evidence",
      path: "docs/work/BANDIT-033/review-evidence.md"
    },
    authority_owner: "reviewer",
    role_gate: "reviewer_after_implementation",
    operator_gate: "none_required",
    unavailable_route: "Record RED and implementation evidence before requesting review.",
    request_mode: "cli_request_only",
    executes_in_browser: false,
    writes_repo_artifacts: false,
    mutates_workflow_state: false
  });
});

test("cockpit shell renders guarded action request metadata without execution authority", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const shell = renderCockpitShell(buildCockpitViewModel(cockpitStatusFixture()), desktopViewport());
  const reviewGate = shell.controls.find((control) => control.id === "run_review_gate");

  assert.equal(reviewGate.command_preview, "npm run bandit -- qwen-review BANDIT-033");
  assert.deepEqual(reviewGate.source, {
    label: "Stage 2 RED evidence",
    path: "docs/work/BANDIT-033/red-evidence.md"
  });
  assert.equal(reviewGate.authority_owner, "reviewer");
  assert.equal(reviewGate.role_gate, "reviewer_after_implementation");
  assert.equal(reviewGate.operator_gate, "none_required");
  assert.equal(reviewGate.unavailable_route, "Record RED and implementation evidence before requesting review.");
  assert.equal(reviewGate.request_mode, "cli_request_only");
  assert.equal(reviewGate.executes_in_browser, false);
  assert.equal(reviewGate.writes_repo_artifacts, false);
  assert.equal(reviewGate.mutates_workflow_state, false);
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

test("cockpit shell renders dense gate matrix and evidence detail without hidden authority", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const shell = renderCockpitShell(
    buildCockpitViewModel(evidenceDrilldownStatusFixture()),
    desktopViewport()
  );

  assert.deepEqual(
    shell.gate_matrix.rows.map((row) => ({
      id: row.id,
      status: row.status,
      freshness_state: row.freshness_state,
      owner_or_authority_role: row.owner_or_authority_role
    })),
    [
      {
        id: "stage_0_context_readiness",
        status: "pass",
        freshness_state: "current",
        owner_or_authority_role: "codex_pm"
      },
      {
        id: "stage_1_brief",
        status: "pass",
        freshness_state: "current",
        owner_or_authority_role: "codex_pm"
      },
      {
        id: "stage_2_red_evidence",
        status: "missing",
        freshness_state: "missing",
        owner_or_authority_role: "test_writer"
      },
      {
        id: "stage_3_implementation",
        status: "missing",
        freshness_state: "missing",
        owner_or_authority_role: "writer"
      },
      {
        id: "stage_4_review",
        status: "missing",
        freshness_state: "stale",
        owner_or_authority_role: "reviewer"
      },
      {
        id: "stage_5_landing",
        status: "missing",
        freshness_state: "missing",
        owner_or_authority_role: "landing_agent"
      },
      {
        id: "stage_6_retrospective",
        status: "missing",
        freshness_state: "missing",
        owner_or_authority_role: "codex_pm"
      }
    ]
  );
  assert.equal(shell.gate_matrix.aria_label, "Stage gate matrix");
  assert.equal(shell.gate_matrix.source_paths_wrap, true);
  assert.deepEqual(shell.gate_matrix.mutation_forms, []);
  assert.equal(
    shell.evidence_detail.rows.some((row) => row.id === "coordination" && row.status === "orchestration_plan_recorded"),
    true
  );
  assert.deepEqual(shell.evidence_detail.mutation_forms, []);
  assert.equal(shell.evidence_detail.canonical_state_owner, "repo_native_artifacts_via_bandit_cli");
});

test("cockpit shell identifies gate rows as Evidence Rows with non-color status cues", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderCockpitShell } = await loadRenderModule();

  const shell = renderCockpitShell(
    buildCockpitViewModel(evidenceDrilldownStatusFixture()),
    desktopViewport()
  );

  assert.equal(shell.gate_matrix.presentation_pattern, "evidence_row");
  assert.equal(shell.gate_matrix.source_paths_wrap, true);
  assert.equal(shell.gate_matrix.status_cues_visible, true);
  assert.equal(shell.gate_matrix.uses_color_alone, false);
  assert.equal(shell.evidence_detail.presentation_pattern, "evidence_row");
  assert.equal(shell.evidence_detail.source_paths_wrap, true);
  assert.equal(shell.evidence_detail.status_cues_visible, true);
  assert.equal(shell.evidence_detail.uses_color_alone, false);

  for (const row of shell.gate_matrix.rows) {
    assert.equal(row.presentation_pattern, "evidence_row");
    assert.ok(row.status_label.length > 0);
    assert.ok(row.freshness_label.length > 0);
    assert.ok(row.sources.length > 0);
  }

  const missingStage = shell.gate_matrix.rows.find((row) => row.id === "stage_2_red_evidence");
  assert.equal(missingStage.status_label, "missing");
  assert.equal(missingStage.freshness_label, "missing evidence");
  assert.match(missingStage.next_repair_route, /Record Test Writer-owned RED evidence/);
});
