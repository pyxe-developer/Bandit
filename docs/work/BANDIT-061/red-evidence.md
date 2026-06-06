# BANDIT-061 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define role-contract artifact-input write-surface and role-run observed changed-file behavior before production implementation. Existing role-run and role-contract tests still pass, while new tests fail because Bandit does not require contract_version 2 role-run manifests to carry observed_changed_files, does not compare observed changed files with allowed_target_files, and does not require the implementation_writer role contract to model artifact-input policy/support surfaces.

## Test Command

```sh
node --test test/role-run-manifests.test.mjs && node --test test/role-contracts.test.mjs
```

## Observed Output

```text
node --test test/role-run-manifests.test.mjs
tests 9
pass 6
fail 3
role-runs validation rejects future manifests without observed changed-file evidence failed because validation exits 0 instead of requiring observed_changed_files for contract_version 2.
role-runs validation rejects observed changed files missing from allowed targets failed because validation exits 0 instead of rejecting src/state/unlisted-role-run-helper.ts.
role-runs validation rejects observed changed files outside contract surfaces failed before the expected observed_changed_files diagnostic because current validation only checks declared target files.
node --test test/role-contracts.test.mjs
tests 5
pass 4
fail 1
role-contracts validation rejects implementation writer missing artifact-input support surfaces failed because validation exits 0 while implementation_writer lacks .bandit/policy/artifact-inputs.json, docs/artifact-inputs/**, docs/reviewer-captures/.gitkeep, and docs/trust-snapshot-fixtures/.gitkeep.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves the current failure mode where role-run validation can pass without proving the Writer's actual changed files are all declared in the manifest and permitted by the referenced role contract. | test/role-run-manifests.test.mjs adds contract_version 2 role-run manifest cases for missing observed_changed_files, observed files not listed in allowed_target_files, and observed files outside the implementation_writer role contract. Current validation passes or reports only declared-target diagnostics because observed changed-file evidence is not modeled. |
| Focused RED evidence proves artifact-input policy/support files introduced by BANDIT-060 are either unrepresentable or insufficiently validated under the current implementation_writer role contract and role-run manifest validation. | test/role-contracts.test.mjs adds a policy-backed check that implementation_writer must include .bandit/policy/artifact-inputs.json, docs/artifact-inputs/**, docs/reviewer-captures/.gitkeep, and docs/trust-snapshot-fixtures/.gitkeep. Current role-contract validation exits 0 without those surfaces. |
| Role-run validation fails closed for future manifests when observed changed-file evidence is missing, when an observed changed file is absent from allowed_target_files, when an observed changed file is outside the referenced role contract write surfaces, or when an observed changed file matches forbidden_file_patterns. | The new role-run tests define the public `bandit role-runs validate BANDIT-061 --json` refusal behavior for contract_version 2 observed_changed_files. The current implementation has no observed changed-file validation path. |
| Role-run validation preserves append-only historical evidence compatibility for already-landed role-run manifests and records any compatibility rule clearly in code, tests, and Stage 3 evidence. | The existing role-run acceptance test for contract_version 1 manifests still passes, so the RED evidence requires stricter contract_version 2 behavior without invalidating historical BANDIT-058, BANDIT-059, or BANDIT-060 evidence. |
| The implementation_writer role contract or compatible policy model explicitly covers only the artifact-input policy/support paths needed for Stage 3 implementation authority, while still refusing tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, and retrospective evidence. | The role-contract RED test requires only the artifact-input policy and support path surfaces introduced by BANDIT-060. Existing Stage 3 test-surface refusal tests remain in place and continue to pass. |
| The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for this work item. | Codex authored this Stage 2 test and acceptance-mapping evidence. Stage 3 must be dispatched to Claude through the bootstrap Process Adapter path with zero authority over test files, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence. |
| No role-run manifest, role contract policy, artifact-input policy, template, or derived validation output becomes canonical workflow history or replaces coordination logs, review evidence, landing evidence, UAT, retrospective evidence, roadmap/current-context state, or bootstrap-gap ledger authority. | The RED tests keep role-run manifests as append-only evidence and role-contract policy as policy evidence. They do not grant those files authority over coordination, review, landing, UAT, closeout, roadmap, current-context, or bootstrap-gap state. |
| The implementation does not start Trust Verifier cutover or parity replacement; any old-gate replacement remains blocked on a later per-trust-goal cutover decision with reproducible parity evidence. | This Stage 2 step adds only focused role-run and role-contract tests plus RED evidence for BANDIT-061. It does not implement Trust Verifier cutover, old-gate replacement, live evidence capture, reviewer execution, model calls, harness queues, auth/provider routing, live status, role input packets, execution packets, Pi/Aperture work, or unrelated cockpit work. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-061 to Claude through the bootstrap Process Adapter path. Implement the narrow role-run observed_changed_files validation and implementation_writer artifact-input support-surface contract needed to make test/role-run-manifests.test.mjs and test/role-contracts.test.mjs pass. Keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence artifacts/specs, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, Trust Verifier cutover, old gate replacement, live evidence capture, reviewer execution, model calls, harness queues, auth/provider routing, live status, role input packets, execution packets, Pi/Aperture agent-scope work, state-index persistence, server/API mode, scheduler/worktree/claim/work-surface lifecycle, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, dependency or lockfile changes, installed global skill edits, external service integration, and unrelated Phase 8 cockpit feature work.
