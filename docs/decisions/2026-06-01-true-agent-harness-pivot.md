# True-Agent Harness Pivot

**Date:** 2026-06-01
**Status:** Partially superseded by `docs/decisions/2026-06-02-pi-config-canonical-agent-taxonomy.md`
**Participants:** Matt Flebbe, Codex

## Decision

Bandit will pause normal Stage 1-6 Process Adapter bootstrap slice execution until a true-agent harness path is selected or proven.

The selected direction is a combination of Pi and Aperture by Tailscale:

- Pi is the harness plane: it owns True Agent identity, scoped permissions, controlled context, lifecycle, and bidirectional agent-to-agent handoffs.
- Aperture is the model plane: it owns provider routing, provider-key custody, identity-bound model-call telemetry, quotas, cost controls, and exportable model-call evidence.
- Aperture guardrails are model-plane enforcement hooks: they inspect requests before upstream provider submission and may allow, block, or modify the request body, including unauthorized model-plane tool declarations.
- The first proof is a Pi/Aperture Harness Spike, not a normal Bandit Stage 1-6 Process Adapter slice.
- The spike must prove Single-Session Slice Orchestration: a Work Item PM Orchestrator keeps one slice context alive while calling scoped agents to do their work.
- Bandit will scope all authority-bearing agents in repo-native artifacts before running that spike; Pi configuration is a generated or mirrored projection of those scopes, not the canonical source.
- The minimum proof is a tiny non-product slice, possibly artifact-only, but it must exercise the full Work Item PM choreography through Test Writer, Implementation Writer or Execution Worker, Reviewer, Landing Agent, and Closeout or Retrospective agents.
- If the spike passes, Bandit will continue the build on that substrate.

Only narrow, low-token repo-state repair is allowed while the pivot is unresolved: record the pivot, make the paused state visible, supersede or block the current adapter-workflow continuation, and define harness requirements. Bandit must not create the next Execution And Role Input Packets work item or continue normal role-scoped orchestration implementation through the current Codex-plus-subprocess loop.

## Rationale

Bandit's glossary defines a True Agent as harness-managed. Codex, Claude, Qwen, and CodeRabbit subprocess paths are Process Adapters, not True Agents. Continuing to add role packets, manifests, and handoff surfaces inside the adapter loop does not solve the runtime problem and has already produced incoherent token burn across single slices.

The specific failure mode is cold-start-per-stage orchestration: a PM activation does exactly one next step, stops, and a later activation spends large context and token budget rediscovering the same slice. The harness must let Work Item PM orchestrate the whole slice in one durable session, calling scoped Test Writer, Implementation Writer or Execution Worker, Reviewer, Landing Agent, and Closeout or Retrospective agents as needed.

The operator rejected another adapter-workflow slice as a dead end. The correction is to stop treating Codex as the agent runtime and move to a harness decision path before continuing first-class agent work.

Aperture is not the harness. It is the model-call boundary adapter for the selected path. Bandit still owns workflow authority, repo-native evidence, boundary logic, escape detection, and landing decisions.

Aperture guardrails strengthen the model-plane half of the split because they can enforce pre-provider policies at the gateway: hard blocking, PII scrubbing, tool declaration removal, or request rewriting can happen before data leaves the network. This is request-time tool exposure control, not local tool execution control. Pi/Bandit must still block filesystem writes, shell commands, child-agent dispatch, and repo mutations at the harness/tool layer before those side effects happen. Asynchronous integration hooks remain observability or audit surfaces; they do not satisfy pre-provider enforcement or local tool execution enforcement.

Day-one technical policy:

- Fail closed for missing or invalid agent/run/work-item attribution.
- Fail closed for context outside the Pi-granted scope.
- Fail closed for unauthorized model-plane tool declarations or capability requests.
- Fail closed for unauthorized model or provider routing.
- Fail closed for hard budget or quota violations.
- Fail closed for detected secrets, credentials, or PII that would leave the network.
- Fail open only for advisory classification, metadata enrichment, analytics, and other non-authoritative observations.
- Modify only for deterministic scrubbing, deterministic model-plane tool declaration removal, or normalization of already-authorized metadata. Do not fabricate missing attribution or authority metadata; block instead.
- Chain mandatory guardrails before advisory guardrails. The mandatory chain order is attribution, Pi scope, model-plane tool declaration/capability allowlist, secret/PII scrub-or-block, model/provider policy, then budget/quota.

## Consequences

- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains useful source material, but its next Execution And Role Input Packets slice is paused.
- Normal bootstrap slice execution is blocked until the harness-pivot path is resolved.
- The Pi/Aperture Agent Scope and Harness Spike Plan is recorded at `docs/spikes/pi-aperture-agent-scope-and-harness-spike.md`; it is the source artifact for the next harness-native work, not a vague brief.
- The next implementation work is the plan's first step: add repo-native agent scope schema/policy plus projection validation for Pi and Aperture before any live proof run starts.
- The Pi/Aperture proof must distinguish model-plane guardrail enforcement from Bandit workflow authority: guardrail telemetry is evidence, not a landing or gate verdict.
- The Pi/Aperture proof must distinguish Aperture's request-time tool declaration blocking from Pi/Bandit's local tool execution blocking.
- The first Pi/Aperture proof must include at least one fail-closed guardrail for attribution or scope and one fail-open advisory hook so the split between enforcement and observation is testable.
- The Pi/Aperture Agent Scope Plan must live in this repository and cover Repo PM, Work Item PM, Test Writer, Implementation Writer or Execution Workers, Reviewer, Landing Agent, Closeout or Retrospective, and Heartbeat Chore Agent before the spike runs.
- Pi setup may import, mirror, or generate configuration from those repo-native scopes, but a Pi-only dashboard or external config cannot be the source of truth for Bandit agent authority.
- A passing Pi/Aperture Harness Spike must show Work Item PM calling scoped agents for a whole slice-shaped workflow while preserving context, A2A handoffs, guardrail telemetry, and repo-artifact reconciliation.
- A partial proof that skips Test Writer, Implementation Writer or Execution Worker, Reviewer, Landing Agent, or Closeout or Retrospective does not satisfy the harness proof, even if the artifact change is tiny.
- After the agent scopes are recorded, the next build work continues on Pi with Aperture rather than returning to the Codex-plus-subprocess adapter loop.
- Existing role-packet, manifest, execution-packet, repair-continuation, landing, and closeout ideas must be re-scoped as harness-native Pi/Aperture work before implementation resumes.
- Existing role contracts, manifests, formation gates, and role-scoped design records remain prior evidence, not the next implementation queue.
