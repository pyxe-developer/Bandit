# BANDIT-089 Stage 3 Implementation Evidence

contract_version: 1
work_item: BANDIT-089
stage: Stage 3 implementation
verdict: pass
written_at: 2026-06-10T04:31:00Z
pm_evidence_correction_at: 2026-06-10T04:38:00Z

## Summary

Stage 3 implementation for `BANDIT-089` - Trust Boundary Evidence Schema
Contracts is complete and verified. The implementation adds the first
schema-only, fail-closed `BANDIT-PRD-004` trust-boundary contract surface:
Boundary Contour policy data, Boundary Prediction Record validation,
Notify-And-Revert Artifact validation, aggregate validation integration, and
land-check autonomy evidence gating.

The first MiniMax fallback attempt timed out after partial source edits and no
Writer-owned evidence. A bounded MiniMax repair pass then completed the PM
review blockers in `src/state/boundary-autonomy.ts` and wrote
`docs/work/BANDIT-089/writer-report.md`. Codex PM corrected this evidence file
only to remove factual overclaims and to describe the full accumulated Stage 3
package rather than the final repair file alone.

## Verification Result

`pass`

Codex PM independently reran verification after the repair pass:

- `node --test --test-name-pattern "boundary|auto-land autonomy|notify-and-revert" test/landing-gates.test.mjs`: pass (`3` pass, `0` fail).
- `node --test test/landing-gates.test.mjs`: pass (`69` pass, `0` fail).
- `npm run typecheck`: pass.
- `npm run bandit -- validate`: pass (`Bandit state is valid.`).
- `npm test`: pass (`599` pass, `0` fail).
- `git diff --check`: pass.

## Implementation Summary

Accumulated Stage 3 implementation changes:

| Path | Purpose |
| --- | --- |
| `.bandit/policy/boundary-contour.json` | Adds the initial conservative Boundary Contour policy as declarative data. |
| `docs/templates/boundary-prediction-record.md` | Adds the Boundary Prediction Record template surface. |
| `docs/templates/notify-and-revert-artifact.md` | Adds the Notify-And-Revert Artifact template surface. |
| `src/state/boundary-autonomy.ts` | Adds contour parsing, artifact parsing, fail-closed validation, default policy writer, and land-check helper logic. |
| `src/commands/init.ts` | Seeds the new policy and templates for initialized fixture/fresh repos. |
| `src/commands/validate.ts` | Includes Boundary Contour policy validation in aggregate `bandit validate`. |
| `src/commands/land-check.ts` | Requires boundary evidence only for `auto_land` or `notify_and_revert` landing autonomy claims. |
| `src/state/landing-verdicts.ts` | Parses optional landing autonomy metadata from landing verdicts. |
| `src/state/paths.ts` | Adds the Boundary Contour policy path. |
| `src/state/templates.ts` | Adds committed template contract checks for the new evidence templates. |

Stage 2 Test Writer changes remain in `test/landing-gates.test.mjs`; the Stage
3 Writer did not edit tests.

## Acceptance Criteria Mapping

| Acceptance criterion | Evidence |
| --- | --- |
| Versioned conservative Boundary Contour policy exists. | `.bandit/policy/boundary-contour.json`; `writeDefaultBoundaryContourPolicy` in `src/state/boundary-autonomy.ts`; `src/commands/init.ts` seeds the policy for initialized repos. |
| Validation rejects malformed Boundary Contour data. | `parseBoundaryContourPolicy` rejects missing fields, unsupported enum values, duplicate cells, material-risk notify/auto autonomy, never-auto-landable notify/auto autonomy, and low-reversible notify-and-revert cells without rollback-path requirement; focused RED test covers the material-risk auto-land failure. |
| Boundary Prediction Record schema/template exists with PRD-004 minimum fields. | `docs/templates/boundary-prediction-record.md`; `src/state/templates.ts` committed template checks; `BoundaryPredictionRecord` type and parser in `src/state/boundary-autonomy.ts`. |
| Boundary Prediction Record validation fails closed. | `validateBoundaryPredictionRecord` rejects missing/blank required fields, unsupported enum values, wrong contour version/path, missing authorizing cell, risk/evidence mismatch with the authorizing cell, autonomy stronger than the cell permits, empty or malformed relied-on evidence artifacts, empty risk classification evidence, and blank source/head/hash fields. |
| Notify-And-Revert Artifact schema/template exists with PRD-004 minimum fields. | `docs/templates/notify-and-revert-artifact.md`; `src/state/templates.ts` committed template checks; `NotifyAndRevertArtifact` type and parser in `src/state/boundary-autonomy.ts`. |
| Notify-And-Revert Artifact validation fails closed. | `validateNotifyAndRevertArtifact` rejects missing rollback path, operator attention reason, follow-up or expiry state, and boundary prediction record link mismatch for the work item. |
| land-check requires Boundary Prediction Record for `auto_land` and `notify_and_revert` claims. | `src/commands/land-check.ts` calls `gatherBoundaryAutonomyProblems`; focused RED tests cover the missing `auto_land` prediction record path and the `notify_and_revert` path. |
| land-check requires Notify-And-Revert Artifact for `notify_and_revert`. | `gatherBoundaryAutonomyProblems`; focused RED test covers the missing artifact diagnostic. |
| Ordinary safe-to-land bootstrap flows remain unblocked when no autonomy claim exists. | Boundary autonomy checks run only when `landing_autonomy_level` is `auto_land` or `notify_and_revert`; full `test/landing-gates.test.mjs` remains green. |
| Role boundaries are preserved. | `stage3-claude-attempt.md`, `stage3-minimax-attempt-timeout.md`, `stage3-pm-review.md`, and `writer-report.md` record Claude unavailability, MiniMax fallback, no Writer test-surface edits, and no forbidden future-stage edits. |

## Clean-Code Check

| Rubric item | Status | Notes |
| --- | --- | --- |
| Spec alignment | pass | Implements only the first PRD-004 schema/evidence-contract slice. |
| Small surface area | pass | Source changes are limited to policy/template seeding, template validation, landing verdict parsing, boundary-autonomy validation, aggregate validate, and land-check gating. |
| Simple design | pass | Validators are explicit and fail closed with direct diagnostics; policy remains declarative data. |
| Explicit state | pass | The policy path, contour version, authorizing cell, and evidence artifacts are all explicit. |
| No hidden authority | pass | No cockpit, session-context, update, hosted service, telemetry, merge/push/deploy, Trust Verifier cutover, or execution authority is added. |
| Testable behavior | pass | Focused RED tests cover the new land-check/validation gate paths; full landing-gates and full repo tests pass. |
| Readable flow | pass | Boundary-autonomy parsing/validation is centralized in `src/state/boundary-autonomy.ts`; command integrations stay thin. |
| Failure clarity | pass | Missing policy/artifact and malformed evidence produce specific fail-closed messages. |
| Role boundaries | pass | Stage 3 Writer did not edit tests, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, retrospective evidence, roadmap/status, PRDs, intake state, package files, or dependencies. |

## Model-Family Separation

- Stage 2 RED author family: `codex`.
- First-priority Stage 3 route: Claude process adapter.
- Claude route status: unavailable due provider session limit; recorded in
  `docs/work/BANDIT-089/stage3-claude-attempt.md`.
- Fallback Stage 3 writer family: MiniMax via headless `pi`.
- Prior MiniMax attempt status: timed out after partial source edits; recorded
  in `docs/work/BANDIT-089/stage3-minimax-attempt-timeout.md`.
- Repair MiniMax attempt status: completed bounded repair and evidence; recorded
  in `docs/work/BANDIT-089/writer-report.md`.
- Permanent Test Ownership Boundary: preserved. No Stage 3 Writer test-surface
  edits were made.

## Bootstrap Gaps

None. Stage 3 is ready for Stage 4 review after Codex PM records the
coordination transition and synchronizes the concise status surfaces.
