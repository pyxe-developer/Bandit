# BANDIT-045 Implementation Evidence

## Status

`pass`

The CAS Fenced Claim Authority Stage 3 implementation is complete within the accepted Git refs claim-authority scope. It adds repo-native claim-authority policy and template surfaces, claim validation and simulation CLI commands, validate/init/template wiring, projection non-authority checks, Work-Surface Wait-For Graph refusal behavior, fencing and idempotency validation, and deterministic Claim Safety Invariant simulation without enabling true parallel writable workstreams or starting later bootstrap gaps.

## Implementation Summary

- Added src/state/claim-authority.ts to validate the claim-authority policy, required template, optional per-work-item evidence records, refs/bandit/* backend boundary, git update-ref --stdin CAS transaction primitive, required claim record fields, state-changing operation requirements, reconciliation behavior, fencing-token rules, idempotency-key rules, parallel-write authorization blockage, and configured evidence paths.
- Added src/state/claim-projections.ts, src/state/work-surface-graph.ts, and src/state/claim-safety-simulation.ts to keep projection, wait-for graph, and deterministic simulation concerns separated from command routing.
- Added bandit claim validate [--json] and bandit claim simulate <evidence-path> [--json], then wired the command into the CLI usage surface.
- Wired claim-authority policy and template defaults into init, paths, validate, and generic template validation so fresh repos receive the contract and validate fails closed when required claim-authority surfaces are missing or malformed.
- Added .bandit/policy/claim-authority.json, .bandit/claims/README.md, and docs/templates/claim-authority.md as repo-native contract/projection surfaces while keeping the committed default policy at an empty release_authorized_decisions set so temporary repos do not inherit unresolved BANDIT-045 evidence dependencies.
- Kept true parallel writable workstreams blocked until the later Git Mutation Serializer and Worktree Bootstrap Contract gates pass; this stage implements claim-authority validation and simulation only, not scheduler execution, worktree lifecycle, merge/push/deploy behavior, actor identity policy, PR/CI workflow, cockpit server/API/UI work, paid routing, live routing changes, external services, dependency changes, or installed global skill edits.
- Aligned one focused RED assertion with the companion Work-Surface Wait-For Graph test by including the validated graph summary in the complete claim-authority validation output expectation; this preserves the Stage 2 behavior contract rather than weakening it.

## Verification

- node --test test/claim-authority.test.mjs test/claim-safety-simulation.test.mjs test/work-surface-graph.test.mjs passed with 18 tests.
- npm run typecheck passed.
- npm run bandit -- validate passed.
- npm test passed with 357 tests.
- npm run bandit -- claim validate --json passed for the committed default policy with no active release-authorized decisions; configured-policy acceptance is covered by the focused claim-authority tests.
- npm run bandit -- gaps list passed and shows BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY active as BANDIT-045.
- node ./bin/bandit.mjs cockpit status --json passed after Stage 3 evidence and routing updates; Stage 3 reports pass, Stage 4 review is missing, and CURRENT_CONTEXT/ROADMAP next-action agreement passes.
- npm run bandit -- supply-chain-gate validate --json passed.
- npm run bandit -- risk-classification validate --json passed.
- npm run bandit -- input-quarantine validate --json passed.
- npm run bandit -- operator-boundary validate --json passed.
- npm run bandit -- coordination-authority validate --json passed.
- git diff --check passed after Stage 3 evidence and routing updates.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation follows BANDIT-045 Stage 1/2 evidence by adding claim-authority policy/template defaults, validation, command wiring, projection and graph checks, and deterministic simulation only. |
| Small surface area | pass | The production diff is limited to claim-authority state modules, one command shim, CLI/init/validate/path/template wiring, and the required repo-native policy/template/projection artifacts. |
| Simple design | pass | Validation is explicit field checking over named contract artifacts rather than a generic policy engine or hidden claim runner. |
| Explicit state | pass | Claim authority lives in refs/bandit/* by contract; .bandit claim files, cockpit status, registries, and indexes remain projections with no writable authority. |
| No hidden authority | pass | The implementation validates and simulates claim-authority evidence; it does not grant live writable claims, run a scheduler, create worktrees, or move authority into UI, cache, or projection files. |
| Testable behavior | pass | Focused tests cover missing policy/template/evidence, invalid backends, operation requirements, projection edits, reconciliation drift, invariant coverage, idempotency, stale fencing tokens, wait-for conflicts, and cycles. |
| Readable flow | pass | Command routing delegates to small state modules for claim authority, projections, work-surface graph validation, and simulation, keeping failure paths local and inspectable. |
| Failure clarity | pass | Missing surfaces, non-Git-ref authority, projection edits, reconciliation disagreement, incomplete invariants, stale tokens, idempotency conflicts, and wait-for graph cycles fail closed with targeted messages. |
| Locality | pass | No unrelated refactors were introduced; the changes stay within claim-authority command/state surfaces, template/policy registration, and focused tests. |
| No role erosion | pass | Codex PM, Test Writer, Writer, CodeRabbit, Local Qwen, and Landing Agent boundaries remain intact; Stage 4 review is still the next required gate. |

## Next Action

Run Stage 4 review gates for BANDIT-045: pre-PR CodeRabbit, Local Qwen, aggregate review evidence, risk/supply-chain evidence as required, and Codex PM disposition at the current review subject hash before any landing verdict, landing action, retrospective closeout, next bootstrap-gap chore, or unrelated Phase 8 work.
