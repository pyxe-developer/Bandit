# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / True-Agent Harness Pivot.

`BANDIT-058` is landed and closed out. It delivered the Role Contracts And Run
Manifests slice under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` with
Stage 1 brief evidence, Formation Gate approval, Test Writer RED evidence,
Claude Implementation Writer evidence, CodeRabbit repair evidence, Local Qwen
review and PM disposition, aggregate Stage 4 review evidence, Stage 5
landing-gate evidence, local-record landing action evidence, and Stage 6
retrospective/improvement/gap disposition evidence.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open, but normal
Stage 1-6 Process Adapter bootstrap slice execution is paused by
`docs/decisions/2026-06-01-true-agent-harness-pivot.md`. The previously queued
Execution And Role Input Packets follow-on is no longer the next action until
the True-Agent Harness Pivot is resolved.

**Active work item:** none.

The Pi/Aperture Agent Scope and Harness Spike Plan is recorded at
`docs/spikes/pi-aperture-agent-scope-and-harness-spike.md`.

**Current next action:** Implement the first Pi/Aperture Harness Spike step:
add repo-native agent scope schema/policy plus projection validation for Pi and
Aperture before any live proof run or normal adapter-loop bootstrap slice
resumes.

The current stage is Stage 0 context readiness / interstitial queue selection:
no work item is active, `BANDIT-058` has landing action and Stage 6 closeout
evidence, the spike plan is recorded, and the next action is Codex-owned
Pi/Aperture agent-scope schema/policy and projection validation. Do not create
RED evidence, implementation branches, Work Item PM active context, a normal
Execution And Role Input Packets work item, a live proof run, or unrelated
cockpit product work until the repo-native agent scope foundation is recorded.

## Active Work

**Active work item:** none.

`BANDIT-058` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-058/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-058/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material for the
assembly-line design, but the next bounded slice is paused. The accepted proof
shape is recorded in
`docs/spikes/pi-aperture-agent-scope-and-harness-spike.md`: a Pi/Aperture
Harness Spike rather than a normal Bandit Stage 1-6 Process Adapter slice. The
selected direction is Pi for the harness plane and Aperture by Tailscale for
the model plane. The agent scopes must be recorded before the spike runs, and
the spike must prove that Work Item PM can orchestrate a whole tiny non-product
slice in one durable session by calling scoped agents. If the spike passes,
Bandit moves to Harness-Native Build Continuation on Pi with Aperture.

## Priority

1. Add repo-native agent scope schema/policy plus projection validation for Pi
   and Aperture from the recorded spike plan.
2. Scope all authority-bearing Bandit agents for Pi with Aperture before the
   spike runs.
3. Prove Work Item PM Single-Session Slice Orchestration through Aperture
   guardrails and telemetry on a tiny non-product whole-slice proof before any
   normal adapter-loop bootstrap slice resumes.
4. Keep unrelated Phase 8 cockpit product work and Execution And Role Input
   Packets work-item creation blocked while the harness pivot is unresolved.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next step
is Codex-owned technical implementation of repo-native Pi/Aperture agent scope
schema/policy and projection validation, not a product, UAT, policy, business,
cost, or ambiguous scope decision.
