# BANDIT-026 Retrospective

## Outcome

`BANDIT-026` is landed and closed out as the Phase 6 Coordination Primitive
slice for typed state extensions.

The slice added typed extension checkpoints for feature UAT and chore
disposition while preserving one shared core coordination lifecycle. Product
UAT remains operator-owned and CLI-recorded, chore disposition is explicit when
UAT is not applicable, actor events remain non-authoritative, and derived
status is still computed from repo-native evidence.

## What Worked

- Focused RED tests kept typed extension behavior narrow: feature UAT, chore
  disposition, wrong-kind refusal, invalid ordering, actor-event
  non-authority, and core-only compatibility were all specified before
  implementation.
- The shared core lifecycle did not fork. Typed checkpoints extend the
  coordination contract without creating separate slice and chore workflows.
- `review_subject_hash` kept Stage 4 review evidence current while Stage 5
  landing evidence advanced repository history.
- Local Qwen passed with no findings, which let the slice close without a
  recursive non-blocking review loop.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Typed state extensions should be evidence reconciliation points, not hidden workflow authority. | Durable artifact | `src/state/coordination-log.ts`, `test/coordination-log.test.mjs`, and `test/coordination-status.test.mjs` now enforce typed UAT and chore-disposition checkpoints while preserving shared core ordering. |
| Chore closeout needs explicit disposition evidence when product UAT is not applicable. | Durable artifact | The chore disposition extension records this as a first-class state, so future coordination status can distinguish "not a feature" from "accepted without evidence." |
| The current CodeRabbit workflow implemented PR-context live review but missed the faster pre-PR `coderabbit review --agent` CLI path discussed for reducing GitHub CodeRabbit queue waste. | Bootstrap-gap improvement chore | This is a real workflow gap exposed by `BANDIT-026` review evidence: `coderabbit_state` was recorded as a no-PR bootstrap gap even though a pre-PR CLI review path should be available before opening a PR. It is queued as `BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` and should become the next work item. |
| Phase 6 should continue after the CodeRabbit workflow correction rather than letting known review-gate debt trail future coordination slices. | Next-step decision | The operator directed the CodeRabbit fix to become the next work item after `BANDIT-026` landed. |

## Improvement Chores

`BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` is recorded as the next bootstrap-gap
improvement chore. It should repair the CodeRabbit pre-landing loop so Stage 4
can run CodeRabbit CLI against local diffs before PR creation, record real
CodeRabbit evidence, and reserve GitHub CodeRabbit for later confirmation
rather than first-pass discovery.

## Cross-Model Tension

No unresolved cross-model tension remains for the typed state extension
implementation.

There is workflow tension between the existing `BANDIT-015` implementation and
the intended CodeRabbit policy: the repo says CodeRabbit should be a
CLI-driven pre-landing loop that avoids GitHub-only queue delay, but the
implemented live path requires PR context. That tension is accepted as a
bootstrap-gap improvement chore rather than treated as a blocker on the already
landed `BANDIT-026` slice.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` is open and should be linked to the
  next work item before unrelated Phase 6, Phase 7, Phase 8, or dogfood work
  proceeds.
