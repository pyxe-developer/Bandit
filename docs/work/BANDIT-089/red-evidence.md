# RED Evidence - BANDIT-089

contract_version: 1
work_item: BANDIT-089
stage: Stage 2 RED evidence
author: test_writer
timestamp: 2026-06-10T03:31:35Z
verdict: red
source_test_file: test/landing-gates.test.mjs

## Scope

Stage 2 added RED tests for the first `BANDIT-PRD-004` implementation slice:
schema-only, fail-closed Boundary Contour, Boundary Prediction Record, and
Notify-And-Revert Artifact contracts with land-check autonomy gating.

## Acceptance Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Validate malformed Boundary Contour data | `validate fails closed when boundary contour policy data is malformed` writes an invalid `material_risk` + `auto_land` contour cell and expects `bandit validate` to fail closed. |
| Require Boundary Prediction Record for `auto_land` claims | `land-check requires boundary prediction evidence for auto-land autonomy claims` writes a landing verdict with `landing_autonomy_level: auto_land` and no boundary prediction artifact, then expects `land-check` to fail closed. |
| Require Notify-And-Revert Artifact for `notify_and_revert` claims | `land-check requires notify-and-revert artifact evidence for notify-and-revert claims` writes a valid-looking Boundary Prediction Record and a `notify_and_revert` landing verdict, then expects `land-check` to require `notify-and-revert-artifact.json`. |
| Preserve ordinary safe-to-land bootstrap flows | Existing landing-gate tests continued to pass in the full targeted file run, including bootstrap-gap and ordinary safe-to-land cases. |

## Command Evidence

Focused RED run:

```sh
node --test --test-name-pattern "boundary|auto-land autonomy|notify-and-revert" test/landing-gates.test.mjs
```

Result:

- Exit code: `1`
- Tests: `3`
- Pass: `0`
- Fail: `3`

Failure summaries:

- `validate fails closed when boundary contour policy data is malformed`:
  expected exit `1`, actual exit `0`.
- `land-check requires boundary prediction evidence for auto-land autonomy
  claims`: expected exit `1`, actual exit `0`.
- `land-check requires notify-and-revert artifact evidence for
  notify-and-revert claims`: expected exit `1`, actual exit `0`.

Full targeted file run:

```sh
node --test test/landing-gates.test.mjs
```

Result:

- Exit code: `1`
- Tests: `69`
- Pass: `66`
- Fail: `3`

The failing tests were exactly the three new RED cases above.

## Test Ownership Boundary

Test Writer owns `test/landing-gates.test.mjs` changes and this RED evidence.
The Stage 3 Implementation Writer must not edit tests, test helpers, fixtures,
RED evidence, acceptance mappings, formation evidence, review evidence, landing
evidence, retrospective evidence, or policy acceptance criteria for
`BANDIT-089`.

## Next Stage

Stage 3 should implement the minimal Boundary Contour policy, boundary evidence
parsing/validation, validate integration, and land-check integration needed to
turn these RED tests green while preserving existing ordinary safe-to-land
behavior.
