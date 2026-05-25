# BANDIT-022 Implementation Evidence

## Status

`pass` for Stage 3 implementation evidence on 2026-05-25.

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

- `node --test test/heartbeat-chore-agent.test.mjs` - pass, 6 tests.
- `npm test` - pass, 189 tests.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass.
- `npm run bandit -- gaps list` - pass; `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`
  remains active and linked to `BANDIT-022`.
- `git diff --check` - pass.

## Next Action

Run Stage 4 review for `BANDIT-022`, starting with
`npm run bandit -- qwen-review BANDIT-022`, then record aggregate review
evidence with current `review_subject_hash`.
