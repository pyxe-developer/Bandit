# BANDIT-052 Retrospective

## Outcome

`BANDIT-052` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER`. The work defines a repo-native event-driven wake scheduler policy and validator before Bandit removes fallback LLM polling for ordinary work discovery. The implementation adds a narrow `bandit event-driven-wake-scheduler validate [--json]` command, a fail-closed policy reader, a repository policy fixture requiring deterministic sweeper coverage, and a template documenting event triggers, deterministic sweeping, Work Availability Wake Guarantee, one-claim activation, and no-authority trigger boundaries. Stage 4 scoped pre-PR CodeRabbit passed after a focused context-drift repair, Local Qwen passed with no findings, Stage 5 landing verdict and local-record landing action evidence are recorded, explicit layered risk-classification and supply-chain gate evidence are recorded, and no full scheduler execution, batch queue draining, multi-repo scheduling, full worktree lifecycle enablement, claim lease creation or release, claim authority change, work-surface reservation implementation, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work was introduced.

## What Worked

- The scheduler work stayed at the policy and validation boundary instead of introducing runtime scheduler authority before the wake guarantee is proven.
- Focused RED and implementation evidence covered the missing deterministic sweeper requirement, fail-closed policy parsing, CLI registration, and clean no-op validation surface.
- Stage 3 implementation preserved the Bootstrap Model-Family Separation and Test Ownership Boundary while keeping scheduler execution, worktree lifecycle, claim authority, and cockpit UI/server/API behavior out of scope.
- Stage 4 review recovered from transient CodeRabbit provider rate limits through a focused retry path, repaired a real context-drift finding, and then recorded a clean CodeRabbit pass plus a Local Qwen pass.
- Stage 5 landing used current review-subject hash evidence, layered risk-classification evidence, supply-chain gate evidence, land-check, auto-land-check, and local-record landing action without expanding workflow authority.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Event-driven wake scheduling needs a deterministic non-LLM sweeper and Work Availability Wake Guarantee before fallback LLM polling can be removed. | bootstrap_gap_resolved | `BANDIT-052` adds the event-driven wake scheduler policy, validation command, template, focused tests, implementation evidence, review evidence, Stage 5 landing verdict, local-record landing action, and Stage 6 closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` resolved during closeout. |
| Trigger text, sweeper output, and cockpit projections must not become workflow authority. | explicit no-action decision | The implemented validator and template keep repo-native artifacts, append-only coordination history, claim authority, roadmap/current-context, and work-item evidence as the authority boundaries; no hidden scheduler authority is introduced. |
| A single wake activation should select at most one runnable stage and explain skipped work instead of batch-draining the queue. | explicit no-action decision | The policy fixture and template record the one-claim activation contract. Full scheduler execution, queue draining, and claim lifecycle behavior remain out of scope for this chore. |
| Recoverable external reviewer API failures should be retried when provider evidence gives a safe wait-and-retry path. | durable follow-up candidate | `docs/work/BANDIT-052/api-failure-recovery-retrospective-input.md` records the CodeRabbit rate-limit recovery lesson. The retry-budget and abnormal-run failsafe policy fits the queued `BANDIT-GAP-TOKEN-COST-FAILSAFE` work rather than creating a separate immediate gap. |
| Scheduler wake policy reduces no-op LLM discovery risk but does not provide first-class observability traces for wakeups, tool calls, reviewer runs, token spend, retries, failures, or outcomes. | queued_bootstrap_gap | `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` remains queued behind this closeout and must define OTel-compatible trace shape, operation spans, correlation IDs, observability projections, and authority-boundary validation before unrelated Phase 8 work resumes. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Stage 4 encountered recoverable CodeRabbit provider rate limits before the focused review completed. Codex PM diagnosed the structured provider output, waited through provider-reported retry windows, retried the same focused command, repaired one valid context-drift finding, and reran to a clean pass. | durable follow-up candidate - route retry-budget and abnormal-run API recovery policy into BANDIT-GAP-TOKEN-COST-FAILSAFE; no separate immediate gap is required |
| overreasoning | The work stayed bounded to event-driven wake scheduler policy validation, evidence, review repair, landing evidence, retrospective closeout, bootstrap-gap disposition, and roadmap/current-context synchronization. | explicit no-action decision - no full scheduler execution, batch queue draining, multi-repo scheduling, full worktree lifecycle, claim lease creation or release, claim authority change, work-surface reservation, cockpit UI/server/API, PR/CI workflow, merge, push, deploy, product UAT, paid-reviewer route, external service, dependency, lockfile, installed-skill, or unrelated Phase 8 work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: define and validate event-driven wake policy and deterministic sweeper requirements before enabling scheduler execution or removing fallback polling. | explicit no-action decision - Agent Observability Traces, Stage Capability Scope, Token-Cost Failsafe, and Evidence Freshness SLOs remain separate queued gaps |
| agent-scope fit | Codex PM owned routing, review repair disposition, landing readiness, and closeout; Claude owned Stage 3 implementation only; CodeRabbit and Local Qwen owned Stage 4 review evidence; Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains for BANDIT-052 |
| tool-use rule pressure | Stage 6 still requires synchronization across generated retrospective evidence, `.bandit/bootstrap-gaps.json`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`; the artifact-create path covers the retrospective but not gap-ledger or roadmap edits. | explicit no-action decision - keep Stage 6 closeout as the current single step and update all source artifacts before creating BANDIT-053 |
| reviewer/model routing | CodeRabbit passed with no findings after focused retry and context repair. Local Qwen passed with no findings. No recorded smell trigger required escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains for BANDIT-052 |
| tool invocation friction | The established invocation paths for pre-PR CodeRabbit, Local Qwen, review-subject hash, risk classification, supply-chain gate, event-driven wake scheduler validation, land-check, auto-land-check, local landing, artifact creation, validation, gaps list, cockpit status, session context, and diff hygiene were available. | explicit no-action decision - no new bootstrap gap is recorded for tool invocation friction |
| recurring inefficiency | The event-driven wake scheduler policy is intended to prevent repeated no-op LLM polling for ordinary work discovery once wake triggers and deterministic sweeping are proven reliable. | explicit no-action decision - no duplicate Event-Driven Wake Scheduler gap remains |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, benchmark spend, live external service, dependency install, or live SCA provider was introduced. Recoverable CodeRabbit rate limits did create latency during Stage 4. | durable follow-up candidate - queued BANDIT-GAP-TOKEN-COST-FAILSAFE should cover abnormal-run retry budgets, provider wait windows, and continuation decisions for long-running or rate-limited gates |
| unresolved uncertainty | No uncertainty remains for the policy validation surface after focused tests, implementation evidence, review evidence, landing verdict, local-record landing action, and closeout. Runtime scheduler execution and trace observability remain future queued work. | explicit no-action decision - next uncertainty belongs to the queued Agent Observability Traces gap and later scheduler execution scope, not BANDIT-052 |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this closeout.

The recoverable CodeRabbit provider rate-limit lesson is recorded in `docs/work/BANDIT-052/api-failure-recovery-retrospective-input.md` and routed as a durable follow-up candidate for `BANDIT-GAP-TOKEN-COST-FAILSAFE`, where retry budgets, abnormal-run failsafes, provider wait windows, and continuation decisions belong.

`BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` is resolved by `BANDIT-052`. The next queued bootstrap gap is `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES`; full scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work remains blocked until queued bootstrap gaps are resolved or explicitly dispositioned.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-052`. Focused pre-PR CodeRabbit review passed with no findings after a valid context-drift repair and provider-rate-limit recovery, Local Qwen passed with no findings, and Codex PM accepted Stage 4 landability without requiring escalated review.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` remains queued behind agent observability traces.
- `BANDIT-GAP-TOKEN-COST-FAILSAFE` remains queued behind stage capability scope.
- `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` remains queued behind token-cost failsafe evidence.
- Unrelated Phase 8 cockpit work remains blocked while any open bootstrap gap remains queued or active.
