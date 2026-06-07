# BANDIT-068 Implementation Evidence

## Status

`green` for stage3_implementation. The Stage 2 RED tests for Evidence Drilldown
And Gate Matrix now pass with source-only changes.

work_item: BANDIT-068
stage: stage3_implementation
model_family: claude
verdict: pass

## Test Command

```sh
node --test test/cockpit-evidence-detail.test.mjs test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs
```

## Observed Output

```text
# tests 24
# pass 24
# fail 0
```

Previously-RED tests now green:

- browser cockpit shell renders source-linked gate matrix and evidence rows in
  desktop and mobile previews
- cockpit evidence detail builds a Stage 0 through Stage 6 gate matrix with
  freshness and repair routes
- cockpit evidence detail exposes review, landing, UAT, coordination,
  bootstrap-gap, and trust-signal rows
- cockpit evidence detail preserves fail-closed and non-authority boundaries
- cockpit shell renders dense gate matrix and evidence detail without hidden
  authority
- cockpit view model exposes evidence drilldown rows and gate matrix as
  presentation-derived data

## Full Verification

| Check | Command | Result |
| --- | --- | --- |
| Focused cockpit tests | `node --test test/cockpit-evidence-detail.test.mjs test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs` | tests 24 / pass 24 / fail 0 |
| Full suite | `npm test` | tests 525 / pass 525 / fail 0 |
| Typecheck | `npm run typecheck` | clean |
| Bandit validate | `npm run bandit -- validate` | `Bandit state is valid.` |
| Whitespace | `git diff --check` | clean |

## Files Changed

Source surfaces (Stage 3 Writer authority):

- `src/state/cockpit-evidence-detail.ts` (new)
- `src/state/cockpit-view-model.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`

Rebuildable, non-canonical presentation:

- `public/cockpit/cockpit.css`
- `public/cockpit/index.html` (regenerated from the BANDIT-067 preview snapshot;
  no snapshot/source-of-truth change)

## Behavior Implemented

- `buildCockpitEvidenceDetail(status)` maps the current cockpit status payload
  into a Stage 0 through Stage 6 gate matrix with status, source paths,
  freshness/missing/stale state, owner or authority role, reason text, and a
  derivable next repair route.
- Evidence detail rows expose review evidence, landing readiness, UAT,
  coordination, bootstrap-gap replacement evidence, stale evidence, and
  artifact-specific Evidence Trust Signals with source links.
- Missing, stale, `not_applicable`, `open` bootstrap-gap, blocked, and
  operator-owned states stay explicit with reason/source text and are never
  normalized to unexplained green (verified by the fail-closed RED test).
- The gate matrix and evidence detail render in the shell and browser-served
  output with `aria-label="Stage gate matrix"` and `aria-label="Evidence detail"`,
  source-link wrapping, semantic labels, and no mutation forms.
- Authority boundaries preserved: `authority: presentation_derived_non_canonical`,
  `canonical_state_owner: repo_native_artifacts_via_bandit_cli`,
  `writes_repo_artifacts: false`, `approves_uat: false`,
  `decides_landing_safety: false`, `mutation_forms: []`. No local API, polling,
  browser-side CLI execution, browser storage, or State Index was added.

## Test-Surface Edit Confirmation

Zero test-surface edits by the Stage 3 Writer. Tests, test helpers, fixtures,
RED evidence, acceptance mappings, formation evidence, review evidence, landing
evidence, UAT evidence, and retrospective evidence were not created, edited,
deleted, regenerated, or reformatted. The modified `test/` files in
`git status` are Stage 2 Test Writer work present at session start.
