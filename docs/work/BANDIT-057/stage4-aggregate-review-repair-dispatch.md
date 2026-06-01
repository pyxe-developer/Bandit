---
work_item: BANDIT-057
stage: Stage 4 repair
owner: codex_pm
assignee: claude_implementation_writer
created_at: 2026-06-01T18:44:49Z
source_blocker: docs/work/BANDIT-057/stage4-aggregate-review-blocker.md
source_head: aba5ae76e281574d890d369e760fda97b09ec5f0
review_subject_hash: fee664df4ac6494abbec636ba929b30c08fc625c9af3561e835cc2b36d1c6ee1
---

# BANDIT-057 Stage 4 Aggregate Review Repair Dispatch

## Objective

Repair the focused Stage 4 aggregate-review blocker for `BANDIT-057`.

## Required Repair

Update bare workflow invocation usage/refusal text in `src/cli.ts` so it:

- restores the required `role-required` wording matched by `/role[- ]required/i`;
- preserves explicit role entry points for `repo-pm` and `work-item-pm`;
- preserves the supported legacy command list;
- keeps the no-command path fail-closed with `process.exitCode = 1`;
- does not hydrate roadmap, gap-ledger, or work-item context before refusing.

## Allowed Writer Surface

- `src/cli.ts`
- `docs/work/BANDIT-057/stage4-aggregate-review-repair-writer-report.md`

## Forbidden Writer Surface

- Do not edit tests, test helpers, fixtures, RED evidence, acceptance mappings,
  PM review, roadmap/status/context, CodeRabbit evidence, Local Qwen evidence,
  aggregate review evidence, landing evidence, retrospective evidence,
  dependency files, lockfiles, installed global skills, or unrelated Phase 8
  work.
- Do not call CodeRabbit again for this finding set.
- Do not run Local Qwen, record aggregate Stage 4 review evidence, land, close
  out, start another work item, or begin unrelated Phase 8 work.

## Verification Requested

Run the smallest relevant verification set after repair:

- `node --test test/role-entrypoints-formation.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `git diff --check`

If a requested command cannot be run, record the exact reason in the Writer
report.
