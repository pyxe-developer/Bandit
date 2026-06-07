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

`BANDIT-061` is landed and closed out. It delivered the bounded Role Contract Artifact Input Write
Surface bootstrap-gap chore under
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`. The Stage 1 brief is
created at `docs/work/BANDIT-061/brief.md`; Local Qwen formation review passed
at `docs/work/BANDIT-061/qwen-formation-review.md`; CodeRabbit formation review
completed with zero findings after the accepted placeholder-command repair at
`docs/work/BANDIT-061/coderabbit-formation-review.md`; aggregate formation
review passes at `docs/work/BANDIT-061/formation-review.md`; and the CLI-owned
`formation_approved` transition is recorded in
`docs/work/BANDIT-061/coordination-log.jsonl`. Stage 2 RED evidence is recorded
at `docs/work/BANDIT-061/red-evidence.md` and
`docs/artifact-inputs/BANDIT-061-red-evidence.json`; the coordination log
records the `red_recorded` transition. Stage 3 Claude implementation evidence
is recorded at `docs/work/BANDIT-061/implementation-evidence.md`,
`docs/work/BANDIT-061/writer-report.md`, and
`docs/role-runs/BANDIT-061/stage3-implementation.json`; Codex PM acceptance is
recorded at `docs/work/BANDIT-061/stage3-pm-review.md`. Stage 4 CodeRabbit
pre-PR review completed with two procedural findings at
`docs/work/BANDIT-061/coderabbit-review.md`; Codex PM dispositioned both as
no-source-repair at
`docs/work/BANDIT-061/coderabbit-finding-disposition.md`. Local Qwen completed
with non-blocking findings at `docs/work/BANDIT-061/local-qwen-review.md`;
Codex PM dispositioned those findings as no-source-repair at
`docs/work/BANDIT-061/qwen-finding-disposition.md`. Layered risk
classification and supply-chain gate policy evidence are recorded at
`.bandit/policy/risk-classifications/BANDIT-061-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-061-supply-chain-gate.json`. The
required Local Qwen refresh after those policy files changed the review subject
is recorded at `docs/work/BANDIT-061/local-qwen-review.md`, and Codex PM
dispositioned the refreshed findings at
`docs/work/BANDIT-061/qwen-finding-disposition.md`. Aggregate Stage 4 review
evidence is recorded at `docs/work/BANDIT-061/review-evidence.md`. Stage 5
safe-to-land verdict evidence is recorded at
`docs/work/BANDIT-061/landing-verdict.md`.
Local-record landing action evidence is recorded at
`docs/work/BANDIT-061/landing-action.md`. Stage 6 retrospective, improvement
disposition, and bootstrap-gap disposition are recorded at
`docs/work/BANDIT-061/retrospective.md`, and the gap ledger marks
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` resolved.

`BANDIT-062` is landed and closed out. It delivered the bounded Work Item
Create Replacement Metadata Preservation bootstrap-gap chore under
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA`: focused RED
coverage for replacement metadata loss during work-item creation, serializer
preservation for `replacement_gap`, `replacement_work_item`, and
`replacement_evidence`, bounded Stage 3 role-run manifest repairs, CodeRabbit
provider-timeout evidence, refreshed Local Qwen non-blocking finding
disposition, aggregate Stage 4 review evidence, Stage 5 landing verdict/action
evidence, and Stage 6 retrospective/gap disposition evidence. Stage 6
retrospective, improvement disposition, and bootstrap-gap disposition are
recorded at `docs/work/BANDIT-062/retrospective.md`, and the gap ledger marks
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` resolved.

`BANDIT-063` is landed and closed out. It delivered the bounded bootstrap-gap chore for
`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION`, which records the
operator-directed requirement that, after Work Item PM reads the brief and
grounds itself in current repo state, it must enter a plan-mode gate and produce
durable orchestration-plan evidence before Stage 2 RED evidence or full
orchestration begins.

Stage 1 brief evidence is recorded at `docs/work/BANDIT-063/brief.md`.
Formation review evidence is recorded at
`docs/work/BANDIT-063/qwen-formation-review.md`,
`docs/work/BANDIT-063/coderabbit-formation-review.md`, and
`docs/work/BANDIT-063/formation-review.md`; the CLI-owned `formation_approved`
transition is recorded at `docs/work/BANDIT-063/coordination-log.jsonl`.
Stage 2 RED evidence is recorded at `docs/work/BANDIT-063/red-evidence.md` and
`docs/artifact-inputs/BANDIT-063-red-evidence.json`; the coordination log
records the `red_recorded` transition.
Stage 3 Claude implementation evidence is recorded at
`docs/work/BANDIT-063/implementation-evidence.md`,
`docs/work/BANDIT-063/writer-report.md`,
`docs/artifact-inputs/BANDIT-063-implementation-evidence.json`, and
`docs/role-runs/BANDIT-063/stage3-implementation.json`; Codex PM acceptance is
recorded at `docs/work/BANDIT-063/stage3-pm-review.md`. The coordination log
records both the Writer `implementation_recorded` transition and the PM
acceptance transition.
Stage 4 CodeRabbit review evidence is recorded at
`docs/work/BANDIT-063/coderabbit-review.md` with zero findings; the raw
CodeRabbit terminal output summary is recorded at
`docs/artifact-inputs/BANDIT-063-coderabbit-review-output.jsonl`. Local Qwen
review evidence is recorded at `docs/work/BANDIT-063/local-qwen-review.md`
with non-blocking findings, and Codex PM disposition is recorded at
`docs/work/BANDIT-063/qwen-finding-disposition.md`. Layered risk
classification and supply-chain gate evidence are recorded at
`.bandit/policy/risk-classifications/BANDIT-063-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-063-supply-chain-gate.json`.
Aggregate Stage 4 review evidence is recorded at
`docs/work/BANDIT-063/review-evidence.md`, and the coordination log records the
aggregate review transition.
Stage 5 safe-to-land verdict evidence is recorded at
`docs/work/BANDIT-063/landing-verdict.md`.
Local-record landing action evidence is recorded at
`docs/work/BANDIT-063/landing-action.md`.
Stage 6 retrospective, improvement disposition, and bootstrap-gap disposition
evidence is recorded at `docs/work/BANDIT-063/retrospective.md`, and the gap
ledger marks `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` resolved.

`BANDIT-064` is the active bootstrap-policy chore for
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`. The Stage 1 brief is created
at `docs/work/BANDIT-064/brief.md` from
`docs/specs/BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE.json`, and the gap
ledger marks the gap active with linked work item `BANDIT-064`. The brief is
bounded to materializing the Trust Verifier Cutover Gate contract and current
no-cutover-approved disposition. It does not approve Trust Verifier cutover,
select a Trust Goal for cutover, replace or wrap an old gate path, or start RED
evidence, implementation, review, landing, closeout, role packet work, or
unrelated cockpit product work.

Stage 1 formation review evidence is recorded at
`docs/work/BANDIT-064/qwen-formation-review.md`,
`docs/work/BANDIT-064/coderabbit-formation-review.md`, and
`docs/work/BANDIT-064/formation-review.md`. Local Qwen passed with two
non-blocking findings that require no Stage 1 source repair; CodeRabbit timed
out and is recorded only as provider-timeout/bootstrap-gap replacement
evidence; aggregate formation review passes. Repo PM repaired the missing
`brief_created` coordination-log prerequisite and recorded the CLI-owned
`formation_approved` transition at
`docs/work/BANDIT-064/coordination-log.jsonl`.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`, and the gap ledger marks it
resolved.

**Active work item:** `BANDIT-064`.

The current stage is Stage 1: formation approved; Work Item PM plan-mode
evidence required before Stage 2 RED evidence.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Work Item PM should draft
`docs/work/BANDIT-064/orchestration-plan.md` and then run
`node ./bin/bandit.mjs work-item-pm start BANDIT-064` before Stage 2 begins.

Do not write Stage 2 RED evidence, dispatch implementation, start Trust
Verifier cutover, replace or wrap any old gate path, start unrelated cockpit
product work, Pi/Aperture agent-scope schema/projection work, role input or
execution packet work, or role-scoped workflow implementation until the
`orchestration_plan_recorded` transition is recorded.

## Active Work

**Active work item:** `BANDIT-064`.

`BANDIT-064` is queued at Stage 1 with its brief created at
`docs/work/BANDIT-064/brief.md`. The linked active gap is
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`; `.bandit/events.jsonl`
records `work_item_created` for `BANDIT-064`, and
`.bandit/bootstrap-gaps.json` marks the gap `active_chore`. Formation review
evidence is recorded and passes with CodeRabbit provider-timeout replacement
evidence. `docs/work/BANDIT-064/coordination-log.jsonl` now records both the
`brief_created` prerequisite and the CLI-owned `formation_approved` transition.
The next action is Work Item PM plan-mode evidence only.

Do not start Stage 2 RED evidence, implementation dispatch, Trust Verifier
cutover, old-gate replacement/wrapping, role packet work, or unrelated cockpit
product work before `orchestration_plan_recorded` is recorded.

`BANDIT-063` is landed and closed out. Its Stage 1 brief, formation review,
Stage 2 RED evidence, Stage 3 implementation evidence, Stage 4 review evidence,
Stage 5 landing verdict/action evidence, and Stage 6 retrospective closeout are
recorded under `docs/work/BANDIT-063/`.

`BANDIT-062` is landed and closed out. Its Stage 1 brief, Stage 2 RED evidence,
Stage 3 implementation evidence, Stage 4 review evidence, Stage 5 landing
verdict/action evidence, and Stage 6 retrospective closeout are recorded under
`docs/work/BANDIT-062/`.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is resolved by
`BANDIT-062`; the gap ledger marks it resolved and points to
`docs/work/BANDIT-062/retrospective.md`.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is resolved by
`BANDIT-063`; the gap ledger marks it resolved and points to
`docs/work/BANDIT-063/retrospective.md`.

`BANDIT-061` is closed. Its Stage 1 brief, Stage 2 RED evidence, Stage 3
implementation evidence, Stage 4 review evidence, Stage 5 landing
verdict/action evidence, and Stage 6 retrospective closeout are recorded under
`docs/work/BANDIT-061/`.

`BANDIT-060` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-060/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-060/landing-action.md`.

`BANDIT-059` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-059/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-059/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

## Priority

1. Record Work Item PM plan-mode evidence for `BANDIT-064` before RED evidence,
   implementation, Trust Verifier cutover, old-gate replacement/wrapping, or
   unrelated cockpit product work.
2. Preserve the Work Item PM plan-mode gate: after brief/current-state
   grounding and before Stage 2 RED evidence or full orchestration.
3. Preserve the Permanent Test Ownership Boundary and Bootstrap Model-Family
   Separation evidence recorded during `BANDIT-063`.
4. Keep the serializer repair outcome stable: work-item creation must preserve
   `replacement_*` fields when it rewrites the bootstrap-gap ledger.
5. Preserve canonical Markdown evidence, append-only lifecycle/coordination
   evidence, and repo-native roadmap/current-context authority; JSON command
   inputs must not become canonical workflow state.
6. Keep `bandit trust verify` in the Trust Verifier Compatibility Period until
   a later per-trust-goal cutover decision has reproducible parity evidence.
7. Keep unrelated Phase 8 cockpit product work, role input packet work,
   execution packet work, Pi/Aperture agent-scope work, and actual Trust
   Verifier cutover blocked while bootstrap gaps remain queued or active.

## Required Operator Input

No operator-owned input is required for `BANDIT-064` formation review. Halt for
operator input if the next step would approve Trust Verifier cutover policy,
select a Trust Goal for cutover, replace or wrap an older gate path, or make
another policy decision that repo artifacts cannot answer.

Ask the operator only if the proposed work item would expand into product
direction, UAT policy, workflow policy beyond explicit artifact-input path
semantics, business tradeoffs, explicit cost/risk posture, provider-pricing
approval, spend-class approval, paid reviewer promotion, recurring paid routing
policy, external service setup, live routing policy, claim authority, worktree
lifecycle authority, installed global skill contents, dependency or lockfile
policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader
cockpit/product scope.
