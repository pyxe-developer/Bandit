# BANDIT-079 Stage 3 Implementation Writer Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-079` in
`/Users/matthewflebbe/Bandit`.

## Role And Authority

Implement the source/product behavior only. You are not the Test Writer, Work
Item PM, Reviewer, Landing Agent, UAT approver, or Closeout Agent.

You must not create, edit, delete, regenerate, format, or mechanically adjust
any tests, test helpers, fixtures, RED evidence, acceptance mappings,
formation evidence, review evidence, landing evidence, UAT evidence, or
retrospective evidence for `BANDIT-079`.

Forbidden write surfaces include:

- `test/**`
- `docs/work/BANDIT-079/red-evidence.md`
- `docs/work/BANDIT-079/orchestration-plan.md`
- `docs/work/BANDIT-079/brief.md`
- `docs/work/BANDIT-079/*formation-review.md`
- `docs/work/BANDIT-079/qwen-formation-review.md`
- `docs/work/BANDIT-079/coderabbit-formation-review.md`
- `docs/work/BANDIT-079/coordination-log.jsonl`
- `docs/work/BANDIT-079/review-evidence.md`
- `docs/work/BANDIT-079/coderabbit-review.md`
- `docs/work/BANDIT-079/local-qwen-review.md`
- `docs/work/BANDIT-079/uat-approval.md`
- `docs/work/BANDIT-079/landing-verdict.md`
- `docs/work/BANDIT-079/landing-action.md`
- `docs/work/BANDIT-079/retrospective.md`

Allowed write surfaces are limited to:

- `src/state/cockpit-improvement-health.ts`
- `src/state/cockpit-view-model.ts`
- `src/cockpit/browser-shell.ts`
- `src/cockpit/render.ts`, only if required for the improvement-health
  presentation boundary
- `src/cockpit/preview-status-snapshot.ts`, only if required to keep the static
  preview coherent
- `public/cockpit/index.html`, only if regenerated from the implementation
- `public/cockpit/cockpit.css`, only if required for responsive text fit
- `docs/work/BANDIT-079/writer-report.md`
- `docs/work/BANDIT-079/implementation-evidence.md`

If you cannot satisfy the RED tests without touching a forbidden surface, stop
and write the blocker in `docs/work/BANDIT-079/writer-report.md`.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-079/brief.md`
- `docs/work/BANDIT-079/red-evidence.md`
- `test/cockpit-improvement-health.test.mjs`
- `src/state/cockpit-view-model.ts`
- `src/cockpit/browser-shell.ts`
- `src/state/improvements.ts`

## Goal

Make the browser-served Workflow Cockpit expose a compact, source-linked
Improvement Health surface from repo-native improvement evidence without
turning the browser, fixture data, generated preview, or view model into
canonical improvement state.

## Required Behavior

Implement the smallest clean-code surface needed for
`test/cockpit-improvement-health.test.mjs`:

- Add a dedicated `src/state/cockpit-improvement-health.ts` presentation-only
  boundary.
- Export `buildCockpitImprovementHealthSurface`.
- Map improvement candidates and evaluated outcomes into rows with candidate
  id, status, outcome, source work item, source artifacts, metric, baseline,
  expected direction, evaluation window, guardrail status, state, and next
  route.
- Count pending, evaluated, keep, revise, revert, double_down, and
  missing_metadata states.
- Fail closed for workflow-trial candidates missing decision criteria,
  uncertainty or minimum-detectable-effect context, re-evaluation window, or
  proxy-risk notes.
- Integrate the surface into `buildCockpitViewModel` as
  `improvement_health_surface`.
- Render a compact `<section aria-label="Improvement health">` in the browser
  shell with candidate IDs, status/outcome labels, metric/baseline text,
  guardrail summaries, next route, and source links.
- Preserve no-authority fields: no repo writes, no candidate evaluation, no
  outcome recording, no scheduler behavior, and no policy changes.
- Keep desktop/mobile responsive metadata honest: source paths and detail rows
  must wrap and report no overlap/text overflow.

Do not implement:

- automatic improvement evaluation
- scheduler execution or heartbeat execution
- local API, live polling, websockets, State Index, SQLite, browser storage, or
  hidden generated state authority
- guarded action execution
- claim/worktree lifecycle
- PR/CI, merge, push, deploy, external service setup, hosted replay services,
  telemetry, paid reviewer/model routing, or Trust Verifier cutover

## Verification To Run

Run at least:

```sh
node --test test/cockpit-improvement-health.test.mjs
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

Run additional focused tests if you touch adjacent files. Do not edit tests to
make them pass.

## Evidence To Write

Write `docs/work/BANDIT-079/writer-report.md` with:

- writer identity/model family
- files changed
- verification commands and results
- confirmation that no forbidden test/evidence surface was edited
- any blocker or follow-up

Write `docs/work/BANDIT-079/implementation-evidence.md` with:

- implementation summary
- acceptance criteria mapping
- clean-code self-check against `CLEAN_CODE.md`
- source-of-truth boundary confirmation
- verification results
- explicit statement that Stage 3 Writer did not edit tests, fixtures, RED
  evidence, or acceptance mappings

Stop after Stage 3 implementation evidence. Do not run Stage 4 review, UAT,
landing, closeout, roadmap edits, commits, merge, push, or deploy.
