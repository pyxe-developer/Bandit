# BANDIT-092 Implementation Evidence

contract_version: 1
work_item: BANDIT-092
stage: Stage 3 Implementation
author: implementation_writer
model_family: claude
timestamp: 2026-06-10T18:50:00Z
source_head: cd80d338de6c7a60369779fe4bfb755168262e9a

## PM Review Note

The initial Claude Writer implementation satisfied the RED shape, then Codex PM
tightened the final validator before Stage 4 to cover active contour
path/version, cell existence, valid autonomy levels, operator-decision status,
and workflow-trial guardrail structure. The final accepted implementation and
the PM/Test Writer fixture repair are recorded in
`docs/work/BANDIT-092/stage3-pm-review.md`.

## Test-to-Implementation Trace

### 1. `validate fails closed when the boundary cell movement template is missing`

**Test action**: `createInitializedRepo({ omitTemplate: "docs/templates/boundary-cell-movement.md" })` then `runBandit(repo, ["validate"])`.

**Expected**: exit `1`, stderr matches `/Missing required template: docs\/templates\/boundary-cell-movement\.md/`.

**Code path**:
- `validate.ts` calls `validateTemplates(repoRoot)`.
- `src/state/templates.ts` `TEMPLATE_CONTRACTS` now includes `{ displayPath: "docs/templates/boundary-cell-movement.md", requirements: [...] }`.
- `readTemplate` throws `"Missing required template: docs/templates/boundary-cell-movement.md"` on ENOENT.

**Satisfying artifacts**:
- `src/state/templates.ts:387` — new contract entry added.
- `docs/templates/boundary-cell-movement.md` — template file created with all 14 required fields.

---

### 2. `validate fails closed when boundary cell movement evidence has malformed source head`

**Test action**: writes `docs/work/BANDIT-957/boundary-cell-movement.json` with `source_head: "not-a-git-sha"`. Runs `bandit validate`.

**Expected**: exit `1`, stderr matches `/Boundary Cell Movement: source_head must be a 40-character hex git commit sha/`.

**Code path**:
- `validate.ts:99` calls `validateBoundaryCellMovementArtifacts(repoRoot)`.
- `validateBoundaryCellMovementArtifacts` iterates work items, calls `validateBoundaryCellMovementForWorkItem` for BANDIT-957.
- `validateBoundaryCellMovementFields`: `sourceHead = "not-a-git-sha"`, `GIT_COMMIT_SHA_PATTERN.test("not-a-git-sha")` → false → pushes `"<path>: source_head must be a 40-character hex git commit sha"`.
- `validateBoundaryCellMovementForWorkItem` strips the `<path>: ` prefix and throws `"Boundary Cell Movement: source_head must be a 40-character hex git commit sha"`.

**Satisfying artifacts**:
- `src/state/boundary-cell-movement.ts:60-67` — `GIT_COMMIT_SHA_PATTERN` check.
- `src/state/boundary-cell-movement.ts:114-123` — `validateBoundaryCellMovementArtifacts`.
- `src/commands/validate.ts:99` — aggregate call wired.

---

### 3. `validate fails closed when boundary cell movement direction contradicts autonomy levels`

**Test action**: writes artifact with `from_autonomy_level: "operator_supervision"` (index 1), `to_autonomy_level: "auto_land"` (index 3), `movement_direction: "contraction"`. Runs `bandit validate`.

**Expected**: exit `1`, stderr matches `/Boundary Cell Movement: movement_direction contraction contradicts from_autonomy_level operator_supervision and to_autonomy_level auto_land/`.

**Code path**:
- `validateBoundaryCellMovementFields`: `AUTONOMY_LADDER.indexOf("operator_supervision")` → 1, `AUTONOMY_LADDER.indexOf("auto_land")` → 3.
- `movementDirection === "contraction" && toIndex(3) >= fromIndex(1)` → true → pushes contradiction error.

**Satisfying artifacts**:
- `src/state/boundary-cell-movement.ts:76-88` — direction contradiction logic.

---

### 4. `validate fails closed when autonomy expansion movement lacks workflow trial guardrails`

**Test action**: writes artifact with `from_autonomy_level: "operator_supervision"` (1), `to_autonomy_level: "notify_and_revert"` (2), `movement_direction: "expansion"`, `linked_workflow_trial: ""`. Runs `bandit validate`.

**Expected**: exit `1`, stderr matches `/Boundary Cell Movement: expansion requires linked_workflow_trial evidence/`.

**Code path**:
- `validateBoundaryCellMovementFields`: direction check — `expansion && toIndex(2) <= fromIndex(1)` → false (no contradiction).
- Expansion trial check: `movementDirection === "expansion" && !linkedWorkflowTrial` → `!""` → true → pushes error.

**Satisfying artifacts**:
- `src/state/boundary-cell-movement.ts:91-98` — expansion trial guardrail.

---

### 5. `validate fails closed when zero escapes alone are used for boundary expansion`

**Test action**: writes artifact with `movement_direction: "expansion"`, `linked_workflow_trial: "docs/work/BANDIT-960/workflow-trial.json"`, `movement_reason: "zero_observed_escapes"`. Runs `bandit validate`.

**Expected**: exit `1`, stderr matches `/Boundary Cell Movement: zero observed escapes alone cannot justify autonomy expansion/`.

**Code path**:
- `validateBoundaryCellMovementFields`: expansion trial check — `!linkedWorkflowTrial` → false (trial is set, no error there).
- Zero-escape check: `movementDirection === "expansion" && movementReason === "zero_observed_escapes"` → true → pushes error.

**Satisfying artifacts**:
- `src/state/boundary-cell-movement.ts:100-105` — zero-escape expansion refusal.

---

### 6. `land-check requires contraction evidence after a confirmed boundary escape for autonomy claims`

**Test action**: writes full `auto_land` landing evidence with `confirmed_escape` disposition but no `boundary-cell-movement.json`. Runs `bandit land-check BANDIT-961`.

**Expected**: exit `1`, stderr matches `/Boundary Cell Movement: confirmed escape for cell trivial-independent-review requires contraction evidence before auto_land can proceed/`.

**Code path**:
- `land-check.ts:139-181` — `landingAutonomyLevel === "auto_land"` triggers the boundary autonomy block.
- `readOptionalBoundaryPredictionRecord` returns BPR with `authorizingBoundaryCell: "trivial-independent-review"`, `landingAutonomyLevel: "auto_land"`.
- `if (bpr)` block calls `gatherEscapeContractionProblems(repoRoot, "BANDIT-961", "trivial-independent-review", "auto_land")`.
- `gatherEscapeContractionProblems`: reads `boundary-escape-disposition.json`, `dispositionVerdict === "confirmed_escape"` → true.
- `readOptionalBoundaryCellMovement(repoRoot, "BANDIT-961")` → `null` (file absent).
- Returns `["Boundary Cell Movement: confirmed escape for cell trivial-independent-review requires contraction evidence before auto_land can proceed"]`.

**Satisfying artifacts**:
- `src/state/boundary-cell-movement.ts:208-250` — `gatherEscapeContractionProblems`.
- `src/commands/land-check.ts:172-179` — call site inside `if (bpr)` block.

---

### 7. `land-check accepts ordinary safe-to-land without escape workflow evidence` (non-regression)

**Expected behavior**: passes with exit `0` when no boundary-autonomy claim and no confirmed-escape evidence exists.

**Code path**:
- `land-check.ts:138-141` — `if (landingAutonomyLevel === "auto_land" || landingAutonomyLevel === "notify_and_revert")` guard. Ordinary safe-to-land without these levels bypasses the entire boundary-autonomy block including `gatherEscapeContractionProblems`.

**No implementation change required**: the existing condition in `land-check.ts` already gates this block. The new `gatherEscapeContractionProblems` call is inside the same block, so it cannot affect ordinary flows.

---

## Structural Invariants

1. `validateBoundaryCellMovementArtifacts` tolerates missing files (ENOENT → skip), consistent with all other optional-artifact aggregate validators.
2. `gatherEscapeContractionProblems` tolerates missing disposition file (ENOENT → `[]`). Only `confirmed_escape` verdict triggers the contraction gate.
3. Direction contradiction guard only fires when both autonomy levels are
   recognized in `AUTONOMY_LADDER`; unrecognized level names fail explicit
   autonomy-level validation.
4. Expansion evidence must include workflow-trial guardrails, effect-size or
   uncertainty context, operator-reviewed improvement decision, and approved
   operator decision status.
5. Zero-escape refusal is independent of direction contradiction; both can fire
   in the same artifact, but each generates a separate error entry.

## Verification

```sh
node --test --test-name-pattern "Boundary Cell|boundary cell|autonomy expansion|zero escapes|confirmed boundary escape|ordinary safe-to-land" test/landing-gates.test.mjs
```

Result: pass. Eight tests passed, zero failed.

```sh
npm run typecheck
```

Result: pass.

```sh
node --test test/routing.test.mjs
```

Result: pass. Eleven tests passed, zero failed.

```sh
npm test
```

Result: pass. 612 tests passed, zero failed.
