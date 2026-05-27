# Retrospective-Derived Chore Schema

Initial schema direction for improvement chores created from structured improvement mining, retrospective lessons, cross-model tension, CodeRabbit outcomes, incidents, or smell triggers.

## Required Fields

```json
{
  "id": "BANDIT-CHORE-001",
  "title": "Short chore title",
  "origin": "retrospective",
  "source_work_item": "BANDIT-001",
  "source_artifacts": [
    "docs/work/BANDIT-001/retrospective.md"
  ],
  "lesson": "What was learned",
  "hypothesis": "What should improve if this chore works",
  "metric": "repair_loop_count",
  "baseline": {
    "value": 2,
    "source": "docs/work/BANDIT-001/ops-record.md"
  },
  "expected_direction": "decrease",
  "decision_criteria": {
    "keep": "repair_loop_count decreases without lower blocker recall",
    "revise": "repair_loop_count is flat or evidence is ambiguous",
    "revert": "blocker recall drops or repair churn increases",
    "double_down": "repair_loop_count drops and reviewer friction also decreases"
  },
  "minimum_detectable_effect": "With this evidence window, effects smaller than one avoided repair loop are indistinguishable from noise.",
  "uncertainty": "Single-repo observations are contextual evidence, not causal proof.",
  "evaluation_window": "next_5_applicable_work_items",
  "reevaluation_window": "next_5_applicable_work_items_after_decision",
  "status": "pending",
  "evaluation_result": "pending",
  "outcome": "pending"
}
```

## Origin Values

- `structured_improvement_mining`
- `retrospective`
- `cross_model_tension`
- `coderabbit`
- `incident`
- `smell_trigger`
- `operator_observation`

## Structured Mining Signals

Retrospectives should actively check for recurring workflow signals before
declaring that no new improvement work exists:

- failed tool calls;
- overreasoning about a path that should be clearer;
- poor work breakdown;
- wrong agent scope or role assignment;
- attempted tool-use rule violation;
- recurring tool invocation friction, such as repeated uncertainty about how to
  call CodeRabbit or another required gate;
- reviewer/model routing uncertainty;
- cost, latency, or repeated repair-loop inefficiency;
- missing, tripped, or overly strict token-cost failsafes for paid,
  high-token, reviewer, scheduler, or long-running work;
- one-off paid reviewer or model calls that lack benchmark/evaluation spend
  classification, per-run approval, active spend-class approval, or
  non-recurring routing disposition;
- release-authorized agent paths that ingest external or third-party text
  without data-only handling, input quarantine, or a trusted-source gate before
  instruction-bearing use;
- operator escalations for operational drift where approved artifacts already
  determined a CLI-owned mechanical repair path;
- unresolved uncertainty that should affect a future skill, command, policy, or
  benchmark.

When a signal is material, it needs an improvement chore, smell-catalog update,
workflow trial, policy/doc/skill repair, or explicit no-action decision.

## Outcome Values

- `pending`
- `keep`
- `revise`
- `revert`
- `double_down`

## Evaluation Result Values

- `pending`
- `effective`
- `ineffective`
- `inconclusive`
- `reverted`
- `double_down`

## Evaluation Rule

Every improvement chore needs an evaluation date or applicability window, predeclared decision criteria, uncertainty or minimum-detectable-effect context, and a re-evaluation window. A due chore should be evaluated by the heartbeat chore-agent or an explicit CLI command, then routed to Codex PM for interpretation. A policy-changing keep, revise, revert, or double_down decision should not be recorded until the evidence is compared to the predeclared criteria and the re-evaluation window is scheduled or satisfied.

## Product Rule

An improvement chore without a hypothesis, metric, decision criteria, uncertainty or minimum-detectable-effect context, evaluation window, and re-evaluation window is only a note. Bandit should either complete the missing fields or record an explicit no-action decision. Metric movement alone must not become workflow policy because it may represent noise, proxy gaming, or reward-hacking side effects.
