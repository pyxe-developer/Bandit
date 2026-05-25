# BANDIT-019 Retrospective

## Outcome

`BANDIT-019` is landed as a bootstrap workflow-infrastructure chore.

The chore resolved `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` by adding
hash-based Stage 4 evidence freshness. Review evidence can now record
`review_subject_hash`, and landing readiness compares that review subject
instead of treating every raw git `HEAD` mismatch as stale.

## What Worked

- TDD caught the exact loop: evidence-only commits failed before implementation
  and passed after `review_subject_hash` was introduced.
- Source and policy drift still fail closed with `Review subject hash is stale`.
- `BANDIT-019` proved its own methodology: after landing evidence was committed
  at `b85d6f3ed339c43f7d45ed6d86b089112c421930`, `land-check BANDIT-019` still
  passed even though review evidence records source head
  `2e760f68964466c1a7be9c4d8b2e2eb7d459a7e3`.
- The closeout repair proved the second half of the loop: individual reviewer
  evidence can remain at the reviewed implementation head when the final
  aggregate `review_subject_hash` is current.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Raw git `HEAD` is useful audit metadata but too broad as the primary Stage 4 freshness identity. | Durable artifact | `src/state/review-subject-hash.ts` and `src/commands/review-subject-hash.ts` now define and expose the review-subject hash. |
| Terminal evidence commits must not force rerunning model review when reviewable source is unchanged. | Durable artifact | `src/commands/land-check.ts` now uses `review_subject_hash` when present. |
| Individual reviewer evidence heads must not override a current aggregate review-subject hash. | Durable artifact | `land-check accepts reviewer evidence heads when final review subject hash matches` covers this closeout path. |
| Historical artifacts need compatibility. | Durable artifact | Review evidence without `review_subject_hash` keeps the existing raw-head fallback behavior. |

## Improvement Chore

source_work_item: BANDIT-018
source_gap: BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS
linked_work_item: BANDIT-019
hypothesis: Replacing raw git HEAD freshness with a deterministic review-subject hash will stop evidence-only commits from forcing repeated Stage 4 review loops while preserving fail-closed behavior for implementation, test, policy, and reviewer-input changes.
metric: After BANDIT-019 lands, a terminal evidence-only commit should not make `land-check` report stale review evidence, while a change to implementation source or review-relevant policy should still make review evidence stale.
baseline: BANDIT-018 required operator intervention because current-head evidence refreshes advanced git HEAD and risked recursively invalidating review evidence.
evaluation_window: BANDIT-019 closeout and the first subsequent work item that reaches Stage 4.
status: resolved
outcome: keep
outcome_evidence:
  - `node --test --test-name-pattern "review subject hash" test/landing-gates.test.mjs` passed.
  - `npm test` passed 168 tests.
  - `npm run bandit -- land-check BANDIT-019` passed after landing evidence was committed and raw `HEAD` advanced to `b85d6f3ed339c43f7d45ed6d86b089112c421930`.
  - `npm run bandit -- land-check BANDIT-019` passed after the reviewer-head repair recorded final review-subject hash `d53b7f2875127190832131397d8b217ab7623610b9c9e2da5cf6ac4d53f71661`.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-019`.

Local Qwen returned `pass` after implementation. CodeRabbit was unavailable
because this bootstrap chore had no PR context; review evidence records that
as explicit replacement evidence rather than claiming a CodeRabbit pass.

## Bootstrap Gap Disposition

`BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` is resolved.

Future Stage 4 review evidence should record `review_subject_hash`. Raw
`source_head` remains audit metadata and fallback compatibility for historical
artifacts, not the primary freshness identity when a hash is present.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
