# BANDIT-028 Retrospective

## Outcome

`BANDIT-028` is landed and closed out as the Phase 6 Coordination Primitive
slice for agent coordination event commands.

The slice added `bandit coordination event <work-item-id> <type>` for advisory
claim, handoff, block, complete, repair-request, and resume events. Actor
events are recorded in the same per-work-item coordination log as step
transitions, but they remain non-authoritative: they do not advance workflow
state, emit safe triggers, satisfy typed extension checkpoints, or replace
review, landing, UAT, chore-disposition, or closeout evidence.

## What Worked

- Focused RED tests captured the command surface before implementation:
  successful event append paths, action-specific missing-field refusals,
  malformed log refusal, missing evidence refusal, actor-event non-authority,
  and derived status reporting.
- The implementation stayed narrow. It added action validation, candidate-log
  validation before append, and derived `actor_context` reporting without
  introducing claim leases, work surface reservations, scheduler execution,
  worktree lifecycle, cockpit UI, product UAT ownership changes, automatic
  merge/push/deploy behavior, cross-repo coordination, or Phase 7 evaluation.
- Pre-PR CodeRabbit review ran against the local diff and passed, proving the
  `BANDIT-027` CodeRabbit workflow repair is usable for local-record Bandit
  work.
- Local Qwen's real hardening concern was accepted without reopening the slice:
  actor identity validation is durably routed, while the already-covered
  missing-evidence concern was rejected from repo evidence.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Actor coordination events need CLI-owned append behavior before agents can hand off, block, request repair, or report completion in a durable way. | Durable artifact | `src/commands/coordination.ts`, `src/state/coordination-log.ts`, and focused coordination tests now implement and verify the actor-event command path. |
| Actor events must remain advisory until accepted step transitions reconcile them into workflow state. | Durable artifact | The implementation and tests preserve step-transition authority for current state, safe triggers, typed extensions, review, landing, UAT, and closeout gates. |
| Semantic actor identity validation is real hardening work but needs a defined actor identity policy before enforcement. | Follow-up chore candidate | `docs/work/BANDIT-028/qwen-finding-disposition.md` records `BANDIT-028-ACTOR-IDENTITY-VALIDATION` with source artifacts, hypothesis, metric, baseline, evaluation window, status, and pending outcome. It should be considered when actor identity policy, coordination event validation, claim leases, or work surface reservation work is next touched. |
| The Phase 6 core coordination primitive is now sufficient to move to improvement-engine work without jumping to leases, scheduler execution, worktrees, cockpit UI, or unattended automation. | Next-step decision | Phase 6 now has per-work-item coordination logs, shared core state, typed extensions, derived status, safe triggers, and runtime-agnostic actor coordination events. The next work should begin Phase 7 Improvement Engine scope, not unrelated cockpit or automation work. |

## Improvement Chores

No new active work item is created by this retrospective.

The accepted Local Qwen non-blocking finding is durably routed as a queued
chore candidate in `docs/work/BANDIT-028/qwen-finding-disposition.md`:

- `BANDIT-028-ACTOR-IDENTITY-VALIDATION`

This candidate should not interrupt the next slice unless that slice touches
actor identity policy, coordination event validation, claim leases, or work
surface reservations.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-028`.

CodeRabbit passed with no findings. Local Qwen returned `non_blocking` with one
finding. Codex PM rejected the already-covered missing-evidence component from
repo evidence and accepted the actor identity validation component as a future
hardening candidate because no canonical actor identity policy exists yet.

## Bootstrap Gaps Remaining

- None currently recorded as open or active.
