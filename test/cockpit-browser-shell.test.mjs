import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  cockpitStatusFixture,
  desktopViewport,
  evidenceDrilldownStatusFixture,
  liveCockpitStatusFixture
} from "./helpers/cockpit-status-fixture.mjs";

async function loadViewModelModule() {
  return import("../src/state/cockpit-view-model.ts");
}

async function loadBrowserShellModule() {
  return import("../src/cockpit/browser-shell.ts");
}

async function buildFixtureShell(viewport = desktopViewport()) {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderBrowserCockpitShell } = await loadBrowserShellModule();

  return renderBrowserCockpitShell(
    buildCockpitViewModel(cockpitStatusFixture()),
    viewport
  );
}

test("browser cockpit shell renders a served document with attention, evidence, and guarded actions", async () => {
  const shell = await buildFixtureShell();

  assert.equal(shell.kind, "browser_served_cockpit_shell");
  assert.equal(shell.authority, "presentation_derived_non_canonical");
  assert.equal(shell.preview_path, "public/cockpit/index.html");
  assert.equal(shell.assets.some((asset) => asset.path === "public/cockpit/cockpit.css"), true);
  assert.match(shell.html, /<!doctype html>/i);
  assert.match(shell.html, /<title>Bandit Workflow Cockpit<\/title>/);
  assert.match(shell.html, /<nav[^>]+aria-label="Attention categories"/);
  assert.match(shell.html, /<main[^>]+id="active-work"/);
  assert.match(shell.html, /<aside[^>]+aria-label="Evidence"/);
  assert.match(shell.html, /Operator input required/);
  assert.match(shell.html, /BANDIT-033/);
  assert.match(shell.html, /Write Stage 2 RED evidence for BANDIT-033\./);
  assert.match(shell.html, /docs\/work\/BANDIT-033\/brief\.md/);
  assert.match(shell.html, /data-command-family="bandit validate"/);
  assert.match(shell.html, /data-request-mode="cli_request_only"/);
  assert.match(shell.html, /data-authority-owner="bandit_cli"/);
  assert.match(shell.html, /data-command-family="bandit qwen-review"[^>]+disabled/);
  assert.match(shell.html, /Stage 2 RED evidence is missing\./);
});

test("browser cockpit shell renders guarded request details with sources and unavailable routes", async () => {
  const shell = await buildFixtureShell();

  assert.match(shell.html, /Validate repo/);
  assert.match(shell.html, /npm run bandit -- validate/);
  assert.match(shell.html, /docs\/roadmap\/CURRENT_CONTEXT\.md/);
  assert.match(shell.html, /Review gate/);
  assert.match(shell.html, /npm run bandit -- qwen-review BANDIT-033/);
  assert.match(shell.html, /docs\/work\/BANDIT-033\/red-evidence\.md/);
  assert.match(shell.html, /Record RED and implementation evidence before requesting review\./);
  assert.match(shell.html, /operator_owned_cli_uat/);
  assert.match(shell.html, /Record CLI-owned product UAT only after the operator-facing implementation exists\./);
  assert.doesNotMatch(shell.html, /<form\b|fetch\s*\(|localStorage|sessionStorage|indexedDB/i);
});

test("browser cockpit shell excludes hidden workflow authority and mutable browser state", async () => {
  const shell = await buildFixtureShell();

  assert.equal(shell.canonical_state_owner, "repo_native_artifacts_via_bandit_cli");
  assert.deepEqual(shell.prohibited_authority, [
    "browser_storage",
    "fixture_data",
    "generated_ui_state",
    "local_cache",
    "state_index",
    "web_component_state"
  ]);
  assert.equal(shell.mutation_forms.length, 0);
  assert.doesNotMatch(shell.html, /<form\b/i);
  assert.doesNotMatch(shell.html, /localStorage|sessionStorage|indexedDB|fetch\s*\(/i);
  assert.doesNotMatch(shell.html, /\b(api|merge|push|deploy|policy override)\b/i);
  assert.match(
    shell.html,
    /data-canonical-state-owner="repo_native_artifacts_via_bandit_cli"/
  );
});

test("browser cockpit shell exposes responsive and accessible shell constraints", async () => {
  const shell = await buildFixtureShell({ width: 390, height: 844 });

  assert.equal(shell.viewport, "mobile");
  assert.deepEqual(shell.accessibility.landmarks, ["navigation", "main", "complementary"]);
  assert.equal(shell.accessibility.focus_order.includes("evidence_drilldown"), true);
  assert.equal(shell.responsive.text_overflow, false);
  assert.equal(shell.responsive.source_paths_wrap, true);
  assert.deepEqual(shell.responsive.overlaps, []);
  assert.match(shell.css, /--color-canvas:\s*#050506/);
  assert.match(shell.css, /--color-attention:\s*#ff7a59/);
  assert.match(shell.css, /--color-pass:\s*#[0-9a-f]{6}/i);
  assert.match(shell.css, /--color-blocker:\s*#[0-9a-f]{6}/i);
  assert.match(shell.css, /--color-source-link:\s*#[0-9a-f]{6}/i);
  assert.match(shell.css, /--space-1:\s*4px/);
  assert.match(shell.css, /font-family:\s*"Instrument Sans"/);
  assert.match(shell.css, /font-family:\s*"IBM Plex Mono"/);
  assert.match(shell.css, /@media\s*\(max-width:\s*719px\)/);
  assert.match(shell.css, /overflow-wrap:\s*anywhere/);
  assert.match(shell.css, /:focus-visible/);
});

test("browser cockpit shell renders live CLI status fields on the first screen", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderBrowserCockpitShell } = await loadBrowserShellModule();

  const shell = renderBrowserCockpitShell(
    buildCockpitViewModel(liveCockpitStatusFixture()),
    desktopViewport()
  );

  assert.match(shell.html, /Phase 8 - Workflow Cockpit kickoff/);
  assert.match(shell.html, /BANDIT-067/);
  assert.match(shell.html, /Write Test Writer-owned Stage 2 RED evidence/);
  assert.match(shell.html, /none_required/);
  assert.match(shell.html, /No blockers or stale evidence/);
  assert.match(shell.html, /not_ready/);
  assert.match(shell.html, /not_applicable/);
  assert.match(shell.html, /bootstrap gaps[^<]*none/i);
  assert.match(shell.html, /orchestration_plan_recorded/);
  assert.match(shell.html, /pending_candidates/);
  for (const gateId of [
    "stage_0_context_readiness",
    "stage_1_brief",
    "stage_2_red_evidence",
    "stage_3_implementation",
    "stage_4_review",
    "stage_5_landing",
    "stage_6_retrospective"
  ]) {
    assert.match(shell.html, new RegExp(gateId));
  }
  assert.match(shell.html, /docs\/work\/BANDIT-067\/coordination-log\.jsonl/);
});

test("static cockpit preview is refreshed from the current live-status work item", async () => {
  const html = await readFile("public/cockpit/index.html", "utf8");

  assert.match(html, /BANDIT-083/);
  assert.match(html, /Bandit Cockpit UI Polish From Attached Design/);
  assert.match(html, /orchestration_plan_recorded/);
  assert.match(html, /docs\/work\/BANDIT-083\/coordination-log\.jsonl/);
  assert.doesNotMatch(html, /BANDIT-067/);
});

test("browser cockpit shell renders source-linked gate matrix and evidence rows in desktop and mobile previews", async () => {
  const { buildCockpitViewModel } = await loadViewModelModule();
  const { renderBrowserCockpitShell } = await loadBrowserShellModule();
  const viewModel = buildCockpitViewModel(evidenceDrilldownStatusFixture());

  const desktop = renderBrowserCockpitShell(viewModel, desktopViewport());
  const mobile = renderBrowserCockpitShell(viewModel, { width: 390, height: 844 });

  for (const shell of [desktop, mobile]) {
    assert.match(shell.html, /aria-label="Stage gate matrix"/);
    assert.match(shell.html, /class="evidence-row gate-matrix-row"/);
    assert.match(shell.html, /data-evidence-state="missing"/);
    assert.match(shell.html, /data-freshness-state="missing"/);
    assert.match(shell.html, /class="evidence-state-label">missing<\/span>/);
    assert.match(shell.html, /class="evidence-freshness-label">missing evidence<\/span>/);
    assert.match(shell.html, /Stage 2 RED evidence/);
    assert.match(shell.html, /missing_required_stage_evidence/);
    assert.match(shell.html, /review_subject_hash_drift/);
    assert.match(shell.html, /docs\/work\/BANDIT-068\/review-evidence\.md/);
    assert.match(shell.html, /aria-label="Evidence detail"/);
    assert.match(shell.html, /class="evidence-row evidence-detail-row"/);
    assert.match(shell.html, /Landing readiness/);
    assert.match(shell.html, /implementation evidence is not recorded/);
    assert.match(shell.html, /orchestration_plan_recorded/);
    assert.match(shell.html, /Artifact-specific Evidence Trust Signals/);
    assert.doesNotMatch(shell.html, /<form\b|localStorage|sessionStorage|indexedDB|fetch\s*\(/i);
    assert.equal(shell.responsive.text_overflow, false);
    assert.equal(shell.responsive.source_paths_wrap, true);
    assert.equal(shell.responsive.detail_rows_wrap, true);
    assert.deepEqual(shell.responsive.overlaps, []);
  }
  assert.equal(mobile.responsive.source_paths_wrap, true);
  assert.equal(mobile.responsive.detail_rows_wrap, true);
});
