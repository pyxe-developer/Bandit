# BANDIT-086 Retrospective

## Outcome

`BANDIT-086` landed and closed the Coordination Primitive Completion Triage
chore. The recorded disposition defers any new coordination primitive
implementation. Current policy remains unchanged: per-work-item
`docs/work/<ID>/coordination-log.jsonl` files remain canonical append-only Step
Transition Ledgers, current-state summaries and cockpit/session surfaces remain
derived and rebuildable, and any future shared coordination primitive,
State Index, local API, scheduler, claim/worktree lifecycle, guarded browser
action authority, PR/CI/CD behavior, merge, push, deploy, paid routing, hosted
service, public benchmark, Trust Verifier, or cross-repo runtime behavior must
enter through a separately formed work item with fresh RED evidence.

The triage reviewed the accepted 2026-05-24 coordination primitive decision,
the migrated intake proposal, current roadmap/status artifacts, landed Phase 6
coordination work, recent coordination-heavy work items, and Stage 4 review
evidence. It found that the accepted design has already been satisfied for
current workflow needs by the landed per-work-item coordination log system and
derived projection surfaces.

## What Worked

- Work Item PM recorded plan-mode orchestration before RED evidence.
- Stage 2 used disposition-focused RED evidence, matching the decision-only
  scope.
- Claude was attempted first for Stage 3 and returned a session-limit failure;
  the failure was recorded honestly before MiniMax-M3 fallback.
- MiniMax completed Stage 3 inside the dispatch surface without editing tests,
  routing, landing, or closeout files.
- CodeRabbit received a repaired rerun and the full 600-second review window;
  the final timeout was recorded as bootstrap-gap evidence without claiming a
  pass.
- Local Qwen used the authorized MLX adapter route and returned only
  non-blocking process observations, all dispositioned before landing.
- Risk classification, supply-chain gate, review-subject hash, land-check, and
  local-record landing completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| The accepted coordination primitive design is already covered for current workflow needs by landed per-work-item coordination logs and derived projections. | deferred | No new implementation is authorized until concrete trigger conditions justify a future slice. |
| Per-work-item coordination logs remain the canonical coordination primitive. | no_action | Existing logs and validators satisfy current step transition, actor event, safe trigger, and derived status needs. |
| Auxiliary dispatch/provider-attempt artifacts can be valid evidence even when not named in the original brief. | no_action | They preserve routing truth without expanding implementation scope or source authority. |
| Future stale-evidence coordination behavior needs RED tests only when future implementation is actually authorized. | no_action | The current chore was disposition-only and changed no source behavior. |
| CodeRabbit timeout remains recurring Stage 4 latency friction. | no_action | Timeout evidence is recorded with no pass claimed; Local Qwen, PM review, risk/supply gates, validation, and land-check were sufficient for this chore. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| Source evidence review | Landed coordination work already provides the accepted per-work-item Step Transition Ledger behavior. | deferred - no new coordination primitive implementation now |
| Derived projection review | Cockpit status, session-context, work-intake, queue, heartbeat, risk, supply, and review-subject hash surfaces are non-authoritative projections that work from current artifacts. | no_action - keep current source-of-truth policy |
| Local Qwen | Stage-timing, auxiliary-evidence, and future stale-evidence notes were non-blocking. | no_action - PM dispositioned each finding before landing |
| CodeRabbit | Initial minor finding was repaired by staging the missing evidence file; rerun timed out before terminal review. | no_action - bootstrap replacement evidence recorded with no pass claimed |
| Landing gate | Local-record landing passed with CodeRabbit bootstrap-gap evidence, Local Qwen non_blocking evidence, and no product UAT requirement. | no_action - landing contract held |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material lesson is the `WIL-COORDINATION-PRIMITIVE` disposition itself:
new coordination primitive work remains deferred until a named trigger
condition appears and a future work item proves the focused behavior through
normal RED, implementation, review, landing, and closeout gates.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude could not run Stage 3 due to
session limits; MiniMax authored the Stage 3 disposition; CodeRabbit timed out
after the repaired rerun with no pass claimed; Local Qwen confirmed the
substantive disposition and raised only non-blocking process notes; Codex PM
dispositioned those notes before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-086` closeout. The CodeRabbit
timeout is recorded as bootstrap replacement evidence for this work item, not
as a new queued bootstrap gap.

The next recorded action is Repo PM formation for the intake-derived
`WIL-PR-CICD-LANDING` proposal, PR And CI/CD Landing Workflow Policy.
