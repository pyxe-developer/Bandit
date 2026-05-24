# BANDIT-007 Retrospective

## Outcome

BANDIT-007 delivered the first repo-native CodeRabbit state capture gate
substrate. Bandit now has a CodeRabbit review evidence template, artifact
validation, `bandit coderabbit-review <work-item-id>`, and `land-check`
integration that requires current CodeRabbit evidence whenever CodeRabbit pass
is claimed.

The final implementation source head is
`6375436e6be76415bdd9b6493f0f79fd997a1c81`.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| A new evidence artifact family should not inherit historical-compatibility parsing shortcuts from older optional artifacts. | No-action decision | Repaired inside this slice by parsing any present `coderabbit-review.md`; missing required fields now fail closed. |
| Expanding a required template contract requires updating older temp-repo fixtures, or unrelated tests fail for setup reasons rather than behavior. | No-action decision | Repaired inside this slice with a shared `coderabbitTemplate` fixture and fixture updates for validate, routing, landing, and committed-template tests. |
| Live CodeRabbit polling is still a separate integration problem from repo-native CodeRabbit state capture. | No-action decision | Recorded as an explicit bootstrap gap in `coderabbit-review.md`, `review-evidence.md`, and `landing-verdict.md`; live polling remains out of scope until a later work item. |
| The installed local 35B Qwen route again timed out before returning structured findings. | No-action decision | Recorded as an explicit bootstrap gap in `local-qwen-review.md` and `review-evidence.md`; future review-runtime tuning should be considered only if it remains material after the Phase 4 gate substrates are complete. |

## Cross-Model Tension

None. Live CodeRabbit did not run and local Qwen did not return structured
findings, so no substantive cross-model disagreement was produced.

## Improvement Chores

None created. Material lessons were repaired in-slice, recorded as explicit
bootstrap/no-action decisions, or remain owned by the Phase 4 roadmap.
