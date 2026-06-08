# BANDIT-073 Work Item PM Orchestration Plan

work_item: BANDIT-073
work_type: chore
active_gap: BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE
plan_owner: work_item_pm
created_at: 2026-06-08T01:39:40Z

This plan is advisory orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review
evidence, landing evidence, retrospective evidence, roadmap, current-context, or
bootstrap-gap authority.

## Current Repo State

`BANDIT-073` is the active chore for the Gate Determinism And Flake Gate
bootstrap gap. The repo is on `main`, ahead of `origin/main` by one formation
commit, with a clean worktree at plan creation. The current coordination state
is `formation_approved`, and Work Item PM may record plan-mode orchestration
before Stage 2 RED evidence.

### 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`; `CONTEXT.md`; `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `docs/plans/BOOTSTRAP_METHODOLOGY.md`; `CLEAN_CODE.md`; `docs/verification/STAGE_RUBRICS.md`; `STATUS.md`; `docs/work/BANDIT-073/brief.md`; `docs/work/BANDIT-073/coordination-log.jsonl`; `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty files before this plan was authored |
| Recent history inspected | pass | `git log --oneline -5` shows `b7e9e37 Form BANDIT-073 gate determinism chore` followed by `BANDIT-072` closeout and landing evidence commits |
| Current context, roadmap, status, cockpit, and session context agree | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` all identify `BANDIT-073` and the next action as Work Item PM plan-mode orchestration before RED evidence |
| Prior Work Item fully closed | pass | `docs/work/BANDIT-072/landing-action.md`; `docs/work/BANDIT-072/retrospective.md`; `docs/work/BANDIT-072/chore-disposition.md`; `docs/work/BANDIT-072/improvement-disposition.md`; `docs/work/BANDIT-072/coordination-log.jsonl` sequence 12 `closed`; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` resolved |
| Operator-input status explicit | pass | `docs/work/BANDIT-073/brief.md` and `docs/roadmap/CURRENT_CONTEXT.md` record no operator-owned input required for current orchestration; Trust Verifier cutover, Trust Goal selection, old-gate replacement/wrapping, product/UAT/policy/business/cost/risk changes, paid routing, hosted services, merge, push, deploy, live reviewer/model routing, and ambiguous scope remain halt conditions |

### 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-073/brief.md` records chore scope, active gap linkage, acceptance criteria, verification plan, `CLEAN_CODE.md` evidence, expected files, role boundaries, stage capability scope, token-cost failsafe, gate determinism boundary, first implementation order, and Stage 1 `pass` checklist |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-073/qwen-formation-review.md` records `verdict: pass` through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-073/coderabbit-formation-review.md` records a full 10-minute provider timeout with no CodeRabbit pass claimed |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-073/formation-review.md` records `verdict: pass`, accepting CodeRabbit only as provider-timeout replacement evidence and finding no Stage 1 blockers |
| Coordination records formation approval | pass | `docs/work/BANDIT-073/coordination-log.jsonl` sequence 2 records `state: formation_approved` with `safe_triggers: ["red_evidence_required"]` |

## Stage Sequence

| Stage | Accountable role | Verdict | Evidence or command required before proceeding |
| --- | --- | --- | --- |
| 2. RED evidence | Test Writer, Codex PM during bootstrap | pass | Produce Test Writer-owned focused RED tests and `docs/work/BANDIT-073/red-evidence.md`, then record coordination `red_recorded` before implementation |
| 3. Implementation | Claude implementation writer if Codex authors RED | pass | Dispatch Claude after RED; require `docs/role-runs/BANDIT-073/stage3-implementation.json`, `docs/work/BANDIT-073/stage3-dispatch.md`, `docs/work/BANDIT-073/writer-report.md`, `docs/work/BANDIT-073/implementation-evidence.md`, focused GREEN tests, typecheck, validation, PM acceptance, and coordination `implementation_recorded` |
| 4. Review | CodeRabbit, Local Qwen via MLX adapter, Codex PM aggregate review | pass | Require CodeRabbit pass or provider timeout/refusal replacement evidence, Local Qwen through the authorized adapter path, risk classification, supply-chain gate if applicable, finding dispositions, current `review-subject-hash`, and `docs/work/BANDIT-073/review-evidence.md` |
| 5. Landing | Landing Agent / CLI local-record path | pass | Require `docs/work/BANDIT-073/landing-verdict.md`, current `land-check`, clean source/evidence commit before local-record landing, source-head/hash refresh when needed, `npm run bandit -- land BANDIT-073 --action local-record`, and `docs/work/BANDIT-073/landing-action.md` |
| 6. Closeout | Closeout Agent / Codex PM | pass | Require `docs/work/BANDIT-073/retrospective.md`, structured improvement mining, durable dispositions, bootstrap-gap resolution or explicit disposition, synchronized `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, final cockpit/session agreement, validation, and `git diff --check` |

### 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-073/brief.md` Role Boundary Evidence and First Implementation Order |
| RED evidence maps tests or verification plan to acceptance criteria | pass | Planned `docs/work/BANDIT-073/red-evidence.md` must map focused tests to the brief acceptance criteria for stable ordering, stable hashes, repeat-run output, provider-dependent evidence disposition, direct-Qwen-CLI refusal, freshness-bounded external evidence, and diagnostics |
| Stage 3 Writer has zero test-edit authority | pass | `docs/work/BANDIT-073/brief.md` forbids Stage 3 edits to tests, test helpers, fixtures, RED evidence, gate determinism acceptance mappings, expected-output mappings, nondeterminism-disposition mappings, source-artifact mappings, and acceptance mappings |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | `docs/work/BANDIT-073/brief.md` Bootstrap Model-Family Separation requires Claude-family Stage 3 implementation when Codex authors RED evidence |
| `red_recorded` is required before implementation | pass | `docs/verification/STAGE_RUBRICS.md`; `docs/work/BANDIT-073/coordination-log.jsonl`; implementation must not begin before Stage 2 evidence and coordination transition |

### 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-073/brief.md`; expected implementation surfaces are `.bandit/policy/gate-determinism-flake-gate.json`, `src/state/gate-determinism.ts`, `src/commands/validate.ts`, and related source/chore wiring only |
| No Writer test-surface edits | pass | Must be verified after Claude Stage 3 from `git diff --name-only`, `docs/role-runs/BANDIT-073/stage3-implementation.json`, and PM acceptance evidence; any Writer test-surface edit invalidates the Stage 3 attempt |
| Focused tests pass or bootstrap gap is recorded | pass | `node --test test/gate-determinism.test.mjs` must pass after Stage 3 or an honest bootstrap gap must be recorded |
| `implementation-evidence.md` and Writer report exist | pass | Required artifacts: `docs/work/BANDIT-073/implementation-evidence.md` and `docs/work/BANDIT-073/writer-report.md` |
| PM acceptance verifies spec alignment and clean-code posture | pass | Required artifact: `docs/work/BANDIT-073/stage3-pm-review.md` applying `CLEAN_CODE.md` and the approved brief |
| Claude completion window respected | pass | Give Claude 15 minutes for Stage 3; do not interrupt before elapsed time unless the process exits |

### 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap_gap evidence | pass | Run `npm run bandit -- coderabbit-review pre-pr BANDIT-073 --base origin/main` before Stage 4 closeout or record bounded provider-timeout/refusal evidence without claiming a pass |
| Local Qwen review through only authorized path | pass | Use `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI evidence remains invalid |
| Escalated review if policy smells require it | pass | Risk classification and smell-trigger evaluation must decide escalation before aggregate review; escalation returns to Codex PM if Claude authored implementation |
| Risk classification | pass | Required artifact: `.bandit/policy/risk-classifications/BANDIT-073-risk-classification.json` |
| Supply-chain gate when applicable | pass | Required artifact: `.bandit/policy/supply-chain-gates/BANDIT-073-supply-chain-gate.json`; expected `not_applicable` unless dependency, lockfile, package-manager script, CI/release, skill, fetched-prompt, or external tool-install surfaces change |
| Every finding repaired or dispositioned | pass | Required PM finding disposition artifacts if CodeRabbit, Local Qwen, or escalated review returns findings |
| Aggregate review evidence current for review subject | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-073`; `docs/work/BANDIT-073/review-evidence.md` with current evidence SLO state |

### 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required artifact: `docs/work/BANDIT-073/landing-verdict.md` |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-073/brief.md` classifies this as non-product chore; no operator-facing product workflow or UAT surface is in scope unless implementation changes product-facing behavior |
| `land-check` passes | pass | Required command: `npm run bandit -- land-check BANDIT-073` |
| Clean source/evidence commit before local-record landing | pass | Local-record landing requires a clean source/evidence commit first, then source-head/hash refresh as needed |
| Source-head/hash refreshed before landing action when needed | pass | Use `node ./bin/bandit.mjs review-subject-hash BANDIT-073` and refresh review/landing evidence if evidence-only commits change the review subject |
| `landing-action.md` records commit SHA or merge evidence | pass | Required artifact after local-record landing: `docs/work/BANDIT-073/landing-action.md` with commit SHA |
| No next Work Item starts before landing action exists | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `.bandit/bootstrap-gaps.json`, and this plan keep later queued gaps blocked behind `BANDIT-073` |

### 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required artifact: `docs/work/BANDIT-073/retrospective.md` |
| Structured improvement mining complete | pass | Retrospective must include all Stage 6 mining signals from `docs/verification/STAGE_RUBRICS.md` |
| Every lesson has durable disposition | pass | Retrospective, chore disposition, improvement/no-action disposition, and `.bandit/bootstrap-gaps.json` must record durable outcomes |
| Context artifacts updated if state changed | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md` |
| Cockpit status and session-context agree | pass | `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` |
| `validate` and `git diff --check` pass | pass | `npm run bandit -- validate`; `git diff --check` |

## Required Evidence

| Evidence | Stage | Verdict expectation | Blocking rule |
| --- | --- | --- | --- |
| `docs/work/BANDIT-073/red-evidence.md` | Stage 2 | pass | Implementation cannot begin before RED evidence and `red_recorded` |
| `test/gate-determinism.test.mjs` and any RED-owned fixtures or mappings | Stage 2 | pass | Stage 3 Writer has zero authority to modify these surfaces |
| `docs/role-runs/BANDIT-073/stage3-implementation.json` | Stage 3 | pass | Missing or same-family implementation is a blocker when Codex authored RED |
| `docs/work/BANDIT-073/stage3-dispatch.md` | Stage 3 | pass | Missing dispatch evidence blocks PM acceptance |
| `docs/work/BANDIT-073/writer-report.md` | Stage 3 | pass | Missing writer summary blocks PM acceptance |
| `docs/work/BANDIT-073/implementation-evidence.md` | Stage 3 | pass | Missing, stale, or test-surface-tainted implementation evidence blocks Stage 4 |
| `docs/work/BANDIT-073/stage3-pm-review.md` | Stage 3 | pass | Missing PM acceptance blocks Stage 4 |
| `docs/work/BANDIT-073/coderabbit-review.md` | Stage 4 | pass or bootstrap_gap | Request-changes or undispositioned actionable findings block landing |
| `docs/work/BANDIT-073/local-qwen-review.md` | Stage 4 | pass, non_blocking with PM disposition, or bootstrap_gap | Direct `qwen` CLI evidence is invalid |
| `.bandit/policy/risk-classifications/BANDIT-073-risk-classification.json` | Stage 4 | pass | Missing risk classification blocks aggregate review and landing |
| `.bandit/policy/supply-chain-gates/BANDIT-073-supply-chain-gate.json` | Stage 4 | pass or not_applicable | Supply-chain-sensitive changes require explicit evidence before landing |
| `docs/work/BANDIT-073/review-evidence.md` | Stage 4 | pass | Stale aggregate evidence blocks landing |
| `docs/work/BANDIT-073/landing-verdict.md` | Stage 5 | pass | Landing cannot proceed without current verdict |
| `docs/work/BANDIT-073/landing-action.md` | Stage 5 | pass | Next work item cannot start without landing action evidence |
| `docs/work/BANDIT-073/retrospective.md` | Stage 6 | pass | Closeout cannot complete without durable lesson dispositions |

## Role Boundaries

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Repo PM owns formation only | pass | `docs/work/BANDIT-073/brief.md`; `docs/work/BANDIT-073/coordination-log.jsonl` sequences 1-2 |
| Work Item PM owns orchestration checklist and stage gate routing | pass | This file; `docs/templates/work-item-pm-plan.md`; `node ./bin/bandit.mjs work-item-pm start BANDIT-073` records `orchestration_plan_recorded` |
| Test Writer owns tests, fixtures, RED evidence, gate determinism acceptance mappings, expected-output mappings, nondeterminism-disposition mappings, source-artifact mappings, and acceptance mappings | pass | `docs/work/BANDIT-073/brief.md` Role Boundary Evidence and First Implementation Order |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-073/brief.md`; Stage 3 must not edit test surfaces |
| Permanent Test Ownership Boundary | pass | Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust Test Writer-owned surfaces |
| Bootstrap Model-Family Separation | pass | If Codex authors RED, Stage 3 routes to Claude; verification escalation returns to Codex PM because Claude authored implementation |
| Reviewers own Stage 4 review evidence | pass | CodeRabbit plus Local Qwen through MLX adapter, with aggregate PM disposition |
| Landing Agent owns landing verdict/action evidence | pass | `npm run bandit -- land-check BANDIT-073`; `npm run bandit -- land BANDIT-073 --action local-record` |
| Closeout Agent/Codex PM owns Stage 6 retrospective and routing sync | pass | `docs/verification/STAGE_RUBRICS.md`; `STATUS.md` session closeout rule |

## Verification Commands

Planned focused RED/GREEN commands:

```sh
node --test test/gate-determinism.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs coordination validate BANDIT-073
node ./bin/bandit.mjs review-subject-hash BANDIT-073
npm run bandit -- coderabbit-review pre-pr BANDIT-073 --base origin/main
npm run bandit -- risk-classification validate BANDIT-073 --json
npm run bandit -- supply-chain-gate validate BANDIT-073 --json
npm run bandit -- land-check BANDIT-073
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

| Check | Verdict | Evidence |
| --- | --- | --- |
| Stage 2 RED records expected failures | pass | Focused `node --test test/gate-determinism.test.mjs` output must be captured in `docs/work/BANDIT-073/red-evidence.md` |
| Stage 3 focused tests pass | pass | Focused test output must be captured in implementation evidence |
| Full test suite passes if shared validators, deterministic command output, landing gates, templates, command routing, or reviewer evidence surfaces change | pass | `npm test` output before review and landing |
| TypeScript passes | pass | `npm run typecheck` |
| Bandit validation passes | pass | `npm run bandit -- validate` |
| Review subject hash is current | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-073` |
| Landing checks pass | pass | `npm run bandit -- land-check BANDIT-073` and local-record landing |

## Known Blockers

No known blocker prevents Work Item PM orchestration.

| Potential blocker | Verdict | Evidence or handling |
| --- | --- | --- |
| Operator-owned input | pass | None required for current action; halt if Trust Verifier cutover, Trust Goal selection, old-gate replacement/wrapping, product/UAT/policy/business/cost/risk override, paid/external tooling, public benchmark publication, hosted services, live reviewer/model routing, merge, push, deploy, guarded browser action authority, or ambiguous scope is needed |
| CodeRabbit provider availability | bootstrap_gap | Formation review timed out after the required 10-minute window; Stage 4 may record provider-timeout replacement evidence only if bounded provider retry fails |
| Local Qwen route | pass | Authorized path is `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI remains forbidden |
| Supply-chain sensitive surface | not_applicable | Expected implementation should not touch dependency, lockfile, package-manager script, CI/release workflow, installed skill, fetched-prompt, or external tool-install surfaces; reroute if this changes |
| Trust Verifier cutover or old-gate replacement | not_applicable | Explicitly out of scope; any need for cutover, replacement, wrapping, or canonical verifier authority is a blocker requiring separate authorization |
| Provider-dependent evidence treated as deterministic proof | not_applicable | Explicitly forbidden; provider-dependent or freshness-bounded external evidence must carry disposition metadata and cannot silently replace deterministic local proof |

## Stop Conditions

Halt and report a blocker instead of continuing if any of these occur:

- Formation evidence becomes missing, stale, contradictory, or blocking.
- `node ./bin/bandit.mjs work-item-pm start BANDIT-073` fails or cannot record
  `orchestration_plan_recorded`.
- Stage 2 RED cannot produce focused failing tests for determinism-critical gate
  selection, stable ordering, stable hashes, repeat-run output comparison,
  provider-dependent evidence disposition, undispositioned flake refusal,
  direct-Qwen-CLI refusal, freshness-bounded external evidence, or drift
  diagnostics.
- Stage 3 Writer edits any test, test helper, fixture, RED evidence, gate
  determinism acceptance mapping, expected-output mapping,
  nondeterminism-disposition mapping, source-artifact mapping, or acceptance
  mapping.
- Codex-authored RED is followed by Codex-authored Stage 3 implementation
  instead of Claude-family implementation.
- Claude Stage 3 remains unavailable after the required 15-minute completion
  window or required tooling is unavailable.
- Any reviewer returns blocker/request-changes findings that are not repaired or
  dispositioned.
- Implementation requires Trust Verifier cutover, old-gate replacement/wrapping,
  workflow policy promotion, live reviewer/model routing, public benchmark
  publication, paid routing, hosted services, telemetry, merge, push, deploy,
  guarded browser action execution, or unrelated cockpit/product scope.
- `land-check`, `validate`, coordination validation, cockpit status, session
  context, or `git diff --check` blocks and cannot be repaired within the
  approved Work Item scope.

## Forbidden Actions

- Do not treat flaky tests, unstable ordering, unstable hashes, dirty-worktree
  state, wall-clock-sensitive checks, provider timeout/refusal, unavailable
  external reviewers, or freshness-bounded external evidence as deterministic
  local proof without explicit disposition.
- Do not silently normalize unstable output without a recorded policy reason and
  diagnostics identifying the unstable fields or evidence class.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover,
  replace old gates, wrap old gates, change workflow policy, or make this
  determinism policy canonical verifier authority for unrelated live work.
- Do not implement live reviewer calibration, paid reviewer routing, model
  routing promotion, public benchmark publication, hosted replay services,
  telemetry, external reporting, or unrelated cockpit/product scope.
- Do not start Metamorphic Cross-Projection Checks, Reviewer Calibration With
  Seeded Defects, Evidence Bundle Attestation, Spec-To-Evidence Traceability
  Matrix, or unrelated Phase 8 product work before `BANDIT-073` has landing
  action evidence, retrospective, improvement disposition, bootstrap-gap
  disposition, and synchronized routing files.
- Do not use the direct `qwen` CLI for Bandit reviewer evidence.
