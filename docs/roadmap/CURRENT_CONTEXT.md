# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-069` is landed and closed out. It resolved
`BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` by adding the repo-native
test-strength policy, evidence template, validator, CLI command, init wiring,
and `land-check` enforcement for covered high-risk surfaces while preserving
historical aggregate validation compatibility and the Permanent Test Ownership
Boundary.

**Active work item:** none.

The current stage is Interstitial: Work-item creation required.

**Current next action:** Create a bounded chore from
`docs/specs/BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE.json` before
unrelated Phase 8 product work.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next
step is Repo PM creation of a bounded chore from
`docs/specs/BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE.json`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve business
tradeoffs, approve explicit cost/risk posture, choose local API shape, approve
State Index timing, approve guarded action execution authority, approve
external service setup, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

No work item is active.

`BANDIT-069` has Stage 1 formation, Work Item PM orchestration, Stage 2 RED,
Stage 3 Claude implementation, Stage 4 review evidence, Stage 5 landing
verdict, local-record landing action, Stage 6 retrospective, and improvement
disposition recorded under `docs/work/BANDIT-069/`.

`BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is resolved by
`BANDIT-069`; the gap ledger points to
`docs/work/BANDIT-069/retrospective.md`.

`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is the next queued bootstrap
gap. Do not start unrelated Phase 8 product work until this gap is resolved,
blocked on operator-owned input, or explicitly dispositioned as no-action.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` remains queued behind the
oracle-provenance gate. It records the private, non-public distribution
posture: Bandit should be installable in multiple private repos and the CLI
should alert when a newer private update is available.

The remaining verification-layer opportunities are queued behind the private
install/update channel: Replay Regression Corpus, Gate Determinism And Flake
Gate, Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded
Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability
Matrix.
