# BANDIT-020: Work Item Create Command

## Status

Bootstrap-gap chore brief created on 2026-05-25 after `BANDIT-019` closeout.
RED evidence is recorded in `docs/work/BANDIT-020/red-evidence.md`.
Implementation evidence, review evidence, landing verdict,
landing action, retrospective, and gap-ledger closeout have not started.

## Goal

Convert `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` from an open bootstrap gap into a
durable CLI-owned command that creates one repo-native Bandit work item from an
explicit structured spec without requiring a Feature PRD decomposition.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
Bandit already has `draft-work` for PRD decomposition, but bootstrap-gap chores
and one-off workflow maintenance work are still created manually. This chore
adds the narrow creation surface needed before broader artifact creation,
heartbeat automation, coordination primitives, or cockpit work proceeds.

## Origin

- `AGENTS.md` requires open bootstrap gaps to become the work queue before
  unrelated feature, cockpit, or phase work proceeds.
- `docs/plans/BOOTSTRAP_METHODOLOGY.md` names work-item creation as an early
  bootstrap capability and requires repeated manual steps to become CLI
  commands.
- `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, and
  `docs/roadmap/ROADMAP.md` route
  `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` as the next open bootstrap gap.
- `docs/work/BANDIT-019/landing-action.md` and
  `docs/work/BANDIT-019/retrospective.md` record the previous chore as landed
  and closed out, so the slice boundary allows this brief.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-011
source_gap: BANDIT-GAP-WORK-ITEM-CREATE-COMMAND
source_artifacts:
  - AGENTS.md
  - CONTEXT.md
  - .bandit/bootstrap-gaps.json
  - docs/plans/BOOTSTRAP_METHODOLOGY.md
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-011/brief.md
  - docs/work/BANDIT-019/landing-action.md
  - docs/work/BANDIT-019/retrospective.md
lesson: Manual work-item creation has repeated across bootstrap-gap chores and now needs a CLI-owned path before broader automation can safely depend on it.
hypothesis: A narrow `bandit work-item create <spec-path>` command can allocate the next work-item ID, validate required brief fields, create exactly one work-item brief, append lifecycle evidence, and optionally link a bootstrap gap without making chat or manual filesystem edits authoritative.
metric: A new bootstrap-gap chore can be created by CLI from a structured spec with deterministic ID allocation, fail-closed validation, no overwrite behavior, and valid `bandit list`, `bandit show`, `bandit gaps list`, and `bandit validate` output.
baseline: Work items after PRD decomposition are created manually unless `draft-work` can consume a Feature PRD decomposition block.
expected_direction: Future bootstrap-gap chores and maintenance work use the work-item creation command before RED evidence starts.
evaluation_window: Evaluate during `BANDIT-020` closeout and the next open bootstrap-gap chore.
status: brief_created
outcome: pending

## Scope

- Add a CLI-owned work-item creation command for one work item from an explicit
  structured spec file.
- Support `slice`, `chore`, and `improvement_chore` work-item kinds using the
  existing brief shapes and required metadata.
- Allocate the next work-item ID from `.bandit/config.toml` and existing
  `docs/work/<ID>/` directories.
- Validate all required brief fields before writing any files.
- Refuse to overwrite existing work-item directories or briefs.
- Write `docs/work/<ID>/brief.md` with a well-formed ID-bearing H1 and status
  section that existing `list`, `show`, and `validate` commands can read.
- Append a repo-native lifecycle event for the created work item.
- When a spec identifies an open bootstrap gap, update
  `.bandit/bootstrap-gaps.json` to link that gap to the new active chore and
  fail closed if the gap is missing, resolved, already linked, or not eligible.
- Preserve `draft-work` behavior for Feature PRD decomposition.
- Keep broader artifact creation, RED evidence creation, review evidence
  generation, landing, coordination primitives, and cockpit behavior out of
  this command.

## Out Of Scope

- Generating high-quality specs from vague prompts or chat context.
- Creating RED evidence, implementation evidence, review evidence, landing
  verdicts, landing actions, retrospectives, or arbitrary artifacts.
- Replacing `draft-work` for Feature PRD decomposition.
- Creating multiple work items in one command.
- Implementing the Phase 6 coordination state machine or heartbeat chore-agent.
- Changing product UAT, CodeRabbit, Local Qwen, escalated-review, review
  subject hash, Landing Agent, or remote PR merge behavior.
- Starting the next bootstrap-gap chore before `BANDIT-020` lands and closes.

## Acceptance Criteria

1. RED evidence demonstrates that no general CLI-owned work-item creation
   command exists outside `draft-work` Feature PRD decomposition.
2. The CLI exposes `bandit work-item create <spec-path>` or an equally narrow
   repo-native work-item creation surface selected during RED evidence.
3. The command creates exactly one work-item brief from explicit structured
   input and never relies on chat context or terminal scrollback as authority.
4. The command supports `slice`, `chore`, and `improvement_chore` required
   fields with validation aligned to existing templates.
5. The command allocates the next ID deterministically from existing work-item
   directories and the configured work-item prefix.
6. The command refuses malformed specs, unsupported kinds, missing required
   fields, missing config, invalid repo paths, already occupied output paths,
   and non-open or already linked bootstrap gaps before writing partial output.
7. For bootstrap-gap specs, the command links the gap as an active chore in
   `.bandit/bootstrap-gaps.json` and leaves queued later gaps unchanged.
8. Created work items are readable by `bandit list`, `bandit show <ID>`, and
   `bandit validate`.
9. Existing `draft-work`, validation, bootstrap-gap, review, landing, UAT, and
   review-subject hash behavior continue to pass.
10. Focused tests cover successful slice, chore, improvement-chore, and
    bootstrap-gap creation, plus malformed spec, overwrite, missing config,
    invalid path, unsupported kind, and ineligible gap refusal paths.
11. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, focused
    work-item creation command checks, `npm run bandit -- land-check
    BANDIT-020`, `npm run bandit -- gaps list`, and `git diff --check` pass
    before landing.
12. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in `test/work-item-create.test.mjs` or the nearest
  existing work-item/draft-work test file for:
  - missing general work-item creation command;
  - successful slice, chore, and improvement-chore creation from a spec;
  - bootstrap-gap linking to an active chore;
  - deterministic ID allocation;
  - malformed spec and unsupported kind refusal;
  - missing required fields refusal;
  - occupied output path refusal;
  - missing config refusal;
  - invalid spec path outside the repository refusal;
  - ineligible bootstrap gap refusal.
- Run focused RED tests and record failing output in
  `docs/work/BANDIT-020/red-evidence.md` before production implementation.
- Implement the narrowest command, parser, renderer reuse, ledger update, and
  lifecycle event path that satisfy the acceptance criteria.
- Run focused and full verification, including `npm test`,
  `npm run typecheck`, `npm run bandit -- validate`, representative
  work-item creation command checks, `npm run bandit -- land-check
  BANDIT-020`, `npm run bandit -- gaps list`, and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-25 before creating this work item. The
acceptance criteria make clean-code compliance evaluable through narrow scope,
explicit source-of-truth boundaries, deterministic validation, no-overwrite
behavior, and preserved role boundaries between Codex PM, Test Writer, Writer,
reviewers, Landing Agent, and operator-owned product or policy decisions.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/bootstrap-gaps.json`, and `bandit gaps list` identify `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` as active `BANDIT-020` work. `BANDIT-019` has landing-action evidence, retrospective closeout, and a resolved gap-ledger disposition. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-020/red-evidence.md` records focused tests in `test/work-item-create.test.mjs` failing because `bandit work-item create <spec-path>` does not exist yet. |
| Stage 3: Implementation Clean-Code Rubric | `pending` | Implementation must be narrow, deterministic, and fail closed before writing partial output. |
| Stage 4: Review And Cross-Model Gates | `pending` | Future review evidence must record `review_subject_hash`. |
| Stage 5: Landing And UAT | `pending` | UAT is not required for this non-product workflow-infrastructure chore. Landing verdict and landing action evidence are required before the next gap chore can begin. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Hidden authority:** Work-item identity and creation evidence must come from
  repo-native files and CLI output, not chat or dashboard state.
- **Parser/validator mismatch:** The spec parser, brief renderer, templates,
  and validator must share the same required fields and supported kinds.
- **Weak refusal path:** Malformed specs, unsafe paths, occupied directories,
  missing config, and ineligible bootstrap gaps must fail closed before writes.
- **Over-broad automation:** The command must not create downstream evidence,
  start implementation, close gaps, or trigger landing.
- **Source-of-truth drift:** Bootstrap-gap ledger updates must be explicit,
  minimal, and validated with `bandit gaps list` and `bandit validate`.
- **Role erosion:** Codex PM owns command shape and routing from repo policy,
  but product UAT, policy changes, business tradeoffs, and explicit cost/risk
  overrides remain operator-owned.
- **Escalation plan:** Run Local Qwen and configured Stage 4 evidence before
  landing. Use `review_subject_hash` in aggregate review evidence.

## Bootstrap Gaps

- This chore resolves the missing general Bandit work-item creation command.
- No general artifact creation command exists yet and remains a later queued
  bootstrap gap.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.
- Live PR-backed CodeRabbit may remain unavailable for this local-record
  bootstrap chore if no PR exists; record explicit replacement evidence rather
  than claiming a CodeRabbit pass.

## Expected Files

- `docs/work/BANDIT-020/brief.md`
- `docs/work/BANDIT-020/red-evidence.md`
- `docs/work/BANDIT-020/implementation-evidence.md`
- `docs/work/BANDIT-020/review-evidence.md`
- `docs/work/BANDIT-020/local-qwen-review.md`
- `docs/work/BANDIT-020/escalated-review.md` when routing requires it or
  records `not_applicable`
- `docs/work/BANDIT-020/landing-verdict.md`
- `docs/work/BANDIT-020/landing-action.md`
- `docs/work/BANDIT-020/retrospective.md`
- `.bandit/bootstrap-gaps.json`
- `src/commands/work-item-create.ts` or the nearest selected command module.
- `src/state/work-item-create-spec.ts`, `src/state/work-items.ts`, or the
  nearest existing state/rendering module.
- `src/cli.ts`
- `test/work-item-create.test.mjs` or focused additions to
  `test/work-items.test.mjs` and `test/draft-work.test.mjs`.
- Any needed template/spec documentation under `docs/templates/`.
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect existing `draft-work`, work-item reader, template, lifecycle event,
   bootstrap-gap ledger, CLI dispatch, and validation patterns.
2. Add focused RED tests for the missing command and refusal paths.
3. Run focused RED tests and record evidence.
4. Extract or reuse brief rendering and ID allocation helpers without changing
   `draft-work` behavior.
5. Implement the command parser and spec validation with all required fields
   checked before writes.
6. Implement one-work-item creation, lifecycle event append, and optional
   bootstrap-gap active-chore linking.
7. Run focused and full verification.
8. Record implementation, review, landing, retrospective, gap-ledger, and
   context evidence.

## Required Evidence

- `docs/work/BANDIT-020/red-evidence.md`
- `docs/work/BANDIT-020/implementation-evidence.md`
- `docs/work/BANDIT-020/review-evidence.md` with `review_subject_hash`
- `docs/work/BANDIT-020/local-qwen-review.md`
- `docs/work/BANDIT-020/escalated-review.md` when routing requires a configured
  reviewer, replacement evidence, or `not_applicable` disposition
- `docs/work/BANDIT-020/landing-verdict.md`
- `docs/work/BANDIT-020/landing-action.md`
- `docs/work/BANDIT-020/retrospective.md`
- Updated `.bandit/bootstrap-gaps.json`
- Updated `docs/roadmap/CURRENT_CONTEXT.md`
- Updated `docs/roadmap/ROADMAP.md`

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the routing decision: create the work-item creation
bootstrap-gap chore now. Operator input is required only if implementation
discovers a product-direction, policy-change, business-tradeoff, explicit
cost/risk override, or genuinely ambiguous scope question that repo artifacts
cannot answer.
