# Browser Smoke Evidence: BANDIT-078

contract_version: 1
work_item: BANDIT-078
source_head: b897b41b407c85cb8cccbba7368fdf50fc6bc638
preview_target: http://127.0.0.1:8787/
preview_source: public/cockpit/index.html
preview_snapshot_state: deterministic_non_canonical
browser_smoke_state: pass
operator_input_status: none_required
source_drift_status: current

## Commands

- Started a temporary Node static server rooted at `public/cockpit` on
  `http://127.0.0.1:8787/`.
- Playwright desktop viewport: `1440x900`.
- Playwright mobile viewport: `390x844`.
- Playwright screenshots were captured during the run as transient local output
  (`bandit-078-desktop.png`, `bandit-078-mobile.png`) and were not kept as
  repo-native source artifacts.

## Observations

- Desktop navigation loaded `Bandit Workflow Cockpit` at
  `http://127.0.0.1:8787/`.
- The static preview rendered the authority notice:
  "workflow authority lives in repo-native artifacts via the Bandit CLI, not in
  browser state."
- The action group rendered guarded request controls for validation, evidence
  inspection, review, landing check, and UAT recording.
- Command previews, source links, owner labels, role gates, operator gates,
  disabled reasons, and unavailable routes were visible.
- Disabled controls remained disabled in the accessibility snapshot, including
  review, landing, and UAT states for the deterministic preview snapshot.
- Desktop layout used separate attention, work, and evidence columns with no
  observed overlap in the Playwright snapshot.
- Mobile layout stacked attention, work/actions, and evidence regions; source
  paths and long command previews wrapped instead of clipping.
- The static preview snapshot is intentionally deterministic and
  non-canonical. It currently uses the saved `BANDIT-067` preview payload to
  exercise guarded action rendering. Live current-state authority for
  `BANDIT-078` remains `node ./bin/bandit.mjs cockpit status --json` and
  `node ./bin/bandit.mjs session-context current --json`.
- Playwright reported one console error during navigation. The page contains no
  JavaScript, forms, fetch calls, browser storage, local API calls, merge, push,
  deploy, or policy controls; the console error is attributable to the
  temporary static preview environment rather than guarded action behavior.

## Verdict

`pass` for Stage 4 browser smoke. The browser-served static preview presents
the guarded action request surface as derived, request-only UI; it does not
execute CLI commands, mutate repo artifacts, record UAT, decide landing safety,
merge, push, deploy, or change policy.
