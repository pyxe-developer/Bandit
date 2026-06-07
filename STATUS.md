# Current Context

## Last Updated: 2026-06-07

## Current Work Item: BANDIT-064

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-064` is created for
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`. Stage 1 brief evidence is at
`docs/work/BANDIT-064/brief.md`, and the gap ledger marks the gap active with
linked work item `BANDIT-064`.

Current stage: Stage 1 formation review recorded; CLI-owned
`formation_approved` transition required.

Next action: Repo PM should run
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-064` and repair any
CLI-reported formation-transition prerequisite before Stage 2 begins. Do not
write RED evidence, run `work-item-pm start`, approve Trust Verifier cutover,
replace or wrap old gates, or start unrelated product work before formation
approval.

No operator-owned input is required for formation review. Halt for operator
input if the next step would approve Trust Verifier cutover policy, select a
Trust Goal for cutover, replace or wrap an older gate path, or make another
policy decision that repo artifacts cannot answer.

`BANDIT-063` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION`; Stage 6 retrospective,
improvement disposition, and bootstrap-gap disposition evidence is recorded at
`docs/work/BANDIT-063/retrospective.md`, and the gap ledger marks the Work Item
PM plan-mode orchestration gap resolved.

`BANDIT-062` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA`; Stage 6
retrospective/gap disposition evidence is recorded at
`docs/work/BANDIT-062/retrospective.md`, and the gap ledger marks the serializer
metadata preservation gap resolved.

`BANDIT-061` is landed and closed out. It resolved the bounded Role Contract
Artifact Input Write Surface chore for
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`.

`BANDIT-060` is landed and closed out. It resolved
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` with a repo-native artifact-input
taxonomy, preferred `docs/artifact-inputs/` support for future
artifact-renderer inputs, and legacy-readable historical `docs/specs/`
compatibility.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is resolved by
`BANDIT-063`; it records the required Work Item PM plan-mode gate after
brief/current-state grounding and before full orchestration.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open as source material
while harness-agnostic trust-layer bootstrap work continues and while Trust
Verifier cutover policy remains unresolved.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-064` - Trust Verifier Cutover Gate Triage (formation review recorded; Repo PM approval next)
- `BANDIT-063` - Work Item PM Plan Mode Orchestration Gate (closed)
- `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` - resolved by `BANDIT-063`
- `BANDIT-062` - Work Item Create Replacement Metadata Preservation (closed)
- `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` - resolved by `BANDIT-062`
