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

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is the next queued
bootstrap gap. It records that the current work-item creation path can drop
`replacement_gap`, `replacement_work_item`, and `replacement_evidence` fields
from replaced gaps during bootstrap-gap ledger rewrites.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`, and the gap ledger marks it
resolved.

**Active work item:** none.

The current stage is Interstitial: Work-item creation required.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Create or disposition a bounded chore spec and work
item for
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` before Trust
Verifier cutover work.

Do not create Trust Verifier cutover work, create Pi/Aperture agent-scope
schema/projection work, create role input or execution packet work, or start
unrelated cockpit product work until the queued serializer gap is handled or
explicitly dispositioned.

## Active Work

**Active work item:** none.

No active work item is currently open. `BANDIT-061` is landed and closed out.
Its Stage 1 brief is recorded at
`docs/work/BANDIT-061/brief.md`, and its coordination log records
`brief_created` and `formation_approved`. Local Qwen and CodeRabbit formation
reviews passed with zero findings after the accepted placeholder-command repair,
aggregate formation review passes, and Stage 2 RED evidence is recorded at
`docs/work/BANDIT-061/red-evidence.md`. Stage 3 Claude implementation evidence
and Codex PM acceptance are recorded. CodeRabbit Stage 4 review/disposition and
refreshed Local Qwen Stage 4 review/disposition are recorded. Layered
risk-classification, supply-chain gate evidence, aggregate Stage 4 review
evidence, Stage 5 safe-to-land verdict evidence, local-record landing action
evidence, and Stage 6 retrospective/gap disposition evidence are recorded.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is the next queued
gap discovered during `BANDIT-061` creation. It should be handled or
dispositioned before Trust Verifier cutover work.

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

1. Create or disposition a bounded chore spec and work item for
   `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` before Trust
   Verifier cutover work.
2. Preserve the Permanent Test Ownership Boundary and Bootstrap Model-Family
   Separation evidence recorded during Stage 3.
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

No operator-owned input is required for the current interstitial action. Repo
artifacts identify the next queued bootstrap gap and the required boundary:
create or disposition a bounded chore for the replacement-metadata serializer
repair before Trust Verifier cutover or unrelated cockpit product work.

Ask the operator only if the proposed work item would expand into product
direction, UAT policy, workflow policy beyond explicit artifact-input path
semantics, business tradeoffs, explicit cost/risk posture, provider-pricing
approval, spend-class approval, paid reviewer promotion, recurring paid routing
policy, external service setup, live routing policy, claim authority, worktree
lifecycle authority, installed global skill contents, dependency or lockfile
policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader
cockpit/product scope.
