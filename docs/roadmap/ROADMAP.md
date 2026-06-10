# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- `[Slice]` `BANDIT-089` - Trust Boundary Evidence Schema Contracts (closed)

## Current Work Item

- None currently active.

**Current next step:** Repo PM should form PRD-004.2 Attribution Join Key
Wiring as the next BANDIT-PRD-004 slice.

Do not approve expanded landing autonomy, Notify-And-Revert or Auto-Landing
Scope for a new boundary cell, public package publishing, paid registry setup,
hosted update services, telemetry, automatic self-update, credential handling,
external repo mutation, installed global skill mutation, automation prompt
mutation, merge/push/deploy authority, Trust Verifier cutover, old-gate
replacement or wrapping, local API or State Index timing, scheduler execution,
claim/worktree lifecycle behavior, guarded browser actions, generate role input
or execution packets for unrelated work, restart Pi/Aperture runtime work,
implement V0 Closeout Claude Code A/B Product-Value Trial, implement
Installed-Copy Update Path, or start unrelated Phase 8 product work before
PRD-004.2 formation is recorded and approved.

Local Qwen reviewer routing must use `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint.
The direct `qwen` CLI is not an authorized Bandit reviewer path.

## Next Work Item

- `[Slice]` `TBD` - PRD-004.2 Attribution Join Key Wiring: connect landing,
  model/tool, and escape evidence through the structured attribution tuple.

## Planned Work

### Blocking Gaps

- None currently open in `.bandit/bootstrap-gaps.json`.

### Phase 8 Product Queue

`BANDIT-082` migrated the pre-Claude-bakeoff follow-up and UI-polish work into
`.bandit/work-intake-ledger.json`. `WIL-UI-POLISH` is closed as `BANDIT-083`.
`WIL-CLAIM-FIRST` is closed as `BANDIT-084` with universal claim-first policy
deferred. `WIL-REPO-WIDE-TRANSITION-INDEX` is closed as `BANDIT-085` with
repo-wide transition indexing deferred until named trigger conditions exist.
`WIL-COORDINATION-PRIMITIVE` is closed as `BANDIT-086` with new coordination
primitive implementation deferred until named trigger conditions exist.
`WIL-PR-CICD-LANDING` is closed as `BANDIT-087` with PR/CI/CD landing
implementation deferred until named trigger conditions and operator-owned
approvals exist. `WIL-INSTALLED-COPY-UPDATE` is closed as `BANDIT-088` with
installed-copy update-path implementation deferred until named trigger
conditions and operator-owned approvals exist. The operator reprioritized
`BANDIT-PRD-004` and `BANDIT-PRD-005` ahead of the Claude Product-Value Trial
on 2026-06-10.

- `[Slice]` `TBD` - PRD-004.3 Escape Candidate Workflow: classify escape
  candidates, run Codex PM attribution review, and record confirmed escape or
  no-escape dispositions.
- `[Slice]` `TBD` - PRD-004.4 Boundary Cell Movement Gate: constrain
  boundary-cell movement to Workflow Trial-backed decisions and fail-closed
  contraction on confirmed escapes.
- `[Slice]` `TBD` - PRD-005.1 Roadmap Work Target Resolver: resolve current and
  next work from roadmap/current-context authority before dereferencing PRD,
  spec, or WIL provenance.
- `[Slice]` `TBD` - PRD-005.2 Repo PM Create Controller And Prompt Contract:
  form work through `formation_approved` and stop before Stage 2.
- `[Slice]` `TBD` - PRD-005.3 Work Item PM Execute Controller And Route Registry:
  advance formed work through authorized routes, role packet assembly, and
  honest blocker/provider evidence.
- `[Slice]` `TBD` - PRD-005.4 Operator Command Adapters: add the thin
  `/bandit-work-create` and `/bandit-work-execute` invocation layer after the
  deep controllers are tested.
- `[Slice]` `TBD` - V0 Closeout Claude Code A/B Product-Value Trial: compare
  the same PRD in Bandit and no-Bandit repos after PRD-004/005 implementation
  lanes are landed, closed, blocked on operator-owned input, or explicitly
  dispositioned; no statistical or public benchmark claim.

## Completed Work

- `BANDIT-089` - Trust Boundary Evidence Schema Contracts
- `BANDIT-088` - Installed-Copy Update Path
- `BANDIT-087` - PR And CI/CD Landing Workflow Policy
- `BANDIT-086` - Coordination Primitive Completion Triage
- `BANDIT-085` - Repo-Wide Transition Index Decision
- `BANDIT-084` - Claim-First Transition Policy Triage
- `BANDIT-083` - Bandit Cockpit UI Polish From Attached Design
- `BANDIT-082` - Work Intake Ledger And Followups Migration
- `BANDIT-081` - Operator Attention / Operator Inbox Surface
- `BANDIT-080` - Queue & Context (Light)
- `BANDIT-079` - Improvement Health Surface
- `BANDIT-078` - Guarded CLI Action Requests
- `BANDIT-077` - Spec-To-Evidence Traceability Matrix
- `BANDIT-076` - Evidence Bundle Attestation
- `BANDIT-075` - Reviewer Calibration With Seeded Defects
- `BANDIT-074` - Metamorphic Cross-Projection Checks
- `BANDIT-073` - Gate Determinism And Flake Gate
- `BANDIT-072` - Replay Regression Corpus
- `BANDIT-071` - Private Installable Distribution And Update Notification Channel
- `BANDIT-070` - Verification Oracle Provenance Gate
- `BANDIT-069` - Test Strength / Mutation Adequacy Gate
- `BANDIT-068` - Evidence Drilldown And Gate Matrix
- `BANDIT-067` - Live Cockpit Status View From CLI Payload
- `BANDIT-066` - Browser-Served Cockpit App Shell
- `BANDIT-065` - Harness-Portable Orchestrator Prompt Contract
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - no-action disposition for remaining runtime/harness source material
- `BANDIT-064` - Trust Verifier Cutover Gate Triage
- `BANDIT-063` - Work Item PM Plan Mode Orchestration Gate
- `BANDIT-062` - Work Item Create Replacement Metadata Preservation
- `BANDIT-061` - Role Contract Artifact Input Write Surface
- `BANDIT-060` - Artifact Input Directory Split
- `BANDIT-059` - Trust Verify Snapshot Foundation
- `BANDIT-058` - Role Contracts And Run Manifests
- `BANDIT-057` - Role Entry Points And Formation Gate
- `BANDIT-056` - Evidence Freshness SLOs
- `BANDIT-055` - Token-Cost Failsafe
- `BANDIT-054` - Stage Capability Scope
- `BANDIT-053` - Agent Observability Traces
- `BANDIT-052` - Event-Driven Wake Scheduler
- `BANDIT-051` - Worktree Bootstrap Contract
- `BANDIT-050` - Cockpit Status Interstitial Recovery
- `BANDIT-049` - Session Context Interstitial Recovery
- `BANDIT-048` - Focused Session Context Packets
- `BANDIT-047` - Bootstrap Model-Family Separation
- `BANDIT-046` - Git Mutation Serializer
- `BANDIT-045` - CAS Fenced Claim Authority
- `BANDIT-044` - Operator Fail-Closed Boundary
- `BANDIT-043` - Coordination Event Log Authority
- `BANDIT-042` - Supply-Chain Gate
- `BANDIT-041` - Layered Risk Classification
- `BANDIT-040` - Input Quarantine Gate
- `BANDIT-039` - Agent Evaluation Harness
- `BANDIT-038` - Skill Lifecycle Contract
- `BANDIT-037` - Workflow Trial Decision Guardrails
- `BANDIT-036` - Structured Retrospective Mining
- `BANDIT-035` - Artifact Create Landing Work Item Field
- `BANDIT-034` - Cockpit Shell Hardening
- `BANDIT-033` - Attention-First Cockpit Visual Shell
- `BANDIT-032` - Cockpit Status Coverage Hardening
- `BANDIT-031` - Workflow Cockpit Status Foundation
- `BANDIT-030` - Evaluate Non-Blocking Review Finding Routing
- `BANDIT-029` - Improvement Evaluation Foundation
- `BANDIT-028` - Agent Coordination Event Commands
- `BANDIT-027` - Pre-PR CodeRabbit CLI Review
- `BANDIT-026` - Typed State Extensions
- `BANDIT-025` - Coordination Log Foundation
- `BANDIT-024` - Workflow Cockpit Boundary Scope
- `BANDIT-023` - Non-Blocking Review Finding Chore Routing
- `BANDIT-022` - Heartbeat Chore Agent Contract
- `BANDIT-021` - General Artifact Create Command
- `BANDIT-020` - Work Item Create Command
- `BANDIT-019` - Review Subject Hash Evidence Freshness
- `BANDIT-018` - Live Escalated Reviewer Routing
- `BANDIT-017` - Landing Gate Complexity And Git Diagnostics Hardening
- `BANDIT-016` - Stage 4 Evidence-Head Semantics
- `BANDIT-015` - Live CodeRabbit Pre-Landing Loop
- `BANDIT-014` - Landing Agent Bootstrap Gap Resolution
- `BANDIT-013` - Auto-Landing Eligibility Policy And Check
- `BANDIT-012` - CLI-Owned UAT Approval Artifact And Stale-UAT Detection
- `BANDIT-011` - Bootstrap Gap Chore Tracking And Routing
- `BANDIT-010` - Escalated Adversarial Reviewer Placeholder
- `BANDIT-009` - Local Qwen Full-Packet Reliability
- `BANDIT-008` - Local Reviewer Runtime Drift Repair
- `BANDIT-007` - CodeRabbit State Capture
- `BANDIT-006` - Local Qwen Baseline Reviewer Gate
- `BANDIT-005` - Pre-Landing Review Loop
- `BANDIT-004` - Routing Decision And Smell Trigger Catalog
- `BANDIT-003` - PRD-To-Work Draft Command
- `BANDIT-002` - Work Artifact Templates And Validation
- `BANDIT-001` - Repo-Native State And CLI Skeleton
