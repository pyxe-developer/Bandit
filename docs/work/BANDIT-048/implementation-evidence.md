# BANDIT-048: Focused Session Context Packets — Stage 3 Implementation Evidence

## Summary

Added `bandit session-context current [--json|--markdown]` as a new CLI
command. The command derives a `focused_session_context_packet` from existing
repo-native source artifacts on every invocation without creating any
hand-maintained packet file.

## New Files

### `src/state/focused-session-context.ts`

Exports `readFocusedSessionContext(repoRoot)`. Reads AGENTS.md (fail closed if
missing), CURRENT_CONTEXT.md, ROADMAP.md, and .bandit/bootstrap-gaps.json.
Extracts phase, active work item, next action, current stage, operator input,
allowed/forbidden actions, blockers, source artifacts, source hierarchy,
required evidence paths, and deep-read pointers. Throws with a clear diagnostic
if CURRENT_CONTEXT.md and ROADMAP.md disagree on next action.

### `src/commands/session-context.ts`

Exports `sessionContext(repoRoot, args)`. Routes `session-context current
--json` to JSON output and `session-context current --markdown` to a Markdown
rendering of the same packet model.

## Modified Files

### `src/cli.ts`

- Added `import { sessionContext }` for the new command module
- Added `if (command === "session-context")` routing block
- Updated the usage error string to include `session-context`

### `docs/evaluation/skills/bandit-cold-start.md`

Added a "Focused Session Context Packet Recovery" section covering:
- `bandit session-context current --json` as the first cold-start step
- Source-pointer deep reads via `deep_read_pointers`
- Next-action recovery without reading full roadmap history

## Packet Model Conformance

- `kind: "focused_session_context_packet"` ✓
- `authority: "derived_non_canonical"` ✓
- All eight required source artifacts listed ✓
- Source hierarchy first four: AGENTS.md, CURRENT_CONTEXT.md, ROADMAP.md,
  .bandit/bootstrap-gaps.json ✓
- Deep-read pointers for CONTEXT.md (full glossary text), ROADMAP.md
  (historical roadmap narrative), CURRENT_CONTEXT.md (old closeout details) ✓
- Fail-closed for missing AGENTS.md: exits 1 with
  `Missing session context source artifact: AGENTS.md` ✓
- Fail-closed for next-action disagreement: exits 1 with
  `Session context blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action` ✓
- No events written, no `.bandit/session-context/` or `docs/session-context/`
  files created ✓
