# CodeRabbit Review: BANDIT-073

contract_version: 1
work_item: BANDIT-073
source_head: b7e9e377470cf641c193e952d5b24317131e7aa8
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: CodeRabbit live pre-PR provider path started and emitted setup/analyzing/reviewing heartbeats, but the 600 second run exited with timeout status 124 before a terminal review_completed event or actionable findings were returned. No CodeRabbit pass is claimed for BANDIT-073.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit --version returned 0.5.3.
  - coderabbit auth status --agent reported authenticated as pyxe-developer.
  - timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md exited 124 after setup/analyzing/reviewing status events and heartbeats.
bootstrap_gaps:
  - Pre-PR CodeRabbit provider did not return completed review evidence.
