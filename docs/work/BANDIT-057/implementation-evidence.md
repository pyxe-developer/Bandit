# BANDIT-057 Implementation Evidence

## Status

Stage 3 repair (fourth pass) complete. All 7 focused RED tests pass; all supporting suites pass. `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-057` now reaches review-artifact inspection (fails only because review artifacts are not yet created, not because brief validation rejects the brief).

## Writer Identity

writer_identity: claude_process_adapter
model_family: claude
base_sha: 5e04acd0d188884b984438d83f1d23e655d6d7fa

## Changes Summary

### Stage 3 original implementation (unchanged)

`src/state/bootstrap-gaps.ts`, `src/state/coordination-log.ts`, `src/cli.ts`,
`docs/templates/bootstrap-gap-disposition.md`, `docs/templates/formation-review.md`
— see prior Stage 3 evidence entry.

### Stage 3 repair (first pass) changes (unchanged)

- `src/state/formation-gate.ts` — content inspection, new formation checks, recheck helpers
- `src/state/coordination-log.ts` — added `readFormationApprovedEvidence` export
- `src/commands/repo-pm.ts` — wired `inspectFormationReviewContent` into `approveFormation`
- `src/commands/work-item-pm.ts` — wired `recheckFormationEvidenceForStart` into `checkStartReadiness`

### Stage 3 repair (second pass) changes (unchanged)

See second-pass entry in writer-report.md for the detail of that repair.

### Stage 3 repair (third pass) changes (unchanged)

See prior entry. Added `SUPPORTED_VERDICTS` constant and verdict validation to
`inspectFormationReviewContent` in `src/state/formation-gate.ts`.

### Stage 3 repair (fourth pass) changes

#### `src/state/formation-gate.ts` only

`repo-pm approve-formation BANDIT-057` failed before review-artifact inspection
because `validateFormationBrief` required metadata sections not produced by
`repo-pm create-work-item` or present in the active BANDIT-057 brief:

- No `work_type:` YAML field (brief uses `## Non-Product Work` section heading)
- No `## Out Of Scope` section (brief uses `## Stage Capability Scope` which
  carries `forbidden_actions:` as out-of-scope boundaries)
- No `## Role Boundary Evidence` section (brief uses `## Stage Capability
  Scope` which carries `authority_roles:` including `test_writer` and
  `implementation_writer`)
- No `## Write-Surface Families` section (brief uses `## Expected Files` which
  lists expected file paths by surface family)

The repair updates `collectFormationErrors` to accept repo-native section
alternatives alongside the canonical fixture-format sections:

1. **work_type**: Accept `work_type:\s*\S` YAML field OR `## Non-Product Work`
   section with content OR `## Product Work` section with content. The chore
   brief renders `## Non-Product Work` as the work-type indicator.

2. **Out Of Scope**: Accept `## Out Of Scope` section with content OR
   `## Stage Capability Scope` section with content (which carries
   `forbidden_actions:` entries as explicit out-of-scope boundaries).

3. **Role Boundary Evidence**: Accept `## Role Boundary Evidence` section with
   content first; if absent, fall back to `## Stage Capability Scope` section
   content. Update Test Writer and Implementation Writer pattern to match both
   spaced form ("Test Writer") and underscore form ("test_writer") as used in
   `authority_roles:` lists.

4. **Write-Surface Families**: Accept `## Write-Surface Families` section with
   content OR `## Expected Files` section with content (which lists expected
   file paths organized by write-surface family).

All existing validation checks (`## Origin`, `## Scope`, `## Acceptance
Criteria`, `## Operator Input Status`, `## Verification Plan`) are unchanged.
The fixture-format canonical sections still pass all checks unchanged. The
malformed `writeWorkBrief` brief still fails with "unverifiable acceptance
criteria" and all other missing-section errors.

## Verification Results (fourth pass)

```
node ./bin/bandit.mjs repo-pm approve-formation BANDIT-057     →  reaches review-artifact check (brief validation passes)
node --test test/role-entrypoints-formation.test.mjs            →  7 pass, 0 fail
node --test test/bootstrap-gaps.test.mjs                        →  6 pass, 0 fail
node --test test/work-item-create.test.mjs                      →  8 pass, 0 fail
node --test test/coordination-log.test.mjs test/coordination-status.test.mjs  →  20 pass, 0 fail
npm run typecheck                                               →  pass (no errors)
npm run bandit -- validate                                      →  Bandit state is valid.
node ./bin/bandit.mjs cockpit status --json                     →  pass
node ./bin/bandit.mjs session-context current --json            →  pass
git diff --check                                               →  clean (no whitespace errors)
```

`repo-pm approve-formation BANDIT-057` now outputs:
```
Formation approval requires missing review artifacts:
  docs/work/BANDIT-057/qwen-formation-review.md
  docs/work/BANDIT-057/coderabbit-formation-review.md
  docs/work/BANDIT-057/formation-review.md
```
Brief validation passes; the only remaining blocker is the expected missing
review artifacts (exit 1 on artifact check, not brief check).

## Test-Surface Boundary Confirmation

No tests, test helpers, fixtures, RED evidence artifacts/specs, acceptance
mappings, PM review, dispatch, roadmap, status, review, landing, or
retrospective evidence were edited by the Stage 3 repair (fourth pass). Only
`src/state/formation-gate.ts` was changed in source, plus refreshed Writer
evidence files.

## Stage 3 Authorship

Stage 3 repair (fourth pass) was authored by Claude through the interactive
session path, consistent with Bootstrap Model-Family Separation. Codex PM
authored Stage 2 RED tests.
