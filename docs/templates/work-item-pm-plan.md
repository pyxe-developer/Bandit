# Work Item PM Plan-Mode Template

The Work Item PM plan-mode artifact lives at:

`docs/work/<WORK-ID>/orchestration-plan.md`

It is authored after `bandit work-item-pm start <WORK-ID>` confirms
`formation_approved` and current formation evidence, and before Stage 2 RED
evidence or broader orchestration begins. The plan is advisory orchestration
evidence only. It cannot replace the canonical brief, coordination history, RED
evidence, implementation evidence, review evidence, landing evidence,
retrospective evidence, roadmap, current-context, or bootstrap-gap authority.

`bandit work-item-pm start <WORK-ID>` fails closed when this artifact is missing
or under-scoped, and records an append-only `orchestration_plan_recorded`
coordination transition with `safe_triggers: ["red_evidence_required"]` once a
complete plan exists.

Every section below is required and must contain content grounded in current
repo artifacts.

## Current Repo State

Summarize the current repo state from the brief, coordination log, current
context, roadmap, and bootstrap-gap ledger. State the work type and the current
coordination state.

## Stage Sequence

List the stage-by-stage orchestration sequence (Stage 2 RED through closeout)
with the role accountable for each stage.

## Required Evidence

List the durable evidence artifact each stage must produce before the next stage
may begin.

## Role Boundaries

Restate the Repo PM, Work Item PM, Test Writer, Implementation Writer, Reviewer,
Landing Agent, and Closeout Agent boundaries, including the Permanent Test
Ownership Boundary and Bootstrap Model-Family Separation.

## Verification Commands

List the focused tests, typecheck, and `bandit` validation commands the slice
must run before it can proceed or land.

## Known Blockers

Record known blockers, open questions, and operator-owned input status, or state
that none are known.

## Stop Conditions

List the conditions under which orchestration must halt and report a blocker
instead of continuing.

## Forbidden Actions

List the out-of-scope surfaces and actions the slice must not touch, mirroring
the brief's out-of-scope boundaries and stage capability scope.
