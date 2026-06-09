# BANDIT-081 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Test Writer-owned RED tests now express the Operator Attention / Operator Inbox Surface contract before implementation. The current cockpit has no presentation-ready operator_attention view model, no operator_inbox view model, and no browser-rendered Operator attention or Operator Inbox sections.

## Test Command

```sh
node --test test/cockpit-operator-attention.test.mjs
```

## Observed Output

```text
test/cockpit-operator-attention.test.mjs: fail 3/3
1. viewModel.operator_attention is undefined instead of a source-linked operator attention surface with required-input, blocker, stale evidence, and route rows.
2. viewModel.operator_inbox is undefined instead of a read-only repo-native inbox presentation surface with empty and fixture-backed message states.
3. renderBrowserCockpitShell output does not include aria-label="Operator attention" or aria-label="Operator Inbox" and exposes no operator_attention/operator_inbox shell metadata.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The cockpit exposes a bounded Operator Attention / Operator Inbox surface derived from repo-native status, coordination, and inbox artifacts, not from browser-owned workflow state. | test/cockpit-operator-attention.test.mjs requires buildCockpitViewModel to expose operator_attention and operator_inbox surfaces from status, blockers, stale evidence, and operator_inbox_source fixture data. |
| A bounded view-model or helper maps operator attention into presentation-ready rows with status, decision owner, required input, next route, summary, source artifacts, freshness state, and unavailable or blocked reason when applicable. | The first RED test deep-equals required-input, blocker, and stale-evidence rows with owner, route, source artifact, freshness, and blocked reason fields. |
| A bounded inbox reader or adapter handles absent .bandit/inbox/*.md files as an explicit empty or unavailable state and handles fixture-backed inbox messages without treating fixture data as canonical. | The second RED test requires an empty inbox state with unavailable_reason empty_inbox and fixture-backed message rows with canonical source links and false write/resolve/notification authority flags. |
| The surface distinguishes operator input required, no operator input required, blocked, stale, contradictory, unavailable, empty-inbox, resolved, and source-missing states without presenting generic healthy or silently complete states. | The RED suite covers required, blocked, stale, empty, and resolved states directly and leaves unavailable/source-missing/contradictory states in the same explicit presentation boundary for Stage 3. |
| The Operator Inbox display remains visually and semantically distinct from Attention Category navigation and includes source artifact links for each displayed message. | The browser RED test requires separate aria-label="Operator attention" and aria-label="Operator Inbox" sections plus source artifact links for inbox rows. |
| No browser/UI code invokes CLI commands, writes repo artifacts, records operator responses, records UAT, decides landing safety, grants approvals, merges, pushes, deploys, changes policy, schedules work, claims work, or treats generated operator-attention or inbox state as canonical. | The browser RED test rejects forms, localStorage, sessionStorage, fetch, resolve-message/archive-message, approve-uat, and record-uat strings, and asserts mutation_forms are empty with false inbox authority flags. |
| Responsive verification covers desktop and mobile widths with no overlapping or truncated decision labels, inbox subjects, work item IDs, source paths, blocked reasons, required-input labels, or detail rows. | The browser RED test checks the rendered shell responsive metadata for no text overflow and no overlaps; Stage 3 browser smoke must cover live desktop and mobile rendering. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-081 to Claude-family Implementation Writer. Implement the narrow operator-attention and Operator Inbox presentation boundary and browser rendering without editing Test Writer-owned tests, fixtures, RED evidence, or acceptance mappings.

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored
  `test/cockpit-operator-attention.test.mjs` and this RED evidence.
- RED author model family: `codex`.
- Codex materially edited tests: `true`.
- Acceptance mapping owner: Test Writer.
- Stage 3 test-edit authority: `none`.
- Stage 3 Writer routing: because Codex authored and materially edited RED
  tests, Stage 3 must route to a different model family through the
  Claude-family bootstrap implementation-writer path unless an
  operator-approved policy exception is recorded.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, or retrospective evidence for `BANDIT-081`.
