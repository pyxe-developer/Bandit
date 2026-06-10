# BANDIT-092 Orchestration Plan

contract_version: 1
work_item: BANDIT-092
work_type: slice
current_coordination_state: formation_approved
created_at: 2026-06-10T18:04:00Z
author: work_item_pm

## Current Repo State

`BANDIT-092` is the active formed and formation-approved work item for
`PRD-004.4` - Boundary Cell Movement Gate. The current repo routing files,
derived cockpit status, session-context packet, and coordination log agree
that Work Item PM must record plan-mode orchestration before Stage 2 RED
evidence.

`BANDIT-091` is the last closed work item. Its landing action, retrospective,
improvement disposition, roadmap, current-context, status, and coordination
evidence are present. No open bootstrap gap blocks `BANDIT-092`.

`BANDIT-092` is bounded to repo-native Boundary Cell Movement evidence,
Workflow Trial expansion guardrails, zero-escape expansion refusal,
confirmed-escape contraction checks, aggregate validation wiring, and
template/init support. This plan does not authorize expanded landing autonomy,
actual contour movement, Notify-And-Revert or Auto-Landing Scope approval,
rollback execution, Workflow Trial execution, model gateway work, live
model-call capture, telemetry, `BANDIT-PRD-005`, the V0 Closeout Claude Code
A/B Product-Value Trial, Trust Verifier cutover, cockpit UI, local API, State
Index, hosted services, paid routing, public benchmark publication, merge,
push, deploy, or unrelated Phase 8 work.

## Stage Sequence

| Stage | Accountable role | Required transition | Notes |
| --- | --- | --- | --- |
| Plan Mode | Work Item PM | `orchestration_plan_recorded` | This plan must be recorded before RED evidence. |
| Stage 2 RED | Test Writer | `red_recorded` | Write failing tests for Boundary Cell Movement evidence validation, Workflow Trial expansion guardrails, zero-escape expansion refusal, confirmed-escape contraction checks, and ordinary safe-to-land non-regression. |
| Stage 3 Implementation | Implementation Writer | `implementation_recorded` | Implement only the smallest template, parser/validator helpers, contraction checks, template checks, and aggregate validation wiring needed to satisfy RED tests. If Codex authors RED tests, route implementation to Claude first, then MiniMax-M3 fallback after the required timeout. |
| Stage 4 Review | Reviewers / Codex PM | `review_recorded` | Run CodeRabbit or honest timeout/refusal evidence, Local Qwen through the authorized MLX route, aggregate review, review-subject hash, and applicable risk/supply-chain/input-quarantine checks. |
| Stage 5 Landing | Landing Agent | `landing_verdict_recorded`, then `landed` | Write landing verdict, run land-check, and record local landing action only if gates pass. Product UAT is not applicable unless the implementation changes an operator-facing product surface. |
| Stage 6 Closeout | Closeout Agent | `closed` | Record retrospective, improvement/no-action disposition, current context, roadmap, STATUS, coordination validation, Bandit validation, cockpit/session-context agreement, and diff hygiene. |

## Required Evidence

| Stage | Required artifact or command evidence |
| --- | --- |
| Plan Mode | `docs/work/BANDIT-092/orchestration-plan.md` and `docs/work/BANDIT-092/coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | `docs/work/BANDIT-092/red-evidence.md`, RED test files, acceptance mapping, and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | `docs/templates/boundary-cell-movement.md`, `src/state/boundary-cell-movement.ts`, any focused `src/state/boundary-autonomy.ts`, `src/state/boundary-escape.ts`, `src/commands/validate.ts`, `src/commands/land-check.ts`, `src/state/templates.ts` changes, `docs/work/BANDIT-092/implementation-evidence.md`, `docs/work/BANDIT-092/writer-report.md`, PM acceptance evidence, and `implementation_recorded`. |
| Stage 4 | `docs/work/BANDIT-092/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-092/local-qwen-review.md`, `docs/work/BANDIT-092/review-evidence.md`, review-subject hash, applicable risk/supply-chain/input-quarantine/operator-boundary evidence, and `review_recorded`. |
| Stage 5 | `docs/work/BANDIT-092/landing-verdict.md`, `node ./bin/bandit.mjs land-check BANDIT-092`, `docs/work/BANDIT-092/landing-action.md`, and `landed`. |
| Stage 6 | `docs/work/BANDIT-092/retrospective.md`, `docs/work/BANDIT-092/improvement-disposition.md`, synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, and `closed`. |

## Role Boundaries

Repo PM owns Stage 1 formation and does not own Stage 2 RED, implementation,
review, landing, or closeout artifacts. Work Item PM owns this plan and stage
orchestration after `formation_approved`. Test Writer owns Stage 2 tests,
fixtures, RED evidence, and acceptance mappings. Implementation Writer owns
Stage 3 source/template changes and implementation evidence only. Reviewers own
Stage 4 review outputs. Landing Agent owns Stage 5 landing verdict and landing
action. Closeout Agent owns Stage 6 retrospective and improvement/no-action
disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-092`.

Bootstrap Model-Family Separation: if Codex authors Stage 2 RED tests, Stage 3
implementation routes to Claude or another non-Codex model family unless an
operator-approved policy exception is recorded. Give Claude the required
20-minute work window before fallback unless authentication fails immediately.
If Claude times out or fails after that window, use MiniMax-M3 through headless
`pi` as the fallback.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-092
node ./bin/bandit.mjs coordination validate BANDIT-092
node --test --test-name-pattern "boundary cell|Boundary Cell|Boundary Movement|boundary movement|escape|Escape" test/landing-gates.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs review-subject-hash BANDIT-092
node ./bin/bandit.mjs land-check BANDIT-092
node ./bin/bandit.mjs land BANDIT-092 --action local-record
git diff --check
```

Run focused tests first during Stage 2/3. Full `npm test` is expected before
landing because this slice touches shared validation, landing-gate behavior,
template checks, and aggregate validate behavior.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current action.

An untracked `docs/work/BANDIT-092/local-qwen-review.md` exists at plan time
with source head `cd80d338de6c7a60369779fe4bfb755168262e9a`. Preserve it as
dirty state, but do not treat it as current Stage 4 review evidence unless the
Stage 4 gate regenerates, validates, or explicitly accepts it against the final
review subject.

Halt for operator input if future evidence would expand landing autonomy,
approve Notify-And-Revert or Auto-Landing Scope for a new boundary cell, apply
an autonomy expansion, change product or UAT direction, approve public
benchmark claims, approve paid/live reviewer or model routing, approve hosted
services, approve telemetry, approve merge/push/deploy authority, approve
Trust Verifier cutover, approve external side effects, or resolve genuinely
ambiguous product, business, policy, UAT, or explicit cost/risk scope.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-092` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED tests to acceptance criteria.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- A validator silently accepts malformed Boundary Cell Movement evidence,
  blank work item, malformed source head, missing contour path/version, unknown
  cell id, invalid autonomy level, invalid movement direction, missing linked
  evidence, unsupported operator-decision status, inconsistent direction
  semantics, or missing required Workflow Trial guardrails.
- Autonomy expansion movement evidence is accepted without a Workflow Trial,
  predeclared decision criteria, metric/baseline, uncertainty or minimum
  detectable effect context, evaluation window, re-evaluation window,
  proxy-risk notes, and an operator-reviewed Improvement Decision.
- Zero observed escapes alone are accepted as an autonomy expansion rationale.
- Confirmed Boundary Escape evidence for a notify_and_revert or auto_land cell
  does not force fail-closed contraction evidence before a future boundary
  autonomy claim proceeds.
- Ordinary safe-to-land bootstrap flows become blocked when no
  boundary-autonomy claim and no confirmed boundary escape evidence exists.
- Codex PM guesses on product, UAT, business, policy, explicit cost/risk, or
  genuinely ambiguous scope instead of recording `operator_input_required`.
- Aggregate validation ignores malformed movement artifacts or escape-driven
  contraction blockers in work-item evidence packages.
- Local Qwen is unavailable through the authorized MLX adapter route.
- CodeRabbit returns actionable findings that are not repaired or
  dispositioned.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, input-quarantine/operator-boundary
  evidence, review-subject hash, land-check, coordination validation, Bandit
  validation, typecheck, tests, cockpit/session-context agreement, or diff
  hygiene fails.

## Forbidden Actions

Do not approve expanded landing autonomy, approve Notify-And-Revert or
Auto-Landing Scope for a new boundary cell, move or rewrite the active Boundary
Contour, execute rollback behavior, run live Workflow Trial evaluation, treat
zero observed escapes alone as expansion evidence, implement model-call
gateway behavior, local proxy, wrapper, telemetry backend, hosted service,
provider integration, live model-call capture, PRD-005 command-controller work,
Trust Verifier cutover, cockpit UI, local API, State Index, paid routing,
public benchmark publication, merge, push, deploy, installed-copy update
behavior, PR/CI/CD implementation, scheduler behavior, claim/worktree
lifecycle behavior, guarded browser actions, or unrelated Phase 8 work.

Do not make cockpit output, session-context packets, work-intake entries,
templates, generated JSON, static previews, cache state, report output, or any
derived boundary hash canonical workflow authority. Boundary Cell Movement
evidence is repo-native structured evidence for future movement decisions, but
this slice does not apply a contour update or grant movement authority.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-092/brief.md`, `docs/work/BANDIT-092/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | non_blocking | `git status --short --branch` reported `## main...origin/main [ahead 1]` and untracked `docs/work/BANDIT-092/local-qwen-review.md`; preserve the untracked artifact and do not rely on it as Stage 4 evidence before the Stage 4 gate. |
| Routing surfaces agree | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `node ./bin/bandit.mjs cockpit status --json`, and `node ./bin/bandit.mjs session-context current --json` all point to Work Item PM plan-mode orchestration for `BANDIT-092` before RED evidence. |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-091/landing-action.md`, `docs/work/BANDIT-091/retrospective.md`, `docs/work/BANDIT-091/improvement-disposition.md`, roadmap/current-context/status evidence, and `docs/work/BANDIT-091/coordination-log.jsonl` closed evidence exist. |
| Operator-input status is explicit | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, and `docs/work/BANDIT-092/brief.md` record `none_required` for the current action and list future operator-owned gates. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-092/brief.md` defines goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, and forbidden actions. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-092/qwen-formation-review.md` verdict `pass`, informational findings only. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-092/coderabbit-formation-review.md` records `timeout 600 coderabbit review --agent --type uncommitted`, exit `124`, and honest provider-timeout replacement evidence with no CodeRabbit pass claimed. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-092/formation-review.md` aggregate verdict `pass` with resolved formation findings. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-092/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`; `node ./bin/bandit.mjs coordination validate BANDIT-092` passes. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-092/brief.md` Role Boundary Evidence and this plan reserve Stage 2 tests, fixtures, RED evidence, and acceptance mappings for Test Writer. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Stage 2 must produce `docs/work/BANDIT-092/red-evidence.md` mapping tests for malformed movement evidence, expansion guardrails, zero-escape refusal, confirmed-escape contraction checks, and ordinary safe-to-land non-regression to acceptance criteria. |
| Stage 3 Writer has zero test-edit authority | pass | Permanent Test Ownership Boundary is recorded in `docs/work/BANDIT-092/brief.md` and this plan. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Bootstrap Model-Family Separation is recorded in `docs/work/BANDIT-092/brief.md` and this plan; Stage 3 routes to Claude first, then MiniMax-M3 fallback if required. |
| `red_recorded` is required before implementation | pass | This plan must be recorded by `work-item-pm start`; Stage 2 must then record `red_recorded` in `docs/work/BANDIT-092/coordination-log.jsonl` before Stage 3 implementation begins. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-092/brief.md` and this plan limit Stage 3 to source/template implementation and implementation evidence. |
| No Writer test-surface edits | pass | Permanent Test Ownership Boundary forbids Stage 3 edits to tests, test helpers, fixtures, RED evidence, and acceptance mappings. |
| Focused tests pass or bootstrap gap is recorded | pass | Stage 3 must run focused boundary movement/escape tests first, then typecheck/full tests as required by the brief because shared validators and landing gates are in scope. |
| `implementation-evidence.md` and Writer report exist | pass | Stage 3 required evidence includes `docs/work/BANDIT-092/implementation-evidence.md` and `docs/work/BANDIT-092/writer-report.md`; implementation cannot advance without them. |
| PM acceptance verifies spec alignment and clean-code posture | pass | Stage 3 PM acceptance must check approved scope, role boundaries, acceptance criteria, and `CLEAN_CODE.md` posture before Stage 4. |
| Claude 20-minute rule and fallback routing are explicit | pass | This plan records Claude as first Stage 3 route after Codex-authored RED, with a required 20-minute window before MiniMax-M3 fallback unless authentication fails immediately. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Stage 4 must produce `docs/work/BANDIT-092/coderabbit-review.md` or honest timeout/refusal evidence and must not interrupt CodeRabbit before the required 10-minute window. |
| Local Qwen review | pass | Stage 4 Local Qwen must use only `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`; if unavailable, stop and ask the operator for help. |
| Escalated review if policy smells require it | pass | Escalation must follow smell policy; use MiniMax-M3 unless MiniMax completed Stage 3, then try Claude and fallback to Codex GPT-5.5 xhigh. |
| Risk classification | pass | Stage 4/5 must record applicable risk classification evidence before landing. |
| Supply-chain gate when applicable | pass | Stage 4/5 must record applicable supply-chain evidence before landing. |
| Findings repaired or dispositioned | pass | CodeRabbit/Qwen/escalated findings must be repaired or dispositioned before aggregate review evidence. |
| Aggregate review evidence current for review subject | pass | Stage 4 must record `review_subject_hash` in `docs/work/BANDIT-092/review-evidence.md` and refresh if source or policy evidence changes. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Stage 5 must produce `docs/work/BANDIT-092/landing-verdict.md` before land-check/local-record landing. |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-092/brief.md` says product UAT is not applicable unless implementation changes an operator-facing product surface. |
| `land-check` passes | pass | Stage 5 must run `node ./bin/bandit.mjs land-check BANDIT-092` and repair or block on failures. |
| Clean source/evidence commit, source-head/hash refresh, then landing action | pass | Local-record landing expects a clean source/evidence commit first, refreshed source-head/hash evidence, and then `node ./bin/bandit.mjs land BANDIT-092 --action local-record`. |
| `landing-action.md` records commit SHA or merge evidence | pass | Stage 5 must produce `docs/work/BANDIT-092/landing-action.md` with local-record commit SHA before Stage 6 closeout can complete. |
| No next Work Item starts before landing action exists | pass | Slice boundary rules in `AGENTS.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, and this plan forbid PRD-005 or unrelated next work before landing action evidence. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Stage 6 must produce `docs/work/BANDIT-092/retrospective.md`. |
| Structured improvement mining complete | pass | Stage 6 retrospective must include structured mining signals per `docs/verification/STAGE_RUBRICS.md` and existing retrospective contracts. |
| Every lesson has durable disposition | pass | Stage 6 must produce `docs/work/BANDIT-092/improvement-disposition.md` or explicit no-action dispositions. |
| Current context, roadmap, and STATUS updated if state changed | pass | Stage 6 must synchronize `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md`; keep last closed `BANDIT-092` as active derived-status anchor after closeout until the next slice is formed. |
| Cockpit status and session-context agree | pass | Stage 6 must rerun `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json`. |
| `validate` and `git diff --check` pass | pass | Final validation must include `npm run bandit -- validate` and `git diff --check`; do not rerun land-check after an evidence-only closeout commit. |
