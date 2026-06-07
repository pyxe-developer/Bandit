# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-065` is landed and closed out. It delivered the Harness-Portable
Orchestrator Prompt Contract under
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.

Repo PM reviewed the remaining
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` source material on 2026-06-07
and recorded explicit no-action in `.bandit/bootstrap-gaps.json`. The
trust-layer-compatible role-scoped pieces are already landed through
`BANDIT-057`, `BANDIT-058`, and `BANDIT-065`; the remaining role input packet,
execution packet, live A2A, queue, scheduler, claim/worktree, repair
continuation, and landing/closeout handoff ideas are runtime/harness source
material outside Bandit's load-bearing deterministic CLI Trust Layer unless a
future product or trust-layer decision scopes them.

`BANDIT-066` is the active Work Item: Browser-Served Cockpit App Shell.
Stage 2 RED evidence, Stage 3 implementation/PM acceptance, and aggregate Stage
4 review evidence are recorded under `docs/work/BANDIT-066/`. Qwen and
CodeRabbit limitations are recorded as bootstrap replacement evidence where the
providers were unavailable or timed out; no independent reviewer pass is claimed
for those gates.

**Active work item:** `BANDIT-066`.

The current stage is Stage 4: Review recorded / UAT required before Stage 5.

**Current next action:** Record CLI-owned product UAT for `BANDIT-066` before
Stage 5 landing verdict.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

## Required Operator Input

CLI-owned product UAT is required before landing the operator-facing browser
shell. Halt for operator input if a future step would
approve Trust Verifier cutover policy, select a Trust Goal for cutover, replace
or wrap an older gate path, merge/push/deploy, change product or UAT direction,
approve business tradeoffs, approve explicit cost/risk posture, choose local
API shape, approve State Index timing, approve guarded action execution
authority, approve external service setup, or make another policy/product
decision repo artifacts cannot answer.

## Active Work

`BANDIT-066` is active with review evidence recorded. Do not start Stage 5
landing, closeout, or any next work item until CLI-owned product UAT is
recorded.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` is resolved with disposition
`no_action`; no bootstrap gap is currently queued before `BANDIT-066`.

`BANDIT-065` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-065/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-065/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION-ORCHESTRATOR-PROMPT` is resolved
by `BANDIT-065`; the gap ledger points to
`docs/work/BANDIT-065/retrospective.md`.

`BANDIT-064` is landed and closed out. It resolved
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`.

`BANDIT-063` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION`.
