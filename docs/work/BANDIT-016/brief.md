# BANDIT-016: Stage 4 Evidence-Head Semantics

## Status

Bootstrap-gap chore brief created on 2026-05-24. RED evidence is the next
required step. Implementation evidence, review evidence, local Qwen review,
escalated-review disposition, landing verdict, landing action, retrospective,
gap-ledger disposition, and context closeout remain required before this work
item can land or the next bootstrap-gap chore can begin.

## Goal

Convert `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` from an open bootstrap gap
into a durable Stage 4 evidence-head contract that lets iterative review
dispositions reach a terminal landing-gate state after implementation behavior
is accepted, while still failing closed when source code changes after review.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
`BANDIT-015` exposed a recursive Stage 4 loop where each PM disposition and
review rerun advanced artifact heads and caused Local Qwen to keep blocking on
historical evidence-head divergence after accepting implementation behavior.
This chore defines and enforces the narrow evidence semantics needed for future
review loops to close without weakening source-drift checks.

## Origin

- `docs/work/BANDIT-015/local-qwen-review.md` records the repeated Local Qwen
  evidence-head blockers.
- `docs/work/BANDIT-015/qwen-evidence-head-disposition.md` records Codex PM's
  triage that the behavior was accepted but the Stage 4 evidence semantics were
  underdefined.
- `docs/work/BANDIT-015/qwen-loop-operator-disposition.md` records the operator
  decision to stop the recursive `BANDIT-015` loop, land, and queue follow-up
  chore work.
- `docs/work/BANDIT-015/retrospective.md` records
  `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` as the next bootstrap-gap chore.
- `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, and
  `docs/roadmap/ROADMAP.md` identify this gap as active `BANDIT-016` work.
- `docs/work/BANDIT-015/landing-action.md` records the previous chore as landed,
  so the slice boundary allows this brief.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-015
source_gap: BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS
source_artifacts:
  - docs/work/BANDIT-015/local-qwen-review.md
  - docs/work/BANDIT-015/qwen-evidence-head-disposition.md
  - docs/work/BANDIT-015/qwen-loop-operator-disposition.md
  - docs/work/BANDIT-015/retrospective.md
  - .bandit/bootstrap-gaps.json
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-015/landing-action.md
lesson: Iterative Stage 4 review dispositions can create a recursive evidence-head loop after implementation behavior is accepted.
hypothesis: A narrow Stage 4 evidence-head semantics contract can distinguish historical review artifacts from current landing-gate evidence, prevent recursive rerun loops, and preserve fail-closed stale-evidence checks for actual source changes.
metric: A future work item with iterative review dispositions can reach a terminal Stage 4 verdict in one closeout pass after PM disposition, while source-code changes after review still block landing.
baseline: `BANDIT-015` required repeated Local Qwen reruns and kept producing procedural blockers after implementation behavior was accepted.
expected_direction: Future landing checks evaluate current source-review coverage separately from historical review-loop artifacts and disposition-only evidence updates.
evaluation_window: Evaluate during `BANDIT-016` closeout and again on the next work item that needs iterative Stage 4 disposition.
status: pending
outcome: pending

## Scope

- Define Stage 4 evidence-head terms in a durable repo-native policy or
  contract: implementation source head, review evidence head, disposition head,
  historical review artifact, current landing-gate evidence, and terminal Stage
  4 evidence state.
- Specify when a PM disposition or review rerun must refresh review evidence,
  and when it may close procedural review-loop findings without requiring a
  fresh source review.
- Preserve fail-closed behavior for actual source-code drift after review.
  Source changes after current review evidence must still block landing unless
  a supported rerun or explicit bootstrap gap applies.
- Teach the relevant validator, `land-check`, review evidence parser, or
  closest existing landing-readiness path to apply the new evidence-head
  contract deterministically.
- Add focused tests proving recursive disposition-only artifact updates do not
  keep Stage 4 blocked after implementation behavior is accepted.
- Add focused tests proving source-code changes after review still block
  landing.
- Keep CodeRabbit, Local Qwen, escalated-review, landing verdict, and
  retrospective artifacts repo-native and explicit.
- Record RED evidence, implementation evidence, CodeRabbit/review evidence,
  local Qwen review, escalated-review disposition, landing verdict, landing
  action, retrospective, and gap-ledger disposition before this chore can
  close.

## Out Of Scope

- Live escalated adversarial reviewer routing.
- Live CodeRabbit provider orchestration beyond the existing `BANDIT-015`
  fixture-backed path.
- Auto-fixing CodeRabbit or Local Qwen findings.
- Product UAT execution or acceptance by an agent.
- PR merge, push, deploy, or remote landing behavior beyond existing Landing
  Agent local-record policy.
- General work-item creation, general artifact creation, heartbeat chore-agent,
  workflow cockpit, state index, or broader coordination primitive work.
- Weakening source-drift checks for actual code, test, policy, or gate logic
  changes.

## Acceptance Criteria

1. RED evidence demonstrates the current Stage 4 landing-readiness path cannot
   distinguish accepted implementation behavior from recursive
   disposition-only evidence-head updates.
2. A durable Stage 4 evidence-head contract exists and defines implementation
   source head, review evidence head, disposition head, historical review
   artifact, current landing-gate evidence, terminal Stage 4 state, and stale
   source behavior.
3. The contract explicitly preserves fail-closed behavior when source code,
   tests, policy, validators, or gate logic change after current review
   evidence.
4. The contract explicitly allows a terminal Stage 4 state when only PM
   disposition, retrospective, landing verdict, or other closeout artifacts
   change after reviewers have accepted implementation behavior.
5. `land-check`, review evidence validation, or the nearest shared
   landing-readiness path consumes the contract instead of relying on ad hoc
   artifact-head comparison.
6. Recursive review-loop evidence from `BANDIT-015` can be represented as a
   valid terminal Stage 4 pattern without requiring a new review for every
   disposition-only artifact update.
7. Stale current review evidence still blocks when implementation source changes
   after CodeRabbit, Local Qwen, or escalated-review evidence.
8. PM dispositions for rejected or accepted reviewer findings must include
   concrete rationale and must not silently waive actionable implementation
   findings.
9. Cross-model tension remains required when models materially disagree about a
   finding or the PM accepts a procedural concern as follow-up work.
10. Focused tests cover accepted implementation with disposition-only updates,
    actual source drift after review, missing PM rationale, unresolved
    actionable findings, and `land-check` integration.
11. Existing validation, review, CodeRabbit, Local Qwen, escalated-review, UAT,
    bootstrap-gap, landing-gate, auto-landing, and Landing Agent tests continue
    to pass.
12. `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
    representative `land-check` checks for `BANDIT-016`, and `git diff
    --check` pass before landing.
13. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in the nearest landing-gate or review-evidence test file
  for:
  - current false-blocking behavior when only PM disposition artifacts advance;
  - source-code drift after review remaining blocked;
  - missing PM rationale for accepted or rejected reviewer findings;
  - unresolved actionable reviewer findings remaining blocked;
  - `land-check` consumption of the terminal Stage 4 evidence state.
- Run focused RED tests and record output in
  `docs/work/BANDIT-016/red-evidence.md` before production implementation.
- Implement the narrowest policy artifact, parser, validator, shared
  landing-readiness logic, and evidence fields needed to satisfy the acceptance
  criteria.
- Run focused and full verification, including `npm test`,
  `npm run typecheck`, `npm run bandit -- validate`, representative
  `land-check` checks for `BANDIT-016`, and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item. The
acceptance criteria make clean-code compliance evaluable through narrow scope,
explicit source-of-truth boundaries, deterministic stale-evidence behavior,
clear refusal paths, focused tests, and preserved reviewer, Landing Agent, UAT,
policy, business, cost, and risk boundaries.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/bootstrap-gaps.json`, and `bandit gaps list` identify `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` as active `BANDIT-016` work. `BANDIT-015` has landing-action evidence, retrospective closeout, and a queued follow-up gap disposition. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | RED evidence is the next required step and must be recorded before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | This chore exists to replace the underdefined Stage 4 evidence-head semantics exposed by `BANDIT-015`; live escalated reviewer routing remains bootstrap-limited. |
| Stage 5: Landing And UAT | `bootstrap_gap` | UAT is not required for this non-product workflow-infrastructure chore. Landing action evidence is required before the next gap chore can begin. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Evidence freshness:** Actual source drift after review must block landing;
  disposition-only closeout updates must not create recursive review loops.
- **Weak refusal path:** Missing PM rationale, unresolved actionable findings,
  inconclusive reviewer output, and stale source evidence must fail closed.
- **Cross-model tension:** Material disagreement between reviewer findings and
  PM disposition must be recorded with rationale and follow-up routing.
- **Parser/validator mismatch:** Contract fields, review evidence parsing, and
  landing-readiness checks must use the same Stage 4 semantics.
- **Hidden authority:** Chat, terminal scrollback, dashboard state, or reviewer
  prose cannot become canonical landing readiness.
- **Role erosion:** Codex PM may disposition technical review findings from repo
  evidence, but cannot provide product UAT, policy changes, business tradeoffs,
  or explicit cost/risk overrides.
- **Escalation plan:** Codex PM owns the technical route. Operator input is
  required only for product UAT, policy changes beyond this brief, explicit
  cost/risk overrides, business tradeoffs, or genuinely ambiguous scope.

## Bootstrap Gaps

- Stage 4 iterative review evidence-head semantics are undefined until this
  chore resolves them.
- Live escalated adversarial reviewer routing remains unavailable.
- No general work-item creation command exists yet.
- No general artifact creation command exists yet.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Expected Files

- `docs/work/BANDIT-016/brief.md`
- `docs/work/BANDIT-016/red-evidence.md`
- `docs/work/BANDIT-016/implementation-evidence.md`
- `docs/work/BANDIT-016/coderabbit-review.md`
- `docs/work/BANDIT-016/review-evidence.md`
- `docs/work/BANDIT-016/local-qwen-review.md`
- `docs/work/BANDIT-016/escalated-review.md`
- `docs/work/BANDIT-016/landing-verdict.md`
- `docs/work/BANDIT-016/landing-action.md`
- `docs/work/BANDIT-016/retrospective.md`
- `.bandit/bootstrap-gaps.json`
- A Stage 4 evidence-head policy or contract artifact under `.bandit/policy/`
  or the nearest existing review/landing policy location.
- Focused tests in the nearest review evidence, landing-gate, or validation
  test file.
- Shared parser, validator, or landing-readiness code only where needed to
  avoid duplicating Stage 4 stale-evidence logic.

## Required Evidence

- RED evidence proving the current gap.
- Implementation evidence mapping code paths to acceptance criteria and
  `CLEAN_CODE.md`.
- CodeRabbit/review evidence.
- Local Qwen review evidence.
- Escalated-review evidence or bootstrap-limited disposition.
- Landing verdict and landing action evidence.
- Retrospective with improvement dispositions and gap-ledger closeout.
- Updated `CURRENT_CONTEXT.md` and `ROADMAP.md`.

## Operator Input Status

No operator-owned input is required for the next RED-evidence step. Repo
artifacts define the scope, source gap, acceptance criteria, and expected
verification. Operator input remains required for product UAT, policy changes
beyond this brief, explicit cost/risk overrides, business tradeoffs, or
genuinely ambiguous scope.

## First Implementation Order

1. Write RED tests for Stage 4 recursive disposition-only evidence-head updates
   and source-drift refusal.
2. Record failing focused test output in `docs/work/BANDIT-016/red-evidence.md`.
3. Add the narrow Stage 4 evidence-head contract.
4. Update the shared review or landing-readiness path to consume the contract.
5. Run focused tests, full verification, review gates, landing checks, and
   closeout evidence before landing.
