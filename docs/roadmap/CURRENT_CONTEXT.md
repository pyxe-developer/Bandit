# Current Context

## Status

**Phase:** 1 - Repo-Native CLI Skeleton.

**State:** `BANDIT-001` brief exists. Implementation has not started.

**Last completed milestone:** First bootstrap work item brief created for `BANDIT-001` - Repo-Native State And CLI Skeleton.

**Current next action:** Begin `BANDIT-001` test design and RED evidence before production implementation.

## Active Work

**Active work item:** `BANDIT-001` - Repo-Native State And CLI Skeleton.

**Work item brief:** `docs/work/BANDIT-001/brief.md`.

**Expected next deliverable:** Test design and RED evidence for:

- `bandit init`
- `.bandit/config.toml`
- event JSONL writer
- `bandit validate`
- `bandit list`
- `bandit show`

The work item brief records that no operator-owned input is required before test design or implementation starts.

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

Use `docs/work/BANDIT-001/brief.md` as the active contract.

Next executable step:

1. Confirm TypeScript/Node package and test tooling.
2. Write focused tests for `bandit init`, config creation, and event JSONL append behavior.
3. Record RED evidence before production implementation unless a specific path requires a documented bootstrap gap.

Do not implement production CLI behavior before test design and RED evidence exist.
