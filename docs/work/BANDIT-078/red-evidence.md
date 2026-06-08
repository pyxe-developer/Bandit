# BANDIT-078 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Test Writer-owned RED tests now express the guarded CLI action request contract before implementation. The expected RED signal is that current cockpit action records are too sparse: they lack command previews, source links, authority owner, role/operator gates, unavailable routes, and explicit request-only/no-mutation fields, and the browser shell does not render those details.

## Test Command

```sh
node --test test/cockpit-actions.test.mjs && node --test test/cockpit-ui.test.mjs && node --test test/cockpit-browser-shell.test.mjs
```

## Observed Output

```text
test/cockpit-actions.test.mjs: fail 2/3 - expected action.request_mode to be cli_request_only but actual was undefined; validate_repo lacked command_preview, source, authority_owner, role_gate, operator_gate, unavailable_route, and no-mutation fields.
test/cockpit-ui.test.mjs: fail 2/8 - rendered controls did not propagate command_preview, source, authority owner, gates, unavailable_route, request_mode, or no-mutation fields.
test/cockpit-browser-shell.test.mjs: fail 2/7 - browser HTML did not contain data-request-mode, data-authority-owner, command previews, source-linked guarded request details, or unavailable routes.
The failing tests are intentional RED evidence for the BANDIT-078 guarded action request contract.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The cockpit exposes guarded action request affordances derived from current CLI/repo status and approved CLI command families rather than browser-owned workflow decisions. | test/cockpit-actions.test.mjs requires each action to carry cli_request_only mode, source, authority owner, gates, unavailable route, and no browser execution or workflow mutation authority. |
| A bounded action-eligibility module or equivalent view-model function maps CLI/repo evidence into presentation-ready action request records with id, label, command family, enabled state, reason, source, authority owner, role/operator gate, and unavailable route. | test/cockpit-actions.test.mjs deep-equals validate, review, landing, and UAT request records with command preview, source path, owner, role gate, operator gate, and route details. |
| Unavailable, stale, blocked, unsupported, operator-owned, or not-yet-scoped actions render as disabled or excluded with explicit reasons and source links. | test/cockpit-ui.test.mjs and test/cockpit-browser-shell.test.mjs require disabled review/UAT request metadata, disabled reasons, source links, and unavailable routes to render. |
| No browser code invokes CLI commands, writes repo artifacts, records UAT, decides landing safety, merges, pushes, deploys, changes policy, starts guarded action execution, or bypasses CLI Authority. | test/cockpit-actions.test.mjs asserts executes_in_browser, writes_repo_artifacts, and mutates_workflow_state are false for every request, and browser-shell tests reject form, fetch, and browser-storage authority. |
| Responsive and accessibility verification covers button states, command previews, owner/role labels, disabled reasons, source links, focus order, and no overlap or truncation. | test/cockpit-ui.test.mjs and test/cockpit-browser-shell.test.mjs preserve existing responsive/focus checks while adding request metadata rendering that Stage 3 must satisfy without editing Test Writer-owned surfaces. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-078 to Claude-family Implementation Writer. Implement guarded action request metadata and rendering without editing Test Writer-owned tests, fixtures, RED evidence, or acceptance mappings.
