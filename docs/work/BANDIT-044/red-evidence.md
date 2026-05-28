# BANDIT-044 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the Operator Fail-Closed Boundary contract before production implementation. They fail because Bandit does not yet require an operator-boundary policy or template, no operator-boundary validation command exists, and validate does not yet enforce operator-boundary evidence.

## Test Command

```sh
node --test test/operator-boundary.test.mjs
```

## Observed Output

```text
tests 9
pass 0
fail 9
validate fails closed when the operator boundary policy is missing failed: expected exit code 1, received 0
validate fails closed when the operator boundary template is missing failed: expected exit code 1, received 0
operator boundary validation rejects registered decisions without evidence failed: Unknown command: operator-boundary
operator boundary validation rejects missing operator-owned gate families failed: Unknown command: operator-boundary
operator boundary validation rejects derivable drift routed to the operator failed: Unknown command: operator-boundary
operator boundary validation rejects missing mechanical repair evidence fields failed: Unknown command: operator-boundary
operator boundary validation rejects mechanical repair overreach failed: Unknown command: operator-boundary
operator boundary validation rejects missing operator-boundary smell alignment failed: Unknown command: operator-boundary
operator boundary validation accepts a complete low-risk boundary policy failed: Unknown command: operator-boundary
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| An Operator Fail-Closed Boundary template or policy artifact names Operator-Blocking Gates, Codex-Owned Technical Decisions, Operational Drift, CLI-Owned Mechanical Repair, repair-overreach refusals, operator-escalation-overuse smells, required evidence, and source artifacts. | The focused tests expect docs/templates/operator-boundary.md, .bandit/policy/operator-boundary.json, and per-work-item docs/operator-boundary/<ID>-operator-boundary.json decision evidence to become required repo-native surfaces. |
| Validation fails closed when operator-owned gate definitions omit product direction, UAT, policy, business, explicit cost/risk, irreversible operational-risk, safety-critical release authorization, or genuinely ambiguous scope boundaries. | The missing operator-owned gate families test removes business_tradeoff from operator_blocking_gates and expects the operator-boundary validator to reject the policy. |
| Validation fails closed when derivable operational drift is routed to the operator even though approved repo artifacts determine the intended state and no operator-owned gate is missing. | The derivable drift routing test records projection_mismatch with missing_operator_input false and target operator, and expects a fail-closed refusal that routes drift to Codex PM or CLI-owned mechanical repair. |
| Validation fails closed when a mechanical repair path can invent product scope, grant UAT or product approval, override policy, resolve ambiguous cost/risk, approve spend, perform irreversible operational actions, force-resolve unsafe claim recovery, break dependencies, or change merge/push/deploy authority. | The repair-overreach test records grant_uat_or_product_approval as an attempted mechanical repair capability and expects validation to reject it before the repair can proceed. |
| Validation requires mechanical repair contracts to name approved source artifacts, observed current state or report hash, expected-current-state check, exact intended repair, immutable transition or lifecycle evidence, and post-repair validation or recompute behavior. | The missing repair evidence test deletes expected_current_state_check from the mechanical repair contract and expects validation to fail closed with the complete required field list. |
| Validation confirms smell-trigger policy covers missing operator-owned input, operator escalation overuse for derivable drift, technical-question over-delegation, and mechanical repair overreach with required evidence fields and correct escalation targets. | The smell alignment test removes BANDIT-SMELL-OPERATOR-ESCALATION-OVERUSE from the operator-boundary policy and expects validation to reject the incomplete smell-trigger contract. |
| Focused tests prove operator-boundary validation rejects missing gate families, missing repair evidence fields, operator escalation for derivable drift, and repair overreach, and accepts a complete low-risk operator-boundary policy. | test/operator-boundary.test.mjs covers missing policy, missing template, missing evidence, missing gate family, derivable drift routed to operator, missing repair fields, repair overreach, smell alignment, and complete low-risk acceptance output. |
| The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied. | This RED step adds only focused tests, a Stage 2 red-evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation, review evidence, landing evidence, retrospective, next-gap work, live routing, paid reviewer route, dependency or lockfile change, scheduler, claim/worktree authority, external service integration, installed global skill edit, or cockpit UI surface. |

## Next Action

Implement the narrow Operator Fail-Closed Boundary repair: add the repo-native operator-boundary template and policy, per-work-item operator-boundary evidence parsing, operator-boundary validate --json command wiring, validate integration, smell-trigger alignment checks, mechanical-repair evidence checks, operator-escalation overuse refusal, repair-overreach refusal, and focused acceptance behavior needed to make the RED tests pass without broadening into Work Intake Ledger, Operator Inbox, Repo PM Coordinator, claimability reports, CAS claim operations, claim leases, fencing tokens, idempotency-key enforcement, work-surface reservations, Git Mutation Serializer behavior, worktree lifecycle, scheduler execution, event-driven wakeups, local server/API mode, cockpit UI work, PR/CI execution, automatic merge/push/deploy behavior, paid routing, live routing changes, installed global skill edits, external service integration, product UAT approval, or another bootstrap-gap chore.
