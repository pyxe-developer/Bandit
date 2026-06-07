# Current Context

## Last Updated: 2026-06-07

## Current Work Item: BANDIT-068 (formation approved)

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-067` is landed and closed out. It delivered the Live Cockpit Status
View From CLI Payload slice, including source-linked first-screen cues and a
full Stage 0-6 gate strip in the browser shell while preserving CLI authority
and non-canonical browser presentation state.

`BANDIT-068` is formed and formation-approved for the Evidence Drilldown And
Gate Matrix slice. Local Qwen formation review used the MLX
OpenAI-compatible adapter route through `bin/omlx-chat-completions.mjs`; the
direct `qwen` CLI is revoked for Bandit reviewer routing.

The remaining `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` runtime/harness
source material is resolved with disposition `no_action`.

`BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is queued from operator
direction on 2026-06-07. It should become the next bootstrap-gap chore after
`BANDIT-068` lands and closes out; the current next action remains
`BANDIT-068` Work Item PM plan-mode orchestration.

`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is queued behind the
test-strength gate as the next verification-layer hardening gap.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is queued behind the
oracle-provenance gate. It captures the private, non-public install/update
posture: install Bandit across multiple private repos and alert from the CLI
when a newer private update is available.

The remaining verification-layer opportunities are queued behind the private
install/update channel: replay regression corpus, gate determinism/flake gate,
metamorphic cross-projection checks, reviewer calibration with seeded defects,
evidence bundle attestation, and spec-to-evidence traceability matrix.

Current stage: Stage 1 formation approved - Work Item PM plan-mode
orchestration required.

Next action: Run Work Item PM plan-mode orchestration for `BANDIT-068`.

Required operator input: none for the current orchestration step.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-068` - Evidence Drilldown And Gate Matrix (formation approved)
- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` - queued behind evidence bundle attestation
- `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` - queued behind reviewer calibration
- `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` - queued behind cross-projection checks
- `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` - queued behind determinism gate
