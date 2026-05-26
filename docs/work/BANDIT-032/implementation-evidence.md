# BANDIT-032 Implementation Evidence

## Summary

Stage 3 implementation is recorded for Cockpit Status Coverage Hardening.
The implementation keeps `bandit cockpit status --json` read-only,
source-linked, and derived from repo-native artifacts while broadening the
status payload to cover the accepted `BANDIT-032` hardening contract.

## Changes

- `src/state/cockpit-status.ts` now reports source-linked blockers from
  required operator input and unresolved bootstrap gaps.
- `src/state/cockpit-status.ts` now reports a Stage 0 through Stage 6 gate
  matrix from the active work item's repo-native evidence artifacts.
- `src/state/cockpit-status.ts` now accepts equivalent next-action wording when
  `CURRENT_CONTEXT.md` and `ROADMAP.md` agree on the same work item and stage,
  while preserving fail-closed behavior for unresolved disagreements.
- `src/state/cockpit-status.ts` now reports stale review, review-subject-hash,
  and landing-verdict markers from existing evidence fields instead of creating
  a new staleness authority.

No visual UI, server/API mode, state index, scheduler, worktree lifecycle,
claim lease, work surface reservation, product UAT, PR/CI workflow, external
service setup, or automatic merge/push/deploy behavior was introduced.

## Acceptance Criteria Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Cockpit status remains read-only, deterministic, source-linked, and non-canonical. | The command still only reads repo-native artifacts and the hidden-state regression test passes. |
| Summarize broader blocker and gate states from available repo-native artifacts. | Blockers derive from `CURRENT_CONTEXT.md` and `.bandit/bootstrap-gaps.json`; gates derive from active work-item evidence paths. |
| Harden next-action agreement beyond the narrow topic heuristic. | Agreement can now pass by normalized text, same work item plus stage, or the existing bounded topic match. |
| Report stale evidence without hidden authority. | Stale evidence derives only from existing `source_drift_status` and `review_subject_hash_status` fields in review and landing artifacts. |
| Keep future cockpit/UI/scheduler/worktree/claim/UAT/PR behavior out of scope. | The diff is limited to cockpit status derivation and implementation evidence/context updates. |

## Clean-Code Self-Check

- Spec alignment: pass. The implementation targets only the Stage 2 RED
  contract.
- Small surface area: pass. Only the cockpit status state reader changed.
- Simple design: pass. New helpers derive named status sections from existing
  artifact paths and scalar evidence markers.
- Explicit state: pass. All reported state includes repo-native source paths.
- No hidden authority: pass. The cockpit still writes no canonical or cache
  state.
- Testable behavior: pass. Focused RED tests now pass and full repository tests
  pass.
- Failure clarity: pass. Existing missing-source and disagreement refusals are
  preserved.
- Improvement capture: pass. This work implements the durable
  `BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` follow-up.

## Verification

| Command | Result |
| --- | --- |
| `node --test test/cockpit-status.test.mjs` | pass: 11 tests |
| `npm test` | pass: 242 tests |
| `npm run typecheck` | pass |
| `npm run bandit -- validate` | pass |
| `npm run bandit -- cockpit status --json` | pass; derived status reports `BANDIT-032`, source-linked gates, no blockers, no bootstrap gaps, and no stale evidence |
| `git diff --check` | pass |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-032` as active and ready for Stage 3 implementation. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-032/brief.md` records the scope, acceptance criteria, verification plan, and clean-code read evidence. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-032/red-evidence.md` records focused failing tests before production code changed. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused and full tests pass, the implementation is source-linked and read-only, and no unrelated workflow behavior was introduced. |

## Next Action

Run Stage 4 review and cross-model gates for `BANDIT-032`: pre-PR CodeRabbit
review when available, Local Qwen adversarial review, review-subject hash, PM
disposition, and aggregate review evidence. Do not start landing or
retrospective closeout before current Stage 4 review evidence exists.
