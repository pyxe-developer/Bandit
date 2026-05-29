import {
  FocusedSessionContextPacket,
  readFocusedSessionContext
} from "../state/focused-session-context.js";

export async function sessionContext(repoRoot: string, args: string[]) {
  const [subCommand, ...options] = args;

  if (subCommand !== "current") {
    throw new Error("Usage: bandit session-context current [--json|--markdown]");
  }

  const packet = await readFocusedSessionContext(repoRoot);

  if (options.includes("--markdown")) {
    return { output: renderMarkdown(packet) };
  }

  return { output: `${JSON.stringify(packet, null, 2)}\n` };
}

function renderMarkdown(packet: FocusedSessionContextPacket) {
  const activeWorkItemLine = packet.active_work_item
    ? `**Active work item:** ${packet.active_work_item.id}`
    : `**Active work item:** none`;
  const activeBootstrapGapLine = packet.active_bootstrap_gap
    ? `**Active bootstrap gap:** ${packet.active_bootstrap_gap.id}`
    : `**Active bootstrap gap:** none`;

  const lines: string[] = [
    "# Focused Session Context Packet",
    "",
    `**Authority:** ${packet.authority}`,
    "",
    "## Current Activation",
    "",
    `**Phase:** ${packet.current_phase.value} (source: ${packet.current_phase.source})`,
    activeWorkItemLine,
    activeBootstrapGapLine,
    `**Current stage:** ${packet.current_stage.value}`,
    `**Exact next action:** ${packet.exact_next_action.value}`,
    `**Required operator input:** ${packet.required_operator_input.value}`,
    "",
    "## Allowed Actions",
    "",
    ...packet.allowed_actions.map((action) => `- ${action}`),
    "",
    "## Forbidden Actions",
    "",
    ...packet.forbidden_actions.map((action) => `- ${action}`),
    "",
    "## Blockers",
    "",
    ...packet.blockers.map((b) => `- ${b.id}: ${b.status}`),
    "",
    "## Required Evidence Paths",
    "",
    ...packet.required_evidence_paths.map((e) => `- ${e.path} (${e.stage})`),
    "",
    "## Source Artifacts",
    "",
    ...packet.source_artifacts.map((s) => `- ${s.path}: ${s.role}`),
    "",
    "## Source Hierarchy",
    "",
    ...packet.source_hierarchy.map((h, i) => `${i + 1}. ${h.source} — ${h.authority}`),
    "",
    "## Deep Read Pointers",
    "",
    ...packet.deep_read_pointers.map((p) => `- ${p.source}: ${p.reason}`),
    ""
  ];
  return lines.join("\n");
}
