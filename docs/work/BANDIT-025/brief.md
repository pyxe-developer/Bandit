# BANDIT-025: Coordination Log Foundation

## Status

Brief Created

## Goal

Create the first Phase 6 coordination primitive slice by defining a CLI-authoritative, per-work-item coordination log contract and a derived current-state report that prevents agents from inferring progress from chat or artifact presence alone.

## Scope

- Define the per-work-item append-only coordination log path, event envelope, version field, actor field, timestamp/source metadata, evidence references, and deterministic validation rules.
- Define the first shared core step-transition state sequence for slices and chores, including separate retrospective-recorded and closed states.
- Define the initial actor coordination event types as schema-recognized but non-authoritative context: claim, handoff, block, complete, repair-request, and resume.
- Add or update CLI-owned validation so malformed coordination logs, invalid transition events, unknown event types, missing evidence references, and illegal state regressions fail closed.
- Add a read-only status or report command that derives current state, next expected action, accountable actor, accepted block state, and safe trigger points from the coordination log plus required evidence artifacts.
- Record how existing lifecycle events remain historical repo-wide audit events while the new per-work-item coordination log becomes canonical for work-item workflow position.

## Out Of Scope

- Do not implement work claim leases, work surface reservations, scheduler execution, heartbeat work claiming, or claim-first worktree creation.
- Do not implement cross-repo coordination, a repo-wide canonical transition ledger, a SQLite index, or Workflow Cockpit UI behavior.
- Do not make actor coordination events independently trigger automation; safe trigger points must come only from validated step transitions.
- Do not replace existing evidence artifacts; coordination transitions must reconcile with them instead of making the log a substitute for proof.
- Do not introduce product UAT approval changes, automatic merge/push/deploy behavior, paid provider routing, or Phase 7 improvement evaluation behavior.

## Acceptance Criteria

- A coordination log contract exists for each work item and is explicitly append-only, per-work-item, repo-native, and CLI-authoritative.
- The shared core state sequence covers both slices and chores and separates retrospective-recorded from closed.
- Actor coordination events are schema-valid context events but cannot complete workflow stages or emit safe trigger points without an accepted step transition.
- Validation fails closed for malformed logs, unknown event types, invalid state values, missing required event fields, missing evidence references, illegal regressions, and terminal-state contradictions.
- The derived status/report command reads the coordination log and required evidence artifacts to report current state, next action, accountable actor, accepted block state, and safe trigger points.
- Safe trigger points are emitted only from validated step-transition events and are absent for raw actor coordination events.
- The implementation preserves existing Markdown evidence, landing gates, UAT gates, review evidence, and `.bandit/events.jsonl` behavior while documenting the new authority boundary.
- Tests cover successful status derivation, slice and chore core states, malformed log refusal, missing evidence refusal, actor-event non-authority, accepted block reporting, and safe-trigger derivation.
- No claim leases, scheduler, worktree, cockpit, cross-repo, automatic merge/push/deploy, or Phase 7 improvement engine behavior is introduced by this slice.

## Test Plan

- Write RED tests for coordination log parsing, invalid JSONL, unknown event types, invalid state values, missing required fields, illegal regressions, and missing evidence references.
- Write RED tests for read-only derived status on slice and chore fixtures, including current state, next action, accountable actor, and terminal closed state.
- Write RED tests proving actor coordination events alone cannot complete a stage or emit safe trigger points.
- Write RED tests for accepted block reporting and resume-condition visibility.
- Run focused coordination tests after implementation.
- Run npm test if implementation touches command routing, validators, work-item readers, evidence parsing, landing/UAT/review gates, or shared state modules.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- qwen-review BANDIT-025 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-025 before landing.
- Run git diff --check.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-05-25 before creating this brief. The slice must keep coordination state explicit, preserve source-of-truth boundaries, separate parsing/validation/reporting concerns, and fail closed with clear messages.

## Stage-Rubric Checklist

- Stage 0 Context Readiness: pass - CURRENT_CONTEXT.md and ROADMAP.md identify Phase 6 and this first brief as the next action; BANDIT-024 has landing action and retrospective evidence.
- Stage 1 Work-Item Brief And Spec: pass - this brief defines goal, scope, out of scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap gaps, expected files, implementation order, smell triggers, and operator input status.
- Stage 2 Test Design And RED Evidence: required next - tests must express coordination-log behavior before production implementation.
- Stage 3 Implementation Clean-Code Rubric: required later - implementation must keep parser, validator, and reporting boundaries small and explicit.
- Stage 4 Review And Cross-Model Gates: required later - Local Qwen and aggregate review evidence must cover state-machine, parser, validator, JSONL, and trigger semantics.
- Stage 5 Landing And UAT: required later - landing verdict and landing action evidence are required; feature UAT is not applicable unless product behavior is introduced.
- Stage 6 Retrospective And Improvement Capture: required later - closeout must disposition lessons and update roadmap/current context.

## Bootstrap Gaps

- No open bootstrap gaps are currently recorded. This slice begins Phase 6 after the bootstrap-gap lane is exhausted.
- CodeRabbit PR-backed review remains unavailable for local-record main-branch work unless a PR-backed workflow is explicitly scoped; record replacement evidence honestly if still applicable at Stage 4.
- Full claim leases, scheduler execution, worktree lifecycle, cockpit UI, and cross-repo coordination remain future work outside this slice.

## Expected Files

- docs/work/BANDIT-025/brief.md
- docs/work/BANDIT-025/red-evidence.md
- docs/work/BANDIT-025/implementation-evidence.md
- docs/work/BANDIT-025/local-qwen-review.md
- docs/work/BANDIT-025/review-evidence.md
- docs/work/BANDIT-025/landing-verdict.md
- docs/work/BANDIT-025/landing-action.md
- docs/work/BANDIT-025/retrospective.md
- docs/specs/BANDIT-025-coordination-log-foundation.json
- docs/decisions/2026-05-24-coordination-primitive-state-ledger.md
- docs/templates/coordination-log.md
- src/state/coordination-log.ts
- src/commands/coordination.ts
- test/coordination-log.test.mjs
- test/coordination-status.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## First Implementation Order

- Write RED fixtures and tests for coordination event parsing, shared core state sequence, evidence reconciliation, actor-event non-authority, accepted blocks, and safe trigger derivation.
- Define the coordination log template/contract and parser types.
- Implement fail-closed coordination log validation with small helpers for event envelope, step transitions, actor events, evidence references, and state ordering.
- Implement the read-only derived status/report command.
- Update validation, implementation evidence, Stage 4 review evidence, landing evidence, retrospective, CURRENT_CONTEXT.md, and ROADMAP.md as each stage completes.

## Smell Triggers

- State-machine, parser, validator, JSONL, and safe-trigger work requires Local Qwen review and likely escalated-review routing if smell policy requires it.
- Any logic that treats raw actor events as workflow completion is a blocker.
- Any hidden source of truth in a cache, index, or cockpit-facing report is a blocker.
- Any broad claim/scheduler/worktree implementation inside this slice is scope creep.

## Required Evidence

- docs/work/BANDIT-025/brief.md
- docs/work/BANDIT-025/red-evidence.md
- docs/work/BANDIT-025/implementation-evidence.md
- docs/work/BANDIT-025/local-qwen-review.md
- docs/work/BANDIT-025/review-evidence.md
- docs/work/BANDIT-025/landing-verdict.md
- docs/work/BANDIT-025/landing-action.md
- docs/work/BANDIT-025/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 6 brief because accepted repo decisions, the founding PRD, roadmap, cockpit boundary artifact, and FOLLOWUPS.md define the technical direction. Halt for operator input only if implementation requires product direction, UAT, policy changes, business tradeoffs, explicit cost/risk overrides, remote merge/push/deploy authority, or a genuinely ambiguous scope decision.
