# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-085` is the last closed work item. Its Repo-Wide Transition Index
Decision chore landed locally and closed with landing action, retrospective,
improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-085/`.

**Active work item:** `BANDIT-086` - Coordination Primitive Completion Triage.

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should start plan-mode orchestration for
`BANDIT-086` before RED evidence, implementation, review, landing, UAT,
retrospective, PR And CI/CD Landing Workflow Policy, Installed-Copy Update
Path, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase
8 work.

Do not start RED evidence, implementation, Stage 4 review, landing, UAT,
retrospective, PR And CI/CD Landing Workflow Policy, Installed-Copy Update Path,
Trust Verifier cutover, merge, push, deploy, hosted replay service setup, paid
reviewer/model routing, public benchmark publication, local API work, State
Index work, guarded browser action execution, the V0 Closeout Claude Code A/B
Product-Value Trial, or unrelated Phase 8 product work before Work Item PM
records plan-mode orchestration for `BANDIT-086`.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve a canonical repo-wide
transition ledger, approve State Index timing, approve local API work, approve
scheduler execution, approve claim/worktree lifecycle behavior, approve guarded
browser action execution authority, approve Trust Verifier cutover policy,
select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, or make
another policy/product decision repo artifacts cannot answer.

## Active Work

`BANDIT-086` formation evidence:

- Brief: `docs/work/BANDIT-086/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-086/qwen-formation-review.md`.
- CodeRabbit formation review:
  `docs/work/BANDIT-086/coderabbit-formation-review.md`.
- Aggregate formation review: `docs/work/BANDIT-086/formation-review.md`.
- Coordination log: `docs/work/BANDIT-086/coordination-log.jsonl` records
  `formation_approved`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-COORDINATION-PRIMITIVE` as formed as `BANDIT-086`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-086` is formed for decision/triage only. Stage 1 did not implement or
approve new coordination primitive behavior, canonical shared transition
authority, local API, State Index, scheduler, claim/worktree lifecycle, browser
mutation authority, PR/CI/CD behavior, merge, push, deploy, paid routing,
hosted services, public benchmark publication, cross-repo runtime behavior,
Trust Verifier cutover, or unrelated Phase 8 product work.
