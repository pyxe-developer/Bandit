# BANDIT-025 Implementation Evidence

## Status

`pass` for Stage 3 implementation evidence on 2026-05-25.

## Summary

Implemented the narrow coordination log foundation for `BANDIT-025` without
adding claim leases, scheduler execution, heartbeat claiming, worktree
lifecycle, cockpit UI, cross-repo coordination, automatic merge/push/deploy
behavior, product UAT changes, or Phase 7 improvement evaluation behavior.

- Added `src/state/coordination-log.ts` for per-work-item
  `coordination-log.jsonl` parsing, fail-closed validation, evidence
  reconciliation, shared core state ordering, accepted-block handling, and
  read-only status derivation.
- Added `src/commands/coordination.ts` and wired `bandit coordination
  validate/status` into the CLI.
- Added coordination-log validation to `bandit validate` for any work item that
  has a coordination log.
- Added `docs/templates/coordination-log.md` to document the step-transition
  and actor-event contract.
- Added `docs/work/BANDIT-025/coordination-log.jsonl` as the active
  per-work-item coordination log through `implementation_recorded`.

## Acceptance Criteria Mapping

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Per-work-item append-only coordination log contract exists. | pass | `docs/templates/coordination-log.md`, `src/state/coordination-log.ts`, and `docs/work/BANDIT-025/coordination-log.jsonl`. |
| Shared core state sequence covers slices and chores and separates retrospective-recorded from closed. | pass | `STATE_ORDER` includes `retrospective_recorded` and `closed`; focused chore status test passes through both states. |
| Actor coordination events are schema-valid context but not workflow authority. | pass | Actor events parse as `actor_event`; status derives only from accepted `step_transition` events. |
| Validation fails closed for malformed logs, unknown event types, invalid states, missing fields, missing evidence, regressions, and terminal contradictions. | pass | Focused coordination tests cover malformed JSONL, unknown event type, illegal regression, and missing evidence; parser also validates version, sequence, work-item match, required envelope fields, safe evidence paths, accepted-block shape, and closed-state contradictions. |
| Derived status reads the log and evidence artifacts. | pass | `bandit coordination status <work-id> --json` returns current state, next action, actor, accepted block, safe triggers, and evidence. |
| Safe trigger points come only from step transitions. | pass | Actor-event-only test leaves safe trigger points empty. |
| Existing Markdown evidence, landing gates, UAT gates, review evidence, and `.bandit/events.jsonl` behavior are preserved. | pass | Existing tests pass; no landing, UAT, review, or lifecycle event writer behavior was changed. |
| Tests cover success, slice/chore states, malformed logs, missing evidence, actor-event non-authority, accepted block reporting, and safe triggers. | pass | `test/coordination-log.test.mjs` and `test/coordination-status.test.mjs` pass. |
| Out-of-scope automation and cockpit behavior is not introduced. | pass | The diff is limited to parser, validator, read-only status, CLI routing, template, active work evidence, and context updates. |

## Clean-Code Self-Check

`CLEAN_CODE.md` was read before this slice and again during this Stage 3 step.
The implementation keeps parsing, validation, command routing, and status
derivation separated. Coordination state remains repo-native and
CLI-authoritative; status output is derived and read-only.

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | Implements the Stage 3 contract from `docs/work/BANDIT-025/brief.md` and RED evidence. |
| Small surface area | pass | Adds only the coordination state module, command wrapper, CLI routing, validation hook, template, and work-item evidence. |
| Simple design | pass | Uses JSONL parsing and explicit helper functions instead of a new database, index, scheduler, or generic orchestration layer. |
| Explicit state | pass | Step transitions, actor events, accepted blocks, evidence, safe triggers, and current status are named fields. |
| No hidden authority | pass | `status` derives from the log; actor events cannot advance workflow state; `bandit validate` only validates repo-native artifacts. |
| Testable behavior | pass | Focused coordination tests and full suite pass. |
| Readable flow | pass | Parser, envelope validation, evidence checks, transition ordering, and status projection are local and named. |
| Locality | pass | Changes stay in coordination-specific code and the active work item. |
| Failure clarity | pass | Missing logs, malformed JSONL, unsupported event types, invalid states, unsafe or missing evidence, regressions, and terminal contradictions fail closed with explicit messages. |
| No role erosion | pass | No reviewer, Landing Agent, UAT, scheduler, cockpit, or operator-owned decision boundary was changed. |
| Improvement capture | pass | No new workflow lesson requiring a follow-up chore was identified in this Stage 3 step. |

## Verification

- `node --test test/coordination-log.test.mjs test/coordination-status.test.mjs` - pass, 9 tests.
- `npm run typecheck` - pass.
- `npm test` - pass, 205 tests.
- `npm run bandit -- validate` - pass.
- `git diff --check` - pass.

## Next Action

Run Stage 4 review gates for `BANDIT-025`: Local Qwen review first, then
aggregate review evidence with current `review_subject_hash`.
