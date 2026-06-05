# Current Context

## Last Updated: 2026-06-05

## Current Work Item: None

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-058` is closed. It delivered the Role Contracts And Run Manifests slice
under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`, including role contract
policy evidence, role-run manifest evidence, CLI validation, fail-closed
authority and path-containment checks, focused tests, Stage 4 review evidence,
Stage 5 landing evidence, local-record landing action, and Stage 6
retrospective/improvement/gap disposition.

Current stage: Stage 0 architecture clarification / harness-agnostic CLI trust
layer design.

The Pi/Aperture harness-specific path is superseded by
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`.

Next action: continue defining the smallest CLI-verifiable trust contract for
agentic software delivery and record the first implementable read-only
`bandit trust verify <snapshot.json>` work item.

Operator-owned product-boundary input is currently being gathered. Do not start
implementation, RED evidence, a new normal bootstrap work item, or Pi/Aperture
agent-scope work until the minimal trust-layer surface is resolved.

`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is queued as a cleanup candidate to
separate artifact-renderer JSON inputs and reviewer captures from work/gap specs
in `docs/specs/`. Promote it before Trust Verify Snapshot Foundation only if
artifact-input path clarity blocks the verifier/report contract.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material for harness-agnostic trust-layer pivot
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - queued cleanup candidate for overloaded `docs/specs/`
- `BANDIT-058` - Role Contracts And Run Manifests (closed)
- `BANDIT-057` - Role Entry Points And Formation Gate (closed)
- `BANDIT-056` - Evidence Freshness SLOs (closed)
