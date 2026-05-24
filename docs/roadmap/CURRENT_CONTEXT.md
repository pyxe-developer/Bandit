# Current Context

## Status

**Phase:** 2 - Work Artifacts.

**State:** `BANDIT-002` closeout evidence complete; safe-to-land bootstrap verdict recorded.

**Last completed milestone:** `BANDIT-002` delivered work artifact templates and fail-closed template validation.

**Current next action:** Create the `BANDIT-003` brief for a PRD-to-work draft command.

## Active Work

**Active work item:** none. Next work item to create: `BANDIT-003` - PRD-To-Work Draft Command.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation.

**Expected next deliverable:** `docs/work/BANDIT-003/brief.md`, scoped to the remaining Phase 2 capability:

- a PRD-to-work decomposition or draft command;
- trackable slice and chore artifact output;
- chore origin metadata reuse, including retrospective-derived fields;
- fail-closed validation and refusal paths for generated or drafted work.

BANDIT-002 is safe to land as the Phase 2 template-validation baseline. The next step is a brief only; do not implement PRD-to-work drafting before the BANDIT-003 brief records scope, acceptance criteria, test plan, clean-code read evidence, stage rubrics, bootstrap gaps, expected files, and implementation order.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No PRD-to-work decomposition or draft command.
- No artifact creation command for PRDs, slices, chores, or improvement chores.
- No Qwen adversarial gate.
- No CodeRabbit pre-landing loop.
- No Landing Agent.
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

Create the `BANDIT-003` brief for the PRD-to-work draft command.

BANDIT-002 delivered the template contract and validation baseline. V0 Phase 2 still needs the command path that can turn a Feature PRD into trackable slice and chore drafts without making generated artifacts a hidden source of truth.

Keep the next step to brief creation. Do not create detailed briefs for later phases yet.

## Required Operator Input

None before BANDIT-003 brief creation.
