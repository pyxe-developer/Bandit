# Token-Cost Failsafe

Use this template to record the Token-Cost Failsafe evidence that applies to a
work item, Stage Capability Scope profile, reviewer route, scheduler route, or
long-running execution path.

work_item: Required string. Bandit work-item ID, for example `BANDIT-055`.
policy: Required path. Canonical policy artifact, normally
  `.bandit/policy/token-cost-failsafe.json`.
provider_pricing_evidence: Required list when paid reviewer, paid model, or
  paid/high-token recurring execution is in scope. Each entry must reference a
  provider-pricing evidence ID with provider, model/profile, pricing source,
  captured date, effective date, freshness or expiry rule, expected per-run
  cost, spend class, and approval owner.
benchmark_evaluation_spend: Required list for one-off paid benchmark or
  evaluation calls. Each entry must include provider-pricing evidence, expected
  per-run cost, per-run approval or active spend-class approval, and explicit
  non-recurring routing disposition.
recurring_paid_routes: Required list before recurring paid reviewer or paid
  model routing is available. Each entry must include provider-pricing evidence,
  spend-class approval, scoped promotion threshold, expected-cost ceiling, and
  applicable review-depth or stage-capability profile.
soft_budget_bands: Required list for paid, high-token, reviewer, scheduler, or
  long-running stages. Bands must be generous abnormal-run failsafes, not tight
  hard caps that cause repeated failed attempts.
abnormal_run_triggers: Required list of trigger IDs such as
  `unexpected_token_growth`, `repeated_wake_noop`, `reviewer_runtime_loop`,
  `missing_trace_cost_signal`, `stale_provider_pricing`,
  `missing_spend_approval`, and `missing_continuation_decision`.
trace_cost_signal_boundary: Required object. Trace-backed token and cost signals
  are observability evidence only; they cannot replace provider-pricing
  evidence, approvals, UAT, landing evidence, retrospective evidence, or other
  canonical workflow artifacts.
continuation_decisions: Required list when a failsafe trips. Allowed values are
  `continue`, `reroute`, `pause`, `stop`, and
  `operator_cost_risk_approval`.
stage_capability_profiles: Required list when the failsafe applies to declared
  Stage Capability Scope profiles.
source_artifacts: Required list of source artifacts that justify the token-cost
  failsafe scope and any pricing, spend, or continuation decision.

Example:

```yaml
work_item: BANDIT-055
policy: .bandit/policy/token-cost-failsafe.json
provider_pricing_evidence:
  - provider-pricing-qwen-local
benchmark_evaluation_spend:
  - one-off-paid-reviewer-eval
recurring_paid_routes:
  - stage4-review-paid-escalation
soft_budget_bands:
  - deep_review_abnormal_run
abnormal_run_triggers:
  - unexpected_token_growth
  - repeated_wake_noop
trace_cost_signal_boundary:
  authority: observability_only
  can_replace_approvals_or_landing_evidence: false
continuation_decisions:
  - pause
  - reroute
stage_capability_profiles:
  - stage4_review
source_artifacts:
  - docs/work/BANDIT-055/brief.md
```
