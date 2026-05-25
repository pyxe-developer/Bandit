# BANDIT-018 RED Evidence

## Status

`red` on 2026-05-25 before production implementation changes.

The focused tests define the missing live escalated-reviewer routing path. They
fail because Bandit has only the escalated-review placeholder artifact and no
CLI-owned `escalated-review run` command that can select a configured stronger
reviewer, record current evidence, or fail closed on missing paid-provider
setup.

## Test Command

```sh
node --test --test-name-pattern "escalated-review" test/landing-gates.test.mjs
```

## Result

```text
tests 2
pass 0
fail 2
```

Failing tests:

1. `escalated-review records fixture-backed pass evidence for required escalation`
   - Expected `bandit escalated-review run BANDIT-942 --fixture
     fixtures/escalated-review-pass.json` to write
     `docs/work/BANDIT-942/escalated-review.md` with current source head,
     selected profile, available provider status, pass verdict, and current
     source-drift status.
   - Actual result: the CLI exits with `Unknown command: escalated-review`.
   - Gap proven: Bandit has no CLI-owned live or fixture-backed escalated
     reviewer evidence path.
2. `escalated-review fails closed when paid provider setup is not explicitly configured`
   - Expected `bandit escalated-review run BANDIT-943` to fail closed with an
     operator-owned blocker naming missing provider setup, credentials, and
     cost approval.
   - Actual result: the CLI exits with `Unknown command: escalated-review`.
   - Gap proven: Bandit cannot yet distinguish unavailable paid-provider setup
     from a technical pass, recorded blocker, or explicit operator-owned input.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1 | The tests show escalation-required work still has no live CLI-owned reviewer routing path beyond placeholder evidence. |
| AC2 | The tests introduce the expected profile/evidence fields that implementation must formalize in a durable routing contract. |
| AC3 | The missing `bandit escalated-review run <work-item-id>` command proves there is no narrow CLI path for one work item. |
| AC4 | Fixture-backed execution is specified without network access, real credentials, or paid calls. |
| AC5 | The fixture-backed pass test defines the expected current escalated-review evidence output. |
| AC6, AC7 | The paid-provider setup test defines fail-closed operator-owned blocker behavior for missing explicit setup, credentials, and cost approval. |
| AC8 | Existing `land-check` placeholder behavior remains implemented; integration with live evidence is pending implementation. |
| AC9 | Existing baseline Local Qwen, CodeRabbit, Stage 4, UAT, and Landing Agent behavior are not changed in the RED step. |
| AC10 | The first focused tests cover fixture pass and missing provider setup; additional implementation-step tests should cover blocker verdicts, stale source heads, unavailable/time-out providers, malformed output, and land-check integration. |
| AC11, AC12 | Full verification, clean-code closeout, review, landing verdict, and landing action remain pending. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | The failing tests express missing behavior before production implementation. The failure is the absent CLI-owned escalated-review routing command, not fixture setup noise. |
| Stage 3: Implementation Clean-Code Rubric | `pending` | Production implementation has not started. |

## Next Step

Implement the narrowest live escalated-review routing path that satisfies the
fixture-backed pass test and missing paid-provider setup refusal while
preserving existing placeholder, landing-gate, source-drift, Local Qwen,
CodeRabbit, UAT, and Landing Agent behavior.
