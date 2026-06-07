# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Current Work Item

- `[Gap]` `BANDIT-069` - Test Strength / Mutation Adequacy Gate
  (formation approved)

**Current next step:** Run Work Item PM plan-mode orchestration for
`BANDIT-069` before RED evidence.

Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace
or wrap old gates, generate role input or execution packets, restart
Pi/Aperture runtime work, choose local API or State Index timing, execute
guarded browser actions, merge, push, deploy, or start unformed work without
separate authorization and evidence.

Local Qwen reviewer routing must use `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint.
The direct `qwen` CLI is not an authorized Bandit reviewer path.

## Next Work Item

- `[Gap]` `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` - Verification
  Oracle Provenance Gate (queued after `BANDIT-069` is landed/closed or
  explicitly dispositioned)

## Planned Work

### Blocking Gaps

- `[Gap]` `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` - Risk-tiered
  assertion-adequacy and mutation/property/adversarial test-strength gate for
  critical deterministic trust-layer surfaces, active as `BANDIT-069`.
- `[Gap]` `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` - Oracle provenance
  gate requiring covered pass/trusted/ready claims to name the evidence oracle
  and reject circular self-attestation, queued behind active `BANDIT-069`.
- `[Gap]` `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` - Private installable
  distribution and CLI update notification channel, queued behind the
  oracle-provenance gate unless explicitly reprioritized.
- `[Gap]` `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` - Replay-only corpus of known
  Bandit workflow failures, queued behind the private install/update channel.
- `[Gap]` `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` - Deterministic gate output,
  stable hashes, and explicit flake/provider-dependence dispositions, queued
  behind the replay corpus.
- `[Gap]` `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` - Cross-projection
  agreement and harmless-perturbation checks for derived trust surfaces, queued
  behind the determinism gate.
- `[Gap]` `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` - Replay-only seeded
  blocker and non-issue packets for reviewer calibration, queued behind
  cross-projection checks.
- `[Gap]` `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` - Full evidence bundle
  hashing for landing and trusted-verdict evidence, queued behind reviewer
  calibration.
- `[Gap]` `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` - Acceptance
  criterion to verification artifact traceability, queued behind evidence bundle
  attestation.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` is resolved with disposition
`no_action` after Repo PM review.

### Phase 8 Product Queue

- `[Slice]` `TBD` - Guarded CLI Action Requests
- `[Slice]` `TBD` - Improvement Health Surface

## Completed Work

- `BANDIT-068` - Evidence Drilldown And Gate Matrix
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
- `BANDIT-059` - Trust Verify Snapshot Foundation
- `BANDIT-060` - Artifact Input Directory Split
- `BANDIT-061` - Role Contract Artifact Input Write Surface
- `BANDIT-062` - Work Item Create Replacement Metadata Preservation
- `BANDIT-063` - Work Item PM Plan Mode Orchestration Gate
- `BANDIT-064` - Trust Verifier Cutover Gate Triage
- `BANDIT-065` - Harness-Portable Orchestrator Prompt Contract
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - no-action disposition for remaining runtime/harness source material
- `BANDIT-066` - Browser-Served Cockpit App Shell
- `BANDIT-067` - Live Cockpit Status View From CLI Payload
