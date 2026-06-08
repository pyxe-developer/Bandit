# BANDIT-079 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Test Writer-owned RED tests now express the Improvement Health Surface contract
before implementation. The expected RED signal is that the current cockpit has
only a shallow improvement-health status cue: it has no dedicated
improvement-health presentation boundary, no candidate/outcome rows, no
workflow-trial guardrail completeness state, and no compact browser-rendered
Improvement Health section.

## Test Command

```sh
node --test test/cockpit-improvement-health.test.mjs
```

## Observed Output

```text
test/cockpit-improvement-health.test.mjs: fail 4/4

1. Cannot find module src/state/cockpit-improvement-health.ts.
2. buildCockpitViewModel(...) has no improvement_health_surface property.
3. renderBrowserCockpitShell(...) does not render aria-label="Improvement health".
4. Current HTML renders only the existing live-status "Improvements:
   pending_candidates" cue, without source-linked candidate rows, outcome
   labels, metric/baseline text, guardrail summaries, missing-metadata state,
   or responsive improvement-health detail rows.

The failing tests are intentional RED evidence for the BANDIT-079 Improvement
Health Surface contract.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The cockpit exposes a compact Improvement Health surface derived from repo-native improvement artifacts and derived CLI outputs, not browser-owned workflow state. | `test/cockpit-improvement-health.test.mjs` requires `buildCockpitImprovementHealthSurface` to return `authority: "presentation_derived_non_canonical"` and no write/evaluate/schedule/policy authority fields. |
| A bounded view-model or helper maps improvement candidates and evaluated outcomes into presentation-ready health rows with candidate id, status, outcome, source work item, source artifacts, metric, baseline, expected direction, evaluation window, and next route. | The first RED test deep-equals sorted candidate rows for pending and evaluated examples, including source artifacts, metric, baseline, state, and next route. |
| The surface distinguishes pending/queued/candidate/evaluated items and keep/revise/revert/double_down outcomes without collapsing missing metadata into a generic healthy state. | The row summary assertions require pending and evaluated counts plus outcome counts; the missing-guardrail test requires `missing_metadata` state and count. |
| Workflow Trial and workflow-policy candidates expose guardrail completeness, decision criteria, uncertainty or minimum-detectable-effect context, re-evaluation windows, and proxy-risk notes where available; missing guardrails render as fail-closed presentation states. | The guardrail RED test requires complete guardrail fields for workflow-trial candidates and a fail-closed `missing_metadata` row when guardrails are absent. |
| Repeated smell and cross-model tension summaries are sourced only from recorded retrospectives, reviewer dispositions, or improvement metadata and link back to their source artifacts. | Fixture candidates are sourced from `docs/work/**/retrospective.md`, `local-qwen-review.md`, and finding disposition artifacts, and the browser RED test requires those source links to render. |
| No browser/UI code creates or evaluates candidates, records outcomes, writes improvement artifacts, mutates repo state, invokes CLI commands, schedules background work, changes workflow policy, or treats generated UI state as canonical. | The RED tests assert no write/evaluate/record/schedule/policy authority fields and reject `<form>`, `fetch`, browser storage, and mutable browser authority in the rendered shell. |
| The implementation keeps improvement candidate parsing, health derivation, evidence-detail mapping, browser rendering, and static preview generation separated enough for clean-code review. | The RED suite targets a dedicated `src/state/cockpit-improvement-health.ts` boundary, integration through `buildCockpitViewModel`, and rendering through `renderBrowserCockpitShell`. |
| Responsive and accessibility verification covers improvement-health cards, detail rows, source links, candidate IDs, outcome labels, guardrail summaries, missing/due/evaluated state labels, and no overlap or truncation. | The browser RED test checks `aria-label="Improvement health"`, desktop and mobile rendering, source-path wrapping, detail-row wrapping, no overlap, and no text overflow. |

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored `test/cockpit-improvement-health.test.mjs`
  and this RED evidence.
- Stage 3 Implementation Writer: because Codex authored RED tests, Stage 3
  must route to a different model family through the Claude-family bootstrap
  implementation-writer path unless an operator-approved policy exception is
  recorded.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, or retrospective evidence for `BANDIT-079`.

## Next Action

Dispatch Stage 3 implementation for `BANDIT-079` to Claude-family
Implementation Writer. Implement the narrow improvement-health presentation
boundary and browser rendering needed to satisfy the RED tests without editing
Test Writer-owned tests, fixtures, RED evidence, or acceptance mappings.
