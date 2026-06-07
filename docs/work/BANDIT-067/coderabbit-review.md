# CodeRabbit Review - BANDIT-067

contract_version: 1
work_item: BANDIT-067
source_head: 77b99121f5fc115ec1f049354f34718f58fdfb78
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
  - Direct CodeRabbit CLI connected to service and reached setup/analyzing/summarizing status.
  - Bounded timeout command exited with code 124 before terminal review output.
bootstrap_gaps:
  - coderabbit_provider_timeout
review_subject_hash: 7a60f5a89688b69acb60668fd212c72db2fd143069d0b74f37a03bb5d9e96720
reviewed_at: 2026-06-07T18:47:00Z

## Command Evidence

Direct CodeRabbit provider review was attempted with a bounded timeout and
explicit file scope:

```sh
timeout 300 coderabbit review --agent --base origin/main --files docs/specs/BANDIT-067-live-cockpit-status-view-from-cli-payload.json docs/work/BANDIT-067/brief.md docs/work/BANDIT-067/orchestration-plan.md docs/work/BANDIT-067/red-evidence.md docs/work/BANDIT-067/implementation-evidence.md docs/work/BANDIT-067/stage3-pm-review.md docs/work/BANDIT-067/writer-report.md test/cockpit-view-model.test.mjs test/cockpit-browser-shell.test.mjs test/helpers/cockpit-status-fixture.mjs src/state/cockpit-view-model.ts src/cockpit/render.ts src/cockpit/browser-shell.ts src/cockpit/preview-status-snapshot.ts src/cockpit/generate-cockpit-preview.ts public/cockpit/index.html -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md --no-color
```

Provider output before timeout:

```json
{"type":"review_context","reviewType":"all","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
```

Additional provider status lines reported connecting, setup,
preparing_sandbox, analyzing, and summarizing phases. The command exited with
code `124` after the bounded timeout. No terminal `review_completed` payload,
finding payload, or provider error was returned.

## Findings

No CodeRabbit findings are claimed because the provider did not return a
terminal review.

## Disposition

This artifact is provider-timeout/bootstrap replacement evidence only. Stage 4
must not treat CodeRabbit as pass evidence for `BANDIT-067`.
