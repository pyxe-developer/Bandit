# BANDIT-010 Retrospective

## Outcome

`BANDIT-010` is safe to land as a bootstrap workflow-infrastructure slice.

The slice added a repo-native escalated adversarial reviewer placeholder
contract and made `land-check` fail closed when escalation is required but
placeholder evidence is missing or stale.

## What Worked

- The brief kept live paid-model routing out of scope, which kept the slice
  small and testable.
- RED tests exposed the exact gap: `land-check` trusted aggregate
  escalated-review fields without requiring current placeholder evidence.
- Reusing the existing metadata parser and land-check gate shape kept the new
  artifact contract consistent with CodeRabbit and local Qwen evidence.
- Local Qwen reviewed the full Bandit packet and returned a structured pass.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Escalated-review bootstrap gaps need their own artifact, not just aggregate review-evidence fields. | Durable artifact | Implemented as `docs/work/<ID>/escalated-review.md` plus parser and land-check wiring. |
| Routing evidence should influence landing gates when smells require stronger review. | Durable artifact | `land-check` now reads optional routing decisions and smell policy for `require_escalated_review`. |
| Live paid-model escalation remains a real future capability, but adding it now would mix policy, credentials, and cost decisions into a placeholder slice. | No-action decision for this slice | Deferred to a later explicit work item because this slice only needed a fail-closed placeholder contract. |

## Improvement Chores

None. The material lessons were handled directly in this slice or explicitly
deferred as out of scope.

## Cross-Model Tension

None. Local Qwen returned `pass` with no findings.

## Bootstrap Gaps Remaining

- Live CodeRabbit polling and repair orchestration.
- Live escalated adversarial reviewer routing.
- Landing Agent.
- UAT artifacts and stale-UAT detection.
- Workflow cockpit and state index.
