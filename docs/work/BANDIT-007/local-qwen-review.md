# Local Qwen Review: BANDIT-007

contract_version: 1
work_item: BANDIT-007
source_head: 6375436e6be76415bdd9b6493f0f79fd997a1c81
profile_id: local-qwen-baseline
runtime: command
model: qwen3.6:35b-a3b-coding-mxfp8 via local Ollama
run_status: bootstrap_gap
reviewer_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: Local Qwen executable route failed closed by timeout before returning reviewer findings.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - `npm run bandit -- qwen-review BANDIT-007` failed closed with `Local Qwen reviewer timed out` against source head `6375436e6be76415bdd9b6493f0f79fd997a1c81`.
bootstrap_gaps:
  - The configured local Qwen route is installed as the baseline adversarial reviewer, but it timed out before returning structured review output for this slice.
  - Replacement evidence is fail-closed timeout behavior, focused CodeRabbit gate tests, full local verification, and PM review.
