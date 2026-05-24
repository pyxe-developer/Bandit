# BANDIT-002 Retrospective

## Outcome

BANDIT-002 delivered repo-native Feature PRD, Slice, Chore, and retrospective-derived improvement chore templates, then wired template validation into `bandit validate` with success and refusal-path tests.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| Pre-landing review evidence needs a distinct artifact during bootstrap so unavailable independent gates are not hidden inside a landing summary. | No-action decision | Fixed inside this slice by adding `review-evidence.md`; future slice templates already require a `Required Evidence` section where review evidence can be named. |
| Manual PM review and unavailable CodeRabbit/Qwen gates must be recorded as different verdicts. | No-action decision | Recorded in `review-evidence.md` and `landing-verdict.md`; this matches `docs/verification/STAGE_RUBRICS.md`. |
| PRD-to-work decomposition should remain separate from the template contract until the contract is validated. | No-action decision | Preserved by BANDIT-002 scope; next Phase 2 action can create a focused BANDIT-003 brief for the draft command. |

## Cross-Model Tension

None. No independent model review gate exists yet.

## Improvement Chores

None created. The material lessons were repaired within the slice or already covered by standing bootstrap policy.
