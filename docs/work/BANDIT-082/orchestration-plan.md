# BANDIT-082 Orchestration Plan

contract_version: 1
work_item: BANDIT-082
work_type: slice
orchestrator: work_item_pm
created_at: 2026-06-09T11:00:46Z

This plan is Work Item PM orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review evidence,
landing evidence, retrospective evidence, roadmap, current context, root status,
or bootstrap-gap ledger.

## Current Repo State

`BANDIT-082` is the active Phase 8 product/workflow slice for Work Intake
Ledger And Followups Migration. Stage 1 formation is complete:
`docs/work/BANDIT-082/brief.md`,
`docs/work/BANDIT-082/qwen-formation-review.md`,
`docs/work/BANDIT-082/coderabbit-formation-review.md`,
`docs/work/BANDIT-082/formation-review.md`, and
`docs/work/BANDIT-082/coordination-log.jsonl` exist, and the coordination log
records `formation_approved`.

Current coordination state: `formation_approved`.

Current next action: run Work Item PM plan-mode orchestration before RED
evidence. Do not create RED evidence or implementation until this plan exists
and `node ./bin/bandit.mjs work-item-pm start BANDIT-082` records
`orchestration_plan_recorded`.

No operator-owned input is required for plan mode. Product UAT is not required
unless implementation changes an operator-facing browser surface.

## Stage Sequence

| Stage | Accountable role | Required result |
| --- | --- | --- |
| Stage 2 RED | Test Writer | RED tests and RED evidence map ledger parsing, source-preserving imports, legacy follow-up import/disposition, deterministic order, deprecated `FOLLOWUPS.md` refusal, proposal-not-claimable boundary, role-authority refusal, and V0 trial deferral to acceptance criteria. |
| Stage 3 Implementation | Implementation Writer, Claude-family if Codex authored RED | Source delivery only; no test-surface edits. |
| Stage 4 Review | Reviewer / Codex PM aggregate | CodeRabbit, Local Qwen, risk, supply-chain, review-subject hash, clean-code, and finding disposition evidence. |
| Stage 5 Landing | Landing Agent | Landing verdict, land-check, source/evidence commit, hash refresh, local-record landing action, and UAT only if a browser/operator-facing surface changes. |
| Stage 6 Closeout | Closeout Agent / Codex PM | Retrospective, improvement/no-action disposition, routing sync to the next intake-derived item, final validation. |

## Required Evidence

| Stage | Evidence |
| --- | --- |
| Stage 2 | `test/work-intake-ledger.test.mjs`, `test/work-intake-migration.test.mjs`, related validation tests if command validation is touched, and `docs/work/BANDIT-082/red-evidence.md`. |
| Stage 3 | `docs/work/BANDIT-082/stage3-dispatch.md`, `docs/work/BANDIT-082/implementation-evidence.md`, `docs/work/BANDIT-082/writer-report.md`, `docs/work/BANDIT-082/stage3-pm-review.md`, and role/run evidence. |
| Stage 4 | `docs/work/BANDIT-082/coderabbit-review.md`, `docs/work/BANDIT-082/local-qwen-review.md`, risk classification, supply-chain gate when applicable, review-subject hash, finding dispositions when needed, and `docs/work/BANDIT-082/review-evidence.md`. |
| Stage 5 | `docs/work/BANDIT-082/landing-verdict.md`, `docs/work/BANDIT-082/landing-action.md`, land-check output, current source/evidence commit, and `docs/work/BANDIT-082/uat-approval.md` only if the implementation changes an operator-facing browser surface. |
| Stage 6 | `docs/work/BANDIT-082/retrospective.md`, improvement or no-action disposition artifacts, `.bandit/bootstrap-gaps.json` if changed, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, and final validation output. |

## Role Boundaries

- Repo PM owns Stage 1 brief creation, formation review routing, formation
  approval, and context synchronization.
- Work Item PM owns this orchestration plan and stage-gate coordination after
  `formation_approved`.
- Test Writer owns Stage 2 tests, helpers, fixtures, RED evidence, and
  acceptance mappings.
- Implementation Writer owns Stage 3 source and product/workflow delivery only.
- Permanent Test Ownership Boundary: Stage 3 Writer has zero authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-082`.
- Bootstrap Model-Family Separation: if Codex authors or materially edits Stage
  2 RED tests, Stage 3 implementation must use the Claude-family bootstrap
  implementation-writer path unless an operator-approved policy exception is
  recorded.
- Only Repo PM Coordinator and the future Work Intake Triage Skill may mutate
  Work Intake Ledger triage state. Work Item PMs, workers, reviewers,
  retrospectives, browser/cockpit surfaces, generated projections, and tests
  may propose or display entries but may not mark proposals accepted, deferred,
  declined, superseded, duplicate, operator-needed, or claimable.
- Reviewers own Stage 4 reviewer evidence. Local Qwen may only run through
  `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`.
- Landing Agent owns Stage 5 landing verdict and landing action evidence.
- Operator owns product direction and any product, policy, business, cost,
  risk, merge, push, deploy, external-service, guarded-execution, benchmark
  publication, paid-routing, hosted-service, local API, State Index, or Trust
  Verifier cutover decision that repo artifacts cannot answer.
- Closeout Agent / Codex PM owns Stage 6 retrospective, improvement
  disposition, and routing/status synchronization.

## Verification Commands

- `node --test test/work-intake-ledger.test.mjs`
- `node --test test/work-intake-migration.test.mjs`
- `node --test test/validate.test.mjs` when validation wiring changes
- `npm test` when shared command routing, validators, roadmap/current-context
  parsing, cockpit status/session-context projection, policy validators, or
  package scripts are touched
- `npm run typecheck`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs work-intake validate --json`
- `node ./bin/bandit.mjs work-intake list --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-082`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-082 --base origin/main`
- `npm run bandit -- qwen-review BANDIT-082`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-082`
- `npm run bandit -- risk-classification validate BANDIT-082 --json`
- `npm run bandit -- supply-chain-gate validate BANDIT-082 --json`
- `npm run bandit -- land-check BANDIT-082`
- `git diff --check`

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Known blocker status | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` record no operator-owned input required for plan mode. |
| Open bootstrap gaps | pass | `node ./bin/bandit.mjs cockpit status --json` reports bootstrap gaps status `none`; `.bandit/bootstrap-gaps.json` has no active open gap. |
| Product UAT before landing | not_applicable | `docs/work/BANDIT-082/brief.md` says UAT is not required unless implementation changes an operator-facing browser surface. |
| Local Qwen availability | non_blocking | Brief records the authorized MLX adapter route and says to stop for operator help if unavailable during Stage 4. |
| CodeRabbit provider availability | non_blocking | Brief allows honest provider-timeout/bootstrap replacement evidence if CodeRabbit is unavailable; no pass may be claimed without terminal evidence. |

## Stop Conditions

- Missing, stale, contradictory, or blocking formation evidence rejected by
  `work-item-pm start`.
- RED evidence lacks acceptance mapping, test ownership, source-preservation
  coverage, deprecated-source refusal, proposal-not-claimable coverage, V0 trial
  deferral coverage, or Stage 3 test-edit refusal.
- Stage 3 Writer edits any test surface, fixture, RED evidence, or acceptance
  mapping.
- Claude implementation run must not be interrupted before a full 15 minutes
  unless it exits or a hard policy blocker appears.
- Ledger entries, imports, reports, generated summaries, cockpit/browser state,
  tests, or roadmap projections become claim authority, work assignment
  authority, UAT authority, landing authority, merge/push/deploy authority, or
  policy approval authority.
- Migration marks `FOLLOWUPS.md` deprecated while open entries remain
  unimported, unvalidated, or missing explicit intake outcomes.
- Implementation materializes imported proposals into Work Item IDs, starts
  RED/implementation/review for imported proposals, claims work, schedules work,
  wakes Work Item PMs, creates worktrees, runs the V0 closeout trial, executes
  guarded browser actions, or performs unrelated Phase 8 product work.
- CodeRabbit review must not be interrupted before a full 10 minutes unless it
  exits.
- Local Qwen is unavailable through the authorized MLX adapter route.
- Unresolved reviewer findings, stale review-subject evidence, missing risk
  classification, missing supply-chain gate when applicable, or missing
  clean-code evidence.
- `land-check`, `validate`, coordination validation, cockpit status,
  session-context, work-intake validation/listing, or `git diff --check` fails
  without a recorded accepted blocker or bootstrap gap.
- Operator-owned product, UAT, business, policy, cost, risk, Trust Verifier
  cutover, guarded action execution, benchmark publication, paid routing,
  merge, push, deploy, external-service, local API, State Index, or genuinely
  ambiguous scope decision is required.

## Forbidden Actions

- Do not implement the full Work Intake Triage Skill, operator-interactive
  ranking workflow, guided grill-with-docs integration, operator-facing intake
  review UI, claimability reports, scheduler execution, claim leases,
  work-surface reservations, worktree lifecycle, local API endpoints, State
  Index persistence, SQLite, browser mutation authority, live polling,
  websocket updates, browser-side CLI execution, guarded action execution,
  PR/CI orchestration, automatic merge, push, deploy, production canary
  behavior, hosted replay services, public benchmark publication, paid
  reviewer/model routing, or external telemetry.
- Do not start, score, publish, or create repos for the V0 Closeout Claude Code
  A/B Product-Value Trial in this slice.
- Do not create work-item briefs, RED evidence, orchestration plans, claims,
  worktrees, scheduler work, or Work Item PM wake payloads for imported
  proposals.
- Do not mark proposals claimable, materialize Work Item IDs, or bypass normal
  Repo PM Stage 1 formation from the ledger.
- Do not choose local API shape, State Index timing, hosted packaging, external
  service setup, framework migration, dependency additions, lockfile changes,
  package-manager script changes, paid reviewer/model routing, public benchmark
  publication, or live action queue semantics.
- Do not let `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, legacy follow-up
  files, roadmap projections, generated reports, tests, cockpit rows, browser
  state, local cache, static HTML, CSS, or UI component state become claim,
  UAT, landing, merge/push/deploy, policy, or Work Item execution authority.
- Do not replace current roadmap, current-context, session-context, cockpit
  status, coordination, review, landing, UAT, retrospective, bootstrap-gap,
  risk-classification, supply-chain, artifact-create, work-item-create, or
  Trust Verifier authority.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-082/brief.md`, `docs/work/BANDIT-082/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected | pass | `git status --short --branch` reported `## main...origin/main [ahead 1]` with no dirty paths before plan edits. |
| Recent history inspected | pass | `git log --oneline -5` showed `da92577 Form BANDIT-082 work intake ledger`, `8d24244 Document follow-up triage and queue V0 closeout work`, `b603f02 Close out BANDIT-081 operator attention inbox`, `00785c0 Record BANDIT-081 UAT and landing verdict`, and `b490360 Record BANDIT-081 aggregate review evidence`. |
| Routing surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` identify `BANDIT-082` and plan mode as the next action. |
| Prior Work Item closed | pass | `docs/work/BANDIT-081/landing-action.md`, `docs/work/BANDIT-081/retrospective.md`, `docs/work/BANDIT-081/improvement-disposition.md`, and recent git history show `BANDIT-081` landed and closed. |
| Operator-input status explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `brief.md` state no operator-owned input is required for plan mode; halt conditions preserve product, policy, business, cost/risk, hosted-service, paid-routing, benchmark, merge, push, deploy, local API, State Index, Trust Verifier cutover, and guarded-action authority. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-082/brief.md` includes product work, source provenance, scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, role boundaries, source-of-truth boundary, stage capability scope, expected files, smell triggers, and operator-input status. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-082/qwen-formation-review.md` records `verdict: pass` and `findings_status: none` through the authorized MLX adapter route. |
| CodeRabbit formation review exists and is not blocking | pass | `docs/work/BANDIT-082/coderabbit-formation-review.md` records `verdict: pass`, `findings_status: none`, and terminal `review_completed` evidence with zero findings. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-082/formation-review.md` records `verdict: pass`, no open Stage 1 blockers, and explicit route to Work Item PM plan-mode after formation approval. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-082/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns RED evidence | pass | `brief.md` Role Boundary Evidence assigns tests, helpers, fixtures, RED evidence, and acceptance mappings to Test Writer. |
| RED evidence maps to acceptance criteria | pass | This plan requires RED tests for ledger parser validation, missing metadata refusal, source-preserving `FOLLOWUPS.md` import, UI-polish source link, legacy follow-up import/disposition, deterministic ordering, deprecated-source refusal, proposal-not-claimable boundary, role-authority refusal, and V0 trial deferral before Stage 3. |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` and this plan restate the Permanent Test Ownership Boundary. |
| Codex-authored RED routes Stage 3 to Claude | pass | `brief.md` Verification Plan and Role Boundary Evidence require Claude-family Stage 3 implementation if Codex authors or materially edits RED evidence. |
| `red_recorded` required before implementation | pass | This plan forbids Stage 3 until RED evidence exists and coordination records the Stage 2 transition. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source delivery only | pass | `brief.md` Stage Capability Scope limits Stage 3 Writer to source implementation only. |
| No Writer test-surface edits | pass | This plan makes any Stage 3 test-surface edit a stop condition requiring invalidation and rerun. |
| Focused tests pass or bootstrap gap recorded | pass | Verification Commands list focused work-intake ledger/migration tests, validation tests as needed, `npm test` when shared surfaces are touched, and `npm run typecheck`. |
| Implementation evidence and Writer report required | pass | Required Evidence lists `implementation-evidence.md`, `writer-report.md`, `stage3-pm-review.md`, dispatch, and run evidence. |
| PM acceptance verifies spec and clean code | pass | Stage 3 evidence must map code to acceptance criteria and include a `CLEAN_CODE.md` check before Stage 4. |
| Claude 15-minute window preserved | pass | Stop Conditions require giving Claude 15 minutes unless it exits or a hard blocker appears; if Claude auth fails or times out after 15 minutes, fallback is MiniMax-M3 through headless `pi` using file/stdin prompt forms. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal evidence | pass | Verification Commands include `npm run bandit -- coderabbit-review pre-pr BANDIT-082 --base origin/main`; brief allows honest timeout/refusal evidence. |
| Local Qwen review | pass | Verification Commands include `npm run bandit -- qwen-review BANDIT-082`; Local Qwen route is limited to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`. |
| Escalated review if policy smells require it | pass | Stage 4 must evaluate smell triggers, source trust, supply-chain, layered risk, and reviewer disagreement; if escalation is required and Claude authored implementation, first escalation returns to Codex PM rather than Claude. |
| Risk classification | pass | Verification Commands include `npm run bandit -- risk-classification validate BANDIT-082 --json`; aggregate review must classify blast radius, never-auto-landable surfaces, source trust, input quarantine, supply-chain sensitivity, smell triggers, and auto-land eligibility. |
| Supply-chain gate when applicable | pass | Verification Commands include `npm run bandit -- supply-chain-gate validate BANDIT-082 --json`; expected `not_applicable` unless dependency, lockfile, package-manager script, CI/release, skill, fetched-prompt, or external tool-install surfaces change. |
| Every finding repaired or dispositioned | pass | `docs/work/BANDIT-082/review-evidence.md` and finding-disposition artifacts must repair or disposition all actionable findings and cross-model tension. |
| Aggregate review evidence current for the review subject | pass | Verification Commands include `node ./bin/bandit.mjs review-subject-hash BANDIT-082`; review evidence must apply to the current review subject. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required later: `docs/work/BANDIT-082/landing-verdict.md` with an agent-owned verdict. |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-082/brief.md` says product UAT is not required unless implementation changes an operator-facing browser surface. |
| `land-check` passes | pass | Required later: `npm run bandit -- land-check BANDIT-082` before landing or exact blocker evidence. |
| Clean source/evidence commit before local-record landing | pass | Local-record landing requires a clean source/evidence commit first, followed by source-head/hash refresh as needed. |
| `landing-action.md` records commit SHA or merge evidence | pass | Required later: `docs/work/BANDIT-082/landing-action.md` must record local-record commit SHA or equivalent merge evidence. |
| No next Work Item starts before landing action exists | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and this plan keep the next intake-derived item blocked behind `BANDIT-082` landing action and closeout evidence. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required later: `docs/work/BANDIT-082/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use pressure, reviewer/model routing, tool invocation friction, recurring inefficiency, cost/latency signals, and unresolved uncertainty. |
| Every lesson has durable disposition | pass | Required later: improvement chore, cross-model tension, smell update, or explicit no-action decision for every material lesson. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed | pass | Closeout must route to the next intake-derived pre-Claude-bakeoff item, expected to be Bandit Cockpit UI Polish From Attached Design unless implementation evidence validates a different order or disposition. |
| Cockpit status and session-context agree | pass | Required later: rerun both derived commands after closeout edits. |
| `validate` and `git diff --check` pass | pass | Required later: `npm run bandit -- validate` and `git diff --check`; Stage 6 final validation should not rerun land-check after an evidence-only closeout commit. |
