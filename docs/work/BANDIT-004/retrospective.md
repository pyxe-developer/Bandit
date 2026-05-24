# BANDIT-004 Retrospective

## Outcome

BANDIT-004 delivered the first Phase 3 routing substrate. Bandit now has a
repo-native Smell Trigger Catalog seed, a routing decision artifact contract, a
validation path for policy and routing artifacts, and `bandit route <work-item-id>`
for reporting recorded manager-owned routing decisions without inferring new
policy from prose or chat.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| Required policy artifacts must be included in temp-repo fixtures once validation treats them as canonical. | No-action decision | Repaired inside this slice by seeding committed policy/templates in tests that need `bandit validate` to pass. The focused routing tests cover missing and malformed policy as refusal paths. |
| Routing decisions should remain recorded-decision-only until automated smell detection is explicitly scoped and tested. | No-action decision | Enforced in `bandit route` and routing-decision validation. The command reads `docs/work/<ID>/routing-decision.md` and `.bandit/policy/smell-triggers.json`; it does not infer product direction, UAT, policy changes, or cost/risk overrides. |
| Parser and validator changes deserve smell-trigger coverage because malformed evidence and hidden operator-input blockers can otherwise look like valid state. | Smell catalog update | Captured directly in `.bandit/policy/smell-triggers.json` through parser/validator, missing coverage, malformed evidence, policy drift, and operator-input boundary smells. No separate improvement chore is needed. |
| CodeRabbit, Qwen, escalated adversarial review, and Landing Agent gates must remain visible as bootstrap gaps until Phase 4 implements them. | No-action decision | Recorded in `review-evidence.md`, `landing-verdict.md`, and `landing-action.md`. Phase 4 owns the durable pre-landing review loop implementation. |

## Cross-Model Tension

None. No independent model review gate exists yet.

## Improvement Chores

None created. The material lessons were either repaired within this slice,
made durable in the Smell Trigger Catalog, or are already owned by Phase 4
roadmap work.
