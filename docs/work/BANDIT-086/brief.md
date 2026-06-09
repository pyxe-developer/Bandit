# BANDIT-086: Coordination Primitive Completion Triage

## Status

Brief Created

work_type: chore

## Non-Product Work

Triage the intake-derived WIL-COORDINATION-PRIMITIVE proposal by comparing the accepted 2026-05-24 coordination primitive decision, landed Phase 6 coordination work, later role/formation/coordination evidence, and current workflow needs, then record a bounded recommendation, missing-slice scope, explicit no-action decision, or explicit deferred disposition without implementing new coordination primitive behavior in this work item.

## Origin

CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, FOLLOWUPS.md, docs/decisions/2026-05-24-coordination-primitive-state-ledger.md, and BANDIT-085 closeout evidence identify WIL-COORDINATION-PRIMITIVE as the next intake-derived gap after BANDIT-085 landed and closed. FOLLOWUPS.md records the source question from the 2026-05-24 coordination primitive discussion: after the bootstrap-gap lane is exhausted, resolved, blocked, or explicitly dispositioned, determine the first implementation slice for the per-work-item coordination log and shared core state machine. Since Phase 6 and later slices already landed per-work-item coordination logs, shared core state, typed extensions, derived status, safe triggers, actor coordination events, formation gating, and role-run/coordination evidence, this work item must first triage completion evidence before authorizing new work.

## Scope

- Use WIL-COORDINATION-PRIMITIVE as the source proposal and form one bounded non-product triage chore before PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 work.
- Review docs/decisions/2026-05-24-coordination-primitive-state-ledger.md, FOLLOWUPS.md, .bandit/work-intake-ledger.json, docs/work/BANDIT-025, docs/work/BANDIT-026, docs/work/BANDIT-028, later role/formation coordination evidence, current cockpit/session-context outputs, and BANDIT-085 repo-wide transition-index disposition to determine which coordination-primitive requirements are already satisfied.
- Compare the accepted coordination primitive design against landed capabilities: per-work-item append-only coordination logs, step transitions, actor coordination events, shared core lifecycle, typed extensions for slices and chores, derived current-state views, safe triggers, formation-approved execution boundaries, and closeout semantics.
- Identify only concrete missing command, validation, artifact, state-machine, or disposition work that is still necessary before PR/CI/CD landing policy, installed-copy update path, V0 trial work, broader cockpit workflows, unattended scheduling, or cross-repo coordination depends on the coordination primitive.
- Record a source-cited disposition artifact that recommends one of: no-action because the primitive is already sufficient, deferred because missing pieces are not yet required, one or more narrow future implementation slices, or an operator-owned product/policy question if repo artifacts cannot decide.
- If future implementation is recommended, keep it narrow and name required source artifacts, state-machine boundary, canonical coordination-history source, derived projection boundary, validators, RED tests, acceptance criteria, review gates, expected files, and explicit non-goals.
- Preserve per-work-item docs/work/<work-item-id>/coordination-log.jsonl files as canonical append-only coordination history; derived current-state, cockpit, session-context, queue, intake, report, browser, cache, and index surfaces remain non-authoritative.
- Keep this chore as evidence review, policy-contract drafting, validation planning, or disposition work only until later stages explicitly authorize implementation; Stage 1 formation must not create RED evidence or implementation artifacts.
- Record CLEAN_CODE.md read evidence in the brief and require later clean-code compliance review before landing any implementation, policy, validator, or disposition artifact.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns plan-mode orchestration only after formation approval; Test Writer owns Stage 2 RED evidence if later implementation is scoped; if Codex authors RED tests, Stage 3 implementation goes to a different model family; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent owns Stage 6.
- Token-cost failsafe boundary: use local-only default guidance for triage and existing abnormal-run safeguards for reviewer execution; this work approves no paid reviewer route, paid model route, recurring spend class, hosted service, public benchmark publication, merge, push, deploy, local API, State Index, scheduler, claim/worktree lifecycle, guarded browser action execution, cross-repo coordination runtime, or external side effect.

## Out Of Scope

- Do not implement new coordination commands, state-machine transitions,
  validators, derived indexes, caches, local APIs, State Index behavior,
  schedulers, heartbeats, work availability wakes, claim leases, work-surface
  reservations, worktrees, cross-repo coordination, browser workflow mutation,
  merge, push, deploy, hosted services, public benchmark publication, paid
  routing, or Trust Verifier cutover in this work item.
- Do not make any derived current-state view, cockpit surface, session-context
  packet, queue/context output, work-intake ledger entry, roadmap text, report,
  browser state, static preview, cache, database, or transition index canonical
  workflow authority.
- Do not replace, weaken, rewrite, or bypass per-work-item append-only
  coordination logs as canonical coordination history.
- Do not mutate historical coordination logs except through normal work-item
  lifecycle evidence for this new work item.
- Do not approve a universal claim-first policy, claim authority behavior,
  claim-owned worktree behavior, scheduler execution, local API, State Index
  timing, guarded browser action execution, PR/CI/CD landing behavior,
  installed-copy update behavior, V0 trial product scope, merge, push, deploy,
  paid routing, hosted services, public benchmark publication, or Trust
  Verifier cutover.
- Do not create `orchestration-plan.md`, RED evidence, implementation evidence,
  Stage 4 review evidence, landing evidence, UAT evidence, or retrospective
  evidence before Stage 1 formation is approved and the next role owns that
  stage.

## Acceptance Criteria

- The brief identifies WIL-COORDINATION-PRIMITIVE as the next authorized intake-derived gap proposal after BANDIT-085 closeout and records no open bootstrap gap blocking this formation.
- The work item states that current source-of-truth policy remains unchanged during this triage: per-work-item coordination logs are canonical append-only coordination history, while derived status, queue, cockpit, session-context, intake, report, browser, cache, and index surfaces are non-canonical projections.
- The work item requires source evidence review across FOLLOWUPS.md, .bandit/work-intake-ledger.json, docs/decisions/2026-05-24-coordination-primitive-state-ledger.md, BANDIT-025, BANDIT-026, BANDIT-028, later role/formation coordination evidence, current cockpit and session-context outputs, BANDIT-085 repo-wide transition-index disposition, docs/verification/STAGE_RUBRICS.md, CLEAN_CODE.md, and applicable policy/smell-trigger artifacts.
- The work item can land only with a recorded recommendation, missing-slice scope, no-action decision, or deferred disposition that names source evidence and avoids unstated implementation approval for scheduler, claim/worktree, local API, State Index, browser mutation, PR/CI/CD, installed-copy update, merge/push/deploy, paid routing, hosted service, public benchmark, or Trust Verifier surfaces.
- If future implementation is recommended, the recommendation must identify the exact missing coordination primitive requirement, source artifacts, canonical coordination-history boundary, derived projection boundary, validation behavior, failure messages, expected tests, review gates, expected files, and explicit non-goals.
- If future implementation is not justified, the work item must record why landed Phase 6 and later coordination artifacts are sufficient for the observed cockpit, session-context, work-intake, queue/context, review, landing, and closeout needs.
- If operator-owned product, policy, cost/risk, State Index timing, local API, scheduler, claim/worktree, guarded action execution, PR/CI/CD, merge/push/deploy, public benchmark, hosted service, Trust Verifier cutover, or cross-repo coordination approval is needed, the work item must halt at that operator-owned gate and state the exact decision needed instead of guessing.
- No Stage 1 artifact approves or implements new coordination primitive behavior, changes source-of-truth authority, creates canonical shared transition state, creates a database or cache, starts scheduler behavior, changes claim authority, creates worktrees, mutates browser workflow state, or changes merge/push/deploy authority.
- The work item preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation for any later RED/implementation stages.
- Stage 4 review must use Local Qwen only through .bandit/reviewers/local-qwen.json via node bin/omlx-chat-completions.mjs, CodeRabbit with a full 10-minute formation/review timeout allowance where applicable, or honest provider-timeout/refusal evidence without claiming a pass.
- Layered risk-classification and supply-chain evidence are required before landing if later implementation touches workflow state projection, command routing, coordination validation, cockpit/session-context output, scheduler, claim/worktree lifecycle, dependencies, lockfiles, package scripts, CI/release workflow, or other supply-chain-sensitive surfaces.
- The work item does not start PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, local API, State Index, guarded browser action execution, merge, push, deploy, paid routing, hosted services, public benchmark publication, cross-repo runtime work, or unrelated Phase 8 product work.

## Verification Plan

- Run Stage 1 formation validation after brief creation, brief repair, Local Qwen formation review, CodeRabbit formation review or provider-timeout evidence, aggregate formation review, and formation_approved coordination evidence.
- For later Stage 2, write RED or disposition evidence proving the coordination primitive completion decision cites source artifacts, preserves per-work-item coordination logs as canonical, distinguishes step-transition authority from actor coordination events, and fails closed on unstated implementation approval.
- For later Stage 2, write tests for any proposed validator, command, state-machine extension, report, projection, policy artifact, or disposition artifact before implementation; if no implementation is recommended, record explicit no-action or deferred disposition evidence instead.
- Run focused coordination-log tests if implementation touches transition-state validation, event parsing, safe triggers, accepted-block semantics, actor-event non-authority, accountable_actor semantics, or closeout state.
- Run focused cockpit/session-context/queue-context tests if implementation touches derived status, projection output, evidence trust signals, or queue display behavior.
- Run work-intake validation/listing tests if this work item changes intake ledger state or future work-intake routing.
- Run operator-boundary tests if implementation adds or changes policy-approval, State Index, local API, scheduler, claim/worktree, guarded browser action, PR/CI/CD, merge/push/deploy, or mechanical-repair behavior.
- Run npm run typecheck if any source code changes are introduced.
- Run npm test if implementation touches shared state, command routing, validators, artifact renderers, coordination history, work intake, cockpit/session-context projection, scheduler, claim authority, worktree lifecycle, policy validation, or package scripts.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs work-intake validate --json.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs coordination validate BANDIT-086 after coordination evidence exists.
- Run git diff --check.
- Before landing in later stages, run Local Qwen through the authorized MLX adapter route, CodeRabbit or honest timeout/refusal evidence, review-subject hash, risk classification and supply-chain gate validation when applicable, landing verdict, land-check, local-record landing action, retrospective, and improvement/no-action disposition evidence.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-09 before creating the source spec and
repairing this brief. This triage chore must keep coordination-primitive
evidence review, decision recording, follow-up scoping, no-action disposition,
and any later validator or command design small, explicit, testable, and
separated from canonical coordination history, workflow authority, scheduler,
claim/worktree, cockpit, merge, push, deploy, and product authority.

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
  improvement/no-action disposition evidence. The operator owns any decision
  that approves new product direction, policy changes, State Index timing,
  local API work, scheduler execution, claim/worktree lifecycle behavior,
  guarded browser action execution authority, Trust Verifier cutover, old-gate
  replacement or wrapping, PR/CI/CD or merge/push/deploy authority, public
  benchmark publication, paid routing or external services, cross-repo
  coordination runtime behavior, business tradeoffs, explicit cost/risk
  posture, or genuinely ambiguous scope.

## Source-Of-Truth And Projection Boundary

- Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
  canonical append-only coordination history for their Work Items.
- Step transitions remain the authoritative lifecycle state. Actor coordination
  events remain advisory unless accepted by CLI validation or Codex PM policy
  into workflow state.
- Derived current-state views, cockpit status, session-context packets,
  queue/context output, work-intake ledger entries, roadmap text, reports,
  browser state, static previews, caches, databases, and transition indexes
  cannot grant workflow authority, claim authority, scheduling authority, Work
  Item allocation, UAT approval, landing approval, or merge/push/deploy
  authority.
- WIL-COORDINATION-PRIMITIVE is source authority for triage formation only. It
  does not allocate work, make entries claimable, start execution, or approve
  implementation until normal Work Item stages and any required operator-owned
  gates are satisfied.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-085` is landed and closed with
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
  source-cited coordination primitive completion triage, canonical
  coordination-log preservation, actor-event non-authority, derived projection
  boundaries, and fail-closed unstated implementation approval.
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
- WIL-COORDINATION-PRIMITIVE is not a bootstrap-gap ledger entry; it is an
  accepted Work Intake Ledger proposal being formed through normal Stage 1.
- Live CodeRabbit may time out or be unavailable; if so, record
  provider-timeout/bootstrap replacement evidence and do not claim a
  CodeRabbit pass.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint
  at `http://127.0.0.1:8000/v1`. If the endpoint or adapter is unavailable,
  stop and ask the operator for help rather than substituting another route.
- New coordination command implementation, state-machine changes, local API,
  State Index, live polling, scheduler, claim/worktree lifecycle, browser
  mutation authority, PR/CI/CD, merge, push, deploy, public benchmark
  publication, paid routing, hosted services, cross-repo runtime work, and
  Trust Verifier cutover remain future work outside this chore.

## Write-Surface Families

- Stage 1 formation artifacts:
  `docs/specs/BANDIT-086-coordination-primitive-completion-triage.json`,
  `docs/work/BANDIT-086/brief.md`,
  `docs/work/BANDIT-086/qwen-formation-review.md`,
  `docs/work/BANDIT-086/coderabbit-formation-review.md`,
  `docs/work/BANDIT-086/formation-review.md`, and
  `docs/work/BANDIT-086/coordination-log.jsonl`.
- Routing and intake state after formation approval:
  `.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, and `STATUS.md`.
- Future-stage artifacts listed under Expected Files remain forbidden in this
  Stage 1 automation until Work Item PM plan mode or later stages own them.

## First Implementation Order

- Work Item PM plan mode should first decide whether this remains disposition
  evidence only or needs Stage 2 RED tests for a missing coordination command,
  validator, state-machine extension, report, projection, or policy artifact.
- If RED evidence is needed, Test Writer should cover source-cited
  recommendation/disposition output, per-work-item coordination-log canonical
  authority, actor-event non-authority, accepted-block and safe-trigger
  boundaries, derived projection boundaries, and operator-owned approval halts
  for implementation surfaces.
- If implementation is needed, add the smallest policy, validator, command,
  report, or disposition artifact support needed to satisfy approved RED
  evidence without changing canonical coordination history, implementing
  scheduler, claim/worktree, local API, State Index, guarded browser mutation,
  PR/CI/CD, merge, push, or deploy behavior.
- Verify the result with focused tests, typecheck when source changes exist,
  Bandit validation, work-intake validation, cockpit/session-context derived
  status, Stage 4 reviews, landing verdict/action, retrospective, and
  improvement/no-action dispositions in normal stage order.

## Smell Triggers

- Any artifact that creates or approves new coordination primitive
  implementation scope without source-cited triage and normal stage approval is
  a blocker.
- Any derived status output, cockpit surface, session-context packet,
  queue/context view, intake ledger entry, report, browser state, cache,
  database, static preview, fixture, generated JSON, local storage, or index
  that becomes canonical workflow state is a blocker.
- Any analysis that weakens, replaces, rewrites, or bypasses per-work-item
  append-only coordination logs as canonical coordination history is a blocker.
- Any implementation that starts scheduler behavior, heartbeat mutation,
  claim/worktree lifecycle, local API, State Index, PR/CI/CD workflow, guarded
  browser action execution, merge, push, deploy, hosted service setup, paid
  routing, public benchmark publication, cross-repo runtime work, or Trust
  Verifier cutover is scope creep.
- Any recommendation that implies Work Item allocation, claimability,
  scheduling, landing, UAT, merge/push/deploy, State Index, local API, or
  product authority from a decision-only chore is a blocker.
- Any large mixed function proposed later that combines coordination-log
  parsing, state-machine mutation, actor-event validation, safe-trigger
  emission, projection freshness, CLI output, roadmap mutation, scheduler
  behavior, claimability, and UI rendering is a clean-code blocker.
- Any fallback that routes derivable projection bookkeeping drift to operator
  input instead of CLI-owned mechanical repair/PM disposition is a blocker,
  while genuine product/policy/cost/risk/State Index/local API/scheduler/
  claim/worktree/merge/deploy decisions must halt for operator input.

## Expected Files

- docs/specs/BANDIT-086-coordination-primitive-completion-triage.json
- docs/work/BANDIT-086/brief.md
- docs/work/BANDIT-086/qwen-formation-review.md
- docs/work/BANDIT-086/coderabbit-formation-review.md
- docs/work/BANDIT-086/formation-review.md
- docs/work/BANDIT-086/coordination-log.jsonl
- docs/work/BANDIT-086/orchestration-plan.md
- docs/work/BANDIT-086/red-evidence.md
- docs/work/BANDIT-086/coordination-primitive-completion-disposition.md
- docs/work/BANDIT-086/implementation-evidence.md
- docs/work/BANDIT-086/writer-report.md
- docs/work/BANDIT-086/stage3-pm-review.md
- docs/work/BANDIT-086/coderabbit-review.md
- docs/work/BANDIT-086/local-qwen-review.md
- docs/work/BANDIT-086/review-evidence.md
- docs/work/BANDIT-086/landing-verdict.md
- docs/work/BANDIT-086/landing-action.md
- docs/work/BANDIT-086/retrospective.md
- docs/work/BANDIT-086/improvement-disposition.md
- .bandit/work-intake-ledger.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-086/brief.md
- docs/work/BANDIT-086/qwen-formation-review.md
- docs/work/BANDIT-086/coderabbit-formation-review.md
- docs/work/BANDIT-086/formation-review.md
- docs/work/BANDIT-086/coordination-log.jsonl
- docs/work/BANDIT-086/orchestration-plan.md
- docs/work/BANDIT-086/red-evidence.md
- docs/work/BANDIT-086/coordination-primitive-completion-disposition.md
- docs/work/BANDIT-086/implementation-evidence.md
- docs/work/BANDIT-086/review-evidence.md
- docs/work/BANDIT-086/landing-verdict.md
- docs/work/BANDIT-086/landing-action.md
- docs/work/BANDIT-086/retrospective.md
- docs/work/BANDIT-086/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create this intake-derived triage work item or complete Stage 1 formation because CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, FOLLOWUPS.md, the 2026-05-24 coordination primitive decision, CLEAN_CODE.md, and Stage Rubrics identify a bounded evidence-review and disposition scope. Halt for operator input if later work would approve new product direction, approve policy changes, approve State Index timing, approve local API work, approve scheduler execution, approve claim/worktree lifecycle behavior, approve guarded browser action execution authority, approve Trust Verifier cutover, replace or wrap old gates, approve PR/CI/CD or merge/push/deploy authority, approve public benchmark publication, approve paid routing or external services, approve cross-repo coordination runtime behavior, approve business tradeoffs, approve explicit cost/risk posture, or resolve genuinely ambiguous scope.

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
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, retrospective evidence, or policy acceptance criteria.
- Do not implement or approve new coordination commands, state-machine transitions, validators, local API, State Index, live polling, scheduler, heartbeat mutation, claim/worktree lifecycle, browser mutation authority, PR/CI/CD workflow, merge, push, deploy, hosted services, public benchmark publication, paid routing, Trust Verifier cutover, cross-repo runtime work, or unrelated Phase 8 product work in this triage chore.
- Do not let per-work-item coordination logs be replaced by a canonical repo-wide ledger or let a derived projection become workflow authority.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM formation uses local-only default guidance.
- Stage 2 RED evidence and Stage 3 implementation use existing abnormal-run soft budget guidance if implementation becomes authorized.
- Reviewer runs may be long-running or provider-dependent and must record continuation, timeout, or refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this brief.
- Any paid reviewer, paid model, recurring paid route, hosted service, public benchmark publication, merge, push, deploy, external service, or recurring high-token policy remains blocked without separate approval.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If Local Qwen endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another Qwen route.
- If CodeRabbit does not return terminal evidence within the required window, record provider-timeout/bootstrap replacement evidence and do not claim a pass.
- If triage discovers product, policy, cost/risk, State Index, local API, scheduler, claim/worktree, guarded action execution, PR/CI/CD, merge/push/deploy, hosted service, public benchmark, cross-repo runtime, or Trust Verifier approval is required, halt before approving or implementing the change.
stage_capability_profiles:
- repo-pm-stage1-formation
- work-item-pm-plan-mode
- test-writer-stage2
- implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6
