# BANDIT-098 Stage 3 MiniMax Fallback Dispatch

contract_version: 1
work_item: BANDIT-098
stage: Stage 3 Implementation
created_at: 2026-06-12T00:25:00Z
dispatcher: work_item_pm
writer: minimax_m3_non_codex_writer
fallback_reason: Claude Stage 3 implementation timed out after an initial no-progress run and a bounded continuation attempt.

## Mission

Implement the narrow public consumer install quickstart and governance scaffold
chore so the Test Writer-owned RED tests in `test/init.test.mjs` and
`test/public-consumer-install-quickstart.test.mjs` turn GREEN without editing
any Test Writer-owned files.

The core failure is that `bandit init` initializes `.bandit` state but does not
create starter governance artifacts required by `bandit cockpit status --json`
and `bandit session-context current --json` in a fresh consumer repository.

## Required Reads

- `docs/work/BANDIT-098/stage3-dispatch.md`
- `docs/work/BANDIT-098/red-evidence.md`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/state/bootstrap-gaps.ts`
- `src/state/cockpit-status.ts`
- `src/state/focused-session-context.ts`
- `package.json`
- `README.md`
- `.bandit/policy/install-update-channel.json`
- `docs/templates/install-update-channel.md`
- `docs/templates/update-channel.md`

## Allowed Write Surface

You may create or edit only:

- `src/commands/init.ts`
- `README.md`
- `package.json`
- `.bandit/policy/install-update-channel.json`
- `.bandit/policy/private-install-update-channel.json`
- `docs/templates/install-update-channel.md`
- `docs/templates/private-install-update-channel.md`
- `docs/templates/update-channel.md`
- any new consumer-neutral starter template files under `docs/templates/`
- `docs/work/BANDIT-098/writer-report.md`
- `docs/work/BANDIT-098/implementation-evidence.md`

Do not edit tests, test helpers, `docs/work/BANDIT-098/red-evidence.md`,
`docs/work/BANDIT-098/coordination-log.jsonl`,
`docs/work/BANDIT-098/orchestration-plan.md`, `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, `STATUS.md`, `.bandit/bootstrap-gaps.json`, or
`.bandit/events.jsonl`.

## Implementation Notes

Prefer the smallest source change:

1. Add starter governance artifact creation to `initBandit`.
2. Preserve existing user-owned files by checking path existence before every
   write.
3. Do not copy Bandit's live project history into consumer repos.
4. Make fresh repos pass:
   - `bandit validate`
   - `bandit cockpit status --json`
   - `bandit session-context current --json`

The recommended shape is a non-interstitial starter context:

- `docs/roadmap/CURRENT_CONTEXT.md` should name an active starter work item such
  as `BANDIT-001`, include `**Phase:** ...`, include the exact sentence
  `The current stage is Stage 1: starter_ready.`, include
  `**Current next action:** Complete Stage 1 brief formation for BANDIT-001.`,
  and include a `## Required Operator Input` section containing
  `No operator-owned input is required`.
- `docs/roadmap/ROADMAP.md` should include matching
  `**Current next step:** Complete Stage 1 brief formation for BANDIT-001.`
- Because non-interstitial cockpit status reads the active work brief, `init`
  should also create `docs/work/BANDIT-001/brief.md` if missing. This file is
  generated in the consumer repo by `init`; it must not be packaged from the
  Bandit development repo.
- Keep `.bandit/bootstrap-gaps.json` as the existing default empty ledger.

## Verification Commands

Run:

```sh
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
node --test test/private-install-update-channel.test.mjs
node --test test/update-channel.test.mjs
node --test test/focused-session-context.test.mjs
node --test test/cockpit-status.test.mjs
npm pack --dry-run --json
npm run typecheck
```

## Evidence To Write

Write:

- `docs/work/BANDIT-098/writer-report.md`
- `docs/work/BANDIT-098/implementation-evidence.md`

Both files must state changed files, tests run and results, acceptance criteria
satisfied, clean-code self-check, how pre-existing dirty source changes were
handled, and explicit evidence that no Test Writer-owned surface was edited.
