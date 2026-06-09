# BANDIT-082 Stage 3 MiniMax Implementation Dispatch

Role: Implementation Writer fallback.

Context:
- Claude Sonnet 4.6 was given the Stage 3 dispatch and timed out after 15 minutes.
- Claude left partial implementation edits in source-owned surfaces only:
  - `src/state/work-intake-ledger.ts`
  - `src/commands/work-intake.ts`
  - `src/cli.ts`
  - `.bandit/work-intake-ledger.json` is currently an empty partial artifact.
- Treat those partials as editable implementation surface. Repair or replace them as needed.

Hard boundaries:
- Do not edit RED tests:
  - `test/work-intake-ledger.test.mjs`
  - `test/work-intake-migration.test.mjs`
- Do not edit PM/test/review/landing/closeout artifacts:
  - `docs/work/BANDIT-082/orchestration-plan.md`
  - `docs/work/BANDIT-082/red-evidence.md`
  - `docs/work/BANDIT-082/brief.md`
  - `docs/work/BANDIT-082/qwen-formation-review.md`
  - `docs/work/BANDIT-082/coderabbit-formation-review.md`
  - `docs/work/BANDIT-082/formation-review.md`
  - `docs/work/BANDIT-082/coordination-log.jsonl`
- Do not create review, landing, UAT, retrospective, or closeout evidence.

Required reads:
- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-082/brief.md`
- `docs/work/BANDIT-082/red-evidence.md`
- `test/work-intake-ledger.test.mjs`
- `test/work-intake-migration.test.mjs`
- current partial implementation files listed above

Implementation target:
- Implement `bandit work-intake validate [--json]`.
- Implement `bandit work-intake list [--json]`.
- Reject mutation subcommands such as `work-intake accept WIL-UI-POLISH --actor work_item_pm`.
- Add or complete repo-native `.bandit/work-intake-ledger.json`.
- Preserve FOLLOWUPS.md source metadata in the ledger. Do not make intake entries claimable.
- The work-intake ledger is read-only for Work Item PM, writers, reviewers, tests, and browser/cockpit consumers; it does not allocate Work Item IDs and does not mutate scheduler/browser state.

Required verification:
- `node --test test/work-intake-ledger.test.mjs`
- `node --test test/work-intake-migration.test.mjs`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs work-intake validate --json`
- `node ./bin/bandit.mjs work-intake list --json`
- `git diff --check`

Writer report:
- Create `docs/work/BANDIT-082/writer-report.md`.
- Include files changed, tests run, results, and any remaining risk.
