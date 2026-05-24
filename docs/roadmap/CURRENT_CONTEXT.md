# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-006` landed as final implementation source head `61279b0ffc9bade9e4eda1ee0b59e1874283a01b`. `docs/work/BANDIT-006/landing-action.md` records the concrete landing action; `retrospective.md` records lessons and dispositions; review evidence, landing verdict, local Qwen timeout evidence, and roadmap context are closed out.

**Last completed milestone:** `BANDIT-006` delivered the first Phase 4 local Qwen baseline reviewer gate substrate.

**Current next action:** Create the next Phase 4 bootstrap work item, `BANDIT-007`, for CodeRabbit state capture / pre-landing CodeRabbit evidence. Do not begin implementation until the `BANDIT-007` brief and RED evidence are created from repo artifacts.

## Active Work

**Active work item:** none. `BANDIT-006` is landed and closed out.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen Baseline Reviewer Gate.

**Expected next deliverable:** First executable artifact for the next Phase 4 review gate gap:

- `docs/work/BANDIT-007/brief.md` for CodeRabbit state capture / pre-landing CodeRabbit evidence;
- `docs/work/BANDIT-007/red-evidence.md` before production implementation;
- context updates that keep Phase 4 source-of-truth status clear.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`. `docs/work/BANDIT-004/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict and landing evidence; `review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps, and improvement dispositions. BANDIT-005 landed as commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/brief.md`, `red-evidence.md`, `implementation-evidence.md`, `review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the complete slice evidence. BANDIT-006 landed as final implementation source head `61279b0ffc9bade9e4eda1ee0b59e1874283a01b`; `docs/work/BANDIT-006/brief.md`, `red-evidence.md`, `implementation-evidence.md`, `local-qwen-review.md`, `review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the complete slice evidence.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No CodeRabbit pre-landing loop.
- Local Qwen gate substrate exists, but the live local 35B Qwen review timed
  out during `BANDIT-006`; timeout behavior is recorded as an explicit
  bootstrap gap, not as a pass.
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

BANDIT-007 CodeRabbit state capture / pre-landing CodeRabbit evidence.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing verdict contracts, source-drift checks, validation, and `bandit land-check <work-item-id>`. `BANDIT-006` added the local Qwen baseline reviewer profile/evidence/command substrate and recorded the live runtime timeout as a bootstrap gap.

The next step is to create the `BANDIT-007` brief for the next Phase 4 gap: CodeRabbit state capture / pre-landing CodeRabbit evidence. Use `AGENTS.md`, `CONTEXT.md`, this file, `ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/plans/V0_PLAN.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `.bandit/policy/smell-triggers.json`, all `docs/work/BANDIT-006/*` artifacts, and Phase 4 evidence files from `BANDIT-005`.

Keep `BANDIT-007` narrow. It should not build final Landing Agent behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing, automated review repair, or paid-model reviewer routing. If live CodeRabbit CLI automation is unavailable during bootstrap, record a precise bootstrap gap and define the repo-native CodeRabbit state artifact that later automation will fill.

## Required Operator Input

None before creating the `BANDIT-007` brief and RED evidence.
