# BANDIT-077: Spec-To-Evidence Traceability Matrix

## Status

Brief Created

work_type: chore

## Non-Product Work

Require acceptance criteria to map to concrete verification artifacts or explicit dispositions before a work item can land.

## Origin

Operator direction on 2026-06-07 asked to add the remaining verification-layer opportunities to the roadmap. The earlier verification-layer review identified spec-to-evidence traceability as a hardening opportunity because Bandit currently does this informally: each acceptance criterion should map to a test, invariant, reviewer check, UAT item, replay packet, or explicit disposition.

## Scope

- Define a machine-checkable traceability matrix for work-item acceptance criteria and verification artifacts.
- Map each acceptance criterion to tests, invariants, reviewer checks, UAT items, replay packets, command evidence, or explicit no-action/bootstrap disposition.
- Require traceability before landing for covered work and require Stage 4 reviewers to inspect weak or missing mappings.
- Avoid coverage mandates; this gate validates claim-to-evidence mapping, not line coverage.
- Keep this chore focused on templates, validators, reviewer packet language, docs, and tests.

## Out Of Scope

- Do not convert spec-to-evidence traceability into line coverage, mutation score, reviewer-count, or generic artifact-presence mandates.
- Do not let implementation-detail evidence substitute for behavior evidence unless the traceability entry records concrete rationale and disposition.
- Do not change acceptance criteria for existing closed work items, rewrite historical evidence, or retroactively reclassify landed slices.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace or wrap old gates, change review-depth policy outside this scoped traceability gate, or make traceability output independent workflow authority.
- Do not approve merge, push, deploy, paid reviewer/model routing, paid tools, external services, hosted traceability services, telemetry, public benchmark publication, guarded browser action execution, or unrelated cockpit/product scope.
- Do not start Guarded CLI Action Requests, Improvement Health Surface, or unrelated Phase 8 product work until `BANDIT-077` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, traceability acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, or policy acceptance criteria for this Work Item.

## Acceptance Criteria

- The chore brief links to `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` as the active bootstrap gap once it becomes the next queued work item.
- A policy or template defines traceability entry schema, supported evidence types, disposition values, required fields, and covered risk tiers.
- Covered work items cannot land when acceptance criteria lack concrete verification mapping or explicit disposition.
- Review evidence asks whether mapped tests and artifacts prove the stated behavior rather than only existing.
- Traceability output distinguishes behavior evidence, implementation-detail evidence, UAT evidence, reviewer evidence, replay evidence, and explicit no-action/bootstrap dispositions.
- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` is resolved only after landing action and retrospective closeout evidence exist.

## Verification Plan

- Run focused tests for traceability matrix parsing and validation.
- Run tests proving missing, vague, unsupported, or behavior-mismatched evidence mappings fail closed.
- Run tests proving explicit no-action/bootstrap dispositions are accepted only with concrete rationale.
- Run tests proving reviewer packet templates include traceability-quality inspection.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `npm test` when implementation touches work-item templates, review evidence, landing gates, or validators.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-08 before repairing this brief. This chore must keep traceability policy, matrix parsing, artifact loading, evidence-type classification, disposition handling, review-packet language, landing-gate checks, diagnostics, command output, and evidence writes small, explicit, deterministic, locally testable, and separated so reviewers can distinguish claim-to-evidence mapping from coverage, landing, review, or Trust Verifier authority.

## Expected Files

- docs/specs/BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX.json
- docs/work/BANDIT-077/brief.md
- docs/work/BANDIT-077/qwen-formation-review.md
- docs/work/BANDIT-077/coderabbit-formation-review.md
- docs/work/BANDIT-077/formation-review.md
- docs/work/BANDIT-077/coordination-log.jsonl
- .bandit/policy/spec-to-evidence-traceability.json
- docs/templates/spec-to-evidence-traceability.md
- src/state/spec-to-evidence-traceability.ts
- src/commands/validate.ts
- test/spec-to-evidence-traceability.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-077/brief.md
- docs/work/BANDIT-077/qwen-formation-review.md
- docs/work/BANDIT-077/coderabbit-formation-review.md
- docs/work/BANDIT-077/formation-review.md
- docs/work/BANDIT-077/coordination-log.jsonl
- docs/work/BANDIT-077/red-evidence.md
- docs/work/BANDIT-077/implementation-evidence.md
- docs/work/BANDIT-077/review-evidence.md
- docs/work/BANDIT-077/landing-verdict.md
- docs/work/BANDIT-077/landing-action.md
- docs/work/BANDIT-077/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. Codex PM owns traceability policy, template shape, validators, tests, and review routing. Halt only if implementation would change product direction, UAT policy, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, paid/external tooling, merge/push/deploy authority, or unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, traceability matrix cases, evidence-type fixtures, disposition cases, acceptance mappings, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, spec-to-evidence traceability acceptance mappings, source-artifact mappings, or acceptance mappings for this Work Item.
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
- docs/specs/BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX.json
- .bandit/bootstrap-gaps.json
- repo-local work-item briefs, acceptance criteria, RED evidence, test evidence, reviewer evidence, replay evidence, UAT evidence, landing verdicts, policy artifacts, and current validation commands
outputs:
- spec-to-evidence traceability policy artifact
- traceability matrix template
- focused RED/GREEN tests
- validation or landing-gate diagnostics for missing, weak, unsupported, or dispositioned mappings
- reviewer packet language for traceability-quality inspection
- stage evidence artifacts under docs/work/BANDIT-077/
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not convert traceability into a line-coverage mandate.
- Do not let implementation-detail evidence substitute for behavior evidence without explicit rationale.
- Do not approve Trust Verifier cutover, paid routing, merge, push, deploy, or unrelated cockpit/product scope in this chore.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Spec-to-evidence traceability design should prefer deterministic repo-native artifacts, focused tests, and local validators over paid services, hosted traceability tooling, telemetry, public publication, or live model/reviewer routing changes.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation, provider-timeout, or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid reviewer/model routes, hosted traceability services, public publishing, external storage, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
- If traceability inputs are unavailable, vague, unsupported, stale, behavior-mismatched, or lack explicit disposition, fail closed with diagnostics instead of weakening gates.
- If implementation discovers a need to replace gate authority, approve Trust Verifier cutover, change product/UAT/policy/business/cost posture, or use paid/external services, halt for separate authorization.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Source-Of-Truth And Traceability Boundary

- Repo-native `.bandit/` state, `docs/work/`, `docs/specs/`, `docs/roadmap/`, and CLI command output remain canonical according to their existing contracts.
- `.bandit/policy/spec-to-evidence-traceability.json` is the scoped policy artifact for traceability entry schema, supported evidence types, disposition values, required fields, and covered risk tiers.
- `docs/templates/spec-to-evidence-traceability.md` is the human-readable matrix template. It can guide future Work Items but cannot become independent workflow authority.
- Spec-to-evidence traceability is derived gate evidence over declared repo-local inputs. It may identify, validate, and report acceptance-criterion mappings, but it cannot mutate acceptance criteria, reviewer routing, model routing, landing authority, UAT authority, gap status, Trust Verifier authority, or workflow policy.
- Each covered acceptance criterion must map to concrete behavior evidence, command evidence, invariant evidence, UAT evidence, reviewer evidence, replay evidence, or an explicit no-action/bootstrap disposition with rationale.
- Behavior evidence is preferred for behavior claims. Implementation-detail evidence may support structure claims only when the traceability entry explains why that evidence proves the criterion.
- Unsupported, vague, missing, stale, behavior-mismatched, or contradictory mappings are fail-closed diagnostics, not optional omissions hidden by a generic pass.
- Traceability output cannot make Trust Verifier canonical, wrap an old gate, replace an old gate, weaken review-subject hash semantics, or approve landing by itself.
- Local Qwen reviewer routing is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-076` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, source-of-truth/traceability boundary, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover traceability entry schema, supported evidence types, dispositions, missing/weak/unsupported mappings, behavior-vs-implementation evidence classification, reviewer packet inspection, and no-authority-expansion behavior.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX`, linked to `BANDIT-077` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is resolved and linked to `BANDIT-076`; its closeout evidence authorizes this next queued gap.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another Qwen route.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, paid reviewer/model routing, paid tools, external services, hosted traceability services, telemetry, public benchmark publication, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving the traceability policy declares entry schema, supported evidence types, disposition values, required fields, covered risk tiers, and source-artifact requirements.
- Write RED tests proving each covered acceptance criterion must map to concrete behavior evidence, command evidence, invariant evidence, UAT evidence, reviewer evidence, replay evidence, or an explicit no-action/bootstrap disposition.
- Write RED tests proving missing, vague, unsupported, stale, behavior-mismatched, contradictory, or rationale-free mappings fail closed with specific diagnostics.
- Write RED tests proving behavior claims are not satisfied by implementation-detail evidence unless the mapping records explicit rationale and disposition.
- Write RED tests proving reviewer packet templates include traceability-quality inspection rather than only evidence presence.
- Write RED tests proving traceability validation is derived and cannot mutate acceptance criteria, reviewer routing, model routing, landing authority, bootstrap-gap status, or Trust Verifier authority.
- Implement the smallest policy artifact, matrix template, state helper, command or validation wiring, docs, and diagnostics needed to satisfy approved RED evidence without expanding into coverage mandates, Trust Verifier cutover, old-gate replacement/wrapping, paid/external services, hosted traceability, telemetry, merge, push, deploy, or unrelated product scope.

## Smell Triggers

- Any traceability matrix that treats artifact existence as proof without checking the acceptance-criterion claim is a blocker.
- Any mapping that lets implementation-detail evidence satisfy behavior claims without explicit rationale is a blocker.
- Any missing, vague, unsupported, stale, behavior-mismatched, contradictory, or rationale-free mapping accepted as pass is a blocker.
- Any traceability output that becomes independent workflow authority, landing authority, Trust Verifier cutover evidence, old-gate replacement, old-gate wrapper, or reviewer/model routing authority is a blocker.
- Any policy artifact that omits supported evidence types, disposition values, required fields, covered risk tiers, source artifacts, or mapping rationale semantics is a blocker for covered claims.
- Any external hosting, paid tooling, telemetry, public publication, merge, push, deploy, Trust Verifier cutover, old-gate replacement/wrapping, or unrelated cockpit expansion is out of scope without separate authorization.
- Any Stage 3 edit to tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, or traceability policy acceptance criteria is a role-boundary blocker.
- Any large mixed function that combines matrix parsing, policy interpretation, artifact loading, evidence classification, disposition validation, diagnostics, command rendering, artifact writes, and routing updates without clear boundaries is a clean-code blocker.
