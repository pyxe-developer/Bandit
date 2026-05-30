# BANDIT-054 Implementation Evidence

## Status

Stage 3 Complete

## Production Files Changed

- `src/state/stage-capability-scope.ts` (new): policy validation logic, template validation, load-bearing skill contract check, Stage 3 writer test-surface authority enforcement, graceful-skip wrapper for validate integration, and policy stages count reader for work-item create
- `src/commands/stage-capability-scope.ts` (new): `bandit stage-capability-scope validate [--json]` command
- `src/cli.ts`: added `stage-capability-scope` command handler and updated usage string
- `src/commands/validate.ts`: added `validateStageCapabilityScopePolicy` call (graceful skip when policy not present)
- `src/commands/work-item-create.ts`: added `StageCapabilityScopeRef` type, conditional `stage_capability_scope` requirement, optional field reading, and `## Stage Capability Scope` brief rendering
- `.bandit/policy/stage-capability-scope.json` (new): empty-stages bootstrap policy (pass-only until stages are declared)
- `docs/templates/stage-capability-scope.md` (new): template with all required fields

## Verification Results

```
node --test test/stage-capability-scope.test.mjs
tests 6 / pass 6 / fail 0

node --test test/work-item-create.test.mjs
tests 8 / pass 8 / fail 0

npm run typecheck
(clean - no errors)

npm run bandit -- validate
Bandit state is valid.

git diff --check
(clean - no whitespace issues)

npm test
tests 430 / pass 430 / fail 0
```

## Acceptance Criteria Coverage

| Criterion | Status |
| --- | --- |
| Stage Capability Scope policy validates authority role, required skills, allowed tools, inputs, outputs, evidence, forbidden actions, lifecycle contract references for load-bearing skills | pass |
| Validation fails closed when required stage fields are missing | pass |
| Validation fails closed when load-bearing skill lacks lifecycle contract reference | pass |
| Stage 3 Writer capability scope cannot authorize test-surface edits | pass |
| Work-item creation refuses specs without stage_capability_scope when policy has stages | pass |
| Generated briefs render Stage Capability Scope section | pass |
| Optional soft budget band fields remain metadata only | pass - validated as string metadata, no authority granted |
| bandit validate integrates stage capability scope policy (graceful skip when absent) | pass |

## Test Ownership Boundary

The Stage 3 Writer (claude-sonnet-4-6) did not create, edit, delete, or modify any test files, test helpers, fixtures, RED evidence artifacts, or acceptance mappings for BANDIT-054. Tests in `test/stage-capability-scope.test.mjs` are Test Writer-owned and were not touched.
