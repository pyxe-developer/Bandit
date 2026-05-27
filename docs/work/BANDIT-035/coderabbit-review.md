# CodeRabbit Review: BANDIT-035

contract_version: 1
work_item: BANDIT-035
source_head: d04daea065809e28df11d6375cd7ca2097356414
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: completed
coderabbit_verdict: blocker
findings_status: unresolved
findings_disposition: test/artifact-create.test.mjs: the parser-compatibility test still mixes the work_item renderer assertion with operator_input_status and landing_agent_state enum-value changes; restore the existing fixture values in that test or split enum normalization into a separate focused test before Stage 4 can proceed.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base origin/main
bootstrap_gaps:
  - none
