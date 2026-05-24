# BANDIT-013 Retrospective

## Outcome

`BANDIT-013` is landed as a bootstrap workflow-infrastructure chore.

The chore added a repo-native auto-landing policy artifact, default `bandit
init` policy creation, fail-closed policy validation, and a read-only
`bandit auto-land-check <work-item-id>` command that consumes the shared
landing-readiness gate state without mutating source, git state, remotes, or
landing artifacts.

## What Worked

- The command reused the existing landing-readiness path instead of duplicating
  gate interpretation, which kept stale-source, UAT, review, and verdict logic
  aligned with `land-check`.
- Local Qwen surfaced an acceptance-criteria coverage gap before final closeout;
  AC 11 coverage was repaired before the final pass evidence.
- The policy artifact made the no-merge boundary explicit, so future Landing
  Agent work can consume an eligibility decision without inventing authority.
- `auto-land-check` now separates chore eligibility from UAT-approved
  feature-slice eligibility while preserving the operator-owned UAT boundary.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Auto-landing eligibility should be a deterministic policy decision over current gate evidence before any agent can merge. | Durable artifact | Implemented `.bandit/policy/auto-landing.json`, validation, and `bandit auto-land-check <work-item-id>`. |
| Landing readiness and auto-landing eligibility must share gate interpretation. | Durable artifact | `auto-land-check` uses the shared landing-readiness path, avoiding parser or gate drift. |
| Feature-slice eligibility must require current CLI-owned UAT approval and must not infer product acceptance from tests or review. | Durable artifact | Eligibility classification and blocking reasons preserve UAT as operator-owned repo-native state. |
| Open bootstrap gaps should become the next work queue after this active slice lands. | Durable artifact | Updated gap policy, roadmap context, and bootstrap-gap ledger routing so the next step is one bootstrap-gap chore at a time. |

## Improvement Chores

None created in this closeout. The remaining actionable lessons are already
represented as open bootstrap gaps in `.bandit/bootstrap-gaps.json`; the next
work item is the first gap-resolution chore.

## Cross-Model Tension

None. Local Qwen's non-blocking AC 11 coverage concern was accepted and
repaired before the final review pass.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-LANDING-AGENT`.
- `BANDIT-GAP-LIVE-CODERABBIT`.
- `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
