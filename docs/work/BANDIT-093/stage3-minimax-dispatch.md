# BANDIT-093 Stage 3 MiniMax Fallback Dispatch

You are the Stage 3 Implementation Writer fallback for `BANDIT-093` - Roadmap Work Target Resolver.

## Context

Claude created a partial source implementation, but Stage 3 verification is incomplete:

- `node --test test/roadmap-work-targets.test.mjs` passes 6/6 from the main shell.
- `npm run typecheck` fails on strict nullability errors in `src/state/roadmap-work-targets.ts`.

Your task is only to repair the source implementation so both required commands pass, then write Stage 3 evidence.

## Read First

- `docs/work/BANDIT-093/brief.md`
- `docs/work/BANDIT-093/red-evidence.md`
- `docs/work/BANDIT-093/stage3-claude-attempt.md`
- `test/roadmap-work-targets.test.mjs`
- `src/state/roadmap-work-targets.ts`
- `src/commands/roadmap-work-targets.ts`
- `src/cli.ts`

## Allowed Edits

- `src/state/roadmap-work-targets.ts`
- `src/commands/roadmap-work-targets.ts`
- `src/cli.ts`
- `docs/work/BANDIT-093/writer-report.md`
- `docs/work/BANDIT-093/implementation-evidence.md`

## Forbidden Edits

- Do not edit `test/roadmap-work-targets.test.mjs` or any `test/**` file.
- Do not edit `docs/work/BANDIT-093/red-evidence.md`.
- Do not edit acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, retrospective evidence, or policy acceptance criteria.
- Do not edit `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, or root `STATUS.md`.
- Do not edit `.bandit/work-intake-ledger.json`.
- Do not edit package metadata, lockfiles, dependencies, CI/release workflows, hosted services, telemetry, merge/push/deploy behavior, or unrelated Phase 8 work.

## Required Verification

Run:

- `node --test test/roadmap-work-targets.test.mjs`
- `npm run typecheck`

If a command fails, repair only allowed source files until both pass.

## Required Evidence

Write:

- `docs/work/BANDIT-093/writer-report.md`
- `docs/work/BANDIT-093/implementation-evidence.md`

Both evidence files must state:

- files changed
- tests/commands run and results
- acceptance criteria mapping
- clean-code posture
- confirmation that no test/fixture/RED evidence/acceptance mapping was edited by the Stage 3 Writer
