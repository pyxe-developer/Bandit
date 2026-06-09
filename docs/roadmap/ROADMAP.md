# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- `[Slice]` `BANDIT-081` - Operator Attention / Operator Inbox Surface (closed)

## Current Work Item

- None active; `BANDIT-081` remains the active derived-status anchor until the
  next slice is formed.

**Current next step:** Repo PM should form the Work Intake Ledger And Followups
Migration slice first, preserving `FOLLOWUPS.md` source metadata and queueing
the triaged follow-up and UI-polish work items before the V0 Closeout Claude
Code A/B Product-Value Trial.

Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace
or wrap old gates, generate role input or execution packets for unrelated work,
restart Pi/Aperture runtime work, choose local API or State Index timing,
execute guarded browser actions, approve public benchmark publication, approve
paid reviewer/model routing, approve hosted replay services or external service
setup, merge, push, deploy, or start unrelated Phase 8 product work without
separate authorization and evidence.

Local Qwen reviewer routing must use `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint.
The direct `qwen` CLI is not an authorized Bandit reviewer path.

## Next Work Item

- `[Slice]` `TBD` - Work Intake Ledger And Followups Migration

## Planned Work

### Blocking Gaps

- None currently open in `.bandit/bootstrap-gaps.json`.

### Phase 8 Product Queue

The first seven entries are pre-Claude-bakeoff follow-up and UI-polish work; the
Claude Product-Value Trial stays deferred behind this lane.

- `[Slice]` `TBD` - Work Intake Ledger And Followups Migration: migrate
  `FOLLOWUPS.md` into a single intake/roadmap lane with preserved source
  metadata; deprecate the standalone follow-up surface after validation proves
  each entry has an outcome.
- `[Slice]` `TBD` - Bandit Cockpit UI Polish From Attached Design: adapt the
  attached three-pane Evidence Row cockpit design while preserving CLI
  authority, repo-native source links, browser read-only boundaries, and normal
  UAT/review/landing evidence.
- `[Gap]` `TBD` - Claim-First Transition Policy Triage: decide whether every
  post-bootstrap step transition requires an explicit actor claim, using landed
  coordination-log and CAS claim-authority evidence; record policy, follow-up
  scope, or no-action.
- `[Gap]` `TBD` - Repo-Wide Transition Index Decision: determine whether a
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
  follow-up queue is formed or dispositioned; no statistical or public benchmark
  claim.

## Completed Work

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
