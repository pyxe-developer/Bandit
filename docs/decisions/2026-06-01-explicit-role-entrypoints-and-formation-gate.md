# Explicit Role Entrypoints And Formation Gate

**Date:** 2026-06-01
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

Bandit workflow invocations require an explicit authority role.

The bare `/bandit` or bare `bandit` workflow entrypoint is deprecated and should
fail closed with a short role-required message. It must not hydrate roadmap,
gap, or work-item context and silently decide whether the current activation is
repo-level formation work or work-item execution.

Repo PM and Work Item PM are separate authority roles with separate skills,
recovery packets, and command surfaces:

- Repo PM Coordinator owns work formation: PRD decomposition, queued-gap
  replacement, work-item brief creation, work-item unblocking, formation
  review, formation repair, and repo-level roadmap, status, gap, intake, and
  final closeout state.
- Work Item PM Orchestrator owns execution orchestration for an already formed
  Work Item. It starts only after a brief exists and the Work Item has passed
  a Formation Gate. It may invoke Test Writer, Implementation Writer, Reviewer,
  Landing Agent, and Closeout subagents, but it does not write tests,
  implementation, reviewer findings, landing verdicts, or final repo-level
  closure.

A Work Item is not available to Work Item PM until the CLI records a
`formation_approved` step transition. That state is append-only coordination
history, not a mutable flag. It is backed by deterministic formation validation
and parallel Qwen plus CodeRabbit formation review evidence. Work Item PM reads
a compact execution packet derived from approved formation evidence rather than
defaulting to the full brief, raw reviewer output, or historical roadmap
context.

`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is a symptom of this broader
role-boundary problem. The next implementation work should replace that narrow
gap with `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` and implement the
first slice, `BANDIT-057 - Role Entry Points And Formation Gate`.

## Rationale

The previous single `/bandit` cold-start behavior made Codex ingest too much
global context for routine work-item execution. It also blurred several
authority boundaries: repo-level queue formation, Work Item execution
orchestration, Test Writer ownership, Implementation Writer ownership, Stage 4
repair routing, Landing Agent judgment, and final repo-level closeout.

The concrete failure was discovered during `BANDIT-056`: Stage 4 repair work
allowed Codex PM to edit implementation-owned source and Test Writer-owned test
coverage in one repair step. Repairing only that symptom would leave the
overloaded PM workflow intact. The root fix is to make work formation and work
execution separate, require formation approval before execution, and bind every
later subagent run to explicit authority, packet, and validation boundaries.

Formation quality is also cheaper to verify before Work Item PM starts. Repo PM
can run deterministic validation plus Qwen and CodeRabbit formation review in
parallel, repair or disposition findings, and expose only an approved execution
packet to Work Item PM. That keeps Work Item PM from spending tokens reviewing
brief quality, role contracts, scope shape, or operator-boundary decisions that
should already have been settled.

## Consequences

- Bare `/bandit` should become a role-required refusal rather than a dispatcher.
- `repo-pm` and `work-item-pm` need separate skills and compact recovery
  packets.
- Repo PM owns Work Item formation and final repo-level closure.
- Work Item PM owns execution orchestration between `formation_approved` and
  `retrospective_recorded`.
- `formation_approved` becomes a lifecycle state between `brief_created` and
  `red_recorded`.
- Formation review artifacts should live under the Work Item package:
  `qwen-formation-review.md`, `coderabbit-formation-review.md`, and
  `formation-review.md`.
- Deterministic formation validation plus Qwen and CodeRabbit formation review
  should pass before Work Item PM can start.
- Non-blocking formation findings are audit evidence and should not appear in
  Work Item PM default context.
- Work Item PM should consume generated execution and role input packets, not
  raw briefs, raw streams, or full roadmap history by default.
- Role contracts should be structured repo-native policy files; markdown skills
  and prompts are adapters checked against those contracts.
- Role Run Manifests should be CLI-generated, append-only per attempt, include
  `base_revision`, and validate writes by diff from that revision.
- Reads are audit-only by default; writes are enforced.
- Same-agent continuation is preferred for repairs owned by the same role, with
  artifact-based fallback when the subagent session is unavailable.
- Landing and closeout should be subagent calls, while Repo PM owns the final
  `closed` state and next-work availability.

## Not Decided

- Exact role-contract schema.
- Exact role-run manifest schema.
- Exact execution-packet and role-input-packet schemas.
- Exact command implementation for Qwen and CodeRabbit formation review.
- Whether the historical monolithic `STAGE_RUBRICS.md` is kept as source
  material after decomposed rubrics become authoritative.
