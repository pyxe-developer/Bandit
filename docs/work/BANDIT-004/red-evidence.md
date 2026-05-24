# BANDIT-004 RED Evidence

## Status

RED evidence created on 2026-05-24 before production implementation.

Current verdict: `pass` for Stage 2 test design and RED evidence.

No production routing, catalog, validator, template, or command implementation has started in this step.

## Required First Reads

- `AGENTS.md`
- `CONTEXT.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/plans/BOOTSTRAP_METHODOLOGY.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-004/brief.md`

## Test Writer Evidence

Test file:

- `test/routing.test.mjs`

Test ownership:

- The behavior assertions in `test/routing.test.mjs` are Test Writer-owned evidence for `BANDIT-004`.
- Writer implementation may add production code and supporting fixtures to satisfy these tests.
- Writer implementation must not weaken, delete, or redefine these assertions without an explicit test-change rationale recorded in the work item.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Test Evidence |
|---|---|
| AC1, AC2 | `validate fails closed when the smell trigger catalog is missing`; valid fixture catalog shape includes stable IDs, names, categories, triggers, severity, default action, escalation target, and required evidence. |
| AC3 | `validate fails closed when the smell trigger catalog is missing`; `validate fails closed when the smell trigger catalog has duplicate IDs`; `validate fails closed when a smell trigger uses an unsupported action`. |
| AC4 | `validate fails closed when the routing decision template is missing`. |
| AC5, AC13 | `route prints the recorded routing decision without inferring new policy`. |
| AC6 | `validate fails closed when a routing decision references an unknown smell ID`; `validate fails closed when a routing decision hides missing operator input`. |
| AC7, AC8 | `route prints the recorded routing decision without inferring new policy`. |
| AC9 | `route reports usage when the work item ID is omitted`. |
| AC10 | `route fails closed when the work item is unknown`. |
| AC11 | `route fails closed when the routing decision artifact is missing`. |
| AC12 | `route fails closed when the routing decision references unknown smell IDs`. |
| AC14 | Tests use repo-native `.bandit/policy/smell-triggers.json`, `docs/templates/routing-decision.md`, and `docs/work/<ID>/routing-decision.md` fixtures; no database, generated index, or cockpit state is introduced. |
| AC15 | The test file covers catalog validation, routing decision validation, route command success output, and route command refusal paths. |
| AC16 | Full verification is not expected to pass during RED. It must pass before landing after implementation. |

## RED Run

Command:

```sh
node --test test/routing.test.mjs
```

Result:

```text
tests 11
pass 0
fail 11
```

Expected failure classes:

- `bandit validate` currently returns success when the Smell Trigger Catalog is missing, duplicated, malformed, or when routing-decision artifacts reference unknown smells.
- `bandit validate` currently does not require `docs/templates/routing-decision.md`.
- `bandit route` does not exist yet; the CLI reports `Unknown command: route`.

Representative failure evidence:

```text
validate fails closed when the smell trigger catalog is missing
actual: 0
expected: 1

route prints the recorded routing decision without inferring new policy
Unknown command: route
Usage: bandit <init|validate|list|show|draft-work>
```

## Stage-Rubric Check

| Stage 2 Requirement | Verdict | Evidence |
|---|---|---|
| Tests or explicit bootstrap verification plan | `pass` | `test/routing.test.mjs` contains 11 focused tests. |
| RED evidence where feasible | `pass` | The focused test command fails 11/11 tests before production implementation. |
| Mapping from tests to acceptance criteria | `pass` | The table above maps tests to the brief's acceptance criteria. |
| Clear distinction between Test Writer-owned tests and Writer-editable tests | `pass` | This artifact marks the assertions as Test Writer-owned. |
| Tests would fail against missing behavior | `pass` | Validation failures currently pass incorrectly, and the route command is missing. |
| Important refusal paths and state transitions covered | `pass` | Missing catalog, missing template, malformed catalog, unknown smell IDs, unresolved operator input, omitted route ID, unknown work item, and missing routing decision are covered. |

## Clean-Code Implications For GREEN

Implementation must keep the surface small and explicit:

- add structured catalog parsing/validation near state validation;
- add routing-decision parsing/validation near work-item artifact handling;
- add a narrow `route` command that reports recorded decisions only;
- preserve CLI authority and repo-native artifacts as source of truth;
- avoid generated schema frameworks, hidden indexes, databases, autonomous smell inference, or broad policy engines;
- fail closed with clear messages for malformed policy, malformed routing artifacts, missing work items, unresolved operator-owned input, and unknown smell IDs.

## Next Step

Begin GREEN implementation for `BANDIT-004`:

1. Add the Smell Trigger Catalog seed.
2. Add the routing decision template.
3. Add catalog and routing-decision parser/validator helpers.
4. Wire validation and the `bandit route <work-item-id>` command until `node --test test/routing.test.mjs` passes.
