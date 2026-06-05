# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-059` is active. Repo PM created the Trust Verify Snapshot Foundation
work item from `docs/specs/BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION.json`
and linked `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` as the active
bootstrap chore. Stage 1 brief evidence is recorded at
`docs/work/BANDIT-059/brief.md`; Stage 2 RED evidence is recorded at
`docs/work/BANDIT-059/red-evidence.md` and
`docs/specs/BANDIT-059-red-evidence.json`.

Repo PM formation review was refreshed on 2026-06-05 after Local Qwen provider
availability was restored. CodeRabbit formation review passed with zero findings
at `docs/work/BANDIT-059/coderabbit-formation-review.md`; Local Qwen formation
review passed with zero findings at
`docs/work/BANDIT-059/qwen-formation-review.md`; and the aggregate formation
review at `docs/work/BANDIT-059/formation-review.md` is `pass`. The CLI-owned
`formation_approved` and `red_recorded` transitions are recorded in
`docs/work/BANDIT-059/coordination-log.jsonl`.

`BANDIT-058` is landed and closed out. It delivered the Role Contracts And Run
Manifests slice under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`. That
umbrella remains open as source material, but its Pi/Aperture agent-scope path
is superseded by
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`. The previously
queued Execution And Role Input Packets follow-on and the Pi/Aperture scope
schema/projection work are not the next action.

**Active work item:** `BANDIT-059` - Trust Verify Snapshot Foundation.

The accepted architecture boundary is that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Create a shorter Stage 3 Claude Process Adapter
dispatch packet from `docs/work/BANDIT-059/dispatch.md`, then retry Claude
Writer implementation for `BANDIT-059` through that narrower packet.

Do not route Stage 3 to Codex, do not let the Stage 3 Writer edit tests, test
helpers, fixtures, snapshot fixtures, RED evidence artifacts/specs, or
acceptance mappings, and do not create Pi/Aperture agent-scope schema/projection
work, Trust Verifier cutover work, or unrelated cockpit product work during this
bounded implementation.

The current stage is Stage 3 implementation pending. Stage 2 RED evidence
defines the public CLI verifier contract and currently fails 8/8 because
`bandit trust verify` is not registered. Codex PM created the Stage 3 dispatch
packet at `docs/work/BANDIT-059/dispatch.md` and role-run manifest at
`docs/role-runs/BANDIT-059/stage3-implementation.json`. Two Claude Process
Adapter attempts stalled before source edits or Writer evidence; both attempts
are recorded at `docs/work/BANDIT-059/dispatch-attempt.md`. Codex PM did not
substitute Codex-authored implementation work.

## Active Work

**Active work item:** `BANDIT-059` - Trust Verify Snapshot Foundation.

`BANDIT-059` is the active work item. Its Stage 1 brief is recorded at
`docs/work/BANDIT-059/brief.md`; its Stage 2 RED evidence is recorded at
`docs/work/BANDIT-059/red-evidence.md`; its coordination log is recorded at
`docs/work/BANDIT-059/coordination-log.jsonl`.

`BANDIT-058` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-058/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-058/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

## Priority

1. Create a shorter Stage 3 Claude Process Adapter dispatch packet from
   `docs/work/BANDIT-059/dispatch.md`, then retry Claude Writer implementation
   for `BANDIT-059` through that narrower packet.
2. Preserve model-family separation: Codex authored and materially edited Stage
   2 RED tests, so Stage 3 implementation must be routed to Claude with zero
   test edit authority.
3. Keep the first implementation slice as `bandit trust verify <snapshot.json>`
   with read-only verification, optional explicit report writing, and no
   reviewer/test execution or workflow-state mutation.
4. Keep the first slice in Trust Verifier Compatibility Period; cutover to any
   existing gate path requires a later per-Trust-Goal cutover decision with
   reproducible parity evidence.
5. Decide how this verifier coexists with existing work-item, gate, evidence,
   review, landing, closeout, and improvement artifacts before replacing any
   older command path.
6. Keep unrelated Phase 8 cockpit product work, Execution And Role Input
   Packets work-item creation, and Pi/Aperture agent-scope work blocked while
   the verifier foundation work item is active.

## Required Operator Input

No operator-owned input is required for the recorded Stage 3 Process Adapter
repair/retry action. The minimum trust-layer surface is recorded in
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md` and
`docs/work/BANDIT-059/brief.md`: validate and hash a local Work Item Snapshot,
verify captured repo evidence, enforce reviewer-finding routing, derive a
Trust Verdict, and produce a reproducible report without running
tests/reviewers or mutating workflow state.

Ask the operator only if the proposed work item would expand beyond that
read-only compatibility-mode verifier boundary.
