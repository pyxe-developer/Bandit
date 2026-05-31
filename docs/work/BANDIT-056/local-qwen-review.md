# Local Qwen Review: BANDIT-056

contract_version: 1
work_item: BANDIT-056
source_head: ff0c734052f50916a31a865b2d8d4107a63e1d23
profile_id: local-qwen-baseline
runtime: command
model: Qwen3.6-35B-A3B-MLX-8bit
run_status: bootstrap_gap
reviewer_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: Local Qwen executable route failed closed by timeout twice before returning structured reviewer findings.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - npm run bandit -- qwen-review BANDIT-056 failed closed with Local Qwen reviewer timed out against source head ff0c734052f50916a31a865b2d8d4107a63e1d23.
  - A second npm run bandit -- qwen-review BANDIT-056 attempt also failed closed with Local Qwen reviewer timed out against source head ff0c734052f50916a31a865b2d8d4107a63e1d23.
  - .bandit/reviewers/local-qwen.json configures local-qwen-baseline with Qwen3.6-35B-A3B-MLX-8bit and timeout_ms 180000.
structured_findings_json: []
bootstrap_gaps:
  - The configured Local Qwen route was available enough to start but exceeded the profile timeout twice before producing structured review output.
  - Replacement evidence is fail-closed command behavior, current CodeRabbit pass evidence, focused tests, typecheck, Bandit validation, and Codex PM review routing.
