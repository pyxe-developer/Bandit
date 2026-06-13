# BANDIT-101 Improvement Disposition

contract_version: 1
work_item: BANDIT-101
stage: Stage 6 Improvement Disposition
status: complete
operator_input_status: none_required

## Durable Decisions

| Source | Decision | Rationale | Evidence |
| --- | --- | --- | --- |
| Typed reviewer adapters | keep | Reviewer profiles now validate `openai_compatible`, `cli_command`, `human`, and `none` adapter shapes before scaffolding reviewer files. | `src/state/reviewer-adapters.ts`, `src/commands/init.ts`, `test/reviewer-adapters.test.mjs` |
| Authorized Local Qwen adapter route | keep | The existing local route remains `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; the adapter is typed without changing routing authority. | `.bandit/reviewers/local-qwen.json`, `test/local-qwen-review.test.mjs` |
| No-reviewer gap behavior | keep | Empty reviewer profiles record an open no-reviewer bootstrap gap, and landing remains blocked until the gap is terminal or replacement evidence is explicit. | `src/state/reviewer-adapters.ts`, `src/commands/land-check.ts`, `test/landing-gates.test.mjs` |
| Human review replacement evidence | keep | Human replacement evidence is parsed from the canonical current work-item path, validates current source drift, and does not claim Local Qwen or CodeRabbit ran. | `src/state/human-review.ts`, `src/commands/land-check.ts`, `test/landing-gates.test.mjs` |
| CodeRabbit frozen-subject threshold | no_action_current_slice | The Stage 4 loop was corrected by freezing the review subject, repairing material critical/major findings, and dispositioning evidence-churn findings. No new bootstrap gap is opened because the current review-subject hash, non-blocking finding routing, and PM disposition contracts already support the needed behavior. | `docs/work/BANDIT-101/coderabbit-review.md`, `docs/work/BANDIT-101/coderabbit-finding-disposition.md`, `docs/work/BANDIT-101/review-evidence.md` |
| Local Qwen procedural findings | no_action_current_slice | The findings were non-blocking and procedural; PM disposition records why source repair was unnecessary and attaches aggregate Stage 4 evidence. | `docs/work/BANDIT-101/local-qwen-review.md`, `docs/work/BANDIT-101/qwen-finding-disposition.md` |
| Root risk/supply-chain index coverage | keep | Release-authorized validation now lists `BANDIT-101` in both root policy indexes before landing. | `.bandit/policy/risk-classification.json`, `.bandit/policy/supply-chain-gate.json` |
| Local-record landing transition split | no_action | The landing command writes landing-action evidence; Stage 6 closeout records parser-sensitive `landed` and `closed` coordination transitions. | `docs/work/BANDIT-101/landing-action.md`, `docs/work/BANDIT-101/coordination-log.jsonl` |

## Bootstrap Gap Disposition

No new bootstrap gap is opened from BANDIT-101. The Stage 4 CodeRabbit churn was
real process friction, but it was resolved inside the existing Stage 4
contracts: review-subject hash freshness, non-blocking finding routing,
CodeRabbit finding disposition, and PM acceptance. The durable decision is
explicit no-action for this slice, with the operating lesson recorded in the
retrospective.

## Improvement Mining Outcome

source_metadata:
  work_item: BANDIT-101
  source_stage: Stage 4 review and Stage 6 closeout
  source_artifacts:
    - docs/work/BANDIT-101/coderabbit-review.md
    - docs/work/BANDIT-101/coderabbit-finding-disposition.md
    - docs/work/BANDIT-101/local-qwen-review.md
    - docs/work/BANDIT-101/qwen-finding-disposition.md
    - docs/work/BANDIT-101/review-evidence.md
lesson: Freeze the review subject when review-evidence edits begin generating more reviewer findings than source-risk signal.
hypothesis: Applying PM thresholding to non-critical evidence-churn findings prevents unbounded Stage 4 loops without reducing blocker coverage.
metric: Future Stage 4 review loops complete with no repeated reviewer refresh solely for minor or trivial evidence wording findings.
baseline: BANDIT-101 required many CodeRabbit refreshes before the operator clarified the frozen-subject threshold and PM stopped the loop.
expected_direction: fewer artifact-only CodeRabbit refreshes per work item
decision_criteria: Open a future bootstrap-gap chore only if another work item repeats an unbounded artifact-churn loop after PM freezes the review subject.
evaluation_window: next three Stage 4 work items that invoke CodeRabbit
reevaluation_window: after BANDIT-102, BANDIT-103, and the next CodeRabbit-reviewed slice land or block
proxy_risk: PM thresholding could under-repair a real source issue if severity is misclassified; mitigate by only applying no-action to non-critical evidence wording or already-covered behavior.
status: monitored_no_action
evaluation_result: pending
outcome: no_action_current_slice

## Verification

- `node ./bin/bandit.mjs land-check BANDIT-101` - pass.
- `node ./bin/bandit.mjs auto-land-check BANDIT-101` - pass.
- `node ./bin/bandit.mjs land BANDIT-101 --action local-record` - pass.
- `npm run bandit -- validate` - pass before closeout.
- `node ./bin/bandit.mjs coordination validate BANDIT-101` - pass before closeout.
- `git diff --check` - pass before closeout.
