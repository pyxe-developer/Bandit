# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-076` is landed and closed out for the Evidence Bundle Attestation
bootstrap chore. Its brief, RED evidence, Claude implementation/PM acceptance,
review evidence, landing verdict, local-record landing action, final bundle
attestation, retrospective, and dispositions are recorded under
`docs/work/BANDIT-076/`.

**Active work item:** `BANDIT-076` (closed; last active anchor).

The current stage is Stage 6: closeout complete.

**Current next action:** Repo PM must create and form the next bounded chore
from docs/specs/BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX.json before
unrelated Phase 8 product work.

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

`BANDIT-076` closed evidence:

- Source spec: `docs/specs/BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION.json`.
- Brief: `docs/work/BANDIT-076/brief.md`.
- Coordination log: `docs/work/BANDIT-076/coordination-log.jsonl` records
  `brief_created`, a prior `blocked` transition for Local Qwen provider
  repair, and `formation_approved`.
- Qwen formation review: `docs/work/BANDIT-076/qwen-formation-review.md`
  records a pass through the authorized MLX adapter route.
- CodeRabbit formation review: `docs/work/BANDIT-076/coderabbit-formation-review.md`
  records provider timeout/bootstrap replacement evidence with no pass claimed.
- Aggregate formation review: `docs/work/BANDIT-076/formation-review.md`
  records a pass with CodeRabbit timeout disposition.
- Orchestration plan: `docs/work/BANDIT-076/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-076/red-evidence.md` and
  `test/evidence-bundle-attestation.test.mjs`.
- Stage 3 evidence: `docs/work/BANDIT-076/implementation-evidence.md`,
  `docs/work/BANDIT-076/stage3-pm-review.md`,
  `docs/work/BANDIT-076/writer-report.md`, and
  `docs/role-runs/BANDIT-076/stage3-implementation.json`.
- Stage 4 evidence: `docs/work/BANDIT-076/coderabbit-review.md`,
  `docs/work/BANDIT-076/coderabbit-finding-disposition.md`,
  `docs/work/BANDIT-076/local-qwen-review.md`,
  `docs/work/BANDIT-076/qwen-finding-disposition.md`,
  `.bandit/policy/risk-classifications/BANDIT-076-risk-classification.json`,
  `.bandit/policy/supply-chain-gates/BANDIT-076-supply-chain-gate.json`, and
  `docs/work/BANDIT-076/review-evidence.md`.
- Stage 5 evidence: `docs/work/BANDIT-076/landing-verdict.md` and
  `docs/work/BANDIT-076/landing-action.md`.
- Stage 6 evidence: `docs/work/BANDIT-076/retrospective.md`,
  `docs/work/BANDIT-076/chore-disposition.md`, and
  `docs/work/BANDIT-076/improvement-disposition.md`.
- Final bundle attestation: `npm run bandit -- evidence-bundle attest
  BANDIT-076 --json` passed with bundle hash
  `af261250273c2a67fcc678180b371920523225b0cad3dce1fb62e0dca6692677`.

`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is resolved by `BANDIT-076` in
`.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8 product work,
guarded browser actions, local API work, State Index work, scheduler execution,
claim execution, worktree execution, public benchmark publication, paid
reviewer/model routing, hosted replay services, telemetry, merge, push, deploy,
Trust Verifier cutover, or unrelated product work before the next queued
bootstrap-gap chore is created and formed.

The next required step is Repo PM creation and formation for
`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX`.

The remaining verification-layer opportunity queued after Evidence Bundle
Attestation is Spec-To-Evidence Traceability Matrix.
