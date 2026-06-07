# BANDIT-067 Stage 3 PM Acceptance Review

verdict: pass
work_item: BANDIT-067
reviewer: codex_pm
reviewed_at: 2026-06-07T18:46:00Z

## Scope And Role Boundary

Stage 3 was dispatched to Claude because Codex authored the Stage 2 RED tests.
The implementation evidence records `model_family: claude`, and the changed
source surfaces are bounded to cockpit presentation code plus the static preview
HTML:

- `src/state/cockpit-view-model.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `src/cockpit/generate-cockpit-preview.ts`
- `public/cockpit/index.html`

The test-surface changes in `test/cockpit-view-model.test.mjs`,
`test/cockpit-browser-shell.test.mjs`, and
`test/helpers/cockpit-status-fixture.mjs` were authored in Stage 2 before the
Claude dispatch. Stage 3 Writer evidence states zero Writer edits to tests,
test helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, or retrospective evidence.

## Acceptance Criteria Check

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Live cockpit-status payload maps into presentation-ready view-model data without browser authority | pass | `src/state/cockpit-view-model.ts`; `node --test test/cockpit-view-model.test.mjs` |
| First screen exposes phase, work item, next action, operator input, blockers/stale evidence, gates, landing, UAT, bootstrap gaps, coordination, improvement health, and source links | pass | `src/cockpit/render.ts`; `src/cockpit/browser-shell.ts`; `node --test test/cockpit-browser-shell.test.mjs` |
| Missing, not-ready, not-applicable, none, and not-recorded states remain explicit | pass | `buildStatusCues`; focused view-model and browser-shell tests |
| Static preview is no longer stale `BANDIT-066` content | pass | `public/cockpit/index.html`; `src/cockpit/preview-status-snapshot.ts`; `src/cockpit/generate-cockpit-preview.ts`; static preview test |
| Browser state remains non-canonical and request-only | pass | Existing authority-boundary tests; no forms, storage, fetch, API, merge, push, deploy, or policy override behavior |
| Clean-code separation is preserved | pass | Snapshot, view-model mapping, shell rendering, and preview generation live in separate focused modules |

## Clean-Code Review

- Spec alignment: pass - implementation matches the approved live-status view
  scope and does not implement local API, polling, State Index, guarded action
  execution, merge, push, deploy, or Trust Verifier cutover.
- Small surface area: pass - changes are limited to cockpit presentation
  modules, static preview, and Stage 2/3 evidence.
- Explicit state and no hidden authority: pass - rendered status remains
  source-linked and presentation-derived; repo-native artifacts via CLI remain
  canonical.
- Testable behavior: pass - focused cockpit tests and full repo tests pass.
- Failure clarity: pass - missing/not-ready/not-applicable states remain
  visible rather than normalized to green.
- No role erosion: pass - Codex-authored RED routed Stage 3 to Claude and
  Writer did not edit test-owned surfaces.

## Non-Blocking Review Notes For Stage 4

1. The static preview uses a saved non-canonical status snapshot captured at the
   Stage 2 RED point. This is acceptable under the brief's deterministic saved
   payload allowance, but Stage 4 should verify the wording does not imply live
   polling or current CLI execution from the browser.
2. The full Stage 0-6 gate strip is keyed to `status.coordination !== null` so
   existing pre-coordination fixtures keep their compact four-gate assertions.
   This is acceptable for Stage 3 because it preserves existing behavior and
   satisfies the live-status RED tests, but Stage 4 should review whether the
   compact-vs-full rule is the right long-term product contract.

## Verification

- `node --test test/cockpit-view-model.test.mjs` - pass, 7/7.
- `node --test test/cockpit-browser-shell.test.mjs` - pass, 5/5.
- `node --test test/cockpit-ui.test.mjs` - pass, 6/6.
- `node --test test/cockpit-status.test.mjs` - pass, 13/13.
- `npm test` - pass, 519/519.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass.
- `git diff --check` - pass.
- Browser MCP preview open - not run; Playwright MCP browser was locked by an
  existing instance. Automated render/DOM/responsive/accessibility tests are
  the Stage 3 replacement evidence; live browser smoke remains Stage 4 scope.

## Next Action

Proceed to Stage 4 review for `BANDIT-067`: CodeRabbit pre-PR or provider
refusal/bootstrap-gap evidence, Local Qwen review or provider-refusal evidence,
layered risk classification, supply-chain gate evidence, browser smoke or
recorded tooling blocker, review-subject hash, and aggregate review evidence.
