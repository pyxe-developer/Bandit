# CLI Authority And Workflow Cockpit Decision

**Date:** 2026-05-24
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

The fresh harness repo will use **CLI Authority** with a lean **Workflow Cockpit**.

The CLI owns workflow state transitions, repo mutations, quality gates, permission enforcement, local model calls, GitHub/CodeRabbit integration, and evidence writes. The web app visualizes repo-backed state and triggers approved CLI commands, but it is not the source of truth and does not independently enforce workflow policy.

## Rationale

Mechanical enforcement needs direct control over files, commands, model invocations, test execution, Git state, and evidence artifacts. Those controls are naturally CLI-level.

The operator still needs a cockpit: backlog visibility, slice and chore status, review state, lessons learned, follow-ups, UAT readiness, and failure surfaces. A minimal web app can provide that without turning into a second task tracker or a separate agent runtime.

## Consequences

- The first implementation should keep the web app intentionally small.
- The CLI contract must be stable enough for the web app to call without duplicating rules.
- The web app may display and request actions, but the CLI validates and performs them.
- Repo artifacts remain the canonical record for workflow state and evidence.

## Not Decided

- Whether the web app and CLI live in one monorepo package or separate packages inside the same repo.
- Whether the web app reads repo artifacts directly or through a local API served by the CLI runtime.
- The minimum cockpit screens for v0.
