# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-076` exists for the Evidence Bundle Attestation bootstrap chore.
The Stage 1 brief is repaired and `brief_created` coordination evidence exists,
but formation approval is blocked because the authorized Local Qwen MLX adapter
route did not return a reviewer verdict.

**Active work item:** `BANDIT-076` (blocked in Stage 1 formation review).

The current stage is Stage 1: formation blocked.

**Current next action:** Repair the authorized Local Qwen MLX endpoint for
BANDIT-076 formation review, refresh qwen-formation-review.md and
formation-review.md, then run repo-pm approve-formation BANDIT-076.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

Operator-owned environment input is required before formation approval can
continue: restore the authorized Local Qwen MLX endpoint at
`http://127.0.0.1:8000/v1` for `BANDIT-076` formation review, or explicitly
authorize package/model environment repair. Repo evidence shows the endpoint is
down, the configured `unsloth/Qwen3.6-35B-A3B-MLX-8bit` cache is incomplete,
and the complete local `mlx-community/Qwen3.6-35B-A3B-8bit` snapshot cannot be
loaded by the installed `mlx-lm 0.26.0` server because `qwen3_5_moe` is
unsupported.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-076` current evidence:

- Source spec: `docs/specs/BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION.json`.
- Brief: `docs/work/BANDIT-076/brief.md`.
- Coordination log: `docs/work/BANDIT-076/coordination-log.jsonl` records
  `brief_created` and a `blocked` transition for Local Qwen provider repair.
- Qwen formation review: `docs/work/BANDIT-076/qwen-formation-review.md`
  records a blocker because the authorized MLX adapter route is unavailable.
- CodeRabbit formation review: `docs/work/BANDIT-076/coderabbit-formation-review.md`
  records provider timeout/bootstrap replacement evidence with no pass claimed.
- Aggregate formation review: `docs/work/BANDIT-076/formation-review.md`
  records a blocker until Local Qwen provider evidence is refreshed.

`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is active and linked to `BANDIT-076`
in `.bandit/bootstrap-gaps.json`. Do not start Work Item PM plan mode, RED
evidence, implementation, review, landing, closeout, unrelated Phase 8 product
work, guarded browser actions, local API work, State Index work, scheduler
execution, claim execution, worktree execution, public benchmark publication,
paid reviewer/model routing, hosted replay services, telemetry, merge, push,
deploy, Trust Verifier cutover, Spec-To-Evidence Traceability Matrix, or
unrelated product work before `formation_approved` is recorded.

The next required step is Local Qwen provider repair for `BANDIT-076` formation
review.

The remaining verification-layer opportunity queued after Evidence Bundle
Attestation is Spec-To-Evidence Traceability Matrix.
