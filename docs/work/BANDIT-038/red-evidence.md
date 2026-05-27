# BANDIT-038 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the Skill Lifecycle Contract before production implementation. They fail because Bandit does not yet require the skill lifecycle policy or template during validation, and the skill-lifecycle validation command does not exist.

## Test Command

```sh
node --test test/skill-lifecycle-contracts.test.mjs
```

## Observed Output

```text
tests 6
pass 0
fail 6
validate fails closed when the skill lifecycle policy is missing failed: expected exit code 1, received 0
validate fails closed when the skill lifecycle template is missing failed: expected exit code 1, received 0
skill lifecycle validation rejects contracts without an owner failed: Unknown command: skill-lifecycle
skill lifecycle validation rejects stage bindings that imply new agent authority failed: Unknown command: skill-lifecycle
skill lifecycle validation rejects missing evaluation packets failed: Unknown command: skill-lifecycle
skill lifecycle validation accepts a complete contract with drift evidence failed: expected exit code 0, received 1
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A Skill Lifecycle Contract template or policy artifact names required fields for skill identity, owner, version, changelog, intended stages, required tools, forbidden actions, evaluation packets, and rollback criteria. | The new validation integration tests expect docs/templates/skill-lifecycle-contract.md and .bandit/policy/skill-lifecycle-contracts.json to be required repo-native surfaces; current validate exits 0 when either surface is missing. |
| Validation fails closed for load-bearing skill contracts that omit owner, version, changelog, intended stages, required tools, forbidden actions, evaluation packets, or rollback criteria. | The missing-owner test supplies a load-bearing bandit contract without owner and expects a fail-closed lifecycle validation message; the current CLI has no skill-lifecycle command. |
| Validation fails closed for malformed stage bindings or contracts that imply new agent authority rather than stage-scoped capability. | The malformed-stage-binding test uses authority new_agent_role and expects refusal unless the binding is stage_scoped_capability; the current CLI has no lifecycle validator. |
| Validation fails closed when evaluation packet references are missing, empty, or not repo-addressable. | The missing-evaluation-packet test references docs/evaluation/skills/bandit-cold-start.md without writing it and expects refusal before trusted policy use; the current CLI has no lifecycle validator. |
| Installed-skill drift evidence is defined so future stages can detect unreviewed changes between the repo contract and installed skill artifact before treating the skill as required policy. | The complete-contract test requires installed_skill_drift evidence pointing at docs/evaluation/skills/bandit-installed-skill-drift.md with a stable sha256 boundary before the skill is accepted. |
| Focused tests prove invalid lifecycle contracts are rejected before writes or trusted status, and prove a complete contract is accepted. | The focused test file covers missing policy, missing template, missing owner, malformed stage authority, missing evaluation packet, and a complete valid contract with expected JSON output. |
| The implementation does not implement the later Agent Evaluation Harness, Stage Capability Scope, provider-pricing, paid reviewer promotion, supply-chain gate, worktree, scheduler, claim authority, or cockpit UI gaps. | This RED step adds only focused tests, the Stage 2 evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation or broader workflow surface. |

## Next Action

Implement the narrow Skill Lifecycle Contract repair: add the repo-native template and .bandit policy surface, validate required lifecycle fields, stage-scoped bindings, evaluation packet paths, and installed-skill drift evidence, expose a focused skill-lifecycle validate --json command, wire validation into bandit validate/init as needed, and make the focused RED tests pass without broadening into agent evaluation harness, stage capability scope, supply-chain, worktree, scheduler, claim authority, paid reviewer, live routing, or cockpit UI work.
