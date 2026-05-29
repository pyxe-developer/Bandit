# BANDIT-051 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Worktree Bootstrap Contract validation surface before implementation. The suite fails because Bandit currently has no `worktree-bootstrap` command, so contract validation, secret-copy refusal, and bootstrap-validation-command enforcement are not implemented yet.

## Test Command

```sh
node --test test/worktree-bootstrap.test.mjs
```

## Observed Output

```text
tests 3
pass 0
fail 3
worktree-bootstrap validate accepts a complete bootstrap contract policy failed: Unknown command: worktree-bootstrap
worktree-bootstrap validate rejects secret-copy entries by default failed because the command is missing
worktree-bootstrap validate rejects missing validation command wiring failed because the command is missing
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves Bandit currently lacks an enforced Worktree Bootstrap Contract validation path. | test/worktree-bootstrap.test.mjs calls `bandit worktree-bootstrap validate --json`; all tests fail with `Unknown command: worktree-bootstrap`, proving no runnable validation surface exists yet. |
| The Worktree Bootstrap Contract policy artifact is validated through a CLI-readable command rather than ad hoc chat interpretation. | The first test writes `.bandit/policy/worktree-bootstrap.json`, a template, and evidence JSON, then expects a structured pass response from `worktree-bootstrap validate --json`; this currently fails due to missing command wiring. |
| Secret material copy entries are refused by default unless an explicit operator-supervised exception exists. | The second test seeds a `secret_material` copy entry and expects a fail-closed refusal diagnostic; it currently fails earlier because the command does not exist. |
| Bootstrap validation command wiring is required before a worktree can be treated as runnable. | The third test removes the validation command and expects a fail-closed diagnostic that runnable status cannot be granted; it currently fails because the command is missing. |
| RED coverage stays scoped to Worktree Bootstrap Contract behavior and avoids unrelated scheduler, claim lease, or cockpit implementation surfaces. | The Stage 2 change adds only `test/worktree-bootstrap.test.mjs` plus this RED evidence spec/artifact and context/status synchronization. No Stage 3 implementation, claim authority mutation, scheduler execution, PR/CI, or cockpit UI/server/API code is added. |
| Stage 2 RED evidence preserves Test Ownership Boundary and bootstrap model-family separation. | This RED evidence and tests are Codex PM/Test Writer-authored. Stage 3 implementation must be routed to Claude, and the Stage 3 Writer must not edit tests, fixtures, RED evidence artifacts, or acceptance mappings for BANDIT-051. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-051 to Claude through the bootstrap Process Adapter path: implement `bandit worktree-bootstrap validate --json` with fail-closed policy/evidence validation, secret-copy refusal by default, required bootstrap validation command enforcement, and runnable-worktree refusal until bootstrap validation passes, while keeping the Stage 3 Writer away from tests, fixtures, RED evidence artifacts/specs, acceptance mappings, scheduler execution, full worktree lifecycle authority, claim lease creation/release, work-surface reservations, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, paid routing changes, dependency/lockfile changes, installed global skill edits, and unrelated Phase 8 work.
