# BANDIT-098 Stage 3 Retry Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-098`.

## Context

The Work Item is already formed and Stage 2 RED evidence is recorded. The
previous Stage 3 dispatch attempts timed out before durable implementation
evidence was produced. The operator has now said "Try again", so this retry is
limited to Stage 3 only.

## Role Boundary

- You are the non-Codex Implementation Writer.
- The Test Writer is Codex.
- You must not edit tests, test helpers, fixtures, RED evidence, acceptance
  mappings, formation evidence, review evidence, landing evidence,
  retrospective evidence, roadmap/current-context/status files, or PRD/source
  authority files.
- You may edit source/package/runtime/docs needed for implementation if the
  candidate implementation is incomplete.
- You may write Stage 3 implementation evidence:
  - `docs/work/BANDIT-098/implementation-evidence.md`
  - `docs/work/BANDIT-098/writer-report.md`

## Current Candidate Implementation

The dirty worktree already contains candidate source/runtime/docs changes for
public consumer install and starter governance scaffolding. Inspect them rather
than restarting from scratch. If they satisfy the RED tests and acceptance
criteria, do not churn the source. If they do not, make the smallest source-only
repair required.

Key candidate surfaces:

- `src/commands/init.ts`
- `README.md`
- `package.json`
- `.bandit/policy/install-update-channel.json`
- `docs/templates/install-update-channel.md`
- existing update-channel source/policy files already dirty in this worktree

Forbidden test surfaces include:

- `test/init.test.mjs`
- `test/public-consumer-install-quickstart.test.mjs`
- `test/private-install-update-channel.test.mjs`
- `test/update-channel.test.mjs`

## Required Verification

Run at minimum:

```sh
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
npm run typecheck
```

If time allows, also run:

```sh
npm pack --dry-run --json
```

## Required Evidence

Write `docs/work/BANDIT-098/implementation-evidence.md` with:

- writer identity and model family;
- statement that Stage 3 made zero test-surface edits;
- code path mapped to acceptance criteria;
- focused test results with command evidence;
- clean-code self-check against `CLEAN_CODE.md`;
- any remaining gaps or explicitly `none`.

Write `docs/work/BANDIT-098/writer-report.md` with:

- concise summary of source/runtime/docs surfaces inspected or edited;
- commands run and outcomes;
- whether source edits were made during this retry;
- any risks for PM acceptance.

Stop after Stage 3. Do not write review, landing, retrospective, roadmap,
current-context, status, or coordination artifacts.
