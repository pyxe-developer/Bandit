# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-100` is the last closed work item. It landed and closed the
Project-profile contract and identity-clean init slice from `BANDIT-PRD-006`.

**Active work item:** `BANDIT-104` - Work-execute route should derive current
stage from coordination state.

`BANDIT-104` is the active bootstrap-gap chore formed from
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`.

The current stage is Stage 4: CodeRabbit pass recorded; Local Qwen review required.

**Current next action:** Run authorized Local Qwen review for `BANDIT-104`
through `.bandit/reviewers/local-qwen.json` before aggregate review, landing,
or closeout.

Do not start `BANDIT-101`, `BANDIT-102`, `BANDIT-103`, V0 Closeout Claude
Code A/B Product-Value Trial implementation, Trust Verifier cutover, merge,
push, deploy, hosted service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser
action execution, PR/CI/CD implementation, installed-copy update-path
implementation, or unrelated Phase 8 product work while `BANDIT-104` remains
active.

The operator approved a public, open-source install/discovery posture on
2026-06-11. Public npm publishing is allowed when the operator performs or
separately approves the release, but no publish automation, paid registry
setup, hosted update service, telemetry, automatic self-update, credential
handling, external repo mutation, installed global skill mutation, automation
prompt mutation, merge/push/deploy authority, Trust Verifier cutover, Trust
Goal selection, old gate replacement/wrapping, or Pi/Aperture runtime work is
active.

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

## Last Closed Work

`BANDIT-100` is closed with required landing and closeout evidence:

- `docs/work/BANDIT-100/brief.md`
- `docs/work/BANDIT-100/red-evidence.md`
- `docs/work/BANDIT-100/implementation-evidence.md`
- `docs/work/BANDIT-100/review-evidence.md`
- `docs/work/BANDIT-100/landing-verdict.md`
- `docs/work/BANDIT-100/landing-action.md`
- `docs/work/BANDIT-100/retrospective.md`
- `docs/work/BANDIT-100/improvement-disposition.md`
- `docs/work/BANDIT-100/coordination-log.jsonl`

One bootstrap gap from `BANDIT-100` Stage 2 is active under `BANDIT-104`:
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`.

## Active Work

`BANDIT-104` has required Stage 1 formation evidence:

- `docs/work/BANDIT-104/brief.md`
- `docs/work/BANDIT-104/qwen-formation-review.md`
- `docs/work/BANDIT-104/coderabbit-formation-review.md`
- `docs/work/BANDIT-104/formation-review.md`
- `docs/work/BANDIT-104/coordination-log.jsonl`

## Next Work

Run authorized Local Qwen review for `BANDIT-104` through
`.bandit/reviewers/local-qwen.json` before aggregate review, landing, or
closeout.
