# BANDIT-078 Stage 3 MiniMax View-Model Repair Dispatch

## Assignment

You are the MiniMax-M3 Implementation Writer for `BANDIT-078`, invoked through
headless `pi` for a focused Stage 3 repair.

The prior MiniMax repair created `docs/work/BANDIT-078/writer-report.md` and
made these focused commands pass:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

PM verification then widened to the brief-required adjacent view-model and full
test surface. These commands fail:

```sh
node --test test/cockpit-view-model.test.mjs
npm test
```

The only observed failures are the two existing `test/cockpit-view-model.test.mjs`
deep-equality assertions against `deriveCockpitActionAffordances()` and
`viewModel.action_affordances` for `cockpitStatusFixture()`.

## Failure Summary

`test/cockpit-view-model.test.mjs` still expects the older minimal enumerable
guarded action shape for `cockpitStatusFixture()`:

- `validate_repo`: `id`, `label: "Validate"`, `command_family`, `enabled`,
  `reason`.
- `run_review_gate`: `id`, `label: "Review Gate"`, `command_family`,
  `enabled`, `reason`.
- `record_uat`: `id`, `label: "Record UAT"`, `command_family`, `enabled`,
  `reason`.

The BANDIT-078 RED tests in `test/cockpit-actions.test.mjs` expect the expanded
guarded action shape for `liveCockpitStatusFixture()`:

- `command_preview`
- `presentation_state`
- `source`
- `authority_owner`
- `role_gate`
- `operator_gate`
- `unavailable_route`
- `request_mode`
- `executes_in_browser: false`
- `writes_repo_artifacts: false`
- `mutates_workflow_state: false`

The browser/UI tests also require the expanded metadata to remain readable by
normal property access for default-derived controls and enumerable for explicit
pre-derived action affordances.

## Required Repair

Repair source only so all of these commands pass:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
node --test test/cockpit-view-model.test.mjs
npm run typecheck
npm test
```

Preserve all of the following:

1. The expanded BANDIT-078 guarded action metadata contract for
   `liveCockpitStatusFixture()` and current/live cockpit payloads.
2. The older minimal enumerable guarded action shape expected by
   `test/cockpit-view-model.test.mjs` for `cockpitStatusFixture()`.
3. Readability of expanded metadata through normal property access for
   default-derived controls.
4. Fully enumerable expanded metadata for explicitly pre-derived action
   affordances in `test/cockpit-ui.test.mjs`.
5. Browser shell HTML guarded request details:
   `data-request-mode`, `data-authority-owner`, command previews, source
   links, owner/role/operator gates, and unavailable routes.
6. CLI request-only authority and the three false authority flags.

If these test expectations cannot be reconciled through source-only repair
without fixture-specific hacks or hidden workflow authority, stop and update
`docs/work/BANDIT-078/writer-report.md` with a blocker. Do not edit any test or
Test Writer-owned evidence to make the tests pass.

## Allowed Writer Edits

- Source files needed for the cockpit action/view-model/render/browser-shell
  repair.
- `docs/work/BANDIT-078/writer-report.md`, to update verification, files
  changed, clean-code notes, and blockers/incomplete items.

## Forbidden Writer Actions

- Do not create, edit, format, regenerate, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence,
  roadmap/current-context/status routing, coordination logs, or PM review
  artifacts.
- Do not implement local API, live polling, State Index, guarded action
  execution, scheduler, claim/worktree behavior, PR/CI, merge, push, deploy,
  external services, Trust Verifier cutover, dependencies, lockfile changes, or
  unrelated cockpit scope.

## Required Output

Update `docs/work/BANDIT-078/writer-report.md` with:

- whether this repair passes or blocks;
- files changed;
- source-only reconciliation approach or blocker rationale;
- verification commands and results;
- confirmation that no Test Writer-owned surfaces were edited;
- clean-code notes.
