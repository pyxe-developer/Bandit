# BANDIT-101 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-101
owner: work_item_pm
created_at: 2026-06-13T13:30:23Z
current_stage: Stage 1: formation_approved
next_gate: Stage 2 RED evidence

This plan is Work Item PM orchestration evidence only. It does not replace
`docs/work/BANDIT-101/brief.md`, append-only coordination history, stage
evidence, reviewer evidence, landing evidence, retrospective evidence, roadmap
state, current context, or bootstrap-gap authority.

## Current Repo State

`BANDIT-101` is the active Phase 8 product slice for typed reviewer adapters
with honest degradation. `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`,
cockpit status, session-context, and `work-execute --json` agree that formation
is approved and the next safe action is Work Item PM plan-mode orchestration.

| Check | Verdict | Evidence |
| --- | --- | --- |
| Active work item selected | pass | `docs/roadmap/CURRENT_CONTEXT.md`; `docs/roadmap/ROADMAP.md`; `STATUS.md`; `node ./bin/bandit.mjs cockpit status --json`; `node ./bin/bandit.mjs session-context current --json` report `BANDIT-101` |
| Brief exists | pass | `docs/work/BANDIT-101/brief.md` |
| Current coordination state | pass | `docs/work/BANDIT-101/coordination-log.jsonl` records `formation_approved` at sequence 2 |
| Current execution controller state | pass | `node ./bin/bandit.mjs work-execute --json` reports `missing_plan_mode` and next safe command `node ./bin/bandit.mjs work-item-pm start BANDIT-101` |
| Git status inspected | pass | `git status --short --branch` reports `## main...origin/main [ahead 1]` and no dirty paths |
| Operator input status | pass | `docs/work/BANDIT-101/brief.md`, `CURRENT_CONTEXT.md`, `STATUS.md`, and session-context record `none_required` |
| Open bootstrap gaps | pass | `.bandit/bootstrap-gaps.json`; cockpit status reports no active bootstrap gap |

## 0. Context And Boundary

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-101/brief.md`, `docs/work/BANDIT-101/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md` |
| Git status inspected and dirty state classified | pass | `git status --short --branch`; clean worktree, branch `main` ahead of `origin/main` by one commit |
| Current context, roadmap, status, cockpit, and session-context agree | pass | All name `BANDIT-101`, Stage 1 `formation_approved`, plan-mode orchestration next, and `none_required` operator input |
| Prior work item fully closed | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `docs/work/BANDIT-104/coordination-log.jsonl` record `BANDIT-104` closed with landing and closeout evidence |
| Operator-input status explicit | pass | `Required Operator Input` sections record `none_required`; halt only for product, UAT, policy, business, cost/risk, publish, merge/push/deploy, external mutation, installed-global-skill, automation-prompt, Trust Verifier cutover, old-gate replacement, or genuinely ambiguous scope input |

## 1. Repo PM Formation Complete

This section is verification-only for Work Item PM. Work Item PM must not rerun
formation approval.

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-101/brief.md`; `docs/work/BANDIT-101/formation-review.md` aggregate Stage 1 checklist |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-101/qwen-formation-review.md` verdict `pass`, `findings_status: no_findings` |
| CodeRabbit formation review exists and is not blocking | pass | `docs/work/BANDIT-101/coderabbit-formation-review.md` records terminal `review_completed` with `findings: 0` |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-101/formation-review.md` verdict `pass`, `findings_status: no_findings` |
| Coordination log records formation approval | pass | `docs/work/BANDIT-101/coordination-log.jsonl` sequence 2 records `state: formation_approved` |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and acceptance mappings | pass | `brief.md` Role Boundary Evidence and Permanent Test Ownership Boundary |
| RED evidence maps tests or verification plan to acceptance criteria | pass | `brief.md` Acceptance Criteria, Test Plan, and Required Evidence define adapter validation, scaffold output, Local Qwen routing, no-reviewer landing blockade, disposition unblock, and human evidence coverage |
| Stage 3 Writer has zero test-edit authority | pass | `brief.md` states Stage 3 Writer may not edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence |
| Codex-authored RED requires different model family for Stage 3 | pass | If Codex authors or materially edits RED, Stage 3 implementation will route to MiniMax-M3 per current automation prompt and different-model-family separation |
| `red_recorded` required before implementation | pass | `coordination-log.jsonl` currently lacks `red_recorded`; Stage 2 must record `docs/work/BANDIT-101/red-evidence.md` and append `red_recorded` before Stage 3 dispatch |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source delivery only | pass | Stage 3 dispatch will grant MiniMax-M3 source/config/docs delivery for accepted implementation surfaces only |
| No Writer test-surface edits | pass | Stage 3 dispatch will forbid edits to `test/**`, fixtures, `red-evidence.md`, acceptance mappings, and Test Writer-owned evidence |
| Focused tests pass or bootstrap gap is recorded | pass | Required focused tests include reviewer-adapter validation, scaffold output, Local Qwen route regression, no-reviewer landing blockade/disposition, and human evidence validation |
| Implementation evidence and Writer report required | pass | Required outputs: `docs/work/BANDIT-101/implementation-evidence.md` and `docs/work/BANDIT-101/writer-report.md` |
| PM acceptance verifies spec alignment and clean-code posture | pass | Required output: `docs/work/BANDIT-101/stage3-pm-acceptance.md`; compare diff to `brief.md`, source spec, `CLEAN_CODE.md`, and Stage 3 rubric |
| MiniMax-M3 execution window recorded | pass | Current automation prompt requires MiniMax-M3 as Writer, 20 minutes before timeout judgment, polling at 10 and 15 minutes, and up to two retries before halting for operator help |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review required | pass | Stage 4 must run successful CodeRabbit review; current automation prompt forbids closing Stage 4 without successful CodeRabbit terminal evidence |
| Local Qwen review required through authorized path | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `brief.md` authorize only `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs` |
| Escalated review handled when policy smells require it | pass | Stage 4 risk/smell review must inspect parser/validator, schema, review-gate, no-reviewer, and supply-chain signals; use MiniMax-M3 unless MiniMax authored Stage 3, then try Claude and fallback to Codex GPT-5.5 xhigh per prompt |
| Risk classification required | pass | Required Stage 4 aggregate review evidence must classify review-depth, operator-supervision, and auto-landing eligibility |
| Supply-chain gate state recorded | pass | Brief forbids dependency, lockfile, package-script, CI/release workflow, fetched prompt, and hosted-service changes; record `not_applicable` unless actual diff touches a supply-chain surface |
| Findings repaired or dispositioned | pass | Stage 4 cannot pass with unresolved CodeRabbit, Local Qwen, or escalated-review findings |
| Aggregate review current for review subject | pass | `docs/work/BANDIT-101/review-evidence.md` must record source head, review-subject hash or equivalent freshness evidence, risk state, supply-chain state, and finding dispositions |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict required | pass | Required output `docs/work/BANDIT-101/landing-verdict.md` |
| Feature UAT handled when applicable | not_applicable | Cockpit status reports UAT `not_applicable` from `brief.md`; this slice is CLI/reviewer plumbing, not a user-facing UAT flow unless later evidence changes scope |
| `land-check` must pass | pass | Required command `node ./bin/bandit.mjs land-check BANDIT-101` before landing |
| Clean source/evidence commit before local-record landing | pass | Current automation prompt requires source/evidence commit, source-head/hash refresh, then landing action |
| Landing action records commit SHA or merge evidence | pass | Required output `docs/work/BANDIT-101/landing-action.md` with local commit SHA or merge evidence |
| No next Work Item before landing action | pass | `AGENTS.md`, `BOOTSTRAP_METHODOLOGY.md`, `CURRENT_CONTEXT.md`, and `ROADMAP.md` block `BANDIT-102`, `BANDIT-103`, V0 trial work, and unrelated work until `BANDIT-101` lands and closes |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective required | pass | Required output `docs/work/BANDIT-101/retrospective.md` |
| Structured improvement mining required | pass | Stage 6 rubric requires failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use pressure, reviewer/model routing, tool invocation friction, recurring inefficiency, cost/latency, and unresolved uncertainty checks |
| Every lesson has durable disposition | pass | Required output `docs/work/BANDIT-101/improvement-disposition.md` or explicit no-action decisions for each material lesson |
| Context, roadmap, and status updated if state changed | pass | Stage 6 must refresh `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` |
| Cockpit status and session-context agree | pass | Final checks must run `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json` |
| Final validation and whitespace checks pass | pass | Required commands: `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-101`, and `git diff --check` |
| Stage 6 does not rerun land-check after evidence-only closeout commit | pass | Current automation prompt forbids rerunning land-check after an evidence-only closeout commit |

## Stage Sequence

| Stage | Accountable role | Required output before next stage |
| --- | --- | --- |
| Plan mode | Work Item PM | This `orchestration-plan.md` plus `orchestration_plan_recorded` coordination transition |
| Stage 2 RED | Test Writer / Codex PM | Tests or verification plan, RED command evidence, acceptance mapping, `docs/work/BANDIT-101/red-evidence.md`, and `red_recorded` transition |
| Stage 3 Implementation | MiniMax-M3 Implementation Writer | Source/config implementation, focused test evidence, `docs/work/BANDIT-101/writer-report.md`, `docs/work/BANDIT-101/implementation-evidence.md`, `docs/work/BANDIT-101/stage3-pm-acceptance.md`, and implementation transition |
| Stage 4 Review | CodeRabbit, Local Qwen, optional escalated reviewer, Work Item PM | CodeRabbit success, Local Qwen review, any required escalation, risk classification, supply-chain disposition, finding dispositions, `docs/work/BANDIT-101/review-evidence.md` |
| Stage 5 Landing | Landing Agent | Landing verdict, land-check pass, source/evidence commit, source-head/hash refresh, local-record landing action in `docs/work/BANDIT-101/landing-action.md` |
| Stage 6 Closeout | Closeout Agent / Work Item PM | Retrospective, structured improvement mining, improvement/no-action disposition, status/context updates, validation evidence, `closed` transition |

## Required Evidence

- `docs/work/BANDIT-101/orchestration-plan.md`
- `docs/work/BANDIT-101/red-evidence.md`
- `docs/work/BANDIT-101/implementation-evidence.md`
- `docs/work/BANDIT-101/writer-report.md`
- `docs/work/BANDIT-101/stage3-pm-acceptance.md`
- `docs/work/BANDIT-101/coderabbit-review.md`
- `docs/work/BANDIT-101/local-qwen-review.md`
- Escalated review artifact if policy smells require it
- `docs/work/BANDIT-101/review-evidence.md`
- `docs/work/BANDIT-101/landing-verdict.md`
- `docs/work/BANDIT-101/landing-action.md`
- `docs/work/BANDIT-101/retrospective.md`
- `docs/work/BANDIT-101/improvement-disposition.md`
- Updated `docs/work/BANDIT-101/coordination-log.jsonl`
- Updated `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` as state changes require

## Role Boundaries

- Repo PM owns formation and may not implement, review, land, or close this Work Item after formation approval.
- Work Item PM owns orchestration, evidence continuity, role routing, blocker reporting, and PM dispositions. Work Item PM does not author Stage 3 implementation source after Codex-authored RED.
- Test Writer owns tests, test helpers, fixtures, RED evidence, and acceptance mappings.
- Implementation Writer owns source/config delivery only and has no test-surface write authority.
- Reviewers own independent review evidence; they do not land or mutate source.
- Landing Agent owns landing verdict and local-record landing mechanics after review gates pass.
- Closeout Agent owns retrospective, structured improvement mining, improvement/no-action dispositions, and closeout synchronization.
- Append-only coordination history remains canonical; cockpit status, session-context, work-execute output, templates, command stdout, and generated profile guidance are derived projections or evidence, not workflow authority.

## Verification Commands

Required before implementation, review, landing, or closeout as applicable:

```sh
node --test test/reviewer-adapters.test.mjs test/local-qwen-review.test.mjs test/landing-gates.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs coordination validate BANDIT-101
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs land-check BANDIT-101
git diff --check
```

Stage 4 must also run successful CodeRabbit review and authorized Local Qwen
review before landing. `npm test` is required if shared CLI startup, profile
parsing, reviewer commands, landing gates, bootstrap gaps, validation, risk
classification, supply-chain gates, cockpit/session-context, or package
scaffolding behavior changes.

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Operator-owned input | pass | `none_required` in brief, current context, session-context, and status |
| Required formation evidence | pass | Brief, Local Qwen formation review, CodeRabbit terminal formation review, aggregate formation review, and `formation_approved` transition exist |
| Required tooling | non_blocking | MiniMax-M3, CodeRabbit, and Local Qwen need live availability at their stages; halt under the automation prompt if a required tool is unavailable after allowed retries |
| One live OpenAI-compatible endpoint limitation | non_blocking | Brief records Local Qwen as the only in-house live endpoint and treats additional endpoint diversity as out of scope unless Stage 4 or Stage 6 evidence shows it affects trust |
| Open bootstrap gap ahead of this slice | not_applicable | Cockpit status and `.bandit/bootstrap-gaps.json` report no open gap ahead of `BANDIT-101` |

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-101` refuses this plan.
- Stage 2 cannot produce RED evidence mapped to acceptance criteria.
- Stage 3 Writer edits tests, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence.
- MiniMax-M3 fails or times out across the allowed attempts.
- Focused tests, typecheck, validation, coordination validation, or diff checks fail without repair.
- CodeRabbit Stage 4 review is unavailable or unsuccessful after the required natural runs; Stage 4 cannot close without successful CodeRabbit terminal evidence.
- Local Qwen is unavailable through the authorized MLX adapter route after allowed retries.
- Reviewer findings remain unresolved or undispositioned.
- Policy smells require escalation and no authorized escalated review route succeeds.
- Landing Agent returns `needs-repair`, `blocked`, or `requires operator approval`.
- New operator-owned product, UAT, policy, business, cost/risk, publish, merge/push/deploy, external-repo, installed-global-skill, automation-prompt, Trust Verifier cutover, old-gate replacement, or genuinely ambiguous scope input becomes required.

## Forbidden Actions

- Do not start, form, or modify `BANDIT-102`, `BANDIT-103`, V0 trial work, Trust Verifier cutover, or unrelated Phase 8 product work before `BANDIT-101` lands and closes.
- Do not add same-harness self-review defaults, reviewer quality calibration, reviewer benchmark scoring, paid reviewer promotion, recurring paid reviewer policy, hosted reviewer services, telemetry, public benchmark publication, paid/live reviewer routing, provider-pricing evidence, or spend-class approval.
- Do not change Local Qwen's authorized route away from `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`.
- Do not implement harness-neutral `AGENTS.md` generation, harness shims, policy tiers, local API, State Index, guarded browser actions, old-gate replacement or wrapping, claim authority, worktree lifecycle, merge, push, deploy, public npm publish automation, credential handling, hosted update services, automatic self-update, dependency changes, lockfile changes, package-script changes, CI/release workflow changes, external repo mutation, installed global skill mutation, automation prompt mutation, or unrelated Phase 8 work.
- Do not treat reviewer config, generated templates, profile docs, cockpit/session-context output, command output, or scaffold guidance as canonical workflow authority.
- Do not let any Stage 3 Writer edit tests, fixtures, RED evidence, acceptance mappings, or PM-owned evidence.
