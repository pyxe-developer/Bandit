# CodeRabbit Review - BANDIT-066

contract_version: 1
work_item: BANDIT-066
source_head: eaee411928fa508a04906deb4b9873710be865fe
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
  - Repo-native wrapper refused without fixture path.
  - Direct CodeRabbit CLI connected to service and reached setup/analyzing status.
  - Bounded timeout command exited with code 124 before terminal review output.
bootstrap_gaps:
  - coderabbit_provider_timeout
review_subject_hash: 557b9a69544ad8e1593cdb69f70ec2b2bc30e7f9d45450dcb3ab12524e89df0d
reviewed_at: 2026-06-07T17:40:00Z

## Command Evidence

The repo-native wrapper was attempted first:

```sh
npm run bandit -- coderabbit-review pre-pr BANDIT-066 --base origin/main
```

Result:

```text
Usage: bandit coderabbit-review pre-pr <work-item-id> --base <revision> --fixture <path>
```

Because the wrapper requires a fixture path in this bootstrap state, direct
CodeRabbit provider review was attempted with a bounded timeout and explicit
file scope:

```sh
timeout 300 coderabbit review --agent --base origin/main --files docs/specs/BANDIT-066-browser-served-cockpit-app-shell.json docs/work/BANDIT-066/brief.md docs/work/BANDIT-066/orchestration-plan.md docs/work/BANDIT-066/red-evidence.md docs/work/BANDIT-066/implementation-evidence.md docs/work/BANDIT-066/stage3-pm-review.md docs/work/BANDIT-066/writer-report.md test/cockpit-browser-shell.test.mjs src/cockpit/browser-shell.ts public/cockpit/index.html public/cockpit/cockpit.css -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md --no-color
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
must not treat CodeRabbit as pass evidence for `BANDIT-066`.
