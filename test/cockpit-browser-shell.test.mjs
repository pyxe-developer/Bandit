import assert from "node:assert/strict";
import test from "node:test";
import { cockpitStatusFixture, desktopViewport } from "./helpers/cockpit-status-fixture.mjs";

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
  assert.match(shell.html, /data-command-family="bandit qwen-review"[^>]+disabled/);
  assert.match(shell.html, /Stage 2 RED evidence is missing\./);
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
  assert.match(shell.css, /--color-primary:\s*#ff7a59/);
  assert.match(shell.css, /@media\s*\(max-width:\s*719px\)/);
  assert.match(shell.css, /overflow-wrap:\s*anywhere/);
  assert.match(shell.css, /:focus-visible/);
});
