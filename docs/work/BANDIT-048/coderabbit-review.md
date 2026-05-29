# CodeRabbit Review: BANDIT-048

contract_version: 1
work_item: BANDIT-048
source_head: f2d72b8534bfb68b78fd1ab7f337e741ad48a705
provider: coderabbit-agent-pre-pr
review_target: local-diff:05162c4
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: provider error redacted: CodeRabbit pre-PR provider run was terminated after more than four minutes with no output after the analysis phase.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit --version returned 0.4.1.
  - coderabbit auth status --agent returned authenticated for github user pyxe-developer.
  - coderabbit review --agent --base-commit 05162c4 --files docs/evaluation/skills/bandit-cold-start.md docs/roadmap/CURRENT_CONTEXT.md docs/roadmap/ROADMAP.md docs/specs/BANDIT-048-implementation-evidence.json docs/work/BANDIT-048/dispatch.md docs/work/BANDIT-048/implementation-evidence.md docs/work/BANDIT-048/writer-report.md src/cli.ts src/commands/session-context.ts src/state/focused-session-context.ts -c AGENTS.md --no-color entered analysis but produced no terminal verdict before termination after more than four minutes.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-048 --base 05162c4 --fixture docs/specs/BANDIT-048-coderabbit-review-output.json normalized timeout blocker evidence.
bootstrap_gaps:
  - Pre-PR CodeRabbit provider did not return completed review evidence.
