# BANDIT-057 Retrospective

## Outcome

`BANDIT-057` landed and closed out the first bounded role-scoped workflow orchestration chore. The work adds supported `replaced` bootstrap-gap disposition semantics, explicit Repo PM and Work Item PM entrypoints, role-required refusal for bare workflow invocation, deterministic Formation Gate validation, formation review evidence requirements, append-only `formation_approved` coordination state, and Work Item PM readiness checks. Stage 3 implementation stayed with Claude Implementation Writer after Codex-authored RED evidence, Stage 4 CodeRabbit findings were repaired or explicitly no-actioned under operator direction, Local Qwen passed, aggregate Stage 4 review evidence and Stage 5 landing evidence are recorded, and local-record landing action evidence exists for commit `3b3850131d798d9910fe368bd2bbcad98e764f6f`.

## What Worked

- The narrow Stage 4 repair-ownership failure was not treated as a one-off no-action item; it was replaced with a broader role-scoped orchestration umbrella and a concrete first slice.
- The role-required entrypoint boundary now prevents bare workflow invocation from hydrating repo context before a PM role is selected.
- Formation approval and Work Item PM readiness now fail closed on missing, stale, blocked, contradictory, or undispositioned formation evidence.
- The Stage 3 Writer and Test Writer boundaries were preserved in the accepted implementation record; later focused repairs were dispatched to Claude Implementation Writer instead of Codex PM patching Writer-owned source directly.
- The final Stage 4 loop stayed bounded after the operator-directed CodeRabbit disposition: the major CLI usage finding and aggregate role-required blocker were repaired, Local Qwen passed, and no additional CodeRabbit call was made for the same finding set.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Stage 4 repair ownership failures are symptoms of overloaded PM authority and need role-scoped orchestration, not ad hoc PM patching. | replaced bootstrap gap | `BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is formally replaced by `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` with replacement evidence in `BANDIT-057`. |
| Role selection must happen before workflow context hydration. | bootstrap slice delivered | Bare Bandit invocation now fails closed with role-required guidance, while role-specific Repo PM and Work Item PM entrypoints own their supported command surfaces. |
| Formation approval needs deterministic source, review, and readiness checks before execution starts. | bootstrap slice delivered | `repo-pm approve-formation` and `work-item-pm start` now validate formation review metadata, coordination history, and readiness evidence instead of trusting artifact presence or mutable flags. |
| Repeated Claude Writer repair attempts need generous abnormal-run windows and recovery evidence before declaring provider blockage. | explicit no-action decision | The operator-run Claude repair took about nine minutes and later bounded Writer attempts completed; the existing token-cost failsafe and recovery artifacts are sufficient for this slice. |
| The remaining full role-run manifest, execution packet, diff validation, and closeout packet ideas are future work, not hidden acceptance criteria for this slice. | queued replacement umbrella | `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains queued as the replacement umbrella so future bounded slices can be created explicitly before unrelated Phase 8 product work. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Early Claude Writer recovery attempts hung or produced no source changes, and a duplicate repair process was stopped after interruption. Later bounded/manual Claude repair evidence completed and was reviewed. | explicit no-action decision - recovery evidence is recorded in `docs/work/BANDIT-057/stage3-repair-recovery.md`, and no new provider/tool gap is needed |
| overreasoning | The work stayed bounded to role entrypoints, Formation Gate validation, formation-approved coordination state, Work Item PM readiness, replaced gap disposition support, review evidence, landing evidence, and closeout. | explicit no-action decision - no full PRD decomposition, role-run manifest system, execution packet system, scheduler, worktree lifecycle, claim lease, product UAT, PR/CI workflow, dependency change, or unrelated Phase 8 work started |
| work-breakdown fit | The slice was large but still coherent as the first role-scoped orchestration increment because entrypoint refusal, formation approval, readiness, and replaced disposition semantics are tightly coupled. | queued replacement umbrella - future role-scoped work should remain split into bounded slices under the replacement gap |
| agent-scope fit | Codex PM owned routing, review, finding disposition, landing, and closeout; Claude Implementation Writer owned implementation and repair source changes; reviewers owned Stage 4 evidence. | bootstrap slice delivered - the original ownership violation is replaced by role-scoped orchestration evidence |
| tool-use rule pressure | Stage 6 still requires synchronized retrospective, bootstrap-gap ledger, roadmap, current-context, status, and event evidence; the artifact renderer covers only the retrospective body. | explicit no-action decision - this closeout updates all required routing surfaces as one Stage 6 step |
| reviewer/model routing | CodeRabbit produced major and non-major findings; the operator explicitly directed major-only repair and no further CodeRabbit call for that finding set. Local Qwen passed, and no escalated reviewer trigger remained. | explicit no-action decision - CodeRabbit non-major findings are no-actioned by operator direction and Local Qwen left no unresolved cross-model tension |
| tool invocation friction | The established commands for focused tests, typecheck, validation, CodeRabbit state validation, risk classification, supply-chain gate, land-check, auto-land-check, local land, cockpit status, session context, and artifact creation were usable. | explicit no-action decision - no new invocation-gap chore is created |
| recurring inefficiency | Several PM review and Claude repair passes were needed because focused RED coverage did not fully capture formation-review metadata consistency at first. | queued replacement umbrella - future role-scoped slices should keep formation contracts small and verifier-readable |
| cost or latency signals | No paid reviewer route, recurring paid model route, external service setup, dependency install, live SCA provider, or spend-class approval was introduced. | explicit no-action decision - no cost-policy follow-up is required |
| unresolved uncertainty | No uncertainty remains for the delivered role-required invocation, Repo PM create/approve entrypoints, Work Item PM readiness checks, formation evidence validation, or replaced gap disposition support. | queued replacement umbrella - remaining role-scoped orchestration ideas require future explicit work items before unrelated Phase 8 product work |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is formally replaced by `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` through `BANDIT-057` evidence. The replacement umbrella remains queued for future bounded role-scoped orchestration work, including role-run manifests, execution packets, diff-based write validation, same-agent repair continuation, landing/closeout packets, or rubric migration only when a later work item explicitly scopes them.

Unrelated Phase 8 cockpit product work remains blocked while the replacement bootstrap gap is queued.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-057`. CodeRabbit's major CLI usage finding was repaired by Claude Implementation Writer, the six non-major CodeRabbit findings were explicitly skipped by operator direction with no further CodeRabbit call for that finding set, Local Qwen passed with no findings, and Codex PM accepted aggregate Stage 4 after the focused role-required blocker was repaired and verified.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is replaced by `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` through `BANDIT-057` closeout evidence.
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains queued as the next bootstrap-gap umbrella before unrelated Phase 8 cockpit work.
- Unrelated Phase 8 cockpit work remains blocked while any open bootstrap gap remains queued or active.

## Bootstrap-Gap Disposition

`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is formally replaced.

The replacement gap is `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.
The replacement work item is `BANDIT-057`.

The replacement evidence is:

- `docs/design/role-scoped-workflow-orchestration.md`
- `docs/decisions/2026-06-01-explicit-role-entrypoints-and-formation-gate.md`
- `docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`
- `docs/work/BANDIT-057/brief.md`
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/work/BANDIT-057/implementation-evidence.md`
- `docs/work/BANDIT-057/stage3-pm-review.md`
- `docs/work/BANDIT-057/coderabbit-review.md`
- `docs/work/BANDIT-057/local-qwen-review.md`
- `docs/work/BANDIT-057/review-evidence.md`
- `docs/work/BANDIT-057/landing-verdict.md`
- `docs/work/BANDIT-057/landing-action.md`
- `docs/work/BANDIT-057/retrospective.md`
- `.bandit/bootstrap-gaps.json`

The replaced narrow gap is not treated as resolved implementation work or a
no-action decision. It is closed because `BANDIT-057` added the supported
replacement disposition semantics and delivered the first bounded slice of the
replacement umbrella.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-057`.
- Structured improvement mining: `pass` - the checklist covers failed tool
  calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use rule
  pressure, reviewer/model routing, tool invocation friction, recurring
  inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as replaced
  bootstrap gap, delivered bootstrap slice, queued replacement umbrella, or
  explicit no-action decision.
- Bootstrap-gap disposition: `pass` -
  `BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` is marked replaced in
  `.bandit/bootstrap-gaps.json`, and
  `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` is queued as the replacement
  umbrella for future bounded role-scoped orchestration work.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, and `STATUS.md` are updated during closeout.
