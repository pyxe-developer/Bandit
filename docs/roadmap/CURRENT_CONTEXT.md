# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-076` is formation-approved for the Evidence Bundle Attestation
bootstrap chore. Stage 1 brief, Qwen formation review, CodeRabbit
provider-timeout evidence, aggregate formation review, and `formation_approved`
coordination evidence exist under `docs/work/BANDIT-076/`.

**Active work item:** `BANDIT-076` (formation approved; plan-mode orchestration
required next).

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should start plan-mode orchestration for
BANDIT-076 by drafting docs/work/BANDIT-076/orchestration-plan.md and running
work-item-pm start BANDIT-076 before RED evidence.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. The operator
restored the crashed Local Qwen server, and the refreshed formation review
passed through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-076` current evidence:

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

`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is active and linked to `BANDIT-076`
in `.bandit/bootstrap-gaps.json`. Do not start RED evidence, implementation,
review, landing, closeout, unrelated Phase 8 product work, guarded browser
actions, local API work, State Index work, scheduler execution, claim
execution, worktree execution, public benchmark publication, paid reviewer/model
routing, hosted replay services, telemetry, merge, push, deploy, Trust Verifier
cutover, Spec-To-Evidence Traceability Matrix, or unrelated product work before
Work Item PM plan-mode orchestration is recorded.

The next required step is Work Item PM plan-mode orchestration for
`BANDIT-076`.

The remaining verification-layer opportunity queued after Evidence Bundle
Attestation is Spec-To-Evidence Traceability Matrix.
