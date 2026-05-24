# BANDIT-003 Retrospective

## Outcome

BANDIT-003 delivered `bandit draft-work <feature-prd-path>` for deterministic
PRD-to-work drafting from explicit `bandit-work-draft` JSON decomposition
notes. It creates Slice, Chore, and retrospective-derived improvement chore
brief drafts, preserves source PRD metadata, appends lifecycle events, and
fails closed for missing, malformed, unsafe, unsupported, incomplete, occupied,
or ambiguous input.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| Prefix rules must be checked across every reader and writer, not only where IDs are generated. | No-action decision | Repaired inside this slice with a RED regression test for `BD2-001` and a matching work item header parser fix. No separate improvement chore is needed. |
| Parser and validator slices require cross-module contract review because a local parser can be correct while a downstream validator rejects its output. | No-action decision | Captured in `review-evidence.md` and covered by the configured-prefix regression test. The founding architecture already treats parsers and validators as escalation-sensitive surfaces. |
| CodeRabbit, Qwen, and escalated adversarial gates must remain visible as bootstrap gaps rather than being collapsed into PM review. | No-action decision | Recorded separately in `review-evidence.md` and `landing-verdict.md`; roadmap phases 4 and 5 still own final gate implementation. |
| Landing evidence must record the actual landed commit after the commit exists. | Durable policy update | Fixed after operator feedback by adding `landing-action.md` for BANDIT-003 and updating the slice-boundary policy, rubrics, glossary, and Bandit skill to require landing-action evidence before the next slice begins. |

## Cross-Model Tension

None. No independent model review gate exists yet.

## Improvement Chores

None created. The material implementation lesson was repaired within this
slice and made durable through the regression test. The landing-evidence lesson
was made durable through explicit policy and rubric updates. The unavailable
review gates are already represented in the roadmap as later bootstrap work.
