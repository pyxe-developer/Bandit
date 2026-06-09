# BANDIT-080 Retrospective

## Outcome

`BANDIT-080` landed and closed the Queue & Context (Light) Phase 8 product
slice. The work adds a presentation-only cockpit surface for the active work
item, next planned slice, deferred queue context, not-yet-formed items,
unavailable queue-source states, and recent coordination transitions.

The slice deliberately avoids backlog management, work-item formation, browser
side CLI execution, local API authority, browser storage, artifact writes, UAT
approval authority, landing-safety authority, merge, push, deploy, scheduler
execution, Trust Verifier cutover, dependency changes, paid reviewer routing,
hosted services, telemetry, or unrelated Phase 8 product work.

## What Worked

- The Work Item PM plan, RED evidence, implementation evidence, review
  evidence, UAT, landing action, and closeout stayed grounded in repo-native
  artifacts.
- Codex authored Stage 2 RED evidence, so Stage 3 source implementation was
  routed to Claude-family implementation under the Permanent Test Ownership
  Boundary.
- PM verification caught a real live integration gap after the first Stage 3
  pass: the browser shell could render the fixture-backed queue surface while
  live `cockpit status --json` did not yet expose queue context rows.
- Stage 4 repairs stayed bounded to fail-closed queue derivation, roadmap item
  status mapping, and helper extraction.
- Local Qwen ran through the authorized MLX adapter route and drove useful
  non-blocking hardening around missing source rows, not-yet-formed items,
  regex robustness, and durable PM disposition.
- CodeRabbit timed out after the full 600-second window with no pass claimed,
  and the timeout was recorded honestly as bootstrap-gap replacement evidence.
- Browser smoke verified static preview and live desktop/mobile render paths;
  live render proved three queue rows and recent transition evidence without
  browser workflow authority.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Fixture coverage can miss live CLI payload projection gaps. | resolved | PM added live render smoke and Stage 4 repairs so `cockpit status --json` now exposes queue context rows from roadmap/current-context artifacts. |
| Queue context must fail closed when roadmap queue evidence is unavailable. | resolved | Missing roadmap queue rows produce an unavailable source row instead of a synthetic healthy fallback. |
| Not-yet-formed roadmap items need explicit status. | resolved | `TBD` planned items map to `not_yet_formed`, preserving the slice boundary and avoiding hidden formation authority. |
| Contradictory queue evidence belongs at the CLI status boundary, not as an extra browser row. | explicit no-action decision | `CURRENT_CONTEXT` and `ROADMAP` disagreement already blocks cockpit and session-context status; duplicating that as a browser row would blur source-of-truth boundaries. |
| Stale queue-row test expansion is useful but broader than this slice. | explicit no-action decision | Existing stale-evidence gates, missing-source tests, focused queue tests, and live render smoke cover this slice; dedicated stale queue-row parser/UI tests should wait for a broader stale-state surface. |
| CodeRabbit provider timeout remains recurring Stage 4 latency friction. | explicit no-action decision | The timeout is recorded as bootstrap replacement evidence with no pass claimed; Local Qwen, PM review, risk classification, supply-chain gate, browser smoke, and full verification were sufficient for this slice. |
| Landing-time UAT freshness requires a source/evidence commit before UAT refresh. | resolved | The PM committed Stage 5 evidence, refreshed UAT and landing verdict source-head metadata under the allowed work-item package path, then ran local-record landing. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| test gap | Focused fixtures initially covered queue presentation but not live `cockpit status --json` queue context derivation. | resolved - PM added live smoke and Stage 4 source repairs before aggregate review evidence |
| reviewer/tool friction | CodeRabbit timed out after the full 600-second window. | explicit no-action decision - provider-timeout evidence is recorded as bootstrap replacement evidence with no pass claim |
| reviewer finding | Local Qwen asked for durable handling of contradictory and stale queue states. | no_action - contradictory state remains a CLI-level fail-closed status gate, and stale row expansion is deferred until broader parser/UI scope |
| work-breakdown fit | The slice touched status derivation, view model, browser rendering, tests, and stage evidence. | no_action - the work remained one bounded product surface and passed review gates |
| agent-scope fit | Codex authored RED and PM evidence; Claude performed Stage 3 source implementation. | resolved - model-family separation and the Permanent Test Ownership Boundary held |
| landing mechanics | UAT becomes stale when committed before the final source/evidence checkpoint. | resolved - refreshed UAT after the checkpoint and used allowed landing-time work-item evidence dirtiness for local-record landing |
| cost or latency signals | No dependency, hosted service, paid reviewer, paid model route, merge, push, or deploy was introduced. CodeRabbit consumed wall time but did not create new cost policy scope. | explicit no-action decision - no provider-pricing or spend-class follow-up is required |
| unresolved uncertainty | No open bootstrap gap remains, and the next roadmap target is the Operator Attention / Operator Inbox surface if Repo PM confirms product direction remains sufficient. | deferred_to_repo_pm - form the next slice only through Repo PM formation |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material implementation lesson, live queue context derivation, was resolved
inside the slice before landing. The CodeRabbit timeout, stale queue-row
expansion, and contradictory-state browser-row idea are explicit no-action
decisions for this slice.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-080`. Claude authored
Stage 3 source implementation, Codex PM verified live behavior and clean-code
posture, CodeRabbit timed out with no pass claimed, and Local Qwen produced
non-blocking findings that were repaired or dispositioned.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-080` closeout. The next recorded
action is Repo PM triage and formation for the Operator Attention / Operator
Inbox surface if roadmap/product direction is sufficient; otherwise ask the
operator for the missing product direction.
