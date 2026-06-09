# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-081` has landed and closed the Operator Attention / Operator Inbox
Surface Phase 8 product slice. Its source spec, brief, formation reviews,
orchestration plan, RED tests, RED evidence, Claude-family implementation, PM
acceptance, CodeRabbit timeout/repaired-finding evidence, Local Qwen pass
evidence, risk classification, supply-chain gate, browser smoke, aggregate
review evidence, UAT, landing verdict, landing action, retrospective,
improvement disposition, and coordination evidence are recorded under
`docs/specs/`, `test/`, `src/`, `public/`, `.bandit/policy/`, and
`docs/work/BANDIT-081/`.

**Active work item:** `BANDIT-081` - Operator Attention / Operator Inbox Surface.

The current stage is Stage 6: closed.

**Current next action:** Repo PM should triage and form the V0 Closeout Claude
Code A/B Product-Value Trial slice only if roadmap/product direction is
sufficient; otherwise ask the operator for the missing product direction.

Do not start unrelated Phase 8 product work, Trust Verifier cutover, merge,
push, deploy, hosted replay service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, or guarded browser
action execution before Repo PM forms the next slice through normal Stage 1
formation.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-081` active evidence:

- Source spec: `docs/specs/BANDIT-081-operator-attention-inbox-surface.json`.
- Brief: `docs/work/BANDIT-081/brief.md`.
- Local Qwen formation review: `docs/work/BANDIT-081/qwen-formation-review.md`.
- CodeRabbit formation review: `docs/work/BANDIT-081/coderabbit-formation-review.md`.
- Aggregate formation review: `docs/work/BANDIT-081/formation-review.md`.
- Coordination log: `docs/work/BANDIT-081/coordination-log.jsonl` records
  `formation_approved`, `orchestration_plan_recorded`, `red_recorded`,
  `implementation_recorded`, and `review_recorded`.
- Orchestration plan: `docs/work/BANDIT-081/orchestration-plan.md`.
- RED tests: `test/cockpit-operator-attention.test.mjs`.
- RED evidence: `docs/work/BANDIT-081/red-evidence.md`.
- Stage 3 dispatch: `docs/work/BANDIT-081/stage3-dispatch.md`.
- Writer report: `docs/work/BANDIT-081/writer-report.md`.
- Implementation evidence: `docs/work/BANDIT-081/implementation-evidence.md`.
- PM acceptance: `docs/work/BANDIT-081/stage3-pm-review.md`.
- CodeRabbit review: `docs/work/BANDIT-081/coderabbit-review.md`.
- CodeRabbit finding disposition:
  `docs/work/BANDIT-081/coderabbit-finding-disposition.md`.
- Stage 4 repair evidence: `docs/work/BANDIT-081/stage4-repair-evidence.md`.
- Local Qwen review: `docs/work/BANDIT-081/local-qwen-review.md`.
- Browser smoke: `docs/work/BANDIT-081/browser-smoke.md`.
- Aggregate review evidence: `docs/work/BANDIT-081/review-evidence.md`.
- UAT approval: `docs/work/BANDIT-081/uat-approval.md`.
- Landing verdict: `docs/work/BANDIT-081/landing-verdict.md`.
- Landing action: `docs/work/BANDIT-081/landing-action.md`.
- Retrospective: `docs/work/BANDIT-081/retrospective.md`.
- Improvement disposition: `docs/work/BANDIT-081/improvement-disposition.md`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. `BANDIT-081`
remains the active derived-status anchor until Repo PM forms the next slice.
Do not create automatic improvement evaluation, inbox write/resolve/archive
behavior, notification delivery, guarded browser action execution, local API
work, State Index work, scheduler execution, claim execution, worktree
execution, public benchmark publication, paid reviewer/model routing, hosted
replay services, telemetry, merge, push, deploy, Trust Verifier cutover, or
unrelated product work before the next slice is formed.
