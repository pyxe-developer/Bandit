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

Current stage: Stage 4 CodeRabbit findings pending disposition. Stage 2 RED
evidence is recorded, Claude Stage 3 Writer evidence is recorded, Codex PM
Stage 3 acceptance review now passes after Test Writer contract reconciliation,
and CodeRabbit pre-PR review is recorded with eight findings.

Next action: Perform Codex PM disposition of the eight `BANDIT-060` CodeRabbit
findings, classify repair-required versus no-action/deferred items, and route
any accepted bounded repair before Local Qwen, aggregate Stage 4 review, or
Stage 5 landing.

No operator-owned input is required for the recorded next action. Do not start
Trust Verifier cutover, role input packet work, execution packet work,
Pi/Aperture agent-scope work, the queued role-contract write-surface gap, Stage
5 landing, or unrelated cockpit product work while `BANDIT-060` CodeRabbit
findings are pending disposition.

`BANDIT-059` is landed and closed out. It resolved
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` with the compatibility-mode
`bandit trust verify <snapshot.json>` foundation.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-060` - Artifact Input Directory Split (CodeRabbit findings pending disposition)
- `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` - queued after `BANDIT-060`
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - active bootstrap cleanup chore
- `BANDIT-059` - Trust Verify Snapshot Foundation (closed)
- `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` - resolved by `BANDIT-059`
