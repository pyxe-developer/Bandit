# BANDIT-092 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-092
stage: Stage 3 Implementation
author: implementation_writer
model_family: claude
timestamp: 2026-06-10T18:50:00Z
source_head: cd80d338de6c7a60369779fe4bfb755168262e9a

## Role Boundary Acknowledgment

This report is produced by the Stage 3 Implementation Writer. No test files,
test helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria were created, edited, deleted, regenerated,
formatted, or mechanically adjusted. Codex authored Stage 2 RED tests; Stage 3
routes to Claude under the Bootstrap Model-Family Separation rule.

## Summary

Implemented the minimal Boundary Cell Movement gate for `BANDIT-092` (PRD-004
slice 4). Six RED tests are now expected to pass. One new state module and one
new template were created. Three existing source files were modified. No
test-owned files were touched.

PM review tightened the validator after the initial Writer draft to cover the
formed brief's full contour/version/cell, operator-decision, and workflow-trial
guardrail semantics. PM/Test Writer also repaired `test/routing.test.mjs` after
full-suite verification exposed shared fixture drift from the new required
template. These post-Writer corrections are accepted in
`docs/work/BANDIT-092/stage3-pm-review.md`.

## Files Changed

| File | Action | Purpose |
| --- | --- | --- |
| `docs/templates/boundary-cell-movement.md` | created | Template contract for `validateTemplates`; satisfies "template missing" test. |
| `src/state/boundary-cell-movement.ts` | created | New state module: field validator, aggregate validator, optional reader, and escape-contraction gate helper. |
| `src/state/templates.ts` | modified | Added `boundary-cell-movement.md` contract entry to `TEMPLATE_CONTRACTS`. |
| `src/commands/validate.ts` | modified | Added import and `validateBoundaryCellMovementArtifacts` call after `validateBoundaryEscapeArtifacts`. |
| `src/commands/land-check.ts` | modified | Added import and `gatherEscapeContractionProblems` call inside the `if (bpr)` block after `gatherLandingAttributionProblems`. |

## Acceptance Criterion Coverage

| Criterion | Implementation |
| --- | --- |
| Boundary Cell Movement evidence is a repo-native structured artifact | `src/state/boundary-cell-movement.ts` reads `docs/work/<id>/boundary-cell-movement.json`; no contour mutation. |
| Validation rejects malformed evidence and direction inconsistencies | `validateBoundaryCellMovementFields`: rejects bad `source_head`, unknown `movement_direction`, and `contraction/expansion` contradictions via `AUTONOMY_LADDER` index comparison. |
| Autonomy expansion requires Workflow Trial guardrails | `validateBoundaryCellMovementFields`: `expansion && !linkedWorkflowTrial` → error. |
| Zero observed escapes alone cannot justify expansion | `validateBoundaryCellMovementFields`: `expansion && movementReason === "zero_observed_escapes"` → error. |
| Confirmed escapes require fail-closed contraction before autonomy claims | `gatherEscapeContractionProblems`: reads `boundary-escape-disposition.json`; if `disposition_verdict === "confirmed_escape"` and no `boundary-cell-movement.json` → blocks land-check. |
| Ordinary safe-to-land flows remain unblocked | `gatherEscapeContractionProblems` only activates inside `if (bpr)` block and only when `disposition_verdict === "confirmed_escape"`; missing disposition file → returns empty array. |
| Template exists for `bandit validate` | `docs/templates/boundary-cell-movement.md` written with all 14 required fields and registered in `TEMPLATE_CONTRACTS`. |

## Design Decisions

**AUTONOMY_LADDER index comparison**: direction contradiction uses
`AUTONOMY_LADDER.indexOf()`. `expansion` requires `toIndex > fromIndex`;
`contraction` requires `toIndex < fromIndex`. Invalid level names fail explicit
`from_autonomy_level` or `to_autonomy_level` validation.

**Aggregate validator throws on first error per work item**: consistent with
`validateBoundaryEscapeArtifacts` pattern. Error prefix format matches test
`assert.match` regex patterns.

**`gatherEscapeContractionProblems` placement**: placed inside `if (bpr)` block
in `land-check.ts` because `bpr.authorizingBoundaryCell` and
`bpr.landingAutonomyLevel` are needed for the error message. The function
independently reads `boundary-escape-disposition.json` rather than expecting the
caller to pass it.

**Missing disposition file is not an error**: `isMissingPathError` in
`gatherEscapeContractionProblems` returns `[]` when no disposition file exists,
which preserves ordinary safe-to-land behavior.

## Verification Commands

```sh
node --test --test-name-pattern "Boundary Cell|boundary cell|autonomy expansion|zero escapes|confirmed boundary escape|ordinary safe-to-land" test/landing-gates.test.mjs
npm run typecheck
node --test test/routing.test.mjs
npm test
npm run bandit -- validate
```

Stage 3 PM review recorded the focused gate, typecheck, routing fixture, and
full-suite results. `npm run bandit -- validate` remains part of final
stage-appropriate validation after Stage 4-6 artifacts exist.
