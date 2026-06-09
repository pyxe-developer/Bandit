# Browser Smoke Evidence: BANDIT-079

contract_version: 1
work_item: BANDIT-079
source_head: 8e008fcfe8c8602902f652621969905c7f6ab602
preview_target: http://127.0.0.1:8787/
preview_source: public/cockpit/index.html
preview_snapshot_state: deterministic_non_canonical
browser_smoke_state: pass
operator_input_status: none_required
source_drift_status: current

## Commands

- Started a temporary Node static server rooted at `public/cockpit` on
  `http://127.0.0.1:8787/`, fetched `/` and `/cockpit.css`, then closed the
  server.
- Rendered the live cockpit status through `readCockpitStatus`,
  `buildCockpitViewModel`, and `renderBrowserCockpitShell` at desktop
  `1440x900` and mobile `390x844` viewports.

## Observations

- Static preview loaded `Bandit Workflow Cockpit`.
- Static preview rendered the authority notice:
  "Static preview — workflow authority lives in repo-native artifacts via the
  Bandit CLI, not in browser state."
- Static preview included the `Improvement health` navigation entry and
  `repo_native_artifacts_via_bandit_cli` canonical owner marker.
- Static preview HTML contained no `<form>`, `fetch(`, `localStorage`,
  `sessionStorage`, or `indexedDB` references.
- Static preview CSS loaded successfully.
- Live render produced 19 Improvement Health rows from the current CLI status.
- The first live row rendered `state: "missing_metadata"` with metric
  `not available`, proving the string-ID fallback fails closed instead of
  rendering an empty surface.
- Desktop render included `<section aria-label="Improvement health">`.
- Mobile render reported `source_paths_wrap: true` and `detail_rows_wrap: true`.
- Desktop and mobile render metadata reported no text overflow or overlap.

## Verdict

`pass` for Stage 4 browser smoke. The browser-served static preview remains
deterministic and non-canonical, while the live render confirms the new
Improvement Health Surface presents source-linked fail-closed rows without
browser-side workflow authority, repo mutation, UAT approval, landing-safety
decision, merge, push, deploy, or policy-change behavior.
