# Escalated Review: BANDIT-018

contract_version: 1
work_item: BANDIT-018
source_head: 211b3c4201e905050c196b7cc729341db8e2089d
profile_id: security-reviewer-paid
trigger_rationale: Require the configured escalated adversarial reviewer route for BANDIT-018 because this chore implements paid-provider setup refusal, credential and cost boundaries, reviewer routing policy, and escalated-review evidence parsing. Codex PM owns this technical reviewer routing decision; actual provider setup, credentials, and cost approval remain operator-owned if the configured paid reviewer is unavailable.
availability_status: unavailable
reviewer_verdict: blocker
disposition: Missing explicit escalated reviewer provider setup. Missing credential environment variable: BANDIT_ESCALATED_REVIEWER_API_KEY. Operator-owned input required: provider setup, credentials, and cost approval.
source_drift_status: current
bootstrap_gap_evidence:
  - none
