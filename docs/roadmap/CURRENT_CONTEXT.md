# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`: compatibility-mode
`bandit trust verify <snapshot.json>`, Work Item Snapshot schema validation,
deterministic snapshot hashing, local evidence digest verification,
reviewer-finding routing validation, Trust Verdict derivation, deterministic
JSON report output, and explicit `--report` write behavior. Stage 6
retrospective, improvement disposition, and gap disposition are recorded at
`docs/work/BANDIT-059/retrospective.md`, and the gap ledger marks
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` resolved.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Active work item:** none

**Current next action:** Create a bounded cleanup chore spec and work item for
BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT before Trust Verifier cutover work.

Do not create Trust Verifier cutover work, create Pi/Aperture agent-scope
schema/projection work, create role input or execution packet work, or start
unrelated cockpit product work while
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is queued.

## Active Work

**Active work item:** none

`BANDIT-059` is the last closed work item. Its Stage 1 brief, Stage 2 RED
evidence, Stage 3 implementation evidence, Stage 4 review evidence, Stage 5
landing verdict/action evidence, and Stage 6 retrospective closeout are recorded
under `docs/work/BANDIT-059/`.

`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is the next queued bootstrap gap.
It should split or explicitly model artifact-renderer JSON inputs, reviewer
captures, and work/gap specs before Trust Verifier cutover or parity work
depends on ambiguous `docs/specs/` path semantics.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

## Priority

1. Create the bounded cleanup chore spec and work item for
   `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT`.
2. Keep `bandit trust verify` in the Trust Verifier Compatibility Period until
   a later per-trust-goal cutover decision has reproducible parity evidence.
3. Preserve the completed `BANDIT-059` role boundary evidence: Codex authored
   and materially edited Stage 2 RED tests, Claude authored Stage 3
   implementation, and Stage 3 Writer did not edit Test Writer-owned surfaces.
4. Keep the role-scoped orchestration umbrella as source material while
   harness-agnostic trust-verifier bootstrap gaps are queued.
5. Keep unrelated Phase 8 cockpit product work blocked while open bootstrap
   gaps remain queued or active.

## Required Operator Input

No operator-owned input is required for the current interstitial work-item
creation action. Repo artifacts identify the next queued bootstrap gap and the
required boundary: create a bounded cleanup chore spec/work item for
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` without starting cutover, cockpit
product work, Pi/Aperture agent-scope work, role input packets, or execution
packets.
