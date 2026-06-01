# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

`BANDIT-058` is landed and closed out. It delivered the Role Contracts And Run
Manifests slice under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` with
Stage 1 brief evidence, Formation Gate approval, Test Writer RED evidence,
Claude Implementation Writer evidence, CodeRabbit repair evidence, Local Qwen
review and PM disposition, aggregate Stage 4 review evidence, Stage 5
landing-gate evidence, local-record landing action evidence, and Stage 6
retrospective/improvement/gap disposition evidence.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open and queued. The
accepted design in `docs/design/role-scoped-workflow-orchestration.md` names
Execution And Role Input Packets as the next expected bounded follow-on after
Role Contracts And Run Manifests.

**Active work item:** none.

**Current next action:** Create the next bounded role-scoped orchestration work
item for Execution And Role Input Packets before unrelated Phase 8 cockpit
product work.

The current stage is Stage 0 context readiness / interstitial queue selection:
no work item is active, `BANDIT-058` has landing action and Stage 6 closeout
evidence, and the next action is Repo PM formation work for the next bounded
slice. Do not create RED evidence, implementation branches, Work Item PM active
context, or unrelated cockpit product work until the next work item has a Stage
1 brief and Formation Gate evidence.

## Active Work

**Active work item:** none.

`BANDIT-058` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-058/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-058/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains the blocking bootstrap
gap queue. The next bounded slice should be Execution And Role Input Packets,
derived from the accepted role-scoped orchestration design. Keep the next
formation work bounded to generated execution packets and role input packets;
do not start diff-based write validation, same-agent repair continuation,
landing/closeout handoffs, decomposed rubric migration, scheduler execution,
worktree lifecycle, claim leases, merge/push/deploy behavior, product UAT, or
unrelated Phase 8 cockpit product work in the next step unless a Stage 1 brief
explicitly scopes it and passes Formation Gate.

## Priority

1. Create the next bounded role-scoped orchestration work item for Execution And
   Role Input Packets.
2. Keep unrelated Phase 8 cockpit product work blocked while
   `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open or queued.
3. Preserve the slice boundary: do not write RED evidence or implementation
   before the next work item has Stage 1 brief and Formation Gate evidence.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next step
is Repo PM formation of a repo-derived bootstrap-gap chore from accepted design
evidence, not a product, UAT, policy, business, cost, or ambiguous scope
decision.
