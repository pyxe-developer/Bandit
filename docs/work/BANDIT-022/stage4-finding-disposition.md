# BANDIT-022 Stage 4 Finding Disposition

recorded_time_utc: 2026-05-25T19:09:29Z
work_item: BANDIT-022
base_head: b20d0d53ce5e
disposition_state: repair_required

## Source Findings

Local Qwen Stage 4 evidence in `docs/work/BANDIT-022/local-qwen-review.md`
returned `reviewer_verdict: non_blocking` with three open findings:

1. `dirty_worktree_behavior` is declared as `fail_closed`, but
   `src/commands/heartbeat.ts` does not check the worktree before inspection.
2. `isFeatureSliceRequiringUat` relies on a Markdown regex that may be fragile
   around end-of-file or section formatting variations.
3. `normalizeGapNextAction` maps gap next actions with substring matching,
   which can become ambiguous when multiple keywords are present.

## Codex PM Disposition

Stage 4 cannot proceed to aggregate review evidence yet.

The dirty-worktree finding is repair-required, not accepted future hardening.
The approved `BANDIT-022` acceptance criteria require the heartbeat command to
refuse dirty or stale workflow state, and
`.bandit/policy/heartbeat-chore-agent.json` declares
`dirty_worktree_behavior: fail_closed`. The current implementation validates
that the policy says `fail_closed`, but it does not enforce the behavior before
building heartbeat candidates. That is a policy/runtime mismatch at a
fail-closed boundary.

The UAT-section parser and gap next-action normalization findings are accepted
as non-blocking hardening concerns. Because focused repair is already required,
the repair should also tighten these parser boundaries while staying inside the
existing heartbeat inspection scope.

## Required Repair Scope

- Add a fail-closed dirty-worktree check before `heartbeat inspect` reads and
  reports candidates.
- Add focused test coverage proving `heartbeat inspect` refuses a dirty
  worktree without mutating repo-native state.
- Tighten feature-UAT section parsing so end-of-file and section-boundary cases
  are explicit.
- Replace ambiguous substring next-action mapping with a stricter bounded
  mapping for the supported bootstrap-gap actions.
- Keep the heartbeat command read-only and preserve the existing no landing,
  merge, push, deploy, feature implementation, or UAT approval authority.

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 3: Implementation Clean-Code Rubric | `blocker` | The implementation currently does not enforce the policy-declared dirty-worktree fail-closed behavior required by the brief acceptance criteria. |
| Stage 4: Review And Cross-Model Gates | `blocker` | Local Qwen findings are dispositioned here, but aggregate review evidence must wait until the focused repair is implemented and review evidence is refreshed at the current `review_subject_hash`. |

## Verification

- `CLEAN_CODE.md` was re-read before this disposition.
- `docs/verification/STAGE_RUBRICS.md` Stage 3 and Stage 4 rules were applied.
- `npm run bandit -- review-subject-hash BANDIT-022` produced
  `16ca5d82086c1aa668297ff8f9b3334e04c8b05eb9c2d9ffae8ac57285b56fd2` from
  review-subject policy v1 at `b20d0d53ce5e`.

## Next Required Action

Implement the focused `BANDIT-022` repair described above, then rerun focused
heartbeat tests, full verification, Local Qwen Stage 4 review, and aggregate
review evidence with the current `review_subject_hash`. Do not create
`docs/work/BANDIT-022/review-evidence.md`, landing verdict, landing action,
retrospective, or the next bootstrap-gap chore until the repair and refreshed
Stage 4 evidence are recorded.
