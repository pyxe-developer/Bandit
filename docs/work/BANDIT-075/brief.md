# BANDIT-075: Reviewer Calibration With Seeded Defects

## Status

Brief Created

work_type: chore

## Non-Product Work

Use replay-only reviewer packets with known blockers and known non-issues to check whether reviewer gates still catch the right things.

## Origin

Operator direction on 2026-06-07 asked to add the remaining verification-layer opportunities to the roadmap. The earlier verification-layer review identified reviewer calibration with seeded defects as a hardening opportunity for Qwen, CodeRabbit, and any escalated reviewers.

## Scope

- Define replay-only reviewer calibration packets with gold-labeled blockers and non-issues.
- Measure blocker recall, actionable precision, false-positive rate, useful finding yield, latency, and cost where available.
- Keep calibration separated from live work and from automatic reviewer/model routing promotion.
- Record reviewer drift, provider refusal, or inconclusive calibration as evidence without silently weakening live review gates.
- Keep this chore focused on calibration policy, packets, scoring, command output, docs, and tests.

## Out Of Scope

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or make reviewer calibration canonical verifier authority for unrelated live work in this chore.
- Do not promote, demote, replace, weaken, or automatically reroute live reviewers or model routing based on calibration output from this chore.
- Do not approve recurring paid reviewer/model routing, one-off paid reviewer/model calls, public benchmark publication, hosted replay services, telemetry, external reporting, merge/push/deploy behavior, guarded browser action execution, or unrelated cockpit/product scope.
- Do not use generic coding benchmark tasks as first-harness acceptance before repo-derived packets are stratified by Bandit workflow failure mode.
- Do not treat raw finding count as the primary calibration score; blocker recall, actionable precision, useful finding yield, false-positive rate, tool friction, latency, and cost must be recorded where applicable.
- Do not start Evidence Bundle Attestation, Spec-To-Evidence Traceability Matrix, or unrelated Phase 8 product work until `BANDIT-075` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, calibration packets, gold labels, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.

## Acceptance Criteria

- The chore brief links to `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` as the active bootstrap gap once it becomes the next queued work item.
- A policy artifact defines calibration packet schema, gold labels, scoring metrics, reviewer eligibility, provider-refusal handling, and no-live-routing boundaries.
- Calibration packets include known blockers and known non-issues stratified by Bandit workflow failure mode rather than generic coding tasks only.
- Calibration output is deterministic where local and records provider-dependent evidence honestly where external reviewers are unavailable or inconclusive.
- Calibration results cannot automatically promote, demote, or replace reviewer routing without a separate approved workflow trial or policy decision.
- Reviewer scoring prioritizes blocker recall and reports actionable precision, useful finding yield, false-positive rate, provider/tool friction, latency, and cost where the reviewer route supplies those fields.
- Calibration packet-source policy requires repo-derived Bandit workflow failure modes before any broader generic benchmark tasks can count as first-harness acceptance.
- The implementation preserves Bandit's CLI authority, repo-native canonical artifacts, replay-only benchmark boundary, no-live-routing boundary, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation.
- `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is resolved only after landing action and retrospective closeout evidence exist.

## Verification Plan

- Run focused tests for calibration packet schema and gold-label validation.
- Run tests proving seeded blockers and non-issues produce deterministic scoring from fixture reviewer outputs.
- Run tests proving calibration cannot mutate live reviewer routing or landing authority.
- Run tests proving provider-refusal and inconclusive calibration are recorded honestly.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `npm test` when implementation touches reviewer routing, reviewer evidence, calibration commands, or validators.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-08 before repairing this brief. This chore must keep reviewer calibration policy, packet parsing, gold-label validation, scorer logic, provider-refusal handling, command output, diagnostics, and evidence writes small, explicit, deterministic where local, locally testable, and separated so reviewers can distinguish replay-only calibration evidence from live review routing authority.

## Expected Files

- docs/specs/BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS.json
- docs/work/BANDIT-075/brief.md
- docs/work/BANDIT-075/qwen-formation-review.md
- docs/work/BANDIT-075/coderabbit-formation-review.md
- docs/work/BANDIT-075/formation-review.md
- docs/work/BANDIT-075/coordination-log.jsonl
- .bandit/policy/reviewer-calibration.json
- docs/reviewer-calibration-packets/
- src/state/reviewer-calibration.ts
- src/commands/reviewer-calibration.ts
- test/reviewer-calibration.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-075/brief.md
- docs/work/BANDIT-075/qwen-formation-review.md
- docs/work/BANDIT-075/coderabbit-formation-review.md
- docs/work/BANDIT-075/formation-review.md
- docs/work/BANDIT-075/coordination-log.jsonl
- docs/work/BANDIT-075/red-evidence.md
- docs/work/BANDIT-075/implementation-evidence.md
- docs/work/BANDIT-075/review-evidence.md
- docs/work/BANDIT-075/landing-verdict.md
- docs/work/BANDIT-075/landing-action.md
- docs/work/BANDIT-075/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. Codex PM owns fixture packet design, local scoring, provider-refusal handling, and review routing. Halt only if implementation would approve paid reviewer/model routing, change recurring cost policy, change live reviewer routing, change product direction, UAT policy, business tradeoffs, Trust Verifier cutover, merge/push/deploy authority, or unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, seeded calibration packets, gold labels, reviewer-score acceptance mappings, provider-refusal fixtures, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, seeded calibration packets, gold labels, RED evidence, reviewer-score acceptance mappings, source-artifact mappings, or acceptance mappings for this Work Item.
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
- docs/specs/BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS.json
- .bandit/bootstrap-gaps.json
- repo-local reviewer, review, landing, retrospective, and calibration fixture artifacts
- deterministic fixture reviewer outputs and provider-refusal samples
outputs:
- reviewer calibration policy artifact
- replay-only seeded calibration packets
- focused RED/GREEN tests
- deterministic local scoring output
- stage evidence artifacts under docs/work/BANDIT-075/
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not let calibration packets affect live work or reviewer routing by themselves.
- Do not approve paid or recurring reviewer/model routing in this chore.
- Do not approve Trust Verifier cutover, merge, push, deploy, public benchmark publication, hosted replay services, telemetry, or unrelated cockpit/product scope in this chore.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Reviewer calibration design should prefer deterministic replay packets, repo-native artifacts, fixture reviewer outputs, and focused tests over paid services, hosted benchmark services, public benchmark publication, or live reviewer/model routing.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation, provider-timeout, or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid reviewer/model routes, hosted benchmark services, public benchmark publishing, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If a calibration route depends on provider output, record provider, availability, captured time, latency, cost where available, and freshness limits instead of treating the provider call as deterministic local proof.
- If a reviewer misses a seeded blocker, over-flags a seeded non-issue, or refuses/inconclusively returns, record the calibration result without weakening live reviewer gates.
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Source-Of-Truth And Reviewer Calibration Boundary

- Repo-native `.bandit/` state, `docs/work/`, `docs/specs/`, `docs/roadmap/`, and CLI command output remain canonical according to their existing contracts.
- Reviewer calibration is a replay-only benchmark surface. It may read seeded packets, fixture reviewer outputs, and recorded provider evidence, but it cannot mutate live reviewer routing, model routing, gate verdicts, landing authority, or workflow policy.
- Calibration packets must include gold-labeled seeded blockers and seeded non-issues, with packet source, failure-mode category, expected finding class, severity, and rationale.
- Reviewer benchmark scoring must prioritize blocker recall, then actionable precision, useful finding yield, false-positive rate, provider/tool friction, latency, and cost where evidence exists.
- Packet-source policy must start with repo-derived Bandit workflow failure modes before generic coding benchmark tasks can satisfy first-harness acceptance.
- Provider refusal, provider timeout, inconclusive output, missing cost/latency evidence, or unavailable external reviewer state is calibration evidence, not a live review pass or routing waiver.
- Local Qwen reviewer routing is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path.
- Any future use of calibration results for reviewer promotion, recurring paid routing, model routing, workflow policy change, Trust Verifier cutover, old-gate replacement/wrapping, or live work requires a separate Codex PM decision and any operator-owned approval required by policy.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-074` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, source-of-truth and reviewer-calibration boundary, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover seeded packet schema, gold-label validation, blocker recall, false-positive handling, provider refusal, deterministic local scoring, no-live-routing mutation, and direct-Qwen-CLI refusal if reviewer evidence routing is touched.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS`, linked to `BANDIT-075` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is resolved and linked to `BANDIT-074`; its closeout evidence authorizes this next queued gap.
- Evidence Bundle Attestation and Spec-To-Evidence Traceability Matrix remain queued behind this reviewer calibration chore.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Public benchmark publication, paid reviewer/model routing, hosted replay services, telemetry, Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving reviewer calibration packets require schema fields for source, repo-derived failure-mode category, seeded blocker/non-issue label, expected finding class, severity, and rationale.
- Write RED tests proving gold-label validation rejects missing labels, contradictory labels, generic-only packet sources, and packets that cannot distinguish blockers from non-issues.
- Write RED tests proving fixture reviewer outputs produce deterministic blocker recall, actionable precision, useful finding yield, false-positive rate, latency, and cost summaries where available.
- Write RED tests proving missed seeded blockers, over-flagged seeded non-issues, provider refusal, provider timeout, and inconclusive outputs are recorded as calibration evidence without changing live reviewer routing or landing authority.
- Write RED tests proving Local Qwen evidence is accepted only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, not the direct `qwen` CLI, if reviewer evidence routing is touched.
- Implement the smallest policy artifact, packet fixtures, parser, scorer, command wiring, docs, and validation needed to satisfy the approved RED evidence without expanding into live routing, reviewer promotion, Trust Verifier cutover, old-gate replacement/wrapping, paid services, hosted services, public benchmark publication, or unrelated product scope.

## Smell Triggers

- Any calibration result that mutates or weakens live reviewer routing, model routing, gate verdicts, landing authority, or workflow policy is a blocker.
- Any reviewer benchmark that uses raw finding count as the primary score instead of blocker recall and false-positive-aware scoring is a blocker.
- Any first-harness acceptance packet set that relies on generic coding benchmark tasks before repo-derived Bandit failure-mode packets is a blocker.
- Any provider timeout, provider refusal, inconclusive result, missing cost/latency evidence, or unavailable external reviewer state treated as a pass or routing waiver is a blocker.
- Any direct `qwen` CLI reviewer routing or direct-Qwen evidence accepted as Local Qwen proof is a blocker.
- Any Trust Verifier cutover, old-gate replacement, old-gate wrapping, workflow policy change, reviewer promotion, model routing change, paid route, public benchmark publication, hosted service, telemetry, merge, push, deploy, or unrelated cockpit expansion is out of scope without separate authorization.
- Any Stage 3 edit to tests, test helpers, fixtures, seeded calibration packets, gold labels, RED evidence, reviewer-score acceptance mappings, source-artifact mappings, or acceptance mappings is a role-boundary blocker.
- Any large mixed function that combines packet loading, policy classification, reviewer invocation, scoring, provider-evidence parsing, diagnostics, artifact writing, and routing updates without clear boundaries is a clean-code blocker.
