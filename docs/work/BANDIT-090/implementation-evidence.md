# BANDIT-090 Stage 3 Implementation Evidence

contract_version: 1
work_item: BANDIT-090
stage: Stage 3 implementation
verdict: pass
written_at: 2026-06-10T05:16:00Z
pm_evidence_correction_at: 2026-06-10T05:18:54Z

## Summary

Stage 3 implementation for `BANDIT-090` - Attribution Join Key Wiring is
complete and verified. The implementation adds the repo-native Attribution
Join Key evidence surface, validation wiring, landing verdict metadata
parsing, template/init support, aggregate validation integration, and
land-check attribution gating for PRD-004 boundary-autonomy claims.

The first-priority Claude route was unavailable due provider session limit.
The first MiniMax fallback attempt timed out after partial source edits and no
Writer-owned evidence. A bounded MiniMax repair pass then completed the PM
review blockers and wrote `docs/work/BANDIT-090/writer-report.md`. Codex PM
made a narrow evidence/source correction after the repair pass to ensure the
landing verdict's `attribution_join_key` path is actually honored, the
Attribution Join Key `review_subject_hash` is compared against the Boundary
Prediction Record, and this evidence describes the full accumulated Stage 3
package rather than only the final repair files.

## Verification Result

`pass`

Codex PM independently reran verification after the repair and PM correction:

- `node --test --test-name-pattern "Attribution|attribution" test/landing-gates.test.mjs`: pass (`3` pass, `0` fail).
- `node --test test/landing-gates.test.mjs`: pass (`72` pass, `0` fail).
- `npm run typecheck`: pass.
- `npm run bandit -- validate`: pass (`Bandit state is valid.`).
- `npm test`: pass (`602` pass, `0` fail).
- `node ./bin/bandit.mjs coordination validate BANDIT-090`: pass.
- `git diff --check`: pass.

## Implementation Summary

Accumulated Stage 3 implementation changes:

| Path | Purpose |
| --- | --- |
| `docs/templates/attribution-join-key.md` | Adds the Attribution Join Key template surface. |
| `src/state/attribution-join-key.ts` | Adds Attribution Join Key parsing, field validation, supported artifact-kind checks, deterministic derived hash helper, landing attribution cross-checks, and safe work-item-local path resolution. |
| `src/state/landing-verdicts.ts` | Parses optional `attribution_join_key` landing verdict metadata. |
| `src/state/templates.ts` | Adds committed template contract checks for the Attribution Join Key template. |
| `src/commands/init.ts` | Seeds the Attribution Join Key template for initialized fixture/fresh repos. |
| `src/commands/validate.ts` | Includes Attribution Join Key artifact validation in aggregate `bandit validate`. |
| `src/commands/land-check.ts` | Requires valid Attribution Join Key evidence when `auto_land` or `notify_and_revert` boundary autonomy is claimed, and honors a landing-verdict-provided attribution path. |
| `docs/work/BANDIT-090/writer-report.md` | Records the non-Codex repair writer's report. |

Stage 2 Test Writer changes remain in `test/landing-gates.test.mjs`; the
Stage 3 Writer did not edit tests.

## Acceptance Criteria Mapping

| Acceptance criterion | Evidence |
| --- | --- |
| Attribution Join Key tuple contract exists and structured tuple remains canonical. | `docs/templates/attribution-join-key.md`; `AttributionJoinKey` type and parser in `src/state/attribution-join-key.ts`; implementation notes keep `attribution_join_hash` derived lookup data only. |
| Tuple contract supports PRD-004 field families. | Template and `AttributionJoinKey` type include actor, role/profile, model/version, profile hash, work item, review subject hash, evidence artifact hashes, touched surface, Boundary Prediction Record, authorizing boundary cell, autonomy level, purpose, and artifact state. |
| Partial tuple subsets are accepted only by artifact kind. | `validateAttributionJoinKeyFields` enforces landing-specific fields while preserving room for `model_call`, `tool_call`, and `escape` artifact kinds to carry directly knowable subsets. |
| Malformed Attribution Join Key data fails closed. | Validator rejects malformed SHA-256 evidence hashes, blank work item/actor/review-subject fields, unsupported artifact kinds, and landing artifacts missing required landing fields. Focused RED test covers malformed evidence hash. |
| Deterministic `attribution_join_hash` helper exists as derived lookup data. | `deriveAttributionJoinHash` builds a stable-field-order SHA-256 digest from the structured tuple while documenting that the tuple is canonical evidence. |
| Landing evidence that claims boundary autonomy validates associated attribution. | `land-check` invokes `gatherLandingAttributionProblems` for `auto_land` and `notify_and_revert` claims after Boundary Prediction evidence is available. |
| Boundary Prediction Record consistency is enforced. | Landing attribution cross-check compares work item, review subject hash, Boundary Prediction Record path, authorizing boundary cell, and landing autonomy level. Focused RED test covers authorizing boundary cell mismatch. |
| Ordinary safe-to-land bootstrap flows remain unblocked. | Attribution checks run only for `auto_land` or `notify_and_revert` claims; full `test/landing-gates.test.mjs` remains green. |
| Role boundaries are preserved. | `stage3-claude-attempt.md`, `stage3-minimax-attempt-timeout.md`, `stage3-pm-review.md`, `writer-report.md`, and this evidence record Claude unavailability, MiniMax fallback, PM repair boundary, no Writer test-surface edits, and no forbidden future-stage edits. |

## Clean-Code Check

| Rubric item | Status | Notes |
| --- | --- | --- |
| Spec alignment | pass | Implements only PRD-004.2 attribution wiring and does not start escape workflow, boundary movement, PRD-005, cockpit, telemetry, gateway, merge, push, deploy, or V0 trial work. |
| Small surface area | pass | Source changes are limited to attribution template/init/validation, landing verdict metadata parsing, aggregate validation, and land-check gating. |
| Simple design | pass | Attribution validation is centralized in `src/state/attribution-join-key.ts`; command integrations stay thin. |
| Explicit state | pass | Attribution path, artifact kind, work item, review subject hash, Boundary Prediction Record link, authorizing cell, autonomy level, and evidence hashes are explicit. |
| No hidden authority | pass | Attribution hash is derived lookup data only; the structured tuple remains canonical evidence. |
| Testable behavior | pass | Focused RED tests cover malformed attribution hash, missing landing attribution, and boundary-cell mismatch; full landing-gates tests pass. |
| Readable flow | pass | Validation helpers return explicit diagnostics and land-check appends those diagnostics fail-closed. |
| Failure clarity | pass | Missing, malformed, unsupported, and mismatched attribution evidence produce specific errors. |
| Role boundaries | pass | Stage 3 did not edit tests, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, retrospective evidence, PRDs, package files, lockfiles, dependencies, or unrelated product work. |

## Model-Family Separation

- Stage 2 RED author family: `codex`.
- First-priority Stage 3 route: Claude process adapter.
- Claude route status: unavailable due provider session limit; recorded in
  `docs/work/BANDIT-090/stage3-claude-attempt.md`.
- Fallback Stage 3 writer family: MiniMax via headless `pi`.
- First MiniMax attempt status: timed out after partial source edits; recorded
  in `docs/work/BANDIT-090/stage3-minimax-attempt-timeout.md`.
- MiniMax repair attempt status: completed bounded repair and evidence;
  recorded in `docs/work/BANDIT-090/writer-report.md`.
- Permanent Test Ownership Boundary: preserved. No Stage 3 Writer test-surface
  edits were made.

## Bootstrap Gaps

None. Stage 3 is ready for full pre-review verification and, if it passes, the
Stage 4 review loop.
