# BANDIT-083 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Test Writer-owned RED tests now express the Bandit Cockpit UI Polish From
Attached Design contract before implementation. The current cockpit renderer and
static preview do not yet expose the attached design's Evidence Row pattern,
desktop/mobile source wrapping metadata, design-token vocabulary, or active
`BANDIT-083` static preview content.

## Test Commands

```sh
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
```

## Observed Output

```text
node --test test/cockpit-ui.test.mjs: fail 1/9
1. `cockpit shell identifies gate rows as Evidence Rows with non-color status
   cues` failed because `shell.gate_matrix.presentation_pattern` is undefined
   instead of `evidence_row`. The current shell does not expose row-level
   Evidence Row metadata, visible status labels, visible freshness labels, or
   non-color-only cue declarations.

node --test test/cockpit-browser-shell.test.mjs: fail 3/7
1. `browser cockpit shell exposes responsive and accessible shell constraints`
   failed because the CSS lacks the B083 design-token vocabulary:
   `--color-attention`, `--color-pass`, `--color-blocker`,
   `--color-source-link`, `--space-1: 4px`, `Instrument Sans`, and
   `IBM Plex Mono`.
2. `static cockpit preview is refreshed from the current live-status work item`
   failed because `public/cockpit/index.html` still renders the deterministic
   `BANDIT-067` snapshot instead of active `BANDIT-083` content and
   `orchestration_plan_recorded` evidence.
3. `browser cockpit shell renders source-linked gate matrix and evidence rows
   in desktop and mobile previews` failed because gate/evidence rows do not
   render `class="evidence-row ..."`, `data-evidence-state`,
   `data-freshness-state`, visible status labels, visible freshness labels, or
   desktop source/detail wrapping metadata.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The cockpit adopts the attached design's dense three-pane Evidence Row visual direction while preserving Bandit's repo-native evidence hierarchy. | `test/cockpit-ui.test.mjs` now expects `gate_matrix` and `evidence_detail` to declare `presentation_pattern: evidence_row`; `test/cockpit-browser-shell.test.mjs` expects rendered `evidence-row` classes for gate and evidence detail rows. |
| Evidence Row or equivalent gate rows become the primary visual pattern for stage/gate state, with clear pass, blocker, non_blocking, bootstrap_gap, unavailable, stale, and source-missing states. | RED assertions require row-level `data-evidence-state`, `data-freshness-state`, visible `evidence-state-label`, visible `evidence-freshness-label`, and non-color-only status/freshness labels. |
| The UI keeps source artifact paths, current/next action text, work item IDs, required operator input, action-request affordance state, evidence freshness, and status labels readable on desktop and mobile. | Browser shell RED assertions require `source_paths_wrap` and `detail_rows_wrap` metadata on both desktop and mobile shells, plus existing source-link and action-affordance tests remain in the focused suite. |
| The cockpit remains presentation-only and browser/render/view-model/static preview code does not execute CLI commands, write repo artifacts, record approvals, record UAT, decide landing safety, schedule work, claim work, mutate intake, merge, push, deploy, change policy, route models, or treat generated UI state as canonical. | Existing focused tests continue to assert `presentation_derived_non_canonical`, `repo_native_artifacts_via_bandit_cli`, empty mutation forms, no browser storage, no `fetch`, and guarded action request-only metadata. |
| The implementation keeps data derivation, status/evidence mapping, action-request presentation, layout rendering, CSS/design-token styling, and static preview generation separated enough for clean-code review. | RED coverage is split across public view-model/render output, browser-shell HTML/CSS output, and static preview file assertions; Stage 3 Writer must implement the smallest source/CSS/render changes and must not edit tests. |
| Responsive verification covers desktop and mobile widths with no overlapping or truncated source paths, work item IDs, status chips, attention labels, action request rows, Evidence Rows, side-rail content, or current/next text. | `test/cockpit-browser-shell.test.mjs` requires desktop and mobile responsive metadata to report no text overflow, source path wrapping, detail row wrapping, and no overlaps. |
| Accessibility verification covers semantic grouping, keyboard focus order, source-link reachability, readable contrast, non-color-only status cues, and distinguishable pass/blocker/non_blocking/bootstrap_gap/unavailable/stale states. | Existing accessibility/focus-order assertions remain active; new RED assertions require `uses_color_alone: false`, visible status labels, visible freshness labels, and status/freshness data attributes. |
| Product UAT is recorded through CLI-owned UAT evidence before landing the operator-facing UI polish. | Stage 2 records this as a Stage 5 requirement; no UAT authority is added to browser/render/static preview tests. |

## Next Action

Dispatch Stage 3 implementation for `BANDIT-083` to Claude-family
Implementation Writer. Implement the narrow cockpit Evidence Row rendering,
design-token CSS, responsive metadata, and static preview refresh needed to
satisfy the RED tests without editing Test Writer-owned tests, fixtures, RED
evidence, acceptance mappings, formation evidence, review evidence, UAT
evidence, landing evidence, or retrospective evidence.

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored `test/cockpit-ui.test.mjs`,
  `test/cockpit-browser-shell.test.mjs`, and this RED evidence.
- RED author model family: `codex`.
- Codex materially edited tests: `true`.
- Acceptance mapping owner: Test Writer.
- Stage 3 test-edit authority: `none`.
- Stage 3 Writer routing: because Codex authored and materially edited RED
  tests, Stage 3 must route to a different model family through the
  Claude-family bootstrap implementation-writer path unless Claude auth fails or
  times out after the required 15-minute window; fallback is MiniMax-M3 through
  headless `pi`.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, or retrospective evidence for `BANDIT-083`.
