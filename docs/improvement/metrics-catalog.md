# Improvement Metrics Catalog

Initial candidate metrics for Bandit's Workflow Improvement Engine.

## Delivery Flow

- `time_to_first_green`: time from work start to first green focused verification.
- `time_to_pr`: time from work start to PR creation.
- `time_to_land`: time from PR creation to merge.
- `repair_loop_count`: PM/Writer repair cycles after first implementation.
- `coderabbit_repair_count`: CodeRabbit-driven repair cycles.
- `adversarial_repair_count`: adversarial-review-driven repair cycles.
- `blocked_landing_count`: landing attempts blocked by policy.

## Review Quality

- `finding_acceptance_rate`: accepted findings divided by total actionable findings.
- `false_positive_rate`: rejected or waived findings divided by total findings.
- `escaped_defect_count`: defects found after landing that should have been caught.
- `stale_review_count`: reviews invalidated by source changes.
- `stale_uat_count`: UAT approvals invalidated by source changes.
- `cross_model_tension_count`: substantive disagreements between reviewers or agents.
- `cross_model_tension_validated_rate`: tension decisions later validated by evidence.

## Operator Burden

- `operator_interrupt_count`: times the operator was asked for non-product input.
- `operator_risk_override_count`: explicit cost/risk/policy overrides.
- `uat_reapproval_count`: repeated UAT approvals required by post-UAT changes.

## Cost And Latency

- `model_cost_estimate`: estimated paid model cost per work item.
- `review_queue_wait_seconds`: CodeRabbit or external reviewer wait time.
- `local_review_latency_seconds`: local adversarial reviewer runtime.
- `heartbeat_chore_latency_seconds`: time from due chore to completed evaluation.

## Workflow Improvement

- `improvement_chore_created_count`: new tagged improvement chores.
- `improvement_chore_evaluated_count`: due improvement chores evaluated.
- `improvement_effective_count`: changes marked effective.
- `improvement_ineffective_count`: changes marked ineffective.
- `improvement_reverted_count`: changes reverted.
- `improvement_double_down_count`: changes expanded.

## V0 Default Metrics

Track these first:

- `repair_loop_count`
- `coderabbit_repair_count`
- `finding_acceptance_rate`
- `false_positive_rate`
- `time_to_land`
- `operator_interrupt_count`
- `stale_uat_count`
- `improvement_chore_evaluated_count`
- `improvement_effective_count`
- `improvement_reverted_count`
