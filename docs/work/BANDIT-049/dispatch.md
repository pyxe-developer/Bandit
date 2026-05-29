# BANDIT-049 Writer Dispatch

work_item: BANDIT-049
codex_pm: Codex
claude_writer: Claude Process Adapter
branch: main
base_sha: 17ae50bda46b88e8a2e9014ff37046e6b9b0a07c
dispatch_status: ready_for_writer

## Required First Reads

- AGENTS.md
- CONTEXT.md
- CLEAN_CODE.md
- docs/verification/STAGE_RUBRICS.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- docs/work/BANDIT-049/brief.md
- docs/work/BANDIT-049/red-evidence.md
- docs/specs/BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY.json
- docs/specs/BANDIT-049-red-evidence.json
- test/focused-session-context.test.mjs

## Mission

Implement only the Stage 3 production repair for BANDIT-049 Session Context
Interstitial Recovery. Codex authored the Stage 2 RED evidence, so this Stage 3
implementation must be authored by Claude through this Process Adapter
handoff.

Make `node --test test/focused-session-context.test.mjs` pass by adding the
narrow interstitial recovery path for `bandit session-context current --json`.
When repo artifacts agree that the latest work item is closed, its linked
bootstrap gap is resolved, and the next queued bootstrap gap has no linked work
item yet, the derived packet must report null active work and active gap,
`last_closed_work_item`, `next_queued_bootstrap_gap`, exact next action,
`none_required` operator input, blockers, allowed actions, forbidden actions,
source hierarchy, source artifacts, required evidence paths, and deep-read
pointers without inventing an active work item or making the packet canonical.

## RED Command

```sh
node --test test/focused-session-context.test.mjs
```

Current expected RED state from Stage 2: 9 tests, 6 pass, 3 fail. The failing
tests show that the focused packet still requires an active work item and active
bootstrap gap, so it blocks the valid closed-work/no-active-gap interstitial
state and returns the wrong fail-closed diagnostic for interstitial
CURRENT_CONTEXT.md / ROADMAP.md disagreement.

## Editable Production And Evidence Paths

You may edit production implementation and Stage 3 implementation evidence
needed for this work item, limited to:

- docs/specs/BANDIT-049-implementation-evidence.json
- docs/work/BANDIT-049/implementation-evidence.md
- docs/work/BANDIT-049/writer-report.md
- src/commands/session-context.ts
- src/state/focused-session-context.ts
- src/state/bootstrap-gaps.ts
- src/state/paths.ts
- src/state/smell-triggers.ts
- src/state/templates.ts
- src/state/work-items.ts
- src/cli.ts

If a necessary production path is not listed, stop and record the needed path
and rationale in `docs/work/BANDIT-049/writer-report.md` instead of widening
the diff silently.

## Forbidden Writer Surfaces

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- test/**
- test/helpers/**
- docs/work/BANDIT-049/red-evidence.md
- docs/specs/BANDIT-049-red-evidence.json
- docs/work/BANDIT-049/brief.md
- docs/specs/BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY.json
- docs/work/BANDIT-049/dispatch.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- package.json
- package-lock.json
- acceptance mappings or Stage 2 RED evidence for BANDIT-049

Any test-owned surface touch invalidates the whole Stage 3 attempt. If you
believe a RED test or acceptance mapping is wrong, stop and write a test-change
request in `docs/work/BANDIT-049/writer-report.md`. Do not repair the test.

## Implementation Boundaries

- Preserve `kind: "focused_session_context_packet"` and
  `authority: "derived_non_canonical"`.
- Keep repo artifacts canonical; do not write a hand-maintained session context
  packet file or hidden state index.
- Preserve the existing active-work path for normal active work item recovery.
- Add only the interstitial path for the closed-work/no-active-gap state proven
  by RED evidence.
- In the interstitial path, report `active_work_item: null` and
  `active_bootstrap_gap: null`; do not treat closed work as runnable active
  work.
- Report `last_closed_work_item` from repo evidence, including the closed work
  item ID, title where available, status, linked resolved bootstrap gap where
  available, and source artifact.
- Report `next_queued_bootstrap_gap` from `.bandit/bootstrap-gaps.json`,
  including ID, title, status, disposition, next action, and source artifacts.
- Report exact next action only when `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` agree under the existing normalized comparison
  rules; otherwise fail closed with the disagreement diagnostic expected by the
  RED tests.
- Preserve required operator input status as `none_required` when source
  artifacts say no operator-owned input is required.
- Preserve source hierarchy, source artifacts, required evidence paths,
  forbidden actions, allowed action, blockers, and deep-read pointers from repo
  artifacts.
- The packet's required evidence paths for interstitial recovery must point at
  the future work item's expected Stage 1 through Stage 6 evidence without
  requiring that work item to exist before creation.
- Missing or contradictory current-state artifacts must still fail closed with
  clear blocker messages.
- Do not implement Worktree Bootstrap Contract behavior, scheduler execution,
  event-driven wakeups, true parallel writable workstreams, local server/API
  mode, cockpit UI/server/API work, state-index persistence, automatic
  merge/push/deploy, product UAT, actor identity policy, claim leases, work
  surface reservations, PR/CI workflow, live reviewer routing changes, paid
  reviewer routing, external services, dependency or lockfile changes,
  installed global skill edits, or unrelated Phase 8 work.

## Verification Commands

Run the focused RED/GREEN command first:

```sh
node --test test/focused-session-context.test.mjs
```

Then run the relevant Stage 3 checks for touched command, projection, and
evidence surfaces:

```sh
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
```

Run `npm test` if the implementation touches shared command routing,
validators, artifact renderers, work item parsing, cockpit status, templates,
bootstrap gaps, risk classification, supply-chain gates, or policy validation
beyond focused session-context behavior. Always run:

```sh
git diff --check
```

## Required Writer Report

Create `docs/work/BANDIT-049/writer-report.md` with:

- writer_identity: claude_process_adapter
- model_family: claude
- base_sha
- implementation summary
- exact files changed by the Writer
- confirmation that no forbidden test-owned surfaces were edited
- focused and broader verification commands run, with pass/fail results
- clean-code self-check notes
- any stop condition, test-change request, or unresolved risk

Do not commit. Leave the working tree for Codex PM review.
