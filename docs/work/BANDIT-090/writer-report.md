# BANDIT-090 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-090
stage: Stage 3 implementation
author: implementation_writer (non-Codex fallback)
timestamp: 2026-06-10T05:16:00Z

## Scope

Repaired the 6 PM blockers from `docs/work/BANDIT-090/stage3-pm-review.md` using a non-Codex fallback writer per the Bootstrap Model-Family Separation rule.

## Files Changed

### `src/state/attribution-join-key.ts`

1. **Added `SUPPORTED_ARTIFACT_KINDS` constant** - defines the allowed artifact kinds: `landing`, `model_call`, `tool_call`, `escape`.

2. **Added `artifact_kind` validation** - validates that `artifact_kind` is present and is one of the supported values; fails closed on unsupported values.

3. **Added landing-specific field validation** - when `artifact_kind` is `landing`, requires non-blank `artifact_path`, `role_or_profile`, `touched_surface`, `boundary_prediction_record`, `purpose`, and `artifact_state`.

4. **Updated `gatherLandingAttributionProblems` signature** - added `boundaryPredictionRecord` path to the parameter and an optional `attributionJoinKeyPath` parameter for honoring verdict-specified paths.

5. **Added cross-checks for `review_subject_hash` and `boundary_prediction_record` path** - validates that `review_subject_hash` is present and that the `boundary_prediction_record` path in the attribution join key matches the BPR path.

6. **Fixed misleading comment in `deriveAttributionJoinHash`** - rewrote the JSDoc to honestly describe the function as deriving lookup data, not canonical evidence.

### `src/commands/land-check.ts`

1. **Honors `landingVerdict.attributionJoinKey`** - when the landing verdict specifies an `attribution_join_key` path, that path is used; otherwise the conventional path is used.

2. **Passes BPR path to attribution gate** - computes and passes the BPR path to `gatherLandingAttributionProblems` for cross-check validation.

## Repair Summary

| Blocker | Repair |
| --- | --- |
| 1. Under-complete landing artifact validation | Added `artifact_kind` validation and landing-specific required fields |
| 2. Unsupported `artifact_kind` not rejected | Added `SUPPORTED_ARTIFACT_KINDS` set and validation |
| 3. Missing cross-checks for `review_subject_hash` and BPR path | Added both cross-checks in `gatherLandingAttributionProblems` |
| 4. `land-check` ignores verdict's attribution join key path | Now honors `landingVerdict.attributionJoinKey` when present |
| 5. Misleading `deriveAttributionJoinHash` comment | Rewrote JSDoc to describe derived lookup data honestly |
| 6. Missing evidence files | Created `writer-report.md` and `implementation-evidence.md` |

## Verification

- Attribution-focused tests: `3` pass, `0` fail
- Full landing-gates tests: `72` pass, `0` fail
- Typecheck: pass
