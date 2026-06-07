# BANDIT-066 Stage 3 Writer Report

## Role

Stage 3 Implementation Writer — Claude (claude-sonnet-4-6). This is the bootstrap Claude Writer path because Codex authored the Stage 2 RED tests.

## Summary

Implemented `src/cockpit/browser-shell.ts`, the public browser-served Workflow Cockpit app shell boundary. The module exports `renderBrowserCockpitShell(viewModel, viewport)` and satisfies all three RED tests in `test/cockpit-browser-shell.test.mjs`.

## Files Changed

| File | Action | Notes |
| --- | --- | --- |
| `src/cockpit/browser-shell.ts` | Created | Browser shell implementation; single new file |
| `public/cockpit/index.html` | Created (Stage 3 repair); polished (Stage 3 polish repair) | Static local preview entrypoint; favicon link and non-canonical notice added |
| `public/cockpit/cockpit.css` | Created (Stage 3 repair); polished (Stage 3 polish repair) | Design-system stylesheet; `.static-preview-notice` rule added |

## Files NOT Changed

The Stage 3 Writer made zero edits to any test surface, evidence surface, or artifact listed below:

- `test/cockpit-browser-shell.test.mjs` — not touched
- `test/cockpit-ui.test.mjs` — not touched
- `test/cockpit-view-model.test.mjs` — not touched
- `test/helpers/cockpit-status-fixture.mjs` — not touched
- `docs/work/BANDIT-066/red-evidence.md` — not touched
- `docs/work/BANDIT-066/brief.md` — not touched
- `docs/work/BANDIT-066/orchestration-plan.md` — not touched
- `docs/work/BANDIT-066/formation-review.md` — not touched
- All other formation, review, UAT, landing, and retrospective evidence — not touched

## Design Decisions

- Reused `renderCockpitShell` from `src/cockpit/render.ts` to derive the structured presentation data before generating HTML. This keeps the browser layer consuming typed cockpit data rather than raw view model state, per the acceptance criteria.
- Imported `render.ts` with `.ts` extension (consistent with `cockpit-view-model.ts` importing `cockpit-actions.ts`). The `.js` extension fails at runtime with Node.js's built-in type stripping in v22.22.3.
- HTML uses `data-canonical-state-owner` on the body, semantic landmarks (`<nav>`, `<main>`, `<aside>`), disabled button semantics with `aria-describedby`, and no `<form>` elements.
- CSS is returned as a separate `shell.css` string property and referenced by `<link>` in the HTML to support the static preview path.
- No browser storage, live API calls, mutation forms, or JavaScript is included in the generated HTML.
- Static preview files (`public/cockpit/index.html`, `public/cockpit/cockpit.css`) were added in a Stage 3 repair after PM acceptance found a blocker: the brief's acceptance criterion requires a locally previewable static entrypoint or documented repo command. Both files were added as the smallest sufficient repair — `index.html` contains static placeholder content matching the cockpit layout structure, and `cockpit.css` holds the same design-system tokens as `SHELL_CSS` in `browser-shell.ts`. The static preview can be opened directly in a browser or served with `python3 -m http.server --directory public/cockpit`. No dependencies, live API, browser storage, CLI execution, or mutation forms were introduced.
- A Stage 3 polish repair addressed two visual QA findings: (1) favicon 404 — resolved by adding `<link rel="icon" href="data:,">` in `<head>`, which satisfies the browser's favicon request with an inline data URI and produces no network request; (2) placeholder state not visibly labeled as non-canonical — resolved by adding a `<div class="static-preview-notice" role="note">` banner immediately before `.cockpit-layout` with the text "Static preview — workflow authority lives in repo-native artifacts via the Bandit CLI, not in browser state." and a matching `.static-preview-notice` rule in `cockpit.css`. No JavaScript, dependencies, forms, browser storage, live API, CLI execution, or mutation controls were introduced by the polish repair.

## Verification Commands Run

```sh
node --test test/cockpit-browser-shell.test.mjs
node --test test/cockpit-ui.test.mjs test/cockpit-view-model.test.mjs
npm run typecheck
git diff --check
```

## Verification Results

Re-run after Stage 3 polish repair (favicon link + non-canonical notice):

- `test/cockpit-browser-shell.test.mjs`: 3 pass, 0 fail
- `test/cockpit-ui.test.mjs` + `test/cockpit-view-model.test.mjs`: 12 pass, 0 fail
- `npm run typecheck`: clean (no output, exit 0)
- `git diff --check`: clean (no output, exit 0)

## Clean-Code Self-Check

1. **Spec alignment**: Implements only the browser shell boundary the RED tests require. Does not add scope beyond `renderBrowserCockpitShell`.
2. **Small surface area**: One new file, ~160 lines. No unrelated changes.
3. **Simple design**: Four HTML-building helpers plus one responsive helper. Each does one thing.
4. **Explicit state**: No hidden state. Shell fields are all explicit in the return object.
5. **No hidden authority**: HTML has `data-canonical-state-owner`. No browser storage, no mutation forms, no JS.
6. **Testable behavior**: Three tests cover all required behavior; all pass.
7. **Readable flow**: `renderBrowserCockpitShell` → `renderCockpitShell` → `buildHtml` helpers. Path is easy to trace.
8. **Locality**: All browser-shell logic in one file. `renderCockpitShell` reused from `render.ts`.
9. **Failure clarity**: Disabled controls are explicit (`disabled` attribute, `aria-disabled`, `aria-describedby`, visible reason span).
10. **No role erosion**: No test edits. Implementation only.
11. **Improvement capture**: No lessons requiring chores identified in this narrow implementation slice.

## Model-Family Separation Evidence

Stage 2 RED tests were authored by Codex (Codex PM). Stage 3 implementation was authored by Claude (claude-sonnet-4-6), a different model family. This satisfies the Bootstrap Model-Family Separation requirement.
