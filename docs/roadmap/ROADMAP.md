# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- `[Gap]` `BANDIT-084` - Claim-First Transition Policy Triage (closed)

## Current Work Item

- `[Gap]` `BANDIT-085` - Repo-Wide Transition Index Decision
  (formation approved)

**Current next step:** Work Item PM should run plan-mode orchestration for
`BANDIT-085`, Repo-Wide Transition Index Decision, before RED evidence,
implementation, review, landing, closeout, Coordination Primitive Completion
Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, the V0
Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 work.

Do not approve a canonical repo-wide transition ledger, implement a repo-wide
transition index, choose local API or State Index timing, approve scheduler
execution, approve claim/worktree lifecycle behavior, approve guarded browser
actions, approve Trust Verifier cutover, select a Trust Goal for cutover,
replace or wrap old gates, generate role input or execution packets for
unrelated work, restart Pi/Aperture runtime work, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or external service setup, merge, push, deploy, form the V0 Closeout
Claude Code A/B Product-Value Trial, start Coordination Primitive Completion
Triage, start PR And CI/CD Landing Workflow Policy, start Installed-Copy Update
Path, or start unrelated Phase 8 product work before Work Item PM records
plan-mode orchestration for `BANDIT-085`.

Local Qwen reviewer routing must use `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint.
The direct `qwen` CLI is not an authorized Bandit reviewer path.

## Next Work Item

- `[Gap]` `TBD` - Coordination Primitive Completion Triage, pending after
  `BANDIT-085` lands and closes or is explicitly blocked/dispositioned.

## Planned Work

### Blocking Gaps

- None currently open in `.bandit/bootstrap-gaps.json`.

### Phase 8 Product Queue

`BANDIT-082` migrated the pre-Claude-bakeoff follow-up and UI-polish work into
`.bandit/work-intake-ledger.json`. `WIL-UI-POLISH` is closed as `BANDIT-083`.
`WIL-CLAIM-FIRST` is closed as `BANDIT-084` with universal claim-first policy
deferred. `WIL-REPO-WIDE-TRANSITION-INDEX` is formed as `BANDIT-085`.
Remaining entries stay proposal-only until Repo PM forms them through normal
Stage 1 formation or records explicit dispositions; the Claude Product-Value
Trial stays deferred behind this lane.

- `[Gap]` `BANDIT-085` - Repo-Wide Transition Index Decision: determine whether a
  derived repo-wide transition index is justified for cockpit, heartbeat, or
  cross-work-item reporting; keep per-work-item ledgers canonical.
- `[Gap]` `TBD` - Coordination Primitive Completion Triage: compare the
  2026-05-24 coordination primitive follow-up against landed coordination-log
  and core-state work; queue only missing command/state-machine slices or
  explicit no-action decisions.
- `[Gap]` `TBD` - PR And CI/CD Landing Workflow Policy: define remote
  publication, PR workflow, CI checks, merge evidence, and deployment evidence
  before replacing local-record landing.
- `[Gap]` `TBD` - Installed-Copy Update Path: define preview, apply, verify,
  and rollback behavior for installed Bandit skills, automation prompts, and
  repo integration files.
- `[Slice]` `TBD` - V0 Closeout Claude Code A/B Product-Value Trial: compare
  the same PRD in Bandit and no-Bandit repos after the pre-Claude-bakeoff
  follow-up queue is formed or dispositioned; no statistical or public
  benchmark claim.

## Completed Work

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
