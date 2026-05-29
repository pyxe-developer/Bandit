# BANDIT-048 Writer Dispatch

work_item: BANDIT-048
codex_pm: Codex
claude_writer: Claude Process Adapter
branch: main
base_sha: 05162c49528a3b45ab8bcd8bd7a1ce7088e6bdf7
dispatch_status: ready_for_writer

## Required First Reads

- AGENTS.md
- CONTEXT.md
- CLEAN_CODE.md
- docs/verification/STAGE_RUBRICS.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- docs/work/BANDIT-048/brief.md
- docs/work/BANDIT-048/red-evidence.md
- docs/specs/BANDIT-GAP-FOCUSED-SESSION-CONTEXT.json
- docs/specs/BANDIT-048-red-evidence.json
- test/focused-session-context.test.mjs

## Mission

Implement only the Stage 3 production repair for BANDIT-048 Focused Session
Context Packets. Codex authored the Stage 2 RED evidence, so this Stage 3
implementation must be authored by Claude through this Process Adapter
handoff.

Make `node --test test/focused-session-context.test.mjs` pass by adding the
narrow `bandit session-context current` command, deriving a focused
non-canonical current-session packet from repo artifacts, supporting `--json`
and `--markdown` renderings from the same packet model, preserving source
hierarchy and deep-read pointers, failing closed for missing or contradictory
current-state authority, and updating the cold-start evaluation packet.

## RED Command

```sh
node --test test/focused-session-context.test.mjs
```

Current expected RED state from Stage 2: 7 tests, 0 pass, 7 fail. The failing
tests show that `bandit session-context current` is not implemented, no
focused packet data model exists, no Markdown rendering path exists, missing
source-artifact validation is not reached, next-action disagreement is not
diagnosed, and `docs/evaluation/skills/bandit-cold-start.md` does not yet
exercise focused session context recovery.

## Editable Production And Evidence Paths

You may edit production implementation and Stage 3 implementation evidence
needed for this work item, limited to:

- docs/evaluation/skills/bandit-cold-start.md
- docs/templates/focused-session-context.md
- docs/specs/BANDIT-048-implementation-evidence.json
- docs/work/BANDIT-048/implementation-evidence.md
- docs/work/BANDIT-048/writer-report.md
- src/commands/session-context.ts
- src/state/focused-session-context.ts
- src/state/bootstrap-gaps.ts
- src/state/paths.ts
- src/state/smell-triggers.ts
- src/state/templates.ts
- src/state/work-items.ts
- src/cli.ts

If a necessary production path is not listed, stop and record the needed path
and rationale in `docs/work/BANDIT-048/writer-report.md` instead of widening
the diff silently.

## Forbidden Writer Surfaces

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- test/**
- test/helpers/**
- docs/work/BANDIT-048/red-evidence.md
- docs/specs/BANDIT-048-red-evidence.json
- docs/work/BANDIT-048/brief.md
- docs/specs/BANDIT-GAP-FOCUSED-SESSION-CONTEXT.json
- docs/work/BANDIT-048/dispatch.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- package.json
- package-lock.json
- acceptance mappings or Stage 2 RED evidence for BANDIT-048

Any test-owned surface touch invalidates the whole Stage 3 attempt. If you
believe a RED test or acceptance mapping is wrong, stop and write a test-change
request in `docs/work/BANDIT-048/writer-report.md`. Do not repair the test.

## Implementation Boundaries

- Add `bandit session-context current --json`.
- Add `bandit session-context current --markdown`.
- Derive packet content from existing repo artifacts instead of writing a
  `.bandit/session-context/current.json`, `docs/session-context/current.md`, or
  other hand-maintained packet file.
- Mark the packet as `kind: "focused_session_context_packet"` and
  `authority: "derived_non_canonical"`.
- Include current phase, active work item, active bootstrap gap, current stage,
  exact next action, required operator input, blockers, allowed actions,
  forbidden actions, required evidence paths, source artifacts, source
  hierarchy, stale or missing evidence notes, and deep-read pointers where
  available.
- Identify `AGENTS.md`, `CLEAN_CODE.md`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
  `docs/verification/STAGE_RUBRICS.md`, `.bandit/bootstrap-gaps.json`,
  `.bandit/policy/smell-triggers.json`, and
  `docs/evaluation/skills/bandit-cold-start.md` as source artifacts when their
  authority affects the current activation.
- Keep historical roadmap narrative, old closeout details, full glossary text,
  and deep source material behind source-linked deep-read pointers instead of
  replaying them in the packet.
- Fail closed with clear diagnostics when required source artifacts are missing
  or when `CURRENT_CONTEXT.md` and `ROADMAP.md` disagree on the next action.
- Update `docs/evaluation/skills/bandit-cold-start.md` so cold-start
  evaluation covers the Focused Session Context Packet, the
  `bandit session-context current --json` command, source-pointer deep reads,
  and next-action recovery without reading full roadmap history.
- Keep CLI authority first and repo-native artifacts canonical. The focused
  packet is a projection only.
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

Then run the relevant Stage 3 checks for touched command, projection, template,
and evaluation surfaces:

```sh
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs cockpit status --json
```

Run `npm test` if the implementation touches shared command routing,
validators, artifact renderers, work item parsing, cockpit status, templates,
bootstrap gaps, risk classification, supply-chain gates, or policy validation
beyond focused session-context behavior. Always run:

```sh
git diff --check
```

## Required Writer Report

Create `docs/work/BANDIT-048/writer-report.md` with:

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
