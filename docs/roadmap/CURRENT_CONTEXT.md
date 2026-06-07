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

`BANDIT-062` is active for
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA`. The Stage 1 brief
is recorded at `docs/work/BANDIT-062/brief.md`; Local Qwen formation review
passed at `docs/work/BANDIT-062/qwen-formation-review.md`; CodeRabbit formation
review timed out and is recorded as provider-timeout/bootstrap-gap replacement
evidence at `docs/work/BANDIT-062/coderabbit-formation-review.md`; aggregate
formation review passes at `docs/work/BANDIT-062/formation-review.md`; and the
CLI-owned `formation_approved` transition is recorded in
`docs/work/BANDIT-062/coordination-log.jsonl`. Stage 2 RED evidence is recorded
at `docs/work/BANDIT-062/red-evidence.md` and
`docs/artifact-inputs/BANDIT-062-red-evidence.json`; the coordination log records
the `red_recorded` transition. The Stage 3 dispatch packet is recorded at
`docs/work/BANDIT-062/dispatch.md`. Stage 3 Claude implementation evidence is
recorded at `docs/work/BANDIT-062/implementation-evidence.md`,
`docs/work/BANDIT-062/writer-report.md`, and
`docs/role-runs/BANDIT-062/stage3-implementation.json`; bounded Claude
manifest repairs are recorded at
`docs/work/BANDIT-062/stage3-manifest-repair-dispatch.md` and
`docs/work/BANDIT-062/stage3-base-revision-repair-dispatch.md`; Codex PM
acceptance is recorded at `docs/work/BANDIT-062/stage3-pm-review.md`.
CodeRabbit Stage 4 review timed out without a terminal provider verdict and is
recorded at `docs/work/BANDIT-062/coderabbit-review.md` with partial JSONL at
`docs/artifact-inputs/BANDIT-062-coderabbit-review-output.jsonl`. Local Qwen
passed at `docs/work/BANDIT-062/local-qwen-review.md`. Layered
risk-classification and supply-chain gate evidence are recorded at
`.bandit/policy/risk-classifications/BANDIT-062-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-062-supply-chain-gate.json`; those
policy files changed the review subject, so a Local Qwen refresh is required
before aggregate Stage 4 review evidence. The refreshed Local Qwen review
returned non-blocking findings at `docs/work/BANDIT-062/local-qwen-review.md`,
and Codex PM dispositioned them as no-source-repair at
`docs/work/BANDIT-062/qwen-finding-disposition.md`. Aggregate Stage 4 review
evidence is recorded at `docs/work/BANDIT-062/review-evidence.md`.
Stage 5 safe-to-land verdict evidence is recorded at
`docs/work/BANDIT-062/landing-verdict.md`.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is queued behind the
replacement-metadata serializer gap. It records the operator-directed
requirement that, after Work Item PM reads the brief and grounds itself in
current repo state, it must enter a plan-mode gate and produce durable
orchestration-plan evidence before Stage 2 RED evidence or full orchestration
begins.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`, and the gap ledger marks it
resolved.

**Active work item:** `BANDIT-062`.

The current stage is Stage 5: Landing action required.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Run the local-record landing action for `BANDIT-062`
and record landing action evidence.

Do not create Trust Verifier cutover work, create Pi/Aperture agent-scope
schema/projection work, create role input or execution packet work, create Work
Item PM plan-mode orchestration work, or start unrelated cockpit product work
until `BANDIT-062` is landed and closed out.

## Active Work

**Active work item:** `BANDIT-062`.

`BANDIT-062` is active. Its Stage 1 brief is recorded at
`docs/work/BANDIT-062/brief.md`, formation review artifacts are recorded, the
coordination log records `brief_created` and `formation_approved`, Stage 2 RED
evidence is recorded, Stage 3 Claude implementation evidence is recorded, and
Codex PM Stage 3 acceptance is recorded. CodeRabbit timeout evidence, initial
Local Qwen pass evidence, and layered risk/supply-chain policy evidence are
recorded. A refreshed Local Qwen review and finding disposition are recorded.
Aggregate Stage 4 review evidence is recorded. Stage 5 landing verdict evidence
is recorded. Local-record landing action evidence is the next required gate.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is active through
`BANDIT-062`. It must be handled and closed out before Trust Verifier cutover
work.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is a queued workflow-policy
gap. It must not preempt the serializer gap unless the operator explicitly
changes priority, but it should be handled before Trust Verifier cutover or
unrelated cockpit product work.

`BANDIT-061` is the last closed work item. Its Stage 1 brief, Stage 2 RED
evidence, Stage 3 implementation evidence, Stage 4 review evidence, Stage 5
landing verdict/action evidence, and Stage 6 retrospective closeout are
recorded under `docs/work/BANDIT-061/`.

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

1. Run the local-record landing action for `BANDIT-062` and record landing
   action evidence.
2. Keep `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` queued behind the
   serializer gap so Work Item PM plan-mode orchestration can be enforced before
   Trust Verifier cutover or unrelated cockpit work.
3. Preserve the Permanent Test Ownership Boundary and Bootstrap Model-Family
   Separation evidence recorded during Stage 3.
4. Keep the next serializer chore bounded to preserving `replacement_*` fields
   when work-item creation rewrites the bootstrap-gap ledger.
5. Preserve canonical Markdown evidence, append-only lifecycle/coordination
   evidence, and repo-native roadmap/current-context authority; JSON command
   inputs must not become canonical workflow state.
6. Keep `bandit trust verify` in the Trust Verifier Compatibility Period until
   a later per-trust-goal cutover decision has reproducible parity evidence.
7. Keep unrelated Phase 8 cockpit product work, role input packet work,
   execution packet work, Pi/Aperture agent-scope work, and Trust Verifier
   cutover blocked while bootstrap gaps remain queued or active.

## Required Operator Input

No operator-owned input is required for the current Stage 5 action. Repo
artifacts identify accepted Stage 3 implementation, CodeRabbit timeout evidence,
refreshed Local Qwen non-blocking finding disposition, current layered
risk/supply-chain policy evidence, and aggregate Stage 4 review evidence. The
required next action is local-record landing action evidence.

Ask the operator only if the proposed work item would expand into product
direction, UAT policy, workflow policy beyond explicit artifact-input path
semantics, business tradeoffs, explicit cost/risk posture, provider-pricing
approval, spend-class approval, paid reviewer promotion, recurring paid routing
policy, external service setup, live routing policy, claim authority, worktree
lifecycle authority, installed global skill contents, dependency or lockfile
policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader
cockpit/product scope.
