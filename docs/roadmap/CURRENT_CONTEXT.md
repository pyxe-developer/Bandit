# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-058` is landed and closed out. It delivered the Role Contracts And Run
Manifests slice under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` with
Stage 1 brief evidence, Formation Gate approval, Test Writer RED evidence,
Claude Implementation Writer evidence, CodeRabbit repair evidence, Local Qwen
review and PM disposition, aggregate Stage 4 review evidence, Stage 5
landing-gate evidence, local-record landing action evidence, and Stage 6
retrospective/improvement/gap disposition evidence.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open, but its Pi/Aperture
agent-scope path is superseded by
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`. The previously
queued Execution And Role Input Packets follow-on and the Pi/Aperture scope
schema/projection work are no longer the next action.

**Active work item:** none.

The accepted architecture boundary is that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Continue the design clarification for the smallest
CLI-verifiable trust contract an external orchestrator prompt can use from any
harness: validate a work item snapshot, hash it, verify repo evidence, enforce
reviewer-finding routing, produce a verdict, and emit a reproducible report. Do
not implement Pi/Aperture agent-scope schema/projection work. The emerging next
implementation target is a read-only `bandit trust verify <snapshot.json>`
slice with explicit snapshot schema, snapshot hash, captured-evidence
validation, reviewer-finding routing, Trust Verdict derivation, and deterministic
JSON report output. This first slice is compatibility-mode only: it must not
replace `land-check`, review evidence validation, closeout validation,
coordination checks, or any other existing gate path.

The current stage is Stage 0 architecture clarification / interstitial queue
selection: no work item is active, `BANDIT-058` has landing action and Stage 6
closeout evidence, and the next action is operator-guided design clarification
of Bandit's minimum deterministic trust contract. Do not create RED evidence,
implementation branches, Work Item PM active context, a normal Execution And
Role Input Packets work item, a Pi/Aperture live proof run, or unrelated
cockpit product work until this product-boundary pivot is recorded into the
next implementable work item.

## Active Work

**Active work item:** none.

`BANDIT-058` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-058/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-058/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

## Priority

1. Define the smallest CLI-verifiable trust contract for agentic software
   delivery around Work Item Snapshot validation, hashing, evidence
   verification, reviewer-finding routing, Trust Verdicts, and reproducible
   reports.
2. Record the first implementation slice as `bandit trust verify <snapshot.json>`
   with read-only verification, optional explicit report writing, and no
   reviewer/test execution or workflow-state mutation.
3. Keep the first slice in Trust Verifier Compatibility Period; cutover to any
   existing gate path requires a later per-Trust-Goal cutover decision with
   reproducible parity evidence.
4. Decide how this verifier coexists with existing work-item, gate, evidence,
   review, landing, closeout, and improvement artifacts before replacing any
   older command path.
5. Convert the resolved boundary into a next implementable Bandit work item.
6. Keep unrelated Phase 8 cockpit product work, Execution And Role Input
   Packets work-item creation, and Pi/Aperture agent-scope work blocked while
   this product-boundary pivot is unresolved.

## Required Operator Input

Operator-owned product-boundary input is currently being gathered. Repo
artifacts cannot infer the minimum trust-layer surface without that product
direction. After the boundary is resolved, Codex PM can turn it into the next
bounded work item.
