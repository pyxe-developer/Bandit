import type { CockpitViewModel } from "../state/cockpit-view-model.js";
import { renderCockpitShell } from "./render.ts";

type Viewport = { width: number; height: number };

type BrowserShellAsset = { path: string; kind: string };

type Accessibility = {
  landmarks: string[];
  focus_order: string[];
};

type Responsive = {
  text_overflow: boolean;
  source_paths_wrap?: boolean;
  overlaps: never[];
};

type BrowserCockpitShell = {
  kind: "browser_served_cockpit_shell";
  authority: "presentation_derived_non_canonical";
  preview_path: "public/cockpit/index.html";
  assets: BrowserShellAsset[];
  html: string;
  css: string;
  canonical_state_owner: "repo_native_artifacts_via_bandit_cli";
  prohibited_authority: string[];
  mutation_forms: never[];
  viewport: "desktop" | "mobile";
  accessibility: Accessibility;
  responsive: Responsive;
};

type CockpitShell = ReturnType<typeof renderCockpitShell>;
type RenderedControl = CockpitShell["controls"][number];

const SHELL_ASSETS: BrowserShellAsset[] = [
  { path: "public/cockpit/cockpit.css", kind: "stylesheet" }
];

const SHELL_CSS = `
:root {
  --color-canvas: #050506;
  --color-primary: #ff7a59;
  --color-surface: #0e0e10;
  --color-text: #e8e8ec;
  --color-muted: #8a8a9a;
  --color-border: #1e1e24;
  --radius: 6px;
  --gap: 16px;
  font-family: system-ui, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-canvas);
  color: var(--color-text);
  min-height: 100vh;
}

.cockpit-layout {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  gap: var(--gap);
  padding: var(--gap);
  min-height: 100vh;
}

nav[aria-label="Attention categories"],
main[id="active-work"],
aside[aria-label="Evidence"] {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--gap);
  overflow-wrap: anywhere;
}

.action-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  min-height: 36px;
}

.action-button[disabled],
.action-button[aria-disabled="true"] {
  color: var(--color-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.source-link {
  overflow-wrap: anywhere;
  word-break: break-all;
  color: var(--color-primary);
}

.disabled-reason {
  display: block;
  font-size: 0.85em;
  color: var(--color-muted);
  margin-top: 4px;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (max-width: 719px) {
  .cockpit-layout {
    grid-template-columns: 1fr;
  }
  .action-button { min-height: 44px; }
}
`.trim();

export function renderBrowserCockpitShell(
  viewModel: CockpitViewModel,
  viewport: Viewport
): BrowserCockpitShell {
  const cockpitShell = renderCockpitShell(viewModel, viewport);
  const isMobile = viewport.width < 720;

  return {
    kind: "browser_served_cockpit_shell",
    authority: "presentation_derived_non_canonical",
    preview_path: "public/cockpit/index.html",
    assets: SHELL_ASSETS,
    html: buildHtml(cockpitShell),
    css: SHELL_CSS,
    canonical_state_owner: "repo_native_artifacts_via_bandit_cli",
    prohibited_authority: viewModel.prohibited_authority,
    mutation_forms: [],
    viewport: isMobile ? "mobile" : "desktop",
    accessibility: {
      landmarks: ["navigation", "main", "complementary"],
      focus_order: cockpitShell.keyboard.focus_order
    },
    responsive: buildResponsive(isMobile)
  };
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char] ?? char);
}

function buildResponsive(isMobile: boolean): Responsive {
  if (isMobile) {
    return { text_overflow: false, source_paths_wrap: true, overlaps: [] };
  }
  return { text_overflow: false, overlaps: [] };
}

function buildHtml(shell: CockpitShell): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bandit Workflow Cockpit</title>
  <link rel="stylesheet" href="cockpit.css">
</head>
<body data-canonical-state-owner="repo_native_artifacts_via_bandit_cli">
  <div class="cockpit-layout">
    ${buildAttentionNav(shell)}
    ${buildActiveWorkMain(shell)}
    ${buildEvidenceAside(shell)}
  </div>
</body>
</html>`;
}

function buildAttentionNav(shell: CockpitShell): string {
  const items = shell.attention_navigation
    .map(item => `        <li><a class="attention-link" href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`)
    .join("\n");

  return `<nav class="attention-nav" aria-label="Attention categories">
      <h2>Attention</h2>
      <ul>
${items}
      </ul>
    </nav>`;
}

function buildActiveWorkMain(shell: CockpitShell): string {
  const controls = shell.controls.map(buildControlHtml).join("\n        ");

  return `<main id="active-work">
      <h1>${escapeHtml(shell.primary_panel.heading)}</h1>
      <p class="work-item">${escapeHtml(shell.primary_panel.work_item)}</p>
      <p class="next-action">${escapeHtml(shell.primary_panel.next_action)}</p>
      <p class="evidence-source">
        <a class="source-link" href="${escapeHtml(shell.primary_panel.source)}">${escapeHtml(shell.primary_panel.source)}</a>
      </p>
      <section class="actions-section">
        <h2>Actions</h2>
        ${controls}
      </section>
      ${buildStatusCuesSection(shell)}
      ${buildGateStripSection(shell)}
    </main>`;
}

function buildStatusCuesSection(shell: CockpitShell): string {
  const items = shell.status_cues.map(buildStatusCueHtml).join("\n");

  return `<section class="status-cues" aria-label="Live status">
      <h2>Live status</h2>
      <ul>
${items}
      </ul>
    </section>`;
}

function buildStatusCueHtml(cue: CockpitShell["status_cues"][number]): string {
  const source = cue.source ?? cue.sources?.[0];
  const sourceLink = source
    ? ` <a class="source-link" href="${escapeHtml(source)}">${escapeHtml(source)}</a>`
    : "";

  return `        <li class="status-cue"><span class="cue-text">${escapeHtml(cue.label)}: ${escapeHtml(cue.status)}</span>${sourceLink}</li>`;
}

function buildGateStripSection(shell: CockpitShell): string {
  const items = shell.gate_strip
    .map(
      (gate) =>
        `        <li class="gate"><span class="gate-text">${escapeHtml(gate.id)}: ${escapeHtml(gate.status)}</span></li>`
    )
    .join("\n");

  return `<section class="gate-strip" aria-label="Stage gates">
      <h2>Gates</h2>
      <ul>
${items}
      </ul>
    </section>`;
}

function buildControlHtml(control: RenderedControl): string {
  if (control.disabled) {
    const describedBy = control.described_by ?? `${control.id}_reason`;
    return `<button class="action-button" id="${escapeHtml(control.id)}" role="button" data-command-family="${escapeHtml(control.command_family)}" disabled aria-disabled="true" aria-describedby="${escapeHtml(describedBy)}">${escapeHtml(control.label)}</button>
        <span id="${escapeHtml(describedBy)}" class="disabled-reason">${escapeHtml(control.reason)}</span>`;
  }
  return `<button class="action-button" id="${escapeHtml(control.id)}" role="button" data-command-family="${escapeHtml(control.command_family)}" aria-disabled="false">${escapeHtml(control.label)}</button>`;
}

function buildEvidenceAside(shell: CockpitShell): string {
  const sourceLinks = shell.evidence_drilldown.sources
    .map(source => `        <li><a class="source-link" href="${escapeHtml(source)}">${escapeHtml(source)}</a></li>`)
    .join("\n");

  return `<aside id="evidence_drilldown" aria-label="Evidence">
      <h2>${escapeHtml(shell.evidence_drilldown.heading)}</h2>
      <ul>
${sourceLinks}
      </ul>
    </aside>`;
}
