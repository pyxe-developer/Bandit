# Current Context

## Last Updated: 2026-06-01

## Current Work Item: BANDIT-057 - Role Entry Points And Formation Gate

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff.

`BANDIT-056` is landed and closed out as the bootstrap-gap chore for
`BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS`. Its Stage 1 through Stage 6 evidence,
landing action, retrospective, and bootstrap-gap disposition are recorded in
`docs/work/BANDIT-056/`, `docs/specs/`, `.bandit/policy/`, and
`.bandit/bootstrap-gaps.json`.

`BANDIT-057` is active at Stage 3. Its structured creation spec is recorded in
`docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`, and its Stage
1 brief is recorded in `docs/work/BANDIT-057/brief.md`. Stage 2 RED evidence
is recorded in `docs/specs/BANDIT-057-red-evidence.json`,
`docs/work/BANDIT-057/red-evidence.md`, and
`test/role-entrypoints-formation.test.mjs`. The active bootstrap
gap ledger entry remains
`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT`, linked to `BANDIT-057`,
because this work item must add supported `replaced` disposition semantics
before formally replacing that narrow gap with
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.

The next required action is dispatching Stage 3 implementation for
`BANDIT-057` to Claude through the bootstrap Process Adapter path. Do not let
the Stage 3 Writer edit tests, test helpers, fixtures, RED evidence
artifacts/specs, or acceptance mappings. Do not run Stage 4 review, land, close
out, or begin unrelated Phase 8 work until implementation evidence is recorded.

No operator-owned input is required for the next recorded action.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-057` - Role Entry Points And Formation Gate (Stage 3 next)
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - active replacement umbrella
- `BANDIT-056` - Evidence Freshness SLOs (closed)
- `BANDIT-055` - Token-Cost Failsafe (closed)
- `BANDIT-054` - Stage Capability Scope (closed)
