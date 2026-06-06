# Current Context

## Last Updated: 2026-06-05

## Current Work Item: BANDIT-059

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-059` is active. Repo PM created the Trust Verify Snapshot Foundation
work item from `docs/specs/BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION.json`
and linked `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` as the active
bootstrap chore.

`BANDIT-058` is closed. It delivered the Role Contracts And Run Manifests slice
under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`, including role contract
policy evidence, role-run manifest evidence, CLI validation, fail-closed
authority and path-containment checks, focused tests, Stage 4 review evidence,
Stage 5 landing evidence, local-record landing action, and Stage 6
retrospective/improvement/gap disposition.

The Pi/Aperture harness-specific path is superseded by
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`.

Current stage: Stage 3 implementation blocked after three Claude Process Adapter
attempts stalled before source edits or Writer evidence.

Latest Stage 2 RED run: 2026-06-05T21:33:02Z; `node --test
test/trust-verify.test.mjs` failed 8/8 because `trust` is not registered.

Next action: Operator must choose the `BANDIT-059` Stage 3 unblock path:
provide or approve a Claude Process Adapter invocation/profile that can complete
source edits and Writer evidence, or approve a scoped policy exception changing
the Stage 3 implementation writer path for this Codex-authored RED slice.

Three Claude Process Adapter attempts stalled before source edits or Writer
evidence; all attempts are recorded at
`docs/work/BANDIT-059/dispatch-attempt.md`. Codex PM did not substitute
Codex-authored implementation work.

Operator-owned input is required for the next Stage 3 implementation step
because repo policy requires Claude-family Stage 3 implementation after
Codex-authored RED tests, and Codex PM cannot silently route around that policy.
Do not route Stage 3 to Codex, let the Stage 3 Writer edit tests or RED
evidence, start Trust Verifier cutover, create a new work item, or start
Pi/Aperture agent-scope work.

`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is queued as a cleanup candidate to
separate artifact-renderer JSON inputs and reviewer captures from work/gap specs
in `docs/specs/`. Promote it before Trust Verify Snapshot Foundation only if
artifact-input path clarity blocks the verifier/report contract.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-059` - Trust Verify Snapshot Foundation (Stage 3 operator unblock required)
- `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` - active bootstrap chore for read-only verifier foundation
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material for harness-agnostic trust-layer pivot
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - queued cleanup candidate for overloaded `docs/specs/`
- `BANDIT-058` - Role Contracts And Run Manifests (closed)
