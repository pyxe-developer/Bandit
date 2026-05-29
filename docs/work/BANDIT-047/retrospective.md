# BANDIT-047 Retrospective

## Outcome

`BANDIT-047` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION`. The work adds a repo-native model-family separation and Test Ownership Boundary gate through `.bandit/policy/model-family-separation.json`, `docs/templates/model-family-separation.md`, `docs/model-family-separation/BANDIT-047-model-family-separation.json`, `src/state/model-family-separation.ts`, and `src/commands/validate.ts`. It enforces different-model-family Stage 3 routing after Codex-authored or materially edited RED evidence, Claude as the bootstrap Stage 3 Process Adapter path, the permanent Stage 3 Writer ban on tests, test helpers, fixtures, RED evidence, and acceptance mappings, full invalidation and revert evidence for contaminated Writer attempts, and Codex PM escalation disposition for Claude-authored code. Stage 4 pre-PR CodeRabbit and Local Qwen evidence passed with no findings after the CodeRabbit repair loop, explicit layered risk-classification and supply-chain gate evidence passed, Stage 5 landing verdict and local-record landing action evidence are recorded, and no Focused Session Context implementation, Worktree Bootstrap Contract implementation, scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, product UAT scope, live routing change, paid reviewer route, dependency or lockfile change, installed global skill edit, external service integration, automatic merge/push/deploy behavior, or unrelated Phase 8 work was introduced.

## What Worked

- The 2026-05-28 grill-with-docs review and bootstrap-gap ledger gave this chore a precise workflow repair target: enforce model-family separation and the permanent Writer test-edit ban without claiming live True Agent orchestration.
- Focused RED tests and evidence artifacts made the role boundary testable: Codex-authored RED evidence requires a different Stage 3 model family, bootstrap Stage 3 routes to Claude, and any Writer test-surface edit invalidates the entire attempt until full revert evidence exists.
- The Claude Writer route produced implementation evidence while preserving the Test Ownership Boundary; the initial dispatch blocker and timeout were handled through PM-owned rerun and repair evidence instead of operator-owned routing.
- Stage 4 stayed bounded after repair: the prior CodeRabbit findings were fixed with focused regression coverage, the scoped CodeRabbit rerun passed with zero findings, and Local Qwen passed with no findings.
- Stage 5 used the existing layered risk-classification, supply-chain, input-quarantine, operator-boundary, coordination-authority, land-check, auto-land-check, and local-record landing paths without expanding workflow authority.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Bootstrap RED/GREEN work needs enforced model-family separation when Codex authored or materially edited RED tests. | bootstrap_gap_resolved | `BANDIT-047` adds policy, template, evidence, validator, validate integration, focused tests, Stage 4 review evidence, Stage 5 landing verdict, local-record landing action, and retrospective closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION` resolved during closeout. |
| The Stage 3 Writer test-edit ban must be absolute and independent of model provider, bootstrap harness, or future True Agent runtime. | bootstrap_gap_resolved | The model-family separation evidence and validator reject Writer touches to tests, test helpers, fixtures, RED evidence, and acceptance mappings, including formatting or mechanical changes, and require full contaminated-attempt revert evidence before rerun. |
| Artifact and diff gates can enforce bootstrap role separation, but they are not live cross-model orchestration. | explicit no-action decision | `BANDIT-047` records the Bootstrap Orchestration Boundary and keeps enforcement around Process Adapter artifacts and diffs. Live bidirectional agent messaging, scoped runtime permissions, persistent worker context, and true harness-managed agents remain future harness scope, not a hidden claim in this chore. |
| Cold starts still spend too much context on historical roadmap narrative before narrow work can begin. | queued_bootstrap_gap | `BANDIT-GAP-FOCUSED-SESSION-CONTEXT` remains open and is now the next queued bootstrap-gap chore. It should define CLI-derived Focused Session Context Packets before Worktree Bootstrap Contract, scheduler, cockpit UI/server/API, or unrelated Phase 8 work proceeds. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | The work item recorded two real execution frictions before closeout: the first Claude Writer dispatch was incorrectly recorded as requiring operator input before PM-owned rerun routing repaired it, and the first scoped CodeRabbit provider attempt timed out before a later retry completed with findings. | explicit no-action decision - both frictions were resolved inside the existing operator-boundary, CodeRabbit retry, evidence, and context-update paths; no new bootstrap gap is required |
| overreasoning | The chore stayed bounded to model-family separation policy, evidence, template, validation, command wiring, focused tests, Stage 4 repair/review evidence, Stage 5 landing evidence, and Stage 6 closeout. | explicit no-action decision - no Focused Session Context implementation, Worktree Bootstrap Contract, scheduler, worktree lifecycle, cockpit UI/server/API, state index, PR/CI workflow, merge, push, deploy, live routing, paid-reviewer route, external service, dependency, lockfile, installed-skill, or unrelated Phase 8 work started |
| work-breakdown fit | The gap was a good single bootstrap chore: define RED evidence, run Claude Stage 3 implementation through the Process Adapter boundary, repair actionable CodeRabbit findings, collect Qwen and CodeRabbit pass evidence, land locally, then close out the gap. | explicit no-action decision - the remaining Focused Session Context and Worktree Bootstrap Contract gaps stay separate |
| agent-scope fit | Codex PM owned routing and RED evidence, Claude owned Stage 3 implementation only, CodeRabbit and Local Qwen owned Stage 4 review, Codex PM owned finding disposition and escalation, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains for BANDIT-047 |
| tool-use rule pressure | Stage 6 still requires manual synchronization across generated retrospective evidence, `.bandit/bootstrap-gaps.json`, `CURRENT_CONTEXT.md`, and `ROADMAP.md`, but the established artifact-create, validate, gaps list, land-check, auto-land-check, cockpit status, and diff-hygiene commands cover the closeout. | explicit no-action decision - existing Stage 6 bookkeeping paths are sufficient for this closeout |
| reviewer/model routing | CodeRabbit initially found two actionable validator weaknesses, the repair added regression coverage, the rerun passed with zero findings, Local Qwen passed with no findings, and the recorded risk/smell rationale did not require escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains for BANDIT-047 |
| tool invocation friction | The work used established commands for CodeRabbit provider review, Local Qwen review, review-subject hash, risk classification, supply-chain gate, input quarantine, operator boundary, coordination authority, land-check, auto-land-check, local land, validation, gaps list, cockpit status, and artifact creation. | explicit no-action decision - no new invocation-friction bootstrap gap is needed |
| recurring inefficiency | The closeout confirms the existing context-pressure problem: cold starts and Stage 6 context updates still depend on long roadmap/current-context surfaces before a narrow next action can be executed. | queued bootstrap gap - BANDIT-GAP-FOCUSED-SESSION-CONTEXT is now the next queued work item |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, benchmark spend, live external service, dependency install, or live SCA provider was introduced. CodeRabbit and Local Qwen used existing Stage 4 reviewer paths. | explicit no-action decision - no cost or latency follow-up is required |
| unresolved uncertainty | No uncertainty remains for the model-family separation gap after focused tests, repair evidence, reviewer pass evidence, landing verdict, local-record landing action, explicit risk-classification and supply-chain evidence, validation evidence, and closeout. The next known bootstrap gap is `BANDIT-GAP-FOCUSED-SESSION-CONTEXT`. | queued bootstrap gap - BANDIT-GAP-FOCUSED-SESSION-CONTEXT |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION` is resolved by `BANDIT-047`. The next queued bootstrap gap is `BANDIT-GAP-FOCUSED-SESSION-CONTEXT`, which should become the next work item before Worktree Bootstrap Contract work, scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-047`. Pre-PR CodeRabbit passed with zero findings after the focused repair, Local Qwen passed with no findings, and no escalated reviewer route was required by the recorded risk and smell-trigger rationale.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is open and now the next queued bootstrap-gap chore.
- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` remains queued behind focused session context.
- `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` remains queued behind the worktree bootstrap contract.
- `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES`, `BANDIT-GAP-STAGE-CAPABILITY-SCOPE`, `BANDIT-GAP-TOKEN-COST-FAILSAFE`, and `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` remain queued in the order recorded in `.bandit/bootstrap-gaps.json`.
- Unrelated Phase 8 cockpit work remains blocked while any open bootstrap gap remains queued or active.

## Bootstrap-Gap Disposition

`BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION` is resolved.

The resolution evidence is:

- `docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json`
- `docs/work/BANDIT-047/brief.md`
- `docs/specs/BANDIT-047-red-evidence.json`
- `docs/work/BANDIT-047/red-evidence.md`
- `test/model-family-separation.test.mjs`
- `docs/work/BANDIT-047/dispatch.md`
- `docs/work/BANDIT-047/writer-dispatch-blocker.md`
- `docs/specs/BANDIT-047-implementation-evidence.json`
- `docs/work/BANDIT-047/implementation-evidence.md`
- `docs/work/BANDIT-047/writer-report.md`
- `.bandit/policy/model-family-separation.json`
- `docs/templates/model-family-separation.md`
- `docs/model-family-separation/BANDIT-047-model-family-separation.json`
- `src/state/model-family-separation.ts`
- `src/commands/validate.ts`
- `docs/work/BANDIT-047/coderabbit-finding-disposition.md`
- `docs/work/BANDIT-047/coderabbit-review.md`
- `docs/work/BANDIT-047/local-qwen-review.md`
- `docs/work/BANDIT-047/review-evidence.md`
- `docs/specs/BANDIT-047-landing-verdict.json`
- `docs/work/BANDIT-047/landing-verdict.md`
- `.bandit/policy/risk-classifications/BANDIT-047-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-047-supply-chain-gate.json`
- `docs/work/BANDIT-047/landing-action.md`
- `docs/specs/BANDIT-047-retrospective.json`
- `docs/work/BANDIT-047/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-FOCUSED-SESSION-CONTEXT` remains open and is now the next queued
bootstrap-gap chore. The next Bandit step is to create exactly one work item
for that gap; do not start Worktree Bootstrap Contract work, scheduler
execution, full worktree lifecycle enablement, cockpit UI/server/API work,
PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or
unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-047`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, queued bootstrap gap, or explicit no-action decisions.
- Improvement disposition: `pass` - no new retrospective-derived improvement
  chore is created by this closeout.
- Bootstrap-gap disposition: `pass` - `BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION`
  is marked resolved in `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-047` has no
  `docs/work/BANDIT-047/coordination-log.jsonl`, and this closeout does not add
  coordination state.
