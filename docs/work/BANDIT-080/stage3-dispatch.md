# BANDIT-080 Stage 3 Implementation Writer Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-080` in
`/Users/matthewflebbe/Bandit`.

## Role And Authority

Implement the source/product behavior only. You are not the Test Writer, Work
Item PM, Reviewer, Landing Agent, UAT approver, or Closeout Agent.

You must not create, edit, delete, regenerate, format, or mechanically adjust
any tests, test helpers, fixtures, RED evidence, acceptance mappings,
formation evidence, review evidence, landing evidence, UAT evidence, or
retrospective evidence for `BANDIT-080`.

Forbidden write surfaces include:

- `test/**`
- `docs/work/BANDIT-080/red-evidence.md`
- `docs/work/BANDIT-080/orchestration-plan.md`
- `docs/work/BANDIT-080/brief.md`
- `docs/work/BANDIT-080/*formation-review.md`
- `docs/work/BANDIT-080/qwen-formation-review.md`
- `docs/work/BANDIT-080/coderabbit-formation-review.md`
- `docs/work/BANDIT-080/coordination-log.jsonl`
- `docs/work/BANDIT-080/review-evidence.md`
- `docs/work/BANDIT-080/coderabbit-review.md`
- `docs/work/BANDIT-080/local-qwen-review.md`
- `docs/work/BANDIT-080/uat-approval.md`
- `docs/work/BANDIT-080/landing-verdict.md`
- `docs/work/BANDIT-080/landing-action.md`
- `docs/work/BANDIT-080/retrospective.md`

Allowed write surfaces are limited to:

- `src/state/cockpit-status.ts`
- `src/state/cockpit-view-model.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/render.ts`, only if required for the queue/context
  presentation boundary
- `src/cockpit/preview-status-snapshot.ts`, only if required to keep the static
  preview coherent
- `public/cockpit/index.html`, only if regenerated from the implementation
- `public/cockpit/cockpit.css`, only if required for responsive text fit
- `docs/work/BANDIT-080/writer-report.md`
- `docs/work/BANDIT-080/implementation-evidence.md`

If you cannot satisfy the RED tests without touching a forbidden surface, stop
and write the blocker in `docs/work/BANDIT-080/writer-report.md`.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-080/brief.md`
- `docs/work/BANDIT-080/red-evidence.md`
- `test/cockpit-queue-context.test.mjs`
- `src/state/cockpit-status.ts`
- `src/state/cockpit-view-model.ts`
- `src/cockpit/browser-shell.ts`

## Goal

Make the browser-served Workflow Cockpit expose a lightweight, source-linked
Queue & Context surface from repo-native roadmap/current-context,
cockpit/session-context, coordination, and bootstrap-gap evidence without
turning the browser, fixture data, generated preview, or view model into
canonical queue state.

## Required Behavior

Implement the smallest clean-code surface needed for
`test/cockpit-queue-context.test.mjs`:

- Extend the presentation-only queue/context boundary in
  `src/state/cockpit-view-model.ts`.
- Map active anchor, next planned, and deferred planning items into rows with
  id or label, kind, status, relationship, summary, source artifacts, and
  deferred reason where applicable.
- Preserve roadmap/current-context/coordination/bootstrap-gap source links.
- Expose recent coordination context from recorded coordination state. If
  coordination is missing, render an unavailable/not-recorded row rather than
  inferring history.
- Render a compact `<section aria-label="Queue and context">` in the browser
  shell with queue rows, status labels, relationship labels, summaries,
  deferred reasons, recent transition rows, and source links.
- Preserve no-authority boundaries: no browser-side CLI execution, no repo
  writes, no roadmap edits, no UAT approval, no landing-safety decision, no
  scheduling, no claiming, no backlog editing, and no generated-state
  authority.
- Keep desktop/mobile responsive metadata honest: source paths and dense queue
  rows must wrap and report no overlap/text overflow.

Do not implement:

- backlog editing, queue prioritization controls, kanban lanes, drag/drop, work
  intake, scheduler execution, claim/worktree lifecycle, local API, live
  polling, websocket updates, State Index, SQLite, browser storage, or hidden
  generated state authority
- Operator Inbox/Operator Attention implementation
- Claude Code A/B trial execution, trial repo creation, scoring, or public
  benchmark publication
- guarded action execution
- PR/CI, merge, push, deploy, external service setup, hosted replay services,
  telemetry, paid reviewer/model routing, or Trust Verifier cutover

## Verification To Run

Run at least:

```sh
node --test test/cockpit-queue-context.test.mjs
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

Run additional focused tests if you touch adjacent files. Do not edit tests to
make them pass.

## Evidence To Write

Write `docs/work/BANDIT-080/writer-report.md` with:

- writer identity/model family
- files changed
- verification commands and results
- confirmation that no forbidden test/evidence surface was edited
- any blocker or follow-up

Write `docs/work/BANDIT-080/implementation-evidence.md` with:

- implementation summary
- acceptance criteria mapping
- clean-code self-check against `CLEAN_CODE.md`
- source-of-truth boundary confirmation
- verification results
- explicit statement that Stage 3 Writer did not edit tests, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, or retrospective evidence

## Current RED Signal

`node --test test/cockpit-queue-context.test.mjs` currently fails 3/3 because:

- `queue_context.summary` still reports bootstrap gaps and improvement
  candidates instead of active/next/deferred queue trajectory.
- `queue_context.recent_transitions` is undefined.
- the browser shell does not render `aria-label="Queue and context"`.
