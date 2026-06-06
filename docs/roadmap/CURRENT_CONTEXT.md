# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-059` is active. Repo PM created the Trust Verify Snapshot Foundation
work item from `docs/specs/BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION.json`
and linked `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` as the active
bootstrap chore. Stage 1 brief evidence is recorded at
`docs/work/BANDIT-059/brief.md`; Stage 2 RED evidence is recorded at
`docs/work/BANDIT-059/red-evidence.md` and
`docs/specs/BANDIT-059-red-evidence.json`; Stage 3 implementation evidence is
recorded at `docs/work/BANDIT-059/implementation-evidence.md`,
`docs/work/BANDIT-059/writer-report.md`, and
`docs/specs/BANDIT-059-implementation-evidence.json`; and Codex PM Stage 3
acceptance is recorded at `docs/work/BANDIT-059/stage3-pm-review.md`.
Stage 4 CodeRabbit timeout and provider-refusal disposition evidence is
recorded at `docs/work/BANDIT-059/coderabbit-review.md`,
`docs/specs/BANDIT-059-coderabbit-review-output.json`, and
`docs/work/BANDIT-059/coderabbit-timeout-disposition.md`. Stage 4 Local Qwen
review passed with zero findings at
`docs/work/BANDIT-059/local-qwen-review.md`. Aggregate Stage 4 review evidence
is recorded at `docs/work/BANDIT-059/review-evidence.md`. Stage 5 landing-gate
evidence is recorded at
`.bandit/policy/risk-classifications/BANDIT-059-risk-classification.json`,
`.bandit/policy/supply-chain-gates/BANDIT-059-supply-chain-gate.json`, and
`docs/work/BANDIT-059/landing-verdict.md`; the Stage 5 landing verdict is
`safe-to-land`. Local-record landing action evidence is recorded at
`docs/work/BANDIT-059/landing-action.md`.

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

**Current next action:** Record Stage 6 retrospective, improvement disposition,
and gap disposition for BANDIT-059 before any new work item.

Do not create the next work item, create Trust Verifier cutover work, create
Pi/Aperture agent-scope schema/projection work, or start unrelated cockpit
product work until Stage 6 retrospective, improvement disposition, gap
disposition, and context closeout evidence exist for `BANDIT-059`.

The current stage is Stage 6 retrospective and disposition closeout required.
Stage 2 RED evidence
defines the public CLI verifier contract, and the accepted Stage 3 Claude
implementation now makes `node --test test/trust-verify.test.mjs` pass 8/8.
Codex PM created the Stage 3 dispatch packet at
`docs/work/BANDIT-059/dispatch.md`, role-run manifest at
`docs/role-runs/BANDIT-059/stage3-implementation.json`, and shorter retry
packet at `docs/work/BANDIT-059/dispatch-short.md`. The operator approved using
`claude -p`; Claude wrote the bounded Stage 3 implementation and evidence
without editing Test Writer-owned surfaces. CodeRabbit CLI was installed and
authenticated, but two live pre-PR review attempts against `origin/main`
produced no terminal verdict after reaching setup, sandbox preparation, and
summarizing. Codex PM dispositioned the repeated timeout as scoped
provider-refusal/bootstrap_gap replacement evidence without claiming a
CodeRabbit pass. Local Qwen passed at source head
`83d889cb9c2816840303bd06907099a7efe4f402` with no findings. Codex PM accepted
aggregate Stage 4 with current review-subject hash
`5229a5f93496e1b4537a5891f5c096f3a5c97c26a0ba9fd2bafce48788a8a84c` after
Stage 5 policy gate evidence was recorded. Stage 5 landing verdict evidence
marks the work `safe-to-land`; Stage 5 landing action evidence records the
supported `local_record` landing action. Stage 6 retrospective, improvement
disposition, and gap disposition are not yet recorded.

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

1. Record Stage 6 retrospective, improvement disposition, and gap disposition
   for BANDIT-059 before any new work item.
2. Preserve model-family separation evidence: Codex authored and materially edited Stage
   2 RED tests, so Stage 3 implementation must be routed to Claude with zero
   test edit authority; Stage 3 evidence records Claude authorship.
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

No operator-owned input is required for the current Stage 6 closeout action.
The prior Stage 3 operator unblock was satisfied when the
operator approved using the ready `claude -p` Process Adapter profile on
2026-06-06, the Stage 4 CodeRabbit timeout disposition is PM-owned
provider-refusal routing, and Local Qwen passed with no findings.

The minimum trust-layer surface is recorded in
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md` and
`docs/work/BANDIT-059/brief.md`: validate and hash a local Work Item Snapshot,
verify captured repo evidence, enforce reviewer-finding routing, derive a
Trust Verdict, and produce a reproducible report without running
tests/reviewers or mutating workflow state.
