# BANDIT-062 Retrospective

## Outcome

`BANDIT-062` landed and closed out the Work Item Create Replacement Metadata Preservation bootstrap-gap chore. The work adds focused coverage proving `work-item create` preserves replaced bootstrap-gap metadata and updates the work-item creation serializer so ledger rewrites retain `replacement_gap`, `replacement_work_item`, and `replacement_evidence`. Stage 2 RED evidence, Stage 3 Claude implementation evidence, bounded role-run manifest repairs, Codex PM acceptance, CodeRabbit timeout evidence, refreshed Local Qwen review/disposition, aggregate Stage 4 review, Stage 5 safe-to-land verdict, local-record landing action, and clean-code compliance are recorded.

## What Worked

- The RED test reproduced the exact serializer failure observed during `BANDIT-061`: creating an active gap work item rewrote the ledger and dropped replacement metadata from an already-replaced gap.
- Claude's Stage 3 implementation stayed narrowly scoped to `serializeBootstrapGapLedger`, preserving the existing command shape and adding no new abstractions beyond conditional emission of the three replacement metadata fields.
- The role-run manifest validation loop caught schema and base-revision evidence defects before Stage 4, and the bounded repair dispatches corrected the artifact without broadening source scope.
- CodeRabbit provider timeout was recorded as replacement/bootstrap-gap evidence, while Local Qwen, aggregate review evidence, risk classification, supply-chain gate evidence, land-check, and auto-land-check supplied the required landing confidence.
- The refreshed Local Qwen pass after risk and supply-chain evidence changed the review subject kept Stage 4 evidence current before the landing verdict.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Work-item creation must round-trip every parsed bootstrap-gap ledger field when it rewrites `.bandit/bootstrap-gaps.json`. | bootstrap_gap_resolved | `BANDIT-062` adds a regression test for replaced gap metadata and updates `serializeBootstrapGapLedger` to preserve `replacement_gap`, `replacement_work_item`, and `replacement_evidence` during active-gap linking. |
| Stage 3 role-run manifests can have evidence defects even when the source implementation is correct. | explicit no-action decision | The existing `role-runs validate` path caught the invalid manifest shape and incorrect base revision, and bounded Writer repair dispatches corrected the role-run artifact before Stage 4. |
| CodeRabbit can time out during pre-PR review and formation review without returning actionable findings. | explicit no-action decision | `BANDIT-062` recorded provider-timeout evidence through the existing artifact path, then used Local Qwen, aggregate review, and landing-gate evidence without inventing a new provider policy or retry loop. |
| Risk-classification and supply-chain evidence can change the review subject after an initial Local Qwen pass. | explicit no-action decision | The Stage 4 route recorded the drift, refreshed Local Qwen on the updated review subject, dispositioned the non-blocking observations, and recorded aggregate review evidence with the current hash. |
| Work Item PM still lacks a durable plan-mode orchestration gate before execution. | queued bootstrap gap | `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` remains queued and is the next bootstrap-gap work queue item after this closeout. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | `role-runs validate` rejected the first Stage 3 manifest, `land-check` failed closed before aggregate review and landing-verdict evidence existed, and the live CodeRabbit CLI timed out before a terminal pre-PR verdict. | explicit no-action decision - each failure was handled by the existing fail-closed evidence path, bounded Writer repair dispatch, or provider-timeout artifact |
| overreasoning | The work did not start Trust Verifier cutover, cockpit product work, role input packet work, execution packet work, Pi/Aperture agent-scope work, provider routing changes, dependency changes, or merge/push/deploy behavior. | explicit no-action decision - unrelated Phase 8 and future trust-verifier scope stayed blocked |
| work-breakdown fit | The serializer regression, metadata preservation fix, and Stage 6 gap disposition formed a coherent bounded chore. | bootstrap_gap_resolved - `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is resolved by this landed work item |
| agent-scope fit | Codex PM authored RED evidence and review/landing/closeout artifacts; Claude Implementation Writer owned the Stage 3 source implementation and bounded manifest repairs; reviewers owned Stage 4 evidence. | explicit no-action decision - Bootstrap Model-Family Separation and the Permanent Test Ownership Boundary were preserved |
| tool-use rule pressure | Stage 6 still requires synchronized updates across `.bandit/bootstrap-gaps.json`, coordination log, events, `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`. | explicit no-action decision - this remains the supported Stage 6 closeout boundary and is recorded in this step |
| reviewer/model routing | CodeRabbit timed out without findings; Local Qwen returned non-blocking observations after review-subject refresh; Codex PM dispositioned those observations without source repair and no escalated reviewer trigger remained. | explicit no-action decision - all reviewer outcomes have durable dispositions and no unresolved cross-model tension remains |
| tool invocation friction | Artifact creation, role-run validation, CodeRabbit timeout fixture generation, Local Qwen refresh, risk classification, supply-chain gate, review-subject hash, land-check, auto-land/local land, cockpit status, and session-context commands all had established invocations. | explicit no-action decision - no new invocation-gap chore is created by this closeout |
| recurring inefficiency | Manual closeout synchronization recurred, but the concrete workflow gap identified outside the fixed serializer path is the already-queued Work Item PM plan-mode orchestration gate. | queued bootstrap gap - route the next bounded chore through `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` |
| cost or latency signals | No paid reviewer route, recurring paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, or live SCA provider was introduced. | explicit no-action decision - no cost-policy follow-up is required |
| unresolved uncertainty | No uncertainty remains for the replacement-metadata serializer chore after tests, review, landing, and closeout; uncertainty remains around the queued Work Item PM plan-mode gate and future Trust Verifier cutover parity. | queued bootstrap gap - create or disposition the Work Item PM plan-mode orchestration chore next; keep Trust Verifier cutover as later per-trust-goal work |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is resolved by `BANDIT-062` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` remains the next queued bootstrap gap. The next recorded action is to create or disposition a bounded chore for the Work Item PM plan-mode orchestration gate before Trust Verifier cutover work, without starting cutover, cockpit product work, Pi/Aperture agent-scope work, role input packet work, or execution packet work.

Trust Verifier Cutover Gate remains future work and must be explicit per trust goal with reproducible parity evidence before any old gate path is replaced or wrapped.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-062`. Claude source implementation was accepted after bounded role-run manifest repairs; CodeRabbit timed out without actionable findings and timeout evidence was recorded; refreshed Local Qwen findings were non-blocking and dispositioned as no-source-repair; no source repair, escalated reviewer routing, operator-owned decision, or policy override remained.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is resolved by `BANDIT-062` closeout evidence.
- `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` remains open and is the next queued bootstrap chore before Trust Verifier cutover work.
- Trust Verifier Cutover Gate remains future per-trust-goal work after compatibility evidence and Work Item PM plan-mode orchestration disposition.
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open as source material while harness-agnostic trust-layer bootstrap work continues.
- Unrelated Phase 8 cockpit product work remains blocked while open bootstrap gaps remain queued or active.
