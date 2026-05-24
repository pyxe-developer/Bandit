# Local Qwen Review: BANDIT-015

contract_version: 1
work_item: BANDIT-015
source_head: 1f08230d22fb98d44e72d080c7b0414574db9e3c
profile_id: local-qwen-baseline
runtime: command
model: Qwen3.6-35B-A3B-MLX-8bit
run_status: completed
reviewer_verdict: non_blocking
findings_status: open
findings_disposition: Several fail-closed refusal paths (missing PR context, stale source head, non-pass verdicts) throw errors without first writing actionable evidence to the repo-native artifact, deviating slightly from the spec requirement to 'fail closed with actionable evidence'.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - qwen-review command exited 0 using local-qwen-baseline.
  - The implementation successfully delivers the live CodeRabbit pre-landing loop, correctly enforcing fail-closed behavior for credential and PR context checks, source drift, and provider unavailability. It maintains strict source-of-truth boundaries by writing to the existing `coderabbit-review.md` contract and properly redacts secrets. The missing local Qwen and escalated review states are expected workflow blockers per the brief. The only deviation is that certain refusal paths exit via error without persisting evidence, which is a minor spec alignment gap.
structured_findings_json: ["Several fail-closed refusal paths (missing PR context, stale source head, non-pass verdicts) throw errors without first writing actionable evidence to the repo-native artifact, deviating slightly from the spec requirement to 'fail closed with actionable evidence'."]
bootstrap_gaps:
  - none
