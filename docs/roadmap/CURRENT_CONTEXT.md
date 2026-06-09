# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-081` is formed and formation-approved for the Operator Attention /
Operator Inbox Surface Phase 8 product slice. Its source spec, brief, Local
Qwen formation review, CodeRabbit formation review, aggregate formation review,
and coordination evidence are recorded under `docs/specs/` and
`docs/work/BANDIT-081/`.

**Active work item:** `BANDIT-081` - Operator Attention / Operator Inbox Surface.

The current stage is Stage 1: formation_approved.

**Current next action:** Work Item PM should run plan-mode orchestration for
`BANDIT-081`: create `docs/work/BANDIT-081/orchestration-plan.md`, then run
`node ./bin/bandit.mjs work-item-pm start BANDIT-081` before RED evidence.

Do not start RED evidence, implementation, review, UAT, landing, or closeout
for `BANDIT-081` until Work Item PM plan mode records orchestration evidence.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for Work Item PM plan-mode orchestration.
CLI-owned product UAT is required before landing because `BANDIT-081` changes
the operator-facing cockpit surface.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-081` formation evidence:

- Source spec: `docs/specs/BANDIT-081-operator-attention-inbox-surface.json`.
- Brief: `docs/work/BANDIT-081/brief.md`.
- Local Qwen formation review: `docs/work/BANDIT-081/qwen-formation-review.md`.
- CodeRabbit formation review: `docs/work/BANDIT-081/coderabbit-formation-review.md`.
- Aggregate formation review: `docs/work/BANDIT-081/formation-review.md`.
- Coordination log: `docs/work/BANDIT-081/coordination-log.jsonl` records
  `formation_approved`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. Do not create
RED evidence, implementation evidence, review evidence, UAT evidence, landing
evidence, retrospective evidence, automatic improvement evaluation, inbox
write/resolve/archive behavior, notification delivery, guarded browser action
execution, local API work, State Index work, scheduler execution, claim
execution, worktree execution, public benchmark publication, paid reviewer/model
routing, hosted replay services, telemetry, merge, push, deploy, Trust Verifier
cutover, or unrelated product work until Work Item PM plan mode is recorded.
