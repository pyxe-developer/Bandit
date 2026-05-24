# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-010` is active as the Phase 4 bootstrap work item for the
escalated adversarial reviewer placeholder. `docs/work/BANDIT-010/brief.md`
records the Stage 1 contract. `BANDIT-009` remains the latest landed
implementation source head at `8634d256eb1409e7c31f5b9baf74223480745167`.

**Last completed milestone:** `BANDIT-009` repaired local Qwen full-packet
review reliability through direct local oMLX.

**Current next action:** Create RED evidence for `BANDIT-010` showing that a
work item requiring escalated adversarial review is not yet enforced by
`bandit land-check <work-item-id>`.

## Active Work

**Active work item:** `BANDIT-010` - Escalated Adversarial Reviewer Placeholder.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton;
`BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` -
PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger
Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen
Baseline Reviewer Gate; `BANDIT-007` - CodeRabbit State Capture; `BANDIT-008`
- Local Reviewer Runtime Drift Repair; `BANDIT-009` - Local Qwen Full-Packet
Reliability.

**Expected next deliverable:** RED evidence for the narrow escalated
adversarial reviewer placeholder contract. Keep it behind the established
baseline local Qwen gate and do not broaden into final Landing Agent behavior,
UAT artifacts, PR merge automation, live paid-model routing, workflow cockpit,
or SQLite indexing.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- CodeRabbit state capture substrate exists, but live CodeRabbit API, GitHub
  API, PR comment polling, repair orchestration, and rerun automation remain
  unavailable.
- Local Qwen gate substrate exists, and `BANDIT-009` repaired full-packet
  reliability by routing through direct local oMLX while preserving structured
  findings.
- No escalated adversarial review gate. This is now the next Phase 4 gap.
- No Landing Agent.
- No general artifact creation command outside explicit PRD draft-work.
- No UAT artifact.
- No heartbeat chore-agent.
- No cockpit.

Bootstrap work must record these gaps honestly instead of pretending final
gates ran.

## Context Guardrails

- In a cold session, invoke `$bandit` or type `/bandit` to restore context from repo artifacts.
- `CONTEXT.md` is a required first-read file for cold sessions.
- Before each slice, read `CLEAN_CODE.md`.
- Before writing code, create or update the current work item brief.
- If required operator-owned input is missing, call it out directly and halt the blocked action.
- Before landing any slice, record whether it complies with `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`.
- After each completed step, update this file if the next action changed.
- If the Bandit skill or operating vocabulary changes, update `CONTEXT.md` in the same turn.
- If Codex cannot answer "what is next?" from this file and `ROADMAP.md`, stop and repair context.
- The operator should not need to reconstruct status from chat.

## Next Step Details

BANDIT-010 escalated adversarial reviewer placeholder.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing
verdict contracts, source-drift checks, validation, and
`bandit land-check <work-item-id>`. BANDIT-006 added the local Qwen baseline
reviewer profile/evidence/command substrate. BANDIT-007 added the CodeRabbit
review evidence template/parser/command substrate and `land-check` integration,
while recording live CodeRabbit polling as a bootstrap gap. BANDIT-008 repaired
the local Qwen baseline reviewer runtime route away from Qwen Code/Ollama
drift. BANDIT-009 repaired full-packet local Qwen reliability and proved the
baseline can return structured output for real Bandit packets.

The next step is to create RED evidence for the escalated adversarial reviewer
placeholder. Keep it narrow: prove the current gap where smell-triggered
required escalation is not enforced by `land-check`, then implement the
placeholder artifact/profile/policy behavior needed when smell triggers require
review beyond the baseline local Qwen gate. Do not build final Landing Agent
behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite
indexing, automated review repair, live CodeRabbit/GitHub polling, or
paid-model reviewer routing.

## Required Operator Input

None before RED evidence or implementation. Repo artifacts already define the
next technical routing decision.
