# BANDIT-040 Implementation Evidence

## Status

`pass`

The Input Quarantine Gate repair is implemented as a repo-native source-class policy, configurable input-quarantine and Trusted Source Gate validator, focused CLI command, templates, and validate/init integration without broadening into layered risk classification, supply-chain policy, scheduler behavior, claim/worktree authority, live routing, paid reviewer routing, dependency or lockfile policy, external services, or cockpit UI scope.

## Implementation Summary

- Added src/state/input-quarantine.ts to validate the input quarantine policy, supported source classes, Trusted Local Repo Mode limits, data-only handling, quarantine boundary evidence paths, bounded Trusted Source Gate metadata, unknown source refusals, and instruction-bearing-use gate requirements.
- Added bandit input-quarantine validate [--json] and wired init, validate, CLI usage, and path registration so the gate is CLI-owned and fresh repos receive an empty default source-class policy until a release-authorized path is configured.
- Added .bandit/policy/input-quarantine.json plus docs/templates/input-quarantine-gate.md and docs/templates/trusted-source-gate.md as the repo-native contract surfaces for future configured paths.
- Added docs/security/input-quarantine evidence examples for review-comment and dependency-documentation boundaries plus a bounded dependency-doc Trusted Source Gate and revocation path.
- Kept the implementation limited to input quarantine contracts, validation, command wiring, templates, and focused test fixture maintenance; no later risk, supply-chain, scheduler, claim/worktree, live routing, paid reviewer, external-service, dependency, lockfile, or cockpit UI behavior was introduced.

## Verification

- node --test test/input-quarantine-gate.test.mjs passed with 10 tests.
- node --test test/validate.test.mjs passed with 20 tests.
- npm test passed with 294 tests.
- npm run typecheck passed.
- npm run bandit -- input-quarantine validate --json passed for the committed default source-class policy; configured-policy acceptance is covered by the focused input-quarantine tests.
- npm run bandit -- agent-evaluation validate --json passed.
- npm run bandit -- skill-lifecycle validate --json passed.
- npm run bandit -- validate passed.
- npm run bandit -- gaps list passed.
- node ./bin/bandit.mjs cockpit status --json passed after Stage 3 evidence and routing updates; Stage 3 reports pass and Stage 4 review is the next missing gate.
- git diff --check passed after Stage 3 evidence and routing updates.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation follows BANDIT-040 Stage 1/2 evidence by adding the input quarantine policy, templates, validator, command, and validation/init integration only. |
| Small surface area | pass | The production diff is limited to one state validator, one command shim, CLI/init/validate/path wiring, repo-native policy/template/security artifacts, and focused fixture maintenance. |
| Simple design | pass | Validation uses explicit required fields, source-class sets, and direct fail-closed checks rather than a broader policy engine or generic callback framework. |
| Explicit state | pass | Source classes, Trusted Local Repo Mode, release-authorized paths, quarantine evidence, and Trusted Source Gate metadata live in named repo artifacts; no cache, UI, or helper becomes authority. |
| Failure clarity | pass | Missing policy, missing configured-policy templates, missing source classification, non-data-only external handling, missing boundary evidence, missing Trusted Source Gate metadata, local-repo overreach, and unknown source classes fail closed with direct messages. |
| Testable behavior | pass | Focused tests cover the RED failure paths and complete bounded acceptance output; full repo tests verify shared command and validation integration. |
| No hidden authority | pass | The validator only accepts or rejects repo-native input quarantine contracts and does not decide review depth, auto-landing, routing, supply-chain policy, claim authority, scheduler authority, or cockpit state. |
| No role erosion | pass | The implementation preserves Codex PM, Test Writer, Writer, CodeRabbit, Local Qwen, and Landing Agent stage boundaries and does not introduce a new agent role. |

## Next Action

Run Stage 4 review gates for BANDIT-040: pre-PR CodeRabbit, Local Qwen, aggregate review evidence, and Codex PM disposition at the current review subject hash before any landing verdict, landing action, retrospective closeout, next bootstrap-gap chore, or unrelated Phase 8 work.
