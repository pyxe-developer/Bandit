# CodeRabbit Review: BANDIT-044

contract_version: 1
work_item: BANDIT-044
source_head: 89a1d5267a85ec59192eb4c3ea9f4cb51143102f
provider: coderabbit-agent-pre-pr
review_target: local-diff:1045751
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: provider error redacted: CodeRabbit CLI review reached analyzing/reviewing but did not return completed review evidence before Codex PM terminated the hung provider process.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base-commit 1045751 --files .bandit/policy/operator-boundary.json docs/templates/operator-boundary.md docs/work/BANDIT-044/implementation-evidence.md src/cli.ts src/commands/init.ts src/commands/operator-boundary.ts src/commands/validate.ts src/state/operator-boundary.ts src/state/paths.ts src/state/templates.ts test/validate.test.mjs -c AGENTS.md --no-color reached analyzing/reviewing but did not return completed review evidence before Codex PM terminated the hung provider process.
bootstrap_gaps:
  - Pre-PR CodeRabbit provider did not return completed review evidence.
