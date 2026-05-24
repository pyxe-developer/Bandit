# BANDIT-017 RED Evidence

## Status

`pass` - RED evidence is recorded for the git diagnostics hardening portion of
`BANDIT-017`. The focused test fails because one landing-readiness evaluation
classifies equivalent changed-path failures separately for each stale review
artifact, repeating shallow/promisor repository-state probes.

## Test Command

```sh
node --test --test-name-pattern "land-check reuses git repository state" test/landing-gates.test.mjs
```

## Result

```text
tests 1
pass 0
fail 1
```

Failing test:

1. `land-check reuses git repository state while classifying changed-path failures`
   - Expected `land-check` to run one promisor-state probe and one
     shallow-repository probe while classifying three equivalent missing-base
     changed-path failures for CodeRabbit, Local Qwen, and escalated review
     evidence.
   - Actual result: the test observed three promisor probes and three shallow
     probes. The assertion failed with `3 !== 1`.
   - Gap proven: changed-path failure classification currently performs
     repository-state diagnostics per stale review artifact instead of reusing
     equivalent state during one landing-readiness evaluation.

## Guard Behavior

The same focused test still expects `land-check` to fail closed for each stale
review artifact:

- `CodeRabbit review changed-path check failed: missing_base_revision`
- `Local Qwen review changed-path check failed: missing_base_revision`
- `Escalated review changed-path check failed: missing_base_revision`

Implementation must preserve those fail-closed diagnostics while narrowing or
caching the repeated repository-state probes.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1 | The failing test demonstrates the repeated-probe issue in a way future maintainers can rerun. |
| AC2 | Existing Stage 4 tests still cover stale-evidence and PM-rationale behavior; implementation must extract that logic without changing behavior. |
| AC3 | `land-check.ts` remains the exercised CLI orchestration path in the failing test. |
| AC4 | The test proves equivalent failed changed-path classifications do not yet reuse repository-state diagnostics within one landing-readiness evaluation. |
| AC5 | The test keeps CodeRabbit, Local Qwen, escalated-review, and stale-evidence refusal paths visible while defining the missing optimization. |
| AC6 | Focused verification is expected to pass after the implementation step; full verification remains a later gate. |
| AC7 | Clean-code and stage-rubric closeout remain pending until implementation and review evidence are recorded. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | The failing test expresses the missing git diagnostics behavior before production implementation. The failure is behavioral, not syntax or fixture setup. |
| Stage 3: Implementation Clean-Code Rubric | `pending` | Production implementation has not started. |

## Next Step

Implement the smallest `BANDIT-017` change that reuses repository-state
diagnostics during changed-path failure classification and extracts Stage 4
stale-evaluation/PM-rationale logic from `src/commands/land-check.ts` without
weakening existing fail-closed landing-gate behavior.
