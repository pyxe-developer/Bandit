# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-086` is the last closed work item. Its Coordination Primitive
Completion Triage chore landed locally and closed with landing action,
retrospective, improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-086/`.

**Active work item:** `BANDIT-086` - Coordination Primitive Completion Triage
(closed anchor).

The current stage is Stage 6: closeout complete.

**Current next action:** Repo PM should form the next intake-derived gap work
item for `WIL-PR-CICD-LANDING`, PR And CI/CD Landing Workflow Policy, before
Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value
Trial, or unrelated Phase 8 work.

Do not start RED evidence, implementation, Stage 4 review, landing, UAT,
retrospective, Installed-Copy Update Path, Trust Verifier cutover, merge, push,
deploy, hosted replay service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser action
execution, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated
Phase 8 product work before Repo PM forms the next intake-derived gap work item
for `WIL-PR-CICD-LANDING`.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve PR/CI/CD policy,
approve a canonical repo-wide transition ledger, approve State Index timing,
approve local API work, approve scheduler execution, approve claim/worktree
lifecycle behavior, approve guarded browser action execution authority,
approve Trust Verifier cutover policy, select a Trust Goal for cutover, replace
or wrap an older gate path, merge/push/deploy, change product or UAT direction,
approve public benchmark publication, approve paid reviewer/model routing,
approve hosted replay services or other external service setup, approve
business tradeoffs, approve explicit cost/risk posture, approve live
reviewer/model routing, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

`BANDIT-086` closeout evidence:

- Brief: `docs/work/BANDIT-086/brief.md`.
- Disposition:
  `docs/work/BANDIT-086/coordination-primitive-completion-disposition.md`.
- Review evidence: `docs/work/BANDIT-086/review-evidence.md`.
- Landing action: `docs/work/BANDIT-086/landing-action.md`.
- Retrospective: `docs/work/BANDIT-086/retrospective.md`.
- Improvement disposition: `docs/work/BANDIT-086/improvement-disposition.md`.
- Coordination log: `docs/work/BANDIT-086/coordination-log.jsonl` records
  `closed`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-COORDINATION-PRIMITIVE` as closed as `BANDIT-086`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-086` was decision/triage only. It did not implement or approve new
coordination primitive behavior, canonical shared transition authority, local
API, State Index, scheduler, claim/worktree lifecycle, browser mutation
authority, PR/CI/CD behavior, merge, push, deploy, paid routing, hosted
services, public benchmark publication, cross-repo runtime behavior, Trust
Verifier cutover, or unrelated Phase 8 product work.
