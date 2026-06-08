# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-073` has completed Stage 1 formation for the Gate Determinism And Flake
Gate bootstrap chore. Formation approval is recorded in
`docs/work/BANDIT-073/coordination-log.jsonl` after Local Qwen passed through
the authorized MLX adapter route, CodeRabbit timed out after the full 10-minute
window and was recorded as `bootstrap_gap` replacement evidence, and aggregate
Repo PM formation review passed.

**Active work item:** `BANDIT-073` (Stage 1 formation approved).

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should enter plan-mode orchestration for
`BANDIT-073` before RED evidence. Do not create `docs/work/BANDIT-073/orchestration-plan.md`
from Repo PM; that belongs to Work Item PM after this formation-approved handoff.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-073`
has brief, formation review, Qwen formation review, CodeRabbit timeout
replacement evidence, and `formation_approved` coordination evidence under
`docs/work/BANDIT-073/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-073` formation evidence:

- Source spec: `docs/specs/BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE.json`.
- Brief: `docs/work/BANDIT-073/brief.md`.
- Coordination log: `docs/work/BANDIT-073/coordination-log.jsonl`.
- Qwen formation review: `docs/work/BANDIT-073/qwen-formation-review.md`.
- CodeRabbit formation review: `docs/work/BANDIT-073/coderabbit-formation-review.md`.
- Aggregate formation review: `docs/work/BANDIT-073/formation-review.md`.

`BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is active and linked to `BANDIT-073` in
`.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8 product work,
guarded browser actions, local API work, State Index work, scheduler execution,
claim execution, worktree execution, public benchmark publication, paid
reviewer/model routing, hosted replay services, telemetry, merge, push, deploy,
or Trust Verifier cutover before `BANDIT-073` lands and closes out or is
explicitly blocked/dispositioned.

The next required step is Work Item PM plan-mode orchestration for `BANDIT-073`
before RED evidence.

The remaining verification-layer opportunities are queued in order: Metamorphic
Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence
Bundle Attestation, and Spec-To-Evidence Traceability Matrix.
