# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-078` is active for the Guarded CLI Action Requests Phase 8 product
slice. Stage 1 formation, Work Item PM plan-mode orchestration, and Stage 2 RED
evidence exist under `docs/work/BANDIT-078/`.

**Active work item:** `BANDIT-078` (RED evidence recorded; Stage 3 implementation pending).

The current stage is Stage 2: red_recorded.

**Current next action:** Dispatch Stage 3 implementation for `BANDIT-078` to
Claude-family Implementation Writer. Implement guarded action request metadata
and rendering without editing Test Writer-owned tests, fixtures, RED evidence,
or acceptance mappings.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-078` current evidence:

- Source spec: `docs/specs/BANDIT-078-guarded-cli-action-requests.json`.
- Brief: `docs/work/BANDIT-078/brief.md`.
- Coordination log: `docs/work/BANDIT-078/coordination-log.jsonl` records
  `brief_created`, `formation_approved`, `orchestration_plan_recorded`, and
  `red_recorded`.
- Orchestration plan: `docs/work/BANDIT-078/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-078/red-evidence.md`.
- Qwen formation review: `docs/work/BANDIT-078/qwen-formation-review.md`
  records a pass through the authorized MLX adapter route.
- CodeRabbit formation review: `docs/work/BANDIT-078/coderabbit-formation-review.md`
  records terminal `review_completed` evidence with zero findings.
- Aggregate formation review: `docs/work/BANDIT-078/formation-review.md`
  records a pass.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. Do not edit
Test Writer-owned tests, fixtures, RED evidence, or acceptance mappings during
Stage 3. Do not create review evidence, UAT evidence, landing evidence,
retrospective evidence, guarded browser action execution, local API work, State
Index work, scheduler execution, claim execution, worktree execution, public
benchmark publication, paid reviewer/model routing, hosted replay services,
telemetry, merge, push, deploy, Trust Verifier cutover, or unrelated product
work from Stage 3 implementation.

The next required step is Claude-family Stage 3 implementation for
`BANDIT-078`.
