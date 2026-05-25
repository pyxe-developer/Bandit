# BANDIT-023 Implementation Evidence

## Status

`pass` for Stage 3 implementation evidence on 2026-05-25.

## Summary

Implemented the non-blocking review finding routing contract without broadening
Bandit authority beyond Stage 4 and Stage 5 evidence interpretation:

- `docs/templates/review-evidence.md` now names
  `non_blocking_findings_routing` as the canonical review-evidence field for
  durable follow-up routing.
- `src/state/review-evidence.ts` parses that routing list while preserving
  compatibility for historical review evidence that does not use the field.
- `src/commands/land-check.ts` accepts `non_blocking` Local Qwen evidence only
  when the reviewer evidence is current, PM disposition rationale is concrete,
  and durable routing is recorded.
- `src/state/landing-stage4.ts` validates routing entries for follow-up chore
  candidates, improvement chores, or explicit no-action dispositions.
- Blocker-level Local Qwen findings remain fail-closed and cannot be routed as
  safe-to-defer work.

## Clean-Code Self-Check

`CLEAN_CODE.md` was read before implementation. The diff is narrowly scoped to
review evidence parsing, landing readiness, the committed template contract,
and focused fixture updates. The implementation keeps repo-native Markdown
evidence as the source of truth, does not introduce cockpit or automation
authority, and preserves fail-closed behavior for blocker findings, stale
review evidence, missing PM rationale, and missing follow-up routing.

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | Implements the RED contract in `docs/work/BANDIT-023/red-evidence.md`. |
| Small surface area | pass | Touches only Stage 4/Stage 5 evidence interpretation and template fixtures. |
| Simple design | pass | Adds one parsed list field and one routing helper instead of a new subsystem. |
| Explicit state | pass | Durable routing is recorded in `review-evidence.md`, not hidden in code or chat. |
| No hidden authority | pass | Landing still derives readiness from repo-native artifacts and reviewer evidence. |
| Testable behavior | pass | Focused tests cover routed non-blocking findings, missing routing, and blocker preservation. |
| Failure clarity | pass | Missing routing fails with `non-blocking review findings require durable follow-up routing`. |
| No role erosion | pass | Codex PM disposition and durable routing are required; the operator is not asked for routine code-safety decisions. |

## Verification

- `node --test --test-name-pattern "non-blocking Local Qwen findings|blocker Local Qwen findings" test/landing-gates.test.mjs` - pass, 3 tests.
- `npm run typecheck` - pass.
- `npm test` - pass, 196 tests.
- `npm run bandit -- validate` - pass.
- `npm run bandit -- gaps list` - pass; `BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING` remains active and linked to `BANDIT-023`.
- `git diff --check` - pass.

## Next Action

Run Stage 4 Local Qwen review for `BANDIT-023`, then record aggregate review
evidence with the current `review_subject_hash`.
