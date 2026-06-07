# BANDIT-067 RED Evidence

## Status

`failing_as_expected` for stage2_red_evidence.

Focused Test Writer-owned RED tests define the live cockpit-status browser
view before production implementation. The tests assert that the existing
cockpit payload from `bandit cockpit status --json` is mapped into
presentation-ready view-model and browser-shell surfaces without making browser
state canonical, and that the static preview reflects the current live work
item instead of stale `BANDIT-066` preview content.

## Test Commands

```sh
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-browser-shell.test.mjs
```

## Observed Output

```text
not ok 6 - cockpit view model maps live CLI payload fields into first-screen status cues
error: expected gate_strip to include stage_0_context_readiness through stage_6_retrospective, but current output stops at stage_3_implementation.
# pass 6
# fail 1

not ok 4 - browser cockpit shell renders live CLI status fields on the first screen
error: rendered HTML omitted Phase 8 live-status fields including current phase, operator input, UAT, bootstrap-gap, coordination, and full gate detail.

not ok 5 - static cockpit preview is refreshed from the current live-status work item
error: public/cockpit/index.html still renders BANDIT-066 fixture-oriented preview content instead of BANDIT-067 live-status content.
# pass 3
# fail 2
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The browser-served cockpit preview renders current status data derived from `node ./bin/bandit.mjs cockpit status --json`, not stale `BANDIT-066` fixture-oriented preview content. | `test/cockpit-browser-shell.test.mjs` adds `static cockpit preview is refreshed from the current live-status work item` and expects `public/cockpit/index.html` to include `BANDIT-067`, the current Stage 2 next action, and `docs/work/BANDIT-067/coordination-log.jsonl`, while excluding the old `BANDIT-066` preview title. |
| A typed adapter or equivalent bounded module maps the CLI JSON payload into presentation-ready cockpit view-model data without moving workflow authority into UI components. | `test/cockpit-view-model.test.mjs` adds `cockpit view model maps live CLI payload fields into first-screen status cues`, using `liveCockpitStatusFixture()` to exercise the public `buildCockpitViewModel` adapter boundary. |
| The first screen shows current phase, active or last closed work item, exact next action, operator-input state, blockers or stale evidence, gate strip, landing readiness, UAT status, bootstrap-gap state, coordination state, improvement-health summary, and source artifact links when available in the CLI payload. | The new view-model test requires status cues for current phase, active work, next action, operator input, blockers/stale evidence, landing readiness, UAT, bootstrap gaps, coordination state, and improvement health. The new browser-shell test requires those fields and all Stage 0 through Stage 6 gate IDs in rendered HTML. |
| Missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, and blocked states are rendered explicitly with source or reason text rather than hidden or normalized to green. | The new live-status fixture includes `stage_2_red_evidence: missing`, `landing_readiness: not_ready`, `uat: not_applicable`, `bootstrap_gaps: none`, and `coordination.current_state: orchestration_plan_recorded`; tests require visible status text and source-linked evidence. |
| Every displayed workflow status remains traceable to source paths or payload source fields; the UI does not synthesize trust without evidence. | The new view-model test requires every status cue to carry `source` or `sources`, and the browser-shell test requires the coordination source link. Existing authority-boundary tests continue to reject browser storage, forms, local API calls, merge, push, deploy, and policy override behavior. |
| Guarded action affordances remain disabled or request-only unless an approved CLI command family is available; no browser code invokes CLI commands, writes repo artifacts, approves UAT, decides landing safety, merges, pushes, deploys, or changes policy. | Existing browser-shell and action-affordance tests continue to cover CLI command-family display, disabled review/UAT/landing controls, no mutation forms, no browser storage, and no API/merge/push/deploy strings. |
| Responsive verification covers desktop and mobile widths with no overlapping or truncated current next action, work item title, source paths, gate labels, disabled reasons, or evidence detail. | Existing responsive shell tests remain in the focused command set; the new browser-shell live-status test expands the content that must fit, including long next-action text, all gate labels, disabled reasons, and source paths. |
| Accessibility verification covers semantic landmarks, button roles and disabled states, focus order, source-link reachability, and readable status cues for the live-status view. | Existing accessibility shell tests remain in the focused command set; the new browser-shell live-status test requires the status cues to be rendered in the semantic shell so those controls and links stay reachable. |

## Test Ownership And Model-Family Separation

- Test Writer-owned surfaces changed in Stage 2: `test/cockpit-view-model.test.mjs`,
  `test/cockpit-browser-shell.test.mjs`, and
  `test/helpers/cockpit-status-fixture.mjs`.
- Stage 3 Writer authority over tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, and retrospective evidence is zero.
- Because Codex authored the Stage 2 RED tests, Stage 3 implementation must be
  dispatched to Claude through the bootstrap Process Adapter path or another
  different model family. During bootstrap, Claude is the allowed Stage 3
  Writer path.

## Next Action

Dispatch Stage 3 implementation for `BANDIT-067` to Claude through the
bootstrap Process Adapter path. Implement the smallest source-only live-status
adapter, view-model, browser-shell rendering, and static preview refresh needed
to satisfy the focused RED tests without editing tests, test helpers, fixtures,
RED evidence, acceptance mappings, formation evidence, review evidence, UAT
evidence, landing evidence, retrospective evidence, local API behavior, live
polling, browser-side CLI execution, State Index persistence, dependency or
lockfile changes, merge, push, deploy, Trust Verifier cutover, or unrelated
Phase 8 cockpit features.
