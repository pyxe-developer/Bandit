# BANDIT-082 Stage 3 Implementation Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-082`.

## Goal

Implement the narrow Work Intake Ledger And Followups Migration behavior needed
to satisfy the Stage 2 RED tests without editing Test Writer-owned surfaces.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-082/brief.md`
- `docs/work/BANDIT-082/orchestration-plan.md`
- `docs/work/BANDIT-082/red-evidence.md`
- `test/work-intake-ledger.test.mjs`
- `test/work-intake-migration.test.mjs`
- `FOLLOWUPS.md`
- `docs/design/workflow-cockpit/bandit-ui-polish-source.md`
- `docs/work/BANDIT-022/follow-up-chores.md`

## Source Scope

Implement only the smallest source changes required for:

- `bandit work-intake validate [--json]`
- `bandit work-intake list [--json]`
- fail-closed refusal for unsupported/mutation actions such as
  `bandit work-intake accept ... --actor work_item_pm`
- `.bandit/work-intake-ledger.json` as the repo-native v0 intake ledger
  artifact for current proposal state and transition history
- validation of source metadata, intake outcomes, transition history, scope
  summaries, risk/product-scope status, non-claimable proposal boundary,
  `FOLLOWUPS.md` deprecation safety, UI-polish source link, legacy
  `BANDIT-022` metadata, deterministic list output, and read-only authority
  flags

Likely implementation surfaces:

- `src/state/work-intake-ledger.ts`
- `src/commands/work-intake.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `.bandit/work-intake-ledger.json`
- `FOLLOWUPS.md`, only if validation proves every open entry is represented
  with a valid outcome
- `docs/work/BANDIT-082/writer-report.md`

## Forbidden Files And Surfaces

Do not edit:

- `test/work-intake-ledger.test.mjs`
- `test/work-intake-migration.test.mjs`
- `docs/work/BANDIT-082/red-evidence.md`
- `docs/work/BANDIT-082/orchestration-plan.md`
- `docs/work/BANDIT-082/brief.md`
- `docs/work/BANDIT-082/qwen-formation-review.md`
- `docs/work/BANDIT-082/coderabbit-formation-review.md`
- `docs/work/BANDIT-082/formation-review.md`
- `docs/work/BANDIT-082/coordination-log.jsonl`
- review, landing, UAT, retrospective, or closeout evidence

Do not implement:

- full Work Intake Triage Skill
- claimability reports
- scheduler execution
- claims or worktrees
- local API or State Index
- browser mutation authority
- V0 Closeout Claude Code A/B trial execution
- public benchmark publication
- paid reviewer/model routing
- hosted services
- dependency or lockfile changes
- merge, push, or deploy behavior
- Trust Verifier cutover or old-gate replacement

## Verification

Run and report:

```sh
node --test test/work-intake-ledger.test.mjs
node --test test/work-intake-migration.test.mjs
npm run typecheck
npm run bandit -- validate
node ./bin/bandit.mjs work-intake validate --json
node ./bin/bandit.mjs work-intake list --json
git diff --check
```

Run `npm test` if the implementation touches shared command routing,
validators, roadmap/current-context parsing, cockpit status/session-context
projection, policy validators, or package scripts beyond narrow command wiring.

## Required Output

Write `docs/work/BANDIT-082/writer-report.md` with:

- changed files
- command results
- acceptance criteria covered
- clean-code posture
- explicit statement that no Test Writer-owned surfaces were edited
- blockers, if any
