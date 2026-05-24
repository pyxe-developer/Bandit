# BANDIT-011 RED Evidence

## Status

RED evidence recorded on 2026-05-24 before production implementation.

## Command

```sh
node --test test/bootstrap-gaps.test.mjs
```

## Result

Exit code: 1

All four focused tests failed against the current implementation, which is the
expected RED state for this chore.

## Failure Summary

1. `validate fails closed for an undispositioned blocking bootstrap gap`
   - Expected `bandit validate` to exit `1`.
   - Actual exit code was `0`.
   - This proves validation does not yet inspect `.bandit/bootstrap-gaps.json`
     or fail closed for missing dispositions.

2. `validate fails closed when a bootstrap gap links to a missing work item`
   - Expected `bandit validate` to exit `1`.
   - Actual exit code was `0`.
   - This proves validation does not yet verify linked
     `docs/work/<ID>/brief.md` artifacts for gap records.

3. `validate fails closed when no-action bootstrap gap lacks rationale`
   - Expected `bandit validate` to exit `1`.
   - Actual exit code was `0`.
   - This proves validation does not yet enforce rationale on explicit
     no-action dispositions.

4. `gaps list reports tracked bootstrap gaps and next actions`
   - Expected `bandit gaps list` to exit `0` and print the tracked gap.
   - Actual exit code was `1`.
   - Actual stderr:

```text
Unknown command: gaps
Usage: bandit <init|validate|list|show|draft-work|route|land-check|qwen-review|coderabbit-review>
```

## Acceptance Criteria Mapping

| Acceptance Criterion | RED Evidence |
|---|---|
| AC1 | Focused tests demonstrate current CLI cannot list bootstrap gaps and validation does not fail for undispositioned gap records. |
| AC4 | Validation currently passes malformed or unsupported bootstrap-gap state. |
| AC5 | Validation currently passes a blocking gap without disposition. |
| AC6 | Validation currently passes a linked gap whose `docs/work/<ID>/brief.md` is missing. |
| AC7 | `bandit gaps list` is currently an unknown command. |
| AC8 | Missing command output confirms there is no gap-specific usage or validation path yet. |
| AC11 | Focused tests now cover malformed disposition state, missing linked work, no-action rationale requirements, and command output. |

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | `test/bootstrap-gaps.test.mjs` defines behavior-focused RED tests before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation has started. |

## Next Action

Implement the smallest bootstrap-gap state contract, validator integration,
seed artifact, and `bandit gaps list` command needed to turn these tests green.
