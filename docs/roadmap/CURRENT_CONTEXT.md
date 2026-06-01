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
aggregate formation review evidence. Test Writer recorded Stage 2 RED evidence
at `docs/work/BANDIT-058/red-evidence.md` and
`docs/specs/BANDIT-058-red-evidence.json`, with `red_recorded` appended to the
coordination log.

`BANDIT-057` remains landed and closed out. Its Stage 1 through Stage 6 evidence
and the formal replacement of
`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` are recorded in
`docs/work/BANDIT-057/`, `docs/specs/`, `.bandit/policy/`, and
`.bandit/bootstrap-gaps.json`.

**Active work item:** `BANDIT-058` - Role Contracts And Run Manifests.

**Current next action:** Dispatch Stage 3 implementation for `BANDIT-058` to Claude through the bootstrap Process Adapter path.

The current stage is Stage 3: RED evidence recorded, implementation pending.

Do not begin Stage 4 review, land, close out, begin another work item, or begin
unrelated Phase 8 cockpit product work until `BANDIT-058` has Claude
Implementation Writer evidence for the Role Contracts and Role Run Manifests
RED suite. The Stage 3 Writer has no authority to edit tests, test helpers,
fixtures, RED evidence, or acceptance mappings.

## Active Work

**Active work item:** `BANDIT-058` - Role Contracts And Run Manifests.

`BANDIT-058` has Stage 1 brief evidence, Qwen formation review, CodeRabbit
formation review, aggregate formation review, a `formation_approved`
coordination transition, and Test Writer-owned RED evidence. The RED suites are
`test/role-contracts.test.mjs` and `test/role-run-manifests.test.mjs`; both are
Codex-authored Test Writer surfaces, so Stage 3 implementation must route to
Claude for bootstrap model-family separation.

Do not start local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, claim leases, work surface reservations,
automatic merge/push/deploy, product UAT approval, actor identity policy,
PR/CI workflow, or unrelated Phase 8 work while `BANDIT-058` is active.

## Priority

1. Dispatch Stage 3 implementation for `BANDIT-058` to Claude through the
   bootstrap Process Adapter path.
2. Keep Stage 3 bounded to making `test/role-contracts.test.mjs` and
   `test/role-run-manifests.test.mjs` pass without editing Test Writer-owned
   surfaces.
3. Keep the work bounded to Role Contracts And Run Manifests.
4. Keep unrelated Phase 8 cockpit product work blocked while any bootstrap gap
   remains queued or active.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next step
is Stage 3 implementation for a repo-derived bootstrap-gap chore through the
recorded Claude Writer path, not a product, UAT, policy, business, cost, or
scope decision.
