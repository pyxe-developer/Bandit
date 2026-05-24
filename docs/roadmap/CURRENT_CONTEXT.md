# Current Context

## Status

**Phase:** 0 - Foundation.

**State:** Founding docs exist. Implementation has not started.

**Last completed milestone:** Bootstrap methodology committed in `ede3fd0`.

**Current next action:** Create the first bootstrap work item for Phase 1: Repo-Native State And CLI Skeleton.

## Active Work

**Active work item:** none yet.

**Planned first work item:** `BANDIT-001` - Repo-Native State And CLI Skeleton.

**Expected first deliverable:** A bootstrap work item brief with acceptance criteria, test strategy, explicit missing gates, and initial implementation scope for:

- `bandit init`
- `.bandit/config.toml`
- event JSONL writer
- `bandit validate`
- `bandit list`
- `bandit show`

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit CLI.
- No Bandit work-item command.
- No Bandit event log.
- No Bandit validation command.
- No Qwen adversarial gate.
- No CodeRabbit pre-landing loop.
- No Landing Agent.
- No UAT artifact.
- No heartbeat chore-agent.
- No cockpit.

Bootstrap work must record these gaps honestly instead of pretending final gates ran.

## Context Guardrails

- Before each slice, read `CLEAN_CODE.md`.
- Before writing code, create or update the current work item brief.
- Before landing any slice, record whether it complies with `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`.
- After each completed step, update this file if the next action changed.
- If Codex cannot answer “what is next?” from this file and `ROADMAP.md`, stop and repair context.
- The operator should not need to reconstruct status from chat.

## Next Step Details

Create `docs/work/BANDIT-001/brief.md` or the agreed bootstrap equivalent.

The brief should include:

- Goal.
- Scope.
- Out of scope.
- Acceptance criteria.
- Test plan.
- `CLEAN_CODE.md` read evidence.
- Clean-code landing rubric.
- Bootstrap gaps.
- Expected files.
- First implementation order.

Do not create detailed briefs for every future phase yet. Keep the roadmap high-level and create work-item detail only for the next executable step.
