# BANDIT-089 Orchestration Plan

contract_version: 1
work_item: BANDIT-089
work_type: slice
current_coordination_state: formation_approved
created_at: 2026-06-10T03:29:00Z
author: work_item_pm

## Current Repo State

`BANDIT-089` is the active formed and formation-approved work item for
`PRD-004.1` - Trust Boundary Evidence Schema Contracts. The current repo
routing files, derived cockpit status, session-context packet, and coordination
log agree that Work Item PM must record plan-mode orchestration before Stage 2
RED evidence.

`BANDIT-088` is the last closed work item. Its landing action, retrospective,
improvement disposition, work-intake closeout, roadmap, current-context, and
status evidence are present. No open bootstrap gap blocks `BANDIT-089`.

`BANDIT-089` is bounded to schema-only, fail-closed trust-boundary evidence
contracts for Boundary Contour, Boundary Prediction Record, Notify-And-Revert
Artifact, validation, and land-check gating. This plan does not authorize
expanded landing autonomy, Notify-And-Revert execution, Auto-Landing Scope,
PRD-005 work, the V0 Closeout Claude Code A/B Product-Value Trial, Trust
Verifier cutover, cockpit UI, local API, State Index, hosted services,
telemetry, paid routing, public benchmark publication, merge, push, deploy, or
unrelated Phase 8 work.

## Stage Sequence

| Stage | Accountable role | Required transition | Notes |
| --- | --- | --- | --- |
| Plan Mode | Work Item PM | `orchestration_plan_recorded` | This plan must be recorded before RED evidence. |
| Stage 2 RED | Test Writer | `red_recorded` | Write failing tests for boundary contour validation, Boundary Prediction Record validation, Notify-And-Revert Artifact validation, land-check autonomy evidence requirements, and ordinary safe-to-land non-regression. |
| Stage 3 Implementation | Implementation Writer | `implementation_recorded` | Implement only the smallest policy, template, validator, validate, and land-check changes needed to satisfy RED tests. If Codex authors RED tests, route implementation to a different model family. |
| Stage 4 Review | Reviewers / Codex PM | `review_recorded` | Run CodeRabbit or honest timeout/refusal evidence, Local Qwen through the authorized MLX route, aggregate review, review-subject hash, and applicable risk/supply-chain/input-quarantine checks. |
| Stage 5 Landing | Landing Agent | `landing_verdict_recorded`, then `landed` | Write landing verdict, run land-check, and record local landing action only if gates pass. |
| Stage 6 Closeout | Closeout Agent | `closed` | Record retrospective, improvement/no-action disposition, current context, roadmap, STATUS, coordination validation, Bandit validation, cockpit/session-context agreement, and diff hygiene. |

## Required Evidence

| Stage | Required artifact or command evidence |
| --- | --- |
| Plan Mode | `docs/work/BANDIT-089/orchestration-plan.md` and `docs/work/BANDIT-089/coordination-log.jsonl` `orchestration_plan_recorded`. |
| Stage 2 | `docs/work/BANDIT-089/red-evidence.md`, RED test files, and `coordination-log.jsonl` `red_recorded`. |
| Stage 3 | `.bandit/policy/boundary-contour.json`, `docs/templates/boundary-prediction-record.md`, `docs/templates/notify-and-revert-artifact.md`, `src/state/boundary-autonomy.ts`, any focused land-check/validate integration, `docs/work/BANDIT-089/implementation-evidence.md`, `docs/work/BANDIT-089/writer-report.md`, and `implementation_recorded`. |
| Stage 4 | `docs/work/BANDIT-089/coderabbit-review.md` or timeout/refusal evidence, `docs/work/BANDIT-089/local-qwen-review.md`, `docs/work/BANDIT-089/review-evidence.md`, review-subject hash, applicable risk/supply-chain/input-quarantine/operator-boundary evidence, and `review_recorded`. |
| Stage 5 | `docs/work/BANDIT-089/landing-verdict.md`, `node ./bin/bandit.mjs land-check BANDIT-089`, `docs/work/BANDIT-089/landing-action.md`, and `landed`. |
| Stage 6 | `docs/work/BANDIT-089/retrospective.md`, `docs/work/BANDIT-089/improvement-disposition.md`, synchronized `.bandit/work-intake-ledger.json` if state changes, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, and `closed`. |

## Role Boundaries

Repo PM owns Stage 1 formation and does not own Stage 2 RED, implementation,
review, landing, or closeout artifacts. Work Item PM owns this plan and stage
orchestration after `formation_approved`. Test Writer owns Stage 2 tests,
fixtures, RED evidence, and acceptance mappings. Implementation Writer owns
Stage 3 source/policy/template changes and implementation evidence only.
Reviewers own Stage 4 review outputs. Landing Agent owns Stage 5 landing
verdict and landing action. Closeout Agent owns Stage 6 retrospective and
improvement/no-action disposition evidence.

Permanent Test Ownership Boundary: the Stage 3 Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust tests, test
helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence, or
policy acceptance criteria for `BANDIT-089`.

Bootstrap Model-Family Separation: if Codex authors Stage 2 RED tests, Stage 3
implementation routes to Claude or another non-Codex model family unless an
operator-approved policy exception is recorded.

## Verification Commands

```sh
node ./bin/bandit.mjs work-item-pm start BANDIT-089
node ./bin/bandit.mjs coordination validate BANDIT-089
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
node ./bin/bandit.mjs review-subject-hash BANDIT-089
node ./bin/bandit.mjs land-check BANDIT-089
node ./bin/bandit.mjs land BANDIT-089 --action local-record
git diff --check
```

Run focused tests first during Stage 2/3. Full `npm test` is expected before
landing because this slice touches shared validation and landing-gate behavior.

## Known Blockers

No known blocker exists at plan time. Required operator input is
`none_required` for the current action.

Halt for operator input if future evidence would expand landing autonomy,
approve Notify-And-Revert or Auto-Landing Scope for a new boundary cell, change
product or UAT direction, approve public benchmark claims, approve paid/live
reviewer or model routing, approve hosted services, approve telemetry, approve
merge/push/deploy authority, approve Trust Verifier cutover, approve external
side effects, or resolve genuinely ambiguous product, business, policy, or
explicit cost/risk scope.

## Stop Conditions

- Formation evidence becomes missing, stale, contradictory, or blocked.
- `work-item-pm start BANDIT-089` fails to record or validate
  `orchestration_plan_recorded`.
- Stage 2 cannot map RED tests to acceptance criteria.
- Stage 3 Writer edits any Test Writer-owned or future-stage surface.
- A validator silently accepts malformed boundary contour, Boundary Prediction
  Record, Notify-And-Revert Artifact, unsupported enum, missing evidence, or
  non-existent authorizing cell input.
- land-check blocks ordinary safe-to-land flows without a `notify_and_revert`
  or `auto_land` autonomy claim.
- Local Qwen is unavailable through the authorized MLX adapter route.
- CodeRabbit returns actionable findings that are not repaired or
  dispositioned.
- Escalated review is required but no permitted reviewer path is available.
- Risk classification, supply-chain gate, input-quarantine/operator-boundary
  evidence, review-subject hash, land-check, coordination validation, Bandit
  validation, typecheck, tests, cockpit/session-context agreement, or diff
  hygiene fails.

## Forbidden Actions

Do not grant new Notify-And-Revert or Auto-Landing authority, execute rollback
or landing actions outside the existing local-record path, start PRD-005 work,
start the V0 Closeout Claude Code A/B Product-Value Trial, approve Trust
Verifier cutover, create cockpit UI, local API, State Index, hosted services,
telemetry, paid routing, public benchmark publication, merge, push, deploy,
installed-copy update behavior, PR/CI/CD implementation, scheduler behavior,
claim/worktree lifecycle behavior, guarded browser actions, or unrelated Phase
8 work.

Do not make cockpit output, session-context packets, work-intake entries,
templates, generated JSON, static previews, cache state, update manifests,
package registries, or report output canonical workflow authority. The
Boundary Contour policy is declarative data interpreted by CLI validators; it
does not by itself authorize expanded landing autonomy.
