---
work_item: BANDIT-057
stage: Stage 4 repair
role: claude_implementation_writer
source_dispatch: docs/work/BANDIT-057/stage4-coderabbit-repair-dispatch.md
repair_head: 4f482727903ab7863881a9e7f812c579a397624a
---

# BANDIT-057 CodeRabbit Repair Writer Report

## Repairs Applied

### Finding 1 — Explicit `Promise` return type on `repoPm` (trivial)

**File**: `src/commands/repo-pm.ts:12`

Added `Promise<{ output: string }>` as the explicit return type on `repoPm`. Both
call paths (`createWorkItem` and `approveFormation`) already return that shape;
this makes the contract visible to callers and to the type checker without
changing runtime behaviour.

### Finding 2 — `replacement_work_item` brief existence check (trivial)

**File**: `src/state/bootstrap-gaps.ts:113`

Added a `requireExistingPath` check for `docs/work/<replacementWorkItem>/brief.md`
inside `validateGapReferences`, mirroring the existing `linkedWorkItem` check
immediately above it. The check fires only when `gap.replacementWorkItem` is
set (i.e. when `disposition === "replaced"`).

### Finding 3 — Remove unreachable mixed-verdict consistency logic (trivial)

**File**: `src/state/formation-gate.ts`

Removed `requireConsistentFormationVerdicts` and its call from
`recheckFormationEvidenceForStart`. The function checked whether the `verdicts`
set contained both `pass` and `fail`/`blocker`. Because `inspectFormationReviewContent`
runs first and throws immediately when it encounters a `fail` or `blocker` verdict,
`requireConsistentFormationVerdicts` could never observe those values; the check
was permanently unreachable. Removing the function eliminates a second filesystem
read pass and the dead branch.

### Finding 4 — Avoid duplicate error entries for `non_blocking` + `undispositioned` (minor)

**File**: `src/state/formation-gate.ts:221`

Changed the standalone `if (findingsDisposition === "undispositioned")` check to
`else if`, making it mutually exclusive with the preceding
`non_blocking && !hasAcceptableDisposition` check. When both conditions were true
(status `non_blocking`, disposition `undispositioned`) two separate errors were
added for the same issue. Now only the more specific `non_blocking` error fires in
that case; the `else if` branch covers the remaining case where disposition is
`undispositioned` but status is not `non_blocking`.

## Verification Results

All five requested commands completed without errors.

| Command | Result |
|---|---|
| `node --test test/role-entrypoints-formation.test.mjs` | 7 pass, 0 fail |
| `node --test test/bootstrap-gaps.test.mjs` | 6 pass, 0 fail |
| `npm run typecheck` | pass (no output) |
| `npm run bandit -- validate` | `Bandit state is valid.` |
| `git diff --check` | pass (no output) |
