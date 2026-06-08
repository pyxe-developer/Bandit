# BANDIT-078 Stage 3 MiniMax Repair Dispatch

## Assignment

You are the MiniMax-M3 Implementation Writer for `BANDIT-078`, invoked through
headless `pi` for a focused repair follow-up.

Your prior MiniMax-M3 run edited source files but exited with code `124` after
900 seconds and did not create `docs/work/BANDIT-078/writer-report.md`.

## Current State

Passing:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

Failing:

```sh
node --test test/cockpit-ui.test.mjs
```

Failure summary:

- `shell.controls.find((control) => control.id === "run_review_gate")` for the
  fixture/default shell is expected to preserve the legacy minimal rendered
  control object and label `Review Gate`.
- The current implementation returns the expanded guarded metadata object for
  that legacy assertion and uses `Review gate`.
- The later pre-derived action-affordance test still expects expanded guarded
  metadata when action affordances explicitly include it.

## Required Repair

1. Repair source only so all focused tests pass.
2. Preserve expanded action affordance metadata in
   `src/state/cockpit-actions.ts`.
3. Preserve browser shell HTML guarded request details:
   `data-request-mode`, `data-authority-owner`, command previews, source
   links, owner/role/operator gates, and unavailable routes.
4. Preserve the existing `shell.controls` minimal legacy shape for default
   derived controls where the older accessibility test expects it, while still
   exposing expanded metadata for explicitly pre-derived action affordances as
   required by the later test.
5. Preserve CLI request-only authority and the three false authority flags.

## Forbidden Writer Actions

- Do not create, edit, format, regenerate, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence,
  roadmap/current-context/status routing, or coordination logs.
- Do not implement local API, live polling, State Index, guarded action
  execution, scheduler, claim/worktree behavior, PR/CI, merge, push, deploy,
  external services, Trust Verifier cutover, dependencies, lockfile changes, or
  unrelated cockpit scope.

## Verification

Run and report:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

## Required Output

Create `docs/work/BANDIT-078/writer-report.md` with:

- files changed;
- RED contract satisfied;
- verification commands and results;
- confirmation that no Test Writer-owned surfaces were edited;
- clean-code notes;
- blockers or incomplete items, if any.
