# BANDIT-056 CodeRabbit Repair Dispatch

## Metadata

- Work item: `BANDIT-056` - Evidence Freshness SLOs
- Dispatch owner: Codex PM
- Repair writer: Claude Writer `claude-sonnet-4-6`
- Repository: Bandit context root (`$BANDIT_CONTEXT_ROOT` / current repository root)
- Branch: `main`
- Base review revision: `c5eb2700502237e3269a82818edd994a4006d878`
- Latest CodeRabbit-reviewed source head: `2f8564ce88f9c0d7be2521a9cf638087c428865d`
- PM classification commit: `b6ebf60`
- Dispatch status: Stage 4 CodeRabbit repair-required source/template repair requested

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-056/brief.md`
- `docs/work/BANDIT-056/coderabbit-finding-disposition.md`
- `docs/work/BANDIT-056/coderabbit-review.md`
- `docs/specs/BANDIT-056-coderabbit-review-output.json`
- `docs/templates/evidence-freshness-slos.md`
- `src/state/writer-stream-sanitizer.ts`
- `test/evidence-freshness-slos.test.mjs`
- `test/writer-stream-sanitizer.test.mjs`

## Mission

Repair only the two CodeRabbit findings that Codex PM classified as
`repair_required`:

1. In `docs/templates/evidence-freshness-slos.md`, make
   `artifact_types` and `trust_signal_requirements` use a consistent
   `source_artifacts` key name so future form-fillers are not confused by a
   singular/plural mismatch.
2. In `src/state/writer-stream-sanitizer.ts`, update `isRecord` so arrays are
   not treated as record objects before the sanitizer reads `parsed.type`.

Preserve the existing Evidence Freshness SLO contract, CLI authority boundary,
derived-non-canonical projection boundary, writer stream digest shape, and
current PM disposition for the other four CodeRabbit findings.

## Editable Paths

You may edit only:

- `docs/templates/evidence-freshness-slos.md`
- `src/state/writer-stream-sanitizer.ts`
- `docs/work/BANDIT-056/coderabbit-repair-writer-report.md`

## Forbidden Paths And Actions

Do not edit:

- tests, test helpers, fixtures, RED evidence, or acceptance mappings;
- `docs/work/BANDIT-056/red-evidence.md`;
- `docs/specs/BANDIT-056-red-evidence.json`;
- CodeRabbit, Local Qwen, aggregate review, landing, landing-action, or
  retrospective evidence;
- `docs/specs/BANDIT-056-coderabbit-review-output.json`;
- `docs/work/BANDIT-056/coderabbit-review.md`;
- `docs/work/BANDIT-056/coderabbit-finding-disposition.md`;
- roadmap or status files;
- `.bandit/events.jsonl`;
- dependencies, lockfiles, installed global skills, or unrelated Phase 8 work.

The derived-projection rationale and cockpit evidence-path alias findings are
non-blocking follow-up candidates. The line-count helper extraction and
redacted-field `Set` suggestions are no-action/opportunistic only. Do not make
standalone repairs for those four dispositioned findings. If the minimal
`isRecord` repair naturally touches adjacent sanitizer lines, keep the change
surgical and explain it in the report.

If a requested repair requires touching a forbidden path, stop and record that
blocker in `docs/work/BANDIT-056/coderabbit-repair-writer-report.md`.

## Required Verification

Run at least:

```sh
node --test test/evidence-freshness-slos.test.mjs
node --test test/writer-stream-sanitizer.test.mjs
npm run typecheck
npm run bandit -- evidence-freshness-slos validate --json
git diff --check
```

## Required Writer Report

Write `docs/work/BANDIT-056/coderabbit-repair-writer-report.md` with:

- summary of source/template files changed;
- verification commands and results;
- explicit statement that the Test Ownership Boundary was preserved;
- explicit statement that this repair was authored by Claude Writer through the
  Process Adapter path;
- whether any test coverage gap remains because tests were forbidden for this
  Writer handoff;
- any stop conditions or follow-up concerns.
