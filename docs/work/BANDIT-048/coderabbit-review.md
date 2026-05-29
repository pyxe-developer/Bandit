# CodeRabbit Review: BANDIT-048

contract_version: 1
work_item: BANDIT-048
source_head: 4bba35a888c63deb2b2dd2bff2cf42c1fc5bcbe3
provider: coderabbit-agent-pre-pr
review_target: local-diff:05162c4
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: provider error redacted: CodeRabbit pre-PR provider timed out twice. The retry reached setup and summarizing, then produced no terminal verdict before termination after more than four minutes.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit --version returned 0.4.1.
  - coderabbit auth status --agent returned authenticated for github user pyxe-developer.
  - First coderabbit review --agent --base-commit 05162c4 --files docs/evaluation/skills/bandit-cold-start.md docs/roadmap/CURRENT_CONTEXT.md docs/roadmap/ROADMAP.md docs/specs/BANDIT-048-implementation-evidence.json docs/work/BANDIT-048/dispatch.md docs/work/BANDIT-048/implementation-evidence.md docs/work/BANDIT-048/writer-report.md src/cli.ts src/commands/session-context.ts src/state/focused-session-context.ts -c AGENTS.md --no-color entered analysis but produced no terminal verdict before termination after more than four minutes.
  - Retry coderabbit review --agent --base-commit 05162c4 --files docs/evaluation/skills/bandit-cold-start.md docs/roadmap/CURRENT_CONTEXT.md docs/roadmap/ROADMAP.md docs/specs/BANDIT-048-implementation-evidence.json docs/work/BANDIT-048/dispatch.md docs/work/BANDIT-048/implementation-evidence.md docs/work/BANDIT-048/writer-report.md src/cli.ts src/commands/session-context.ts src/state/focused-session-context.ts -c AGENTS.md --no-color reached setup and summarizing, then produced no terminal verdict before termination after more than four minutes.
  - docs/specs/BANDIT-048-coderabbit-review-output.json records two timeout attempts for the scoped pre-PR provider path.
bootstrap_gaps:
  - Pre-PR CodeRabbit provider did not return completed review evidence.
