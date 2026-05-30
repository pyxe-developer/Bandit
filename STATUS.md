# Current Context

## Last Updated: 2026-05-30

## Current Work Item: BANDIT-054 - Stage Capability Scope

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff.

`BANDIT-053` is landed and closed out as the bootstrap-gap chore for `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES`. Its structured creation spec, Stage 1 brief, Stage 2 RED evidence, Stage 3 implementation command surface, passing pre-PR CodeRabbit Stage 4 evidence, Local Qwen non-blocking evidence with PM disposition, aggregate Stage 4 review evidence, Stage 5 landing verdict, local-record landing action, Stage 6 retrospective, and bootstrap-gap disposition are recorded.

`BANDIT-054` is active as the bootstrap-gap chore for `BANDIT-GAP-STAGE-CAPABILITY-SCOPE`. Stage 1 brief evidence is recorded in `docs/work/BANDIT-054/brief.md`, generated from `docs/specs/BANDIT-GAP-STAGE-CAPABILITY-SCOPE.json`. Stage 2 RED evidence is recorded in `test/stage-capability-scope.test.mjs`, `docs/specs/BANDIT-054-red-evidence.json`, and `docs/work/BANDIT-054/red-evidence.md`. Historical Claude Process Adapter dispatch blockers are recorded in `docs/work/BANDIT-054/writer-dispatch-blocker.md`.

Stage 3 implementation evidence is recorded in `docs/work/BANDIT-054/implementation-evidence.md`, `docs/specs/BANDIT-054-implementation-evidence.json`, and `docs/work/BANDIT-054/writer-report.md`. Current verification passes: focused Stage Capability Scope tests, work-item-create tests, typecheck, `bandit validate`, `git diff --check`, and the full `npm test` suite.

Stage 4 pre-PR CodeRabbit is blocked: focused provider attempts against the full `BANDIT-054` packet and the Stage 3 implementation delta timed out without a terminal verdict. Standard blocker evidence is recorded in `docs/specs/BANDIT-054-coderabbit-review-output.json` and `docs/work/BANDIT-054/coderabbit-review.md`.

Next action: rerun or disposition the `BANDIT-054` pre-PR CodeRabbit timeout before Local Qwen, risk-classification, supply-chain gate, aggregate review evidence, landing, closeout, or `BANDIT-055`. No operator-owned input is currently required.

This file is now part of Bandit's session-closeout workflow and should be
refreshed whenever the current work item, current status, next action, required
operator input, or last-five recent items change.

`ROADMAP.md` is concise and now separates blocking bootstrap gaps from deferred
PRD slices. Detailed history stays in completed work-item packages.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-054` - Stage Capability Scope (Stage 4 CodeRabbit timeout)
- `BANDIT-053` - Agent Observability Traces (closed)
- `BANDIT-052` - Event-Driven Wake Scheduler
- `BANDIT-051` - Worktree Bootstrap Contract
- `BANDIT-050` - Cockpit Status Interstitial Recovery
