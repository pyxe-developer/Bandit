# BANDIT-027 Retrospective

## Outcome

`BANDIT-027` is landed and closed out as the bootstrap-gap improvement chore for
pre-PR CodeRabbit CLI review.

The chore added a CLI-owned pre-PR CodeRabbit review path for local diffs,
recorded repo-native CodeRabbit evidence before PR creation, preserved the
existing PR-backed live review path, and kept provider and source-drift
failures closed instead of falling back to manual review.

## What Worked

- Focused RED tests captured the intended CodeRabbit workflow gap before
  implementation: pre-PR local-diff review, missing CLI/auth refusal, provider
  timeout, actionable finding refusal, info-only disposition, stale-source
  refusal, and PR-backed live-path preservation.
- Fixture-backed provider behavior made the command testable without network,
  GitHub, CodeRabbit service access, or paid credentials.
- Stage 4 evidence now records CodeRabbit pre-PR review as real local-diff
  evidence instead of treating local-record work as a no-PR bootstrap gap.
- Local Qwen and CodeRabbit both passed with no findings, so no new
  non-blocking review loop or cross-model tension had to be routed.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| CodeRabbit pre-landing review should run before PR creation when the local diff is the review subject. | Durable artifact | `bandit coderabbit-review pre-pr <ID> --base <revision> --fixture <path>` now records pre-PR CodeRabbit evidence in `docs/work/<ID>/coderabbit-review.md`. |
| External reviewer commands need deterministic provider seams for tests without weakening live refusal behavior. | Durable artifact | The implementation supports fixture-backed execution for tests while still failing closed for missing CLI, missing auth, timeout, malformed output, stale source, and unresolved actionable findings. |
| The existing PR-backed CodeRabbit path is still useful as later PR confirmation, but it should not be the first discovery gate for local work. | No-action decision | No separate chore is needed because this slice preserved `coderabbit-review live` and added the missing pre-PR path. |
| The improvement outcome cannot be fully judged until later PR-backed work reaches CodeRabbit again. | Future Stage 7 evaluation | The original metric, baseline, and evaluation window remain in `docs/work/BANDIT-027/brief.md`; evaluate actionable GitHub CodeRabbit findings and queue wait time over the next three Stage 4 Bandit work items and the first later PR-backed landing. |

## Improvement Chores

No new improvement chore is created by this retrospective.

The existing `BANDIT-027` improvement hypothesis remains pending evaluation:
pre-PR CodeRabbit review should reduce GitHub CodeRabbit actionable findings
and queue-driven repair churn once later PR-backed Bandit work reaches Stage 4.

## Cross-Model Tension

No unresolved cross-model tension remains. CodeRabbit pre-PR review and Local
Qwen both returned `pass` with no findings, and aggregate Stage 4 review
evidence accepted both gates.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain in `.bandit/bootstrap-gaps.json` after
`BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` is dispositioned as resolved.
