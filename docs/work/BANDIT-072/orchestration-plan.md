# BANDIT-072 Work Item PM Orchestration Plan

work_item: BANDIT-072
work_type: chore
active_gap: BANDIT-GAP-REPLAY-REGRESSION-CORPUS
plan_owner: work_item_pm
created_at: 2026-06-07

This plan is advisory orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review
evidence, landing evidence, retrospective evidence, roadmap, current-context, or
bootstrap-gap authority.

## Current Repo State

`BANDIT-072` is the active chore for the Replay Regression Corpus bootstrap
gap. The repo is on `main`, ahead of `origin/main` by one commit, with a clean
worktree at plan creation.

### 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`; `CONTEXT.md`; `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `docs/plans/BOOTSTRAP_METHODOLOGY.md`; `CLEAN_CODE.md`; `docs/verification/STAGE_RUBRICS.md`; `STATUS.md`; `docs/work/BANDIT-072/brief.md`; `docs/work/BANDIT-072/coordination-log.jsonl`; `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty files |
| Recent history inspected | pass | `git log --oneline -5` shows `422a5e6 Form BANDIT-072 replay regression corpus` followed by `BANDIT-071` closeout and review commits |
| Current context, roadmap, status, cockpit, and session context agree | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` all identify `BANDIT-072` and the next action as Work Item PM plan-mode orchestration before RED evidence |
| Prior Work Item fully closed | pass | `docs/work/BANDIT-071/landing-action.md`; `docs/work/BANDIT-071/retrospective.md`; `docs/work/BANDIT-071/coordination-log.jsonl` sequence 11 `closed`; closeout commit `9ba9a07` |
| Operator-input status explicit | pass | `docs/work/BANDIT-072/brief.md` and `docs/roadmap/CURRENT_CONTEXT.md` record no operator-owned input required for current orchestration; Trust Verifier cutover, Trust Goal selection, old-gate replacement/wrapping, product/UAT/policy/business/cost/risk changes, paid routing, hosted services, merge, push, deploy, and ambiguous scope remain halt conditions |

### 1. Repo PM Formation Complete

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-072/brief.md` records chore scope, replay-only boundary, acceptance criteria, verification plan, CLEAN_CODE.md evidence, role boundaries, expected files, stage capability scope, token-cost failsafe, and Stage 1 `pass` checklist |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-072/qwen-formation-review.md` records `verdict: pass` through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-072/coderabbit-formation-review.md` records bounded provider timeout with no CodeRabbit pass claimed |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-072/formation-review.md` records `verdict: pass`, accepting CodeRabbit only as provider-timeout replacement evidence |
| Coordination records formation approval | pass | `docs/work/BANDIT-072/coordination-log.jsonl` sequence 2 records `state: formation_approved` with `safe_triggers: ["red_evidence_required"]` |

## Stage Sequence

| Stage | Accountable role | Verdict before stage | Evidence or command required before proceeding |
| --- | --- | --- | --- |
| 2. RED evidence | Test Writer, Codex PM during bootstrap | pass after focused tests fail against missing behavior | `test/replay-regression-corpus.test.mjs`; `docs/work/BANDIT-072/red-evidence.md`; coordination `red_recorded` |
| 3. Implementation | Claude implementation writer if Codex authors RED | pass after source/chore delivery is accepted | `docs/role-runs/BANDIT-072/stage3-implementation.json`; `docs/work/BANDIT-072/stage3-dispatch.md`; `docs/work/BANDIT-072/writer-report.md`; `docs/work/BANDIT-072/implementation-evidence.md`; focused tests; typecheck; validation; coordination `implementation_recorded` |
| 4. Review | CodeRabbit, Local Qwen via MLX adapter, Codex PM aggregate review | pass, non_blocking with disposition, or bootstrap_gap with replacement evidence | `docs/work/BANDIT-072/coderabbit-review.md`; `docs/work/BANDIT-072/local-qwen-review.md`; finding dispositions if needed; risk classification; supply-chain gate; `docs/work/BANDIT-072/review-evidence.md`; current `review-subject-hash` |
| 5. Landing | Landing Agent / CLI local-record path | pass after safe-to-land verdict and landing action | `docs/work/BANDIT-072/landing-verdict.md`; `npm run bandit -- land-check BANDIT-072`; source/evidence commit; source-head/hash refresh when needed; `npm run bandit -- land BANDIT-072 --action local-record`; `docs/work/BANDIT-072/landing-action.md` |
| 6. Closeout | Closeout Agent / Codex PM | pass after retrospective, dispositions, and routing sync | `docs/work/BANDIT-072/retrospective.md`; bootstrap-gap resolution or explicit disposition; improvement/no-action dispositions; `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; final validation commands |

### 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `docs/work/BANDIT-072/brief.md` Role Boundary Evidence and First Implementation Order |
| RED evidence maps tests or verification plan to acceptance criteria | pending | Must be recorded in `docs/work/BANDIT-072/red-evidence.md` after focused RED test run |
| Stage 3 Writer has zero test-edit authority | pass | `docs/work/BANDIT-072/brief.md` forbids Stage 3 edits to tests, helpers, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, or acceptance mappings |
| If Codex authors RED, Stage 3 routes to Claude/different model family | pass | `docs/work/BANDIT-072/brief.md` Bootstrap Model-Family Separation requires Claude-family Stage 3 implementation |
| `red_recorded` is required before implementation | pass | `docs/verification/STAGE_RUBRICS.md`; `docs/work/BANDIT-072/coordination-log.jsonl`; implementation must not begin before Stage 2 evidence and coordination transition |

### 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-072/brief.md`; Stage 3 expected files exclude Test Writer-owned surfaces |
| No Writer test-surface edits | pending | Must be verified from `git diff --name-only` and `docs/role-runs/BANDIT-072/stage3-implementation.json` after Claude Stage 3 |
| Focused tests pass or bootstrap gap is recorded | pending | `node --test test/replay-regression-corpus.test.mjs` required after Stage 3 |
| `implementation-evidence.md` and Writer report exist | pending | `docs/work/BANDIT-072/implementation-evidence.md`; `docs/work/BANDIT-072/writer-report.md` |
| PM acceptance verifies spec alignment and clean-code posture | pending | `docs/work/BANDIT-072/stage3-pm-review.md` |
| Claude completion window respected | pending | Give Claude 15 minutes for Stage 3; do not interrupt before elapsed time unless the process exits |

### 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider-refusal/bootstrap_gap evidence | pending | `npm run bandit -- coderabbit-review pre-pr BANDIT-072 --base origin/main` or bounded provider-timeout/refusal evidence |
| Local Qwen review through only authorized path | pending | `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI remains forbidden |
| Escalated review if policy smells require it | pending | Risk classification and smell-trigger evaluation before aggregate review |
| Risk classification | pending | `.bandit/policy/risk-classifications/BANDIT-072-risk-classification.json` |
| Supply-chain gate when applicable | pending | `.bandit/policy/supply-chain-gates/BANDIT-072-supply-chain-gate.json`; expected not applicable unless dependency, lockfile, script, CI/release, skill, fetched-prompt, or external tool-install surfaces change |
| Every finding repaired or dispositioned | pending | Finding disposition artifacts if CodeRabbit or Local Qwen returns findings |
| Aggregate review evidence current for review subject | pending | `node ./bin/bandit.mjs review-subject-hash BANDIT-072`; `docs/work/BANDIT-072/review-evidence.md` |

### 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pending | `docs/work/BANDIT-072/landing-verdict.md` |
| Feature UAT handled when applicable | not_applicable | `docs/work/BANDIT-072/brief.md` classifies this as non-product chore; no operator-facing product surface is in scope |
| `land-check` passes | pending | `npm run bandit -- land-check BANDIT-072` |
| Clean source/evidence commit before local-record landing | pending | `git commit` source/evidence changes before `npm run bandit -- land BANDIT-072 --action local-record` |
| Source-head/hash refreshed before landing action when needed | pending | `node ./bin/bandit.mjs review-subject-hash BANDIT-072` and refreshed review/landing evidence if evidence-only commits change the review subject |
| `landing-action.md` records commit SHA or merge evidence | pending | `docs/work/BANDIT-072/landing-action.md` after local-record landing |
| No next Work Item starts before landing action exists | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and this plan keep later queued gaps blocked behind `BANDIT-072` |

### 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pending | `docs/work/BANDIT-072/retrospective.md` |
| Structured improvement mining complete | pending | `docs/work/BANDIT-072/retrospective.md` must include all Stage 6 mining signals |
| Every lesson has durable disposition | pending | `docs/work/BANDIT-072/retrospective.md`; improvement/no-action disposition text; `.bandit/bootstrap-gaps.json` |
| Context artifacts updated if state changed | pending | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md` |
| Cockpit status and session-context agree | pending | `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` |
| `validate` and `git diff --check` pass | pending | `npm run bandit -- validate`; `git diff --check` |

## Required Evidence

| Evidence | Stage | Verdict expectation | Blocking rule |
| --- | --- | --- | --- |
| `docs/work/BANDIT-072/red-evidence.md` | Stage 2 | pass after focused tests fail against missing replay corpus behavior | Implementation cannot begin before RED evidence and `red_recorded` |
| Test Writer-owned tests, fixtures, replay packet acceptance mappings, expected-verdict mappings, and source-artifact mappings | Stage 2 | pass | Stage 3 Writer has zero authority to modify these surfaces |
| `docs/role-runs/BANDIT-072/stage3-implementation.json` | Stage 3 | pass with Claude writer identity if Codex authored RED | Missing or same-family implementation is a blocker |
| `docs/work/BANDIT-072/stage3-dispatch.md` | Stage 3 | pass | Missing dispatch evidence blocks PM acceptance |
| `docs/work/BANDIT-072/writer-report.md` | Stage 3 | pass | Missing writer summary blocks PM acceptance |
| `docs/work/BANDIT-072/implementation-evidence.md` | Stage 3 | pass with clean-code self-check and no test-surface edits | Missing or stale evidence blocks Stage 4 |
| `docs/work/BANDIT-072/stage3-pm-review.md` | Stage 3 | pass | Missing PM acceptance blocks Stage 4 |
| `docs/work/BANDIT-072/coderabbit-review.md` | Stage 4 | pass or bootstrap_gap provider-timeout/refusal evidence | Request-changes or undispositioned findings block landing |
| `docs/work/BANDIT-072/local-qwen-review.md` | Stage 4 | pass, non_blocking with PM disposition, or recorded provider-refusal/bootstrap evidence | Direct `qwen` CLI evidence is invalid |
| Risk classification and supply-chain gate artifacts | Stage 4 | pass or explicit operator-supervised blocker where required | Supply-chain-sensitive changes require explicit evidence before landing |
| `docs/work/BANDIT-072/review-evidence.md` | Stage 4 | pass for current review subject | Stale aggregate evidence blocks landing |
| `docs/work/BANDIT-072/landing-verdict.md` | Stage 5 | safe-to-land or explicit needs-repair/blocked | Landing cannot proceed without current verdict |
| `docs/work/BANDIT-072/landing-action.md` | Stage 5 | pass after local-record landing | Next work item cannot start without landing action evidence |
| `docs/work/BANDIT-072/retrospective.md` | Stage 6 | pass with structured improvement mining | Closeout cannot complete without durable lesson dispositions |

## Role Boundaries

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Repo PM owns formation only | pass | `docs/work/BANDIT-072/brief.md`; `docs/work/BANDIT-072/coordination-log.jsonl` sequences 1-2 |
| Work Item PM owns orchestration checklist and stage gate routing | pass | This file; `docs/templates/work-item-pm-plan.md`; `node ./bin/bandit.mjs work-item-pm start BANDIT-072` to record `orchestration_plan_recorded` |
| Test Writer owns tests, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, replay-only boundary tests, and acceptance mappings | pass | `docs/work/BANDIT-072/brief.md` Role Boundary Evidence and First Implementation Order |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-072/brief.md`; Stage 3 must not edit test surfaces |
| Permanent Test Ownership Boundary | pass | Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust Test Writer-owned surfaces |
| Bootstrap Model-Family Separation | pass | If Codex authors RED, Stage 3 routes to Claude; verification escalation returns to Codex PM because Claude authored implementation |
| Reviewers own Stage 4 review evidence | pass | CodeRabbit plus Local Qwen through MLX adapter, with aggregate PM disposition |
| Landing Agent owns landing verdict/action evidence | pass | `npm run bandit -- land-check BANDIT-072`; `npm run bandit -- land BANDIT-072 --action local-record` |
| Closeout Agent/Codex PM owns Stage 6 retrospective and routing sync | pass | `docs/verification/STAGE_RUBRICS.md`; `STATUS.md` session closeout rule |

## Verification Commands

Planned focused RED/GREEN commands:

```sh
node --test test/replay-regression-corpus.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs coordination validate BANDIT-072
node ./bin/bandit.mjs review-subject-hash BANDIT-072
npm run bandit -- coderabbit-review pre-pr BANDIT-072 --base origin/main
npm run bandit -- risk-classification validate BANDIT-072 --json
npm run bandit -- supply-chain-gate validate BANDIT-072 --json
npm run bandit -- land-check BANDIT-072
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Stage-specific checklist:

| Check | Verdict before execution | Evidence |
| --- | --- | --- |
| Stage 2 RED records expected failures | pending | Focused `node --test test/replay-regression-corpus.test.mjs` output captured in `docs/work/BANDIT-072/red-evidence.md` |
| Stage 3 focused tests pass | pending | Focused test output captured in implementation evidence |
| Full test suite passes if shared validators, trust verify, landing gates, templates, command routing, or reviewer evidence surfaces change | pending | `npm test` output captured before review and landing |
| TypeScript passes | pending | `npm run typecheck` |
| Bandit validation passes | pending | `npm run bandit -- validate` |
| Review subject hash is current | pending | `node ./bin/bandit.mjs review-subject-hash BANDIT-072` |
| Landing checks pass | pending | `npm run bandit -- land-check BANDIT-072` and local-record landing |

## Known Blockers

No known blocker prevents Work Item PM orchestration.

| Potential blocker | Current verdict | Evidence or handling |
| --- | --- | --- |
| Operator-owned input | pass | None required for current action; halt if Trust Verifier cutover, Trust Goal selection, old-gate replacement/wrapping, product/UAT/policy/business/cost/risk override, paid/external tooling, public benchmark publication, hosted replay services, live routing, merge, push, deploy, or ambiguous scope is needed |
| CodeRabbit provider availability | bootstrap_gap | Formation review timed out; Stage 4 may record provider-timeout replacement evidence only if bounded provider retry fails |
| Local Qwen route | pass | Authorized path is `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI remains forbidden |
| Supply-chain sensitive surface | not_applicable | Expected implementation should not touch dependency, lockfile, package-manager script, CI/release workflow, installed skill, fetched-prompt, or external tool-install surfaces; reroute if this changes |
| Live workflow mutation | not_applicable | Replay execution must be read-only and fixture-backed; any live mutation requirement is a blocker |

## Stop Conditions

Halt and report a blocker instead of continuing if any of these occur:

- Formation evidence becomes missing, stale, contradictory, or blocking.
- `node ./bin/bandit.mjs work-item-pm start BANDIT-072` fails or cannot record
  `orchestration_plan_recorded`.
- Stage 2 RED cannot produce focused failing tests for missing replay corpus
  schema, deterministic output, read-only execution, known failure packets, or
  supplemental-evidence boundaries.
- Stage 3 Writer edits any test, test helper, fixture, RED evidence, replay
  packet acceptance mapping, expected-verdict mapping, source-artifact mapping,
  or acceptance mapping.
- Codex-authored RED is followed by Codex-authored Stage 3 implementation
  instead of Claude-family implementation.
- Claude Stage 3 remains unavailable after the required 15-minute completion
  window or required tooling is unavailable.
- Any reviewer returns blocker/request-changes findings that are not repaired or
  dispositioned.
- Replay implementation requires live state mutation, Trust Verifier cutover,
  old-gate replacement/wrapping, public benchmark publication, paid routing,
  hosted services, telemetry, merge/push/deploy, guarded browser action
  execution, or unrelated cockpit/product scope.
- `land-check`, `validate`, coordination validation, cockpit status, session
  context, or `git diff --check` blocks and cannot be repaired within the
  approved Work Item scope.

## Forbidden Actions

- Do not let replay packets mutate live workflow state, gap-ledger state,
  coordination history, claims, reviewer routing, model routing, landing
  authority, UAT state, merge/push/deploy behavior, or cost policy.
- Do not let replay corpus results replace required live CodeRabbit, Local Qwen,
  escalated review, risk classification, supply-chain evidence, UAT, landing
  verdicts, or operator-owned approvals.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover,
  replace old gates, wrap old gates, change workflow policy, or make replay
  corpus output canonical verifier authority for live work.
- Do not implement live reviewer calibration, paid reviewer routing, model
  routing promotion, public benchmark publication, hosted replay services,
  telemetry, or external reporting.
- Do not start Gate Determinism And Flake Gate, Metamorphic Cross-Projection
  Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle
  Attestation, Spec-To-Evidence Traceability Matrix, or unrelated Phase 8
  product work before `BANDIT-072` has landing action evidence, retrospective,
  improvement disposition, bootstrap-gap disposition, and synchronized routing
  files.
- Do not use ungrounded chat memory as packet authority when repo artifacts or
  explicit no-action dispositions are required.
- Do not use the direct `qwen` CLI for Bandit reviewer evidence.
