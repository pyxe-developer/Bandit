# BANDIT-081 Retrospective

## Outcome

`BANDIT-081` landed and closed the Operator Attention / Operator Inbox Surface
Phase 8 product slice. The work adds a presentation-only cockpit surface for
operator attention, required input, blocker, stale-evidence, next-route, and
repo-native inbox context without giving the browser authority to mutate inbox
artifacts or resolve messages.

The slice deliberately avoids inbox write/resolve/archive behavior,
notification delivery, browser-side CLI execution, local API authority, browser
storage, artifact writes, UAT approval authority, landing-safety authority,
merge, push, deploy, scheduler execution, Trust Verifier cutover, dependency
changes, paid reviewer routing, hosted services, telemetry, or unrelated Phase
8 product work.

## What Worked

- The Work Item PM plan, RED evidence, implementation evidence, review
  evidence, UAT, landing action, and closeout stayed grounded in repo-native
  artifacts.
- Codex authored Stage 2 RED evidence, so Stage 3 source implementation was
  routed to Claude-family implementation under the Permanent Test Ownership
  Boundary.
- CodeRabbit timed out after the full 600-second window but emitted three
  useful finding events; the null-guard findings and responsive duplication
  smell were repaired or dispositioned before aggregate review.
- Local Qwen ran through the authorized MLX adapter route and returned a pass
  verdict with no findings.
- Browser smoke verified the live desktop/mobile render path for Operator
  Attention and Operator Inbox and confirmed there is no browser-side mutation,
  inbox write/resolve, notification, UAT, landing, merge, push, deploy, or
  policy authority.
- Landing-time UAT freshness was handled by refreshing UAT and landing verdict
  source-head metadata after the Stage 5 source/evidence commit and before
  local-record landing.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Operator inbox must render empty/unavailable states without inventing messages. | resolved | Live render smoke confirmed the current repo has no operator inbox source and the shell renders zero messages with canonical `.bandit/inbox` source metadata. |
| Browser rendering helpers should tolerate absent derived arrays. | resolved | Stage 4 repair added empty-list fallbacks for missing operator-attention rows and inbox messages. |
| Responsive metadata should not be recomputed independently for legacy and new contracts. | resolved | Stage 4 repair computes responsive metadata once and reuses it for both `responsive` and `layout.responsive` while preserving the legacy field. |
| Static preview remains a deterministic snapshot and can lag the active slice. | explicit no-action decision | Current product smoke is the live CLI/render path; refreshing static preview content is outside this slice unless a future static-preview refresh slice explicitly takes it on. |
| CodeRabbit provider timeout remains recurring Stage 4 latency friction. | explicit no-action decision | Timeout is recorded as bootstrap replacement evidence with no CodeRabbit pass claimed; emitted findings were handled, and Local Qwen, PM review, risk classification, supply-chain gate, browser smoke, and full verification were sufficient for this slice. |
| Landing-time UAT freshness requires source-head refresh after the Stage 5 checkpoint. | resolved | UAT and landing verdict were refreshed against the current source/evidence head before local-record landing. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| reviewer finding | CodeRabbit identified missing null guards in browser render helpers. | resolved - Stage 4 repair added empty-list fallbacks and focused tests/typecheck passed |
| reviewer finding | CodeRabbit identified duplicate responsive metadata computation. | resolved - Stage 4 repair computes responsive metadata once while preserving both current contracts |
| browser smoke | Static preview still shows the deterministic `BANDIT-067` snapshot. | no_action - live CLI/render smoke is canonical for current `BANDIT-081` behavior; static snapshot refresh is deferred unless separately scoped |
| reviewer/tool friction | CodeRabbit timed out after the full 600-second window. | explicit no-action decision - provider-timeout evidence is recorded as bootstrap replacement evidence with no pass claim |
| agent-scope fit | Codex authored RED and PM evidence; Claude performed Stage 3 source implementation. | resolved - model-family separation and the Permanent Test Ownership Boundary held |
| landing mechanics | UAT becomes stale when recorded before the final source/evidence checkpoint. | resolved - refreshed UAT and landing verdict source heads under allowed work-item package dirtiness before local-record landing |
| cost or latency signals | No dependency, hosted service, paid reviewer, paid model route, merge, push, or deploy was introduced. CodeRabbit consumed wall time but did not create new cost policy scope. | explicit no-action decision - no provider-pricing or spend-class follow-up is required |
| unresolved uncertainty | No open bootstrap gap remains, and the next roadmap target is the V0 Closeout Claude Code A/B Product-Value Trial if Repo PM confirms product direction remains sufficient. | deferred_to_repo_pm - form the next slice only through Repo PM formation |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material implementation lessons were resolved inside the slice before
landing. The CodeRabbit timeout and static-preview lag are explicit no-action
decisions for this slice.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-081`. Claude authored
Stage 3 source implementation, Codex PM verified live behavior and clean-code
posture, CodeRabbit timed out with no pass claimed after emitting repaired
findings, and Local Qwen produced a pass verdict with no findings.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-081` closeout. The next recorded
action is Repo PM triage and formation for the V0 Closeout Claude Code A/B
Product-Value Trial slice if roadmap/product direction is sufficient;
otherwise ask the operator for the missing product direction.
