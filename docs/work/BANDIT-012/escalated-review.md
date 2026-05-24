# Escalated Review: BANDIT-012

contract_version: 1
work_item: BANDIT-012
source_head: 28e740d38b87797fd42631bfb4f2b48e44d25a47
profile_id: escalated-adversarial-placeholder
trigger_rationale: BANDIT-012 changes product-acceptance authority, CLI-owned UAT artifact validation, stale-source checks, and landing-gate enforcement.
availability_status: bootstrap_gap
reviewer_verdict: bootstrap_gap
disposition: Bootstrap placeholder accepted because live specialized approval-flow or state-integrity reviewer routing does not exist yet; replacement evidence is deterministic parser/validator coverage, full test verification, and passing local Qwen baseline review.
source_drift_status: current
bootstrap_gap_evidence:
  - No live specialized approval-flow or state-integrity reviewer integration exists yet.
  - The escalated adversarial reviewer placeholder gate exists, but live stronger-reviewer routing remains unavailable.
  - Baseline local Qwen review passed at source head 28e740d38b87797fd42631bfb4f2b48e44d25a47.
  - Focused landing-gate tests cover missing UAT evidence, stale UAT evidence, malformed UAT metadata, missing approval inputs, successful approval writing, and current UAT land-check reporting.
