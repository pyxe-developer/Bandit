# BANDIT-054 Writer Report

## Summary of Production Files Changed

- **`src/state/stage-capability-scope.ts`** (new): Core validation state module. Implements `validateStageCapabilityScope` (strict, for the dedicated command), `validateStageCapabilityScopePolicy` (graceful skip if policy absent, for `bandit validate` integration), and `readStageCapabilityScopePolicyStagesCount` (returns 0 if policy absent or has no stages, used by work-item create for conditional requirement).

- **`src/commands/stage-capability-scope.ts`** (new): `bandit stage-capability-scope validate [--json]` command. Routes to the strict validator and returns JSON output on success or propagates errors to stderr.

- **`src/cli.ts`**: Added `stage-capability-scope` import and command handler. Updated usage string.

- **`src/commands/validate.ts`**: Added `validateStageCapabilityScopePolicy` call after `validateSkillLifecycleContracts`. The graceful-skip wrapper ensures `bandit validate` passes for repos where the policy has not yet been bootstrapped (e.g., fresh init repos in validate tests).

- **`src/commands/work-item-create.ts`**: Added `StageCapabilityScopeRef` type to carry stage capability scope data through the spec. Added `requireStageCapabilityScopeIfPolicyHasStages` async check that reads the policy stages count and throws `"Work item spec missing required field: stage_capability_scope"` when the policy has at least one stage and the spec omits the field. Added `readOptionalStageCapabilityScope` to parse the optional field from raw specs. Added `renderStageCapabilityScope` for the `## Stage Capability Scope` brief section.

- **`.bandit/policy/stage-capability-scope.json`** (new): Bootstrap policy with empty stages. Empty stages ensures the work-item create requirement is inactive until stages are declared, which lets existing work-item-create tests (whose specs do not include `stage_capability_scope`) continue to pass.

- **`docs/templates/stage-capability-scope.md`** (new): Template with required fields: work_item, policy, stage_id, authority_role, required_skills, allowed_tools, inputs, outputs, evidence, forbidden_actions, skill_lifecycle_contracts, soft_budget_bands, source_artifacts.

## Verification Commands and Results

```
node --test test/stage-capability-scope.test.mjs
  tests 6 / pass 6 / fail 0

node --test test/work-item-create.test.mjs
  tests 8 / pass 8 / fail 0

npm run typecheck
  (clean)

npm run bandit -- validate
  Bandit state is valid.

git diff --check
  (clean)

npm test
  tests 430 / pass 430 / fail 0
```

## Test Ownership Boundary

The Stage 3 Writer (claude-sonnet-4-6) did not create, edit, delete, regenerate, format, or mechanically adjust any test files, test helpers, fixtures, RED evidence artifacts, or acceptance mappings for BANDIT-054. The test file `test/stage-capability-scope.test.mjs` is exclusively Test Writer-owned and was not touched during Stage 3. `test/work-item-create.test.mjs` was not touched.

## Stage 3 Authorship

Stage 3 was authored by Claude Sonnet 4.6 (claude-sonnet-4-6) through the bootstrap Process Adapter path, consistent with the Bootstrap Model-Family Separation rule: Codex PM authored Stage 2 RED tests; Claude authored Stage 3 implementation.

## Design Notes

**Conditional `stage_capability_scope` requirement**: The work-item create check is conditional on the committed policy having at least one stage declaration. This preserves backward compatibility: existing work-item create tests use specs without `stage_capability_scope`, and the committed policy has empty stages. Once the policy receives real stage declarations, the field becomes required for all new specs.

**Graceful skip in `bandit validate`**: `validateStageCapabilityScopePolicy` skips when the policy file is absent. This ensures `bandit validate` passes on repos where the policy has not been created (e.g., fresh `bandit init` without copying the committed policy).

**`forbidden_actions` in validation output**: Reports the forbidden_actions from the writer stage (authority_role === "writer") specifically, since that boundary is the primary safety concern for Stage 3 test-surface authority enforcement.

## Stop Conditions, Bootstrap Gaps, Follow-up Concerns

- The committed `.bandit/policy/stage-capability-scope.json` has empty stages. The real project stage declarations (stage2_red_evidence through stage6_retrospective) should be added to this policy as a follow-up once the bootstrap hardens further.
- `src/commands/init.ts` and `src/state/paths.ts` were not in the editable paths and were not modified. When `bandit init` is eventually updated to create the stage-capability-scope policy, the `stageCapabilityScopePolicy` path could be added to `getBanditPaths`.
- No token-cost failsafe policy, provider-pricing evidence, spend-class approval, Evidence SLO policy, full scheduler execution, or other forbidden scope was introduced.
