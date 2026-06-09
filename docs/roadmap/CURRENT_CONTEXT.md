# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-083` is the last closed work item. Its Bandit Cockpit UI Polish From
Attached Design product slice landed locally and closed with landing action,
retrospective, improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-083/`.

**Active work item:** `BANDIT-084` - Claim-First Transition Policy Triage.

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should run plan-mode orchestration for
`BANDIT-084`, Claim-First Transition Policy Triage, before RED evidence,
implementation, review, landing, closeout, the next intake-derived gap, the V0
Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 work.

Do not start RED evidence, implementation, Stage 4 review, landing, UAT,
retrospective, the next intake-derived gap, Trust Verifier cutover, merge,
push, deploy, hosted replay service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser action
execution, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated
Phase 8 product work before Work Item PM records plan-mode orchestration for
`BANDIT-084`.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve universal claim-first
policy, require every transition to have an explicit prior claim, change claim
authority, force-resolve unsafe claim recovery, approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-084` Stage 1 formation evidence:

- Source spec:
  `docs/specs/BANDIT-084-claim-first-transition-policy-triage.json`.
- Brief: `docs/work/BANDIT-084/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-084/qwen-formation-review.md`.
- CodeRabbit formation review:
  `docs/work/BANDIT-084/coderabbit-formation-review.md`.
- Aggregate formation review:
  `docs/work/BANDIT-084/formation-review.md`.
- Coordination log: `docs/work/BANDIT-084/coordination-log.jsonl` records
  `brief_created` and `formation_approved`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-CLAIM-FIRST` as formed as `BANDIT-084`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-084` is triage only. Formation does not approve universal claim-first
policy, change claim authority, grant claims, release claims, reconcile claims,
create worktrees, start scheduler behavior, merge, push, deploy, approve paid
routing, approve hosted services, approve public benchmark publication, or
start unrelated Phase 8 product work.
