# Current Context

## Status

**Phase:** 5 - UAT And Auto-Landing.

**State:** `BANDIT-011` has landed as final implementation source head
`d8ceb0f6118c6d044fe1b455ddee6d79cbf27e5b`. It added the repo-native
`.bandit/bootstrap-gaps.json` ledger, default ledger creation during
`bandit init`, fail-closed bootstrap-gap validation, seeded known bootstrap
gaps, and `bandit gaps list`. `docs/work/BANDIT-011/landing-action.md`
records the concrete landing action; `review-evidence.md`,
`local-qwen-review.md`, `escalated-review.md`, `landing-verdict.md`, and
`retrospective.md` record closeout evidence and dispositions.

**Last completed milestone:** `BANDIT-011` converted bootstrap gaps from
passive prose into CLI-visible repo-native state.

**Current next action:** Create the first Phase 5 work item for CLI-owned UAT
approval artifacts and stale-UAT detection. Do not create implementation,
RED evidence, or active-work context for that work until this context closeout
is committed.

## Active Work

**Active work item:** none.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton;
`BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` -
PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger
Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen
Baseline Reviewer Gate; `BANDIT-007` - CodeRabbit State Capture; `BANDIT-008`
- Local Reviewer Runtime Drift Repair; `BANDIT-009` - Local Qwen Full-Packet
Reliability; `BANDIT-010` - Escalated Adversarial Reviewer Placeholder;
`BANDIT-011` - Bootstrap Gap Chore Tracking And Routing.

**Expected next deliverable:** Phase 5 work-item brief for CLI-owned UAT
approval artifacts and stale-UAT detection.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- Bootstrap-gap tracking artifact, listing command, and validation path are
  implemented and landed in `BANDIT-011`.
- CodeRabbit state capture substrate exists, but live CodeRabbit API, GitHub
  API, PR comment polling, repair orchestration, and rerun automation remain
  unavailable.
- Local Qwen gate substrate exists, and `BANDIT-009` repaired full-packet
  reliability by routing through direct local oMLX while preserving structured
  findings.
- Escalated adversarial review placeholder gate exists; live escalated reviewer
  routing remains unavailable.
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

Phase 5 UAT and auto-landing boundary.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing
verdict contracts, source-drift checks, validation, and
`bandit land-check <work-item-id>`. BANDIT-006 added the local Qwen baseline
reviewer profile/evidence/command substrate. BANDIT-007 added the CodeRabbit
review evidence template/parser/command substrate and `land-check` integration,
while recording live CodeRabbit polling as a bootstrap gap. BANDIT-008 repaired
the local Qwen baseline reviewer runtime route away from Qwen Code/Ollama
drift. BANDIT-009 repaired full-packet local Qwen reliability and proved the
baseline can return structured output for real Bandit packets. BANDIT-010 added
the escalated adversarial reviewer placeholder gate and completed the Phase 4
placeholder set.

`BANDIT-011` landed the bootstrap-gap ledger, validation path, and list command.
Future cold starts should use `bandit gaps list` and `bandit validate` when
checking whether bootstrap gaps are active, queued, resolved, or blocked.

The next work item should start Phase 5 by defining the CLI-owned UAT approval
artifact and stale-UAT detection path. Keep the first Phase 5 work item narrow:
artifact contract, validation, stale-source detection, command surface, tests,
and landing-gate integration only. Do not build final auto-merge behavior,
workflow cockpit, SQLite indexing, live CodeRabbit/GitHub polling, paid-model
reviewer routing, heartbeat chore-agent behavior, or broad Landing Agent
behavior in the first Phase 5 item.

## Required Operator Input

None before creating the Phase 5 UAT work-item brief. Repo artifacts define the
next routing decision.
