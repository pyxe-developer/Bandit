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

## Babel/SRI Finding Repair

The latest CodeRabbit rerun completed at source head
`df55118889d3472e947b395c581eb978c2e45240` with one unresolved major finding.

### Babel standalone version and script integrity

**Finding:** Update `docs/design/workflow-cockpit/prototype-source/index.html`
to use Babel standalone `@7.29.7` and refresh the React, ReactDOM, and Babel
script integrity attributes to current CDN-published SRI hashes while
preserving `crossorigin="anonymous"`.

**Disposition:** repaired.

**Evidence:** `index.html` now loads
`https://unpkg.com/@babel/standalone@7.29.7/babel.min.js` with the current
CDN-published SHA-384 integrity hash
`sha384-ezQ6HS3FLspd9te19o2McUV6FAK091+GG7KO54f/R8DKgCDi7fULhapNrd5LY+vG`.
React `18.3.1` and ReactDOM `18.3.1` were recomputed from their pinned unpkg
payloads and already matched the current file attributes, so their script URLs,
integrity attributes, and `crossorigin="anonymous"` settings remain unchanged.

## Current Repair Verification

- Recomputed SHA-384 SRI hashes from the pinned unpkg payloads for React
  `18.3.1`, ReactDOM `18.3.1`, and Babel standalone `7.29.7`; React and
  ReactDOM matched the existing attributes, and Babel matched the repaired
  attribute.
- `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs`
  passed with 12 tests.
- `npm test` passed with 255 tests.
- `npm run typecheck` passed.
- `npm run bandit -- validate` passed.
- `npm run bandit -- cockpit status --json` passed and reported the next action
  agreement as `pass` with stale review evidence surfaced for the repaired
  Stage 4 evidence.
- `git diff --check` passed.

## Current Next Action

Rerun the CodeRabbit pre-PR provider against the repaired source before running
Local Qwen, refreshing aggregate review subject evidence, or claiming Stage 4
pass evidence.

## Latest Provider Rerun Result

The latest CodeRabbit rerun completed at source head
`c871b6251c8cd20176efcf9d33cac4e9b318ffb8` with four unresolved actionable
findings.

### Stale next-action UI copy

**Finding:** Replace the hardcoded `Create the next Phase 8 visual UI work item`
text in `screens.jsx` with dynamic content derived from app context or a prop,
with a fallback such as `Create the next work item`.

**Disposition:** repaired.

**Evidence:** `screens.jsx` now derives the home-screen next-action title,
summary, and command from `data.context.currentNextAction` /
`data.context.nextAction`, falls back to item-level next-action data, and uses a
generic `Create the next work item` fallback when no dynamic value is available.

### Malformed cockpit globals

**Finding:** Guard missing or malformed `window.COCKPIT_TWEAK_DEFAULTS` and
`COCKPIT_DATA` in `app.jsx` before calling `useTweaks` or `Object.keys`.

**Disposition:** repaired.

**Evidence:** `app.jsx` now normalizes `COCKPIT_DATA` and tweak defaults before
calling `useTweaks` or deriving item options. `screens.jsx` also supplies a
fallback work-item shape so missing item entries render a fail-closed missing
state instead of throwing.

### Missing queue-band guard

**Finding:** Guard `queueBand` before mapping `queueBand.rows` in
`screens.jsx` so the queue screen does not throw when the band is absent.

**Disposition:** repaired.

**Evidence:** `screens.jsx` now derives `queueRows` only when the queue band has
an array of rows and renders an explicit missing-queue empty state when the
payload has no queue rows.

### Design-canvas trusted sender validation

**Finding:** Validate message sender source and origin in `design-canvas.jsx`
before handling `__dc_set_zoom` or `__dc_probe` messages.

**Disposition:** repaired.

**Evidence:** `design-canvas.jsx` now rejects host-control messages unless the
message source is `window.parent` and the origin matches the trusted parent
origin, with the existing file/sandbox `null` origin path handled explicitly.

## Latest Four-Finding Repair Verification

- `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs`
  passed with 12 tests.
- `npm test` passed with 255 tests.
- `npm run typecheck` passed.
- `npm run bandit -- validate` passed.
- `npm run bandit -- cockpit status --json` passed and reported next-action
  agreement as `pass` with stale review evidence surfaced.
- `npm run bandit -- gaps list` passed and reported all bootstrap gaps resolved.
- `git diff --check` passed.
- Static prototype smoke opened at `http://127.0.0.1:4178/index.html`; runtime
  console showed only expected optional 404s for `favicon.ico` and the
  absent `.design-canvas.state.json` sidecar.

## Next Action

Rerun the scoped CodeRabbit pre-PR provider against the repaired source before
running Local Qwen, refreshing aggregate review-subject evidence, or claiming
Stage 4 pass evidence.

## Required Next CodeRabbit Scope

The next CodeRabbit provider rerun must review only the repair delta for the
four current findings. Use baseline commit `08c3ef803bd9bb78b85c6fd376815dad99676677`, the evidence commit
that recorded the current blocker state, and run exactly:

`coderabbit review --agent --base-commit 08c3ef803bd9bb78b85c6fd376815dad99676677 -c AGENTS.md --no-color --files docs/design/workflow-cockpit/prototype-source/screens.jsx docs/design/workflow-cockpit/prototype-source/app.jsx docs/design/workflow-cockpit/prototype-source/design-canvas.jsx`

After normalizing provider output into
`docs/specs/BANDIT-034-coderabbit-rerun-output.json`, record Bandit evidence
with:

`npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base base-commit:08c3ef803bd9bb78b85c6fd376815dad99676677 --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json`

Do not rerun the provider with `--base origin/main` for this repair loop unless
the scoped rerun is unavailable and the failure is recorded explicitly.
