# BANDIT-079 Retrospective

## Outcome

`BANDIT-079` landed and closed the Improvement Health Surface Phase 8 product
slice. The work adds a presentation-only cockpit surface for improvement
candidates, maps full candidate details into source-linked rows, and fails
closed to `missing_metadata` rows when the live cockpit status payload only
contains candidate string IDs.

The slice deliberately avoids automatic improvement evaluation, browser-side
CLI execution, local API authority, browser storage, artifact writes, UAT
approval authority, landing-safety authority, merge, push, deploy, scheduler
execution, Trust Verifier cutover, dependency changes, paid reviewer routing,
hosted services, telemetry, or unrelated Phase 8 product work.

## What Worked

- The Work Item PM plan, RED evidence, implementation evidence, review
  evidence, UAT, landing action, and closeout stayed grounded in repo-native
  artifacts.
- Claude completed the Stage 3 implementation and the focused live-status
  fallback repair without touching Test Writer-owned tests, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, or retrospective evidence.
- PM verification caught a real live-status integration gap that fixture tests
  did not cover: `improvement_health.candidates` carried IDs without
  `candidate_details`.
- The repair stayed small and fail-closed by building fallback rows with
  `missing_metadata` guardrails and `not available` detail fields.
- Stage 4 stayed honest: CodeRabbit timed out after the required 600-second
  window with no pass claimed, while Local Qwen completed through the
  authorized MLX adapter route and returned pass with no findings.
- Browser smoke verified both the static non-canonical preview and live render
  path at desktop and mobile responsive constraints.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Fixture coverage can miss live CLI payload shape gaps. | resolved | PM added a live-status smoke after focused tests; the resulting Claude repair ensures the browser surface does not render empty when only candidate IDs are available. |
| Fallback presentation for missing metadata must be visibly incomplete. | resolved | Fallback rows use `state: "missing_metadata"`, missing guardrail fields, and `not available` details rather than inferring health or outcomes. |
| CodeRabbit provider timeout remains recurring Stage 4 latency friction. | explicit no-action decision | The timeout is recorded as bootstrap replacement evidence with no pass claimed; Local Qwen, PM review, risk classification, supply-chain gate, browser smoke, and full verification were sufficient for this slice. |
| Static preview evidence must remain non-canonical. | resolved | Browser smoke records the preview as deterministic presentation evidence only; live status and render smoke prove the current `BANDIT-079` rows. |
| Local Qwen clean-worktree requirements affect Stage 4 sequencing. | explicit no-action decision | The checkpoint commit before Local Qwen is compatible with the existing review-subject hash and landing gates; no new repo chore is justified. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| test gap | Focused fixtures covered full `candidate_details`, but live status exposed only string IDs. | resolved - PM live smoke and Claude repair added fail-closed fallback behavior without changing tests |
| reviewer/tool friction | CodeRabbit timed out after the full 600-second window. | explicit no-action decision - provider-timeout evidence is recorded as bootstrap replacement evidence with no pass claim |
| work-breakdown fit | The slice stayed within one product surface despite touching state, view-model, browser shell, tests, and stage evidence. | no_action - no split is needed after landing because verification and review evidence passed |
| agent-scope fit | Codex authored RED and PM evidence; Stage 3 source went to Claude. | resolved - model-family separation and the Permanent Test Ownership Boundary held |
| tool-use rule pressure | Local Qwen required a clean worktree, forcing an intermediate source/evidence checkpoint before Stage 4 could complete. | explicit no-action decision - this is the current reviewer tooling contract and was satisfied without bypassing gates |
| recurring inefficiency | Review subject hash had to be refreshed after UAT status metadata changed from pending wording to a shared verdict value. | explicit no-action decision - the landing gate caught the stale hash before landing |
| cost or latency signals | No dependency, hosted service, paid reviewer, paid model route, merge, push, or deploy was introduced. CodeRabbit consumed wall time but did not create new cost policy scope. | explicit no-action decision - no provider-pricing or spend-class follow-up is required |
| unresolved uncertainty | No open bootstrap gap remains, and the next Phase 8 product slice target is not yet named in roadmap artifacts. | deferred_to_repo_pm - triage and form the next cockpit slice only when product direction is sufficient |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material implementation lesson, live payload fallback, was resolved inside
the slice before review. The CodeRabbit timeout and clean-worktree sequencing
remain known process costs rather than new product or bootstrap gaps.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-079`. Claude authored
the Stage 3 implementation, Codex PM verified live behavior and clean-code
posture, CodeRabbit timed out with no pass claimed, and Local Qwen passed with
no findings.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-079` closeout. The next recorded
action is Repo PM triage and formation for the next Phase 8 cockpit product
slice if roadmap/product direction is sufficient; otherwise ask the operator
for the missing product direction.
