# BANDIT-104 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-104
owner: work_item_pm
created_at: 2026-06-12T19:10:00Z
current_stage: Stage 1: formation_approved
next_gate: Stage 2 RED evidence

This plan is Work Item PM orchestration evidence only. It does not replace
`docs/work/BANDIT-104/brief.md`, append-only coordination history, stage
evidence, reviewer evidence, landing evidence, retrospective evidence, roadmap
state, current context, or bootstrap-gap authority.

## Current Repo State

`BANDIT-104` is the active bootstrap-gap work item for
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`. The brief scopes this as a
non-product chore to repair `work-execute --json` stage-route derivation from
append-only coordination state. Current context, roadmap, status, cockpit
status, and session-context all point to plan-mode orchestration before RED
evidence.

| Check | Verdict | Evidence |
| --- | --- | --- |
| Active work item selected | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; `node ./bin/bandit.mjs session-context current --json` reports `BANDIT-104` |
| Brief exists | pass | `docs/work/BANDIT-104/brief.md` |
| Current coordination state | pass | `docs/work/BANDIT-104/coordination-log.jsonl` records `formation_approved`; `node ./bin/bandit.mjs coordination status BANDIT-104 --json` reports `formation_approved` |
| Current execution controller state | pass | `node ./bin/bandit.mjs work-execute --json` reports `missing_plan_mode` with next safe command `node ./bin/bandit.mjs work-item-pm start BANDIT-104` |
| Git status inspected | pass | `git status --short --branch` reports `## main...origin/main [ahead 1]` and no dirty paths |
| Operator input status | pass | `docs/work/BANDIT-104/brief.md`, `CURRENT_CONTEXT.md`, and `STATUS.md` record `none_required` |

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, `BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `STAGE_RUBRICS.md`, `STATUS.md`, `brief.md`, `coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` shows clean worktree, branch `main` ahead of `origin/main` by one commit |
| Current context, roadmap, status, cockpit, and session-context agree | pass | All name `BANDIT-104`, Stage 1 `formation_approved`, next action plan-mode orchestration, and `none_required` operator input |
| Prior work item fully closed | pass | `CURRENT_CONTEXT.md` records `BANDIT-100` closed with brief, RED, implementation, review, landing verdict, landing action, retrospective, improvement disposition, and coordination evidence |
| Operator-input status explicit | pass | `Required Operator Input` sections in `CURRENT_CONTEXT.md`, `STATUS.md`, and `brief.md` record `none_required` |
| Active bootstrap gap boundary preserved | pass | `.bandit/bootstrap-gaps.json` links `BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT` to `BANDIT-104`; roadmap blocks unrelated `BANDIT-101`/`102`/`103` work |

## 1. Repo PM Formation Complete

This section is verification-only for Work Item PM. Work Item PM must not rerun
formation approval.

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief satisfies Stage 1 | pass | `docs/work/BANDIT-104/brief.md`; `docs/work/BANDIT-104/formation-review.md` Stage 1 checklist |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-104/qwen-formation-review.md` verdict `pass`, `findings_status: no_findings` |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-104/coderabbit-formation-review.md` records provider timeout after full 600-second run; no CodeRabbit pass is claimed and no terminal findings were emitted |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-104/formation-review.md` aggregate verdict `pass` |
| Coordination log records formation approval | pass | `docs/work/BANDIT-104/coordination-log.jsonl` sequence 2 records `state: formation_approved` |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `brief.md` Permanent Test Ownership Boundary; Stage 2 will only write test-owned surfaces and `red-evidence.md` |
| RED evidence maps tests or verification plan to acceptance criteria | pass | `brief.md` Acceptance Criteria and Verification Plan; required output `docs/work/BANDIT-104/red-evidence.md` |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` forbids Stage 3 Writer test, fixture, RED evidence, and acceptance-mapping edits |
| Codex-authored RED requires different model family for Stage 3 | pass | This plan routes Stage 3 source implementation to MiniMax-M3 per current Work Item PM automation prompt |
| `red_recorded` required before implementation | pass | `coordination-log.jsonl` currently lacks `red_recorded`; Work Item PM will run Stage 2 and record `red_recorded` before any implementation dispatch |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Stage 3 dispatch will grant MiniMax-M3 source delivery only for `src/commands/bandit-work-execute.ts`, `src/state/work-execute-controller.ts`, and `src/state/stage-route-registry.ts` as needed |
| No Writer test-surface edits | pass | Stage 3 dispatch will forbid edits to `test/**`, fixtures, `red-evidence.md`, and acceptance mappings |
| Focused tests pass or bootstrap gap is recorded | pass | Required commands: `node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs`; `npm run typecheck`; `npm test` if shared projection behavior changes |
| Implementation evidence and Writer report required | pass | Required outputs: `docs/work/BANDIT-104/implementation-evidence.md` and MiniMax-M3 writer report or dispatch summary |
| PM acceptance verifies spec alignment and clean-code posture | pass | PM acceptance must compare source diff to `brief.md`, source spec, `CLEAN_CODE.md`, and Stage 3 rubric |
| MiniMax-M3 given 20 minutes before timeout judgment | pass | Current automation prompt requires MiniMax-M3 as Writer and says not to interrupt before 20 minutes unless changes are evident |
| MiniMax failure retry policy recorded | pass | If MiniMax-M3 fails or times out, retry up to two more times, then stop and wait for operator help |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review required | pass | Stage 4 must run CodeRabbit and cannot close without successful CodeRabbit run per current automation prompt |
| Local Qwen review required through authorized path | pass | `CURRENT_CONTEXT.md` and `ROADMAP.md` authorize only `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs` |
| Escalated review handled when policy smells require it | pass | Smell/risk review will inspect changed surfaces; if escalation is required and MiniMax authored Stage 3, try Claude first, then Codex GPT-5.5 xhigh fallback per current prompt |
| Risk classification required | pass | Stage 4 evidence must classify route-derivation/source-state changes and auto-landing eligibility |
| Supply-chain gate state recorded | pass | Brief forbids dependency, lockfile, release, publish, and hosted-service changes; Stage 4 will record `not_applicable` unless diff touches sensitive surfaces |
| Findings repaired or dispositioned | pass | Stage 4 cannot pass with unresolved CodeRabbit, Qwen, or escalated-review findings |
| Aggregate review current for review subject | pass | Review evidence must record source head and review-subject hash or equivalent freshness evidence |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict required | pass | Required output `docs/work/BANDIT-104/landing-verdict.md` |
| Feature UAT handled when applicable | not_applicable | `BANDIT-104` is a bootstrap-gap chore, not a feature slice; no product UAT required unless later artifacts change scope |
| `land-check` must pass | pass | Required command `node ./bin/bandit.mjs land-check BANDIT-104` |
| Clean source/evidence commit before local-record landing | pass | Current prompt requires source/evidence commit, then source-head/hash refresh, then landing action |
| Landing action records commit SHA or merge evidence | pass | Required output `docs/work/BANDIT-104/landing-action.md` |
| No next Work Item before landing action | pass | `AGENTS.md`, `BOOTSTRAP_METHODOLOGY.md`, `CURRENT_CONTEXT.md`, and `ROADMAP.md` block `BANDIT-101` before `BANDIT-104` lands |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective required | pass | Required output `docs/work/BANDIT-104/retrospective.md` |
| Structured improvement mining required | pass | Stage 6 rubric requires mining checklist and durable disposition for every lesson |
| Every lesson has durable disposition | pass | Required output must classify lessons as improvement chore, cross-model tension, smell catalog update, or no-action |
| Context, roadmap, and status updated if state changed | pass | Stage 6 must refresh `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` |
| Cockpit status and session-context agree | pass | Final checks must run `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json` |
| Final validation and whitespace checks pass | pass | Required commands: `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-104`, and `git diff --check` |
| Stage 6 does not rerun land-check after evidence-only closeout commit | pass | Current automation prompt forbids rerunning land-check after evidence-only closeout commit |

## Stage Sequence

| Stage | Accountable role | Required output before next stage |
| --- | --- | --- |
| Plan mode | Work Item PM | This `orchestration-plan.md` plus `orchestration_plan_recorded` coordination transition |
| Stage 2 RED | Test Writer / Codex PM | Tests or verification plan, RED command evidence, acceptance mapping, `docs/work/BANDIT-104/red-evidence.md`, and `red_recorded` transition |
| Stage 3 Implementation | MiniMax-M3 Implementation Writer | Source-only implementation, focused test evidence, writer report, `docs/work/BANDIT-104/implementation-evidence.md`, and implementation transition |
| Stage 4 Review | CodeRabbit, Local Qwen, PM disposition | CodeRabbit success, Local Qwen review, any required escalation, risk classification, finding dispositions, `docs/work/BANDIT-104/review-evidence.md` |
| Stage 5 Landing | Landing Agent | Landing verdict, land-check pass, source/evidence commit, source-head/hash refresh, local-record landing action in `docs/work/BANDIT-104/landing-action.md` |
| Stage 6 Closeout | Closeout Agent / Codex PM | Retrospective, structured improvement mining, status/context updates, validation evidence, closeout transition |

## Required Evidence

- `docs/work/BANDIT-104/orchestration-plan.md`
- `docs/work/BANDIT-104/red-evidence.md`
- `docs/work/BANDIT-104/implementation-evidence.md`
- MiniMax-M3 writer dispatch/report artifact
- `docs/work/BANDIT-104/review-evidence.md`
- CodeRabbit Stage 4 review artifact
- Local Qwen Stage 4 review artifact
- Escalated review artifact if required
- `docs/work/BANDIT-104/landing-verdict.md`
- `docs/work/BANDIT-104/landing-action.md`
- `docs/work/BANDIT-104/retrospective.md`
- `docs/work/BANDIT-104/improvement-disposition.md` or explicit no-action disposition if lessons require it
- Updated `docs/work/BANDIT-104/coordination-log.jsonl`
- Updated `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` as state changes require

## Role Boundaries

- Repo PM owns formation and may not implement, review, land, or close this Work Item from the formation gate.
- Work Item PM owns orchestration, evidence continuity, role routing, blocker reporting, and PM dispositions. Work Item PM does not author implementation source when Stage 2 RED was Codex-authored.
- Test Writer owns tests, test helpers, fixtures, RED evidence, and acceptance mappings.
- Implementation Writer owns source/chore delivery only and has no test-surface write authority.
- Reviewers own independent review evidence; they do not land or mutate source.
- Landing Agent owns landing verdict and local-record landing mechanics after review gates pass.
- Closeout Agent owns retrospective, structured improvement mining, and closeout synchronization.
- Append-only coordination history remains canonical; cockpit status, session-context, and work-execute output are derived projections.

## Verification Commands

Required before implementation/landing as applicable:

```sh
node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs coordination validate BANDIT-104
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs land-check BANDIT-104
git diff --check
```

Stage 4 must also run successful CodeRabbit review and authorized Local Qwen
review before landing.

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Operator-owned input | pass | `none_required` in brief, current context, session-context, and status |
| Required tooling | non_blocking | MiniMax-M3, CodeRabbit, and Local Qwen still need live availability checks at their stages; halt if required tooling is unavailable under the automation prompt |
| Existing CodeRabbit formation timeout | bootstrap_gap | Stage 1 CodeRabbit formation timeout is recorded as replacement evidence only; Stage 4 still requires a successful CodeRabbit run before close |
| Work type projection mismatch | non_blocking | `brief.md` and roadmap classify `BANDIT-104` as a non-product gap/chore, while `coordination status` reports `work_type: slice`; this does not change the next gate, but Stage 6 should route any durable lesson if it affects operator-facing projections |

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-104` refuses this plan.
- Stage 2 cannot produce RED evidence mapped to acceptance criteria.
- Stage 3 Writer edits tests, fixtures, RED evidence, or acceptance mappings.
- MiniMax-M3 fails or times out across the allowed attempts.
- Focused tests, typecheck, validation, coordination validation, or diff checks fail without repair.
- CodeRabbit Stage 4 review is unavailable or unsuccessful; Stage 4 cannot close without a successful CodeRabbit run.
- Local Qwen is unavailable through the authorized MLX adapter route.
- Reviewer findings remain unresolved or undispositioned.
- Policy smells require escalation and no authorized escalated review route succeeds.
- Landing Agent returns `needs-repair`, `blocked`, or `requires operator approval`.
- New operator-owned product, UAT, policy, business, cost/risk, publish, merge/push/deploy, external-repo, installed-global-skill, or Trust Verifier cutover input becomes required.

## Forbidden Actions

- Do not start, form, or modify `BANDIT-101`, `BANDIT-102`, `BANDIT-103`, or unrelated PRD-006 product work.
- Do not implement typed reviewer adapters, public publish automation, hosted services, telemetry, automatic self-update, Trust Verifier cutover, claim authority, worktree lifecycle, cockpit UI, State Index, merge, push, deploy, external repo mutation, or local API work.
- Do not change dependencies, lockfiles, CI/release workflows, Local Qwen reviewer routing, or authorized reviewer profiles unless explicitly required by a blocking finding and approved by scope.
- Do not let `work-execute` output become canonical state; route from append-only coordination history.
- Do not bypass Work Item PM plan mode, Stage 2 RED, Stage 4 review, Stage 5 landing, or Stage 6 closeout.
- Do not let MiniMax-M3 or any Stage 3 Writer edit tests, fixtures, RED evidence, acceptance mappings, or PM-owned evidence.
