# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-011` is active as a bootstrap-gap chore tracking and routing
work item. `docs/work/BANDIT-011/brief.md` records the scope, acceptance
criteria, verification plan, clean-code read evidence, and stage-rubric
checklist. Production implementation has not started and RED evidence has not
been recorded yet.

`BANDIT-010` has landed as final implementation source head
`c1333d1cb54c99d9bbaa31ac37a975420454a0da`. It added the escalated adversarial
reviewer placeholder contract, parser/validator, routing-aware `land-check`
enforcement, stale placeholder detection, and repo-native placeholder profile.
`docs/work/BANDIT-010/landing-action.md` records the concrete landing action;
`review-evidence.md`, `local-qwen-review.md`, `escalated-review.md`,
`landing-verdict.md`, and `retrospective.md` record closeout evidence and
dispositions.

**Last completed milestone:** `BANDIT-010` added the escalated adversarial
reviewer placeholder gate.

**Current next action:** Create RED evidence for `BANDIT-011` before production
implementation. The RED evidence should show that Bandit cannot yet list
bootstrap gaps as tracked work and cannot validate an undispositioned
bootstrap-gap record.

## Active Work

**Active work item:** `BANDIT-011` - Bootstrap Gap Chore Tracking And Routing.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton;
`BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` -
PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger
Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen
Baseline Reviewer Gate; `BANDIT-007` - CodeRabbit State Capture; `BANDIT-008`
- Local Reviewer Runtime Drift Repair; `BANDIT-009` - Local Qwen Full-Packet
Reliability; `BANDIT-010` - Escalated Adversarial Reviewer Placeholder.

**Expected next deliverable:** `docs/work/BANDIT-011/red-evidence.md` with
focused failing tests mapped to the brief's acceptance criteria.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No bootstrap-gap tracking artifact, listing command, or validation path exists
  yet. This gap is active work in `BANDIT-011`.
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

BANDIT-011 bootstrap-gap chore tracking and routing.

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

`BANDIT-011` is now the active bootstrap-gap chore because Bandit must convert
known and newly identified bootstrap gaps into repo-native tracked work or
explicit no-action decisions before unrelated Phase 5 work starts. The next
step is RED evidence, not production implementation. Keep the tests narrow:
prove the absence of a gap ledger/listing command and the lack of fail-closed
validation for undispositioned bootstrap-gap records.

Do not build Phase 5 UAT artifacts, final auto-merge behavior, workflow
cockpit, SQLite indexing, live CodeRabbit/GitHub polling, paid-model reviewer
routing, or broad Landing Agent behavior in this chore.

## Required Operator Input

None before creating the bootstrap-gap chore brief. Repo artifacts and the
operator's policy clarification define the next routing decision.
