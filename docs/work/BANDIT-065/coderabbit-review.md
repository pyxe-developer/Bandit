# CodeRabbit Review - BANDIT-065

contract_version: 1
work_item: BANDIT-065
source_head: 909b68aa89d7428dcdbf10f67673fddbf7f7dffc
provider: coderabbit-cli
review_target: origin/main
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: provider-timeout replacement evidence; no CodeRabbit pass claimed
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - Direct CodeRabbit CLI review connected to service and reached setup/analyzing status.
  - Bounded `timeout 300` command exited with code 124 before terminal review output.
bootstrap_gaps:
  - coderabbit_provider_timeout

## Command

```sh
timeout 300 coderabbit review --agent --base origin/main --files .bandit/policy/orchestrator-prompts.json docs/templates/work-item-pm-orchestrator-prompt.md src/state/orchestrator-prompts.ts src/commands/orchestrator-prompts.ts src/state/paths.ts src/commands/init.ts src/commands/validate.ts src/cli.ts test/orchestrator-prompts.test.mjs docs/work/BANDIT-065/red-evidence.md docs/work/BANDIT-065/implementation-evidence.md docs/work/BANDIT-065/stage3-pm-review.md docs/work/BANDIT-065/writer-report.md -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/work/BANDIT-065/brief.md --no-color
```

## Provider Output

The review connected to the service and reached setup/analyzing status:

```json
{"type":"review_context","reviewType":"all","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
{"type":"status","phase":"connecting","status":"connecting_to_review_service"}
{"type":"status","phase":"setup","status":"setting_up"}
{"type":"status","phase":"setup","status":"preparing_sandbox"}
{"type":"status","phase":"analyzing","status":"summarizing"}
```

No terminal `review_completed` output, findings payload, or provider error was
returned before the bounded `timeout 300` command exited with code `124`.

## Findings

No CodeRabbit findings are claimed because the provider did not return a
terminal review. This artifact is provider-timeout/bootstrap-gap replacement
evidence only.

## Summary

CodeRabbit pre-PR review for `BANDIT-065` is unavailable due to bounded provider
timeout. This must not be treated as pass evidence. Aggregate Stage 4 review may
proceed only by explicitly accepting this as provider-timeout/bootstrap-gap
replacement evidence alongside Local Qwen pass evidence, deterministic PM
inspection, and the required local verification commands.
