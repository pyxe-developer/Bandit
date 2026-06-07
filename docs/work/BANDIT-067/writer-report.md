# BANDIT-067 Stage 3 Writer Report

role: implementation_writer
model_family: claude
work_item: BANDIT-067
source_stage: Stage 2 RED evidence
verdict: implementation_complete

## Mission Outcome

Implemented the smallest source-only live-status cockpit view needed to satisfy
the Stage 2 RED tests for `BANDIT-067`. The view model now maps the full live
CLI cockpit-status payload (Stage 0 through Stage 6 gate strip and first-screen
status cues) into presentation-ready data, the browser shell renders those
fields visibly and source-linked, and the static preview is regenerated from a
deterministic saved snapshot of `bandit cockpit status --json` instead of the
stale BANDIT-066 fixture-oriented content.

## Files Changed

Source-only surfaces (allowed by dispatch):

- `src/state/cockpit-view-model.ts` — gate strip now renders all seven stage
  gates when the payload carries coordination state; `buildStatusCues` now
  emits the ten first-screen cues (`current_phase`, `active_work`,
  `next_action`, `operator_input`, `blockers_or_stale`, `landing_readiness`,
  `uat`, `bootstrap_gaps`, `coordination_state`, `improvement_health`), each
  carrying `source` or `sources`. Missing / not-ready / not-applicable / none /
  not-recorded states are kept explicit, not normalized to green.
- `src/cockpit/render.ts` — exposes `status_cues` and `gate_strip` from the
  view model through the shell render boundary (additive; existing render shape
  preserved).
- `src/cockpit/browser-shell.ts` — renders a "Live status" cue section and a
  "Gates" section inside the `main` landmark, each cue/gate source-linked.
- `public/cockpit/index.html` — regenerated from the live-status snapshot;
  removed BANDIT-066 preview content; retained the non-canonical static-preview
  notice.

New narrowly-related cockpit source files (required to keep the static preview
rebuildable and non-canonical):

- `src/cockpit/preview-status-snapshot.ts` — deterministic saved `CockpitStatus`
  snapshot captured from `bandit cockpit status --json` at the BANDIT-067 RED
  point; documented as non-canonical presentation input.
- `src/cockpit/generate-cockpit-preview.ts` — renders the browser shell from the
  snapshot and writes `public/cockpit/index.html`; run with
  `node src/cockpit/generate-cockpit-preview.ts`.

## Verification Run

- `node --test test/cockpit-view-model.test.mjs` — pass (7/7).
- `node --test test/cockpit-browser-shell.test.mjs` — pass (5/5).
- `node --test test/cockpit-ui.test.mjs` — pass (6/6).
- `node --test test/cockpit-status.test.mjs` — pass.
- `npm test` — pass (519/519).
- `npm run typecheck` — pass (no output / clean).
- `npm run bandit -- validate` — `Bandit state is valid.`
- `git diff --check` — clean.

## Skipped Checks

- Live browser / Playwright smoke, responsive desktop+mobile visual capture,
  accessibility tooling, CodeRabbit pre-PR, Local Qwen review, review-subject
  hash, UAT, and land-check are Stage 4/5 evidence and are out of the Stage 3
  Writer scope. Responsive/accessibility behavior is exercised by the existing
  shell tests (mobile viewport, landmarks, focus order, `overflow-wrap`,
  `:focus-visible`).
- The static preview is rendered from the saved snapshot rather than the current
  live CLI output because the live payload has advanced past the RED point
  (current next action `Dispatch Stage 3 implementation...`, coordination
  `red_recorded`), while the RED tests pin the RED-evidence-moment payload. This
  matches the brief's allowance for "a deterministic saved payload from
  `bandit cockpit status --json`."

## Test-Surface Edit Confirmation

Zero test-surface edits by the Stage 3 Writer. No edits were made to tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review
evidence, landing evidence, UAT evidence, or retrospective evidence. The
modified `test/cockpit-*.test.mjs` and `test/helpers/cockpit-status-fixture.mjs`
files were authored by the Test Writer in Stage 2 before this dispatch and were
not touched here.

## Clean-Code / Smell Note For Stage 4

The two RED fixtures require different gate-strip breadth from the same
`buildCockpitViewModel` adapter: `cockpitStatusFixture()` (no coordination)
asserts exactly four gates, while `liveCockpitStatusFixture()` (with
coordination) asserts all seven. Because the Writer cannot edit tests, the gate
strip breadth is keyed to coordination presence via `rendersFullGateStrip`,
documented in code. Flagging for the test owner / Stage 4 review in case a single
gate-strip breadth was the intended contract.
