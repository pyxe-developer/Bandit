# BANDIT-060 Retrospective

## Outcome

`BANDIT-060` landed and closed out the Artifact Input Directory Split bootstrap-gap chore. The work establishes a repo-native artifact-input taxonomy, moves future artifact-renderer JSON inputs to `docs/artifact-inputs/`, keeps future work/gap specs under `docs/specs/`, reserves reviewer captures for `docs/reviewer-captures/`, reserves trust snapshot fixtures for `docs/trust-snapshot-fixtures/`, and preserves legacy `docs/specs/` artifact-renderer inputs as readable historical evidence only. Stage 3 preserved Bootstrap Model-Family Separation after Codex-authored RED evidence, and Codex PM/Test Writer reconciled the older artifact-create test contract without granting Stage 3 Writer authority over Test Writer-owned surfaces. CodeRabbit findings were dispositioned; bounded repair was recorded and accepted; Local Qwen passed with no findings; aggregate Stage 4 review, Stage 5 landing verdict, local-record landing action, and clean-code compliance are recorded.

## What Worked

- The artifact-input taxonomy kept the cleanup narrow by separating command-input classes without changing canonical Markdown evidence, append-only coordination history, roadmap/current-context authority, or bootstrap-gap ledger authority.
- Focused artifact-input and artifact-create tests proved both future `docs/specs/` refusal for renderer inputs and legacy-readable historical `docs/specs/` compatibility.
- The Stage 3 Writer/Test Writer boundary held after PM reconciliation: Claude authored implementation evidence, while Codex PM/Test Writer repaired the contradictory historical test contract.
- CodeRabbit's active-slice findings were bounded into manifest metadata and command usage/typing repairs, then accepted before Local Qwen and aggregate Stage 4 evidence.
- Stage 5 layered risk-classification and supply-chain gate evidence kept the local-record landing path separate from Trust Verifier cutover, product UAT, live provider routing, dependency policy, and unrelated cockpit scope.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Artifact-renderer JSON inputs need a distinct preferred path so work/gap specs, reviewer captures, trust snapshots, and generated evidence inputs do not share ambiguous `docs/specs/` semantics. | bootstrap_gap_resolved | `BANDIT-060` adds the artifact-input taxonomy, policy evidence, command validation, artifact-create path guard, preferred `docs/artifact-inputs/` support, and legacy-readability handling required to resolve `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT`. |
| Historical artifact-create tests can encode pre-taxonomy assumptions that conflict with a new RED contract. | explicit no-action decision | Codex PM/Test Writer repaired the historical test contract in this slice and recorded the reconciliation in `docs/work/BANDIT-060/stage3-pm-review.md`; no additional follow-up is needed because the focused suites now pass together and preserve both future refusal and legacy readability. |
| Implementation Writer role-run manifests do not yet validate actual write surfaces against artifact-input policy and preferred-directory marker files. | queued bootstrap gap | `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` is recorded in `.bandit/bootstrap-gaps.json` with source artifacts from `BANDIT-060`; it should become the next bounded chore before Trust Verifier cutover or unrelated cockpit work. |
| CodeRabbit can surface useful maintenance hardening on adjacent landed surfaces while the active slice must stay bounded. | deferred follow-up candidate | `docs/work/BANDIT-060/coderabbit-finding-disposition.md` records `BANDIT-060-TRUST-REPORT-FLAG-USAGE-HARDENING` as a future trust-verifier CLI parsing candidate, but it does not block this artifact-input closeout or expand the current gap. |
| Trust Verifier cutover remains blocked until compatibility evidence and artifact-input paths are clear. | explicit no-action decision | `BANDIT-060` clears the artifact-input ambiguity but does not replace or wrap any existing gate path; the Trust Verifier Cutover Gate remains future per-trust-goal work requiring reproducible parity evidence. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | No required closeout tool failed during this slice; earlier Stage 4 CodeRabbit findings were completed and dispositioned, and Local Qwen passed with no findings. | explicit no-action decision - no unrecorded failed-tool lesson remains after CodeRabbit disposition, bounded repair acceptance, and Local Qwen pass evidence |
| overreasoning | The work stayed bounded to artifact-input path/type semantics and did not implement Trust Verifier cutover, reviewer execution changes, model calls, harness queues, role input packets, execution packets, Pi/Aperture agent-scope work, or cockpit product work. | explicit no-action decision - no unrelated Phase 8 or future trust-verifier scope was started |
| work-breakdown fit | The artifact-input taxonomy, artifact-create path guard, validation command, preferred directories, and legacy compatibility tests formed a coherent cleanup chore. | bootstrap_gap_resolved - `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is resolved by this bounded work item after landing and closeout |
| agent-scope fit | Codex PM owned routing, Test Writer reconciliation, finding disposition, repair acceptance, landing, and closeout; Claude Implementation Writer owned Stage 3 source implementation and bounded CodeRabbit repair; reviewers owned Stage 4 evidence. | explicit no-action decision - model-family separation and the Permanent Test Ownership Boundary were preserved |
| tool-use rule pressure | Stage 6 still requires generated retrospective evidence plus manual synchronization across `.bandit/bootstrap-gaps.json`, coordination log, events, `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`. | explicit no-action decision - this remains the supported Stage 6 closeout boundary, and the synchronized artifacts are recorded in this step |
| reviewer/model routing | CodeRabbit returned eight findings, four active-slice repairs and four no-action/deferred dispositions; Claude completed bounded repair; Local Qwen then passed with no findings; no escalated reviewer trigger remained. | explicit no-action decision - all reviewer/model routing outcomes have durable evidence and no unresolved cross-model tension remains |
| tool invocation friction | The focused test, typecheck, artifact-input validation, role-run validation, risk/supply-chain validation, review-subject hash, land-check, auto-land-check, local land, cockpit status, session-context, and artifact-create paths had established invocations. | explicit no-action decision - no new invocation-gap chore is created by this closeout |
| recurring inefficiency | Manual Stage 6 ledger/context synchronization recurred, but it is already the expected closeout boundary; the only new workflow inefficiency was the role-run write-surface mismatch exposed by artifact-input policy surfaces. | queued bootstrap gap - route write-surface policy and role-run validation hardening through `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` |
| cost or latency signals | No paid reviewer route, recurring paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, or live SCA provider was introduced. | explicit no-action decision - no cost-policy follow-up is required |
| unresolved uncertainty | No uncertainty remains for the artifact-input directory split after tests, review, landing, and closeout; uncertainty remains around role-run write-surface validation and future Trust Verifier cutover parity. | queued bootstrap gap - create the next bounded chore for `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`; keep Trust Verifier cutover as later per-trust-goal work |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is resolved by `BANDIT-060` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` is the next queued bootstrap gap. The next recorded action is to create a bounded chore spec and work item for that gap before Trust Verifier cutover work, without starting cutover, cockpit product work, Pi/Aperture agent-scope work, role input packet work, or execution packet work.

`BANDIT-060-TRUST-REPORT-FLAG-USAGE-HARDENING` remains a deferred follow-up candidate in `docs/work/BANDIT-060/coderabbit-finding-disposition.md`; evaluate it only when a future work item edits `src/commands/trust.ts` or trust-verifier CLI parsing.

Trust Verifier Cutover Gate remains future work and must be explicit per trust goal with reproducible parity evidence before any old gate path is replaced or wrapped.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-060`. CodeRabbit findings were dispositioned by Codex PM; accepted active-slice findings were repaired by Claude Implementation Writer and accepted by Codex PM; Local Qwen passed with no findings; no escalated reviewer trigger remained. The Stage 3 Writer/Test Writer boundary mismatch was resolved by PM/Test Writer test-contract reconciliation plus a queued role-contract write-surface gap, not by broadening Writer authority.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is resolved by `BANDIT-060` closeout evidence.
- `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` remains open and is the next queued bootstrap chore before Trust Verifier cutover work.
- Trust Verifier Cutover Gate remains future per-trust-goal work after compatibility evidence and role-contract artifact-input write-surface hardening.
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open as source material while harness-agnostic trust-layer bootstrap work continues.
- Unrelated Phase 8 cockpit product work remains blocked while open bootstrap gaps remain queued or active.
