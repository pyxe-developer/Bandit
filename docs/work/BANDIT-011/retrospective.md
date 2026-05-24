# BANDIT-011 Retrospective

## Outcome

`BANDIT-011` is safe to land as a bootstrap workflow-infrastructure chore.

The chore added a repo-native bootstrap-gap ledger, fail-closed validation,
default ledger creation during `bandit init`, and `bandit gaps list` so
bootstrap gaps are visible from CLI-owned state instead of passive prose.

## What Worked

- The brief kept Phase 5 UAT, cockpit, live CodeRabbit, live escalated routing,
  and Landing Agent behavior out of scope.
- RED tests made the missing command and missing validation path explicit.
- Review caught the initial missing-ledger fail-open behavior before closeout.
- The repair stayed small: `bandit init` creates the canonical ledger, and
  validation plus `gaps list` fail closed if it disappears later.
- Local Qwen reviewed the committed source head and returned a structured pass.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Canonical repo-native state must not silently disappear into an empty in-memory default. | Durable artifact | Implemented missing-ledger refusal tests plus fail-closed ledger reads; `bandit init` creates the default ledger explicitly. |
| Bootstrap gaps need a CLI-visible ledger before Phase 5 starts. | Durable artifact | Implemented `.bandit/bootstrap-gaps.json`, validation, seeded known gaps, and `bandit gaps list`. |
| Specialized data-integrity/schema reviewer routing remains unavailable for state-contract changes. | Bootstrap gap already tracked | Covered by the live escalated reviewer routing gap in `.bandit/bootstrap-gaps.json`; no separate chore is needed until live reviewer routing is selected. |

## Improvement Chores

None. The actionable implementation lesson was repaired before landing, and the
remaining reviewer-routing limitation is already represented in the bootstrap
gap ledger.

## Cross-Model Tension

None. Codex PM found and repaired the missing-ledger fail-open path before local
Qwen review; local Qwen returned `pass` with no findings.

## Bootstrap Gaps Remaining

- No general Bandit work-item creation command.
- Live CodeRabbit polling and repair orchestration.
- Live escalated or specialized reviewer routing.
- Landing Agent.
- UAT artifacts and stale-UAT detection.
- Heartbeat chore-agent.
- Workflow cockpit and state index.
