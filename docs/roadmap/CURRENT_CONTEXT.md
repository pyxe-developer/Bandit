# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-082` is the last closed work item. Its Work Intake Ledger And Followups
Migration slice landed locally and closed with landing action, retrospective,
improvement disposition, and closeout evidence recorded under
`docs/work/BANDIT-082/`.

**Active work item:** `BANDIT-082` - Work Intake Ledger And Followups
Migration, retained as the last-closed derived-status anchor until the next
slice is formed.

The current stage is Stage 6: closeout complete.

**Current next action:** Repo PM should form the next intake-derived work item
for `WIL-UI-POLISH`, Bandit Cockpit UI Polish From Attached Design, before
forming the V0 Closeout Claude Code A/B Product-Value Trial or unrelated Phase
8 work.

Do not start unrelated Phase 8 product work, Trust Verifier cutover, merge,
push, deploy, hosted replay service setup, paid reviewer/model routing, public
benchmark publication, local API work, State Index work, guarded browser action
execution, or the V0 Closeout Claude Code A/B Product-Value Trial before Repo
PM forms the next intake-derived `WIL-UI-POLISH` work item through normal Stage
1 formation.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action.

Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve public benchmark
publication, approve paid reviewer/model routing, approve hosted replay
services or other external service setup, approve business tradeoffs, approve
explicit cost/risk posture, approve live reviewer/model routing, approve
guarded action execution authority, or make another policy/product decision
repo artifacts cannot answer.

## Active Work

`BANDIT-082` closeout evidence:

- Source spec:
  `docs/specs/BANDIT-082-work-intake-ledger-and-followups-migration.json`.
- Brief: `docs/work/BANDIT-082/brief.md`.
- Orchestration plan: `docs/work/BANDIT-082/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-082/red-evidence.md`.
- Implementation evidence: `docs/work/BANDIT-082/implementation-evidence.md`.
- Review evidence: `docs/work/BANDIT-082/review-evidence.md`.
- Landing verdict: `docs/work/BANDIT-082/landing-verdict.md`.
- Landing action: `docs/work/BANDIT-082/landing-action.md`.
- Retrospective: `docs/work/BANDIT-082/retrospective.md`.
- Improvement disposition:
  `docs/work/BANDIT-082/improvement-disposition.md`.
- Coordination log: `docs/work/BANDIT-082/coordination-log.jsonl` records
  `landed` and Stage 6 closeout.
- Work Intake Ledger: `.bandit/work-intake-ledger.json`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

The next proposal in the intake-derived pre-Claude-bakeoff lane is
`WIL-UI-POLISH`, Bandit Cockpit UI Polish From Attached Design. It remains a
proposal until Repo PM forms a normal Stage 1 work item. The V0 Closeout Claude
Code A/B Product-Value Trial remains deferred behind the pre-Claude-bakeoff
follow-up and UI-polish lane.
