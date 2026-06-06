# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-060` is landed and closed out. It delivered the Artifact Input
Directory Split bootstrap-gap chore under
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT`: repo-native artifact-input
taxonomy policy, preferred `docs/artifact-inputs/` support for future
artifact-renderer JSON inputs, `docs/specs/` preservation for work/gap specs,
reviewer-capture and trust-snapshot fixture class boundaries, fail-closed
future `docs/specs/` renderer-input refusal, and legacy-readable historical
renderer inputs. Stage 6 retrospective, improvement disposition, and gap
disposition are recorded at `docs/work/BANDIT-060/retrospective.md`, and the
gap ledger marks `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` resolved.

`BANDIT-061` is active. It is the bounded Role Contract Artifact Input Write
Surface bootstrap-gap chore under
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`. The Stage 1 brief is
created at `docs/work/BANDIT-061/brief.md`; formation review is pending before
Stage 2 RED evidence.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is queued behind
`BANDIT-061`. It records that the current work-item creation path can drop
`replacement_gap`, `replacement_work_item`, and `replacement_evidence` fields
from replaced gaps during bootstrap-gap ledger rewrites.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`, and the gap ledger marks it
resolved.

**Active work item:** BANDIT-061

The current stage is Stage 1 work-item brief / formation review pending.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Run Repo PM formation review for BANDIT-061 before
Stage 2 RED evidence.

Do not create Trust Verifier cutover work, create Pi/Aperture agent-scope
schema/projection work, create role input or execution packet work, start RED
evidence, dispatch implementation, or start unrelated cockpit product work
while `BANDIT-061` is waiting on Stage 1 formation review.

## Active Work

**Active work item:** BANDIT-061

`BANDIT-061` is active. Its Stage 1 brief is recorded at
`docs/work/BANDIT-061/brief.md`, and its coordination log records
`brief_created`. The next required evidence is formation review before Stage 2
RED evidence.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is a queued
follow-up gap discovered during `BANDIT-061` creation. It must not preempt the
active work item, but it should be handled or dispositioned before Trust
Verifier cutover work.

`BANDIT-060` is the last closed work item. Its Stage 1 brief, Stage 2 RED
evidence, Stage 3 implementation evidence, Stage 4 review evidence, Stage 5
landing verdict/action evidence, and Stage 6 retrospective closeout are
recorded under `docs/work/BANDIT-060/`.

`BANDIT-059` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-059/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-059/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

## Priority

1. Run Repo PM formation review for `BANDIT-061` before Stage 2 RED evidence.
2. Preserve the Permanent Test Ownership Boundary: the Stage 3 Writer has zero
   authority to edit tests, test helpers, fixtures, RED evidence, acceptance
   mappings, or canonical historical evidence outside the scoped dispatch
   packet.
3. Keep the chore bounded to implementation-writer write-surface policy,
   role-run actual changed-file evidence, artifact-input policy/support paths,
   and historical role-run manifest compatibility.
4. Preserve canonical Markdown evidence, append-only lifecycle/coordination
   evidence, and repo-native roadmap/current-context authority; JSON command
   inputs must not become canonical workflow state.
5. Keep `bandit trust verify` in the Trust Verifier Compatibility Period until
   a later per-trust-goal cutover decision has reproducible parity evidence.
6. Keep unrelated Phase 8 cockpit product work, role input packet work,
   execution packet work, Pi/Aperture agent-scope work, and Trust Verifier
   cutover blocked while `BANDIT-061` is active.
7. After `BANDIT-061` lands and closes, address or explicitly disposition the
   queued work-item creation replacement-metadata serializer gap before Trust
   Verifier cutover work.

## Required Operator Input

No operator-owned input is required for the current Stage 1 formation-review
action. Repo artifacts identify the active bootstrap-gap chore and the required
boundary: review formation for `BANDIT-061` without starting RED evidence,
implementation, cutover, cockpit product work, Pi/Aperture agent-scope work,
role input packets, or execution packets.

Ask the operator only if the proposed work item would expand into product
direction, UAT policy, workflow policy beyond explicit artifact-input path
semantics, business tradeoffs, explicit cost/risk posture, provider-pricing
approval, spend-class approval, paid reviewer promotion, recurring paid routing
policy, external service setup, live routing policy, claim authority, worktree
lifecycle authority, installed global skill contents, dependency or lockfile
policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader
cockpit/product scope.
