# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-005` has a Stage 1 brief and Stage 2 RED evidence. Production implementation has not started.

**Last completed milestone:** `BANDIT-004` delivered repo-native manager-owned routing decisions and the Smell Trigger Catalog seed.

**Current next action:** Begin GREEN implementation for Phase 4: Pre-Landing Review Loop. Start with the review evidence and landing verdict templates, parser/validator helpers, source-drift helper, and `bandit land-check <work-item-id>` command needed to satisfy `test/landing-gates.test.mjs`.

## Active Work

**Active work item:** `BANDIT-005` - Pre-Landing Review Loop.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger Catalog.

**Expected next deliverable:** Production implementation and `docs/work/BANDIT-005/implementation-evidence.md` for the first Phase 4 capability:

- a pre-landing review loop artifact contract;
- CodeRabbit state capture or an honest bootstrap gap;
- local Qwen adversarial review state or an honest bootstrap gap;
- escalated reviewer placeholder evidence when smell triggers require it;
- stale review/source-drift checks;
- a Landing Verdict contract that cannot be marked safe-to-land without required evidence.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`. `docs/work/BANDIT-004/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict and landing evidence; `review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps, and improvement dispositions. `docs/work/BANDIT-005/brief.md` now records Stage 1 scope, acceptance criteria, clean-code read evidence, stage rubrics, bootstrap gaps, expected files, smell triggers, escalation plan, and operator-input status. `docs/work/BANDIT-005/red-evidence.md` records Stage 2 RED evidence with 14 focused tests in `test/landing-gates.test.mjs`; the RED run passed 1 historical-compatibility test and failed 13 missing-implementation tests.

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

BANDIT-005 GREEN implementation.

BANDIT-004 completed Phase 3 by adding policy and artifact shape for manager-owned routing decisions. Phase 4 starts with the pre-landing review loop because Bandit still records CodeRabbit, Qwen, escalated review, and Landing Agent gates as bootstrap gaps.

The next step is Stage 3 implementation for `BANDIT-005`. Use `docs/work/BANDIT-005/brief.md`, `docs/work/BANDIT-005/red-evidence.md`, `docs/plans/V0_PLAN.md`, `CLEAN_CODE.md`, and `docs/verification/STAGE_RUBRICS.md`.

Keep the implementation narrow: add review evidence and landing verdict templates, parser/validator helpers, explicit source-drift behavior, validation for new-contract artifacts, and `bandit land-check <work-item-id>`. Preserve compatibility for historical work items that do not opt into the new contract. Do not build CodeRabbit automation, Qwen runtime setup, paid reviewer routing, final Landing Agent behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing, or automated review repair in this slice.

## Required Operator Input

None before GREEN implementation.
