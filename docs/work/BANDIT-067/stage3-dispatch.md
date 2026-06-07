# BANDIT-067 Stage 3 Implementation Dispatch

role: implementation_writer
model_family_requirement: claude
work_item: BANDIT-067
source_stage: Stage 2 RED evidence
verdict: implementation_required

## Mission

Implement the smallest source-only live-status cockpit view needed to satisfy
the current `BANDIT-067` RED tests.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-067/brief.md`
- `docs/work/BANDIT-067/orchestration-plan.md`
- `docs/work/BANDIT-067/red-evidence.md`
- `src/state/cockpit-status.ts`
- `src/state/cockpit-view-model.ts`
- `src/state/cockpit-actions.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `public/cockpit/index.html`
- `public/cockpit/cockpit.css`

## Allowed Source Surfaces

- `src/state/cockpit-view-model.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `public/cockpit/index.html`
- `public/cockpit/cockpit.css`
- narrowly related cockpit source files only if required by the RED tests

## Forbidden Surfaces

Do not edit tests, test helpers, fixtures, RED evidence, acceptance mappings,
formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
`STATUS.md`, `.bandit/bootstrap-gaps.json`, dependencies, lockfiles, package
scripts, local API behavior, live polling, browser-side CLI execution, State
Index persistence, merge, push, deploy, Trust Verifier cutover, or unrelated
Phase 8 cockpit features.

## Expected Behavior

- The view model exposes Stage 0 through Stage 6 gate strip entries.
- The view model exposes source-linked first-screen status cues for current
  phase, active work, next action, operator input, blockers/stale evidence,
  landing readiness, UAT, bootstrap gaps, coordination state, and improvement
  health.
- The browser shell renders those live CLI payload fields visibly and
  source-linked.
- Missing/not-ready/not-applicable/none states stay explicit; do not normalize
  them to unexplained green status.
- Guarded actions remain request-only and tied to CLI command-family display.
- The static preview is refreshed to current `BANDIT-067` live-status content
  and remains non-canonical browser presentation state.

## Verification

Run at minimum:

```sh
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

Do not edit the tests to make them pass. If a test appears wrong, stop and
record the blocker instead of changing the test surface.

## Evidence To Write

Write:

- `docs/work/BANDIT-067/writer-report.md`
- `docs/work/BANDIT-067/implementation-evidence.md`

Both artifacts must list files changed, verification run, any skipped checks,
and confirm zero test-surface edits by the Stage 3 Writer.
