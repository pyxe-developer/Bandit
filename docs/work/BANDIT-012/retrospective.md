# BANDIT-012 Retrospective

## Outcome

`BANDIT-012` is safe to land as a bootstrap workflow-infrastructure chore.

The chore added a CLI-owned UAT approval artifact, `bandit uat approve`,
validation for UAT approval metadata, and `land-check` enforcement that blocks
claimed passing UAT when approval evidence is missing, malformed, or stale.

## What Worked

- RED tests made the missing UAT artifact, missing command, missing validation,
  and missing landing-gate checks explicit before implementation.
- The implementation stayed inside the Phase 5 boundary: UAT artifact,
  validation, stale-source detection, command surface, tests, and landing-gate
  integration only.
- Local Qwen found two small robustness issues before closeout; both were
  repaired before the final source-head review.
- The final Qwen run returned `pass` on the repaired source head.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| UAT must be explicit repo-native state, not chat, cockpit state, or inferred agent judgment. | Durable artifact | Implemented `docs/work/<ID>/uat-approval.md`, `bandit uat approve`, validation, and `land-check` integration. |
| CLI approval commands should fail closed on malformed flags, not only missing final fields. | Durable artifact | Repaired `uat approve` argument parsing after local Qwen review so unknown or malformed flags return usage guidance. |
| Malformed approval artifacts need artifact-path context in validation errors. | Durable artifact | Repaired UAT validation to wrap parse failures with the approval artifact path. |
| Checking both source-head freshness and recorded `source_drift_status` is intentionally stricter than a single comparison. | No-action decision | Keeping both checks prevents a manually marked stale approval artifact from being accepted just because its recorded source head matches the current commit. |

## Improvement Chores

None. The actionable local Qwen findings were repaired before landing, and the
remaining live reviewer, CodeRabbit, and Landing Agent limitations are already
represented in the bootstrap-gap ledger.

## Cross-Model Tension

None. Local Qwen's non-blocking findings were accepted and repaired before
the final review; the source-drift redundancy note was dispositioned as an
explicit no-action decision because the stricter check preserves fail-closed
approval semantics.

## Bootstrap Gaps Remaining

- No general Bandit work-item creation command.
- Live CodeRabbit polling and repair orchestration.
- Live escalated or specialized reviewer routing.
- Landing Agent and auto-landing behavior.
- Heartbeat chore-agent.
- Workflow cockpit and state index.
