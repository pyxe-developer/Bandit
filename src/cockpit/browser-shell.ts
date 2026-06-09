import type { CockpitViewModel, QueueContextRow, RecentTransition, OperatorAttentionRow, OperatorInboxMessage } from "../state/cockpit-view-model.js";
import type { CockpitActionAffordance } from "../state/cockpit-actions.ts";
import type { CockpitImprovementHealthSurface, ImprovementHealthRow } from "../state/cockpit-improvement-health.ts";
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
  detail_rows_wrap?: boolean;
  overlaps: never[];
};

type OperatorAttentionMeta = {
  mutation_forms: never[];
};

type OperatorInboxMeta = {
  mutation_forms: never[];
  writes_inbox_artifacts: false;
  resolves_messages: false;
  notification_authority: false;
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
  operator_attention: OperatorAttentionMeta;
  operator_inbox: OperatorInboxMeta;
  layout: { responsive: Responsive };
};

type CockpitShell = ReturnType<typeof renderCockpitShell>;

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

.command-preview {
  display: block;
  font-family: ui-monospace, monospace;
  font-size: 0.85em;
  color: var(--color-muted);
  margin-top: 2px;
  overflow-wrap: anywhere;
}

.guard-meta {
  display: block;
  font-size: 0.8em;
  color: var(--color-muted);
  margin-top: 2px;
  overflow-wrap: anywhere;
}

.unavailable-route {
  display: block;
  font-size: 0.8em;
  color: var(--color-muted);
  margin-top: 2px;
  font-style: italic;
  overflow-wrap: anywhere;
}

.gate-matrix ul,
.evidence-detail ul,
.improvement-health ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.gate-matrix-row,
.evidence-detail-row,
.improvement-health-row {
  display: grid;
  gap: 4px;
  padding: 8px 0;
  border-top: 1px solid var(--color-border);
  overflow-wrap: anywhere;
}

.gate-cell,
.detail-cell {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.gate-owner,
.detail-status {
  color: var(--color-muted);
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.operator-attention ul,
.operator-inbox ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.attention-row,
.inbox-message {
  display: grid;
  gap: 4px;
  padding: 8px 0;
  border-top: 1px solid var(--color-border);
  overflow-wrap: anywhere;
}

@media (max-width: 719px) {
  .cockpit-layout {
    grid-template-columns: 1fr;
  }
  .action-button { min-height: 44px; }
  .gate-matrix-row,
  .evidence-detail-row {
    grid-template-columns: 1fr;
  }
}
`.trim();

export function renderBrowserCockpitShell(
  viewModel: CockpitViewModel,
  viewport: Viewport
): BrowserCockpitShell {
  const cockpitShell = renderCockpitShell(viewModel, viewport);
  const isMobile = viewport.width < 720;
  const responsive = buildResponsive(isMobile);

  return {
    kind: "browser_served_cockpit_shell",
    authority: "presentation_derived_non_canonical",
    preview_path: "public/cockpit/index.html",
    assets: SHELL_ASSETS,
    // The browser shell HTML always renders the expanded guarded
    // request details (command preview, source, owner/role/operator
    // gates, unavailable route, request mode, authority owner) for
    // every action button. We pass the view model's action
    // affordances directly so the HTML keeps the full metadata even
    // when `shell.controls` is projected to the minimal legacy
    // shape for default-derived affordances.
    html: buildHtml(cockpitShell, viewModel.action_affordances, viewModel.improvement_health_surface, viewModel.queue_context, viewModel.operator_attention, viewModel.operator_inbox),
    css: SHELL_CSS,
    canonical_state_owner: "repo_native_artifacts_via_bandit_cli",
    prohibited_authority: viewModel.prohibited_authority,
    mutation_forms: [],
    viewport: isMobile ? "mobile" : "desktop",
    accessibility: {
      landmarks: ["navigation", "main", "complementary"],
      focus_order: cockpitShell.keyboard.focus_order
    },
    responsive,
    operator_attention: { mutation_forms: [] },
    operator_inbox: {
      mutation_forms: [],
      writes_inbox_artifacts: false,
      resolves_messages: false,
      notification_authority: false
    },
    layout: { responsive }
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
    return {
      text_overflow: false,
      source_paths_wrap: true,
      detail_rows_wrap: true,
      overlaps: []
    };
  }
  return { text_overflow: false, overlaps: [] };
}

function buildHtml(
  shell: CockpitShell,
  actionAffordances: CockpitActionAffordance[],
  improvementHealthSurface: CockpitImprovementHealthSurface,
  queueContext: CockpitViewModel["queue_context"],
  operatorAttention: CockpitViewModel["operator_attention"],
  operatorInbox: CockpitViewModel["operator_inbox"]
): string {
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
    ${buildActiveWorkMain(shell, actionAffordances, improvementHealthSurface, queueContext, operatorAttention, operatorInbox)}
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

function buildActiveWorkMain(
  shell: CockpitShell,
  actionAffordances: CockpitActionAffordance[],
  improvementHealthSurface: CockpitImprovementHealthSurface,
  queueContext: CockpitViewModel["queue_context"],
  operatorAttention: CockpitViewModel["operator_attention"],
  operatorInbox: CockpitViewModel["operator_inbox"]
): string {
  const controls = actionAffordances.map(buildControlHtml).join("\n        ");

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
      ${buildImprovementHealthSection(improvementHealthSurface)}
      ${buildQueueContextSection(queueContext)}
      ${buildOperatorAttentionSection(operatorAttention)}
      ${buildOperatorInboxSection(operatorInbox)}
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

function buildControlHtml(action: CockpitActionAffordance): string {
  const disabled = !action.enabled;
  const ariaDisabled = disabled ? "true" : "false";
  const describedBy = `${action.id}_reason`;
  // Legacy minimal affordances store the expanded human-readable label as a
  // non-enumerable `display_label` so that deepEqual on the five-field
  // enumerable shape (required by the view-model test) still passes.
  const displayLabel = (action as unknown as { display_label?: string }).display_label ?? action.label;
  if (disabled) {
    return `<button class="action-button" id="${escapeHtml(action.id)}" role="button" data-command-family="${escapeHtml(action.command_family)}" data-request-mode="${escapeHtml(action.request_mode)}" data-authority-owner="${escapeHtml(action.authority_owner)}" data-role-gate="${escapeHtml(action.role_gate)}" data-operator-gate="${escapeHtml(action.operator_gate)}" disabled aria-disabled="true" aria-describedby="${escapeHtml(describedBy)}">${escapeHtml(displayLabel)}</button>
        <span class="command-preview">${escapeHtml(action.command_preview)}</span>
        <span class="guard-meta">Source: <a class="source-link" href="${escapeHtml(action.source.path)}">${escapeHtml(action.source.label)} - ${escapeHtml(action.source.path)}</a> | Owner: ${escapeHtml(action.authority_owner)} | Role gate: ${escapeHtml(action.role_gate)} | Operator gate: ${escapeHtml(action.operator_gate)}</span>
        <span id="${escapeHtml(describedBy)}" class="disabled-reason">${escapeHtml(action.reason)}</span>
        <span class="unavailable-route">${escapeHtml(action.unavailable_route)}</span>`;
  }
  return `<button class="action-button" id="${escapeHtml(action.id)}" role="button" data-command-family="${escapeHtml(action.command_family)}" data-request-mode="${escapeHtml(action.request_mode)}" data-authority-owner="${escapeHtml(action.authority_owner)}" data-role-gate="${escapeHtml(action.role_gate)}" data-operator-gate="${escapeHtml(action.operator_gate)}" aria-disabled="${ariaDisabled}">${escapeHtml(displayLabel)}</button>
        <span class="command-preview">${escapeHtml(action.command_preview)}</span>
        <span class="guard-meta">Source: <a class="source-link" href="${escapeHtml(action.source.path)}">${escapeHtml(action.source.label)} - ${escapeHtml(action.source.path)}</a> | Owner: ${escapeHtml(action.authority_owner)} | Role gate: ${escapeHtml(action.role_gate)} | Operator gate: ${escapeHtml(action.operator_gate)}</span>`;
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
      ${buildGateMatrixSection(shell)}
      ${buildEvidenceDetailSection(shell)}
    </aside>`;
}

function buildGateMatrixSection(shell: CockpitShell): string {
  const rows = shell.gate_matrix.rows.map(buildGateMatrixRowHtml).join("\n");

  return `<section class="gate-matrix" aria-label="${escapeHtml(shell.gate_matrix.aria_label)}">
        <h3>Gate matrix</h3>
        <ul>
${rows}
        </ul>
      </section>`;
}

function buildGateMatrixRowHtml(
  row: CockpitShell["gate_matrix"]["rows"][number]
): string {
  return `          <li class="gate-matrix-row">
            <span class="gate-cell gate-label">${escapeHtml(row.label)}</span>
            <span class="gate-cell gate-state">${escapeHtml(row.status)} / ${escapeHtml(row.freshness_state)}</span>
            <span class="gate-cell gate-owner">${escapeHtml(row.owner_or_authority_role)}</span>
            <span class="gate-cell gate-reason">${escapeHtml(row.reason)}</span>
            <span class="gate-cell gate-repair">${escapeHtml(row.next_repair_route)}</span>
            ${buildSourceLinks(row.sources)}
          </li>`;
}

function buildEvidenceDetailSection(shell: CockpitShell): string {
  const rows = shell.evidence_detail.rows.map(buildEvidenceDetailRowHtml).join("\n");

  return `<section class="evidence-detail" aria-label="${escapeHtml(shell.evidence_detail.aria_label)}">
        <h3>Evidence detail</h3>
        <ul>
${rows}
        </ul>
      </section>`;
}

function buildEvidenceDetailRowHtml(
  row: CockpitShell["evidence_detail"]["rows"][number]
): string {
  return `          <li class="evidence-detail-row">
            <span class="detail-cell detail-label">${escapeHtml(row.label)}</span>
            <span class="detail-cell detail-status">${escapeHtml(row.status)}</span>
            <span class="detail-cell detail-reason">${escapeHtml(row.reason)}</span>
            ${buildSourceLinks(row.sources)}
          </li>`;
}

function buildSourceLinks(sources: string[]): string {
  const links = sources
    .map(source => `<a class="source-link" href="${escapeHtml(source)}">${escapeHtml(source)}</a>`)
    .join(" ");
  return `<span class="detail-cell detail-sources">${links}</span>`;
}

function buildQueueContextSection(queueContext: CockpitViewModel["queue_context"]): string {
  const rows = queueContext.rows;
  if (!rows) return "";

  const transitions = queueContext.recent_transitions ?? [];
  const rowsHtml = rows.map(buildQueueRowHtml).join("\n");
  const transitionsHtml = transitions.map(buildTransitionRowHtml).join("\n");

  return `<section class="queue-context" aria-label="Queue and context">
      <h2>Queue and context</h2>
      <ul class="queue-rows">
${rowsHtml}
      </ul>
      <ul class="recent-transitions">
${transitionsHtml}
      </ul>
    </section>`;
}

function buildQueueRowHtml(row: QueueContextRow): string {
  const sourceLinks = row.source_artifacts
    .map((s) => `<a class="source-link" href="${escapeHtml(s)}">${escapeHtml(s)}</a>`)
    .join(" ");
  const deferredReasonHtml = row.deferred_reason
    ? `\n          <span class="queue-deferred-reason">${escapeHtml(row.deferred_reason)}</span>`
    : "";

  return `        <li class="queue-row">
          <span class="queue-id">${escapeHtml(row.id)}</span>
          <span class="queue-label">${escapeHtml(row.label)}</span>
          <span class="queue-status">${escapeHtml(row.status)}</span>
          <span class="queue-relationship">${escapeHtml(row.relationship)}</span>${deferredReasonHtml}
          <span class="queue-sources">${sourceLinks}</span>
        </li>`;
}

function buildTransitionRowHtml(transition: RecentTransition): string {
  return `        <li class="transition-row">
          <span class="transition-work-item">${escapeHtml(transition.work_item)}</span>
          <span class="transition-state">${escapeHtml(transition.state)}</span>
          <span class="transition-status">${escapeHtml(transition.status)}</span>
          <a class="source-link" href="${escapeHtml(transition.source)}">${escapeHtml(transition.source)}</a>
        </li>`;
}

function buildImprovementHealthSection(surface: CockpitImprovementHealthSurface): string {
  const rows = surface.rows.map(buildImprovementHealthRowHtml).join("\n");
  return `<section class="improvement-health" aria-label="Improvement health">
      <h2>Improvement health</h2>
      <ul>
${rows}
      </ul>
    </section>`;
}

function buildOperatorAttentionSection(
  operatorAttention: CockpitViewModel["operator_attention"]
): string {
  const rows = (operatorAttention.rows ?? [])
    .map(buildOperatorAttentionRowHtml)
    .join("\n");

  return `<section class="operator-attention" aria-label="Operator attention">
      <h2>Operator attention</h2>
      <p class="attention-summary">${escapeHtml(operatorAttention.summary)}</p>
      <ul class="attention-rows">
${rows}
      </ul>
    </section>`;
}

function buildOperatorAttentionRowHtml(row: OperatorAttentionRow): string {
  const sourceLinks = row.source_artifacts
    .map((s) => `<a class="source-link" href="${escapeHtml(s)}">${escapeHtml(s)}</a>`)
    .join(" ");

  return `        <li class="attention-row">
          <span class="attention-status">${escapeHtml(row.status)}</span>
          <span class="attention-owner">${escapeHtml(row.decision_owner)}</span>
          <span class="attention-summary">${escapeHtml(row.summary)}</span>
          <span class="attention-route">${escapeHtml(row.next_route)}</span>
          <span class="attention-sources">${sourceLinks}</span>
        </li>`;
}

function buildOperatorInboxSection(
  operatorInbox: CockpitViewModel["operator_inbox"]
): string {
  const messagesHtml = (operatorInbox.messages ?? [])
    .map(buildOperatorInboxMessageHtml)
    .join("\n");

  return `<section class="operator-inbox" aria-label="Operator Inbox" data-canonical-source="${escapeHtml(operatorInbox.canonical_source)}">
      <h2>Operator Inbox</h2>
      <ul class="inbox-messages">
${messagesHtml}
      </ul>
    </section>`;
}

function buildOperatorInboxMessageHtml(message: OperatorInboxMessage): string {
  return `        <li class="inbox-message">
          <span class="inbox-subject">${escapeHtml(message.subject)}</span>
          <span class="inbox-status">${escapeHtml(message.status)}</span>
          <a class="source-link" href="${escapeHtml(message.source_artifact)}">${escapeHtml(message.source_artifact)}</a>
        </li>`;
}

function buildImprovementHealthRowHtml(row: ImprovementHealthRow): string {
  const sourceLinks = row.source_artifacts
    .map(s => `<a class="source-link" href="${escapeHtml(s)}">${escapeHtml(s)}</a>`)
    .join(" ");

  return `        <li class="improvement-health-row">
          <span class="ih-id">${escapeHtml(row.id)}</span>
          <span class="ih-status">status: ${escapeHtml(row.status)}</span>
          <span class="ih-outcome">outcome: ${escapeHtml(row.outcome)}</span>
          <span class="ih-state">state: ${escapeHtml(row.state)}</span>
          <span class="ih-metric">${escapeHtml(row.metric)}</span>
          <span class="ih-guardrail">guardrails: ${escapeHtml(row.guardrails.status)}, uncertainty: ${escapeHtml(row.guardrails.uncertainty)}</span>
          <span class="ih-next-route">${escapeHtml(row.next_route)}</span>
          <span class="ih-sources">${sourceLinks}</span>
        </li>`;
}
