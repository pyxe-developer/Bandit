# BANDIT-022 Retrospective

## Outcome

`BANDIT-022` is landed as the heartbeat chore-agent bootstrap-gap chore.

The chore added a narrow, read-only `bandit heartbeat inspect` path governed by
repo-native heartbeat policy. It reports eligible active bootstrap-gap chores,
due improvement evaluations, feature-slice UAT ineligibility, and
operator-input blockers without taking hidden workflow authority, starting
feature work, approving UAT, landing, merging, pushing, or deploying.

## What Worked

- The heartbeat policy artifact kept the automation authority envelope explicit.
- Focused tests caught the core inspection, ineligibility, dirty-worktree, UAT
  boundary, ambiguous next-action, and unsupported-action paths.
- Local Qwen found a real Stage 4 policy/runtime mismatch before landing; the
  focused repair closed it.
- `review_subject_hash` let terminal review evidence proceed without reopening
  source review for evidence-only closeout artifacts.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Heartbeat inspection must fail closed on dirty worktrees before reading candidates. | Durable artifact | The focused repair added the runtime dirty-worktree refusal and tests. |
| Repeated Local Qwen hardening suggestions should not keep reopening accepted implementation behavior. | Follow-up chore candidates | `follow-up-chores.md` records the two remaining hardening suggestions as queued candidates, and the operator is working on preventing this loop in future work. |
| Ambiguous heartbeat next-action text should be conservative. | Durable artifact plus follow-up candidate | Current behavior falls back to `inspect`; explicit action-token mapping is queued as non-blocking hardening. |
| Unknown or unapproved feature UAT states must not become eligible heartbeat work. | Durable artifact plus follow-up candidate | Current behavior fails closed; explicit approved-state tokens are queued as non-blocking hardening. |

## Improvement Chores

`docs/work/BANDIT-022/follow-up-chores.md` records two queued non-blocking
hardening chore candidates:

- Heartbeat next-action token mapping.
- Explicit UAT approval tokens.

These are not current-slice blockers and should not preempt the open
bootstrap-gap queue unless Codex PM or the operator explicitly reprioritizes
them.

## Cross-Model Tension

Local Qwen accepted the focused repair but continued to report two
future-hardening concerns. Codex PM classified them as non-blocking because the
current implementation fails closed: ambiguous next actions fall back to
inspection, and unknown or unapproved UAT statuses are ineligible. The operator
directed the findings into chores and authorized landing.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-WORKFLOW-COCKPIT` remains open as the next queued bootstrap gap.
