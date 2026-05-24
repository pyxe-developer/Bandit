# BANDIT-015 Local Qwen Finding Repair

## Status

`pass` - the local Qwen `non_blocking` finding was triaged and repaired for
the actionable missing-PR-context path.

## Finding

Local Qwen reported that several fail-closed refusal paths throw errors without
first writing actionable repo-native evidence. Codex PM triage found:

- Missing PR context was a valid gap: `coderabbit-review live` threw before
  writing `docs/work/<ID>/coderabbit-review.md`.
- Missing credential setup already wrote `operator_input_blocked` evidence
  before throwing.
- Provider unavailable state already wrote blocking evidence before throwing.
- Stale source-head and non-pass verdict paths already wrote live-normalized
  CodeRabbit evidence before throwing.

## Repair

- `src/commands/coderabbit-review.ts` now writes a blocking CodeRabbit review
  artifact before refusing missing PR context.
- The artifact records `review_target: missing-pr-context`,
  `review_state: blocked`, `coderabbit_verdict: blocker`, and
  `operator_input_status: operator_input_blocked`.
- `test/coderabbit-state.test.mjs` now asserts that missing PR context creates
  actionable repo-native evidence before the command exits.

## Verification

```sh
node --test test/coderabbit-state.test.mjs
```

Result: `pass` - 16/16.

## Clean-Code Check

`pass` - the repair is narrowly scoped to the missing refusal path, reuses the
existing `writeCodeRabbitReview` source-of-truth helper, preserves secret
boundaries, keeps fail-closed behavior, and adds a focused regression assertion
without introducing a second evidence contract.

## Next Required Action

Because this repair changes source after the previous CodeRabbit, review, and
local Qwen evidence, those review artifacts must be refreshed before landing
closeout continues. Rerun the live CodeRabbit evidence path and aggregate review
evidence at the repair head, then rerun `npm run bandit -- qwen-review
BANDIT-015`.
