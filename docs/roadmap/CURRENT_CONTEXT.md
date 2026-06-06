# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-060` is active. Repo PM created the Artifact Input Directory Split
work item from
`docs/specs/BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT.json` and linked
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` as the active bootstrap chore.
Stage 1 brief evidence, formation review, `formation_approved`, Stage 2 RED
evidence, and Claude Stage 3 Writer evidence are recorded in the
`docs/work/BANDIT-060/` package and coordination log.

Codex PM/Test Writer reconciled the Stage 3 PM acceptance blockers. The older
artifact-create test contract now uses `docs/artifact-inputs/` for future
artifact-renderer command inputs, while `test/artifact-inputs.test.mjs` still
proves future `docs/specs/` artifact-renderer inputs fail closed and legacy
`docs/specs/` paths remain readable only when explicitly marked legacy. Codex
PM Stage 3 acceptance review now passes at
`docs/work/BANDIT-060/stage3-pm-review.md`.

The Writer write-surface mismatch is dispositioned as non-blocking for Stage 3
because the dispatch packet explicitly allowed `.bandit/policy/artifact-inputs.json`,
the directory markers are inert preferred-directory support files, and the
Stage 3 Writer did not edit Test Writer-owned surfaces. The contract-hardening
follow-up is recorded as
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` in
`.bandit/bootstrap-gaps.json` and must not be started before `BANDIT-060`
lands.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`, and the gap ledger marks it
resolved.

**Active work item:** `BANDIT-060` - Artifact Input Directory Split.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

Stage 4 CodeRabbit pre-PR review, Codex PM finding disposition, bounded repair,
Codex PM repair acceptance, Local Qwen adversarial review, layered
risk-classification evidence, supply-chain gate evidence, aggregate Stage 4
review evidence, and Stage 5 landing verdict evidence are recorded. Local Qwen review at
`docs/work/BANDIT-060/local-qwen-review.md` has a `pass` verdict and no
findings; aggregate review evidence at
`docs/work/BANDIT-060/review-evidence.md` records `pass` with current
review-subject hash
`caa7d2d515f3c1fb3c3d7db5ef2d7311c3aa41fe235b78ba7bdcb33d252ab274`. Stage 5
landing verdict evidence at `docs/work/BANDIT-060/landing-verdict.md` records
`safe-to-land`; `npm run bandit -- land-check BANDIT-060` and
`npm run bandit -- auto-land-check BANDIT-060` pass.

**Current next action:** Run the local-record landing action for `BANDIT-060`
and record landing action evidence.

Do not proceed to closeout, Trust Verifier cutover, Pi/Aperture agent-scope
work, role input packet work, execution packet work, the queued role-contract
write-surface gap, or unrelated cockpit product work until local-record landing
action evidence is recorded in `docs/work/BANDIT-060/landing-action.md`.

The current stage is Stage 5 landing action pending. Stage 3 implementation is
accepted, Stage 4 aggregate review evidence passes, Stage 5 landing verdict
evidence records `safe-to-land`, but `BANDIT-060` is not landed until the
local-record landing action completes and `docs/work/BANDIT-060/landing-action.md`
records the commit SHA.

## Active Work

**Active work item:** `BANDIT-060` - Artifact Input Directory Split.

`BANDIT-060` is the active work item. Its Stage 1 brief is recorded at
`docs/work/BANDIT-060/brief.md`; its coordination log is recorded at
`docs/work/BANDIT-060/coordination-log.jsonl`. Local Qwen and CodeRabbit
formation reviews passed with zero findings, aggregate formation review passes,
`formation_approved` is recorded, Stage 2 RED evidence is recorded, Claude
Stage 3 Writer evidence is recorded, and Codex PM Stage 3 acceptance review
passes after Test Writer contract reconciliation. Stage 4 CodeRabbit pre-PR
review is recorded at `docs/work/BANDIT-060/coderabbit-review.md` with eight
findings. Codex PM disposition is recorded at
`docs/work/BANDIT-060/coderabbit-finding-disposition.md`; bounded repair
evidence is recorded at
`docs/work/BANDIT-060/stage4-coderabbit-repair-writer-report.md`, and Codex PM
repair acceptance is recorded at
`docs/work/BANDIT-060/stage4-repair-acceptance.md`. Local Qwen review is
recorded at `docs/work/BANDIT-060/local-qwen-review.md` with a `pass` verdict
and no findings. Aggregate Stage 4 review evidence is recorded at
`docs/work/BANDIT-060/review-evidence.md` with layered risk and supply-chain
gate evidence. Stage 5 landing verdict evidence is recorded at
`docs/work/BANDIT-060/landing-verdict.md`, rendered from
`docs/artifact-inputs/BANDIT-060-landing-verdict.json`; the local-record landing
action is the next required gate.

`BANDIT-059` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-059/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-059/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

Do not start Trust Verifier cutover, Pi/Aperture agent-scope work, role input
packet work, execution packet work, the queued role-contract write-surface gap,
or unrelated cockpit product work while `BANDIT-060` is in Stage 5 landing
action pending.

## Priority

1. Run the local-record landing action for `BANDIT-060` and record landing
   action evidence.
2. Preserve the Permanent Test Ownership Boundary: the Stage 3 Writer has zero
   authority to edit tests, test helpers, fixtures, RED evidence, acceptance
   mappings, or canonical historical evidence outside the scoped dispatch
   packet.
3. Keep the chore bounded to explicit artifact-input path/type semantics:
   work/gap specs, artifact-renderer command inputs, reviewer/provider captures,
   and trust snapshot fixtures.
4. Preserve canonical Markdown evidence, append-only lifecycle/coordination
   evidence, and repo-native roadmap/current-context authority; JSON command
   inputs must not become canonical workflow state.
5. Keep `bandit trust verify` in the Trust Verifier Compatibility Period until
   a later per-trust-goal cutover decision has reproducible parity evidence.
6. Keep unrelated Phase 8 cockpit product work, role input packet work,
   execution packet work, Pi/Aperture agent-scope work, and queued bootstrap
   gaps blocked while `BANDIT-060` remains active.

## Required Operator Input

No operator-owned input is required for the recorded local-record landing action
next action.
Repo artifacts identify the active bootstrap gap, current Stage Rubric
requirements, Clean-Code authority, Formation Gate boundary, Trust Verifier
Compatibility Period boundary, artifact-input taxonomy, reviewer capture
boundary, work/gap spec boundary, Test Writer ownership, Permanent Test
Ownership Boundary, the recorded Stage 4 review gates, the recorded Stage 5
landing verdict gate, and the required local-record landing action.

Ask the operator only if the proposed work item would expand into product
direction, UAT policy, workflow policy beyond explicit artifact-input path
semantics, business tradeoffs, explicit cost/risk posture, provider-pricing
approval, spend-class approval, paid reviewer promotion, recurring paid routing
policy, external service setup, live routing policy, claim authority, worktree
lifecycle authority, installed global skill contents, dependency or lockfile
policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader
cockpit/product scope.
