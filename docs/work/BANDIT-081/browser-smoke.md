# Browser Smoke Evidence: BANDIT-081

contract_version: 1
work_item: BANDIT-081
source_head: b1f5d9f64efca38af39fbbd6a2e11564bee23150
preview_target: http://127.0.0.1:8787/
preview_source: public/cockpit/index.html
preview_snapshot_state: deterministic_non_canonical
browser_smoke_state: pass
operator_input_status: none_required
source_drift_status: current

## Commands

- Attempted to open the static preview with the Browser/Playwright plugin.
  The plugin could not attach because its Chromium profile was already locked.
- Started a temporary static server rooted at `public/cockpit` on
  `http://127.0.0.1:8787/`.
- Captured static preview desktop and mobile screenshots with:
  `npx playwright screenshot --viewport-size=1440,900 --full-page
  http://127.0.0.1:8787/ .bandit/tmp/BANDIT-081-browser-smoke/desktop.png`
  and `npx playwright screenshot --viewport-size=390,844 --full-page
  http://127.0.0.1:8787/ .bandit/tmp/BANDIT-081-browser-smoke/mobile.png`.
- Checked served static HTML with `curl -fsS http://127.0.0.1:8787/`.
- Rendered the live cockpit status through `readCockpitStatus`,
  `buildCockpitViewModel`, and `renderBrowserCockpitShell` at desktop
  `1440x900` and mobile `390x844` viewports with `npx tsx`.

## Observations

- Static preview loaded `Bandit Workflow Cockpit`.
- Static preview rendered the authority notice:
  "Static preview - workflow authority lives in repo-native artifacts via the
  Bandit CLI, not in browser state."
- Static preview CSS loaded successfully.
- Static preview HTML contained no `<form>`, `fetch(`, `localStorage`,
  `sessionStorage`, or `indexedDB` references.
- Static preview remains a deterministic non-canonical `BANDIT-067` snapshot;
  current `BANDIT-081` operator-attention and operator-inbox rendering is
  verified through live CLI/render smoke.
- Live render active work item was `BANDIT-081`.
- Live desktop and mobile renders included
  `<section aria-label="Operator attention">`.
- Live desktop and mobile renders included
  `<section aria-label="Operator Inbox">`.
- Live desktop and mobile renders included
  `data-canonical-source=".bandit/inbox"`.
- Live render reported the repo-native operator inbox source as unavailable in
  the current repo state and rendered zero inbox messages instead of inventing
  fixture messages.
- Live render reported zero mutation forms, `writes_inbox_artifacts: false`,
  `resolves_messages: false`, and `notification_authority: false`.
- Live render HTML contained no `<form>`, `fetch(`, `localStorage`,
  `sessionStorage`, `indexedDB`, `resolve-message`, `archive-message`,
  `approve-uat`, or `record-uat` references.
- Desktop and mobile live render responsive metadata reported
  `text_overflow: false` and no overlaps.
- Mobile live render responsive metadata reported `source_paths_wrap: true`
  and `detail_rows_wrap: true`.

## Verdict

`pass` for Stage 4 browser smoke. The browser-served static preview remains
deterministic and non-canonical, while the live CLI/render path confirms the
current `BANDIT-081` Operator Attention / Operator Inbox surface is present,
source-linked, empty/unavailable-safe, responsive, and presentation-only without
browser-side workflow authority, repo mutation, inbox mutation, notification
authority, UAT approval, landing-safety decision, merge, push, deploy,
scheduling, claim execution, or policy-change behavior.
