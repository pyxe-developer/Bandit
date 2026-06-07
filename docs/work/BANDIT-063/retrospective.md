# BANDIT-063 Retrospective

## Outcome

`BANDIT-063` landed and closed out the Work Item PM Plan Mode Orchestration
Gate bootstrap-gap chore. The work adds a deterministic Work Item PM plan-mode
gate after formation/current-state grounding and before RED evidence or broader
orchestration. `work-item-pm start` now fails closed when
`docs/work/<ID>/orchestration-plan.md` is missing or structurally incomplete,
records append-only `orchestration_plan_recorded` coordination evidence when
the gate is satisfied, and keeps the plan artifact advisory rather than
canonical workflow state. Stage 2 RED evidence, Stage 3 Claude implementation
evidence, Codex PM acceptance, CodeRabbit pass evidence, Local Qwen
non-blocking review/disposition, aggregate Stage 4 review, Stage 5
safe-to-land verdict, local-record landing action, and clean-code compliance
are recorded.

## What Worked

- The RED tests captured the exact missing gate: Work Item PM readiness could
  proceed after formation approval without durable plan-mode evidence.
- Claude's Stage 3 implementation stayed narrowly scoped to one plan validator,
  one command gate, one coordination-state vocabulary extension, and one
  advisory template.
- CodeRabbit completed the Stage 4 pre-PR review with zero findings, giving a
  clean second-review signal for the committed diff.
- Local Qwen found the expected semantic-strengthening limitation without
  blocking landing; Codex PM dispositioned it explicitly instead of silently
  treating a structural validator as a full semantic plan parser.
- The risk-classification and supply-chain gates registered `BANDIT-063` and
  kept operator supervision, dependency, lockfile, external-service,
  merge/push/deploy, and product UAT surfaces out of scope.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Work Item PM needs durable plan-mode evidence before Stage 2 RED or broader orchestration. | bootstrap_gap_resolved | `BANDIT-063` adds `src/state/work-item-pm-plan.ts`, gates `work-item-pm start`, validates required plan sections, and records `orchestration_plan_recorded` coordination evidence before RED. |
| The plan artifact must stay advisory and must not replace canonical workflow state. | bootstrap_gap_resolved | The implementation records the plan only as append-only coordination evidence; brief, coordination log, review evidence, landing evidence, retrospective, roadmap/current context, and bootstrap-gap ledger authority remain canonical. |
| Semantic plan freshness and content validation are useful future strengthening areas but are larger than the bounded deterministic gate. | explicit no-action decision | Local Qwen raised stale-evidence and semantic fail-closed concerns as non-blocking. Codex PM accepted them as no-source-repair for this slice because semantic repo-state comparison would require a separate policy/validator contract. |
| Coordination state names and current-stage routing text must stay parser-compatible. | explicit no-action decision | Validation rejected the initial unsupported `safe_to_land` state and session-context rejected non-`Stage N` wording. The route was repaired to `landing_verdict_recorded` and `Stage 5: landing action required`; existing validators caught the issue before commit. |
| The local-record landing command writes landing-action evidence but does not append the lifecycle coordination transition. | explicit no-action decision | Codex PM recorded the required `landed` step transition manually after `bandit land BANDIT-063 --action local-record`; no new automation chore is opened because this remains the established Stage 6 synchronization boundary. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | `land-check` failed closed before aggregate review evidence and again before landing-verdict evidence existed; coordination validation rejected `safe_to_land`; session-context rejected non-parser-facing stage wording. | explicit no-action decision - each failure was handled by recording the missing evidence or restoring supported coordination/stage vocabulary before commit |
| overreasoning | The work did not start Trust Verifier cutover, role input packet work, execution packet work, Pi/Aperture agent-scope work, claim/worktree/scheduler execution, cockpit product work, dependency changes, or merge/push/deploy behavior. | explicit no-action decision - unrelated Phase 8 and future trust-verifier scope stayed blocked |
| work-breakdown fit | The plan-mode gate, coordination vocabulary, template, and focused tests formed a coherent bounded chore. | bootstrap_gap_resolved - `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is resolved by this landed work item |
| agent-scope fit | Codex PM authored RED evidence and review/landing/closeout artifacts; Claude Implementation Writer owned Stage 3 source implementation; reviewers owned Stage 4 evidence. | explicit no-action decision - Bootstrap Model-Family Separation and the Permanent Test Ownership Boundary were preserved |
| tool-use rule pressure | Stage 6 again required synchronized updates across `.bandit/bootstrap-gaps.json`, coordination log, events, `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`. | explicit no-action decision - this remains the supported closeout boundary and is recorded in this step |
| reviewer/model routing | CodeRabbit returned zero findings; Local Qwen returned non-blocking semantic-strengthening observations; no escalated reviewer trigger remained. | explicit no-action decision - all reviewer outcomes have durable dispositions and no unresolved cross-model tension remains |
| tool invocation friction | CodeRabbit pre-PR review, Local Qwen review, risk classification, supply-chain gate, review-subject hash, land-check, auto-land/local land, cockpit status, session-context, and validation commands all had established invocations. | explicit no-action decision - no invocation-gap chore is created by this closeout |
| recurring inefficiency | Policy index registration changed the review-subject hash, requiring a recomputed aggregate review hash after the per-work evidence was registered. | explicit no-action decision - the existing review-subject hash command and policy validators handled the drift before landing |
| cost or latency signals | No paid reviewer route, recurring paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, or live SCA provider was introduced. | explicit no-action decision - no cost-policy follow-up is required |
| unresolved uncertainty | No uncertainty remains for the deterministic Work Item PM plan-mode gate after tests, review, landing, and closeout; broader semantic plan validation and Trust Verifier cutover remain separate future policy/validator work. | explicit no-action decision - no new immediate chore is opened from this slice; route Trust Verifier cutover gate triage before unrelated cockpit work |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this
closeout.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is resolved by `BANDIT-063`
after landing action and this Stage 6 closeout evidence.

Trust Verifier Cutover Gate remains the next bootstrap-policy triage item before
unrelated cockpit product work. It must be explicit per trust goal with
reproducible parity evidence before any old gate path is replaced or wrapped.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open as source material
while harness-agnostic trust-layer bootstrap work continues and while Trust
Verifier cutover policy remains unresolved.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-063`. Claude source
implementation was accepted after focused verification; CodeRabbit completed
with zero findings; Local Qwen findings were non-blocking and dispositioned as
no-source-repair for the current bounded deterministic contract; no source
repair, escalated reviewer routing, operator-owned decision, or policy override
remained.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is resolved by
  `BANDIT-063` closeout evidence.
- Trust Verifier Cutover Gate remains future per-trust-goal work after
  compatibility evidence, artifact-input cleanup, serializer metadata
  preservation, and Work Item PM plan-mode orchestration are complete.
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains open as source
  material while harness-agnostic trust-layer bootstrap work continues.
- Unrelated Phase 8 cockpit product work remains blocked while open bootstrap
  gaps remain queued or active.
