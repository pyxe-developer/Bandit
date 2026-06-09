# Bandit Cockpit UI Polish Source

## Source

- Operator request date: 2026-06-09.
- Attached package: `/Users/matthewflebbe/Downloads/Bandit Cockpit.zip`.
- Extracted reference files:
  - `cockpit/index.html`
  - `cockpit/cockpit.css`
  - `cockpit/ds/colors_and_type.css`
  - `cockpit/ds/dashboard.css`
  - `cockpit/ds/issue.css`
  - `_ds/seekwins-design-system-019dfd62-2240-7c15-b27b-1609711a8c15/README.md`

## Design Direction

Use the attached static cockpit design as source material for a bounded Phase 8
Bandit Cockpit polish slice. Preserve Bandit's CLI-authority and repo-native
artifact boundaries while adapting the visual language.

Relevant design traits:

- Dense three-pane cockpit layout: attention navigation, active-work center,
  evidence/context side rail.
- Deep near-black canvas, coral attention accent, green pass state, red fail
  state, and restrained blue info links.
- Instrument Sans plus IBM Plex Mono typography.
- Evidence Row as the signature pattern for stage-gate state.
- CLI request-only action rows; no browser-owned workflow mutation.
- Compact cards, 4px spacing grid, 8px-or-less controls where possible, and
  source links for trusted evidence.

## Constraints

- Do not add browser mutation authority, local API authority, storage authority,
  UAT approval authority, landing authority, merge, push, deploy, telemetry,
  hosted services, or reviewer/model routing changes.
- Do not make the design system canonical workflow state.
- Keep UI state derived from Bandit CLI and repo-native artifacts.
- Treat the design package as product/design source material until the polish
  slice creates normal Stage 1 through Stage 6 evidence.
