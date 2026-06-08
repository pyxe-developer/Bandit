# CodeRabbit Review: BANDIT-078

contract_version: 1
work_item: BANDIT-078
source_head: b897b41b407c85cb8cccbba7368fdf50fc6bc638
provider: coderabbit-cli
review_target: origin/main..HEAD
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: CodeRabbit did not emit a terminal review verdict or finding payload before the required 600 second wait elapsed; no CodeRabbit pass or clean finding state is claimed.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md -c docs/work/BANDIT-078/brief.md -c docs/work/BANDIT-078/red-evidence.md -c docs/work/BANDIT-078/implementation-evidence.md -c docs/work/BANDIT-078/stage3-pm-review.md
  - CodeRabbit CLI was authenticated before the run as pyxe-developer.
  - The bounded run exited with code 124 after 600 seconds.
  - Output reached review_context, setup, preparing_sandbox, analyzing, reviewing, and heartbeat states, but did not emit review_completed or findings.
bootstrap_gaps:
  - coderabbit_timeout_without_terminal_review
