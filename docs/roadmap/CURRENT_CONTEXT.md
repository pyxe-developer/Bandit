# Current Context

## Status

**Phase:** 3 - Routing And Smell Detection.

**State:** `BANDIT-004` brief is created. No RED evidence or implementation has started.

**Last completed milestone:** `BANDIT-003` delivered deterministic PRD-to-work draft generation from explicit Feature PRD decomposition notes.

**Current next action:** Create `docs/work/BANDIT-004/red-evidence.md` and failing tests for the first Phase 3 routing and smell-detection slice.

## Active Work

**Active work item:** `BANDIT-004` - Routing Decision And Smell Trigger Catalog.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton; `BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` - PRD-To-Work Draft Command.

**Expected next deliverable:** `docs/work/BANDIT-004/red-evidence.md` plus failing tests scoped to the first Phase 3 capability:

- a repo-native Smell Trigger Catalog seed;
- a routing decision artifact contract;
- an escalation policy that Codex PM can apply without asking routine technical questions;
- a narrow route command and validation path for recorded routing decisions.

BANDIT-003 has landed as commit `e7520e97da0661b641e9d5f08fb4735e1738ac95`. `docs/work/BANDIT-003/landing-action.md` records the concrete landing action; `landing-verdict.md` records the safe-to-land verdict; `review-evidence.md` and `retrospective.md` record review gaps, repaired findings, and improvement dispositions. `docs/work/BANDIT-004/brief.md` now records scope, acceptance criteria, test plan, clean-code read evidence, stage rubrics, bootstrap gaps, expected files, and implementation order. Do not create implementation code for Phase 3 before RED evidence and failing tests exist.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- No implemented Smell Trigger Catalog; `BANDIT-004` is active to create the first seed.
- No implemented routing decision artifact; `BANDIT-004` is active to create the first contract.
- No CodeRabbit pre-landing loop.
- No Qwen adversarial gate.
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

Create RED evidence and failing tests for `BANDIT-004`.

BANDIT-003 completed Phase 2 by adding the command path that can turn a Feature PRD into trackable slice and chore drafts without making generated artifacts a hidden source of truth. `BANDIT-004` begins Phase 3 with policy and artifact shape before implementation.

The next step is RED evidence. Do not create production implementation code until the RED evidence maps the brief's acceptance criteria to failing tests. Do not create detailed briefs for later phases yet.

## Required Operator Input

None before BANDIT-004 RED evidence or implementation.
