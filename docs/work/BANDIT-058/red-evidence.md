# BANDIT-058 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Role Contracts and Role Run Manifest validation surface before implementation. The suites fail because Bandit currently has no `role-contracts` command, no `role-runs` command, and no CLI-owned validation path for role identity, authority boundary, version, stage compatibility, write surfaces, forbidden actions, source artifacts, base revision, required input packet, required summary path, validation commands, or append-only manifest authority.

## Test Command

```sh
node --test test/role-contracts.test.mjs
node --test test/role-run-manifests.test.mjs
```

## Observed Output

```text
node --test test/role-contracts.test.mjs: tests 4, pass 0, fail 4
role-contracts complete-policy test failed because `bandit role-contracts validate --json` returns `Unknown command: role-contracts` instead of a pass payload.
role-contracts missing-authority, Stage 3 test-surface authority, and canonical-state authority tests failed before expected fail-closed diagnostics because `role-contracts` is not registered.
node --test test/role-run-manifests.test.mjs: tests 6, pass 0, fail 6
role-runs complete-manifest test failed because `bandit role-runs validate BANDIT-058 --json` returns `Unknown command: role-runs` instead of a pass payload.
role-runs role/stage mismatch, stale contract version, missing source/base revision, forbidden target-file, and canonical-state authority tests failed before expected fail-closed diagnostics because `role-runs` is not registered.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves Bandit currently lacks enforced Role Contract policy validation and Role Run Manifest validation for required role identity, authority, version, stage, base revision, write-surface, forbidden action, input, output summary, and validation command fields. | `test/role-contracts.test.mjs` and `test/role-run-manifests.test.mjs` use public CLI commands and fail 10/10 before any production implementation is added because the command surfaces are missing. |
| Role Contract validation fails closed when a contract omits authority boundary, allowed stages, required input, allowed write-surface families, forbidden actions, required output summary, validation commands, owner, version, or rollback/supersession rule. | `role-contracts validation rejects missing authority fields` removes `authority_boundary` and `owner` from the Test Writer contract and expects a fail-closed diagnostic naming the required contract fields. |
| Role Contract validation preserves the Permanent Test Ownership Boundary and does not grant Stage 3 Writer test-surface authority. | `role-contracts validation rejects Stage 3 test-surface authority` gives `implementation_writer` a test surface and removes one test-edit prohibition; it expects validation to reject tests, test helpers, fixtures, RED evidence, and acceptance mappings as Stage 3 write surfaces. |
| Role contracts and manifests remain repo-native evidence and cannot replace coordination history, review evidence, landing evidence, UAT, or retrospective evidence. | `role-contracts validation rejects role authority over canonical workflow state` mutates the policy authority boundary so manifests can satisfy coordination history and expects validation to reject hidden workflow authority. |
| Role Run Manifest validation fails closed when a manifest omits work item ID, stage, role contract ID and version, capability profile or subagent identity, base revision, target files, forbidden file patterns, required input packet reference, required summary path, validation commands, or source artifacts. | `role-runs validation accepts complete append-only run manifests` defines the complete required public manifest shape; the missing-source/base-revision test expects validation to reject empty `base_revision` and a non-existent source artifact. |
| Role Run Manifest validation rejects role/stage mismatches and missing or stale role contract references. | `role-runs validation rejects role and stage mismatches` points a Stage 3 manifest at `reviewer`; `role-runs validation rejects stale contract versions` references `implementation_writer@2.0.0` while the policy contains version `1.0.0`. |
| Role Run Manifest validation rejects target files outside the role contract and forbidden action conflicts. | `role-runs validation rejects forbidden or out-of-surface target files` adds `test/role-contracts.test.mjs` to an Implementation Writer manifest and expects validation to reject the target because tests are outside that role's write surfaces and match forbidden patterns. |
| The implementation keeps role contracts and manifests as repo-native evidence and does not let generated views, caches, cockpit state, trace output, or manifest projections become workflow authority. | `role-runs validation rejects manifest authority over canonical state` sets `can_satisfy_coordination_history` on the manifest authority boundary and expects validation to reject manifest authority over coordination, review, landing, UAT, or retrospective evidence. |
| The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings. | This RED evidence, `test/role-contracts.test.mjs`, `test/role-run-manifests.test.mjs`, and the acceptance mapping are Codex PM/Test Writer-authored. Stage 3 must run through Claude via the bootstrap Process Adapter path, and the Stage 3 Writer has zero authority to edit the tests, test helpers, fixtures, RED evidence artifacts/specs, or acceptance mappings for `BANDIT-058`. |
| No execution packet system, role input packet generator, diff-based write validation, same-agent repair continuation, landing/closeout packet system, scheduler, worktree lifecycle, claim lease, work-surface reservation, automatic merge/push/deploy, product UAT approval, dependency or lockfile change, local server/API mode, installed global skill edit, external service integration, full rubric migration, or unrelated Phase 8 cockpit feature work is introduced. | This Stage 2 step adds only focused Test Writer-owned RED tests and RED evidence artifacts. It does not add production implementation, execution packets, generated input packets, scheduler or worktree lifecycle behavior, claim leases, merge/push/deploy automation, product UAT, dependency changes, external services, installed skill edits, or unrelated cockpit work. |

## Next Action

Dispatch Stage 3 implementation for `BANDIT-058` to Claude through the bootstrap Process Adapter path: implement the narrow Role Contracts and Role Run Manifests validation surface needed to make `test/role-contracts.test.mjs` and `test/role-run-manifests.test.mjs` pass. Add `bandit role-contracts validate --json`, `bandit role-runs validate BANDIT-058 --json`, repo-native role-contract policy/template support, role-run manifest validation over `docs/role-runs/<ID>/`, and `bandit validate` integration only as needed for this bounded slice. Keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence artifacts/specs, acceptance mappings, execution packet generation, role input packet generation, diff-based write validation, same-agent repair continuation, landing/closeout packet systems, scheduler execution, worktree lifecycle, claim leases, work-surface reservations, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, dependency or lockfile changes, local server/API mode, installed global skill edits, external service integration, full rubric migration, and unrelated Phase 8 cockpit feature work.
