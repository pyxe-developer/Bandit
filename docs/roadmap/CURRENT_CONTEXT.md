# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-064` is landed and closed out. It delivered the bounded
Trust Verifier Cutover Gate Triage bootstrap-policy chore under
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`: repo-native cutover-gate
policy at `.bandit/policy/trust-verifier-cutover-gates.json`, fail-closed
validator support, `bandit trust cutover-gates validate`, validation/init/path
wiring, and the current no-cutover-approved disposition. It does not approve
Trust Verifier cutover, select a Trust Goal, replace an old gate path, wrap an
old gate path, or move old gate authority.

Stage 1 brief, formation review, and Work Item PM plan-mode evidence are
recorded under `docs/work/BANDIT-064/`. Stage 2 RED evidence is recorded at
`docs/work/BANDIT-064/red-evidence.md` and
`docs/artifact-inputs/BANDIT-064-red-evidence.json`. Stage 3 implementation
evidence is recorded at `docs/work/BANDIT-064/implementation-evidence.md`,
`docs/work/BANDIT-064/writer-report.md`, and
`docs/work/BANDIT-064/stage3-pm-review.md`. Stage 4 review evidence is
recorded at `docs/work/BANDIT-064/review-evidence.md`, with Local Qwen pass
evidence and CodeRabbit provider-timeout replacement evidence. Stage 5
safe-to-land verdict evidence is recorded at
`docs/work/BANDIT-064/landing-verdict.md`. Local-record landing action
evidence is recorded at `docs/work/BANDIT-064/landing-action.md`. Stage 6
chore disposition, retrospective, and bootstrap-gap disposition evidence is
recorded at `docs/work/BANDIT-064/chore-disposition.md`,
`docs/work/BANDIT-064/retrospective.md`, and
`docs/artifact-inputs/BANDIT-064-retrospective.json`.

The gap ledger marks `BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE` resolved.

**Active work item:** none.

The current stage is Interstitial: work-item creation or Repo PM triage
required.

**Current next action:** Repo PM should triage the remaining
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` source-material gap into a
bounded work item or record an explicit no-action/deferred disposition before
unrelated cockpit product work begins.

Do not approve Trust Verifier cutover, select a Trust Goal, replace or wrap any
old gate path, start unrelated cockpit product work, Pi/Aperture agent-scope
schema/projection work, role input or execution packet work, or role-scoped
workflow implementation unless Repo PM first scopes a new work item and the
normal Bandit formation and sequencing gates are satisfied.

No operator-owned input is required for completed `BANDIT-064` closeout. Halt
for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, or make another policy/product decision repo artifacts
cannot answer.

## Required Operator Input

No operator-owned input is required for the current interstitial state.

## Active Work

No active work item is selected.

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

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains queued source material.
The harness-agnostic trust-layer decision superseded the Pi/Aperture
harness-specific implementation queue, so remaining role-scoped orchestration
work needs Repo PM scoping into a bounded trust-layer or orchestrator-prompt
work item before execution.
