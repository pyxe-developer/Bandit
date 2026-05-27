# BANDIT-038 Implementation Evidence

## Status

`pass`

The Skill Lifecycle Contract repair is implemented as a repo-native template, policy artifact, validator, and focused CLI command without making installed global skill files canonical Bandit state.

## Implementation Summary

- Added docs/templates/skill-lifecycle-contract.md and .bandit/policy/skill-lifecycle-contracts.json as the canonical repo surfaces for load-bearing skill lifecycle contracts.
- Added docs/evaluation/skills/bandit-cold-start.md and docs/evaluation/skills/bandit-installed-skill-drift.md so the Bandit skill contract has repo-addressable evaluation and drift evidence.
- Added src/state/skill-lifecycle-contracts.ts to validate required lifecycle fields, stage-scoped bindings, repo-addressable evaluation packets, and installed-skill drift evidence.
- Added bandit skill-lifecycle validate [--json] and wired bandit validate/init to require the lifecycle policy and template while keeping fresh init repos valid with an empty policy envelope.
- Updated affected test fixtures so temp repos that copy committed lifecycle policy also copy its evaluation evidence, preserving existing validator failure-order coverage.

## Verification

- node --test test/skill-lifecycle-contracts.test.mjs passed with 6 tests.
- node --test test/validate.test.mjs passed with 20 tests.
- node --test test/artifact-create.test.mjs test/bootstrap-gaps.test.mjs test/draft-work.test.mjs test/landing-gates.test.mjs test/routing.test.mjs test/work-item-create.test.mjs passed with 117 tests.
- npm test passed with 274 tests.
- npm run typecheck passed.
- npm run bandit -- skill-lifecycle validate --json passed for the committed Bandit skill contract.
- npm run bandit -- validate passed.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation follows BANDIT-038 Stage 1/2 evidence by adding the lifecycle template, policy, validator, CLI command, and fail-closed validation paths only. |
| Small surface area | pass | The production diff is limited to the skill lifecycle state validator, one command shim, validate/init wiring, path registration, template registration, and the new repo-native contract artifacts. |
| Explicit state | pass | The lifecycle contract, evaluation packet, and drift evidence live in named repo artifacts; installed global skill files remain external evidence, not canonical state. |
| Failure clarity | pass | Missing policy/template surfaces, missing owners, non-stage-scoped bindings, missing evaluation packets, and missing drift evidence fail closed with direct messages. |
| Testable behavior | pass | Focused lifecycle tests cover missing policy, missing template, malformed contracts, missing evaluation packets, and the complete valid contract JSON report. |
| No role erosion | pass | Stage bindings require stage_scoped_capability and reject new agent-role authority inside skill contracts. |

## Next Action

Run Stage 4 review gates for BANDIT-038: pre-PR CodeRabbit, Local Qwen, aggregate review evidence, and Codex PM disposition at the current review subject hash before any landing, retrospective, next bootstrap-gap chore, or unrelated Phase 8 work.
