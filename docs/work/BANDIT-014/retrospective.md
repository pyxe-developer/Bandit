# BANDIT-014 Retrospective

## Outcome

`BANDIT-014` is landed as a bootstrap workflow-infrastructure chore.

The chore converted `BANDIT-GAP-LANDING-AGENT` into a repo-native Landing
Agent contract, validation path, and `bandit land <work-item-id> --action
local-record` command. The command consumes the existing auto-landing and
landing-readiness gates, fails closed on unsupported actions and stale or dirty
state, preserves operator-owned UAT boundaries, and records local landing
action evidence without performing remote merge, push, or deploy work.

## What Worked

- The local-record Landing Agent path reused `auto-land-check` and shared
  readiness logic instead of reinterpreting gate evidence.
- Review repairs improved command clarity, action mapping, dirty-path policy,
  git-status scoping, and readiness checks before the final local Qwen pass.
- The Landing Agent contract keeps authority repo-native and explicit while
  preserving the current no-remote-merge bootstrap boundary.
- The supported `local_record` action gave Bandit a durable landing evidence
  path without pretending live remote landing infrastructure exists.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Landing authority should be a narrow repo-native contract, not chat state or terminal convention. | Durable artifact | Implemented `.bandit/policy/landing-agent.json`, validation, and `bandit land <work-item-id> --action local-record`. |
| Landing execution should consume existing readiness and eligibility gates instead of duplicating review, source-drift, and UAT interpretation. | Durable artifact | The command reuses `auto-land-check` and shared landing-readiness state before writing landing-action evidence. |
| Dirty-worktree checks for bootstrap landing need work-item-scoped allowance so the command can write its own evidence while refusing unrelated paths. | Durable artifact | Implemented explicit allowed dirty paths for `docs/work/<work-item-id>/` and fail-closed refusal for unrelated dirty state. |
| Live remote merge, push, and deploy behavior remains a separate policy and integration problem. | No-action decision for this chore | Remote operations stay disabled in the Landing Agent contract; later remote merge work requires its own explicit scope, credentials, and risk policy. |

## Improvement Chores

None created in this closeout. The actionable review findings were repaired
before the final pass evidence. Remaining live integration work is already
represented by queued bootstrap gaps in `.bandit/bootstrap-gaps.json`.

## Cross-Model Tension

None. Local Qwen's initial non-blocking concerns were accepted and repaired
before the final `pass` review at source head
`5385a7f39bf28a64a9a1dd0a849b6dbaeda4a1da`.

## Bootstrap Gap Disposition

`BANDIT-GAP-LANDING-AGENT` is resolved for the bootstrap local-record Landing
Agent scope. The gap ledger now points to `BANDIT-014` closeout evidence.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-LIVE-CODERABBIT`.
- `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
