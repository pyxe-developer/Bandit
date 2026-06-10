# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-094` is the last closed work item. It landed and closed the second
`BANDIT-PRD-005` implementation slice: Repo PM Create Controller And Prompt
Contract.

**Active work item:** `BANDIT-094` - Repo PM Create Controller And Prompt Contract.

The current stage is Stage 6: closed.

**Current next action:** Repo PM should form the next work item for PRD-005.3
Work Item PM Execute Controller And Route Registry.

Do not create PRD-005.3 RED evidence, implementation evidence, review-loop
evidence, landing evidence, UAT evidence, retrospective evidence, closeout
evidence, PRD-005.4 adapter work, V0 Closeout Claude Code A/B Product-Value
Trial implementation, Trust Verifier cutover, merge, push, deploy, hosted
service setup, paid reviewer/model routing, public benchmark publication,
local API work, State Index work, guarded browser action execution, PR/CI/CD
implementation, installed-copy update-path implementation, or unrelated Phase 8
product work before Repo PM forms and approves the next work item.

No public package publishing is approved, no paid registry setup is approved,
no hosted update service is approved, no telemetry is approved, no automatic
self-update is approved, no credential handling is approved, no external repo
mutation is approved, no installed global skill mutation is approved, no
automation prompt mutation is approved, no merge/push/deploy authority is
approved, no Trust Verifier cutover is approved, no Trust Goal is selected for
cutover, no old gate path is replaced or wrapped, and no Pi/Aperture runtime
work is active.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8001/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would expand landing autonomy, approve
Notify-And-Revert or Auto-Landing Scope for a new boundary cell, approve public
package publishing, approve paid registry setup, approve hosted update
services, approve telemetry, approve automatic self-update, approve credential
handling, approve external repo mutation, approve installed global skill
mutation, approve automation prompt mutation, approve merge/push/deploy
authority, approve Trust Verifier cutover policy, select a Trust Goal for
cutover, replace or wrap an older gate path, change product or UAT direction,
approve business tradeoffs, approve explicit cost/risk posture, approve paid or
live reviewer/model routing, or make another policy/product decision repo
artifacts cannot answer.

## Active Work

`BANDIT-094` closed evidence:

- Source spec:
  `docs/specs/BANDIT-094-repo-pm-create-controller-and-prompt-contract.json`.
- Brief and formation review:
  `docs/work/BANDIT-094/brief.md`,
  `docs/work/BANDIT-094/qwen-formation-review.md`,
  `docs/work/BANDIT-094/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-094/formation-review.md`.
- Orchestration, RED, implementation, and PM acceptance:
  `docs/work/BANDIT-094/orchestration-plan.md`,
  `docs/work/BANDIT-094/red-evidence.md`,
  `docs/work/BANDIT-094/implementation-evidence.md`,
  `docs/work/BANDIT-094/writer-report.md`, and
  `docs/work/BANDIT-094/stage3-pm-acceptance.md`.
- Review, risk, and supply-chain evidence:
  `docs/work/BANDIT-094/coderabbit-review.md`,
  `docs/work/BANDIT-094/coderabbit-finding-disposition.md`,
  `docs/work/BANDIT-094/local-qwen-review.md`,
  `docs/work/BANDIT-094/review-evidence.md`,
  `.bandit/policy/risk-classifications/BANDIT-094-risk-classification.json`,
  and `.bandit/policy/supply-chain-gates/BANDIT-094-supply-chain-gate.json`.
- Landing and closeout:
  `docs/work/BANDIT-094/landing-verdict.md`,
  `docs/work/BANDIT-094/landing-action.md`,
  `docs/work/BANDIT-094/retrospective.md`, and
  `docs/work/BANDIT-094/improvement-disposition.md`.
- Coordination log:
  `docs/work/BANDIT-094/coordination-log.jsonl`, current state `closed`.

## Next Work

The next planned work item is PRD-005.3 Work Item PM Execute Controller And
Route Registry. Repo PM must form and approve that work item before Work Item
PM orchestration, RED evidence, or implementation begins.
