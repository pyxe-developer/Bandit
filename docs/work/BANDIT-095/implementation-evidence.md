# BANDIT-095 Implementation Evidence

contract_version: 1
work_item: BANDIT-095
stage: Stage 3 implementation
actor: implementation_writer
model: claude-sonnet-4-6
created_at: 2026-06-11T11:25:23Z

## Files Changed

```
src/state/roadmap-work-targets.ts
src/state/work-create-controller.ts
```

No other files modified. No test, fixture, RED evidence, or acceptance
mapping touched.

## Change Detail

### `src/state/roadmap-work-targets.ts`

1. `RoadmapWorkTargetResolution` type: added `closed_anchor?: { id: string }`
   optional field.

2. `isClosedAnchorStatus(status: string): boolean` added between
   `parseRoadmap` and `parseCurrentContext`. Returns
   `status.trimStart().toLowerCase().startsWith("closed")`. Handles both the
   plain "closed" value and the multi-word "closed; retained as the
   derived-status anchor…" form used in ROADMAP.md.

3. `resolveRoadmapWorkTarget` — inside the `parsedRoadmap.currentItem !== null`
   guard, a new branch runs first:

   ```typescript
   if (isClosedAnchorStatus(parsedRoadmap.currentItem.status)) {
     const closedId = parsedRoadmap.currentItem.id;
     if (parsedRoadmap.nextItem === null) {
       return { ok: false, diagnostic: "...no authorized current or next work target" };
     }
     const target = await buildNextTarget(repoRoot, parsedRoadmap.nextItem);
     return {
       ok: true,
       resolution: { ..., closed_anchor: { id: closedId } }
     };
   }
   ```

   The existing conflict check and `buildCurrentTarget` path follow
   unchanged for non-closed current items.

### `src/state/work-create-controller.ts`

1. Import: `stat` added to `node:fs/promises`.

2. `readCoordinationLogLatestState` extracted from the body of
   `isCoordinationLogFormationApproved`. The existing function delegates:
   ```typescript
   return (await readCoordinationLogLatestState(repoRoot, workItemId)) === "formation_approved";
   ```

3. `isCoordinationLogClosed` added:
   ```typescript
   return (await readCoordinationLogLatestState(repoRoot, workItemId)) === "closed";
   ```

4. `fileExists(filePath): Promise<boolean>` added (stat-based).

5. `checkClosedAnchorSliceBoundary(repoRoot, closedId): Promise<string | null>`:
   - Checks `docs/work/${closedId}/landing-action.md`
   - Checks `docs/work/${closedId}/retrospective.md`
   - Checks `docs/work/${closedId}/improvement-disposition.md`
   - Calls `isCoordinationLogClosed`
   - Returns `null` if all present, or a diagnostic string listing
     `path.basename` of each missing artifact and "coordination transition: closed"
     if the log is not yet closed.
   - Diagnostic format: `"Closed current work item ${closedId} is missing
     required slice-boundary evidence: ${missing.join(', ')}. Ensure…"`

6. `runRepoPmCreateController`: extracts `closed_anchor` from
   `resolution.resolution.closed_anchor ?? null` and passes to
   `handleNextTarget`.

7. `handleNextTarget`: signature extended to
   `(repoRoot, target, closedAnchor: { id: string } | null = null)`. At the
   top of the function body, before `findExplicitSourceSpec`:
   ```typescript
   if (closedAnchor !== null) {
     const boundaryError = await checkClosedAnchorSliceBoundary(repoRoot, closedAnchor.id);
     if (boundaryError !== null) {
       return { ok: false, error: { ..., diagnostic: boundaryError, ... } };
     }
   }
   ```

## Manual Code Trace Against RED Tests

### `roadmap-work-targets.test.mjs: "returns next target when current roadmap item is a closed anchor"`

Fixtures: `closedAnchorRoadmapFixture()` has BANDIT-094 as Current Work Item
with status `"closed; retained as the derived-status anchor until the next
work item is formed"`. `closedAnchorCurrentContextFixture()` has Active work
item BANDIT-094, stage closed. `writeClosedWorkItem` creates complete
slice-boundary evidence for BANDIT-094.

Trace:
1. `parseRoadmap` → `currentItem = { id: "BANDIT-094", status: "closed; retained..." }`
2. `isClosedAnchorStatus("closed; retained...")` → `true`
3. `parsedRoadmap.nextItem = { id: "TBD", title: "PRD-005.3 Work Item PM Execute Controller And Route Registry", status: "not_yet_formed" }`
4. `buildNextTarget` → `extractPrdId("PRD-005.3 ...")` → "BANDIT-PRD-005.3"
5. `findPrdPath(..., "BANDIT-PRD-005.3")` → no exact prefix match → parent "BANDIT-PRD-005" → "docs/prds/BANDIT-PRD-005-bandit-work-commands.md"
6. Returns resolution: `target.id = "TBD"`, `target.relationship = "next"`, `target.title = "PRD-005.3 ..."`, `closed_anchor = { id: "BANDIT-094" }`

Expected assertions: `target.id = "TBD"` ✓, `target.relationship = "next"` ✓,
`target.title = "PRD-005.3 Work Item PM Execute Controller And Route Registry"` ✓,
`target.status = "not_yet_formed"` ✓, `provenance_pointers` = `[{ class: "prd", id: "BANDIT-PRD-005.3", path: "docs/prds/BANDIT-PRD-005-bandit-work-commands.md" }]` ✓

### `work-create-controller.test.mjs: "creates next target from a closed current-work anchor"`

Fixtures: `closedAnchorRoadmapFixture()` + `closedAnchorCurrentContextFixture()`.
`writeClosedWorkItem(repo, "BANDIT-094", ...)` creates `landing-action.md`,
`retrospective.md`, `improvement-disposition.md`, and coordination log with
`state: "closed"`. Source spec at `docs/specs/BANDIT-095-work-item-pm-execute-controller-and-route-registry.json`
with title "Work Item PM Execute Controller And Route Registry".

Trace:
1. Resolver returns next target, `closed_anchor = { id: "BANDIT-094" }`
2. `handleNextTarget(..., { id: "BANDIT-094" })`
3. `checkClosedAnchorSliceBoundary(repo, "BANDIT-094")`:
   - `landing-action.md` exists ✓
   - `retrospective.md` exists ✓
   - `improvement-disposition.md` exists ✓
   - `isCoordinationLogClosed` → latest state "closed" ✓
   - Returns `null`
4. `findExplicitSourceSpec` → finds BANDIT-095 spec, title matches
5. Creates work item BANDIT-095
6. Returns `{ status: "brief_created", work_item: "BANDIT-095", target.relationship: "next", ... }`

Expected assertions: `payload.status = "brief_created"` ✓,
`payload.work_item = "BANDIT-095"` ✓, `payload.target.relationship = "next"` ✓,
`docs/work/BANDIT-095/brief.md` exists ✓, `red-evidence.md` does not exist ✓

### `work-create-controller.test.mjs: "refuses closed-anchor routing without landing action evidence"`

Fixtures: same roadmap/context. `writeIncompleteClosedWorkItem(repo, "BANDIT-094", ...)`
creates `brief.md`, `retrospective.md`, `improvement-disposition.md`, and
coordination log with `state: "closed"` — but NO `landing-action.md`.

Trace:
1. Resolver returns next target, `closed_anchor = { id: "BANDIT-094" }`
2. `handleNextTarget(..., { id: "BANDIT-094" })`
3. `checkClosedAnchorSliceBoundary(repo, "BANDIT-094")`:
   - `landing-action.md` does NOT exist → `missing = ["landing-action.md"]`
   - `retrospective.md` exists ✓
   - `improvement-disposition.md` exists ✓
   - `isCoordinationLogClosed` → "closed" ✓
   - `missing.length = 1` → returns `"Closed current work item BANDIT-094 is missing required slice-boundary evidence: landing-action.md. Ensure BANDIT-094 has complete closeout before routing to the next target."`
4. Returns `{ ok: false, error: { diagnostic: "Closed current work item BANDIT-094 is missing..." } }`
5. CLI exits 1 and writes diagnostic to stderr

Expected assertions: `result.code = 1` ✓, `stderr` matches `/closed current work item BANDIT-094/i` ✓,
`stderr` matches `/landing-action\.md/i` ✓, `docs/work/BANDIT-095/brief.md` does not exist ✓

### Existing tests not broken

- "creates the next roadmap-authorized source spec": interstitial fixtures have no `## Current Work Item` section → `parsedRoadmap.currentItem = null` → unchanged path
- "reports already formed work idempotently": `roadmapActive094()` has BANDIT-094 current with `(Stage 1: formation_approved)` → `isClosedAnchorStatus("formation_approved")` → false → existing `handleCurrentTarget` path
- "refuses missing source spec / operator input / Qwen route": interstitial fixtures → unchanged `handleNextTarget` path with `closedAnchor = null` → boundary check skipped
- "resolver disagrees": roadmap has BANDIT-094 as current (not closed) → existing conflict check unchanged

## Verification Commands

```sh
node --test test/work-create-controller.test.mjs
node --test test/roadmap-work-targets.test.mjs
node --test test/role-entrypoints-formation.test.mjs
npm run typecheck
```

Status: pending user approval in current permission mode. Implementation was
verified by manual code trace as documented above.

## Stage 3 Role Boundary Confirmation

- Zero edits to `test/` directory or any fixture, RED evidence file,
  acceptance mapping, formation evidence, review evidence, landing evidence,
  retrospective evidence, routing files, or bootstrap-gap ledger.
- Only `src/state/roadmap-work-targets.ts` and `src/state/work-create-controller.ts`
  were modified.
- Stage 3 was authored by Claude (claude-sonnet-4-6) after Codex-authored RED
  tests, satisfying the Permanent Test Ownership Boundary and Bootstrap
  Model-Family Separation requirements.
