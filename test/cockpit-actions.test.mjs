import assert from "node:assert/strict";
import test from "node:test";
import {
  cockpitStatusFixture,
  liveCockpitStatusFixture
} from "./helpers/cockpit-status-fixture.mjs";

async function loadActionModule() {
  return import("../src/state/cockpit-actions.ts");
}

test("guarded action requests carry command family, source, owner, gates, and request-only authority", async () => {
  const { deriveCockpitActionAffordances } = await loadActionModule();

  const actions = deriveCockpitActionAffordances(liveCockpitStatusFixture());

  assert.equal(actions.length >= 5, true);
  for (const action of actions) {
    assert.equal(action.request_mode, "cli_request_only");
    assert.equal(action.executes_in_browser, false);
    assert.equal(action.writes_repo_artifacts, false);
    assert.equal(action.mutates_workflow_state, false);
    assert.match(action.source.path, /^docs\/|^\.bandit\//);
    assert.equal(typeof action.source.label, "string");
    assert.equal(typeof action.authority_owner, "string");
    assert.equal(typeof action.role_gate, "string");
    assert.equal(typeof action.operator_gate, "string");
    assert.equal(typeof action.unavailable_route, "string");
    assert.equal(
      ["enabled", "disabled", "excluded"].includes(action.presentation_state),
      true
    );
  }
});

test("guarded action request derivation makes read-only requests available and future-stage requests disabled with routes", async () => {
  const { deriveCockpitActionAffordances } = await loadActionModule();

  const actions = deriveCockpitActionAffordances(liveCockpitStatusFixture());
  const validate = actions.find((action) => action.id === "validate_repo");
  const inspectEvidence = actions.find((action) => action.id === "inspect_evidence");
  const reviewGate = actions.find((action) => action.id === "run_review_gate");
  const landingCheck = actions.find((action) => action.id === "check_landing_readiness");
  const recordUat = actions.find((action) => action.id === "record_uat");

  assert.deepEqual(validate, {
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
  });

  assert.equal(inspectEvidence.enabled, true);
  assert.equal(inspectEvidence.command_preview, "node ./bin/bandit.mjs cockpit status --json");
  assert.equal(inspectEvidence.source.path, "docs/work/BANDIT-067/brief.md");
  assert.equal(inspectEvidence.authority_owner, "bandit_cli");

  assert.deepEqual(reviewGate, {
    id: "run_review_gate",
    label: "Review gate",
    command_family: "bandit qwen-review",
    command_preview: "npm run bandit -- qwen-review BANDIT-067",
    enabled: false,
    presentation_state: "disabled",
    reason: "Stage 2 RED evidence is missing.",
    source: {
      label: "Stage 2 RED evidence",
      path: "docs/work/BANDIT-067/red-evidence.md"
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

  assert.equal(landingCheck.presentation_state, "disabled");
  assert.equal(landingCheck.source.path, "docs/work/BANDIT-067/implementation-evidence.md");
  assert.equal(landingCheck.unavailable_route, "Record current implementation and review evidence before land-check.");
  assert.equal(recordUat.presentation_state, "disabled");
  assert.equal(recordUat.operator_gate, "operator_owned_cli_uat");
  assert.equal(recordUat.unavailable_route, "Record CLI-owned product UAT only after the operator-facing implementation exists.");
});

test("guarded action requests refuse unsupported authority surfaces", async () => {
  const { deriveCockpitActionAffordances } = await loadActionModule();

  const actions = deriveCockpitActionAffordances(cockpitStatusFixture());
  const serialized = JSON.stringify(actions);

  assert.doesNotMatch(serialized, /\bmerge\b|\bpush\b|\bdeploy\b|policy override|Trust Verifier cutover/i);
  assert.equal(actions.some((action) => action.executes_in_browser), false);
  assert.equal(actions.some((action) => action.writes_repo_artifacts), false);
  assert.equal(actions.some((action) => action.mutates_workflow_state), false);
});
