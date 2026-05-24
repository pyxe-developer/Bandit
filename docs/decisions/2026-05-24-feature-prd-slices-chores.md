# Feature PRD, Slices, And Chores Decision

**Date:** 2026-05-24
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

The fresh harness repo will use this canonical work hierarchy:

```text
Feature PRD
  -> Slice
  -> Slice
  -> Chore
  -> Chore
```

Slices and chores are different work types and may have different workflows.

## Rationale

The operator wants planning to begin with a rigorous discovery and PRD flow, but implementation needs to stay small enough for reliable agent execution, TDD, review, CodeRabbit, and UAT.

Slices should represent product or behavior-changing implementation units. Chores should represent trust-layer maintenance, tooling, documentation, state repair, evidence refresh, cleanup, and continuous-improvement work.

Separating slices from chores keeps the cockpit legible and prevents operational work from being hidden as generic task noise.

## Heartbeat Direction

A chore-agent that runs on a heartbeat is an accepted design direction for eligible chores. It must remain under CLI Authority and should only run workflows that are safe without real-time operator involvement.

The exact heartbeat permission envelope is not yet decided.

## Consequences

- The Workflow Cockpit should show PRDs, slices, and chores as distinct surfaces.
- Slice workflows can require planning, TDD, quality gates, cross-check review, CodeRabbit, and UAT.
- Chore workflows can be lighter when risk is low, but still need evidence and clear done criteria.
- Heartbeat automation must be constrained by chore type, risk level, repo state, and permission policy.

## Not Decided

- Which chore types are heartbeat-eligible.
- Whether heartbeat chores can open PRs, commit changes, or only prepare proposed diffs.
- Whether heartbeat chores can run CodeRabbit automatically.
- How chore priority and scheduling are represented in repo-native state.
