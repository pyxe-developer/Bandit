# CodeRabbit Review: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: 49f91f5d573430b5f6536d9f8fa39b0aa8aa49ed
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: completed
coderabbit_verdict: blocker
findings_status: unresolved
findings_disposition: Extract duplicated cockpitStatusFixture object declarations in test/cockpit-ui.test.mjs into a shared fixture helper.; Update stale ROADMAP.md next-action text that still instructs creating BANDIT-033-COCKPIT-SHELL-HARDENING instead of reflecting active BANDIT-034 Stage 4 work.; Ensure TweaksPanel scrub pointermove/pointerup listeners are removed if the component unmounts mid-drag.; Set reduced-motion animation and transition durations to 0s and pause animations in colors_and_type.css.; Add the native disabled attribute to disabled ActionButton elements in prototype-source/ui.jsx.; Ensure TweakRadio pointermove/pointerup listeners are removed if the component unmounts mid-drag.; Replace global :focus outline suppression with focus-visible keyboard focus styling in colors_and_type.css.; Update index.html script integrity hashes for React, ReactDOM, and Babel to match the loaded package versions.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base origin/main
bootstrap_gaps:
  - none
