# Retrospective-Derived Chore Schema

Initial schema direction for improvement chores created from retrospective lessons, cross-model tension, CodeRabbit outcomes, incidents, or smell triggers.

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
  "evaluation_window": "next_5_applicable_work_items",
  "status": "pending",
  "outcome": "pending"
}
```

## Origin Values

- `retrospective`
- `cross_model_tension`
- `coderabbit`
- `incident`
- `smell_trigger`
- `operator_observation`

## Outcome Values

- `pending`
- `effective`
- `ineffective`
- `inconclusive`
- `reverted`
- `double_down`

## Evaluation Rule

Every improvement chore needs an evaluation date or applicability window. A due chore should be evaluated by the heartbeat chore-agent or an explicit CLI command, then routed to Codex PM for interpretation.

## Product Rule

An improvement chore without a hypothesis, metric, and evaluation window is only a note. Bandit should either complete the missing fields or record an explicit no-action decision.
