# BANDIT-022 Follow-Up Chore Candidates

## Status

Queued as non-blocking hardening chore candidates during `BANDIT-022` landing
closeout. These are not current-slice blockers and do not reopen Stage 4.
They are linked to `BANDIT-023` as source examples for the non-blocking review
finding routing contract.

## Source

- `docs/work/BANDIT-022/local-qwen-review.md`
- `docs/work/BANDIT-022/review-evidence.md`
- Operator direction on 2026-05-25: move the nit findings to chores and proceed
  with landing.

## Chore Candidate: Heartbeat Next-Action Token Mapping

origin: Local Qwen non-blocking hardening finding from `BANDIT-022`.
source_work_item: BANDIT-022
source_artifacts:
  - docs/work/BANDIT-022/local-qwen-review.md
  - docs/work/BANDIT-022/review-evidence.md
lesson: Heartbeat bootstrap-gap next-action normalization should eventually use explicit action tokens instead of regex matching.
hypothesis: Explicit action-token mapping will reduce repeated reviewer concern about ambiguous text parsing while preserving the current safe fallback to inspection.
metric: Future Local Qwen or aggregate Stage 4 reviews do not repeat the ambiguous next-action mapping finding for heartbeat inspection.
baseline: `BANDIT-022` lands with safe ambiguous fallback behavior, but Local Qwen still requested stricter enum-style mapping as non-blocking hardening.
expected_direction: Review noise decreases without expanding heartbeat authority.
evaluation_window: Evaluate when heartbeat policy or bootstrap-gap next-action parsing is next touched.
status: queued_candidate
linked_work_item: BANDIT-023
outcome: pending

## Chore Candidate: Explicit UAT Approval Tokens

origin: Local Qwen non-blocking hardening finding from `BANDIT-022`.
source_work_item: BANDIT-022
source_artifacts:
  - docs/work/BANDIT-022/local-qwen-review.md
  - docs/work/BANDIT-022/review-evidence.md
lesson: Heartbeat feature-slice UAT parsing can make approved states explicit instead of using a broad `includes("approved")` check.
hypothesis: Explicit approved-state tokens will reduce future reviewer concern about status semantics while preserving fail-closed behavior for unknown or unapproved UAT states.
metric: Future Local Qwen or aggregate Stage 4 reviews do not repeat the broad UAT approval parsing finding for heartbeat inspection.
baseline: `BANDIT-022` lands with fail-closed UAT behavior, but Local Qwen still requested explicit approved statuses as non-blocking hardening.
expected_direction: Review noise decreases without approving feature work from ambiguous UAT text.
evaluation_window: Evaluate when heartbeat feature-slice eligibility or UAT status parsing is next touched.
status: queued_candidate
linked_work_item: BANDIT-023
outcome: pending
