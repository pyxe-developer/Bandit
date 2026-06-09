# BANDIT-085: Repo-Wide Transition Index Decision

## Status

Brief Created

work_type: chore

## Non-Product Work

Triage the intake-derived WIL-REPO-WIDE-TRANSITION-INDEX proposal by inspecting current cockpit, heartbeat, coordination-log, queue/context, and cross-work-item reporting evidence, then record a bounded recommendation, follow-up scope, explicit no-action decision, or explicit deferred disposition without implementing a repo-wide transition index in this work item.

## Origin

CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, and FOLLOWUPS.md identify WIL-REPO-WIDE-TRANSITION-INDEX as the next intake-derived gap after BANDIT-084 landed and closed. FOLLOWUPS.md records the source question from the 2026-05-24 coordination primitive discussion: canonical Step Transition Ledgers are append-only and scoped per work item, a repo-wide canonical ledger would create a shared hot file and weaken review locality, and a derived index may still be useful once cockpit, heartbeat, or cross-work-item query needs are concrete. This work item is decision/triage only: Codex PM may inspect evidence and produce a recommendation, follow-up scope, no-action decision, or deferred disposition, but any implementation of a repo-wide transition index, local API, State Index, scheduler, claim/worktree lifecycle, merge/push/deploy workflow, or cockpit mutation authority remains out of scope.

## Scope

- Use WIL-REPO-WIDE-TRANSITION-INDEX as the source proposal and form one bounded non-product decision chore before Coordination Primitive Completion Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 work.
- Inspect existing per-work-item coordination logs, cockpit status/session-context projections, queue/context output, work-intake ledger output, heartbeat/improvement-health surfaces, and recent Stage 6 closeout evidence to identify concrete query needs that a derived repo-wide transition index might satisfy.
- Compare the benefits of a rebuildable derived transition index against the risks of a repo-wide canonical hot file, duplicate source-of-truth state, stale projection trust, hidden workflow authority, review-locality loss, and unnecessary scheduler or cockpit coupling.
- Record a source-cited decision artifact that recommends one of: no-action, deferred until concrete query pressure exists, a narrow future implementation slice, or an operator-owned policy/product question if repo artifacts cannot decide.
- If a future implementation slice is recommended, keep it narrow and name required source artifacts, derived-only source-of-truth boundary, rebuild contract, freshness rules, validators, RED tests, acceptance criteria, review gates, and explicit non-goals.
- Preserve per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files as canonical append-only transition history; any future repo-wide index must be derived, rebuildable, and non-authoritative unless a later operator-approved policy explicitly changes that boundary.
- Keep this chore as analysis, policy-contract drafting, validation planning, or disposition work only until later stages explicitly authorize implementation; Stage 1 formation must not create RED evidence or implementation artifacts.
- Record CLEAN_CODE.md read evidence in the brief and require later clean-code compliance review before landing any implementation or policy artifact.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns plan-mode orchestration only after formation approval; Test Writer owns Stage 2 RED evidence if later implementation is scoped; if Codex authors RED tests, Stage 3 implementation goes to a different model family; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent owns Stage 6.
- Token-cost failsafe boundary: use local-only default guidance for triage and existing abnormal-run safeguards for reviewer execution; this work approves no paid reviewer route, paid model route, recurring spend class, hosted service, public benchmark publication, merge, push, deploy, local API, State Index, scheduler, claim/worktree lifecycle, or external side effect.

## Out Of Scope

- Do not implement a repo-wide transition index, index writer, cache,
  database, SQLite store, local API, State Index, live polling, scheduler,
  heartbeat mutation path, cockpit mutation path, or browser-side workflow
  authority in this work item.
- Do not make any repo-wide transition artifact canonical workflow state,
  claim authority, scheduling authority, Work Item allocation authority, UAT
  authority, landing authority, merge/push/deploy authority, or policy approval
  authority.
- Do not replace, weaken, or bypass per-work-item append-only coordination logs
  as the canonical Step Transition Ledger source.
- Do not mutate historical coordination logs except through normal work-item
  lifecycle evidence for this new work item.
- Do not start Coordination Primitive Completion Triage, PR And CI/CD Landing
  Workflow Policy, Installed-Copy Update Path, the V0 Closeout Claude Code A/B
  Product-Value Trial, Trust Verifier cutover, guarded browser action
  execution, merge, push, deploy, paid routing, hosted services, public
  benchmark publication, or unrelated Phase 8 product work.
- Do not create `orchestration-plan.md`, RED evidence, implementation
  evidence, Stage 4 review evidence, landing evidence, UAT evidence, or
  retrospective evidence before Stage 1 formation is approved and the next
  role owns that stage.

## Acceptance Criteria

- The brief identifies WIL-REPO-WIDE-TRANSITION-INDEX as the next authorized intake-derived gap proposal after BANDIT-084 closeout and records no open bootstrap gap blocking this formation.
- The work item states that current source-of-truth policy remains unchanged during this triage: canonical Step Transition Ledgers are append-only and scoped per work item; derived status, queue, cockpit, session-context, intake, and report surfaces are non-canonical projections.
- The work item requires source evidence review across FOLLOWUPS.md, .bandit/work-intake-ledger.json, recent `docs/work/*/coordination-log.jsonl` closeout paths, cockpit status/session-context outputs, queue/context projections, heartbeat or improvement-health surfaces, docs/verification/STAGE_RUBRICS.md, CLEAN_CODE.md, and applicable policy/smell-trigger artifacts before recommending any repo-wide index work.
- The work item can land only with a recorded recommendation, follow-up implementation scope, no-action decision, or deferred disposition that names source evidence and avoids unstated State Index, local API, scheduler, claim/worktree, cockpit mutation, merge/push/deploy, or Trust Verifier approval.
- If future implementation is recommended, the recommendation must identify a derived-only rebuild contract, source artifact list, freshness/staleness rules, validation behavior, failure messages, expected tests, review gates, and explicit non-goals.
- If future implementation is not justified, the work item must record why existing per-work-item coordination logs and derived projections are sufficient for the observed cockpit, heartbeat, queue/context, and cross-work-item reporting needs.
- If operator-owned product, policy, cost/risk, State Index timing, local API, scheduler, claim/worktree, merge/push/deploy, public benchmark, hosted service, Trust Verifier cutover, or guarded action execution approval is needed, the work item must halt at that operator-owned gate and state the exact decision needed instead of guessing.
- No Stage 1 artifact approves or implements a repo-wide transition index, changes source-of-truth authority, creates canonical shared transition state, creates a database or cache, starts scheduler behavior, changes claim authority, creates worktrees, mutates browser workflow state, or changes merge/push/deploy authority.
- The work item preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation for any later RED/implementation stages.
- Stage 4 review must use Local Qwen only through .bandit/reviewers/local-qwen.json via node bin/omlx-chat-completions.mjs, CodeRabbit with a full 10-minute formation/review timeout allowance where applicable, or honest provider-timeout/refusal evidence without claiming a pass.
- Layered risk-classification and supply-chain evidence are required before landing if later implementation touches workflow state projection, command routing, coordination validation, cockpit/session-context output, scheduler, claim/worktree lifecycle, dependencies, lockfiles, package scripts, CI/release workflow, or other supply-chain-sensitive surfaces.
- The work item does not start Coordination Primitive Completion Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, local API, State Index, guarded browser action execution, merge, push, deploy, paid routing, hosted services, public benchmark publication, or unrelated Phase 8 product work.

## Verification Plan

- Run Stage 1 formation validation after brief creation, brief repair, Local Qwen formation review, CodeRabbit formation review or provider-timeout evidence, aggregate formation review, and formation_approved coordination evidence.
- For later Stage 2, write RED or disposition evidence proving the repo-wide transition-index decision cites source artifacts, preserves per-work-item coordination logs as canonical, and fails closed on unstated index implementation or source-of-truth authority changes.
- For later Stage 2, write tests for any proposed validator, report, index artifact, projection, freshness rule, or policy artifact before implementation; if no implementation is recommended, record explicit no-action or deferred disposition evidence instead.
- Run focused coordination-log tests if implementation touches transition-state validation, event parsing, accountable_actor semantics, or cross-work-item aggregation.
- Run focused cockpit/session-context/queue-context tests if implementation touches derived status, projection output, evidence trust signals, or queue display behavior.
- Run work-intake validation/listing tests if this work item changes intake ledger state or future work-intake routing.
- Run operator-boundary tests if implementation adds or changes policy-approval, State Index, local API, scheduler, claim/worktree, merge/push/deploy, or mechanical-repair behavior.
- Run npm run typecheck if any source code changes are introduced.
- Run npm test if implementation touches shared state, command routing, validators, artifact renderers, coordination history, work intake, cockpit/session-context projection, scheduler, claim authority, worktree lifecycle, policy validation, or package scripts.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs work-intake validate --json.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs coordination validate BANDIT-085 after coordination evidence exists.
- Run git diff --check.
- Before landing in later stages, run Local Qwen through the authorized MLX adapter route, CodeRabbit or honest timeout/refusal evidence, review-subject hash, risk classification and supply-chain gate validation when applicable, landing verdict, land-check, local-record landing action, retrospective, and improvement/no-action disposition evidence.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-09 before creating this source spec and
repairing this brief. This decision chore must keep evidence review, decision
recording, follow-up scoping, no-action disposition, and any later validator or
index design small, explicit, testable, and separated from canonical transition
history, workflow authority, scheduler, claim/worktree, cockpit, merge, push,
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
  improvement/no-action disposition evidence. The operator owns any decision
  that approves canonical repo-wide transition authority, State Index timing,
  local API, scheduler, claim/worktree lifecycle, merge/push/deploy, Trust
  Verifier cutover, guarded action execution, paid routing, hosted services,
  public benchmark publication, or other product/policy/cost/risk gates.

## Source-Of-Truth And Projection Boundary

- Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
  canonical append-only transition history for their Work Items.
- A repo-wide transition index, if later approved and implemented, must be
  derived, rebuildable, and non-authoritative unless a separate operator-owned
  policy approval changes that boundary.
- `.bandit/work-intake-ledger.json`, cockpit status, session-context packets,
  queue/context projections, heartbeat or improvement-health reports, roadmap
  text, generated summaries, browser state, caches, databases, and static
  previews cannot grant workflow authority, claim authority, scheduling
  authority, Work Item allocation, UAT approval, landing approval, or
  merge/push/deploy authority.
- WIL-REPO-WIDE-TRANSITION-INDEX is source authority for decision formation
  only. It does not allocate work, make entries claimable, start execution, or
  approve implementation until normal Work Item stages and any required
  operator-owned gates are satisfied.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-084` is landed and closed with
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
  source-cited repo-wide index decision behavior, canonical per-work-item
  coordination-log preservation, derived-only projection boundaries, and
  fail-closed unstated implementation approval.
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

- No open bootstrap gap blocks this intake-derived decision chore.
- WIL-REPO-WIDE-TRANSITION-INDEX is not a bootstrap-gap ledger entry; it is an
  accepted Work Intake Ledger proposal being formed through normal Stage 1.
- Live CodeRabbit may time out or be unavailable; if so, record
  provider-timeout/bootstrap replacement evidence and do not claim a
  CodeRabbit pass.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint
  at `http://127.0.0.1:8000/v1`. If the endpoint or adapter is unavailable,
  stop and ask the operator for help rather than substituting another route.
- A repo-wide transition index implementation, local API, State Index, live
  polling, scheduler, claim/worktree lifecycle, browser mutation authority,
  merge, push, deploy, public benchmark publication, paid routing, hosted
  services, and Trust Verifier cutover remain future work outside this chore.

## Write-Surface Families

- Stage 1 formation artifacts:
  `docs/specs/BANDIT-085-repo-wide-transition-index-decision.json`,
  `docs/work/BANDIT-085/brief.md`,
  `docs/work/BANDIT-085/qwen-formation-review.md`,
  `docs/work/BANDIT-085/coderabbit-formation-review.md`,
  `docs/work/BANDIT-085/formation-review.md`, and
  `docs/work/BANDIT-085/coordination-log.jsonl`.
- Routing and intake state after formation approval:
  `.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, and `STATUS.md`.
- Future-stage artifacts listed under Expected Files remain forbidden in this
  Stage 1 automation until Work Item PM plan mode or later stages own them.

## First Implementation Order

- Work Item PM plan mode should first decide whether this remains disposition
  evidence only or needs Stage 2 RED tests for a derived-index policy,
  validator, report, or projection artifact.
- If RED evidence is needed, Test Writer should cover source-cited
  recommendation/disposition output, per-work-item coordination-log canonical
  authority, derived-only rebuild/freshness boundaries, and operator-owned
  approval halts for implementation surfaces.
- If implementation is needed, add the smallest policy, validator, report, or
  disposition artifact support needed to satisfy approved RED evidence without
  creating a canonical repo-wide transition ledger or implementing local API,
  State Index, scheduler, claim/worktree, cockpit mutation, merge, push, or
  deploy behavior.
- Verify the result with focused tests, typecheck when source changes exist,
  Bandit validation, work-intake validation, cockpit/session-context derived
  status, Stage 4 reviews, landing verdict/action, retrospective, and
  improvement/no-action dispositions in normal stage order.

## Smell Triggers

- Any artifact that creates or approves a canonical repo-wide transition ledger
  without separate operator-owned policy approval is a blocker.
- Any derived index, report, status output, queue/context view, cockpit surface,
  browser state, cache, database, static preview, fixture, generated JSON,
  local storage, or roadmap text that becomes canonical workflow state is a
  blocker.
- Any analysis that weakens, replaces, or bypasses per-work-item append-only
  coordination logs as canonical transition history is a blocker.
- Any implementation that starts local API, State Index, live polling,
  scheduler, heartbeat mutation, claim/worktree lifecycle, PR/CI workflow,
  guarded browser action execution, merge, push, deploy, hosted service setup,
  paid routing, public benchmark publication, or Trust Verifier cutover is
  scope creep.
- Any label or recommendation that implies Work Item allocation, claimability,
  scheduling, landing, UAT, merge/push/deploy, State Index, local API, or
  product authority from a decision-only chore is a blocker.
- Any large mixed function proposed later that combines coordination-log
  parsing, cross-work-item aggregation, projection freshness, CLI output, index
  mutation, roadmap mutation, scheduler behavior, claimability, and UI rendering
  is a clean-code blocker.
- Any fallback that routes derivable projection bookkeeping drift to operator
  input instead of CLI-owned mechanical repair/PM disposition is a blocker,
  while genuine product/policy/cost/risk/State Index/local API/merge/deploy
  decisions must halt for operator input.

## Expected Files

- docs/specs/BANDIT-085-repo-wide-transition-index-decision.json
- docs/work/BANDIT-085/brief.md
- docs/work/BANDIT-085/qwen-formation-review.md
- docs/work/BANDIT-085/coderabbit-formation-review.md
- docs/work/BANDIT-085/formation-review.md
- docs/work/BANDIT-085/coordination-log.jsonl
- docs/work/BANDIT-085/orchestration-plan.md
- docs/work/BANDIT-085/red-evidence.md
- docs/work/BANDIT-085/repo-wide-transition-index-disposition.md
- docs/work/BANDIT-085/implementation-evidence.md
- docs/work/BANDIT-085/writer-report.md
- docs/work/BANDIT-085/stage3-pm-review.md
- docs/work/BANDIT-085/coderabbit-review.md
- docs/work/BANDIT-085/local-qwen-review.md
- docs/work/BANDIT-085/review-evidence.md
- docs/work/BANDIT-085/landing-verdict.md
- docs/work/BANDIT-085/landing-action.md
- docs/work/BANDIT-085/retrospective.md
- docs/work/BANDIT-085/improvement-disposition.md
- .bandit/work-intake-ledger.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-085/brief.md
- docs/work/BANDIT-085/qwen-formation-review.md
- docs/work/BANDIT-085/coderabbit-formation-review.md
- docs/work/BANDIT-085/formation-review.md
- docs/work/BANDIT-085/coordination-log.jsonl
- docs/work/BANDIT-085/orchestration-plan.md
- docs/work/BANDIT-085/red-evidence.md
- docs/work/BANDIT-085/repo-wide-transition-index-disposition.md
- docs/work/BANDIT-085/implementation-evidence.md
- docs/work/BANDIT-085/review-evidence.md
- docs/work/BANDIT-085/landing-verdict.md
- docs/work/BANDIT-085/landing-action.md
- docs/work/BANDIT-085/retrospective.md
- docs/work/BANDIT-085/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create this intake-derived decision work item or complete Stage 1 formation because CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, FOLLOWUPS.md, CLEAN_CODE.md, and Stage Rubrics identify a bounded evidence-review and disposition scope. Halt for operator input if later work would approve a canonical repo-wide transition ledger, approve State Index timing, approve local API work, approve scheduler execution, approve claim/worktree lifecycle behavior, approve guarded browser action execution authority, approve Trust Verifier cutover, replace or wrap old gates, approve merge/push/deploy authority, approve public benchmark publication, approve paid routing or external services, change product direction, approve business tradeoffs, approve explicit cost/risk posture, or resolve genuinely ambiguous scope.

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
- Do not implement or approve a repo-wide transition index, local API, State Index, live polling, scheduler, heartbeat mutation, claim/worktree lifecycle, browser mutation authority, PR/CI workflow, merge, push, deploy, hosted services, public benchmark publication, paid routing, Trust Verifier cutover, or unrelated Phase 8 product work in this decision chore.
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
- If triage discovers product, policy, cost/risk, State Index, local API, scheduler, claim/worktree, guarded action execution, merge/push/deploy, hosted service, public benchmark, or Trust Verifier approval is required, halt before approving or implementing the change.
stage_capability_profiles:
- repo-pm-stage1-formation
- work-item-pm-plan-mode
- test-writer-stage2
- implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6
