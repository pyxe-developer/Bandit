# BANDIT-025 Retrospective

## Outcome

`BANDIT-025` is landed and closed out as the first Phase 6 Coordination
Primitive slice.

The slice added a per-work-item append-only coordination log, shared core state
sequence, actor-event context boundary, fail-closed validation, and read-only
`bandit coordination validate/status` reporting. The coordination log for
`BANDIT-025` is advanced through `retrospective_recorded` and `closed`, with
Markdown evidence artifacts remaining the proof for each accepted transition.

## What Worked

- The Phase 6 foundation stayed narrow: no claim leases, scheduler execution,
  worktree lifecycle, cockpit UI, cross-repo coordination, product UAT changes,
  or automatic merge/push/deploy behavior was introduced.
- Focused RED tests made actor-event non-authority, missing evidence refusal,
  illegal state regressions, accepted blocks, and safe-trigger derivation
  explicit before implementation.
- `review_subject_hash` kept Stage 4 review evidence stable while landing and
  closeout evidence advanced the repository head.
- The per-work-item coordination log now gives future cold starts a
  CLI-validatable answer for current state, accountable actor, next action,
  accepted block state, and safe trigger points.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Coordination state needs an explicit append-only work-item log, not inference from chat or artifact presence. | Durable artifact | `docs/work/BANDIT-025/coordination-log.jsonl`, `docs/templates/coordination-log.md`, and `src/state/coordination-log.ts` establish the first CLI-authoritative log contract. |
| Actor coordination events are useful context but must not become workflow authority. | Durable artifact | The parser accepts actor events as context, while status and safe triggers derive only from validated step-transition events. |
| Local Qwen's timestamp, work-type parsing, and evidence-integrity findings are real hardening concerns but not blockers for the foundation slice. | Follow-up chore candidates | `docs/work/BANDIT-025/qwen-finding-disposition.md` records source metadata, hypothesis, metric, baseline, evaluation window, status, and pending outcome for all three candidates. |
| The next Phase 6 slice should build on the shared core state machine instead of jumping to leases, scheduler execution, worktrees, cockpit UI, or Phase 7 evaluation. | Explicit defer decision | The roadmap still lists typed state extensions as the next uncovered Phase 6 capability; broader automation surfaces remain out of scope until their repo-native contracts exist. |

## Improvement Chores

The accepted Local Qwen non-blocking findings are durably routed as queued
chore candidates in `docs/work/BANDIT-025/qwen-finding-disposition.md`:

- `BANDIT-025-TIMESTAMP-VALIDATION`
- `BANDIT-025-WORK-TYPE-PARSING`
- `BANDIT-025-EVIDENCE-INTEGRITY`

No new active work item is created during this closeout step. These candidates
should be considered when the relevant coordination parser, work-item reader,
coordination status, evidence reconciliation, or review-subject hash policy
path is next touched.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-025`.

Local Qwen returned `non_blocking` findings that Codex PM accepted and routed
with concrete rationale. CodeRabbit remains a recorded bootstrap replacement
for this local-record main-branch slice because no PR-backed CodeRabbit review
exists; the aggregate review evidence records deterministic tests,
`review_subject_hash`, Bandit validation, Local Qwen evidence, and PM
disposition without claiming a CodeRabbit pass.

## Bootstrap Gaps Remaining

- None currently recorded as open or active.
