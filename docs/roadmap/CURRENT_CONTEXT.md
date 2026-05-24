# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-005` landed as bootstrap implementation commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/landing-action.md` records the concrete landing action; `retrospective.md` records lessons and dispositions; review evidence, landing verdict, and roadmap context are closed out.

**Last completed milestone:** `BANDIT-005` delivered the first Phase 4 pre-landing review loop substrate.

**Current next action:** Create the next Phase 4 bootstrap work item brief for `BANDIT-006` - Local Qwen Baseline Reviewer Gate. Do not write implementation or RED evidence until the brief records scope, acceptance criteria, clean-code read evidence, stage rubrics, bootstrap gaps, expected files, routing decision, and operator-input status.

## Active Work

**Active work item:** none. `BANDIT-006` has not been created yet.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger Catalog; `BANDIT-005` - Pre-Landing Review Loop.

**Expected next deliverable:** A `BANDIT-006` work item brief for the next Phase 4 capability:

- a local Qwen baseline reviewer profile or explicit unavailable-runtime contract;
- a repo-native local Qwen review evidence artifact shape or extension of the existing review evidence contract;
- a narrow CLI path or documented bootstrap replacement for running and recording the baseline adversarial review;
- clear fail-closed behavior when the baseline reviewer is required but missing, stale, inconclusive, or unavailable without a recorded bootstrap gap;
- preservation of manager-owned routing and operator-input boundaries.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`. `docs/work/BANDIT-004/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict and landing evidence; `review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps, and improvement dispositions. BANDIT-005 landed as commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/brief.md`, `red-evidence.md`, `implementation-evidence.md`, `review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the complete slice evidence. `npm run bandit -- land-check BANDIT-005` passed at the landed implementation source head before closeout evidence was committed.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No CodeRabbit pre-landing loop.
- No executable local Qwen adversarial gate.
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

BANDIT-006 brief creation.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing verdict contracts, source-drift checks, validation, and `bandit land-check <work-item-id>`. Phase 4 still records CodeRabbit, local Qwen, escalated review, and Landing Agent gates as bootstrap gaps.

The next step is to create only the `BANDIT-006` brief for a local Qwen baseline reviewer gate. Use `AGENTS.md`, `CONTEXT.md`, this file, `ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/plans/V0_PLAN.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `.bandit/policy/smell-triggers.json`, and the `BANDIT-005` evidence files.

Keep `BANDIT-006` narrow. It should not build CodeRabbit automation, paid reviewer routing, final Landing Agent behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing, or automated review repair. If a local Qwen runtime or model path is unavailable, record that as an explicit bootstrap gap rather than asking the operator for routine technical routing.

## Required Operator Input

None before creating the `BANDIT-006` brief.
