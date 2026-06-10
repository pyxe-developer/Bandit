# RED Evidence - BANDIT-091

contract_version: 1
work_item: BANDIT-091
stage: Stage 2 RED evidence
author: test_writer
timestamp: 2026-06-10T13:57:57Z
verdict: red
source_test_file: test/landing-gates.test.mjs

## Scope

Stage 2 added Test Writer-owned RED tests for the third `BANDIT-PRD-004`
implementation slice: Escape Candidate evidence, Boundary Escape Disposition
evidence, template validation, aggregate `bandit validate` integration, and
ordinary safe-to-land non-regression.

## Acceptance Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Escape Candidate evidence is repo-native and not treated as confirmed escape evidence. | `validate fails closed when an escape candidate has a malformed evidence artifact hash` writes `docs/work/BANDIT-954/escape-candidate.json` and expects aggregate `bandit validate` to fail closed when the candidate evidence is malformed. |
| Boundary Escape Disposition evidence records Codex PM attribution-review verdicts and operator-input routing. | `validate fails closed when a boundary escape disposition has inconsistent operator input state` writes `docs/work/BANDIT-955/boundary-escape-disposition.json` with `operator_input_required` but `required_operator_input_status: none_required` and expects aggregate validation to fail closed. |
| Validation rejects malformed candidate or disposition artifacts and template drift with clear diagnostics. | `validate fails closed when the escape candidate template is missing` expects `bandit validate` to require `docs/templates/escape-candidate.md`; the malformed candidate and inconsistent disposition tests require artifact-level diagnostics. |
| Existing ordinary safe-to-land bootstrap flows remain unblocked when no escape evidence is claimed. | `land-check accepts ordinary safe-to-land without escape workflow evidence` writes normal review and landing verdict evidence for `BANDIT-956` without escape artifacts and expects `land-check` to pass. |

## Command Evidence

Focused RED run:

```sh
node --test --test-name-pattern "Escape|escape" test/landing-gates.test.mjs
```

Result:

- Exit code: `1`
- Tests: `4`
- Pass: `1`
- Fail: `3`

Failure summaries:

- `validate fails closed when the escape candidate template is missing`:
  expected exit `1`, actual exit `0`.
- `validate fails closed when an escape candidate has a malformed evidence
  artifact hash`: expected exit `1`, actual exit `0`.
- `validate fails closed when a boundary escape disposition has inconsistent
  operator input state`: expected exit `1`, actual exit `0`.

Passing non-regression:

- `land-check accepts ordinary safe-to-land without escape workflow evidence`
  passed, proving the RED tests do not require escape evidence for ordinary
  safe-to-land flows.

## Test Ownership Boundary

Test Writer owns `test/landing-gates.test.mjs` changes and this RED evidence.
The Stage 3 Implementation Writer must not create, edit, delete, regenerate,
format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
acceptance mappings, formation evidence, review evidence, landing evidence,
retrospective evidence, or policy acceptance criteria for `BANDIT-091`.

Codex authored the Stage 2 RED tests. Stage 3 implementation must therefore be
routed to Claude or another non-Codex model family under the Bootstrap
Model-Family Separation rule unless an operator-approved policy exception is
recorded.

## Next Stage

Stage 3 should implement the minimal Escape Candidate and Boundary Escape
Disposition templates, parser/validator helpers, template checks, aggregate
`bandit validate` integration, and supporting init/template seeding needed to
turn these RED tests green while preserving ordinary safe-to-land behavior when
no escape workflow evidence is claimed.
