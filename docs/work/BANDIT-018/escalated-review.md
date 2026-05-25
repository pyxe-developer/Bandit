# Escalated Review: BANDIT-018

contract_version: 1
work_item: BANDIT-018
source_head: 102d3a8b7e1cf05daffa903c10864385e0c61293
profile_id: security-reviewer-paid
trigger_rationale: Require the configured escalated adversarial reviewer route for BANDIT-018 because this chore implements paid-provider setup refusal, credential and cost boundaries, reviewer routing policy, and escalated-review evidence parsing. Codex PM owns this technical reviewer routing decision; actual provider setup, credentials, and cost approval remain operator-owned if the configured paid reviewer is unavailable.
availability_status: available
reviewer_verdict: pass
disposition: Operator-approved Sourmash-style claude -p Opus 4.7 headless review evidence is recorded in docs/work/BANDIT-018/model-comparison.md. Opus 4.7 accepted the focused repair, found no Stage 3 blocker, and returned non_blocking evidence-refresh findings only; those are dispositioned in docs/work/BANDIT-018/review-evidence.md and routed to BANDIT-019 where appropriate.
source_drift_status: current
bootstrap_gap_evidence:
  - none
