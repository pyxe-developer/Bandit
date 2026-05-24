# BANDIT-013: Auto-Landing Eligibility Policy And Check

## Status

Phase 5 work-item brief created on 2026-05-24. RED evidence is recorded in
`docs/work/BANDIT-013/red-evidence.md`. Production implementation evidence is
recorded in `docs/work/BANDIT-013/implementation-evidence.md`. Review, landing
verdict, landing action, and retrospective evidence remain required before this
work item can land.

## Goal

Define the first repo-native auto-landing eligibility policy and a read-only
CLI check that decides whether a chore or UAT-approved feature slice is eligible
for a future Landing Agent to land.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
`BANDIT-012` separated operator-owned product UAT from agent-owned code-safety
judgment. `BANDIT-013` turns that gate state into an explicit auto-landing
eligibility decision while keeping actual merge or deploy behavior out of scope.

## Origin

- `AGENTS.md` defines auto-landing scope for chores and UAT-approved feature
  slices after required non-code approvals and mechanical gates are green.
- `docs/roadmap/CURRENT_CONTEXT.md` names auto-landing eligibility policy as the
  next Phase 5 work item.
- `docs/roadmap/ROADMAP.md` lists auto-landing eligibility policy as the
  remaining Phase 5 capability.
- `.bandit/bootstrap-gaps.json` tracks `BANDIT-GAP-LANDING-AGENT` as the open
  gap whose next action is the Phase 5 auto-landing policy path.
- `docs/work/BANDIT-012/landing-action.md` records the previous work item as
  landed, so the slice boundary allows this work item to begin.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-012
source_artifacts:
  - AGENTS.md
  - .bandit/bootstrap-gaps.json
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-012/landing-action.md
lesson: Auto-landing must be a policy decision over current gate evidence before any agent is allowed to merge.
hypothesis: A repo-native policy artifact plus `bandit auto-land-check <work-item-id>` will let future Landing Agent work distinguish eligible chores and UAT-approved feature slices from blocked or operator-owned cases without chat reconstruction.
metric: `bandit auto-land-check <work-item-id>` reports eligible only for safe-to-land chores with UAT not applicable or safe-to-land feature slices with current UAT approval, and blocks all stale, missing-approval, unsafe, or requires-operator-approval cases.
baseline: `bandit land-check <work-item-id>` verifies landing gates, but no explicit auto-landing policy artifact or eligibility report exists.
expected_direction: Future Landing Agent work can consume a deterministic eligibility decision instead of reinterpreting gate artifacts.
evaluation_window: Evaluate at `BANDIT-013` closeout and again before implementing actual merge automation.
status: pending
outcome: pending

## Scope

- Add a versioned repo-native auto-landing policy artifact under
  `.bandit/policy/auto-landing.json`.
- Validate the policy artifact during `bandit validate`, including supported
  version, boolean safety switches, and fail-closed malformed-policy errors.
- Add a read-only `bandit auto-land-check <work-item-id>` command that evaluates
  current landing evidence against the policy without merging, committing, or
  changing remote state.
- Classify eligible work into `chore` and `feature_slice` for the purpose of the
  eligibility report. During bootstrap, infer this narrowly from UAT state:
  `not_applicable` means chore or non-product workflow work; `pass` with current
  approval means feature slice.
- Require `safe-to-land`, current source evidence, passing required gates, and
  current UAT approval for feature slices before reporting eligibility.
- Fail closed with actionable messages for missing work items, missing or
  malformed policy, missing UAT, stale evidence, unsafe landing verdicts, or
  operator-approval-required cases.
- Preserve the operator input boundary: the command may report eligibility from
  repo evidence, but it must not infer product UAT or ask the operator to judge
  code-safety warnings.
- Record implementation, review, landing, retrospective, and context evidence
  during later stages of this chore.

## Out Of Scope

- Performing a merge, squash, rebase, push, deploy, or local commit.
- A production Landing Agent that repairs findings or lands PRs.
- Live GitHub or CodeRabbit polling.
- Live escalated reviewer routing.
- Workflow Cockpit UI or SQLite indexing.
- Heartbeat chore-agent behavior.
- Product-specific UAT execution or acceptance content.
- Broad work-item type taxonomy beyond the minimal eligibility classes needed
  for Phase 5.

## Acceptance Criteria

1. RED evidence demonstrates that no `bandit auto-land-check <work-item-id>`
   command exists yet.
2. A versioned `.bandit/policy/auto-landing.json` contract exists with explicit
   safe-to-land, current-source, chore, UAT-approved feature-slice, and
   no-merge policy switches.
3. `bandit init` creates the default auto-landing policy artifact.
4. `bandit validate` validates the policy artifact and rejects malformed or
   unsupported policy values with `Malformed auto-landing policy` errors.
5. `bandit auto-land-check <work-item-id>` reports `eligible` for a
   safe-to-land chore or workflow-infrastructure item whose UAT status is
   `not_applicable`.
6. `bandit auto-land-check <work-item-id>` reports `eligible` for a
   safe-to-land feature slice only when current UAT approval evidence exists.
7. `bandit auto-land-check <work-item-id>` blocks when UAT is claimed as `pass`
   but current UAT approval evidence is missing or stale.
8. `bandit auto-land-check <work-item-id>` blocks when `land-check` would block,
   including stale source evidence, missing review evidence, unresolved gates,
   or a non-`safe-to-land` landing verdict.
9. `bandit auto-land-check <work-item-id>` does not mutate source, landing
   artifacts, git state, or remotes.
10. Output distinguishes work item, eligibility, eligibility class, UAT
    requirement, policy artifact, and blocking reasons so future Landing Agent
    work can consume the decision.
11. Focused tests cover eligible chore, eligible UAT-approved feature slice,
    missing UAT block, malformed policy validation, unknown work item or missing
    command usage, and no-merge behavior.
12. Existing validation, review, local Qwen, CodeRabbit, escalated-review, UAT,
    bootstrap-gap, and landing-gate tests continue to pass.
13. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and
    `git diff --check` pass before landing.
14. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in `test/landing-gates.test.mjs` for:
  - eligible chore or workflow-infrastructure work with UAT not applicable;
  - eligible feature slice with current UAT approval;
  - blocked feature slice with missing current UAT approval;
  - malformed auto-landing policy validation.
- Run focused RED tests and record output in
  `docs/work/BANDIT-013/red-evidence.md` before production implementation.
- Implement the smallest policy parser, validator, CLI command, and report
  formatter needed to satisfy the acceptance criteria.
- Run focused and full tests, typecheck, Bandit validation, representative
  `bandit auto-land-check` commands, and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item. The
acceptance criteria make clean-code compliance evaluable through narrow scope,
explicit policy state, read-only command behavior, fail-closed eligibility
checks, clear source-of-truth boundaries, and preserved operator/Codex PM
responsibilities.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` name Phase 5, no active work before this brief, `BANDIT-012` landing-action evidence, and auto-landing eligibility policy as the next action. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-013/red-evidence.md` records focused failing tests for missing auto-land command behavior and malformed policy validation. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `docs/work/BANDIT-013/implementation-evidence.md` records focused and full verification plus the clean-code self-check. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live CodeRabbit polling, live escalated reviewer routing, and production Landing Agent behavior remain bootstrap-limited; replacement evidence is required during closeout. |
| Stage 5: Landing And UAT | `bootstrap_gap` | This chore builds auto-landing eligibility substrate; UAT is not required to accept this non-product workflow-infrastructure work item. Landing Agent remains unavailable. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Hidden authority:** Eligibility must come from repo-native policy and gate
  artifacts, not chat, UI state, or implied PR status.
- **Missing product acceptance:** Feature slices must not become eligible unless
  current UAT approval evidence exists.
- **Stale evidence:** Any source change after review, landing verdict, reviewer
  evidence, or UAT must block eligibility.
- **Weak refusal path:** Missing or malformed policy and missing gate artifacts
  must fail closed with actionable messages.
- **Role erosion:** The check can report eligibility, but it cannot perform
  product UAT, merge work, or override operator-owned approvals.
- **Parser/validator mismatch:** The policy parser, validator, init default, and
  auto-land check must share the same contract.
- **Escalation plan:** Codex PM owns technical routing and implementation order.
  Operator input is required only for product UAT, policy changes beyond this
  brief, or explicit merge-risk/cost overrides.

## Bootstrap Gaps

- No auto-landing eligibility policy artifact exists yet.
- No `bandit auto-land-check <work-item-id>` command exists yet.
- Landing Agent remains unavailable.
- Live CodeRabbit polling and repair orchestration remain unavailable.
- Live escalated adversarial reviewer routing remains unavailable.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Expected Files

- `docs/work/BANDIT-013/brief.md`
- `docs/work/BANDIT-013/red-evidence.md`
- `docs/work/BANDIT-013/implementation-evidence.md`
- `docs/work/BANDIT-013/review-evidence.md`
- `docs/work/BANDIT-013/local-qwen-review.md`
- `docs/work/BANDIT-013/escalated-review.md`
- `docs/work/BANDIT-013/landing-verdict.md`
- `docs/work/BANDIT-013/landing-action.md`
- `docs/work/BANDIT-013/retrospective.md`
- `.bandit/policy/auto-landing.json`
- `src/state/auto-landing-policy.ts`
- `src/commands/auto-land-check.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `test/landing-gates.test.mjs`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect existing `land-check`, UAT, landing-verdict, review-evidence,
   validation, and init state patterns.
2. Add focused RED tests for eligible chore, eligible UAT-approved feature
   slice, missing UAT block, and malformed policy validation.
3. Run focused RED tests and record evidence.
4. Implement auto-landing policy parser and validator.
5. Add default policy creation during `bandit init`.
6. Add `bandit auto-land-check <work-item-id>` as a read-only command that
   reuses existing landing-readiness logic instead of duplicating gate rules.
7. Run focused and full verification.
8. Record implementation, review, landing, retrospective, and context evidence.

## Required Evidence

- `docs/work/BANDIT-013/red-evidence.md`
- `docs/work/BANDIT-013/implementation-evidence.md`
- `docs/work/BANDIT-013/review-evidence.md`
- `docs/work/BANDIT-013/local-qwen-review.md`
- `docs/work/BANDIT-013/escalated-review.md` when routing requires a placeholder
  or records `not_applicable`
- `docs/work/BANDIT-013/landing-verdict.md`
- `docs/work/BANDIT-013/landing-action.md`
- `docs/work/BANDIT-013/retrospective.md`
- Updated `docs/roadmap/CURRENT_CONTEXT.md`
- Updated `docs/roadmap/ROADMAP.md`

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the routing decision: create the auto-landing eligibility
policy and read-only eligibility check.

Actual product UAT approval for future feature slices remains operator-owned.
Actual merge, deploy, cost, or risk overrides remain operator-owned until a
future Landing Agent policy explicitly authorizes them.
