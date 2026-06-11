# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-094` is the last closed work item. It landed and closed the second
`BANDIT-PRD-005` implementation slice: Repo PM Create Controller And Prompt
Contract.

`BANDIT-095` is the active work item. Repo PM formed it as a bootstrap-gap
repair after the newly landed create controller refused the valid closed-anchor
state instead of routing from closed `BANDIT-094` to the next unformed
PRD-005.3 target.

**Active work item:** `BANDIT-095` - Repo PM Create Controller Closed Anchor
Routing.

The current stage is Stage 1: formation_approved.

**Current next action:** Work Item PM should record plan-mode orchestration for
BANDIT-095 before RED evidence.

Do not create PRD-005.3 Work Item PM Execute Controller And Route Registry
briefs, RED evidence, implementation evidence, review-loop evidence, landing
evidence, UAT evidence, retrospective evidence, closeout evidence, PRD-005.4
adapter work, V0 Closeout Claude Code A/B Product-Value Trial implementation,
Trust Verifier cutover, merge, push, deploy, hosted service setup, paid
reviewer/model routing, public benchmark publication, local API work, State
Index work, guarded browser action execution, PR/CI/CD implementation,
installed-copy update-path implementation, or unrelated Phase 8 product work
before `BANDIT-095` lands and closes.

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

`BANDIT-095` formation evidence:

- Source spec:
  `docs/specs/BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING.json`.
- Brief and formation review:
  `docs/work/BANDIT-095/brief.md`,
  `docs/work/BANDIT-095/qwen-formation-review.md`,
  `docs/work/BANDIT-095/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-095/formation-review.md`.
- Coordination log:
  `docs/work/BANDIT-095/coordination-log.jsonl`, current state
  `formation_approved`.
- Active bootstrap gap:
  `BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING` in
  `.bandit/bootstrap-gaps.json`.

`BANDIT-094` closed evidence remains the prior slice-boundary source:

- `docs/work/BANDIT-094/landing-action.md`
- `docs/work/BANDIT-094/retrospective.md`
- `docs/work/BANDIT-094/improvement-disposition.md`
- `docs/work/BANDIT-094/coordination-log.jsonl`, current state `closed`

## Next Work

The next action is Work Item PM plan-mode orchestration for `BANDIT-095`.

After `BANDIT-095` lands and closes, Repo PM should return to PRD-005.3 Work
Item PM Execute Controller And Route Registry formation before PRD-005.4, V0
trial work, or unrelated Phase 8 product work.
