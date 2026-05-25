# BANDIT-018 Retrospective

## Outcome

`BANDIT-018` is landed as a bootstrap workflow-infrastructure chore.

The chore resolved `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` for the current
bootstrap scope by adding CLI-owned escalated-review routing, configured
reviewer profiles, deterministic fixture-backed execution, fail-closed
paid-provider setup refusal, and landing-gate integration for configured live
routes.

Landing used the existing terminal-disposition-only evidence-head policy. The
operator explicitly directed Codex PM to stop the raw-HEAD evidence refresh
loop for `BANDIT-018`, land it now, and make hash-based evidence freshness the
next work item.

## What Worked

- The AC10 repair added deterministic coverage for configured pass evidence,
  reviewer blockers, stale source heads, missing provider setup, unavailable
  and timed-out providers, malformed output, and `land-check` integration.
- Side-by-side Qwen 3.6, Sonnet 4.6, and Opus 4.7 review identified the
  original AC10 coverage blocker and let Codex PM choose Opus 4.7 as the
  stronger reviewer route for this bootstrap chore.
- The final focused Opus 4.7 review accepted the implementation behavior and
  found no Stage 3 blocker.

## What Did Not Work

- Raw git HEAD remained too coarse as the Stage 4 freshness identity. Evidence
  and context commits can advance HEAD without changing reviewable source,
  creating repeated review-refresh pressure.
- `bandit land BANDIT-018 --action local-record` refused the dirty worktree
  even though dirty paths were limited to `docs/work/BANDIT-018/`. Codex PM
  recorded the local-record landing action manually using the command's artifact
  contract after `land-check` and `auto-land-check` passed.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Review freshness needs a stable review-subject identity separate from evidence artifact commits. | Bootstrap-gap chore | Created `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` and linked it to `BANDIT-019`. |
| The existing terminal-disposition-only policy is good enough to close `BANDIT-018`, but it is not the final freshness model. | Follow-up chore | `BANDIT-019` must implement hash-based freshness and close without repeating the raw-HEAD loop. |
| Headless Opus review is usable bootstrap replacement evidence when explicitly operator-approved and recorded. | Durable artifact | `docs/work/BANDIT-018/model-comparison.md`, `review-evidence.md`, and `escalated-review.md` record the operator-approved reviewer route and PM disposition. |
| Landing Agent dirty-path handling did not behave as expected during `BANDIT-018` local-record landing. | Explicit follow-up deferred | Do not add this to `BANDIT-019`; keep `BANDIT-019` focused on review-subject hash freshness. Revisit Landing Agent dirty-path behavior only if it recurs after hash freshness lands. |

## Improvement Chore

source_work_item: BANDIT-018
source_gap: BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS
linked_work_item: BANDIT-019
hypothesis: Replacing raw git HEAD freshness with a deterministic review-subject hash will stop evidence-only commits from forcing repeated Stage 4 review loops while preserving fail-closed behavior for implementation, test, policy, and reviewer-input changes.
metric: After BANDIT-019 lands, a terminal evidence-only commit should not make `land-check` report stale review evidence, while a change to implementation source or review-relevant policy should still make review evidence stale.
baseline: BANDIT-018 required operator intervention because current-head evidence refreshes advanced git HEAD and risked recursively invalidating review evidence.
evaluation_window: BANDIT-019 closeout and the first subsequent work item that reaches Stage 4.
status: active

## Cross-Model Tension

Qwen 3.6 accepted implementation behavior but continued surfacing
non-blocking evidence and robustness concerns. Opus 4.7 accepted the focused
repair and identified the same raw-HEAD evidence-loop problem as a procedural
Stage 4 concern. Codex PM accepts the underlying concern and routes it to
`BANDIT-019`.

## Bootstrap Gap Disposition

`BANDIT-GAP-LIVE-ESCALATED-REVIEWER` is resolved for the bootstrap scope.

`BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` is active as `BANDIT-019` and must
be completed before returning to the older queued bootstrap gaps.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` as active `BANDIT-019`.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
