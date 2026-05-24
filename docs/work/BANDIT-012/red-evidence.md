# RED Evidence: BANDIT-012

## Status

RED evidence recorded on 2026-05-24. Production implementation has not started.

## Scope Under Test

The focused tests added in `test/landing-gates.test.mjs` define the expected
CLI-owned UAT approval behavior before implementation:

- `land-check` must fail closed when `uat_status: pass` is claimed without
  `docs/work/<ID>/uat-approval.md`.
- `land-check` must fail closed when UAT approval evidence exists but its
  source head is stale.
- `land-check` must report current UAT approval evidence when passing UAT is
  current.
- `bandit validate` must reject malformed UAT approval metadata.
- `bandit uat approve <work-item-id>` must fail closed when explicit operator
  approval inputs are missing.
- `bandit uat approve <work-item-id>` must write approval evidence for the
  current source head when explicit operator approval inputs are provided.

## Command

```sh
node --test test/landing-gates.test.mjs
```

## Result

Expected RED failure:

```text
tests 25
pass 19
fail 6
```

Failing tests:

```text
land-check fails closed when safe-to-land claims passing UAT without approval evidence
  Expected code 1; actual code 0.

land-check fails closed when passing UAT evidence is stale
  Expected code 1; actual code 0.

land-check accepts current passing UAT approval evidence
  Expected output to include:
  UAT evidence: docs/work/BANDIT-917/uat-approval.md

validate fails closed for malformed UAT approval metadata
  Expected code 1; actual code 0.

uat approve fails closed when operator approval inputs are missing
  Expected usage for bandit uat approve; actual output was Unknown command: uat.

uat approve writes approval evidence for the current source head
  Expected code 0; actual code 1 because bandit uat is unknown.
```

## Acceptance-Criteria Mapping

| Acceptance criteria | RED evidence |
|---|---|
| 1 | Missing approval artifact test shows current `land-check` accepts claimed `uat_status: pass`. |
| 2 | `uat approve` tests show no UAT command exists. |
| 3 | Malformed metadata test defines the required UAT artifact parser/validator behavior. |
| 4 | Successful `uat approve` test defines current-head artifact writing from explicit inputs. |
| 5 | Missing-input test defines fail-closed usage behavior. |
| 6 | Malformed metadata test defines `bandit validate` rejection behavior. |
| 7 | Missing approval artifact test defines `land-check` enforcement for claimed pass. |
| 8 | Stale UAT test defines source-head freshness enforcement. |
| 9 | Existing `land-check prints recorded gate state...` test still covers `not_applicable` UAT for workflow-infrastructure work. |
| 10 | Failure expectations distinguish missing UAT, stale UAT, malformed UAT, and command usage. |
| 11 | Focused tests cover the required UAT approval and landing-gate paths. |

## Stage-Rubric Check

Stage 2: Test Design And RED Evidence: `pass`.

The tests express behavior before production implementation and fail because the
UAT artifact parser, validator, command, and `land-check` integration do not
exist yet. Test ownership is clear: these are Test Writer-owned expectations
for `BANDIT-012` and should not be weakened during implementation.
