# BANDIT-083 Orchestration Plan

contract_version: 1
work_item: BANDIT-083
work_type: slice
orchestrator: work_item_pm
created_at: 2026-06-09T13:48:03Z

This plan is Work Item PM orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review evidence,
landing evidence, UAT evidence, retrospective evidence, roadmap, current
context, root status, or bootstrap-gap ledger.

## Current Repo State

`BANDIT-083` is the active Phase 8 product slice for Bandit Cockpit UI Polish
From Attached Design. Stage 1 formation is complete:
`docs/work/BANDIT-083/brief.md`,
`docs/work/BANDIT-083/qwen-formation-review.md`,
`docs/work/BANDIT-083/coderabbit-formation-review.md`,
`docs/work/BANDIT-083/formation-review.md`, and
`docs/work/BANDIT-083/coordination-log.jsonl` exist, and the coordination log
records `formation_approved`.

Current coordination state: `formation_approved`.

Current next action: Work Item PM plan-mode orchestration before RED evidence.
Do not create Stage 3 implementation, review, landing, closeout, unrelated
Phase 8 work, or the V0 Closeout Claude Code A/B Product-Value Trial until this
plan exists and `node ./bin/bandit.mjs work-item-pm start BANDIT-083` records
`orchestration_plan_recorded`.

No operator-owned input is required for plan mode. CLI-owned product UAT is
required before landing because this slice changes the operator-facing cockpit.

## Stage Sequence

| Stage | Accountable role | Required result |
| --- | --- | --- |
| Stage 2 RED | Test Writer | RED tests and RED evidence map Evidence Row states, source-link readability, read-only browser authority, three-pane/collapsed layout behavior, accessibility, action-request presentation, and static preview/browser smoke expectations to acceptance criteria. |
| Stage 3 Implementation | Implementation Writer, Claude-family if Codex authored RED | Source/CSS/render delivery only; no test-surface edits; preserve CLI/repo-native authority and normal cockpit evidence hierarchy. |
| Stage 4 Review | Reviewer / Codex PM aggregate | CodeRabbit, Local Qwen through MLX adapter, layered risk classification, supply-chain gate when applicable, review-subject hash, browser smoke, clean-code evidence, and finding dispositions. |
| Stage 5 Landing | Landing Agent / operator UAT gate | CLI-owned product UAT approval, landing verdict, land-check, source/evidence commit, source-head/hash refresh as needed, and local-record landing action. |
| Stage 6 Closeout | Closeout Agent / Codex PM | Retrospective, improvement/no-action disposition, routing sync to next authorized item, and final validation. |

## Required Evidence

| Stage | Evidence |
| --- | --- |
| Stage 2 | `test/cockpit-view-model.test.mjs`, `test/cockpit-ui.test.mjs`, `test/cockpit-browser-shell.test.mjs`, related cockpit tests as needed, and `docs/work/BANDIT-083/red-evidence.md`. |
| Stage 3 | `docs/work/BANDIT-083/stage3-dispatch.md`, `docs/work/BANDIT-083/implementation-evidence.md`, `docs/work/BANDIT-083/writer-report.md`, `docs/work/BANDIT-083/stage3-pm-review.md`, focused test output, and role/run evidence. |
| Stage 4 | `docs/work/BANDIT-083/coderabbit-review.md`, `docs/work/BANDIT-083/local-qwen-review.md`, risk classification evidence, supply-chain gate evidence when applicable, review-subject hash, browser smoke evidence, finding dispositions when needed, and `docs/work/BANDIT-083/review-evidence.md`. |
| Stage 5 | `docs/work/BANDIT-083/uat-approval.md`, `docs/work/BANDIT-083/landing-verdict.md`, `docs/work/BANDIT-083/landing-action.md`, land-check output, current source/evidence commit, and refreshed source/review hashes as needed. |
| Stage 6 | `docs/work/BANDIT-083/retrospective.md`, improvement or no-action disposition artifacts, `.bandit/bootstrap-gaps.json` if changed, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, and final validation output. |

## Role Boundaries

- Repo PM owns Stage 1 brief creation, formation review routing, formation
  approval, and context synchronization.
- Work Item PM owns this orchestration plan and stage-gate coordination after
  `formation_approved`.
- Test Writer owns Stage 2 tests, helpers, fixtures, RED evidence, and
  acceptance mappings.
- Implementation Writer owns Stage 3 cockpit source, render, CSS, and static
  preview delivery only.
- Permanent Test Ownership Boundary: Stage 3 Writer has zero authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-083`.
- Bootstrap Model-Family Separation: because Codex will author Stage 2 RED
  evidence in this bootstrap run, Stage 3 implementation must use the
  Claude-family bootstrap implementation-writer path unless Claude auth fails or
  times out after the required window; the fallback is MiniMax-M3 through
  headless `pi`.
- Browser, render, CSS, static preview, view-model, fixture, generated HTML,
  local cache, and design-system state are presentation-only projections. They
  cannot become workflow authority, UAT authority, landing authority, queue
  authority, action-execution authority, merge/push/deploy authority, model
  routing authority, or policy authority.
- Reviewers own Stage 4 reviewer evidence. Local Qwen may only run through
  `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`.
- Landing Agent owns Stage 5 landing verdict and landing action evidence.
- Operator owns product UAT approval and any future product, policy, business,
  cost, risk, merge, push, deploy, external-service, guarded-execution,
  benchmark-publication, paid-routing, local API, State Index, or Trust Verifier
  cutover decision that repo artifacts cannot answer.
- Closeout Agent / Codex PM owns Stage 6 retrospective, improvement
  disposition, and routing/status synchronization.

## Verification Commands

- `node --test test/cockpit-view-model.test.mjs`
- `node --test test/cockpit-ui.test.mjs`
- `node --test test/cockpit-browser-shell.test.mjs`
- `node --test test/cockpit-evidence-detail.test.mjs`
- `node --test test/cockpit-actions.test.mjs`
- `npm test` when shared cockpit derivation, render, browser shell, static
  preview, action affordances, evidence detail, queue/context, operator
  attention, or command routing changes.
- `npm run typecheck`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs coordination validate BANDIT-083`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- Local browser or Playwright desktop/mobile static preview smoke against
  `public/cockpit/index.html`.
- `npm run bandit -- coderabbit-review pre-pr BANDIT-083 --base origin/main`
- Local Qwen review through `.bandit/reviewers/local-qwen.json` and
  `node bin/omlx-chat-completions.mjs`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-083`
- `npm run bandit -- risk-classification validate BANDIT-083 --json`
- `npm run bandit -- supply-chain-gate validate BANDIT-083 --json`
- `npm run bandit -- land-check BANDIT-083`
- `git diff --check`

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Known blocker status | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` record no operator-owned input required for plan mode. |
| Open bootstrap gaps | pass | `node ./bin/bandit.mjs cockpit status --json` reports bootstrap gaps status `none`; `.bandit/bootstrap-gaps.json` has no active open gap. |
| Formation evidence | pass | `docs/work/BANDIT-083/coordination-log.jsonl` records `formation_approved`; formation reviews exist and are non-blocking. |
| Product UAT before landing | pass | `docs/work/BANDIT-083/brief.md` requires CLI-owned product UAT before landing this operator-facing cockpit polish. |
| Local Qwen availability | non_blocking | Brief records the authorized MLX adapter route and says to stop for operator help if unavailable during Stage 4. |
| CodeRabbit provider availability | non_blocking | Brief allows honest timeout/refusal/bootstrap replacement evidence if CodeRabbit is unavailable; no pass may be claimed without terminal evidence. |

## Stop Conditions

- Missing, stale, contradictory, or blocking formation evidence rejected by
  `work-item-pm start`.
- RED evidence lacks acceptance mapping, test ownership, Evidence Row state
  coverage, source-link preservation, read-only authority-boundary coverage,
  desktop/mobile responsive coverage, accessibility coverage, or Stage 3
  test-edit refusal.
- Stage 3 Writer edits any test surface, fixture, RED evidence, or acceptance
  mapping.
- Claude implementation run must not be interrupted before a full 15 minutes
  unless it exits or a hard policy blocker appears; if Claude auth fails or
  times out after 15 minutes, use MiniMax-M3 through headless `pi`.
- Browser/render/CSS/static-preview code executes CLI commands, writes repo
  artifacts, records approvals, records UAT, decides landing safety, schedules
  work, claims work, mutates intake, merges, pushes, deploys, routes models,
  grants policy/cost/risk authority, or starts guarded action execution.
- UI polish hides missing, stale, contradictory, unavailable, unsupported,
  operator-owned, not-yet-formed, deferred, blocked, bootstrap_gap, or
  source-missing states behind generic healthy/complete states.
- Desktop or mobile smoke reveals overlapping critical text, unreadable source
  paths, inaccessible focus order, ambiguous status states, or non-color-only
  state regressions.
- CodeRabbit review must not be interrupted before a full 10 minutes unless it
  exits.
- Local Qwen is unavailable through the authorized MLX adapter route.
- Unresolved reviewer findings, stale review-subject evidence, missing risk
  classification, missing supply-chain gate when applicable, missing UAT, or
  missing clean-code evidence.
- `land-check`, `validate`, coordination validation, cockpit status,
  session-context, focused tests, typecheck, browser smoke, or `git diff
  --check` fails without a recorded accepted blocker or bootstrap gap.
- Operator-owned product, UAT, business, policy, cost, risk, Trust Verifier
  cutover, guarded action execution, benchmark publication, paid routing,
  merge, push, deploy, external-service, local API, State Index, or genuinely
  ambiguous scope decision is required.

## Forbidden Actions

- Do not implement new workflow authority, browser-side CLI execution, local API
  endpoints, live polling, websocket updates, State Index persistence, SQLite,
  browser storage as workflow state, notification delivery, scheduler
  execution, claim leases, worktree lifecycle, queue prioritization controls,
  work intake mutation, inbox mutation, or action-request mutation.
- Do not add, resolve, archive, approve, or mutate Operator Inbox, UAT, landing,
  review, improvement, roadmap, bootstrap-gap, queue, action-request, or Trust
  Verifier state from the browser.
- Do not run, form, score, publish, or create repos for the V0 Closeout Claude
  Code A/B Product-Value Trial.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover,
  replace or wrap old gates, approve guarded action execution authority, approve
  public benchmark publication, approve paid reviewer/model routing, approve
  hosted services, merge, push, deploy, or start unrelated Phase 8 product work.
- Do not change package dependencies, lockfiles, CI/release workflow, external
  service configuration, telemetry, authentication, authorization, billing,
  production data, or secrets handling for visual polish.
- Do not make CLI payload snapshots, static design files, design tokens,
  generated previews, browser shell, fixture data, local cache, browser storage,
  State Index, view models, or generated UI state canonical workflow authority.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-083/brief.md`, `docs/work/BANDIT-083/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected | pass | `git status --short --branch` reported branch `claude/gates-workflow-exploration-hqz90c...origin/claude/gates-workflow-exploration-hqz90c [ahead 9, behind 2]` with only pre-existing untracked `.codex/`. |
| Recent history inspected | pass | `git log --oneline -5` showed `6ac14fc Form BANDIT-083 cockpit UI polish`, `9bb83b4 docs: fold office-hours wedge-first reframings into automation design`, `e4fb45e Add automation, configurable-roles & onboarding design doc`, `563d5ea Add gates/workflow strategic review report`, and `023278a Close out BANDIT-082 work intake ledger`. |
| Routing surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` identify `BANDIT-083` and plan mode as the next action. |
| Prior Work Item closed | pass | `docs/work/BANDIT-082/landing-action.md`, `docs/work/BANDIT-082/retrospective.md`, `docs/work/BANDIT-082/improvement-disposition.md`, and recent git history show `BANDIT-082` landed and closed. |
| Operator-input status explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `brief.md` state no operator-owned input is required for plan mode; product UAT remains required before landing. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-083/brief.md` includes product work, source provenance, scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, role boundaries, source/projection boundary, stage capability scope, expected files, smell triggers, UAT requirement, and operator-input status. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-083/qwen-formation-review.md` records `verdict: pass` through the authorized MLX adapter route. |
| CodeRabbit formation review exists and is not blocking | non_blocking | `docs/work/BANDIT-083/coderabbit-formation-review.md` records CodeRabbit completed with findings against pre-existing `docs/reports/...` branch-report files outside the BANDIT-083 formation package, dispositioned non-blocking for Stage 1. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-083/formation-review.md` records `verdict: pass`, no open Stage 1 blockers, and route to Work Item PM plan-mode after formation approval. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-083/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns RED evidence | pass | `brief.md` Role Boundary Evidence assigns tests, helpers, fixtures, RED evidence, and acceptance mappings to Test Writer. |
| RED evidence maps to acceptance criteria | pass | This plan requires RED tests for Evidence Row presentation states, source-link preservation, read-only authority boundaries, responsive layout, accessibility, action-request affordances, and static preview/browser smoke behavior. |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` and this plan restate the Permanent Test Ownership Boundary. |
| Codex-authored RED routes Stage 3 to Claude | pass | `brief.md` Verification Plan and this plan require Claude-family Stage 3 implementation if Codex authors or materially edits RED evidence. |
| `red_recorded` required before implementation | pass | This plan forbids Stage 3 until RED evidence exists and coordination records the Stage 2 transition. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source delivery only | pass | `brief.md` Stage Capability Scope limits Stage 3 Writer to implementation only; this plan limits it to cockpit source/render/CSS/static-preview work. |
| No Writer test-surface edits | pass | This plan makes any Stage 3 test-surface edit a stop condition requiring invalidation and rerun. |
| Focused tests pass or bootstrap gap recorded | pass | Verification Commands list focused cockpit tests, typecheck, `npm test` when shared surfaces are touched, and browser smoke. |
| Implementation evidence and Writer report required | pass | Required Evidence lists `implementation-evidence.md`, `writer-report.md`, `stage3-pm-review.md`, dispatch, focused test output, and role/run evidence. |
| PM acceptance verifies spec and clean code | pass | Stage 3 evidence must map source changes to acceptance criteria and include a `CLEAN_CODE.md` check before Stage 4. |
| Claude 15-minute window preserved | pass | Stop Conditions require giving Claude 15 minutes unless it exits or a hard blocker appears; if Claude auth fails or times out after 15 minutes, fallback is MiniMax-M3 through headless `pi` using approved prompt forms. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal evidence | pass | Verification Commands include `npm run bandit -- coderabbit-review pre-pr BANDIT-083 --base origin/main`; brief allows honest timeout/refusal evidence. |
| Local Qwen review | pass | Local Qwen route is limited to `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`. |
| Escalated review if policy smells require it | pass | Stage 4 must evaluate smell triggers, source trust, supply-chain, layered risk, browser authority, and reviewer disagreement; if escalation is required and Claude authored implementation, escalation returns to Codex PM or another independent route rather than Claude. |
| Risk classification | pass | Verification Commands include `npm run bandit -- risk-classification validate BANDIT-083 --json`; aggregate review must classify browser-facing source, operator-decision presentation, never-auto-landable exclusions, source trust, input quarantine, supply-chain, smell triggers, and auto-land eligibility. |
| Supply-chain gate when applicable | pass | Verification Commands include `npm run bandit -- supply-chain-gate validate BANDIT-083 --json`; expected `not_applicable` unless dependency, lockfile, package-manager script, CI/release, skill, fetched-prompt, or external tool-install surfaces change. |
| Every finding repaired or dispositioned | pass | `docs/work/BANDIT-083/review-evidence.md` and finding-disposition artifacts must repair or disposition all actionable findings and cross-model tension. |
| Aggregate review evidence current for review subject | pass | Verification Commands include `node ./bin/bandit.mjs review-subject-hash BANDIT-083`; review evidence must apply to the current review subject. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required later: `docs/work/BANDIT-083/landing-verdict.md` with an agent-owned verdict. |
| Feature UAT handled | pass | `docs/work/BANDIT-083/brief.md` requires CLI-owned product UAT before landing. |
| `land-check` passes | pass | Required later: `npm run bandit -- land-check BANDIT-083` before landing or exact blocker evidence. |
| Clean source/evidence commit before local-record landing | pass | Local-record landing requires a clean source/evidence commit first, followed by source-head/hash refresh as needed. |
| `landing-action.md` records commit SHA or merge evidence | pass | Required later: `docs/work/BANDIT-083/landing-action.md` must record local-record commit SHA or equivalent merge evidence. |
| No next Work Item starts before landing action exists | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and this plan keep next items blocked behind `BANDIT-083` landing action and closeout evidence. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required later: `docs/work/BANDIT-083/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use pressure, reviewer/model routing, tool invocation friction, recurring inefficiency, cost/latency signals, and unresolved uncertainty. |
| Every lesson has durable disposition | pass | Required later: improvement chore, cross-model tension, smell update, or explicit no-action decision for every material lesson. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed | pass | Closeout must route to the next authorized item only after landing and retrospective/disposition evidence exist. |
| Cockpit status and session-context agree | pass | Required later: rerun both derived commands after closeout edits. |
| `validate` and `git diff --check` pass | pass | Required later: `npm run bandit -- validate` and `git diff --check`; Stage 6 final validation should not rerun land-check after an evidence-only closeout commit. |
