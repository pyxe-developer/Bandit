# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-081` has completed Work Item PM plan-mode orchestration, Stage 2 RED
evidence, and Stage 3 implementation evidence for the Operator Attention /
Operator Inbox Surface Phase 8 product slice. Its source spec, brief, formation
reviews, orchestration plan, RED tests, RED evidence, Claude-family
implementation, PM acceptance, and coordination evidence are recorded under
`docs/specs/`, `test/`, `src/`, `public/`, and `docs/work/BANDIT-081/`.

**Active work item:** `BANDIT-081` - Operator Attention / Operator Inbox Surface.

The current stage is Stage 3: implementation_recorded.

**Current next action:** Run Stage 4 review for `BANDIT-081`: request/read
CodeRabbit review or record provider-refusal/bootstrap evidence, run Local Qwen
through the authorized `.bandit/reviewers/local-qwen.json` route, record risk
classification, supply-chain gate, browser smoke evidence, and aggregate review
evidence before landing.

Do not start UAT, landing, or closeout for `BANDIT-081` until Stage 4 review
evidence is complete and all reviewer findings are repaired or dispositioned.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for Stage 4 review unless CodeRabbit or
Local Qwen tooling becomes unavailable. CLI-owned product UAT is required before
landing because `BANDIT-081` changes the operator-facing cockpit surface.

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
  `formation_approved`, `orchestration_plan_recorded`, and `red_recorded`.
- Orchestration plan: `docs/work/BANDIT-081/orchestration-plan.md`.
- RED tests: `test/cockpit-operator-attention.test.mjs`.
- RED evidence: `docs/work/BANDIT-081/red-evidence.md`.
- Stage 3 dispatch: `docs/work/BANDIT-081/stage3-dispatch.md`.
- Writer report: `docs/work/BANDIT-081/writer-report.md`.
- Implementation evidence: `docs/work/BANDIT-081/implementation-evidence.md`.
- PM acceptance: `docs/work/BANDIT-081/stage3-pm-review.md`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. Do not create
UAT evidence, landing evidence, retrospective evidence, automatic improvement
evaluation, inbox write/resolve/archive behavior, notification delivery,
guarded browser action execution, local API work, State Index work, scheduler
execution, claim execution, worktree execution, public benchmark publication,
paid reviewer/model routing, hosted replay services, telemetry, merge, push,
deploy, Trust Verifier cutover, or unrelated product work until Stage 4 review
is complete.
