# RED Evidence - BANDIT-092

contract_version: 1
work_item: BANDIT-092
stage: Stage 2 RED evidence
author: test_writer
timestamp: 2026-06-10T18:11:00Z
verdict: red
source_test_file: test/landing-gates.test.mjs

## Scope

Stage 2 added Test Writer-owned RED tests for the fourth `BANDIT-PRD-004`
implementation slice: Boundary Cell Movement evidence, Workflow Trial-backed
expansion guardrails, zero-escape expansion refusal, confirmed-escape
contraction checks, template validation, aggregate `bandit validate`
integration, and ordinary safe-to-land non-regression.

## Acceptance Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Boundary Cell Movement evidence is a repo-native structured artifact without applying contour changes. | `validate fails closed when boundary cell movement evidence has malformed source head` writes `docs/work/BANDIT-957/boundary-cell-movement.json` and expects aggregate `bandit validate` to fail closed on malformed evidence. |
| Validation rejects malformed movement evidence and direction inconsistencies. | `validate fails closed when the boundary cell movement template is missing`, `validate fails closed when boundary cell movement evidence has malformed source head`, and `validate fails closed when boundary cell movement direction contradicts autonomy levels` expect template, source-head, and direction diagnostics. |
| Autonomy expansion requires Workflow Trial guardrails and operator-reviewed improvement decision evidence. | `validate fails closed when autonomy expansion movement lacks workflow trial guardrails` expects aggregate validation to refuse expansion movement without linked Workflow Trial evidence and decision guardrails. |
| Zero observed escapes alone cannot justify autonomy expansion. | `validate fails closed when zero escapes alone are used for boundary expansion` expects aggregate validation to reject `movement_reason: zero_observed_escapes` for expansion movement. |
| Confirmed escapes require fail-closed contraction before future notify_and_revert or auto_land claims proceed. | `land-check requires contraction evidence after a confirmed boundary escape for autonomy claims` writes confirmed escape/disposition evidence plus an `auto_land` claim and expects land-check to block without contraction movement evidence. |
| Ordinary safe-to-land bootstrap flows remain unblocked when no boundary-autonomy claim or confirmed escape evidence exists. | `land-check accepts ordinary safe-to-land without escape workflow evidence` passes, proving the RED set does not require movement evidence for ordinary safe-to-land flows. |

## Command Evidence

Focused RED run:

```sh
node --test --test-name-pattern "Boundary Cell|boundary cell|autonomy expansion|zero escapes|confirmed boundary escape|ordinary safe-to-land" test/landing-gates.test.mjs
```

Result:

- Exit code: `1`
- Tests: `8`
- Pass: `2`
- Fail: `6`

Intentional failure summaries:

- `validate fails closed when the boundary cell movement template is missing`:
  expected exit `1`, actual exit `0`.
- `validate fails closed when boundary cell movement evidence has malformed
  source head`: expected exit `1`, actual exit `0`.
- `validate fails closed when boundary cell movement direction contradicts
  autonomy levels`: expected exit `1`, actual exit `0`.
- `validate fails closed when autonomy expansion movement lacks workflow trial
  guardrails`: expected exit `1`, actual exit `0`.
- `validate fails closed when zero escapes alone are used for boundary
  expansion`: expected exit `1`, actual exit `0`.
- `land-check requires contraction evidence after a confirmed boundary escape
  for autonomy claims`: expected exit `1`, actual exit `0`.

Passing non-regressions:

- `land-check accepts ordinary safe-to-land without escape workflow evidence`
  passed, proving ordinary bootstrap safe-to-land remains unblocked without
  escape workflow or movement evidence.
- `land-check rejects a landing attribution join key with a mismatched
  authorizing boundary cell` passed as an existing adjacent regression.

## Test Ownership Boundary

Test Writer owns `test/landing-gates.test.mjs` changes and this RED evidence.
The Stage 3 Implementation Writer must not create, edit, delete, regenerate,
format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
acceptance mappings, formation evidence, review evidence, landing evidence,
UAT evidence, retrospective evidence, or policy acceptance criteria for
`BANDIT-092`.

Codex authored the Stage 2 RED tests. Stage 3 implementation must therefore be
routed to Claude or another non-Codex model family under the Bootstrap
Model-Family Separation rule unless an operator-approved policy exception is
recorded.

## Next Stage

Stage 3 should implement the minimal Boundary Cell Movement template,
parser/validator helper, aggregate `bandit validate` integration,
confirmed-escape contraction checks for boundary-autonomy land-check claims,
template/init seeding, and supporting code needed to turn these RED tests green
while preserving ordinary safe-to-land behavior when no boundary-autonomy claim
or confirmed escape evidence exists.
