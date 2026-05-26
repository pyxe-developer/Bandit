# CodeRabbit Review: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: df55118889d3472e947b395c581eb978c2e45240
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: completed
coderabbit_verdict: blocker
findings_status: unresolved
findings_disposition: In docs/design/workflow-cockpit/prototype-source/index.html around lines 67-69, update the Babel standalone script src from @7.29.4 to @7.29.7 and refresh the integrity attributes for the react, react-dom, and Babel script tags to current CDN-published SRI hashes while preserving crossorigin="anonymous".
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base origin/main
bootstrap_gaps:
  - none
