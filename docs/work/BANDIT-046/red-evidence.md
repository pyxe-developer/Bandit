# BANDIT-046 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Git Mutation Serializer contract before production implementation. They fail because Bandit does not yet require git-mutation policy/template validation, no `bandit git-mutation` command exists, release-authorized shared .git mutation bypass checks are not implemented, and Claim Safety Invariant simulation does not yet evaluate serializer-failure cleanup.

## Test Command

```sh
node --test test/git-mutation-serializer.test.mjs test/claim-safety-simulation.test.mjs
```

## Observed Output

```text
tests 19
pass 6
fail 13
claim safety simulation treats failed serializer cleanup as recovery-required failed: actual invariant custom_claim_safety_scenario_evaluated instead of failed_serializer_cleanup_preserves_recovery_state
validate fails closed when the git mutation policy is missing failed: expected exit code 1, received 0
validate fails closed when the git mutation template is missing failed: expected exit code 1, received 0
git mutation validation rejects registered decisions without evidence failed: Unknown command: git-mutation
git mutation validation rejects incomplete shared git mutation allow-list failed: Unknown command: git-mutation
git mutation validation rejects release-authorized bypass paths failed: Unknown command: git-mutation
git mutation validation rejects non-exclusive writer guard semantics failed: Unknown command: git-mutation
git mutation validation rejects serializer claim authority failed: Unknown command: git-mutation
git mutation validation rejects fencing tokens in worktree lock reasons failed: Unknown command: git-mutation
git mutation validation rejects lock failure cleanup that leaves false active claims failed: Unknown command: git-mutation
git mutation validation rejects worker-owned unlock failed: Unknown command: git-mutation
git mutation validation rejects non-fail-closed timeout behavior failed: Unknown command: git-mutation
git mutation validation accepts a complete serializer contract failed: Unknown command: git-mutation
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A Git Mutation Serializer contract, template, or policy artifact names the shared .git mutation allow-list, CLI-owned single-writer guard, contention behavior, timeout behavior, stale-lock behavior, bypass refusal behavior, cleanup behavior, evidence fields, trace fields, source artifacts, and authority separation from refs/bandit/* claim CAS. | test/helpers/git-mutation-fixture.mjs defines .bandit/policy/git-mutations.json, docs/templates/git-mutation-serializer.md, per-work-item docs/git-mutations/<ID>-git-mutation-serializer.json evidence, the allow-list, guard semantics, timeout/stale-lock behavior, failure cleanup, trace fields, source artifacts, and claim-authority separation; test/git-mutation-serializer.test.mjs expects `bandit git-mutation validate --json` to accept the complete record. |
| Validation or focused tests fail closed when release-authorized worktree lifecycle or shared repository plumbing code mutates shared .git state outside the serializer. | test/git-mutation-serializer.test.mjs mutates a release-authorized `worktree_add` path to `uses_serializer: false` and expects validation to refuse the bypass with an operation-specific diagnostic. |
| Focused contention tests prove two serializer-governed shared .git plumbing operations cannot both hold the writer guard at the same time. | test/git-mutation-serializer.test.mjs mutates `single_writer_guard.max_concurrent_holders` and the contention scenario to allow two holders, then expects validation to reject the non-exclusive guard. |
| Focused tests prove the serializer cannot grant, renew, release, complete, block, fail, recover, or transfer claims, and that refs/bandit/* git update-ref CAS remains the claim authority boundary. | test/git-mutation-serializer.test.mjs toggles `serializer_can_grant_claims` and expects validation to reject serializer claim authority while the complete fixture records `refs/bandit/*:git update-ref --stdin` as the claim authority boundary. |
| Focused tests prove claim-owned worktree creation locks the worktree immediately after creation with a stable reason naming claim ID, Work Item ID, and stage. | The complete git-mutation fixture requires `lock_immediately_after_create: true` and `required_reason_fields` claim_id, work_item, and stage; the complete acceptance test expects those worktree-lock fields in the validator report. |
| Focused tests prove the claim-owned worktree lock reason excludes fencing tokens or other renewal-varying data. | test/git-mutation-serializer.test.mjs pushes `fencing_token` into required lock-reason fields and expects validation to fail closed because lock reasons must stay stable across claim renewal. |
| Focused tests prove a worktree created but not successfully locked is treated as a failed creation path that records failure evidence and routes associated claim cleanup through release, fail, block, or recovery-required behavior. | test/git-mutation-serializer.test.mjs toggles `false_active_claim_allowed` to true and expects validation to reject lock-failure cleanup that can leave a false active claim. |
| Focused tests prove worker-owned unlock of a claim-owned worktree is refused and Repo PM Coordinator-only unlock requires handoff verification or cleanup evidence. | test/git-mutation-serializer.test.mjs changes `worker_owned_unlock` to allowed and expects validation to reject it; the complete fixture requires Repo PM Coordinator-only unlock with handoff verification or cleanup evidence. |
| Focused tests prove timeout and stale-lock behavior is explicit, deterministic, and fail-closed when recovery evidence is missing or ambiguous. | test/git-mutation-serializer.test.mjs changes timeout behavior to `continue_without_serializer` and expects validation to fail closed; the complete fixture requires stale-lock evidence, owner-liveness check, and PM repair or recovery event before stale-lock recovery. |
| Serializer evidence records operation identity, work item, stage or claim context when available, writer owner, start and completion timestamps, result, contention or stale-lock status, diagnostics, and source artifacts without becoming canonical workflow or claim authority. | test/helpers/git-mutation-fixture.mjs defines required serializer trace fields and records `canonical_workflow_authority: false`; the complete acceptance test expects the validator to report the guard and authority boundaries rather than workflow ownership. |
| Claim Safety Invariant simulation includes serializer failure and worktree-lock failure cases where they can affect claim release, reconciliation, stale-agent rejection, or false-active-claim cleanup. | test/claim-safety-simulation.test.mjs adds a `serializer failure cleanup` scenario and expects `failed_serializer_cleanup_preserves_recovery_state` with `final_status: recovery_required` and no false active claim. |
| The implementation records that true parallel writable workstreams remain blocked until the full Parallel Write Authorization Gate passes, including the later Worktree Bootstrap Contract. | The complete git-mutation fixture records `parallel_write_authorization.status` as `blocked_until_full_gate` with `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` still missing; the complete acceptance test expects that status in validator output. |
| The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied. | This Stage 2 step adds focused tests, a test helper, the RED evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing only. It adds no production Git Mutation Serializer implementation, review evidence, landing evidence, retrospective, Worktree Bootstrap Contract, scheduler, worktree lifecycle enablement, cockpit UI/server/API, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow, installed global skill edit, dependency/lockfile change, paid reviewer route, live-routing change, or later bootstrap-gap work. |

## Next Action

Implement the narrow Git Mutation Serializer repair: add repo-native git-mutations policy and git-mutation-serializer template defaults, `bandit git-mutation validate --json` command wiring, `bandit validate` integration, release-authorized shared .git mutation allow-list validation, serializer bypass refusal checks, single-writer contention validation, timeout/stale-lock fail-closed checks, claim-owned worktree lock reason and unlock-authority validation, worktree lock-failure cleanup validation, claim-authority separation validation, and the focused Claim Safety Invariant serializer-failure scenario needed to make the RED tests pass without enabling true parallel writable workstreams or broadening into Worktree Bootstrap Contract, scheduler execution, full worktree lifecycle, cockpit UI/server/API work, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow, live routing changes, paid reviewer routes, external services, installed global skills, dependency/lockfile changes, or later bootstrap gaps.
