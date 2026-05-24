# Current Context

## Status

**Phase:** 2 - Work Artifacts.

**State:** `BANDIT-001` implemented, verified, and documented with bootstrap evidence.

**Last completed milestone:** `BANDIT-001` delivered the repo-native CLI skeleton.

**Current next action:** Create the next bootstrap work item brief for Phase 2: PRD, Slice, And Chore Artifacts.

## Active Work

**Active work item:** none.

**Completed work item:** `BANDIT-001` - Repo-Native State And CLI Skeleton.

**Expected next deliverable:** A bootstrap work item brief for Phase 2 covering:

- Feature PRD template.
- Slice template.
- Chore template.
- Retrospective-derived chore metadata.
- PRD-to-work draft command or equivalent next thin slice.

The next brief must state whether any operator-owned input is required before implementation starts.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No PRD, slice, or chore artifact templates.
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

Create the next work item brief, likely `BANDIT-002`, for the first Phase 2 slice.

The brief should keep the slice thin. Prefer one artifact family or one creation command over building the whole Phase 2 surface at once.

Do not write Phase 2 production code before the new brief and RED evidence exist.
