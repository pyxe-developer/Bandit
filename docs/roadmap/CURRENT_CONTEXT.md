# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-078` is active for the Guarded CLI Action Requests Phase 8 product
slice. Stage 1 formation, Work Item PM plan-mode orchestration, Stage 2 RED
evidence, and Stage 3 implementation evidence exist under
`docs/work/BANDIT-078/`. Stage 3 implementation is accepted after MiniMax-M3
and Claude writer repairs, with PM verification passing the focused cockpit
suites, typecheck, and full `npm test`.

**Active work item:** `BANDIT-078` (Stage 4 review required).

The current stage is Stage 4: review required.

**Current next action:** Run Stage 4 review for `BANDIT-078`: request
CodeRabbit pre-PR evidence or record provider-refusal evidence, run Local Qwen
through `.bandit/reviewers/local-qwen.json` via
`bin/omlx-chat-completions.mjs`, record risk classification, supply-chain
evidence, browser smoke evidence, review-subject hash, aggregate review
evidence, and disposition every finding before landing.

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
  `brief_created`, `formation_approved`, `orchestration_plan_recorded`,
  `red_recorded`, and `implementation_recorded`.
- Orchestration plan: `docs/work/BANDIT-078/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-078/red-evidence.md`.
- Stage 3 dispatch: `docs/work/BANDIT-078/stage3-dispatch.md`.
- Stage 3 short dispatch: `docs/work/BANDIT-078/stage3-dispatch-short.md`.
- Stage 3 MiniMax fallback dispatch: `docs/work/BANDIT-078/stage3-minimax-dispatch.md`.
- Stage 3 Claude label repair dispatch: `docs/work/BANDIT-078/stage3-claude-label-repair-dispatch.md`.
- Stage 3 dispatch attempt/blocker: `docs/work/BANDIT-078/stage3-dispatch-attempt.md`.
- Writer report: `docs/work/BANDIT-078/writer-report.md`.
- Implementation evidence: `docs/work/BANDIT-078/implementation-evidence.md`.
- Stage 3 PM review: `docs/work/BANDIT-078/stage3-pm-review.md`.
- Qwen formation review: `docs/work/BANDIT-078/qwen-formation-review.md`
  records a pass through the authorized MLX adapter route.
- CodeRabbit formation review: `docs/work/BANDIT-078/coderabbit-formation-review.md`
  records terminal `review_completed` evidence with zero findings.
- Aggregate formation review: `docs/work/BANDIT-078/formation-review.md`
  records a pass.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. Do not create
UAT evidence, landing evidence, retrospective evidence, guarded browser action
execution, local API work, State Index work, scheduler execution, claim
execution, worktree execution, public benchmark publication, paid
reviewer/model routing, hosted replay services, telemetry, merge, push, deploy,
Trust Verifier cutover, or unrelated product work before Stage 4 review is
recorded and every finding is repaired or dispositioned.

The next required step is Stage 4 review for `BANDIT-078`.
