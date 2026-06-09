import assert from "node:assert/strict";
import test from "node:test";
import { liveCockpitStatusFixture, desktopViewport } from "./helpers/cockpit-status-fixture.mjs";

async function loadViewModelModule() {
  return import("../src/state/cockpit-view-model.ts");
}

async function loadBrowserShellModule() {
  return import("../src/cockpit/browser-shell.ts");
}

function queueContextStatusFixture() {
  return {
    ...liveCockpitStatusFixture(),
    active_work_item: {
      id: "BANDIT-080",
      source: "docs/work/BANDIT-080/brief.md"
    },
    next_action: {
      value: "Work Item PM should run Stage 2 RED evidence for BANDIT-080 before implementation.",
      source: "docs/roadmap/CURRENT_CONTEXT.md",
      agreement: {
        status: "pass",
        compared_with: "docs/roadmap/ROADMAP.md",
        basis: "normalized_text"
      }
    },
    bootstrap_gaps: {
      status: "none",
      source: ".bandit/bootstrap-gaps.json",
      gaps: []
    },
    gates: {
      ...liveCockpitStatusFixture().gates,
      stage_1_brief: {
        status: "pass",
        source: "docs/work/BANDIT-080/brief.md"
      },
      stage_2_red_evidence: {
        status: "missing",
        source: "docs/work/BANDIT-080/red-evidence.md"
      },
      stage_3_implementation: {
        status: "missing",
        source: "docs/work/BANDIT-080/implementation-evidence.md"
      },
      stage_4_review: {
        status: "missing",
        source: "docs/work/BANDIT-080/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-080/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-080/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "implementation evidence is not recorded",
      source: "docs/work/BANDIT-080/implementation-evidence.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-080/brief.md"
    },
    coordination: {
      current_state: "orchestration_plan_recorded",
      next_action: null,
      source: "docs/work/BANDIT-080/coordination-log.jsonl"
    },
    queue_context_source: {
      source: "docs/roadmap/ROADMAP.md",
      items: [
        {
          id: "BANDIT-080",
          label: "Queue & Context (Light)",
          kind: "slice",
          status: "active_anchor",
          relationship: "current",
          summary: "Current formed Phase 8 cockpit slice.",
          source_artifacts: [
            "docs/work/BANDIT-080/brief.md",
            "docs/roadmap/CURRENT_CONTEXT.md"
          ]
        },
        {
          id: "TBD",
          label: "Operator Attention / Operator Inbox surface",
          kind: "slice",
          status: "next_planned",
          relationship: "next",
          summary: "Planned after BANDIT-080 closeout if repo artifacts still support the sequence.",
          source_artifacts: ["docs/roadmap/ROADMAP.md"]
        },
        {
          id: "TBD",
          label: "V0 Closeout Claude Code A/B Product-Value Trial",
          kind: "slice",
          status: "deferred",
          relationship: "deferred",
          summary: "Final V0 closeout planning item only; no trial execution or public benchmark claim is authorized.",
          deferred_reason: "deferred until after cockpit queue and operator attention slices",
          source_artifacts: ["docs/roadmap/ROADMAP.md"]
        }
      ]
    }
  };
}

test("cockpit queue context maps active, next planned, and deferred rows from repo-native sources", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(queueContextStatusFixture());

  assert.equal(viewModel.queue_context.kind, "light_queue_context");
  assert.equal(viewModel.queue_context.status, "clear");
  assert.equal(
    viewModel.queue_context.summary,
    "BANDIT-080 active; 1 next planned slice; 1 deferred V0 closeout item."
  );
  assert.deepEqual(viewModel.queue_context.sources, [
    "docs/roadmap/ROADMAP.md",
    "docs/roadmap/CURRENT_CONTEXT.md",
    "docs/work/BANDIT-080/coordination-log.jsonl",
    ".bandit/bootstrap-gaps.json"
  ]);
  assert.deepEqual(
    viewModel.queue_context.rows.map((row) => ({
      id: row.id,
      label: row.label,
      kind: row.kind,
      status: row.status,
      relationship: row.relationship,
      deferred_reason: row.deferred_reason,
      source_artifacts: row.source_artifacts
    })),
    [
      {
        id: "BANDIT-080",
        label: "Queue & Context (Light)",
        kind: "slice",
        status: "active_anchor",
        relationship: "current",
        deferred_reason: undefined,
        source_artifacts: [
          "docs/work/BANDIT-080/brief.md",
          "docs/roadmap/CURRENT_CONTEXT.md"
        ]
      },
      {
        id: "TBD",
        label: "Operator Attention / Operator Inbox surface",
        kind: "slice",
        status: "next_planned",
        relationship: "next",
        deferred_reason: undefined,
        source_artifacts: ["docs/roadmap/ROADMAP.md"]
      },
      {
        id: "TBD",
        label: "V0 Closeout Claude Code A/B Product-Value Trial",
        kind: "slice",
        status: "deferred",
        relationship: "deferred",
        deferred_reason: "deferred until after cockpit queue and operator attention slices",
        source_artifacts: ["docs/roadmap/ROADMAP.md"]
      }
    ]
  );
});

test("cockpit queue context exposes recent coordination without inferring missing history", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(queueContextStatusFixture());

  assert.deepEqual(viewModel.queue_context.recent_transitions, [
    {
      work_item: "BANDIT-080",
      state: "orchestration_plan_recorded",
      status: "recorded",
      source: "docs/work/BANDIT-080/coordination-log.jsonl"
    }
  ]);

  const missingCoordination = queueContextStatusFixture();
  missingCoordination.coordination = null;
  const missingViewModel = buildCockpitViewModel(missingCoordination);

  assert.deepEqual(missingViewModel.queue_context.recent_transitions, [
    {
      work_item: "BANDIT-080",
      state: "not_recorded",
      status: "unavailable",
      source: "docs/work/BANDIT-080/brief.md"
    }
  ]);
});

test("browser cockpit shell renders queue context rows as presentation-only trajectory", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderBrowserCockpitShell } = await loadBrowserShellModule();

  const shell = renderBrowserCockpitShell(
    buildCockpitViewModel(queueContextStatusFixture()),
    desktopViewport()
  );

  assert.match(shell.html, /aria-label="Queue and context"/);
  assert.match(shell.html, /Queue &amp; Context \(Light\)/);
  assert.match(shell.html, /active_anchor/);
  assert.match(shell.html, /next_planned/);
  assert.match(shell.html, /deferred/);
  assert.match(shell.html, /V0 Closeout Claude Code A\/B Product-Value Trial/);
  assert.match(shell.html, /docs\/roadmap\/ROADMAP\.md/);
  assert.match(shell.html, /orchestration_plan_recorded/);
  assert.doesNotMatch(shell.html, /<form\b|localStorage|sessionStorage|indexedDB|fetch\s*\(/i);
  assert.doesNotMatch(shell.html, /\bdrag|kanban|priority editor|claim work|schedule work\b/i);
  assert.equal(shell.responsive.text_overflow, false);
  assert.deepEqual(shell.responsive.overlaps, []);
});
