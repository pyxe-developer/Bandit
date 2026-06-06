---
work_item: BANDIT-060
stage: Stage 4 CodeRabbit bounded repair
owner: codex_pm
assignee: claude_implementation_writer
created_at: 2026-06-06T18:55:18Z
source_review: docs/work/BANDIT-060/coderabbit-review.md
source_disposition: docs/work/BANDIT-060/coderabbit-finding-disposition.md
source_review_spec: docs/specs/BANDIT-060-coderabbit-review-output.json
source_head: cae44d5d202e43717c038979801b5ba7966856ac
---

# BANDIT-060 CodeRabbit Repair Dispatch

## Objective

Repair only the four `repair_required` CodeRabbit findings accepted by Codex PM
for `BANDIT-060`.

## Required Repairs

1. Update `docs/role-runs/BANDIT-060/stage3-implementation.json` so it matches
   the established role-run manifest metadata contract:
   - add top-level `"contract_version": 1`;
   - replace `authority_boundary.is_append_only_evidence` with
     `authority_boundary.append_only_evidence`;
   - add `authority_boundary.projection_authority:
     "derived_non_canonical"`.
2. Update `src/commands/artifact-inputs.ts` so the top-level usage error names
   the accepted option:
   - use `Usage: bandit artifact-inputs <validate> [--json]`.
3. Update the exported `artifactInputs` command signature with the explicit
   concrete `Promise` return type already returned by its command branches.

## Do Not Repair

Do not repair or edit the findings Codex PM rejected, no-actioned, or deferred:

- `.bandit/bootstrap-gaps.json` provenance for
  `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`;
- `src/state/trust-verify.ts` path-safety helper extraction;
- `docs/specs/BANDIT-059-landing-verdict.json` rationale shape;
- `src/commands/trust.ts` `--report` flag validation.

Those items are outside the accepted `BANDIT-060` Stage 4 repair route.

## Allowed Writer Surface

- `src/commands/artifact-inputs.ts`
- `docs/role-runs/BANDIT-060/stage3-implementation.json`
- `docs/work/BANDIT-060/stage4-coderabbit-repair-writer-report.md`

Use fewer files if possible.

## Forbidden Writer Surface

Do not create, edit, format, delete, regenerate, or mechanically adjust:

- `test/**`
- test helpers, fixtures, RED evidence, or acceptance mappings
- `docs/work/BANDIT-060/red-evidence.md`
- `docs/specs/BANDIT-060-red-evidence.json`
- `docs/work/BANDIT-060/brief.md`
- formation evidence, PM review evidence, CodeRabbit raw review evidence,
  Local Qwen evidence, aggregate review evidence, landing evidence,
  landing-action evidence, retrospective evidence, coordination history,
  roadmap/current-context/status, or bootstrap-gap ledger entries
- canonical historical evidence under `docs/work/BANDIT-001` through
  `docs/work/BANDIT-059`
- dependencies, lockfiles, installed global skills, external service setup, or
  unrelated Phase 8 cockpit/product work

Do not run CodeRabbit, Local Qwen, aggregate Stage 4 review, Stage 5 landing,
closeout, another work item, Trust Verifier cutover, role input packet work,
execution packet work, queued role-contract write-surface work, or unrelated
cockpit product work.

If the repair requires a forbidden surface, stop and record the blocker in
`docs/work/BANDIT-060/stage4-coderabbit-repair-writer-report.md`.

## Required Reads

Read only what is needed from:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-060/coderabbit-review.md`
- `docs/work/BANDIT-060/coderabbit-finding-disposition.md`
- `docs/role-runs/BANDIT-060/stage3-implementation.json`
- `docs/role-runs/BANDIT-059/stage3-implementation.json`
- `src/commands/artifact-inputs.ts`

## Verification Requested

Run the smallest relevant verification set:

```sh
npm run typecheck
npm run bandit -- artifact-inputs validate --json
npm run bandit -- role-runs validate BANDIT-060 --json
npm run bandit -- validate
git diff --check
```

If a command cannot be run, record the exact reason in the Writer report.

## Required Writer Report

Write `docs/work/BANDIT-060/stage4-coderabbit-repair-writer-report.md` with:

- findings addressed;
- files changed;
- verification commands and results;
- explicit Test Ownership Boundary statement;
- explicit statement that this was authored by Claude through the bootstrap
  Process Adapter path;
- stop conditions, bootstrap gaps, or follow-up concerns.
