# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-069` is landed and closed out. It resolved
`BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` by adding the repo-native
test-strength policy, evidence template, validator, CLI command, init wiring,
and `land-check` enforcement for covered high-risk surfaces while preserving
historical aggregate validation compatibility and the Permanent Test Ownership
Boundary.

`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is active and linked to
`BANDIT-070`. Repo PM created the bounded chore from
`docs/specs/BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE.json`, repaired the
Stage 1 brief/coordination prerequisite, recorded Local Qwen MLX adapter
formation pass evidence, recorded CodeRabbit provider-timeout replacement
evidence, approved formation on 2026-06-07, Work Item PM recorded plan-mode
orchestration plus Stage 2 RED evidence, Claude Implementation Writer completed
Stage 3 with PM acceptance, and Stage 4 aggregate review passed.

**Active work item:** `BANDIT-070` (Stage 4 review recorded).

The current stage is Stage 4: review recorded.

**Current next action:** Record Stage 5 landing verdict for `BANDIT-070`.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-069`
has closed with landing verdict, local-record landing, retrospective, and
improvement disposition evidence under `docs/work/BANDIT-069/`. `BANDIT-070`
has Stage 1 formation evidence, Work Item PM orchestration evidence, Stage 2
RED evidence, Stage 3 implementation evidence, and Stage 4 review evidence
under `docs/work/BANDIT-070/`; the next step is Stage 5 landing verdict.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve business
tradeoffs, approve explicit cost/risk posture, choose local API shape, approve
State Index timing, approve guarded action execution authority, approve
external service setup, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

`BANDIT-069` has Stage 1 formation, Work Item PM orchestration, Stage 2 RED,
Stage 3 Claude implementation, Stage 4 review evidence, Stage 5 landing
verdict, local-record landing action, Stage 6 retrospective, and improvement
disposition recorded under `docs/work/BANDIT-069/`.

`BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is resolved by
`BANDIT-069`; the gap ledger points to
`docs/work/BANDIT-069/retrospective.md`.

`BANDIT-070` has Stage 1 brief, coordination, Qwen formation review,
CodeRabbit provider-timeout replacement evidence, aggregate formation review,
`formation_approved`, Work Item PM orchestration evidence, Stage 2 RED evidence,
Stage 3 Claude implementation evidence, PM acceptance, and Stage 4 review
evidence recorded under `docs/work/BANDIT-070/`.

The next allowed action is Stage 5 landing verdict for `BANDIT-070`. Do not
merge, push, deploy, approve Trust Verifier cutover, replace or wrap old gates,
execute guarded browser actions, start local API work, State Index work,
scheduler execution, claim execution, worktree execution, unrelated Phase 8
scope, or the next queued bootstrap gap before landing verdict and landing
action evidence are recorded.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` remains queued behind the
oracle-provenance gate. It records the private, non-public distribution
posture: Bandit should be installable in multiple private repos and the CLI
should alert when a newer private update is available.

The remaining verification-layer opportunities are queued behind the private
install/update channel: Replay Regression Corpus, Gate Determinism And Flake
Gate, Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded
Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability
Matrix.
