# Current Context

## Last Updated: 2026-05-30

## Current Work Item: BANDIT-054 - Stage Capability Scope

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff.

`BANDIT-053` is landed and closed out as the bootstrap-gap chore for `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES`. Its structured creation spec, Stage 1 brief, Stage 2 RED evidence, Stage 3 implementation command surface, passing pre-PR CodeRabbit Stage 4 evidence, Local Qwen non-blocking evidence with PM disposition, aggregate Stage 4 review evidence, Stage 5 landing verdict, local-record landing action, Stage 6 retrospective, and bootstrap-gap disposition are recorded.

`BANDIT-054` is active as the bootstrap-gap chore for `BANDIT-GAP-STAGE-CAPABILITY-SCOPE`. Stage 1 brief evidence is recorded in `docs/work/BANDIT-054/brief.md`, generated from `docs/specs/BANDIT-GAP-STAGE-CAPABILITY-SCOPE.json`. Stage 2 RED evidence is recorded in `test/stage-capability-scope.test.mjs`, `docs/specs/BANDIT-054-red-evidence.json`, and `docs/work/BANDIT-054/red-evidence.md`. Codex PM prepared `docs/work/BANDIT-054/dispatch.md` and recorded a Claude Process Adapter dispatch blocker in `docs/work/BANDIT-054/writer-dispatch-blocker.md` after three silent no-edit attempts and one repaired verbose stream-json attempt that hung before `end_turn`, implementation edits, or `writer-report.md`.

The next required action is to diagnose the Claude Process Adapter Stage 3 hang from the attempt-4 raw evidence before rerunning `BANDIT-054`. The Stage 3 Writer must not edit tests, test helpers, fixtures, RED evidence artifacts/specs, or acceptance mappings.

No operator-owned input is required for the next recorded action.

This file is now part of Bandit's session-closeout workflow and should be
refreshed whenever the current work item, current status, next action, required
operator input, or last-five recent items change.

`ROADMAP.md` is concise and now separates blocking bootstrap gaps from deferred
PRD slices. Detailed history stays in completed work-item packages.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-054` - Stage Capability Scope (active; Stage 3 dispatch blocked on Claude Process Adapter hang)
- `BANDIT-053` - Agent Observability Traces (closed)
- `BANDIT-052` - Event-Driven Wake Scheduler
- `BANDIT-051` - Worktree Bootstrap Contract
- `BANDIT-050` - Cockpit Status Interstitial Recovery
