# BANDIT-002 Implementation Evidence

## Scope

This evidence covers Stage 3: Implementation Clean-Code Rubric for Work Artifact Templates And Validation.

## Implementation Summary

- Added repo-native templates for Feature PRD, Slice, Chore, and retrospective-derived improvement chore artifacts under `docs/templates/`.
- Added `src/state/templates.ts` to validate required template presence and required sections or metadata.
- Wired template validation into `bandit validate` through `src/commands/validate.ts`.
- Kept canonical state in repo-native files only; no generated index, SQLite authority, or cockpit state was introduced.

## Acceptance Criteria Mapping

| Acceptance Criteria | Evidence |
|---|---|
| Explicit templates exist for Feature PRD, Slice, Chore, and retrospective-derived improvement chore artifacts | `docs/templates/feature-prd.md`, `docs/templates/slice.md`, `docs/templates/chore.md`, and `docs/templates/improvement-chore.md` were added. |
| Feature PRD required sections are preserved | `test/templates.test.mjs` and `src/state/templates.ts` require problem, user, goals, non-goals, stories or workflows, acceptance criteria, out-of-scope boundaries, test or verification strategy, and decomposition notes. |
| Slice required sections are preserved | `test/templates.test.mjs` and `src/state/templates.ts` require goal, scope, out of scope, acceptance criteria, test plan, `CLEAN_CODE.md` read evidence, stage-rubric checklist, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator input status. |
| Chore required sections are preserved | `test/templates.test.mjs` and `src/state/templates.ts` require non-product work, origin, scope, acceptance criteria, verification plan, expected files, required evidence, and operator input status. |
| Improvement chore metadata is compatible with the schema | `docs/templates/improvement-chore.md` and validator requirements preserve source metadata, lesson, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome. |
| Missing templates fail closed | `test/validate.test.mjs` covers each required template path and expects `Missing required template: <path>`. |
| Malformed templates fail closed | `test/validate.test.mjs` covers representative malformed Feature PRD, Slice, Chore, and improvement chore templates. |
| `bandit validate` passes with committed templates and existing state | `npm run bandit -- validate` passed on 2026-05-24. |
| Tests cover success and refusal paths | `npm test` passed with 21 tests on 2026-05-24. |
| No hidden canonical state introduced | Implementation reads `docs/templates/**` directly and performs validation in `src/state/templates.ts`. |
| Implementation remains small and reusable | Template validation is isolated from future PRD-to-work command behavior. |

## Verification Run

Date: 2026-05-24.

| Command | Result |
|---|---|
| `npm test` | `pass` - 21 tests passed. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - `Bandit state is valid.` |
| `git diff --check` | `pass`. |

## Clean-Code Self-Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation maps directly to the `BANDIT-002` acceptance criteria. |
| Small surface area | `pass` | Diff is limited to templates, template validation, validation wiring, tests, and evidence/context updates. |
| Simple design | `pass` | Uses a small contract table and direct file reads; no schema framework, decomposition engine, database, or UI. |
| Explicit state | `pass` | Template contracts live in named repo files and validator requirements are visible in code. |
| No hidden authority | `pass` | Repo-native template files are canonical. |
| Testable behavior | `pass` | Success and missing or malformed refusal paths are covered by tests. |
| Readable flow | `pass` | `bandit validate` delegates template checks to `validateTemplates`. |
| Locality | `pass` | Template validation logic is grouped in `src/state/templates.ts`. |
| Failure clarity | `pass` | Missing and malformed template errors name the affected path and requirement. |
| No role erosion | `pass` | Test evidence remains recorded separately; Codex PM owns routing and clean-code evaluation. |
| Improvement capture | `not_applicable` | No material workflow lesson emerged during implementation; retrospective still required before closeout. |

## Bootstrap Gaps

- CodeRabbit pre-landing loop is not automated yet.
- Local Qwen adversarial gate is not implemented yet.
- Landing Agent is not implemented yet.
- UAT artifact is not implemented yet; this slice is workflow artifact infrastructure, not a user-facing feature UAT step.
