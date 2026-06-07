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

`BANDIT-067` has Stage 5 landing verdict evidence recorded as safe-to-land for
Live Cockpit Status View From CLI Payload. Its brief, formation review evidence,
Work Item PM plan-mode orchestration evidence, Test Writer-owned RED evidence,
Claude implementation evidence, Writer report, PM acceptance review, reviewer
bootstrap replacement evidence, layered risk classification, supply-chain gate,
aggregate review evidence, UAT approval, and landing verdict are recorded under
`docs/work/BANDIT-067/` and `.bandit/policy/`. No independent CodeRabbit or
Local Qwen pass is claimed because those providers were unavailable or timed
out.

**Active work item:** `BANDIT-067`.

The current stage is Stage 5: Landing action required.

**Current next action:** Run the local-record landing action for `BANDIT-067` and record landing action evidence.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

## Required Operator Input

No operator-owned input is required for the current orchestration step. Halt for
operator input if a future step would
approve Trust Verifier cutover policy, select a Trust Goal for cutover, replace
or wrap an older gate path, merge/push/deploy, change product or UAT direction,
approve business tradeoffs, approve explicit cost/risk posture, choose local
API shape, approve State Index timing, approve guarded action execution
authority, approve external service setup, or make another policy/product
decision repo artifacts cannot answer.

## Active Work

`BANDIT-066` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-066/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-066/landing-action.md`.

`BANDIT-067` is the active Phase 8 Live Cockpit Status View From CLI Payload
slice. Its source spec is
`docs/specs/BANDIT-067-live-cockpit-status-view-from-cli-payload.json`; its
brief, formation review artifacts, `formation_approved`,
`orchestration_plan_recorded`, `red_recorded`, `implementation_recorded`,
`review_recorded`, `feature_uat_approved`, and `landing_verdict_recorded`
coordination transitions are recorded under `docs/work/BANDIT-067/`.

The next allowed action is to run land-check, auto-land-check, and the
local-record landing action for `BANDIT-067` if checks pass. Do not merge, push,
deploy, start the next work item, approve Trust Verifier cutover, guarded
browser action execution, local API work, State Index work, scheduler
execution, claim execution, worktree execution, or unrelated Phase 8 scope
before landing action evidence is recorded.

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
