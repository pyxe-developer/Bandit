# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-074` is landed and closed out for the Metamorphic Cross-Projection
Checks bootstrap chore. The bootstrap-gap ledger now resolves
`BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS`; the next queued gap is
Reviewer Calibration With Seeded Defects.

**Active work item:** `BANDIT-074` (closed; last closed derived-status anchor).

The current stage is Stage 6: Closed And Ready For Next Gap Formation.

**Current next action:** Repo PM must create and form the next bounded chore
from `docs/specs/BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS.json` before
unrelated Phase 8 product work.

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
`docs/work/BANDIT-074/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-074` current evidence:

- Source spec: `docs/specs/BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS.json`.
- Brief: `docs/work/BANDIT-074/brief.md`.
- Coordination log: `docs/work/BANDIT-074/coordination-log.jsonl` records
  `brief_created`, `formation_approved`, `orchestration_plan_recorded`,
  `red_recorded`, and `implementation_recorded`.
- Orchestration plan: `docs/work/BANDIT-074/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-074/red-evidence.md`.
- Implementation evidence: `docs/work/BANDIT-074/implementation-evidence.md`.
- Writer report: `docs/work/BANDIT-074/writer-report.md`.
- PM review: `docs/work/BANDIT-074/stage3-pm-review.md`.
- Review evidence: `docs/work/BANDIT-074/review-evidence.md`.
- CodeRabbit review: `docs/work/BANDIT-074/coderabbit-review.md` records
  provider-timeout/bootstrap replacement evidence with no pass claimed.
- Local Qwen review: `docs/work/BANDIT-074/local-qwen-review.md`.
- Qwen finding disposition:
  `docs/work/BANDIT-074/qwen-finding-disposition.md`.
- Landing verdict: `docs/work/BANDIT-074/landing-verdict.md`.
- Landing action: `docs/work/BANDIT-074/landing-action.md`.
- Retrospective: `docs/work/BANDIT-074/retrospective.md`.
- Chore disposition: `docs/work/BANDIT-074/chore-disposition.md`.
- Improvement disposition:
  `docs/work/BANDIT-074/improvement-disposition.md`.
- Qwen formation review: `docs/work/BANDIT-074/qwen-formation-review.md`.
- CodeRabbit formation review: `docs/work/BANDIT-074/coderabbit-formation-review.md`
  records provider timeout/bootstrap replacement evidence with no pass claimed.
- Aggregate formation review: `docs/work/BANDIT-074/formation-review.md`.

`BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is resolved and linked to
`BANDIT-074` in `.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8
product work, guarded browser actions, local API work, State Index work,
scheduler execution, claim execution, worktree execution, public benchmark
publication, paid reviewer/model routing, hosted replay services, telemetry,
merge, push, deploy, Trust Verifier cutover, or later queued bootstrap-gap work
before `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is created and formed
or explicitly dispositioned.

The next required step is Repo PM formation for
`BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS`.

The remaining verification-layer opportunities queued after `BANDIT-074` are:
Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and
Spec-To-Evidence Traceability Matrix.
