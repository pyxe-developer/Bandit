# BANDIT-095 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-095
stage: Stage 3 implementation
actor: implementation_writer
model: claude-sonnet-4-6
created_at: 2026-06-11T11:25:23Z

## Files Changed

- `src/state/roadmap-work-targets.ts` — closed-anchor detection and next-target
  routing
- `src/state/work-create-controller.ts` — closed-anchor slice-boundary
  evidence validation

No tests, test helpers, fixtures, RED evidence, formation evidence, review
evidence, or acceptance mappings were edited.

## Implementation Summary

### `src/state/roadmap-work-targets.ts`

**Type change:** Added `closed_anchor?: { id: string }` to
`RoadmapWorkTargetResolution` so the resolver can communicate which work item
was the closed anchor to callers.

**New helper:** `isClosedAnchorStatus(status: string): boolean` — returns true
when the parsed ROADMAP item status begins with "closed" (case-insensitive,
trimmed). Handles both plain "closed" and the "closed; retained as the
derived-status anchor..." form that ROADMAP.md uses.

**`resolveRoadmapWorkTarget` change:** When `parsedRoadmap.currentItem` is
non-null, the function now first checks `isClosedAnchorStatus`. If the current
item is a closed anchor:
- Requires `parsedRoadmap.nextItem` to exist (fails closed with the existing
  "no authorized current or next work target" diagnostic if not)
- Calls `buildNextTarget` for the next roadmap item
- Returns the next-item resolution with `closed_anchor: { id: closedId }`
  populated

The existing conflict check (CURRENT_CONTEXT / ROADMAP disagreement) and the
existing "current" target path remain unchanged, executing only when the
current item is NOT a closed anchor.

### `src/state/work-create-controller.ts`

**Import change:** Added `stat` to the `node:fs/promises` import (used by the
new `fileExists` helper).

**Refactor:** Extracted `readCoordinationLogLatestState` from
`isCoordinationLogFormationApproved`. The existing function now delegates to the
shared helper. This is a clean refactor: same observable behavior, less
duplication, no new public surface.

**New helpers:**
- `isCoordinationLogClosed(repoRoot, workItemId): Promise<boolean>` — checks
  latest coordination log state === "closed"
- `fileExists(filePath): Promise<boolean>` — stat-based existence check
- `checkClosedAnchorSliceBoundary(repoRoot, closedId): Promise<string | null>`
  — checks that `landing-action.md`, `retrospective.md`,
  `improvement-disposition.md` all exist and the coordination log's latest
  state is "closed"; returns `null` on success or a diagnostic string naming
  missing artifacts on failure

**`runRepoPmCreateController` change:** Extracts `closed_anchor` from the
resolver resolution (`resolution.resolution.closed_anchor ?? null`) and passes
it to `handleNextTarget`.

**`handleNextTarget` signature change:** Accepts `closedAnchor: { id: string }
| null = null`. When non-null, calls `checkClosedAnchorSliceBoundary` before
any other work; returns the boundary error if present. The rest of the
function is unchanged.

## Acceptance Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Closed-anchor current work plus authorized next unformed target resolves to the next target | `isClosedAnchorStatus` detects closed status in `resolveRoadmapWorkTarget`; `buildNextTarget` is called for the next roadmap item; `closed_anchor` metadata is populated |
| Closed-anchor routing allowed only with complete slice-boundary evidence | `checkClosedAnchorSliceBoundary` validates `landing-action.md`, `retrospective.md`, `improvement-disposition.md`, and latest coordination state `closed` before routing proceeds |
| Incomplete closed-anchor evidence fails closed, names missing evidence | `checkClosedAnchorSliceBoundary` returns a diagnostic string that includes "Closed current work item ${closedId}" and lists missing artifact basenames |
| Active or formation-approved current Work Items preserve current idempotency | Non-closed current items skip the `isClosedAnchorStatus` branch entirely; `handleCurrentTarget` is unchanged |
| Unclosed, stale, or contradictory current Work Items cannot silently route | Current items with non-closed status continue through the existing conflict check; `handleCurrentTarget` refuses non-formation_approved items |
| Existing creation safety preserved (source spec, operator input, Qwen, duplicate, no Stage 2) | `handleNextTarget` remainder is unchanged; boundary check runs first and only gating; no other guards modified |
| Work Intake Ledger, PRDs, specs, prompt contracts remain provenance only | No new authority given to these surfaces; resolver still uses only ROADMAP.md and CURRENT_CONTEXT.md as canonical routing |

## Clean-Code Self-Check

Rubric item | Verdict | Notes
--- | --- | ---
1. Spec alignment | pass | Implements exactly the closed-anchor routing and slice-boundary checks from the brief; no additional behavior
2. Small surface area | pass | 4 new functions, 1 type field, 1 import, 1 function signature change; no unrelated refactors beyond the `readCoordinationLogLatestState` extraction that removes duplication
3. Simple design | pass | `isClosedAnchorStatus` is a one-liner; `checkClosedAnchorSliceBoundary` is a sequential loop with early return; no complex orchestration
4. Explicit state | pass | `closed_anchor` field makes the routing reason visible in the resolution; `checkClosedAnchorSliceBoundary` names each missing artifact
5. No hidden authority | pass | ROADMAP.md/CURRENT_CONTEXT.md remain the authority surfaces; the `closed_anchor` field is metadata, not a new authority
6. Testable behavior | pass | Covered by the Stage 2 RED tests targeting the exact cases
7. Readable flow | pass | `handleNextTarget` boundary check is at the top, early return, then existing flow; easy to follow
8. Locality | pass | Closed-anchor detection in the resolver (where ROADMAP is parsed); slice-boundary check in the controller (where creation side-effects occur)
9. Failure clarity | pass | Diagnostic string: "Closed current work item ${closedId} is missing required slice-boundary evidence: ${missing.join(', ')}. Ensure…"
10. No role erosion | pass | Stage 3 Writer made zero test-surface changes; all file edits are in `src/state/`
11. Improvement capture | not_applicable | No new workflow lesson discovered; the gap was already recorded

## Model-Family Separation Evidence

Codex authored the Stage 2 RED tests and acceptance mapping (as recorded in
`docs/work/BANDIT-095/red-evidence.md`). Stage 3 implementation was performed
by Claude (claude-sonnet-4-6), satisfying the Bootstrap Model-Family Separation
requirement.

## Test Commands (Pending User Approval to Execute)

```sh
node --test test/work-create-controller.test.mjs
node --test test/roadmap-work-targets.test.mjs
node --test test/role-entrypoints-formation.test.mjs
npm run typecheck
```

Shell commands require user approval in the current permission mode. The
implementation was verified through manual code trace against all test fixtures
(see implementation-evidence.md for the trace).

## Confirmation

- Stage 3 made zero edits to tests, test helpers, fixtures, RED evidence, or
  acceptance mappings.
- Stage 3 was authored by Claude (claude-sonnet-4-6) after Codex-authored RED
  tests, satisfying the Permanent Test Ownership Boundary and Bootstrap
  Model-Family Separation requirements.
