# Retrospective-Derived Improvement Chore Template

origin:
workflow_trial:
policy_change:
source_work_item:
source_artifacts:
lesson:
hypothesis:
metric:
baseline:
expected_direction:
decision_criteria:
minimum_detectable_effect:
uncertainty:
evaluation_window:
reevaluation_window:
proxy_risk:
status:
evaluation_result:
outcome:

## Notes

Use this metadata for chores derived from structured improvement mining,
retrospectives, cross-model tension, CodeRabbit outcomes, incidents, smell
triggers, tool invocation friction, token-cost failsafe signals,
benchmark/evaluation spend boundaries, untrusted-input quarantine gaps,
operator escalation overuse, or operator observations. A valid
improvement chore needs a hypothesis, metric, baseline, predeclared decision
criteria, minimum-detectable-effect or uncertainty context, evaluation window,
re-evaluation window, and proxy-risk notes so Bandit can later decide whether
to keep, revise, revert, or double down without mistaking proxy movement for
policy proof. For Workflow Trials or workflow-policy changes, set
`workflow_trial: true` or `policy_change: true` and complete the guardrail
fields before evaluation.
