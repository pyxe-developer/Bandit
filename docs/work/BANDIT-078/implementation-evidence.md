# BANDIT-078 Implementation Evidence

contract_version: 1
work_item: BANDIT-078
stage: stage3_implementation
author: implementation_writer
implementation_writers: MiniMax-M3 via headless pi, Claude Sonnet 4.6 via claude -p
model_family: minimax, claude
recorded_at: 2026-06-08T21:35:09Z
verdict: pass

## Summary

Stage 3 implemented the Guarded CLI Action Requests cockpit slice after
Codex-authored RED evidence. Implementation was routed to external writer
models after Claude-family dispatches timed out; MiniMax-M3 delivered the broad
guarded-action source surface and Claude completed the final label repair.

The cockpit now derives CLI request-only action affordances with command
families, command previews, source links, authority owners, role/operator gates,
unavailable routes, and explicit false browser authority flags. The browser
shell renders those request details without command execution, browser storage,
artifact writes, workflow mutation, UAT approval, landing-safety decisions,
merge, push, deploy, or policy changes.

## Files Changed By Stage 3 Writers

- `src/state/cockpit-actions.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `public/cockpit/index.html`
- `public/cockpit/cockpit.css`
- `docs/work/BANDIT-078/writer-report.md`

## Writer Dispatch Evidence

- `docs/work/BANDIT-078/stage3-dispatch.md`
- `docs/work/BANDIT-078/stage3-dispatch-short.md`
- `docs/work/BANDIT-078/stage3-minimax-dispatch.md`
- `docs/work/BANDIT-078/stage3-minimax-repair-dispatch.md`
- `docs/work/BANDIT-078/stage3-minimax-viewmodel-repair-dispatch.md`
- `docs/work/BANDIT-078/stage3-claude-label-repair-dispatch.md`
- `docs/work/BANDIT-078/stage3-dispatch-attempt.md`
- `docs/work/BANDIT-078/writer-report.md`

The writer report records a Claude-side Bash hook blocker because Claude could
not run `node --test` or `npm` commands inside its own session. Codex PM reran
the required verification from the orchestrator shell; those PM-side command
results are the authoritative verification for Stage 3 acceptance.

## Acceptance Criteria Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Guarded action request affordances derive from CLI/repo status and approved command families. | `src/state/cockpit-actions.ts` derives request-only affordances from `CockpitStatus` and command-family policy, with live and legacy compatibility paths. |
| Records include id, label, command family, enabled state, reason, source, authority owner, role/operator gate, and unavailable route. | `CockpitActionAffordance` includes the required fields plus command preview, presentation state, request mode, and explicit false authority flags. |
| Read-only validation and evidence inspection are available; review, landing, and UAT remain gated. | Focused action tests pass, including available read-only requests and disabled future-stage requests with concrete routes. |
| Unavailable or operator-owned actions render disabled or excluded with reasons and source links. | `src/cockpit/browser-shell.ts` renders disabled reasons, unavailable routes, command previews, owner/role/operator gates, and source links. |
| Browser does not execute CLI commands or mutate repo/workflow state. | Browser shell tests pass for no forms, no `fetch`, no browser storage, canonical state owner, prohibited authority list, and false authority flags. |
| Rendering remains responsive and accessible. | `test/cockpit-ui.test.mjs` and `test/cockpit-browser-shell.test.mjs` pass responsive, focus-order, disabled-state, source-link, and dense-layout checks. |
| Static preview remains non-canonical and source-linked. | `public/cockpit/index.html` and `public/cockpit/cockpit.css` are generated/static preview artifacts; tests confirm the preview is refreshed from live-status work item data. |

## Validation Results

- `node --test test/cockpit-actions.test.mjs` - pass, 3/3.
- `node --test test/cockpit-ui.test.mjs` - pass, 8/8.
- `node --test test/cockpit-browser-shell.test.mjs` - pass, 7/7.
- `node --test test/cockpit-view-model.test.mjs` - pass, 8/8.
- `npm run typecheck` - pass.
- `npm test` - pass, 579/579.
- `git diff -- test docs/work/BANDIT-078/red-evidence.md docs/artifact-inputs/BANDIT-078-red-evidence.json` - no diff.

## No-Test-Edit Evidence

Stage 3 writers did not edit tests, test helpers, fixtures, RED evidence, or
acceptance mappings. PM verification confirmed no diff under:

- `test/**`
- `docs/work/BANDIT-078/red-evidence.md`
- `docs/artifact-inputs/BANDIT-078-red-evidence.json`

## Authority Boundary

The implementation is presentation-derived and request-only. It does not grant
browser-side CLI execution, local API authority, browser storage authority,
artifact-write authority, workflow-mutation authority, UAT approval authority,
landing-safety authority, merge, push, deploy, policy-change authority, or
Trust Verifier cutover authority.

## Notes For Stage 4

Stage 4 should review the compatibility strategy that uses non-enumerable
properties to keep older minimal enumerable action shapes while exposing
expanded guarded metadata and browser labels through normal property access.
This is accepted for Stage 3 because focused and full verification pass, but it
is a useful clean-code review focus.
