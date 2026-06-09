import assert from "node:assert/strict";
import test from "node:test";
import { liveCockpitStatusFixture, desktopViewport } from "./helpers/cockpit-status-fixture.mjs";

async function loadViewModelModule() {
  return import("../src/state/cockpit-view-model.ts");
}

async function loadBrowserShellModule() {
  return import("../src/cockpit/browser-shell.ts");
}

function operatorAttentionFixture() {
  return {
    ...liveCockpitStatusFixture(),
    active_work_item: {
      id: "BANDIT-081",
      source: "docs/work/BANDIT-081/brief.md"
    },
    next_action: {
      value: "CLI-owned product UAT is required before landing BANDIT-081.",
      source: "docs/work/BANDIT-081/brief.md",
      agreement: {
        status: "pass",
        compared_with: "docs/roadmap/ROADMAP.md",
        basis: "normalized_text"
      }
    },
    required_operator_input: {
      value: "required",
      source: "docs/work/BANDIT-081/brief.md"
    },
    blockers: [
      {
        kind: "operator_input_required",
        status: "blocked",
        summary: "Operator must approve CLI-owned product UAT before landing.",
        source: "docs/work/BANDIT-081/uat-approval.md",
        source_artifacts: [
          "docs/work/BANDIT-081/brief.md",
          "docs/work/BANDIT-081/uat-approval.md"
        ]
      }
    ],
    gates: {
      ...liveCockpitStatusFixture().gates,
      stage_1_brief: {
        status: "pass",
        source: "docs/work/BANDIT-081/brief.md"
      },
      stage_2_red_evidence: {
        status: "pass",
        source: "docs/work/BANDIT-081/red-evidence.md"
      },
      stage_3_implementation: {
        status: "pass",
        source: "docs/work/BANDIT-081/implementation-evidence.md"
      },
      stage_4_review: {
        status: "pass",
        source: "docs/work/BANDIT-081/review-evidence.md"
      },
      stage_5_landing: {
        status: "missing",
        source: "docs/work/BANDIT-081/landing-verdict.md"
      },
      stage_6_retrospective: {
        status: "missing",
        source: "docs/work/BANDIT-081/retrospective.md"
      }
    },
    landing_readiness: {
      status: "not_ready",
      reason: "CLI-owned product UAT is not recorded",
      source: "docs/work/BANDIT-081/uat-approval.md"
    },
    uat: {
      status: "not_applicable",
      source: "docs/work/BANDIT-081/brief.md"
    },
    coordination: {
      current_state: "implementation_recorded",
      next_action: "Run Stage 4 review before landing.",
      source: "docs/work/BANDIT-081/coordination-log.jsonl"
    },
    stale_evidence: [
      {
        kind: "review_evidence",
        status: "stale",
        source: "docs/work/BANDIT-081/review-evidence.md",
        basis: "source_drift_status"
      }
    ],
    operator_inbox_source: {
      source: ".bandit/inbox",
      status: "available",
      messages: [
        {
          id: "uat-needed",
          work_item: "BANDIT-081",
          subject: "Product UAT needed for Operator Attention surface",
          status: "blocked",
          required_input: "Approve or reject CLI-owned product UAT.",
          source_artifact: ".bandit/inbox/uat-needed.md",
          created_at: "2026-06-09T03:40:00Z"
        },
        {
          id: "resolved-qwen",
          work_item: "BANDIT-081",
          subject: "Local Qwen review disposition is recorded",
          status: "resolved",
          required_input: "none_required",
          source_artifact: "docs/work/BANDIT-081/local-qwen-review.md",
          created_at: "2026-06-09T03:45:00Z"
        }
      ]
    }
  };
}

test("cockpit operator attention maps required input, blocker, stale, and route rows from repo-native sources", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const viewModel = buildCockpitViewModel(operatorAttentionFixture());

  assert.equal(viewModel.operator_attention.kind, "operator_attention");
  assert.equal(viewModel.operator_attention.status, "needs_operator_attention");
  assert.equal(
    viewModel.operator_attention.summary,
    "1 operator-owned input, 1 blocker, and 1 stale evidence item need attention."
  );
  assert.deepEqual(
    viewModel.operator_attention.rows.map((row) => ({
      id: row.id,
      status: row.status,
      decision_owner: row.decision_owner,
      required_input: row.required_input,
      next_route: row.next_route,
      summary: row.summary,
      source_artifacts: row.source_artifacts,
      freshness_state: row.freshness_state,
      blocked_reason: row.blocked_reason
    })),
    [
      {
        id: "operator_input",
        status: "required",
        decision_owner: "operator",
        required_input: "required",
        next_route: "CLI-owned product UAT evidence",
        summary: "CLI-owned product UAT is required before landing BANDIT-081.",
        source_artifacts: ["docs/work/BANDIT-081/brief.md"],
        freshness_state: "current",
        blocked_reason: undefined
      },
      {
        id: "blocker_1",
        status: "blocked",
        decision_owner: "operator",
        required_input: "required",
        next_route: "Resolve operator-owned input outside the browser cockpit",
        summary: "Operator must approve CLI-owned product UAT before landing.",
        source_artifacts: [
          "docs/work/BANDIT-081/brief.md",
          "docs/work/BANDIT-081/uat-approval.md"
        ],
        freshness_state: "current",
        blocked_reason: "blocked"
      },
      {
        id: "stale_1",
        status: "stale",
        decision_owner: "codex_pm",
        required_input: "none_required",
        next_route: "Refresh review_evidence evidence before landing",
        summary: "review_evidence evidence is stale because source_drift_status.",
        source_artifacts: ["docs/work/BANDIT-081/review-evidence.md"],
        freshness_state: "stale",
        blocked_reason: "source_drift_status"
      }
    ]
  );
});

test("cockpit operator inbox distinguishes empty source state from fixture-backed messages", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();

  const fixture = operatorAttentionFixture();
  const viewModel = buildCockpitViewModel(fixture);

  assert.equal(viewModel.operator_inbox.kind, "operator_inbox");
  assert.equal(viewModel.operator_inbox.status, "available");
  assert.equal(viewModel.operator_inbox.canonical_source, ".bandit/inbox");
  assert.equal(viewModel.operator_inbox.writes_inbox_artifacts, false);
  assert.equal(viewModel.operator_inbox.resolves_messages, false);
  assert.deepEqual(
    viewModel.operator_inbox.messages.map((message) => ({
      id: message.id,
      work_item: message.work_item,
      subject: message.subject,
      status: message.status,
      required_input: message.required_input,
      source_artifact: message.source_artifact
    })),
    [
      {
        id: "uat-needed",
        work_item: "BANDIT-081",
        subject: "Product UAT needed for Operator Attention surface",
        status: "blocked",
        required_input: "Approve or reject CLI-owned product UAT.",
        source_artifact: ".bandit/inbox/uat-needed.md"
      },
      {
        id: "resolved-qwen",
        work_item: "BANDIT-081",
        subject: "Local Qwen review disposition is recorded",
        status: "resolved",
        required_input: "none_required",
        source_artifact: "docs/work/BANDIT-081/local-qwen-review.md"
      }
    ]
  );

  const emptyFixture = operatorAttentionFixture();
  emptyFixture.operator_inbox_source = {
    source: ".bandit/inbox",
    status: "empty",
    messages: []
  };
  const emptyViewModel = buildCockpitViewModel(emptyFixture);

  assert.deepEqual(emptyViewModel.operator_inbox, {
    kind: "operator_inbox",
    status: "empty",
    canonical_source: ".bandit/inbox",
    summary: "No repo-native operator inbox messages are present.",
    messages: [],
    unavailable_reason: "empty_inbox",
    writes_inbox_artifacts: false,
    resolves_messages: false,
    notification_authority: false
  });
});

test("browser cockpit shell renders operator attention and inbox as read-only surfaces", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderBrowserCockpitShell } = await loadBrowserShellModule();

  const shell = renderBrowserCockpitShell(
    buildCockpitViewModel(operatorAttentionFixture()),
    desktopViewport()
  );

  assert.match(shell.html, /aria-label="Operator attention"/);
  assert.match(shell.html, /aria-label="Operator Inbox"/);
  assert.match(shell.html, /CLI-owned product UAT is required before landing BANDIT-081/);
  assert.match(shell.html, /Product UAT needed for Operator Attention surface/);
  assert.match(shell.html, /\.bandit\/inbox\/uat-needed\.md/);
  assert.match(shell.html, /Local Qwen review disposition is recorded/);
  assert.match(shell.html, /docs\/work\/BANDIT-081\/local-qwen-review\.md/);
  assert.match(shell.html, /data-canonical-source="\.bandit\/inbox"/);
  assert.equal(shell.operator_attention.mutation_forms.length, 0);
  assert.equal(shell.operator_inbox.mutation_forms.length, 0);
  assert.equal(shell.operator_inbox.writes_inbox_artifacts, false);
  assert.equal(shell.operator_inbox.resolves_messages, false);
  assert.equal(shell.operator_inbox.notification_authority, false);
  assert.equal(shell.layout.responsive.text_overflow, false);
  assert.equal(shell.layout.responsive.overlaps.length, 0);
  assert.doesNotMatch(shell.html, /<form/i);
  assert.doesNotMatch(shell.html, /localStorage|sessionStorage|fetch\(|resolve-message|archive-message|approve-uat|record-uat/);
});
