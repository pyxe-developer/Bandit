# BANDIT-099 Orchestration Plan

contract_version: 1
work_item: BANDIT-099
work_type: bootstrap_gap_chore
current_coordination_state: formation_approved
created_at: 2026-06-12T07:30:00-04:00
author: work_item_pm

This plan is advisory orchestration evidence only. It does not replace the
approved brief, coordination log, RED evidence, implementation evidence,
review evidence, landing evidence, retrospective evidence, roadmap,
current-context, bootstrap-gap ledger, or Bandit CLI authority.

## Current Repo State

`BANDIT-099` is the active formed and formation-approved bootstrap-gap chore
for Public Consumer Onboarding Hardening. `BANDIT-098` is the last closed work
item and has landing action evidence, retrospective evidence, improvement
disposition, closed coordination evidence, and synchronized routing/status
files.

`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
`node ./bin/bandit.mjs cockpit status --json`, and
`node ./bin/bandit.mjs session-context current --json` all identify
`BANDIT-099` as the active work item and name Work Item PM plan-mode
orchestration as the next action before RED evidence. Required operator input
is `none_required` for the current action.

`git status --short --branch` reports `## main...origin/main [ahead 1]` with no
dirty tracked or untracked files before this plan is added. The active
bootstrap gap is
`BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING`, linked to `BANDIT-099` in
`.bandit/bootstrap-gaps.json`.

### 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-099/brief.md`, `docs/work/BANDIT-099/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | pass | `git status --short --branch` returned only `## main...origin/main [ahead 1]`; the later dirty state is this plan artifact. |
| Routing/status surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context all identify `BANDIT-099` and the plan-mode next action. |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-098/landing-action.md`, `retrospective.md`, `improvement-disposition.md`, and `coordination-log.jsonl` `closed` transition. |
| Operator-input status is explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `brief.md` record `none_required` for the current action. |

### 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-099/brief.md` includes origin, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, role boundaries, expected files, and forbidden actions. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-099/qwen-formation-review.md` records authorized Local Qwen route, `verdict: pass`, and `findings_status: no_findings`. |
| CodeRabbit formation review exists and is not blocking | pass | `docs/work/BANDIT-099/coderabbit-formation-review.md` records terminal `review_completed` with `findings: 0`. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-099/formation-review.md` records aggregate `verdict: pass` and `findings_status: no_findings`. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-099/coordination-log.jsonl` sequence 2 records `state: formation_approved`. |

### 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns RED surfaces | pass | `brief.md` Permanent Test Ownership Boundary gives Test Writer ownership of tests, fixtures, RED evidence, and acceptance mappings. |
| RED must map to acceptance criteria | pass | `brief.md` verification plan requires RED evidence for model-agnostic starter governance, safe first-time commands, onboarding/README init availability, no-overwrite behavior, package allow-list, and packed-install consumer verification. |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` and this plan forbid Stage 3 test, fixture, RED evidence, or acceptance-mapping edits. |
| Codex-authored RED triggers different model family | pass | `brief.md` Bootstrap Model-Family Separation requires Claude/non-Codex Stage 3 if Codex materially authors RED. |
| `red_recorded` before implementation | pass | Stage sequence below requires `red_recorded` transition before Stage 3 dispatch. |

### 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Stage 3 scope below limits Writer to source/chore delivery and implementation evidence after RED. |
| No Writer test-surface edits | pass | Permanent Test Ownership Boundary forbids Writer edits to tests, helpers, fixtures, RED evidence, and acceptance mappings. |
| Focused tests pass or bootstrap gap recorded | pass | Verification commands below include focused init, public-consumer, private-install/package allow-list, typecheck, and full tests as applicable; failures must be repaired or recorded honestly. |
| `implementation-evidence.md` and Writer report required | pass | Required Evidence section names `docs/work/BANDIT-099/implementation-evidence.md` and `writer-report.md`. |
| PM acceptance verifies spec and clean-code posture | pass | Required Evidence section names `stage3-pm-acceptance.md`; Stage 5/6 require clean-code evaluation before landing. |
| Claude gets 20 minutes before fallback | pass | Role Boundaries section records the Claude 20-minute rule and MiniMax-M3 fallback after auth failure or timeout. |

### 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal evidence | pass | Required Evidence section requires `coderabbit-review.md` or honest timeout/refusal evidence after the full wait. |
| Local Qwen review path | pass | Brief and Verification Commands require `.bandit/reviewers/local-qwen.json` via `bin/omlx-chat-completions.mjs`; direct `qwen` CLI is forbidden. |
| Escalated review if policy smells require it | pass | Stage sequence requires escalated review when smell triggers or policy require it. |
| Risk classification | pass | Required Evidence requires layered risk classification because the work touches package distribution, install docs, CLI init/onboarding behavior, and governance files. |
| Supply-chain gate when applicable | pass | Required Evidence requires supply-chain gate evidence for distribution, package allow-list, init/onboarding, and governance-file changes. |
| Every finding repaired or dispositioned | pass | Required Evidence requires finding-disposition artifacts if reviewers raise findings. |
| Aggregate evidence current for review subject | pass | Verification Commands require `review-subject-hash` before Stage 4 aggregation and landing. |

### 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict required | pass | Required Evidence names `docs/work/BANDIT-099/landing-verdict.md`. |
| Feature UAT status handled | not_applicable | `brief.md` states product UAT is not active unless implementation adds a user-facing workflow surface beyond local onboarding/docs/init behavior. |
| `land-check` passes | pass | Verification Commands include `node ./bin/bandit.mjs land-check BANDIT-099`. |
| Landing action records commit evidence | pass | Required Evidence names `docs/work/BANDIT-099/landing-action.md` after local-record landing. |
| No next Work Item before landing action | pass | Stop Conditions forbid starting V0 trial or unrelated work before landing action and closeout evidence exist. |

### 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required Evidence names `docs/work/BANDIT-099/retrospective.md`. |
| Structured improvement mining complete | pass | Stage sequence requires Stage 6 retrospective and improvement/no-action disposition before closeout. |
| Every lesson has durable disposition | pass | Required Evidence names `docs/work/BANDIT-099/improvement-disposition.md`. |
| Routing/status files updated if state changed | pass | Required Evidence includes `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and bootstrap-gap ledger synchronization. |
| Cockpit and session-context agree | pass | Final verification commands include both derived status checks. |
| `validate` and `git diff --check` pass | pass | Verification Commands include `npm run bandit -- validate` and `git diff --check`; final closeout must not rerun land-check after evidence-only closeout commit. |

## Stage Sequence

| Stage | Accountable role | Required transition | Notes |
| --- | --- | --- | --- |
| Plan Mode | Work Item PM | `orchestration_plan_recorded` | This plan must be recorded before RED evidence. |
| Stage 2 RED | Test Writer | `red_recorded` | Write failing tests and RED evidence for model-agnostic starter governance, consumer onboarding guidance, `bandit init` README/onboarding availability, no-overwrite behavior, safe first-time command examples, package allow-list, and packed-install consumer command execution. |
| Stage 3 Implementation | Implementation Writer | `implementation_recorded` | Implement only the minimal README/template/init/package/source changes needed to satisfy RED evidence. If Codex authors RED, route Stage 3 to Claude first, with MiniMax-M3 fallback only after auth failure or the required 20-minute timeout. |
| Stage 4 Review | Reviewers / Codex PM | `review_recorded` | Run CodeRabbit or honest timeout/refusal evidence, Local Qwen through the authorized MLX route, aggregate review evidence, review-subject hash, risk classification, supply-chain gate, escalated review if policy requires it, and finding dispositions. |
| Stage 5 Landing | Landing Agent | `landing_verdict_recorded`, then `landed` | Write landing verdict, create a clean source/evidence commit, refresh source-head/hash evidence, run land-check, then local-record landing. Feature UAT is not applicable unless implementation adds a user-facing workflow surface beyond local onboarding/docs/init behavior. |
| Stage 6 Closeout | Closeout Agent | `closed` | Record retrospective, structured improvement/no-action disposition, resolve or disposition the active bootstrap gap only after landing evidence, synchronize routing/status files, and run final validation without rerunning land-check after an evidence-only closeout commit. |

## Required Evidence

| Stage | Required artifact or command evidence |
| --- | --- |
| Plan Mode | `docs/work/BANDIT-099/orchestration-plan.md` and `docs/work/BANDIT-099/coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | `docs/work/BANDIT-099/red-evidence.md`, focused RED tests, acceptance mapping, model-family separation statement, and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | Source changes limited to starter governance templates, consumer onboarding guidance, README/onboarding init behavior, no-overwrite behavior, first-time command examples, package allow-list, and tests already owned by Stage 2; `docs/work/BANDIT-099/stage3-dispatch.md`; `docs/work/BANDIT-099/writer-report.md`; `docs/work/BANDIT-099/implementation-evidence.md`; `docs/work/BANDIT-099/stage3-pm-acceptance.md`; passing focused tests or recorded bootstrap gap; and `implementation_recorded`. |
| Stage 4 | `docs/work/BANDIT-099/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-099/local-qwen-review.md`, finding dispositions if needed, layered risk-classification evidence, supply-chain gate evidence, `docs/work/BANDIT-099/review-evidence.md`, review-subject hash, and `review_recorded`. |
| Stage 5 | `docs/work/BANDIT-099/landing-verdict.md`, clean source/evidence commit, refreshed review-subject/source-head evidence, `node ./bin/bandit.mjs land-check BANDIT-099`, `docs/work/BANDIT-099/landing-action.md`, and `landed`. |
| Stage 6 | `docs/work/BANDIT-099/retrospective.md`, `docs/work/BANDIT-099/improvement-disposition.md`, resolved/dispositioned `BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING` ledger state, synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, final coordination validation, Bandit validation, cockpit/session-context agreement, and diff hygiene. |

## Role Boundaries

Repo PM owns Stage 1 formation and has already stopped at
`formation_approved`. Work Item PM owns this plan and stage routing after
formation approval. Test Writer owns Stage 2 tests, fixtures, RED evidence,
and acceptance mappings. Implementation Writer owns Stage 3 source/chore
delivery and implementation evidence only. Reviewers own Stage 4 review
outputs. Landing Agent owns Stage 5 landing verdict and landing action.
Closeout Agent owns Stage 6 retrospective and improvement/no-action
disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-099`.

Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2
RED tests, Stage 3 implementation routes to Claude or another non-Codex model
family. During bootstrap, Claude is the default Stage 3 Writer path. Give
Claude the required 20-minute work window before fallback unless
authentication fails immediately. If Claude times out or fails after that
window, use MiniMax-M3 through headless `pi` as fallback and record the route.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-099
node ./bin/bandit.mjs coordination validate BANDIT-099
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
node --test test/private-install-update-channel.test.mjs
npm pack --dry-run --json
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs review-subject-hash BANDIT-099
npm run bandit -- coderabbit-review pre-pr BANDIT-099 --base origin/main
npm run bandit -- qwen-review BANDIT-099
node ./bin/bandit.mjs land-check BANDIT-099
node ./bin/bandit.mjs land BANDIT-099 --action local-record
git diff --check
```

Run focused init/onboarding, public-consumer quickstart, package allow-list,
and packed-install consumer verification before full `npm test`. Run full
tests before landing because this chore may touch package metadata, README
command surfaces, init/onboarding, templates, validation, package distribution
policy, cockpit status, or session-context behavior.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current recorded action.

CodeRabbit formation review returned terminal `review_completed` evidence with
`findings: 0`; no formation timeout replacement evidence is needed for this
work item. Local Qwen formation review passed through the authorized
`.bandit/reviewers/local-qwen.json` / `node bin/omlx-chat-completions.mjs`
route.

Halt for operator input if future evidence would approve expanded landing
autonomy, Notify-And-Revert or Auto-Landing Scope for a new boundary cell,
public package publishing, paid registry setup, hosted update services,
telemetry, automatic self-update, credential handling, external repo mutation,
installed global skill mutation, automation prompt mutation, merge/push/deploy
authority, Trust Verifier cutover, old-gate replacement or wrapping, product or
UAT direction changes, business tradeoffs, explicit cost/risk posture, paid or
live reviewer/model routing, or genuinely ambiguous scope.

## Stop Conditions

- Stop if any formation evidence becomes missing, stale, contradictory,
  blocked, or operator-input-gated; route back to Repo PM rather than running
  `repo-pm approve-formation`.
- Stop if Stage 2 cannot produce tests or an explicit verification plan mapped
  to acceptance criteria.
- Stop if Stage 3 Writer edits tests, test helpers, fixtures, RED evidence, or
  acceptance mappings; invalidate the attempt and rerun from clean RED evidence.
- Stop if Claude auth fails and MiniMax-M3 fallback is unavailable, or if no
  non-Codex Stage 3 Writer route is available after Codex-authored RED.
- Stop if CodeRabbit returns actionable unresolved findings, request-changes,
  malformed output, or provider failure without honest timeout/refusal evidence
  after the required wait.
- Stop if Local Qwen is unavailable through the authorized adapter route; ask
  the operator for help rather than substituting an unauthorized route.
- Stop if risk classification, supply-chain gate, review-subject hash, source
  freshness, clean-code compliance, or land-check blocks landing.
- Stop if implementation would broaden into public publishing automation,
  credentials, hosted services, telemetry, self-update, external mutation,
  Trust Verifier cutover, local API, State Index, guarded browser action
  execution, V0 trial work, or unrelated Phase 8 product scope.

## Forbidden Actions

- Do not start RED evidence before `orchestration_plan_recorded` is appended by
  `node ./bin/bandit.mjs work-item-pm start BANDIT-099`.
- Do not let the orchestration plan replace the approved brief, coordination
  log, stage evidence, roadmap, current context, bootstrap-gap ledger, or CLI
  authority.
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, retrospective evidence, or policy acceptance criteria.
- Do not use direct `qwen` CLI, Ollama, paid/live reviewer routes, or another
  ad hoc reviewer route as Local Qwen evidence.
- Do not claim CodeRabbit success for timeout, provider error, malformed
  output, missing route, stale evidence, or unresolved findings.
- Do not overwrite consumer-owned README.md or governance artifacts without
  explicit no-overwrite behavior.
- Do not add public npm publish automation, publish credential handling, paid
  registry setup, hosted update service, telemetry, automatic self-update,
  external repo mutation outside explicit local onboarding files, installed
  global skill mutation, automation prompt mutation, merge/push/deploy
  authority, Trust Verifier cutover, old-gate replacement or wrapping, local
  API work, State Index work, guarded browser action execution, V0 Closeout
  Claude Code A/B Product-Value Trial implementation, or unrelated Phase 8
  product work.
