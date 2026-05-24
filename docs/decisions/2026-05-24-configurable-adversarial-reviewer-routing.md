# Configurable Adversarial Reviewer Routing

## Decision

The adversarial reviewer must be configured through a switchable Adversarial Reviewer Profile.

Local Qwen is the expected default starting point for the fresh harness, but the role must not be hard-coded to Qwen. The harness should support testing other reviewers, including Sonnet when budget allows, and should allow multiple adversarial reviews or model routing based on PR complexity.

## Rationale

The best adversarial reviewer may vary by code complexity, domain, and cost. Sonnet has a strong track record for critique, but it may be too expensive for every PR. A local model may be cheap enough to require broadly, but weaker on difficult changes. The harness needs to make this tradeoff explicit and measurable instead of burying it in a prompt.

## Policy Direction

- The reviewer profile should include model, prompt, timeout, tool access, cost budget, and blocking policy.
- Local Qwen is the baseline reviewer for every PR in v0.
- The default v0 profile should be easy to replace without changing workflow code.
- The landing report should record which adversarial profile ran.
- Higher-complexity PRs may run multiple adversarial reviewers or escalate to a stronger reviewer.
- Reviewer performance should be evaluated from recorded outcomes, not anecdotes.
- Codex PM owns the routing call from policy and evidence; the operator is only asked when escalation changes cost, product risk, or policy.

## Not Decided

- Exact default v0 Qwen model and runtime.
- Which reviewer findings block by default.
- Whether Sonnet is used only on demand or automatically for high-risk PRs.
