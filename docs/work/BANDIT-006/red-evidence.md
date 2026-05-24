# BANDIT-006 RED Evidence

## Status

RED evidence created on 2026-05-24 before production implementation.

Current verdict: `pass` for Stage 2 test design and RED evidence.

No local Qwen reviewer profile seed, local Qwen review template, profile
validator, evidence parser, `qwen-review` command, or `land-check` local-Qwen
integration has been implemented in this step.

## Required First Reads

- `AGENTS.md`
- `CONTEXT.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/plans/BOOTSTRAP_METHODOLOGY.md`
- `docs/plans/V0_PLAN.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `.bandit/policy/smell-triggers.json`
- `docs/work/BANDIT-006/brief.md`
- `docs/work/BANDIT-005/brief.md`
- `docs/work/BANDIT-005/red-evidence.md`
- `docs/work/BANDIT-005/implementation-evidence.md`
- `docs/work/BANDIT-005/review-evidence.md`
- `docs/work/BANDIT-005/landing-verdict.md`
- `docs/work/BANDIT-005/landing-action.md`
- `docs/work/BANDIT-005/retrospective.md`

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating the
`BANDIT-006` brief and re-applied it before this RED stage.

The tests are shaped around small behavior surfaces, explicit repo-native
reviewer state, no hidden model/session authority, fail-closed runtime and
evidence paths, readable profile/evidence/command boundaries, source-drift
clarity, and preserved operator-input boundaries.

## Test Writer Evidence

Test file:

- `test/local-qwen-review.test.mjs`

Test ownership:

- The behavior assertions in `test/local-qwen-review.test.mjs` are Test
  Writer-owned evidence for `BANDIT-006`.
- Writer implementation may add production code, templates, profile seeds, and
  supporting fixtures to satisfy these tests.
- Writer implementation must not weaken, delete, or redefine these assertions
  without an explicit test-change rationale recorded in the work item.

## Chosen RED Contract Shape

The RED tests choose these narrow artifact names for implementation:

- Reviewer profile: `.bandit/reviewers/local-qwen.json`
- Review template: `docs/templates/local-qwen-review.md`
- Work-item evidence: `docs/work/<ID>/local-qwen-review.md`
- Command: `bandit qwen-review <work-item-id>`

The profile is command-backed for deterministic tests and remains read-only for
v0. Automated tests use fixture reviewer commands; they do not require a live
Qwen installation, network, paid key, or operator approval.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Test Evidence |
|---|---|
| AC1 | `validate fails closed when the local Qwen reviewer profile is missing`; `validate fails closed when the local Qwen profile omits the prompt contract`; `validate fails closed when the local Qwen profile uses an unsupported runtime`. |
| AC2 | The valid fixture profile uses `profile_id: local-qwen-baseline`, command runtime, fixture model, read-only filesystem permissions, disabled network, and no edit/tool authority. |
| AC3 | Profile validation tests cover missing profile, missing prompt contract, unsupported runtime, and missing template refusal. |
| AC4 | `test/local-qwen-review.test.mjs` defines the `local-qwen-review.md` metadata contract for work item, source head, profile ID, runtime/model, run status, reviewer verdict, findings/disposition, operator-input status, source-drift status, executable evidence, and bootstrap gaps. |
| AC5 | Evidence validation tests cover wrong work item, unsupported reviewer verdict, unresolved operator input, and pass without executable evidence. |
| AC6 | `qwen-review writes repo-native evidence for a passing fixture review` asserts the `bandit qwen-review <work-item-id>` command shape. |
| AC7 | `qwen-review reports usage when the work item ID is omitted`. |
| AC8 | `qwen-review fails closed when the work item is unknown`. |
| AC9 | `qwen-review fails closed when the local Qwen profile is missing`. |
| AC10 | Command tests cover unavailable runtime, nonzero reviewer exit, inconclusive output, and passing fixture output. |
| AC11 | The passing command fixture runs in a Git-backed temp repo and asserts repo-native evidence records the current source head; land-check tests cover stale local Qwen evidence. |
| AC12 | The passing command fixture asserts `docs/work/<ID>/local-qwen-review.md` is written with profile ID, verdict, and resolved operator-input status. |
| AC13 | `land-check reports the current local Qwen pass and evidence artifact`; `land-check fails closed when local Qwen evidence is stale`; `land-check fails closed when local Qwen evidence is blocked`; `land-check fails closed when local Qwen evidence is inconclusive`. |
| AC14 | The test file covers profile validation, evidence validation, command usage, unknown work item, missing profile, unavailable runtime, nonzero reviewer exit, inconclusive output, fixture pass, stale source head, and `land-check` integration. |
| AC15 | Tests keep the implementation surface bounded to profile validation, local Qwen evidence validation, one command, and `land-check` integration. |
| AC16 | Full verification is not expected to pass during RED. It must pass before landing after GREEN implementation and closeout evidence. |

## RED Run

Command:

```sh
node --test test/local-qwen-review.test.mjs
```

Result:

```text
tests 20
pass 1
fail 19
```

Expected failure classes:

- `bandit validate` currently returns success when the required local Qwen
  reviewer profile is missing, malformed, or uses an unsupported runtime.
- `bandit validate` currently returns success when local Qwen review evidence
  is malformed, references the wrong work item, hides unresolved operator
  input, or records a pass without executable evidence.
- `bandit qwen-review <work-item-id>` does not exist yet; the CLI reports
  `Unknown command: qwen-review`.
- `bandit land-check <work-item-id>` currently trusts the aggregate
  `local_qwen_state` field and does not read or report
  `docs/work/<ID>/local-qwen-review.md`.

Representative failure evidence:

```text
validate fails closed when the local Qwen reviewer profile is missing
actual: 0
expected: 1

validate fails closed when local Qwen evidence uses an unsupported reviewer verdict
actual: 0
expected: 1

qwen-review reports usage when the work item ID is omitted
Unknown command: qwen-review
Usage: bandit <init|validate|list|show|draft-work|route|land-check>

land-check fails closed when local Qwen evidence is stale
actual: 0
expected: 1
```

Non-RED compatibility evidence:

```text
validate preserves compatibility for historical work items without local Qwen evidence
pass
```

Interpretation:

The tests are executable and fail for the missing Phase 4 local Qwen baseline
reviewer behavior while preserving historical artifact compatibility. This is
the correct RED state for `BANDIT-006`.

## Stage-Rubric Check

| Stage 2 Requirement | Verdict | Evidence |
|---|---|---|
| Tests or explicit bootstrap verification plan | `pass` | `test/local-qwen-review.test.mjs` contains 20 focused RED tests for the local Qwen profile, evidence, command, and `land-check` contract. |
| RED evidence where feasible | `pass` | The focused test command fails 19/20 tests before production implementation. |
| Mapping from tests to acceptance criteria | `pass` | The table above maps tests to the brief's acceptance criteria. |
| Clear distinction between Test Writer-owned tests and Writer-editable tests | `pass` | This artifact marks the assertions as Test Writer-owned. |
| Tests would fail against missing behavior | `pass` | Missing profile/template validation currently passes incorrectly, local Qwen evidence is ignored, `qwen-review` is missing, and `land-check` ignores the local Qwen evidence artifact. |
| Important refusal paths and state transitions covered | `pass` | Missing profile, malformed profile, wrong work item, unsupported verdict, unresolved operator input, missing executable evidence, missing command argument, unknown work item, unavailable runtime, nonzero reviewer exit, inconclusive output, fixture pass, stale evidence, blocked evidence, and inconclusive evidence are covered. |

## Clean-Code Implications For GREEN

Implementation must keep the surface small and explicit:

- add `.bandit/reviewers/local-qwen.json`;
- add `docs/templates/local-qwen-review.md`;
- add small profile and local Qwen review evidence parser/validator helpers;
- validate the seeded profile and any present local Qwen review evidence
  without retroactively requiring historical work items to have review
  artifacts;
- add a narrow `qwen-review` command that executes only the configured read-only
  command profile and writes repo-native evidence;
- use subprocess fixtures in tests and avoid a dependency on live model state;
- update `land-check` to require current local Qwen evidence when aggregate
  review/landing evidence claims `local_qwen_state: pass`;
- preserve explicit `bootstrap_gap` handling for unavailable gates without
  treating unavailable review as a pass;
- avoid CodeRabbit automation, paid reviewer routing, UAT, Landing Agent,
  cockpit, SQLite indexing, or automated repair behavior in this slice;
- fail closed with clear messages for missing, malformed, stale, blocked,
  unresolved, unavailable, nonzero, timed-out, or inconclusive evidence.

## Bootstrap Gaps

- CodeRabbit automation is unavailable and remains out of scope.
- Escalated adversarial review automation is unavailable and remains out of
  scope unless later smell-trigger evidence requires separate work.
- Landing Agent is unavailable during bootstrap and remains out of scope.
- CLI-owned UAT artifacts are Phase 5 and are not applicable to this
  workflow-infrastructure slice.
- Live local Qwen runtime availability must not be required for automated
  tests; fixture subprocesses provide deterministic replacement evidence.

## Operator Input Status

No operator-owned input is missing for GREEN implementation.

Repo artifacts already define the product direction, acceptance criteria,
bootstrap gaps, and technical routing policy for this slice.

## Next Step

Begin GREEN implementation for `BANDIT-006`:

1. Add `.bandit/reviewers/local-qwen.json`.
2. Add `docs/templates/local-qwen-review.md`.
3. Add local Qwen reviewer profile and review evidence validators.
4. Wire `bandit validate` to require the profile/template and validate present
   local Qwen evidence.
5. Wire `bandit qwen-review <work-item-id>` using deterministic subprocess
   behavior and repo-native evidence output.
6. Wire `bandit land-check <work-item-id>` to consume current
   `local-qwen-review.md` evidence when local Qwen is recorded as `pass`.
7. Run `node --test test/local-qwen-review.test.mjs` until it passes, then run
   full verification required by the brief.
