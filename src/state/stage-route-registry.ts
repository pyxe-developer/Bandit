export type LocalQwenRoute = {
  profile: string | null;
  command: string;
  direct_qwen_cli_allowed: boolean;
};

export type ReviewerRoutes = {
  local_qwen: LocalQwenRoute;
};

export type ProcessAdapter = {
  first_choice: string;
  fallback: string;
  fallback_after: string;
};

export type StageRoute = {
  stage: string;
  authority_role: string;
  route_type: string;
  command: string | null;
  process_adapter: ProcessAdapter | null;
  expected_evidence: string[];
  stop_conditions: string[];
  forbidden_fallbacks: string[];
  reviewer_routes?: ReviewerRoutes;
};

const STAGE_ROUTES: StageRoute[] = [
  {
    stage: "stage_2_red",
    authority_role: "test_writer",
    route_type: "local_codex_pm",
    command: null,
    process_adapter: null,
    expected_evidence: [
      "docs/work/<ID>/red-evidence.md",
      "test/work-execute-controller.test.mjs",
      "test/stage-route-registry.test.mjs",
      "test/role-input-packets.test.mjs",
      "test/provider-blocker-evidence.test.mjs"
    ],
    stop_conditions: ["missing_plan_mode", "unmapped_acceptance_criteria"],
    forbidden_fallbacks: ["stage_3_writer_test_edits"]
  },
  {
    stage: "stage_3_implementation",
    authority_role: "implementation_writer",
    route_type: "model_family_separated",
    command: null,
    process_adapter: {
      first_choice: "minimax_m3",
      fallback: "claude",
      fallback_after: "minimax_m3_failure_or_20_minute_timeout"
    },
    expected_evidence: [
      "docs/work/<ID>/implementation-evidence.md",
      "docs/work/<ID>/writer-report.md"
    ],
    stop_conditions: ["test_writer_boundary_violation", "missing_plan_mode"],
    forbidden_fallbacks: ["test_edits", "same_model_as_red_author"]
  },
  {
    stage: "stage_4_review",
    authority_role: "reviewer",
    route_type: "reviewer",
    command: null,
    process_adapter: null,
    reviewer_routes: {
      local_qwen: {
        profile: ".bandit/reviewers/local-qwen.json",
        command: "node bin/omlx-chat-completions.mjs",
        direct_qwen_cli_allowed: false
      }
    },
    expected_evidence: [
      "docs/work/<ID>/coderabbit-review.md",
      "docs/work/<ID>/local-qwen-review.md",
      "docs/work/<ID>/review-evidence.md"
    ],
    stop_conditions: ["unauthorized_local_qwen_route", "review_blocker"],
    forbidden_fallbacks: ["direct_qwen_cli", "ollama", "ad_hoc_reviewer"]
  },
  {
    stage: "stage_5_landing",
    authority_role: "landing_agent",
    route_type: "landing",
    command: "node ./bin/bandit.mjs land-check <ID>",
    process_adapter: null,
    expected_evidence: [
      "docs/work/<ID>/landing-verdict.md",
      "docs/work/<ID>/landing-action.md"
    ],
    stop_conditions: ["land_check_failure", "stale_review_evidence"],
    forbidden_fallbacks: ["auto_landing_without_verdict"]
  },
  {
    stage: "stage_6_closeout",
    authority_role: "closeout_agent",
    route_type: "closeout",
    command: "npm run bandit -- validate",
    process_adapter: null,
    expected_evidence: [
      "docs/work/<ID>/retrospective.md",
      "docs/work/<ID>/improvement-disposition.md"
    ],
    stop_conditions: ["validate_failure", "stale_coordination_evidence"],
    forbidden_fallbacks: ["missing_retrospective"]
  }
];

export function listStageRoutes(): StageRoute[] {
  return STAGE_ROUTES;
}

export function getStageRoute(stage: string): StageRoute {
  const route = STAGE_ROUTES.find((r) => r.stage === stage);
  if (!route) {
    throw new Error(
      `Missing authorized stage route: ${stage}; ` +
        `route must be explicitly registered before use`
    );
  }
  return route;
}

type RouteInput = {
  stage: string;
  authority_role: string;
  route_type: string;
  command: string | null;
  process_adapter: ProcessAdapter | null;
  reviewer_routes?: {
    local_qwen?: {
      profile: string | null;
      command: string;
      direct_qwen_cli_allowed: boolean;
    };
  };
  expected_evidence: string[];
  stop_conditions: string[];
  forbidden_fallbacks: string[];
};

export function validateStageRouteRegistry(routes: RouteInput[]): void {
  for (const route of routes) {
    const localQwen = route.reviewer_routes?.local_qwen;
    if (localQwen !== undefined) {
      if (
        localQwen.profile !== ".bandit/reviewers/local-qwen.json" ||
        localQwen.command !== "node bin/omlx-chat-completions.mjs" ||
        localQwen.direct_qwen_cli_allowed
      ) {
        throw new Error(
          `unauthorized Local Qwen route in stage ${route.stage}: ` +
            `must use profile=".bandit/reviewers/local-qwen.json", ` +
            `command="node bin/omlx-chat-completions.mjs", ` +
            `and direct_qwen_cli_allowed=false`
        );
      }
    }
  }
}
