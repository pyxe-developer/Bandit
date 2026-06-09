# BANDIT-083 Stage 3 Implementation Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-083`.

## Goal

Implement the narrow Bandit Cockpit UI Polish From Attached Design behavior
needed to satisfy the Stage 2 RED tests without editing Test Writer-owned
surfaces.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-083/brief.md`
- `docs/work/BANDIT-083/orchestration-plan.md`
- `docs/work/BANDIT-083/red-evidence.md`
- `test/cockpit-ui.test.mjs`
- `test/cockpit-browser-shell.test.mjs`
- `docs/design/workflow-cockpit/bandit-ui-polish-source.md`
- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `src/cockpit/generate-cockpit-preview.ts`
- `public/cockpit/cockpit.css`
- `public/cockpit/index.html`

## Source Scope

Implement only the smallest source and presentation changes required for:

- Evidence Row as the primary gate/evidence-detail pattern.
- Row-level non-color status and freshness cues in public render objects.
- Browser HTML rows with `evidence-row` classes, `data-evidence-state`, and
  `data-freshness-state`.
- Desktop and mobile responsive metadata that explicitly reports source-path and
  detail-row wrapping.
- Design-token CSS aligned with the attached source:
  near-black canvas, coral attention accent, green pass state, red blocker
  state, restrained blue source links, `Instrument Sans`, `IBM Plex Mono`,
  4px spacing token, compact cards, and 8px-or-less controls.
- Static preview refresh so `public/cockpit/index.html` reflects active
  `BANDIT-083` with `orchestration_plan_recorded` coordination state.
- Presentation-only browser boundary: no CLI execution, no repo writes, no
  browser storage, no approval/UAT/landing authority, no scheduling, no claims,
  no merge/push/deploy, no policy/model routing, no local API, no State Index,
  no live polling, no guarded action execution.

Likely implementation surfaces:

- `src/cockpit/render.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `src/cockpit/generate-cockpit-preview.ts`, only if needed for rebuildability
- `public/cockpit/cockpit.css`
- `public/cockpit/index.html`
- `docs/work/BANDIT-083/writer-report.md`

## Current RED Signal

```text
node --test test/cockpit-ui.test.mjs: fail 1/9
- `shell.gate_matrix.presentation_pattern` is undefined instead of
  `evidence_row`; row-level Evidence Row metadata and labels are missing.

node --test test/cockpit-browser-shell.test.mjs: fail 3/7
- CSS lacks `--color-attention`, `--color-pass`, `--color-blocker`,
  `--color-source-link`, `--space-1: 4px`, `Instrument Sans`, and
  `IBM Plex Mono`.
- `public/cockpit/index.html` still renders `BANDIT-067` instead of active
  `BANDIT-083`.
- Browser HTML lacks `class="evidence-row ..."`, `data-evidence-state`,
  `data-freshness-state`, visible state labels, visible freshness labels, and
  desktop source/detail wrapping metadata.
```

## Forbidden Files And Surfaces

Do not edit:

- `test/cockpit-ui.test.mjs`
- `test/cockpit-browser-shell.test.mjs`
- any other `test/**` file
- `docs/work/BANDIT-083/red-evidence.md`
- `docs/work/BANDIT-083/orchestration-plan.md`
- `docs/work/BANDIT-083/brief.md`
- `docs/work/BANDIT-083/qwen-formation-review.md`
- `docs/work/BANDIT-083/coderabbit-formation-review.md`
- `docs/work/BANDIT-083/formation-review.md`
- `docs/work/BANDIT-083/coordination-log.jsonl`
- review, landing, UAT, retrospective, or closeout evidence

Do not implement:

- local API endpoints
- live polling or websocket updates
- browser-side CLI execution
- browser storage as workflow state
- State Index persistence
- workflow mutation from the browser
- inbox or work-intake mutation
- guarded action execution
- scheduler, claim, or worktree lifecycle
- V0 Closeout Claude Code A/B trial execution
- public benchmark publication
- paid reviewer/model routing
- hosted services
- dependency or lockfile changes
- package script changes
- CI/release changes
- merge, push, or deploy behavior
- Trust Verifier cutover or old-gate replacement

## Verification

Run and report:

```sh
node --test test/cockpit-ui.test.mjs
node --test test/cockpit-browser-shell.test.mjs
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-evidence-detail.test.mjs
node --test test/cockpit-actions.test.mjs
npm run typecheck
npm run bandit -- validate
node ./bin/bandit.mjs coordination validate BANDIT-083
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run `npm test` if implementation touches shared cockpit derivation, action
affordances, evidence detail, command routing, validators, package scripts, or
other shared surfaces beyond the listed cockpit presentation files.

## Required Output

Write `docs/work/BANDIT-083/writer-report.md` with:

- changed files
- command results
- acceptance criteria covered
- clean-code posture
- explicit statement that no Test Writer-owned surfaces were edited
- explicit statement that browser/render/static preview remain
  presentation-only and non-canonical
- blockers, if any
