# BANDIT-070 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Verification Oracle Provenance Gate before production implementation. Current behavior has no verification-oracle-provenance command surface, no policy/template/validator integration for oracle provenance evidence, no circular self-attestation rejection, and land-check currently accepts a covered high-risk safe-to-land claim without current oracle provenance evidence.

## Test Command

```sh
node --test test/verification-oracle-provenance.test.mjs
```

## Observed Output

```text
Subtest: verification-oracle-provenance validate rejects covered work without strategy or disposition
not ok 1 - verification-oracle-provenance validate rejects covered work without strategy or disposition
Unknown command: verification-oracle-provenance
The input did not match the regular expression /BANDIT-970/
Subtest: verification-oracle-provenance validate rejects circular self-attestation for trusted claims
not ok 2 - verification-oracle-provenance validate rejects circular self-attestation for trusted claims
Unknown command: verification-oracle-provenance
The input did not match the regular expression /circular self-attestation/
Subtest: verification-oracle-provenance validate accepts complete independent command output evidence
not ok 3 - verification-oracle-provenance validate accepts complete independent command output evidence
Unknown command: verification-oracle-provenance
1 !== 0
Subtest: land-check fails closed when covered high-risk work lacks current oracle provenance evidence
not ok 4 - land-check fails closed when covered high-risk work lacks current oracle provenance evidence
Expected values to be strictly equal:
0 !== 1
tests 4
pass 0
fail 4
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A repo-native policy artifact or equivalent validator defines covered artifact types, covered trust claims, supported oracle types, oracle independence classes, required provenance fields, freshness requirements, and explicit no-action/bootstrap disposition rules. | test/verification-oracle-provenance.test.mjs expects bandit verification-oracle-provenance validate to reject BANDIT-970 when high-risk covered work has no oracle provenance strategy or disposition. Current CLI returns Unknown command, proving the gate surface is absent. |
| Validation rejects pass, safe-to-land, trusted, current, or ready verdicts for covered claims when the evidence lacks oracle type, oracle source, owner or authority role, independence class, freshness source, claim mapping, or command/replay reference when applicable. | test/verification-oracle-provenance.test.mjs requires complete oracle-provenance metadata for BANDIT-972, including oracle type, source, owner, independence class, freshness source, command, claim mapping, and source-drift status. Current CLI returns Unknown command, proving the parser/validator is missing. |
| Validation rejects circular self-attestation where the same projection, validator, command output, or generated report is treated as the independent oracle for its own correctness. | test/verification-oracle-provenance.test.mjs expects BANDIT-971 to fail when a session-context trusted claim relies on self_reported_or_derived evidence from its own generated oracle-provenance artifact. Current CLI returns Unknown command, proving circularity rejection is missing. |
| Validation allows self-reported or derived oracle classes only for explicitly low-risk claims or when paired with a stronger independent oracle for the trust decision being made. | The BANDIT-971 fixture uses a trusted claim and self_reported_or_derived independence class; the intended error requires independent oracle provenance for trusted claims. |
| Landing, land-check, repo validation, or trust-verifier compatibility validation consumes current oracle-provenance evidence for covered high-risk verification surfaces and fails closed when provenance is missing, stale, circular, or generic. | test/verification-oracle-provenance.test.mjs expects land-check for BANDIT-973 to fail because a high-risk covered safe-to-land claim on landing-verdict has no current oracle-provenance evidence. Current land-check exits 0, proving the landing gate accepts missing oracle provenance. |
| The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation; Stage 3 Writers cannot edit oracle-provenance tests, fixtures, RED evidence, oracle evidence, or acceptance mappings. | Codex authored test/verification-oracle-provenance.test.mjs and this RED evidence. Stage 3 must be dispatched to Claude through the bootstrap Process Adapter path and must not edit tests, test helpers, fixtures, RED evidence artifacts/specs, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence. |
| The implementation does not build the full replay regression corpus, approve Trust Verifier cutover, replace or wrap old gate paths, add blanket ceremony to trivial work, approve paid/external tooling, change product direction, alter UAT policy, change merge/push/deploy authority, or expand unrelated Phase 8 cockpit/product scope. | This Stage 2 step changes only focused tests plus RED evidence for the bounded oracle-provenance gate. It does not implement unrelated cockpit/product behavior, Trust Verifier cutover, paid/external tooling, UAT policy, merge/push/deploy authority, or replay-corpus scope. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-070 to Claude through the bootstrap Process Adapter path. Implement the narrow Verification Oracle Provenance Gate: add a repo-native policy/template/validator and CLI command, validate Stage 1 covered-surface strategy/disposition declarations, validate oracle-provenance evidence fields, reject circular self-attestation and unsupported self-reported trusted claims, make land-check fail closed for covered high-risk safe-to-land claims without current adequate oracle provenance evidence, and wire repo validation/init as needed. Keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence artifacts/specs, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, paid/external tooling, Trust Verifier cutover, product/UAT policy, merge/push/deploy authority, guarded action execution, and unrelated Phase 8 cockpit/product scope.
