# CodeRabbit Review: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: c871b6251c8cd20176efcf9d33cac4e9b318ffb8
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: completed
coderabbit_verdict: blocker
findings_status: unresolved
findings_disposition: In docs/design/workflow-cockpit/prototype-source/screens.jsx around lines 43-49, replace the hardcoded "Create the next Phase 8 visual UI work item" text with dynamic content derived from app context or a prop, with a sensible fallback such as "Create the next work item".; In docs/design/workflow-cockpit/prototype-source/app.jsx around lines 24-33, guard against missing or malformed window.COCKPIT_TWEAK_DEFAULTS and COCKPIT_DATA before calling useTweaks or Object.keys, and treat missing item entries as empty.; In docs/design/workflow-cockpit/prototype-source/screens.jsx around lines 516-533, guard queueBand before mapping queueBand.rows so the queue screen does not throw when the queue band is absent.; In docs/design/workflow-cockpit/prototype-source/design-canvas.jsx around lines 407-423, validate message sender identity and origin before handling __dc_set_zoom or __dc_probe messages.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base origin/main
bootstrap_gaps:
  - none
