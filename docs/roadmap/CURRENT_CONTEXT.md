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

`BANDIT-072` is formed and approved through Stage 1 for the
`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` bootstrap chore. The brief, coordination
log, Local Qwen formation pass through the MLX adapter route, CodeRabbit
formation timeout/bootstrap replacement evidence, and aggregate formation
review are recorded under `docs/work/BANDIT-072/`.

**Active work item:** `BANDIT-072` (Stage 1 formation approved).

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM plan-mode orchestration for `BANDIT-072`
before RED evidence.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. `BANDIT-072`
has Stage 1 brief, `brief_created` coordination evidence, Local Qwen formation
pass evidence, CodeRabbit provider-timeout bootstrap replacement evidence,
aggregate formation review, and `formation_approved` coordination evidence
under `docs/work/BANDIT-072/`.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-072` has Stage 1 formation evidence:

- Source spec: `docs/specs/BANDIT-GAP-REPLAY-REGRESSION-CORPUS.json`.
- Brief: `docs/work/BANDIT-072/brief.md`.
- Coordination: `docs/work/BANDIT-072/coordination-log.jsonl` records
  `brief_created` and `formation_approved`.
- Local Qwen formation review: `docs/work/BANDIT-072/qwen-formation-review.md`
  records `pass` through `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs`.
- CodeRabbit formation review:
  `docs/work/BANDIT-072/coderabbit-formation-review.md` records
  `bootstrap_gap` provider-timeout replacement evidence; no CodeRabbit pass is
  claimed.
- Aggregate formation review: `docs/work/BANDIT-072/formation-review.md`
  records `pass`.

`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is active and linked to `BANDIT-072` in
`.bandit/bootstrap-gaps.json`. Do not start unrelated Phase 8 product work,
guarded browser actions, local API work, State Index work, scheduler execution,
claim execution, worktree execution, public benchmark publication, paid
reviewer/model routing, hosted replay services, telemetry, merge, push, deploy,
or Trust Verifier cutover before `BANDIT-072` completes or is explicitly
dispositioned.

The next required step is Work Item PM plan-mode orchestration for `BANDIT-072`;
do not create RED evidence, implementation evidence, review evidence, landing
evidence, or retrospective evidence before that plan-mode gate.

The remaining verification-layer opportunities are queued behind the replay
corpus: Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks,
Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and
Spec-To-Evidence Traceability Matrix.
