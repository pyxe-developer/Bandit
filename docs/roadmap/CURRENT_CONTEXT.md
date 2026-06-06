# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-060` is active. Repo PM created the Artifact Input Directory Split
work item from
`docs/specs/BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT.json` and linked
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` as the active bootstrap chore.
Stage 1 brief evidence is recorded at `docs/work/BANDIT-060/brief.md`;
`docs/work/BANDIT-060/coordination-log.jsonl` records the `brief_created`
transition and the earlier CodeRabbit provider blocker. Local Qwen formation
review passed at `docs/work/BANDIT-060/qwen-formation-review.md`; CodeRabbit
formation review completed on retry with zero findings at
`docs/work/BANDIT-060/coderabbit-formation-review.md`; aggregate formation
review passes at `docs/work/BANDIT-060/formation-review.md`; and the CLI-owned
`formation_approved` transition is recorded in
`docs/work/BANDIT-060/coordination-log.jsonl`.

`BANDIT-059` is landed and closed out. It delivered the Trust Verify Snapshot
Foundation bootstrap-gap chore under
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION`: compatibility-mode
`bandit trust verify <snapshot.json>`, Work Item Snapshot schema validation,
deterministic snapshot hashing, local evidence digest verification,
reviewer-finding routing validation, Trust Verdict derivation, deterministic
JSON report output, and explicit `--report` write behavior. Stage 6
retrospective, improvement disposition, and gap disposition are recorded at
`docs/work/BANDIT-059/retrospective.md`, and the gap ledger marks
`BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` resolved.

**Active work item:** `BANDIT-060` - Artifact Input Directory Split.

The accepted architecture boundary remains that Bandit is the deterministic CLI
trust layer for agentic software delivery. Harnesses and orchestrator prompts
may own live orchestration, agents, queues, auth, and status if they can call
Bandit's CLI and produce CLI-verifiable evidence.

**Current next action:** Create Stage 2 RED evidence for `BANDIT-060` through
the Test Writer boundary.

Do not create implementation branches, Trust Verifier cutover work,
Pi/Aperture agent-scope schema/projection work, role input packet work,
execution packet work, or unrelated cockpit product work until `BANDIT-060`
records Stage 2 RED evidence. If Codex authors or materially edits the Stage 2
RED tests, Stage 3 implementation must be dispatched to Claude through the
bootstrap Process Adapter path, and the Stage 3 Writer must not edit tests,
test helpers, fixtures, RED evidence, acceptance mappings, or canonical
historical work evidence except as explicitly scoped in the dispatch packet.

The current stage is Stage 2 RED evidence pending. The completed CodeRabbit
retry verified that the brief is narrow, verifiable, clean-code/rubric
evaluable, compatible with the Trust Verifier Compatibility Period, and bounded
to path/type semantics for artifact-renderer inputs, reviewer captures,
work/gap specs, and trust snapshot fixtures. `node ./bin/bandit.mjs
work-item-pm start BANDIT-060` passes after formation approval and confirms the
work item is ready for Test Writer-owned Stage 2 work.

## Active Work

**Active work item:** `BANDIT-060` - Artifact Input Directory Split.

`BANDIT-060` is the active work item. Its Stage 1 brief is recorded at
`docs/work/BANDIT-060/brief.md`; its coordination log is recorded at
`docs/work/BANDIT-060/coordination-log.jsonl`. Local Qwen and CodeRabbit
formation reviews passed with zero findings, aggregate formation review passes,
and `formation_approved` is recorded. The earlier blocked coordination
transition remains historical evidence; the next stage is Stage 2 RED evidence.

`BANDIT-059` is closed. Its closeout evidence is recorded at
`docs/work/BANDIT-059/retrospective.md`; local-record landing evidence is
recorded at `docs/work/BANDIT-059/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains source material, but the
load-bearing direction has changed. Single-session orchestration is now an
orchestrator-prompt pattern that external harnesses may run; Bandit's product
boundary is the CLI-verifiable trust contract that determines whether the
resulting work can proceed or land.

Do not start implementation, Trust Verifier cutover, Pi/Aperture
agent-scope work, role input packet work, execution packet work, or unrelated
cockpit product work until `BANDIT-060` records Stage 2 RED evidence.

## Priority

1. Create Stage 2 RED evidence for `BANDIT-060` through the Test Writer
   boundary.
2. If Codex authors or materially edits the Stage 2 RED tests, route Stage 3
   implementation to Claude through the bootstrap Process Adapter path and
   preserve the Permanent Test Ownership Boundary.
3. Keep the chore bounded to explicit artifact-input path/type semantics:
   work/gap specs, artifact-renderer command inputs, reviewer/provider captures,
   and trust snapshot fixtures.
4. Preserve canonical Markdown evidence, append-only lifecycle/coordination
   evidence, and repo-native roadmap/current-context authority; JSON command
   inputs must not become canonical workflow state.
5. Keep `bandit trust verify` in the Trust Verifier Compatibility Period until
   a later per-trust-goal cutover decision has reproducible parity evidence.
6. Keep unrelated Phase 8 cockpit product work, role input packet work,
   execution packet work, and Pi/Aperture agent-scope work blocked while open
   bootstrap gaps remain active or queued.

## Required Operator Input

No operator-owned input is required for the recorded Stage 2 RED evidence next
action. Repo artifacts identify the active bootstrap gap, current Stage Rubric
requirements, Clean-Code authority, Formation Gate boundary, Trust Verifier
Compatibility Period boundary, artifact-input ambiguity, reviewer capture
ambiguity, work/gap spec boundary, and Codex PM/Repo PM authority to route
routine cleanup mechanics.

Ask the operator only if the proposed work item would expand into product
direction, UAT policy, workflow policy beyond explicit artifact-input path
semantics, business tradeoffs, explicit cost/risk posture, provider-pricing
approval, spend-class approval, paid reviewer promotion, recurring paid routing
policy, external service setup, live routing policy, claim authority, worktree
lifecycle authority, installed global skill contents, dependency or lockfile
policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader
cockpit/product scope.
