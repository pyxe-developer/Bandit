# Browser Smoke Evidence: BANDIT-083

contract_version: 1
work_item: BANDIT-083
source_head: 0894489f95c9c9d3e21733f18c00fa4a61ce6a16
preview_target: http://127.0.0.1:8787/
preview_source: public/cockpit/index.html
preview_snapshot_state: deterministic_non_canonical
browser_smoke_state: pass
operator_input_status: none_required
source_drift_status: current

## Commands

- Started a temporary static server rooted at `public/cockpit` on
  `http://127.0.0.1:8787/`.
- Loaded the static preview with local headless Chrome at desktop `1440x900`
  and mobile `390x844` viewports using Chrome DevTools device metrics.
- Captured screenshots outside the repo at:
  `/tmp/bandit-083-desktop-chrome-smoke.png` and
  `/tmp/bandit-083-mobile-chrome-smoke.png`.
- Rendered the live cockpit status through `readCockpitStatus`,
  `buildCockpitViewModel`, and `renderBrowserCockpitShell` at desktop
  `1440x900` and mobile `390x844` using `node --import tsx`.

## Static Preview Observations

- `document.title` was `Bandit Workflow Cockpit` in both viewports.
- CSS loaded and applied the near-black canvas token
  `rgb(5, 5, 6)`.
- `body[data-canonical-state-owner]` was
  `repo_native_artifacts_via_bandit_cli`.
- The static preview contained `BANDIT-083` and did not contain stale
  `BANDIT-067` work-item text.
- Desktop grid columns were `220px 876px 280px`; mobile collapsed to one
  column at `358px`.
- Both viewports rendered 14 Evidence Rows, 7 gate-matrix rows, 7
  evidence-detail rows, 36 source links, and 5 action buttons.
- The static preview review gate was disabled with reason:
  `Stage 3 implementation evidence is missing; record implementation before review.`
- Source links reported `overflow-wrap: anywhere`.
- Both viewports reported no horizontal overflow and no critical offscreen
  source links, work-item labels, next-action text, Evidence Rows, action
  buttons, status cues, active-work main area, or Evidence rail.
- The static preview contained no `<form>`, `fetch(`, `localStorage`,
  `sessionStorage`, or `indexedDB` references.
- Semantic labeled regions were present: Attention categories, Live status,
  Stage gates, Improvement health, Operator attention, Operator Inbox,
  Evidence, Stage gate matrix, and Evidence detail.

## Live Render Observations

- Live CLI-derived active work rendered `BANDIT-083`.
- Desktop and mobile live render each produced 14 Evidence Rows.
- Desktop and mobile live render responsive metadata reported
  `text_overflow: false`, `overlaps: 0`, `source_paths_wrap: true`, and
  `detail_rows_wrap: true`.
- Desktop and mobile live render HTML contained no `<form>`, `fetch(`,
  `localStorage`, `sessionStorage`, or `indexedDB` references.

## Verdict

`pass` for Stage 4 browser smoke. The static preview is a deterministic,
non-canonical artifact used for visual smoke, while the live CLI/render path
confirms the current `BANDIT-083` cockpit surface remains source-linked,
responsive, Evidence Row based, and presentation-only.
