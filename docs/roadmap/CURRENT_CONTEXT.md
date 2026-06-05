# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-059` is active. Repo PM created the Trust Verify Snapshot Foundation
work item from `docs/specs/BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION.json`
and linked `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` as the active
bootstrap chore. Stage 1 brief evidence is recorded at
`docs/work/BANDIT-059/brief.md`; `docs/work/BANDIT-059/coordination-log.jsonl`
records the `brief_created` transition.

Repo PM formation review was refreshed on 2026-06-05 after Local Qwen provider
availability was restored. CodeRabbit formation review passed with zero findings
at `docs/work/BANDIT-059/coderabbit-formation-review.md`; Local Qwen formation
review passed with zero findings at
`docs/work/BANDIT-059/qwen-formation-review.md`; and the aggregate formation
review at `docs/work/BANDIT-059/formation-review.md` is `pass`.

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

**Current next action:** Record the CLI-owned `formation_approved` coordination
transition for `BANDIT-059` before Stage 2 RED evidence.

Do not create RED evidence, implementation branches, Work Item PM active
execution context, Pi/Aperture agent-scope schema/projection work, Trust
Verifier cutover work, or unrelated cockpit product work until `BANDIT-059`
records the `formation_approved` transition.

The current stage is Stage 1 formation review passed / coordination transition
pending. The formation review verified that the brief is narrow, verifiable,
read-only, compatibility-mode only, and clean-code/rubric evaluable before any
Stage 2 RED evidence is written.

## Active Work

**Active work item:** `BANDIT-059` - Trust Verify Snapshot Foundation.

`BANDIT-059` is the active work item. Its Stage 1 brief is recorded at
`docs/work/BANDIT-059/brief.md`; its initial coordination log is recorded at
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

1. Record the `formation_approved` coordination transition for `BANDIT-059`
   before Stage 2 RED evidence.
2. Route Stage 2 RED evidence through the Test Writer boundary after formation
   approval is recorded.
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

No operator-owned input is required for the recorded Qwen formation-review
retry/repair action. The minimum trust-layer surface is recorded in
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md` and
`docs/work/BANDIT-059/brief.md`: validate and hash a local Work Item Snapshot,
verify captured repo evidence, enforce reviewer-finding routing, derive a
Trust Verdict, and produce a reproducible report without running
tests/reviewers or mutating workflow state.

Ask the operator only if the proposed work item would expand beyond that
read-only compatibility-mode verifier boundary.
