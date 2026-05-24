# BANDIT-002: Work Artifact Templates And Validation

## Status

Closeout evidence complete; safe-to-land bootstrap verdict recorded.

## Goal

Create the first repo-native work artifact contract for Bandit by adding explicit Feature PRD, Slice, Chore, and retrospective-derived improvement chore templates, then teach validation to fail closed when those template contracts are missing or malformed.

This slice makes Phase 2 executable without building the full PRD-to-work decomposition workflow yet.

## Scope

- Add versioned templates for:
  - Feature PRD artifacts.
  - Slice work artifacts.
  - Chore work artifacts.
  - Retrospective-derived improvement chore metadata.
- Define the required sections and metadata each template must preserve.
- Extend validation so required templates are present, readable, and structurally complete.
- Add focused tests for valid templates and missing or malformed template refusal paths.
- Keep repo-native files as canonical and avoid generated indexes or UI-owned state.
- Record bootstrap gaps honestly in RED, implementation, review, landing, and retrospective evidence.

## Out Of Scope

- A PRD-to-work decomposition command.
- Automatic creation of PRDs, slices, or chores from CLI prompts.
- JSON schema generation for every artifact.
- SQLite state index.
- Workflow Cockpit.
- Smell Trigger Catalog implementation.
- Routing decision artifacts.
- CodeRabbit automation.
- Local Qwen adversarial gate.
- Landing Agent.
- UAT approval artifact.
- Auto-landing or branch/PR orchestration.
- Retrospective command generation.

## Acceptance Criteria

1. The repository contains explicit templates for Feature PRD, Slice, Chore, and retrospective-derived improvement chore artifacts.
2. The Feature PRD template includes fields for problem, user, goals, non-goals, stories or workflows, acceptance criteria, out-of-scope boundaries, test or verification strategy, and decomposition notes.
3. The Slice template includes fields for goal, scope, out of scope, acceptance criteria, test plan, `CLEAN_CODE.md` read evidence, stage-rubric checklist, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator input status.
4. The Chore template distinguishes non-product maintenance or improvement work from feature slices and includes origin, scope, acceptance criteria, verification plan, expected files, required evidence, and operator input status.
5. The retrospective-derived improvement chore metadata includes source metadata, lesson, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome fields compatible with `docs/improvement/retrospective-chore-schema.md`.
6. `bandit validate` fails closed with clear messages when a required template is missing.
7. `bandit validate` fails closed with clear messages when a required template omits required sections or metadata.
8. `bandit validate` passes with the committed templates and existing Bandit state.
9. Tests cover successful template validation and representative missing or malformed template refusal paths.
10. The implementation does not introduce hidden canonical state, SQLite authority, generated template truth, or cockpit-owned state.
11. The implementation remains small enough that a future PRD-to-work command can reuse the template contract without first untangling mixed orchestration logic.

## Test Plan

- Start with tests before production implementation.
- Add tests for template validation behavior:
  - valid committed template set passes;
  - missing Feature PRD template fails with a clear message;
  - missing Slice template fails with a clear message;
  - missing Chore template fails with a clear message;
  - missing improvement chore metadata fails with a clear message;
  - malformed required sections fail with clear messages.
- Add or update `bandit validate` tests so template validation is part of full repo-state validation.
- Keep assertions focused on behavior and contract requirements rather than incidental formatting.
- Record RED evidence before production implementation.
- Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check` before landing.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The spec and acceptance criteria make clean-code compliance evaluable through small surface area, explicit state, no hidden authority, readable validation paths, failure clarity, locality, testable behavior, and improvement capture.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria. |
| Small surface area | Diff contains only templates, validation code, tests, and required evidence/context updates. |
| Simple design | No PRD decomposition engine, UI, database, or broad schema framework in this slice. |
| Explicit state | Template contracts live in named repo files and validation requirements are visible in code. |
| No hidden authority | Repo-native artifacts remain canonical; indexes, generated files, and UI state are not introduced. |
| Testable behavior | Template success and refusal paths are covered by tests or recorded bootstrap gaps. |
| Readable flow | Validation paths and error messages are understandable without chat context. |
| Locality | Template validation logic is grouped with state validation, not scattered across commands. |
| Failure clarity | Missing and malformed templates fail closed with clear messages. |
| No role erosion | Codex PM owns routing; Test Writer and implementation evidence remain distinct. |
| Improvement capture | Any material workflow lesson becomes a tagged chore or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 2 and `BANDIT-002` as the active next work. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, escalation plan, and operator input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `test/templates.test.mjs` and `test/validate.test.mjs` encode the template contract and fail closed against the current missing implementation; RED command output is recorded in `docs/work/BANDIT-002/red-evidence.md`. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `docs/work/BANDIT-002/implementation-evidence.md` maps implementation to acceptance criteria, records clean-code self-check, and lists passing local verification. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | `docs/work/BANDIT-002/review-evidence.md` records manual PM review and unavailable CodeRabbit/Qwen gates as bootstrap gaps. |
| Stage 5: Landing And UAT | `pass` | `docs/work/BANDIT-002/landing-verdict.md` records a safe-to-land bootstrap verdict; UAT is `not_applicable` because this is workflow artifact infrastructure, not a user-facing feature slice. |
| Stage 6: Retrospective And Improvement Capture | `pass` | `docs/work/BANDIT-002/retrospective.md` records lessons and durable dispositions. |

## Bootstrap Gaps

- Bandit work-item creation command does not exist yet.
- PRD-to-work decomposition command does not exist yet.
- Artifact creation commands do not exist yet.
- Final JSON schema strategy does not exist yet.
- CodeRabbit pre-landing loop is not automated yet.
- Local Qwen adversarial gate is not implemented yet.
- Landing Agent is not implemented yet.
- UAT artifact is not implemented yet.
- Heartbeat chore-agent is not implemented yet.
- Workflow Cockpit is not implemented yet.

These are accepted bootstrap gaps for this work item only if replacement manual evidence is recorded honestly.

## Required Operator Input

None before test design or implementation starts.

Repo artifacts already define the required product direction for this slice: CLI authority first, repo-native artifacts as canonical, TypeScript/Node as the implementation default, retrospective-derived chores as measurable improvement work, and decomposition command behavior deferred until the template contract exists.

## Expected Files

Likely implementation files:

- `docs/templates/feature-prd.md`
- `docs/templates/slice.md`
- `docs/templates/chore.md`
- `docs/templates/improvement-chore.md`
- `src/state/templates.ts`
- `src/commands/validate.ts`
- focused test files under `test/`

Likely evidence files:

- `docs/work/BANDIT-002/red-evidence.md`
- `docs/work/BANDIT-002/implementation-evidence.md`
- `docs/work/BANDIT-002/review-evidence.md`
- `docs/work/BANDIT-002/landing-verdict.md`
- `docs/work/BANDIT-002/retrospective.md`

The final implementation may adjust file names if tests and local structure prove a simpler pattern, but it must preserve this brief's acceptance criteria and source-of-truth boundaries.

## First Implementation Order

1. Write RED evidence mapping acceptance criteria to tests.
2. Add failing tests for template discovery and required-section validation.
3. Add the minimal template files needed to express the contract.
4. Implement template validation as a small state-validation module.
5. Wire template validation into `bandit validate`.
6. Run focused tests and confirm RED-to-green behavior.
7. Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check`.
8. Produce implementation evidence, clean-code check, review-gap evidence, landing verdict, retrospective, and updated `CURRENT_CONTEXT.md`.

## Smell Triggers And Escalation Plan

- Hidden canonical state outside repo artifacts: blocker; repair before landing.
- Template requirements stored only in tests or comments: blocker; requirements must be explicit and maintainable.
- PRD-to-work command implemented before template contract is stable: blocker unless a new brief revises scope.
- JSON schema framework introduced before repeated validation complexity exists: likely needless complexity; treat as blocker unless justified by concrete evidence.
- Weak refusal paths for missing or malformed templates: blocker.
- Production implementation before tests or explicit bootstrap gap: blocker.
- Large mixed orchestration functions: blocker or `needs-repair` under `CLEAN_CODE.md`.
- Review gate unavailable without explicit `bootstrap_gap` evidence: blocker until recorded.

Codex PM owns these routing and escalation decisions. No operator input is needed for routine code-safety routing in this slice.
