# CodeRabbit Review: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: 00978d3585fecc3475f2480052e69b1847698be0
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: completed
coderabbit_verdict: blocker
findings_status: unresolved
findings_disposition: Replace the stale normalized CodeRabbit evidence entry that still describes the obsolete @babel/standalone@7.29.0-to-7.29.4 finding so the fixture records the current provider output.; Restrict TweaksPanel window.parent.postMessage for __edit_mode_set_keys to a trusted parent origin or handshake instead of dispatching tweak edits to '*'.; Guard TweaksPanel segAt before calling trackRef.current.getBoundingClientRect() so pointer handlers do not throw if the track ref has been cleared.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base origin/main
bootstrap_gaps:
  - none
