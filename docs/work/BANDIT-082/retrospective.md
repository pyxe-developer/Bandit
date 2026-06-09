# BANDIT-082 Retrospective

## Outcome

`BANDIT-082` landed and closed the Work Intake Ledger And Followups Migration
slice. The work adds a validated repo-native Work Intake Ledger at
`.bandit/work-intake-ledger.json`, read-only `bandit work-intake validate` and
`bandit work-intake list` commands, deterministic proposal ordering, and
source-preserving migration for `FOLLOWUPS.md`, the UI polish source note, and
legacy `BANDIT-022` follow-up candidates.

The slice deliberately keeps intake entries proposal-only. They do not allocate
Work Item IDs, become claimable, start Work Item PM orchestration, schedule
work, mutate browser/cockpit state, approve UAT, authorize landing, merge,
push, deploy, or bypass normal Stage 1 formation.

## What Worked

- The Work Item PM plan-mode gate created an explicit stage checklist before
  RED evidence and implementation.
- Codex authored RED tests, Claude Sonnet 4.6 received the first Stage 3
  implementation dispatch, and MiniMax-M3 completed the fallback only after the
  prompt-required 15-minute Claude timeout.
- The implementation kept state validation in `src/state/work-intake-ledger.ts`,
  command behavior in `src/commands/work-intake.ts`, and CLI routing in
  `src/cli.ts`.
- Validation proved every migrated `FOLLOWUPS.md` open entry has source
  metadata, intake outcome, non-claimable state, and transition history before
  `FOLLOWUPS.md` was marked deprecated source metadata.
- Local Qwen used the authorized MLX adapter route and returned only
  non-blocking evidence/procedure observations, all dispositioned before
  landing.
- CodeRabbit timed out after the required 600-second window; the timeout was
  recorded as bootstrap replacement evidence with no pass claimed.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Intake migration should make deprecated source status explicit only after validation proves complete ledger coverage. | resolved | `FOLLOWUPS.md` now points to `.bandit/work-intake-ledger.json` as the active proposal-state source after validation passed. |
| Reviewer packets can see only the latest repair diff even when the full implementation is committed. | no_action | The aggregate review artifact records full-source verification evidence; no source repair follows from a packet-scope limitation. |
| Claude timeout fallback evidence must be written plainly before review. | resolved | Stage 3 implementation evidence records the timeout, partials, fallback dispatch, and MiniMax writer report. |
| Work Intake Ledger entries must stay separate from claim/work-item authority. | resolved | Ledger validation and mutation-refusal tests prove entries remain proposals and non-authoritative for claims, scheduling, browser mutation, and Work Item allocation. |
| CodeRabbit provider timeout remains recurring Stage 4 latency friction. | no_action | Timeout evidence is recorded honestly as bootstrap replacement evidence with no CodeRabbit pass claimed; Local Qwen, PM review, focused verification, risk classification, and supply-chain gate evidence were sufficient for this slice. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| reviewer finding | Qwen found `FOLLOWUPS.md` deprecation state was not explicit. | resolved - source metadata was repaired and validation passed |
| reviewer finding | Qwen questioned MiniMax fallback routing after Claude timeout. | no_action - automation instructions explicitly authorized MiniMax-M3 after a 15-minute Claude timeout |
| reviewer finding | Qwen could not directly inspect the full implementation diff in the refreshed repair packet. | no_action - committed implementation artifacts and focused verification provide the durable evidence |
| reviewer/tool friction | CodeRabbit timed out after the full 600-second window. | no_action - recorded as bootstrap replacement evidence with no pass claim |
| scope boundary | Work-intake proposals could be mistaken for claimable work. | resolved - tests and ledger authority metadata enforce proposal-only, non-claimable behavior |
| cost or latency signals | No dependency, hosted service, paid reviewer, paid model route, merge, push, or deploy was introduced. | no_action - no provider-pricing or spend-class follow-up is required |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material lessons were resolved inside the slice or recorded as explicit
no-action decisions. Existing queued intake entries remain proposal state in
`.bandit/work-intake-ledger.json`; they are not retrospective-generated chores.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-082`. Claude timed out
after the required allowance, MiniMax completed the Stage 3 source
implementation without editing RED tests, CodeRabbit timed out with no pass
claimed, Local Qwen returned non-blocking observations, and Codex PM repaired
or dispositioned those observations before landing.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-082` closeout. The next recorded
action is Repo PM formation for the intake-derived `WIL-UI-POLISH` proposal,
Bandit Cockpit UI Polish From Attached Design. The V0 Closeout Claude Code A/B
Product-Value Trial remains deferred behind the pre-Claude-bakeoff intake lane.
