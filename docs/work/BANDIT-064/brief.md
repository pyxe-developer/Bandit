# BANDIT-064: Trust Verifier Cutover Gate Triage

## Status

Queued

## Non-Product Work

Create a bounded bootstrap-policy chore that materializes the Trust Verifier Cutover Gate as a repo-native gate contract and validator while preserving the current compatibility period and recording that no Trust Verifier cutover is approved by this work.

## Origin

Current repo context records no active work item after BANDIT-063 closeout and names Trust Verifier Cutover Gate triage as the next bootstrap-policy item before unrelated cockpit product work. CONTEXT.md defines the Trust Verifier Cutover Gate as an explicit per-Trust-Goal decision point that must name the affected Trust Goal, old command path, new trust-verifier path, parity evidence, stricter-failure behavior, report format, and rollback or fallback rule before `bandit trust verify` can become canonical or wrap an older gate. The repo also records that no operator-owned input is required for triage, but any actual cutover approval, old-gate replacement, old-gate wrapping, or broader policy decision remains operator-owned and must halt.

## Scope

- Define a repo-native Trust Verifier Cutover Gate contract for future per-trust-goal proposals without approving any current cutover.
- Record the current compatibility-period state explicitly: `bandit trust verify` remains read-only compatibility evidence and does not replace or wrap land-check, review evidence validation, closeout validation, coordination validation, artifact creation, routing, landing, or queue mutation.
- Require any future cutover proposal to identify trust_goal, old authoritative gate command path, proposed `bandit trust verify` path or wrapper behavior, reproducible parity evidence, stricter-failure behavior, report format, rollback or fallback rule, evidence freshness boundary, reviewer-finding routing boundary, and operator approval status.
- Add or update a narrow policy artifact and validator so unsupported, incomplete, or implicitly approved cutover claims fail closed with clear diagnostics.
- Require the validator to reject any claim that a Trust Goal is canonical, wrapped, or replacing an old gate unless a complete gate artifact and separately authorized operator approval evidence exist.
- Keep every old gate authoritative during this chore; implementation may add reporting, validation, or explicit no-cutover disposition only, and must not alter old gate execution semantics.
- Preserve the Trust Verifier Compatibility Period, Work Item Snapshot boundary, Trust Verdict vocabulary, Captured Evidence boundary, Reviewer-Finding Routing boundary, Evidence SLO boundary, Input Quarantine boundary, Layered Risk Classification, Supply-Chain Gate, Operator Fail-Closed Boundary, and CLI Authority boundary.
- Record `CLEAN_CODE.md` read evidence in Stage 1; `CLEAN_CODE.md` was read on 2026-06-07 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage sequence expectation: Repo PM creates this Stage 1 brief, formation review is the next recorded action, Work Item PM execution may start only after `formation_approved`, Stage 2 RED evidence must precede implementation, Stage 3 implementation must preserve test ownership, Stage 4 must run CodeRabbit and Local Qwen or record honest provider-refusal evidence, Stage 5 must record landing verdict/action evidence, and Stage 6 must record retrospective and gap disposition before any later work starts.
- Stage capability scope for this chore: Codex PM/Repo PM owns Stage 1 brief creation, formation routing, and context-artifact synchronization; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; Stage 3 Implementation Writer has no authority to edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence; reviewers own Stage 4 evidence; Landing Agent owns Stage 5 verdict/action evidence; Closeout Agent/Codex PM owns Stage 6 closeout evidence.
- Token-cost failsafe boundary: use existing Token-Cost Failsafe policy for abnormal-run guardrails if paid, high-token, reviewer, or long-running execution becomes necessary; this chore must not approve new provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, or operator-owned cost/risk overrides.
- Future-work scope: this chore must not approve Trust Verifier cutover, select a Trust Goal for cutover, replace or wrap old gate paths, run tests or reviewers from inside `bandit trust verify`, invoke model calls, add live evidence capture helpers, change product direction, alter UAT policy, introduce provider routing, approve paid recurring routes, create role input packets, create generated execution packets, restart Pi/Aperture agent-scope work, add cockpit product scope, change dependencies or lockfiles, change merge/push/deploy authority, create claims or worktrees, or install/edit global skills.

## Acceptance Criteria

- The chore brief exists at `docs/work/BANDIT-064/brief.md` and links to `BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE` as the active bootstrap gap.
- Stage 1 brief evidence records `CLEAN_CODE.md` read evidence, source authority, scope and out-of-scope, stage capability scope, operator-input status, model-family separation, Permanent Test Ownership Boundary, required evidence, expected files, stage sequence, and forbidden actions.
- Focused RED evidence proves the repo currently lacks an explicit Trust Verifier Cutover Gate contract or validator for future per-trust-goal cutover proposals.
- A repo-native gate policy or equivalent artifact records that no Trust Goal has approved cutover status in this chore and that existing gate commands remain authoritative during the compatibility period.
- The gate contract requires trust_goal, old authoritative gate path, proposed trust-verifier path or wrapper behavior, reproducible parity evidence, stricter-failure behavior, report format, rollback or fallback rule, evidence freshness boundary, reviewer-finding routing boundary, and operator approval status before any future cutover can be considered complete.
- Validation fails closed for unsupported trust goals, missing old gate path, missing proposed trust-verifier path, missing or stale parity evidence, missing stricter-failure behavior, missing report format, missing rollback/fallback rule, missing operator approval status, or any implicit cutover claim.
- Validation explicitly rejects any artifact or policy state that marks `bandit trust verify` canonical for a Trust Goal, replaces an old gate, or wraps an old gate without separate operator-authorized cutover evidence.
- Existing authoritative gate commands keep their current behavior; this chore introduces no old-gate replacement, wrapper execution, live evidence capture, reviewer execution, model execution, test execution from trust verify, routing mutation, landing mutation, queue mutation, or coordination-state mutation from trust verification.
- The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for this work item.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review-subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore changes workflow policy/validation surfaces for trust-verifier cutover claims.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- `BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE` is resolved only after landing action and retrospective closeout evidence exist for this bounded gate-triage chore.
- No Trust Verifier cutover is approved; no Trust Goal is selected for cutover; no old gate path is replaced or wrapped; no role input packet, execution packet, Pi/Aperture agent-scope work, claim authority, worktree lifecycle, scheduler, cockpit product work, dependency or lockfile change, external service setup, merge/push/deploy behavior, product UAT scope, provider-pricing approval, spend-class approval, paid reviewer promotion, recurring paid routing policy, installed global skill edit, or broader product/policy change is introduced.

## Verification Plan

- Run focused Trust Verifier Cutover Gate RED/GREEN tests proving missing, incomplete, implicit, and unsupported cutover claims fail closed.
- Run focused validation tests for supported trust_goal vocabulary, old gate path presence, proposed trust-verifier path presence, parity evidence references, stricter-failure behavior, report format, rollback/fallback rule, operator approval status, and no-cutover-approved current state.
- Run focused tests proving `bandit trust verify` remains read-only compatibility evidence and does not replace, wrap, invoke, or mutate existing authoritative gate command paths.
- Run focused work-item creation or validation tests if the implementation touches spec validation, brief rendering, bootstrap-gap linking, formation, or current-state projections.
- Run `node --test test/trust-verify.test.mjs` if trust-verifier command behavior or snapshot validation is touched.
- Run `node --test test/validate.test.mjs` if repo validation behavior is touched.
- Run `node --test test/work-item-create.test.mjs` if work-item creation, spec validation, brief rendering, or bootstrap-gap linking is touched.
- Run `node --test test/role-entrypoints-formation.test.mjs` if formation approval, role entrypoint routing, or Work Item PM readiness behavior is touched.
- Run `npm test` if implementation touches shared command routing, validators, artifact renderers, work-item parsing, templates, bootstrap gaps, coordination history, cockpit status, session-context packets, risk classification, supply-chain gates, input quarantine, operator boundaries, token-cost failsafes, evidence freshness, role contracts, role-run manifests, model-family separation, or policy validation beyond focused tests.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `npm run bandit -- stage-capability-scope validate --json`.
- Run `npm run bandit -- token-cost-failsafe validate --json`.
- Run `npm run bandit -- evidence-freshness-slos validate --json`.
- Run `npm run bandit -- risk-classification validate --json`.
- Run `npm run bandit -- supply-chain-gate validate --json`.
- Run `npm run bandit -- input-quarantine validate --json`.
- Run `npm run bandit -- operator-boundary validate --json`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-064` for aggregate review evidence freshness.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-064 --base origin/main` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- qwen-review BANDIT-064` before Stage 4 closeout.
- Run `npm run bandit -- land-check BANDIT-064` before landing.
- Run `git diff --check`.

## Expected Files

- docs/specs/BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE.json
- docs/work/BANDIT-064/brief.md
- docs/work/BANDIT-064/qwen-formation-review.md
- docs/work/BANDIT-064/coderabbit-formation-review.md
- docs/work/BANDIT-064/formation-review.md
- docs/work/BANDIT-064/coordination-log.jsonl
- docs/work/BANDIT-064/red-evidence.md
- docs/work/BANDIT-064/implementation-evidence.md
- docs/work/BANDIT-064/coderabbit-review.md
- docs/work/BANDIT-064/local-qwen-review.md
- docs/work/BANDIT-064/review-evidence.md
- docs/work/BANDIT-064/landing-verdict.md
- docs/work/BANDIT-064/landing-action.md
- docs/work/BANDIT-064/retrospective.md
- .bandit/policy/trust-verifier-cutover-gates.json
- src/commands/trust.ts
- src/state/trust-verify.ts
- src/state/trust-verifier-cutover-gates.ts
- test/trust-verifier-cutover-gate.test.mjs
- test/trust-verify.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-064/brief.md
- docs/work/BANDIT-064/qwen-formation-review.md
- docs/work/BANDIT-064/coderabbit-formation-review.md
- docs/work/BANDIT-064/formation-review.md
- docs/work/BANDIT-064/coordination-log.jsonl
- docs/work/BANDIT-064/red-evidence.md
- docs/work/BANDIT-064/implementation-evidence.md
- docs/work/BANDIT-064/coderabbit-review.md
- docs/work/BANDIT-064/local-qwen-review.md
- docs/work/BANDIT-064/review-evidence.md
- docs/work/BANDIT-064/landing-verdict.md
- docs/work/BANDIT-064/landing-action.md
- docs/work/BANDIT-064/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-policy chore or running formation review. Repo artifacts identify the next action as Trust Verifier Cutover Gate triage, define the required cutover-gate fields, and authorize Codex PM/Repo PM to route routine artifact, validator, stage capability, test strategy, and review mechanics. Halt if the work would approve Trust Verifier cutover policy, select a Trust Goal for cutover, replace or wrap an old gate path, change product direction, alter UAT policy, approve business tradeoffs, approve explicit cost/risk posture, approve provider-pricing evidence, approve spend-class policy, promote paid reviewer routing, create recurring paid model or reviewer policy, set up an external service, change live routing policy, change claim or worktree lifecycle authority, change dependency or lockfile policy, change merge/push/deploy authority, install or edit global skills, or expand into broader cockpit/product scope.

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
- work_item_pm
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
- Do not write RED evidence before Stage 1 brief and Formation Gate evidence exist.
- Do not run `work-item-pm start` before formation review and `formation_approved` transition evidence exist.
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Do not let `bandit trust verify` replace, wrap, invoke, or mutate existing authoritative gate paths during this chore.
- Do not approve Trust Verifier cutover unless separately and explicitly authorized by operator-owned cutover approval evidence.
- Do not select a Trust Goal for cutover, replace old gate authority, wrap old gate authority, run tests or reviewers from trust verification, mutate queues, mutate coordination state, mutate routing state, land work, close work, change dependencies, change merge/push/deploy behavior, add external services, add paid recurring routes, install global skills, or start unrelated cockpit/product work in this chore.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Stage 2 RED evidence and Stage 3 implementation should use existing abnormal-run soft budget guidance; do not set brittle caps that force duplicate attempts.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation or provider-refusal evidence honestly.
provider_pricing_evidence:
- No new paid provider-pricing evidence is approved by this work-item brief.
- Any paid reviewer, paid model, or recurring paid route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If CodeRabbit or another external reviewer times out, record explicit provider-refusal or continuation evidence instead of treating absence as pass.
- If token or cost failsafe trips, halt the expensive action and record the continuation decision before retrying.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6
