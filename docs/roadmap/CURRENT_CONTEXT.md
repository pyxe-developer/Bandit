# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-087` is the last closed work item. Its PR And CI/CD Landing Workflow
Policy triage chore landed locally and closed with landing action,
retrospective, improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-087/`.

**Active work item:** `BANDIT-087` - PR And CI/CD Landing Workflow Policy
(closed anchor).

The current stage is Stage 6: closed.

**Current next action:** Repo PM should form the next intake-derived gap work
item for `WIL-INSTALLED-COPY-UPDATE`, Installed-Copy Update Path, before the V0
Closeout Claude Code A/B Product-Value Trial or unrelated Phase 8 work.

Do not start Installed-Copy Update Path implementation, the V0 Closeout Claude
Code A/B Product-Value Trial, Trust Verifier cutover, merge, push, deploy,
hosted service setup, paid reviewer/model routing, public benchmark
publication, local API work, State Index work, guarded browser action
execution, PR/CI/CD implementation, or unrelated Phase 8 product work before
Repo PM forms the Installed-Copy Update Path work item through normal Stage 1
formation.

No PR/CI/CD policy is approved, no remote publication is approved, no GitHub
credential usage is approved, no branch-protection change is approved, no CI
provider configuration is approved, no merge/push/deploy authority is
approved, no deploy/canary behavior is approved, no hosted service is approved,
no Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, and no Pi/Aperture runtime work is
active.

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

`BANDIT-087` closeout evidence:

- Brief: `docs/work/BANDIT-087/brief.md`.
- Orchestration plan: `docs/work/BANDIT-087/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-087/red-evidence.md`.
- Implementation disposition:
  `docs/work/BANDIT-087/pr-cicd-landing-policy-disposition.md`.
- Implementation evidence: `docs/work/BANDIT-087/implementation-evidence.md`.
- CodeRabbit review: `docs/work/BANDIT-087/coderabbit-review.md`.
- Local Qwen review: `docs/work/BANDIT-087/local-qwen-review.md`.
- Aggregate review evidence: `docs/work/BANDIT-087/review-evidence.md`.
- Landing verdict: `docs/work/BANDIT-087/landing-verdict.md`.
- Landing action: `docs/work/BANDIT-087/landing-action.md`.
- Retrospective: `docs/work/BANDIT-087/retrospective.md`.
- Improvement disposition:
  `docs/work/BANDIT-087/improvement-disposition.md`.
- Coordination log: `docs/work/BANDIT-087/coordination-log.jsonl`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-PR-CICD-LANDING` closed as `BANDIT-087`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-087` deferred PR/CI/CD landing implementation. It did not implement or
approve PR creation, CI orchestration, merge, push, deploy, credential setup,
branch-protection changes, hosted services, public benchmark publication, paid
routing, Trust Verifier cutover, local-record replacement, local API, State
Index, scheduler behavior, claim/worktree lifecycle, guarded browser action
execution, Installed-Copy Update Path, the V0 Closeout Claude Code A/B
Product-Value Trial, or unrelated Phase 8 product work.
