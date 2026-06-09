# Stage 4 Repair Evidence: BANDIT-080

contract_version: 1
work_item: BANDIT-080
source_head_before_repair: 3c0ab2e935765f5573020e247d61341c73174661
repair_state: completed
operator_input_status: none_required

## Blocker Found

Live render smoke after the first Local Qwen pass attempt showed that
`node ./bin/bandit.mjs cockpit status --json` did not populate
`queue_context_source`. The view-model fixture rendered Queue & Context rows,
but live CLI status produced no queue rows and the browser shell omitted
`aria-label="Queue and context"`.

## Repair

- `src/state/cockpit-status.ts` now derives `queue_context_source` from
  repo-native `ROADMAP.md`, `CURRENT_CONTEXT.md`, active work evidence,
  blockers, stale evidence, and bootstrap-gap state.
- `test/cockpit-status.test.mjs` now covers live queue-context derivation from
  a temp-repo roadmap fixture, including active, next planned, and deferred
  rows.
- The browser shell remains presentation-only; row fields are escaped and no
  CLI execution, form, fetch, browser storage, repo mutation, scheduling, UAT,
  landing, merge, push, deploy, or policy mutation path is introduced.

## Verification

- `node --test test/cockpit-status.test.mjs` - pass, 14 tests.
- `node --test test/cockpit-queue-context.test.mjs` - pass, 3 tests.
- `node --test test/cockpit-view-model.test.mjs` - pass, 8 tests.
- `node --test test/cockpit-browser-shell.test.mjs` - pass, 7 tests.
- `npm run typecheck` - pass.
- Live CLI/render smoke after repair:
  - `queue_rows`: 3.
  - summary: `BANDIT-080 active; 1 next planned slice; 1 deferred V0 closeout item.`
  - labels: `Queue & Context (Light)`, `Operator Attention / Operator Inbox surface`, `V0 Closeout Claude Code A/B Product-Value Trial`.
  - browser HTML includes `Queue and context`.
  - browser HTML includes no `<form`, `fetch(`, `localStorage`, `sessionStorage`, or `indexedDB`.

## Next Action

Refresh Stage 4 reviewer evidence after the repair. CodeRabbit timeout evidence
and Local Qwen evidence from the pre-repair source head must not be treated as
current.
