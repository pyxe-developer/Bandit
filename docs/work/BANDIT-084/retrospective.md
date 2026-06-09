# BANDIT-084 Retrospective

## Outcome

`BANDIT-084` landed and closed the Claim-First Transition Policy Triage chore.
The recorded disposition defers universal claim-first policy for synchronous
stage transitions. Current policy remains unchanged: every transition needs an
accountable actor, and explicit prior claim events are required only for
delegated or asynchronous work unless a later operator-approved policy changes
that boundary.

The triage reviewed recent landed coordination logs, the accepted Git refs CAS
claim-authority decision, active claim-authority policy, projection boundaries,
and Stage 4 review evidence. It found no concrete accountable-actor failure or
sequential-transition race pattern that justifies adding universal pre-claim
ceremony now.

## What Worked

- Work Item PM plan-mode recorded a stage checklist before RED evidence.
- Stage 2 used disposition-focused RED evidence rather than source tests,
  matching the analysis-only scope.
- Claude Sonnet 4.6 completed Stage 3 as a different model family from Codex's
  Stage 2 RED authoring and stayed inside the dispatch write surface.
- PM corrected one disposition wording issue: `.bandit/claims/` contains its
  projection README, not an empty directory.
- CodeRabbit was allowed the full 600-second review window and timed out; the
  timeout was recorded honestly without claiming a pass.
- Local Qwen used the authorized MLX adapter route and returned only
  non-blocking process observations, both dispositioned before landing.
- Risk classification, supply-chain gate, review-subject hash, land-check, and
  local-record landing all completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Triage-only work may still need Stage 2 and Stage 3 artifacts after formation approval. | no_action | The coordination log proves formation and plan-mode happened before RED and implementation evidence; Qwen's process note is dispositioned in `qwen-finding-disposition.md`. |
| Disposition-only Stage 3 benefits from a named disposition artifact plus Writer report, even if those files are not listed in Stage 1 expected files. | no_action | The orchestration plan and dispatch authorized the bounded files; they improved review traceability without widening policy or source scope. |
| Universal claim-first should wait for both release-authorized CAS claim operations and concrete accountable-actor failure evidence. | deferred | This is the durable policy disposition for `WIL-CLAIM-FIRST`; it does not create a new implementation work item now. |
| CodeRabbit timeout remains recurring Stage 4 latency friction. | no_action | Timeout evidence is recorded as bootstrap replacement evidence with no CodeRabbit pass claimed; Local Qwen, PM review, risk/supply gates, validation, and land-check were sufficient for this chore. |
| Claims projection wording must be precise. | resolved | PM repaired the Stage 3 wording from "directory is empty" to "directory contains only its projection README." |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| Source evidence review | No landed coordination log showed missing accountable actors or sequential-transition races. | deferred - no universal claim-first implementation now |
| Claim-authority policy | `release_authorized_decisions` remains empty. | deferred - revisit only after release-authorized CAS claim operations exist |
| Local Qwen | Stage-sequencing and expected-file observations were non-blocking. | no_action - dispositioned without repair |
| CodeRabbit | Provider timed out before terminal review evidence. | no_action - bootstrap replacement evidence recorded with no pass claimed |
| Cost or latency signals | No dependency, hosted service, paid route, merge, push, deploy, or external side effect was introduced. | no_action - no spend-class or external-service follow-up required |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material lesson is the `WIL-CLAIM-FIRST` disposition itself: universal
claim-first policy remains deferred until both stated conditions are true, or
until the operator explicitly approves the policy gate recorded in
`claim-first-transition-disposition.md`.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude authored the Stage 3
disposition; CodeRabbit timed out with no pass claimed; Local Qwen confirmed
the substantive disposition and raised only non-blocking process notes; Codex
PM dispositioned those notes before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-084` closeout. The CodeRabbit
timeout is recorded as bootstrap replacement evidence for this work item, not
as a new queued bootstrap gap.

The next recorded action is Repo PM formation for the intake-derived
`WIL-REPO-WIDE-TRANSITION-INDEX` proposal, Repo-Wide Transition Index Decision.
