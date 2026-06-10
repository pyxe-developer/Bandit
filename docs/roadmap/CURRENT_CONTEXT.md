# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-087` is the last closed work item. Its PR And CI/CD Landing Workflow
Policy triage chore landed locally and closed with landing action,
retrospective, improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-087/`.

**Active work item:** `BANDIT-088` - Installed-Copy Update Path.

The current stage is Stage 1: formation approved.

**Current next action:** Work Item PM should run plan-mode orchestration for
`BANDIT-088` before RED evidence.

Do not start Installed-Copy Update Path implementation, RED evidence, Stage 3
dispatch, review-loop evidence, landing evidence, retrospective evidence, the
V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover,
merge, push, deploy, hosted service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser action
execution, PR/CI/CD implementation, or unrelated Phase 8 product work before
Work Item PM records plan-mode orchestration for `BANDIT-088`.

No public package publishing is approved, no paid registry setup is approved,
no hosted update service is approved, no telemetry is approved, no automatic
self-update is approved, no credential handling is approved, no external repo
mutation is approved, no installed global skill mutation is approved, no
automation prompt mutation is approved, no merge/push/deploy authority is
approved, no Trust Verifier cutover is approved, no Trust Goal is selected for
cutover, no old gate path is replaced or wrapped, and no Pi/Aperture runtime
work is active.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve public package
publishing, approve paid registry setup, approve hosted update services,
approve telemetry, approve automatic self-update, approve credential handling,
approve external repo mutation, approve installed global skill mutation,
approve automation prompt mutation, approve merge/push/deploy authority,
approve Trust Verifier cutover policy, select a Trust Goal for cutover, replace
or wrap an older gate path, change product or UAT direction, approve business
tradeoffs, approve explicit cost/risk posture, approve paid or live
reviewer/model routing, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

`BANDIT-088` Stage 1 formation evidence:

- Source spec:
  `docs/specs/BANDIT-088-installed-copy-update-path.json`.
- Brief: `docs/work/BANDIT-088/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-088/qwen-formation-review.md`.
- CodeRabbit formation review:
  `docs/work/BANDIT-088/coderabbit-formation-review.md`.
- Aggregate formation review:
  `docs/work/BANDIT-088/formation-review.md`.
- Coordination log: `docs/work/BANDIT-088/coordination-log.jsonl`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-INSTALLED-COPY-UPDATE` formed as `BANDIT-088`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-088` formation does not implement or approve public publishing, hosted
update services, telemetry, automatic self-update, paid registry setup,
consumer-repo mutation, installed global skill mutation, automation prompt
mutation, credential handling, merge, push, deploy, Trust Verifier cutover,
PR/CI/CD implementation, the V0 Closeout Claude Code A/B Product-Value Trial,
or unrelated Phase 8 product work.
