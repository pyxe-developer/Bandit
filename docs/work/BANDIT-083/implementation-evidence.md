# BANDIT-083 Implementation Evidence

contract_version: 1
work_item: BANDIT-083
stage: stage3_implementation
author: implementation_writer
implementation_writers: Claude Sonnet 4.6 via claude -p, MiniMax-M3 via headless pi
model_family: claude, minimax
recorded_at: 2026-06-09T14:34:14Z
verdict: pass

## Summary

Stage 3 implemented the Bandit Cockpit UI Polish From Attached Design slice.
Claude Sonnet 4.6 produced the first partial source implementation but timed
out at a shell command approval boundary before completing preview generation
and Writer evidence. MiniMax-M3 completed the Stage 3 implementation,
regenerated the static preview, wrote the Writer report, and then completed a
bounded PM-requested repair so the Review gate remains disabled until both RED
and implementation evidence are recorded.

The cockpit now presents stage gates and evidence detail as Evidence Rows with
explicit non-color status and freshness labels, source-path wrapping, compact
design-token styling, and refreshed `BANDIT-083` static preview content while
preserving the browser shell as read-only, presentation-only, and
CLI-authority-bound.

## Files Changed By Stage 3 Writers

- `src/state/cockpit-evidence-detail.ts`
- `src/state/cockpit-actions.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `public/cockpit/cockpit.css`
- `public/cockpit/index.html`
- `docs/work/BANDIT-083/writer-report.md`

## Writer Dispatch Evidence

- `docs/work/BANDIT-083/stage3-dispatch.md`
- `docs/work/BANDIT-083/stage3-minimax-dispatch.md`
- `docs/work/BANDIT-083/stage3-review-affordance-repair-dispatch.md`
- `docs/work/BANDIT-083/writer-report.md`

Claude timed out after the prompt-required 15-minute window. MiniMax-M3 was
used as the fallback implementation writer. The second MiniMax repair completed
the PM acceptance concern and reported passing verification.

## Acceptance Criteria Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Evidence Row or equivalent gate rows are the primary stage/gate pattern with clear state. | `src/state/cockpit-evidence-detail.ts`, `src/cockpit/render.ts`, and `src/cockpit/browser-shell.ts` expose `presentation_pattern: evidence_row`, status labels, freshness labels, and evidence row classes/data attributes. |
| Source artifact paths, current/next action, work item ID, operator input, action-request state, freshness, and status labels remain readable. | `public/cockpit/index.html` is regenerated from the `BANDIT-083` snapshot; browser-shell tests confirm source-linked gate matrix, evidence detail, live status, and guarded request rows. |
| Browser remains presentation-only and does not execute CLI commands or mutate workflow state. | Existing guarded action and browser-shell tests pass; render/browser artifacts keep request-only metadata and no browser storage, forms, `fetch`, CLI execution, artifact writes, UAT approval, landing decisions, merge, push, deploy, or policy authority. |
| Design moves toward the attached dense three-pane Evidence Row direction. | `public/cockpit/cockpit.css` and `src/cockpit/browser-shell.ts` introduce attention/pass/blocker/source-link tokens, 4px spacing token, Instrument Sans UI copy, IBM Plex Mono command previews, compact rows, and regenerated Evidence Row markup. |
| Responsive and accessibility evidence covers desktop/mobile rows and non-color-only cues. | Focused cockpit tests pass for desktop/mobile responsive metadata, source path wrapping, no overlap, visible status/freshness labels, disabled reasons, focus semantics, and source links. |
| Stage 4 review remains gated until implementation is recorded. | `src/state/cockpit-actions.ts` now enables `run_review_gate` only when both Stage 2 RED and Stage 3 implementation gates are `pass`; regenerated static preview shows the Review gate disabled while Stage 3 is still missing. |

## Validation Results

- `node --test test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs test/cockpit-view-model.test.mjs test/cockpit-evidence-detail.test.mjs test/cockpit-actions.test.mjs` - pass, 30/30.
- `npm test` - pass, 596/596.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass.
- `node ./bin/bandit.mjs coordination validate BANDIT-083` - pass.
- `node ./bin/bandit.mjs cockpit status --json` - pass.
- `node ./bin/bandit.mjs session-context current --json` - pass.
- `git diff --check` - pass.

## Test Ownership Boundary

Codex/Test Writer authored Stage 2 RED changes in:

- `test/cockpit-ui.test.mjs`
- `test/cockpit-browser-shell.test.mjs`

Stage 3 Writers were forbidden from editing Test Writer-owned files. Writer
reports state no `test/**`, fixture, RED evidence, formation evidence, review
evidence, UAT evidence, landing evidence, or retrospective evidence was edited
by Stage 3. PM inspection confirmed the remaining test diffs are the Stage 2
RED changes recorded in `docs/work/BANDIT-083/red-evidence.md`.

## Clean-Code And Authority Boundary

- Source changes remain localized to cockpit status/evidence derivation,
  action-request derivation, render metadata, browser-shell presentation,
  design-token CSS, and regenerated static preview output.
- Canonical workflow state remains repo-native and CLI-derived; generated
  browser preview state is not authority.
- The Review gate repair keeps failure clarity explicit: missing Stage 2 names
  missing RED evidence; missing Stage 3 names missing implementation evidence.
- The non-enumerable row presentation metadata is accepted for Stage 3 because
  it preserves legacy shape compatibility and focused/full verification passes;
  Stage 4 should still scrutinize it for maintainability.

## Notes For Stage 4

Stage 4 should review:

- maintainability of non-enumerable presentation metadata in
  `src/state/cockpit-evidence-detail.ts`;
- guarded action gate semantics in `src/state/cockpit-actions.ts`;
- regenerated preview fidelity and no hidden browser authority;
- browser responsive behavior and source-link readability.
