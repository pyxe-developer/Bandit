# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-086` is the last closed work item. Its Coordination Primitive
Completion Triage chore landed locally and closed with landing action,
retrospective, improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-086/`.

**Active work item:** `BANDIT-087` - PR And CI/CD Landing Workflow Policy.

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should record plan-mode orchestration for
`BANDIT-087` before RED evidence.

Do not start RED evidence, implementation, Stage 4 review, landing, UAT,
retrospective, Installed-Copy Update Path, Trust Verifier cutover, merge, push,
deploy, hosted replay service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser action
execution, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated
Phase 8 product work before Work Item PM records plan-mode orchestration for
`BANDIT-087`.

No PR/CI/CD policy is approved, no remote publication is approved, no GitHub
credential usage is approved, no branch-protection change is approved, no CI
provider configuration is approved, no merge/push/deploy authority is
approved, no Trust Verifier cutover is approved, no Trust Goal is selected for
cutover, no old gate path is replaced or wrapped, and no Pi/Aperture runtime
work is active.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve PR/CI/CD policy,
approve remote publication, approve GitHub credential usage, approve
branch-protection changes, approve CI provider configuration, approve
merge/push/deploy authority, approve deployment/canary behavior, approve
hosted services, approve public benchmark publication, approve paid
reviewer/model routing, approve Trust Verifier cutover policy, select a Trust
Goal for cutover, replace or wrap an older gate path, change product or UAT
direction, approve business tradeoffs, approve explicit cost/risk posture,
approve live reviewer/model routing, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-087` Stage 1 formation evidence:

- Brief: `docs/work/BANDIT-087/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-087/qwen-formation-review.md`.
- CodeRabbit formation review:
  `docs/work/BANDIT-087/coderabbit-formation-review.md` records provider
  timeout/bootstrap replacement evidence with no CodeRabbit pass claimed.
- Aggregate formation review: `docs/work/BANDIT-087/formation-review.md`.
- Coordination log: `docs/work/BANDIT-087/coordination-log.jsonl` records
  `brief_created` and `formation_approved`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-PR-CICD-LANDING` as formed as `BANDIT-087`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-087` is policy triage only. It does not implement or approve PR
creation, CI orchestration, merge, push, deploy, credential setup,
branch-protection changes, hosted services, public benchmark publication, paid
routing, Trust Verifier cutover, local-record replacement, local API, State
Index, scheduler behavior, claim/worktree lifecycle, guarded browser action
execution, Installed-Copy Update Path, the V0 Closeout Claude Code A/B
Product-Value Trial, or unrelated Phase 8 product work.
