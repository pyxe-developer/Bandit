# BANDIT-014: Landing Agent Bootstrap Gap Resolution

## Status

Bootstrap-gap chore brief created on 2026-05-24. RED evidence is recorded in
`docs/work/BANDIT-014/red-evidence.md`. Implementation evidence, review
evidence, landing verdict, landing action, and retrospective evidence remain
required before this work item can land or the next bootstrap gap chore can
begin.

## Goal

Convert `BANDIT-GAP-LANDING-AGENT` from an open bootstrap gap into the first
durable Landing Agent contract and CLI-owned execution surface that can land
eligible work under Bandit's repo-native policy without asking the operator to
make routine code-safety decisions.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice. The
auto-landing eligibility policy and read-only `bandit auto-land-check
<work-item-id>` command exist, but actual landing is still manual bootstrap
work. This chore defines and implements the smallest safe Landing Agent
behavior that consumes existing gate evidence and records landing action
evidence.

## Origin

- `AGENTS.md` requires an agent-owned landing verdict and forbids asking the
  operator to decide routine code-safety warnings.
- `docs/plans/BOOTSTRAP_METHODOLOGY.md` names Landing Agent unavailability as a
  bootstrap gap that must be recorded honestly until replaced by durable
  behavior.
- `.bandit/bootstrap-gaps.json` tracks `BANDIT-GAP-LANDING-AGENT` as the first
  open bootstrap-gap resolution chore after `BANDIT-013`.
- `docs/roadmap/CURRENT_CONTEXT.md` and `docs/roadmap/ROADMAP.md` require one
  bootstrap-gap chore at a time, starting with the Landing Agent gap.
- `docs/work/BANDIT-013/landing-action.md` records the previous work item as
  landed, so the slice boundary allows this chore to begin.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-013
source_gap: BANDIT-GAP-LANDING-AGENT
source_artifacts:
  - AGENTS.md
  - .bandit/bootstrap-gaps.json
  - docs/plans/BOOTSTRAP_METHODOLOGY.md
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-013/landing-action.md
lesson: Manual bootstrap landing is now the highest-priority open gap after auto-landing eligibility became deterministic.
hypothesis: A narrow Landing Agent contract and CLI command can land eligible work by consuming `auto-land-check`, current gate evidence, and repo state while failing closed on product UAT, stale evidence, dirty worktrees, remotes, and unsupported merge modes.
metric: A focused landing-agent command reports or performs exactly the authorized local landing action for eligible work, writes `docs/work/<ID>/landing-action.md`, and refuses ineligible, stale, dirty, or operator-owned cases with actionable messages.
baseline: `bandit auto-land-check <work-item-id>` can report eligibility, but no command or agent contract can execute or record the landing action.
expected_direction: Future bootstrap-gap chores can use a CLI-owned Landing Agent path instead of manual closeout commits when repo policy authorizes it.
evaluation_window: Evaluate at `BANDIT-014` closeout and again before live PR merge or remote integration work.
status: pending
outcome: pending

## Scope

- Define the Landing Agent's repo-native authority, inputs, refusal paths, and
  required evidence in a durable policy or agent-contract artifact.
- Add the smallest CLI-owned landing-agent command surface that consumes
  `bandit auto-land-check <work-item-id>` eligibility and current gate evidence.
- Keep the first implementation local and repo-native: write landing-action
  evidence and perform only explicitly supported local git actions if the
  approved contract allows them.
- Require a clean worktree or a narrowly documented staged-state policy before
  any landing action can run.
- Require current `safe-to-land`, current source evidence, current review gates,
  and current UAT approval for feature slices before landing.
- Fail closed when work is ineligible, evidence is stale, the policy is missing
  or malformed, the worktree is dirty, remote/PR merge behavior would be
  required, or operator-owned UAT, product, policy, business, cost, or risk
  input is missing.
- Write or update `docs/work/<ID>/landing-action.md` with the action type,
  source head, commit or merge SHA when available, verification commands, and
  next slice-boundary status.
- Update `.bandit/bootstrap-gaps.json` to resolve, block, or explicitly
  disposition `BANDIT-GAP-LANDING-AGENT` only when implementation evidence
  proves the gap is actually replaced or operator-owned input blocks it.
- Record RED evidence, implementation evidence, review evidence, local Qwen
  review, escalated-review disposition, landing verdict, landing action,
  retrospective, and context updates.

## Out Of Scope

- Live GitHub API merge orchestration, pull request comment polling, or remote
  branch management.
- Live CodeRabbit polling or repair orchestration.
- Live escalated reviewer routing or paid-model credential handling.
- Product UAT execution or acceptance by an agent.
- Workflow Cockpit UI, state index, or heartbeat chore-agent behavior.
- Broad rewrite of existing `land-check` or `auto-land-check` gate logic.
- Auto-resolving the later live CodeRabbit, live escalated reviewer, work-item
  creation, artifact creation, heartbeat chore-agent, or cockpit gaps.

## Acceptance Criteria

1. RED evidence demonstrates that Bandit has no Landing Agent command or
   durable Landing Agent contract that can execute and record landing actions.
2. A repo-native Landing Agent contract exists and defines authority, supported
   action types, required evidence, refusal paths, operator-owned boundaries,
   and bootstrap limitations.
3. A CLI command selected during RED/GREEN planning exposes the Landing Agent
   behavior without requiring chat context.
4. The command consumes the existing landing-readiness and auto-landing
   eligibility logic instead of reinterpreting gate artifacts independently.
5. Eligible non-product chores can be landed or landing-recorded only when
   current `safe-to-land`, review, source, UAT-not-applicable, and policy
   evidence are present.
6. Feature slices remain blocked unless current CLI-owned UAT approval exists;
   the command must not infer product acceptance.
7. Dirty worktrees, stale evidence, missing policy, malformed policy, unknown
   work items, unsupported remotes, and operator-approval-required verdicts fail
   closed with actionable messages.
8. The command does not perform unsupported merge, push, deploy, or remote
   operations.
9. Landing action evidence is written in
   `docs/work/<ID>/landing-action.md` with source head, action type, command
   evidence, and slice-boundary status.
10. `.bandit/bootstrap-gaps.json` links this chore while active and resolves or
    blocks `BANDIT-GAP-LANDING-AGENT` only with closeout evidence.
11. Focused tests cover eligible chore behavior, feature-slice UAT boundary,
    stale evidence refusal, dirty-worktree refusal, unsupported action refusal,
    and landing-action artifact validation.
12. Existing validation, review, local Qwen, CodeRabbit, escalated-review, UAT,
    bootstrap-gap, landing-gate, and auto-landing tests continue to pass.
13. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, representative
    landing-agent checks, and `git diff --check` pass before landing.
14. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in `test/landing-gates.test.mjs` or a new targeted
  landing-agent test file for:
  - missing Landing Agent command or contract;
  - eligible chore landing or landing-record behavior;
  - feature-slice refusal without current UAT approval;
  - stale evidence refusal;
  - dirty-worktree refusal;
  - unsupported merge, push, deploy, or remote behavior refusal;
  - landing-action artifact content.
- Run focused RED tests and record output in
  `docs/work/BANDIT-014/red-evidence.md` before production implementation.
- Implement the narrowest contract, parser or validator, command path, and
  artifact writer that satisfy the acceptance criteria.
- Run focused and full verification, including `npm test`, `npm run typecheck`,
  `npm run bandit -- validate`, representative landing-agent command checks,
  and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item. The
acceptance criteria make clean-code compliance evaluable through narrow scope,
explicit authority boundaries, reuse of existing gate logic, fail-closed
landing behavior, repo-native evidence, and preserved operator-owned UAT,
policy, business, cost, and risk boundaries.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` name Phase 5, no active work before this brief, `BANDIT-013` landing-action evidence, and `BANDIT-GAP-LANDING-AGENT` as the next bootstrap-gap chore. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-014/red-evidence.md` records focused failing tests for the missing Landing Agent contract, command, UAT boundary, dirty-worktree refusal, unsupported action refusal, and landing-action evidence. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live CodeRabbit polling and live escalated reviewer routing remain bootstrap-limited; replacement evidence is required during closeout. |
| Stage 5: Landing And UAT | `bootstrap_gap` | This chore exists to replace the Landing Agent bootstrap gap; UAT is not required for this non-product workflow-infrastructure chore. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Hidden authority:** Landing authority must come from repo-native policy and
  gate artifacts, not chat, terminal history, or UI state.
- **Role erosion:** The Landing Agent may decide routine code-safety landing
  from policy, but it cannot supply product UAT or override operator-owned
  product, policy, business, cost, or risk decisions.
- **Stale evidence:** Source drift after review, UAT, or landing verdict must
  block landing.
- **Weak refusal path:** Missing or malformed policy, dirty worktrees, unknown
  work items, and unsupported remotes must fail closed.
- **Parser/validator mismatch:** The contract, validator, command behavior, and
  landing-action artifact must share the same supported values.
- **Over-broad automation:** This chore must avoid live remote merge/push/deploy
  behavior until those contracts and credentials are explicitly designed.
- **Escalation plan:** Codex PM owns technical routing and implementation order.
  Operator input is required only for product UAT, policy changes beyond this
  brief, explicit merge/deploy risk overrides, business tradeoffs, or cost
  decisions.

## Bootstrap Gaps

- No Landing Agent contract or command exists yet.
- Live CodeRabbit polling and repair orchestration remain unavailable.
- Live escalated adversarial reviewer routing remains unavailable.
- No general work-item creation command exists yet.
- No general artifact creation command exists yet.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Expected Files

- `docs/work/BANDIT-014/brief.md`
- `docs/work/BANDIT-014/red-evidence.md`
- `docs/work/BANDIT-014/implementation-evidence.md`
- `docs/work/BANDIT-014/review-evidence.md`
- `docs/work/BANDIT-014/local-qwen-review.md`
- `docs/work/BANDIT-014/escalated-review.md`
- `docs/work/BANDIT-014/landing-verdict.md`
- `docs/work/BANDIT-014/landing-action.md`
- `docs/work/BANDIT-014/retrospective.md`
- `.bandit/bootstrap-gaps.json`
- A Landing Agent policy or contract artifact under `.bandit/policy/` or the
  nearest existing policy location.
- A Landing Agent command implementation under `src/commands/`.
- Shared state or artifact helpers only where needed to avoid duplicating
  landing-readiness and auto-landing logic.
- Focused tests in `test/landing-gates.test.mjs` or a targeted new test file.
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect existing `land-check`, `auto-land-check`, landing-action evidence,
   UAT, review, git-state, validation, and policy parsing patterns.
2. Add focused RED tests for the missing Landing Agent contract or command,
   eligible chore behavior, UAT boundary, stale evidence refusal, dirty-worktree
   refusal, unsupported action refusal, and landing-action evidence.
3. Run focused RED tests and record evidence.
4. Define the Landing Agent contract and validation path.
5. Implement the narrow CLI command by reusing existing landing-readiness and
   auto-landing eligibility logic.
6. Implement landing-action evidence writing for the supported local bootstrap
   action.
7. Run focused and full verification.
8. Record implementation, review, landing, retrospective, gap-ledger, and
   context evidence.

## Required Evidence

- `docs/work/BANDIT-014/red-evidence.md`
- `docs/work/BANDIT-014/implementation-evidence.md`
- `docs/work/BANDIT-014/review-evidence.md`
- `docs/work/BANDIT-014/local-qwen-review.md`
- `docs/work/BANDIT-014/escalated-review.md` when routing requires a placeholder
  or records `not_applicable`
- `docs/work/BANDIT-014/landing-verdict.md`
- `docs/work/BANDIT-014/landing-action.md`
- `docs/work/BANDIT-014/retrospective.md`
- Updated `.bandit/bootstrap-gaps.json`
- Updated `docs/roadmap/CURRENT_CONTEXT.md`
- Updated `docs/roadmap/ROADMAP.md`

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the routing decision: create the Landing Agent bootstrap-gap
chore and proceed to RED evidence.

Operator input remains required for product UAT, policy changes beyond this
brief, business tradeoffs, explicit merge/deploy risk overrides, and cost
decisions. Live remote merge behavior is out of scope for this chore unless the
operator later provides explicit policy and risk approval.
