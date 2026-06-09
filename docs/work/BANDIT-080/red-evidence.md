# BANDIT-080 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Test Writer-owned RED tests now express the Queue & Context (Light) contract
before implementation. The expected RED signal is that the current cockpit has
only a shallow queue summary from bootstrap gaps and improvement candidates:
it has no source-linked queue rows, no active/next/planned/deferred state
projection, no recent coordination transition projection, and no browser
rendered Queue and Context section.

## Test Command

```sh
node --test test/cockpit-queue-context.test.mjs
```

## Observed Output

```text
test/cockpit-queue-context.test.mjs: fail 3/3

1. The view model summary is still
   "No open bootstrap gaps; 1 improvement candidate is visible." instead of
   the expected active/next/deferred queue trajectory summary.
2. `viewModel.queue_context.recent_transitions` is undefined instead of a
   source-linked `orchestration_plan_recorded` coordination row.
3. The browser shell does not render `aria-label="Queue and context"` and has
   no queue rows for active_anchor, next_planned, deferred, or the V0 closeout
   A/B trial planning item.

The failing tests are intentional RED evidence for the `BANDIT-080` Queue &
Context (Light) contract.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The cockpit exposes a lightweight queue/context surface derived from repo-native roadmap/current-context, session-context/cockpit-status, coordination, and bootstrap-gap evidence rather than browser-owned queue state. | `test/cockpit-queue-context.test.mjs` requires `buildCockpitViewModel` to expose a source-linked `queue_context` with roadmap, current-context, coordination, and bootstrap-gap sources. |
| A bounded view-model or helper maps queue/context evidence into presentation-ready rows with id or label, status, kind, summary, source artifacts, current-vs-next relationship, and unavailable or deferred reason when applicable. | The first RED test deep-equals rows for `BANDIT-080`, the planned Operator Attention/Operator Inbox slice, and the deferred V0 closeout A/B trial planning item. |
| The surface distinguishes active anchor, next planned, planned, deferred, blocked, missing-source, stale, contradictory, and unavailable states without flattening them into a generic backlog. | The first RED test requires `active_anchor`, `next_planned`, and `deferred` states; Stage 3 must extend the same boundary for other unavailable or fail-closed states without normalizing them to healthy backlog rows. |
| The Queue & Context UI communicates trajectory only: what is next and why, not backlog management, priority editing, intake ownership, scheduling, claimability, or workstream assignment. | The browser RED test rejects forms, browser storage, fetches, drag/kanban/priority-editor copy, claim-work copy, and schedule-work copy. |
| Recent coordination context is shown only from recorded repo-native coordination or status evidence and links back to source artifacts; missing coordination evidence renders as unavailable rather than inferred. | The second RED test requires a recorded `orchestration_plan_recorded` transition when coordination exists and a `not_recorded`/`unavailable` row when coordination is absent. |
| No browser/UI code invokes CLI commands, writes repo artifacts, edits roadmap state, records UAT, decides landing safety, merges, pushes, deploys, changes policy, schedules work, claims work, or treats generated queue state as canonical. | The browser RED test rejects mutation forms, browser storage, and fetch behavior, while the plan and brief forbid CLI execution or workflow authority in the UI. |
| The implementation keeps roadmap/current-context parsing or ingestion, queue derivation, evidence-detail mapping, browser rendering, and static preview generation separated enough for clean-code review. | The RED suite targets the existing `buildCockpitViewModel` integration and browser rendering boundary, leaving source parsing/derivation as an implementation detail for Stage 3. |
| Responsive verification covers desktop and mobile widths with no overlapping or truncated queue labels, work item IDs, source paths, planned/deferred chips, summary text, or recent-transition rows. | The browser RED test checks responsive metadata for no text overflow and no overlaps; Stage 3 must preserve source-path wrapping and dense-row fit when rendering the new section. |

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored `test/cockpit-queue-context.test.mjs`
  and this RED evidence.
- Stage 3 Implementation Writer: because Codex authored RED tests, Stage 3
  must route to a different model family through the Claude-family bootstrap
  implementation-writer path unless an operator-approved policy exception is
  recorded.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, or retrospective evidence for `BANDIT-080`.

## Next Action

Dispatch Stage 3 implementation for `BANDIT-080` to Claude-family
Implementation Writer. Implement the narrow queue/context presentation
boundary and browser rendering needed to satisfy the RED tests without editing
Test Writer-owned tests, fixtures, RED evidence, or acceptance mappings.
