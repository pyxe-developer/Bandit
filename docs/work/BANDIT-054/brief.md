# BANDIT-054: Stage Capability Scope

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Bandit work-item stages do not yet enforce explicit skill, tool, authority-role, input, output, evidence, and forbidden-action scope before agents or process adapters execute a stage.

## Origin

The PRD-001/PRD-003 research review challenged Bandit's over-decomposed agent-role taxonomy, and the operator confirmed that stage-specific skills and tools should live in Stage Capability Scope rather than in many named agent roles. `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` is now the first queued bootstrap gap after `BANDIT-053` resolved Agent Observability Traces.

## Scope

- Define a repo-native Stage Capability Scope policy artifact, expected first at `.bandit/policy/stage-capability-scope.json`, that records stage IDs, authority roles, required skills, allowed tools, allowed inputs, expected outputs, required evidence, forbidden actions, skill lifecycle contract references, and optional soft budget bands for stages that need abnormal-run failsafes.
- Define how Stage Capability Scope binds to work-item briefs, work-item creation specs, templates, routing evidence, and validation without expanding Bandit's small authority-role set.
- Require each claimable or executable stage to declare the authority role that owns decisions for that stage and to distinguish authority from capability specialization.
- Require load-bearing skills referenced by Stage Capability Scope to point at Skill Lifecycle Contract identity, version, intended stages, required tools, forbidden actions, evaluation packets, and rollback criteria when those contracts exist.
- Require allowed-tool and forbidden-action declarations that cover repository mutation, tests, fixtures, RED evidence, implementation files, review commands, landing commands, external services, paid or high-token execution, merge/push/deploy behavior, and installed global skill edits where applicable.
- Require explicit stage inputs, outputs, and evidence paths so Stage 2 RED evidence, Stage 3 implementation, Stage 4 review, Stage 5 landing, Stage 6 closeout, and any improvement-evaluation stages can be verified without relying on chat context.
- Add focused RED evidence before implementation for missing Stage Capability Scope policy validation, missing required stage fields, missing skill lifecycle contract references for load-bearing skills, missing allowed-tool and forbidden-action enforcement, and missing work-item brief/spec integration.
- Preserve the Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path, and the Stage 3 Writer has no authority over tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Preserve the Claim Authority, Git Mutation Serializer, Worktree Bootstrap Contract, Event-Driven Wake Scheduler, Agent Observability Trace, Coordination Event Log Authority, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, review-subject-hash, Token-Cost Failsafe queue, and Evidence Freshness SLO queue boundaries.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-29 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope for this chore: Codex PM owns Stage 1 brief creation, Stage 2 RED evidence, routine technical routing, and context-artifact synchronization; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, or acceptance mappings; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Token-cost failsafe boundary: this chore may define optional soft budget band fields and abnormal-run failsafe references for stage declarations, but it must not approve paid, high-token, recurring reviewer, provider-pricing, spend-class, or continuation-decision policy changes; `BANDIT-GAP-TOKEN-COST-FAILSAFE` remains queued for the full cost-policy contract.
- Future-work scope: this chore must not implement token-cost failsafe policy, provider-pricing evidence, spend-class approvals, Evidence SLO policy, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, state-index persistence, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-054/brief.md and links to BANDIT-GAP-STAGE-CAPABILITY-SCOPE.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage Capability Scope requirements, Codex-owned technical decisions, source hierarchy, authority-role boundary, skill lifecycle contract reference boundary, allowed-tool boundary, forbidden-action boundary, input/output/evidence boundary, optional soft budget band boundary, and no-new-agent-role boundary.
- Focused RED evidence proves Bandit currently lacks enforced Stage Capability Scope policy validation, required per-stage fields, work-item spec integration, work-item brief/template integration, skill lifecycle contract reference checks, allowed-tool checks, and forbidden-action checks.
- The Stage Capability Scope policy validates authority role, required skills, allowed tools, inputs, outputs, evidence, forbidden actions, lifecycle contract references for load-bearing skills, and optional soft budget band references for each supported stage declaration.
- Work-item creation specs and generated briefs require or render enough Stage Capability Scope data for Stage 1 verification without relying on chat context.
- Stage Capability Scope distinguishes authority roles from capability specialization and does not introduce new specialized agent roles for skill, tool, model, prompt, or reviewer-depth differences.
- Validation fails closed when a claimable or executable stage lacks required skill, tool, input, output, evidence, or forbidden-action declarations.
- Validation fails closed when a load-bearing required skill lacks a lifecycle contract reference where existing policy requires one.
- Stage 3 implementation scope preserves the Permanent Test Ownership Boundary and Bootstrap Model-Family Separation.
- Allowed-tool and forbidden-action declarations are explicit enough to prevent Stage 3 Writers from editing tests, fixtures, RED evidence, or acceptance mappings and to prevent stages from performing merge, push, deploy, installed global skill edits, paid routing, external service setup, or broader authority changes unless a future scoped work item authorizes them.
- Optional soft budget band fields are recorded only as stage-scope metadata or references; broader provider-pricing, paid reviewer, spend-class, and abnormal-run continuation policy remains queued for BANDIT-GAP-TOKEN-COST-FAILSAFE.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore touches workflow policy validation, generated templates or schemas, command routing, skill references, and tool-scope enforcement.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-STAGE-CAPABILITY-SCOPE is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No token-cost failsafe policy, provider-pricing evidence, spend-class approval, Evidence SLO policy, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservation implementation, automatic merge/push/deploy behavior, product UAT approval, cockpit UI/server/API work, PR/CI workflow, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused Stage Capability Scope RED/GREEN tests for policy parsing, required stage fields, authority-role validation, required-skill validation, skill lifecycle contract references, allowed-tool validation, forbidden-action validation, input/output/evidence declarations, optional soft budget band references, and no-new-agent-role behavior.
- Run focused work-item creation and brief rendering tests proving work-item specs and generated briefs carry Stage Capability Scope evidence.
- Run focused tests proving Stage 3 Writer capability scope cannot authorize edits to tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Run focused tests proving forbidden actions refuse merge, push, deploy, installed global skill edits, paid reviewer routing, external service setup, live routing changes, or broader workflow authority without explicit scoped authorization.
- Run focused tests proving optional soft budget band fields do not create provider-pricing evidence, spend-class approval, paid routing policy, or continuation-decision authority.
- Run node --test test/stage-capability-scope.test.mjs.
- Run node --test test/work-item-create.test.mjs if work-item spec validation, brief rendering, or template integration is touched.
- Run node --test test/skill-lifecycle.test.mjs if skill lifecycle references or validation are touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/cockpit-status.test.mjs if derived cockpit status exposes Stage Capability Scope state.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work item parsing, templates, bootstrap gaps, skill lifecycle contracts, risk classification, supply-chain gates, input quarantine, claim authority, git mutation policy, cockpit status, coordination status, scheduler policy, worktree bootstrap behavior, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run npm run bandit -- skill-lifecycle validate --json if required skill lifecycle references are touched.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- supply-chain-gate validate --json because stage capability policy can affect skill references, tool execution surfaces, generated templates or schemas, and command routing.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run npm run bandit -- coordination-authority validate --json if coordination projections or stage routing status are touched.
- Run npm run bandit -- claim validate --json if claimable stage declarations affect claim authority or claim-gated side effects.
- Run npm run bandit -- git-mutation validate --json if worktree or shared `.git` mutation policy is touched.
- Run npm run bandit -- event-driven-wake-scheduler validate --json if scheduler stage activation scope is touched.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-054 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-054 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-054 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-054 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-STAGE-CAPABILITY-SCOPE.json
- docs/work/BANDIT-054/brief.md
- docs/work/BANDIT-054/red-evidence.md
- docs/work/BANDIT-054/implementation-evidence.md
- docs/work/BANDIT-054/coderabbit-review.md
- docs/work/BANDIT-054/local-qwen-review.md
- docs/work/BANDIT-054/review-evidence.md
- docs/work/BANDIT-054/landing-verdict.md
- docs/work/BANDIT-054/landing-action.md
- docs/work/BANDIT-054/retrospective.md
- docs/specs/BANDIT-054-red-evidence.json
- docs/specs/BANDIT-054-implementation-evidence.json
- docs/specs/BANDIT-054-landing-verdict.json
- docs/specs/BANDIT-054-retrospective.json
- .bandit/policy/stage-capability-scope.json
- docs/templates/stage-capability-scope.md
- src/state/stage-capability-scope.ts
- src/commands/stage-capability-scope.ts
- src/commands/work-item-create.ts
- src/commands/validate.ts
- src/cli.ts
- test/stage-capability-scope.test.mjs
- test/work-item-create.test.mjs
- test/skill-lifecycle.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-054/brief.md
- docs/work/BANDIT-054/red-evidence.md
- docs/work/BANDIT-054/implementation-evidence.md
- docs/work/BANDIT-054/coderabbit-review.md
- docs/work/BANDIT-054/local-qwen-review.md
- docs/work/BANDIT-054/review-evidence.md
- docs/work/BANDIT-054/landing-verdict.md
- docs/work/BANDIT-054/landing-action.md
- docs/work/BANDIT-054/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, accepted Stage Capability Scope boundary, current Stage Rubric requirements, Clean-Code authority, Skill Lifecycle Contract boundary, Bootstrap Model-Family Separation, Test Ownership Boundary, Claim Authority boundary, Git Mutation Serializer boundary, Worktree Bootstrap Contract boundary, Event-Driven Wake Scheduler boundary, Agent Observability Trace boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, and Codex PM boundary that stage skill/tool scoping is routine technical routing when repo evidence and policy are sufficient. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the accepted Stage Capability Scope gap, business tradeoffs, explicit cost/risk posture, provider-pricing or spend approval, external service setup, paid reviewer routing, recurring cost policy, live routing, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
