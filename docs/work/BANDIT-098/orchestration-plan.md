# BANDIT-098 Orchestration Plan

contract_version: 1
work_item: BANDIT-098
work_type: bootstrap_gap_chore
current_coordination_state: formation_approved
created_at: 2026-06-11T19:15:00-04:00
author: work_item_pm

## Current Repo State

`BANDIT-098` is the active formed and formation-approved bootstrap-gap chore
for Public Consumer Install Quickstart And Governance Scaffold.
`BANDIT-097` is the last closed work item and has landing action evidence,
retrospective evidence, improvement disposition, closed coordination evidence,
and synchronized routing/status files.

`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
`node ./bin/bandit.mjs cockpit status --json`, and
`node ./bin/bandit.mjs session-context current --json` all identify
`BANDIT-098` as the active work item and name Work Item PM plan-mode
orchestration as the next action before RED evidence. Required operator input
is `none_required` for the current action.

The worktree is dirty at plan time. The dirty state is classified as current
`BANDIT-098` formation/source-material state: Stage 1 work-item artifacts,
the active bootstrap-gap ledger entry, public distribution policy/docs changes,
README/package metadata updates, update-channel source changes, and existing
test edits. These edits are not accepted as Stage 2 RED evidence or Stage 3
implementation evidence by this plan. Stage 2 must explicitly inspect,
replace, or adopt test-surface changes as Test Writer-owned RED evidence before
implementation. Stage 3 must treat any pre-existing source changes as
unverified working-tree material until implementation evidence and PM
acceptance record them.

This plan is advisory orchestration evidence only. It does not replace the
approved brief, coordination log, RED evidence, implementation evidence,
review evidence, landing evidence, retrospective evidence, roadmap,
current-context, or bootstrap-gap authority.

## Stage Sequence

| Stage | Accountable role | Required transition | Notes |
| --- | --- | --- | --- |
| Plan Mode | Work Item PM | `orchestration_plan_recorded` | This plan must be recorded before RED evidence. |
| Stage 2 RED | Test Writer | `red_recorded` | Produce RED evidence for fresh consumer install/onboarding failures, starter governance scaffold creation, no-overwrite behavior, npm project-boundary guidance, cockpit/session-context day-1 outputs, package allow-list, and README command safety. |
| Stage 3 Implementation | Implementation Writer | `implementation_recorded` | Deliver only the minimal README, package metadata, init/onboarding scaffold, starter template, validation/session/cockpit, package allow-list, and command guidance changes needed to satisfy RED evidence. If Codex authors RED, route Stage 3 to Claude first, with MiniMax-M3 fallback only after auth failure or the required 20-minute timeout. |
| Stage 4 Review | Reviewers / Codex PM | `review_recorded` | Run CodeRabbit or honest timeout/refusal evidence, Local Qwen through the authorized MLX route, aggregate review evidence, review-subject hash, risk classification, and supply-chain gate evidence. |
| Stage 5 Landing | Landing Agent | `landing_verdict_recorded`, then `landed` | Write landing verdict, create a clean source/evidence commit, refresh source-head/hash evidence, run land-check, then local-record landing. Feature UAT is not applicable unless implementation adds an operator-facing cockpit/browser workflow surface beyond CLI/docs onboarding. |
| Stage 6 Closeout | Closeout Agent | `closed` | Record retrospective, improvement/no-action disposition, resolve or disposition the active bootstrap gap only after landing evidence, synchronize routing/status files, and run final validation without rerunning land-check after an evidence-only closeout commit. |

## Required Evidence

| Stage | Required artifact or command evidence |
| --- | --- |
| Plan Mode | `docs/work/BANDIT-098/orchestration-plan.md` and `docs/work/BANDIT-098/coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | `docs/work/BANDIT-098/red-evidence.md`, focused RED tests or verification scripts, acceptance mapping, dirty test-surface adoption/replacement note, model-family separation statement, and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | Source changes limited to README/install docs, package metadata/allow-list, init/onboarding scaffold behavior, starter governance templates, validation/session/cockpit day-1 behavior, and update-channel wording/policy compatibility as needed; `docs/work/BANDIT-098/stage3-dispatch.md`; `docs/work/BANDIT-098/writer-report.md`; `docs/work/BANDIT-098/implementation-evidence.md`; `docs/work/BANDIT-098/stage3-pm-acceptance.md`; passing focused tests or recorded bootstrap gap; and `implementation_recorded`. |
| Stage 4 | `docs/work/BANDIT-098/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-098/local-qwen-review.md`, finding dispositions if needed, `.bandit/policy/risk-classifications/BANDIT-098-risk-classification.json`, `.bandit/policy/supply-chain-gates/BANDIT-098-supply-chain-gate.json`, `docs/work/BANDIT-098/review-evidence.md`, review-subject hash, and `review_recorded`. |
| Stage 5 | `docs/work/BANDIT-098/landing-verdict.md`, clean source/evidence commit, refreshed review-subject/source-head evidence, `node ./bin/bandit.mjs land-check BANDIT-098`, `docs/work/BANDIT-098/landing-action.md`, and `landed`. |
| Stage 6 | `docs/work/BANDIT-098/retrospective.md`, `docs/work/BANDIT-098/improvement-disposition.md`, resolved/dispositioned `BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART` ledger state, synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, final coordination validation, Bandit validation, cockpit/session-context agreement, and diff hygiene. |

## Role Boundaries

Repo PM owns Stage 1 formation and has already stopped at
`formation_approved`. Work Item PM owns this plan and stage routing after
formation approval. Test Writer owns Stage 2 tests, fixtures, RED evidence,
acceptance mappings, and the decision to adopt or replace any pre-existing
test-surface edits. Implementation Writer owns Stage 3 source/chore delivery
and implementation evidence only. Reviewers own Stage 4 review outputs.
Landing Agent owns Stage 5 landing verdict and landing action. Closeout Agent
owns Stage 6 retrospective and improvement/no-action disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-098`.

Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2
RED tests, Stage 3 implementation routes to Claude or another non-Codex model
family. During bootstrap, Claude is the default Stage 3 Writer path. Give
Claude the required 20-minute work window before fallback unless
authentication fails immediately. If Claude times out or fails after that
window, use MiniMax-M3 through headless `pi` as fallback and record the route.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-098
node ./bin/bandit.mjs coordination validate BANDIT-098
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
node --test test/private-install-update-channel.test.mjs
node --test test/update-channel.test.mjs
node --test test/focused-session-context.test.mjs
node --test test/cockpit-status.test.mjs
npm pack --dry-run --json
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs review-subject-hash BANDIT-098
npm run bandit -- coderabbit-review pre-pr BANDIT-098 --base origin/main
npm run bandit -- qwen-review BANDIT-098
node ./bin/bandit.mjs land-check BANDIT-098
node ./bin/bandit.mjs land BANDIT-098 --action local-record
git diff --check
```

Run focused init/onboarding, public-consumer quickstart, package allow-list,
update-channel, focused-session-context, and cockpit-status tests before full
`npm test`. Run full tests before landing because this chore touches package
metadata, README command surfaces, init/onboarding, templates, validation,
cockpit status, session-context, and package distribution policy.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current recorded action.

Known non-blocking formation context: CodeRabbit formation review timed out
after the full required window and is recorded as `bootstrap_gap` replacement
evidence in `docs/work/BANDIT-098/coderabbit-formation-review.md`. Its emitted
findings were repaired or rejected with evidence, and no CodeRabbit pass is
claimed.

Known dirty-state constraint: source and test files already have uncommitted
changes related to the active gap. This is not authority to skip RED evidence,
implementation evidence, PM acceptance, review, or landing. If Stage 2 cannot
cleanly distinguish Test Writer-owned RED evidence from pre-existing edits, or
if Stage 3 cannot cleanly account for pre-existing source changes, halt and
record a blocker instead of laundering those edits through later stages.

Halt for operator input if future evidence would approve expanded landing
autonomy, Notify-And-Revert or Auto-Landing Scope for a new boundary cell,
public npm publish automation, publish credential handling, paid registry
setup, hosted update services, telemetry, automatic self-update, external repo
mutation outside explicit local onboarding files, installed global skill
mutation, automation prompt mutation, merge/push/deploy authority, Trust
Verifier cutover policy, Trust Goal selection, old-gate replacement or
wrapping, product or UAT direction changes, business tradeoffs, explicit
cost/risk posture, paid/live reviewer routing, or another policy/product
decision repo artifacts cannot answer.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-098` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED tests or verification scripts to acceptance criteria.
- Stage 2 cannot classify or replace pre-existing test-surface edits.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- Stage 3 cannot account for pre-existing source changes in implementation
  evidence and PM acceptance.
- Implementation starts from an unformed work item or skips
  `formation_approved`, plan-mode orchestration, or `red_recorded`.
- The onboarding path overwrites user-owned consumer governance files without
  explicit refusal or preservation behavior.
- Starter governance artifacts import Bandit's active work history, reviewer
  evidence, internal roadmap queue, or private local assumptions.
- README command examples present unavailable npm publish state, unsafe
  placeholders, or bare `bandit` commands as copy-pasteable consumer commands
  without documented prerequisites.
- Package allow-list includes active `docs/work/**` history, tests, local
  reports, private compatibility aliases, or repo-local workflow state not
  needed for consumer onboarding.
- Local Qwen evidence uses direct `qwen`, Ollama, or another ad hoc reviewer
  route.
- Local Qwen is unavailable through the authorized MLX adapter route.
- CodeRabbit returns actionable findings that are not repaired or dispositioned.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, review-subject hash, land-check,
  coordination validation, Bandit validation, typecheck, tests, package dry-run,
  cockpit/session-context agreement, or diff hygiene fails.
- Codex PM guesses on product, UAT, business, policy, explicit cost/risk, or
  genuinely ambiguous scope instead of recording operator input required.

## Forbidden Actions

Do not add public npm publish automation, publish credential handling, paid
registry setup, hosted update service, telemetry, automatic self-update,
external repo mutation outside explicit local onboarding files, installed
global skill mutation, automation prompt mutation, merge/push/deploy authority,
Trust Verifier cutover, old-gate replacement or wrapping, local API, State
Index, guarded browser action execution, unrelated Phase 8 product work,
claim/worktree lifecycle behavior, scheduler execution, PR/CI/CD
implementation, V0 Closeout Claude Code A/B Product-Value Trial
implementation, public benchmark publication, paid/live reviewer routing, or
runtime/harness/Pi/Aperture work.

Do not make package metadata, starter templates, update-channel files, README
examples, cockpit/session-context output, specs, audit reports, or generated
JSON canonical workflow authority. `ROADMAP.md`, `CURRENT_CONTEXT.md`,
work-item artifacts, coordination logs, formation/review evidence, and
`.bandit/` policy/state artifacts remain the authority surfaces.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-098/brief.md`, `docs/work/BANDIT-098/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | non_blocking | `git status --short --branch` reported tracked and untracked `BANDIT-098` formation/source-material changes. This plan classifies them as non-authoritative until RED, implementation evidence, PM acceptance, review, and landing account for them. |
| Routing surfaces agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `cockpit status --json`, and `session-context current --json` all point to `BANDIT-098` Work Item PM plan-mode orchestration before RED evidence. |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-097/landing-action.md`, `docs/work/BANDIT-097/retrospective.md`, `docs/work/BANDIT-097/improvement-disposition.md`, and closed coordination evidence are recorded. |
| Operator-input status is explicit | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and `docs/work/BANDIT-098/brief.md` record `none_required` for the current action and list future operator-owned gates. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-098/brief.md` defines source authority, bounded scope, out of scope, acceptance criteria, verification plan, clean-code evidence, active bootstrap-gap linkage, expected files, role boundaries, operator-input status, and forbidden actions. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-098/qwen-formation-review.md` records verdict `pass`, no findings, and the authorized `.bandit/reviewers/local-qwen.json` / `node bin/omlx-chat-completions.mjs` route. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-098/coderabbit-formation-review.md` records provider timeout after `timeout 600 coderabbit review --agent --type uncommitted`, exit `124`, with emitted findings repaired or rejected and no CodeRabbit pass claim. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-098/formation-review.md` aggregate verdict is `pass`, with resolved formation disposition. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-098/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-098/brief.md` and this plan reserve Stage 2 tests, fixtures, RED evidence, acceptance mappings, and pre-existing test-edit adoption/replacement decisions for Test Writer. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Stage 2 must produce `docs/work/BANDIT-098/red-evidence.md` mapping focused tests or verification scripts to public quickstart, npm project boundary, local CLI invocation, starter governance scaffold, no-overwrite behavior, day-1 validate/cockpit/session outcomes, package allow-list, and README command safety acceptance criteria. |
| Stage 3 Writer has zero test-edit authority | pass | Permanent Test Ownership Boundary is recorded in `docs/work/BANDIT-098/brief.md` and this plan. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Bootstrap Model-Family Separation is recorded in `docs/work/BANDIT-098/brief.md` and this plan. |
| `red_recorded` is required before implementation | pass | Stage 2 cannot dispatch implementation until this plan is recorded and `red_recorded` is appended to `docs/work/BANDIT-098/coordination-log.jsonl`. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Stage 3 is limited to README/install docs, package metadata/allow-list, init/onboarding scaffold behavior, starter governance templates, validation/session/cockpit day-1 behavior, and update-channel wording/policy compatibility as needed. |
| No Writer test-surface edits | pass | Stage 3 Writer may not edit tests, test helpers, fixtures, RED evidence, or acceptance mappings. |
| Focused tests pass or bootstrap gap is recorded | pass | Stage 3 must run focused init/onboarding, public-consumer quickstart, package allow-list, update-channel, focused-session-context, and cockpit-status tests plus broader tests required by the brief before PM acceptance. |
| `implementation-evidence.md` and Writer report exist | pass | Stage 3 required evidence includes `docs/work/BANDIT-098/implementation-evidence.md` and `docs/work/BANDIT-098/writer-report.md`. |
| PM acceptance verifies spec alignment and clean-code posture | pass | `docs/work/BANDIT-098/stage3-pm-acceptance.md` must check acceptance criteria, source-of-truth boundaries, role boundaries, starter-governance neutrality, no-overwrite behavior, and `CLEAN_CODE.md`. |
| Claude 20-minute rule and fallback routing are explicit | pass | This plan records Claude as first Stage 3 route after Codex-authored RED, with MiniMax-M3 fallback after auth failure or the required timeout. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Stage 4 must produce `docs/work/BANDIT-098/coderabbit-review.md` or honest timeout/refusal evidence after allowing the required 10-minute window. |
| Local Qwen review | pass | Stage 4 Local Qwen must use only `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`; if unavailable, stop and ask the operator for help. |
| Escalated review if policy smells require it | pass | Escalation follows smell policy; use MiniMax-M3 unless MiniMax did Stage 3, then try Claude and fallback to Codex GPT-5.5 xhigh. |
| Risk classification | pass | Stage 4/5 must record applicable layered risk classification because the chore touches package distribution, install docs, CLI init/onboarding behavior, and governance files. |
| Supply-chain gate when applicable | pass | Stage 4/5 must record supply-chain gate evidence because package metadata, package allow-list, install docs, local executable entrypoint, and onboarding templates are supply-chain-sensitive surfaces. |
| Every finding repaired or dispositioned | pass | All CodeRabbit, Qwen, and escalated findings must be repaired or dispositioned before aggregate review evidence. |
| Aggregate review evidence current for review subject | pass | Stage 4 must record `review_subject_hash` in aggregate review evidence and refresh after source/policy changes. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Stage 5 must produce `docs/work/BANDIT-098/landing-verdict.md`. |
| Feature UAT handled when applicable | not_applicable | This is a bootstrap-gap chore for install/onboarding docs and CLI scaffolding. Product UAT remains not applicable unless implementation adds a new user-facing cockpit/browser workflow surface. |
| `land-check` passes | pass | Stage 5 must run `node ./bin/bandit.mjs land-check BANDIT-098` and repair or block on failures. |
| Clean source/evidence commit, source-head/hash refresh, then landing action | pass | Local-record landing expects a clean source/evidence commit first, refreshed source-head/hash evidence, and then `node ./bin/bandit.mjs land BANDIT-098 --action local-record`. |
| Landing action records commit SHA or merge evidence | pass | `docs/work/BANDIT-098/landing-action.md` must record the local landing commit SHA before closeout. |
| No next Work Item starts before landing action exists | pass | V0 trial and unrelated Phase 8 work remain deferred until `BANDIT-098` landing action and closeout evidence exist or the chore is explicitly blocked/dispositioned. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Stage 6 must produce `docs/work/BANDIT-098/retrospective.md`. |
| Structured improvement mining complete | pass | Retrospective must include the Stage 6 mining checklist required by `docs/verification/STAGE_RUBRICS.md`. |
| Every lesson has durable disposition | pass | Stage 6 must produce `docs/work/BANDIT-098/improvement-disposition.md` with improvement/no-action disposition. |
| Routing/status files updated if state changed | pass | Closeout must sync `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `.bandit/bootstrap-gaps.json` after landing and gap disposition. |
| Cockpit status and session-context agree | pass | Final closeout must run both derived-status commands and keep the last closed work item as active derived-status anchor with the `The current stage is Stage ...` sentence in `CURRENT_CONTEXT.md`. |
| `validate` and `git diff --check` pass | pass | Final verification must include `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-098`, and `git diff --check`; Stage 6 final validation should not rerun land-check after an evidence-only closeout commit. |
