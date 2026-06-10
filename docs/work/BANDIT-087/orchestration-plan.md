# BANDIT-087 Orchestration Plan

contract_version: 1
work_item: BANDIT-087
work_type: chore
current_coordination_state: formation_approved
created_at: 2026-06-10T00:40:52Z
author: work_item_pm

## Current Repo State

`BANDIT-087` is the active formed work item for the intake-derived
`WIL-PR-CICD-LANDING` proposal. The current repo routing files, derived cockpit
status, and session-context packet agree that Work Item PM must record
plan-mode orchestration before RED evidence, implementation, review, landing,
closeout, Installed-Copy Update Path, the V0 Closeout Claude Code A/B
Product-Value Trial, Trust Verifier cutover, or unrelated Phase 8 work.

`BANDIT-086` is the last closed work item and has landing action,
retrospective, improvement disposition, and synchronized roadmap/status
evidence. No open bootstrap gap blocks `BANDIT-087`.

`BANDIT-087` is bounded policy triage only. This plan does not authorize PR
creation, remote publication, CI orchestration, branch-protection changes,
GitHub credential use, merge, push, deploy, hosted service setup, paid routing,
public benchmark publication, Trust Verifier cutover, replacement or wrapping
of local-record landing, local API, State Index, scheduler behavior,
claim/worktree lifecycle, guarded browser action execution, or unrelated Phase
8 work.

## Stage Sequence

| Section | Checklist item | Verdict | Evidence |
| --- | --- | --- | --- |
| 0. Context And Boundary | Required reads complete. | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-087/brief.md`, `docs/work/BANDIT-087/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md` were read before this plan. |
| 0. Context And Boundary | Git status inspected and dirty state classified. | pass | `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty working tree entries before this file was added. |
| 0. Context And Boundary | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context agree. | pass | All name `BANDIT-087` as active, Stage 1 formation approved, with plan-mode orchestration as the next action and no required operator input. |
| 0. Context And Boundary | Prior Work Item is fully closed. | pass | `docs/work/BANDIT-086/landing-action.md`, `docs/work/BANDIT-086/retrospective.md`, `docs/work/BANDIT-086/improvement-disposition.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` record `BANDIT-086` closed. |
| 0. Context And Boundary | Operator-input status is explicit. | pass | `CURRENT_CONTEXT.md`, `STATUS.md`, and the brief record `none_required` for the next action; PR/CI/CD policy, credential, remote-action, CI provider, merge/push/deploy, paid-routing, Trust Verifier, product, UAT, business, and cost/risk gates remain stop conditions. |
| 1. Repo PM Formation Complete | Brief exists and satisfies Stage 1. | pass | `docs/work/BANDIT-087/brief.md` contains source authority, bounded scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE read evidence, role boundaries, source-of-truth boundary, smell triggers, and expected files. |
| 1. Repo PM Formation Complete | Qwen formation review exists and is not blocking. | pass | `docs/work/BANDIT-087/qwen-formation-review.md` records `verdict: pass` and `findings_status: no_findings` through the authorized MLX adapter route. |
| 1. Repo PM Formation Complete | CodeRabbit formation review exists and is not blocking. | bootstrap_gap | `docs/work/BANDIT-087/coderabbit-formation-review.md` records the full 600-second provider timeout as replacement evidence with no CodeRabbit pass claimed. |
| 1. Repo PM Formation Complete | Aggregate formation review exists and is not blocking. | pass | `docs/work/BANDIT-087/formation-review.md` records aggregate `verdict: pass` with CodeRabbit timeout accepted only as bootstrap-gap replacement evidence. |
| 1. Repo PM Formation Complete | `coordination-log.jsonl` records `formation_approved`. | pass | `docs/work/BANDIT-087/coordination-log.jsonl` sequence 2 records `state":"formation_approved"`. |
| 2. Stage 2 RED Checklist | Test Writer owns tests, fixtures, RED evidence, and acceptance mappings. | pass | Stage 2 will produce `docs/work/BANDIT-087/red-evidence.md`; Stage 3 Writer will have no test-surface authority. |
| 2. Stage 2 RED Checklist | RED evidence maps tests or verification plan to acceptance criteria. | pass | RED evidence will use a disposition-verification plan unless Stage 2 proves a concrete implementation need; acceptance mapping must cover local-record preservation and fail-closed remote-action approval. |
| 2. Stage 2 RED Checklist | Stage 3 Writer has zero test-edit authority. | pass | Brief role boundaries and this plan forbid Stage 3 edits to tests, fixtures, RED evidence, acceptance mappings, formation, review, landing, UAT, or retrospective evidence. |
| 2. Stage 2 RED Checklist | If Codex authors RED, Stage 3 routes to Claude/different model family. | pass | Codex PM/Test Writer will author Stage 2 evidence if needed, so Stage 3 dispatch routes to Claude Sonnet 4.6 first, then MiniMax-M3 only after Claude auth failure or 20-minute timeout/no-change evidence. |
| 2. Stage 2 RED Checklist | `red_recorded` is required before implementation. | pass | `node ./bin/bandit.mjs work-item-pm start BANDIT-087` must record this plan first; Stage 2 must then record `red_recorded` before Stage 3 dispatch. |
| 3. Stage 3 Implementation Checklist | Implementation Writer owns source/chore delivery only. | pass | Stage 3 will own only bounded policy disposition delivery, writer report, and implementation evidence unless Stage 2 proves a specific source change is required. |
| 3. Stage 3 Implementation Checklist | No Writer test-surface edits. | pass | Dispatch will explicitly forbid Writer edits to tests, RED evidence, acceptance mappings, review, landing, UAT, retrospective, routing files, and canonical history. |
| 3. Stage 3 Implementation Checklist | Focused tests pass or bootstrap gap is recorded. | pass | Expected commands: `node ./bin/bandit.mjs coordination validate BANDIT-087`, `node ./bin/bandit.mjs work-intake validate --json`, `npm run bandit -- validate`, and `git diff --check`; source tests run if code changes are introduced. |
| 3. Stage 3 Implementation Checklist | `implementation-evidence.md` and Writer report exist. | pass | Required Stage 3 artifacts: `docs/work/BANDIT-087/pr-cicd-landing-policy-disposition.md`, `docs/work/BANDIT-087/writer-report.md`, and `docs/work/BANDIT-087/implementation-evidence.md`. |
| 3. Stage 3 Implementation Checklist | PM acceptance verifies spec alignment and clean-code posture. | pass | Codex PM will review Stage 3 against the brief, RED evidence, and `CLEAN_CODE.md` before Stage 4. |
| 3. Stage 3 Implementation Checklist | Give Claude 20 minutes before interrupting unless auth fails. | pass | Stage 3 dispatch will run Claude Sonnet 4.6 with a 20-minute timeout/no-change allowance; MiniMax-M3 is fallback only after allowed failure. |
| 4. Stage 4 Review Checklist | CodeRabbit review or provider-refusal/bootstrap evidence. | pass | CodeRabbit must run for the full 10-minute timeout window or record provider-refusal/bootstrap-gap evidence without claiming a pass. |
| 4. Stage 4 Review Checklist | Local Qwen review. | pass | Local Qwen must run only through `.bandit/reviewers/local-qwen.json` via `node bin/omlx-chat-completions.mjs`; if unavailable, halt for operator help. |
| 4. Stage 4 Review Checklist | Escalated review if policy smells require it. | pass | Expected `not_applicable` if Stage 3 remains disposition-only with no source, dependency, CI/release workflow, scheduler, claim/worktree, merge/push/deploy, paid routing, credential, or product-surface changes. |
| 4. Stage 4 Review Checklist | Risk classification. | pass | Record layered risk-classification evidence before landing, especially if any later scope touches CI/release, PR metadata, external input, credential, merge/push/deploy, or policy surfaces. |
| 4. Stage 4 Review Checklist | Supply-chain gate when applicable. | pass | Record supply-chain gate evidence; expected low/not-applicable if no code, dependency, workflow, package script, fetched prompt, or external-tool surface changes. |
| 4. Stage 4 Review Checklist | Every finding repaired or dispositioned. | pass | PM disposition must be recorded in `review-evidence.md` and any finding-disposition artifact before Stage 5. |
| 4. Stage 4 Review Checklist | Aggregate review evidence current for the review subject. | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-087` must be current after risk/supply-chain evidence is staged. |
| 5. Stage 5 Landing Checklist | Landing verdict exists. | pass | Required artifact: `docs/work/BANDIT-087/landing-verdict.md`. |
| 5. Stage 5 Landing Checklist | Feature UAT handled when applicable. | not_applicable | `BANDIT-087` is a non-product policy triage chore; UAT remains not applicable unless Stage 3 changes an operator-facing product surface. |
| 5. Stage 5 Landing Checklist | `land-check` passes. | pass | Required command: `node ./bin/bandit.mjs land-check BANDIT-087` before local-record landing. |
| 5. Stage 5 Landing Checklist | `landing-action.md` records commit SHA or merge evidence. | pass | Required command: `node ./bin/bandit.mjs land BANDIT-087 --action local-record` after a focused source/evidence commit and source-head/hash refresh. |
| 5. Stage 5 Landing Checklist | No next Work Item starts before landing action exists. | pass | Installed-Copy Update Path and later queue items remain blocked until `BANDIT-087` landing action and closeout complete. |
| 6. Stage 6 Closeout Checklist | Retrospective exists. | pass | Required artifact: `docs/work/BANDIT-087/retrospective.md`. |
| 6. Stage 6 Closeout Checklist | Structured improvement mining complete. | pass | Retrospective must explicitly mine tool friction, source-evidence pressure, reviewer availability, policy-scope tension, cost/latency, and unresolved uncertainty. |
| 6. Stage 6 Closeout Checklist | Every lesson has durable disposition. | pass | Required artifact: `docs/work/BANDIT-087/improvement-disposition.md` or explicit no-action/deferred disposition in retrospective. |
| 6. Stage 6 Closeout Checklist | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed. | pass | Closeout must keep the last closed work item as active derived-status anchor and route next to Installed-Copy Update Path if authorized. |
| 6. Stage 6 Closeout Checklist | Cockpit status and session-context agree. | pass | Required final commands: `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json`. |
| 6. Stage 6 Closeout Checklist | `validate` and `git diff --check` pass. | pass | Required final commands include `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-087`, and `git diff --check`; Stage 6 final validation should not rerun land-check after an evidence-only closeout commit. |

## Required Evidence

| Stage | Accountable role | Required artifact or command evidence |
| --- | --- | --- |
| Plan Mode | Work Item PM | `docs/work/BANDIT-087/orchestration-plan.md` and `coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | Test Writer | `docs/work/BANDIT-087/red-evidence.md` and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | Implementation Writer | `docs/work/BANDIT-087/pr-cicd-landing-policy-disposition.md`, `docs/work/BANDIT-087/writer-report.md`, `docs/work/BANDIT-087/implementation-evidence.md`, focused verification, and `implementation_recorded`. |
| Stage 4 | Reviewers / Codex PM disposition | `docs/work/BANDIT-087/coderabbit-review.md` or timeout evidence, `docs/work/BANDIT-087/local-qwen-review.md`, risk/supply-chain/input-quarantine/operator-boundary evidence, `docs/work/BANDIT-087/review-evidence.md`, review-subject hash, and `review_recorded`. |
| Stage 5 | Landing Agent | `docs/work/BANDIT-087/landing-verdict.md`, `land-check`, focused commit, `docs/work/BANDIT-087/landing-action.md`, and `landed`. |
| Stage 6 | Closeout Agent / Codex PM | `docs/work/BANDIT-087/retrospective.md`, `docs/work/BANDIT-087/improvement-disposition.md`, roadmap/current-context/status sync, validation, and `closed`. |

## Role Boundaries

Repo PM owned Stage 1 formation and may not be used by Work Item PM to
re-approve formation. Work Item PM owns this plan and stage orchestration after
`formation_approved`. Test Writer owns Stage 2 RED evidence and acceptance
mappings. Implementation Writer owns only bounded Stage 3 disposition or source
delivery artifacts. Reviewers own Stage 4 review outputs. Landing Agent owns
Stage 5 landing verdict and landing action. Closeout Agent owns Stage 6
retrospective and improvement/no-action disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-087`.

Bootstrap Model-Family Separation: if Codex authors Stage 2 RED/disposition
evidence, Stage 3 routes to Claude Sonnet 4.6 first. MiniMax-M3 is fallback only
after Claude auth failure or the required 20-minute timeout/no-change condition.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-087
node ./bin/bandit.mjs coordination validate BANDIT-087
node ./bin/bandit.mjs work-intake validate --json
node ./bin/bandit.mjs review-subject-hash BANDIT-087
node ./bin/bandit.mjs risk-classification validate --json
node ./bin/bandit.mjs supply-chain-gate validate --json
node ./bin/bandit.mjs land-check BANDIT-087
node ./bin/bandit.mjs land BANDIT-087 --action local-record
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run `npm run typecheck` and `npm test` only if Stage 3 changes source code,
shared validators, command routing, artifact renderers, cockpit/session-context
projections, policy validators, package scripts, dependencies, workflow files,
or lockfiles.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current action.

Halt for operator input if future evidence would approve PR/CI/CD policy,
remote publication, GitHub credential usage, branch-protection changes, CI
provider configuration, merge/push/deploy authority, deployment/canary
behavior, hosted services, public benchmark publication, paid routing, Trust
Verifier cutover, old-gate replacement or wrapping, product or UAT direction,
business tradeoffs, explicit cost/risk posture, live reviewer/model routing, or
another policy/product decision repo artifacts cannot answer.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-087` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED/disposition checks to acceptance criteria.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- Claude is unavailable and MiniMax-M3 fallback is unavailable.
- Local Qwen is unavailable through the authorized MLX adapter route.
- CodeRabbit returns actionable findings that are not repaired or dispositioned.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, input-quarantine/operator-boundary
  evidence, review-subject hash, land-check, coordination validation, Bandit
  validation, or diff hygiene fails.
- Any step requires operator-owned policy, product, UAT, business, cost/risk,
  PR/CI/CD, credential, branch-protection, merge/push/deploy, paid-routing,
  hosted-service, Trust Verifier cutover, scheduler, local API, State Index,
  claim/worktree, or browser-action approval.

## Forbidden Actions

Do not create a GitHub PR, push to a remote, merge, deploy, change branch
protection, configure CI, add deploy/canary automation, write GitHub Actions
workflow files, provision credentials, install external services, approve paid
routing, publish public benchmarks, approve Trust Verifier cutover, replace or
wrap local-record landing, approve remote publication, implement local API or
State Index behavior, start scheduler behavior, implement claim/worktree
lifecycle behavior, execute guarded browser actions, or start unrelated Phase 8
work.

Do not make GitHub, CI provider status, PR comments, branch metadata,
deployment status, cockpit output, session-context packets, work-intake
entries, roadmap text, cache, database, static preview, or report output
canonical workflow authority. `.bandit/policy/landing-agent.json` remains the
current Landing Agent source of truth, with local-record as the only supported
landing action until a later operator-approved policy changes it.
