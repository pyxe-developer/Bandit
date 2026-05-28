# BANDIT-046: Git Mutation Serializer

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where release-authorized parallel worktrees lack a CLI-owned single-writer guard for shared .git plumbing mutations.

## Origin

The 2026-05-26 PRD-002 research review found that git worktree concurrency on a single .git directory has contention surfaces around worktree creation, worktree lifecycle operations, shared refs, and packed-refs-affecting maintenance. On 2026-05-27, the accepted Git Mutation Serializer decision required a repo-level serializer before release-authorized parallel worktrees are enabled. BANDIT-045 resolved Git refs CAS claim authority, fencing tokens, idempotency keys, projection boundaries, wait-for graph cycle refusal, and Claim Safety Invariant simulation, but its retrospective explicitly left shared .git worktree and repository plumbing serialization as the next queued bootstrap gap. Git refs CAS remains the claim authority boundary; this chore defines the separate CLI-owned single-writer guard for shared Git plumbing mutations and claim-owned worktree lock behavior.

## Scope

- Define a repo-native Git Mutation Serializer contract for release-authorized paths that mutate shared .git plumbing outside the refs/bandit/* claim authority CAS boundary.
- Define the shared .git mutation allow-list that must run through the serializer, including worktree add, worktree remove, worktree prune, worktree lock, worktree unlock, branch or ref maintenance outside the claim CAS boundary, and packed-refs-affecting maintenance.
- Define serializer state, ownership, contention, timeout, stale-lock, interruption, retry, and failure cleanup semantics without making the serializer claim authority.
- Define a CLI-owned single-writer guard that ensures two contending shared .git plumbing operations cannot execute concurrently through Bandit release-authorized command paths.
- Define bypass refusal behavior for release-authorized paths that attempt shared .git mutations without the serializer, including diagnostics naming the operation, work item, claim or stage context, and required serializer path.
- Define claim-owned worktree creation as complete only after the worktree is created and immediately git worktree locked through serializer-owned flow.
- Define claim-owned worktree lock reasons as stable and claim-specific, naming claim ID, Work Item ID, and stage, and explicitly excluding fencing tokens because renewal can change them.
- Define lock-failure cleanup behavior after worktree creation, including failure evidence and the rule that the associated claim is released, failed, blocked, or marked recovery-required through the claim lifecycle contract instead of leaving a false active claim.
- Define Repo PM Coordinator-only unlock behavior for claim-owned worktrees after handoff verification and cleanup routing; worker-owned unlock must fail closed.
- Define serializer evidence and trace output for successful operation, contention wait, timeout, stale-lock recovery, bypass refusal, lock failure, cleanup, and claim-authority separation.
- Preserve refs/bandit/* and git update-ref --stdin as the Claim Authority Primitive; the serializer must not grant, renew, release, complete, block, fail, recover, or transfer claims.
- Integrate serializer and worktree-lock failure cases with the existing Claim Safety Invariant simulation where they can affect claim release, reconciliation, stale-agent rejection, or false-active-claim cleanup.
- Consume existing Coordination Event Log Authority, Operator Fail-Closed Boundary, CAS Fenced Claim Authority, Layered Risk Classification, Supply-Chain Gate, Input Quarantine Gate, bootstrap-gap ledger, and Stage 4 review-subject-hash vocabulary without redefining those gates.
- Keep the repair limited to Git Mutation Serializer contract, policy or template validation, serializer command/helper boundaries, worktree lock/unlock authority, contention/refusal/failure tests, claim-authority separation tests, trace or evidence fields, and necessary roadmap/current-context/gap-ledger evidence.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-28 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope: Codex PM owns technical routing; Test Writer owns RED evidence for serializer contention, worktree lock, bypass refusal, timeout, stale-lock, cleanup, and authority-separation behavior; Writer may edit serializer policy/templates, Git helper modules, worktree lifecycle command boundaries, validation wiring, claim-safety simulation fixtures, and focused tests; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Operator-blocking boundary: no operator-owned input is required unless implementation would change product direction, UAT policy, workflow policy beyond defining the queued Git Mutation Serializer gap, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer spend approval, paid reviewer routing, live routing, scheduler authority, claim/worktree authority beyond the accepted serializer and lock decision, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
- Future-work scope: this chore must not implement Worktree Bootstrap Contract behavior, optional .worktreeinclude-style bootstrap allow-lists, setup or validation command execution, secret-copy policy, event-driven scheduler execution, true parallel writable workstream enablement, automatic merge/push/deploy behavior, PR/CI workflow changes, product UAT approval, local server/API mode, cockpit UI implementation, state-index persistence, paid reviewer routing, live model routing, installed global skill edits, external service integration, or any later bootstrap gap.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-046/brief.md and links to BANDIT-GAP-GIT-MUTATION-SERIALIZER.
- A Git Mutation Serializer contract, template, or policy artifact names the shared .git mutation allow-list, CLI-owned single-writer guard, contention behavior, timeout behavior, stale-lock behavior, bypass refusal behavior, cleanup behavior, evidence fields, trace fields, source artifacts, and authority separation from refs/bandit/* claim CAS.
- Validation or focused tests fail closed when release-authorized worktree lifecycle or shared repository plumbing code mutates shared .git state outside the serializer.
- Focused contention tests prove two serializer-governed shared .git plumbing operations cannot both hold the writer guard at the same time.
- Focused tests prove the serializer cannot grant, renew, release, complete, block, fail, recover, or transfer claims, and that refs/bandit/* git update-ref CAS remains the claim authority boundary.
- Focused tests prove claim-owned worktree creation locks the worktree immediately after creation with a stable reason naming claim ID, Work Item ID, and stage.
- Focused tests prove the claim-owned worktree lock reason excludes fencing tokens or other renewal-varying data.
- Focused tests prove a worktree created but not successfully locked is treated as a failed creation path that records failure evidence and routes associated claim cleanup through release, fail, block, or recovery-required behavior.
- Focused tests prove worker-owned unlock of a claim-owned worktree is refused and Repo PM Coordinator-only unlock requires handoff verification or cleanup evidence.
- Focused tests prove timeout and stale-lock behavior is explicit, deterministic, and fail-closed when recovery evidence is missing or ambiguous.
- Serializer evidence records operation identity, work item, stage or claim context when available, writer owner, start and completion timestamps, result, contention or stale-lock status, diagnostics, and source artifacts without becoming canonical workflow or claim authority.
- Claim Safety Invariant simulation includes serializer failure and worktree-lock failure cases where they can affect claim release, reconciliation, stale-agent rejection, or false-active-claim cleanup.
- The implementation records that true parallel writable workstreams remain blocked until the full Parallel Write Authorization Gate passes, including the later Worktree Bootstrap Contract.
- The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-GIT-MUTATION-SERIALIZER is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No Worktree Bootstrap Contract implementation, scheduler execution, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow execution, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused Git Mutation Serializer tests for RED/GREEN coverage.
- Run focused serializer contention tests proving the single-writer guard around shared .git mutations.
- Run focused bypass-refusal tests for release-authorized worktree lifecycle and shared repository plumbing paths.
- Run focused claim-owned worktree lock reason, lock failure, cleanup, and unlock-authority tests.
- Run focused timeout, stale-lock, interruption, retry, and failure-cleanup tests.
- Run focused claim-authority separation tests proving the serializer cannot grant or mutate claim ownership.
- Run deterministic Claim Safety Invariant simulation cases for serializer failure and worktree-lock failure if implementation touches claim lifecycle or recovery behavior.
- Run node --test test/claim-authority.test.mjs test/claim-safety-simulation.test.mjs if serializer failure cases integrate with claim authority or simulation behavior.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/bootstrap-gaps.test.mjs if bootstrap-gap ledger behavior is touched.
- Run node --test test/operator-boundary.test.mjs if failure routing, PM repair, recovery, or required-operator-input behavior is touched.
- Run npm test if implementation touches shared command routing, validators, policy parsing, Git helpers, worktree lifecycle plumbing, claim simulation, bootstrap gaps, review evidence, landing gates, auto-landing policy, or template validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run npm run bandit -- claim validate --json if serializer policy or failure cases affect claim lifecycle invariants.
- Run npm run bandit -- claim simulate if serializer failure or worktree-lock failure cases are added to the invariant simulation.
- Run npm run bandit -- supply-chain-gate validate --json.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run npm run bandit -- coordination-authority validate --json.
- Run npm run bandit -- auto-land-check BANDIT-046 before Stage 5 closeout if auto-landing eligibility behavior is touched.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-046 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-046 before Stage 4 closeout.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-046 for aggregate review evidence freshness.
- Run npm run bandit -- land-check BANDIT-046 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-GIT-MUTATION-SERIALIZER.json
- docs/work/BANDIT-046/brief.md
- docs/work/BANDIT-046/red-evidence.md
- docs/work/BANDIT-046/implementation-evidence.md
- docs/work/BANDIT-046/coderabbit-review.md
- docs/work/BANDIT-046/local-qwen-review.md
- docs/work/BANDIT-046/review-evidence.md
- docs/work/BANDIT-046/landing-verdict.md
- docs/work/BANDIT-046/landing-action.md
- docs/work/BANDIT-046/retrospective.md
- docs/decisions/2026-05-27-git-mutation-serializer.md
- docs/templates/git-mutation-serializer.md
- .bandit/policy/git-mutations.json
- src/state/git-mutations.ts
- src/state/git.ts
- src/state/claim-safety-simulation.ts
- src/commands/git-mutation.ts
- src/commands/validate.ts
- test/git-mutation-serializer.test.mjs
- test/claim-safety-simulation.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-046/brief.md
- docs/work/BANDIT-046/red-evidence.md
- docs/work/BANDIT-046/implementation-evidence.md
- docs/work/BANDIT-046/coderabbit-review.md
- docs/work/BANDIT-046/local-qwen-review.md
- docs/work/BANDIT-046/review-evidence.md
- docs/work/BANDIT-046/landing-verdict.md
- docs/work/BANDIT-046/landing-action.md
- docs/work/BANDIT-046/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, accepted Git Mutation Serializer decision, BANDIT-045 claim-authority closeout, PRD-002 acceptance criteria, Stage 1 rubric requirements, and the operator-confirmed boundary that parallel worktrees need shared .git mutation serialization before release authorization. Halt only if implementation would change product direction, UAT policy, workflow policy beyond defining the queued Git Mutation Serializer gap, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer spend approval, paid reviewer routing, live routing, scheduler authority, claim/worktree authority beyond the accepted serializer and lock decision, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
