# CodeRabbit Review: BANDIT-059

contract_version: 1
work_item: BANDIT-059
source_head: a773202da712d9fbaca40ed7522a51b92c418979
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: provider error redacted: CodeRabbit pre-PR provider review reached setup, sandbox preparation, and summarizing for the origin/main local diff, then produced no terminal verdict for more than five minutes before termination with SIGTERM.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit --version returned 0.4.1.
  - coderabbit auth status returned authenticated for GitHub user pyxe-developer.
  - git diff origin/main..HEAD secret-pattern scan found no obvious SECRET/TOKEN/PRIVATE KEY/password/api_key patterns before provider review.
  - coderabbit review --agent --base origin/main
  - Provider emitted review_context, connecting_to_review_service, setting_up, preparing_sandbox, and summarizing statuses, then produced no terminal verdict for more than five minutes before SIGTERM.
  - docs/specs/BANDIT-059-coderabbit-review-output.json records the normalized timeout attempt.
bootstrap_gaps:
  - Pre-PR CodeRabbit provider did not return completed review evidence.
