# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-005` landed as bootstrap implementation commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/landing-action.md` records the concrete landing action; `retrospective.md` records lessons and dispositions; review evidence, landing verdict, and roadmap context are closed out. `docs/work/BANDIT-006/brief.md` defines the current Phase 4 bootstrap work item, `docs/work/BANDIT-006/red-evidence.md` records the RED test contract, and `docs/work/BANDIT-006/implementation-evidence.md` records GREEN implementation evidence. `BANDIT-006` is not landed yet.

**Last completed milestone:** `BANDIT-005` delivered the first Phase 4 pre-landing review loop substrate.

**Current next action:** Prepare Stage 4 review evidence and Stage 5 landing evidence for `BANDIT-006` - Local Qwen Baseline Reviewer Gate. Run or record the local Qwen review gate, create `review-evidence.md` and `landing-verdict.md`, run `npm run bandit -- land-check BANDIT-006` at the applicable source head, then record landing action evidence and retrospective before starting any next slice.

## Active Work

**Active work item:** `BANDIT-006` - Local Qwen Baseline Reviewer Gate. Brief, RED evidence, and GREEN implementation evidence exist; review, landing, landing action, and retrospective evidence are still open.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger Catalog; `BANDIT-005` - Pre-Landing Review Loop.

**Expected next deliverable:** Stage 4 and Stage 5 evidence for the current Phase 4 capability:

- `docs/work/BANDIT-006/local-qwen-review.md` if the configured local Qwen runtime can execute against the current implementation, or explicit bootstrap-gap replacement evidence if it cannot;
- `docs/work/BANDIT-006/review-evidence.md`;
- `docs/work/BANDIT-006/landing-verdict.md`;
- passing `npm run bandit -- land-check BANDIT-006` evidence at the applicable source head;
- `docs/work/BANDIT-006/landing-action.md`;
- `docs/work/BANDIT-006/retrospective.md`.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`. `docs/work/BANDIT-004/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict and landing evidence; `review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps, and improvement dispositions. BANDIT-005 landed as commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/brief.md`, `red-evidence.md`, `implementation-evidence.md`, `review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the complete slice evidence. `npm run bandit -- land-check BANDIT-005` passed at the landed implementation source head before closeout evidence was committed.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No CodeRabbit pre-landing loop.
- No landed local Qwen adversarial gate yet; `BANDIT-006` GREEN implementation
  exists but must still pass review, landing, landing action, and retrospective
  closeout.
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

BANDIT-006 pre-landing review and landing evidence.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing verdict contracts, source-drift checks, validation, and `bandit land-check <work-item-id>`. Phase 4 still records CodeRabbit, local Qwen, escalated review, and Landing Agent gates as bootstrap gaps. `BANDIT-006` is scoped to reduce the local Qwen baseline reviewer gap first.

The next step is to create the review and landing evidence required by `docs/work/BANDIT-006/brief.md`, `docs/work/BANDIT-006/red-evidence.md`, and `docs/work/BANDIT-006/implementation-evidence.md`. Use `AGENTS.md`, `CONTEXT.md`, this file, `ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/plans/V0_PLAN.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `.bandit/policy/smell-triggers.json`, all `docs/work/BANDIT-006/*` artifacts, and the `BANDIT-005` evidence files.

Keep `BANDIT-006` narrow. It should not build CodeRabbit automation, paid reviewer routing, final Landing Agent behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing, or automated review repair. If the configured local Qwen runtime or model path is unavailable, record that as an explicit bootstrap gap rather than asking the operator for routine technical routing. Do not begin `BANDIT-007` until `BANDIT-006` has landing action evidence and retrospective closeout.

## Required Operator Input

None before review and landing evidence for `BANDIT-006`.
