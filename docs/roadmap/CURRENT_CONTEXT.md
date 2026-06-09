# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-079` landed and closed the Improvement Health Surface Phase 8 product
slice. Its brief, orchestration plan, RED evidence, Claude implementation
evidence, PM acceptance, CodeRabbit timeout evidence, Local Qwen pass evidence,
risk classification, supply-chain gate, browser smoke, review evidence, UAT,
landing verdict, local-record landing action, retrospective, and improvement
disposition are recorded under `docs/work/BANDIT-079/` and `.bandit/policy/`.

**Active work item:** `BANDIT-079` (closed; retained as the current derived-status anchor until the next slice is formed).

The current stage is Stage 6: closed.

**Current next action:** Repo PM should triage and form the next Phase 8
cockpit product slice only if roadmap/product direction is sufficient;
otherwise ask the operator for the missing product direction. Do not start RED
evidence, implementation, review, UAT, landing, or closeout for another work
item until a new formed work item exists and the prior slice remains landed and
closed.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for closeout. Operator input may be needed
if Repo PM cannot derive the next Phase 8 product slice target from roadmap
artifacts.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-079` closeout evidence:

- Brief: `docs/work/BANDIT-079/brief.md`.
- Orchestration plan: `docs/work/BANDIT-079/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-079/red-evidence.md`.
- Implementation evidence: `docs/work/BANDIT-079/implementation-evidence.md`.
- Stage 3 PM review: `docs/work/BANDIT-079/stage3-pm-review.md`.
- Review evidence: `docs/work/BANDIT-079/review-evidence.md`.
- UAT approval: `docs/work/BANDIT-079/uat-approval.md`.
- Landing verdict: `docs/work/BANDIT-079/landing-verdict.md`.
- Landing action: `docs/work/BANDIT-079/landing-action.md`.
- Retrospective: `docs/work/BANDIT-079/retrospective.md`.
- Improvement disposition: `docs/work/BANDIT-079/improvement-disposition.md`.
- Coordination log: `docs/work/BANDIT-079/coordination-log.jsonl` records
  `closed`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. Do not create
the next slice brief, RED evidence, implementation evidence, review evidence,
UAT evidence, landing evidence, retrospective evidence, automatic improvement
evaluation, guarded browser action execution, local API work, State Index work,
scheduler execution, claim execution, worktree execution, public benchmark
publication, paid reviewer/model routing, hosted replay services, telemetry,
merge, push, deploy, Trust Verifier cutover, or unrelated product work until
the next work item is explicitly formed.
