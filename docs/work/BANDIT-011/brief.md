# BANDIT-011: Bootstrap Gap Chore Tracking And Routing

## Status

Bootstrap-gap chore brief created on 2026-05-24. Production implementation and
focused fail-closed repair are complete. Closeout evidence is pending.

## Goal

Turn bootstrap gaps from passive prose into repo-native, validated,
routeable work records so newly identified gaps either become the next
executable chore, receive an explicit no-action decision, or halt on missing
operator-owned input before unrelated work continues.

## Non-Product Work

This is workflow-infrastructure hardening, not a feature slice. `BANDIT-010`
completed the Phase 4 review-gate placeholder set, and the current blocking
workflow problem is that bootstrap gaps are still discoverable mostly by
reading prose in context, retrospectives, and landing evidence.

Bandit's product loop requires lessons and gaps to become durable work or
explicit decisions. This chore creates the smallest tracking and routing
substrate needed before Phase 5 UAT work begins.

## Origin

- `AGENTS.md` says newly identified bootstrap gaps must become the next chore,
  enforced artifact, command, validator, agent contract, or explicit no-action
  policy decision.
- `docs/decisions/2026-05-24-bootstrap-gaps-become-chores.md` records the
  policy decision that bootstrap gaps should become chores instead of passive
  context.
- `docs/roadmap/CURRENT_CONTEXT.md` names bootstrap-gap chore tracking and
  routing as the next action before Phase 5.
- `docs/work/BANDIT-010/landing-action.md` records the previous work item as
  landed at final implementation source head
  `c1333d1cb54c99d9bbaa31ac37a975420454a0da`.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-010
source_artifacts:
  - AGENTS.md
  - docs/decisions/2026-05-24-bootstrap-gaps-become-chores.md
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-010/landing-action.md
lesson: Bootstrap gaps are currently honest but too easy to leave as passive prose.
hypothesis: A repo-native gap ledger plus validation and listing commands will reduce context drift and keep newly discovered gaps routed before unrelated work starts.
metric: `bandit validate` detects undispositioned bootstrap gaps, and `bandit gaps list` reports tracked gaps with disposition, source, and next action.
baseline: Known bootstrap gaps are listed in prose, but no Bandit command can validate their disposition or list them as executable work.
expected_direction: Future cold starts and closeouts can identify blocking gaps from CLI state without reconstructing intent from chat or Markdown prose.
evaluation_window: Evaluate at `BANDIT-011` closeout and again before starting the first Phase 5 work item.
status: pending
outcome: pending

## Scope

- Define a repo-native bootstrap-gap tracking contract for known and newly
  identified bootstrap gaps.
- Seed the current known bootstrap gaps into that contract with explicit
  dispositions: active chore, queued chore candidate, resolved, blocked by
  operator input, or explicit no-action decision.
- Add validation that fails closed when a bootstrap gap record is malformed,
  lacks source metadata, lacks a disposition, claims no-action without
  rationale, or points to a missing work item.
- Add a narrow CLI surface, tentatively `bandit gaps list`, that reports gap
  IDs, source, disposition, linked work item, and next action from repo-native
  state.
- Add a routing check that makes undispositioned newly identified gaps block
  unrelated work from becoming active.
- Preserve the slice-boundary rule: `BANDIT-011` must complete and land before
  Phase 5 UAT work begins.
- Record implementation, review, landing, retrospective, and context evidence
  during later stages of this chore.

## Out Of Scope

- Building Phase 5 UAT artifacts or stale-UAT detection.
- Live CodeRabbit polling, GitHub API integration, repair orchestration, or
  rerun automation.
- Live escalated reviewer routing, paid-model credential handling, or cost
  policy.
- Final Landing Agent behavior or PR merge automation.
- Heartbeat chore-agent behavior.
- Workflow Cockpit UI or SQLite indexing.
- A full retrospective-derived improvement analytics engine.
- Automatically mining every Markdown file for historical bootstrap-gap prose.

## Acceptance Criteria

1. RED evidence demonstrates that the current CLI cannot list bootstrap gaps as
   tracked work and cannot fail validation for an undispositioned gap record.
2. The repository contains a versioned bootstrap-gap tracking artifact under
   `.bandit/` with stable fields for gap ID, title, status, disposition, source
   work item, source artifacts, linked work item when applicable, rationale,
   verification target, and next action.
3. Current known bootstrap gaps from `CURRENT_CONTEXT.md` are represented in
   the tracking artifact with honest dispositions rather than silently dropped.
4. `bandit validate` validates the bootstrap-gap tracking artifact and fails
   closed for malformed gap records.
5. `bandit validate` fails closed when a gap is newly identified or marked
   blocking but lacks a disposition, linked active/queued chore, explicit
   no-action rationale, or operator-input blocker.
6. `bandit validate` fails closed when a gap links to a missing
   `docs/work/<ID>` directory or missing expected brief.
7. The CLI exposes `bandit gaps list` or a narrower command name selected
   during GREEN implementation that reports tracked gaps and their next action
   without reading chat history.
8. The gaps command reports a clear usage or validation error when repo state is
   missing, malformed, or internally inconsistent.
9. The implementation does not ask the operator to choose routine technical
   routing for gaps. Codex PM owns chore routing when repo policy is sufficient.
10. The implementation preserves missing operator input as a hard blocker for
    product direction, UAT, policy, business tradeoffs, cost/risk overrides, or
    genuinely ambiguous scope.
11. Focused tests cover valid tracked gaps, malformed records,
    undispositioned blocking gaps, missing linked work items, no-action
    rationale requirements, and command output.
12. Existing validation, work-item, routing, review, and landing tests continue
    to pass.
13. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and
    `git diff --check` pass before landing.
14. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in a new `test/bootstrap-gaps.test.mjs` or the nearest
  existing state/validation test file.
- Cover:
  - missing bootstrap-gap tracking artifact behavior;
  - malformed gap record validation;
  - undispositioned blocking gap refusal;
  - linked work item path validation;
  - explicit no-action disposition requiring rationale;
  - `bandit gaps list` output for seeded known gaps.
- Run focused RED tests and record output in
  `docs/work/BANDIT-011/red-evidence.md` before production implementation.
- Implement the smallest state parser, validator, CLI command, and seeded
  artifact needed to satisfy the acceptance criteria.
- Run focused tests, full tests, typecheck, Bandit validation, `bandit gaps
  list`, and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item.
The acceptance criteria make clean-code compliance evaluable through narrow
scope, explicit repo-native state, fail-closed validation, testable refusal
paths, small CLI surface, readable source-of-truth boundaries, and preserved
operator/Codex PM responsibilities.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` name Phase 4, no active work before this brief, `BANDIT-010` landing-action evidence, and bootstrap-gap chore tracking as the next action. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | Required before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live CodeRabbit polling, live escalated reviewer routing, and Landing Agent behavior remain bootstrap-limited; this chore tracks and routes those gaps honestly. |
| Stage 5: Landing And UAT | `bootstrap_gap` | UAT is not applicable to this workflow-infrastructure chore; Landing Agent does not exist yet. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Bootstrap gap passivity:** Meaningful gaps must become tracked work or
  explicit no-action decisions.
- **Evidence freshness:** A gap disposition must point at current repo-native
  artifacts, not chat or stale prose.
- **Parser/validator mismatch:** Gap records, validation, and CLI output must
  use the same supported values.
- **Weak refusal path:** Missing disposition or malformed gap state must fail
  closed.
- **Hidden authority:** Gap routing must live in `.bandit/` state and CLI
  checks, not a cockpit cache, terminal scrollback, or chat summary.
- **Escalation plan:** Codex PM owns the technical routing. Operator input is
  required only if a gap needs product direction, UAT, policy change, business
  tradeoff, or explicit cost/risk override.

## Bootstrap Gaps

- No bootstrap-gap tracking artifact exists yet.
- No Bandit command can list known bootstrap gaps and their dispositions.
- No validation path detects an undispositioned newly identified bootstrap gap.
- No durable link exists between a bootstrap gap and the next chore or explicit
  no-action decision.
- Live CodeRabbit polling and repair orchestration remain unavailable.
- Live escalated adversarial reviewer routing remains unavailable.
- Landing Agent, UAT artifacts, heartbeat chore-agent, cockpit, and state index
  remain unavailable.

## Expected Files

- `.bandit/bootstrap-gaps.json` or the nearest simpler repo-native state file
- `src/state/bootstrap-gaps.ts`
- `src/commands/gaps.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `test/bootstrap-gaps.test.mjs` or the nearest existing validation/state test
- `docs/work/BANDIT-011/red-evidence.md`
- `docs/work/BANDIT-011/implementation-evidence.md`
- `docs/work/BANDIT-011/review-evidence.md`
- `docs/work/BANDIT-011/local-qwen-review.md`
- `docs/work/BANDIT-011/escalated-review.md`
- `docs/work/BANDIT-011/landing-verdict.md`
- `docs/work/BANDIT-011/landing-action.md`
- `docs/work/BANDIT-011/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect existing validation, work-item lookup, CLI dispatch, and state parser
   patterns.
2. Add focused RED tests for the bootstrap-gap artifact, validation failures,
   linked work item checks, no-action rationale, and gaps-list output.
3. Run focused RED tests and record evidence.
4. Implement the bootstrap-gap state contract and seed current known gaps.
5. Wire validation and the narrow gaps-list command.
6. Run focused and full verification.
7. Record implementation, review, landing, retrospective, and context evidence.

## Required Evidence

- `docs/work/BANDIT-011/red-evidence.md`
- `docs/work/BANDIT-011/implementation-evidence.md`
- `docs/work/BANDIT-011/review-evidence.md`
- `docs/work/BANDIT-011/local-qwen-review.md`
- `docs/work/BANDIT-011/escalated-review.md` when routing requires a
  placeholder or records `not_applicable`
- `docs/work/BANDIT-011/landing-verdict.md`
- `docs/work/BANDIT-011/landing-action.md`
- `docs/work/BANDIT-011/retrospective.md`
- Updated `docs/roadmap/CURRENT_CONTEXT.md`
- Updated `docs/roadmap/ROADMAP.md`

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the routing decision: create a bootstrap-gap tracking and
routing chore before unrelated Phase 5 work begins.
