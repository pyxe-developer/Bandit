# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-005` has Stage 1 brief evidence, Stage 2 RED evidence, Stage 3 GREEN implementation evidence, Stage 4 review evidence, and a Stage 5 `safe-to-land` bootstrap verdict. `npm run bandit -- land-check BANDIT-005` passes. Retrospective and landing action remain pending.

**Last completed milestone:** `BANDIT-004` delivered repo-native manager-owned routing decisions and the Smell Trigger Catalog seed.

**Current next action:** Perform the `BANDIT-005` bootstrap landing action and closeout: create the focused landing commit, record `docs/work/BANDIT-005/landing-action.md` with landing evidence, create `docs/work/BANDIT-005/retrospective.md`, rerun required verification, and update roadmap context. Do not begin the next slice until this is complete.

## Active Work

**Active work item:** `BANDIT-005` - Pre-Landing Review Loop.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger Catalog.

**Expected next deliverable:** Landing action evidence and retrospective closeout for the first Phase 4 capability:

- a pre-landing review loop artifact contract;
- CodeRabbit state capture or an honest bootstrap gap;
- local Qwen adversarial review state or an honest bootstrap gap;
- escalated reviewer placeholder evidence when smell triggers require it;
- stale review/source-drift checks;
- a Landing Verdict contract that cannot be marked safe-to-land without required evidence.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`. `docs/work/BANDIT-004/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict and landing evidence; `review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps, and improvement dispositions. `docs/work/BANDIT-005/brief.md` now records Stage 1 scope, acceptance criteria, clean-code read evidence, stage rubrics, bootstrap gaps, expected files, smell triggers, escalation plan, and operator-input status. `docs/work/BANDIT-005/red-evidence.md` records Stage 2 RED evidence with 14 focused tests in `test/landing-gates.test.mjs`; the RED run passed 1 historical-compatibility test and failed 13 missing-implementation tests. `docs/work/BANDIT-005/implementation-evidence.md` records Stage 3 GREEN implementation, focused/full verification, and clean-code self-check. `docs/work/BANDIT-005/review-evidence.md` records Stage 4 manual PM review, explicit bootstrap gaps, and one in-slice repair. `docs/work/BANDIT-005/landing-verdict.md` records the Stage 5 `safe-to-land` bootstrap verdict, and `npm run bandit -- land-check BANDIT-005` passes.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No CodeRabbit pre-landing loop.
- No Qwen adversarial gate.
- No escalated adversarial review gate.
- No Landing Agent.
- No general artifact creation command outside explicit PRD draft-work.
- No UAT artifact.
- No heartbeat chore-agent.
- No cockpit.

Bootstrap work must record these gaps honestly instead of pretending final gates ran.

## Context Guardrails

- In a cold session, invoke `$bandit` or type `/bandit` to restore context from repo artifacts.
- `CONTEXT.md` is a required first-read file for cold sessions.
- Before each slice, read `CLEAN_CODE.md`.
- Before writing code, create or update the current work item brief.
- If required operator-owned input is missing, call it out directly and halt the blocked action.
- Before landing any slice, record whether it complies with `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`.
- After each completed step, update this file if the next action changed.
- If the Bandit skill or operating vocabulary changes, update `CONTEXT.md` in the same turn.
- If Codex cannot answer “what is next?” from this file and `ROADMAP.md`, stop and repair context.
- The operator should not need to reconstruct status from chat.

## Next Step Details

BANDIT-005 ready-to-land closeout.

BANDIT-004 completed Phase 3 by adding policy and artifact shape for manager-owned routing decisions. Phase 4 starts with the pre-landing review loop because Bandit still records CodeRabbit, Qwen, escalated review, and Landing Agent gates as bootstrap gaps.

The next step is the bootstrap landing action and retrospective for `BANDIT-005`. Use `docs/work/BANDIT-005/brief.md`, `docs/work/BANDIT-005/red-evidence.md`, `docs/work/BANDIT-005/implementation-evidence.md`, `docs/work/BANDIT-005/review-evidence.md`, `docs/work/BANDIT-005/landing-verdict.md`, `docs/work/BANDIT-005/routing-decision.md`, `docs/plans/V0_PLAN.md`, `CLEAN_CODE.md`, and `docs/verification/STAGE_RUBRICS.md`.

The implementation is already narrow: it added review evidence and landing verdict templates, parser/validator helpers, explicit source-drift behavior, validation for new-contract artifacts, and `bandit land-check <work-item-id>` while preserving historical compatibility. Landing closeout must not build CodeRabbit automation, Qwen runtime setup, paid reviewer routing, final Landing Agent behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing, or automated review repair in this slice.

## Required Operator Input

None before the bootstrap landing action and retrospective closeout.
