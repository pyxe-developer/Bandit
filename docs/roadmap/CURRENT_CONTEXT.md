# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-065` is the active bounded bootstrap-gap chore under
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`. Repo PM created the
Harness-Portable Orchestrator Prompt Contract brief at
`docs/work/BANDIT-065/brief.md`, recorded Stage 1 formation review evidence at
`docs/work/BANDIT-065/qwen-formation-review.md`,
`docs/work/BANDIT-065/coderabbit-formation-review.md`, and
`docs/work/BANDIT-065/formation-review.md`, and recorded the
`formation_approved` transition in `docs/work/BANDIT-065/coordination-log.jsonl`.
Work Item PM recorded plan-mode evidence at
`docs/work/BANDIT-065/orchestration-plan.md`, and Test Writer recorded Stage 2
RED evidence at `docs/work/BANDIT-065/red-evidence.md` with focused RED tests
in `test/orchestrator-prompts.test.mjs`. Codex PM recorded a Stage 3 Claude
Process Adapter dispatch attempt at `docs/work/BANDIT-065/dispatch.md` and
`docs/work/BANDIT-065/dispatch-attempt.md`; the process produced no terminal
output, source changes, writer report, or implementation evidence before it was
terminated. A later Claude retry completed Stage 3 implementation and recorded
`docs/work/BANDIT-065/writer-report.md` and
`docs/work/BANDIT-065/implementation-evidence.md`; Codex PM accepted Stage 3 in
`docs/work/BANDIT-065/stage3-pm-review.md`.

This work item scopes only a non-authoritative, harness-portable Work Item PM
orchestrator prompt contract and validation path. It does not approve Trust
Verifier cutover, select a Trust Goal, replace or wrap old gate paths, generate
role input packets, generate execution packets, restart Pi/Aperture runtime
work, or start unrelated cockpit product work.

**Active work item:** `BANDIT-065`.

The current stage is Stage 4: pre-landing review required.

**Current next action:** Run Stage 4 pre-landing review for `BANDIT-065`:
CodeRabbit pre-PR review or provider-refusal evidence, Local Qwen adversarial
review, layered risk-classification and supply-chain gate evidence, finding
dispositions if any, and aggregate review evidence before Stage 5 landing.

## Required Operator Input

No operator-owned input is required for the current Stage 4 review step.
Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve business tradeoffs,
approve explicit cost/risk posture, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-065` is active, formation-approved, plan-mode recorded, RED recorded,
and Stage 3 implementation accepted. Its brief, formation review artifacts,
orchestration plan, RED evidence, dispatch packet, dispatch-attempt evidence,
writer report, implementation evidence, Stage 3 PM review, and coordination log
are recorded under `docs/work/BANDIT-065/`.
The active gap ledger entry links
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` to `BANDIT-065` as an
`active_chore`.

Do not start landing, closeout, Trust Verifier cutover, role input or execution
packet implementation, Pi/Aperture runtime work, or unrelated cockpit product
work before current Stage 4 review evidence and finding dispositions exist for
`BANDIT-065`.

`BANDIT-064` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-064/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-064/landing-action.md`.

`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE` is resolved by `BANDIT-064`;
the gap ledger points to `docs/work/BANDIT-064/retrospective.md`.

`BANDIT-063` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION`.

`BANDIT-062` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA`.

`BANDIT-061` is landed and closed out. It resolved
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`.

`BANDIT-060` is landed and closed out. It resolved
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT`.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` is active through `BANDIT-065`.
The harness-agnostic trust-layer decision superseded the Pi/Aperture
harness-specific implementation queue, so this work item is bounded to a
trust-layer-compatible orchestrator-prompt contract.
