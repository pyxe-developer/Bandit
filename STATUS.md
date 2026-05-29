# Current Context

## Last Updated: 2026-05-29

## Current Work Item: BANDIT-051

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff.

`BANDIT-051` is active as the bootstrap-gap chore for `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`. Stage 1 brief evidence is recorded, and the gap ledger links the gap to `BANDIT-051`.

The next required action is to dispatch Stage 3 implementation for `BANDIT-051` to Claude through the bootstrap Process Adapter path. Stage 2 RED evidence is now recorded in `docs/specs/BANDIT-051-red-evidence.json`, `docs/work/BANDIT-051/red-evidence.md`, and `test/worktree-bootstrap.test.mjs`; keep Stage 3 scoped to implementing `worktree-bootstrap validate` behavior only, without scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy, product UAT scope, or unrelated Phase 8 work.

No operator-owned input is required for the next recorded action.

This file is now part of Bandit's session-closeout workflow and should be
refreshed whenever the current work item, current status, next action, required
operator input, or last-five recent items change.

`ROADMAP.md` is concise and now separates blocking bootstrap gaps from deferred
PRD slices. Detailed history stays in completed work-item packages.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-051` - Worktree Bootstrap Contract
- `BANDIT-050` - Cockpit Status Interstitial Recovery
- `BANDIT-049` - Session Context Interstitial Recovery
- `BANDIT-048` - Focused Session Context Packets
- `BANDIT-047` - Bootstrap Model-Family Separation
