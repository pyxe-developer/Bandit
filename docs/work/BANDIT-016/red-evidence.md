# BANDIT-016 RED Evidence

## Status

`pass` - RED evidence is recorded. The focused tests fail because the current
Stage 4 landing-readiness path treats disposition-only evidence updates the same
as implementation source drift, and because accepted Local Qwen findings do not
require a concrete PM rationale before landing.

## Test Command

```sh
node --test test/landing-gates.test.mjs
```

## Result

```text
tests 41
pass 39
fail 2
```

Failing tests:

1. `land-check accepts terminal Stage 4 after disposition-only evidence updates`
   - Expected `land-check` to accept a terminal Stage 4 state where
     CodeRabbit, Local Qwen, and escalated-review evidence accepted the
     implementation source head, then only PM disposition evidence advanced.
   - Actual result: `CodeRabbit review evidence is stale`, `Local Qwen review
     evidence is stale`, `Escalated review evidence is stale`, and
     `safe-to-land cannot proceed with stale source evidence`.
   - Gap proven: current landing readiness compares every review artifact head
     to the current Git head and cannot distinguish disposition-only closeout
     evidence from implementation drift.
2. `land-check requires PM rationale for accepted Local Qwen findings`
   - Expected `land-check` to fail closed when Local Qwen has accepted/open
     findings but no concrete PM rationale is recorded.
   - Actual result: `land-check` exited `0`, proving accepted reviewer findings
     can currently be treated as terminal without a durable rationale check.

Passing guard:

- `land-check keeps blocking when implementation source changes after review`
  passed. The focused suite still proves current stale-source refusal exists;
  implementation must preserve this behavior while adding the narrower terminal
  Stage 4 semantics.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1 | The terminal Stage 4 test proves current landing readiness cannot distinguish accepted implementation behavior from recursive disposition-only evidence-head updates. |
| AC2 | The tests define missing terms through behavior: implementation source head, review evidence head, disposition head, current landing-gate evidence, and terminal Stage 4 state. |
| AC3 | The source-drift guard preserves fail-closed behavior when implementation source changes after review. |
| AC4 | The terminal Stage 4 test requires PM disposition-only updates to stop creating recursive rerun blockers. |
| AC5 | The failures occur through `bandit land-check`, so the shared landing-readiness path must consume the new contract. |
| AC6 | The terminal Stage 4 fixture models the `BANDIT-015` pattern of implementation-accepted review followed by PM disposition-only evidence. |
| AC7 | The source-drift guard proves stale current review evidence still blocks after implementation changes. |
| AC8 | The missing-rationale test proves PM dispositions for accepted reviewer findings need concrete rationale. |
| AC9 | The tests keep cross-model PM disposition visible rather than allowing silent waiver. |
| AC10 | Focused coverage now includes disposition-only terminal state, source drift after review, PM rationale for accepted findings, and `land-check` integration. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | Tests express the missing Stage 4 evidence-head semantics before production implementation. The failures are behavioral, not syntax or fixture setup errors. |
| Stage 3: Implementation Clean-Code Rubric | `pending` | Production implementation has not started. |

## Next Step

Implement the smallest Stage 4 evidence-head contract and landing-readiness
logic needed to make the focused tests pass. Preserve source-drift refusal for
actual source, test, policy, validator, or gate-logic changes. Do not start live
escalated-reviewer, work-item creation, artifact creation, heartbeat, cockpit,
or unrelated feature work.
