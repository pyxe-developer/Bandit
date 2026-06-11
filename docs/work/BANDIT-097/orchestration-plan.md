# BANDIT-097 Orchestration Plan

contract_version: 1
work_item: BANDIT-097
work_type: slice
current_coordination_state: formation_approved
created_at: 2026-06-11T14:26:35Z
author: work_item_pm

## Current Repo State

`BANDIT-097` is the active formed and formation-approved PRD-005.4 slice for
Operator Command Adapters. `BANDIT-096` is the last closed work item and has
landing action evidence, retrospective evidence, improvement disposition,
synchronized routing/status files, and no remaining open bootstrap gap.

`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
`node ./bin/bandit.mjs cockpit status --json`, and
`node ./bin/bandit.mjs session-context current --json` all identify
`BANDIT-097` as the active work item and name Work Item PM plan-mode
orchestration as the next action before RED evidence. Required operator input
is `none_required` for the current action.

This plan is advisory orchestration evidence only. It does not replace the
approved brief, coordination log, RED evidence, implementation evidence,
review evidence, landing evidence, retrospective evidence, roadmap,
current-context, or bootstrap-gap authority.

## Stage Sequence

| Stage | Accountable role | Required transition | Notes |
| --- | --- | --- | --- |
| Plan Mode | Work Item PM | `orchestration_plan_recorded` | This plan must be recorded before RED evidence. |
| Stage 2 RED | Test Writer | `red_recorded` | Write behavior tests and RED evidence for create-adapter delegation/refusal, execute-adapter delegation/refusal, no Stage 2 artifacts from create, no new Work Item from execute, plan-mode gate reporting, Local Qwen route refusal, concise output, command separation, and non-canonical adapter surfaces. |
| Stage 3 Implementation | Implementation Writer | `implementation_recorded` | Implement only the minimal command adapter modules, CLI routing, output rendering, and refusal mapping needed to satisfy RED tests. If Codex authors RED, route Stage 3 to Claude first, with MiniMax-M3 fallback only after auth failure or the required 20-minute timeout. |
| Stage 4 Review | Reviewers / Codex PM | `review_recorded` | Run CodeRabbit or honest timeout/refusal evidence, Local Qwen through the authorized MLX route, aggregate review evidence, review-subject hash, and applicable risk/supply-chain gates. |
| Stage 5 Landing | Landing Agent | `landing_verdict_recorded`, then `landed` | Write landing verdict, ensure source/evidence commit and refreshed source-head/hash evidence, run land-check, then local-record landing. Product UAT is not applicable unless implementation adds a user-facing cockpit/browser surface beyond CLI operator command adapters. |
| Stage 6 Closeout | Closeout Agent | `closed` | Record retrospective, improvement/no-action disposition, synchronized routing/status files, coordination validation, Bandit validation, cockpit/session-context agreement, and diff hygiene. |

## Required Evidence

| Stage | Required artifact or command evidence |
| --- | --- |
| Plan Mode | `docs/work/BANDIT-097/orchestration-plan.md` and `docs/work/BANDIT-097/coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | `docs/work/BANDIT-097/red-evidence.md`, focused RED tests, acceptance mapping, model-family separation statement, and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | Source changes limited to command adapter modules, CLI routing, output rendering, refusal mapping, and controller delegation surfaces as needed; `docs/work/BANDIT-097/stage3-dispatch.md`; `docs/work/BANDIT-097/writer-report.md`; `docs/work/BANDIT-097/implementation-evidence.md`; `docs/work/BANDIT-097/stage3-pm-acceptance.md`; passing focused tests or recorded bootstrap gap; and `implementation_recorded`. |
| Stage 4 | `docs/work/BANDIT-097/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-097/local-qwen-review.md`, `docs/work/BANDIT-097/review-evidence.md`, review-subject hash, finding dispositions if needed, risk-classification/supply-chain evidence when applicable, and `review_recorded`. |
| Stage 5 | `docs/work/BANDIT-097/landing-verdict.md`, `node ./bin/bandit.mjs land-check BANDIT-097`, refreshed review-subject/source-head evidence after the source/evidence commit, `docs/work/BANDIT-097/landing-action.md`, and `landed`. |
| Stage 6 | `docs/work/BANDIT-097/retrospective.md`, `docs/work/BANDIT-097/improvement-disposition.md`, synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `.bandit/work-intake-ledger.json` if state changes, and `closed`. |

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
policy acceptance criteria for `BANDIT-097`.

Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2
RED tests, Stage 3 implementation routes to Claude or another non-Codex model
family. During bootstrap, Claude is the default Stage 3 Writer path. Give
Claude the required 20-minute work window before fallback unless
authentication fails immediately. If Claude times out or fails after that
window, use MiniMax-M3 through headless `pi` as fallback and record the route.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-097
node ./bin/bandit.mjs coordination validate BANDIT-097
node --test test/bandit-work-command-adapters.test.mjs
node --test test/work-create-controller.test.mjs
node --test test/work-execute-controller.test.mjs
node --test test/stage-route-registry.test.mjs
node --test test/role-input-packets.test.mjs
node --test test/provider-blocker-evidence.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs review-subject-hash BANDIT-097
npm run bandit -- coderabbit-review pre-pr BANDIT-097 --base origin/main
npm run bandit -- qwen-review BANDIT-097
node ./bin/bandit.mjs land-check BANDIT-097
node ./bin/bandit.mjs land BANDIT-097 --action local-record
git diff --check
```

Run focused adapter, create-controller, execute-controller, route-registry,
role-packet, and provider-evidence tests first during Stage 2/3. Run full
`npm test` before landing because this slice touches CLI routing, validation,
operator command surfaces, controller delegation, reviewer route enforcement,
coordination, and derived status surfaces.

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
authority, Trust Verifier cutover policy, old-gate replacement or wrapping,
product or UAT direction changes, business tradeoffs, explicit cost/risk
posture, paid/live reviewer routing, command names beyond the accepted PRD, or
another policy/product decision repo artifacts cannot answer.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-097` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED tests to acceptance criteria.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- Implementation starts from an unformed work item or skips
  `formation_approved`.
- Stage 2 starts before Work Item PM plan-mode orchestration is recorded.
- The create adapter writes Stage 2 or later artifacts, allocates Work Items
  outside the create controller, or approves formation outside Repo PM gates.
- The execute adapter creates a new Work Item, runs without
  `formation_approved`, or skips the plan-mode gate.
- Adapter output, slash-command text, prompt contracts, cockpit affordances,
  session-context packets, Work Intake Ledger entries, PRDs, specs, or Role
  Input Packets become canonical workflow authority.
- Local Qwen evidence uses direct `qwen`, Ollama, or another ad hoc reviewer
  route.
- CodeRabbit returns actionable findings that are not repaired or dispositioned.
- Local Qwen is unavailable through the authorized MLX adapter route.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, review-subject hash, land-check,
  coordination validation, Bandit validation, typecheck, tests,
  cockpit/session-context agreement, or diff hygiene fails.
- Codex PM guesses on product, UAT, business, policy, explicit cost/risk, or
  genuinely ambiguous scope instead of recording operator input required.

## Forbidden Actions

Do not implement a new workflow state machine, scheduler, claim system, Work
Intake Ledger priority engine, local API, State Index, hosted service, live
polling loop, cockpit action UI, browser-owned workflow authority, public
`bandit context <stage>` command, Trust Verifier cutover, old-gate replacement
or wrapping, landing-autonomy expansion, paid/live reviewer or model routing,
public benchmark publication, merge, push, deploy, credential handling,
external repo mutation, installed-copy update behavior, PR/CI/CD
implementation, scheduler behavior, claim/worktree lifecycle behavior,
guarded browser actions, V0 Closeout Claude Code A/B Product-Value Trial
implementation, dependency changes, package-script changes, CI/release
workflow changes, or unrelated Phase 8 work.

Do not make `.bandit/work-intake-ledger.json`, route registry output, role
input packets, prompt contracts, slash-command text, cockpit/session-context
output, PRD files, specs, cache state, report output, or generated JSON
canonical workflow authority. `ROADMAP.md`, `CURRENT_CONTEXT.md`, work-item
artifacts, coordination logs, and formation/review evidence remain the
authority surfaces.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-097/brief.md`, `docs/work/BANDIT-097/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | pass | `git status --short --branch` reported `## main...origin/main [ahead 1]` with no dirty tracked or untracked entries. |
| Routing surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` all point to `BANDIT-097` Work Item PM plan-mode orchestration before RED evidence. |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-096/landing-action.md`, `docs/work/BANDIT-096/retrospective.md`, `docs/work/BANDIT-096/improvement-disposition.md`, and the last closed context status are recorded. |
| Operator-input status is explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `docs/work/BANDIT-097/brief.md` record `none_required` for the current action and list future operator-owned gates. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-097/brief.md` defines source authority, bounded scope, out of scope, acceptance criteria, verification plan, clean-code evidence, bootstrap-gap/no-gap disposition, expected files, role boundaries, operator-input status, and forbidden actions. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-097/qwen-formation-review.md` records verdict `pass`, no findings, and the authorized `.bandit/reviewers/local-qwen.json` / `node bin/omlx-chat-completions.mjs` route. |
| CodeRabbit formation review exists and is not blocking | pass | `docs/work/BANDIT-097/coderabbit-formation-review.md` records terminal CodeRabbit completion with `findings: 0`. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-097/formation-review.md` aggregate verdict is `pass`, with no findings requiring repair. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-097/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-097/brief.md` and this plan reserve Stage 2 tests, fixtures, RED evidence, and acceptance mappings for Test Writer. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Stage 2 must produce `docs/work/BANDIT-097/red-evidence.md` mapping focused tests to create-adapter delegation/refusal, execute-adapter delegation/refusal, no Stage 2 artifacts from create, no new Work Item from execute, plan-mode gate reporting, Local Qwen route refusal, concise output, command separation, and non-canonical adapter surfaces. |
| Stage 3 Writer has zero test-edit authority | pass | Permanent Test Ownership Boundary is recorded in `docs/work/BANDIT-097/brief.md` and this plan. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Bootstrap Model-Family Separation is recorded in `docs/work/BANDIT-097/brief.md` and this plan. |
| `red_recorded` is required before implementation | pass | Stage 2 cannot dispatch implementation until this plan is recorded and `red_recorded` is appended to `docs/work/BANDIT-097/coordination-log.jsonl`. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Stage 3 is limited to adapter modules, CLI routing, output rendering, refusal mapping, and controller delegation source delivery plus evidence. |
| No Writer test-surface edits | pass | Stage 3 Writer may not edit tests, test helpers, fixtures, RED evidence, or acceptance mappings. |
| Focused tests pass or bootstrap gap is recorded | pass | Stage 3 must run focused adapter, create-controller, execute-controller, route-registry, role-packet, and provider-evidence tests plus broader tests required by the brief before PM acceptance. |
| `implementation-evidence.md` and Writer report exist | pass | Stage 3 required evidence includes `docs/work/BANDIT-097/implementation-evidence.md` and `docs/work/BANDIT-097/writer-report.md`. |
| PM acceptance verifies spec alignment and clean-code posture | pass | `docs/work/BANDIT-097/stage3-pm-acceptance.md` must check acceptance criteria, source-of-truth boundaries, role boundaries, and `CLEAN_CODE.md`. |
| Claude 20-minute rule and fallback routing are explicit | pass | This plan records Claude as first Stage 3 route after Codex-authored RED, with MiniMax-M3 fallback after auth failure or the required timeout. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Stage 4 must produce `docs/work/BANDIT-097/coderabbit-review.md` or honest timeout/refusal evidence after allowing the required 10-minute window. |
| Local Qwen review | pass | Stage 4 Local Qwen must use only `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`; if unavailable, stop and ask the operator for help. |
| Escalated review if policy smells require it | pass | Escalation follows smell policy; use MiniMax-M3 unless MiniMax did Stage 3, then try Claude and fallback to Codex GPT-5.5 xhigh. |
| Risk classification | pass | Stage 4/5 must record applicable layered risk classification before landing. |
| Supply-chain gate when applicable | pass | Stage 4/5 must record supply-chain gate evidence if touched surfaces require it. |
| Every finding repaired or dispositioned | pass | All CodeRabbit, Qwen, and escalated findings must be repaired or dispositioned before aggregate review evidence. |
| Aggregate review evidence current for review subject | pass | Stage 4 must record `review_subject_hash` in aggregate review evidence and refresh after source/policy changes. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Stage 5 must produce `docs/work/BANDIT-097/landing-verdict.md`. |
| Feature UAT handled when applicable | not_applicable | Product UAT is not applicable unless implementation adds a user-facing cockpit/browser surface beyond CLI operator command adapters. |
| `land-check` passes | pass | Stage 5 must run `node ./bin/bandit.mjs land-check BANDIT-097` and repair or block on failures. |
| Clean source/evidence commit, source-head/hash refresh, then landing action | pass | Local-record landing expects a clean source/evidence commit first, refreshed source-head/hash evidence, and then `node ./bin/bandit.mjs land BANDIT-097 --action local-record`. |
| Landing action records commit SHA or merge evidence | pass | `docs/work/BANDIT-097/landing-action.md` must record the local landing commit SHA before closeout. |
| No next Work Item starts before landing action exists | pass | V0 trial and unrelated Phase 8 work remain deferred until `BANDIT-097` landing action and closeout evidence exist. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Stage 6 must produce `docs/work/BANDIT-097/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include the Stage 6 mining checklist required by `docs/verification/STAGE_RUBRICS.md`. |
| Every lesson has durable disposition | pass | Stage 6 must produce `docs/work/BANDIT-097/improvement-disposition.md` with improvement/no-action disposition. |
| Routing/status files updated if state changed | pass | Closeout must sync `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `.bandit/work-intake-ledger.json` if state changes. |
| Cockpit status and session-context agree | pass | Final closeout must run both derived-status commands and keep the last closed work item as active derived-status anchor with the `The current stage is Stage ...` sentence in `CURRENT_CONTEXT.md`. |
| `validate` and `git diff --check` pass | pass | Final verification must include `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-097`, and `git diff --check`; Stage 6 final validation should not rerun land-check after an evidence-only closeout commit. |
