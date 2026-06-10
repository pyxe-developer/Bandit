# BANDIT-089 Stage 3 PM Review

contract_version: 1
work_item: BANDIT-089
stage: Stage 3 implementation
reviewed_at: 2026-06-10T04:05:00Z
reviewer: codex_pm
verdict: needs_repair

## Summary

The first MiniMax Stage 3 attempt timed out after producing partial source,
policy, and template changes. The direct RED tests, full landing-gates file,
typecheck, Bandit validation, full test suite, and diff hygiene pass, but Codex
PM does not accept Stage 3 yet because the implementation does not fully
satisfy the accepted `BANDIT-089` brief.

## Passing Evidence

- `node --test --test-name-pattern "boundary|auto-land autonomy|notify-and-revert" test/landing-gates.test.mjs`: pass (`3` pass, `0` fail).
- `node --test test/landing-gates.test.mjs`: pass (`69` pass, `0` fail).
- `npm run typecheck`: pass.
- `npm run bandit -- validate`: pass.
- `npm test`: pass (`599` pass, `0` fail).
- `git diff --check`: pass.

## Repair Blockers

1. Boundary Prediction Record validation is under-complete. It does not reject
   missing or blank `boundary_contour_path`, `risk_classification_evidence`,
   `predicted_safety_outcome`, `operator_supervision_status`, or `rationale`
   even though these are minimum fields in the accepted brief.
2. Boundary Prediction Record validation does not validate relied-on evidence
   artifact object fields (`path`, `hash`, `freshness_state`) beyond checking
   that the array is nonempty.
3. Boundary Prediction Record validation does not ensure the record's
   `boundary_contour_version` and `boundary_contour_path` match the loaded
   contour policy.
4. Boundary Prediction Record validation does not ensure the record's
   `risk_tier` and `evidence_strength_tier` are compatible with the
   authorizing boundary cell.
5. Notify-And-Revert Artifact validation does not ensure
   `boundary_prediction_record` links to the expected valid Boundary Prediction
   Record for the same work item.
6. The timed-out MiniMax attempt did not produce `writer-report.md` or
   `implementation-evidence.md`, so the Stage 3 evidence package is incomplete.

## Required Repair

Dispatch a bounded Stage 3 repair to a non-Codex fallback writer. Keep the
repair inside:

- `src/state/boundary-autonomy.ts`
- `docs/work/BANDIT-089/writer-report.md`
- `docs/work/BANDIT-089/implementation-evidence.md`

The repair must not edit tests, RED evidence, acceptance mappings, formation
evidence, review evidence, landing evidence, UAT evidence, retrospective
evidence, roadmap/current-context/status files, intake ledger state, PRDs,
package files, lockfiles, dependencies, or unrelated source.

After repair, Codex PM should rerun focused boundary tests, full
`test/landing-gates.test.mjs`, `npm run typecheck`, `npm run bandit --
validate`, `npm test`, cockpit/session-context checks, coordination validation,
and `git diff --check` before accepting Stage 3.
