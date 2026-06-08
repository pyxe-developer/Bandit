# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-074` is formed and approved for the Metamorphic Cross-Projection Checks
bootstrap chore. Stage 1 formation evidence exists under `docs/work/BANDIT-074/`
with Local Qwen pass evidence through the authorized MLX adapter route,
CodeRabbit provider-timeout replacement evidence after the full 10-minute
window, aggregate formation review, and `formation_approved` coordination
evidence.

**Active work item:** `BANDIT-074` (Stage 1 formation approved).

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should run plan-mode orchestration for
`BANDIT-074` before RED evidence, implementation, review, landing, closeout, or
later queued bootstrap-gap work.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-073`
has landing action, retrospective, bootstrap-gap disposition, roadmap/status
synchronization, and closed coordination evidence under `docs/work/BANDIT-073/`.
`BANDIT-074` has approved Stage 1 formation evidence under `docs/work/BANDIT-074/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-074` formation evidence:

- Source spec: `docs/specs/BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS.json`.
- Brief: `docs/work/BANDIT-074/brief.md`.
- Coordination log: `docs/work/BANDIT-074/coordination-log.jsonl` records
  `brief_created` and `formation_approved`.
- Qwen formation review: `docs/work/BANDIT-074/qwen-formation-review.md`.
- CodeRabbit formation review: `docs/work/BANDIT-074/coderabbit-formation-review.md`
  records provider timeout/bootstrap replacement evidence with no pass claimed.
- Aggregate formation review: `docs/work/BANDIT-074/formation-review.md`.

`BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is active and linked to
`BANDIT-074` in `.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8
product work, guarded browser actions, local API work, State Index work,
scheduler execution, claim execution, worktree execution, public benchmark
publication, paid reviewer/model routing, hosted replay services, telemetry,
merge, push, deploy, Trust Verifier cutover, RED evidence, implementation,
review, landing, or closeout before Work Item PM plan-mode orchestration is
recorded for `BANDIT-074`.

The next required step is Work Item PM plan-mode orchestration for `BANDIT-074`.

The remaining verification-layer opportunities queued after `BANDIT-074` are:
Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and
Spec-To-Evidence Traceability Matrix.
