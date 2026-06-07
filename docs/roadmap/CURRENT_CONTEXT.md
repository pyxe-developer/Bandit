# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-071` is landed and closed out. It resolved
`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` by making Bandit privately
installable from packed or private sources, scoping package contents, promoting
the installed CLI loader dependency to runtime scope, adding repo-local
update-channel policy and templates, and providing non-blocking manual
`update-check` notification behavior without public npm publishing, paid
registry setup, hosted update services, telemetry, or automatic self-update.

**Active work item:** `BANDIT-071` (Stage 6 closeout complete).

The current stage is Stage 6: closeout complete.

**Current next action:** Create a bounded chore from `docs/specs/BANDIT-GAP-REPLAY-REGRESSION-CORPUS.json` before unrelated Phase 8 product work.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-071`
has Stage 1 formation, Work Item PM plan-mode, Stage 2 RED, Stage 3
implementation, Stage 4 review, Stage 5 landing verdict, local-record landing,
Stage 6 retrospective, improvement disposition, chore disposition, and
bootstrap-gap disposition evidence under `docs/work/BANDIT-071/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public npm
publishing, approve paid private registry or external service setup, approve
business tradeoffs, approve explicit cost/risk posture, approve automatic
self-update behavior, approve recurring paid tooling, approve guarded action
execution authority, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

`BANDIT-071` has complete lifecycle evidence:

- Stage 1 formation evidence, formation reviews, and `formation_approved`.
- Work Item PM orchestration plan and `orchestration_plan_recorded`.
- Test Writer-owned RED tests and `red_recorded`.
- Stage 3 Claude implementation, Writer report, PM acceptance, and
  `implementation_recorded`.
- Stage 4 CodeRabbit timeout replacement evidence, refreshed Local Qwen pass,
  risk classification, supply-chain gate, aggregate review evidence, and
  `review_recorded`.
- Stage 5 landing verdict, `land-check` pass, local-record landing action, and
  `landed`.
- Stage 6 retrospective, improvement disposition, chore disposition,
  gap-ledger resolution, route synchronization, and `closed`.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is resolved by `BANDIT-071`; the
gap ledger points to `docs/work/BANDIT-071/retrospective.md`.

`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is the next queued bootstrap gap and has
no formed work item yet. Do not start unrelated Phase 8 product work, guarded
browser actions, local API work, State Index work, scheduler execution, claim
execution, worktree execution, public publishing, paid private registry setup,
hosted update services, telemetry, automatic self-update, merge, push, deploy,
or Trust Verifier cutover before the replay regression corpus chore is formed
and approved through the normal Repo PM formation path.

The remaining verification-layer opportunities are queued behind the replay
corpus: Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks,
Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and
Spec-To-Evidence Traceability Matrix.
