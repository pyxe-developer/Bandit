import assert from "node:assert/strict";
import test from "node:test";
import {
  getStageRoute,
  listStageRoutes,
  validateStageRouteRegistry
} from "../src/state/stage-route-registry.ts";

test("stage route registry maps authorized stage routes and evidence outputs", () => {
  const routes = listStageRoutes();

  assert.deepEqual(
    routes.map((route) => route.stage),
    ["stage_2_red", "stage_3_implementation", "stage_4_review", "stage_5_landing", "stage_6_closeout"]
  );

  assert.deepEqual(getStageRoute("stage_2_red"), {
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
  });

  assert.deepEqual(getStageRoute("stage_3_implementation").process_adapter, {
    first_choice: "claude",
    fallback: "minimax_m3",
    fallback_after: "claude_auth_failure_or_20_minute_timeout"
  });
  assert.equal(getStageRoute("stage_4_review").reviewer_routes.local_qwen.command, "node bin/omlx-chat-completions.mjs");
  assert.equal(getStageRoute("stage_4_review").reviewer_routes.local_qwen.profile, ".bandit/reviewers/local-qwen.json");
  assert.equal(getStageRoute("stage_4_review").reviewer_routes.local_qwen.direct_qwen_cli_allowed, false);
  assert.equal(getStageRoute("stage_5_landing").command, "node ./bin/bandit.mjs land-check <ID>");
  assert.equal(getStageRoute("stage_6_closeout").command, "npm run bandit -- validate");
});

test("stage route registry fails closed for missing or unauthorized routes", () => {
  assert.throws(
    () => getStageRoute("stage_4_local_qwen_direct_cli"),
    /Missing authorized stage route.*stage_4_local_qwen_direct_cli/i
  );

  assert.throws(
    () =>
      validateStageRouteRegistry([
        {
          stage: "stage_4_review",
          authority_role: "reviewer",
          route_type: "reviewer",
          command: "qwen review",
          process_adapter: null,
          reviewer_routes: {
            local_qwen: {
              profile: null,
              command: "qwen review",
              direct_qwen_cli_allowed: true
            }
          },
          expected_evidence: ["docs/work/<ID>/local-qwen-review.md"],
          stop_conditions: [],
          forbidden_fallbacks: []
        }
      ]),
    /unauthorized Local Qwen route/i
  );
});
