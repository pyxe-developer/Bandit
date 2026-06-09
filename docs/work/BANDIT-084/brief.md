# BANDIT-084: Claim-First Transition Policy Triage

## Status

Brief Created

work_type: chore

## Non-Product Work

Triage the intake-derived WIL-CLAIM-FIRST proposal by inspecting landed coordination-log and claim-authority evidence, then record a bounded recommendation, follow-up scope, or explicit no-action/deferred disposition without approving a universal claim-first policy change in this work item.

## Origin

CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, and FOLLOWUPS.md identify WIL-CLAIM-FIRST as the next intake-derived gap after BANDIT-083 landed and closed. FOLLOWUPS.md records the source question from the 2026-05-24 coordination primitive discussion: during bootstrap every step transition needs an accountable actor, but an explicit prior claim event is required only for delegated or asynchronous work; after bootstrap, Bandit should revisit whether every step transition should require an explicit actor claim first. The existing accepted claim-authority decision and policy already define Git refs CAS authority for release-authorized writable claims, while per-work-item coordination logs preserve append-only workflow history. This work item is triage only: Codex PM may inspect evidence and produce a recommendation or disposition, but any actual policy approval that requires every post-bootstrap transition to claim first remains operator-owned.

## Scope

- Use WIL-CLAIM-FIRST as the source proposal and form one bounded non-product triage chore before Repo-Wide Transition Index Decision, Coordination Primitive Completion Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 work.
- Inspect landed coordination-log evidence from recent work items and the accepted claim-authority artifacts to compare current accountable-actor transition practice against explicit claim-first requirements.
- Classify transition contexts that are already covered by accountable_actor evidence, delegated/asynchronous claim requirements, Git refs CAS claim authority, or coordination history.
- Record a policy recommendation, follow-up work-item scope, explicit no-action decision, or explicit deferred disposition based on repo evidence, without silently changing the current claim requirement.
- If the evidence supports a future implementation slice, keep it narrow and name required artifacts, validators, tests, operator approval gates, and out-of-scope authority changes.
- Preserve the distinction between append-only coordination history, Git refs writable-claim authority, .bandit claim projections, cockpit/status projections, and future scheduler/worktree authority.
- Keep this chore as analysis, policy-contract drafting, validation planning, or disposition work only until later stages explicitly authorize implementation; Stage 1 formation must not create RED evidence or implementation artifacts.
- Record CLEAN_CODE.md read evidence in the brief and require later clean-code compliance review before landing any implementation or policy artifact.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns plan-mode orchestration only after formation approval; Test Writer owns Stage 2 RED evidence if later implementation is scoped; if Codex authors RED tests, Stage 3 implementation goes to a different model family; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent owns Stage 6.
- Token-cost failsafe boundary: use local-only default guidance for triage and existing abnormal-run safeguards for reviewer execution; this work approves no paid reviewer route, paid model route, recurring spend class, hosted service, merge, push, deploy, public benchmark publication, or external side effect.

## Out Of Scope

- Do not approve universal claim-first policy during Stage 1 formation or later
  execution without separate operator-owned policy approval.
- Do not change claim authority, create claims, release claims, reconcile
  claims, implement worktree lifecycle, start scheduler behavior, or mutate
  coordination history beyond normal work-item lifecycle evidence.
- Do not treat `.bandit` claim projections, cockpit status, roadmap text,
  work-intake entries, generated reports, or browser state as writable claim
  authority.
- Do not start Repo-Wide Transition Index Decision, Coordination Primitive
  Completion Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy
  Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, Trust
  Verifier cutover, local API, State Index, guarded browser action execution,
  merge, push, deploy, paid routing, hosted services, public benchmark
  publication, or unrelated Phase 8 product work.
- Do not create `orchestration-plan.md`, RED evidence, implementation
  evidence, Stage 4 review evidence, landing evidence, UAT evidence, or
  retrospective evidence before Stage 1 formation is approved and the next
  role owns that stage.

## Acceptance Criteria

- The brief identifies WIL-CLAIM-FIRST as the next authorized intake-derived gap proposal after BANDIT-083 closeout and records no open bootstrap gap blocking this formation.
- The work item states that current policy remains unchanged during this triage: every step transition needs an accountable actor, and explicit prior claim events are required only for delegated or asynchronous work unless a later operator-approved policy changes that boundary.
- The work item requires evidence review across recent coordination logs, docs/decisions/2026-05-27-git-refs-claim-authority-backend.md, .bandit/policy/claim-authority.json, .bandit/claims/README.md, docs/templates/claim-authority.md, and relevant Stage Rubrics or smell triggers before recommending any claim-first change.
- The work item distinguishes append-only coordination history from writable claim authority and forbids .bandit projections, cockpit status, roadmap text, or intake-ledger entries from granting active writable claims.
- The work item can land only with a recorded policy recommendation, follow-up scope, no-action decision, or deferred disposition that names source evidence and avoids unstated policy approval.
- If future implementation is recommended, the recommendation must identify narrow validator or artifact scope, required RED tests, claim safety invariants or non-applicability rationale, stage capability boundaries, operator-owned approval gates, and explicit non-goals.
- If universal claim-first policy approval is needed, the work item must halt at the operator-owned policy gate and state the exact decision needed instead of guessing.
- No Stage 1 artifact approves a claim-first policy change, changes claim authority, creates claims, releases claims, reconciles claims, creates worktrees, starts scheduler work, mutates coordination history beyond normal work-item lifecycle evidence, or changes merge/push/deploy authority.
- The work item preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation for any later RED/implementation stages.
- Stage 4 review must use Local Qwen only through .bandit/reviewers/local-qwen.json via node bin/omlx-chat-completions.mjs, CodeRabbit with a full 10-minute formation/review timeout allowance where applicable, or honest provider-timeout/refusal evidence without claiming a pass.
- Layered risk-classification and supply-chain evidence are required before landing if the later implementation touches workflow policy, command routing, claim authority, coordination validation, worktree lifecycle, scheduler, dependencies, lockfiles, package scripts, CI/release workflow, or other supply-chain-sensitive surfaces.
- The work item does not start Repo-Wide Transition Index Decision, Coordination Primitive Completion Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, local API, State Index, guarded browser action execution, merge, push, deploy, paid routing, hosted services, public benchmark publication, or unrelated Phase 8 product work.

## Verification Plan

- Run Stage 1 formation validation after brief creation, brief repair, Local Qwen formation review, CodeRabbit formation review or provider-timeout evidence, aggregate formation review, and formation_approved coordination evidence.
- For later Stage 2, write RED evidence proving claim-first recommendation or disposition output must cite source artifacts, distinguish coordination history from claim authority, and fail closed on unstated policy approval.
- For later Stage 2, write tests for any proposed validator or policy artifact before implementation; if no implementation is recommended, record explicit no-action or deferred disposition evidence instead.
- Run focused claim-authority validation tests if implementation touches claim authority policy, projections, or claim safety simulation.
- Run focused coordination-log tests if implementation touches transition-state validation, accountable_actor semantics, event types, or claim-event preconditions.
- Run operator-boundary tests if implementation adds or changes policy-approval, ambiguous-scope, claim-recovery, or mechanical-repair behavior.
- Run work-intake validation/listing tests if this work item changes intake ledger state or future work-intake routing.
- Run npm run typecheck if any source code changes are introduced.
- Run npm test if implementation touches shared state, command routing, validators, artifact renderers, coordination history, claim authority, worktree lifecycle, scheduler, policy validation, cockpit/session-context projection, or package scripts.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs work-intake validate --json.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs coordination validate BANDIT-084 after coordination evidence exists.
- Run git diff --check.
- Before landing in later stages, run Local Qwen through the authorized MLX adapter route, CodeRabbit or honest timeout/refusal evidence, review-subject hash, risk classification and supply-chain gate validation when applicable, landing verdict, land-check, local-record landing action, retrospective, and improvement/no-action disposition evidence.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-09 before creating this source spec and
repairing this brief. This triage chore must keep evidence review, policy
recommendation, follow-up scoping, no-action disposition, and any later
validator work small, explicit, testable, and separated from writable claim
authority, coordination history, scheduler, worktree, cockpit, merge, push,
deploy, and product authority.

## Role Boundary Evidence

- Repo PM owns Stage 1 source-spec creation, brief repair, formation review
  routing, formation approval, intake-ledger synchronization, and repo-level
  context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it
  may not write tests, implementation, reviewer evidence, landing evidence,
  UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, and
  acceptance mappings if later implementation is scoped.
- Implementation Writer owns Stage 3 source implementation only. If Codex
  authors or materially edits Stage 2 RED tests, Stage 3 implementation must
  use a different model family during bootstrap unless an operator-approved
  policy exception is recorded.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence, or
  policy acceptance criteria for this Work Item.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires
  different-model-family Stage 3 implementation, and verification escalation
  returns to Codex PM because the implementation writer authored the source
  change.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
  verdict/action evidence. Closeout Agent owns Stage 6 retrospective and
  improvement/no-action disposition evidence. The operator owns any policy
  approval that would require every transition to claim first.

## Source-Of-Truth And Claim Boundary

- Append-only per-work-item coordination logs remain canonical workflow
  transition history.
- Git refs under `refs/bandit/*` with `git update-ref --stdin` CAS semantics
  remain the accepted writable claim-authority backend.
- `.bandit/claims/`, in-flight registries, cockpit status, state indexes,
  roadmap text, work-intake entries, generated reports, and browser state are
  projections or source material; they cannot grant, renew, release, complete,
  block, fail, recover, or reconcile writable claims.
- WIL-CLAIM-FIRST is source authority for triage formation only. It does not
  allocate claim authority, start execution, or approve policy until normal
  Work Item stages and any required operator-owned policy gate are satisfied.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-083` is landed and closed with
  landing verdict, landing action, retrospective, improvement disposition,
  work-intake closeout, and synchronized current context, roadmap, and status;
  no open bootstrap gap blocks formation.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product
  work, origin/source authority, bounded scope, out-of-scope boundaries,
  acceptance criteria, verification plan, CLEAN_CODE.md read evidence,
  no-gap disposition, expected files, required evidence, role boundaries,
  operator-input status, source-of-truth boundary, stage capability scope,
  token-cost failsafe, forbidden actions, first implementation order, and smell
  triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must
  produce RED or disposition evidence before any implementation and cover
  source-cited claim-first recommendation/disposition behavior, coordination
  versus claim-authority separation, and fail-closed unstated policy approval.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation
  must be routed to a different model family if Codex authors RED tests and
  must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through
  the MLX adapter route, CodeRabbit or honest provider-timeout/refusal
  evidence, aggregate review, review-subject hash, and risk/supply-chain gates
  where applicable are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check,
  auto-land-check when eligible, and local-record landing evidence are
  required; product UAT is not applicable unless later implementation changes
  an operator-facing product surface.
- Stage 6: Retrospective And Improvement Capture | required later |
  Retrospective, improvement/no-action dispositions, intake-ledger closeout,
  current context, roadmap, and STATUS updates are required before the next
  intake-derived gap begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this intake-derived triage chore.
- WIL-CLAIM-FIRST is not a bootstrap-gap ledger entry; it is an accepted
  Work Intake Ledger proposal being formed through normal Stage 1.
- Live CodeRabbit may time out or be unavailable; if so, record
  provider-timeout/bootstrap replacement evidence and do not claim a
  CodeRabbit pass.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint
  at `http://127.0.0.1:8000/v1`. If the endpoint or adapter is unavailable,
  stop and ask the operator for help rather than substituting another route.

## Write-Surface Families

- Stage 1 formation artifacts: `docs/specs/BANDIT-084-claim-first-transition-policy-triage.json`,
  `docs/work/BANDIT-084/brief.md`,
  `docs/work/BANDIT-084/qwen-formation-review.md`,
  `docs/work/BANDIT-084/coderabbit-formation-review.md`,
  `docs/work/BANDIT-084/formation-review.md`, and
  `docs/work/BANDIT-084/coordination-log.jsonl`.
- Routing and intake state after formation approval: `.bandit/work-intake-ledger.json`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and
  `STATUS.md`.
- Future-stage artifacts listed under Expected Files remain forbidden in this
  Stage 1 automation until Work Item PM plan mode or later stages own them.

## First Implementation Order

- Work Item PM plan mode should first decide whether this remains disposition
  evidence only or needs Stage 2 RED tests for a policy/validator artifact.
- If RED evidence is needed, Test Writer should cover source-cited
  recommendation/disposition output, coordination-history versus
  claim-authority separation, operator-owned policy approval halts, and
  projection non-authority.
- If implementation is needed, add the smallest policy, validator, or
  disposition artifact support needed to satisfy approved RED evidence without
  approving universal claim-first policy.
- Verify the result with focused tests, typecheck when source changes exist,
  Bandit validation, work-intake validation, cockpit/session-context derived
  status, Stage 4 reviews, landing verdict/action, retrospective, and
  improvement/no-action dispositions in normal stage order.

## Smell Triggers

- Any artifact that approves a universal claim-first policy without
  operator-owned policy approval is a blocker.
- Any `.bandit` projection, cockpit/status view, roadmap text, intake-ledger
  entry, generated report, or browser state that grants or recovers writable
  claims is a blocker.
- Any analysis that conflates accountable_actor transition evidence with Git
  refs claim authority is a blocker.
- Any future implementation that changes claim authority, coordination
  transition validation, scheduler behavior, worktree lifecycle, merge, push,
  deploy, paid routing, external services, or Trust Verifier cutover without
  explicit scope and required gates is scope creep.
- Any Stage 3 edit to tests, test helpers, fixtures, RED evidence, acceptance
  mappings, formation evidence, review evidence, landing evidence,
  retrospective evidence, or policy acceptance criteria is a role-boundary
  blocker.

## Expected Files

- docs/specs/BANDIT-084-claim-first-transition-policy-triage.json
- docs/work/BANDIT-084/brief.md
- docs/work/BANDIT-084/qwen-formation-review.md
- docs/work/BANDIT-084/coderabbit-formation-review.md
- docs/work/BANDIT-084/formation-review.md
- docs/work/BANDIT-084/coordination-log.jsonl
- docs/work/BANDIT-084/orchestration-plan.md
- docs/work/BANDIT-084/red-evidence.md
- docs/work/BANDIT-084/implementation-evidence.md
- docs/work/BANDIT-084/review-evidence.md
- docs/work/BANDIT-084/landing-verdict.md
- docs/work/BANDIT-084/landing-action.md
- docs/work/BANDIT-084/retrospective.md
- docs/work/BANDIT-084/improvement-disposition.md
- .bandit/work-intake-ledger.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-084/brief.md
- docs/work/BANDIT-084/qwen-formation-review.md
- docs/work/BANDIT-084/coderabbit-formation-review.md
- docs/work/BANDIT-084/formation-review.md
- docs/work/BANDIT-084/coordination-log.jsonl
- docs/work/BANDIT-084/orchestration-plan.md
- docs/work/BANDIT-084/red-evidence.md
- docs/work/BANDIT-084/implementation-evidence.md
- docs/work/BANDIT-084/review-evidence.md
- docs/work/BANDIT-084/landing-verdict.md
- docs/work/BANDIT-084/landing-action.md
- docs/work/BANDIT-084/retrospective.md
- docs/work/BANDIT-084/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create this intake-derived triage work item or complete Stage 1 formation because CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, FOLLOWUPS.md, accepted coordination/claim authority artifacts, CLEAN_CODE.md, and Stage Rubrics identify a bounded evidence-review and disposition scope. Halt for operator input if later work would approve universal claim-first policy, change claim authority, require every transition to have an explicit prior claim, force-resolve unsafe claim recovery, alter UAT/product/business/cost policy, approve paid routing or external services, approve Trust Verifier cutover, approve merge/push/deploy authority, or resolve genuinely ambiguous scope.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json
stages:
- stage1_brief
- formation_review
- work_item_pm_plan_mode
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
- operator
required_skills:
- bandit
- tdd
- review
forbidden_actions:
- Do not write RED evidence before Stage 1 brief, formation review, and formation_approved transition evidence exist.
- Do not run Work Item PM execution before formation_approved.
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, or policy acceptance criteria.
- Do not approve universal claim-first policy, change claim authority, grant claims, release claims, reconcile claims, create worktrees, start scheduler behavior, mutate queue state outside Repo PM-owned intake updates, or treat projections as writable claim authority.
- Do not approve Trust Verifier cutover, old-gate replacement/wrapping, PR/CI workflow, merge, push, deploy, local API, State Index, guarded browser action execution, paid reviewer/model routing, hosted services, public benchmark publication, or unrelated Phase 8 product work.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM formation uses local-only default guidance.
- Stage 2 RED evidence and Stage 3 implementation use existing abnormal-run soft budget guidance if implementation becomes authorized.
- Reviewer runs may be long-running or provider-dependent and must record continuation, timeout, or refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this brief.
- Any paid reviewer, paid model, recurring paid route, hosted service, public benchmark publication, merge, push, deploy, or external side effect remains blocked without separate approval.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If Local Qwen endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another Qwen route.
- If CodeRabbit does not return terminal evidence within the required window, record provider-timeout/bootstrap replacement evidence and do not claim a pass.
- If triage discovers policy approval is required, halt before approving or implementing the policy change.
stage_capability_profiles:
- repo-pm-stage1-formation
- work-item-pm-plan-mode
- test-writer-stage2
- implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6
