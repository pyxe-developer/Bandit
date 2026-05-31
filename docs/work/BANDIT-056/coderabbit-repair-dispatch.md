# BANDIT-056 CodeRabbit Repair Dispatch

## Metadata

- Work item: `BANDIT-056` - Evidence Freshness SLOs
- Dispatch owner: Codex PM
- Repair writer: Claude Writer `claude-sonnet-4-6`
- Repository: Bandit context root (`$BANDIT_CONTEXT_ROOT` / current repository root)
- Branch: `main`
- Base review revision: `c5eb2700502237e3269a82818edd994a4006d878`
- Latest CodeRabbit-reviewed source head: `bbd48de80d204fe556440893c162eb93ea4747ef`
- Dispatch status: Stage 4 CodeRabbit source repair requested

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-056/brief.md`
- `docs/work/BANDIT-056/coderabbit-review.md`
- `docs/specs/BANDIT-056-coderabbit-review-output.json`
- `src/state/evidence-freshness-slos.ts`
- `src/state/focused-session-context.ts`

## Mission

Repair only the two CodeRabbit findings that are in Stage 3 implementation
source files:

1. In `src/state/evidence-freshness-slos.ts`, replace the loose non-empty-array
   `source_artifacts` check with the existing `requireNonEmptyStringList`
   validation so blank or non-string entries are rejected before treating
   `source_artifacts` as present.
2. In `src/state/focused-session-context.ts`, make `readStaleEvidenceReason`
   tolerate a missing file between the prior existence check and
   `readRequiredArtifact`; the race should return no stale reason instead of
   throwing.

Preserve the existing Evidence Freshness SLO contract, review-subject-hash
semantics, CLI authority boundary, and derived-non-canonical projection
boundary.

## Editable Paths

You may edit only:

- `src/state/evidence-freshness-slos.ts`
- `src/state/focused-session-context.ts`
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
- roadmap or status files;
- dependencies, lockfiles, installed global skills, or unrelated Phase 8 work.

The remaining CodeRabbit timestamp finding is PM-owned evidence repair and is
out of scope for the Writer.

If a requested source repair requires touching a forbidden path, stop and
record that blocker in `docs/work/BANDIT-056/coderabbit-repair-writer-report.md`.

## Required Verification

Run at least:

```sh
node --test test/evidence-freshness-slos.test.mjs
node --test test/focused-session-context.test.mjs
npm run typecheck
npm run bandit -- evidence-freshness-slos validate --json
git diff --check
```

## Required Writer Report

Write `docs/work/BANDIT-056/coderabbit-repair-writer-report.md` with:

- summary of source files changed;
- verification commands and results;
- explicit statement that the Test Ownership Boundary was preserved;
- explicit statement that this repair was authored by Claude Writer through the
  Process Adapter path;
- any stop conditions or follow-up concerns.
