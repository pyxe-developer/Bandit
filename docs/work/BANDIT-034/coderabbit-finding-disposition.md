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

## Next Action

Repair or disposition the two unresolved CodeRabbit retry findings before
running Local Qwen or claiming aggregate Stage 4 review evidence.
