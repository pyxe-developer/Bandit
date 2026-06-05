# Current Context

## Last Updated: 2026-06-01

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
agentic software delivery: validate a work item snapshot, hash it, verify repo
evidence, enforce reviewer-finding routing, produce a verdict, and emit a
reproducible report. The emerging first implementation slice is
`bandit trust verify <snapshot.json>` as a read-only verifier over captured
evidence. That slice is compatibility-mode only; cutover from existing gate
commands requires a later explicit per-Trust-Goal cutover decision.

Operator-owned product-boundary input is currently being gathered. Do not start
implementation, RED evidence, a new normal bootstrap work item, or Pi/Aperture
agent-scope work until the minimal trust-layer surface is resolved.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material for harness-agnostic trust-layer pivot
- `BANDIT-058` - Role Contracts And Run Manifests (closed)
- `BANDIT-057` - Role Entry Points And Formation Gate (closed)
- `BANDIT-056` - Evidence Freshness SLOs (closed)
- `BANDIT-055` - Token-Cost Failsafe (closed)
