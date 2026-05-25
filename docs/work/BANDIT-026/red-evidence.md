# BANDIT-026 RED Evidence

## Summary

Stage 2 RED evidence is recorded for typed state extensions before production
implementation. The focused coordination tests now define the expected behavior
for feature UAT and chore disposition extension checkpoints while preserving
the shared core coordination lifecycle.

Production code is intentionally unchanged in this step. The tests fail because
the current coordination state machine knows only the shared core states and
does not yet parse typed extension states or report typed extension status.

## Tests Added

- `test/coordination-log.test.mjs`
  - Accept a feature-slice `feature_uat_approved` transition only when current
    CLI-owned `uat-approval.md` evidence exists.
  - Fail closed when feature UAT extension evidence is missing, stale, or used
    for a non-slice work item.
  - Accept an improvement-chore `chore_disposition_recorded` transition after
    landing when explicit disposition evidence exists.
  - Fail closed when chore disposition is out of order or used for a feature
    slice.
- `test/coordination-status.test.mjs`
  - Report satisfied feature UAT typed extension state, evidence, next action,
    accountable actor, and safe trigger points.
  - Report satisfied chore disposition typed extension state, evidence, next
    action, accountable actor, and safe trigger points.
  - Prove actor events cannot satisfy typed extension state or emit extension
    safe triggers.

Existing core-only coordination-log and coordination-status tests remain in the
focused suite to preserve `BANDIT-025` backward compatibility.

## RED Run

Command:

```sh
node --test test/coordination-log.test.mjs test/coordination-status.test.mjs
```

Result: expected failure.

```text
tests 16
pass 9
fail 7
```

Representative failures:

```text
Invalid coordination state: feature_uat_approved
Invalid coordination state: chore_disposition_recorded
Expected values to be strictly equal:
actual: undefined
expected: 'required'
```

The failures prove the slice has not been implemented yet:

- `src/state/coordination-log.ts` rejects `feature_uat_approved`.
- `src/state/coordination-log.ts` rejects `chore_disposition_recorded`.
- `coordination status --json` does not yet expose typed extension
  requirements or satisfied typed extension evidence.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Define typed extension checkpoints while retaining one shared core lifecycle. | New tests add `feature_uat_approved` between review and landing verdict, and `chore_disposition_recorded` between landed and retrospective, while existing core-only tests remain. |
| Feature-slice UAT extension transitions require current CLI-owned UAT evidence. | Feature UAT tests require `docs/work/<ID>/uat-approval.md` and reject missing, stale, or wrong-kind evidence. |
| Chore and improvement-chore disposition extension transitions require explicit disposition or no-action evidence. | Chore disposition tests require `docs/work/<ID>/chore-disposition.md` for `chore` and `improvement_chore` work types. |
| Validation fails closed for wrong kind, missing evidence, invalid ordering, conflicts, or bypass attempts. | New refusal tests cover wrong-kind feature UAT, stale/missing UAT evidence, out-of-order chore disposition, and wrong-kind chore disposition. |
| Derived status reports typed extension state, next action, actor, accepted block, safe trigger points, and evidence references. | New status tests expect `typed_extension`, `next_action`, `accountable_actor`, `safe_trigger_points`, and evidence in JSON output. |
| Existing `BANDIT-025` coordination logs and status remain valid. | Existing core-only coordination tests remain in the same focused suite and continue to pass during the RED run. |
| Actor events cannot complete typed extension states or emit safe trigger points. | New status test records an actor `complete` event with UAT evidence and expects the workflow to remain at `review_recorded` with only `feature_uat_required`. |
| No out-of-scope behavior is introduced. | RED tests exercise only coordination-log validation/status and local work-item artifacts; no claim leases, scheduler, worktree, cockpit, cross-repo, merge/push/deploy, or Phase 7 behavior is added. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-026` as active and Stage 2 as the current step. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-026/brief.md` is present with scope, acceptance criteria, test plan, clean-code evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the typed-extension contract and fail before production implementation because typed extension states/status are missing. |

## Next Action

Implement the narrow typed-extension coordination contract in
`src/state/coordination-log.ts` and related status rendering so the focused
RED tests pass without introducing claim leases, scheduler execution, worktree
lifecycle, cockpit UI, cross-repo coordination, automatic merge/push/deploy
behavior, product UAT ownership changes, or Phase 7 improvement evaluation.
