# BANDIT-083 Stage 3 MiniMax Fallback Dispatch

## Role And Boundary

You are the Stage 3 Implementation Writer fallback for `BANDIT-083 - Bandit Cockpit UI Polish From Attached Design`.

Claude Sonnet 4.6 was dispatched first with `docs/work/BANDIT-083/stage3-dispatch.md` and timed out after 15 minutes at a shell command approval boundary. Partial source edits exist in the worktree. Your job is to inspect the partial state, finish or repair only the Stage 3 implementation surface, regenerate the static preview from source, run the focused verification commands, and write `docs/work/BANDIT-083/writer-report.md`.

Do not widen scope. Do not perform Stage 4 review, Stage 5 landing, or Stage 6 closeout.

## Required Reads

Read before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-083/brief.md`
- `docs/work/BANDIT-083/red-evidence.md`
- `docs/work/BANDIT-083/stage3-dispatch.md`
- `docs/work/BANDIT-083/coordination-log.jsonl`
- Current diffs for the files listed below

## Test Ownership Boundary

Test Writer owns RED tests and fixtures. You must not edit:

- `test/cockpit-ui.test.mjs`
- `test/cockpit-browser-shell.test.mjs`
- any other `test/**` file

If a test change seems necessary, stop and report a blocker in the Writer report instead of editing tests.

## Authorized Implementation Surface

You may edit only source/generated implementation artifacts required by the brief:

- `src/state/cockpit-evidence-detail.ts`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `public/cockpit/cockpit.css`
- `public/cockpit/index.html`, but only by running the preview generator
- `docs/work/BANDIT-083/writer-report.md`

The static preview must be regenerated with:

```sh
node --import tsx/esm src/cockpit/generate-cockpit-preview.ts
```

Do not manually edit `public/cockpit/index.html` unless the generator itself is broken; if the generator is broken, record the blocker instead of hand-authoring generated output.

## Acceptance Targets

Complete the Stage 3 source implementation so the RED expectations pass:

- Cockpit gate matrix rows expose the `evidence_row` presentation pattern.
- Gate matrix rows include visible non-color status and freshness labels.
- Evidence detail rows use the Evidence Row pattern.
- Render metadata exposes source-path wrapping, visible status cues, and `uses_color_alone: false`.
- Browser HTML emits evidence-row classes and status/freshness data attributes.
- Browser responsive metadata reports wrapped source paths/detail rows and no overlaps.
- Design tokens replace the prior one-off primary token with attention, pass, blocker, source-link, and spacing tokens.
- Shell typography records Instrument Sans for UI copy and IBM Plex Mono for command previews.
- The static preview reflects `BANDIT-083`, not `BANDIT-067`.

## Verification Commands

Run these commands and include results in `writer-report.md`:

```sh
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-evidence-detail.test.mjs
node --test test/cockpit-actions.test.mjs
npm run typecheck
git diff --check
```

If any command fails, attempt a source-only repair inside the authorized surface. If a failure remains, record it as a blocker in `writer-report.md`.

## Writer Report

Write `docs/work/BANDIT-083/writer-report.md` with:

- summary of source files changed
- explicit statement that no test files were edited
- CLEAN_CODE.md compliance notes
- verification command results
- any blockers or non-blocking notes
- generated preview status
