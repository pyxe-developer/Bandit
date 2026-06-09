# CodeRabbit Review: BANDIT-084

contract_version: 1
work_item: BANDIT-084
source_head: 0610d5e2c2fe0c22a15f2cb4e8aff962eeba9b1c
provider: coderabbit-cli
review_target: local-diff:origin/main
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: CodeRabbit timed out after the required 600-second wait window before returning completed review evidence; no CodeRabbit pass is claimed.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md -c docs/work/BANDIT-084/brief.md -c docs/work/BANDIT-084/orchestration-plan.md -c docs/work/BANDIT-084/red-evidence.md -c docs/work/BANDIT-084/stage3-dispatch.md -c docs/work/BANDIT-084/claim-first-transition-disposition.md -c docs/work/BANDIT-084/writer-report.md -c docs/work/BANDIT-084/implementation-evidence.md -c docs/work/BANDIT-084/coordination-log.jsonl
  - Captured output is stored under .bandit/tmp/BANDIT-084-coderabbit-review/output.log.
  - Terminal status: timeout exit code 124 after 600 seconds.
bootstrap_gaps:
  - coderabbit_timeout_without_terminal_review
