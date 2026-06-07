# BANDIT-065 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-065
plan_owner: work_item_pm
created_at: 2026-06-07T15:30:00Z
verdict: pass

## Current Repo State

`BANDIT-065` is the active non-product bootstrap-gap chore under
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`. The work item is bounded to a
harness-portable, non-authoritative Work Item PM orchestrator prompt contract
and validation path. It must not implement generated role input packets,
generated execution packets, live A2A channels, True Agent lifecycle,
Pi/Aperture runtime work, Trust Verifier cutover, old-gate replacement or
wrapping, external service setup, dependency or lockfile changes, merge, push,
deploy, product UAT, installed global skill edits, or unrelated cockpit product
work.

Current repo-derived state:

- verdict: pass
- evidence: `docs/work/BANDIT-065/brief.md`,
  `docs/work/BANDIT-065/coordination-log.jsonl`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  `.bandit/bootstrap-gaps.json`, `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`
- finding: `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and
  session-context agree that `BANDIT-065` is active, formation-approved, and
  awaiting Work Item PM plan-mode recording before Stage 2 RED evidence.

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-065/brief.md`, `docs/work/BANDIT-065/coordination-log.jsonl`, `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` showed active `BANDIT-065` Repo PM formation artifacts and routing changes; no unrelated dirty changes were identified. |
| Current context, roadmap, status, cockpit status, and session-context agree | pass | `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json`; matching next action in `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` |
| Prior Work Item is fully closed | pass | `docs/work/BANDIT-064/landing-action.md`, `docs/work/BANDIT-064/retrospective.md`, commit `909b68a Close out BANDIT-064` |
| Operator-input status is explicit | pass | `docs/roadmap/CURRENT_CONTEXT.md` and `STATUS.md` state no operator-owned input is required for plan-mode handoff; cutover, product, UAT, policy, business, cost/risk, merge, push, deploy, external-service, paid-routing, and broader cockpit decisions remain halt conditions. |

## 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-065/brief.md`; includes goal, scope, out of scope, acceptance criteria, test plan, `CLEAN_CODE.md` read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, operator boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and smell/review routing expectations. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-065/qwen-formation-review.md` records `verdict: pass`; one non-blocking placeholder note dispositioned as no Stage 1 source repair. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-065/coderabbit-formation-review.md` records provider timeout as `verdict: bootstrap_gap`; no CodeRabbit pass is claimed. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-065/formation-review.md` records `verdict: pass`; CodeRabbit timeout accepted only as bootstrap-gap replacement evidence. |
| Coordination log records `formation_approved` | pass | `docs/work/BANDIT-065/coordination-log.jsonl` sequence 2 records `state:"formation_approved"`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-065/brief.md` Stage Capability Scope assigns Stage 2 RED evidence to Test Writer and forbids Stage 3 Writer test-surface edits. |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Planned artifact: `docs/work/BANDIT-065/red-evidence.md`; planned focused test: `test/orchestrator-prompts.test.mjs`; acceptance criteria from `docs/work/BANDIT-065/brief.md`. |
| Stage 3 Writer has zero test-edit authority | pass | Brief forbidden actions and Stage Capability Scope prohibit Stage 3 Writer edits to tests, test helpers, fixtures, RED evidence, or acceptance mappings. |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | Brief records Bootstrap Model-Family Separation; this plan preserves Claude Process Adapter as the Stage 3 implementation path if Codex authors RED evidence. |
| `red_recorded` is required before implementation | pass | Stage sequence below requires `red_recorded` in `docs/work/BANDIT-065/coordination-log.jsonl` before Stage 3 dispatch or implementation. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | Planned Stage 3 owner: Claude Implementation Writer if Codex authors RED; allowed source/policy/template/command surfaces from `docs/work/BANDIT-065/brief.md`. |
| No Writer test-surface edits | pass | Stage 3 dispatch must quote the Permanent Test Ownership Boundary and forbid edits to `test/**`, fixtures, RED evidence, and acceptance mappings. |
| Focused tests pass or bootstrap gap is recorded | pass | Planned verification: `node --test test/orchestrator-prompts.test.mjs`, targeted existing tests if touched, `npm run typecheck`, and relevant Bandit validators. |
| `implementation-evidence.md` and Writer report exist | pass | Required Stage 3 evidence: `docs/work/BANDIT-065/implementation-evidence.md` and `docs/work/BANDIT-065/writer-report.md`. |
| PM acceptance verifies spec alignment and clean-code posture | pass | Required PM evidence: `docs/work/BANDIT-065/stage3-pm-review.md`; clean-code rubric from `CLEAN_CODE.md`. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap-gap evidence | pass | Planned command: `npm run bandit -- coderabbit-review pre-pr BANDIT-065 --base origin/main`; provider timeout/refusal must be recorded honestly and not treated as pass. |
| Local Qwen review | pass | Planned command: `npm run bandit -- qwen-review BANDIT-065`; required artifact `docs/work/BANDIT-065/local-qwen-review.md`. |
| Escalated review if policy smells require it | pass | Review routing must consult layered risk, supply-chain gate, smell triggers, and Stage 4 findings before aggregate review. |
| Risk classification | pass | Planned command: `npm run bandit -- risk-classification validate --json`; required work-item evidence if the implementation touches review-depth or landing-risk surfaces. |
| Supply-chain gate when applicable | pass | Planned command: `npm run bandit -- supply-chain-gate validate --json`; no dependency or lockfile change is allowed by scope. |
| Every finding repaired or dispositioned | pass | Required dispositions in `docs/work/BANDIT-065/review-evidence.md` and any focused finding-disposition artifact. |
| Aggregate review evidence current for review subject | pass | Planned command: `node ./bin/bandit.mjs review-subject-hash BANDIT-065`; required artifact `docs/work/BANDIT-065/review-evidence.md`. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required artifact: `docs/work/BANDIT-065/landing-verdict.md`. |
| Feature UAT handled when applicable | not_applicable | `BANDIT-065` is a non-product bootstrap-gap chore; no feature UAT is required unless scope changes into product behavior, which is forbidden. |
| `land-check` passes | pass | Planned command: `npm run bandit -- land-check BANDIT-065`. |
| `landing-action.md` records commit SHA or merge evidence | pass | Required artifact: `docs/work/BANDIT-065/landing-action.md` after supported local-record or PR landing action. |
| No next Work Item starts before landing action exists | pass | Enforced by `AGENTS.md`, `BOOTSTRAP_METHODOLOGY.md`, Stage 0 rubric, and this plan. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required artifact: `docs/work/BANDIT-065/retrospective.md`. |
| Structured improvement mining complete | pass | Required in `docs/work/BANDIT-065/retrospective.md`; every lesson must become an improvement chore, cross-model tension entry, smell update, or explicit no-action decision. |
| Every lesson has durable disposition | pass | Required Stage 6 retrospective and bootstrap-gap disposition evidence. |
| `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed | pass | Required final synchronization after landing and closeout. |
| Cockpit status and session-context agree | pass | Required commands: `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json`. |
| `validate` and `git diff --check` pass | pass | Required commands: `npm run bandit -- validate`; `git diff --check`. |

## Stage Sequence

| Stage | Accountable role | Required transition evidence |
| --- | --- | --- |
| Stage 2 RED evidence | Test Writer | RED test/verification artifacts, `docs/work/BANDIT-065/red-evidence.md`, and `red_recorded` coordination evidence before implementation. |
| Stage 3 implementation | Claude Implementation Writer if Codex authors RED | Source/policy/template/command delivery only, `docs/work/BANDIT-065/writer-report.md`, `docs/work/BANDIT-065/implementation-evidence.md`, and PM acceptance evidence. |
| Stage 4 review | Reviewer agents and Codex PM aggregation | CodeRabbit or provider-refusal evidence, Local Qwen evidence, risk/supply-chain evidence, finding dispositions, and current aggregate `docs/work/BANDIT-065/review-evidence.md`. |
| Stage 5 landing | Landing Agent | Landing verdict, `land-check`, and `docs/work/BANDIT-065/landing-action.md` with commit or merge evidence. |
| Stage 6 closeout | Closeout Agent / Codex PM | Retrospective, improvement dispositions, bootstrap-gap disposition, synchronized context artifacts, final validation. |

## Required Evidence

- Stage 2: `test/orchestrator-prompts.test.mjs`,
  `docs/work/BANDIT-065/red-evidence.md`, `docs/work/BANDIT-065/coordination-log.jsonl`
- Stage 3: `.bandit/policy/orchestrator-prompts.json`,
  `docs/templates/work-item-pm-orchestrator-prompt.md`,
  `src/state/orchestrator-prompts.ts`, `src/commands/orchestrator-prompts.ts`,
  command routing if needed, `docs/work/BANDIT-065/writer-report.md`,
  `docs/work/BANDIT-065/implementation-evidence.md`,
  `docs/work/BANDIT-065/stage3-pm-review.md`
- Stage 4: `docs/work/BANDIT-065/coderabbit-review.md`,
  `docs/work/BANDIT-065/local-qwen-review.md`,
  risk/supply-chain evidence when applicable,
  `docs/work/BANDIT-065/review-evidence.md`
- Stage 5: `docs/work/BANDIT-065/landing-verdict.md`,
  `docs/work/BANDIT-065/landing-action.md`
- Stage 6: `docs/work/BANDIT-065/retrospective.md`,
  `.bandit/bootstrap-gaps.json`, `.bandit/events.jsonl`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`

## Role Boundaries

Repo PM owns Stage 1 creation, formation routing, formation approval, and
context synchronization before Work Item PM start. Work Item PM verifies
formation, records this plan, orchestrates the approved stage sequence, and
halts at policy, tooling, evidence, reviewer, or operator-owned blockers.

Test Writer owns Stage 2 tests, fixtures, RED evidence, and acceptance mappings.
Implementation Writer owns Stage 3 source/chore delivery only. If Codex authors
or materially edits RED evidence, Stage 3 implementation must be assigned to
Claude or a different model family. Stage 3 Writer has no authority to edit
tests, test helpers, fixtures, RED evidence, acceptance mappings, formation
evidence, review evidence, landing evidence, or retrospective evidence.

Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
verdict/action evidence. Closeout Agent/Codex PM owns Stage 6 retrospective,
improvement mining, gap disposition, and routing-file synchronization.

## Verification Commands

- `node --test test/orchestrator-prompts.test.mjs`
- `node --test test/role-entrypoints-formation.test.mjs` if Work Item PM start/readiness behavior changes
- `node --test test/role-contracts.test.mjs test/role-run-manifests.test.mjs` if role contracts or manifests are touched
- `node --test test/coordination-log.test.mjs test/coordination-status.test.mjs` if coordination state changes
- `node --test test/stage-capability-scope.test.mjs` if stage capability scope changes
- `node --test test/token-cost-failsafe.test.mjs` if token-cost surfaces change
- `node --test test/validate.test.mjs` if repo validation changes
- `npm test` for shared command, validator, artifact, state, or policy changes
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- gaps list`
- `npm run bandit -- stage-capability-scope validate --json`
- `npm run bandit -- token-cost-failsafe validate --json`
- `npm run bandit -- evidence-freshness-slos validate --json`
- `npm run bandit -- risk-classification validate --json`
- `npm run bandit -- supply-chain-gate validate --json`
- `npm run bandit -- input-quarantine validate --json`
- `npm run bandit -- operator-boundary validate --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-065`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-065`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-065 --base origin/main`
- `npm run bandit -- qwen-review BANDIT-065`
- `npm run bandit -- land-check BANDIT-065`
- `git diff --check`

## Known Blockers

- verdict: pass
- evidence: `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`,
  `docs/work/BANDIT-065/brief.md`
- finding: no operator-owned input is required for the current plan-mode handoff.
  Known future halt conditions include Trust Verifier cutover approval, Trust
  Goal selection for cutover, old gate replacement or wrapping, product or UAT
  direction, business tradeoffs, explicit cost/risk posture, provider-pricing
  approval, paid recurring routing, merge/push/deploy, external service setup,
  global skill edits, Pi/Aperture runtime work, dependency policy changes, or
  broader cockpit/product scope.

## Stop Conditions

Halt and report a blocker instead of continuing if any of the following occurs:

- Required local evidence is missing, stale, contradictory, or fails validation.
- `red_recorded` is missing before Stage 3 implementation.
- Stage 3 Writer needs to edit test surfaces for this work item.
- Codex-authored RED evidence cannot be routed to Claude or another model family
  for Stage 3 implementation.
- Reviewer findings remain unresolved or undispositioned.
- CodeRabbit, Local Qwen, or another required provider is unavailable and no
  accepted provider-refusal/bootstrap-gap replacement evidence is recorded.
- A smell trigger requires escalated review and the escalation cannot be run or
  dispositioned.
- Landing verdict, `land-check`, or landing action evidence is missing or fails.
- A required operator-owned decision is crossed.
- Any attempted scope expansion touches forbidden surfaces.

## Forbidden Actions

- Do not approve Trust Verifier cutover or select a Trust Goal for cutover.
- Do not replace, wrap, or silently move authority from older gate paths.
- Do not let an orchestrator prompt become canonical workflow authority.
- Do not generate role input packets or execution packets.
- Do not implement live A2A, True Agent lifecycle, Pi/Aperture runtime work,
  queue/scheduler execution, claim authority, worktree lifecycle execution,
  diff-based write validation, same-agent repair continuation, landing/closeout
  handoff automation, cockpit product work, product UAT, merge, push, deploy,
  external services, dependency or lockfile changes, installed global skill
  edits, paid recurring routing, or broader product/policy changes.
- Do not mutate canonical workflow state outside Bandit CLI commands where a CLI
  command exists.
- Do not skip Formation Gate, plan-mode evidence, RED-before-implementation,
  reviewer gates, landing verdict/action, retrospective, or context closeout.
- Do not ask the operator for routine technical routing decisions Codex PM owns.
