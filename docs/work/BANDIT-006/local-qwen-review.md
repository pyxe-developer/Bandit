# Local Qwen Review: BANDIT-006

contract_version: 1
work_item: BANDIT-006
source_head: 61279b0ffc9bade9e4eda1ee0b59e1874283a01b
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
  - `npm run bandit -- qwen-review BANDIT-006` failed closed with `Local Qwen reviewer timed out` against source head `84e9260cf60e4e027a30d5217eddd9c78a40c617` after the profile was configured for local Ollama.
  - `npm run bandit -- qwen-review BANDIT-006` failed closed again with `Local Qwen reviewer timed out` against source head `61279b0ffc9bade9e4eda1ee0b59e1874283a01b` after the review packet was narrowed to the RED-evidence diff base.
  - `qwen --version` returned `0.16.0`; `ollama list` showed installed Qwen-family models including `qwen3.6:35b-a3b-coding-mxfp8`.
bootstrap_gaps:
  - The local Qwen runtime is installed and reachable through Qwen Code plus local Ollama, but the configured full-slice adversarial review exceeded the profile timeout before producing structured review output.
  - Replacement evidence for this bootstrap slice is fail-closed command behavior, focused subprocess tests, PM review, and explicit review/landing bootstrap-gap disposition.
