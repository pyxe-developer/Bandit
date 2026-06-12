# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-098` is the last closed work item. It landed and closed the Public
Consumer Install Quickstart And Governance Scaffold bootstrap-gap chore.

**Active work item:** `BANDIT-099` - Public Consumer Onboarding Hardening.

The current stage is Stage 1: brief_created.

**Current next action:** Run formation review and approve formation for
`BANDIT-099` before Work Item PM execution.

Do not create RED evidence, implementation dispatch, UAT evidence, landing
evidence, retrospective evidence, V0 Closeout Claude Code A/B Product-Value
Trial implementation, Trust Verifier cutover, merge, push, deploy, hosted
service setup, paid reviewer/model routing, public benchmark publication,
local API work, State Index work, guarded browser action execution, PR/CI/CD
implementation, installed-copy update-path implementation, or unrelated Phase
8 product work before formation is approved for `BANDIT-099`.

The operator approved a public, open-source install/discovery posture on
2026-06-11. Public npm publishing is allowed when the operator performs or
separately approves the release, but no publish automation, paid registry
setup, hosted update service, telemetry, automatic self-update, credential
handling, external repo mutation, installed global skill mutation, automation
prompt mutation, merge/push/deploy authority, Trust Verifier cutover, Trust
Goal selection, old gate replacement/wrapping, or Pi/Aperture runtime work is
active.

Operator review on 2026-06-12 exposed remaining public consumer onboarding
gaps after `BANDIT-098`: starter governance is still Codex-specific where
Bandit should be model-agnostic, day-1 users lack guidance for governance
strictness and role/model choices, README onboarding is packaged but not
scaffolded or linked by `bandit init`, and first-time command examples still
include bare `bandit` commands before npx, npm exec, npm scripts, or PATH setup
make them executable. The active gap is
`BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING`, linked to `BANDIT-099`.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8001/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

none_required.

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would expand landing autonomy,
approve Notify-And-Revert or Auto-Landing Scope for a new boundary cell, add
public npm publish automation, handle publish credentials, approve paid
registry setup, approve hosted update services, approve telemetry, approve
automatic self-update, approve external repo mutation, approve installed global
skill mutation, approve automation prompt mutation, approve merge/push/deploy
authority, approve Trust Verifier cutover policy, select a Trust Goal for
cutover, replace or wrap an older gate path, change product or UAT direction,
approve business tradeoffs, approve explicit cost/risk posture, approve paid
or live reviewer/model routing, or make another policy/product decision repo
artifacts cannot answer.

## Active Work

`BANDIT-099` Stage 1 formation evidence is the current active-work source:

- `docs/specs/BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING.json`
- `docs/work/BANDIT-099/brief.md`
- `docs/work/BANDIT-099/coordination-log.jsonl`, current state `brief_created`
- `.bandit/bootstrap-gaps.json`,
  `BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING` current state `active`

`BANDIT-098` closeout evidence remains the prior slice-boundary source:

- `docs/work/BANDIT-098/landing-action.md`
- `docs/work/BANDIT-098/retrospective.md`
- `docs/work/BANDIT-098/improvement-disposition.md`
- `docs/work/BANDIT-098/coordination-log.jsonl`, current state `closed`

## Next Work

The next action is formation review for `BANDIT-099`.

Run required formation review artifacts, then `repo-pm approve-formation` for
`BANDIT-099` if formation review is non-blocking. Do not begin RED evidence or
implementation before formation is approved.
