# BANDIT-100 Stage 3 MiniMax Repair Dispatch

## Role

You are the Stage 3 Implementation Writer fallback for a focused repair on
BANDIT-100 after Work Item PM acceptance inspection.

## Context

The current implementation passes the original focused RED tests and typecheck,
but Work Item PM found a fail-closed CLI edge case and a few obvious schema
validation/template hygiene gaps before recording Stage 3 acceptance.

Repository: `<REPO_ROOT>`

Work item: `BANDIT-100`

Brief: `docs/work/BANDIT-100/brief.md`

Existing writer artifacts:

- `docs/work/BANDIT-100/writer-report.md`
- `docs/work/BANDIT-100/implementation-evidence.md`

## Hard Boundaries

- Do not edit tests, test helpers, RED evidence, coordination logs, roadmap,
  status, review, landing, or closeout files.
- Do not add new tests in this repair pass.
- Do not expand scope beyond the focused repair list.
- Keep the repair source-only plus evidence refresh.

Forbidden files:

- `test/init.test.mjs`
- `test/draft-work.test.mjs`
- `docs/work/BANDIT-100/red-evidence.md`
- `docs/work/BANDIT-100/coordination-log.jsonl`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`

## Required Repairs

1. `bandit init --profile` with no path must fail closed in a fresh repo. It
   must not silently run the default unprofiled init path.
2. Remove the unused `readFile` import from `src/commands/init.ts` if still
   present.
3. Tighten project-profile schema validation for obvious invalid supplied
   fields:
   - `starter_work_item.number`, when present, must be a positive integer.
   - optional `starter_work_item.current_stage` and
     `starter_work_item.next_action`, when present, must be non-empty strings.
   - `roadmap_seed.planned_work`, when present, must be an array of objects
     with non-empty string `kind`, `id`, and `title`.
   - each `reviewers` entry must be an object with non-empty string `id` and
     `provider`, plus boolean `required`.
4. Make `docs/templates/project-profile.md` ASCII-only by replacing the em
   dashes in field bullets with plain ASCII punctuation.
5. Update `docs/work/BANDIT-100/writer-report.md` and
   `docs/work/BANDIT-100/implementation-evidence.md` to record this focused
   repair, the no-test-edit boundary, and refreshed verification results.

## Required Verification

Run:

```bash
node --test test/init.test.mjs
node --test test/draft-work.test.mjs
npm run typecheck
```

Also manually verify the CLI fail-closed edge with a fresh temp repo:

```bash
tmp=$(mktemp -d)
cd "$tmp"
node "<REPO_ROOT>/bin/bandit.mjs" init --profile
```

Record the observed exit code and stderr in implementation evidence.
