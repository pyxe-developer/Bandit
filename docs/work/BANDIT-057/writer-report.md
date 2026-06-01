# BANDIT-057 Writer Report

## Identity

writer_identity: claude_process_adapter
model_family: claude
base_sha: 5e04acd0d188884b984438d83f1d23e655d6d7fa
dispatch_path: docs/work/BANDIT-057/dispatch.md

## Implementation Summary

### Stage 3 original implementation

Stage 3 implementation adds the first bounded role entrypoint and Formation Gate so all 7 focused RED tests pass. The implementation covers:

1. **`replaced` bootstrap-gap disposition**: Added to `SUPPORTED_DISPOSITIONS` with required fields (`replacement_gap`, `replacement_work_item`, `replacement_evidence`, `rationale`, `verification_target`) and reference validation.

2. **Bare invocation role-required refusal**: `bandit` with no command now fails closed with a role-required message naming `repo-pm` and `work-item-pm`, before any context hydration.

3. **`repo-pm create-work-item`**: New role-specific entrypoint that delegates to the existing `createWorkItem` logic with identical safety, no-overwrite, and lifecycle event behavior.

4. **`repo-pm approve-formation`**: Runs deterministic formation validation first (fails if brief is missing required sections), then checks for the three required formation review artifacts, then appends `formation_approved` as an append-only step transition to the coordination log.

5. **Deterministic formation validation** (`src/state/formation-gate.ts`): Checks for work type, scope, acceptance criteria, out-of-scope boundaries, operator input status, role boundary evidence, and write-surface families. Collects all failures and reports them together.

6. **`formation_approved` coordination state**: Added to `CoordinationState` type and `STATE_ORDER` (between `brief_created` and `red_recorded`). `validateFormationApprovedTransition` validates it must follow `brief_created` and requires evidence. `appendFormationApprovedStepTransition` writes the transition. `hasFormationApprovedTransition` reads history for readiness checks.

7. **`work-item-pm start`**: Reads coordination history and fails closed with a message naming `formation_approved` and `formation-review.md` when the transition is absent.

8. **Templates**: `docs/templates/bootstrap-gap-disposition.md` and `docs/templates/formation-review.md` added.

### Stage 3 repair (first pass — PM-review blocker families)

Addressed three blocker families from the first PM review in `docs/work/BANDIT-057/stage3-pm-review.md`:

1. **`repo-pm approve-formation` content inspection**: Formation approval now reads each review artifact and parses `findings_status` and `findings_disposition` metadata fields. Fails closed for blocker findings or undispositioned non-blocking findings in any artifact.

2. **Deterministic formation validation additions**: `validateFormationBrief` now explicitly checks source provenance (`## Origin` section), execution readiness (`## Verification Plan` section), Test Writer boundary evidence ("Test Writer" in `## Role Boundary Evidence`), and Implementation Writer boundary evidence ("Implementation Writer" in `## Role Boundary Evidence`).

3. **`work-item-pm start` evidence re-check**: After confirming the `formation_approved` transition, retrieves the evidence paths from that transition and calls `recheckFormationEvidenceForStart`, which fails closed for stale evidence, blocker findings, undispositioned findings, contradictory verdicts, and missing or blocked operator input status.

### Stage 3 repair (second pass — formation review metadata fail-closed gap)

Addressed one remaining blocker from the second PM review in `docs/work/BANDIT-057/stage3-pm-review.md`:

The prior `inspectFormationReviewContent` only blocked when `findings_status` contained "blocker" or `findings_disposition` contained "undispositioned". It failed open for:
- Missing `findings_status` (empty string from absent metadata field)
- `findings_status: non_blocking` with empty `findings_disposition`
- `findings_status: open` with any disposition

The repair replaces the two loose checks with an explicit, fail-closed validation sequence in `inspectFormationReviewContent`:

1. **Missing `findings_status`** — fails closed with "cannot assess formation review findings" and skips further checks for that artifact.
2. **Unsupported `findings_status`** — fails closed for any value outside the declared `SUPPORTED_FINDINGS_STATUSES` constant (`none`, `no_findings`, `resolved`, `non_blocking`, `open`, `blocker`). Skips further checks.
3. **`findings_status === "blocker"`** — fails closed (now exact equality after normalization through the supported-set gate, not `includes`).
4. **`findings_status === "open"`** — fails closed with an explicit "unresolved findings" message. Catches the `verdict: blocker` + `findings_status: open` + empty disposition scenario identified by Codex PM.
5. **`findings_status === "non_blocking"` without acceptable disposition** — fails closed when `findings_disposition` is empty or "undispositioned". Catches the `findings_status: non_blocking` + empty `findings_disposition` gap.
6. **`findings_disposition === "undispositioned"`** — fails closed for any status (catches explicit undispositioned markers including contradictory ones like `findings_status: resolved` + `findings_disposition: undispositioned`).

Added at module level:
- `SUPPORTED_FINDINGS_STATUSES` constant (Set) — explicit enumeration of recognized `findings_status` values.
- `hasAcceptableDisposition(disposition)` named helper — returns true when disposition is non-empty and not "undispositioned".

### Stage 3 repair (third pass — verdict field validation and internal consistency)

Addressed one remaining blocker from the third PM review in `docs/work/BANDIT-057/stage3-pm-review.md`:

The second-pass repair left `inspectFormationReviewContent` without any check on the `verdict` field. A formation review artifact with `verdict: blocker`, `findings_status: none`, and `findings_disposition: no unresolved findings` passed all checks, because the prior checks only examined `findings_status` and `findings_disposition`. Codex PM confirmed the failure mode with a throwaway runtime probe.

The repair adds `verdict` validation to `inspectFormationReviewContent`:

1. **Missing `verdict`** — fails closed; `continue` to next artifact.
2. **Unsupported `verdict`** — fails closed for any value outside the declared `SUPPORTED_VERDICTS` constant (`pass`, `fail`, `blocker`, `non_blocking`, `not_applicable`, `bootstrap_gap`); `continue`.
3. **`verdict === "blocker"` or `verdict === "fail"`** — fails closed regardless of `findings_status`; `continue`. This is the primary fix for the identified failure mode.
4. **Contradiction check** — replaces the standalone `findings_status === "blocker"` and `findings_status === "open"` checks with a single cross-field check that produces an explicit message ("verdict is X but findings_status is Y") and uses `continue` to avoid duplicate error entries.
5. **`findings_status === "non_blocking"` without acceptable disposition** and **`findings_disposition === "undispositioned"`** — retained unchanged.

Added at module level:
- `SUPPORTED_VERDICTS` constant (Set) — explicit enumeration of recognized `verdict` values.

`SUPPORTED_FINDINGS_STATUSES` and `hasAcceptableDisposition` are unchanged.

### Stage 3 repair (fourth pass — Formation Gate / generated brief contract mismatch)

Addressed the remaining blocker from the third-pass PM review in
`docs/work/BANDIT-057/stage3-pm-review.md`:

`repo-pm approve-formation BANDIT-057` failed before review-artifact
inspection because `validateFormationBrief` required metadata sections not
produced by `repo-pm create-work-item` or present in the active BANDIT-057
brief. The error was:

```
Formation validation failed for docs/work/BANDIT-057/brief.md:
missing work type; missing out-of-scope boundaries;
missing role boundary evidence; missing write-surface families
```

The BANDIT-057 brief uses repo-native section names that differ from the
canonical formation-ready fixture format:

| Required check | Canonical (fixture) | Repo-native (BANDIT-057 brief) |
|---|---|---|
| work type | `work_type: chore` field | `## Non-Product Work` section |
| out-of-scope | `## Out Of Scope` section | `## Stage Capability Scope` → `forbidden_actions:` |
| role boundary | `## Role Boundary Evidence` section | `## Stage Capability Scope` → `authority_roles:` |
| write surfaces | `## Write-Surface Families` section | `## Expected Files` section |

The repair updates `collectFormationErrors` to accept repo-native section
alternatives alongside the canonical sections:

1. **work_type**: Accept `work_type:\s*\S` YAML field OR `## Non-Product Work`
   section with content OR `## Product Work` section with content.

2. **Out Of Scope**: Accept `## Out Of Scope` section with content OR
   `## Stage Capability Scope` section with content (carries `forbidden_actions:`
   as explicit out-of-scope boundaries).

3. **Role Boundary Evidence**: Accept `## Role Boundary Evidence` section with
   content first; if absent, fall back to `## Stage Capability Scope` section
   content. Extend Test Writer and Implementation Writer patterns to match both
   spaced form ("Test Writer") and underscore form ("test_writer") as used in
   `authority_roles:` YAML lists.

4. **Write-Surface Families**: Accept `## Write-Surface Families` section with
   content OR `## Expected Files` section with content.

All other checks (`## Origin`, `## Scope`, `## Acceptance Criteria`,
`## Operator Input Status`, `## Verification Plan`) are unchanged. The
canonical fixture-format sections continue to satisfy all checks. The
malformed `writeWorkBrief` brief still fails with "unverifiable acceptance
criteria" and all other missing-section errors, so the malformed-formation
test assertion is preserved.

After this repair, `repo-pm approve-formation BANDIT-057` passes brief
validation and reaches review-artifact inspection, which fails with the
expected "missing review artifacts" message (exit 1) since the three
formation review artifacts have not been created yet.

## Files Changed By Writer

### Stage 3 original
- `src/state/bootstrap-gaps.ts` — added `replaced` disposition support
- `src/state/coordination-log.ts` — added `formation_approved` state and new export functions
- `src/state/formation-gate.ts` — new formation validation module
- `src/commands/repo-pm.ts` — new Repo PM command module
- `src/commands/work-item-pm.ts` — new Work Item PM command module
- `src/cli.ts` — bare-invocation refusal and new command routing
- `docs/templates/bootstrap-gap-disposition.md` — new template
- `docs/templates/formation-review.md` — new template

### Stage 3 repair (first pass)
- `src/state/formation-gate.ts` — added content inspection, new formation checks, recheck helpers
- `src/state/coordination-log.ts` — added `readFormationApprovedEvidence` export
- `src/commands/repo-pm.ts` — wired `inspectFormationReviewContent` into `approveFormation`
- `src/commands/work-item-pm.ts` — wired `recheckFormationEvidenceForStart` into `checkStartReadiness`

### Stage 3 repair (second pass)
- `src/state/formation-gate.ts` — added `SUPPORTED_FINDINGS_STATUSES` constant, `hasAcceptableDisposition` helper, fail-closed `open` and `non_blocking`+empty-disposition checks, missing-status gate, unsupported-status gate

### Stage 3 repair (third pass)
- `src/state/formation-gate.ts` — added `SUPPORTED_VERDICTS` constant, verdict validation (missing/unsupported/blocker/fail → fail closed with continue), contradiction check replacing standalone `findings_status: blocker` and `findings_status: open` checks

### Stage 3 repair (fourth pass)
- `src/state/formation-gate.ts` — updated `collectFormationErrors` to accept repo-native brief section alternatives: Non-Product Work / Product Work for work type; Stage Capability Scope for out-of-scope and role boundary; Expected Files for write-surface families; extended Test Writer / Implementation Writer patterns to match underscore form

### Evidence (all passes)
- `docs/work/BANDIT-057/implementation-evidence.md` — Stage 3 evidence (refreshed)
- `docs/specs/BANDIT-057-implementation-evidence.json` — Stage 3 evidence (refreshed)
- `docs/work/BANDIT-057/writer-report.md` — this file

## Test-Surface Boundary Confirmation

The Stage 3 Writer made zero edits to:
- `test/role-entrypoints-formation.test.mjs`
- Any other test file, test helper, or fixture
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/specs/BANDIT-057-red-evidence.json`
- `docs/work/BANDIT-057/brief.md`
- `docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`
- Any acceptance mappings for BANDIT-057
- Any review, landing, retrospective, or PM review evidence for BANDIT-057
- Roadmap, status, or CURRENT_CONTEXT files

## Stage 3 Authorship Confirmation

Stage 3 (original and repair) was authored by Claude through the Process Adapter path (interactive session). Codex PM authored Stage 2 RED tests. This satisfies Bootstrap Model-Family Separation.

## Verification Commands Run (fourth-pass repair)

| Command | Result |
|---------|--------|
| `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-057` | brief validation passes; fails on missing review artifacts (expected) |
| `node --test test/role-entrypoints-formation.test.mjs` | 7 pass, 0 fail |
| `node --test test/bootstrap-gaps.test.mjs` | 6 pass, 0 fail |
| `node --test test/work-item-create.test.mjs` | 8 pass, 0 fail |
| `node --test test/coordination-log.test.mjs test/coordination-status.test.mjs` | 20 pass, 0 fail |
| `npm run typecheck` | pass |
| `npm run bandit -- validate` | Bandit state is valid. |
| `node ./bin/bandit.mjs cockpit status --json` | pass |
| `node ./bin/bandit.mjs session-context current --json` | pass |
| `git diff --check` | clean |

## Clean-Code Self-Check Against CLEAN_CODE.md (fourth-pass repair)

1. **Spec alignment**: Fourth-pass repair implements exactly the one remaining blocker from the third-pass PM review: Formation Gate / generated brief contract mismatch. `validateFormationBrief` now accepts the repo-native brief section structure while preserving the fixture-format path. No product contract redefinition; no new check families introduced.
2. **Small surface area**: One source file changed (`src/state/formation-gate.ts`). Only `collectFormationErrors` was modified; `inspectFormationReviewContent` and all other exports are unchanged. No new functions or state added.
3. **Simple design**: Each relaxed check is a two-clause OR: canonical section OR repo-native fallback. The Role Boundary Evidence fallback uses a `let` reassignment pattern consistent with the surrounding code style. No new helpers, no new dependencies.
4. **Explicit state**: Fallback sections are named inline in the condition expressions; the intent (what constitutes acceptable evidence for each formation criterion) is directly readable without tracing helper chains.
5. **No hidden authority**: The alternative sections are accepted based on documented equivalence (Stage Capability Scope carries forbidden_actions and authority_roles; Expected Files lists write-surface file paths by family; Non-Product Work / Product Work identify work type). Each equivalence is noted in comments.
6. **Testable behavior**: All 7 focused RED tests still pass. The malformed brief test still fails correctly. The `repo-pm approve-formation BANDIT-057` command now reaches review-artifact validation.
7. **Readable flow**: `collectFormationErrors` retains the same linear structure; each check now has a clear two-line condition. The fallback pattern (`!A && !B`) is consistent across the three relaxed checks.
8. **Locality**: All brief validation logic stays in `formation-gate.ts / collectFormationErrors`.
9. **Failure clarity**: Error messages are unchanged for all cases that still fail; the acceptance logic is extended, not the error paths.
10. **No role erosion**: Writer boundary preserved. No test, test helper, fixture, RED evidence, or acceptance-mapping edits in this pass.
11. **Improvement capture**: The repo-native section alternatives are now documented in both `collectFormationErrors` comments and this writer report; no bootstrap gap is required for a code-level contract clarification this narrow.

## Forbidden-Surface Confirmation

The fourth-pass repair did not edit:
- Any test file, test helper, or fixture
- `docs/work/BANDIT-057/red-evidence.md` or `docs/specs/BANDIT-057-red-evidence.json`
- `docs/work/BANDIT-057/stage3-pm-review.md`
- `docs/work/BANDIT-057/dispatch.md`
- Roadmap, status, or CURRENT_CONTEXT files
- Any review, landing, retrospective, or PM review evidence
- Any dependency files, lockfiles, or installed global skills
- Any unrelated Phase 8 work

Only `src/state/formation-gate.ts` was changed in source.

## Stage 3 Authorship Confirmation

Stage 3 (original, first-pass repair, second-pass repair, third-pass repair, and fourth-pass repair) was authored by Claude through the interactive session path. Codex PM authored Stage 2 RED tests. Bootstrap Model-Family Separation is satisfied across all passes.

## Stop Conditions, Blockers, Unresolved Risks

None. All 7 RED tests pass. All required verification commands pass. `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-057` now passes brief validation and reaches review-artifact inspection (fails on missing artifacts as expected). No test-change requests. No scope blockers encountered. The fourth-pass repair addresses the PM-review blocker: `validateFormationBrief` now accepts repo-native brief section alternatives so Bandit's own generated chore briefs (with `## Stage Capability Scope`) and the active BANDIT-057 brief can reach review-artifact validation.
