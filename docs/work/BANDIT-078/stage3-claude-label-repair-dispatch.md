# BANDIT-078 Stage 3 Claude Label Repair Dispatch

You are the Stage 3 Implementation Writer for BANDIT-078.

## Current State

Continue from the current dirty worktree. A MiniMax-M3 fallback repair timed out
after partially reconciling the view-model action shape.

Current focused verification from PM:

- `node --test test/cockpit-actions.test.mjs` passes.
- `node --test test/cockpit-ui.test.mjs` passes.
- `node --test test/cockpit-view-model.test.mjs` passes.
- `node --test test/cockpit-browser-shell.test.mjs` fails one subtest:
  `browser cockpit shell renders guarded request details with sources and unavailable routes`.

The browser-shell failure is label-only:

- Browser shell HTML expects `Validate repo` and `Review gate`.
- The older view-model fixture shape for `cockpitStatusFixture()` expects
  enumerable labels `Validate` and `Review Gate`.

## Authority

You may edit only:

- Source files needed for the browser-shell/view-model/action-affordance repair.
- `docs/work/BANDIT-078/writer-report.md`.

You must not edit:

- Tests, test helpers, fixtures, RED evidence, acceptance mappings.
- PM routing/status artifacts.
- Coordination logs.
- Review, landing, UAT, retrospective evidence.

## Required Outcome

Repair the source so all of these commands pass:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
node --test test/cockpit-view-model.test.mjs
npm run typecheck
npm test
```

Preserve:

- CLI request-only authority.
- The three false authority flags:
  `executes_in_browser`, `writes_repo_artifacts`, `mutates_workflow_state`.
- No browser execution, browser storage, artifact-write, or workflow-mutation authority.
- The older minimal enumerable action shape where the current passing
  view-model test requires it.
- Expanded guarded request metadata in browser-shell HTML.

If the label expectations cannot be reconciled through source-only repair
without fixture-specific hacks or hidden workflow authority, stop and update
`docs/work/BANDIT-078/writer-report.md` with a current blocker report that
names the failing commands and the exact contradictory expectations.

## Report

Update `docs/work/BANDIT-078/writer-report.md` before exiting. The report must
state whether the current result is `pass` or `blocker`, list changed files, and
include command results.
