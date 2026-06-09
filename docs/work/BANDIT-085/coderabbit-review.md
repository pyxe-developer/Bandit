# CodeRabbit Review: BANDIT-085

contract_version: 1
work_item: BANDIT-085
source_head: 76a6d883cff1a53ba2ec2781afe9de0f52a47d65
provider: coderabbit-cli
review_target: local-diff:uncommitted
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: CodeRabbit timed out after the required 600-second wait window before returning completed review evidence; no CodeRabbit pass is claimed.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 600 coderabbit review --agent --type uncommitted > .bandit/tmp/BANDIT-085-coderabbit-review/output.log 2>&1
  - Captured output is stored under .bandit/tmp/BANDIT-085-coderabbit-review/output.log.
  - Terminal status: timeout exit code 124 after 600 seconds.
  - Observed provider phases: connecting_to_review_service, setting_up, preparing_sandbox, summarizing.
bootstrap_gaps:
  - coderabbit_timeout_without_terminal_review
