# BANDIT-071 Work Item PM Orchestration Plan

work_item: BANDIT-071
work_type: chore
active_gap: BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL
plan_owner: work_item_pm
created_at: 2026-06-07

This plan is advisory orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review
evidence, landing evidence, retrospective evidence, roadmap, current-context, or
bootstrap-gap authority.

## Current Repo State

`BANDIT-071` is the active chore for the private installable distribution and
update notification channel. The repo is on `main`, ahead of `origin/main` by
the formation commit `b50c9cb`, with a clean worktree at plan creation.

Current-state agreement:

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`; `CONTEXT.md`; `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `docs/plans/BOOTSTRAP_METHODOLOGY.md`; `CLEAN_CODE.md`; `docs/verification/STAGE_RUBRICS.md`; `STATUS.md`; `docs/work/BANDIT-071/brief.md`; `docs/work/BANDIT-071/coordination-log.jsonl`; `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty files |
| Recent history inspected | pass | `git log --oneline -5` shows `b50c9cb Form BANDIT-071 private install update channel` followed by `BANDIT-070` closeout commits |
| Current context, roadmap, status, cockpit, and session context agree | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` all identify `BANDIT-071` and next action `Run Work Item PM plan-mode orchestration for BANDIT-071 before RED evidence.` |
| Prior Work Item fully closed | pass | `docs/work/BANDIT-070/landing-action.md`; `docs/work/BANDIT-070/retrospective.md`; `docs/roadmap/CURRENT_CONTEXT.md`; `STATUS.md`; closeout commit `4f98bd1` |
| Operator-input status explicit | pass | `docs/work/BANDIT-071/brief.md` and `docs/roadmap/CURRENT_CONTEXT.md` record `No operator-owned input is required` for the next action, while public npm publishing, paid registry/external service setup, automatic self-update, Trust Verifier cutover, merge/push/deploy, product/UAT/policy/business/cost/risk changes remain halt conditions |

Formation state:

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-071/brief.md`; Stage 1 checklist in the brief is `pass` |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-071/qwen-formation-review.md` records `verdict: pass` through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-071/coderabbit-formation-review.md` records bounded provider timeout and no CodeRabbit pass claim |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-071/formation-review.md` records `verdict: pass` with CodeRabbit timeout accepted only as replacement evidence |
| Coordination records formation approval | pass | `docs/work/BANDIT-071/coordination-log.jsonl` sequence 2 records `state: formation_approved` |
| Coordination validation passes | pass | `node ./bin/bandit.mjs coordination validate BANDIT-071` returned `Coordination log is valid: BANDIT-071` |
| Repo validation passes | pass | `npm run bandit -- validate` returned `Bandit state is valid.` |

## Stage Sequence

| Stage | Accountable role | Verdict before stage | Evidence or command required before proceeding |
| --- | --- | --- | --- |
| 2. RED evidence | Test Writer, Codex PM during bootstrap | pass after RED fails correctly | `test/private-install-update-channel.test.mjs`; `test/update-channel.test.mjs`; any focused init/validate package-smoke coverage; `docs/work/BANDIT-071/red-evidence.md`; coordination `red_recorded` |
| 3. Implementation | Claude implementation writer if Codex authors RED | pass after source/chore delivery is accepted | `docs/role-runs/BANDIT-071/stage3-implementation.json`; `docs/work/BANDIT-071/writer-report.md`; `docs/work/BANDIT-071/implementation-evidence.md`; focused tests; typecheck; validation; coordination `implementation_recorded` |
| 4. Review | CodeRabbit, Local Qwen via MLX adapter, Codex PM aggregate review | pass, non_blocking with disposition, or bootstrap_gap with replacement evidence | `docs/work/BANDIT-071/coderabbit-review.md`; `docs/work/BANDIT-071/local-qwen-review.md`; finding dispositions if needed; `.bandit/policy/risk-classifications/BANDIT-071-risk-classification.json`; `.bandit/policy/supply-chain-gates/BANDIT-071-supply-chain-gate.json`; `docs/work/BANDIT-071/review-evidence.md`; current `review-subject-hash` |
| 5. Landing | Landing Agent / CLI local-record path | pass after safe-to-land verdict and landing action | `docs/work/BANDIT-071/landing-verdict.md`; `npm run bandit -- land-check BANDIT-071`; source/evidence commit; hash refresh when needed; `npm run bandit -- land BANDIT-071 --action local-record`; `docs/work/BANDIT-071/landing-action.md` |
| 6. Closeout | Closeout Agent / Codex PM | pass after retrospective, dispositions, and routing sync | `docs/work/BANDIT-071/retrospective.md`; bootstrap-gap resolution or explicit disposition; improvement/no-action dispositions; `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; final validation commands |

## Required Evidence

| Evidence | Stage | Verdict expectation | Blocking rule |
| --- | --- | --- | --- |
| `docs/work/BANDIT-071/red-evidence.md` | Stage 2 | `pass` after focused tests fail for missing private install/update behavior | Implementation cannot begin before RED evidence and `red_recorded` |
| Test Writer-owned tests and acceptance mappings | Stage 2 | `pass` | Stage 3 Writer has zero test-edit authority |
| `docs/role-runs/BANDIT-071/stage3-implementation.json` | Stage 3 | `pass` with Claude writer identity if Codex authored RED | Missing or same-family implementation is a blocker |
| `docs/work/BANDIT-071/writer-report.md` | Stage 3 | `pass` | Missing writer summary blocks PM acceptance |
| `docs/work/BANDIT-071/implementation-evidence.md` | Stage 3 | `pass` with clean-code self-check and no test-surface edits | Missing or stale evidence blocks Stage 4 |
| `docs/work/BANDIT-071/coderabbit-review.md` | Stage 4 | `pass` or `bootstrap_gap` provider-refusal evidence | Request-changes or undispositioned findings block landing |
| `docs/work/BANDIT-071/local-qwen-review.md` | Stage 4 | `pass`, `non_blocking` with PM disposition, or recorded provider-refusal/bootstrap evidence | Direct `qwen` CLI evidence is invalid |
| Risk classification and supply-chain gate artifacts | Stage 4 | `pass` or explicit operator-supervised blocker where required | Package metadata/runtime and install surfaces require supply-chain evidence |
| `docs/work/BANDIT-071/review-evidence.md` | Stage 4 | `pass` for current review subject | Stale aggregate evidence blocks landing |
| `docs/work/BANDIT-071/landing-verdict.md` | Stage 5 | `safe-to-land` or explicit `needs-repair`/`blocked` | Landing cannot proceed without current verdict |
| `docs/work/BANDIT-071/landing-action.md` | Stage 5 | `pass` after local-record landing | Next work item cannot start without landing action evidence |
| `docs/work/BANDIT-071/retrospective.md` | Stage 6 | `pass` with structured improvement mining | Closeout cannot complete without durable lesson dispositions |

## Role Boundaries

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Repo PM owns formation only | pass | `docs/work/BANDIT-071/brief.md`; `docs/work/BANDIT-071/coordination-log.jsonl` sequence 1-2 |
| Work Item PM owns orchestration checklist and stage gate routing | pass | This file; `docs/templates/work-item-pm-plan.md`; `node ./bin/bandit.mjs work-item-pm start BANDIT-071` to record `orchestration_plan_recorded` |
| Test Writer owns tests, fixtures, RED evidence, install-smoke evidence, package allow-list mappings, update-channel mappings, and acceptance mappings | pass | `docs/work/BANDIT-071/brief.md` Role Boundary Evidence and First Implementation Order |
| Implementation Writer owns source/chore delivery only | pass | `docs/work/BANDIT-071/brief.md`; Stage 3 must not edit test surfaces |
| Permanent Test Ownership Boundary | pass | Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust Test Writer-owned surfaces |
| Bootstrap Model-Family Separation | pass | If Codex authors RED, Stage 3 routes to Claude; verification escalation returns to Codex PM |
| Reviewers own Stage 4 review evidence | pass | CodeRabbit plus Local Qwen through MLX adapter, with aggregate PM disposition |
| Landing Agent owns landing verdict/action evidence | pass | `docs/templates/landing-verdict.md`; `npm run bandit -- land-check BANDIT-071`; `npm run bandit -- land BANDIT-071 --action local-record` |
| Closeout Agent/Codex PM owns Stage 6 retrospective and routing sync | pass | `docs/verification/STAGE_RUBRICS.md`; `STATUS.md` session closeout rule |

## Verification Commands

Planned focused RED/GREEN commands:

```sh
node --test test/private-install-update-channel.test.mjs
node --test test/update-channel.test.mjs
node --test test/init.test.mjs test/validate.test.mjs
npm pack --dry-run --json
npm run typecheck
npm test
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs coordination validate BANDIT-071
node ./bin/bandit.mjs review-subject-hash BANDIT-071
npm run bandit -- coderabbit-review pre-pr BANDIT-071 --base origin/main
npm run bandit -- qwen-review BANDIT-071
npm run bandit -- risk-classification validate BANDIT-071 --json
npm run bandit -- supply-chain-gate validate BANDIT-071 --json
npm run bandit -- land-check BANDIT-071
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Stage-specific checklist:

| Check | Verdict before execution | Evidence |
| --- | --- | --- |
| Stage 2 RED records expected failures | pending | Focused `node --test ...` output captured in `docs/work/BANDIT-071/red-evidence.md` |
| Stage 3 focused tests pass | pending | Test output captured in implementation evidence |
| Full test suite passes if shared CLI/package startup changes | pending | `npm test` output captured before review and landing |
| TypeScript passes | pending | `npm run typecheck` |
| Bandit validation passes | pending | `npm run bandit -- validate` |
| Review subject hash is current | pending | `node ./bin/bandit.mjs review-subject-hash BANDIT-071` |
| Landing checks pass | pending | `npm run bandit -- land-check BANDIT-071` and local-record landing |

## Known Blockers

No known blocker prevents Work Item PM orchestration.

| Potential blocker | Current verdict | Evidence or handling |
| --- | --- | --- |
| Operator-owned input | pass | None required for current action; halt if public npm, paid registry/external service, automatic self-update, merge/push/deploy, Trust Verifier cutover, product/UAT/policy/business/cost/risk override, or ambiguous scope is needed |
| CodeRabbit provider availability | bootstrap_gap | Formation review timed out; Stage 4 may record provider-timeout replacement evidence only if bounded provider retry fails |
| Local Qwen route | pass | Authorized path is `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI remains forbidden |
| Supply-chain sensitive surface | non_blocking | Package/runtime/install surfaces require explicit Stage 4 supply-chain evidence before landing |
| Public publishing or paid registry | not_applicable | Explicitly out of scope; reaching it is a halt condition |

## Stop Conditions

Halt and report a blocker instead of continuing if any of these occur:

- Formation evidence becomes missing, stale, contradictory, or blocking.
- `node ./bin/bandit.mjs work-item-pm start BANDIT-071` fails or cannot record
  `orchestration_plan_recorded`.
- Stage 2 RED cannot produce focused failing tests for missing private
  install/update behavior.
- Stage 3 Writer edits any test, fixture, RED evidence, install-smoke evidence,
  package allow-list mapping, update-channel mapping, or acceptance mapping.
- Codex-authored RED is followed by Codex-authored Stage 3 implementation
  instead of Claude-family implementation.
- Claude Stage 3 remains unavailable after the required 15-minute completion
  window or required tooling is unavailable.
- Any reviewer returns blocker/request-changes findings that are not repaired or
  dispositioned.
- Package/update implementation requires public npm publishing, paid registry
  setup, hosted external services, automatic self-update, telemetry,
  merge/push/deploy, or another operator-owned approval.
- `land-check`, `validate`, coordination validation, cockpit status, session
  context, or `git diff --check` blocks and cannot be repaired within the
  approved Work Item scope.

## Forbidden Actions

- Do not publish Bandit to public npm.
- Do not configure or approve paid private registry setup, hosted package
  infrastructure, recurring paid tooling, provider-pricing policy, spend-class
  policy, or business/cost tradeoffs.
- Do not implement automatic self-update, silent consumer-repo mutation,
  merge/push/deploy, PR/CI orchestration, guarded browser action execution, or
  external side-effecting workflow.
- Do not send telemetry, repo contents, workflow state, user activity, package
  usage, model-call metadata, review packets, or hidden identifiers during
  update checks.
- Do not treat update metadata, cached update results, package registries,
  private Git sources, or consumer-repo install state as canonical Bandit
  workflow authority.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover,
  replace old gates, wrap old gates, change UAT policy, or expand into
  unrelated cockpit/product scope.
- Do not start `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` or any later queued gap
  before `BANDIT-071` has required landing and closeout evidence.
