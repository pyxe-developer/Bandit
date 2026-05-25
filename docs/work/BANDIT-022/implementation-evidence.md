# BANDIT-022 Implementation Evidence

## Status

`pass` for Stage 3 implementation evidence on 2026-05-25.
Focused Stage 4 repair implemented on 2026-05-25T19:15:51Z.

## Summary

Implemented the narrow heartbeat chore-agent inspection surface:

- `.bandit/policy/heartbeat-chore-agent.json` records the allowed read-only
  heartbeat authority envelope and explicit forbidden hidden-authority actions.
- `src/state/heartbeat-policy.ts` parses and validates that policy fail-closed.
- `src/commands/heartbeat.ts` exposes `bandit heartbeat inspect` and reports
  eligible active bootstrap-gap chores, due improvement evaluations,
  feature-slice UAT ineligibility, and operator-input blockers from repo-native
  artifacts.
- `src/cli.ts`, `src/commands/init.ts`, and `src/commands/validate.ts` wire the
  command and default policy into CLI authority.

## Clean-Code Self-Check

`CLEAN_CODE.md` was read before implementation. The implementation keeps the
heartbeat agent read-only, avoids landing or UAT authority, keeps policy parsing
separate from candidate inspection, and records evidence paths in command output
so future agents do not need chat history.

## Verification

- `node --test test/heartbeat-chore-agent.test.mjs` - pass, 10 tests.
- `npm test` - pass, 193 tests.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass.
- `npm run bandit -- gaps list` - pass; `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`
  remains active and linked to `BANDIT-022`.
- `git diff --check` - pass.

## Focused Stage 4 Repair

Codex PM re-read `CLEAN_CODE.md` before the repair. The focused repair resolves
the Stage 4 PM disposition in `stage4-finding-disposition.md` without expanding
heartbeat authority:

- `heartbeat inspect` now checks the Git worktree after validating heartbeat
  policy and before reading work items or bootstrap-gap candidates. It refuses
  dirty or uninspectable worktrees and does not append lifecycle events.
- Feature-UAT detection now reads the explicit `## UAT Status` section and
  stops at the next Markdown section, including end-of-file cases without a
  trailing newline.
- Bootstrap-gap next-action normalization now maps only bounded supported
  action phrases and falls back to `inspect` when the next action is ambiguous.
- Focused heartbeat tests now run in Git-backed temp repos and cover the
  dirty-worktree refusal, UAT section boundaries, EOF UAT parsing, and
  ambiguous next-action fallback.

Focused verification:

- `node --test test/heartbeat-chore-agent.test.mjs` - pass, 10 tests.
- `npm run typecheck` - pass.
- `npm test` - pass, 193 tests.
- `npm run bandit -- validate` - pass.
- `npm run bandit -- gaps list` - pass; `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`
  remains active and linked to `BANDIT-022`.
- `git diff --check` - pass.

## Next Action

Refresh Local Qwen Stage 4 review for `BANDIT-022`, then record aggregate
review evidence with the current `review_subject_hash`.
