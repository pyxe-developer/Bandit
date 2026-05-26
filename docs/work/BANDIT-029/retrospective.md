# BANDIT-029 Retrospective

## Outcome

`BANDIT-029` is landed and closed out as the first Phase 7 Improvement Engine
slice.

The slice added the narrow `bandit improvements` foundation:

- `bandit improvements candidates [--json]`
- `bandit improvements evaluate <candidate-id> --evidence <path> [--json]`

Candidate discovery reads repo-native work artifacts and returns a derived
report of durable improvement candidates. Evaluation validates one existing
evidence artifact for a candidate with metric evidence, baseline comparison,
Stage 7 result, routing decision, rationale, source artifacts, and routing
action. Canonical state remains in repo artifacts; no hidden improvement index,
cockpit state, scheduler behavior, claim lease, worktree lifecycle, automatic
evaluation, merge, push, deploy, product UAT, or unrelated actor identity policy
was introduced.

## What Worked

- Focused RED tests captured candidate discovery, metadata refusal, missing
  source-artifact refusal, single-evaluation evidence validation, result and
  decision vocabulary separation, and hidden-index absence before implementation.
- The implementation kept command orchestration and improvement metadata parsing
  separated in `src/commands/improvements.ts` and `src/state/improvements.ts`.
- Pre-PR CodeRabbit review completed with zero findings, proving the
  `BANDIT-027` pre-PR review path can support local-record Bandit work.
- Local Qwen accepted the implementation behavior and surfaced only
  non-blocking hardening concerns, which were routed without reopening the
  landing loop.
- `npm run bandit -- improvements candidates --json` now finds complete
  repo-native queued candidates from `BANDIT-025`, `BANDIT-028`, and
  `BANDIT-029`.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Improvement candidates need complete source metadata before they become evaluable. | Durable artifact | Candidate discovery now fails closed unless source artifacts, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome are present. |
| Stage 7 evidence result and workflow routing decision are separate concepts. | Durable artifact | `bandit improvements evaluate` validates result values separately from keep/revise/revert/double_down decisions. |
| Candidate reports must remain derived until the canonical artifact contract is mature. | Durable artifact | The slice deliberately avoids `.bandit` improvement indexes, cockpit-owned state, and scheduler-owned evaluation. |
| Local Qwen's memory-scan and metadata-continuation findings are real hardening concerns but not blockers for the first foundation slice. | Follow-up chore candidate | `docs/work/BANDIT-029/qwen-finding-disposition.md` records `BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING` with source artifacts, hypothesis, metric, baseline, evaluation window, status, and pending outcome. |
| The `BANDIT-023` non-blocking review-finding routing hypothesis is now ready for Phase 7 evaluation. | Next-step decision | Its evaluation window was after the next three Stage 4 work items with Local Qwen findings; `BANDIT-025`, `BANDIT-028`, and `BANDIT-029` satisfy that evidence window. The next Phase 7 work item should evaluate that workflow outcome before Phase 8 cockpit work. |

## Improvement Chores

No new active work item is created by this retrospective.

The accepted Local Qwen non-blocking findings are durably routed as a queued
chore candidate in `docs/work/BANDIT-029/qwen-finding-disposition.md`:

- `BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING`

This candidate should be considered when improvement candidate discovery,
metadata parsing, or artifact format compatibility is next changed.

The next Phase 7 work item should evaluate the now-due `BANDIT-023`
non-blocking review-finding routing hypothesis against the Stage 4 outcomes from
`BANDIT-025`, `BANDIT-028`, and `BANDIT-029`.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-029`.

CodeRabbit returned no findings. Local Qwen returned `non_blocking` hardening
findings. Codex PM accepted the scaling/parser hardening findings as future
work and recorded an explicit no-action decision for required hypothesis
metadata because fail-closed complete metadata is the intended foundation
contract.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-029`.
- Lesson disposition: `pass` - material lessons are classified as durable
  artifacts, follow-up chore candidate, no-action decision, or next-step
  decision.
- Improvement metadata: `pass` - the accepted Local Qwen hardening candidate is
  recorded with source artifacts, hypothesis, metric, baseline, expected
  direction, evaluation window, status, and pending outcome.
- Context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.

## Bootstrap Gaps Remaining

- None currently recorded as open or active.
