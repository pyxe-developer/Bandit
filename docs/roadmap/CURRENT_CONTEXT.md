# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

`BANDIT-058` is active as the next bounded role-scoped workflow orchestration
chore for `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`. Repo PM created the
Stage 1 brief at `docs/work/BANDIT-058/brief.md` from
`docs/specs/BANDIT-GAP-ROLE-CONTRACTS-RUN-MANIFESTS.json`, linked the queued
gap as active, recorded the initial `brief_created` coordination state, and
recorded the `formation_approved` transition in
`docs/work/BANDIT-058/coordination-log.jsonl` after Qwen, CodeRabbit, and
aggregate formation review evidence.

`BANDIT-057` remains landed and closed out. Its Stage 1 through Stage 6 evidence
and the formal replacement of
`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` are recorded in
`docs/work/BANDIT-057/`, `docs/specs/`, `.bandit/policy/`, and
`.bandit/bootstrap-gaps.json`.

**Active work item:** `BANDIT-058` - Role Contracts And Run Manifests.

**Current next action:** Run Stage 2 Test Writer RED evidence for `BANDIT-058` before Stage 3 implementation.

The current stage is Stage 2: formation approved, RED evidence pending.

Do not dispatch Stage 3 implementation, begin Stage 4 review, land, close out,
begin another work item, or begin unrelated Phase 8 cockpit product work until
`BANDIT-058` has Test Writer-owned RED evidence and acceptance-criteria mapping.

## Active Work

**Active work item:** `BANDIT-058` - Role Contracts And Run Manifests.

`BANDIT-058` has Stage 1 brief evidence, Qwen formation review, CodeRabbit
formation review, aggregate formation review, and a `formation_approved`
coordination transition. RED evidence is not yet recorded.

Do not start local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, claim leases, work surface reservations,
automatic merge/push/deploy, product UAT approval, actor identity policy,
PR/CI workflow, or unrelated Phase 8 work while `BANDIT-058` is active.

## Priority

1. Run Stage 2 Test Writer RED evidence for `BANDIT-058`.
2. Map RED tests to the Role Contracts And Run Manifests acceptance criteria and
   record Test Writer ownership.
3. Keep the work bounded to Role Contracts And Run Manifests.
4. Keep unrelated Phase 8 cockpit product work blocked while any bootstrap gap
   remains queued or active.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next step
is Stage 2 RED evidence for a repo-derived bootstrap-gap chore, not a product,
UAT, policy, business, cost, or scope decision.
