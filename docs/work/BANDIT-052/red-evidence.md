# BANDIT-052 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Event-Driven Wake Scheduler validation surface before implementation. The suite fails because Bandit currently has no `event-driven-wake-scheduler` command, so wake-trigger validation, deterministic sweeper validation, and option handling are not implemented yet.

## Test Command

```sh
node --test test/event-driven-wake-scheduler.test.mjs
```

## Observed Output

```text
tests 3
pass 0
fail 3
event-driven-wake-scheduler validate accepts a complete policy fixture failed: Unknown command: event-driven-wake-scheduler
event-driven-wake-scheduler validate rejects unsupported options failed because the command is missing
event-driven-wake-scheduler validate requires deterministic sweeper contract failed because the command is missing
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves Bandit currently lacks an enforced event-driven wake scheduler validation path. | `test/event-driven-wake-scheduler.test.mjs` runs `bandit event-driven-wake-scheduler validate --json`; all tests fail with `Unknown command: event-driven-wake-scheduler`, proving no runnable validation surface exists yet. |
| Event-driven wake policy artifacts are validated through a CLI-readable command instead of ad hoc chat interpretation. | The first test writes `.bandit/policy/event-driven-wake-scheduler.json` and expects a passing validation result; it fails because the command is not implemented. |
| Deterministic sweeper requirements are enforced through fail-closed validation behavior. | The third test writes a fixture that omits deterministic sweeper coverage and expects a refusal diagnostic; it currently fails earlier because the command does not exist. |
| RED coverage stays scoped to Event-Driven Wake Scheduler behavior and avoids unrelated implementation surfaces. | This Stage 2 step adds only `test/event-driven-wake-scheduler.test.mjs`, this RED evidence artifact, and the paired RED evidence spec. No Stage 3 implementation, claim authority mutation, scheduler execution runtime, worktree lifecycle behavior, or cockpit UI/server/API code is added. |
| Stage 2 RED evidence preserves Test Ownership Boundary and bootstrap model-family separation. | This RED evidence and tests are Codex PM/Test Writer-authored. Stage 3 implementation must be routed to Claude, and the Stage 3 Writer must not edit tests, fixtures, RED evidence artifacts/specs, or acceptance mappings for `BANDIT-052`. |

## Next Action

Dispatch Stage 3 implementation for `BANDIT-052` to Claude through the bootstrap Process Adapter path: implement `bandit event-driven-wake-scheduler validate --json` with fail-closed event-trigger and deterministic-sweeper contract validation, single-claim activation and no-authority trigger boundaries, and clear no-op/failsafe diagnostics, while keeping the Stage 3 Writer away from tests, fixtures, RED evidence artifacts/specs, acceptance mappings, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, paid routing changes, dependency/lockfile changes, installed global skill edits, and unrelated Phase 8 work.
