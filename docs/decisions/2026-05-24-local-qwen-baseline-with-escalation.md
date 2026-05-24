# Local Qwen Baseline With Escalation

## Decision

Local Qwen should be the required baseline adversarial reviewer for every PR.

Complex or high-risk PRs should escalate to a stronger or second adversarial reviewer. The harness should support using Sonnet or another strong reviewer when the risk justifies the cost, without making that paid model the default for every PR.

## Rationale

The baseline reviewer needs to be cheap enough to run on every PR, including chores and small slices. Local Qwen satisfies the no-paid-key default direction. At the same time, difficult changes may need stronger critique than a local baseline can provide. Escalation preserves cost control without pretending one reviewer is always enough.

## Policy Direction

- Every PR runs the Local Qwen Baseline Reviewer before landing.
- The landing report records the reviewer profile, model, prompt version, and verdict.
- Escalation can add a second reviewer or replace the baseline verdict with a stronger profile, depending on policy.
- Escalated reviews should feed the Cross-Model Tension Log when reviewer findings disagree.
- Reviewer-routing performance should be reviewed regularly and changed based on evidence.
- Codex PM owns escalation decisions from the Smell Trigger Catalog; the operator should not be asked to choose the reviewer for routine technical risk.

## Not Decided

- Exact Qwen model and local runtime.
- Which stronger reviewer is preferred for escalation.
