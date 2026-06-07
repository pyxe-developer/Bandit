# BANDIT-069: Test Strength / Mutation Adequacy Gate

## Status

Brief Created

work_type: chore

## Non-Product Work

Create a risk-tiered test-strength gate that asks whether critical tests would catch plausible wrong behavior, with mutation evidence, property or fault-injection evidence, table-driven adversarial cases, or explicit bootstrap/no-action disposition.

## Origin

Operator direction on 2026-06-07 identified a bootstrap gap: Bandit requires behavior-focused RED tests, clean-code checks, review, risk classification, landing verdicts, and freshness checks, but mutation testing and assertion adequacy are not first-class gates. The missing policy lets Bandit prove tests exist and went red/green without systematically proving the tests would reject plausible broken implementations, especially for deterministic trust-layer code, landing gates, review routing, claim/lock/worktree behavior, state transitions, and artifact validators.

## Scope

- Define a repo-native Test Strength / Mutation Adequacy Gate for critical deterministic trust-layer work without turning it into a universal coverage mandate.
- Classify when test-strength evidence is required, including landing gates, review routing, claim authority, claim/lock/worktree behavior, state transitions, artifact validators, evidence freshness/trust signals, role/coordination gates, serializer behavior, and guarded action or authority boundaries.
- Require Stage 1 briefs touching covered surfaces to declare a test-strength strategy: mutation score evidence, property-style or fault-injection simulation, table-driven adversarial cases, or explicit no-action/bootstrap-gap disposition.
- Strengthen Stage 2 RED evidence so it records that the RED failed for the intended behavior reason and explains how assertions reject plausible wrong implementations, not just missing behavior.
- Require Stage 2 acceptance mapping to identify the plausible wrong behaviors, mutants, invariant violations, or adversarial cases each test family is meant to catch.
- Define mutation evidence fields for target surface, command or runner, mutation score or equivalent result, threshold or disposition rule, surviving mutant disposition, excluded mutants, and freshness source when a mutation runner is used.
- Allow property-style and fault-injection simulation as first-class alternatives for stateful or concurrency-sensitive trust-layer behavior, including claim safety, retry/idempotency, stale fencing token, projection/history disagreement, and serializer or worktree-lock failure scenarios.
- Allow table-driven adversarial cases for deterministic validators and routing rules when mutation tooling is unavailable or excessive for the slice, as long as the cases target plausible wrong implementations.
- Update reviewer and aggregate-review packet requirements so CodeRabbit, Local Qwen, and PM disposition ask whether the tests could pass with a broken implementation, separately from source quality and test presence.
- Update landing or validation gates so covered high-risk surfaces fail closed when test-strength evidence is missing, stale, inadequate, or silently replaced by generic coverage claims.
- Keep this chore focused on policy, templates, validators, command wiring, reviewer-packet language, package-script support if selected, and focused tests. Do not require mutation testing for every file, mandate line coverage, run external services, approve paid tooling, change product direction, or weaken existing Stage 2 model-family and test-ownership boundaries.
- Preserve Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: Stage 3 Writers cannot edit tests, test helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, or acceptance mappings for their work item.

## Out Of Scope

- Do not turn test strength into a universal line-coverage, mutation-score, or every-file mandate.
- Do not approve paid or external mutation tooling, paid reviewer routing, recurring paid model usage, provider-pricing policy, or spend-class policy in this chore.
- Do not change product direction, UAT policy, business tradeoffs, Trust Verifier cutover, merge/push/deploy authority, dependency policy outside a scoped local runner decision, or unrelated Phase 8 cockpit product scope.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Do not replace existing Stage 2 model-family separation, review gates, clean-code gates, layered risk classification, supply-chain gates, landing gates, or evidence freshness gates except where this chore explicitly adds test-strength requirements to those gates.

## Acceptance Criteria

- The chore brief exists at `docs/work/BANDIT-069/brief.md` and links to `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` as the active bootstrap gap once it becomes the next queued work item.
- A repo-native policy artifact or equivalent validator defines covered risk tiers, covered trust-layer surfaces, acceptable evidence modes, required fields for mutation evidence, required fields for property/fault-injection evidence, required fields for table-driven adversarial evidence, and explicit no-action/bootstrap-gap disposition rules.
- Stage 1 brief/spec validation requires covered high-risk surfaces to declare a test-strength strategy or explicit disposition before Stage 2 begins.
- Stage 2 RED evidence validation requires intended-failure evidence and assertion-adequacy mapping for covered surfaces: the evidence must identify why the RED failed and which plausible wrong implementations the assertions would reject.
- Mutation evidence, when selected, records the target surface, command or runner, score or equivalent result, threshold/disposition rule, surviving mutant disposition, excluded mutant rationale, and freshness source.
- Property-style or fault-injection evidence, when selected, records invariants, generated or enumerated state space, injected failures, replay determinism, and the wrong-behavior classes rejected.
- Table-driven adversarial evidence, when selected, records the adversarial cases, the plausible wrong implementation each case targets, and why the cases are sufficient for the selected risk tier.
- Reviewer packet templates and aggregate Stage 4 evidence ask whether tests could pass with a broken implementation, require reviewer or PM disposition for weak assertions, and distinguish test adequacy findings from source-quality findings.
- Landing, land-check, or repo validation consumes current test-strength evidence for covered high-risk surfaces and fails closed when evidence is missing, stale, contradictory, generic coverage-only, or unsupported by an explicit disposition.
- The implementation does not add a blanket coverage mandate, require mutation testing everywhere, treat mutation score as the only acceptable evidence mode, approve paid/external mutation tooling, change UAT policy, approve Trust Verifier cutover, change merge/push/deploy authority, or expand unrelated Phase 8 cockpit/product scope.
- If a package script or dev dependency is added for mutation testing, the work records supply-chain and layered-risk evidence and keeps the runner local, deterministic, and scoped to supported surfaces; unavailable runner behavior is recorded as bootstrap evidence rather than pass evidence.
- The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation; Stage 3 Writers cannot edit test-strength evidence or other Test Writer-owned surfaces.
- Stage 4 review uses CodeRabbit and Local Qwen or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification, supply-chain, clean-code, and review-subject freshness evidence before landing.
- `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is resolved only after landing action and retrospective closeout evidence exist for this bounded gate chore.

## Verification Plan

- Run focused tests proving covered high-risk trust-layer surfaces require test-strength strategy evidence or explicit disposition before Stage 2 proceeds.
- Run focused Stage 2 evidence validation tests proving missing intended-failure reason, missing assertion-adequacy mapping, generic coverage-only claims, and unsupported evidence modes fail closed.
- Run focused mutation-evidence validation tests for score/threshold fields, surviving mutant disposition, excluded mutant rationale, freshness source, and unavailable-runner bootstrap disposition.
- Run focused property/fault-injection validation tests for invariants, deterministic replay, injected failure classes, and wrong-behavior coverage.
- Run focused table-driven adversarial evidence tests proving each case maps to a plausible wrong implementation.
- Run focused reviewer-packet or aggregate-review tests proving Stage 4 asks whether tests could pass with a broken implementation and preserves source-quality review as a separate concern.
- Run focused landing or validation tests proving covered high-risk surfaces fail closed when test-strength evidence is missing, stale, inadequate, or contradictory.
- Run mutation testing through the selected local package script if this chore adds one; otherwise record the no-run/bootstrap disposition and run the policy validator tests.
- Run `npm test` if implementation touches shared validators, work-item parsing, Stage 2 evidence parsing, review evidence, landing gates, package scripts, policy validation, templates, bootstrap gaps, or current-state projections.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-069` for aggregate review evidence freshness.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-069 --base origin/main` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- qwen-review BANDIT-069` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- land-check BANDIT-069` before landing.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before creating this brief. The chore must keep policy, validator, artifact-template, reviewer-packet, and landing-gate changes small, explicit, testable, and separated so review can distinguish test-strength evidence from generic coverage, source-quality, risk-classification, and evidence-freshness concerns.

## Expected Files

- docs/specs/BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE.json
- docs/work/BANDIT-069/brief.md
- docs/work/BANDIT-069/qwen-formation-review.md
- docs/work/BANDIT-069/coderabbit-formation-review.md
- docs/work/BANDIT-069/formation-review.md
- docs/work/BANDIT-069/coordination-log.jsonl
- docs/work/BANDIT-069/red-evidence.md
- docs/work/BANDIT-069/implementation-evidence.md
- docs/work/BANDIT-069/coderabbit-review.md
- docs/work/BANDIT-069/local-qwen-review.md
- docs/work/BANDIT-069/review-evidence.md
- docs/work/BANDIT-069/landing-verdict.md
- docs/work/BANDIT-069/landing-action.md
- docs/work/BANDIT-069/retrospective.md
- .bandit/policy/test-strength-gate.json
- docs/templates/test-strength-evidence.md
- docs/templates/red-evidence.md
- docs/templates/review-evidence.md
- docs/verification/STAGE_RUBRICS.md
- CLEAN_CODE.md
- src/state/test-strength-gate.ts
- src/commands/test-strength-gate.ts
- src/commands/validate.ts
- src/commands/land-check.ts
- src/state/review-evidence.ts
- src/state/coderabbit-review.ts
- src/state/local-qwen-review.ts
- package.json
- package-lock.json
- test/test-strength-gate.test.mjs
- test/landing-gates.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-069/brief.md
- docs/work/BANDIT-069/qwen-formation-review.md
- docs/work/BANDIT-069/coderabbit-formation-review.md
- docs/work/BANDIT-069/formation-review.md
- docs/work/BANDIT-069/coordination-log.jsonl
- docs/work/BANDIT-069/red-evidence.md
- docs/work/BANDIT-069/implementation-evidence.md
- docs/work/BANDIT-069/coderabbit-review.md
- docs/work/BANDIT-069/local-qwen-review.md
- docs/work/BANDIT-069/review-evidence.md
- docs/work/BANDIT-069/landing-verdict.md
- docs/work/BANDIT-069/landing-action.md
- docs/work/BANDIT-069/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. The operator supplied the workflow-policy direction: Bandit needs a risk-tiered test-strength gate that asks whether critical tests catch plausible wrong behavior, with mutation evidence as one acceptable mode rather than a coverage mandate. Codex PM owns the technical shape of policy artifacts, validators, test strategy, package-script selection if local mutation tooling is selected, supply-chain evidence, reviewer packet wording, and review routing. Halt only if implementation would change product direction, UAT policy, business tradeoffs, explicit cost/risk posture, approve paid or external tooling, approve recurring paid model/reviewer routing, approve Trust Verifier cutover, alter merge/push/deploy authority, change dependency or lockfile policy outside the scoped local mutation-runner decision, or expand into unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, assertion-adequacy mappings, mutation evidence, property/fault-injection evidence, adversarial-case mappings, and acceptance mappings.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, adversarial-case mappings, or acceptance mappings for this Work Item.
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
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not treat mutation score as a universal coverage mandate.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, or acceptance mappings.
- Do not treat generic line coverage, snapshot churn, or test presence as test-strength evidence for covered high-risk surfaces.
- Do not approve paid/external mutation tooling, Trust Verifier cutover, product UAT changes, merge, push, deploy, guarded action execution, or unrelated Phase 8 cockpit work in this chore.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Mutation or property/fault-injection runs should be scoped to covered surfaces and should record timeout or unavailable-runner disposition rather than forcing repeated full-suite attempts.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Any paid mutation service, paid reviewer, paid model, or recurring paid route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If mutation or property/fault-injection execution times out, halt the expensive action and record continuation or bootstrap evidence before retrying.
- If CodeRabbit or another external reviewer times out, record explicit provider-refusal or continuation evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-068` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, and roadmap/status synchronization; the gap ledger now authorizes this queued bootstrap-gap chore before unrelated Phase 8 product slices.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, and token-cost failsafe.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and map covered assertions to plausible wrong implementations, mutants, invariants, injected failures, or adversarial cases.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE`, linked to `BANDIT-069` in `.bandit/bootstrap-gaps.json`.
- The next queued bootstrap gap is `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE`; it must not start until `BANDIT-069` is landed and closed out or explicitly dispositioned.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Paid/external mutation tooling, paid reviewers, Trust Verifier cutover, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving Stage 1 brief/spec validation requires covered high-risk surfaces to declare a test-strength strategy or explicit disposition before Stage 2 proceeds.
- Write RED tests proving Stage 2 evidence validation rejects missing intended-failure reason, missing assertion-adequacy mapping, generic coverage-only claims, unsupported evidence modes, and stale or contradictory evidence.
- Write RED tests for mutation evidence, property/fault-injection evidence, and table-driven adversarial evidence field validation.
- Write RED tests proving reviewer packets and aggregate review evidence ask whether tests could pass with plausible broken implementations and keep test adequacy separate from source-quality findings.
- Write RED tests proving landing or validation gates fail closed for covered high-risk surfaces when test-strength evidence is missing, stale, inadequate, contradictory, or unsupported by explicit disposition.
- Implement the smallest policy, parser, validator, template, command, and landing/review integration surface needed to satisfy the approved RED evidence without expanding unrelated gates.

## Smell Triggers

- Any blanket coverage mandate, universal mutation-score requirement, or every-file mutation-testing rule is scope creep.
- Any Stage 3 edit to tests, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, or acceptance mappings is a role-boundary blocker.
- Any pass/trusted/ready result based only on generic line coverage, snapshot churn, or test presence is a test-strength blocker for covered high-risk surfaces.
- Any paid/external mutation service, paid reviewer route, provider-pricing decision, Trust Verifier cutover, product/UAT policy change, merge/push/deploy authority, guarded action execution, or unrelated cockpit work is operator-owned or out of scope.
- Any large mixed function that combines policy classification, evidence parsing, mutation-runner plumbing, review packet generation, landing-gate logic, and context projection without clear boundaries is a clean-code blocker.
