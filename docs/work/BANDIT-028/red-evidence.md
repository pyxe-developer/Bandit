# BANDIT-028 RED Evidence

## Summary

Stage 2 RED evidence is recorded for agent coordination event commands before
production implementation. The focused coordination tests now define the
expected CLI-owned event append path, action-specific refusal behavior, malformed
log and missing evidence refusal, actor-event non-authority, and derived status
projection for recent actor context.

Production code is intentionally unchanged in this step. The tests fail because
`bandit coordination` currently supports only `validate` and `status`, and
`coordination status --json` does not yet expose actor coordination context.

## Tests Added

- `test/coordination-log.test.mjs`
  - Append one validated actor event for each supported action through
    `bandit coordination event <ID> <type>`.
  - Fail closed before writing when handoff, block, complete, and
    repair-request events omit action-specific required fields.
  - Fail closed before writing for unknown work items, missing coordination
    logs, malformed existing logs, and missing evidence references.
- `test/coordination-status.test.mjs`
  - Report recent actor coordination context for advisory claim, handoff, block
    event, pending repair request, and latest resume event while preserving
    step-transition authority.

Existing coordination-log and coordination-status tests remain in the focused
suite to preserve `BANDIT-025` and `BANDIT-026` behavior.

## RED Run

Command:

```sh
node --test test/coordination-log.test.mjs test/coordination-status.test.mjs
```

Result: expected failure.

```text
tests 20
pass 16
fail 4
```

Representative failures:

```text
Usage: bandit coordination <validate|status> <work-item-id> [--json]
expected: /handoff actor event requires --target-actor/
actual: 'Usage: bandit coordination <validate|status> <work-item-id> [--json]\n'
expected: /Unknown work item: BANDIT-999/
actual: 'Usage: bandit coordination <validate|status> <work-item-id> [--json]\n'
actual actor_context: undefined
```

The failures prove the slice has not been implemented yet:

- `src/commands/coordination.ts` has no `event` command path.
- Actor-event append validation does not yet enforce action-specific fields.
- The command does not yet validate existing logs before append or validate the
  full resulting log after append.
- `src/state/coordination-log.ts` does not preserve or project actor-event
  details into derived status.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| A CLI-owned command path can append exactly one validated actor coordination event for claim, handoff, block, complete, repair-request, and resume. | New tests call `bandit coordination event BANDIT-001 <type>` for all six supported actions and expect one appended JSONL event per invocation with increasing sequence numbers. |
| The command refuses unknown work items, missing coordination logs, malformed existing logs, unknown event types, invalid actors, missing required fields, unsafe evidence paths, and evidence paths that do not exist. | New refusal tests cover unknown work item, missing log, malformed log, action-specific missing fields, and missing evidence reference. Unknown event type and unsafe evidence remain covered by existing validation tests and should be wired through the command during GREEN. |
| Action-specific validation requires clear block target and resume condition, handoff target actor, repair scope, and completion evidence. | New refusal tests expect fail-closed messages for missing `--target-actor`, `--blocked-owner` / `--resume-condition`, `--repair-scope`, and `--evidence`. |
| Actor coordination events remain non-authoritative. | Existing actor-event non-authority tests remain in the suite, and the new status test asserts actor context does not change `current_state`, accepted block state, or safe trigger points. |
| Derived coordination status reports recent actor coordination context while deriving workflow position only from step transitions. | New status test expects an `actor_context` object with latest advisory claim, handoff, block event, pending repair request, and latest resume while current workflow state remains `brief_created`. |
| The command appends JSONL atomically enough for local bootstrap and validates the full log after append. | New tests assert refusal paths preserve the original coordination log content and that successful appends preserve sequence ordering. |
| Tests cover successful events, required-field refusal, malformed existing log refusal, missing evidence refusal, actor-event non-authority, status actor context, and preservation of existing coordination behavior. | Focused suite now has 20 tests: 16 existing tests pass and 4 new tests fail because the behavior is missing. |
| No lease exclusivity, scheduler, worktree lifecycle, cockpit UI, cross-repo coordination, automatic merge/push/deploy, product UAT approval, or Phase 7 improvement evaluation behavior is introduced. | RED tests exercise only local `coordination event`, `coordination validate`, and `coordination status` behavior against repo-native JSONL artifacts. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-028` as active, `BANDIT-027` is landed and closed, and Stage 2 RED evidence is the current step before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-028/brief.md` is present with goal, scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, smell triggers, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the actor coordination event command contract and fail before production implementation because the command and status projection are missing. |

## Next Action

Implement the narrow actor coordination event command path in
`src/commands/coordination.ts` and `src/state/coordination-log.ts` so the
focused RED tests pass. Preserve step-transition authority, fail closed before
writing invalid events, validate the full log after append, and do not introduce
claim leases, scheduler execution, worktree lifecycle, cockpit UI, cross-repo
coordination, automatic merge/push/deploy behavior, product UAT approval, or
Phase 7 improvement evaluation.
