# BANDIT-066 Implementation Evidence

## Status

`implementation_complete` for stage3_implementation (repaired after PM acceptance blocker; polished after visual QA).

## Writer Identity

Stage 3 Implementation Writer: Claude (claude-sonnet-4-6).
Stage 2 RED tests were authored by Codex. Bootstrap Model-Family Separation is satisfied.

## Files Changed By Stage 3 Writer

| File | Action |
| --- | --- |
| `src/cockpit/browser-shell.ts` | Created — browser shell module exporting `renderBrowserCockpitShell` |
| `public/cockpit/index.html` | Created (Stage 3 repair); polished (Stage 3 polish repair) — favicon link (`data:,`) eliminates 404; non-canonical notice div added; satisfies brief AC |
| `public/cockpit/cockpit.css` | Created (Stage 3 repair); polished (Stage 3 polish repair) — `.static-preview-notice` rule added for visible non-canonical cue |

## Stage 3 Repair Note

PM acceptance found a blocker: the brief acceptance criterion requires a locally previewable static entrypoint, but the original implementation returned `preview_path` metadata only without creating the physical files. The repair adds the two smallest sufficient static files. `public/cockpit/index.html` is a standalone HTML document with the cockpit layout structure and static placeholder content — it can be opened directly in a browser or served with `python3 -m http.server --directory public/cockpit`. `public/cockpit/cockpit.css` holds the design-system tokens identical to `SHELL_CSS` in `browser-shell.ts`. No dependencies, live API, browser storage, CLI execution, build scripts, or mutation forms were introduced.

## Stage 3 Polish Repair Note

Visual QA found two issues with the static preview:

1. **Favicon 404**: The browser requests `/favicon.ico`; no file exists at that path. Fixed by adding `<link rel="icon" href="data:,">` in `<head>` — the data URI satisfies the browser's favicon lookup with no network request and no new file on disk.
2. **Placeholder state not visibly labeled non-canonical**: The HTML comment noting non-canonical state is not visible to users in a browser. Fixed by adding `<div class="static-preview-notice" role="note">Static preview — workflow authority lives in repo-native artifacts via the Bandit CLI, not in browser state.</div>` immediately before `.cockpit-layout`, styled via a new `.static-preview-notice` rule in `cockpit.css` (surface background, muted text, bottom border, 0.8em font).

No JavaScript, dependencies, forms, browser storage, live API, CLI execution, or mutation controls were introduced. All tests remain green after the polish repair.

## Zero Test-Surface Edits

The Stage 3 Writer did not edit any of the following surfaces:

- `test/cockpit-browser-shell.test.mjs`
- `test/cockpit-ui.test.mjs`
- `test/cockpit-view-model.test.mjs`
- `test/helpers/cockpit-status-fixture.mjs`
- `docs/work/BANDIT-066/red-evidence.md`
- Any formation, review, UAT, landing, or retrospective evidence artifact

## Verification Commands And Results

All commands re-run after Stage 3 polish repair (favicon link + non-canonical notice).

### Browser shell tests (required to pass)

```sh
node --test test/cockpit-browser-shell.test.mjs
```

```
TAP version 13
# Subtest: browser cockpit shell renders a served document with attention, evidence, and guarded actions
ok 1 - browser cockpit shell renders a served document with attention, evidence, and guarded actions
# Subtest: browser cockpit shell excludes hidden workflow authority and mutable browser state
ok 2 - browser cockpit shell excludes hidden workflow authority and mutable browser state
# Subtest: browser cockpit shell exposes responsive and accessible shell constraints
ok 3 - browser cockpit shell exposes responsive and accessible shell constraints
1..3
# tests 3
# suites 0
# pass 3
# fail 0
```

### Adjacent cockpit tests (required to remain green)

```sh
node --test test/cockpit-ui.test.mjs test/cockpit-view-model.test.mjs
```

```
1..12
# tests 12
# suites 0
# pass 12
# fail 0
```

### Typecheck

```sh
npm run typecheck
```

Exit 0, no output — clean.

### Whitespace check

```sh
git diff --check
```

Exit 0, no output — clean.

## Acceptance Criteria Coverage

| Criterion | Test | Result |
| --- | --- | --- |
| Browser shell exports `renderBrowserCockpitShell`; returns `kind: "browser_served_cockpit_shell"`, `authority: "presentation_derived_non_canonical"`, `preview_path: "public/cockpit/index.html"`, and CSS asset metadata | Test 1 assertions on `kind`, `authority`, `preview_path`, `assets` | pass |
| HTML document renders attention navigation, active-work main landmark, evidence aside, work item, next action, source link | Test 1 assertions on HTML | pass |
| Guarded action buttons carry `data-command-family` attribute; disabled controls carry `disabled` attribute and visible disabled reason | Test 1 assertions on `data-command-family="bandit validate"`, `data-command-family="bandit qwen-review"...disabled`, and disabled reason text | pass |
| Browser layer does not own canonical workflow state; prohibits browser storage, fixture data, generated UI state, local cache, state index, web component state | Test 2 assertions on `canonical_state_owner`, `prohibited_authority`, `mutation_forms`, absence of `<form>`, absence of browser storage APIs | pass |
| HTML carries `data-canonical-state-owner` attribute | Test 2 assertion on `data-canonical-state-owner="repo_native_artifacts_via_bandit_cli"` | pass |
| Shell exposes responsive constraints for mobile viewport: `viewport: "mobile"`, `source_paths_wrap: true`, `overlaps: []` | Test 3 assertions | pass |
| Accessibility landmarks are `["navigation", "main", "complementary"]`; focus order includes `evidence_drilldown` | Test 3 assertions | pass |
| CSS includes design-system tokens, mobile media query, overflow-wrap, and :focus-visible | Test 3 CSS assertions | pass |
| Static entrypoint `public/cockpit/index.html` is locally openable without network services, credentials, or mutable state (brief AC) | Physical file present; opens in browser via `python3 -m http.server --directory public/cockpit` | pass (Stage 3 repair) |
| Static stylesheet `public/cockpit/cockpit.css` is present alongside entrypoint | Physical file present with design-system tokens matching `SHELL_CSS` | pass (Stage 3 repair) |
| No favicon 404 on static preview load | `<link rel="icon" href="data:,">` in `<head>` satisfies browser favicon lookup with inline data URI; no network request | pass (Stage 3 polish repair) |
| Static preview is visibly labeled as non-canonical | `<div class="static-preview-notice" role="note">` banner displayed above cockpit layout with text stating workflow authority lives in repo-native artifacts | pass (Stage 3 polish repair) |

## Implementation Boundary Affirmed

The implementation:
- Does not invoke CLI commands, live APIs, or browser storage
- Does not parse repo-native artifacts directly in the browser layer
- Does not implement mutation forms, merge, push, or UAT approval affordances
- Reuses `renderCockpitShell` from the existing render boundary to derive typed presentation data
- Returns all shell metadata explicitly (kind, authority, preview_path, assets, html, css, prohibited_authority, mutation_forms)
- Static files (`public/cockpit/index.html`, `public/cockpit/cockpit.css`) contain no JavaScript, no browser storage APIs, no forms, no live API calls, and no mutation affordances; they are pure presentation-layer preview artifacts
