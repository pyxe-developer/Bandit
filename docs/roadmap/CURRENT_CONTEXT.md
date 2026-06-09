# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-082` has completed Stage 1 formation for the Work Intake Ledger And
Followups Migration slice. Its source spec, repaired brief, Local Qwen
formation review, CodeRabbit formation review, aggregate formation review, and
coordination evidence are recorded under `docs/specs/` and
`docs/work/BANDIT-082/`.

`BANDIT-081` remains the last closed work item. Its landing action,
retrospective, improvement disposition, and closeout evidence are recorded under
`docs/work/BANDIT-081/`.

**Active work item:** `BANDIT-082` - Work Intake Ledger And Followups Migration.

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should run plan-mode orchestration for
`BANDIT-082` and create `docs/work/BANDIT-082/orchestration-plan.md` before RED
evidence, implementation, review, landing, or closeout.

Do not start unrelated Phase 8 product work, Trust Verifier cutover, merge,
push, deploy, hosted replay service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser action
execution, or unrelated Phase 8 product work before Work Item PM plan-mode
orchestration for `BANDIT-082`. Do not form the V0 Closeout Claude Code A/B
Product-Value Trial slice until the pre-Claude-bakeoff follow-up and UI-polish
queue is formed or dispositioned.

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

`BANDIT-082` active evidence:

- Source spec:
  `docs/specs/BANDIT-082-work-intake-ledger-and-followups-migration.json`.
- Brief: `docs/work/BANDIT-082/brief.md`.
- Local Qwen formation review: `docs/work/BANDIT-082/qwen-formation-review.md`.
- CodeRabbit formation review:
  `docs/work/BANDIT-082/coderabbit-formation-review.md`.
- Aggregate formation review: `docs/work/BANDIT-082/formation-review.md`.
- Coordination log: `docs/work/BANDIT-082/coordination-log.jsonl` records
  `brief_created` and `formation_approved`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. `BANDIT-082`
is the active work item until it lands and closes. The roadmapped
pre-Claude-bakeoff follow-up and UI-polish queue remains ahead of the V0
Closeout Claude Code A/B Product-Value Trial.
Do not create automatic improvement evaluation, inbox write/resolve/archive
behavior, notification delivery, guarded browser action execution, local API
work, State Index work, scheduler execution, claim execution, worktree
execution, public benchmark publication, paid reviewer/model routing, hosted
replay services, telemetry, merge, push, deploy, Trust Verifier cutover, RED
evidence, implementation evidence, review evidence, landing evidence, UAT
evidence, retrospective evidence, or unrelated product work before Work Item PM
plan-mode orchestration records `docs/work/BANDIT-082/orchestration-plan.md`.
