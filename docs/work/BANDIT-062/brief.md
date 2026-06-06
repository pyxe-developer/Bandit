# BANDIT-062: Work Item Create Replacement Metadata Preservation

## Status

Brief Created

## Non-Product Work

Repair the work-item creation bootstrap-gap ledger rewrite path so replaced gap metadata is preserved when Repo PM or work-item creation links a queued bootstrap gap to a new active chore.

## Origin

During BANDIT-061 work-item creation, the Repo PM create-work-item path linked the active role-contract gap but rewrote .bandit/bootstrap-gaps.json through serializeBootstrapGapLedger, which omitted replacement_gap, replacement_work_item, and replacement_evidence from the already-replaced BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT entry. npm run bandit -- validate caught the missing replacement_gap field, and Codex PM restored the lost metadata from HEAD before completing the session. BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA is queued to prevent future queued-gap creation from silently dropping replacement evidence.

## Scope

- Add focused RED evidence proving work-item creation and Repo PM create-work-item preserve replacement_gap, replacement_work_item, and replacement_evidence for existing replaced bootstrap gaps while linking an unrelated eligible queued gap to a new active chore.
- Repair the bootstrap-gap ledger serialization used by work-item creation so every parsed BootstrapGap field required for supported dispositions is round-tripped when the ledger is rewritten.
- Keep the fix limited to bootstrap-gap ledger parsing/serialization and work-item creation behavior; do not introduce a new canonical workflow state surface, database index, work queue, or manual ledger-editing authority.
- Preserve CLI authority and fail-closed validation: replaced gaps must still require replacement metadata, replacement evidence paths must still validate, and malformed or ineligible gap links must continue to refuse before writing files.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-06-06 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope for this chore: Codex PM/Repo PM owns Stage 1 brief creation, formation routing, and context-artifact synchronization; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; Stage 3 Implementation Writer has no authority to edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence; reviewers own Stage 4 evidence; Landing Agent owns Stage 5 verdict/action evidence; Closeout Agent/Codex PM owns Stage 6 closeout evidence.
- Token-cost failsafe boundary: use existing Token-Cost Failsafe policy for abnormal-run guardrails if paid, high-token, reviewer, or long-running execution becomes necessary; this chore must not approve new provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, or operator-owned cost/risk overrides.
- Future-work scope: this chore must not implement Work Item PM plan-mode orchestration, Trust Verifier cutover, old gate replacement, role input packets, generated execution packets, Pi/Aperture agent-scope work, claim authority, worktree lifecycle execution, scheduler execution, cockpit UI, dependency or lockfile changes, merge/push/deploy behavior, external service integration, or unrelated Phase 8 product work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-062/brief.md and links to BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA as the active bootstrap gap created from BANDIT-061 work-item creation evidence.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, stage capability scope, source hierarchy, work-item creation authority boundary, bootstrap-gap ledger source-of-truth boundary, replacement metadata round-trip boundary, operator-input status, model-family separation boundary, Permanent Test Ownership Boundary, and out-of-scope orchestration surfaces.
- Focused RED evidence proves the current failure mode: creating or Repo PM-creating a work item for one eligible open gap rewrites the ledger and drops replacement_gap, replacement_work_item, or replacement_evidence from an unrelated replaced gap.
- The implementation preserves replacement_gap, replacement_work_item, and replacement_evidence for replaced gaps during every work-item creation ledger rewrite.
- The implementation preserves existing validations for replaced gaps, including required replacement metadata and existing replacement evidence paths.
- The implementation preserves existing work-item create safety behavior: malformed specs, occupied output paths, specs outside the repository, and ineligible bootstrap gaps fail closed before writes.
- No projection, generated file, helper, or JSON input becomes canonical workflow state authority; .bandit/bootstrap-gaps.json remains the bootstrap-gap ledger source of truth and CLI commands remain the mutation authority.
- The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for this work item.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review-subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore changes workflow command behavior and bootstrap-gap ledger serialization.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA is resolved only after landing action and retrospective closeout evidence exist for this bounded serializer repair chore.
- No Work Item PM plan-mode orchestration, Trust Verifier cutover, old gate replacement, role input packet, generated execution packet, Pi/Aperture agent-scope work, claim authority, worktree lifecycle execution, scheduler execution, cockpit UI, dependency or lockfile change, merge/push/deploy behavior, external service integration, or unrelated Phase 8 product work is introduced.

## Verification Plan

- Run focused work-item create RED/GREEN tests proving replacement metadata survives an unrelated bootstrap-gap link rewrite.
- Run focused Repo PM create-work-item tests proving the role-specific entrypoint preserves the same replacement metadata behavior.
- Run focused bootstrap-gap validation tests if parser or ledger validation semantics change.
- Run node --test test/work-item-create.test.mjs.
- Run node --test test/role-entrypoints-formation.test.mjs if Repo PM creation routing is touched.
- Run node --test test/bootstrap-gaps.test.mjs if bootstrap-gap parsing or validation behavior is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work-item parsing, bootstrap gaps, coordination history, cockpit status, session-context packets, risk classification, supply-chain gates, input quarantine, operator boundaries, token-cost failsafes, evidence freshness, role contracts, role-run manifests, model-family separation, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run npm run bandit -- stage-capability-scope validate --json.
- Run npm run bandit -- token-cost-failsafe validate --json.
- Run npm run bandit -- evidence-freshness-slos validate --json.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- supply-chain-gate validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-062 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-062 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-062 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-062 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA.json
- docs/work/BANDIT-062/brief.md
- docs/work/BANDIT-062/qwen-formation-review.md
- docs/work/BANDIT-062/coderabbit-formation-review.md
- docs/work/BANDIT-062/formation-review.md
- docs/work/BANDIT-062/coordination-log.jsonl
- docs/work/BANDIT-062/red-evidence.md
- docs/work/BANDIT-062/implementation-evidence.md
- docs/work/BANDIT-062/coderabbit-review.md
- docs/work/BANDIT-062/local-qwen-review.md
- docs/work/BANDIT-062/review-evidence.md
- docs/work/BANDIT-062/landing-verdict.md
- docs/work/BANDIT-062/landing-action.md
- docs/work/BANDIT-062/retrospective.md
- docs/specs/BANDIT-062-red-evidence.json
- docs/specs/BANDIT-062-implementation-evidence.json
- docs/specs/BANDIT-062-landing-verdict.json
- docs/specs/BANDIT-062-retrospective.json
- src/commands/work-item-create.ts
- src/state/bootstrap-gaps.ts
- test/work-item-create.test.mjs
- test/role-entrypoints-formation.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-062/brief.md
- docs/work/BANDIT-062/qwen-formation-review.md
- docs/work/BANDIT-062/coderabbit-formation-review.md
- docs/work/BANDIT-062/formation-review.md
- docs/work/BANDIT-062/coordination-log.jsonl
- docs/work/BANDIT-062/red-evidence.md
- docs/work/BANDIT-062/implementation-evidence.md
- docs/work/BANDIT-062/coderabbit-review.md
- docs/work/BANDIT-062/local-qwen-review.md
- docs/work/BANDIT-062/review-evidence.md
- docs/work/BANDIT-062/landing-verdict.md
- docs/work/BANDIT-062/landing-action.md
- docs/work/BANDIT-062/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or running formation review. Repo artifacts identify the queued replacement-metadata serializer gap, current Stage Rubric requirements, Clean-Code authority, Formation Gate boundary, bootstrap-gap ledger source-of-truth boundary, work-item creation mutation authority, replacement metadata round-trip failure, Token-Cost Failsafe boundary, Evidence Freshness SLO boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, and Codex PM/Repo PM authority to route routine serializer-repair mechanics. Halt only if implementation would change product direction, UAT policy, workflow policy beyond preserving explicit replacement metadata, business tradeoffs, explicit cost/risk posture, provider-pricing approval, spend-class approval, paid reviewer promotion, recurring paid routing policy, external service setup, live routing policy, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, Trust Verifier cutover policy, Work Item PM plan-mode policy, or broader cockpit/product scope.

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
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Do not replace .bandit/bootstrap-gaps.json with a projection, cache, or generated input file as bootstrap-gap source of truth.
- Do not use this chore to implement Work Item PM plan-mode orchestration, Trust Verifier cutover, old gate replacement, role input packets, generated execution packets, Pi/Aperture agent-scope work, claim authority, worktree lifecycle execution, scheduler execution, merge, push, deploy, dependency changes, external services, or unrelated cockpit features.

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
