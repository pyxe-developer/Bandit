# BANDIT-050 Implementation Evidence

## Status

Stage 3 Complete

## Writer Identity

- writer_identity: claude_process_adapter
- model_family: claude
- base_sha: 27ae6d8b2a07965b071f356bbaaa921386ff177b

## Summary

Updated `src/state/cockpit-status.ts` to recover the common interstitial state where
`CURRENT_CONTEXT.md` records no active work item but `.bandit/bootstrap-gaps.json`
has an active gap with a queued next item. The command now:

1. Derives bootstrap-gap state once from `.bandit/bootstrap-gaps.json`.
2. Detects `none`/`none.` active-work markers and transitions to gap-driven evidence
   resolution.
3. Resolves the next expected work item from the last resolved linked gap.
4. Validates that the next queued bootstrap gap exists for valid no-active-work recovery.
5. Reports stage gates, required evidence paths, and required evidence sources for the
   newly resolved work item without introducing hidden cockpit state authority.
6. Maintains existing fail-closed behavior for missing/contradictory source artifacts.

## Files Changed by Writer

- `src/state/cockpit-status.ts`

## Forbidden Test-Owned Surfaces

No test, test helper, fixture, RED evidence, or acceptance mapping files were edited.

## Verification

| Command | Result |
| --- | --- |
| `node ./bin/bandit.mjs session-context current --json` | pass |
| `node ./bin/bandit.mjs cockpit status --json` | pass |
| `npm run bandit -- validate` | Bandit state is valid. |
| `git diff --check` | pass |
