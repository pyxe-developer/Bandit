# BANDIT-014 RED Evidence

## Status

`pass` - RED evidence is recorded. The focused tests fail because the Landing
Agent contract and `bandit land <work-item-id>` command do not exist yet.

## Test Command

```sh
node --test test/landing-gates.test.mjs
```

## Result

```text
tests 37
pass 32
fail 5
```

Failing tests:

1. `validate fails closed when the Landing Agent contract is missing`
   - Expected `bandit validate` to fail with `Missing Landing Agent contract`.
   - Actual result: validation exited `0`, proving no Landing Agent contract is
     required or validated yet.
2. `land records landing action evidence for an eligible chore`
   - Expected `bandit land BANDIT-926 --action local-record` to write
     `docs/work/BANDIT-926/landing-action.md`.
   - Actual result: `Unknown command: land`.
3. `land blocks feature slices without current UAT approval`
   - Expected a fail-closed UAT refusal.
   - Actual result: `Unknown command: land`.
4. `land blocks a dirty worktree before writing landing evidence`
   - Expected a fail-closed dirty-worktree refusal.
   - Actual result: `Unknown command: land`.
5. `land refuses unsupported remote or deploy actions`
   - Expected unsupported action refusal for `push`.
   - Actual result: `Unknown command: land`.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1 | Focused tests prove there is no Landing Agent command and no durable Landing Agent contract validation. |
| AC2 | Missing-contract validation test defines the required repo-native contract gate. |
| AC3 | `bandit land <work-item-id> --action local-record` tests define the CLI surface selected for implementation. |
| AC4 | Command tests set up existing `land-check` and `auto-land-check` evidence, requiring implementation to consume current gate logic. |
| AC5 | Eligible chore test defines the required local landing-record behavior. |
| AC6 | Feature-slice missing-UAT test preserves the operator-owned UAT boundary. |
| AC7 | Dirty-worktree and missing-contract tests define fail-closed refusal behavior. |
| AC8 | Unsupported `push` action test blocks remote behavior in this chore. |
| AC9 | Eligible chore test requires `docs/work/<ID>/landing-action.md` evidence. |
| AC11 | Focused tests cover eligible chore behavior, UAT boundary, dirty-worktree refusal, unsupported action refusal, and contract validation. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | Tests express the missing Landing Agent contract, command, landing-action artifact, UAT boundary, dirty-worktree refusal, and unsupported action refusal before production implementation. |

## Next Step

Implement the smallest Landing Agent contract validation path and `bandit land
<work-item-id> --action local-record` command that makes these focused tests
pass without adding live remote merge, push, deploy, CodeRabbit polling, or
escalated-review routing.
