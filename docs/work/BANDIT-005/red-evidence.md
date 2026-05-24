# BANDIT-005 RED Evidence

## Status

RED evidence created on 2026-05-24 before production implementation.

Current verdict: `pass` for Stage 2 test design and RED evidence.

No production review-evidence template, landing-verdict template, parser,
validator, source-drift helper, or `land-check` command implementation has
started in this step.

## Required First Reads

- `AGENTS.md`
- `CONTEXT.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/plans/BOOTSTRAP_METHODOLOGY.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-005/brief.md`
- `docs/plans/V0_PLAN.md`

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating the
`BANDIT-005` brief and re-applied it before this RED stage.

The tests are shaped around small behavior surfaces, explicit repo-native
state, no hidden landing authority, fail-closed errors, readable parser and
command boundaries, source-drift clarity, and preserved operator-input
boundaries.

## Test Writer Evidence

Test file:

- `test/landing-gates.test.mjs`

Test ownership:

- The behavior assertions in `test/landing-gates.test.mjs` are Test
  Writer-owned evidence for `BANDIT-005`.
- Writer implementation may add production code, templates, and supporting
  fixtures to satisfy these tests.
- Writer implementation must not weaken, delete, or redefine these assertions
  without an explicit test-change rationale recorded in the work item.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Test Evidence |
|---|---|
| AC1 | `validate fails closed when the review evidence template is missing`; `validate fails closed when the landing verdict template is missing`; fixture templates define required fields for work item, source head, verification state, CodeRabbit, local Qwen, escalated review, PM disposition, bootstrap gaps, UAT, clean-code, final verdict, and source drift. |
| AC2 | `validate fails closed when new-contract review evidence uses an unsupported gate verdict`; valid fixtures use `pass`, `blocker`, `non_blocking`, `not_applicable`, and `bootstrap_gap`. |
| AC3 | `land-check prints recorded gate state and final decision for current evidence`; landing verdict fixtures use `safe-to-land` and tests reserve the allowed final decision vocabulary for implementation. |
| AC4 | `land-check prints recorded gate state and final decision for current evidence` asserts work item, review gates, source head, current head, source drift, bootstrap gaps, UAT, clean-code, and final decision output. |
| AC5 | `land-check reports usage when the work item ID is omitted`. |
| AC6 | `land-check fails closed when the work item is unknown`. |
| AC7 | `land-check fails closed when review evidence is missing`; `land-check fails closed when landing verdict evidence is missing`. |
| AC8 | `land-check fails closed when required review gate fields are missing`; `validate fails closed when new-contract review evidence uses an unsupported gate verdict`. |
| AC9 | `land-check fails closed when safe-to-land omits required passing tests`; `land-check fails closed when safe-to-land evidence is stale`. |
| AC10 | `land-check accepts explicit bootstrap gaps with replacement evidence during bootstrap`. |
| AC11 | `land-check fails closed when safe-to-land evidence is stale`. |
| AC12 | `land-check reports unavailable current head explicitly when Git metadata is absent`. |
| AC13 | `validate preserves compatibility for historical work items without new-contract landing artifacts`. |
| AC14 | Tests use repo-native `docs/templates/*.md`, `docs/work/<ID>/*.md`, and Git head checks only; no database, generated index, cockpit, or hidden state authority is introduced. |
| AC15 | The test file covers template requirements, review evidence validation, land-check success output, missing argument, unknown work item, missing evidence, malformed evidence, safe-to-land missing gates, bootstrap gaps, stale evidence, missing Git metadata, and historical artifact compatibility. |
| AC16 | Full verification is not expected to pass during RED. It must pass before landing after implementation. |

## RED Run

Command:

```sh
node --test test/landing-gates.test.mjs
```

Result:

```text
tests 14
pass 1
fail 13
```

Expected failure classes:

- `bandit validate` currently returns success when the new
  `docs/templates/review-evidence.md` or
  `docs/templates/landing-verdict.md` template is missing.
- `bandit validate` currently does not validate new-contract review evidence
  gate verdict values.
- `bandit land-check` does not exist yet; the CLI reports
  `Unknown command: land-check`.

Representative failure evidence:

```text
validate fails closed when the review evidence template is missing
actual: 0
expected: 1

validate fails closed when new-contract review evidence uses an unsupported gate verdict
actual: 0
expected: 1

land-check prints recorded gate state and final decision for current evidence
Unknown command: land-check
Usage: bandit <init|validate|list|show|draft-work|route>
```

Non-RED compatibility evidence:

```text
validate preserves compatibility for historical work items without new-contract landing artifacts
pass
```

Interpretation:

The tests are executable and fail for the missing Phase 4 review and landing
gate behavior while preserving historical artifact compatibility. This is the
correct RED state for `BANDIT-005`.

## Stage-Rubric Check

| Stage 2 Requirement | Verdict | Evidence |
|---|---|---|
| Tests or explicit bootstrap verification plan | `pass` | `test/landing-gates.test.mjs` contains 14 focused tests for the Phase 4 pre-landing review loop contract. |
| RED evidence where feasible | `pass` | The focused test command fails 13/14 tests before production implementation. |
| Mapping from tests to acceptance criteria | `pass` | The table above maps tests to the brief's acceptance criteria. |
| Clear distinction between Test Writer-owned tests and Writer-editable tests | `pass` | This artifact marks the assertions as Test Writer-owned. |
| Tests would fail against missing behavior | `pass` | Missing template validation currently passes incorrectly, review-evidence gate values are not validated, and `land-check` is missing. |
| Important refusal paths and state transitions covered | `pass` | Missing arguments, unknown work items, missing evidence, malformed evidence, missing gates, stale evidence, explicit bootstrap gaps, and unavailable Git metadata are covered. |

## Clean-Code Implications For GREEN

Implementation must keep the surface small and explicit:

- add review-evidence and landing-verdict templates;
- add small parser/validator helpers for new-contract review and landing
  artifacts;
- validate new-contract artifacts without retroactively requiring historical
  artifacts to migrate;
- add source-head/current-head comparison as an explicit helper;
- add a narrow `land-check` command that reports recorded evidence and fails
  closed for unsafe `safe-to-land` claims;
- preserve CLI authority and repo-native artifacts as the landing source of
  truth;
- avoid reviewer automation, databases, hidden indexes, cockpit-owned state, or
  broad Landing Agent behavior in this slice;
- fail closed with clear messages for missing, malformed, stale, blocked,
  unresolved, or unavailable gate evidence.

## Bootstrap Gaps

- CodeRabbit automation is unavailable; tests require explicit
  `bootstrap_gap` replacement evidence.
- Local Qwen runtime is unavailable; tests require explicit `bootstrap_gap`
  replacement evidence.
- Escalated reviewer automation is unavailable; tests require explicit
  `not_applicable` or `bootstrap_gap` rationale.
- Landing Agent is unavailable; tests require explicit bootstrap replacement
  evidence.
- CLI-owned UAT artifacts are Phase 5; tests keep UAT status explicit and
  `not_applicable` for this infrastructure slice.

## Operator Input Status

No operator-owned input is missing for GREEN implementation.

Repo artifacts already define the product direction, acceptance criteria,
bootstrap gaps, and technical routing policy for this slice.

## Next Step

Begin GREEN implementation for `BANDIT-005`:

1. Add `docs/templates/review-evidence.md`.
2. Add `docs/templates/landing-verdict.md`.
3. Add review-evidence and landing-verdict parser/validator helpers.
4. Add source-head/current-head helper behavior for Git-backed and non-Git
   repos.
5. Wire validation for new-contract artifacts while preserving historical
   artifact compatibility.
6. Wire `bandit land-check <work-item-id>` until
   `node --test test/landing-gates.test.mjs` passes.
