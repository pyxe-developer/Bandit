# BANDIT-026 Retrospective

## Outcome

`BANDIT-026` is landed and closed out as the Phase 6 Coordination Primitive
slice for typed state extensions.

The slice added typed extension checkpoints for feature UAT and chore
disposition while preserving one shared core coordination lifecycle. The
coordination log for `BANDIT-026` is advanced through
`retrospective_recorded` and `closed`, with Markdown evidence artifacts
remaining the proof for each accepted transition.

## What Worked

- The typed extension design stayed narrow: no claim leases, scheduler
  execution, worktree lifecycle, cockpit UI, cross-repo coordination,
  automatic merge/push/deploy behavior, paid-provider routing, product UAT
  ownership changes, or Phase 7 improvement evaluation behavior was introduced.
- Focused RED tests covered feature UAT extension success/refusal paths, chore
  disposition extension success/refusal paths, wrong-kind use, invalid ordering,
  actor-event non-authority, and backward compatibility for existing core-only
  logs.
- Stage 4 review was clean: Local Qwen returned `pass` with no findings, and
  aggregate review evidence recorded the current `review_subject_hash`.
- Stage 5 kept the slice boundary explicit: landing action evidence exists, and
  this closeout records retrospective and context before any next work item.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Typed state extensions can remain part of the shared core lifecycle when validation reconciles work type, ordering, and evidence paths explicitly. | Durable artifact | `src/state/coordination-log.ts`, `test/coordination-log.test.mjs`, `test/coordination-status.test.mjs`, and `docs/work/BANDIT-026/coordination-log.jsonl` establish the first typed extension contract. |
| Feature UAT remains operator-owned even when the coordination state machine needs to represent UAT readiness. | Durable artifact | `feature_uat_approved` requires current CLI-owned `docs/work/<ID>/uat-approval.md` evidence and applies only to slice work items. |
| Chores and improvement chores need explicit disposition evidence where product UAT is not applicable. | Durable artifact | `chore_disposition_recorded` requires passing `docs/work/<ID>/chore-disposition.md` evidence and applies only after `landed` for chore-like work. |
| The `BANDIT-025` Local Qwen hardening candidates should not be silently treated as resolved by this slice. | Explicit defer decision | `BANDIT-026` changed coordination validation for typed extensions only. Local Qwen did not repeat the earlier timestamp, Markdown work-type parsing, or deeper evidence-integrity concerns, but those candidates remain scoped to their existing follow-up evidence rather than being closed without an explicit improvement-evaluation step. |
| The next post-bootstrap workstream work should not begin from a draft PRD without clear execution authority. | Operator-input blocker for next work | `docs/prds/BANDIT-PRD-002-post-bootstrap-parallel-workstreams.md` is marked `Draft. Ready for post-bootstrap agent decomposition after the active bootstrap-gap lane is resolved, blocked, or explicitly dispositioned.` Codex PM needs operator confirmation that this draft is approved for execution before creating the next post-bootstrap work item. |

## Improvement Chores

No new `BANDIT-026` improvement chore is required.

The slice produced a durable typed-extension contract and Local Qwen returned
no findings. Existing `BANDIT-025` follow-up candidates remain queued in
`docs/work/BANDIT-025/qwen-finding-disposition.md`; this retrospective records
an explicit no-action decision for closing them during `BANDIT-026`.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-026`.

Local Qwen returned `pass` with no findings. CodeRabbit remains a recorded
bootstrap replacement for this local-record main-branch slice because no
PR-backed CodeRabbit review exists; aggregate review evidence records
deterministic tests, `review_subject_hash`, Local Qwen evidence, and PM
disposition without claiming a CodeRabbit pass.

## Bootstrap Gaps Remaining

- None currently recorded as open or active.

