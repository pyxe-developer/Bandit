import assert from "node:assert/strict";
import test from "node:test";
import { cockpitStatusFixture } from "./helpers/cockpit-status-fixture.mjs";

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

test("cockpit view model exposes derived guarded action affordances as one presentation source", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { deriveCockpitActionAffordances } = await loadActionModule();

  const status = cockpitStatusFixture();
  const viewModel = buildCockpitViewModel(status);

  assert.deepEqual(viewModel.action_affordances, deriveCockpitActionAffordances(status));
  assert.equal(viewModel.action_affordances.some((action) => action.enabled), true);
  assert.deepEqual(viewModel.action_affordances.find((action) => action.id === "run_review_gate"), {
    id: "run_review_gate",
    label: "Review Gate",
    command_family: "bandit qwen-review",
    enabled: false,
    reason: "Stage 2 RED evidence is missing."
  });
});

test("cockpit view model maps light queue context explicitly without becoming a backlog manager", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(cockpitStatusFixture());

  assert.deepEqual(viewModel.queue_context, {
    kind: "light_queue_context",
    status: "clear",
    summary: "No open bootstrap gaps; 1 improvement candidate is visible.",
    sources: [
      ".bandit/bootstrap-gaps.json",
      "docs/work/BANDIT-032/retrospective.md",
      "docs/roadmap/CURRENT_CONTEXT.md"
    ],
    excluded_authority: [
      "intake_ledger_management",
      "scheduler_execution",
      "claimability_decision",
      "workstream_queue_management"
    ]
  });
  assert.deepEqual(
    viewModel.attention_categories.find((category) => category.id === "queue_context"),
    {
      id: "queue_context",
      label: "Queue context",
      status: "clear",
      sources: [
        ".bandit/bootstrap-gaps.json",
        "docs/work/BANDIT-032/retrospective.md",
        "docs/roadmap/CURRENT_CONTEXT.md"
      ]
    }
  );
});
