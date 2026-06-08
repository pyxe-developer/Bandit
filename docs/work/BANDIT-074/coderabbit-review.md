# CodeRabbit Stage 4 Review - BANDIT-074

contract_version: 1
work_item: BANDIT-074
source_head: 0a991abe44c6c2bee041c2393f9446ddda00de11
provider: coderabbit-agent-pre-pr
review_target: local-diff:origin/main
review_state: timeout
coderabbit_verdict: blocker
findings_status: unavailable
findings_disposition: provider-timeout replacement evidence; no CodeRabbit pass claimed
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - `npm run bandit -- coderabbit-review pre-pr BANDIT-074 --base origin/main` refused because the current repo-native wrapper requires `--fixture <path>`.
  - `timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md -c docs/work/BANDIT-074/brief.md` exited 124 after connecting, setup, sandbox preparation, summarizing, reviewing, heartbeat, and another sandbox preparation status.
bootstrap_gaps:
  - Live CodeRabbit provider did not return terminal completed review evidence before the full 10-minute timeout.

## Captured Output

Provider stream captured at
`docs/artifact-inputs/BANDIT-074-coderabbit-review-output.jsonl`.

The stream includes:

- `connecting_to_review_service`
- `setting_up`
- `preparing_sandbox`
- `summarizing`
- `reviewing`
- `heartbeat`
- another `preparing_sandbox`

No `review_completed`, finding payload, provider pass, request-changes verdict,
or terminal provider error was returned before timeout.

## Disposition

This artifact is provider-timeout/bootstrap replacement evidence only. It does
not claim a CodeRabbit pass. Stage 4 may proceed only with deterministic PM
inspection, focused verification, Local Qwen review through the configured MLX
adapter, risk classification, supply-chain gate, review-subject hash evidence,
and aggregate review evidence.
