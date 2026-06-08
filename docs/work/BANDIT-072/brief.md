# BANDIT-072: Replay Regression Corpus

## Status

Brief Created

work_type: chore

## Non-Product Work

Turn historical Bandit workflow failures into replay-only verification packets so current gates can prove they still catch old failure modes.

## Origin

Operator direction on 2026-06-07 asked to add the remaining verification-layer opportunities to the roadmap after the Test Strength / Mutation Adequacy Gate and Verification Oracle Provenance Gate. The earlier verification-layer review identified a replay regression corpus as the next hardening opportunity: stale review hashes, provider timeouts, dirty worktrees, dropped bootstrap metadata, parser wording drift, weak reviewer dispositions, stale routing text, and similar known Bandit failures should become deterministic replay packets.

Live repo evidence now authorizes this chore: `BANDIT-071` is landed and closed out, `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is resolved, and `.bandit/bootstrap-gaps.json` links `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` to `BANDIT-072` as the active bootstrap gap.

## Scope

- Define a repo-native replay regression corpus for historical Bandit workflow failures.
- Classify replay packets by failure mode, source artifact, expected gate, expected verdict, and policy version.
- Keep packets replay-only: they must not affect live work, reviewer routing, model routing, landing authority, UAT, merge/push/deploy behavior, cost policy, or Trust Verifier cutover without a separate approved decision.
- Add validation or trust-verifier-compatible behavior that can execute replay packets and prove current gates still fail closed on known failure modes.
- Require explicit no-action or bootstrap disposition when a historical failure is not worth turning into a packet.
- Keep this chore focused on replay packet policy, fixtures, validators, command output, docs, and tests.

## Out Of Scope

- Do not use replay packets to mutate live workflow state, gap-ledger state, coordination history, claims, reviewer routing, model routing, landing authority, UAT status, merge/push/deploy behavior, or cost policy.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or make replay corpus output canonical verifier authority for live work in this chore.
- Do not build live reviewer calibration, paid reviewer routing, model routing promotion, public benchmark publication, hosted replay services, telemetry, or external reporting.
- Do not start Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, Spec-To-Evidence Traceability Matrix, or unrelated Phase 8 product work until `BANDIT-072` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Do not treat historical chat memory as packet authority when repo artifacts can identify the failure source; packet source metadata must point to repo artifacts or explicit no-action disposition.

## Acceptance Criteria

- The chore brief exists at `docs/work/BANDIT-072/brief.md` and links to `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` as the active bootstrap gap.
- A repo-native policy or design artifact defines replay packet schema, failure-mode taxonomy, expected verdict semantics, source metadata, freshness/versioning, replay execution semantics, and replay-only boundaries.
- At least the historically recurring Bandit failure classes are represented or explicitly dispositioned: stale review subject hash, provider timeout/refusal, dirty worktree, dropped bootstrap metadata, parser wording drift, weak reviewer disposition, and stale routing text.
- Replay execution produces deterministic machine-readable output and fails closed when expected blockers are missed.
- Replay packets cannot change live workflow state, claim authority, reviewer routing, model routing, landing authority, UAT, merge/push/deploy behavior, Trust Verifier cutover, or cost policy.
- Stage 4 review and Stage 5 landing evidence can reference replay corpus results only as supplemental regression evidence; replay results do not replace required live evidence, reviewer evidence, UAT evidence, risk evidence, supply-chain evidence, or landing evidence.
- Replay packet fixtures have explicit source artifacts, expected gate, expected verdict, policy version, and no-live-routing/no-policy-promotion metadata.
- Validation, focused tests, and replay command output cover stale review hash, provider timeout/refusal, dirty worktree, dropped bootstrap metadata, parser wording drift, weak reviewer disposition, stale routing text, malformed packets, unsupported packet versions, and read-only execution.
- The implementation preserves Bandit's CLI authority, repo-native canonical artifacts, supply-chain gate expectations, layered risk classification, operator fail-closed boundary, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and replay-only benchmark boundary.
- `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is resolved only after landing action and retrospective closeout evidence exist for this bounded gate chore.

## Verification Plan

- Run focused RED/GREEN tests for replay packet schema validation and deterministic replay output.
- Run tests proving known failure packets fail closed when the relevant gate would miss the blocker.
- Run tests proving replay execution is read-only and cannot mutate live Bandit state, coordination logs, gap ledger routing, claims, reviewer routing, model routing, landing authority, UAT, merge/push/deploy behavior, or cost policy.
- Run tests proving stale, malformed, unsupported, missing-source, missing-policy-version, or expected-verdict-mismatch replay packets fail closed with clear diagnostics.
- Run tests proving Stage 4 and Stage 5 evidence can reference replay corpus results only as supplemental evidence and cannot substitute for required live evidence.
- Run tests proving replay packet selection remains repo-derived and failure-mode stratified before any generic benchmark packets are allowed.
- Run `npm run typecheck`.
- Run focused replay corpus tests, expected initially RED during Stage 2 and GREEN after Stage 3.
- Run `npm test` when implementation touches shared validators, trust verify, landing gates, templates, command routing, policy parsing, or reviewer evidence surfaces.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-072` for aggregate review evidence freshness once implementation changes exist.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-072 --base origin/main` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run Local Qwen only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- land-check BANDIT-072` before landing.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before repairing this brief. This chore must keep replay packet policy, schema parsing, fixture loading, deterministic replay execution, machine-readable output, expected-verdict comparison, and read-only guardrails small, explicit, locally testable, and separated so reviewers can distinguish replay evidence from canonical live workflow authority.

## Expected Files

- docs/specs/BANDIT-GAP-REPLAY-REGRESSION-CORPUS.json
- docs/work/BANDIT-072/brief.md
- docs/work/BANDIT-072/qwen-formation-review.md
- docs/work/BANDIT-072/coderabbit-formation-review.md
- docs/work/BANDIT-072/formation-review.md
- docs/work/BANDIT-072/coordination-log.jsonl
- docs/work/BANDIT-072/red-evidence.md
- docs/work/BANDIT-072/implementation-evidence.md
- docs/work/BANDIT-072/coderabbit-review.md
- docs/work/BANDIT-072/local-qwen-review.md
- docs/work/BANDIT-072/review-evidence.md
- docs/work/BANDIT-072/landing-verdict.md
- docs/work/BANDIT-072/landing-action.md
- docs/work/BANDIT-072/retrospective.md
- .bandit/policy/replay-regression-corpus.json
- docs/replay-packets/
- src/state/replay-regression-corpus.ts
- src/commands/replay-regression-corpus.ts
- test/replay-regression-corpus.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-072/brief.md
- docs/work/BANDIT-072/qwen-formation-review.md
- docs/work/BANDIT-072/coderabbit-formation-review.md
- docs/work/BANDIT-072/formation-review.md
- docs/work/BANDIT-072/coordination-log.jsonl
- docs/work/BANDIT-072/red-evidence.md
- docs/work/BANDIT-072/implementation-evidence.md
- docs/work/BANDIT-072/coderabbit-review.md
- docs/work/BANDIT-072/local-qwen-review.md
- docs/work/BANDIT-072/review-evidence.md
- docs/work/BANDIT-072/landing-verdict.md
- docs/work/BANDIT-072/landing-action.md
- docs/work/BANDIT-072/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. Codex PM owns replay packet scope, fixture selection from repo history, failure-mode taxonomy, validator shape, deterministic output shape, test strategy, and review routing.

Halt only if implementation would approve Trust Verifier cutover, select a Trust Goal for cutover, replace or wrap old gates, change product direction, change UAT policy, change business tradeoffs, approve explicit cost/risk posture, approve paid/external tooling, approve live reviewer/model routing, approve public benchmark publication, approve merge/push/deploy authority, or expand into unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, replay packet acceptance mappings, expected-verdict mappings, replay-only boundary tests, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, or acceptance mappings for this Work Item.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires Claude-family Stage 3 implementation, and verification escalation returns to Codex PM because Claude authored the implementation.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing verdict/action evidence. Closeout Agent/Codex PM owns Stage 6 retrospective and closeout evidence.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json
stages:
- stage1_brief
- formation_review
- stage2_red_evidence
- stage3_implementation
- stage4_review
- stage5_landing
- stage6_retrospective
authority_roles:
- codex_pm
- repo_pm
- test_writer
- implementation_writer
- reviewer
- landing_agent
- closeout_agent
allowed_tools:
- local shell commands
- Bandit CLI commands
- Node test runner
- TypeScript typecheck
- Local Qwen through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`
- CodeRabbit CLI when available
inputs:
- docs/specs/BANDIT-GAP-REPLAY-REGRESSION-CORPUS.json
- .bandit/bootstrap-gaps.json
- repo-local historical work artifacts under docs/work/
- repo-local policy, validator, reviewer, and landing evidence artifacts
outputs:
- replay corpus policy or design artifact
- replay packet fixtures
- deterministic replay validation output
- focused RED/GREEN tests
- stage evidence artifacts under docs/work/BANDIT-072/
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not let replay packets mutate live workflow state.
- Do not let replay corpus results replace required live review, UAT, landing, risk, supply-chain, or operator-owned approvals.
- Do not approve Trust Verifier cutover, paid routing, merge, push, deploy, public benchmark publication, or unrelated cockpit/product scope in this chore.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Replay corpus design should prefer deterministic local fixtures, repo-native source artifacts, and local tests over paid services, live model routing, or hosted benchmarks.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation, provider-timeout, or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid reviewer/model routes, hosted benchmark services, public benchmark publishing, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If historical failure evidence is not repo-grounded enough to become a packet, record explicit no-action or bootstrap disposition instead of inventing source authority.
- If replay execution would need to mutate live workflow state to simulate a failure, change the packet shape or fixture harness; do not mutate canonical state.
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Source-Of-Truth And Replay Boundary

- Repo-native `.bandit/` state, `docs/work/`, `docs/specs/`, `docs/roadmap/`, and CLI command output remain canonical.
- Replay packets are fixtures and regression evidence only. They may project known failure scenarios into deterministic validation checks, but they do not own active work state, gap state, claim authority, reviewer routing, model routing, landing authority, UAT state, merge/push/deploy behavior, or cost policy.
- Replay execution must be read-only against live repo workflow state. If a packet needs mutable state, it must use isolated fixture data.
- Replay corpus output may be referenced by future review or landing evidence only with source artifact, policy version, command version, and freshness metadata.
- Any future use of replay corpus results for Trust Verifier cutover, live routing, reviewer promotion, model routing, or workflow policy change requires a separate Codex PM decision and any operator-owned approval required by policy.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-071` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, source-of-truth and replay boundary, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover schema validation, deterministic output, read-only execution, stale review hash, provider timeout/refusal, dirty worktree, dropped bootstrap metadata, parser wording drift, weak reviewer disposition, stale routing text, malformed packets, unsupported versions, and supplemental-evidence boundaries.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-REPLAY-REGRESSION-CORPUS`, linked to `BANDIT-072` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` remains queued behind this chore and must not start until `BANDIT-072` lands and closes out or the replay corpus gap is explicitly dispositioned.
- Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind the determinism gate.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Public benchmark publication, paid reviewer/model routing, hosted replay services, telemetry, Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving replay packet schema validation requires failure mode, source artifacts, expected gate, expected verdict, policy version, command version or verifier version, and replay-only metadata.
- Write RED tests proving deterministic machine-readable replay output has stable ordering, stable verdict values, and clear diagnostics for expected-blocker misses.
- Write RED tests proving stale review subject hash, provider timeout/refusal, dirty worktree, dropped bootstrap metadata, parser wording drift, weak reviewer disposition, and stale routing text are represented as packets or explicitly dispositioned.
- Write RED tests proving replay execution is read-only against live `.bandit/`, `docs/work/`, `docs/roadmap/`, claim, reviewer, landing, and UAT state.
- Write RED tests proving malformed, unsupported, missing-source, missing-policy-version, and expected-verdict-mismatch packets fail closed.
- Write RED tests proving Stage 4 and Stage 5 evidence can reference replay corpus results only as supplemental regression evidence and cannot replace required live evidence.
- Implement the smallest policy/design artifact, packet fixture family, schema parser, replay validator, CLI command or trust-verifier-compatible execution path, docs, and validation needed to satisfy the approved RED evidence without expanding into live routing, policy promotion, Trust Verifier cutover, paid services, or unrelated product scope.

## Smell Triggers

- Any replay packet path that mutates live workflow state, gap-ledger state, coordination history, claims, reviewer routing, model routing, landing authority, UAT state, merge/push/deploy behavior, or cost policy is a blocker.
- Any claim that replay results replace required live evidence, Local Qwen, CodeRabbit, risk classification, supply-chain evidence, landing verdicts, UAT, or operator-owned approvals is a blocker.
- Any Trust Verifier cutover, old-gate replacement, old-gate wrapping, workflow policy change, reviewer promotion, model routing change, paid route, public benchmark publication, hosted service, telemetry, merge, push, deploy, or unrelated cockpit expansion is out of scope without separate authorization.
- Any packet sourced from ungrounded chat memory instead of repo artifacts or explicit no-action disposition is a blocker.
- Any Stage 3 edit to tests, test helpers, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, or acceptance mappings is a role-boundary blocker.
- Any large mixed function that combines packet discovery, schema validation, fixture loading, live state reads, expected-verdict comparison, output rendering, artifact writing, and routing updates without clear boundaries is a clean-code blocker.
- Any nondeterministic replay output without explicit flake/provider-dependence disposition is a blocker.
