# BANDIT-034 CodeRabbit Finding Disposition

## Summary

CodeRabbit completed the real pre-PR Stage 4 review for `BANDIT-034` at source
head `49f91f5d573430b5f6536d9f8fa39b0aa8aa49ed` and returned eight unresolved
findings.

Codex PM repaired seven findings in the current source and dispositioned one
script-integrity finding as no-action after recomputing the SRI hashes from the
pinned CDN URLs. The next Stage 4 action is to rerun the CodeRabbit gate against
the repaired source before Local Qwen, review-subject hash refresh, aggregate
Stage 4 disposition, or landing evidence can proceed.

## Findings

### Duplicate cockpit fixture

**Finding:** Extract duplicated `cockpitStatusFixture` declarations in
`test/cockpit-ui.test.mjs`.

**Disposition:** repaired.

**Evidence:** Added `test/helpers/cockpit-status-fixture.mjs` and imported the
shared fixture from `test/cockpit-ui.test.mjs` and
`test/cockpit-view-model.test.mjs`.

### Stale roadmap next-action text

**Finding:** Update stale `ROADMAP.md` next-action text that still described
creating the `BANDIT-033-COCKPIT-SHELL-HARDENING` work item.

**Disposition:** repaired.

**Evidence:** Updated the stale `BANDIT-034` roadmap paragraph to record Stage 3
implementation evidence, completed CodeRabbit blocker evidence, and the required
CodeRabbit repair/rerun sequence.

### TweaksPanel drag listener cleanup

**Finding:** Ensure `TweaksPanel` drag listeners are removed if the component
unmounts mid-drag.

**Disposition:** repaired.

**Evidence:** `docs/design/workflow-cockpit/prototype-source/tweaks-panel.jsx`
now stores drag cleanup in a ref and invokes it during component cleanup.

### Reduced-motion durations

**Finding:** Set reduced-motion animation and transition durations to `0s` and
pause animations.

**Disposition:** repaired.

**Evidence:** `colors_and_type.css` now sets reduced-motion animation and
transition durations to `0s`, pauses animations, and preserves automatic scroll
behavior.

### Disabled ActionButton semantics

**Finding:** Add the native disabled attribute to disabled `ActionButton`
elements.

**Disposition:** repaired.

**Evidence:** `prototype-source/ui.jsx` now renders `disabled={disabled}` on
the underlying action button while retaining the existing ARIA and visual state.

### TweakRadio listener cleanup

**Finding:** Ensure `TweakRadio` pointer listeners are removed if the component
unmounts mid-drag.

**Disposition:** repaired.

**Evidence:** `tweaks-panel.jsx` now stores radio pointer cleanup in a ref and
invokes it during component cleanup.

### Keyboard focus styling

**Finding:** Replace global `:focus` outline suppression with `:focus-visible`
keyboard focus styling.

**Disposition:** repaired.

**Evidence:** `colors_and_type.css` now scopes outline suppression to
`:focus:not(:focus-visible)` and retains explicit `:focus-visible` ring styling.

### Script integrity hashes

**Finding:** Update `index.html` script integrity hashes for React, ReactDOM,
and Babel to match the loaded package versions.

**Disposition:** no-action, already current.

**Evidence:** Recomputed SHA-384 SRI hashes from the pinned unpkg URLs and they
match the existing `index.html` values:

- `react@18.3.1/umd/react.development.js`:
  `hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L`
- `react-dom@18.3.1/umd/react-dom.development.js`:
  `u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm`
- `@babel/standalone@7.29.0/babel.min.js`:
  `m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y`

## Verification

- `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs`
  passed with 12 tests.

## Retry Result

The 2026-05-26 CodeRabbit retry completed at source head
`9786d177c65f65f6983d704eb841c62a19845f8f` with two unresolved findings:

- Guard the `design-canvas.jsx` grip scale calculation against zero-width
  elements so pointer movement cannot produce `Infinity`.
- Update the prototype Babel standalone script from `@babel/standalone@7.29.0`
  to `7.29.4` and replace the integrity hash for that pinned version.

## Retry Finding Repair

### Design-canvas grip scale guard

**Finding:** Guard the `design-canvas.jsx` grip-scale calculation against
zero-width elements so pointer movement cannot produce `Infinity`.

**Disposition:** repaired.

**Evidence:** `design-canvas.jsx` now computes `rawScale` only when
`offsetWidth` is non-zero and falls back to scale `1` unless the computed value
is finite and positive.

### Babel standalone version and integrity

**Finding:** Update the prototype Babel standalone script from
`@babel/standalone@7.29.0` to `7.29.4` and replace the integrity hash for that
pinned version.

**Disposition:** repaired.

**Evidence:** `index.html` now pins
`https://unpkg.com/@babel/standalone@7.29.4/babel.min.js` with SHA-384 SRI
hash `qVgGRi0TCdh+xrBD9+4kG0YlkbOkWu2J3CB46EekpYQmtM96n9v+uaKIS5ipaqKb`,
computed from the pinned unpkg URL on 2026-05-26.

## Next Action

Rerun the CodeRabbit pre-PR provider against the repaired source before running
Local Qwen or claiming aggregate Stage 4 review evidence.

## Repaired-Source Retry Finding Repair

The repaired-source CodeRabbit retry completed at source head
`00978d3585fecc3475f2480052e69b1847698be0` with three unresolved findings.

### Stale normalized provider fixture text

**Finding:** Replace the stale normalized CodeRabbit evidence entry in
`docs/specs/BANDIT-034-coderabbit-rerun-output.json`.

**Disposition:** no-action for historical evidence; superseded by current repair
evidence pending provider rerun.

**Evidence:** The fixture records the repaired-source provider output that
blocked Stage 4. Codex PM did not rewrite that historical provider result into
pass evidence. The fixture finding body was normalized to avoid carrying the
obsolete package-version text forward, and the next CodeRabbit provider rerun
must replace the fixture with current output before Stage 4 can proceed.

### TweaksPanel edit-mode persistence target origin

**Finding:** Restrict `TweaksPanel` `window.parent.postMessage` for
`__edit_mode_set_keys` to a trusted parent origin or handshake instead of
dispatching tweak edits to `*`.

**Disposition:** repaired.

**Evidence:** `tweaks-panel.jsx` now records the edit-mode host origin from the
parent activation/deactivation handshake and only posts `__edit_mode_set_keys`
when a trusted host origin has been captured. The availability/dismissal
handshake remains non-sensitive and uses the captured origin once known.

### TweaksPanel segment track-ref guard

**Finding:** Guard `TweaksPanel` `segAt` before calling
`trackRef.current.getBoundingClientRect()` so pointer handlers do not throw if
the track ref has been cleared.

**Disposition:** repaired.

**Evidence:** `tweaks-panel.jsx` now returns `null` when the segment track ref
is absent, exits pointer handling for that case, and clamps zero-width segment
math with a minimum inner width of `1`.

## Current Next Action

The current repaired-source CodeRabbit retry completed at source head
`77b668c436ce0027783ac57a67dbe61af11df475` with one unresolved minor finding:
remove unsupported OpenType feature `"cv11"` from the Instrument Sans
`font-feature-settings` declaration in
`docs/design/workflow-cockpit/prototype-source/design-system/colors_and_type.css`.

### Instrument Sans font-feature setting

**Finding:** Remove unsupported OpenType feature `"cv11"` from the Instrument
Sans `font-feature-settings` declaration and leave only `"ss01"`.

**Disposition:** repaired.

**Evidence:** `colors_and_type.css` now sets global
`font-feature-settings: "ss01";` without the unsupported `"cv11"` feature.

## Next Action

Rerun the CodeRabbit pre-PR provider against the repaired source before running
Local Qwen, refreshing aggregate review subject evidence, or claiming Stage 4
pass evidence.

## Latest Current-Source Finding Repair

The latest CodeRabbit rerun completed at source head
`43776fe84c7ba316f14fb3ff985ce6f97bbeac5b` with two unresolved findings.

### ActionButton ARIA disabled value

**Finding:** Update `aria-disabled={disabled}` in
`docs/design/workflow-cockpit/prototype-source/ui.jsx` to pass an explicit ARIA
string value.

**Disposition:** repaired.

**Evidence:** `ui.jsx` now renders
`aria-disabled={disabled ? "true" : "false"}` while preserving the native
`disabled` attribute and visual `data-disabled` state.

### Design-canvas keyboard handler stability

**Finding:** Stabilize the focus-overlay keyboard handler by adding an
appropriate `useEffect` dependency array and memoizing the `go` and `goSection`
callbacks.

**Disposition:** repaired.

**Evidence:** `design-canvas.jsx` now memoizes `go` and `goSection` with
`React.useCallback` and scopes the document `keydown` listener effect to those
callbacks, avoiding listener teardown/re-add on unrelated focus-overlay renders.

## Latest Repair Verification

- `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs`
  passed with 12 tests.
- `npm test` passed with 255 tests.
- `npm run typecheck` passed.
- `npm run bandit -- validate` passed.
- `npm run bandit -- cockpit status --json` passed and reported the next action
  agreement as `pass` with stale review evidence surfaced.
- `git diff --check` passed.

## Current Next Action

Rerun the CodeRabbit pre-PR provider against the repaired source before running
Local Qwen, refreshing aggregate review subject evidence, or claiming Stage 4
pass evidence.
