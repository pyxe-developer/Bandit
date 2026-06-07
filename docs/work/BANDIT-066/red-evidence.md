# BANDIT-066 RED Evidence

## Status

`failing_as_expected` for stage2_red_evidence.

Focused Test Writer-owned RED tests define the public browser-served cockpit shell boundary before production implementation. The test surface expects a browser shell module that renders a local static preview document from the existing cockpit view model, preserves CLI Authority and repo-native evidence traceability, excludes browser-owned workflow mutation, and exposes responsive and accessible shell constraints.

## Test Command

```sh
node --test test/cockpit-browser-shell.test.mjs
```

## Observed Output

```text
not ok 1 - browser cockpit shell renders a served document with attention, evidence, and guarded actions
error: Cannot find module '/Users/matthewflebbe/Bandit/src/cockpit/browser-shell.ts' imported from /Users/matthewflebbe/Bandit/test/cockpit-browser-shell.test.mjs
not ok 2 - browser cockpit shell excludes hidden workflow authority and mutable browser state
not ok 3 - browser cockpit shell exposes responsive and accessible shell constraints
# pass 0
# fail 3
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The browser shell can be served or previewed locally through a documented repo command or static entrypoint without requiring network services, provider credentials, merge/push/deploy authority, or a mutable local workflow database. | `test/cockpit-browser-shell.test.mjs` expects `renderBrowserCockpitShell` to return `preview_path: public/cockpit/index.html` plus static asset metadata. |
| The first screen renders a usable attention-first cockpit experience, not a marketing page: attention categories, active work/next action, blocked or stale state, gate strip, evidence/source traceability, guarded actions, and light queue context are visible. | The RED test asserts a complete HTML document with attention navigation, active-work main landmark, evidence aside, active work ID, next action, source links, and guarded CLI action buttons. |
| The browser layer consumes typed presentation data from existing or newly bounded cockpit view-model surfaces and does not parse repo-native artifacts or decide workflow authority inside UI components. | The test builds the shell from `buildCockpitViewModel(cockpitStatusFixture())` and imports only the public browser shell renderer. |
| Every displayed workflow state has source-linked evidence, a freshness/missing/blocked cue, or an explicit unavailable reason rather than unexplained green status. | The RED test asserts rendered evidence paths and the disabled review-gate reason `Stage 2 RED evidence is missing.` |
| Guarded action affordances are visibly tied to CLI command families, disabled when unavailable, and never imply UAT approval, policy override, landing authority, merge, push, deploy, or hidden workflow mutation. | The RED test checks `data-command-family` attributes, disabled review controls, zero mutation forms, and absence of API, merge, push, deploy, policy override, and browser storage behavior. |
| Responsive verification covers desktop and mobile widths with no overlapping or truncated critical text, controls, source paths, status chips, or dense evidence panels. | The RED test asserts mobile viewport metadata, `text_overflow: false`, source path wrapping, no overlaps, responsive CSS, and accessible focus styling. |
| Accessibility verification covers semantic landmarks, button roles and disabled states, focus order, contrast, and keyboard reachability for the initial shell. | The RED test asserts navigation, main, complementary landmarks, disabled button semantics from the rendered HTML, focus order, and `:focus-visible` CSS. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-066 to Claude through the bootstrap Process Adapter path because Codex authored the RED tests. Implement the smallest browser shell module and static preview boundary needed to satisfy `test/cockpit-browser-shell.test.mjs` without editing tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, UAT evidence, landing evidence, or retrospective evidence.
