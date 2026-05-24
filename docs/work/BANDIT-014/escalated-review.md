# Escalated Review: BANDIT-014

contract_version: 1
work_item: BANDIT-014
source_head: 5385a7f39bf28a64a9a1dd0a849b6dbaeda4a1da
profile_id: escalated-adversarial-placeholder
trigger_rationale: BANDIT-014 changes landing authority, Landing Agent contract validation, dirty-worktree enforcement, auto-landing execution state, and future bootstrap-gap closeout routing.
availability_status: bootstrap_gap
reviewer_verdict: bootstrap_gap
disposition: Bootstrap placeholder accepted because live specialized landing-policy or release-safety reviewer routing does not exist yet; replacement evidence is deterministic focused coverage, full verification, clean-code review, and passing local Qwen baseline review after repair.
source_drift_status: current
bootstrap_gap_evidence:
  - No live specialized landing-policy or release-safety reviewer integration exists yet.
  - The escalated adversarial reviewer placeholder gate exists, but live stronger-reviewer routing remains unavailable.
  - Baseline local Qwen review passed at source head 5385a7f39bf28a64a9a1dd0a849b6dbaeda4a1da.
  - Focused landing-gate tests cover Landing Agent contract validation, eligible chore landing evidence, feature-slice UAT refusal, dirty-worktree refusal, unsupported action refusal, unsupported option refusal, stale evidence refusal through shared readiness, and policy validation.
