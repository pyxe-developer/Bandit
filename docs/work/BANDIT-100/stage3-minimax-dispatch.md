# BANDIT-100 Stage 3 MiniMax Fallback Dispatch

## Role

You are the Stage 3 Implementation Writer fallback for BANDIT-100.

Claude Sonnet 4.6 was the first Stage 3 writer and timed out after the allowed implementation window. It left source changes that currently pass the focused RED tests and TypeScript typecheck, but it did not create the required Stage 3 writer artifacts. Complete the Stage 3 writer package without expanding scope.

## Context Root

Repository: `<REPO_ROOT>`

Work item: `BANDIT-100`

Brief: `docs/work/BANDIT-100/brief.md`

Original Stage 3 dispatch: `docs/work/BANDIT-100/stage3-dispatch.md`

RED evidence: `docs/work/BANDIT-100/red-evidence.md`

## Hard Boundaries

- Do not edit tests or RED evidence:
  - `test/init.test.mjs`
  - `test/draft-work.test.mjs`
  - `docs/work/BANDIT-100/red-evidence.md`
- Do not edit coordination, roadmap, status, or landing/closeout files.
- Do not create a new work item.
- Keep implementation focused on BANDIT-100 acceptance.
- Preserve the existing Work Item PM / Test Writer boundary: tests are already authored and off-limits.

## Required Acceptance

Validate and, only if required, repair the current implementation so that:

1. `bandit init --profile <profile.json>` rejects malformed profiles with field diagnostics.
2. `bandit init --profile <profile.json>` scaffolds a consumer repo with the configured identity:
   - `.bandit/config.toml` uses the profile work item prefix.
   - starter brief path/header use the profile prefix.
   - roadmap/current context/status are profile-native and do not expose Bandit internal bootstrap language.
   - `docs/templates/project-profile.md` is available.
   - `bandit validate` passes in the initialized consumer repo.
3. `bandit draft-work <prd>` accepts the configured PRD prefix while preserving `BANDIT-PRD-*` compatibility.

## Current Focused Evidence Before Fallback

The Work Item PM ran these commands after Claude timed out:

- `node --test test/init.test.mjs` passed.
- `node --test test/draft-work.test.mjs` passed.
- `npm run typecheck` passed.

If your inspection finds no source repair is needed, do not churn the source files.

## Required Output Artifacts

Create or update:

- `docs/work/BANDIT-100/writer-report.md`
- `docs/work/BANDIT-100/implementation-evidence.md`

The artifacts must record:

- that this was a MiniMax fallback after Claude timeout;
- the source files you inspected or changed;
- any source repairs made, or an explicit no-repair-needed statement;
- verification commands and observed results;
- confirmation that test files and RED evidence were not edited by you.

## Verification Commands

Run if available:

```bash
node --test test/init.test.mjs
node --test test/draft-work.test.mjs
npm run typecheck
```

If a command cannot run, record the exact blocker in the implementation evidence.
