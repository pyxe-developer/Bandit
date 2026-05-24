# BANDIT-006 Retrospective

## Outcome

BANDIT-006 delivered the first repo-native local Qwen baseline reviewer gate
substrate. Bandit now has a local Qwen reviewer profile seed, review evidence
template, profile and evidence validation, `bandit qwen-review <work-item-id>`,
dirty-worktree refusal, review-packet construction, and `land-check`
integration for current local Qwen evidence.

The final implementation source head is
`61279b0ffc9bade9e4eda1ee0b59e1874283a01b`.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| A local reviewer gate is not meaningful if it only passes the brief; it must receive implementation evidence and source diff. | No-action decision | Repaired inside this slice with review-packet construction and `qwen-review sends work item evidence and source diff to the reviewer`. |
| Source-head evidence can be misleading if the worktree is dirty when a review runs. | No-action decision | Repaired inside this slice with dirty-worktree refusal and `qwen-review fails closed when the worktree is dirty`. |
| The previous landing commit is too broad a diff base once closeout commits and RED artifacts exist. | No-action decision | Repaired inside this slice by preferring the work item's RED-evidence commit as the local Qwen diff base. |
| The installed local 35B Qwen route can be too slow for a full-slice structured review under the current timeout. | No-action decision | Recorded as an explicit bootstrap gap in `local-qwen-review.md` and `review-evidence.md`; future optimization belongs in a separate review-runtime tuning work item if it recurs after Phase 4 gates mature. |

## Cross-Model Tension

None. The local Qwen reviewer did not produce substantive findings because the
runtime timed out before returning structured output.

## Improvement Chores

None created. Material lessons were repaired in-slice or recorded as explicit
bootstrap/no-action decisions. The remaining CodeRabbit, escalated reviewer,
and Landing Agent gaps are already owned by the Phase 4 roadmap.
