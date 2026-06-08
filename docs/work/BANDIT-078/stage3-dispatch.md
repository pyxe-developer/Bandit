# BANDIT-078 Stage 3 Implementation Dispatch

## Assignment

Implement the `BANDIT-078` guarded CLI action request surface as Claude-family
Implementation Writer.

## Source Authority

- `docs/work/BANDIT-078/brief.md`
- `docs/work/BANDIT-078/orchestration-plan.md`
- `docs/work/BANDIT-078/red-evidence.md`
- `docs/artifact-inputs/BANDIT-078-red-evidence.json`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`

## Required Implementation Scope

- Update the cockpit action affordance boundary so request records include:
  action id, label, command family, command preview, enabled state,
  presentation state, reason, source label/path, authority owner, role gate,
  operator gate, unavailable route, `request_mode: cli_request_only`, and
  explicit no-browser-execution/no-repo-write/no-workflow-mutation booleans.
- Update cockpit shell rendering so guarded request metadata is preserved in
  the render model and visible or source-linked in browser HTML.
- Preserve CLI Authority: the browser may render request affordances but must
  not execute commands, call an API, write artifacts, record UAT, decide landing
  safety, merge, push, deploy, or change policy.
- Keep the implementation small and local to the cockpit action/view-model,
  render, browser-shell, and static preview generation surfaces needed to pass
  the RED tests.

## Forbidden Writer Actions

- Do not create, edit, delete, regenerate, format, or mechanically adjust:
  tests, test helpers, fixtures, RED evidence, acceptance mappings, formation
  evidence, review evidence, landing evidence, UAT evidence, retrospective
  evidence, roadmap/current-context/status routing, or coordination logs.
- Do not implement local API, live polling, State Index, guarded action
  execution, scheduler, claim/worktree behavior, PR/CI, merge, push, deploy,
  external services, Trust Verifier cutover, or unrelated cockpit scope.
- Do not add dependencies, lockfile changes, package-manager script changes, or
  paid provider/model routing.

## Required Verification

Run and report:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

If implementation touches shared cockpit state beyond the narrow surfaces, also
run the related focused tests and report them.

## Required Output

Create `docs/work/BANDIT-078/writer-report.md` summarizing:

- files changed;
- how the RED contract was satisfied;
- verification commands and results;
- confirmation that no Test Writer-owned surfaces were edited;
- clean-code notes;
- any blocker or incomplete item.
