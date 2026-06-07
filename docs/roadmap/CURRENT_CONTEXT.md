# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-065` is landed and closed out. It delivered the bounded
Harness-Portable Orchestrator Prompt Contract bootstrap-policy chore under
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`: repo-native orchestrator prompt
policy at `.bandit/policy/orchestrator-prompts.json`, adapter-facing prompt
template at `docs/templates/work-item-pm-orchestrator-prompt.md`, fail-closed
validator support, `bandit orchestrator-prompts validate`, validation/init/path
wiring, and focused test coverage.

Stage 1 brief and formation review evidence are recorded under
`docs/work/BANDIT-065/`. Work Item PM plan-mode evidence is recorded at
`docs/work/BANDIT-065/orchestration-plan.md`. Stage 2 RED evidence is recorded
at `docs/work/BANDIT-065/red-evidence.md`. Stage 3 implementation evidence is
recorded at `docs/work/BANDIT-065/implementation-evidence.md`,
`docs/work/BANDIT-065/writer-report.md`, and
`docs/work/BANDIT-065/stage3-pm-review.md`. Stage 4 review evidence is recorded
at `docs/work/BANDIT-065/review-evidence.md`, with CodeRabbit provider-timeout
replacement evidence and Local Qwen non-blocking findings repaired and
PM-dispositioned. Stage 5 safe-to-land verdict evidence is recorded at
`docs/work/BANDIT-065/landing-verdict.md`. Local-record landing action evidence
is recorded at `docs/work/BANDIT-065/landing-action.md`. Stage 6 chore
disposition and retrospective evidence is recorded at
`docs/work/BANDIT-065/chore-disposition.md` and
`docs/work/BANDIT-065/retrospective.md`.

The gap ledger marks
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION-ORCHESTRATOR-PROMPT` resolved by
`BANDIT-065`. The broader
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` umbrella remains an unlinked
queued candidate for remaining runtime/harness source material. The
trust-layer-compatible role-scoped workflow pieces are now landed:
`BANDIT-057` role entrypoints/formation gate, `BANDIT-058` role contracts/run
manifests, and `BANDIT-065` harness-portable orchestrator prompt contract.
Remaining role input packets, execution packets, live A2A, work queues,
scheduler, claim/worktree lifecycle, repair-continuation, and landing/closeout
handoff ideas remain source material outside Bandit's load-bearing CLI
trust-layer boundary unless a future product or trust-layer decision scopes a
new bounded work item.

**Active work item:** none.

The current stage is Interstitial: Repo PM next-work selection.

**Current next action:** Repo PM should decide whether the remaining
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` source material should become a
bounded trust-layer-compatible work item, or record explicit no-action before
unrelated cockpit product work begins.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

## Required Operator Input

No operator-owned input is required for the current interstitial state.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve business tradeoffs,
approve explicit cost/risk posture, or make another policy/product decision repo
artifacts cannot answer.

## Active Work

No active work item is selected.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains an unlinked queued
candidate. No work item is linked to it.

`BANDIT-065` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-065/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-065/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION-ORCHESTRATOR-PROMPT` is resolved
by `BANDIT-065`; the gap ledger points to
`docs/work/BANDIT-065/retrospective.md`.

`BANDIT-064` is landed and closed out. It resolved
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`.

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
