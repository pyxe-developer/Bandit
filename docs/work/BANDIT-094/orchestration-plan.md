# BANDIT-094 Orchestration Plan

contract_version: 1
work_item: BANDIT-094
work_type: slice
current_coordination_state: formation_approved
created_at: 2026-06-10T21:46:34Z
author: work_item_pm

## Current Repo State

`BANDIT-094` is the active formed and formation-approved work item for
`BANDIT-PRD-005.2` - Repo PM Create Controller And Prompt Contract. The current
repo routing files, derived cockpit status, session-context packet, and
coordination log agree that Work Item PM must record plan-mode orchestration
before Stage 2 RED evidence.

`BANDIT-093` is the last closed work item. Its landing action, retrospective,
improvement disposition, roadmap, current-context, status, and coordination
evidence are present. No open bootstrap gap blocks `BANDIT-094`.

`BANDIT-094` is bounded to a Bandit-native Repo PM prompt contract and
create-controller behavior that resolves the current or next
roadmap/current-context-authorized target, creates or repairs only Stage 1
formation prerequisites from explicit source material, approves formation only
with supported formation-review evidence, and stops before Stage 2. This plan
does not authorize PRD-005.3 execute-controller work, role input packet
assembly, provider/blocker recorder work, PRD-005.4 slash-command adapters,
Trust Verifier cutover, cockpit action execution, local API, State Index,
hosted services, telemetry, paid routing, public benchmark publication, merge,
push, deploy, dependency changes, package-script changes, or unrelated Phase 8
work.

## Stage Sequence

| Stage | Accountable role | Required transition | Notes |
| --- | --- | --- | --- |
| Plan Mode | Work Item PM | `orchestration_plan_recorded` | This plan must be recorded before RED evidence. |
| Stage 2 RED | Test Writer | `red_recorded` | Write failing tests for Repo PM prompt-contract validation, create-controller target resolution from closed current work to next unformed work, explicit-source creation, missing-source refusal, idempotent already-formed behavior, formation-review metadata enforcement, operator-input refusal, Local Qwen route refusal, and no Stage 2 artifact creation. |
| Stage 3 Implementation | Implementation Writer | `implementation_recorded` | Implement only the smallest prompt contract, prompt validation, create-controller state/command behavior, target-resolver handoff, diagnostics, and validation wiring needed to satisfy RED tests. If Codex authors RED tests, route implementation to Claude first, then MiniMax-M3 fallback after the required timeout. |
| Stage 4 Review | Reviewers / Codex PM | `review_recorded` | Run CodeRabbit or honest timeout/refusal evidence, Local Qwen through the authorized MLX route, aggregate review, review-subject hash, and applicable risk/supply-chain/input-quarantine checks. |
| Stage 5 Landing | Landing Agent | `landing_verdict_recorded`, then `landed` | Write landing verdict, run land-check, and record local landing action only if gates pass. Product UAT is not applicable unless implementation changes an operator-facing product surface. |
| Stage 6 Closeout | Closeout Agent | `closed` | Record retrospective, improvement/no-action disposition, current context, roadmap, STATUS, coordination validation, Bandit validation, cockpit/session-context agreement, and diff hygiene. |

## Required Evidence

| Stage | Required artifact or command evidence |
| --- | --- |
| Plan Mode | `docs/work/BANDIT-094/orchestration-plan.md` and `docs/work/BANDIT-094/coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | `docs/work/BANDIT-094/red-evidence.md`, RED test files, acceptance mapping, and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | `docs/templates/repo-pm-formation-prompt.md`, `.bandit/policy/orchestrator-prompts.json`, `src/state/orchestrator-prompts.ts`, `src/state/work-create-controller.ts`, `src/commands/repo-pm.ts`, `src/commands/work-create-controller.ts`, `src/commands/validate.ts`, `src/cli.ts`, `docs/work/BANDIT-094/implementation-evidence.md`, `docs/work/BANDIT-094/writer-report.md`, PM acceptance evidence, and `implementation_recorded` as applicable to the accepted RED scope. |
| Stage 4 | `docs/work/BANDIT-094/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-094/local-qwen-review.md`, `docs/work/BANDIT-094/review-evidence.md`, review-subject hash, applicable risk/supply-chain/input-quarantine/operator-boundary evidence, and `review_recorded`. |
| Stage 5 | `docs/work/BANDIT-094/landing-verdict.md`, `node ./bin/bandit.mjs land-check BANDIT-094`, `docs/work/BANDIT-094/landing-action.md`, and `landed`. |
| Stage 6 | `docs/work/BANDIT-094/retrospective.md`, `docs/work/BANDIT-094/improvement-disposition.md`, synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, and `closed`. |

## Role Boundaries

Repo PM owns Stage 1 formation and does not own Stage 2 RED, implementation,
review, landing, or closeout artifacts. Work Item PM owns this plan and stage
orchestration after `formation_approved`. Test Writer owns Stage 2 tests,
fixtures, RED evidence, and acceptance mappings. Implementation Writer owns
Stage 3 source changes and implementation evidence only. Reviewers own Stage 4
review outputs. Landing Agent owns Stage 5 landing verdict and landing action.
Closeout Agent owns Stage 6 retrospective and improvement/no-action
disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-094`.

Bootstrap Model-Family Separation: if Codex authors Stage 2 RED tests, Stage 3
implementation routes to Claude or another non-Codex model family unless an
operator-approved policy exception is recorded. Give Claude the required
20-minute work window before fallback unless authentication fails immediately.
If Claude times out or fails after that window, use MiniMax-M3 through headless
`pi` as the fallback.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-094
node ./bin/bandit.mjs coordination validate BANDIT-094
node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs review-subject-hash BANDIT-094
node ./bin/bandit.mjs land-check BANDIT-094
node ./bin/bandit.mjs land BANDIT-094 --action local-record
git diff --check
```

Run focused prompt-contract and create-controller tests first during Stage 2/3.
Full `npm test` is expected before landing because this slice touches prompt
policy, roadmap/current-context target resolution handoff, validation wiring,
formation gate behavior, coordination evidence, and CLI command behavior.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current action.

Halt for operator input if future evidence would approve `/bandit-work-create`
or `/bandit-work-execute` operator-facing behavior beyond the accepted PRD,
change product or UAT direction, approve paid/live reviewer or model routing,
approve hosted services, approve telemetry, approve merge/push/deploy
authority, approve Trust Verifier cutover, replace or wrap old gates, approve
external side effects, change policy, resolve business tradeoffs, or resolve
explicit cost/risk or genuinely ambiguous scope.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-094` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED tests to acceptance criteria.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- The prompt contract claims canonical workflow authority or weakens CLI,
  roadmap/current-context, work-item artifact, coordination-log, or formation
  review authority.
- The prompt contract leaks SeekWins paths, SeekWins policy, Linux-only
  reviewer assumptions, WI-00 rules, direct `qwen` CLI routing, or Ollama
  reviewer semantics into Bandit authority.
- The create controller silently chooses between conflicting `ROADMAP.md` and
  `CURRENT_CONTEXT.md` target text.
- The create controller treats `.bandit/work-intake-ledger.json`,
  prompt-contract text, cockpit/session-context output, slash-command text, or
  resolver output as primary workflow authority.
- The create controller invents product scope, scans WIL as a hidden scheduler,
  starts Stage 2, creates downstream evidence, or routes execution for closed
  work from stale historical wording.
- The create controller approves formation without supported
  `qwen-formation-review.md`, `coderabbit-formation-review.md`, and
  `formation-review.md` metadata.
- Codex PM guesses on product, UAT, business, policy, explicit cost/risk, or
  genuinely ambiguous scope instead of recording `operator_input_required`.
- Local Qwen is unavailable through the authorized MLX adapter route.
- CodeRabbit returns actionable findings that are not repaired or dispositioned.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, input-quarantine/operator-boundary
  evidence, review-subject hash, land-check, coordination validation, Bandit
  validation, typecheck, tests, cockpit/session-context agreement, or diff
  hygiene fails.

## Forbidden Actions

Do not implement PRD-005.3 Work Item PM execute-controller behavior, stage route
registry, role input packet assembler, provider/blocker evidence recorder,
PRD-005.4 `/bandit-work-create` or `/bandit-work-execute` slash-command
adapters, public `bandit context <stage>` workflow command, Trust Verifier
cutover, old-gate replacement or wrapping, cockpit action execution, local API,
State Index, paid routing, public benchmark publication, hosted services,
telemetry, credential handling, dependency changes, package-script changes,
CI/release workflow changes, merge, push, deploy, installed-copy update
behavior, PR/CI/CD implementation, scheduler behavior, claim/worktree lifecycle
behavior, guarded browser actions, V0 Closeout Claude Code A/B Product-Value
Trial implementation, or unrelated Phase 8 work.

Do not make prompt contracts, slash-command text, resolver output,
cockpit/session-context output, PRD files, specs, WIL entries, static previews,
cache state, report output, or generated JSON canonical workflow authority.
`ROADMAP.md`, `CURRENT_CONTEXT.md`, work-item artifacts, coordination logs, and
formation/review evidence remain the authority surfaces; prompt contracts and
resolver outputs are non-authoritative guidance or deterministic projections.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-094/brief.md`, `docs/work/BANDIT-094/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | pass | `git status --short --branch` reported `## main...origin/main [ahead 1]` and no dirty tracked or untracked worktree entries. |
| Routing surfaces agree | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `node ./bin/bandit.mjs cockpit status --json`, and `node ./bin/bandit.mjs session-context current --json` all point to Work Item PM plan-mode orchestration for `BANDIT-094` before RED evidence. |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-093/landing-action.md`, `docs/work/BANDIT-093/retrospective.md`, `docs/work/BANDIT-093/improvement-disposition.md`, roadmap/current-context/status evidence, and `docs/work/BANDIT-093/coordination-log.jsonl` closed evidence exist. |
| Operator-input status is explicit | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, and `docs/work/BANDIT-094/brief.md` record `none_required` for the current action and list future operator-owned gates. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-094/brief.md` defines goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, and forbidden actions. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-094/qwen-formation-review.md` verdict `pass` with no findings through the authorized `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs` route. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-094/coderabbit-formation-review.md` records `timeout 600 coderabbit review --agent --type uncommitted`, exit `124`, and honest provider-timeout replacement evidence with no CodeRabbit pass claimed. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-094/formation-review.md` aggregate verdict `pass` with resolved formation findings. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-094/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`; `node ./bin/bandit.mjs coordination validate BANDIT-094` is required after plan recording. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-094/brief.md` Role Boundary Evidence and this plan reserve Stage 2 tests, fixtures, RED evidence, and acceptance mappings for Test Writer. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Stage 2 must produce `docs/work/BANDIT-094/red-evidence.md` mapping tests for prompt-contract validation, create-controller target resolution, explicit-source creation/refusal, idempotency, formation-review metadata enforcement, operator-input refusal, Local Qwen route refusal, and no Stage 2 artifact creation to acceptance criteria. |
| Stage 3 Writer has zero test-edit authority | pass | Permanent Test Ownership Boundary is recorded in `docs/work/BANDIT-094/brief.md` and this plan. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Bootstrap Model-Family Separation is recorded in `docs/work/BANDIT-094/brief.md` and this plan; Stage 3 routes to Claude first, then MiniMax-M3 fallback if required. |
| `red_recorded` is required before implementation | pass | This plan must be recorded by `work-item-pm start`; Stage 2 must then record `red_recorded` in `docs/work/BANDIT-094/coordination-log.jsonl` before Stage 3 implementation begins. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-094/brief.md` and this plan limit Stage 3 to prompt-contract, create-controller source/command/validation implementation, and implementation evidence. |
| No Writer test-surface edits | pass | Permanent Test Ownership Boundary forbids Stage 3 edits to tests, test helpers, fixtures, RED evidence, and acceptance mappings. |
| Focused tests pass or bootstrap gap is recorded | pass | Stage 3 must run focused prompt-contract and create-controller tests first, then typecheck/full tests as required by the brief because shared prompt policy, roadmap target resolution, validation, coordination, and CLI behavior are in scope. |
| `implementation-evidence.md` and Writer report exist | pass | Stage 3 required evidence includes `docs/work/BANDIT-094/implementation-evidence.md` and `docs/work/BANDIT-094/writer-report.md`; implementation cannot advance without them. |
| PM acceptance verifies spec alignment and clean-code posture | pass | Stage 3 PM acceptance must check approved scope, role boundaries, acceptance criteria, and `CLEAN_CODE.md` posture before Stage 4. |
| Claude 20-minute rule and fallback routing are explicit | pass | This plan records Claude as first Stage 3 route after Codex-authored RED, with a required 20-minute window before MiniMax-M3 fallback unless authentication fails immediately. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Stage 4 must produce `docs/work/BANDIT-094/coderabbit-review.md` or honest timeout/refusal evidence and must not interrupt CodeRabbit before the required 10-minute window. |
| Local Qwen review | pass | Stage 4 Local Qwen must use only `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`; if unavailable, stop and ask the operator for help. |
| Escalated review if policy smells require it | pass | Escalation must follow smell policy; use MiniMax-M3 unless MiniMax completed Stage 3, then try Claude and fallback to Codex GPT-5.5 xhigh. |
| Risk classification | pass | Stage 4/5 must record applicable risk classification evidence before landing. |
| Supply-chain gate when applicable | pass | Stage 4/5 must record applicable supply-chain evidence before landing. |
| Findings repaired or dispositioned | pass | CodeRabbit/Qwen/escalated findings must be repaired or dispositioned before aggregate review evidence. |
| Aggregate review evidence current for review subject | pass | Stage 4 must record `review_subject_hash` in `docs/work/BANDIT-094/review-evidence.md` and refresh if source or policy evidence changes. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Stage 5 must produce `docs/work/BANDIT-094/landing-verdict.md` before land-check/local-record landing. |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-094/brief.md` says product UAT is not applicable unless implementation changes an operator-facing product surface. |
| `land-check` passes | pass | Stage 5 must run `node ./bin/bandit.mjs land-check BANDIT-094` and repair or block on failures. |
| Clean source/evidence commit, source-head/hash refresh, then landing action | pass | Local-record landing expects a clean source/evidence commit first, refreshed source-head/hash evidence, and then `node ./bin/bandit.mjs land BANDIT-094 --action local-record`. |
| `landing-action.md` records commit SHA or merge evidence | pass | Stage 5 must produce `docs/work/BANDIT-094/landing-action.md` with local-record commit SHA before Stage 6 closeout can complete. |
| No next Work Item starts before landing action exists | pass | Slice boundary rules in `AGENTS.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, and this plan forbid PRD-005.3 or unrelated next work before landing action evidence. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Stage 6 must produce `docs/work/BANDIT-094/retrospective.md`. |
| Structured improvement mining complete | pass | Stage 6 retrospective must include structured mining signals per `docs/verification/STAGE_RUBRICS.md` and existing retrospective contracts. |
| Every lesson has durable disposition | pass | Stage 6 must produce `docs/work/BANDIT-094/improvement-disposition.md` or explicit no-action dispositions. |
| Current context, roadmap, and STATUS updated if state changed | pass | Stage 6 must synchronize `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md`; keep last closed `BANDIT-094` as active derived-status anchor after closeout until the next slice is formed. |
| Cockpit status and session-context agree | pass | Stage 6 must rerun `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json`. |
| `validate` and `git diff --check` pass | pass | Final validation must include `npm run bandit -- validate` and `git diff --check`; do not rerun land-check after an evidence-only closeout commit. |
