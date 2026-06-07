# BANDIT-068 Stage 3 Writer Report

role: implementation_writer
model_family: claude
work_item: BANDIT-068
source_stage: Stage 2 RED evidence
verdict: implementation_complete

## Summary

Implemented the smallest source-only Evidence Drilldown And Gate Matrix cockpit
slice needed to satisfy the BANDIT-068 RED tests. Added a narrow
`cockpit-evidence-detail` state boundary that projects the current cockpit
status payload into presentation-only gate matrix rows (Stage 0 through Stage 6)
and evidence detail rows, then rendered both in the cockpit shell and
browser-served shell output. No canonical workflow authority moved into browser
or generated state.

## Files Changed

Source (Stage 3 Writer authority):

- `src/state/cockpit-evidence-detail.ts` (new) — `buildCockpitEvidenceDetail()`
  boundary mapping status payload into `gate_matrix` + `detail_rows`,
  `authority: presentation_derived_non_canonical`, fail-closed states preserved,
  and explicit non-authority flags (`writes_repo_artifacts: false`,
  `approves_uat: false`, `decides_landing_safety: false`, `mutation_forms: []`).
- `src/state/cockpit-view-model.ts` — `evidence_drilldown` now spreads the
  evidence-detail projection alongside the existing `sources`/`shows_hash_state`/
  `shows_gate_basis` fields; type extended via `CockpitEvidenceDetail`.
- `src/cockpit/render.ts` — added `gate_matrix` (aria_label, rows,
  `source_paths_wrap`, empty `mutation_forms`) and `evidence_detail` (aria_label,
  rows, empty `mutation_forms`, `canonical_state_owner`) to the rendered shell.
- `src/cockpit/browser-shell.ts` — rendered the gate matrix and evidence detail
  sections with `aria-label="Stage gate matrix"` / `aria-label="Evidence detail"`,
  source-link wrapping, and no mutation forms; added `detail_rows_wrap` to the
  mobile responsive contract; added matrix/detail CSS to `SHELL_CSS`.

Generated / static presentation (rebuildable, non-canonical):

- `public/cockpit/cockpit.css` — gate matrix / evidence detail wrapping rules
  mirrored from `SHELL_CSS`.
- `public/cockpit/index.html` — regenerated from the deterministic BANDIT-067
  preview snapshot via `node src/cockpit/generate-cockpit-preview.ts` so the
  committed static preview reflects the new sections.

## Verification Run

- `node --test test/cockpit-evidence-detail.test.mjs test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs`
  → tests 24, pass 24, fail 0 (the six previously-RED tests now pass).
- `npm test` → tests 525, pass 525, fail 0.
- `npm run typecheck` → clean (`tsc --noEmit`, no errors).
- `npm run bandit -- validate` → `Bandit state is valid.`
- `git diff --check` → clean.

## Skipped Checks

- Live cross-model review (`coderabbit-review`, `qwen-review`),
  `review-subject-hash`, `land-check`, browser/Playwright smoke, and product UAT
  are Stage 4/Stage 5 responsibilities and out of the Stage 3 Writer scope; they
  are not run here.
- No dependency, lockfile, or package-script changes; no local API, polling,
  browser-side CLI execution, browser storage, or State Index work (all forbidden
  by the dispatch and brief).

## Test-Surface Edit Confirmation

Zero test-surface edits by the Stage 3 Writer. No test, test helper, fixture,
RED evidence, acceptance mapping, formation evidence, review evidence, landing
evidence, UAT evidence, or retrospective evidence was created, edited, deleted,
regenerated, or reformatted. The `test/cockpit-*.test.mjs` and
`test/helpers/cockpit-status-fixture.mjs` files shown as modified in
`git status` are pre-existing Stage 2 Test Writer changes present at session
start; the Stage 3 Writer did not touch them.
