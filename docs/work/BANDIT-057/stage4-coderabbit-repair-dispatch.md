# BANDIT-057 Stage 4 CodeRabbit Repair Dispatch

created_at: 2026-06-01T16:18:38Z
owner: codex_pm
assignee: claude_implementation_writer
stage: Stage 4 repair
source_review: docs/work/BANDIT-057/coderabbit-review.md
source_review_spec: docs/specs/BANDIT-057-coderabbit-review-output.json
source_head: 4f482727903ab7863881a9e7f812c579a397624a
base_revision: 5e04acd0d188884b984438d83f1d23e655d6d7fa

## Objective

Repair the four open CodeRabbit findings for `BANDIT-057` while preserving the
Stage 4 repair ownership boundary.

## Required Repairs

1. Add an explicit `Promise` return type to the `repo-pm` async command
   entrypoint in `src/commands/repo-pm.ts`.
2. Validate that `replacement_work_item` references an existing
   `docs/work/<ID>/brief.md` in `src/state/bootstrap-gaps.ts`, matching the
   existing `linked_work_item` integrity check.
3. Remove or reorder unreachable mixed-verdict consistency logic in
   `src/state/formation-gate.ts`.
4. Avoid duplicate error entries when `findings_status` is `non_blocking` and
   `findings_disposition` is `undispositioned` in
   `src/state/formation-gate.ts`.

## Allowed Writer Surface

- `src/commands/repo-pm.ts`
- `src/state/bootstrap-gaps.ts`
- `src/state/formation-gate.ts`
- `docs/work/BANDIT-057/coderabbit-repair-writer-report.md`

## Forbidden Writer Surface

- Do not edit tests, test helpers, fixtures, RED evidence, or acceptance
  mappings.
- Do not edit `docs/work/BANDIT-057/coderabbit-review.md` or
  `docs/specs/BANDIT-057-coderabbit-review-output.json`; Codex PM owns
  review-evidence routing after the Writer repair.
- Do not edit `STATUS.md`, `docs/roadmap/CURRENT_CONTEXT.md`, or
  `docs/roadmap/ROADMAP.md`; Codex PM owns routing updates.
- Do not run Local Qwen, aggregate Stage 4 review, landing, closeout, another
  work item, or unrelated Phase 8 work.

## Verification Requested

Run the smallest relevant verification set after repair:

- `node --test test/role-entrypoints-formation.test.mjs`
- `node --test test/bootstrap-gaps.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `git diff --check`

If a requested command cannot be run, record the exact reason in the Writer
report.
