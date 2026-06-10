# Stage 3 Implementation Writer Prompt - BANDIT-089

You are the Stage 3 Implementation Writer for `BANDIT-089` in
`/Users/matthewflebbe/Bandit`.

## Assignment

Implement the minimal source, policy, template, validation, and land-check
changes needed to turn the existing Stage 2 RED tests for `BANDIT-089` green.

This is the first `BANDIT-PRD-004` slice: Trust Boundary Evidence Schema
Contracts. It is schema-only and fail-closed. It must not grant new live
Notify-And-Revert or Auto-Landing authority.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/prds/BANDIT-PRD-004-trust-boundary-autonomy.md`
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`
- `docs/work/BANDIT-089/brief.md`
- `docs/work/BANDIT-089/orchestration-plan.md`
- `docs/work/BANDIT-089/red-evidence.md`
- `test/landing-gates.test.mjs` as read-only RED evidence
- `src/commands/validate.ts`
- `src/commands/land-check.ts`

## Files You May Edit Or Create

Only edit or create files needed for Stage 3 implementation evidence:

- `.bandit/policy/boundary-contour.json`
- `docs/templates/boundary-prediction-record.md`
- `docs/templates/notify-and-revert-artifact.md`
- `src/state/boundary-autonomy.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `docs/work/BANDIT-089/implementation-evidence.md`
- `docs/work/BANDIT-089/writer-report.md`
- `docs/work/BANDIT-089/coordination-log.jsonl`

If you need another source file to keep the implementation clean, keep it
small, explain why in `writer-report.md`, and do not broaden scope.

## Files You Must Not Edit

Do not edit, format, regenerate, delete, or mechanically adjust:

- `test/landing-gates.test.mjs`
- any other test file or fixture
- `docs/work/BANDIT-089/red-evidence.md`
- `docs/work/BANDIT-089/brief.md`
- `docs/work/BANDIT-089/orchestration-plan.md`
- formation, review, landing, UAT, retrospective, or improvement evidence
- `docs/prds/**`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/work-intake-ledger.json`

If the tests appear insufficient or wrong, record that in `writer-report.md`
and stop without editing tests.

## Implementation Requirements

- Add a versioned conservative `.bandit/policy/boundary-contour.json` with
  explicit risk tiers, evidence-strength tiers, autonomy levels, and cells.
- Reject boundary contour cells that allow `auto_land` for `material_risk` or
  stronger tiers.
- Reject boundary contour cells that allow `notify_and_revert` for
  `never_auto_landable` tiers.
- Reject low-reversible `notify_and_revert` cells unless rollback-path evidence
  is required.
- Add Boundary Prediction Record validation for required fields, enum values,
  authorizing contour cell existence, nonblank source/head/hash fields,
  nonempty relied-on artifacts, and autonomy not stronger than the authorizing
  contour cell.
- Add Notify-And-Revert Artifact validation for rollback path, operator
  attention reason, follow-up or expiry state, and Boundary Prediction Record
  link.
- `bandit validate` must fail closed when repository policy/template/schema
  state is malformed.
- `land-check` must require a valid Boundary Prediction Record only when a
  landing verdict claims `notify_and_revert` or `auto_land` autonomy.
- `land-check` must require a valid Notify-And-Revert Artifact when a landing
  verdict claims `notify_and_revert`.
- Existing ordinary safe-to-land bootstrap flows must not be blocked merely
  because they lack boundary evidence.

## Required Verification

Run at least:

```sh
node --test --test-name-pattern "boundary|auto-land autonomy|notify-and-revert" test/landing-gates.test.mjs
node --test test/landing-gates.test.mjs
npm run typecheck
npm run bandit -- validate
git diff --check
```

Record command results in `docs/work/BANDIT-089/implementation-evidence.md`.

## Coordination

If implementation succeeds and required verification passes, append a sequence
5 `implementation_recorded` event to
`docs/work/BANDIT-089/coordination-log.jsonl` with evidence paths:

- `docs/work/BANDIT-089/implementation-evidence.md`
- `docs/work/BANDIT-089/writer-report.md`
- `.bandit/policy/boundary-contour.json`
- `docs/templates/boundary-prediction-record.md`
- `docs/templates/notify-and-revert-artifact.md`
- `src/state/boundary-autonomy.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`

Use `safe_triggers:["review_required"]`, `accountable_actor:"reviewers"`, and
next action `Run Stage 4 review for BANDIT-089 using CodeRabbit or honest
provider-timeout evidence plus Local Qwen through the authorized MLX route.`

If blocked, do not append `implementation_recorded`; instead write
`docs/work/BANDIT-089/writer-blocker.md` with exact blocker evidence.

## Forbidden Scope

Do not start `BANDIT-PRD-005`, the V0 Closeout Claude Code A/B Product-Value
Trial, Trust Verifier cutover, attribution gateway work, escape workflow work,
boundary-cell movement policy, cockpit UI, local API, State Index, hosted
services, telemetry, paid routing, public benchmark publication, merge, push,
deploy, or any unrelated Phase 8 product work.
