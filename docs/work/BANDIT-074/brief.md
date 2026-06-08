# BANDIT-074: Metamorphic Cross-Projection Checks

## Status

Brief Created

work_type: chore

## Non-Product Work

Require derived Bandit projections to agree when reading the same canonical artifacts and to preserve verdicts under harmless input perturbations.

## Origin

Operator direction on 2026-06-07 asked to add the remaining verification-layer opportunities to the roadmap. The earlier verification-layer review identified metamorphic and cross-projection checks as a hardening opportunity for derived surfaces such as cockpit status, session-context, land-check, and future trust verify outputs.

## Scope

- Define canonical artifact sources and derived projection surfaces that must agree.
- Add cross-projection agreement checks for status, blockers, next action, active work item, and gate verdict summaries.
- Add metamorphic checks for harmless ordering, whitespace, evidence-only commits, and equivalent input shape where applicable.
- Fail closed when projections disagree on trust-relevant claims or when harmless perturbations change a covered verdict.
- Keep this chore focused on projection consistency, validators, fixtures, docs, and tests.

## Out Of Scope

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or make cross-projection checks canonical verifier authority for unrelated live work in this chore.
- Do not build reviewer calibration, evidence bundle attestation, spec-to-evidence traceability, paid reviewer routing, model routing promotion, public benchmark publication, hosted replay services, telemetry, external reporting, merge/push/deploy behavior, guarded browser action execution, or unrelated cockpit/product scope.
- Do not let cockpit status, session-context, land-check, roadmap/status parsing, trust-verifier-compatible outputs, or any new derived view become independent workflow authority.
- Do not mask projection disagreement by choosing the most favorable surface, normalizing away trust-relevant drift, or treating harmless perturbation coverage as a product approval.
- Do not start Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, Spec-To-Evidence Traceability Matrix, or unrelated Phase 8 product work until `BANDIT-074` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, cross-projection acceptance mappings, perturbation fixtures, expected-output mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.

## Acceptance Criteria

- The chore brief links to `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` as the active bootstrap gap once it becomes the next queued work item.
- A policy artifact defines covered projections, canonical source artifacts, trust-relevant fields, harmless perturbations, and acceptable differences.
- Covered projections agree on active work item, stage, next action, blockers, required operator input, queued gaps, and gate verdict summaries.
- Validation or focused checks fail closed when projections disagree on trust-relevant claims.
- Metamorphic tests prove harmless input changes do not alter covered verdicts or trusted status.
- Projection consistency checks remain read-only against canonical workflow state unless a later stage explicitly writes ordinary stage evidence under approved Work Item surfaces.
- The implementation preserves Bandit's CLI authority, repo-native canonical artifacts, source-of-truth/projection boundaries, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation.
- `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is resolved only after landing action and retrospective closeout evidence exist.

## Verification Plan

- Run focused tests comparing cockpit status, session-context, roadmap/status parsing, land-check, and trust-verifier-compatible outputs where applicable.
- Run metamorphic tests for harmless ordering, whitespace, and evidence-only input changes.
- Run tests proving trust-relevant projection disagreement fails closed with clear diagnostics.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-074` for aggregate review evidence freshness once implementation changes exist.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-074 --base origin/main` before Stage 4 closeout unless provider-refusal or provider-timeout evidence is recorded.
- Run Local Qwen only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- land-check BANDIT-074` before landing.
- Run `npm test` when implementation touches shared projections or validators.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-08 before repairing this brief. This chore must keep canonical source selection, projection comparison, perturbation fixture construction, verdict comparison, diagnostics, validation command wiring, and evidence writes small, explicit, read-only where applicable, locally testable, and separated so reviewers can distinguish canonical workflow state from derived projections.

## Expected Files

- docs/specs/BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS.json
- docs/work/BANDIT-074/brief.md
- docs/work/BANDIT-074/qwen-formation-review.md
- docs/work/BANDIT-074/coderabbit-formation-review.md
- docs/work/BANDIT-074/formation-review.md
- docs/work/BANDIT-074/coordination-log.jsonl
- .bandit/policy/metamorphic-cross-projection-checks.json
- src/state/projection-consistency.ts
- src/commands/validate.ts
- test/metamorphic-cross-projection-checks.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-074/brief.md
- docs/work/BANDIT-074/qwen-formation-review.md
- docs/work/BANDIT-074/coderabbit-formation-review.md
- docs/work/BANDIT-074/formation-review.md
- docs/work/BANDIT-074/coordination-log.jsonl
- docs/work/BANDIT-074/red-evidence.md
- docs/work/BANDIT-074/implementation-evidence.md
- docs/work/BANDIT-074/review-evidence.md
- docs/work/BANDIT-074/landing-verdict.md
- docs/work/BANDIT-074/landing-action.md
- docs/work/BANDIT-074/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. Codex PM owns the projection-consistency policy, covered command selection, tests, and review routing. Halt only if implementation would change product direction, UAT policy, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, paid/external tooling, merge/push/deploy authority, or unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, cross-projection acceptance mappings, perturbation fixtures, expected-output mappings, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, cross-projection acceptance mappings, perturbation fixtures, expected-output mappings, source-artifact mappings, or acceptance mappings for this Work Item.
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
- docs/specs/BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS.json
- .bandit/bootstrap-gaps.json
- repo-local roadmap, status, coordination, gate, reviewer, landing, and projection evidence artifacts
- deterministic local command output from covered derived surfaces
outputs:
- metamorphic cross-projection policy artifact
- focused RED/GREEN tests
- projection consistency validation output
- stage evidence artifacts under docs/work/BANDIT-074/
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not let projections become canonical workflow authority.
- Do not mask disagreement between derived surfaces.
- Do not approve Trust Verifier cutover, paid routing, merge, push, deploy, or unrelated cockpit/product scope in this chore.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Cross-projection and metamorphic design should prefer deterministic local commands, repo-native artifacts, and focused tests over paid services, live model routing, hosted benchmark services, or public benchmark publication.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation, provider-timeout, or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid reviewer/model routes, hosted benchmark services, public benchmark publishing, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If a projection depends on provider output, compare only the trust-relevant recorded artifact fields with explicit freshness and availability disposition rather than treating the provider call as deterministic proof.
- If harmless perturbation changes a covered verdict or trusted status, fail closed with evidence of the changed fields instead of normalizing the difference silently.
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Source-Of-Truth And Projection Boundary

- Repo-native `.bandit/` state, `docs/work/`, `docs/specs/`, `docs/roadmap/`, root `STATUS.md`, and CLI command output remain canonical according to their existing contracts.
- Cross-projection checks may compare derived surfaces such as cockpit status, session-context, land-check, roadmap/status parsing, validation summaries, and trust-verifier-compatible outputs, but they cannot grant workflow authority outside the approved Work Item.
- A projection disagreement on active work item, stage, next action, blockers, required operator input, queued gaps, or gate verdict summaries is a fail-closed trust signal until repaired or explicitly dispositioned.
- Harmless perturbations may cover ordering, whitespace, equivalent JSON object key order, evidence-only commits, and equivalent input shape where applicable; they must not hide changed semantics, stale evidence, missing operator input, changed scope, or missing review/landing evidence.
- Local Qwen reviewer routing is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path.
- Any future use of this policy for Trust Verifier cutover, old-gate replacement/wrapping, live routing, reviewer promotion, model routing, or workflow policy change requires a separate Codex PM decision and any operator-owned approval required by policy.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-073` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, source-of-truth and projection boundary, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover cross-projection agreement, trust-relevant disagreement refusal, harmless perturbation invariance, and diagnostics.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS`, linked to `BANDIT-074` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is resolved and linked to `BANDIT-073`; its closeout evidence authorizes this next queued gap.
- Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind this metamorphic cross-projection chore.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Public benchmark publication, paid reviewer/model routing, hosted replay services, telemetry, Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving covered projections agree on active work item, stage, next action, blockers, required operator input, queued gaps, and gate verdict summaries for the same canonical repo state.
- Write RED tests proving disagreements between cockpit status, session-context, roadmap/status parsing, land-check, validation summaries, and trust-verifier-compatible outputs fail closed with clear diagnostics where applicable.
- Write RED tests proving harmless ordering, whitespace, equivalent JSON object key order, evidence-only commits, and equivalent input shape do not change covered verdicts or trusted status.
- Write RED tests proving semantic drift, stale evidence, missing operator input, changed scope, missing review/landing evidence, and queued-gap disagreement are not treated as harmless perturbations.
- Write RED tests proving Local Qwen evidence is accepted only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, not the direct `qwen` CLI, if reviewer evidence is touched by the covered projections.
- Implement the smallest policy artifact, parser, validator, command wiring, docs, and validation needed to satisfy the approved RED evidence without expanding into Trust Verifier cutover, old-gate replacement/wrapping, paid services, hosted services, live routing, public benchmark publication, or unrelated product scope.

## Smell Triggers

- Any trusted derived surface that disagrees with another covered projection on active work item, stage, next action, blockers, required operator input, queued gaps, or gate verdict summaries is a blocker unless explicitly dispositioned.
- Any harmless perturbation that changes a covered verdict or trusted status is a blocker unless the policy proves the field is non-trust-relevant.
- Any cockpit, session-context, status parser, land-check, validation summary, or trust-verifier-compatible output treated as canonical authority beyond its documented source contract is a blocker.
- Any direct `qwen` CLI reviewer routing or direct-Qwen evidence accepted as Local Qwen proof is a blocker.
- Any Trust Verifier cutover, old-gate replacement, old-gate wrapping, workflow policy change, reviewer promotion, model routing change, paid route, public benchmark publication, hosted service, telemetry, merge, push, deploy, or unrelated cockpit expansion is out of scope without separate authorization.
- Any Stage 3 edit to tests, test helpers, fixtures, RED evidence, cross-projection acceptance mappings, perturbation fixtures, expected-output mappings, source-artifact mappings, or acceptance mappings is a role-boundary blocker.
- Any large mixed function that combines policy classification, projection execution, perturbation generation, output comparison, diagnostics, artifact writing, and routing updates without clear boundaries is a clean-code blocker.
