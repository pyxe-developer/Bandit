# BANDIT-069 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Test Strength / Mutation Adequacy Gate before production implementation. Current behavior has no test-strength-gate command surface, no policy/template/validator integration for test-strength evidence, no Stage 2 assertion-adequacy validation, and land-check currently accepts a covered high-risk surface without current test-strength evidence.

## Test Command

```sh
node --test test/test-strength-gate.test.mjs
```

## Observed Output

```text
Subtest: test-strength-gate validate rejects covered surfaces without a strategy or disposition
not ok 1 - test-strength-gate validate rejects covered surfaces without a strategy or disposition
Unknown command: test-strength-gate
The input did not match the regular expression /BANDIT-950/
Subtest: test-strength-gate validate accepts mutation evidence with required adequacy fields
not ok 2 - test-strength-gate validate accepts mutation evidence with required adequacy fields
Unknown command: test-strength-gate
1 !== 0
Subtest: test-strength-gate validate rejects Stage 2 RED evidence without intended failure and assertion adequacy
not ok 3 - test-strength-gate validate rejects Stage 2 RED evidence without intended failure and assertion adequacy
Unknown command: test-strength-gate
The input did not match the regular expression /RED evidence missing intended_failure_reason/
Subtest: land-check fails closed when a covered high-risk surface lacks current test-strength evidence
not ok 4 - land-check fails closed when a covered high-risk surface lacks current test-strength evidence
Expected values to be strictly equal:
0 !== 1
tests 4
pass 0
fail 4
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A repo-native policy artifact or equivalent validator defines covered risk tiers, covered trust-layer surfaces, acceptable evidence modes, required fields for mutation evidence, required fields for property/fault-injection evidence, required fields for table-driven adversarial evidence, and explicit no-action/bootstrap-gap disposition rules. | test/test-strength-gate.test.mjs expects bandit test-strength-gate validate to reject BANDIT-950 when a high-risk covered surface has no test-strength strategy or explicit disposition. Current CLI returns Unknown command, proving the gate surface is absent. |
| Mutation evidence, when selected, records the target surface, command or runner, score or equivalent result, threshold/disposition rule, surviving mutant disposition, excluded mutant rationale, and freshness source. | test/test-strength-gate.test.mjs expects BANDIT-951 with complete mutation evidence fields to pass test-strength-gate validate. Current CLI returns Unknown command, proving the parser/validator is missing. |
| Stage 2 RED evidence validation requires intended-failure evidence and assertion-adequacy mapping for covered surfaces: the evidence must identify why the RED failed and which plausible wrong implementations the assertions would reject. | test/test-strength-gate.test.mjs expects BANDIT-952 to fail with missing intended_failure_reason and assertion_adequacy_mapping diagnostics. Current CLI returns Unknown command, proving the Stage 2 evidence validator is missing. |
| Landing, land-check, or repo validation consumes current test-strength evidence for covered high-risk surfaces and fails closed when evidence is missing, stale, inadequate, or silently replaced by generic coverage claims. | test/test-strength-gate.test.mjs expects land-check for BANDIT-953 to fail because the high-risk covered landing-gate surface has no current test-strength evidence. Current land-check exits 0, proving the landing gate accepts missing test-strength evidence. |
| Property-style or fault-injection evidence, when selected, records invariants, generated or enumerated state space, injected failures, replay determinism, and the wrong-behavior classes rejected. | The RED test file reserves the test-strength-gate validator as the shared parser surface for evidence modes; Stage 3 must implement property/fault-injection mode validation alongside mutation and table-driven adversarial validation. |
| Table-driven adversarial evidence, when selected, records the adversarial cases, the plausible wrong implementation each case targets, and why the cases are sufficient for the selected risk tier. | The BANDIT-952 fixture uses table_driven_adversarial as its declared strategy and requires assertion adequacy diagnostics, establishing the table-driven mode as a first-class Stage 2 validation target. |
| The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation; Stage 3 Writers cannot edit test-strength evidence or other Test Writer-owned surfaces. | Codex authored test/test-strength-gate.test.mjs and this RED evidence. Stage 3 must be dispatched to Claude through the bootstrap Process Adapter path and must not edit tests, test helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, adversarial-case mappings, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence. |
| The implementation does not add a blanket coverage mandate, require mutation testing everywhere, treat mutation score as the only acceptable evidence mode, approve paid/external mutation tooling, change UAT policy, approve Trust Verifier cutover, change merge/push/deploy authority, or expand unrelated Phase 8 cockpit/product scope. | This Stage 2 step changes only focused tests plus RED evidence for the bounded test-strength gate. It does not implement unrelated cockpit/product behavior, Trust Verifier cutover, paid/external tooling, UAT policy, merge/push/deploy authority, or universal coverage requirements. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-069 to Claude through the bootstrap Process Adapter path. Implement the narrow Test Strength / Mutation Adequacy Gate: add a repo-native test-strength policy/template/validator and CLI command, validate Stage 1 covered-surface strategy/disposition declarations, validate Stage 2 intended-failure and assertion-adequacy evidence, validate mutation/property-fault-injection/table-driven evidence fields, and make land-check fail closed for covered high-risk surfaces without current adequate test-strength evidence. Keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence artifacts/specs, mutation evidence, assertion-adequacy mappings, adversarial-case mappings, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, paid/external tooling, Trust Verifier cutover, product/UAT policy, merge/push/deploy authority, guarded action execution, and unrelated Phase 8 cockpit/product scope.
