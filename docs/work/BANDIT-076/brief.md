# BANDIT-076: Evidence Bundle Attestation

## Status

Brief Created

work_type: chore

## Non-Product Work

Hash and attest the full landing evidence bundle so trusted verdicts can be tied to source, tests, review, risk, policy, and command-version evidence.

## Origin

Operator direction on 2026-06-07 asked to add the remaining verification-layer opportunities to the roadmap. The earlier verification-layer review identified evidence bundle attestation as a hardening opportunity beyond review-subject hashes: landing should be able to identify the complete evidence bundle that supported the verdict.

## Scope

- Define a deterministic evidence bundle for covered landing and trusted-verdict claims.
- Include source subject, test evidence, reviewer evidence, risk and supply-chain evidence, UAT where applicable, landing verdict, policy versions, command versions, and freshness metadata.
- Produce stable bundle hashes and clear diagnostics when bundle inputs are missing, stale, unsupported, or changed.
- Keep attestation read-only until a separate landing or trust-verifier cutover decision changes authority.
- Keep this chore focused on bundle policy, hashing, validators, docs, and tests.

## Out Of Scope

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or make evidence bundle attestation canonical verifier authority for unrelated live work in this chore.
- Do not let a bundle hash turn missing, stale, changed, unsupported, or contradictory evidence into a pass.
- Do not replace review-subject hash evidence, landing verdict authority, risk classification, supply-chain gates, UAT rules, Local Qwen, CodeRabbit, or existing validation commands.
- Do not approve merge, push, deploy, paid reviewer/model routing, paid tools, external services, hosted attestation, telemetry, public benchmark publication, guarded browser action execution, or unrelated cockpit/product scope.
- Do not start Spec-To-Evidence Traceability Matrix, Guarded CLI Action Requests, Improvement Health Surface, or unrelated Phase 8 product work until `BANDIT-076` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, or bundle policy acceptance criteria for this Work Item.

## Acceptance Criteria

- The chore brief links to `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` as the active bootstrap gap once it becomes the next queued work item.
- A policy artifact defines evidence bundle membership, optional versus required evidence, hashing semantics, command/policy version capture, and freshness rules.
- Covered landing/trusted claims can produce a deterministic bundle attestation with stable hash output.
- Validation fails closed when a required bundle input is missing, stale, changed after review, unsupported, or mismatched with the landing verdict.
- Bundle attestation remains read-only and does not replace existing gate authority or approve Trust Verifier cutover.
- `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is resolved only after landing action and retrospective closeout evidence exist.

## Verification Plan

- Run focused tests for bundle membership, hashing stability, and command/policy version capture.
- Run tests proving missing, stale, changed, unsupported, or mismatched evidence fails closed.
- Run tests proving attestation is read-only and does not replace existing gate authority.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `npm test` when implementation touches landing gates, review-subject hashes, trust verify, or validators.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-08 before repairing this brief. This chore must keep bundle membership policy, evidence loading, freshness checks, hashing, version capture, diagnostics, command output, and evidence writes small, explicit, deterministic, locally testable, and separated so reviewers can distinguish read-only attestation from gate authority.

## Expected Files

- docs/specs/BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION.json
- docs/work/BANDIT-076/brief.md
- docs/work/BANDIT-076/qwen-formation-review.md
- docs/work/BANDIT-076/coderabbit-formation-review.md
- docs/work/BANDIT-076/formation-review.md
- docs/work/BANDIT-076/coordination-log.jsonl
- .bandit/policy/evidence-bundle-attestation.json
- src/state/evidence-bundle-attestation.ts
- src/commands/evidence-bundle.ts
- test/evidence-bundle-attestation.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-076/brief.md
- docs/work/BANDIT-076/qwen-formation-review.md
- docs/work/BANDIT-076/coderabbit-formation-review.md
- docs/work/BANDIT-076/formation-review.md
- docs/work/BANDIT-076/coordination-log.jsonl
- docs/work/BANDIT-076/red-evidence.md
- docs/work/BANDIT-076/implementation-evidence.md
- docs/work/BANDIT-076/review-evidence.md
- docs/work/BANDIT-076/landing-verdict.md
- docs/work/BANDIT-076/landing-action.md
- docs/work/BANDIT-076/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. Codex PM owns evidence bundle policy, hashing mechanics, validators, and review routing. Halt only if implementation would approve Trust Verifier cutover, replace existing gate authority, change product direction, UAT policy, business tradeoffs, explicit cost/risk posture, paid/external tooling, merge/push/deploy authority, or unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, evidence-bundle membership cases, freshness/mismatch cases, command-version cases, acceptance mappings, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, evidence-bundle acceptance mappings, source-artifact mappings, or acceptance mappings for this Work Item.
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
- docs/specs/BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION.json
- .bandit/bootstrap-gaps.json
- repo-local work-item, test, review, risk, supply-chain, UAT, landing, policy, and command-version artifacts
- existing review-subject hash and evidence freshness policy artifacts
outputs:
- evidence bundle attestation policy artifact
- focused RED/GREEN tests
- deterministic read-only bundle attestation command output
- stage evidence artifacts under docs/work/BANDIT-076/
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not let bundle attestation replace landing authority or Trust Verifier cutover evidence.
- Do not hide missing or stale evidence behind a bundle hash.
- Do not approve merge, push, deploy, paid tooling, or unrelated cockpit/product scope in this chore.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Evidence bundle attestation design should prefer deterministic repo-native artifacts, focused tests, and read-only CLI output over paid services, hosted attestation, telemetry, public publication, or live model/reviewer routing changes.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation, provider-timeout, or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid reviewer/model routes, hosted attestation services, public publishing, external storage, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
- If bundle inputs are unavailable, stale, contradictory, unsupported, or changed after review, fail closed with diagnostics instead of widening scope or weakening gates.
- If implementation discovers a need to replace gate authority, approve Trust Verifier cutover, change product/UAT/policy/business/cost posture, or use paid/external services, halt for separate authorization.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Source-Of-Truth And Evidence Bundle Boundary

- Repo-native `.bandit/` state, `docs/work/`, `docs/specs/`, `docs/roadmap/`, and CLI command output remain canonical according to their existing contracts.
- `.bandit/policy/evidence-bundle-attestation.json` is the scoped policy artifact for bundle membership, required versus optional evidence, hashing semantics, command/policy version capture, and freshness rules.
- Evidence bundle attestation is read-only derived evidence over declared repo-local inputs. It may identify, normalize, hash, and report bundle membership, but it cannot mutate live gate verdicts, reviewer routing, model routing, landing authority, UAT authority, gap status, or workflow policy.
- Bundle membership must include the source subject, RED/test evidence, implementation evidence, review evidence, risk classification, supply-chain gate evidence, UAT where applicable, landing verdict, landing action where applicable, policy versions, command versions, and freshness metadata for covered landing or trusted-verdict claims.
- Unsupported, stale, missing, changed-after-review, contradictory, or landing-verdict-mismatched bundle inputs are fail-closed diagnostics, not optional omissions hidden by the hash.
- Bundle hashes must be deterministic for equivalent input sets and stable across filesystem traversal order, incidental formatting differences outside the declared input contract, and repeated local runs.
- Bundle attestation cannot make Trust Verifier canonical, wrap an old gate, replace an old gate, weaken review-subject hash semantics, or approve landing by itself.
- Local Qwen reviewer routing is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-075` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, source-of-truth/evidence-bundle boundary, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover bundle membership, deterministic hashing, policy/command version capture, freshness checks, missing/stale/unsupported/mismatched input refusal, and read-only no-gate-replacement behavior.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION`, linked to `BANDIT-076` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is resolved and linked to `BANDIT-075`; its closeout evidence authorizes this next queued gap.
- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued behind this evidence bundle attestation chore.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, paid reviewer/model routing, paid tools, external services, hosted attestation, telemetry, public benchmark publication, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving evidence bundle policy declares required versus optional evidence, membership ordering, hashing inputs, policy version capture, command version capture, and freshness metadata.
- Write RED tests proving equivalent bundle inputs produce stable hashes across repeated local runs and traversal-order changes.
- Write RED tests proving missing, stale, unsupported, changed-after-review, landing-verdict-mismatched, or contradictory bundle inputs fail closed with specific diagnostics.
- Write RED tests proving UAT evidence is required only for applicable feature slices and is reported as not applicable for non-product chores.
- Write RED tests proving bundle attestation is read-only and cannot mutate live gate verdicts, reviewer routing, model routing, landing authority, bootstrap-gap status, or Trust Verifier authority.
- Implement the smallest policy artifact, state helper, command wiring, docs, and validation needed to satisfy approved RED evidence without expanding into Trust Verifier cutover, old-gate replacement/wrapping, paid/external services, hosted attestation, telemetry, merge, push, deploy, or unrelated product scope.

## Smell Triggers

- Any bundle hash that hides missing, stale, unsupported, changed, contradictory, or mismatched evidence is a blocker.
- Any attestation output that becomes independent workflow authority, landing authority, Trust Verifier cutover evidence, old-gate replacement, old-gate wrapper, or reviewer/model routing authority is a blocker.
- Any required bundle input whose freshness or source artifact is unclear is a blocker unless explicitly declared optional by policy and reported as not applicable.
- Any policy artifact that omits command version, policy version, source subject, review evidence, risk classification, supply-chain gate, landing verdict, or UAT applicability semantics is a blocker for covered claims.
- Any external hosting, paid tooling, telemetry, public publication, merge, push, deploy, Trust Verifier cutover, old-gate replacement/wrapping, or unrelated cockpit expansion is out of scope without separate authorization.
- Any Stage 3 edit to tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, or bundle policy acceptance criteria is a role-boundary blocker.
- Any large mixed function that combines evidence loading, policy interpretation, freshness checks, hashing, diagnostics, command rendering, artifact writes, and routing updates without clear boundaries is a clean-code blocker.
