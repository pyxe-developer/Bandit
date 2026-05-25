# BANDIT-017: Landing Gate Complexity And Git Diagnostics Hardening

## Status

Bootstrap-gap chore brief created on 2026-05-24 after `BANDIT-016` landing.
RED evidence is recorded in `docs/work/BANDIT-017/red-evidence.md`,
implementation evidence is recorded in
`docs/work/BANDIT-017/implementation-evidence.md`, and review evidence is
recorded in `docs/work/BANDIT-017/review-evidence.md`. The landing verdict and
local-record landing action are recorded in
`docs/work/BANDIT-017/landing-verdict.md` and
`docs/work/BANDIT-017/landing-action.md`. The next action is retrospective and
bootstrap-gap closeout. Do not begin
unrelated live escalated-reviewer, work-item creation, artifact creation,
heartbeat, cockpit, Phase 6, Phase 7, Phase 8, Phase 9, or feature work until
this chore is landed or explicitly dispositioned.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
`BANDIT-016` resolved the Stage 4 evidence-head contract but Local Qwen
identified two persistent non-blocking maintainability findings that should run
as the next chore instead of keeping `BANDIT-016` open.

## Origin

- `docs/work/BANDIT-016/local-qwen-review.md` records the latest Local Qwen
  `non_blocking` findings.
- `docs/work/BANDIT-016/qwen-loop-operator-disposition.md` records the
  operator decision to land `BANDIT-016` now and run this chore next.
- `docs/work/BANDIT-016/retrospective.md` records this as a bootstrap-gap
  chore.
- `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, and
  `docs/roadmap/ROADMAP.md` route this gap as active `BANDIT-017` work.
- `docs/work/BANDIT-016/landing-action.md` records `BANDIT-016` as landed, so
  the slice boundary allows this brief.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-016
source_gap: BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING
source_artifacts:
  - docs/work/BANDIT-016/local-qwen-review.md
  - docs/work/BANDIT-016/qwen-loop-operator-disposition.md
  - docs/work/BANDIT-016/qwen-finding-repair.md
  - docs/work/BANDIT-016/retrospective.md
  - docs/work/BANDIT-016/landing-action.md
lesson: Stage 4 hardening left `land-check.ts` carrying too much stale-evaluation and PM-rationale logic, and changed-path error classification now probes git state during failed diff handling.
hypothesis: Extracting Stage 4 stale-evaluation/rationale logic and caching or deferring git repository state checks will reduce landing-gate complexity without weakening fail-closed stale-evidence behavior.
metric: Existing landing-gate behavior remains covered by tests while Stage 4 stale-evaluation/rationale logic moves behind clearer module boundaries and failed changed-path classification avoids repeated shallow/promisor state probes.
baseline: `BANDIT-016` ended with Local Qwen reporting `land-check.ts` size/complexity and async git state checks as persistent `non_blocking` findings after implementation behavior was accepted.
expected_direction: `land-check.ts` becomes easier to review, and failed changed-path classification no longer repeats repository state probes per failure.
evaluation_window: Evaluate during `BANDIT-017` closeout.
status: active
outcome: pending

## Scope

- Extract Stage 4 stale-evidence evaluation and PM-rationale checking out of
  `src/commands/land-check.ts` into a focused module or modules with explicit
  inputs and outputs.
- Preserve the existing landing-readiness behavior for review evidence,
  landing verdicts, CodeRabbit, Local Qwen, escalated review, UAT, and source
  drift.
- Add or adjust tests so the extracted logic remains behaviorally equivalent
  for terminal disposition-only updates, protected source drift, PM rationale,
  typed policy patterns, and missing changed-path bases.
- Reduce repeated git repository state probes during changed-path error
  classification by caching, deferring, or otherwise narrowing shallow/promisor
  checks without weakening diagnostic clarity.
- Keep repo-native policy, review evidence, and landing readiness as the
  source of truth.

## Out Of Scope

- Changing Stage 4 evidence-head product semantics.
- Weakening fail-closed source-drift behavior.
- Live escalated adversarial reviewer routing.
- Live CodeRabbit provider orchestration beyond the existing fixture-backed
  path.
- General work-item creation, general artifact creation, heartbeat chore-agent,
  workflow cockpit, state index, or broader coordination primitive work.
- Feature UAT.

## Acceptance Criteria

1. RED evidence demonstrates the current complexity or repeated-probe issue in
   a way a future maintainer can verify.
2. Stage 4 stale-evidence evaluation and PM-rationale checking are extracted
   from `src/commands/land-check.ts` behind named functions or modules with
   explicit inputs and outputs.
3. `land-check.ts` remains the CLI orchestration entry point but no longer owns
   all Stage 4 stale-evaluation and rationale-checking details.
4. Failed changed-path classification avoids repeated shallow/promisor git
   state probes for equivalent repository state within one landing-readiness
   evaluation.
5. Existing behavior remains intact for terminal disposition-only updates,
   protected source drift, structured PM rationale, typed Stage 4 policy
   patterns, shallow changed-path diagnostics, and safe-to-land refusal paths.
6. Focused and full verification pass before landing.
7. Closeout explicitly evaluates `CLEAN_CODE.md` and
   `docs/verification/STAGE_RUBRICS.md`.

## Verification Plan

- Add focused RED evidence for extracted Stage 4 behavior and git state probe
  reuse.
- Run focused landing-gate tests after implementation.
- Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, relevant
  `land-check` checks, and `git diff --check`.
- Run Local Qwen review for `BANDIT-017` before landing unless an operator-owned
  policy decision explicitly routes a reviewer loop into follow-up work.

## Expected Files

- `src/commands/land-check.ts`
- New focused state or command helper module for Stage 4 landing-readiness
  logic.
- `src/state/git.ts`
- `test/landing-gates.test.mjs` or narrower focused tests.
- `docs/work/BANDIT-017/red-evidence.md`
- `docs/work/BANDIT-017/implementation-evidence.md`
- `docs/work/BANDIT-017/review-evidence.md`
- `docs/work/BANDIT-017/landing-verdict.md`
- `docs/work/BANDIT-017/landing-action.md`
- `docs/work/BANDIT-017/retrospective.md`

## Required Evidence

- RED evidence.
- Implementation evidence and clean-code self-check.
- CodeRabbit or recorded bootstrap replacement evidence, as applicable.
- Local Qwen evidence or operator-owned loop disposition if the reviewer enters
  another non-blocking future-hardening cycle.
- Escalated-review disposition if smell triggers require it.
- Landing verdict.
- Landing action evidence.
- Retrospective and gap-ledger disposition.

## Operator Input Status

None required for the next step. Codex PM owns the repair approach, module
boundary, reviewer routing, and whether findings are implementation blockers or
non-blocking hardening within the recorded scope.
