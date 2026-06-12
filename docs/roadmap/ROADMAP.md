# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- `[Gap]` `BANDIT-104` - Work-execute route should derive current stage from
  coordination state
  (closed; retained as the derived-status anchor until the next work item is
  formed)

## Current Work Item

- `[Gap]` `BANDIT-104` - Work-execute route should derive current stage from coordination state
  (Stage 6: closed; derived-status anchor only)

`BANDIT-104` resolved
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT` by deriving
`work-execute --json` routing from append-only coordination state, preserving
the Work Item PM plan-mode gate, and failing closed for unsupported or
contradictory states.

**Current next step:** Repo PM should form BANDIT-101 - Typed reviewer
adapters with honest degradation - only after confirming repo artifacts still
authorize that slice and no new open bootstrap gap takes precedence.

The operator approved a public, open-source install/discovery posture on
2026-06-11. Do not approve expanded landing autonomy, Notify-And-Revert or
Auto-Landing Scope for a new boundary cell, public npm publish automation,
credential handling, paid registry setup, hosted update services, telemetry,
automatic self-update, external repo mutation, installed global skill mutation,
automation prompt mutation, merge/push/deploy authority, Trust Verifier
cutover, old-gate replacement or wrapping, local API or State Index timing,
scheduler execution, claim/worktree lifecycle behavior, guarded browser
actions, generate role input or execution packets for unrelated work, restart
Pi/Aperture runtime work, implement V0 Closeout Claude Code A/B Product-Value
Trial, implement Installed-Copy Update Path, or start unrelated Phase 8 product
work while `BANDIT-104` remains the derived-status anchor.

Local Qwen reviewer routing must use `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint.
The direct `qwen` CLI is not an authorized Bandit reviewer path.

## Next Work Item

- `[Slice]` `BANDIT-101` - Typed reviewer adapters with honest degradation
  (next formation target; do not begin RED evidence or implementation until
  Repo PM formation is recorded and approved)

## Planned Work

### Blocking Gaps

- none. `BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT` was resolved by
  `BANDIT-104`.

### Phase 8 Product Queue

- `[Slice]` `BANDIT-101` - Typed reviewer adapters with honest degradation:
  generalize adversarial reviewer adapters and make no-reviewer state an
  explicit landing-blocking gap. Next formation target if repo artifacts still
  authorize it and no new open bootstrap gap takes precedence.
- `[Slice]` `BANDIT-102` - Harness-neutral AGENTS.md and generated harness
  shims: generate neutral role-contract surfaces plus Pi shims.
- `[Slice]` `BANDIT-103` - Policy tiering: core invariants plus opt-in tiers:
  default new consumers to core policy and keep Bandit-internal policy out of
  the packed distribution.
- `[Slice]` `TBD` - V0 Closeout Claude Code A/B Product-Value Trial: deferred
  until PRD-006 slices are landed, closed, blocked on operator-owned input, or
  explicitly dispositioned; no statistical or public benchmark claim.

## Completed Work

- `BANDIT-104` - Work-execute route should derive current stage from coordination state
- `BANDIT-100` - Project-profile contract and identity-clean init
- `BANDIT-099` - Public Consumer Onboarding Hardening
- `BANDIT-098` - Public Consumer Install Quickstart And Governance Scaffold
- `BANDIT-097` - PRD-005.4 Operator Command Adapters
- `BANDIT-096` - Work Item PM Execute Controller And Route Registry
- `BANDIT-095` - Repo PM Create Controller Closed Anchor Routing
- `BANDIT-094` - Repo PM Create Controller And Prompt Contract
- `BANDIT-093` - Roadmap Work Target Resolver
- `BANDIT-092` - Boundary Cell Movement Gate
- `BANDIT-091` - Escape Candidate Workflow
- `BANDIT-090` - Attribution Join Key Wiring
- `BANDIT-089` - Trust Boundary Evidence Schema Contracts
- `BANDIT-088` - Installed-Copy Update Path
- `BANDIT-087` - PR And CI/CD Landing Workflow Policy
- `BANDIT-086` - Coordination Primitive Completion Triage
