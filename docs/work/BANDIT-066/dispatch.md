# BANDIT-066 Stage 3 Claude Implementation Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-066`. Codex authored
Stage 2 RED tests, so Bootstrap Model-Family Separation requires Claude to own
source implementation.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-066/brief.md`
- `docs/work/BANDIT-066/orchestration-plan.md`
- `docs/work/BANDIT-066/red-evidence.md`
- `test/cockpit-browser-shell.test.mjs`
- `test/cockpit-ui.test.mjs`
- `test/cockpit-view-model.test.mjs`
- `src/cockpit/render.ts`
- `src/state/cockpit-view-model.ts`
- `src/state/cockpit-actions.ts`

## Task

Implement the missing browser-served Workflow Cockpit app shell boundary.

Expected implementation surfaces:

- `src/cockpit/browser-shell.ts`
- `public/cockpit/index.html` if needed for a local static preview entrypoint
- `public/cockpit/cockpit.css` if needed for a local static preview stylesheet
- `package.json` only if a narrow static preview command is needed
- `docs/work/BANDIT-066/writer-report.md`
- `docs/work/BANDIT-066/implementation-evidence.md`

Implement only the smallest surface needed to satisfy the approved brief and
focused RED tests. Reuse the existing `renderCockpitShell`,
`buildCockpitViewModel`, and action affordance boundaries where possible.

## Required Behavior

- `test/cockpit-browser-shell.test.mjs` passes.
- The public browser shell module exports `renderBrowserCockpitShell(viewModel,
  viewport)`.
- The returned shell describes a local static preview document:
  `kind: "browser_served_cockpit_shell"`,
  `authority: "presentation_derived_non_canonical"`,
  `preview_path: "public/cockpit/index.html"`, and asset metadata that includes
  `public/cockpit/cockpit.css`.
- The HTML document renders the actual cockpit as the first screen: attention
  category navigation, active work/next action, evidence/source traceability,
  and guarded CLI-backed action buttons with disabled reasons.
- The browser layer consumes typed cockpit presentation data. It must not parse
  repo-native artifacts directly, mutate repo state, execute CLI commands,
  infer UAT approval, decide landing safety, or hide canonical authority in
  browser/app state.
- The shell excludes mutation forms, browser storage, live API calls, merge,
  push, deploy, policy override, Trust Verifier cutover, or hidden workflow
  mutation behavior.
- The shell exposes responsive and accessibility constraints for desktop and
  mobile widths, including source-path wrapping, no text overflow, no overlaps,
  semantic landmarks, focus order, disabled button semantics, and focus-visible
  styling.

## Forbidden Actions

- Do not edit `test/cockpit-browser-shell.test.mjs`,
  `test/cockpit-ui.test.mjs`, `test/cockpit-view-model.test.mjs`, test helpers,
  fixtures, RED evidence, acceptance mappings, formation evidence, review
  evidence, UAT evidence, landing evidence, or retrospective evidence.
- Do not implement live CLI invocation, local API endpoints, server-side
  workflow actions, State Index persistence, SQLite, cross-repo aggregation,
  scheduler execution, claims, work-surface reservations, worktree lifecycle,
  PR/CI orchestration, automatic merge, push, deploy, production canary
  behavior, external service setup, Trust Verifier cutover, old-gate
  replacement or wrapping, or unrelated Phase 8 cockpit features.
- Do not add dependencies or lockfile changes.
- Do not let browser storage, generated UI state, fixture data, a local server
  process, a local cache, or web component state become canonical workflow
  state.

## Verification

Run at minimum:

```sh
node --test test/cockpit-browser-shell.test.mjs
node --test test/cockpit-ui.test.mjs test/cockpit-view-model.test.mjs
npm run typecheck
git diff --check
```

If you touch shared cockpit status, action eligibility, command routing,
package scripts, validation, or broader shared state behavior, run adjacent
focused tests or `npm test` as needed.

## Evidence To Write

Write:

- `docs/work/BANDIT-066/writer-report.md`
- `docs/work/BANDIT-066/implementation-evidence.md`

The evidence must list files changed, verification commands/results, and affirm
zero test-surface edits by the Stage 3 Writer.
