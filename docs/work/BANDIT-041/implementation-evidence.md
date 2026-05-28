# BANDIT-041 Implementation Evidence

## Status

`pass`

The Layered Risk Classification Gate repair is implemented as a repo-native policy, required template, focused validator, CLI command, validate/init wiring, and auto-land-check consumption without broadening into the later Supply-Chain Gate, dependency or lockfile policy, scheduler behavior, claim/worktree authority, live routing, paid reviewer routing, external services, or cockpit UI scope.

## Implementation Summary

- Added src/state/risk-classification.ts to validate the layered risk-classification policy, required template fields, per-work-item classification evidence, never-auto-landable surfaces, high-risk blast-radius and static-analysis signals, source-trust and input-quarantine state, supply-chain state, review-depth selection, operator-supervision routing, and auto-landing eligibility.
- Added bandit risk-classification validate [--json] and wired CLI, init, validate, and path registration so the gate is CLI-owned and fresh repos receive the default policy and template.
- Added .bandit/policy/risk-classification.json and docs/templates/layered-risk-classification.md as the repo-native contract surfaces for layered risk classification.
- Updated auto-land-check to fail closed when otherwise safe-to-land work lacks layered risk-classification evidence, when classification blocks auto-landing, or when the layered classification is invalid.
- Updated landing-gate fixtures to record explicit low-risk classification evidence for auto-landing and local-record landing eligibility instead of relying on smell-list-only or implicit green state.
- Kept the repair limited to risk-classification contracts, validation, command wiring, auto-land-check consumption, and focused fixture maintenance; no supply-chain gate, dependency policy, lockfile policy, scheduler, claim/worktree, live routing, paid reviewer, external-service, or cockpit UI behavior was introduced.

## Verification

- node --test test/risk-classification.test.mjs passed with 10 tests.
- node --test test/landing-gates.test.mjs passed with 65 tests after the new auto-land evidence requirement was reflected in fixtures.
- node --test test/routing.test.mjs passed with 11 tests.
- node --test test/init.test.mjs test/risk-classification.test.mjs passed with 12 tests.
- npm run typecheck passed.
- npm test passed with 304 tests.
- npm run bandit -- risk-classification validate --json passed for the committed default policy with no active release-authorized decisions; configured-policy acceptance is covered by the focused risk-classification tests.
- npm run bandit -- input-quarantine validate --json passed.
- npm run bandit -- validate passed after Stage 3 evidence and routing updates.
- npm run bandit -- gaps list passed and shows BANDIT-GAP-LAYERED-RISK-CLASSIFICATION active as BANDIT-041.
- node ./bin/bandit.mjs cockpit status --json passed after Stage 3 evidence and routing updates; Stage 3 reports pass, Stage 4 review is missing, and CURRENT_CONTEXT/ROADMAP next-action agreement passes.
- git diff --check passed after Stage 3 evidence and routing updates.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation follows BANDIT-041 Stage 1/2 evidence by adding layered risk classification policy, template, validator, command, validate/init integration, and auto-land-check consumption only. |
| Small surface area | pass | The production diff is limited to one state validator, one command shim, CLI/init/validate/path wiring, auto-land-check integration, and the required repo-native policy/template artifacts. |
| Simple design | pass | Validation uses explicit policy fields and direct fail-closed checks rather than a generic policy engine or broader orchestration rewrite. |
| Explicit state | pass | Risk policy, template fields, release-authorized decision references, and per-work-item evidence paths are named repo artifacts; no UI, cache, or helper becomes canonical authority. |
| Failure clarity | pass | Missing policy, missing template, missing classification evidence, smell-trigger-only decisions, never-auto-landable auto-land attempts, high-risk signal under-escalation, unknown trust/quarantine states, missing supply-chain state, and unsupported review depth fail closed with direct messages. |
| Testable behavior | pass | Focused tests cover the RED failure paths and complete low-risk acceptance output; full repo tests verify shared command, validation, init, landing, and auto-land integration. |
| No hidden authority | pass | The validator accepts or rejects explicit layered risk artifacts and auto-land eligibility, but it does not implement supply-chain policy, reviewer routing policy, claim authority, scheduler authority, live model routing, or cockpit state. |
| No role erosion | pass | The implementation preserves Codex PM, Test Writer, Writer, CodeRabbit, Local Qwen, and Landing Agent stage boundaries and does not introduce a new agent role. |

## Next Action

Run Stage 4 review gates for BANDIT-041: pre-PR CodeRabbit, Local Qwen, aggregate review evidence, and Codex PM disposition at the current review subject hash before any landing verdict, landing action, retrospective closeout, next bootstrap-gap chore, or unrelated Phase 8 work.
