# BANDIT-056: Writer Report

## Stage Authorship

Stage 3 implementation for `BANDIT-056` was authored by Claude Sonnet 4.6 through the Process Adapter path, as required by Bootstrap Model-Family Separation. Stage 2 RED tests were authored by Codex PM.

## Production Files Changed

| File | Status | Description |
| --- | --- | --- |
| `src/state/evidence-freshness-slos.ts` | new | Core validation logic, EvidenceTrustSignal type, buildGateTrustSignal, validateEvidenceFreshnessSlos, validateEvidenceFreshnessSlosPolicy, evidenceFreshnessPolicyExists |
| `src/commands/evidence-freshness-slos.ts` | new | Command handler routing `evidence-freshness-slos validate [--json]` |
| `src/cli.ts` | modified | Added evidence-freshness-slos command routing and updated usage string |
| `src/state/cockpit-status.ts` | modified | Added CockpitEvidenceTrustSignals type, optional evidence_trust_signals field, buildCockpitTrustSignals function |
| `src/state/focused-session-context.ts` | modified | Added evidence_trust_signals field to FocusedSessionContextPacket, buildSessionContextTrustSignals and helpers |
| `src/commands/validate.ts` | modified | Added validateEvidenceFreshnessSlosPolicy call |
| `.bandit/policy/evidence-freshness-slos.json` | new | Production policy: 5 artifact types (tests, coderabbit_review, local_qwen_review, landing_verdict, derived_projection), 2 derived projection rules (cockpit_status, session_context) |
| `docs/templates/evidence-freshness-slos.md` | new | Required template with all 6 required fields |

## Verification Commands And Results

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
  clean

npm run bandit -- evidence-freshness-slos validate --json
  status: pass

npm run bandit -- validate
  Bandit state is valid.

npm run bandit -- gaps list
  BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS: active | active_chore

node ./bin/bandit.mjs cockpit status --json
  evidence_trust_signals present, authority: derived_non_canonical

node ./bin/bandit.mjs session-context current --json
  evidence_trust_signals present with missing implementation-evidence dependency

git diff --check
  clean
```

## Test Ownership Boundary

The Stage 3 Writer (Claude Sonnet 4.6) did not create, edit, delete, regenerate, format, or mechanically adjust:
- `test/evidence-freshness-slos.test.mjs`
- Any other test file, test helper, fixture, RED evidence artifact, or acceptance mapping for BANDIT-056

Test Ownership Boundary was fully preserved. This Stage 3 attempt is valid.

## Process Adapter Path Statement

Stage 3 was authored by Claude Sonnet 4.6 (claude-sonnet-4-6) through the Process Adapter path as required by AGENTS.md Bootstrap Model-Family Separation. Codex PM authored Stage 2 RED tests. The Stage 3 Writer had no test-edit authority.

## Stop Conditions

No stop conditions were encountered. All RED tests pass. All existing tests continue to pass. No new bootstrap gaps were identified.

## Design Notes

- `evidence_trust_signals` is optional on both `CockpitStatus` and `FocusedSessionContextPacket`; it only appears when `.bandit/policy/evidence-freshness-slos.json` exists, so existing tests without the policy are unaffected.
- Trust signal generation uses hardcoded stage-to-artifact-type mappings; the policy governs what artifact types should be governed, but cockpit/session-context has independent knowledge of stage boundaries.
- `review-subject-hash` semantics are preserved: the policy records `review_subject_hash` freshness budgets for review artifact types, and trust signal logic does not replace the existing review-subject-hash evidence paths.
- `derived_non_canonical` authority is enforced at the type level for both projection outputs.
- The validate.ts integration uses `validateEvidenceFreshnessSlosPolicy` which returns early (void) if the policy is absent, matching the token-cost-failsafe pattern.
