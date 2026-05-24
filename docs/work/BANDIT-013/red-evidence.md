# RED Evidence: BANDIT-013

## Status

RED evidence recorded on 2026-05-24. Production implementation has not started.

## Scope Under Test

The focused tests added in `test/landing-gates.test.mjs` define the expected
auto-landing eligibility behavior before implementation:

- `bandit auto-land-check <work-item-id>` must report a safe chore or
  workflow-infrastructure item as eligible when UAT is not applicable.
- `bandit auto-land-check <work-item-id>` must report a feature slice as
  eligible only when current UAT approval evidence exists.
- `bandit auto-land-check <work-item-id>` must block when feature-slice UAT is
  claimed but current UAT approval evidence is missing.
- `bandit validate` must reject malformed auto-landing policy state.

## Command

```sh
node --test test/landing-gates.test.mjs
```

## Result

Expected RED failure:

```text
tests 29
pass 25
fail 4
```

Failing tests:

```text
auto-land-check reports a safe chore as eligible without UAT
  Expected code 0; actual code 1 because bandit auto-land-check is unknown.

auto-land-check reports a UAT-approved feature slice as eligible
  Expected code 0; actual code 1 because bandit auto-land-check is unknown.

auto-land-check blocks feature slices without current UAT approval
  Expected blocking reason for missing UAT; actual output was Unknown command: auto-land-check.

validate fails closed when the auto-landing policy artifact is malformed
  Expected code 1; actual code 0 because no auto-landing policy validator exists.
```

## Acceptance-Criteria Mapping

| Acceptance criteria | RED evidence |
|---|---|
| 1 | Unknown-command failures show `bandit auto-land-check <work-item-id>` does not exist. |
| 2 | Malformed policy test defines the need for a versioned `.bandit/policy/auto-landing.json` contract. |
| 3 | Existing initialized test repos lack a policy artifact until `bandit init` creates one during implementation. |
| 4 | Malformed policy test defines fail-closed validation behavior. |
| 5 | Eligible chore test defines UAT-not-applicable eligibility output. |
| 6 | Eligible feature-slice test defines current-UAT eligibility output. |
| 7 | Missing-UAT test defines fail-closed feature-slice behavior. |
| 8 | Tests reuse existing landing evidence helpers so `auto-land-check` must respect `land-check` gate readiness. |
| 9 | Command scope in the tests is read-only; no merge or git mutation is invoked. |
| 10 | Output expectations define work item, eligibility, class, and UAT requirement lines. |
| 11 | Focused tests cover eligible chore, eligible feature slice, missing UAT block, and malformed policy validation. |

## Stage-Rubric Check

Stage 2: Test Design And RED Evidence: `pass`.

The tests express behavior before production implementation and fail because the
auto-landing policy parser, validator, default init artifact, and
`auto-land-check` command do not exist yet. Test ownership is clear: these are
Test Writer-owned expectations for `BANDIT-013` and should not be weakened
during implementation.
