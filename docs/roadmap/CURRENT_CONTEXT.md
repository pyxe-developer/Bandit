# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-072` is landed and closed out. It resolved
`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` by adding a repo-native read-only replay
regression policy, deterministic validation command, replay packet fixtures for
historical workflow failure modes, schema and taxonomy fail-closed checks,
required-mode coverage, init seeding, and focused tests.

**Active work item:** `BANDIT-072` (Stage 6 closed; last closed anchor).

The current stage is Stage 6: closed.

**Current next action:** Repo PM should create a bounded chore from
`docs/specs/BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE.json` before unrelated Phase
8 product work.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-072`
has landing action, retrospective, bootstrap-gap disposition, roadmap/status
synchronization, and closed coordination evidence under `docs/work/BANDIT-072/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-072` closeout evidence:

- Source spec: `docs/specs/BANDIT-GAP-REPLAY-REGRESSION-CORPUS.json`.
- Brief: `docs/work/BANDIT-072/brief.md`.
- RED evidence: `docs/work/BANDIT-072/red-evidence.md`.
- Implementation evidence: `docs/work/BANDIT-072/implementation-evidence.md`.
- Review evidence: `docs/work/BANDIT-072/review-evidence.md`.
- Landing action: `docs/work/BANDIT-072/landing-action.md`.
- Retrospective: `docs/work/BANDIT-072/retrospective.md`.

`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is resolved and linked to `BANDIT-072` in
`.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8 product work,
guarded browser actions, local API work, State Index work, scheduler execution,
claim execution, worktree execution, public benchmark publication, paid
reviewer/model routing, hosted replay services, telemetry, merge, push, deploy,
or Trust Verifier cutover before the next queued bootstrap gap is formed or
explicitly dispositioned.

The next required step is Repo PM formation for
`BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE`.

The remaining verification-layer opportunities are queued in order: Gate
Determinism And Flake Gate, Metamorphic Cross-Projection Checks, Reviewer
Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-
Evidence Traceability Matrix.
