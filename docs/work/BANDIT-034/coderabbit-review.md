# CodeRabbit Review: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: 43776fe84c7ba316f14fb3ff985ce6f97bbeac5b
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: completed
coderabbit_verdict: blocker
findings_status: unresolved
findings_disposition: In docs/design/workflow-cockpit/prototype-source/ui.jsx at line 208, update aria-disabled={disabled} to pass an ARIA string value such as aria-disabled={disabled ? "true" : "false"}, so disabled null or undefined values are handled explicitly.; In docs/design/workflow-cockpit/prototype-source/design-canvas.jsx around lines 842-851, add an appropriate dependency array to the keyboard-handler useEffect and stabilize the go and goSection callbacks with useCallback so the document keydown listener is not removed and re-added on every render.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base origin/main
bootstrap_gaps:
  - none
