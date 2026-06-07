# CodeRabbit Review - BANDIT-068

contract_version: 1
work_item: BANDIT-068
source_head: 9ca6442cf2729fb47d9e374f14b4875bf0a75746
provider: coderabbit-cli
review_target: origin/main
review_state: timeout
coderabbit_verdict: bootstrap_gap
reviewer: coderabbit-cli
review_type: pre_pr_direct_provider_review
verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: provider-timeout replacement evidence; no CodeRabbit pass claimed
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - Repo-native `bandit coderabbit-review pre-pr` wrapper requires a fixture path in this repo version and could not run the live provider route directly.
  - Direct CodeRabbit CLI connected to service and reached setup/analyzing status.
  - Bounded timeout command exited with code 124 before terminal review output.
bootstrap_gaps:
  - coderabbit_provider_timeout
review_subject_hash: d5c45e40e61492611ea70e0b32458062c661775fbfab9b97750457c63a49b471
reviewed_at: 2026-06-07T19:46:09Z

## Command Evidence

The repo-native wrapper was attempted first:

```sh
timeout 360 npm run bandit -- coderabbit-review pre-pr BANDIT-068 --base origin/main
```

Result:

```text
Usage: bandit coderabbit-review pre-pr <work-item-id> --base <revision> --fixture <path>
```

The direct provider route was then attempted with current repository context:

```sh
timeout 300 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md
```

Provider output before timeout:

```json
{"type":"review_context","reviewType":"all","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
{"type":"status","phase":"connecting","status":"connecting_to_review_service"}
{"type":"status","phase":"setup","status":"setting_up"}
{"type":"status","phase":"setup","status":"preparing_sandbox"}
{"type":"status","phase":"analyzing","status":"summarizing"}
```

The command exited with code `124` after the bounded timeout. No terminal
`review_completed` payload, finding payload, or provider error was returned.

## Findings

No CodeRabbit findings are claimed because the provider did not return a
terminal review.

## Disposition

This artifact is provider-timeout/bootstrap replacement evidence only. Stage 4
must not treat CodeRabbit as pass evidence for `BANDIT-068`.
