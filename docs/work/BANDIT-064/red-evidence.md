# RED Evidence - BANDIT-064

contract_version: 1
work_item: BANDIT-064
stage: stage2_red_evidence
owner: test_writer
verdict: pass
red_status: failing_as_expected
recorded_at: 2026-06-07T14:14:52Z

## Scope

Focused Test Writer-owned RED coverage defines the Trust Verifier Cutover Gate
contract before implementation. The tests prove the current repo lacks an
explicit cutover-gate command and validator for future per-Trust-Goal cutover
proposals.

This RED evidence does not approve Trust Verifier cutover, select a Trust Goal
for cutover, replace or wrap old gate paths, dispatch implementation, or change
old gate execution semantics.

## Test Surface

Test file:

- `test/trust-verifier-cutover-gate.test.mjs`

Focused behaviors:

- `bandit trust cutover-gates validate --json` accepts an explicit
  no-cutover-approved compatibility-period policy and reports no approved Trust
  Goals.
- `bandit trust cutover-gates validate --json` fails closed for incomplete
  future cutover proposals that omit required contract fields.
- `bandit trust cutover-gates validate` rejects implicit canonical or wrapper
  claims when operator-approved cutover evidence is absent.

## RED Command

```sh
node --test test/trust-verifier-cutover-gate.test.mjs
```

## RED Result

The focused test command failed as expected:

```text
not ok 1 - trust cutover gate validation records current no-cutover-approved state
error: Usage: bandit trust verify <snapshot.json> [--json] [--report <path>]

not ok 2 - trust cutover gate validation fails closed for incomplete future cutover proposals
error: The input did not match the regular expression /missing proposed_trust_verifier/.
Input: 'Usage: bandit trust verify <snapshot.json> [--json] [--report <path>]'

not ok 3 - trust cutover gate validation rejects implicit canonical or wrapper claims
error: The input did not match the regular expression /implicit cutover claim.*landing/.
Input: 'Usage: bandit trust verify <snapshot.json> [--json] [--report <path>]'
```

## Acceptance Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Focused RED evidence proves the repo currently lacks an explicit Trust Verifier Cutover Gate contract or validator. | The focused test command calls `bandit trust cutover-gates validate`; current CLI only supports `bandit trust verify`, so all tests fail on missing command routing. |
| A repo-native gate policy records no approved cutover status and old gates remain authoritative. | The first test writes a policy with `compatibility_period: true`, `old_gates_authoritative: true`, `approved_trust_goals: []`, and expects a passing JSON report. Current code cannot validate it. |
| The gate contract requires old gate path, proposed trust-verifier path, parity evidence, stricter-failure behavior, report format, rollback/fallback, evidence freshness, reviewer routing, and operator approval status. | The second test writes an incomplete proposed cutover and expects fail-closed diagnostics for missing required fields. Current code cannot inspect the policy. |
| Validation rejects implicit canonical or wrapper claims without separate operator-approved cutover evidence. | The third test writes a `status: canonical` / `wrapper_behavior: replace_old_gate` claim with missing operator approval and expects fail-closed diagnostics. Current code cannot inspect the policy. |
| Existing authoritative gate commands keep current behavior. | RED tests target only a new read-only validator command and do not invoke or mutate existing gate commands. |

## Role Boundary Evidence

- Test Writer owns this test surface, RED evidence, fixtures, and acceptance
  mapping.
- Because Codex authored the RED tests, Stage 3 implementation must be routed to
  Claude / a different model family through the bootstrap Process Adapter path.
- Stage 3 Writer has zero authority to edit `test/trust-verifier-cutover-gate.test.mjs`,
  this RED evidence, test helpers, fixtures, or acceptance mappings.

## Next Action

Dispatch Stage 3 implementation for `BANDIT-064` to Claude through the bootstrap
Process Adapter path. Implement the smallest green path: add the repo-native
cutover-gate policy artifact, add a read-only validator, expose
`bandit trust cutover-gates validate [--json]`, include the policy in repo
validation, and preserve compatibility-period old-gate authority.
