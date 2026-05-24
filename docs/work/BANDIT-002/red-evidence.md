# BANDIT-002 RED Evidence

## Scope

This evidence covers Stage 2: Test Design And RED Evidence for Work Artifact Templates And Validation.

This step creates the test design before production implementation. Actual RED
runs must be recorded here after the failing tests are added and before
template or validation implementation begins.

## Test Ownership

- Test Writer-owned tests: `test/**/*.test.mjs` and `test/helpers/bandit-cli.mjs`.
- Writer-editable production files: `docs/templates/**`, `src/state/**`, and `src/commands/validate.ts`.
- Production implementation must not weaken template contract assertions without an explicit test-change rationale in this evidence file or implementation evidence.

## Acceptance Criteria Mapping

| Acceptance Criteria | Planned Test Coverage |
|---|---|
| Repository contains explicit templates for Feature PRD, Slice, Chore, and retrospective-derived improvement chore artifacts | `test/templates.test.mjs` checks the required `docs/templates/*.md` paths exist and are readable. |
| Feature PRD template includes problem, user, goals, non-goals, stories or workflows, acceptance criteria, out-of-scope boundaries, test or verification strategy, and decomposition notes | `test/templates.test.mjs` validates required Feature PRD headings or metadata labels. |
| Slice template includes goal, scope, out of scope, acceptance criteria, test plan, `CLEAN_CODE.md` read evidence, stage-rubric checklist, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator input status | `test/templates.test.mjs` validates required Slice headings or metadata labels. |
| Chore template distinguishes non-product maintenance or improvement work from feature slices and includes origin, scope, acceptance criteria, verification plan, expected files, required evidence, and operator input status | `test/templates.test.mjs` validates required Chore headings or metadata labels, including an explicit non-product work marker. |
| Improvement chore metadata includes source metadata, lesson, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome fields compatible with `docs/improvement/retrospective-chore-schema.md` | `test/templates.test.mjs` validates the improvement chore template preserves the required metadata fields from the schema document. |
| `bandit validate` fails closed with clear messages when a required template is missing | `test/validate.test.mjs` removes each required template path in a temp repo and expects exit code `1` plus `Missing required template: <path>`. |
| `bandit validate` fails closed with clear messages when a required template omits required sections or metadata | `test/validate.test.mjs` writes malformed template content and expects exit code `1` plus a message naming the template and missing requirement. |
| `bandit validate` passes with the committed templates and existing Bandit state | `test/validate.test.mjs` runs `bandit validate` in a temp repo with initialized state and copied committed templates, then expects exit code `0`. |
| Tests cover successful template validation and representative missing or malformed template refusal paths | `test/templates.test.mjs` covers direct template contract validation; `test/validate.test.mjs` covers CLI refusal paths. |
| Implementation does not introduce hidden canonical state, SQLite authority, generated template truth, or cockpit-owned state | Tests operate only on repo-native `docs/templates/**`, `.bandit/**`, and `docs/work/**`; no database, generated index, or UI state is expected. |
| Implementation remains small enough for future PRD-to-work command reuse | Planned module boundary is `src/state/templates.ts`, wired into `src/commands/validate.ts`, with no PRD decomposition command in this slice. |

## Planned RED Tests

### Template Contract Tests

Planned file: `test/templates.test.mjs`

Required cases:

- Valid committed template set satisfies the template contract.
- Feature PRD, Slice, Chore, and improvement chore templates expose the required headings or metadata labels.

Accepted RED result before implementation:

- Tests fail because `docs/templates/**` does not exist.
- Failure proves the tests require real committed template files.

### Full Validate Command Tests

Planned file: `test/validate.test.mjs`

Required cases:

- `bandit validate` includes template validation in the full repo-state validation path.
- Missing `docs/templates/feature-prd.md` fails closed.
- Missing `docs/templates/slice.md` fails closed.
- Missing `docs/templates/chore.md` fails closed.
- Missing `docs/templates/improvement-chore.md` fails closed.
- Malformed Feature PRD sections fail closed with a clear template-specific message.
- Missing Slice clean-code evidence fails closed with a clear template-specific message.
- Missing Chore non-product work distinction fails closed with a clear template-specific message.
- Incomplete improvement chore metadata fails closed with clear messages for `hypothesis`, `metric`, `baseline`, and `evaluation_window`.

Accepted RED result before implementation:

- Tests fail because `bandit validate` currently validates config, event log, and work items only.
- Failure proves full validation must include required template checks.

## Bootstrap Gaps

- Final Test Writer role is not implemented as a separate agent; Codex PM is recording the test design manually.
- CodeRabbit and Qwen review gates are unavailable at this stage and must be recorded as `bootstrap_gap` before landing.
- Artifact creation commands do not exist yet, so tests may prepare temp repo template files through test helpers until the CLI can create them.

## Stage 2 Status

Current verdict: `pass`

Reason: test design, failing test files, and RED command output are recorded
before production implementation.

## RED Run Results

Date: 2026-05-24.

Command:

```sh
npm test
```

Result: failed as expected with exit code `1`.

Summary:

- 21 tests ran.
- 11 tests passed.
- 10 tests failed.
- `test/templates.test.mjs` failed because `docs/templates/feature-prd.md` is missing.
- `test/validate.test.mjs` failed because `docs/templates/**` is missing and `bandit validate` still exits `0` for missing or malformed templates.

This is the accepted RED state for `BANDIT-002`: the tests now require real
template artifacts and fail-closed validation behavior before production
implementation starts.
