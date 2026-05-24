# Manager-Owned Routing And Smell Detection

## Decision

Codex PM owns routine technical routing decisions.

The operator should not be asked to choose the right model, reviewer, skill, agent, slice split, or escalation path when repo evidence and policy are sufficient. Codex PM should apply a Smell Trigger Catalog, route work to specialized agents and skills, and ask the operator only for product direction, UAT, policy changes, explicit cost/risk overrides, or unresolved business tradeoffs.

## Rationale

The operator is relying on Codex to manage the engineering workflow. Sourmash evidence shows that repeated technical decisions can be encoded into durable policy:

- The 50% context-window slice sizing rule and phase-decomposition rule came from SOUR-005, SOUR-013, and SOUR-014 failure patterns.
- CodeRabbit caught real issues that PM and Writer missed, while also producing false positives that PM had to disposition.
- Cross-modal PM review caught structural bugs after Writer and after CodeRabbit repair.
- Retrospectives and `docs/architecture-changes.md` preserved lessons better than chat.
- Prose-only enforcement caused repeated loops; mechanical constraints and explicit artifacts worked better.
- Missing or unavailable agents should halt with evidence, not be silently replaced by PM.

Those are manager-level defaults, not questions for the operator.

## Policy Direction

- Codex PM selects specialized skills and agents for recurring workflows.
- Codex PM applies the Smell Trigger Catalog before asking the operator technical routing questions.
- Default answers should be derived from repo evidence, retrospectives, CodeRabbit history, test evidence, and policy docs.
- Operator questions should be reserved for product acceptance, business tradeoffs, cost ceiling changes, policy overrides, and ambiguous scope.
- When Codex PM makes a routing call with material uncertainty, it records the rationale and later outcome so the decision can be evaluated.

## Not Decided

- Exact cockpit UI for explaining manager-owned decisions.
- Exact metrics for evaluating routing decisions over time.
- Whether the Smell Trigger Catalog starts as a markdown policy file or structured config.
