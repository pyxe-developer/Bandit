# BANDIT-097 Stage 3 MiniMax Fallback Dispatch

Role: Stage 3 Implementation Writer fallback.
Work Item: BANDIT-097 - Operator Command Adapters.

## Context

Claude was the primary Stage 3 writer. It implemented the source files and CLI routing, but the headless command exited with code 124 before writer evidence was recorded.

Current source verification already passed:

- `node --test test/bandit-work-command-adapters.test.mjs` - pass, 7/7.
- `node --test test/work-create-controller.test.mjs` - pass, 7/7.
- `node --test test/work-execute-controller.test.mjs` - pass, 3/3.
- `npm run typecheck` - pass.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-097/brief.md`
- `docs/work/BANDIT-097/orchestration-plan.md`
- `docs/work/BANDIT-097/red-evidence.md`
- `docs/work/BANDIT-097/coordination-log.jsonl`
- `src/commands/bandit-work-create.ts`
- `src/commands/bandit-work-execute.ts`
- `src/cli.ts`

## Allowed Write Surface

You may write only:

- `docs/work/BANDIT-097/writer-report.md`
- `docs/work/BANDIT-097/implementation-evidence.md`

Do not edit source, tests, coordination logs, roadmap/status files, review artifacts, landing artifacts, package metadata, lockfiles, CI files, or any other file.

## Task

Record Stage 3 writer evidence for the current implementation. The evidence must honestly state:

- Claude produced the source implementation before timing out.
- MiniMax fallback completed the writer evidence only.
- Verification commands listed above passed in the PM shell after Claude exited.
- Source files changed are:
  - `src/commands/bandit-work-create.ts`
  - `src/commands/bandit-work-execute.ts`
  - `src/cli.ts`
- Test Writer-owned files were not edited by the Stage 3 writer.
- The implementation keeps `bandit work create` and `bandit context <stage>` unavailable.
- The adapters are non-canonical operator affordances delegating to existing controllers; repo-native artifacts remain canonical.

Keep the two evidence files concise and factual.
