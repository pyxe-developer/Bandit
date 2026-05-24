# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-005` landed as bootstrap implementation commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/landing-action.md` records the concrete landing action; `retrospective.md` records lessons and dispositions; review evidence, landing verdict, and roadmap context are closed out. `docs/work/BANDIT-006/brief.md` defines the current Phase 4 bootstrap work item, and `docs/work/BANDIT-006/red-evidence.md` records the RED test contract.

**Last completed milestone:** `BANDIT-005` delivered the first Phase 4 pre-landing review loop substrate.

**Current next action:** Begin GREEN implementation for `BANDIT-006` - Local Qwen Baseline Reviewer Gate. Start by adding the repo-native local Qwen profile seed, local Qwen review template, profile/evidence validators, and the narrow `bandit qwen-review <work-item-id>` command until `node --test test/local-qwen-review.test.mjs` passes.

## Active Work

**Active work item:** `BANDIT-006` - Local Qwen Baseline Reviewer Gate. Brief and RED evidence created; production implementation has not started yet.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger Catalog; `BANDIT-005` - Pre-Landing Review Loop.

**Expected next deliverable:** GREEN implementation evidence for the next Phase 4 capability:

- `.bandit/reviewers/local-qwen.json` profile seed;
- `docs/templates/local-qwen-review.md` evidence template;
- local Qwen profile and evidence validation;
- `bandit qwen-review <work-item-id>` command and refusal paths;
- `land-check` integration with current, stale, blocked, inconclusive, unavailable, and malformed local Qwen evidence;
- passing focused RED-to-GREEN verification recorded in `docs/work/BANDIT-006/implementation-evidence.md`.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`. `docs/work/BANDIT-004/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict and landing evidence; `review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps, and improvement dispositions. BANDIT-005 landed as commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/brief.md`, `red-evidence.md`, `implementation-evidence.md`, `review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the complete slice evidence. `npm run bandit -- land-check BANDIT-005` passed at the landed implementation source head before closeout evidence was committed.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No CodeRabbit pre-landing loop.
- No executable local Qwen adversarial gate.
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

BANDIT-006 GREEN implementation.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing verdict contracts, source-drift checks, validation, and `bandit land-check <work-item-id>`. Phase 4 still records CodeRabbit, local Qwen, escalated review, and Landing Agent gates as bootstrap gaps. `BANDIT-006` is scoped to reduce the local Qwen baseline reviewer gap first.

The next step is to implement only the contract described by `docs/work/BANDIT-006/red-evidence.md`. Use `AGENTS.md`, `CONTEXT.md`, this file, `ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/plans/V0_PLAN.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `.bandit/policy/smell-triggers.json`, `docs/work/BANDIT-006/brief.md`, `docs/work/BANDIT-006/red-evidence.md`, and the `BANDIT-005` evidence files.

Keep `BANDIT-006` narrow. It should not build CodeRabbit automation, paid reviewer routing, final Landing Agent behavior, UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing, or automated review repair. If the configured local Qwen runtime or model path is unavailable, record that as an explicit bootstrap gap rather than asking the operator for routine technical routing.

## Required Operator Input

None before GREEN implementation for `BANDIT-006`.
