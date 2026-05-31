# BANDIT-056: Implementation Evidence

## Status

Stage 3 Complete

## Summary

Evidence Freshness SLO validation surface and projection trust-signal output implemented. All 7 RED tests pass. Full test suite passes (456/456).

## Production Files Changed

- `src/state/evidence-freshness-slos.ts` (new): Core validation logic, EvidenceTrustSignal types, buildGateTrustSignal helper, validateEvidenceFreshnessSlos, validateEvidenceFreshnessSlosPolicy, evidenceFreshnessPolicyExists
- `src/commands/evidence-freshness-slos.ts` (new): Command handler for `bandit evidence-freshness-slos validate [--json]`
- `src/cli.ts` (modified): Added `evidence-freshness-slos` command routing and updated usage string
- `src/state/cockpit-status.ts` (modified): Added CockpitEvidenceTrustSignals type and optional evidence_trust_signals field; added buildCockpitTrustSignals function; imports shared Evidence Freshness SLO helpers
- `src/state/focused-session-context.ts` (modified): Added optional evidence_trust_signals field to FocusedSessionContextPacket; added buildSessionContextTrustSignals and parseStageNumber helpers; imports shared Evidence Freshness SLO helpers
- `src/commands/validate.ts` (modified): Added validateEvidenceFreshnessSlosPolicy call
- `.bandit/policy/evidence-freshness-slos.json` (new): Production policy with 5 artifact types and 2 derived projection rules
- `docs/templates/evidence-freshness-slos.md` (new): Required template with all 6 required fields

## Acceptance Criteria Coverage

| Criterion | Evidence |
| --- | --- |
| `evidence-freshness-slos validate --json` command exists and accepts a complete SLO policy | `npm run bandit -- evidence-freshness-slos validate --json` returns status pass with correct artifact_types and derived_projections |
| Validation rejects trusted evidence without source or owner | Test 2 passes: error message matches required pattern |
| Validation rejects missing freshness states | Test 3 passes: error message matches required pattern |
| Validation rejects missing staleness reasons | Test 4 passes: error message matches required pattern |
| Validation rejects derived projections that hide stale dependencies | Test 5 passes: error message matches required pattern |
| Cockpit status exposes evidence_trust_signals with derived_non_canonical authority | Test 6 passes: gates.stage_2_red_evidence has correct structure |
| Session-context exposes missing evidence as trust-signal dependencies | Test 7 passes: dependencies array with one missing red-evidence entry |
| review-subject-hash semantics preserved | Policy defines coderabbit_review and local_qwen_review with review_subject_hash freshness budgets; cockpit/session-context trust signals compose with but do not replace review-subject-hash |
| CLI authority and repo-native artifacts as canonical state | evidence_trust_signals has authority: derived_non_canonical; policy specifies cannot_upgrade_missing_dependency_to_trusted: true |

## Verification Results

```
node --test test/evidence-freshness-slos.test.mjs
tests 7, pass 7, fail 0

node --test test/cockpit-status.test.mjs
tests 13, pass 13, fail 0

node --test test/focused-session-context.test.mjs
tests 9, pass 9, fail 0

npm test
tests 456, pass 456, fail 0

npm run typecheck
clean (no errors)

npm run bandit -- evidence-freshness-slos validate --json
status: pass

npm run bandit -- validate
Bandit state is valid.

npm run bandit -- gaps list
BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS: active | active_chore

node ./bin/bandit.mjs cockpit status --json
evidence_trust_signals present with derived_non_canonical authority

node ./bin/bandit.mjs session-context current --json
evidence_trust_signals present with missing implementation-evidence dependency

git diff --check
clean
```

## Test Ownership Boundary

The Stage 3 Writer (Claude Sonnet 4.6) did not edit `test/evidence-freshness-slos.test.mjs` or any other test file, test helper, fixture, RED evidence artifact, or acceptance mapping for BANDIT-056.

## Bootstrap Model-Family Separation

Stage 2 RED tests were authored by Codex PM (Codex model family). Stage 3 implementation was authored by Claude through the Process Adapter path as required by AGENTS.md Bootstrap Model-Family Separation.

## Bootstrap Gaps

No new bootstrap gaps were identified during Stage 3 implementation.
