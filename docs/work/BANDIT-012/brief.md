# BANDIT-012: CLI-Owned UAT Approval Artifact And Stale-UAT Detection

## Status

Phase 5 work-item brief created on 2026-05-24. RED evidence is recorded in
`docs/work/BANDIT-012/red-evidence.md`. Production implementation is recorded
in `docs/work/BANDIT-012/implementation-evidence.md`.

## Goal

Define and enforce the first CLI-owned UAT approval artifact so feature slices
can record operator acceptance in repo-native state, and so `bandit land-check`
fails closed when UAT is missing or stale after source changes.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
Bandit already records review, local Qwen, escalated-review placeholder,
landing-verdict, and landing-action evidence. Phase 5 starts by separating
operator-owned product acceptance from agent-owned code-safety judgment.

## Origin

- `AGENTS.md` requires feature slices to have CLI-owned UAT approval and says
  any branch code change after UAT makes UAT stale for v0.
- `docs/roadmap/CURRENT_CONTEXT.md` names CLI-owned UAT approval artifacts and
  stale-UAT detection as the next Phase 5 action.
- `docs/roadmap/ROADMAP.md` lists UAT approval, stale-UAT detection, and
  auto-landing eligibility as the Phase 5 capabilities.
- `.bandit/bootstrap-gaps.json` tracks `BANDIT-GAP-UAT-ARTIFACT` as the active
  gap this work item closes.
- `docs/work/BANDIT-011/landing-action.md` records the previous work item as
  landed, so the slice boundary allows this work item to begin.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-011
source_artifacts:
  - AGENTS.md
  - .bandit/bootstrap-gaps.json
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-011/landing-action.md
lesson: Feature slices need product acceptance recorded by CLI authority rather than chat or dashboard state.
hypothesis: A repo-native UAT artifact plus source-head freshness checks will prevent feature slices from landing with missing, chat-only, or stale operator approval.
metric: `bandit land-check <work-item-id>` blocks feature slices when UAT is missing or source-stale, and reports current approved UAT when source heads match.
baseline: Landing verdicts can record `uat_status`, but no UAT artifact exists and `land-check` does not validate feature-slice UAT freshness against current source.
expected_direction: Feature slice landing becomes blocked until an operator approval artifact exists for the current source head.
evaluation_window: Evaluate at `BANDIT-012` closeout and again when the first feature slice reaches Phase 5 landing.
status: pending
outcome: pending

## Scope

- Define a repo-native UAT approval artifact for feature-slice acceptance under
  `docs/work/<ID>/uat-approval.md`.
- Add validation for the UAT artifact contract, including work item ID, source
  head, environment, approval status, operator approval reference, approval
  time, source-drift status, and rationale or notes.
- Add a narrow CLI command, `bandit uat approve <work-item-id>`, that writes or
  refreshes the UAT approval artifact from explicit operator-provided approval
  inputs and current git source head.
- Add stale-UAT detection to `bandit land-check <work-item-id>` so feature
  slices with `uat_status: pass` require current UAT approval evidence for the
  current source head.
- Keep UAT not applicable for chores and non-product workflow-infrastructure
  work unless a brief explicitly classifies the work as a feature slice.
- Preserve the operator input boundary: Codex PM can implement the artifact and
  validation contract, but only the operator can approve actual product UAT.
- Record implementation, review, landing, retrospective, and context evidence
  during later stages of this chore.

## Out Of Scope

- Final auto-merge or auto-landing behavior.
- Workflow Cockpit UI for UAT.
- SQLite state indexing.
- Live GitHub PR merge automation.
- Live CodeRabbit polling or repair orchestration.
- Live escalated adversarial reviewer routing.
- Heartbeat chore-agent behavior.
- Product-specific UAT scripts, fixtures, environments, or acceptance content
  for future feature slices.
- Letting agents infer or fabricate operator UAT approval.

## Acceptance Criteria

1. RED evidence demonstrates that current `land-check` can treat
   `uat_status: pass` as sufficient without requiring a current
   `docs/work/<ID>/uat-approval.md` artifact.
2. RED evidence demonstrates that no CLI command exists to record a UAT
   approval artifact.
3. A versioned UAT artifact contract exists for `docs/work/<ID>/uat-approval.md`
   with required metadata for contract version, work item, source head,
   environment, approval status, approved-by/operator reference, approved-at
   value, source-drift status, and notes or rationale.
4. `bandit uat approve <work-item-id>` writes a UAT approval artifact for the
   current git source head only when explicit operator approval inputs are
   provided.
5. The UAT command fails closed with usage guidance when the work item is
   missing, the repo is not initialized, required approval inputs are absent, or
   the source head cannot be determined.
6. `bandit validate` validates any existing UAT approval artifact and rejects
   malformed metadata, mismatched work item IDs, unsupported approval statuses,
   unsupported source-drift statuses, and missing operator approval references.
7. `bandit land-check <work-item-id>` requires current UAT approval evidence
   when a landing verdict claims `uat_status: pass`.
8. `bandit land-check <work-item-id>` fails closed when the UAT artifact source
   head differs from the current git source head.
9. `bandit land-check <work-item-id>` continues to allow `uat_status:
   not_applicable` for chores and workflow-infrastructure work when the
   landing verdict records UAT as not applicable.
10. Error output distinguishes missing UAT, stale UAT, malformed UAT, and
    not-applicable UAT so Codex PM can route the next action without chat
    reconstruction.
11. Focused tests cover UAT approval writing, missing approval inputs, malformed
    UAT validation, missing UAT evidence for claimed pass, stale UAT evidence,
    current UAT pass, and chore `not_applicable` behavior.
12. Existing validation, review, local Qwen, CodeRabbit, escalated-review,
    bootstrap-gap, and landing-gate tests continue to pass.
13. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and
    `git diff --check` pass before landing.
14. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in a new `test/uat-approval.test.mjs` or the nearest
  existing landing-gate test file.
- Cover:
  - missing UAT approval artifact when `landing-verdict.md` claims
    `uat_status: pass`;
  - stale UAT source head versus current git source head;
  - malformed UAT metadata validation;
  - CLI usage refusal for missing approval inputs;
  - successful UAT artifact writing from explicit approval inputs;
  - successful `land-check` when UAT approval source head is current;
  - preserved `not_applicable` behavior for chores.
- Run focused RED tests and record output in
  `docs/work/BANDIT-012/red-evidence.md` before production implementation.
- Implement the smallest UAT parser, validator, CLI command, and `land-check`
  integration needed to satisfy the acceptance criteria.
- Run focused and full tests, typecheck, Bandit validation, a representative
  `bandit uat approve` command in a temporary or test repo, `bandit land-check
  BANDIT-012` when closeout evidence exists, and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item.
The acceptance criteria make clean-code compliance evaluable through narrow
scope, explicit repo-native state, fail-closed stale-source validation,
testable refusal paths, a small CLI surface, clear source-of-truth boundaries,
and preserved operator/Codex PM responsibilities.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` name Phase 5, no active work before this brief, `BANDIT-011` landing-action evidence, and UAT artifact/stale-UAT detection as the next action. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-012/red-evidence.md` records focused failing tests for missing UAT approval evidence, stale UAT evidence, malformed UAT validation, UAT command usage refusal, current UAT approval writing, and current UAT land-check reporting. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `docs/work/BANDIT-012/implementation-evidence.md` records the UAT parser/writer, `uat approve` command, validation, `land-check` integration, passing focused/full tests, typecheck, validation, and clean-code self-check. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live CodeRabbit polling, live escalated reviewer routing, and Landing Agent behavior remain bootstrap-limited; replacement evidence is required during closeout. |
| Stage 5: Landing And UAT | `bootstrap_gap` | This chore builds the UAT substrate; UAT is not required to accept this non-product workflow-infrastructure work item. Landing Agent remains unavailable. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Missing product acceptance:** Feature work must not land from tests and
  review alone when operator UAT is required.
- **Stale evidence:** Any source change after UAT invalidates UAT for v0.
- **Hidden authority:** UAT approval must live in repo-native CLI-owned
  artifacts, not chat, cockpit state, or a PR comment alone.
- **Operator input boundary:** Agents may record approval, but only explicit
  operator approval can create a passing UAT artifact.
- **Weak refusal path:** Missing, malformed, or stale UAT evidence must fail
  closed with actionable messages.
- **Parser/validator mismatch:** The UAT writer, parser, validator, and
  `land-check` integration must share the same supported values.
- **Escalation plan:** Codex PM owns technical routing and implementation
  order. Operator input is required only when recording actual product UAT for
  a feature slice, changing policy, or overriding explicit risk/cost.

## Bootstrap Gaps

- No CLI-owned UAT approval artifact exists yet.
- No Bandit command can record operator UAT approval in repo-native state.
- `bandit land-check` does not yet validate a current UAT artifact when
  `uat_status: pass` is claimed.
- Landing Agent remains unavailable.
- Live CodeRabbit polling and repair orchestration remain unavailable.
- Live escalated adversarial reviewer routing remains unavailable.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Expected Files

- `docs/work/BANDIT-012/brief.md`
- `docs/work/BANDIT-012/red-evidence.md`
- `docs/work/BANDIT-012/implementation-evidence.md`
- `docs/work/BANDIT-012/review-evidence.md`
- `docs/work/BANDIT-012/local-qwen-review.md`
- `docs/work/BANDIT-012/escalated-review.md`
- `docs/work/BANDIT-012/landing-verdict.md`
- `docs/work/BANDIT-012/landing-action.md`
- `docs/work/BANDIT-012/retrospective.md`
- `docs/work/<ID>/uat-approval.md`
- `src/state/uat-approval.ts`
- `src/commands/uat.ts`
- `src/commands/land-check.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `test/uat-approval.test.mjs` or focused additions to `test/landing-gates.test.mjs`
- `.bandit/bootstrap-gaps.json`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect existing landing-verdict, review-evidence, git-head, metadata, and
   CLI dispatch patterns.
2. Add focused RED tests for missing UAT evidence, stale UAT source head,
   malformed UAT metadata, UAT command usage refusal, successful UAT artifact
   writing, and preserved chore `not_applicable` behavior.
3. Run focused RED tests and record evidence.
4. Implement the UAT artifact parser and validator.
5. Add `bandit uat approve <work-item-id>` with explicit approval-input
   requirements and current-source-head recording.
6. Integrate UAT evidence checks into `land-check`.
7. Run focused and full verification.
8. Record implementation, review, landing, retrospective, and context evidence.

## Required Evidence

- `docs/work/BANDIT-012/red-evidence.md`
- `docs/work/BANDIT-012/implementation-evidence.md`
- `docs/work/BANDIT-012/review-evidence.md`
- `docs/work/BANDIT-012/local-qwen-review.md`
- `docs/work/BANDIT-012/escalated-review.md` when routing requires a
  placeholder or records `not_applicable`
- `docs/work/BANDIT-012/landing-verdict.md`
- `docs/work/BANDIT-012/landing-action.md`
- `docs/work/BANDIT-012/retrospective.md`
- Updated `.bandit/bootstrap-gaps.json`
- Updated `docs/roadmap/CURRENT_CONTEXT.md`
- Updated `docs/roadmap/ROADMAP.md`

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the routing decision: create the UAT approval artifact and
stale-UAT detection chore as the first Phase 5 work item.

Actual product UAT approval for future feature slices remains operator-owned.
Codex PM may write the command and validation path, but it must not infer,
fabricate, or self-approve product UAT.
