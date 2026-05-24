# Current Context

## Status

**Phase:** 2 - Work Artifacts.

**State:** `BANDIT-002` brief created; RED evidence not started.

**Last completed milestone:** `BANDIT-001` delivered the repo-native CLI skeleton.

**Current next action:** Create RED evidence and test design for `BANDIT-002`: Work Artifact Templates And Validation.

## Active Work

**Active work item:** `BANDIT-002` - Work Artifact Templates And Validation.

**Completed work item:** `BANDIT-001` - Repo-Native State And CLI Skeleton.

**Expected next deliverable:** `docs/work/BANDIT-002/red-evidence.md`, mapping the brief's acceptance criteria to failing tests for:

- Feature PRD template.
- Slice template.
- Chore template.
- Retrospective-derived chore metadata.
- Template validation refusal paths.

No production implementation should start before RED evidence exists or an explicit bootstrap gap is recorded.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No PRD, slice, chore, or improvement chore artifact templates.
- No template validation contract.
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

Create RED evidence and test design for `BANDIT-002`.

The brief keeps the slice thin by implementing artifact templates and validation before any PRD-to-work decomposition command.

Do not write Phase 2 production code before RED evidence exists.

## Required Operator Input

None before RED evidence or implementation starts.
