# BANDIT-010 Implementation Evidence

## Status

Implementation completed on 2026-05-24.

## Summary

`BANDIT-010` adds a repo-native escalated adversarial review placeholder
contract and wires it into `bandit land-check <work-item-id>`.

Implemented behavior:

- Added `docs/work/<ID>/escalated-review.md` parsing and validation for:
  - `contract_version`
  - `work_item`
  - `source_head`
  - `profile_id`
  - `trigger_rationale`
  - `availability_status`
  - `reviewer_verdict`
  - `disposition`
  - `source_drift_status`
  - `bootstrap_gap_evidence`
- Added validation coverage for escalated-review artifacts during
  `bandit validate`.
- Added optional routing-decision parsing for `land-check`.
- Made `land-check` require escalated-review placeholder evidence when:
  - `review-evidence.md` says `escalated_review_required: true`; or
  - a routing decision references a smell whose `default_action` is
    `require_escalated_review`.
- Made missing required escalated-review evidence fail closed.
- Made stale escalated-review evidence fail closed.
- Made current bootstrap-gap placeholder evidence visible in `land-check`
  output.
- Preserved `not_applicable` behavior when no smell or review evidence requires
  escalation.

## Files Changed

- `.bandit/reviewers/escalated-placeholder.json`
- `src/state/escalated-review.ts`
- `src/state/routing-decisions.ts`
- `src/commands/land-check.ts`
- `src/commands/validate.ts`
- `test/landing-gates.test.mjs`
- `docs/work/BANDIT-010/brief.md`
- `docs/work/BANDIT-010/red-evidence.md`
- `docs/work/BANDIT-010/implementation-evidence.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## Verification

| Command | Result |
|---|---|
| `node --test test/landing-gates.test.mjs` | `pass` - 19/19 tests passed. |
| `npm test` | `pass` - 112/112 tests passed. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - `Bandit state is valid.` |
| `git diff --check` | `pass`. |

## Acceptance Criteria Mapping

1. RED evidence demonstrates the prior gap in
   `docs/work/BANDIT-010/red-evidence.md`.
2. The escalated-review placeholder artifact has a documented and validated
   schema in `src/state/escalated-review.ts`.
3. `land-check` fails closed when escalation is required and the placeholder is
   missing.
4. `land-check` accepts current explicit `bootstrap_gap` placeholder evidence
   and reports it.
5. Stale placeholder evidence is rejected.
6. Reviewer routing remains Codex PM-owned and repo-policy driven; no operator
   reviewer selection was introduced.
7. Deterministic tests cover missing evidence, bootstrap-gap acceptance, stale
   evidence, and `not_applicable` behavior.
8. Existing CodeRabbit, local Qwen, review-evidence, landing-verdict, and
   validation tests pass.
9. Required verification commands passed.
10. Clean-code and stage-rubric closeout remain required before landing.

## CLEAN_CODE.md Self-Check

- **Spec alignment:** Implementation follows the `BANDIT-010` brief without
  adding live paid-model routing.
- **Small surface area:** Changes are limited to parser/validator,
  land-check integration, tests, and evidence artifacts.
- **Explicit state:** Placeholder state lives in repo-native
  `escalated-review.md` artifacts.
- **No hidden authority:** Routing is derived from review evidence and
  smell-trigger policy, not chat or UI state.
- **Testable behavior:** Required state transitions and refusal paths are
  covered by deterministic tests.
- **Failure clarity:** Missing and stale required placeholder evidence fail
  closed with specific messages.
