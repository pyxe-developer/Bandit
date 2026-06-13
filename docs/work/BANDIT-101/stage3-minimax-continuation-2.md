# BANDIT-101 Stage 3 MiniMax Continuation 2

You are MiniMax-M3 acting as the Stage 3 Implementation Writer for BANDIT-101.

The previous MiniMax attempt made partial source/config changes and then exited through the shell timeout wrapper with code 124 before producing a response or writer report. Continue from the current repository state.

## Required reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-101/brief.md`
- `docs/work/BANDIT-101/orchestration-plan.md`
- `docs/work/BANDIT-101/red-evidence.md`
- `docs/work/BANDIT-101/stage3-minimax-dispatch.md`

## Current partial implementation surface

The prior attempt touched or introduced this expected Stage 3 surface:

- `.bandit/reviewers/local-qwen.json`
- `src/commands/init.ts`
- `src/commands/land-check.ts`
- `src/state/bootstrap-gaps.ts`
- `src/state/project-profile.ts`
- `src/state/human-review.ts`
- `src/state/reviewer-adapters.ts`

Treat those as your starting point. Keep the implementation narrow.

## Hard boundary

Do not edit any tests or Stage 2 evidence:

- `test/**`
- `docs/work/BANDIT-101/red-evidence.md`
- `docs/work/BANDIT-101/orchestration-plan.md`
- `docs/work/BANDIT-101/coordination-log.jsonl`

If a test appears wrong, record that in `docs/work/BANDIT-101/writer-report.md` instead of changing it.

## Required delivery

Complete the source/config implementation so these RED tests pass:

```sh
node --test test/reviewer-adapters.test.mjs
node --test test/local-qwen-review.test.mjs
node --test test/landing-gates.test.mjs
npm run typecheck
```

Write `docs/work/BANDIT-101/writer-report.md` with:

- changed source/config files
- commands run and pass/fail results
- any remaining blocker
- explicit confirmation that no tests or Stage 2 evidence were edited by this continuation

Do not advance coordination state. Do not create review, landing, retrospective, or closeout artifacts.
