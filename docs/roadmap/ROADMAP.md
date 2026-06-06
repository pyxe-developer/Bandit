# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Current Work Item

- `[Gap]` `BANDIT-059` - Trust Verify Snapshot Foundation

The harness-specific Pi/Aperture path is superseded by
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`.

**Current next step:** Record Stage 6 retrospective, improvement disposition,
and gap disposition for BANDIT-059 before any new work item.

## Next Work Item

- `[Gap]` TBD - Artifact Input Directory Split, only if path clarity blocks the
  trust verifier/report contract; otherwise Trust Verifier Cutover Gate after
  compatibility evidence exists.

## Planned Work

### Blocking Gaps

These are the active queue under the bootstrap-gap policy. They block unrelated
cockpit feature work unless the operator explicitly changes priority.

- `[Gap]` `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material for
  orchestrator-prompt patterns, no longer the next Pi/Aperture implementation
  queue.
- `[Gap]` `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` - active in
  `BANDIT-059`; add a read-only
  `bandit trust verify <snapshot.json>` command, Work Item Snapshot schema,
  deterministic snapshot hash, captured-evidence checks, reviewer-finding
  routing validation, Trust Verdict derivation, and reproducible JSON report
  output without running tests/reviewers, mutating workflow state, or replacing
  existing gate commands.
- `[Gap]` `TBD` - Trust Verifier Cutover Gate; after compatibility-mode evidence
  exists, decide per Trust Goal when `bandit trust verify` becomes the canonical
  verifier or wrapper for an older gate path.
- `[Gap]` `TBD` - Artifact Input Directory Split; queued candidate to separate
  artifact-renderer JSON inputs and reviewer captures from work/gap specs in
  `docs/specs/`, only before Trust Verify Snapshot Foundation if path clarity
  blocks the verifier/report contract.

### Deferred PRD Slices

These remain planned cockpit/product work, but are not currently unblocked while
bootstrap gaps are queued.

- `[Slice]` `TBD` - Browser-Served Cockpit App Shell
- `[Slice]` `TBD` - Live Cockpit Status View From CLI Payload
- `[Slice]` `TBD` - Evidence Drilldown And Gate Matrix
- `[Slice]` `TBD` - Guarded CLI Action Requests
- `[Slice]` `TBD` - Improvement Health Surface

## Completed Work

- `BANDIT-001` - Repo-Native State And CLI Skeleton
- `BANDIT-002` - Work Artifact Templates And Validation
- `BANDIT-003` - PRD-To-Work Draft Command
- `BANDIT-004` - Routing Decision And Smell Trigger Catalog
- `BANDIT-005` - Pre-Landing Review Loop
- `BANDIT-006` - Local Qwen Baseline Reviewer Gate
- `BANDIT-007` - CodeRabbit State Capture
- `BANDIT-008` - Local Reviewer Runtime Drift Repair
- `BANDIT-009` - Local Qwen Full-Packet Reliability
- `BANDIT-010` - Escalated Adversarial Reviewer Placeholder
- `BANDIT-011` - Bootstrap Gap Chore Tracking And Routing
- `BANDIT-012` - CLI-Owned UAT Approval Artifact And Stale-UAT Detection
- `BANDIT-013` - Auto-Landing Eligibility Policy And Check
- `BANDIT-014` - Landing Agent Bootstrap Gap Resolution
- `BANDIT-015` - Live CodeRabbit Pre-Landing Loop
- `BANDIT-016` - Stage 4 Evidence-Head Semantics
- `BANDIT-017` - Landing Gate Complexity And Git Diagnostics Hardening
- `BANDIT-018` - Live Escalated Reviewer Routing
- `BANDIT-019` - Review Subject Hash Evidence Freshness
- `BANDIT-020` - Work Item Create Command
- `BANDIT-021` - General Artifact Create Command
- `BANDIT-022` - Heartbeat Chore Agent Contract
- `BANDIT-023` - Non-Blocking Review Finding Chore Routing
- `BANDIT-024` - Workflow Cockpit Boundary Scope
- `BANDIT-025` - Coordination Log Foundation
- `BANDIT-026` - Typed State Extensions
- `BANDIT-027` - Pre-PR CodeRabbit CLI Review
- `BANDIT-028` - Agent Coordination Event Commands
- `BANDIT-029` - Improvement Evaluation Foundation
- `BANDIT-030` - Evaluate Non-Blocking Review Finding Routing
- `BANDIT-031` - Workflow Cockpit Status Foundation
- `BANDIT-032` - Cockpit Status Coverage Hardening
- `BANDIT-033` - Attention-First Cockpit Visual Shell
- `BANDIT-034` - Cockpit Shell Hardening
- `BANDIT-035` - Artifact Create Landing Work Item Field
- `BANDIT-036` - Structured Retrospective Mining
- `BANDIT-037` - Workflow Trial Decision Guardrails
- `BANDIT-038` - Skill Lifecycle Contract
- `BANDIT-039` - Agent Evaluation Harness
- `BANDIT-040` - Input Quarantine Gate
- `BANDIT-041` - Layered Risk Classification
- `BANDIT-042` - Supply-Chain Gate
- `BANDIT-043` - Coordination Event Log Authority
- `BANDIT-044` - Operator Fail-Closed Boundary
- `BANDIT-045` - CAS Fenced Claim Authority
- `BANDIT-046` - Git Mutation Serializer
- `BANDIT-047` - Bootstrap Model-Family Separation
- `BANDIT-048` - Focused Session Context Packets
- `BANDIT-049` - Session Context Interstitial Recovery
- `BANDIT-050` - Cockpit Status Interstitial Recovery
- `BANDIT-051` - Worktree Bootstrap Contract
- `BANDIT-052` - Event-Driven Wake Scheduler
- `BANDIT-053` - Agent Observability Traces
- `BANDIT-054` - Stage Capability Scope
- `BANDIT-055` - Token-Cost Failsafe
- `BANDIT-056` - Evidence Freshness SLOs
- `BANDIT-057` - Role Entry Points And Formation Gate
- `BANDIT-058` - Role Contracts And Run Manifests
