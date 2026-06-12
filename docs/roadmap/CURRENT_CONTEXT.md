# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-097` is the last closed work item. It landed and closed the PRD-005.4
Operator Command Adapters slice.

**Active work item:** `BANDIT-098` - Public Consumer Install Quickstart And
Governance Scaffold.

The current stage is Stage 5: landing.

**Current next action:** Run Stage 5 landing for `BANDIT-098`: write landing
verdict, confirm UAT not applicable, run land-check, record local landing
action, and do not start unrelated work before landing action evidence exists.

Do not create landing evidence, UAT evidence, retrospective evidence, closeout
evidence, V0 Closeout Claude Code A/B Product-Value Trial implementation, Trust
Verifier cutover, merge, push, deploy, hosted service setup, paid reviewer/model
routing, public benchmark publication, local API work, State Index work, guarded
browser action execution, PR/CI/CD implementation, installed-copy update-path
implementation, or unrelated Phase 8 product work before landing action evidence
exists for `BANDIT-098`.

The operator approved a public, open-source install/discovery posture on
2026-06-11. Public npm publishing is allowed when the operator performs or
separately approves the release, but no publish automation, paid registry setup,
hosted update service, telemetry, automatic self-update, credential handling,
external repo mutation, installed global skill mutation, automation prompt
mutation, merge/push/deploy authority, Trust Verifier cutover, Trust Goal
selection, old gate replacement/wrapping, or Pi/Aperture runtime work is active.

Operator testing on 2026-06-11 exposed a public consumer install and governance
scaffold gap: the README command surface is not reliably executable in arbitrary
repos, and `bandit init` does not create starter `AGENTS.md`, `CLEAN_CODE.md`,
stage-rubric, bootstrap-methodology, roadmap/current-context, or `STATUS.md`
surfaces required for a meaningfully Bandit-governed repo. The gap is recorded
as `BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART` with audit evidence at
`docs/reports/public-consumer-install-command-audit-2026-06-11.md`.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8001/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

none_required.

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would expand landing autonomy, approve
Notify-And-Revert or Auto-Landing Scope for a new boundary cell, add public npm
publish automation, handle publish credentials, approve paid registry setup,
approve hosted update services, approve telemetry, approve automatic
self-update, approve external repo mutation, approve installed global skill
mutation, approve automation prompt mutation, approve merge/push/deploy
authority, approve Trust Verifier cutover policy, select a Trust Goal for
cutover, replace or wrap an older gate path, change product or UAT direction,
approve business tradeoffs, approve explicit cost/risk posture, approve paid or
live reviewer/model routing, or make another policy/product decision repo
artifacts cannot answer.

## Active Work

`BANDIT-098` Stage 5 landing evidence is the current active-work source:

- `docs/specs/BANDIT-098-public-consumer-install-quickstart-and-governance-scaffold.json`
- `docs/specs/BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART.json`
- `docs/reports/public-consumer-install-command-audit-2026-06-11.md`
- `docs/work/BANDIT-098/brief.md`
- `docs/work/BANDIT-098/qwen-formation-review.md`
- `docs/work/BANDIT-098/coderabbit-formation-review.md`
- `docs/work/BANDIT-098/formation-review.md`
- `docs/work/BANDIT-098/orchestration-plan.md`
- `docs/work/BANDIT-098/red-evidence.md`
- `docs/work/BANDIT-098/stage3-dispatch.md`
- `docs/work/BANDIT-098/stage3-minimax-dispatch.md`
- `docs/work/BANDIT-098/stage3-dispatch-attempt.md`
- `docs/work/BANDIT-098/stage3-retry-dispatch.md`
- `docs/work/BANDIT-098/implementation-evidence.md`
- `docs/work/BANDIT-098/writer-report.md`
- `docs/work/BANDIT-098/stage3-pm-acceptance.md`
- `docs/work/BANDIT-098/coderabbit-review.md`
- `docs/work/BANDIT-098/coderabbit-finding-disposition.md`
- `docs/work/BANDIT-098/local-qwen-review.md`
- `docs/work/BANDIT-098/local-qwen-finding-disposition.md`
- `.bandit/policy/risk-classifications/BANDIT-098-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-098-supply-chain-gate.json`
- `docs/work/BANDIT-098/review-evidence.md`
- `docs/work/BANDIT-098/coordination-log.jsonl`, current state
  `review_recorded`
- `.bandit/bootstrap-gaps.json`, `BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART`
  current state `active`

`BANDIT-097` closeout evidence remains the prior slice-boundary source:

- `docs/specs/BANDIT-097-operator-command-adapters.json`
- `docs/work/BANDIT-097/brief.md`
- `docs/work/BANDIT-097/red-evidence.md`
- `docs/work/BANDIT-097/implementation-evidence.md`
- `docs/work/BANDIT-097/review-evidence.md`
- `docs/work/BANDIT-097/landing-verdict.md`
- `docs/work/BANDIT-097/landing-action.md`
- `docs/work/BANDIT-097/retrospective.md`
- `docs/work/BANDIT-097/improvement-disposition.md`
- `docs/work/BANDIT-097/coordination-log.jsonl`, current state
  `closed`

## Next Work

The next action is Stage 5 landing for `BANDIT-098`.

Write the landing verdict, confirm UAT is not applicable, run land-check, record
local landing action, and do not start V0 trial work, Trust Verifier cutover,
local API work, State Index work, cockpit action work, or unrelated Phase 8
product work before landing action evidence exists.
