# BANDIT-019 RED Evidence

## Status

RED evidence recorded before landing the implementation.

## Failing Test Command

```sh
node --test --test-name-pattern "review subject hash" test/landing-gates.test.mjs
```

Initial result: `fail`.

Expected failures:

- `land-check accepts evidence-only head changes when review subject hash matches`
  failed because `land-check` still reported `Review evidence is stale`,
  `Landing verdict evidence is stale`, and `safe-to-land cannot proceed with
  stale source evidence`.
- `land-check fails closed when review subject hash changes after source edits`
  failed because no `Review subject hash is stale` path existed.
- `land-check fails closed when review subject hash changes after policy edits`
  failed because no `Review subject hash is stale` path existed.

## Tests Added

- `land-check accepts evidence-only head changes when review subject hash matches`
- `land-check fails closed when review subject hash changes after source edits`
- `land-check fails closed when review subject hash changes after policy edits`

## Acceptance Criteria Mapping

| Acceptance Criterion | RED Test |
|---|---|
| AC1 | Evidence-only commit test expects `land-check` to pass when the hash matches. |
| AC2 | Source edit test expects `Review subject hash is stale`. |
| AC3 | Policy edit test expects `Review subject hash is stale`. |
| AC4, AC5 | Tests call `bandit review-subject-hash <work-item-id>` and record `review_subject_hash` in review evidence. |
| AC6 | Existing historical Stage 4 tests remain in the full suite. |
| AC7 | `BANDIT-019` closeout will use `review_subject_hash` in its own review evidence. |

## RED Verdict

`pass` - the tests failed for the missing hash-based freshness behavior, not
because of syntax errors or unrelated test setup failures.
