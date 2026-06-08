# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-077` is in Stage 6 closeout for the Spec-To-Evidence Traceability Matrix
bootstrap chore. Stage 1 brief, Qwen formation review, CodeRabbit
provider-timeout evidence, aggregate formation review, `formation_approved`,
plan-mode, Stage 2 RED evidence, Stage 3 implementation evidence, writer
report, PM acceptance, CodeRabbit provider-timeout review evidence, Local Qwen
pass evidence, risk classification, supply-chain gate, review-subject hash, and
aggregate Stage 4 review evidence, Stage 5 landing verdict, and local-record
landing action evidence exist under `docs/work/BANDIT-077/` and
`.bandit/policy/`.

**Active work item:** `BANDIT-077` (Stage 6 closeout required next).

The current stage is Stage 6: closeout required.

**Current next action:** Record Stage 6 closeout for BANDIT-077: retrospective,
structured improvement disposition, bootstrap-gap resolution, routing sync, and
final validation.

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

`BANDIT-077` current evidence:

- Source spec: `docs/specs/BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX.json`.
- Brief: `docs/work/BANDIT-077/brief.md`.
- Coordination log: `docs/work/BANDIT-077/coordination-log.jsonl` records
  `brief_created` and `formation_approved`.
- Qwen formation review: `docs/work/BANDIT-077/qwen-formation-review.md`
  records a pass through the authorized MLX adapter route.
- CodeRabbit formation review: `docs/work/BANDIT-077/coderabbit-formation-review.md`
  records provider timeout/bootstrap replacement evidence with no pass claimed.
- Aggregate formation review: `docs/work/BANDIT-077/formation-review.md`
  records a pass with CodeRabbit timeout disposition.
- Orchestration plan: `docs/work/BANDIT-077/orchestration-plan.md` records Work
  Item PM plan-mode gate evidence.
- RED evidence: `docs/work/BANDIT-077/red-evidence.md` and
  `test/spec-to-evidence-traceability.test.mjs` record Test Writer-owned RED
  evidence.
- Implementation evidence: `docs/work/BANDIT-077/implementation-evidence.md`,
  `docs/work/BANDIT-077/writer-report.md`,
  `docs/work/BANDIT-077/stage3-pm-review.md`, and
  `docs/role-runs/BANDIT-077/stage3-implementation.json` record accepted
  Claude-family Stage 3 implementation evidence.
- Review evidence: `docs/work/BANDIT-077/review-evidence.md`,
  `docs/work/BANDIT-077/coderabbit-review.md`,
  `docs/work/BANDIT-077/local-qwen-review.md`,
  `.bandit/policy/risk-classifications/BANDIT-077-risk-classification.json`,
  and `.bandit/policy/supply-chain-gates/BANDIT-077-supply-chain-gate.json`
  record Stage 4 review evidence and finding dispositions.
- Landing evidence: `docs/work/BANDIT-077/landing-verdict.md` and
  `docs/work/BANDIT-077/landing-action.md` record safe-to-land and
  local-record landing action evidence.

`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` is active and linked to
`BANDIT-077` in `.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8
product work, guarded browser actions, local API work, State Index work,
scheduler execution, claim execution, worktree execution, public benchmark
publication, paid reviewer/model routing, hosted replay services, telemetry,
merge, push, deploy, Trust Verifier cutover, or unrelated product work before
Stage 6 retrospective, improvement/gap disposition, routing sync, and final
validation are recorded.

The next required step is Stage 6 closeout for `BANDIT-077`.
