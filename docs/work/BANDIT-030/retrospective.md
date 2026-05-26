# BANDIT-030 Retrospective

## Outcome

`BANDIT-030` is landed and closed out as the Phase 7 Improvement Engine work
item that evaluated the `BANDIT-023` non-blocking review-finding routing policy.

The work recorded `docs/work/BANDIT-030/improvement-evaluation.md` with result
`effective` and decision `keep`. The evaluated source retrospective in
`docs/work/BANDIT-023/retrospective.md` now records `status: evaluated` and
`outcome: keep`, so the due `BANDIT-023` improvement candidate no longer remains
pending after closeout.

No Phase 8 cockpit implementation, scheduler execution, claim lease, work
surface reservation, worktree lifecycle, product UAT approval, actor identity
policy, automatic merge, push, deploy behavior, or unrelated coordination work
was started.

## What Worked

- Stage 7 evaluation stayed grounded in repo-native evidence from `BANDIT-023`,
  `BANDIT-025`, `BANDIT-028`, and `BANDIT-029` rather than chat memory.
- The `bandit improvements evaluate` command validated the evaluation artifact
  against the due `BANDIT-023` candidate and preserved separate result and
  routing-decision vocabulary.
- CodeRabbit and Local Qwen both completed Stage 4 review for the final subject;
  Local Qwen passed with no findings.
- The evaluation kept the non-blocking routing policy narrow: blocker Local Qwen
  findings, CodeRabbit request-changes, stale review-subject hashes, and missing
  PM disposition remain fail-closed.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Retrospective-derived improvement metadata must be updated after evaluation, not left as a permanently pending candidate. | Durable artifact | `docs/work/BANDIT-023/retrospective.md` now records `status: evaluated`, `outcome: keep`, and points at the `BANDIT-030` evaluation evidence. |
| Non-blocking review-finding routing reduced repeat Stage 4 churn in the observed window without weakening blocker behavior. | Improvement decision | `docs/work/BANDIT-030/improvement-evaluation.md` records result `effective`, decision `keep`, source artifacts, metric evidence, and routing action. |
| Queued hardening candidates from `BANDIT-025`, `BANDIT-028`, and `BANDIT-029` are not automatically due just because the routing policy was kept. | No-action decision | `npm run bandit -- heartbeat inspect --json` reports no current heartbeat candidates; the remaining improvement candidates stay queued until their own evaluation windows are reached. |
| Phase 7 exit criteria are satisfied by a tagged improvement chore being evaluated against metric evidence with a keep/revise/revert/double-down decision. | Next-step decision | The next repo-native step can move to Phase 8 by creating the first Workflow Cockpit work-item brief from `docs/design/workflow-cockpit-boundary.md`, while preserving CLI authority and stopping before implementation until the brief exists. |

## Improvement Chores

No new active work item is created by this retrospective.

The `BANDIT-023` improvement decision is complete:

- candidate: `BANDIT-023`
- result: `effective`
- decision: `keep`
- evidence: `docs/work/BANDIT-030/improvement-evaluation.md`

The remaining improvement candidates reported by
`npm run bandit -- improvements candidates --json` are queued candidates whose
evaluation windows are tied to future work touching their specific areas:

- `BANDIT-025-EVIDENCE-INTEGRITY`
- `BANDIT-025-TIMESTAMP-VALIDATION`
- `BANDIT-025-WORK-TYPE-PARSING`
- `BANDIT-028-ACTOR-IDENTITY-VALIDATION`
- `BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING`

These candidates should not block the first Phase 8 cockpit brief unless that
brief touches their scoped evidence, parser, actor identity, or improvement
metadata areas.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-030`.

CodeRabbit's valid rubric-reference findings were repaired before final Stage 4
evidence. Its remaining EOF-newline finding was dispositioned as stale/no-action
after `git diff --check` and file newline inspection. Local Qwen passed with no
findings.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-030`.
- Lesson disposition: `pass` - material lessons are classified as durable
  artifact, improvement decision, no-action decision, or next-step decision.
- Improvement disposition: `pass` - `docs/work/BANDIT-023/retrospective.md`
  now records the evaluated `keep` outcome and points at the `BANDIT-030`
  evidence.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-030` has no
  `docs/work/BANDIT-030/coordination-log.jsonl`, and `bandit coordination status
  BANDIT-030` reports the missing log rather than a closable state.

## Bootstrap Gaps Remaining

- None currently recorded as open or active.
