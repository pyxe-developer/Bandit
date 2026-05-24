# BANDIT-001 Retrospective

## Outcome

BANDIT-001 delivered the first repo-native CLI skeleton and initialized Bandit's own `.bandit/` state.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| Tests should exercise the real CLI wrapper, not only direct TypeScript source execution. | No-action decision | Fixed inside this slice by adding `bin/bandit.mjs` and routing tests through it. No separate chore needed. |
| Temporary test repositories cannot resolve repo-local loaders by package name. | No-action decision | Fixed inside the test helper by invoking the repo-local wrapper entrypoint. No separate chore needed. |
| Early Bandit slices need explicit bootstrap-gap language in landing evidence. | No-action decision | Recorded in `landing-verdict.md`; this is already part of `BOOTSTRAP_METHODOLOGY.md` and `STAGE_RUBRICS.md`. |

## Cross-Model Tension

None. No independent model review gate exists yet.

## Improvement Chores

None created. The material lessons were repaired within the slice or already covered by standing bootstrap policy.
