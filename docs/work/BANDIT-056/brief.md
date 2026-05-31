# BANDIT-056: Evidence Freshness SLOs

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Bandit cockpit and gate trust signals lack artifact-specific Evidence SLOs, freshness budgets, source links, owners, freshness states, staleness reasons, and validation rules for tests, review, UAT, landing, retrospective, and derived projection evidence.

## Origin

The 2026-05-26 strategic review and PRD-001/002/003 source artifacts identify generic confidence badges as insufficient for Bandit's trust layer. `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` is now the first queued bootstrap gap after `BANDIT-055` resolved Token-Cost Failsafe.

## Scope

- Define a repo-native Evidence Freshness SLO policy artifact, expected first at `.bandit/policy/evidence-freshness-slos.json`, that records artifact types, owners, source artifacts, freshness budgets, required freshness states, staleness reasons, missing-evidence propagation, and derived projection rules.
- Define Evidence Trust Signals for tests, CodeRabbit, Local Qwen, escalated review, UAT approval when applicable, landing verdicts, landing actions, retrospectives, bootstrap-gap dispositions, policy evidence, and derived cockpit/session-context projections.
- Define artifact-specific freshness budgets instead of one generic source-head check; review evidence, UAT, landing, retrospective, policy evidence, and derived projections may have different valid source identities, recency expectations, and missing/stale behavior.
- Require trust-signal output to expose source artifact path, owner or authority role, freshness state, staleness reason, and dependent evidence when a derived view depends on missing or stale source evidence.
- Define fail-closed behavior for trusted status exposed without an Evidence SLO, without a source artifact, without an owner, without a freshness state, or without a staleness reason.
- Define cockpit and session-context projection validation so derived views remain non-canonical, propagate missing/stale dependencies, and never silently turn missing evidence into green trust signals.
- Add focused RED evidence before implementation for missing Evidence SLO policy validation, missing freshness-state validation, missing staleness-reason validation, missing source/owner validation, missing dependency propagation, and missing cockpit/session-context trust-signal validation.
- Preserve the Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path, and the Stage 3 Writer has no authority over tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Preserve the Claim Authority, Git Mutation Serializer, Worktree Bootstrap Contract, Event-Driven Wake Scheduler, Agent Observability Trace, Stage Capability Scope, Token-Cost Failsafe, Coordination Event Log Authority, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, review-subject-hash, and repo-native source-of-truth boundaries.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-31 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope for this chore: Codex PM owns Stage 1 brief creation, Stage 2 RED evidence, routine technical routing, and context-artifact synchronization; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, or acceptance mappings; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Token-cost failsafe boundary: this chore should use the existing Token-Cost Failsafe policy for abnormal-run guardrails if paid, high-token, reviewer, scheduler, or long-running execution becomes necessary; it must not approve new provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, or operator-owned cost/risk overrides.
- Future-work scope: this chore must not implement full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work beyond existing CLI-derived payload validation, state-index persistence, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval changes, live reviewer routing changes, paid reviewer promotion, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-056/brief.md and links to BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage Capability Scope requirements, Codex-owned technical decisions, source hierarchy, Evidence SLO policy boundary, Evidence Trust Signal boundary, artifact-specific freshness budget boundary, staleness-reason boundary, missing-evidence propagation boundary, cockpit/session-context projection boundary, and Token-Cost Failsafe boundary.
- Focused RED evidence proves Bandit currently lacks enforced Evidence Freshness SLO policy validation, artifact-specific freshness-state validation, staleness-reason validation, source/owner validation, dependency propagation, and cockpit/session-context trust-signal validation.
- Evidence Freshness SLO policy validation requires every trusted evidence signal to declare artifact type, source artifact, owner or authority role, freshness budget or source identity rule, freshness state, and staleness reason behavior.
- Validation fails closed when a trusted state is exposed for tests, CodeRabbit, Local Qwen, escalated review, UAT, landing verdict, landing action, retrospective, bootstrap-gap disposition, policy evidence, or projection status without an applicable Evidence SLO.
- Derived cockpit and session-context views propagate missing or stale source dependencies instead of silently reporting trusted status.
- Review evidence freshness remains tied to review-subject-hash semantics where applicable and records how artifact-specific SLO state composes with that hash.
- UAT and landing freshness rules distinguish source drift, branch-code changes after UAT, landing-verdict staleness, missing landing action evidence, and retrospective closeout state.
- Policy and projection evidence freshness rules preserve CLI authority and repo-native artifacts as canonical state; generated view models, caches, cockpit state, traces, and projections remain derived non-canonical evidence.
- Stage 3 implementation scope preserves the Permanent Test Ownership Boundary and Bootstrap Model-Family Separation.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore touches workflow gate semantics, cockpit/session-context trust signals, generated policy/templates, command routing, and validation behavior.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservation implementation, automatic merge/push/deploy behavior, product UAT approval change, cockpit UI/server/API work beyond existing CLI-derived payload validation, PR/CI workflow, live reviewer routing change, paid reviewer promotion, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused Evidence Freshness SLO RED/GREEN tests for policy parsing, artifact type validation, owner/authority-role validation, source artifact validation, freshness budget validation, freshness state validation, staleness reason validation, missing-evidence propagation, and derived projection trust-signal output.
- Run focused tests proving trusted status fails closed when no artifact-specific Evidence SLO applies.
- Run focused tests proving review-subject-hash freshness remains valid for Stage 4 review evidence while artifact-specific Evidence SLO state adds explicit owner, source, freshness state, and staleness reason reporting.
- Run focused tests proving UAT, landing verdict, landing action, and retrospective trust signals distinguish missing evidence, source drift, stale approval, and closed-work-item state.
- Run focused tests proving cockpit status and session-context outputs remain derived non-canonical projections and propagate stale or missing dependencies rather than hiding them.
- Run node --test test/evidence-freshness-slos.test.mjs.
- Run node --test test/cockpit-status.test.mjs if cockpit status trust-signal payloads are touched.
- Run node --test test/focused-session-context.test.mjs if session-context trust-signal payloads are touched.
- Run node --test test/work-item-create.test.mjs if work-item spec validation, brief rendering, or template integration is touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/land-check.test.mjs if landing evidence freshness semantics are touched.
- Run node --test test/review-subject-hash.test.mjs if review-subject-hash semantics are touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work item parsing, templates, bootstrap gaps, review evidence, landing evidence, cockpit status, session-context packets, risk classification, supply-chain gates, input quarantine, operator boundaries, token-cost failsafes, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run npm run bandit -- evidence-freshness-slos validate --json.
- Run npm run bandit -- token-cost-failsafe validate --json.
- Run npm run bandit -- stage-capability-scope validate --json.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- supply-chain-gate validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-056 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-056 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-056 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-056 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS.json
- docs/work/BANDIT-056/brief.md
- docs/work/BANDIT-056/red-evidence.md
- docs/work/BANDIT-056/implementation-evidence.md
- docs/work/BANDIT-056/coderabbit-review.md
- docs/work/BANDIT-056/local-qwen-review.md
- docs/work/BANDIT-056/review-evidence.md
- docs/work/BANDIT-056/landing-verdict.md
- docs/work/BANDIT-056/landing-action.md
- docs/work/BANDIT-056/retrospective.md
- docs/specs/BANDIT-056-red-evidence.json
- docs/specs/BANDIT-056-implementation-evidence.json
- docs/specs/BANDIT-056-landing-verdict.json
- docs/specs/BANDIT-056-retrospective.json
- .bandit/policy/evidence-freshness-slos.json
- docs/templates/evidence-freshness-slos.md
- src/state/evidence-freshness-slos.ts
- src/commands/evidence-freshness-slos.ts
- src/commands/cockpit-status.ts
- src/commands/session-context.ts
- src/commands/work-item-create.ts
- src/commands/validate.ts
- src/cli.ts
- test/evidence-freshness-slos.test.mjs
- test/cockpit-status.test.mjs
- test/focused-session-context.test.mjs
- test/work-item-create.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-056/brief.md
- docs/work/BANDIT-056/red-evidence.md
- docs/work/BANDIT-056/implementation-evidence.md
- docs/work/BANDIT-056/coderabbit-review.md
- docs/work/BANDIT-056/local-qwen-review.md
- docs/work/BANDIT-056/review-evidence.md
- docs/work/BANDIT-056/landing-verdict.md
- docs/work/BANDIT-056/landing-action.md
- docs/work/BANDIT-056/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, accepted Evidence SLO trust-signal boundary, current Stage Rubric requirements, Clean-Code authority, Stage Capability Scope boundary, Token-Cost Failsafe boundary, Agent Observability Trace boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, and Codex PM boundary that evidence freshness validation mechanics are routine technical routing when repo evidence and policy are sufficient. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the accepted Evidence Freshness SLO gap, business tradeoffs, explicit cost/risk posture, provider-pricing approval, spend-class approval, paid reviewer promotion, recurring paid routing policy, external service setup, live routing, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json
stages:
- stage1_brief
- stage2_red_evidence
- stage3_implementation
- stage4_review
- stage5_landing
- stage6_retrospective
authority_roles:
- codex_pm
- test_writer
- writer
- reviewer
- landing_agent
required_skills:
- bandit
forbidden_actions:
- edit_tests_as_stage3_writer
- edit_test_helpers_as_stage3_writer
- edit_fixtures_as_stage3_writer
- edit_red_evidence_as_stage3_writer
- edit_acceptance_mappings_as_stage3_writer
- approve_spend_without_operator_authority
- promote_paid_reviewer_route
- merge
- push
- deploy
- edit_installed_global_skills
- change_dependency_or_lockfile_policy
- start_unrelated_phase8_work

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- stage1_pm_brief_creation
- stage2_red_evidence_design
- stage3_writer_dispatch
- stage4_review_gates
- stage5_landing
- stage6_retrospective
provider_pricing_evidence:
- required before any new paid reviewer, paid model, paid/high-token recurring route, or benchmark/evaluation spend
spend_classes:
- local_no_incremental_spend
- operator_approved_one_off_evaluation_spend_required_for_paid_calls
- operator_approved_recurring_spend_required_for_policy_promotion
continuation_decisions:
- continue
- reroute
- pause
- stop
- requires_operator_cost_risk_approval
stage_capability_profiles:
- codex_pm_local_cli
- claude_writer_process_adapter
- coderabbit_pre_pr_review
- local_qwen_review
- landing_agent_local_record
