# BANDIT-010: Escalated Adversarial Reviewer Placeholder

## Status

Bootstrap work item created on 2026-05-24. Production implementation has not
started.

## Goal

Add the narrow Phase 4 placeholder behavior that lets Bandit record when smell
triggers require adversarial review beyond the baseline local Qwen gate, without
pretending a live paid-model or second-reviewer integration exists.

## Non-Product Work

This is a workflow-infrastructure bootstrap slice. `BANDIT-009` repaired the
baseline local Qwen reviewer so real Bandit review packets can return structured
output through direct local oMLX. The next Phase 4 gap is not final reviewer
routing; it is a repo-native contract for required escalation evidence and
fail-closed landing behavior when policy says baseline local Qwen is not enough.

## Origin

- `docs/roadmap/CURRENT_CONTEXT.md` and `docs/roadmap/ROADMAP.md` identify the
  escalated adversarial reviewer placeholder as the next Phase 4 work item.
- `docs/work/BANDIT-009/landing-action.md` records the prior slice as landed at
  final implementation source head `8634d256eb1409e7c31f5b9baf74223480745167`.
- `AGENTS.md` and `CONTEXT.md` require stronger or second reviewers to be
  selected by policy smells, not operator choice.

## Scope

- Define the repo-native escalated adversarial reviewer placeholder artifact
  contract for work items whose routing or smell evidence requires review
  beyond baseline local Qwen.
- Add a reviewer profile or policy fixture that clearly represents an
  unavailable escalated reviewer without becoming live paid-model routing.
- Add validation for escalated-review placeholder artifacts, including required
  source head, trigger rationale, reviewer profile identifier, availability
  state, verdict, disposition, and bootstrap-gap evidence.
- Integrate the placeholder into `bandit land-check <work-item-id>` so required
  escalated review fails closed unless current evidence is present or an honest
  `bootstrap_gap` is recorded.
- Preserve the existing local Qwen baseline reviewer gate and CodeRabbit state
  behavior.
- Update work-item evidence, roadmap context, and closeout artifacts so a cold
  session can tell whether escalated review is unavailable, not required, or
  satisfied by bootstrap placeholder evidence.

## Out Of Scope

- Live paid-model reviewer routing.
- Automatic smell-trigger inference beyond the current catalog and routing
  artifacts.
- Final Landing Agent behavior.
- UAT artifacts or stale-UAT policy.
- PR merge automation.
- Live CodeRabbit/GitHub polling or repair orchestration.
- Workflow cockpit or SQLite indexing.
- Replacing the local Qwen baseline reviewer or weakening the direct local oMLX
  route delivered by `BANDIT-009`.

## Acceptance Criteria

1. RED evidence demonstrates that a work item requiring escalated adversarial
   review is not currently enforced by `bandit land-check <work-item-id>`.
2. The escalated review placeholder artifact has a documented, validated schema
   with source head, trigger rationale, reviewer profile, availability status,
   verdict, disposition, and bootstrap-gap evidence.
3. `bandit land-check <work-item-id>` fails closed when routing or smell
   evidence requires escalated review and no current escalated-review artifact
   exists.
4. `bandit land-check <work-item-id>` accepts an explicit current
   `bootstrap_gap` placeholder only when the artifact records why live
   escalated review is unavailable and how the gap is dispositioned for
   bootstrap.
5. Stale escalated-review placeholder evidence is rejected when the source head
   no longer matches the current repository head or the relevant review packet
   source.
6. The implementation does not ask the operator to select reviewers, waive
   technical routing, or judge routine code-safety warnings.
7. Deterministic tests cover required-escalation missing evidence,
   bootstrap-gap placeholder acceptance, stale placeholder rejection, and
   non-required escalated review remaining `not_applicable`.
8. Existing CodeRabbit, local Qwen, review-evidence, landing-verdict, and
   validation behavior continue to pass.
9. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and
   `git diff --check` pass before landing.
10. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Test Plan

- Add focused RED tests in the nearest existing land-check, review-evidence, or
  reviewer-profile test file for:
  - required escalated review with no artifact failing closed;
  - current explicit `bootstrap_gap` placeholder satisfying the bootstrap
    contract;
  - stale escalated-review placeholder rejection;
  - no smell-trigger requirement producing `not_applicable` rather than a
    false blocker.
- Run focused tests before implementation and record RED output in
  `docs/work/BANDIT-010/red-evidence.md`.
- Implement the smallest production change needed to satisfy the placeholder
  contract.
- Run focused tests, full tests, typecheck, Bandit validation, and
  `git diff --check`.
- Run `bandit land-check` against `BANDIT-010` or a fixture work item after
  implementation and record the result.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item.
The acceptance criteria make clean-code compliance evaluable through narrow
scope, explicit source-of-truth artifacts, fail-closed gate behavior, testable
state transitions, readable reviewer-routing boundaries, and preserved
Codex PM/operator responsibilities.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` show Phase 4, no active work before this brief, `BANDIT-009` landing-action evidence, and escalated adversarial reviewer placeholder behavior as the next action. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | Required before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | This work item creates placeholder enforcement for escalated review; live escalated reviewer routing, live CodeRabbit polling, and Landing Agent behavior remain bootstrap-limited. |
| Stage 5: Landing And UAT | `bootstrap_gap` | UAT is not applicable to this workflow-infrastructure slice; Landing Agent does not exist yet. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Escalation Plan

- **Policy smell requiring stronger review:** The placeholder must activate from
  recorded routing or smell evidence rather than operator preference.
- **Weak refusal path:** Missing, stale, or malformed required escalated-review
  evidence must fail closed.
- **Hidden authority:** Reviewer selection and bootstrap-gap acceptance must be
  explicit in repo-native artifacts and `land-check`, not hidden in chat,
  global settings, or UI state.
- **Passing tests with unclear spec compliance:** Tests must distinguish
  `not_applicable`, `bootstrap_gap`, `blocker`, and `pass` verdicts.
- **Escalation plan:** Codex PM owns this technical routing. Live paid-model or
  second-reviewer integration remains out of scope until this placeholder
  contract is stable.

## Bootstrap Gaps

- No live escalated adversarial reviewer integration exists yet.
- No paid-model routing, cost policy, or reviewer credential flow exists yet.
- Live CodeRabbit polling, Landing Agent, UAT artifacts, PR merge automation,
  and cockpit remain unavailable.
- Bootstrap placeholder evidence must not be represented as a real escalated
  reviewer pass.

## Expected Files

- `.bandit/reviewers/escalated-placeholder.json` or the nearest existing
  reviewer-profile location
- `src/commands/land-check.ts`
- `src/state/reviewer-profiles.ts`
- `src/state/review-evidence.ts` or the nearest existing review-evidence module
- `test/land-check.test.mjs` or the nearest existing land-check/review test
  file
- `docs/work/BANDIT-010/red-evidence.md`
- `docs/work/BANDIT-010/implementation-evidence.md`
- `docs/work/BANDIT-010/escalated-review.md`
- `docs/work/BANDIT-010/review-evidence.md`
- `docs/work/BANDIT-010/landing-verdict.md`
- `docs/work/BANDIT-010/landing-action.md`
- `docs/work/BANDIT-010/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect the current smell catalog, routing decision artifact, review evidence
   parser, reviewer profile validation, and land-check gate boundaries.
2. Add focused RED tests for missing required escalation, accepted explicit
   bootstrap gap, stale placeholder evidence, and non-required escalation.
3. Run the focused RED tests and record evidence.
4. Implement the placeholder artifact/profile contract and parser validation.
5. Wire `land-check` to require or skip escalated-review evidence from recorded
   routing/smell state.
6. Run focused and full verification.
7. Record implementation, review, landing, retrospective, and context evidence.

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the technical routing decision: create a bootstrap placeholder
for smell-triggered escalated adversarial review without adding live paid-model
routing or asking the operator to choose reviewers.
