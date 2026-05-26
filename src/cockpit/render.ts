import type { CockpitViewModel } from "../state/cockpit-view-model.js";

type Viewport = {
  width: number;
  height: number;
};

type RenderedControl = {
  id: string;
  role: "button";
  label: string;
  command_family: string;
  disabled: boolean;
  "aria-disabled": "true" | "false";
  reason: string;
  described_by?: string;
};

const DESKTOP_MIN_CONTROL_SIZE_PX = 36;
const MOBILE_MIN_CONTROL_SIZE_PX = 44;

export function renderCockpitShell(
  viewModel: CockpitViewModel,
  viewport: Viewport
) {
  const controls = renderControls(viewModel.action_affordances);

  return {
    title: "Bandit Workflow Cockpit",
    landmarks: ["navigation", "main", "complementary"],
    attention_navigation: viewModel.attention_categories.map((category) => ({
      id: category.id,
      label: category.label,
      status: category.status
    })),
    primary_panel: {
      heading: headingForCategory(viewModel.primary_attention.category),
      work_item: viewModel.primary_attention.work_item,
      next_action: viewModel.active_work.next_action,
      evidence_cue: viewModel.primary_attention.confidence.state,
      source: confidenceSource(viewModel.primary_attention.confidence)
    },
    controls,
    links: buildLinks(viewModel),
    keyboard: {
      focus_order: [
        ...viewModel.attention_categories.slice(0, 3).map(
          (category) => `attention_${category.id}`
        ),
        ...controls.map((control) => control.id),
        "evidence_drilldown"
      ]
    },
    layout: layoutForViewport(viewport),
    evidence_drilldown: {
      heading: "Evidence",
      sources: viewModel.evidence_drilldown.sources,
      shows_hash_state: viewModel.evidence_drilldown.shows_hash_state,
      shows_gate_basis: viewModel.evidence_drilldown.shows_gate_basis,
      mutation_forms: [],
      canonical_state_owner: viewModel.canonical_state_owner
    },
    queue_context: {
      heading: "Queue context",
      status: viewModel.queue_context.status,
      summary: viewModel.queue_context.summary,
      sources: viewModel.queue_context.sources,
      mutation_forms: [],
      excluded_authority: viewModel.queue_context.excluded_authority
    }
  };
}

function renderControls(
  actions: CockpitViewModel["action_affordances"]
): RenderedControl[] {
  return actions.map((action) => ({
    id: action.id,
    role: "button" as const,
    label: action.label,
    command_family: action.command_family,
    disabled: !action.enabled,
    "aria-disabled": action.enabled ? "false" : "true",
    reason: action.reason,
    ...(action.enabled ? {} : { described_by: `${action.id}_reason` })
  }));
}

function buildLinks(viewModel: CockpitViewModel) {
  return viewModel.evidence_drilldown.sources.map((source) => ({
    label: source,
    href: source
  }));
}

function headingForCategory(category: string) {
  if (category === "operator_input_required") {
    return "Operator input required";
  }
  if (category === "blocked_or_stale") {
    return "Blocked or stale";
  }
  if (category === "landing_readiness") {
    return "Landing readiness";
  }
  if (category === "improvement_health") {
    return "Improvement health";
  }
  if (category === "queue_context") {
    return "Queue context";
  }
  return "Active work";
}

function confidenceSource(confidence: { source?: string; sources?: string[] }) {
  return confidence.source ?? confidence.sources?.[0] ?? "unknown";
}

function layoutForViewport(viewport: Viewport) {
  const baseLayout = {
    columns: ["attention", "work", "evidence"],
    text_overflow: false,
    overlaps: []
  };

  if (viewport.width < 720) {
    return {
      viewport: "mobile",
      ...baseLayout,
      stack_order: ["attention", "work", "actions", "evidence"],
      min_control_size_px: MOBILE_MIN_CONTROL_SIZE_PX,
      source_paths_wrap: true
    };
  }

  return {
    viewport: "desktop",
    ...baseLayout,
    min_control_size_px: DESKTOP_MIN_CONTROL_SIZE_PX
  };
}
