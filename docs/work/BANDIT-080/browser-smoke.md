# Browser Smoke Evidence: BANDIT-080

contract_version: 1
work_item: BANDIT-080
source_head: 59de83fbdbd2938b717528e7dd8addbf2d803b65
preview_target: http://127.0.0.1:8787/
preview_source: public/cockpit/index.html
preview_snapshot_state: deterministic_non_canonical
browser_smoke_state: pass
operator_input_status: none_required
source_drift_status: current

## Commands

- Started a temporary static server rooted at `public/cockpit` on
  `http://127.0.0.1:8787/`.
- Opened the static preview with Playwright/browser automation and inspected
  the accessibility snapshot and page DOM.
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
- Static preview console had one non-blocking `favicon.ico` 404.
- Static preview remains a deterministic non-canonical `BANDIT-067` snapshot;
  current `BANDIT-080` queue rows are verified through live CLI/render smoke.
- Live render produced 3 Queue & Context rows from current repo-native status.
- Live row statuses were `active_anchor`, `not_yet_formed`, and `deferred`.
- Live row labels were `Queue & Context (Light)`,
  `Operator Attention / Operator Inbox surface`, and
  `V0 Closeout Claude Code A/B Product-Value Trial`.
- Live summary was `BANDIT-080 active; 1 next planned slice; 1 deferred V0 closeout item.`
- Live recent transition status was `recorded`.
- Desktop and mobile live render included `<section aria-label="Queue and context">`.
- Desktop and mobile live render reported no text overflow or overlap.
- Mobile live render reported `source_paths_wrap: true` and
  `detail_rows_wrap: true`.
- Live render HTML contained no `<form>`, `fetch(`, `localStorage`,
  `sessionStorage`, or `indexedDB` references.

## Verdict

`pass` for Stage 4 browser smoke. The browser-served static preview remains
deterministic and non-canonical, while the live CLI/render path confirms the
current `BANDIT-080` Queue & Context surface presents source-linked trajectory
rows without browser-side workflow authority, repo mutation, UAT approval,
landing-safety decision, merge, push, deploy, scheduling, claim execution, or
policy-change behavior.
