# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-075` is in Stage 5 landing for the Reviewer Calibration With Seeded
Defects bootstrap chore. Plan-mode orchestration, Stage 2 RED evidence, Stage 3
implementation evidence, Writer report, role-run manifest, PM clean-code
acceptance, CodeRabbit disposition evidence, Local Qwen pass evidence, risk
classification, supply-chain gate, and aggregate Stage 4 review evidence exist
under `docs/work/BANDIT-075/`.

**Active work item:** `BANDIT-075` (Stage 5 landing required).

The current stage is Stage 5: landing required.

**Current next action:** Landing Agent should record the Stage 5 landing verdict
for `BANDIT-075`, run land-check, and execute the local-record landing action
before closeout.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-074`
has plan-mode, RED, implementation, Writer report, role-run, clean-code PM
acceptance, aggregate review, landing action, retrospective, improvement
disposition, bootstrap-gap resolution, and `closed` coordination evidence under
`docs/work/BANDIT-074/`. `BANDIT-075` has plan-mode, RED, implementation,
Writer report, role-run, PM acceptance, aggregate review, CodeRabbit
disposition, Local Qwen pass, risk classification, supply-chain gate, and
`review_recorded` coordination evidence under `docs/work/BANDIT-075/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-075` current evidence:

- Source spec: `docs/specs/BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS.json`.
- Brief: `docs/work/BANDIT-075/brief.md`.
- Coordination log: `docs/work/BANDIT-075/coordination-log.jsonl` records
  `brief_created`, `formation_approved`, `orchestration_plan_recorded`,
  `red_recorded`, and `implementation_recorded`.
- Qwen formation review: `docs/work/BANDIT-075/qwen-formation-review.md`.
- CodeRabbit formation review: `docs/work/BANDIT-075/coderabbit-formation-review.md`
  records provider timeout/bootstrap replacement evidence with no pass claimed.
- Aggregate formation review: `docs/work/BANDIT-075/formation-review.md`.
- Orchestration plan: `docs/work/BANDIT-075/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-075/red-evidence.md`.
- Seeded reviewer packet:
  `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`.
- Stage 3 evidence: `docs/work/BANDIT-075/implementation-evidence.md`,
  `docs/work/BANDIT-075/writer-report.md`,
  `docs/role-runs/BANDIT-075/stage3-implementation.json`, and
  `docs/work/BANDIT-075/stage3-pm-review.md`.
- Stage 4 evidence: `docs/work/BANDIT-075/coderabbit-review.md`,
  `docs/work/BANDIT-075/coderabbit-finding-disposition.md`,
  `docs/work/BANDIT-075/local-qwen-review.md`,
  `.bandit/policy/risk-classifications/BANDIT-075-risk-classification.json`,
  `.bandit/policy/supply-chain-gates/BANDIT-075-supply-chain-gate.json`, and
  `docs/work/BANDIT-075/review-evidence.md`.

`BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is active and linked to
`BANDIT-075` in `.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8
product work, guarded browser actions, local API work, State Index work,
scheduler execution, claim execution, worktree execution, public benchmark
publication, paid reviewer/model routing, hosted replay services, telemetry,
merge, push, deploy, Trust Verifier cutover, closeout, or later queued
bootstrap-gap work before Stage 5 landing action evidence is recorded for
`BANDIT-075`.

The next required step is Stage 5 landing for `BANDIT-075`.

The remaining verification-layer opportunities queued after `BANDIT-075` are:
Evidence Bundle Attestation and Spec-To-Evidence Traceability Matrix.
