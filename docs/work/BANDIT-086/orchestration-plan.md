# BANDIT-086 Orchestration Plan

contract_version: 1
work_item: BANDIT-086
work_type: chore
current_coordination_state: formation_approved
created_at: 2026-06-09
author: work_item_pm

This plan is Work Item PM orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review
evidence, landing evidence, retrospective evidence, roadmap, current context,
root status, work-intake ledger, or bootstrap-gap ledger.

## Current Repo State

`BANDIT-086` is the active formed work item for the intake-derived
`WIL-COORDINATION-PRIMITIVE` proposal. The current repo routing files, derived
cockpit status, and session-context packet agree that Work Item PM must record
plan-mode orchestration before RED evidence, implementation, review, landing,
UAT, retrospective, PR And CI/CD Landing Workflow Policy, Installed-Copy Update
Path, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8
work.

`BANDIT-085` is the last closed work item and has landing action,
retrospective, improvement disposition, work-intake closeout, and synchronized
roadmap/status evidence. No open bootstrap gap blocks `BANDIT-086`.

`BANDIT-086` is decision/triage only. This plan does not authorize new
coordination primitive implementation, canonical shared transition state, local
API, State Index, scheduler, heartbeat mutation path, claim/worktree lifecycle,
cockpit or browser mutation authority, PR/CI/CD behavior, merge, push, deploy,
Trust Verifier cutover, paid routing, hosted services, public benchmark
publication, cross-repo runtime behavior, or unrelated Phase 8 work.

## Stage Sequence

| Section | Checklist item | Verdict | Evidence |
| --- | --- | --- | --- |
| 0. Context And Boundary | Required reads complete. | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-086/brief.md`, `docs/work/BANDIT-086/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md` were read before this plan. |
| 0. Context And Boundary | Git status inspected and dirty state classified. | pass | `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty working tree entries before this plan edit. |
| 0. Context And Boundary | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context agree. | pass | All name `BANDIT-086` as active, Stage 1 formation approved, with plan-mode orchestration as the next action and no required operator input. |
| 0. Context And Boundary | Prior Work Item is fully closed. | pass | `BANDIT-085` closeout evidence exists in `docs/work/BANDIT-085/landing-action.md`, `docs/work/BANDIT-085/retrospective.md`, `docs/work/BANDIT-085/improvement-disposition.md`, `.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md`. |
| 0. Context And Boundary | Operator-input status is explicit. | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and the brief record `none_required` for the next action; product, policy, UAT, business, cost/risk, State Index, local API, scheduler, claim/worktree, guarded browser action, Trust Verifier, PR/CI/CD, merge, push, deploy, paid routing, hosted service, public benchmark, and cross-repo runtime approvals remain stop conditions. |
| 1. Repo PM Formation Complete | Brief exists and satisfies Stage 1. | pass | `docs/work/BANDIT-086/brief.md` contains non-product work, origin/source authority, bounded scope, out-of-scope, acceptance criteria, verification plan, CLEAN_CODE read evidence, role boundaries, source-of-truth boundary, smell triggers, expected files, stage capability scope, token-cost failsafe, and operator-input status. |
| 1. Repo PM Formation Complete | Qwen formation review exists and is not blocking. | pass | `docs/work/BANDIT-086/qwen-formation-review.md` records `verdict: pass` and `findings_status: no_findings` through `.bandit/reviewers/local-qwen.json` via `node bin/omlx-chat-completions.mjs`. |
| 1. Repo PM Formation Complete | CodeRabbit formation review exists and is not blocking. | bootstrap_gap | `docs/work/BANDIT-086/coderabbit-formation-review.md` records the full 600-second provider timeout as replacement evidence, no CodeRabbit pass claimed, and the partial minor finding repaired. |
| 1. Repo PM Formation Complete | Aggregate formation review exists and is not blocking. | pass | `docs/work/BANDIT-086/formation-review.md` records aggregate `verdict: pass` with CodeRabbit timeout accepted only as bootstrap-gap replacement evidence. |
| 1. Repo PM Formation Complete | `coordination-log.jsonl` records `formation_approved`. | pass | `docs/work/BANDIT-086/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |
| 2. Stage 2 RED Checklist | Test Writer owns tests, fixtures, RED evidence, and acceptance mappings. | pass | Stage 2 will produce `docs/work/BANDIT-086/red-evidence.md`; tests are required only if the triage proves a concrete missing command, validator, state-machine extension, report, projection, or policy artifact needs implementation. |
| 2. Stage 2 RED Checklist | RED evidence maps tests or verification plan to acceptance criteria. | pass | Stage 2 must map source-cited coordination primitive completion triage, canonical coordination-log preservation, actor-event non-authority, derived projection boundaries, and operator-owned approval halts to the brief acceptance criteria. |
| 2. Stage 2 RED Checklist | Stage 3 Writer has zero test-edit authority. | pass | The brief and this plan forbid Stage 3 edits to tests, fixtures, helpers, RED evidence, acceptance mappings, formation, review, landing, UAT, retrospective evidence, and policy acceptance criteria. |
| 2. Stage 2 RED Checklist | If Codex authors RED, Stage 3 routes to Claude/different model family. | pass | Codex PM/Test Writer will author Stage 2 evidence, so Stage 3 dispatch routes to Claude Sonnet 4.6 first, then MiniMax-M3 only after Claude auth failure or 20-minute timeout/no-change evidence. |
| 2. Stage 2 RED Checklist | `red_recorded` is required before implementation. | pass | `node ./bin/bandit.mjs work-item-pm start BANDIT-086` must record this plan first; Stage 2 must then record `red_recorded` before Stage 3 dispatch. |
| 3. Stage 3 Implementation Checklist | Implementation Writer owns source/chore delivery only. | pass | Stage 3 will own only bounded disposition delivery, writer report, PM review, and implementation evidence unless Stage 2 authorizes a narrow implementation surface. |
| 3. Stage 3 Implementation Checklist | No Writer test-surface edits. | pass | Dispatch will explicitly forbid Writer edits to tests, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, retrospective evidence, routing files, and canonical history. |
| 3. Stage 3 Implementation Checklist | Focused tests pass or bootstrap gap is recorded. | pass | Expected commands include `node ./bin/bandit.mjs coordination validate BANDIT-086`, `node ./bin/bandit.mjs work-intake validate --json`, `npm run bandit -- validate`, and `git diff --check`; source tests, typecheck, and focused suites run if Stage 3 changes code or validators. |
| 3. Stage 3 Implementation Checklist | `implementation-evidence.md` and Writer report exist. | pass | Required Stage 3 artifacts: `docs/work/BANDIT-086/coordination-primitive-completion-disposition.md`, `docs/work/BANDIT-086/writer-report.md`, `docs/work/BANDIT-086/stage3-pm-review.md`, and `docs/work/BANDIT-086/implementation-evidence.md`. |
| 3. Stage 3 Implementation Checklist | PM acceptance verifies spec alignment and clean-code posture. | pass | Codex PM will review Stage 3 delivery against the brief, RED evidence, and `CLEAN_CODE.md` before Stage 4. |
| 3. Stage 3 Implementation Checklist | Give Claude 20 minutes before interrupting unless auth fails. | pass | Stage 3 dispatch will run Claude Sonnet 4.6 with a 20-minute timeout/no-change allowance; MiniMax-M3 is fallback only after allowed failure. |
| 4. Stage 4 Review Checklist | CodeRabbit review or provider-refusal/bootstrap evidence. | pass | CodeRabbit must run for the full 10-minute timeout window or record provider-refusal/bootstrap-gap evidence without claiming a pass. |
| 4. Stage 4 Review Checklist | Local Qwen review. | pass | Local Qwen must run only through `.bandit/reviewers/local-qwen.json` via `node bin/omlx-chat-completions.mjs`; if unavailable, halt for operator help. |
| 4. Stage 4 Review Checklist | Escalated review if policy smells require it. | pass | Expected `not_applicable` if Stage 3 remains disposition-only with no source, policy, dependency, scheduler, claim/worktree, merge/push/deploy, paid routing, Trust Verifier, or product-surface changes. |
| 4. Stage 4 Review Checklist | Risk classification. | pass | Record and validate layered risk classification before landing; expected low/non-product if no implementation or authority change enters scope. |
| 4. Stage 4 Review Checklist | Supply-chain gate when applicable. | pass | Record supply-chain gate evidence; expected `not_applicable` unless dependency, lockfile, package script, CI/release, skill, fetched-prompt, or external tool-install surfaces change. |
| 4. Stage 4 Review Checklist | Every finding repaired or dispositioned. | pass | PM disposition must be recorded in `review-evidence.md` and any finding-disposition artifact before Stage 5. |
| 4. Stage 4 Review Checklist | Aggregate review evidence current for the review subject. | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-086` must be current after risk/supply-chain evidence is staged. |
| 5. Stage 5 Landing Checklist | Landing verdict exists. | pass | Required artifact: `docs/work/BANDIT-086/landing-verdict.md`. |
| 5. Stage 5 Landing Checklist | Feature UAT handled when applicable. | not_applicable | `BANDIT-086` is a non-product triage chore; UAT remains not applicable unless Stage 3 unexpectedly changes an operator-facing product surface. |
| 5. Stage 5 Landing Checklist | `land-check` passes. | pass | Required command: `node ./bin/bandit.mjs land-check BANDIT-086` before local-record landing. |
| 5. Stage 5 Landing Checklist | `landing-action.md` records commit SHA or merge evidence. | pass | Required command: `node ./bin/bandit.mjs land BANDIT-086 --action local-record` after a focused source/evidence commit and source-head/hash refresh. |
| 5. Stage 5 Landing Checklist | No next Work Item starts before landing action exists. | pass | PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path, V0 trial work, and unrelated Phase 8 work remain blocked until `BANDIT-086` landing action and closeout complete. |
| 6. Stage 6 Closeout Checklist | Retrospective exists. | pass | Required artifact: `docs/work/BANDIT-086/retrospective.md`. |
| 6. Stage 6 Closeout Checklist | Structured improvement mining complete. | pass | Retrospective must mine tool friction, routing, source-evidence pressure, reviewer availability, cost/latency, role-boundary friction, and unresolved uncertainty. |
| 6. Stage 6 Closeout Checklist | Every lesson has durable disposition. | pass | Required artifact: `docs/work/BANDIT-086/improvement-disposition.md` or explicit no-action/deferred disposition in retrospective. |
| 6. Stage 6 Closeout Checklist | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed. | pass | Closeout must keep the last closed work item as active derived-status anchor and route next to PR And CI/CD Landing Workflow Policy if authorized by repo artifacts. |
| 6. Stage 6 Closeout Checklist | Cockpit status and session-context agree. | pass | Required final commands: `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json`. |
| 6. Stage 6 Closeout Checklist | `validate` and `git diff --check` pass. | pass | Required final commands include `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-086`, and `git diff --check`. |

Stage sequence after this plan: Stage 2 RED/disposition evidence by Test
Writer, Stage 3 bounded disposition delivery by Implementation Writer, Stage 4
review by CodeRabbit/Local Qwen and Codex PM disposition, Stage 5 landing by
Landing Agent, and Stage 6 closeout by Closeout Agent/Codex PM.

## Required Evidence

| Stage | Accountable role | Required artifact or command evidence |
| --- | --- | --- |
| Stage 2 | Test Writer / Work Item PM for disposition-only RED evidence | `docs/work/BANDIT-086/red-evidence.md` and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | Implementation Writer | `docs/work/BANDIT-086/coordination-primitive-completion-disposition.md`, `docs/work/BANDIT-086/writer-report.md`, `docs/work/BANDIT-086/stage3-pm-review.md`, `docs/work/BANDIT-086/implementation-evidence.md`, focused verification, and `implementation_recorded`. |
| Stage 4 | Reviewers / Codex PM disposition | `docs/work/BANDIT-086/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-086/local-qwen-review.md`, risk/supply-chain evidence, `docs/work/BANDIT-086/review-evidence.md`, review-subject hash, and `review_recorded`. |
| Stage 5 | Landing Agent | `docs/work/BANDIT-086/landing-verdict.md`, `land-check`, focused source/evidence commit, `docs/work/BANDIT-086/landing-action.md`, and `landed`. |
| Stage 6 | Closeout Agent / Codex PM | `docs/work/BANDIT-086/retrospective.md`, `docs/work/BANDIT-086/improvement-disposition.md`, work-intake closeout, roadmap/current-context/status sync, validation, and `closed`. |

## Role Boundaries

Repo PM owned Stage 1 formation and may not be used by Work Item PM to
re-approve formation. Work Item PM owns this plan and stage orchestration after
`formation_approved`. Test Writer owns Stage 2 tests, fixtures, helpers, RED
evidence, and acceptance mappings if implementation is scoped. Work Item PM may
record disposition-only Stage 2 evidence if repo evidence supports no
implementation, no-action, deferred disposition, or a future operator-owned
policy gate instead of RED tests. Implementation Writer owns only bounded Stage
3 delivery artifacts. Reviewers own Stage 4 review outputs. Landing Agent owns
Stage 5 landing verdict and landing action. Closeout Agent owns Stage 6
retrospective and improvement/no-action disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-086`.

Bootstrap Model-Family Separation: if Codex authors Stage 2 RED/disposition
evidence, Stage 3 routes to Claude Sonnet 4.6 first. MiniMax-M3 is fallback only
after Claude auth failure or the required 20-minute timeout/no-change condition.

Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
canonical append-only coordination history. Step transitions remain authoritative
lifecycle state. Actor coordination events remain advisory unless accepted by
CLI validation or Codex PM policy into workflow state. Derived current-state,
cockpit, session-context, queue/context, work-intake, report, browser, cache,
database, and index surfaces cannot grant workflow, claim, scheduler, Work Item
allocation, UAT, landing, or merge/push/deploy authority.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-086
node ./bin/bandit.mjs coordination validate BANDIT-086
node ./bin/bandit.mjs work-intake validate --json
node ./bin/bandit.mjs review-subject-hash BANDIT-086
node ./bin/bandit.mjs risk-classification validate --json
node ./bin/bandit.mjs supply-chain-gate validate --json
node ./bin/bandit.mjs land-check BANDIT-086
node ./bin/bandit.mjs land BANDIT-086 --action local-record
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run `npm run typecheck`, `npm test`, and focused tests only if Stage 3 changes
source code, shared validators, command routing, artifact renderers,
coordination history, work intake, cockpit/session-context projections,
scheduler, claim authority, worktree lifecycle, policy validation, package
scripts, dependencies, or lockfiles.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current action. `.bandit/bootstrap-gaps.json` has no
open gap blocking this work item.

Halt for operator input if future evidence would approve new product direction,
approve policy changes, approve State Index timing, approve local API work,
approve scheduler execution, approve claim/worktree lifecycle behavior,
approve guarded browser action execution authority, approve Trust Verifier
cutover policy, select a Trust Goal for cutover, replace or wrap an older gate
path, approve PR/CI/CD or merge/push/deploy authority, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve cross-repo coordination
runtime behavior, approve business tradeoffs, approve explicit cost/risk
posture, approve live reviewer/model routing, or make another policy/product
decision repo artifacts cannot answer.

Local Qwen availability is a hard gate for Stage 4 through the authorized MLX
adapter route. CodeRabbit availability is provider-dependent; timeout/refusal
may be recorded honestly as bootstrap replacement evidence without claiming a
pass.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-086` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED/disposition checks to acceptance criteria.
- Stage 2 authorizes implementation without a concrete missing command,
  validator, state-machine extension, report, projection, policy artifact, or
  source-cited need.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- Claude is unavailable and MiniMax-M3 fallback is unavailable.
- Local Qwen is unavailable through the authorized MLX adapter route.
- CodeRabbit returns actionable findings that are not repaired or dispositioned.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, review-subject hash, land-check,
  coordination validation, work-intake validation, Bandit validation, cockpit
  status, session-context, or diff hygiene fails.
- Any step requires operator-owned policy, product, UAT, business, cost/risk,
  merge/push/deploy, paid-routing, hosted-service, public benchmark, Trust
  Verifier cutover, scheduler, local API, State Index, claim/worktree, guarded
  browser action, cross-repo runtime, or other approval repo artifacts cannot
  answer.

## Forbidden Actions

Do not implement new coordination commands, state-machine transitions,
validators, derived indexes, caches, local APIs, State Index behavior,
schedulers, heartbeats, work availability wakes, claim leases, work-surface
reservations, worktrees, cross-repo coordination, browser workflow mutation,
PR/CI/CD behavior, merge, push, deploy, hosted services, public benchmark
publication, paid routing, or Trust Verifier cutover in this work item unless a
later stage halts for the required operator-owned approval and receives it.

Do not make roadmap text, cockpit status, session-context packets,
work-intake entries, queue/context projections, generated reports, static
previews, tests, browser state, caches, databases, or a transition index into
workflow authority. Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl`
files remain canonical append-only coordination history.

Do not replace, weaken, rewrite, or bypass per-work-item append-only
coordination logs as canonical coordination history. Do not mutate historical
coordination logs except through normal work-item lifecycle evidence for
`BANDIT-086`.
