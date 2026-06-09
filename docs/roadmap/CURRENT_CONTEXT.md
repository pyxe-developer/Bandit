# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-080` is active for the Queue & Context (Light) Phase 8 product slice.
Stage 1 formation, Work Item PM plan-mode orchestration, Stage 2 RED evidence,
Stage 3 implementation evidence, and Stage 4 aggregate review evidence exist
under `docs/work/BANDIT-080/`.

**Active work item:** `BANDIT-080` (review recorded; Stage 5 UAT pending).

The current stage is Stage 4: review_recorded.

**Current next action:** Record CLI-owned product UAT for BANDIT-080 using the
operator pre-approval, then record Stage 5 landing verdict, run land-check and
auto-land-check, and execute local-record landing action against the current
source/evidence commit.

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

`BANDIT-080` current evidence:

- Source spec: `docs/specs/BANDIT-080-queue-context-light.json`.
- Brief: `docs/work/BANDIT-080/brief.md`.
- Coordination log: `docs/work/BANDIT-080/coordination-log.jsonl` records
  `brief_created`, `formation_approved`, `orchestration_plan_recorded`,
  `red_recorded`, `implementation_recorded`, and `review_recorded`.
- Orchestration plan: `docs/work/BANDIT-080/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-080/red-evidence.md`.
- RED tests: `test/cockpit-queue-context.test.mjs`.
- Writer report: `docs/work/BANDIT-080/writer-report.md`.
- Implementation evidence: `docs/work/BANDIT-080/implementation-evidence.md`.
- PM acceptance: `docs/work/BANDIT-080/stage3-pm-review.md`.
- CodeRabbit review evidence:
  `docs/work/BANDIT-080/coderabbit-review.md` records a full-window provider
  timeout as bootstrap-gap replacement evidence; no CodeRabbit pass is claimed.
- Local Qwen review evidence: `docs/work/BANDIT-080/local-qwen-review.md`
  records non-blocking findings through the authorized local reviewer route.
- Qwen finding disposition:
  `docs/work/BANDIT-080/qwen-finding-disposition.md`.
- Browser smoke: `docs/work/BANDIT-080/browser-smoke.md`.
- Risk classification:
  `.bandit/policy/risk-classifications/BANDIT-080-risk-classification.json`.
- Supply-chain gate:
  `.bandit/policy/supply-chain-gates/BANDIT-080-supply-chain-gate.json`.
- Aggregate review evidence: `docs/work/BANDIT-080/review-evidence.md`.
- Qwen formation review: `docs/work/BANDIT-080/qwen-formation-review.md`
  records a pass through the authorized MLX adapter route.
- CodeRabbit formation review:
  `docs/work/BANDIT-080/coderabbit-formation-review.md` records terminal
  `review_completed` evidence with three trivial out-of-subject findings
  dispositioned as non-blocking for formation.
- Aggregate formation review: `docs/work/BANDIT-080/formation-review.md`
  records a pass.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`. Do not create
retrospective evidence, automatic improvement evaluation, guarded browser
action execution, local API work, State Index work, scheduler execution, claim
execution, worktree execution, public benchmark publication, paid
reviewer/model routing, hosted replay services, telemetry, merge, push,
deploy, Trust Verifier cutover, or unrelated product work from Stage 5 landing.

The next required step is Stage 5 UAT for `BANDIT-080`.
