# RED Evidence - BANDIT-090

contract_version: 1
work_item: BANDIT-090
stage: Stage 2 RED evidence
author: test_writer
timestamp: 2026-06-10T04:49:44Z
verdict: red
source_test_file: test/landing-gates.test.mjs

## Scope

Stage 2 added RED tests for the second `BANDIT-PRD-004` implementation slice:
Attribution Join Key tuple validation, landing attribution enforcement for
boundary-autonomy claims, and Boundary Prediction Record consistency.

## Acceptance Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Reject malformed Attribution Join Key data when present | `validate fails closed when an attribution join key has a malformed evidence artifact hash` writes `docs/work/BANDIT-951/landing-attribution-join-key.json` with a malformed evidence artifact hash and expects `bandit validate` to fail closed. |
| Require landing attribution for boundary-autonomy claims | `land-check requires a landing attribution join key for auto-land boundary claims` writes valid auto-land Boundary Prediction evidence but no landing Attribution Join Key and expects `land-check` to fail closed. |
| Reject inconsistent Boundary Prediction Record and attribution tuple references | `land-check rejects a landing attribution join key with a mismatched authorizing boundary cell` writes a Boundary Prediction Record authorized by `trivial-independent-review` and an Attribution Join Key that claims `low-reversible-independent-review`, then expects `land-check` to fail closed. |
| Preserve ordinary safe-to-land bootstrap flows | Existing landing-gate tests continued to pass in the full targeted file run, including ordinary safe-to-land and bootstrap-gap cases that do not claim PRD-004 boundary-autonomy or attribution evidence. |

## Command Evidence

Focused RED run:

```sh
node --test --test-name-pattern "Attribution|attribution" test/landing-gates.test.mjs
```

Result:

- Exit code: `1`
- Tests: `3`
- Pass: `0`
- Fail: `3`

Failure summaries:

- `validate fails closed when an attribution join key has a malformed evidence
  artifact hash`: expected exit `1`, actual exit `0`.
- `land-check requires a landing attribution join key for auto-land boundary
  claims`: expected exit `1`, actual exit `0`.
- `land-check rejects a landing attribution join key with a mismatched
  authorizing boundary cell`: expected exit `1`, actual exit `0`.

Full targeted file run:

```sh
node --test test/landing-gates.test.mjs
```

Result:

- Exit code: `1`
- Tests: `72`
- Pass: `69`
- Fail: `3`

The failing tests were exactly the three new RED cases above.

## Test Ownership Boundary

Test Writer owns `test/landing-gates.test.mjs` changes and this RED evidence.
The Stage 3 Implementation Writer must not edit tests, test helpers, fixtures,
RED evidence, acceptance mappings, formation evidence, review evidence,
landing evidence, retrospective evidence, or policy acceptance criteria for
`BANDIT-090`.

Codex authored the Stage 2 RED tests. Stage 3 implementation must therefore be
routed to Claude or another non-Codex model family under the Bootstrap
Model-Family Separation rule unless an operator-approved policy exception is
recorded.

## Next Stage

Stage 3 should implement the minimal Attribution Join Key template, parser,
validation helpers, deterministic hash check, validate integration, and
land-check integration needed to turn these RED tests green while preserving
ordinary safe-to-land behavior when no PRD-004 boundary-autonomy or attribution
evidence is claimed.
