# Current Context

## Last Updated: 2026-06-06

## Current Work Item: BANDIT-060

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-060` is active. Repo PM created the Artifact Input Directory Split work
item from `docs/specs/BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT.json` and
linked `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` as the active bootstrap
chore.

Current stage: Stage 3 implementation dispatch pending. Stage 2 RED evidence is
recorded, and coordination history records `red_recorded`.

Next action: Dispatch Stage 3 implementation for `BANDIT-060` to Claude through
the bootstrap Process Adapter path.

No operator-owned input is required for the recorded next action. Codex authored
the Stage 2 RED tests, so Stage 3 must go to Claude and must not edit tests,
test helpers, fixtures, RED evidence, acceptance mappings, or canonical
historical evidence. Do not start Trust Verifier cutover, role input packet
work, execution packet work, Pi/Aperture agent-scope work, or unrelated cockpit
product work while `BANDIT-060` is awaiting Claude Stage 3 implementation.

`BANDIT-059` is landed and closed out. It resolved
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` with the compatibility-mode
`bandit trust verify <snapshot.json>` foundation.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-060` - Artifact Input Directory Split (Stage 3 dispatch pending)
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - active bootstrap cleanup chore
- `BANDIT-059` - Trust Verify Snapshot Foundation (closed)
- `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` - resolved by `BANDIT-059`
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material while trust-verifier gaps remain queued
