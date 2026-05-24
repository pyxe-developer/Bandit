# BANDIT-003: PRD-To-Work Draft Command

## Status

Closeout evidence complete; safe-to-land bootstrap verdict recorded.

## Goal

Add the first deterministic PRD-to-work draft command so Bandit can turn an explicit Feature PRD decomposition into trackable Slice and Chore work item drafts under repo-native state.

This slice should make Phase 2 complete without pretending Bandit can infer product direction. The command drafts work from structured PRD decomposition notes, records source metadata, and fails closed when the PRD does not contain enough explicit information.

## Scope

- Add a CLI command: `bandit draft-work <feature-prd-path>`.
- Define the v0 structured draft contract inside a Feature PRD's `## Decomposition Notes` section.
- Prefer a fenced `bandit-work-draft` JSON block so parsing uses `JSON.parse` instead of free-text heuristics.
- Support draft item kinds for:
  - `slice`
  - `chore`
  - `improvement_chore`
- Allocate new work item IDs from `.bandit/config.toml` `work_item_prefix` and existing `docs/work/<ID>` directories.
- Render one `docs/work/<ID>/brief.md` file per draft item.
- Preserve the source PRD ID/path in every drafted work item.
- Reuse existing Slice and Chore template section contracts for generated draft briefs.
- Require Chore origin metadata, including retrospective-derived fields for `improvement_chore` items.
- Refuse missing, malformed, unsupported, incomplete, or ambiguous PRD draft input before writing files.
- Refuse overwrites and avoid partial writes when any planned output path is unsafe.
- Append lifecycle events for successfully drafted work items.
- Add focused tests for success paths and refusal paths.
- Keep repo-native files canonical; do not introduce SQLite, generated indexes, hidden app state, or cockpit-owned state.

## Out Of Scope

- Autonomous LLM-based PRD decomposition.
- Free-text planning heuristics that infer unstated slices or chores.
- General-purpose work item creation prompts unrelated to PRD decomposition.
- Editing or approving product direction in the PRD.
- Creating detailed briefs for future roadmap phases.
- JSON schema framework adoption beyond the minimal local validator this slice needs.
- SQLite state index.
- Workflow Cockpit.
- Smell Trigger Catalog implementation.
- Routing decision artifacts.
- CodeRabbit automation.
- Local Qwen adversarial gate.
- Landing Agent.
- UAT approval artifact.
- Auto-landing or branch/PR orchestration.

## Acceptance Criteria

1. The CLI exposes `bandit draft-work <feature-prd-path>` and prints a clear usage error when the PRD path is omitted.
2. The command reads `.bandit/config.toml` for the work item prefix and fails closed with the existing config error style when Bandit state is missing or malformed.
3. The command requires the Feature PRD to have an ID-bearing H1, required Feature PRD sections, and a `## Decomposition Notes` section.
4. The `## Decomposition Notes` section contains exactly one fenced `bandit-work-draft` JSON block with an `items` array.
5. Each draft item has a supported `kind`, title, goal or non-product-work statement, scope, acceptance criteria, verification/test plan, expected files, required evidence, operator input status, and source PRD metadata.
6. `slice` items render `docs/work/<ID>/brief.md` files containing the Slice template sections required by `docs/templates/slice.md`.
7. `chore` items render `docs/work/<ID>/brief.md` files containing the Chore template sections required by `docs/templates/chore.md`.
8. `improvement_chore` items render Chore work items and require origin metadata compatible with `docs/templates/improvement-chore.md`: source metadata, lesson, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome.
9. The command assigns deterministic sequential work item IDs by scanning existing `docs/work/<PREFIX>-NNN` directories and choosing the next available IDs without gaps caused by the current run.
10. The command refuses to overwrite existing work item directories or files.
11. The command validates every planned draft before writing anything; invalid input produces no partial files.
12. Successful command output lists created work item IDs and brief paths.
13. Successful command execution appends lifecycle events for created work item drafts.
14. Tests cover successful creation of at least one Slice and one Chore from a PRD draft block.
15. Tests cover successful creation of an `improvement_chore` with required retrospective-derived metadata.
16. Tests cover refusal paths for missing PRD path, missing PRD file, missing decomposition block, malformed JSON, unsupported item kind, missing required item fields, unsafe destination paths, and overwrite attempts.
17. `bandit validate` passes after valid draft work items are created.
18. The implementation does not introduce hidden canonical state, generated index authority, UI-owned state, or broad parser/framework complexity.

## Test Plan

- Start with tests before production implementation.
- Add `test/draft-work.test.mjs` or equivalent focused test coverage.
- Use temp repos through `test/helpers/bandit-cli.mjs`.
- Add PRD fixture helpers that write valid and invalid Feature PRDs.
- Cover success paths:
  - one PRD drafts a Slice and Chore with deterministic IDs;
  - one PRD drafts an improvement chore with required metadata;
  - created briefs include source PRD metadata and required template sections;
  - lifecycle events are appended for created draft work items;
  - `bandit validate` passes after draft creation.
- Cover refusal paths:
  - missing command argument;
  - missing PRD file;
  - malformed Feature PRD header or required sections;
  - missing `bandit-work-draft` block;
  - multiple draft blocks;
  - malformed JSON;
  - empty `items` array;
  - unsupported item kind;
  - missing required item fields;
  - incomplete `improvement_chore` metadata;
  - planned destination already exists;
  - any invalid planned draft prevents all writes.
- Keep assertions focused on behavior, file output, event output, and fail-closed messages rather than incidental Markdown formatting.
- Record RED evidence before production implementation.
- Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check` before landing.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The spec and acceptance criteria make clean-code compliance evaluable through small surface area, explicit state, no hidden authority, readable parsing and rendering paths, failure clarity, locality, testable behavior, and improvement capture.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria. |
| Small surface area | Diff contains only draft-command code, template contract updates, tests, and required evidence/context updates. |
| Simple design | Uses structured JSON draft input and small validators; no LLM decomposition engine, UI, database, or broad schema framework. |
| Explicit state | PRDs and drafted work items live in named repo files; lifecycle events remain visible in `.bandit/events.jsonl`. |
| No hidden authority | Repo-native artifacts remain canonical; indexes, generated files, and UI state are not introduced. |
| Testable behavior | Success, refusal, and no-partial-write paths are covered by tests or recorded bootstrap gaps. |
| Readable flow | Parsing, validation, ID allocation, rendering, writing, and event recording have clear boundaries. |
| Locality | PRD draft parsing/rendering logic is grouped near work item state logic and command orchestration stays thin. |
| Failure clarity | Missing, malformed, unsupported, incomplete, and unsafe draft inputs fail closed with clear messages. |
| No role erosion | The command drafts from explicit PRD input; it does not invent product scope or replace operator-owned product direction. |
| Improvement capture | Any material workflow lesson becomes a tagged chore or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Current Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 2 and `BANDIT-003` as the active next work after this brief is created. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, escalation plan, and operator input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-003/red-evidence.md` records RED evidence and `test/draft-work.test.mjs` fails for the expected missing `draft-work` command before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `docs/work/BANDIT-003/implementation-evidence.md` records passing focused tests, full verification, acceptance mapping, clean-code compliance, and the post-review prefix parser repair. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | `docs/work/BANDIT-003/review-evidence.md` records manual PM review, the repaired finding, and unavailable CodeRabbit/Qwen/escalation gates as bootstrap gaps. |
| Stage 5: Landing And UAT | `pass` | `docs/work/BANDIT-003/landing-verdict.md` records a safe-to-land bootstrap verdict; UAT is `not_applicable` because this is workflow infrastructure, not a user-facing feature slice. |
| Stage 6: Retrospective And Improvement Capture | `pass` | `docs/work/BANDIT-003/retrospective.md` records lessons and durable dispositions. |

## Bootstrap Gaps

- General work-item creation command outside explicit PRD draft-work does not exist yet.
- Final work-artifact creation commands for PRDs and standalone chores do not exist yet.
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

Repo artifacts already define the required product direction for this slice: CLI authority first, repo-native artifacts as canonical, TypeScript/Node as the implementation default, deterministic draft behavior, and no autonomous product-direction inference.

## Expected Files

Likely implementation files:

- `src/commands/draft-work.ts`
- `src/cli.ts`
- `src/state/feature-prds.ts` or `src/state/prd-drafts.ts`
- `src/state/work-items.ts`
- `src/state/events.ts`
- `docs/templates/feature-prd.md`
- focused test files under `test/`

Likely evidence files:

- `docs/work/BANDIT-003/red-evidence.md`
- `docs/work/BANDIT-003/implementation-evidence.md`
- `docs/work/BANDIT-003/review-evidence.md`
- `docs/work/BANDIT-003/landing-verdict.md`
- `docs/work/BANDIT-003/retrospective.md`

Context files expected to change:

- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

The final implementation may adjust file names if tests and local structure prove a simpler pattern, but it must preserve this brief's acceptance criteria and source-of-truth boundaries.

## First Implementation Order

1. Write RED evidence mapping acceptance criteria to tests.
2. Add failing tests for `bandit draft-work` usage, success output, rendered briefs, lifecycle events, and refusal paths.
3. Add a small PRD draft parser that validates the Feature PRD header, required sections, and fenced `bandit-work-draft` JSON block.
4. Add pure draft item validation and rendering helpers for Slice, Chore, and improvement chore outputs.
5. Add deterministic work item ID allocation with overwrite and no-partial-write preflight checks.
6. Wire the CLI command and lifecycle event recording.
7. Run focused tests and confirm RED-to-green behavior.
8. Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check`.
9. Produce implementation evidence, clean-code check, review-gap evidence, landing verdict, retrospective, and updated `CURRENT_CONTEXT.md`.

## Smell Triggers And Escalation Plan

- Command invents product scope not present in the PRD: blocker; fail closed and require PRD/product input instead.
- Free-text decomposition heuristics replace structured PRD input: blocker unless a future brief explicitly approves that policy.
- Generated or drafted work becomes canonical without repo-native files: blocker.
- Partial writes after validation failure: blocker.
- Existing work item directory overwrite: blocker.
- ID allocation ignores `.bandit/config.toml` or existing work directories: blocker.
- Chore or improvement chore output lacks origin, hypothesis, metric, baseline, or evaluation window metadata when required: blocker.
- Large mixed orchestration function that parses, validates, renders, writes, and records events without clear boundaries: blocker or `needs-repair` under `CLEAN_CODE.md`.
- JSON schema framework introduced before repeated validation complexity exists: likely needless complexity; treat as blocker unless justified by concrete evidence.
- Review gate unavailable without explicit `bootstrap_gap` evidence: blocker until recorded.

Codex PM owns these routing and escalation decisions. No operator input is needed for routine code-safety routing in this slice.

## Required Evidence

- `docs/work/BANDIT-003/red-evidence.md`
- `docs/work/BANDIT-003/implementation-evidence.md`
- `docs/work/BANDIT-003/review-evidence.md`
- `docs/work/BANDIT-003/landing-verdict.md`
- `docs/work/BANDIT-003/retrospective.md`
- Updated `docs/roadmap/CURRENT_CONTEXT.md` when the next action changes.

## Operator Input Status

No required operator-owned input is missing for RED evidence or implementation.

The command must refuse PRDs that lack explicit decomposition data instead of asking the operator routine technical routing questions or inferring product direction from prose.
