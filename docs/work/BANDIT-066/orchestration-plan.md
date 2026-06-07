# BANDIT-066 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-066
plan_owner: work_item_pm
created_at: 2026-06-07T17:05:00Z
verdict: pass
artifact_authority: advisory_orchestration_evidence_only

## Current Repo State

`BANDIT-066` is the active Phase 8 product slice for the Browser-Served
Cockpit App Shell. The current coordination state is `formation_approved`.
This plan exists only as Work Item PM orchestration evidence and cannot replace
the brief, coordination history, RED evidence, implementation evidence, review
evidence, UAT evidence, landing evidence, retrospective evidence, roadmap,
current context, status, or bootstrap-gap ledger authority.

Current repo-derived state:

- Work type: pass - `docs/work/BANDIT-066/brief.md` records `work_type: slice`.
- Active work item: pass - `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, `STATUS.md`, and
  `node ./bin/bandit.mjs cockpit status --json` select `BANDIT-066`.
- Formation state: pass - `docs/work/BANDIT-066/coordination-log.jsonl`
  records `formation_approved`.
- Previous work item closure: pass - `docs/work/BANDIT-065/landing-action.md`,
  `docs/work/BANDIT-065/retrospective.md`, and commit
  `eaee411 Close out BANDIT-065`.
- Bootstrap gap queue: pass - `.bandit/bootstrap-gaps.json` records
  `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` as resolved with
  disposition `no_action`; no bootstrap gap is queued before this Phase 8 slice.
- Derived packet status: bootstrap_gap -
  `node ./bin/bandit.mjs session-context current --json` currently exits with
  `Session context blocked: no active bootstrap gap linked to BANDIT-066`.
  `npm run bandit -- validate` and cockpit status pass, so this is recorded as
  a current derived-projection limitation to satisfy before final closeout
  claims.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-066/brief.md`, `docs/work/BANDIT-066/coordination-log.jsonl`, `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` showed Repo PM-created BANDIT-066 formation/context files and no unrelated dirty files identified by this Work Item PM pass. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context agree | bootstrap_gap | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and cockpit status agree on `BANDIT-066`; session-context currently blocks with `no active bootstrap gap linked to BANDIT-066`. Final closeout must repair or honestly disposition this derived projection before claiming agreement. |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-065/landing-action.md`; `docs/work/BANDIT-065/retrospective.md`; commit `eaee411 Close out BANDIT-065`. |
| Operator-input status is explicit | pass | `docs/work/BANDIT-066/brief.md`, `docs/roadmap/CURRENT_CONTEXT.md`, and `STATUS.md` state no operator-owned input is required for plan-mode orchestration; CLI-owned product UAT is required before landing. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-066/brief.md` includes goal, scope, out of scope, acceptance criteria, test plan, `CLEAN_CODE.md` read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, source/projection boundaries, operator-input status, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and smell triggers. |
| Qwen formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-066/qwen-formation-review.md` records Qwen non-interactive auth unavailable; no Qwen pass is claimed and no actionable findings are recorded. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-066/coderabbit-formation-review.md` records provider timeout; no CodeRabbit pass is claimed and no actionable findings are recorded. |
| Aggregate formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-066/formation-review.md` accepts provider limitations as bootstrap-gap replacement evidence and records deterministic Repo PM inspection with no Stage 1 blockers. |
| `coordination-log.jsonl` records `formation_approved` | pass | `docs/work/BANDIT-066/coordination-log.jsonl` sequence 2 records `state:"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-066/brief.md` Role Boundary Evidence and Stage Capability Scope. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Required artifact: `docs/work/BANDIT-066/red-evidence.md`; acceptance criteria in `docs/work/BANDIT-066/brief.md`. |
| Stage 3 Writer has zero test-edit authority | pass | Brief forbids Stage 3 Writer edits to tests, test helpers, fixtures, RED evidence, or acceptance mappings. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Brief records Bootstrap Model-Family Separation; this plan routes Claude as Stage 3 Implementation Writer if Codex authors RED. |
| `red_recorded` is required before implementation | pass | Stage sequence requires `red_recorded` in `docs/work/BANDIT-066/coordination-log.jsonl` before Stage 3 dispatch. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Stage 3 owner is Implementation Writer; allowed surfaces are browser app shell, view-model/payload mapping, guarded action rendering, evidence rendering, static preview/build mechanics, and narrowly justified package script changes. |
| No Writer test-surface edits | pass | Stage 3 dispatch must forbid edits to tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence. |
| Focused tests pass or bootstrap gap is recorded | pass | Required focused browser shell/view-model/UI tests, typecheck, validation, and browser smoke verification are listed below. |
| `implementation-evidence.md` and Writer report exist | pass | Required artifacts: `docs/work/BANDIT-066/implementation-evidence.md` and `docs/work/BANDIT-066/writer-report.md`. |
| PM acceptance verifies spec alignment and clean-code posture | pass | Required artifact: `docs/work/BANDIT-066/stage3-pm-review.md`; rubric source `CLEAN_CODE.md`. |
| Give Claude 15 minutes to complete its tasks | pass | If Codex authors RED, Stage 3 dispatch will give Claude up to 15 minutes and will not interrupt unless the timeout elapses or a hard blocker appears. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Planned command: `npm run bandit -- coderabbit-review pre-pr BANDIT-066 --base origin/main`; timeout/refusal must be recorded honestly. |
| Local Qwen review | pass | Planned command: `npm run bandit -- qwen-review BANDIT-066`; if auth is unavailable, record bootstrap replacement evidence and do not claim pass. |
| Escalated review if policy smells require it | pass | Escalate if browser, package/build, supply-chain, hidden-authority, UAT, policy, or state-projection smells require it. |
| Risk classification | pass | Required Stage 4 layered risk classification because the slice creates operator-facing browser UI and may touch package/build surfaces. |
| Supply-chain gate when applicable | pass | Required if dependencies, lockfiles, package scripts, browser serving/build tooling, fetched prompts, CI/release, or external tool-install surfaces change. |
| Every finding repaired or dispositioned | pass | Required in review evidence and finding-disposition artifacts before aggregate review is accepted. |
| Aggregate review evidence current for the review subject | pass | Planned command: `node ./bin/bandit.mjs review-subject-hash BANDIT-066`; required artifact `docs/work/BANDIT-066/review-evidence.md`. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required artifact: `docs/work/BANDIT-066/landing-verdict.md`. |
| Feature UAT handled when applicable | pass | This is an operator-facing browser UI slice; required artifact `docs/work/BANDIT-066/uat-approval.md` before landing. |
| `land-check` passes | pass | Planned command: `npm run bandit -- land-check BANDIT-066`. |
| `landing-action.md` records commit SHA or merge evidence | pass | Required artifact: `docs/work/BANDIT-066/landing-action.md` after supported local-record landing action. |
| No next Work Item starts before landing action exists | pass | Enforced by `AGENTS.md`, `BOOTSTRAP_METHODOLOGY.md`, Stage 0 rubric, and this plan. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required artifact: `docs/work/BANDIT-066/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include all Stage 6 mining signals and durable dispositions. |
| Every lesson has durable disposition | pass | Required as improvement chore, cross-model tension, smell update, or explicit no-action decision. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed | pass | Required during Stage 6 closeout and session closeout. |
| cockpit status and session-context agree | bootstrap_gap | Cockpit currently passes; session-context currently blocks on missing active bootstrap-gap link for this product slice. Closeout must repair, route, or explicitly disposition this projection limitation before final completion claims. |
| `validate` and `git diff --check` pass | pass | Required final commands: `npm run bandit -- validate`; `git diff --check`. |

## Stage Sequence

| Stage | Accountable role | Required transition evidence |
| --- | --- | --- |
| Stage 2 RED evidence | Test Writer | Browser shell/view-model/authority-boundary RED tests or explicit verification plan, `docs/work/BANDIT-066/red-evidence.md`, and `red_recorded` before implementation. |
| Stage 3 implementation | Claude Implementation Writer if Codex authors RED | Source-only browser app shell delivery, Writer report, implementation evidence, focused verification, and PM acceptance. |
| Stage 4 review | Reviewer agents and Codex PM aggregation | CodeRabbit or provider-refusal evidence, Local Qwen evidence, risk classification, supply-chain evidence when applicable, finding dispositions, review-subject hash, and aggregate review evidence. |
| Feature UAT | Operator via CLI-owned UAT evidence | `docs/work/BANDIT-066/uat-approval.md` before landing; any source change after UAT makes UAT stale for v0. |
| Stage 5 landing | Landing Agent | Landing verdict, land-check, and landing-action evidence with commit SHA or merge evidence. |
| Stage 6 closeout | Closeout Agent / Codex PM | Retrospective, improvement/no-action dispositions, synchronized routing files, final validate, coordination validate, cockpit, session-context, and diff checks. |

## Required Evidence

- Stage 2: `test/cockpit-browser-shell.test.mjs`,
  `test/cockpit-ui.test.mjs`, `test/cockpit-view-model.test.mjs` as applicable,
  `docs/work/BANDIT-066/red-evidence.md`, and `red_recorded` coordination.
- Stage 3: browser app shell source, typed payload/view-model mapping, guarded
  action rendering, evidence-detail rendering, static serving or preview path,
  `docs/work/BANDIT-066/writer-report.md`,
  `docs/work/BANDIT-066/implementation-evidence.md`, and
  `docs/work/BANDIT-066/stage3-pm-review.md`.
- Stage 4: `docs/work/BANDIT-066/coderabbit-review.md`,
  `docs/work/BANDIT-066/local-qwen-review.md`, risk-classification evidence,
  supply-chain evidence when applicable, finding-disposition artifacts as
  needed, review-subject hash evidence, and
  `docs/work/BANDIT-066/review-evidence.md`.
- Stage 5: `docs/work/BANDIT-066/uat-approval.md`,
  `docs/work/BANDIT-066/landing-verdict.md`, and
  `docs/work/BANDIT-066/landing-action.md`.
- Stage 6: `docs/work/BANDIT-066/retrospective.md`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  `.bandit/events.jsonl`, and any bootstrap-gap/improvement disposition
  artifacts required by the retrospective.

## Role Boundaries

Repo PM owns Stage 1 brief creation, formation review routing, formation
approval, and context synchronization before Work Item PM starts. Work Item PM
owns this advisory plan and stage orchestration only after formation approval.
It does not invent scope, approve product UAT, write implementation source as
the Stage 3 Writer, own independent review findings, or land work without
Landing Agent evidence.

Test Writer owns Stage 2 tests, test helpers, fixtures, RED evidence, and
acceptance mappings. Implementation Writer owns Stage 3 source delivery only.
If Codex authors or materially edits Stage 2 RED evidence, Stage 3
implementation must use Claude or a different model family. The Stage 3 Writer
has zero authority to edit tests, test helpers, fixtures, RED evidence,
acceptance mappings, formation evidence, review evidence, landing evidence, UAT
evidence, or retrospective evidence.

Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
verdict/action evidence. The operator owns product UAT approval through
CLI-owned UAT evidence. Closeout Agent/Codex PM owns Stage 6 retrospective,
structured improvement mining, durable dispositions, and routing-file
synchronization.

## Verification Commands

- `node --test test/cockpit-browser-shell.test.mjs`
- `node --test test/cockpit-ui.test.mjs test/cockpit-view-model.test.mjs`
- `npm test` if implementation touches shared cockpit status, view-model,
  action eligibility, render, CLI command routing, package scripts, validation,
  or shared state behavior.
- `npm run typecheck`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs coordination validate BANDIT-066`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-066`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-066 --base origin/main`
- `npm run bandit -- qwen-review BANDIT-066`
- `npm run bandit -- land-check BANDIT-066`
- Local browser or Playwright smoke verification against the served shell if a
  browser-served entrypoint is added.
- Responsive verification at desktop and mobile widths.
- Accessibility verification for landmarks, disabled controls, focus order,
  keyboard reachability, and contrast.
- `git diff --check`

## Known Blockers

- Derived session-context projection: bootstrap_gap -
  `node ./bin/bandit.mjs session-context current --json` currently blocks on
  `no active bootstrap gap linked to BANDIT-066` while cockpit/status/roadmap
  agree on the product slice. This must be repaired, routed, or explicitly
  dispositioned before final completion claims.
- Qwen formation review: bootstrap_gap - non-interactive Qwen auth unavailable;
  no formation pass is claimed.
- CodeRabbit formation review: bootstrap_gap - provider timeout; no formation
  pass is claimed.
- Operator input: pass - none required for plan-mode or Stage 2 RED. CLI-owned
  product UAT is required before landing.
- Current stage: pass - no blocker prevents attempting
  `orchestration_plan_recorded`.

## Stop Conditions

- blocker - `node ./bin/bandit.mjs work-item-pm start BANDIT-066` refuses this
  plan or readiness evidence.
- blocker - Stage 2 RED evidence would begin before
  `orchestration_plan_recorded` exists.
- blocker - Stage 3 implementation would begin before `red_recorded`.
- blocker - Stage 3 Writer attempts to edit tests, test helpers, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, or retrospective evidence.
- blocker - Codex-authored or Codex-materially-edited RED evidence cannot be
  routed to Claude or a different model family for Stage 3 implementation.
- blocker - browser state, static payloads, fixture data, generated UI state,
  local server state, browser storage, a cache, or a State Index becomes
  canonical workflow authority.
- blocker - the UI implies UAT approval, policy override, landing safety,
  merge, push, deploy, Trust Verifier cutover, guarded action execution, or
  hidden workflow mutation.
- blocker - local API shape, live CLI invocation, State Index timing, guarded
  action execution authority, scheduler, claim/worktree lifecycle, PR/CI,
  external service setup, merge, push, deploy, product policy, business
  tradeoff, or explicit cost/risk posture is required without operator-owned
  approval.
- blocker - required reviewers, UAT, landing checks, or derived status commands
  fail without accepted bootstrap-gap/provider-refusal evidence.
- blocker - unresolved reviewer findings remain after the disposition loop.

## Forbidden Actions

- Do not write Stage 2 RED evidence before `orchestration_plan_recorded` exists.
- Do not dispatch implementation before Stage 2 RED evidence and `red_recorded`
  coordination evidence exist.
- Do not let Stage 3 Writer edit test surfaces or evidence surfaces outside its
  source-delivery authority.
- Do not parse repo-native artifacts directly in browser components.
- Do not let browser storage, generated UI state, fixture data, screenshots, a
  local server process, a cache, local payload, or State Index become canonical
  workflow state.
- Do not implement live CLI invocation, local API endpoints, server-side
  workflow actions, state-index persistence, SQLite, cross-repo aggregation,
  scheduler execution, claims, work-surface reservations, worktree lifecycle,
  PR/CI orchestration, automatic merge, push, deploy, production canary
  behavior, external service setup, Trust Verifier cutover, old-gate
  replacement/wrapping, or unrelated Phase 8 cockpit features.
- Do not make the UI approve product UAT, policy overrides, business tradeoffs,
  explicit cost/risk posture, provider-pricing evidence, spend-class policy,
  Trust Verifier cutover, merge readiness, deploy safety, or landing safety.
- Do not add dependencies, package scripts, generated assets, or app framework
  choices unless narrowly justified by the browser shell contract and reviewed
  through risk/supply-chain gates.
- Do not ask the operator for routine technical routing decisions Codex PM owns.
