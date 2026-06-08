# BANDIT-075 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-075
work_type: chore
active_gap: BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS
plan_owner: work_item_pm
created_at: 2026-06-08T11:19:19Z
verdict: pass

This plan is Work Item PM orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review evidence,
landing evidence, retrospective evidence, roadmap, current context, root status,
or bootstrap-gap authority.

## Current Repo State

`BANDIT-075` is the active chore for the Reviewer Calibration With Seeded
Defects bootstrap gap. The repo is on `main`, ahead of `origin/main` by the
formation commit `fe7bea2`, with a clean worktree at plan creation. The current
coordination state is `formation_approved`, and Work Item PM may record
plan-mode orchestration before Stage 2 RED evidence.

### 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`; `CONTEXT.md`; `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `docs/plans/BOOTSTRAP_METHODOLOGY.md`; `CLEAN_CODE.md`; `docs/verification/STAGE_RUBRICS.md`; `STATUS.md`; `docs/work/BANDIT-075/brief.md`; `docs/work/BANDIT-075/coordination-log.jsonl`; `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty files before this plan was authored |
| Recent history inspected | pass | `git log --oneline -5` shows `fe7bea2 Form BANDIT-075 reviewer calibration chore`, `4b24141 Close out BANDIT-074 projection checks`, `3806431 Record BANDIT-074 review evidence`, `f206355 Implement BANDIT-074 projection checks`, and `0a991ab Form BANDIT-074 metamorphic checks` |
| Current context, roadmap, status, cockpit, and session context agree | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` all identify `BANDIT-075` and the next action as Work Item PM plan-mode orchestration before RED evidence |
| Prior Work Item fully closed | pass | `docs/work/BANDIT-074/landing-action.md`; `docs/work/BANDIT-074/retrospective.md`; `docs/work/BANDIT-074/chore-disposition.md`; `docs/work/BANDIT-074/improvement-disposition.md`; `docs/work/BANDIT-074/coordination-log.jsonl` sequence 8 `closed`; `node ./bin/bandit.mjs coordination validate BANDIT-074`; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` resolved |
| Operator-input status explicit | pass | `docs/work/BANDIT-075/brief.md` and `docs/roadmap/CURRENT_CONTEXT.md` record no operator-owned input required for current orchestration; Trust Verifier cutover, old-gate replacement/wrapping, live reviewer/model routing changes, product/UAT/policy/business/cost/risk changes, paid routing, public benchmark publication, hosted services, telemetry, merge, push, deploy, guarded browser actions, and ambiguous scope remain halt conditions |

### 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-075/brief.md` records chore scope, active gap linkage, acceptance criteria, verification plan, `CLEAN_CODE.md` evidence, expected files, required evidence, operator-input status, role boundaries, stage capability scope, token-cost failsafe, reviewer-calibration boundary, first implementation order, smell triggers, and Stage 1 `pass` checklist |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-075/qwen-formation-review.md` records `verdict: pass` through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-075/coderabbit-formation-review.md` records a full 10-minute provider timeout with no CodeRabbit pass claimed |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-075/formation-review.md` records `verdict: pass`, accepting CodeRabbit only as provider-timeout replacement evidence and finding no Stage 1 blockers. The artifact's pre-approval next-action wording is superseded by the later append-only `formation_approved` transition in `docs/work/BANDIT-075/coordination-log.jsonl` |
| `coordination-log.jsonl` records `formation_approved` | pass | `docs/work/BANDIT-075/coordination-log.jsonl` sequence 2 records `state: formation_approved` with `safe_triggers: ["red_evidence_required"]`; `node ./bin/bandit.mjs coordination validate BANDIT-075` passed |

## Stage Sequence

| Stage | Accountable role | Verdict | Evidence or command required before proceeding |
| --- | --- | --- | --- |
| 2. RED evidence | Test Writer, Codex PM during bootstrap | pass | Produce Test Writer-owned focused RED tests, seeded calibration packets, gold labels, fixture reviewer outputs, acceptance mappings, and `docs/work/BANDIT-075/red-evidence.md`, then record coordination `red_recorded` before implementation |
| 3. Implementation | Claude implementation writer if Codex authors RED | pass | Dispatch Claude after RED; require `docs/role-runs/BANDIT-075/stage3-implementation.json`, `docs/work/BANDIT-075/stage3-dispatch.md`, `docs/work/BANDIT-075/writer-report.md`, `docs/work/BANDIT-075/implementation-evidence.md`, focused GREEN tests, typecheck, validation, PM acceptance, and coordination `implementation_recorded`; Stage 3 may read but must not edit Test Writer-owned seeded packet and gold-label surfaces |
| 4. Review | CodeRabbit, Local Qwen via MLX adapter, Codex PM aggregate review | pass | Require CodeRabbit pass or provider timeout/refusal replacement evidence, Local Qwen through the authorized adapter path, risk classification, supply-chain gate if applicable, finding dispositions, current `review-subject-hash`, and `docs/work/BANDIT-075/review-evidence.md` |
| 5. Landing | Landing Agent / CLI local-record path | pass | Require `docs/work/BANDIT-075/landing-verdict.md`, current `land-check`, clean source/evidence commit before local-record landing, source-head/hash refresh when needed, `npm run bandit -- land BANDIT-075 --action local-record`, and `docs/work/BANDIT-075/landing-action.md` |
| 6. Closeout | Closeout Agent / Codex PM | pass | Require `docs/work/BANDIT-075/retrospective.md`, structured improvement mining, durable dispositions, bootstrap-gap resolution or explicit disposition, synchronized `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, final cockpit/session agreement, validation, and `git diff --check` |

### 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-075/brief.md` Role Boundary Evidence and First Implementation Order assign focused tests, test helpers, seeded calibration packets, gold labels, reviewer-score mappings, provider-refusal fixtures, and RED evidence to Test Writer |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Planned `docs/work/BANDIT-075/red-evidence.md` must map focused tests to acceptance criteria for packet schema, gold-label validation, repo-derived failure-mode policy, deterministic scoring, no-live-routing mutation, provider refusal/timeout/inconclusive evidence, and direct-Qwen-CLI refusal if reviewer evidence routing is touched |
| Stage 3 Writer has zero test-edit authority | pass | `docs/work/BANDIT-075/brief.md` forbids Stage 3 edits to tests, helpers, fixtures, seeded calibration packets, gold labels, RED evidence, reviewer-score acceptance mappings, source-artifact mappings, or acceptance mappings |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | `docs/work/BANDIT-075/brief.md` Bootstrap Model-Family Separation requires Claude-family Stage 3 implementation when Codex authors RED evidence |
| `red_recorded` is required before implementation | pass | `docs/verification/STAGE_RUBRICS.md`; `docs/work/BANDIT-075/coordination-log.jsonl`; implementation must not begin before Stage 2 evidence and coordination transition |

### 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-075/brief.md`; expected implementation surfaces are `.bandit/policy/reviewer-calibration.json`, `src/state/reviewer-calibration.ts`, `src/commands/reviewer-calibration.ts`, command wiring, docs, and validation behavior. `docs/reviewer-calibration-packets/**` is Test Writer-owned Stage 2 evidence and is read-only for Stage 3 |
| No Writer test-surface edits | pass | Must be verified after Claude Stage 3 from `git diff --name-only`, `docs/role-runs/BANDIT-075/stage3-implementation.json`, and PM acceptance evidence; any Writer test-surface edit invalidates the Stage 3 attempt |
| Focused tests pass or bootstrap gap is recorded | pass | `node --test test/reviewer-calibration.test.mjs` must pass after Stage 3 or an honest bootstrap gap must be recorded |
| `implementation-evidence.md` and Writer report exist | pass | Required artifacts: `docs/work/BANDIT-075/implementation-evidence.md` and `docs/work/BANDIT-075/writer-report.md` |
| PM acceptance verifies spec alignment and clean-code posture | pass | Required artifact: `docs/work/BANDIT-075/stage3-pm-review.md` applying `CLEAN_CODE.md` and the approved brief |
| Claude completion window respected | pass | Give Claude 15 minutes for Stage 3; do not interrupt before elapsed time unless the process exits |

### 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap_gap evidence | pass | Run `npm run bandit -- coderabbit-review pre-pr BANDIT-075 --base origin/main` before Stage 4 closeout or record bounded provider-timeout/refusal evidence without claiming a pass; do not interrupt a live CodeRabbit run before the full 10-minute window |
| Local Qwen review through only authorized path | pass | Use `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI evidence remains invalid |
| Escalated review if policy smells require it | pass | Risk classification and smell-trigger evaluation must decide escalation before aggregate review; escalation returns to Codex PM if Claude authored implementation |
| Risk classification | pass | Required artifact: `.bandit/policy/risk-classifications/BANDIT-075-risk-classification.json` |
| Supply-chain gate when applicable | pass | Required artifact: `.bandit/policy/supply-chain-gates/BANDIT-075-supply-chain-gate.json`; expected `not_applicable` unless dependency, lockfile, package-manager script, CI/release, skill, fetched-prompt, or external tool-install surfaces change |
| Every finding repaired or dispositioned | pass | Required PM finding disposition artifacts if CodeRabbit, Local Qwen, or escalated review returns findings |
| Aggregate review evidence current for review subject | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-075`; `docs/work/BANDIT-075/review-evidence.md` with current evidence SLO state |

### 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required artifact: `docs/work/BANDIT-075/landing-verdict.md` |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-075/brief.md` classifies this as non-product chore; no operator-facing product workflow or UAT surface is in scope unless implementation changes product-facing behavior |
| `land-check` passes | pass | Required command: `npm run bandit -- land-check BANDIT-075` |
| Clean source/evidence commit before local-record landing | pass | Local-record landing requires a clean source/evidence commit first, then source-head/hash refresh as needed |
| Source-head/hash refreshed before landing action when needed | pass | Use `node ./bin/bandit.mjs review-subject-hash BANDIT-075` and refresh review/landing evidence if evidence-only commits change the review subject |
| `landing-action.md` records commit SHA or merge evidence | pass | Required artifact after local-record landing: `docs/work/BANDIT-075/landing-action.md` with commit SHA |
| No next Work Item starts before landing action exists | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `.bandit/bootstrap-gaps.json`, and this plan keep later queued gaps blocked behind `BANDIT-075` |

### 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required artifact: `docs/work/BANDIT-075/retrospective.md` |
| Structured improvement mining complete | pass | Retrospective must include all Stage 6 mining signals from `docs/verification/STAGE_RUBRICS.md` |
| Every lesson has durable disposition | pass | Retrospective, chore disposition, improvement/no-action disposition, and `.bandit/bootstrap-gaps.json` must record durable outcomes |
| Context artifacts updated if state changed | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md` |
| Cockpit status and session-context agree | pass | `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` |
| `validate` and `git diff --check` pass | pass | `npm run bandit -- validate`; `git diff --check` |

## Required Evidence

| Evidence | Stage | Verdict expectation | Blocking rule |
| --- | --- | --- | --- |
| `docs/work/BANDIT-075/red-evidence.md` | Stage 2 | pass | Implementation cannot begin before RED evidence and `red_recorded` |
| `test/reviewer-calibration.test.mjs`, `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`, and RED-owned packet fixtures, gold labels, reviewer outputs, and mappings | Stage 2 | pass | Stage 3 Writer has zero authority to modify these surfaces |
| `docs/role-runs/BANDIT-075/stage3-implementation.json` | Stage 3 | pass | Missing or same-family implementation is a blocker when Codex authored RED |
| `docs/work/BANDIT-075/stage3-dispatch.md` | Stage 3 | pass | Missing dispatch evidence blocks PM acceptance |
| `docs/work/BANDIT-075/writer-report.md` | Stage 3 | pass | Missing writer summary blocks PM acceptance |
| `docs/work/BANDIT-075/implementation-evidence.md` | Stage 3 | pass | Missing, stale, or test-surface-tainted implementation evidence blocks Stage 4 |
| `docs/work/BANDIT-075/stage3-pm-review.md` | Stage 3 | pass | Missing PM acceptance blocks Stage 4 |
| `docs/work/BANDIT-075/coderabbit-review.md` | Stage 4 | pass or bootstrap_gap | Request-changes or undispositioned actionable findings block landing |
| `docs/work/BANDIT-075/local-qwen-review.md` | Stage 4 | pass, non_blocking with PM disposition, or bootstrap_gap | Direct `qwen` CLI evidence is invalid |
| `.bandit/policy/risk-classifications/BANDIT-075-risk-classification.json` | Stage 4 | pass | Missing risk classification blocks aggregate review and landing |
| `.bandit/policy/supply-chain-gates/BANDIT-075-supply-chain-gate.json` | Stage 4 | pass or not_applicable | Supply-chain-sensitive changes require explicit evidence before landing |
| `docs/work/BANDIT-075/review-evidence.md` | Stage 4 | pass | Stale aggregate evidence blocks landing |
| `docs/work/BANDIT-075/landing-verdict.md` | Stage 5 | pass | Landing cannot proceed without current verdict |
| `docs/work/BANDIT-075/landing-action.md` | Stage 5 | pass | Next work item cannot start without landing action evidence |
| `docs/work/BANDIT-075/retrospective.md` | Stage 6 | pass | Closeout cannot complete without durable lesson dispositions |

## Role Boundaries

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Repo PM owns formation only | pass | `docs/work/BANDIT-075/brief.md`; `docs/work/BANDIT-075/coordination-log.jsonl` sequences 1-2 |
| Work Item PM owns orchestration checklist and stage gate routing | pass | This file; `docs/templates/work-item-pm-plan.md`; `node ./bin/bandit.mjs work-item-pm start BANDIT-075` records `orchestration_plan_recorded` |
| Test Writer owns tests, fixtures, seeded calibration packets, gold labels, reviewer-score acceptance mappings, provider-refusal fixtures, source-artifact mappings, and RED evidence | pass | `docs/work/BANDIT-075/brief.md` Role Boundary Evidence and First Implementation Order; `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json` is Stage 2 evidence |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-075/brief.md`; Stage 3 must not edit test surfaces |
| Permanent Test Ownership Boundary | pass | Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust Test Writer-owned surfaces |
| Bootstrap Model-Family Separation | pass | If Codex authors RED, Stage 3 routes to Claude; verification escalation returns to Codex PM because Claude authored implementation |
| Reviewers own Stage 4 review evidence | pass | CodeRabbit plus Local Qwen through MLX adapter, with aggregate PM disposition |
| Landing Agent owns landing verdict/action evidence | pass | `npm run bandit -- land-check BANDIT-075`; `npm run bandit -- land BANDIT-075 --action local-record` |
| Closeout Agent/Codex PM owns Stage 6 retrospective and routing sync | pass | `docs/verification/STAGE_RUBRICS.md`; `STATUS.md` session closeout rule |

## Verification Commands

Planned focused RED/GREEN commands:

```sh
node --test test/reviewer-calibration.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs coordination validate BANDIT-075
node ./bin/bandit.mjs review-subject-hash BANDIT-075
npm run bandit -- coderabbit-review pre-pr BANDIT-075 --base origin/main
npm run bandit -- risk-classification validate BANDIT-075 --json
npm run bandit -- supply-chain-gate validate BANDIT-075 --json
npm run bandit -- land-check BANDIT-075
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

| Check | Verdict | Evidence |
| --- | --- | --- |
| Stage 2 RED records expected failures | pass | Focused `node --test test/reviewer-calibration.test.mjs` output must be captured in `docs/work/BANDIT-075/red-evidence.md` |
| Stage 3 focused tests pass | pass | Focused test output must be captured in implementation evidence |
| Full test suite passes if shared validators, deterministic command output, landing gates, templates, command routing, or reviewer evidence surfaces change | pass | `npm test` output before review and landing |
| TypeScript passes | pass | `npm run typecheck` |
| Bandit validation passes | pass | `npm run bandit -- validate` |
| Review subject hash is current | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-075` |
| Landing checks pass | pass | `npm run bandit -- land-check BANDIT-075` and local-record landing |

## Known Blockers

No known blocker prevents Work Item PM orchestration.

| Potential blocker | Verdict | Evidence or handling |
| --- | --- | --- |
| Operator-owned input | pass | None required for current action; halt if Trust Verifier cutover, old-gate replacement/wrapping, product/UAT/policy/business/cost/risk override, paid/external tooling, public benchmark publication, hosted services, telemetry, live reviewer/model routing changes, merge, push, deploy, guarded browser action authority, or ambiguous scope is needed |
| CodeRabbit provider availability | bootstrap_gap | Formation review timed out after the required 10-minute window; Stage 4 may record provider-timeout replacement evidence only if bounded provider retry fails |
| Local Qwen route | pass | Authorized path is `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI remains forbidden |
| Supply-chain sensitive surface | not_applicable | Expected implementation should not touch dependency, lockfile, package-manager script, CI/release workflow, installed skill, fetched-prompt, or external tool-install surfaces; reroute if this changes |
| Reviewer routing policy promotion | not_applicable | Explicitly out of scope; calibration output cannot promote, demote, replace, weaken, or reroute live reviewers without separate approval and policy evidence |
| Provider-dependent evidence treated as deterministic proof | not_applicable | Explicitly forbidden; provider timeout/refusal/inconclusive evidence must be recorded as calibration evidence and cannot silently replace deterministic local proof |

## Stop Conditions

Halt and report a blocker instead of continuing if any of these occur:

- Formation evidence becomes missing, stale, contradictory, or blocking.
- `node ./bin/bandit.mjs work-item-pm start BANDIT-075` fails or cannot record
  `orchestration_plan_recorded`.
- Stage 2 RED cannot produce focused failing tests for packet schema,
  gold-label validation, repo-derived packet-source policy, deterministic
  scoring, no-live-routing mutation, provider refusal/timeout/inconclusive
  handling, reviewer-score metrics, or direct-Qwen-CLI refusal when applicable.
- Stage 3 Writer edits any test, test helper, fixture, seeded calibration
  packet, gold label, RED evidence, reviewer-score acceptance mapping,
  source-artifact mapping, or acceptance mapping.
- Codex-authored RED is followed by Codex-authored Stage 3 implementation
  instead of Claude-family implementation.
- Claude Stage 3 remains unavailable after the required 15-minute completion
  window or required tooling is unavailable.
- Any reviewer returns blocker/request-changes findings that are not repaired or
  dispositioned.
- Implementation requires Trust Verifier cutover, old-gate replacement/wrapping,
  workflow policy promotion, live reviewer/model routing changes, public
  benchmark publication, paid routing, hosted services, telemetry, merge, push,
  deploy, guarded browser action execution, or unrelated cockpit/product scope.
- `land-check`, `validate`, coordination validation, cockpit status, session
  context, or `git diff --check` blocks and cannot be repaired within the
  approved Work Item scope.

## Forbidden Actions

- Do not let calibration packets, fixture reviewer outputs, or calibration
  scores affect live reviewer routing, model routing, gate verdicts, landing
  authority, workflow policy, or Trust Verifier authority by themselves.
- Do not use generic coding benchmark tasks as first-harness acceptance before
  repo-derived Bandit workflow failure-mode packets are represented.
- Do not treat raw finding count as the primary score.
- Do not treat provider timeout, provider refusal, inconclusive result, missing
  cost or latency evidence, unavailable external reviewer state, or direct
  `qwen` CLI output as a pass or routing waiver.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover,
  replace old gates, wrap old gates, change workflow policy, promote reviewer
  routing, approve paid reviewer/model routing, publish public benchmarks, set
  up hosted replay services, add telemetry, merge, push, deploy, execute guarded
  browser actions, or build unrelated cockpit/product scope.
- Do not start Evidence Bundle Attestation, Spec-To-Evidence Traceability
  Matrix, or unrelated Phase 8 product work before `BANDIT-075` has landing
  action evidence, retrospective, improvement disposition, bootstrap-gap
  disposition, and synchronized routing files.
