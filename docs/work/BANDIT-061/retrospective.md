# BANDIT-061 Retrospective

## Outcome

`BANDIT-061` landed and closed out the Role Contract Artifact Input Write Surface bootstrap-gap chore. The work extends implementation-writer support surfaces for artifact-input policy paths, adds contract-versioned role-run manifest validation for observed changed files, fails closed when observed files are outside allowed target files or role write surfaces, and keeps historical role-run manifests compatible. Stage 2 RED evidence, Stage 3 Claude implementation evidence, Codex PM acceptance, CodeRabbit review/disposition, refreshed Local Qwen review/disposition, aggregate Stage 4 review, Stage 5 safe-to-land verdict, local-record landing action, and clean-code compliance are recorded.

## What Worked

- The chore stayed bounded to role-contract support surfaces, role-run manifest validation, and template guidance without starting Trust Verifier cutover, role input packet, execution packet, Pi/Aperture agent-scope, or cockpit product work.
- Contract-versioned role-run manifests let the validator require `observed_changed_files` for future manifests while preserving historical manifest compatibility.
- The implementation-writer role contract now includes artifact-input policy and support paths needed by the artifact-input directory split from `BANDIT-060`.
- The refreshed Local Qwen loop caught review-subject drift after risk and supply-chain evidence changed the hash, and the required refresh restored current Stage 4 evidence before landing.
- CodeRabbit and Local Qwen findings were dispositioned without source broadening; no accepted finding required expanding the slice.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Role-run manifests need explicit observed changed-file evidence when role contracts are used to enforce write-surface boundaries. | bootstrap_gap_resolved | `BANDIT-061` adds `contract_version: 2` support, requires `observed_changed_files` for future manifests, verifies observed files against `allowed_target_files`, and rejects observed files outside the role contract write surfaces. |
| Implementation-writer role-contract support surfaces must include artifact-input policy paths after artifact-input directory split work. | bootstrap_gap_resolved | `BANDIT-061` extends `.bandit/policy/role-contracts.json` and role-contract validation so the implementation writer includes `.bandit/policy/artifact-inputs.json`, `docs/artifact-inputs/**`, reviewer-capture fixtures, and trust-snapshot fixtures when the artifact-input policy exists. |
| Risk-classification and supply-chain policy evidence can change the review subject after reviewer runs. | explicit no-action decision | The Stage 4 loop recorded the drift, refreshed Local Qwen on the updated review subject, and land-check accepted only current review-subject evidence. No new chore is needed because the existing fail-closed review-subject and refresh path handled the drift. |
| Reviewer requests for more diagnostic specificity and template examples can be useful but do not always justify source expansion. | explicit no-action decision | Codex PM dispositioned the refreshed Local Qwen observations as non-blocking: the diagnostic already reports the full required policy support set, and the live `BANDIT-061` role-run manifest provides the concrete `contract_version: 2` example. |
| Work-item creation can still drop replacement metadata when it rewrites the bootstrap-gap ledger. | queued bootstrap gap | `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is already recorded and remains the next bootstrap-gap queue item after this closeout. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | `npm run bandit -- land-check BANDIT-061` failed closed before aggregate Stage 4 review evidence existed and later passed after Stage 5 landing verdict evidence; `session-context current --json` rejected non-parser-facing stage wording until the sentence used an explicit `Stage 5` label. | explicit no-action decision - both failures were handled inside the current workflow by recording missing evidence and restoring parser-compatible stage wording |
| overreasoning | The work did not start Trust Verifier cutover, cockpit product work, role input packet work, execution packet work, Pi/Aperture agent-scope work, provider routing changes, dependency changes, or merge/push/deploy behavior. | explicit no-action decision - unrelated Phase 8 and future trust-verifier scope stayed blocked |
| work-breakdown fit | Role-contract support-surface validation and role-run changed-file enforcement formed a coherent bounded chore with focused tests. | bootstrap_gap_resolved - `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` is resolved by this landed work item |
| agent-scope fit | Codex PM authored RED evidence and review/landing/closeout artifacts; Claude Implementation Writer owned Stage 3 source implementation; reviewers owned Stage 4 evidence. | explicit no-action decision - Bootstrap Model-Family Separation and the Permanent Test Ownership Boundary were preserved |
| tool-use rule pressure | Stage 6 still requires synchronized updates across `.bandit/bootstrap-gaps.json`, coordination log, events, `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`. | explicit no-action decision - this remains the supported Stage 6 closeout boundary and is recorded in this step |
| reviewer/model routing | CodeRabbit returned procedural findings that were satisfied by lifecycle continuation; Local Qwen returned non-blocking findings that were dispositioned; no escalated reviewer trigger remained. | explicit no-action decision - all reviewer outcomes have durable dispositions and no unresolved cross-model tension remains |
| tool invocation friction | Artifact creation, role-contract validation, role-run validation, risk classification, supply-chain gate, review-subject hash, land-check, auto-land/local land, cockpit status, and session-context commands all had established invocations. | explicit no-action decision - no new invocation-gap chore is created by this closeout |
| recurring inefficiency | Manual closeout synchronization recurred, but the only concrete new workflow gap observed during `BANDIT-061` was the work-item creation replacement-metadata serializer issue already queued. | queued bootstrap gap - route the serializer repair through `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` |
| cost or latency signals | No paid reviewer route, recurring paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, or live SCA provider was introduced. | explicit no-action decision - no cost-policy follow-up is required |
| unresolved uncertainty | No uncertainty remains for the role-contract artifact-input write-surface chore after tests, review, landing, and closeout; uncertainty remains around the queued work-item creation serializer repair and future Trust Verifier cutover parity. | queued bootstrap gap - create or disposition the serializer repair next; keep Trust Verifier cutover as later per-trust-goal work |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` is resolved by `BANDIT-061` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` remains the next queued bootstrap gap. The next recorded action is to create or disposition a bounded chore for that serializer repair before Trust Verifier cutover work, without starting cutover, cockpit product work, Pi/Aperture agent-scope work, role input packet work, or execution packet work.

Trust Verifier Cutover Gate remains future work and must be explicit per trust goal with reproducible parity evidence before any old gate path is replaced or wrapped.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-061`. CodeRabbit findings were procedural and dispositioned by Codex PM; Local Qwen findings were non-blocking and dispositioned after the required review-subject refresh; no source repair, escalated reviewer routing, operator-owned decision, or policy override remained.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` is resolved by `BANDIT-061` closeout evidence.
- `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` remains open and is the next queued bootstrap chore before Trust Verifier cutover work.
- Trust Verifier Cutover Gate remains future per-trust-goal work after compatibility evidence and serializer gap disposition.
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open as source material while harness-agnostic trust-layer bootstrap work continues.
- Unrelated Phase 8 cockpit product work remains blocked while open bootstrap gaps remain queued or active.
