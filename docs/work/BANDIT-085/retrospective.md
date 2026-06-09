# BANDIT-085 Retrospective

## Outcome

`BANDIT-085` landed and closed the Repo-Wide Transition Index Decision chore.
The recorded disposition defers a repo-wide transition index. Current policy
remains unchanged: per-work-item `docs/work/<ID>/coordination-log.jsonl` files
remain canonical append-only Step Transition Ledgers, and any future
repo-wide index must be derived-only, rebuildable, non-authoritative, and gated
by concrete query pressure plus normal slice review.

The triage reviewed the intake proposal, `FOLLOWUPS.md` source metadata,
recent landed coordination logs, current cockpit/session/work-intake derived
surfaces, and Stage 4 review evidence. It found no current cockpit, heartbeat,
scheduler, or cross-work-item reporting pressure that justifies implementing a
repo-wide transition index now.

## What Worked

- Work Item PM recorded plan-mode orchestration before RED evidence.
- Stage 2 used disposition-focused RED evidence, matching the decision-only
  scope.
- Claude Sonnet 4.6 completed Stage 3 as a different model family from Codex's
  Stage 2 RED authoring and stayed inside the dispatch write surface.
- CodeRabbit was allowed the full 600-second review window and timed out; the
  timeout was recorded honestly without claiming a pass.
- Local Qwen used the authorized MLX adapter route and returned only
  non-blocking process observations, both dispositioned before landing.
- The landing gate caught a real policy-evidence gap: per-work-item risk and
  supply-chain files were not enough until the global auto-landing policy
  entries also authorized `BANDIT-085`.
- Risk classification, supply-chain gate, review-subject hash, land-check, and
  local-record landing all completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| A repo-wide transition index should wait for concrete query pressure. | deferred | The disposition records named trigger conditions and a conditional derived-only rebuild contract; no implementation is authorized now. |
| Per-work-item coordination logs remain the right canonical source. | no_action | Existing derived surfaces satisfy current cockpit, session, work-intake, queue, heartbeat, and improvement-health needs without shared transition authority. |
| Non-blocking Local Qwen findings must use parser-accepted durable routing syntax. | resolved | `review-evidence.md` now uses explicit `no_action:` routes with concrete rationale for each non-blocking finding. |
| Auto-landing needs both per-work-item risk/supply evidence and global release-authorized policy entries. | resolved | `.bandit/policy/risk-classification.json` and `.bandit/policy/supply-chain-gate.json` now include `BANDIT-085` auto-landing decisions. |
| CodeRabbit timeout remains recurring Stage 4 latency friction. | no_action | Timeout evidence is recorded as bootstrap replacement evidence with no CodeRabbit pass claimed; Local Qwen, PM review, risk/supply gates, validation, and land-check were sufficient for this chore. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| Source evidence review | Recent landed work did not require cross-work-item transition aggregation. | deferred - no repo-wide transition index implementation now |
| Derived projection review | Current cockpit/session/work-intake/queue/heartbeat surfaces are non-authoritative projections that work from existing repo artifacts. | no_action - keep current source-of-truth policy |
| Local Qwen | Verification-gap and stage-timing observations were non-blocking. | no_action - PM ran live commands and coordination proved correct sequencing |
| Landing gate | Missing global auto-landing policy entries blocked local-record. | resolved - policy entries added and validators list `BANDIT-085` |
| CodeRabbit | Provider timed out before terminal review evidence. | no_action - bootstrap replacement evidence recorded with no pass claimed |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material lesson is the `WIL-REPO-WIDE-TRANSITION-INDEX` disposition itself:
repo-wide transition indexing remains deferred until a named trigger condition
is observed and a future work item proves a derived-only, fail-closed contract.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude authored the Stage 3
disposition; CodeRabbit timed out with no pass claimed; Local Qwen confirmed
the substantive disposition and raised only non-blocking process notes; Codex
PM dispositioned those notes before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-085` closeout. The CodeRabbit
timeout is recorded as bootstrap replacement evidence for this work item, not
as a new queued bootstrap gap.

The next recorded action is Repo PM formation for the intake-derived
`WIL-COORDINATION-PRIMITIVE` proposal, Coordination Primitive Completion
Triage.
