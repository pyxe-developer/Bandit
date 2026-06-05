# Pi Config Owns Canonical Bandit Agent Taxonomy

**Date:** 2026-06-02
**Status:** Superseded by `docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`
**Participants:** Matt Flebbe, Codex
**Supersedes:** The taxonomy-source portion of `docs/decisions/2026-06-01-true-agent-harness-pivot.md`

## Decision

Bandit will define its canonical harness-native agent taxonomy in Pi configuration.

The canonical agents are Bandit's named agents: Repo PM Coordinator, Work Item PM Orchestrator, Test Writer, Implementation Writer / Execution Worker, Reviewer, Landing Agent, and Closeout / Retrospective Agent. Repo PM Coordinator is not an outside exception; Codex or the operator may launch or supervise it, but its role definition belongs in Pi config with the other Bandit agents.

This supersedes the earlier plan that repo-native `.bandit/` agent-scope artifacts would define the canonical agent taxonomy and generate Pi projections. The next slice is a pivot slice: it should make Pi config the taxonomy source and make Bandit repo artifacts bind those Pi-defined Bandit agents to workflow authority, evidence, gates, write surfaces, model-plane guardrails, telemetry joins, and landing state.

## Rationale

The harness pivot is meant to stop inventing an adapter-loop agent model inside Bandit. If Pi is the harness plane, Bandit's named agents should be configured in Pi as the canonical harness-native role vocabulary instead of being defined elsewhere and projected into Pi after the fact.

Bandit still owns workflow authority. Pi config names the canonical Bandit agents; Bandit repo-native state remains canonical for work-item state, evidence, gate verdicts, role authority bindings, validation, and landing or closeout outcomes.

## Consequences

- The next slice should replace "repo-native scopes generate Pi config" with "Pi config defines taxonomy; Bandit validates and binds it."
- `.bandit/` policy artifacts remain required, but their role is binding, validation, evidence reconciliation, and authority enforcement rather than defining the canonical harness role taxonomy.
- Existing role contracts, manifests, and spike plans must be re-scoped around Pi-defined Bandit agents, not Pi's unconfigured default subagent names.
- Repo PM Coordinator must be represented in Pi config before the proof starts.
- Work Item PM Orchestrator owns the durable parent session for Stage 2-6 whole-slice orchestration after formation approval; Repo PM Coordinator owns formation, blocker amendment, final repo-level closure, and next-work availability.
- Any Pi-only role configuration that affects Bandit authority must still be reconciled into repo-native evidence before it can satisfy a Bandit gate.
