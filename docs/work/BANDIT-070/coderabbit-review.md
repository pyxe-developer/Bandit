# CodeRabbit Review: BANDIT-070

contract_version: 1
work_item: BANDIT-070
source_head: 6c4792a346b52db0eb8dc3ab01e97894ab9b632f
provider: coderabbit-cli
review_target: local-diff:origin/main
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: CodeRabbit provider timed out before returning terminal review findings; no CodeRabbit pass is claimed.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 300 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/work/BANDIT-070/brief.md
  - docs/reviewer-captures/BANDIT-070-coderabbit-review-output.jsonl
  - docs/reviewer-captures/BANDIT-070-coderabbit-review-exit-code.txt
  - Provider emitted review_context for main against origin/main, then setup statuses for connecting_to_review_service, setting_up, preparing_sandbox, and analyzing/summarizing.
  - Command exited 124 after 300 seconds without a terminal review payload.
bootstrap_gaps:
  - coderabbit_provider_timeout

## PM Disposition

CodeRabbit is recorded as `bootstrap_gap` replacement evidence for this Stage 4
gate. The provider did not return actionable findings or a pass verdict inside
the bounded timeout, so aggregate review must rely on deterministic
verification, Local Qwen review evidence, explicit risk classification,
supply-chain gate evidence, and PM review. No CodeRabbit pass is claimed.
