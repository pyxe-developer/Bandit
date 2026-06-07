# BANDIT-068 Stage 3 Implementation Dispatch

role: implementation_writer
model_family_requirement: claude
work_item: BANDIT-068
source_stage: Stage 2 RED evidence
verdict: implementation_required

## Mission

Implement the smallest source-only Evidence Drilldown And Gate Matrix cockpit
view needed to satisfy the current `BANDIT-068` RED tests.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-068/brief.md`
- `docs/work/BANDIT-068/orchestration-plan.md`
- `docs/work/BANDIT-068/red-evidence.md`
- `src/state/cockpit-status.ts`
- `src/state/cockpit-view-model.ts`
- `src/state/cockpit-actions.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `src/cockpit/generate-cockpit-preview.ts`
- `public/cockpit/index.html`
- `public/cockpit/cockpit.css`

## Allowed Source Surfaces

- `src/state/cockpit-evidence-detail.ts`
- `src/state/cockpit-view-model.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `src/cockpit/generate-cockpit-preview.ts`
- `public/cockpit/index.html`
- `public/cockpit/cockpit.css`
- `docs/work/BANDIT-068/writer-report.md`
- `docs/work/BANDIT-068/implementation-evidence.md`
- narrowly related cockpit source files only if required by the RED tests

## Forbidden Surfaces

Do not edit tests, test helpers, fixtures, RED evidence, acceptance mappings,
formation evidence, orchestration plan evidence, review evidence, landing
evidence, UAT evidence, retrospective evidence,
`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
`.bandit/bootstrap-gaps.json`, dependencies, lockfiles, package scripts, local
API behavior, live polling, browser-side CLI execution, State Index
persistence, merge, push, deploy, Trust Verifier cutover, or unrelated Phase 8
cockpit features.

## Expected Behavior

- Add a narrow `cockpit-evidence-detail` state boundary that maps the current
  cockpit status payload into presentation-only gate matrix rows and evidence
  detail rows.
- The gate matrix includes Stage 0 through Stage 6 status, source paths,
  freshness/missing/stale state, owner or authority role, reason text, and
  derivable repair route.
- Evidence detail rows expose review evidence, landing readiness, UAT,
  coordination, bootstrap-gap replacement evidence, stale evidence, and
  artifact-specific Evidence Trust Signals with source links.
- Missing, stale, unavailable, `bootstrap_gap`, `not_applicable`, blocked, and
  operator-owned states stay explicit and are not normalized to green.
- Render the gate matrix and evidence detail in the shell/browser output with
  source-link wrapping, semantic labels, disabled guarded actions, and no
  mutation forms.
- Refresh the static preview to current `BANDIT-068` content if source changes
  affect generated preview output.
- Preserve CLI Authority and presentation-only browser state. Do not add a
  local API, polling, browser-side command execution, browser storage, or
  canonical UI state.

## Verification

Run at minimum:

```sh
node --test test/cockpit-evidence-detail.test.mjs test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs
npm run typecheck
```

Do not edit the tests to make them pass. If a test appears wrong, stop and
record the blocker instead of changing the test surface.

## Evidence To Write

Write:

- `docs/work/BANDIT-068/writer-report.md`
- `docs/work/BANDIT-068/implementation-evidence.md`

Both artifacts must list files changed, verification run, skipped checks, and
confirm zero test-surface edits by the Stage 3 Writer.
