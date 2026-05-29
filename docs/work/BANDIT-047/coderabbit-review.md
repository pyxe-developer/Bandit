# CodeRabbit Review: BANDIT-047

contract_version: 1
work_item: BANDIT-047
source_head: d28caf7ecff48f46744ce52be942201994508775
provider: coderabbit-agent-pre-pr
review_target: local-diff:5b3520f
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: CodeRabbit provider timed out before completed review evidence; no pass was claimed
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit --version returned 0.4.1.
  - coderabbit auth status --agent returned authenticated for github user pyxe-developer.
  - coderabbit review --agent --base-commit 5b3520f --files .bandit/policy/model-family-separation.json docs/model-family-separation/BANDIT-047-model-family-separation.json docs/roadmap/CURRENT_CONTEXT.md docs/roadmap/ROADMAP.md docs/specs/BANDIT-047-implementation-evidence.json docs/templates/model-family-separation.md docs/work/BANDIT-047/implementation-evidence.md docs/work/BANDIT-047/writer-report.md src/commands/validate.ts src/state/model-family-separation.ts -c AGENTS.md --no-color entered analysis but produced no terminal verdict before timeout.
bootstrap_gaps:
  - Pre-PR CodeRabbit provider did not return completed review evidence.
