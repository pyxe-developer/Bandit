# BANDIT-068 RED Evidence

## Status

`failing_as_expected` for stage2_red_evidence.

Test Writer-owned RED tests define the Evidence Drilldown And Gate Matrix
behavior before production implementation. The tests assert that the existing
`bandit cockpit status --json` payload can be mapped into a presentation-only
gate matrix and evidence detail surface without allowing browser state, static
preview output, fixture data, or view-model projection state to become workflow
authority.

## Test Command

```sh
node --test test/cockpit-evidence-detail.test.mjs test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs
```

## Observed Output

```text
# tests 24
# pass 18
# fail 6

not ok - browser cockpit shell renders source-linked gate matrix and evidence rows in desktop and mobile previews
error: rendered HTML did not include aria-label="Stage gate matrix".

not ok - cockpit evidence detail builds a Stage 0 through Stage 6 gate matrix with freshness and repair routes
error: Cannot find module src/state/cockpit-evidence-detail.ts.

not ok - cockpit evidence detail exposes review, landing, UAT, coordination, bootstrap-gap, and trust-signal rows
error: Cannot find module src/state/cockpit-evidence-detail.ts.

not ok - cockpit evidence detail preserves fail-closed and non-authority boundaries
error: Cannot find module src/state/cockpit-evidence-detail.ts.

not ok - cockpit shell renders dense gate matrix and evidence detail without hidden authority
error: Cannot read properties of undefined (reading 'rows').

not ok - cockpit view model exposes evidence drilldown rows and gate matrix as presentation-derived data
error: viewModel.evidence_drilldown.kind was undefined, expected cockpit_evidence_detail.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Browser-served cockpit exposes a Stage 0 through Stage 6 gate matrix derived from current CLI/repo evidence rather than browser-owned state. | `test/cockpit-evidence-detail.test.mjs` expects `buildCockpitEvidenceDetail()` to produce Stage 0-6 `gate_matrix` rows with status, source paths, owner or authority role, freshness state, reason, and repair route. `test/cockpit-ui.test.mjs` expects `renderCockpitShell()` to expose `shell.gate_matrix.rows`. |
| Bounded evidence-detail view-model boundary maps CLI/repo evidence into drilldown rows without UI components parsing or mutating canonical artifacts. | `test/cockpit-evidence-detail.test.mjs` imports the required public boundary `src/state/cockpit-evidence-detail.ts` and asserts `authority: presentation_derived_non_canonical`, no mutation forms, no repo writes, no UAT approval, and no landing-safety decision. |
| Evidence drilldown exposes review evidence, review-subject freshness or hashes when available, landing evidence, UAT evidence, coordination evidence, bootstrap-gap replacement evidence, and artifact-specific Evidence Trust Signals with source links. | `test/cockpit-evidence-detail.test.mjs` expects detail rows for `review_evidence`, `landing_readiness`, `uat`, `coordination`, `bootstrap_gaps`, `stale_evidence`, and `evidence_trust_signals`, with source links and explicit reasons. |
| Missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, blocked, and operator-owned states remain explicit and never normalize to unexplained green. | The new `evidenceDrilldownStatusFixture()` contains missing Stage 2/3/4/5/6 gates, stale review evidence via review-subject hash drift, `not_applicable` UAT, and an open bootstrap-gap example. Tests require visible missing/stale reasons and repair routes. |
| Guarded action affordances remain disabled or request-only and no browser code invokes CLI commands, writes artifacts, approves UAT, decides landing safety, merges, pushes, deploys, or changes policy. | Existing cockpit action/browser authority tests remain in the focused command. New evidence-detail tests additionally require `writes_repo_artifacts: false`, `approves_uat: false`, `decides_landing_safety: false`, and `mutation_forms: []`. |
| Responsive verification covers desktop and mobile widths with no overlapping or truncated stage labels, source paths, hashes, disabled reasons, or evidence detail rows. | `test/cockpit-browser-shell.test.mjs` now renders the evidence drilldown fixture at desktop and mobile widths and requires `text_overflow: false`, `overlaps: []`, `source_paths_wrap: true`, and `detail_rows_wrap: true` on mobile. |
| Accessibility verification covers semantic landmarks, matrix/list labeling, button roles and disabled states, focus order, source-link reachability, and readable status cues for dense evidence detail. | `test/cockpit-browser-shell.test.mjs` requires `aria-label="Stage gate matrix"` and `aria-label="Evidence detail"` in rendered HTML; existing accessibility tests continue to cover landmarks, disabled buttons, focus order, and source links. |
| Implementation keeps cockpit status derivation, evidence-detail mapping, gate-matrix rendering, action affordance rendering, browser shell rendering, and static preview generation separated. | RED tests force a new `cockpit-evidence-detail` state boundary and separate shell/browser rendering assertions instead of adding parsing logic directly to UI tests or browser shell generation. |

## Test Ownership And Model-Family Separation

- Test Writer-owned surfaces changed in Stage 2:
  - `test/cockpit-evidence-detail.test.mjs`
  - `test/cockpit-view-model.test.mjs`
  - `test/cockpit-ui.test.mjs`
  - `test/cockpit-browser-shell.test.mjs`
  - `test/helpers/cockpit-status-fixture.mjs`
- Stage 3 Writer authority over tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, and retrospective evidence is zero.
- Because Codex authored the Stage 2 RED tests and acceptance mapping, Stage 3
  implementation must be dispatched to Claude through the bootstrap Process
  Adapter path or another different model family. During bootstrap, Claude is
  the allowed Stage 3 Writer path.

## Next Action

Dispatch Stage 3 implementation for `BANDIT-068` to Claude through the
bootstrap Process Adapter path. Implement the smallest source-only
evidence-detail boundary, view-model mapping, shell rendering, browser-shell
HTML/CSS, and static preview refresh needed to satisfy the focused RED tests
without editing tests, test helpers, fixtures, RED evidence, acceptance
mappings, formation evidence, review evidence, UAT evidence, landing evidence,
retrospective evidence, local API behavior, live polling, browser-side CLI
execution, State Index persistence, dependency or lockfile changes, package
script changes, merge, push, deploy, Trust Verifier cutover, or unrelated
Phase 8 cockpit features.
