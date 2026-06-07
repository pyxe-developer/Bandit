# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-070` is landed and closed out. It resolved
`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` by adding the repo-native
oracle-provenance policy, evidence template, validator, CLI command, init
wiring, and `land-check` enforcement for covered high-risk safe-to-land claims
while preserving historical aggregate validation compatibility, Trust Verifier
cutover boundaries, and the Permanent Test Ownership Boundary.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is active and linked to
`BANDIT-071`. Repo PM created the bounded chore from
`docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`, repaired the Stage
1 brief/coordination prerequisite, recorded Local Qwen MLX adapter formation
pass evidence, recorded CodeRabbit provider-timeout replacement evidence, and
approved formation on 2026-06-07.

**Active work item:** `BANDIT-071` (formation approved).

The current stage is Stage 1: formation approved.

**Current next action:** Run Work Item PM plan-mode orchestration for
`BANDIT-071` before RED evidence.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-070`
has closed with landing verdict, local-record landing, retrospective,
improvement disposition, chore disposition, and bootstrap-gap disposition
evidence under `docs/work/BANDIT-070/`. `BANDIT-071` has Stage 1 formation
evidence under `docs/work/BANDIT-071/`, and the next step is Work Item PM
plan-mode orchestration before RED evidence.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public npm
publishing, approve paid private registry or external service setup, approve
business tradeoffs, approve explicit cost/risk posture, approve automatic
self-update behavior, approve recurring paid tooling, approve guarded action
execution authority, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

`BANDIT-070` has Stage 1 formation, Work Item PM orchestration, Stage 2 RED,
Stage 3 Claude implementation, Stage 4 review evidence, Stage 5 landing
verdict, local-record landing action, Stage 6 retrospective, and
improvement/chore disposition recorded under `docs/work/BANDIT-070/`.

`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is resolved by
`BANDIT-070`; the gap ledger points to
`docs/work/BANDIT-070/retrospective.md`.

`BANDIT-071` has Stage 1 brief, coordination, Qwen formation review,
CodeRabbit provider-timeout replacement evidence, aggregate formation review,
and `formation_approved` coordination evidence recorded under
`docs/work/BANDIT-071/`.

The next allowed action is Work Item PM plan-mode orchestration for
`BANDIT-071`. Do not start RED evidence, implementation, merge, push, deploy,
Trust Verifier cutover, old-gate replacement or wrapping, public npm
publishing, paid registry setup, external service setup, automatic self-update,
guarded browser action execution, local API work, State Index work, scheduler
execution, claim execution, worktree execution, unrelated Phase 8 scope, or the
next queued bootstrap gap before the Work Item PM plan-mode gate is satisfied.

`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` remains queued behind the private
install/update channel.

The remaining verification-layer opportunities are queued behind the replay
corpus: Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks,
Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and
Spec-To-Evidence Traceability Matrix.
