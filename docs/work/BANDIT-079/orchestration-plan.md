# BANDIT-079 Orchestration Plan

contract_version: 1
work_item: BANDIT-079
work_type: slice
orchestrator: work_item_pm
created_at: 2026-06-08T23:08:35Z

## Current Repo State

`BANDIT-079` is the active Phase 8 product slice for the Improvement Health
Surface. Stage 1 formation is complete: `docs/work/BANDIT-079/brief.md`,
`docs/work/BANDIT-079/qwen-formation-review.md`,
`docs/work/BANDIT-079/coderabbit-formation-review.md`,
`docs/work/BANDIT-079/formation-review.md`, and
`docs/work/BANDIT-079/coordination-log.jsonl` exist, and the coordination log
records `formation_approved`.

Current coordination state: `formation_approved`.

Current next action: run Work Item PM plan-mode orchestration before RED
evidence. Do not create RED evidence or implementation until this plan exists
and `node ./bin/bandit.mjs work-item-pm start BANDIT-079` records
`orchestration_plan_recorded`.

No operator-owned input is required for plan mode. CLI-owned product UAT is
required before landing because this slice changes the operator-facing cockpit
surface.

## Stage Sequence

| Stage | Accountable role | Required result |
| --- | --- | --- |
| Stage 2 RED | Test Writer | RED tests and RED evidence map improvement-health derivation, guardrails, source traceability, authority boundaries, responsive behavior, and accessibility states to acceptance criteria. |
| Stage 3 Implementation | Implementation Writer, Claude-family if Codex authored RED | Source delivery only; no test-surface edits. |
| Stage 4 Review | Reviewer / Codex PM aggregate | CodeRabbit, Local Qwen, risk, supply-chain, browser smoke, hash, clean-code, and finding disposition evidence. |
| Stage 5 Landing | Landing Agent | UAT, landing verdict, land-check, source/evidence commit, hash refresh, local-record landing action. |
| Stage 6 Closeout | Closeout Agent / Codex PM | Retrospective, improvement disposition, routing sync, final validation. |

## Required Evidence

| Stage | Evidence |
| --- | --- |
| Stage 2 | `test/cockpit-improvement-health.test.mjs`, relevant cockpit/view-model/evidence/UI tests or fixtures, and `docs/work/BANDIT-079/red-evidence.md`. |
| Stage 3 | `docs/work/BANDIT-079/implementation-evidence.md`, `docs/work/BANDIT-079/writer-report.md`, `docs/work/BANDIT-079/stage3-pm-review.md`, and role/run or dispatch evidence. |
| Stage 4 | `docs/work/BANDIT-079/coderabbit-review.md`, `docs/work/BANDIT-079/local-qwen-review.md`, risk classification, supply-chain gate, review-subject hash, browser smoke evidence, finding dispositions when needed, and `docs/work/BANDIT-079/review-evidence.md`. |
| Stage 5 | `docs/work/BANDIT-079/uat-approval.md`, `docs/work/BANDIT-079/landing-verdict.md`, `docs/work/BANDIT-079/landing-action.md`, land-check output, and current source/evidence commit. |
| Stage 6 | `docs/work/BANDIT-079/retrospective.md`, improvement or no-action disposition artifacts, `.bandit/bootstrap-gaps.json` if changed, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, and final validation output. |

## Role Boundaries

- Repo PM owns Stage 1 brief creation, formation review routing, formation
  approval, and context synchronization.
- Work Item PM owns this orchestration plan and stage-gate coordination after
  `formation_approved`.
- Test Writer owns Stage 2 tests, helpers, fixtures, RED evidence, and
  acceptance mappings.
- Implementation Writer owns Stage 3 source and product delivery only.
- Permanent Test Ownership Boundary: Stage 3 Writer has zero authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-079`.
- Bootstrap Model-Family Separation: if Codex authors or materially edits Stage
  2 RED tests, Stage 3 implementation must use the Claude-family bootstrap
  implementation-writer path unless an operator-approved policy exception is
  recorded.
- Reviewers own Stage 4 reviewer evidence. Local Qwen may only run through
  `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`.
- Landing Agent owns Stage 5 landing verdict and landing action evidence.
- Operator owns product direction and any product, policy, business, cost,
  risk, merge, push, deploy, external-service, guarded-execution, or Trust
  Verifier cutover decision that repo artifacts cannot answer. Product UAT
  evidence is required before landing.
- Closeout Agent / Codex PM owns Stage 6 retrospective, improvement
  disposition, and routing/status synchronization.

## Verification Commands

- `node --test test/improvements.test.mjs`
- `node --test test/cockpit-improvement-health.test.mjs`
- `node --test test/cockpit-view-model.test.mjs`
- `node --test test/cockpit-evidence-detail.test.mjs`
- `node --test test/cockpit-browser-shell.test.mjs`
- `node --test test/cockpit-ui.test.mjs`
- `npm test`
- `npm run typecheck`
- `npm run bandit -- improvements candidates --json`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-079`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-079 --base origin/main`
- `npm run bandit -- qwen-review BANDIT-079`
- `npm run bandit -- review-subject-hash BANDIT-079`
- `npm run bandit -- land-check BANDIT-079`
- `git diff --check`

Run a local browser or Playwright smoke check against the static cockpit preview
after implementation updates the browser-served surface, covering desktop and
mobile text fit, source-path wrapping, candidate IDs, outcome labels,
metric/baseline text, guardrail summaries, focus order, source-link
reachability, and no overlap or truncation in dense detail rows.

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Known blocker status | pass | `docs/roadmap/CURRENT_CONTEXT.md` and `STATUS.md` record no operator-owned input required for plan mode. |
| Open bootstrap gaps | pass | `node ./bin/bandit.mjs cockpit status --json` reports bootstrap gaps status `none`; `.bandit/bootstrap-gaps.json` contains no active open gap. |
| Product UAT before landing | non_blocking | `docs/work/BANDIT-079/brief.md` requires CLI-owned product UAT before landing; not required before Stage 2. |
| Local Qwen availability | non_blocking | Brief records MLX adapter route and says to stop for operator help if unavailable during Stage 4. |
| CodeRabbit provider availability | non_blocking | Brief allows honest provider-timeout/bootstrap replacement evidence if CodeRabbit is unavailable; no pass may be claimed without terminal evidence. |

## Stop Conditions

- Missing, stale, contradictory, or blocking formation evidence rejected by
  `work-item-pm start`.
- RED evidence lacks acceptance mapping, test ownership, guardrail coverage, or
  Stage 3 test-edit refusal.
- Stage 3 Writer edits any test surface, fixture, RED evidence, or acceptance
  mapping.
- Claude implementation run must not be interrupted before a full 15 minutes
  unless it exits or a hard policy blocker appears.
- Browser code invokes CLI commands, writes repo artifacts, evaluates
  improvement candidates, records outcomes, records UAT, decides landing
  safety, merges, pushes, deploys, changes policy, starts live guarded
  execution, or makes browser state canonical.
- Improvement-health derivation silently normalizes missing, stale,
  contradictory, unavailable, unsupported, not-due, due, or blocked-evaluation
  states into healthy/complete states.
- Any metric or chart label implies causal proof, statistically certain
  improvement, policy approval, recurring paid routing, or automatic
  keep/revise/revert/double_down authority.
- CodeRabbit review must not be interrupted before a full 10 minutes unless it
  exits.
- Local Qwen unavailable through the authorized MLX adapter route.
- Unresolved reviewer findings, stale review-subject evidence, missing risk
  classification, missing supply-chain gate when applicable, or missing browser
  smoke evidence.
- Missing CLI-owned product UAT before landing.
- `land-check`, `validate`, coordination validation, cockpit status,
  session-context, or `git diff --check` fails without a recorded accepted
  blocker or bootstrap gap.
- Operator-owned product, UAT, business, policy, cost, risk, Trust Verifier
  cutover, guarded action execution, merge, push, deploy, external-service, or
  genuinely ambiguous scope decision is required.

## Forbidden Actions

- Do not implement automatic improvement evaluation, background scheduling,
  heartbeat execution, local queue management, hidden improvement indexes,
  State Index persistence, SQLite, local API endpoints, live polling,
  websocket updates, browser-side CLI execution, guarded action execution,
  claim/worktree lifecycle, PR/CI orchestration, automatic merge, push, deploy,
  production canary behavior, hosted replay services, cross-repo aggregation,
  or external telemetry.
- Do not choose local API shape, State Index timing, hosted packaging, external
  service setup, framework migration, dependency additions, lockfile changes,
  package-manager script changes, paid reviewer/model routing, public benchmark
  publication, or live action queue semantics.
- Do not let generated JSON, preview files, fixture data, browser state, local
  cache, screenshots, static HTML, CSS, UI component state, improvement-health
  rows, or the view model become canonical workflow authority.
- Do not make the UI approve product UAT, policy overrides, business
  tradeoffs, explicit cost/risk posture, provider-pricing evidence,
  spend-class policy, Trust Verifier cutover, merge readiness, deploy safety,
  candidate evaluation outcomes, or landing safety.
- Do not replace current improvements CLI, cockpit status, session-context,
  coordination, review, landing, UAT, retrospective, bootstrap-gap,
  risk-classification, supply-chain, artifact-create, work-item-create, or
  Trust Verifier authority.
- Do not implement broader historical analytics, scheduler/claim/worktree
  behavior, local API work, live action execution, automatic improvement
  evaluation, or unrelated Phase 8 cockpit product scope inside this slice.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-079/brief.md`, `docs/work/BANDIT-079/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected | pass | `git status --short --branch` reported `## main...origin/main [ahead 1]` with no dirty paths before plan edits. |
| Routing surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` identify `BANDIT-079` and plan mode as the next action. |
| Prior Work Item closed | pass | `docs/work/BANDIT-078/landing-action.md`, `docs/work/BANDIT-078/retrospective.md`, and `docs/work/BANDIT-078/improvement-disposition.md` exist; roadmap lists `BANDIT-078` as the last closed work item. |
| Operator-input status explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `brief.md` state none required for plan mode; CLI-owned product UAT is required before landing. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-079/brief.md` includes product work, source provenance, scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, role boundaries, stage capability scope, expected files, and operator-input status. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-079/qwen-formation-review.md` records `verdict: pass` and `findings_status: none` through the authorized MLX adapter route. |
| CodeRabbit formation review exists and is not blocking | pass | `docs/work/BANDIT-079/coderabbit-formation-review.md` records `verdict: pass`, terminal `review_completed`, and zero findings. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-079/formation-review.md` records `verdict: pass` and no open findings. Its approval-next-action wording predates sequence 2 in the coordination log and is superseded by the append-only `formation_approved` transition. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-079/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns RED evidence | pass | `brief.md` Role Boundary Evidence assigns tests, helpers, fixtures, RED evidence, and acceptance mappings to Test Writer. |
| RED evidence maps to acceptance criteria | pass | This plan requires RED tests for improvement-health derivation, evaluated/pending/due/missing states, workflow-trial guardrail completeness, repeated smell/tension source traceability, browser authority boundaries, responsive behavior, and accessibility states before Stage 3. |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` and this plan restate the Permanent Test Ownership Boundary. |
| Codex-authored RED routes Stage 3 to Claude | pass | `brief.md` Verification Plan and Role Boundary Evidence require Claude-family Stage 3 implementation if Codex authors or materially edits RED evidence. |
| `red_recorded` required before implementation | pass | This plan forbids Stage 3 until RED evidence exists and coordination records the Stage 2 transition. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | `brief.md` Stage Capability Scope limits Stage 3 Writer to source implementation only. |
| No Writer test-surface edits | pass | This plan makes any Stage 3 test-surface edit a stop condition requiring invalidation and rerun. |
| Focused tests pass or bootstrap gap recorded | pass | Verification Commands list focused improvement/cockpit tests, `npm test` when shared surfaces are touched, and `npm run typecheck`. |
| Implementation evidence and Writer report required | pass | Required Evidence lists `implementation-evidence.md`, `writer-report.md`, `stage3-pm-review.md`, and run/dispatch evidence. |
| PM acceptance verifies spec and clean code | pass | Stage 3 evidence must map code to acceptance criteria and include a `CLEAN_CODE.md` check before Stage 4. |
| Claude 15-minute window preserved | pass | Stop Conditions require giving Claude 15 minutes unless it exits or a hard blocker appears; if Claude auth fails or times out after 15 minutes, fallback is MiniMax-M3 through headless `pi` using file/stdin prompt forms. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal evidence | pass | Verification Commands include `npm run bandit -- coderabbit-review pre-pr BANDIT-079 --base origin/main`; brief allows honest timeout/refusal evidence. |
| Local Qwen review | pass | Verification Commands include `npm run bandit -- qwen-review BANDIT-079`; Local Qwen route is limited to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`. |
| Escalated review if smells require it | pass | Brief Smell Triggers and Stage Rubrics require escalation for policy smells; no escalation trigger is known at plan time. |
| Risk classification | pass | Required Evidence includes layered risk classification before aggregate review. |
| Supply-chain gate when applicable | pass | Required Evidence includes supply-chain gate because browser-facing and workflow-improvement presentation surfaces may be touched. |
| Findings repaired or dispositioned | pass | Stage 4 stop conditions block unresolved findings or stale evidence. |
| Aggregate review current for subject | pass | Verification Commands include `npm run bandit -- review-subject-hash BANDIT-079` and aggregate `review-evidence.md`. |
| CodeRabbit 10-minute window preserved | pass | Stop Conditions forbid interrupting CodeRabbit before 10 minutes unless it exits. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists before land-check closeout | pass | Required Evidence lists `docs/work/BANDIT-079/landing-verdict.md`. |
| Feature UAT handled | pass | Brief and this plan require CLI-owned product UAT evidence before landing. |
| `land-check` passes | pass | Verification Commands include `npm run bandit -- land-check BANDIT-079`. |
| Landing action records commit SHA | pass | Required Evidence lists `docs/work/BANDIT-079/landing-action.md`; landing path is local-record after clean source/evidence commit and source-head/hash refresh. |
| No next Work Item before landing action | pass | Stop Conditions and forbidden actions block next-slice work before local-record landing evidence. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required Evidence lists `docs/work/BANDIT-079/retrospective.md`. |
| Structured improvement mining complete | pass | Stage 6 Required Evidence requires improvement or no-action disposition artifacts and structured mining. |
| Every lesson has durable disposition | pass | Stage 6 stop condition blocks undispositioned lessons. |
| Routing/status updated if changed | pass | Required Evidence lists `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`. |
| Cockpit and session-context agree | pass | Verification Commands include both derived status commands. |
| `validate` and `git diff --check` pass | pass | Verification Commands include `npm run bandit -- validate` and `git diff --check`. |
