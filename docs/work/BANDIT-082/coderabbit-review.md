# CodeRabbit Review: BANDIT-082

contract_version: 1
work_item: BANDIT-082
source_head: da92577ea37e0b357d0285e0c0f907692fc62723
provider: coderabbit-cli
review_target: origin/main..HEAD
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: none
findings_disposition: CodeRabbit did not emit a terminal review verdict before the required 600 second wait elapsed, so no CodeRabbit pass is claimed. The captured provider output emitted setup and analyzing events only; no findings were emitted before timeout.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md -c docs/work/BANDIT-082/brief.md -c docs/work/BANDIT-082/red-evidence.md -c docs/work/BANDIT-082/implementation-evidence.md -c docs/work/BANDIT-082/stage3-pm-review.md
  - Captured output is stored under .bandit/tmp/BANDIT-082-coderabbit-review/output.jsonl.
  - The bounded run exited with code 124 after 600 seconds.
  - Output reached review_context, connecting, setup, preparing_sandbox, and analyzing/summarizing; it did not emit review_completed.
bootstrap_gaps:
  - coderabbit_timeout_without_terminal_review

## Provider Output Before Timeout

```jsonl
{"type":"review_context","reviewType":"all","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
{"type":"status","phase":"connecting","status":"connecting_to_review_service"}
{"type":"status","phase":"setup","status":"setting_up"}
{"type":"status","phase":"setup","status":"preparing_sandbox"}
{"type":"status","phase":"analyzing","status":"summarizing"}
```

## Findings

CodeRabbit did not return a terminal review and emitted no findings before
timeout. This artifact is accepted only as provider-timeout/bootstrap-gap
replacement evidence for the CodeRabbit Stage 4 gate.
