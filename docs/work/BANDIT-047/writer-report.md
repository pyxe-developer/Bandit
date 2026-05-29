# BANDIT-047 Writer Report

## Identity

- writer_identity: claude_process_adapter
- model_family: claude
- base_sha: d5f83e6a3a23645c89053ebb9192c4bc79afcbd0
- dispatch_status: completed (repair run)

## Implementation Summary

Implemented the Stage 3 Bootstrap Model-Family Separation repair for BANDIT-047. The core change is `src/state/model-family-separation.ts`, a new validation module that enforces eight policy rules, wired into the existing `validateBandit` function in `src/commands/validate.ts`.

**Validation logic** (in order):

1. Skip entirely when neither `.bandit/policy/model-family-separation.json` nor `docs/model-family-separation/` exists (historical-compatibility guard).
2. Fail closed when the evidence directory exists but the policy is missing.
3. Fail closed when `docs/templates/model-family-separation.md` is missing.
4. For each `model_family_separation` decision in `release_authorized_decisions`:
   - Fail closed when evidence file is missing.
   - Fail closed when Stage 2 `test_writer_identity`, `red_author_model_family`, `acceptance_mapping_owner`, or `stage3_test_edit_authority` is absent.
   - Fail closed when Stage 2 and Stage 3 share the same model family (`codex`/`codex`).
   - Fail closed when Stage 2 is Codex-authored and Stage 3 is not `claude`.
   - Fail closed when `test_surface_edit_status` is `touched` and `contaminated_attempt_status` is `partial_repair` with no `complete_revert_evidence`.
   - Fail closed when `test_surface_edit_status` is `touched` and `writer_touched_test_surfaces` is non-empty.
   - Fail closed when `claude_authored_escalation_target` is `claude` or `claude_self_review_allowed` is `true`.

**Artifacts created to support the committed gate**:

- `.bandit/policy/model-family-separation.json` — committed policy file declaring BANDIT-047's model-family separation decision.
- `docs/templates/model-family-separation.md` — template guiding future work items to record model-family separation evidence.
- `docs/model-family-separation/BANDIT-047-model-family-separation.json` — BANDIT-047 model-family separation evidence record.

The Bootstrap Orchestration Boundary is enforced through artifact and diff gates around Process Adapter runs. No live True Agent orchestration, bidirectional A2A, scoped runtime permissions, or persistent worker context was introduced.

## Repair Note

The first Writer run (timed out at 900s) produced a partial implementation that caused 6 failures in `npm test`. The root cause: `validateModelFamilySeparation` failed hard when `.bandit/policy/model-family-separation.json` was absent, but test fixtures created by `bandit init` + selective template writes do not include this policy file. Historical-compatibility tests (`validate preserves compatibility for historical work items...`, `validate passes for initialized repo-native state...`, `committed local Qwen baseline profile uses the direct local oMLX route`, etc.) all use `createInitializedRepo()` / `createTempRepo()` patterns that never set up the model-family policy.

**Fix applied in this repair run:** Added a graceful skip guard at the top of `validateModelFamilySeparation`. Validation is now skipped when neither the policy file nor the `docs/model-family-separation/` evidence directory exists. When the evidence directory exists but the policy is missing, the function still fails closed (preserving the dedicated model-family test "validate fails closed when the model-family separation policy is missing").

## Files Changed by Writer

- `src/state/model-family-separation.ts` (new — core validation module; updated in repair to add skip guard)
- `src/commands/validate.ts` (import added, `validateModelFamilySeparation` called)
- `.bandit/policy/model-family-separation.json` (new — committed policy)
- `docs/templates/model-family-separation.md` (new — committed template)
- `docs/model-family-separation/BANDIT-047-model-family-separation.json` (new — BANDIT-047 evidence)
- `docs/specs/BANDIT-047-implementation-evidence.json` (new — implementation evidence spec)
- `docs/work/BANDIT-047/implementation-evidence.md` (new — implementation evidence doc)
- `docs/work/BANDIT-047/writer-report.md` (new — this file)

## Forbidden Test-Owned Surfaces Confirmation

No forbidden surface was touched. The following surfaces were not created, edited, deleted, regenerated, formatted, or mechanically adjusted:

- `test/**` (no test files touched)
- `test/helpers/**` (no test helper files touched)
- `docs/work/BANDIT-047/red-evidence.md` (not touched)
- `docs/specs/BANDIT-047-red-evidence.json` (not touched)
- `docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json` (not touched)
- `docs/work/BANDIT-047/brief.md` (not touched)
- `docs/work/BANDIT-047/dispatch.md` (not touched)
- `docs/roadmap/CURRENT_CONTEXT.md` (not touched)
- `docs/roadmap/ROADMAP.md` (not touched)
- `.bandit/bootstrap-gaps.json` (not touched)
- `.bandit/events.jsonl` (not touched)

## Verification Results

| Command | Result |
| --- | --- |
| `node --test test/model-family-separation.test.mjs` | 10 pass, 0 fail |
| `node --test test/landing-gates.test.mjs test/local-qwen-review.test.mjs test/validate.test.mjs test/bootstrap-gaps.test.mjs test/artifact-create.test.mjs test/draft-work.test.mjs test/work-item-create.test.mjs` | 161 pass, 0 fail |
| `npm test` | 380 pass, 0 fail |
| `npm run typecheck` | pass |
| `npm run bandit -- validate` | Bandit state is valid. |
| `git diff --check` | pass (no whitespace issues) |

## Clean-Code Self-Check

1. **Spec alignment**: Implements exactly the eight failing test cases, no more.
2. **Small surface area**: Skip guard + eight validation functions. Import added to validate.ts.
3. **Simple design**: Flat validation sequence; no shared mutable state.
4. **Explicit state**: All validation logic in named functions; errors thrown with exact test-expected messages.
5. **No hidden authority**: Template check reads only; policy is the canonical source of which decisions exist.
6. **Testable behavior**: All behavior driven by 10 focused tests; all 10 pass. No other tests regressed (380/380 pass).
7. **Readable flow**: `validateModelFamilySeparation` → skip guard → `loadPolicy` → `checkTemplateExists` → `validateDecisions` → `loadEvidence` → `validateEvidence` → eight named checks.
8. **Locality**: All model-family separation logic lives in `src/state/model-family-separation.ts`.
9. **Failure clarity**: Each check throws with the exact error message expected by the test.
10. **No role erosion**: Writer did not touch tests, RED evidence, or acceptance mappings.
11. **Compatibility preserved**: Historical and freshly-initialized repos without model-family policy are unaffected by the new gate.

## Stop Conditions, Test-Change Requests, Unresolved Risks

None. All 380 tests pass. Typecheck passes. `bandit validate` on the main repo passes. No remaining risk.
