---
work_item: BANDIT-057
stage: Stage 4 repair
owner: codex_pm
assignee: claude_implementation_writer
created_at: 2026-06-01T17:00:00Z
source_review: docs/work/BANDIT-057/coderabbit-review.md
source_review_spec: docs/specs/BANDIT-057-coderabbit-review-output.json
source_head: 68a3ea0d8a2f442f827d57a920fbc005108fc332
---

# BANDIT-057 Major CodeRabbit Repair Dispatch

## Objective

Repair only the single major CodeRabbit finding for `BANDIT-057`.

## Required Repair

Update the no-command usage text in `src/cli.ts` so it clearly represents both:

- explicit role entry points: `repo-pm`, `work-item-pm`
- supported legacy commands: existing non-role commands such as `init`,
  `validate`, `list`, and the rest of the current CLI surface

Keep `process.exitCode = 1` behavior unchanged.

## Allowed Writer Surface

- `src/cli.ts`
- `docs/work/BANDIT-057/stage4-major-coderabbit-repair-writer-report.md`

## Forbidden Writer Surface

- Do not edit tests, test helpers, fixtures, RED evidence, acceptance mappings,
  PM review, roadmap/status/context, aggregate review evidence, landing
  evidence, retrospective evidence, dependency files, lockfiles, installed
  global skills, or unrelated Phase 8 work.
- Do not repair the six non-major CodeRabbit findings.
- Do not run CodeRabbit.
- Do not run Local Qwen, aggregate Stage 4 review, landing, closeout, another
  work item, or unrelated Phase 8 work.

## Verification Requested

Run the smallest relevant verification set:

- `npm run typecheck`
- `npm run bandit -- validate`
- `git diff --check`

If a requested command cannot be run, record the exact reason in the Writer
report.
