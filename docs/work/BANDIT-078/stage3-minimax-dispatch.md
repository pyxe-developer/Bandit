# BANDIT-078 Stage 3 MiniMax Implementation Dispatch

## Assignment

You are the MiniMax-M3 Implementation Writer for `BANDIT-078`, invoked through
headless `pi`.

Claude-family Stage 3 dispatch satisfied the operator prompt's fallback
condition: the restored-auth full dispatch and the focused retry each timed out
after 900 seconds without source edits, Writer report, or implementation
evidence. The operator prompt explicitly authorizes MiniMax-M3 through headless
`pi` when Claude times out after 15 minutes.

Implement only the source changes needed to make the existing RED tests pass for
guarded CLI action requests. Do not edit tests or work-item evidence except for
your required Writer report.

## Read First

- `docs/work/BANDIT-078/brief.md`
- `docs/work/BANDIT-078/red-evidence.md`
- `docs/work/BANDIT-078/stage3-dispatch-short.md`
- `test/cockpit-actions.test.mjs`
- `test/cockpit-ui.test.mjs`
- `test/cockpit-browser-shell.test.mjs`
- `CLEAN_CODE.md`

## Required Source Work

1. Expand `src/state/cockpit-actions.ts` action records to include
   `command_preview`, `presentation_state`, `source`, `authority_owner`,
   `role_gate`, `operator_gate`, `unavailable_route`, `request_mode`, and the
   three false authority flags: `executes_in_browser`,
   `writes_repo_artifacts`, and `mutates_workflow_state`.
2. Preserve request-only CLI Authority. Browser-rendered actions must never
   execute commands, call APIs, write artifacts, use browser storage as
   workflow state, record UAT, decide landing safety, merge, push, deploy, or
   change policy.
3. Propagate the expanded action records through the existing cockpit view model
   and renderer without creating a new canonical state source.
4. Render guarded request details in the browser shell HTML: command previews,
   source links or paths, authority owner, role and operator gates, unavailable
   routes, `data-request-mode`, and `data-authority-owner`.
5. Keep the implementation local to the cockpit action, view-model, render, and
   browser shell surfaces unless a focused compile error requires a small
   adjacent type update.

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
