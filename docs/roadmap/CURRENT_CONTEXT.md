# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-099` is the last closed work item. It landed and closed the Public
Consumer Onboarding Hardening bootstrap-gap chore.

Operator direction on 2026-06-12 moved `BANDIT-PRD-006` ahead of the deferred
V0 Closeout Claude Code A/B Product-Value Trial. `bandit draft-work
docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md` decomposed the PRD
into `BANDIT-100` through `BANDIT-103`; only `BANDIT-100` is active.

**Active work item:** `BANDIT-100` - Project-profile contract and
identity-clean init.

The current stage is Stage 1: formation_approved.

**Current next action:** Work Item PM plan-mode orchestration for BANDIT-100
before RED evidence.

Do not create RED evidence, implementation dispatch, UAT evidence, landing
evidence, retrospective evidence, `BANDIT-101`, `BANDIT-102`, `BANDIT-103`, V0
Closeout Claude Code A/B Product-Value Trial implementation, Trust Verifier
cutover, merge, push, deploy, hosted service setup, paid reviewer/model
routing, public benchmark publication, local API work, State Index work,
guarded browser action execution, PR/CI/CD implementation, installed-copy
update-path implementation, or unrelated Phase 8 product work before
`BANDIT-100` Work Item PM plan-mode orchestration is recorded.

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

## Active Work

`BANDIT-100` is the active Stage 1 slice:

- `docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md`
- `docs/work/BANDIT-100/brief.md`, current status
  `Stage 1: formation_approved`
- `docs/work/BANDIT-100/qwen-formation-review.md`
- `docs/work/BANDIT-100/coderabbit-formation-review.md`
- `docs/work/BANDIT-100/formation-review.md`
- `docs/work/BANDIT-100/coordination-log.jsonl`, current state
  `formation_approved`

`BANDIT-101`, `BANDIT-102`, and `BANDIT-103` are draft queued slices from the
same PRD. They must not become active until `BANDIT-100` has required
verification or recorded bootstrap gaps, landing verdict, landing action
evidence, retrospective/improvement dispositions, and synchronized routing
files.

No active bootstrap gap is recorded; `.bandit/bootstrap-gaps.json` currently
contains only resolved gaps.

## Next Work

The next action is Work Item PM plan-mode orchestration for `BANDIT-100`
before RED evidence.

After `BANDIT-100` lands and closes, Repo PM should activate the next PRD-006
drafted slice one at a time, starting with `BANDIT-101` Typed reviewer
adapters with honest degradation, unless a newly opened bootstrap gap takes
precedence.
