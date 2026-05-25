# BANDIT-018 AC10 Repair Evidence

repair_time_utc: 2026-05-25T15:39:44Z
work_item: BANDIT-018
base_head: 0479546c2ad3bce29f0f0c60b4dc725616b7fbdf
repair_state: implemented

## Repair Scope

Codex PM accepted the Sonnet 4.6 and Opus 4.7 finding that AC10 was under
covered. The repair adds focused tests for the missing escalated-review refusal
and landing-gate paths without starting landing verdict, landing action,
retrospective, or the next bootstrap-gap chore.

## AC10 Coverage Added

- Configured fixture-backed pass evidence remains covered.
- Paid provider setup and credential refusal remains covered.
- Reviewer blocker verdict evidence is now covered.
- Stale escalated-review source-head evidence is now covered.
- Missing fixture/provider-unavailable evidence is now covered.
- Timed-out provider evidence is now covered through deterministic fixture
  status.
- Malformed reviewer output refusal is now covered.
- Land-check integration for current live pass evidence is now covered.
- Placeholder rejection for configured live routing remains covered.

## Implementation Notes

- `src/commands/escalated-review.ts` now converts missing fixture files into
  unavailable escalated-review evidence instead of leaking `ENOENT`.
- Fixture `provider_status: timeout` and `provider_status: unavailable` now
  produce unavailable blocking evidence.
- Malformed JSON fixture output now fails closed with
  `Malformed escalated reviewer output` instead of leaking parser internals.

## Verification

```sh
node --test --test-name-pattern "escalated-review" test/landing-gates.test.mjs
```

Result: `pass` - 8 focused escalated-review tests passed.

```sh
npm run typecheck
```

Result: `pass`.

```sh
npm test
```

Result: `pass` - 164 tests passed.

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | The added focused tests failed RED for unavailable fixture, timeout, and malformed JSON refusal paths before production changes. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | The production change is limited to escalated-review fixture refusal handling and preserves explicit repo-native evidence. |
| Stage 4: Review And Cross-Model Gates | `pending` | Stage 4 review evidence must be refreshed at the repair head before landing verdict or landing action. |

## Next Step

Refresh `BANDIT-018` Stage 4 review evidence at the AC10 repair head. Do not
create landing verdict, landing action, retrospective, or the next
bootstrap-gap chore until review evidence is current and non-blocking.
