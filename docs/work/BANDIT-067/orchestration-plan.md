# BANDIT-067 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-067
plan_owner: work_item_pm
created_at: 2026-06-07T18:24:00Z
verdict: pass
artifact_authority: advisory_orchestration_evidence_only

## Current Repo State

`BANDIT-067` is the active Phase 8 product slice for Live Cockpit Status View
From CLI Payload. The current coordination state is `formation_approved`.
This plan exists only as Work Item PM orchestration evidence and cannot replace
the brief, coordination history, RED evidence, implementation evidence, review
evidence, UAT evidence, landing evidence, retrospective evidence, roadmap,
current context, status, or bootstrap-gap ledger authority.

Current repo-derived state:

- Work type: pass - `docs/work/BANDIT-067/brief.md` records `work_type: slice`.
- Active work item: pass - `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  `node ./bin/bandit.mjs cockpit status --json`, and
  `node ./bin/bandit.mjs session-context current --json` select
  `BANDIT-067`.
- Current stage: pass - repo artifacts agree that Stage 1 formation is approved
  and Work Item PM plan-mode orchestration is required before RED evidence.
- Formation state: pass - `docs/work/BANDIT-067/coordination-log.jsonl`
  records `formation_approved`.
- Previous work item closure: pass - `docs/work/BANDIT-066/landing-action.md`,
  `docs/work/BANDIT-066/retrospective.md`, and commit
  `bb6c079 Close out BANDIT-066` record the prior slice as landed and closed.
- Bootstrap gap queue: pass - `.bandit/bootstrap-gaps.json`,
  `docs/roadmap/CURRENT_CONTEXT.md`, and `docs/roadmap/ROADMAP.md` record no
  open bootstrap gap queued before this Phase 8 slice.
- Derived packet status: pass - cockpit status and session-context agree on
  active work item, current stage, exact next action, and no required operator
  input.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-067/brief.md`, `docs/work/BANDIT-067/coordination-log.jsonl`, `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` showed `main...origin/main [ahead 1]` with no dirty files before this plan was authored. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context agree | pass | All five sources select `BANDIT-067` and the next action `Start Work Item PM plan-mode orchestration for BANDIT-067 before RED evidence.` |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-066/landing-action.md`, `docs/work/BANDIT-066/retrospective.md`, `docs/work/BANDIT-066/improvement-disposition.md`, and commit `bb6c079 Close out BANDIT-066`. |
| Operator-input status is explicit | pass | `docs/work/BANDIT-067/brief.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, cockpit status, and session-context state no operator-owned input is required for this orchestration step; CLI-owned product UAT is required before landing. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-067/brief.md` includes goal, scope, out of scope, acceptance criteria, test plan, `CLEAN_CODE.md` read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, source/projection boundaries, operator-input status, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and smell triggers. |
| Qwen formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-067/qwen-formation-review.md` records non-interactive Qwen auth unavailable; no Qwen pass is claimed and no actionable findings are recorded. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-067/coderabbit-formation-review.md` records bounded provider timeout; no CodeRabbit pass is claimed and no actionable findings are recorded. |
| Aggregate formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-067/formation-review.md` accepts provider limitations as bootstrap-gap replacement evidence and records deterministic Repo PM inspection with no Stage 1 blockers. |
| `coordination-log.jsonl` records `formation_approved` | pass | `docs/work/BANDIT-067/coordination-log.jsonl` sequence 2 records `state:"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-067/brief.md` Role Boundary Evidence and Stage Capability Scope. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Required artifact: `docs/work/BANDIT-067/red-evidence.md`; acceptance criteria in `docs/work/BANDIT-067/brief.md`. |
| Stage 3 Writer has zero test-edit authority | pass | Brief forbids Stage 3 Writer edits to tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Brief records Bootstrap Model-Family Separation; this plan routes Claude as Stage 3 Implementation Writer if Codex authors RED. |
| `red_recorded` is required before implementation | pass | Stage sequence requires `red_recorded` in `docs/work/BANDIT-067/coordination-log.jsonl` before Stage 3 dispatch. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Stage 3 owner is Implementation Writer; allowed source surfaces are the bounded CLI-payload adapter, cockpit view-model/browser shell rendering, generated/static preview refresh, guarded action display, evidence detail display, and narrowly related cockpit CSS/HTML/source code. |
| No Writer test-surface edits | pass | Stage 3 dispatch must forbid edits to tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence. |
| Focused tests pass or bootstrap gap is recorded | pass | Required focused cockpit status/view-model/browser shell/UI tests, typecheck, Bandit validation, browser smoke, responsive, and accessibility verification are listed below. |
| `implementation-evidence.md` and Writer report exist | pass | Required artifacts: `docs/work/BANDIT-067/implementation-evidence.md` and `docs/work/BANDIT-067/writer-report.md`. |
| PM acceptance verifies spec alignment and clean-code posture | pass | Required artifact: `docs/work/BANDIT-067/stage3-pm-review.md`; rubric sources `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`. |
| Give Claude 15 minutes to complete its tasks | pass | If Codex authors RED, Stage 3 dispatch will give Claude up to 15 minutes and will not interrupt unless the timeout elapses or a hard blocker appears. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Planned command: `npm run bandit -- coderabbit-review pre-pr BANDIT-067 --base origin/main`; timeout/refusal must be recorded honestly. |
| Local Qwen review | pass | Planned command: `npm run bandit -- qwen-review BANDIT-067`; if auth is unavailable, record bootstrap replacement evidence and do not claim pass. |
| Escalated review if policy smells require it | pass | Escalate if browser, static preview, hidden-authority, guarded action, product UAT, package/build, supply-chain, policy, or state-projection smells require it. |
| Risk classification | pass | Required Stage 4 layered risk classification because the slice changes operator-facing browser UI and generated/static preview surfaces. |
| Supply-chain gate when applicable | pass | Required if dependencies, lockfiles, package scripts, browser serving/build tooling, fetched prompts, CI/release, or external tool-install surfaces change. |
| Every finding repaired or dispositioned | pass | Required in review evidence and finding-disposition artifacts before aggregate review is accepted. |
| Aggregate review evidence current for the review subject | pass | Planned command: `node ./bin/bandit.mjs review-subject-hash BANDIT-067`; required artifact `docs/work/BANDIT-067/review-evidence.md`. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required artifact: `docs/work/BANDIT-067/landing-verdict.md`. |
| Feature UAT handled when applicable | pass | This is an operator-facing browser cockpit content slice; required artifact `docs/work/BANDIT-067/uat-approval.md` before landing. |
| `land-check` passes | pass | Planned command: `npm run bandit -- land-check BANDIT-067`. |
| `landing-action.md` records commit SHA or merge evidence | pass | Required artifact: `docs/work/BANDIT-067/landing-action.md` after supported local-record landing action. |
| No next Work Item starts before landing action exists | pass | Enforced by `AGENTS.md`, `BOOTSTRAP_METHODOLOGY.md`, Stage 0 rubric, and this plan. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required artifact: `docs/work/BANDIT-067/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include all Stage 6 mining signals and durable dispositions. |
| Every lesson has durable disposition | pass | Required as improvement chore, cross-model tension, smell update, or explicit no-action decision. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed | pass | Required during Stage 6 closeout and session closeout. |
| cockpit status and session-context agree | pass | Startup commands agree on active work item, current stage, exact next action, and operator-input status before plan recording. |
| `validate` and `git diff --check` pass | pass | Required final commands: `npm run bandit -- validate`; `git diff --check`. |

## Stage Sequence

| Stage | Accountable role | Required transition evidence |
| --- | --- | --- |
| Stage 2 RED evidence | Test Writer | Live cockpit-status payload mapping RED tests or explicit verification plan, static/browser preview generation RED tests, fail-closed status rendering tests, authority-boundary tests, responsive/accessibility verification plan, `docs/work/BANDIT-067/red-evidence.md`, and `red_recorded` before implementation. |
| Stage 3 implementation | Claude Implementation Writer if Codex authors RED | Source-only delivery for the adapter, browser shell/view-model/render/static preview updates, Writer report, implementation evidence, focused verification, and PM acceptance. |
| Stage 4 review | Reviewer agents and Codex PM aggregation | CodeRabbit or provider-refusal evidence, Local Qwen evidence, escalated review if triggered, risk classification, supply-chain evidence when applicable, browser smoke evidence, finding dispositions, review-subject hash, and aggregate review evidence. |
| Feature UAT | Operator via CLI-owned UAT evidence | `docs/work/BANDIT-067/uat-approval.md` before landing; any source change after UAT makes UAT stale for v0. |
| Stage 5 landing | Landing Agent | Landing verdict, land-check, and landing-action evidence with commit SHA or merge evidence. |
| Stage 6 closeout | Closeout Agent / Codex PM | Retrospective, improvement/no-action dispositions, synchronized routing files, final validate, coordination validate, cockpit, session-context, and diff checks. |

## Required Evidence

- Stage 2: `test/cockpit-status.test.mjs`,
  `test/cockpit-view-model.test.mjs`, `test/cockpit-browser-shell.test.mjs`,
  `test/cockpit-ui.test.mjs`,
  `test/helpers/cockpit-status-fixture.mjs` as applicable,
  `docs/work/BANDIT-067/red-evidence.md`, and `red_recorded` coordination.
- Stage 3: typed cockpit-status-to-view-model adapter, browser shell/rendering
  updates, generated/static preview refresh, guarded action display, evidence
  detail rendering, CSS/HTML updates as needed,
  `docs/work/BANDIT-067/writer-report.md`,
  `docs/work/BANDIT-067/implementation-evidence.md`, and
  `docs/work/BANDIT-067/stage3-pm-review.md`.
- Stage 4: `docs/work/BANDIT-067/coderabbit-review.md`,
  `docs/work/BANDIT-067/local-qwen-review.md`, risk-classification evidence,
  supply-chain evidence when applicable, browser smoke evidence,
  finding-disposition artifacts as needed, review-subject hash evidence, and
  `docs/work/BANDIT-067/review-evidence.md`.
- Stage 5: `docs/work/BANDIT-067/uat-approval.md`,
  `docs/work/BANDIT-067/landing-verdict.md`, and
  `docs/work/BANDIT-067/landing-action.md`.
- Stage 6: `docs/work/BANDIT-067/retrospective.md`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  `.bandit/events.jsonl`, and any bootstrap-gap/improvement disposition
  artifacts required by the retrospective.

## Role Boundaries

Repo PM owns Stage 1 brief creation, source-spec repair, formation review
routing, formation approval, and context synchronization before Work Item PM
starts. Work Item PM owns this advisory plan and stage orchestration only after
formation approval. It does not invent scope, approve product UAT, write
implementation source as the Stage 3 Writer, own independent review findings,
or land work without Landing Agent evidence.

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

- `node --test test/cockpit-status.test.mjs`
- `node --test test/cockpit-view-model.test.mjs`
- `node --test test/cockpit-browser-shell.test.mjs`
- `node --test test/cockpit-ui.test.mjs`
- `npm test` if implementation touches shared cockpit status, view-model,
  action eligibility, render, CLI command routing, package scripts, validation,
  or shared state behavior.
- `npm run typecheck`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs coordination validate BANDIT-067`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-067`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-067 --base origin/main`
- `npm run bandit -- qwen-review BANDIT-067`
- `npm run bandit -- land-check BANDIT-067`
- Local browser or Playwright smoke verification against the static preview or
  served shell after browser content changes.
- Responsive verification at desktop and mobile widths.
- Accessibility verification for landmarks, disabled controls, focus order,
  keyboard reachability, source-link reachability, status cues, and contrast.
- `git diff --check`

## Known Blockers

- Operator input: pass - none required for plan-mode or Stage 2 RED. CLI-owned
  product UAT is required before landing.
- Formation evidence: pass - brief, formation review artifacts, and
  `formation_approved` coordination evidence exist.
- Qwen formation review: bootstrap_gap - non-interactive Qwen auth unavailable;
  no formation pass is claimed.
- CodeRabbit formation review: bootstrap_gap - provider timeout; no formation
  pass is claimed.
- Current stage: pass - no blocker prevents attempting
  `orchestration_plan_recorded`.

## Stop Conditions

- blocker - `node ./bin/bandit.mjs work-item-pm start BANDIT-067` refuses this
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
- Do not implement live CLI invocation, local API endpoints, live polling,
  websocket updates, server-side workflow actions, state-index persistence,
  SQLite, cross-repo aggregation, scheduler execution, claims, work-surface
  reservations, worktree lifecycle, PR/CI orchestration, automatic merge, push,
  deploy, production canary behavior, external service setup, Trust Verifier
  cutover, old-gate replacement/wrapping, or unrelated Phase 8 cockpit
  features.
- Do not make the UI approve product UAT, policy overrides, business
  tradeoffs, explicit cost/risk posture, provider-pricing evidence,
  spend-class policy, Trust Verifier cutover, merge readiness, deploy safety,
  or landing safety.
- Do not add dependencies, package scripts, generated assets, or app framework
  choices unless narrowly justified by the live-status view contract and
  reviewed through risk/supply-chain gates.
- Do not ask the operator for routine technical routing decisions Codex PM owns.
