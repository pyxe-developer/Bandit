# CodeRabbit Review: BANDIT-080

contract_version: 1
work_item: BANDIT-080
source_head: 59de83fbdbd2938b717528e7dd8addbf2d803b65
provider: coderabbit-cli
review_target: origin/main..HEAD
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: CodeRabbit did not emit a terminal review verdict or finding payload before the required 600 second wait elapsed; no CodeRabbit pass or clean finding state is claimed.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md -c docs/work/BANDIT-080/brief.md -c docs/work/BANDIT-080/red-evidence.md -c docs/work/BANDIT-080/implementation-evidence.md -c docs/work/BANDIT-080/stage3-pm-review.md -c docs/work/BANDIT-080/stage4-repair-evidence.md -c docs/work/BANDIT-080/qwen-finding-disposition.md
  - Captured output is stored under .bandit/tmp/BANDIT-080-coderabbit-refresh/.
  - The bounded run exited with code 124 after 600 seconds.
  - Output reached review_context, setup, analyzing, reviewing, and heartbeat states, but did not emit review_completed or findings.
bootstrap_gaps:
  - coderabbit_timeout_without_terminal_review

## Provider Output Before Timeout

```jsonl
{"type":"review_context","reviewType":"all","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
{"type":"status","phase":"connecting","status":"connecting_to_review_service"}
{"type":"status","phase":"setup","status":"setting_up"}
{"type":"status","phase":"setup","status":"preparing_sandbox"}
{"type":"status","phase":"analyzing","status":"summarizing"}
{"type":"status","phase":"analyzing","status":"reviewing"}
{"type":"heartbeat","status":"reviewing"}
```

## Findings

No CodeRabbit findings are claimed because CodeRabbit did not return a terminal
review. This artifact is accepted only as provider-timeout/bootstrap-gap
replacement evidence for the CodeRabbit Stage 4 gate.
