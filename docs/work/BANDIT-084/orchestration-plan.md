# BANDIT-084 Orchestration Plan

contract_version: 1
work_item: BANDIT-084
work_type: chore
orchestrator: work_item_pm
created_at: 2026-06-09T17:56:24Z

This plan is Work Item PM orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review evidence,
landing evidence, retrospective evidence, roadmap, current context, root status,
or work-intake ledger.

## Current Repo State

`BANDIT-084` is the active Phase 8 intake-derived triage chore for
Claim-First Transition Policy Triage. Stage 1 formation is complete:
`docs/work/BANDIT-084/brief.md`,
`docs/work/BANDIT-084/qwen-formation-review.md`,
`docs/work/BANDIT-084/coderabbit-formation-review.md`,
`docs/work/BANDIT-084/formation-review.md`, and
`docs/work/BANDIT-084/coordination-log.jsonl` exist, and the coordination log
records `formation_approved`.

Current coordination state: `formation_approved`.

Current next action: run Work Item PM plan-mode orchestration before RED
evidence. Do not create RED evidence or implementation until this plan exists
and `node ./bin/bandit.mjs work-item-pm start BANDIT-084` records
`orchestration_plan_recorded`.

No operator-owned input is required for plan mode. Operator-owned input becomes
required if this work would approve universal claim-first policy, require every
transition to have an explicit prior claim, change claim authority, force
unsafe claim recovery, change product/UAT/business/cost/risk policy, approve
Trust Verifier cutover, select a Trust Goal for cutover, approve merge, push,
deploy, paid routing, hosted services, public benchmark publication, or make a
policy/product decision repo artifacts cannot answer.

## Stage Sequence

| Stage | Accountable role | Required result |
| --- | --- | --- |
| Stage 2 RED | Test Writer / Work Item PM for disposition-only evidence | RED evidence or explicit disposition evidence maps source-cited recommendation behavior, coordination-history versus claim-authority separation, projection non-authority, and operator-owned policy halt coverage to acceptance criteria. |
| Stage 3 Implementation | Implementation Writer, Claude-family if Codex authored RED | Source or policy-artifact delivery only when Stage 2 authorizes implementation; no test-surface edits and no universal claim-first approval. |
| Stage 4 Review | Reviewer / Codex PM aggregate | CodeRabbit or provider-refusal evidence, Local Qwen via the authorized adapter, risk classification, supply-chain gate when applicable, review-subject hash, and finding disposition evidence. |
| Stage 5 Landing | Landing Agent | Landing verdict, land-check, focused source/evidence commit, source-head/hash refresh as needed, local-record landing action, and no product UAT unless an operator-facing product surface changes. |
| Stage 6 Closeout | Closeout Agent / Codex PM | Retrospective, improvement/no-action/deferred disposition, work-intake closeout, routing sync to the next intake-derived gap, and final validation. |

## Required Evidence

| Stage | Evidence |
| --- | --- |
| Stage 2 | `docs/work/BANDIT-084/red-evidence.md` with acceptance mapping and either RED tests for a narrow artifact/validator or explicit no-implementation/deferred disposition evidence. |
| Stage 3 | `docs/work/BANDIT-084/stage3-dispatch.md` if implementation is needed, `docs/work/BANDIT-084/implementation-evidence.md`, `docs/work/BANDIT-084/writer-report.md`, `docs/work/BANDIT-084/stage3-pm-review.md`, and role/run evidence. |
| Stage 4 | `docs/work/BANDIT-084/coderabbit-review.md`, `docs/work/BANDIT-084/local-qwen-review.md`, risk classification, supply-chain gate when applicable, review-subject hash, finding dispositions when needed, and `docs/work/BANDIT-084/review-evidence.md`. |
| Stage 5 | `docs/work/BANDIT-084/landing-verdict.md`, `docs/work/BANDIT-084/landing-action.md`, land-check output, current source/evidence commit, and UAT evidence only if product-facing implementation unexpectedly enters scope. |
| Stage 6 | `docs/work/BANDIT-084/retrospective.md`, `docs/work/BANDIT-084/improvement-disposition.md`, `.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, coordination closeout, and final validation output. |

## Role Boundaries

- Repo PM owns Stage 1 brief creation, formation review routing, formation
  approval, intake-ledger synchronization, and context synchronization.
- Work Item PM owns this orchestration plan and stage-gate coordination after
  `formation_approved`.
- Test Writer owns Stage 2 tests, helpers, fixtures, RED evidence, and
  acceptance mappings if implementation is scoped.
- Work Item PM may record disposition-only Stage 2 evidence if repo evidence
  supports no implementation, no-action, deferred disposition, or a future
  operator-owned policy gate instead of RED tests.
- Implementation Writer owns Stage 3 source or policy-artifact delivery only
  after Stage 2 authorizes implementation.
- Permanent Test Ownership Boundary: Stage 3 Writer has zero authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence, or
  policy acceptance criteria for `BANDIT-084`.
- Bootstrap Model-Family Separation: if Codex authors or materially edits Stage
  2 RED tests, Stage 3 implementation must use the Claude-family bootstrap
  implementation-writer path unless an operator-approved policy exception is
  recorded.
- Append-only per-work-item coordination logs remain canonical workflow
  transition history. Git refs under `refs/bandit/*` with CAS semantics remain
  the writable claim-authority backend. `.bandit/claims`, cockpit/status
  projections, roadmap text, intake-ledger entries, generated reports, and
  browser state cannot grant, renew, release, complete, block, fail, recover,
  or reconcile writable claims.
- Reviewers own Stage 4 reviewer evidence. Local Qwen may only run through
  `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`.
- Landing Agent owns Stage 5 landing verdict and landing action evidence.
- Operator owns any policy approval requiring every transition to claim first,
  claim-authority changes, unsafe claim recovery, product/UAT/business/cost/risk
  decisions, Trust Verifier cutover, paid routing, hosted service, public
  benchmark publication, merge, push, deploy, or genuinely ambiguous scope.
- Closeout Agent / Codex PM owns Stage 6 retrospective, improvement or
  no-action disposition, work-intake closeout, and routing/status
  synchronization.

## Verification Commands

- `node --test test/coordination-log.test.mjs` when coordination validation,
  accountable-actor semantics, or transition-state behavior changes
- `node --test test/claim-authority.test.mjs` or focused claim-authority tests
  when claim policy, projection, or simulation behavior changes
- `node --test test/operator-boundary.test.mjs` when operator-boundary behavior
  changes
- `npm test` when shared command routing, validators, artifact renderers,
  coordination history, claim authority, work-intake, cockpit/session-context
  projections, or package scripts are touched
- `npm run typecheck` if any source code changes are introduced
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs work-intake validate --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-084`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-084 --base origin/main`
- `npm run bandit -- qwen-review BANDIT-084`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-084`
- `npm run bandit -- risk-classification validate BANDIT-084 --json`
- `npm run bandit -- supply-chain-gate validate BANDIT-084 --json`
- `npm run bandit -- land-check BANDIT-084`
- `git diff --check`

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Known blocker status | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` record no operator-owned input required for plan mode. |
| Open bootstrap gaps | pass | `node ./bin/bandit.mjs cockpit status --json` reports bootstrap gaps status `none`; `.bandit/bootstrap-gaps.json` has no active open gap. |
| Prior work item closed | pass | `docs/work/BANDIT-083/landing-action.md`, `docs/work/BANDIT-083/retrospective.md`, and recent git history show `BANDIT-083` landed and closed before `BANDIT-084` formation. |
| Product UAT before landing | not_applicable | `docs/work/BANDIT-084/brief.md` identifies a non-product triage chore; UAT is only required if product-facing implementation unexpectedly enters scope. |
| Universal claim-first policy approval | blocker | `docs/work/BANDIT-084/brief.md` states approval requiring every transition to claim first is operator-owned and out of scope for this triage chore. |
| Local Qwen availability | non_blocking | Brief records the authorized MLX adapter route and says to stop for operator help if unavailable during Stage 4. |
| CodeRabbit provider availability | non_blocking | Brief allows honest provider-timeout/bootstrap replacement evidence if CodeRabbit is unavailable; no pass may be claimed without terminal evidence. |

## Stop Conditions

- Missing, stale, contradictory, or blocking formation evidence rejected by
  `work-item-pm start`.
- RED evidence lacks acceptance mapping, source-citation requirements,
  operator-owned policy halt coverage, coordination-history versus
  claim-authority separation, projection non-authority coverage, or Stage 3
  test-edit refusal.
- Stage 2 evidence supports universal claim-first policy approval, claim
  authority changes, claim creation/release/reconciliation, scheduler behavior,
  worktree lifecycle, Trust Verifier cutover, merge, push, deploy, paid routing,
  hosted services, public benchmark publication, or guarded browser action
  execution without explicit operator-owned approval.
- Stage 3 Writer edits any test surface, fixture, RED evidence, acceptance
  mapping, formation evidence, review evidence, landing evidence, retrospective
  evidence, or policy acceptance criteria.
- Claude implementation run must not be interrupted before a full 20 minutes
  unless it exits or a hard policy blocker appears; if Claude auth fails or
  times out after 20 minutes, fallback is MiniMax-M3 through headless `pi`.
- `.bandit` claim projections, cockpit/status views, roadmap text,
  intake-ledger entries, generated reports, browser state, tests, or
  disposition prose become writable claim authority.
- CodeRabbit review must not be interrupted before a full 10 minutes unless it
  exits.
- Local Qwen is unavailable through the authorized MLX adapter route.
- Unresolved reviewer findings, stale review-subject evidence, missing risk
  classification, missing supply-chain gate when applicable, or missing
  clean-code evidence.
- `land-check`, `validate`, coordination validation, cockpit status,
  session-context, work-intake validation, or `git diff --check` fails without
  a recorded accepted blocker or bootstrap gap.
- Operator-owned product, UAT, business, policy, cost, risk, Trust Verifier
  cutover, guarded action execution, benchmark publication, paid routing,
  merge, push, deploy, hosted service, local API, State Index, or genuinely
  ambiguous scope decision is required.

## Forbidden Actions

- Do not approve universal claim-first policy, require every transition to have
  an explicit prior claim, change claim authority, grant claims, release claims,
  reconcile claims, create worktrees, start scheduler behavior, mutate
  coordination history beyond normal work-item lifecycle evidence, or treat
  projections as writable claim authority.
- Do not start Repo-Wide Transition Index Decision, Coordination Primitive
  Completion Triage, PR And CI/CD Landing Workflow Policy, Installed-Copy
  Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, Trust
  Verifier cutover, local API, State Index, guarded browser action execution,
  merge, push, deploy, paid routing, hosted services, public benchmark
  publication, or unrelated Phase 8 product work.
- Do not choose local API shape, State Index timing, hosted packaging, external
  service setup, framework migration, dependency additions, lockfile changes,
  package-manager script changes, paid reviewer/model routing, public benchmark
  publication, or live action queue semantics.
- Do not let `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, coordination
  logs, claim projections, roadmap projections, generated reports, tests,
  cockpit rows, browser state, local cache, static HTML, CSS, or UI component
  state become claim, UAT, landing, merge/push/deploy, policy, or Work Item
  execution authority.
- Do not replace current roadmap, current-context, session-context, cockpit
  status, coordination, review, landing, UAT, retrospective, bootstrap-gap,
  risk-classification, supply-chain, artifact-create, work-item-create,
  claim-authority, or Trust Verifier authority.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-084/brief.md`, `docs/work/BANDIT-084/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected | pass | `git status --short --branch` reported `## main...origin/main [ahead 1]` with no dirty paths before plan edits. |
| Recent history inspected | pass | `git log --oneline -5` showed `0610d5e Form BANDIT-084 claim-first triage`, `5f24575 Refine workflow command and PRD authority wording`, `3fa7507 Close out BANDIT-083 cockpit UI polish`, `58e87bc Record BANDIT-083 UAT and landing verdict`, and `f4ee591 Record BANDIT-083 Stage 4 review`. |
| Routing surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` identify `BANDIT-084` and Work Item PM plan mode as the next action. |
| Prior Work Item closed | pass | `docs/work/BANDIT-083/landing-action.md`, `docs/work/BANDIT-083/retrospective.md`, and recent git history show `BANDIT-083` landed and closed. |
| Operator-input status explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `brief.md` state no operator-owned input is required for plan mode; halt conditions preserve policy, product, UAT, business, cost/risk, Trust Verifier, paid-routing, hosted-service, benchmark, merge, push, deploy, local API, State Index, and guarded-action authority. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-084/brief.md` includes non-product work, origin/source authority, bounded scope, out-of-scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, role boundaries, source-of-truth boundary, stage capability scope, expected files, smell triggers, and operator-input status. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-084/qwen-formation-review.md` records `verdict: pass` and `findings_status: no_findings` through the authorized MLX adapter route. |
| CodeRabbit formation review exists and is not blocking | pass | `docs/work/BANDIT-084/coderabbit-formation-review.md` records `verdict: pass`, `findings_status: no_findings`, and terminal `review_completed` evidence with zero findings. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-084/formation-review.md` records `verdict: pass`, no open Stage 1 blockers, and explicit route to Work Item PM plan-mode after formation approval. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-084/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`; `node ./bin/bandit.mjs coordination validate BANDIT-084` passed. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns RED evidence | pass | `brief.md` Role Boundary Evidence assigns tests, helpers, fixtures, RED evidence, and acceptance mappings to Test Writer if implementation is scoped. |
| RED evidence maps to acceptance criteria | pass | This plan requires source-cited claim-first recommendation/disposition behavior, coordination-history versus claim-authority separation, operator-owned policy halt, and projection non-authority coverage before Stage 3. |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` and this plan restate the Permanent Test Ownership Boundary. |
| Codex-authored RED routes Stage 3 to Claude | pass | `brief.md` Verification Plan and Role Boundary Evidence require different-model-family Stage 3 implementation if Codex authors or materially edits RED evidence. |
| `red_recorded` required before implementation | pass | This plan forbids Stage 3 until RED or disposition evidence exists and coordination records the Stage 2 transition. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source delivery only | pass | `brief.md` Stage Capability Scope limits Stage 3 Writer to source or policy-artifact implementation only after Stage 2 authorizes it. |
| No Writer test-surface edits | pass | This plan makes any Stage 3 test-surface edit a stop condition requiring invalidation and rerun. |
| Focused tests pass or bootstrap gap recorded | pass | Verification Commands list focused coordination, claim-authority, operator-boundary, shared test, typecheck, and Bandit validation commands according to touched surfaces. |
| Implementation evidence and Writer report required | pass | Required Evidence lists `implementation-evidence.md`, `writer-report.md`, `stage3-pm-review.md`, dispatch, and run evidence when implementation is scoped. |
| PM acceptance verifies spec and clean code | pass | Stage 3 evidence must map code/artifacts to acceptance criteria and include a `CLEAN_CODE.md` check before Stage 4. |
| Claude 20-minute window preserved | pass | Stop Conditions require giving Claude 20 minutes unless it exits or a hard blocker appears; if Claude auth fails or times out after 20 minutes, fallback is MiniMax-M3 through headless `pi` using file/stdin prompt forms. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal evidence | pass | Verification Commands include `npm run bandit -- coderabbit-review pre-pr BANDIT-084 --base origin/main`; brief allows honest timeout/refusal evidence. |
| Local Qwen review | pass | Verification Commands include `npm run bandit -- qwen-review BANDIT-084`; Local Qwen route is limited to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`. |
| Escalated review if policy smells require it | pass | Stage 4 must evaluate smell triggers, source trust, supply-chain, layered risk, and reviewer disagreement; if escalation is required, use MiniMax-M3 unless MiniMax completed Stage 3, then try Claude and finally Codex GPT-5.5 xhigh. |
| Risk classification | pass | Verification Commands include `npm run bandit -- risk-classification validate BANDIT-084 --json`; aggregate review must classify blast radius, never-auto-landable surfaces, source trust, input quarantine, supply-chain sensitivity, smell triggers, and auto-land eligibility. |
| Supply-chain gate when applicable | pass | Verification Commands include `npm run bandit -- supply-chain-gate validate BANDIT-084 --json`; expected `not_applicable` unless dependency, lockfile, package-manager script, CI/release, skill, fetched-prompt, or external tool-install surfaces change. |
| Every finding repaired or dispositioned | pass | `docs/work/BANDIT-084/review-evidence.md` and finding-disposition artifacts must repair or disposition all actionable findings and cross-model tension. |
| Aggregate review evidence current for the review subject | pass | Verification Commands include `node ./bin/bandit.mjs review-subject-hash BANDIT-084`; review evidence must apply to the current review subject. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required later: `docs/work/BANDIT-084/landing-verdict.md` with an agent-owned verdict. |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-084/brief.md` defines a non-product triage chore; UAT is required only if product-facing implementation unexpectedly enters scope. |
| `land-check` passes | pass | Required later: `npm run bandit -- land-check BANDIT-084` before landing or exact blocker evidence. |
| Clean source/evidence commit before local-record landing | pass | Local-record landing requires a clean source/evidence commit first, followed by source-head/hash refresh as needed. |
| `landing-action.md` records commit SHA or merge evidence | pass | Required later: `docs/work/BANDIT-084/landing-action.md` must record local-record commit SHA or equivalent merge evidence. |
| No next Work Item starts before landing action exists | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and this plan keep the next intake-derived gap blocked behind `BANDIT-084` landing action and closeout evidence. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required later: `docs/work/BANDIT-084/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use pressure, reviewer/model routing, tool invocation friction, recurring inefficiency, cost/latency signals, and unresolved uncertainty. |
| Every lesson has durable disposition | pass | Required later: improvement chore, cross-model tension, smell update, explicit no-action decision, or deferred disposition for every material lesson. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed | pass | Closeout must route to the next intake-derived gap only after landing action, retrospective, and improvement/no-action disposition exist. |
| Cockpit status and session-context agree | pass | Required later: rerun both derived commands after closeout edits. |
| `validate` and `git diff --check` pass | pass | Required later: `npm run bandit -- validate` and `git diff --check`; Stage 6 final validation should not rerun land-check after an evidence-only closeout commit. |
