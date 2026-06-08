import assert from "node:assert/strict";
import test from "node:test";
import { desktopViewport } from "./helpers/cockpit-status-fixture.mjs";

async function loadImprovementHealthModule() {
  return import("../src/state/cockpit-improvement-health.ts");
}

async function loadViewModelModule() {
  return import("../src/state/cockpit-view-model.ts");
}

async function loadBrowserShellModule() {
  return import("../src/cockpit/browser-shell.ts");
}

function improvementCandidateFixture(overrides = {}) {
  return {
    id: "BANDIT-037-WORKFLOW-TRIAL-GUARDRAILS",
    source_work_item: "BANDIT-037",
    status: "queued_candidate",
    outcome: "pending",
    metric: "Future workflow-trial reviews do not repeat guardrail findings.",
    baseline: "BANDIT-037 records guardrails in prose but not cockpit rows.",
    expected_direction: "Guardrail omissions become visible before policy claims.",
    evaluation_window: "Evaluate when cockpit improvement health changes.",
    source_artifacts: [
      "docs/work/BANDIT-037/retrospective.md",
      "docs/work/BANDIT-037/qwen-finding-disposition.md"
    ],
    workflow_trial_guardrails: {
      decision_criteria: "Keep only if future review misses decrease.",
      minimum_detectable_effect: "Single-repo evidence cannot prove causality.",
      reevaluation_window: "Review after the next two cockpit slices.",
      proxy_risk: "Avoid optimizing for fewer findings by hiding evidence."
    },
    ...overrides
  };
}

function cockpitStatusWithImprovementCandidates() {
  const candidate = improvementCandidateFixture();
  const evaluated = improvementCandidateFixture({
    id: "BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING",
    source_work_item: "BANDIT-031",
    status: "evaluated",
    outcome: "keep",
    metric: "Future cockpit status reviews do not repeat breadth findings.",
    baseline: "BANDIT-031 exposes first status payload only.",
    expected_direction: "Status breadth findings decrease without hidden authority.",
    evaluation_window: "Evaluated during BANDIT-068.",
    source_artifacts: [
      "docs/work/BANDIT-031/local-qwen-review.md",
      "docs/work/BANDIT-031/qwen-finding-disposition.md"
    ]
  });
  const missingGuardrails = improvementCandidateFixture({
    id: "BANDIT-079-MISSING-GUARDRAIL-PROBE",
    source_work_item: "BANDIT-079",
    status: "candidate",
    outcome: "pending",
    workflow_trial_guardrails: undefined,
    source_artifacts: ["docs/work/BANDIT-079/brief.md"]
  });

  return {
    kind: "workflow_cockpit_status",
    authority: "derived_non_canonical",
    current_phase: {
      value: "Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot",
      source: "docs/roadmap/CURRENT_CONTEXT.md"
    },
    active_work_item: {
      id: "BANDIT-079",
      source: "docs/work/BANDIT-079/brief.md"
    },
    next_action: {
      value: "Write Test Writer-owned Stage 2 RED evidence for BANDIT-079.",
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
        source: "docs/work/BANDIT-079/brief.md"
      },
      stage_2_red_evidence: {
        status: "missing",
        source: "docs/work/BANDIT-079/red-evidence.md"
      },
      stage_3_implementation: {
        status: "missing",
        source: "docs/work/BANDIT-079/implementation-evidence.md"
      },
      stage_4_review: {
        status: "missing",
        source: "docs/work/BANDIT-079/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-079/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-079/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "implementation evidence is not recorded",
      source: "docs/work/BANDIT-079/implementation-evidence.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-079/brief.md"
    },
    improvement_health: {
      status: "pending_candidates",
      source: "docs/work/BANDIT-037/qwen-finding-disposition.md",
      sources: [
        "docs/work/BANDIT-031/qwen-finding-disposition.md",
        "docs/work/BANDIT-037/qwen-finding-disposition.md",
        "docs/work/BANDIT-079/brief.md"
      ],
      candidates: [candidate.id, evaluated.id, missingGuardrails.id],
      candidate_details: [candidate, evaluated, missingGuardrails]
    },
    coordination: {
      current_state: "orchestration_plan_recorded",
      next_action: null,
      source: "docs/work/BANDIT-079/coordination-log.jsonl"
    },
    stale_evidence: []
  };
}

test("improvement health maps candidates and outcomes into source-linked rows", async () => {
  const { buildCockpitImprovementHealthSurface } = await loadImprovementHealthModule();

  const surface = buildCockpitImprovementHealthSurface({
    status: "pending_candidates",
    source: "docs/work/BANDIT-037/qwen-finding-disposition.md",
    sources: ["docs/work/BANDIT-037/qwen-finding-disposition.md"],
    candidates: [
      improvementCandidateFixture(),
      improvementCandidateFixture({
        id: "BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING",
        source_work_item: "BANDIT-031",
        status: "evaluated",
        outcome: "keep",
        source_artifacts: ["docs/work/BANDIT-031/qwen-finding-disposition.md"]
      })
    ]
  });

  assert.equal(surface.kind, "cockpit_improvement_health_surface");
  assert.equal(surface.authority, "presentation_derived_non_canonical");
  assert.deepEqual(surface.summary, {
    total: 2,
    pending: 1,
    evaluated: 1,
    keep: 1,
    revise: 0,
    revert: 0,
    double_down: 0,
    missing_metadata: 0
  });
  assert.deepEqual(
    surface.rows.map((row) => ({
      id: row.id,
      status: row.status,
      outcome: row.outcome,
      state: row.state,
      source_work_item: row.source_work_item,
      next_route: row.next_route
    })),
    [
      {
        id: "BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING",
        status: "evaluated",
        outcome: "keep",
        state: "evaluated",
        source_work_item: "BANDIT-031",
        next_route: "Review keep decision and re-evaluation window from source evidence."
      },
      {
        id: "BANDIT-037-WORKFLOW-TRIAL-GUARDRAILS",
        status: "queued_candidate",
        outcome: "pending",
        state: "pending",
        source_work_item: "BANDIT-037",
        next_route: "Wait for the recorded evaluation window or route through improvements evaluation."
      }
    ]
  );
  assert.equal(surface.rows[1].metric.includes("guardrail findings"), true);
  assert.equal(surface.rows[1].baseline.includes("BANDIT-037"), true);
  assert.deepEqual(surface.rows[1].source_artifacts, [
    "docs/work/BANDIT-037/retrospective.md",
    "docs/work/BANDIT-037/qwen-finding-disposition.md"
  ]);
});

test("improvement health fails closed for missing workflow-trial guardrails", async () => {
  const { buildCockpitImprovementHealthSurface } = await loadImprovementHealthModule();

  const surface = buildCockpitImprovementHealthSurface({
    status: "pending_candidates",
    source: "docs/work/BANDIT-079/brief.md",
    sources: ["docs/work/BANDIT-079/brief.md"],
    candidates: [
      improvementCandidateFixture({
        id: "BANDIT-079-MISSING-GUARDRAIL-PROBE",
        workflow_trial_guardrails: undefined,
        source_artifacts: ["docs/work/BANDIT-079/brief.md"]
      })
    ]
  });

  assert.equal(surface.summary.missing_metadata, 1);
  assert.equal(surface.rows[0].state, "missing_metadata");
  assert.deepEqual(surface.rows[0].guardrails, {
    status: "missing_metadata",
    decision_criteria: "missing",
    uncertainty: "missing",
    reevaluation_window: "missing",
    proxy_risk: "missing"
  });
  assert.equal(
    surface.rows[0].next_route,
    "Record workflow-trial guardrail metadata before presenting this as healthy."
  );
});

test("cockpit view model exposes improvement health without workflow authority", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(cockpitStatusWithImprovementCandidates());

  assert.equal(viewModel.improvement_health_surface.kind, "cockpit_improvement_health_surface");
  assert.equal(viewModel.improvement_health_surface.summary.total, 3);
  assert.deepEqual(
    viewModel.improvement_health_surface.rows.map((row) => row.id),
    [
      "BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING",
      "BANDIT-037-WORKFLOW-TRIAL-GUARDRAILS",
      "BANDIT-079-MISSING-GUARDRAIL-PROBE"
    ]
  );
  assert.equal(viewModel.improvement_health_surface.writes_repo_artifacts, false);
  assert.equal(viewModel.improvement_health_surface.evaluates_candidates, false);
  assert.equal(viewModel.improvement_health_surface.records_outcomes, false);
  assert.equal(viewModel.improvement_health_surface.schedules_work, false);
  assert.equal(viewModel.improvement_health_surface.changes_policy, false);
});

test("browser shell renders compact improvement health rows with responsive source traceability", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderBrowserCockpitShell } = await loadBrowserShellModule();

  const viewModel = buildCockpitViewModel(cockpitStatusWithImprovementCandidates());
  const desktop = renderBrowserCockpitShell(viewModel, desktopViewport());
  const mobile = renderBrowserCockpitShell(viewModel, { width: 390, height: 844 });

  for (const shell of [desktop, mobile]) {
    assert.match(shell.html, /aria-label="Improvement health"/);
    assert.match(shell.html, /BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING/);
    assert.match(shell.html, /status[^<]*evaluated/i);
    assert.match(shell.html, /outcome[^<]*keep/i);
    assert.match(shell.html, /BANDIT-037-WORKFLOW-TRIAL-GUARDRAILS/);
    assert.match(shell.html, /Future workflow-trial reviews do not repeat guardrail findings\./);
    assert.match(shell.html, /BANDIT-079-MISSING-GUARDRAIL-PROBE/);
    assert.match(shell.html, /missing_metadata/);
    assert.match(shell.html, /Single-repo evidence cannot prove causality\./);
    assert.match(shell.html, /docs\/work\/BANDIT-037\/qwen-finding-disposition\.md/);
    assert.doesNotMatch(shell.html, /<form\b|fetch\s*\(|localStorage|sessionStorage|indexedDB/i);
    assert.equal(shell.responsive.text_overflow, false);
    assert.deepEqual(shell.responsive.overlaps, []);
  }
  assert.equal(mobile.responsive.source_paths_wrap, true);
  assert.equal(mobile.responsive.detail_rows_wrap, true);
});
