# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

`BANDIT-057` is landed and closed out as the first bounded role-scoped workflow
orchestration chore. Its Stage 1 brief, Stage 2 RED evidence, Stage 3 Claude
Implementation Writer evidence and PM acceptance review, Stage 4 CodeRabbit and
Local Qwen evidence, aggregate Stage 4 review evidence, Stage 5 landing
verdict, local-record landing action, Stage 6 retrospective, and
bootstrap-gap disposition are recorded in `docs/work/BANDIT-057/`,
`docs/specs/`, `.bandit/policy/`, and `.bandit/bootstrap-gaps.json`.

`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is formally replaced by
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` rather than treated as resolved
implementation work or no-action. The replacement evidence includes
`docs/design/role-scoped-workflow-orchestration.md`,
`docs/decisions/2026-06-01-explicit-role-entrypoints-and-formation-gate.md`,
and the completed `BANDIT-057` work-item package.

**Active work item:** none.

**Current next action:** Create the queued bootstrap-gap work item for `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.

The current stage is Interstitial: Work-item creation required.

The replacement umbrella remains queued for future bounded role-scoped
orchestration work, such as role-run manifests, execution packets, diff-based
write validation, same-agent repair continuation, landing/closeout packets, or
rubric migration only when a later work item explicitly scopes them. Do not
begin unrelated Phase 8 cockpit product work while this bootstrap gap remains
queued.

## Active Work

**Active work item:** none.

`BANDIT-057` is closed. Stage 6 closeout and bootstrap-gap disposition are
recorded in `docs/work/BANDIT-057/retrospective.md` and
`.bandit/bootstrap-gaps.json`.

Do not start local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, claim leases, work surface reservations,
automatic merge/push/deploy, product UAT approval, actor identity policy,
PR/CI workflow, or unrelated Phase 8 work until the queued replacement
bootstrap-gap work item is created and worked through the normal stage gates.

## Priority

1. Create the queued bootstrap-gap work item for `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.
2. Keep the work bounded to the next explicit role-scoped orchestration slice.
3. Keep unrelated Phase 8 cockpit product work blocked while any bootstrap gap
   remains queued or active.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next step
is a repo-derived bootstrap-gap work-item creation action, not a product, UAT,
policy, business, cost, or scope decision.
