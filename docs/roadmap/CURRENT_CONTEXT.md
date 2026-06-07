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

`BANDIT-066` is landed and closed out. It delivered the first browser-served
Workflow Cockpit app shell and static preview while preserving CLI authority
and presentation-only browser state.

`BANDIT-067` is landed and closed out. It delivered the Live Cockpit Status
View From CLI Payload slice, including source-linked first-screen cues and a
full Stage 0-6 gate strip in the browser shell while preserving CLI authority
and presentation-only browser state.

`BANDIT-068` is active. It is the Phase 8 Evidence Drilldown And Gate Matrix
product slice. Stage 1 formation evidence, Work Item PM orchestration evidence,
Stage 2 RED evidence, Stage 3 Claude implementation evidence, Stage 4 aggregate
review evidence, CLI-owned product UAT evidence, Stage 5 landing verdict
evidence, and local-record landing action evidence are recorded under
`docs/work/BANDIT-068/`.

**Active work item:** `BANDIT-068` (landed; Stage 6 closeout required).

The current stage is Stage 6: closeout required.

**Current next action:** Record Stage 6 retrospective, improvement
disposition, and roadmap/status closeout for `BANDIT-068`.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. CLI-owned product UAT for
`BANDIT-068` is recorded under `docs/work/BANDIT-068/uat-approval.md`, the
landing verdict is recorded under `docs/work/BANDIT-068/landing-verdict.md`,
and local-record landing evidence is recorded under
`docs/work/BANDIT-068/landing-action.md`.
Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve business tradeoffs,
approve explicit cost/risk posture, choose local API shape, approve State Index
timing, approve guarded action execution authority, approve external service
setup, or make another policy/product decision repo artifacts cannot answer.

## Active Work

`BANDIT-066` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-066/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-066/landing-action.md`.

`BANDIT-067` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-067/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-067/landing-action.md`.

`BANDIT-068` has Stage 1 formation, Work Item PM orchestration, Stage 2 RED,
Stage 3 Claude implementation, Stage 4 review evidence, CLI-owned product UAT,
Stage 5 landing verdict evidence, and local-record landing action evidence
recorded under `docs/work/BANDIT-068/`.

The next allowed action is Stage 6 closeout for `BANDIT-068`. Do not start the
next Phase 8 slice, merge, push, deploy, Trust Verifier cutover, guarded
browser action execution, local API work, State Index work, scheduler
execution, claim execution, worktree execution, or unrelated Phase 8 scope
before retrospective, improvement disposition, and closeout evidence are
recorded.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` is resolved with disposition
`no_action`; no bootstrap gap is currently queued before the next Phase 8
cockpit product slice.

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
