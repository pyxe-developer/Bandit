# Cross-Model Tension Log

## Decision

Cross-model disagreement should be recorded next to workflow decisions and evaluated regularly.

When CodeRabbit, the adversarial reviewer, the implementer, or the Landing Agent disagree on a substantive issue, the harness should capture the disagreement, the decision made, the rationale, and later outcome evidence.

## Rationale

Cross-model tension is useful only if it stays visible. If a model repeatedly catches real issues, that should influence routing. If it produces noisy blockers, that should also be visible. Without durable evaluation, model-choice decisions get buried in chat and become folklore.

## Policy Direction

- Tension entries should be repo-native workflow artifacts.
- Entries should identify the PR, work item, models/tools involved, disagreement, final decision, and follow-up evaluation date.
- Regular review should classify decisions as validated, invalidated, inconclusive, or still pending.
- The results should feed Adversarial Reviewer Profile and complexity-routing changes.
- Tension decisions that imply a workflow change should create tagged improvement chores or improvement trials.
- The cockpit should surface unresolved, validated, invalidated, and repeated tension patterns.

## Not Decided

- Exact artifact path and schema.
- Review cadence.
- Whether evaluation is a scheduled chore-agent heartbeat or a manual retrospective workflow.
