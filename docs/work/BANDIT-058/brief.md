# BANDIT-058: Role Contracts And Run Manifests

## Status

Brief Created

## Non-Product Work

Create the next bounded role-scoped workflow orchestration slice by defining repo-native role contracts and role-run manifest evidence for subagent invocations, without implementing execution packets, diff-based write enforcement, repair continuation, landing packets, closeout packets, scheduler execution, worktree lifecycle, or unrelated cockpit product work.

## Origin

BANDIT-057 closed the first role-scoped orchestration slice and left BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION queued as the replacement umbrella for remaining work. docs/design/role-scoped-workflow-orchestration.md lists Role Contracts And Run Manifests as the first follow-on slice. The current repo state has no active work item and CURRENT_CONTEXT.md requires creating the queued bootstrap-gap work item before unrelated Phase 8 cockpit work.

## Scope

- Define a repo-native Role Contract policy artifact for the first governed roles: Repo PM, Work Item PM, Test Writer, Implementation Writer, Reviewer, Landing Agent, and Closeout Agent.
- Define the minimum role contract fields needed before execution orchestration can rely on roles: role ID, version, authority boundary, allowed stages, required inputs, allowed tools or command families, allowed write-surface families, forbidden actions, required output summary, validation commands, escalation paths, rollback or supersession rule, and owner.
- Define a Role Run Manifest artifact for subagent invocations with work item ID, stage, role contract ID and version, capability profile or subagent identity, base revision, allowed target files, forbidden file patterns, required input packet reference, required summary path, validation commands, and source artifacts.
- Add CLI-owned validation for role contracts and role-run manifests so malformed, incomplete, stale, or authority-confused records fail closed before Work Item PM treats a subagent run as executable evidence.
- Record how role-run manifests remain append-only evidence and derived current-state views remain non-canonical; roadmap, gap ledger, work-item evidence, coordination history, and landing artifacts remain source of truth.
- Preserve the existing Formation Gate: this work item must pass formation review and record formation_approved before Stage 2 RED evidence or Work Item PM execution starts.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-06-01 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope for this chore: Codex PM/Repo PM owns Stage 1 brief creation, formation routing, and context-artifact synchronization; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; Stage 3 Implementation Writer has no authority to edit tests, test helpers, fixtures, RED evidence, or acceptance mappings; reviewers own Stage 4 evidence; Landing Agent owns Stage 5 verdict/action evidence; Closeout Agent/Codex PM own Stage 6 closeout evidence.
- Token-cost failsafe boundary: use existing Token-Cost Failsafe policy for abnormal-run guardrails if paid, high-token, reviewer, or long-running execution becomes necessary; this chore must not approve new provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, or operator-owned cost/risk overrides.
- Future-work scope: this chore must not implement generated execution packets, generated role input packets, diff-based write validation, same-agent repair continuation, stage-specific repair manifests, landing subagent packets, closeout packets, broad claimability, claim leases, work surface reservations, scheduler execution, worktree lifecycle execution, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, dependency or lockfile changes, installed global skill edits, external service integration, state-index persistence, local server/API mode, full rubric migration, or unrelated Phase 8 cockpit feature work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-058/brief.md and links to BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION as the active queued replacement umbrella.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage Capability Scope requirements, Codex-owned technical decisions, source hierarchy, Formation Gate requirement, role contract boundary, role-run manifest boundary, append-only evidence boundary, source-of-truth boundary, and Token-Cost Failsafe boundary.
- Focused RED evidence proves Bandit currently lacks enforced Role Contract policy validation and Role Run Manifest validation for required role identity, authority, version, stage, base revision, write-surface, forbidden action, input, output summary, and validation command fields.
- Role Contract validation fails closed when a contract omits authority boundary, allowed stages, required input, allowed write-surface families, forbidden actions, required output summary, validation commands, owner, version, or rollback/supersession rule.
- Role Run Manifest validation fails closed when a manifest omits work item ID, stage, role contract ID and version, capability profile or subagent identity, base revision, target files, forbidden file patterns, required input packet reference, required summary path, validation commands, or source artifacts.
- Role Run Manifest validation rejects role/stage mismatches, missing or stale role contract references, missing source artifacts, missing base revision, write-surface patterns outside the role contract, and forbidden action conflicts.
- The implementation keeps role contracts and manifests as repo-native evidence and does not let generated views, caches, cockpit state, trace output, or manifest projections become workflow authority.
- The implementation preserves Formation Gate availability rules: Work Item PM cannot start this work item before required formation review artifacts and a formation_approved coordination transition exist.
- The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review-subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore touches role authority, subagent execution evidence, validation policy, generated templates or schemas, and command routing.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION remains open or is explicitly narrowed only after landing action and retrospective closeout evidence for this bounded slice explain which role-scoped orchestration work remains.
- No execution packet system, role input packet generator, diff-based write validation, same-agent repair continuation, landing/closeout packet system, scheduler, worktree lifecycle, claim lease, work-surface reservation, automatic merge/push/deploy, product UAT approval, dependency or lockfile change, local server/API mode, installed global skill edit, external service integration, full rubric migration, or unrelated Phase 8 cockpit feature work is introduced.

## Verification Plan

- Run focused Role Contract RED/GREEN tests for policy parsing, role ID, version, authority boundary, allowed stages, required inputs, allowed command/tool families, allowed write-surface families, forbidden actions, required output summary, validation commands, owner, and rollback/supersession fields.
- Run focused Role Run Manifest RED/GREEN tests for work item ID, stage, role contract ID and version, capability profile or subagent identity, base revision, target files, forbidden file patterns, required input packet reference, required summary path, validation commands, source artifacts, and append-only evidence shape.
- Run focused mismatch tests proving manifests fail closed for role/stage mismatches, missing contract references, stale contract versions, missing source artifacts, missing base revision, target files outside contract write surfaces, and forbidden action conflicts.
- Run focused authority-boundary tests proving role contracts and manifests cannot replace roadmap/current-context, bootstrap-gap ledger state, coordination history, work-item artifacts, review evidence, landing evidence, UAT, or retrospective evidence.
- Run focused Formation Gate tests proving this work item remains unavailable to Work Item PM before formation review artifacts and formation_approved coordination evidence exist.
- Run node --test test/role-entrypoints-formation.test.mjs if formation approval, role entrypoint routing, or Work Item PM readiness behavior is touched.
- Run node --test test/work-item-create.test.mjs if work-item spec validation, brief rendering, bootstrap-gap linking, or Repo PM creation routing is touched.
- Run node --test test/stage-capability-scope.test.mjs if Stage Capability Scope validation or rendered evidence is touched.
- Run node --test test/token-cost-failsafe.test.mjs if token-cost failsafe references or rendered evidence are touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work-item parsing, templates, bootstrap gaps, coordination history, cockpit status, session-context packets, risk classification, supply-chain gates, input quarantine, operator boundaries, token-cost failsafes, or policy validation beyond focused tests.
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
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-058 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-058 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-058 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-058 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-ROLE-CONTRACTS-RUN-MANIFESTS.json
- docs/work/BANDIT-058/brief.md
- docs/work/BANDIT-058/qwen-formation-review.md
- docs/work/BANDIT-058/coderabbit-formation-review.md
- docs/work/BANDIT-058/formation-review.md
- docs/work/BANDIT-058/coordination-log.jsonl
- docs/work/BANDIT-058/red-evidence.md
- docs/work/BANDIT-058/implementation-evidence.md
- docs/work/BANDIT-058/coderabbit-review.md
- docs/work/BANDIT-058/local-qwen-review.md
- docs/work/BANDIT-058/review-evidence.md
- docs/work/BANDIT-058/landing-verdict.md
- docs/work/BANDIT-058/landing-action.md
- docs/work/BANDIT-058/retrospective.md
- docs/specs/BANDIT-058-red-evidence.json
- docs/specs/BANDIT-058-implementation-evidence.json
- docs/specs/BANDIT-058-landing-verdict.json
- docs/specs/BANDIT-058-retrospective.json
- .bandit/policy/role-contracts.json
- docs/templates/role-contract.md
- docs/templates/role-run-manifest.md
- docs/role-runs/BANDIT-058/
- src/state/role-contracts.ts
- src/state/role-run-manifests.ts
- src/commands/role-contracts.ts
- src/commands/role-runs.ts
- src/commands/validate.ts
- src/cli.ts
- test/role-contracts.test.mjs
- test/role-run-manifests.test.mjs
- test/role-entrypoints-formation.test.mjs
- test/work-item-create.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-058/brief.md
- docs/work/BANDIT-058/qwen-formation-review.md
- docs/work/BANDIT-058/coderabbit-formation-review.md
- docs/work/BANDIT-058/formation-review.md
- docs/work/BANDIT-058/coordination-log.jsonl
- docs/work/BANDIT-058/red-evidence.md
- docs/work/BANDIT-058/implementation-evidence.md
- docs/work/BANDIT-058/coderabbit-review.md
- docs/work/BANDIT-058/local-qwen-review.md
- docs/work/BANDIT-058/review-evidence.md
- docs/work/BANDIT-058/landing-verdict.md
- docs/work/BANDIT-058/landing-action.md
- docs/work/BANDIT-058/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or running formation review. Repo artifacts identify the queued replacement umbrella, accepted role-scoped workflow orchestration design, current Stage Rubric requirements, Clean-Code authority, Formation Gate boundary, Stage Capability Scope boundary, Token-Cost Failsafe boundary, Evidence Freshness SLO boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, and Codex PM/Repo PM authority to choose the first bounded follow-on slice from the accepted design. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the accepted role contract and role-run manifest boundary, business tradeoffs, explicit cost/risk posture, provider-pricing approval, spend-class approval, paid reviewer promotion, recurring paid routing policy, external service setup, live routing policy, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader cockpit/product scope.

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
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Do not infer Work Item PM readiness from brief existence alone.
- Do not treat role contracts or role-run manifests as substitutes for coordination history, review evidence, landing evidence, or closeout evidence.
- Do not implement execution packets, diff-based write validation, repair continuation, landing packets, closeout packets, claim leases, worktrees, scheduler execution, merge, push, deploy, dependency changes, external services, or unrelated cockpit features in this chore.

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
