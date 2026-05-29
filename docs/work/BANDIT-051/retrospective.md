# BANDIT-051 Retrospective

## Outcome

`BANDIT-051` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`. The work defines the runnable environment contract for Bandit-created worktrees before worker execution may treat a claim-owned worktree as runnable. The implementation keeps the contract repo-native and CLI-owned, validates allowed copied or linked files, setup commands, validation commands, environment-variable references, secret-handling boundaries, expected runtime dependencies, and bootstrap failure evidence, and refuses worker execution until bootstrap validation passes. Stage 4 scoped pre-PR CodeRabbit passed, Local Qwen returned `non_blocking` hardening findings that Codex PM dispositioned to durable candidates, Stage 5 landing verdict and local-record landing action evidence are recorded, and no scheduler execution, full worktree lifecycle implementation, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, paid reviewer route, dependency or lockfile change, installed global skill edit, external service integration, or unrelated Phase 8 work was introduced.

## What Worked

- The worktree bootstrap contract stayed as an explicit repo-native artifact and CLI validation surface instead of treating a locked or claimed worktree as automatically runnable.
- Focused RED and implementation evidence covered setup command shape, validation command shape, environment references, secret-handling boundaries, runtime dependencies, bootstrap failure evidence, and worker-execution refusal before validation passes.
- Stage 3 implementation preserved the Bootstrap Model-Family Separation and Test Ownership Boundary while keeping scheduler execution, full lifecycle work, claim leases, and cockpit UI/server/API work out of scope.
- Stage 4 review handled Local Qwen non-blocking hardening findings through Codex PM disposition without reopening implementation after CodeRabbit passed and the findings were safe to route as future candidates.
- The local-record landing path used existing review-subject hash, layered risk-classification, supply-chain gate, land-check, and Landing Agent evidence without expanding workflow authority.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| A claim-owned and locked worktree is not necessarily runnable until bootstrap validation proves its environment contract. | bootstrap_gap_resolved | `BANDIT-051` adds the Worktree Bootstrap Contract command surface, validation behavior, evidence artifacts, review evidence, Stage 5 landing verdict, local-record landing action, and Stage 6 closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` resolved during closeout. |
| Secret-handling and environment references must be contract fields, not implicit worker assumptions. | explicit no-action decision | The implemented contract validates environment references and secret-handling boundaries while keeping actual secret copying or operator-supervised authorization out of scope. |
| Review hardening around runtime dependency validation remains useful but does not block the current contract from landing. | durable follow-up candidate | `docs/work/BANDIT-051/qwen-finding-disposition.md` records the environment/runtime dependency validation finding as durable future hardening rather than reopening this landed chore. |
| Markdown template parsing should be hardened after the contract path stabilizes. | durable follow-up candidate | `docs/work/BANDIT-051/qwen-finding-disposition.md` records the markdown template parsing finding as a future hardening candidate. |
| Future evidence freshness handling should become more explicit for worktree bootstrap artifacts. | durable follow-up candidate | `docs/work/BANDIT-051/qwen-finding-disposition.md` records the future evidence freshness finding as durable follow-up candidate; broader Evidence Freshness SLO work remains queued separately. |
| A validated worktree bootstrap contract still does not provide event-driven scheduling or wake guarantees. | queued_bootstrap_gap | `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` remains queued behind this closeout and must define event-driven work triggers, deterministic sweeper behavior, wake-guarantee tests, and token-cost failsafes before scheduler execution changes. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | The source gap was a policy and execution risk rather than a failed command: Bandit-created worktrees could be correctly claimed and locked without a proven runnable environment contract. `BANDIT-051` adds the contract and Stage 6 verification reruns validation and cockpit status. | bootstrap gap resolved - BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT |
| overreasoning | The work stayed bounded to worktree bootstrap contract validation, evidence, review disposition, landing evidence, retrospective closeout, bootstrap-gap disposition, and roadmap/current-context synchronization. | explicit no-action decision - no scheduler execution, full worktree lifecycle, claim lease creation or release, work-surface reservation, cockpit UI/server/API, PR/CI workflow, merge, push, deploy, product UAT, paid-reviewer route, external service, dependency, lockfile, installed-skill, or unrelated Phase 8 work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: define and validate the runnable environment contract before enabling scheduler execution or broader worktree lifecycle behavior. | explicit no-action decision - Event-Driven Wake Scheduler, Agent Observability Traces, Stage Capability Scope, Token-Cost Failsafe, and Evidence Freshness SLOs remain separate queued gaps |
| agent-scope fit | Codex PM owned routing, review disposition, landing readiness, and closeout; Claude owned Stage 3 implementation only; CodeRabbit and Local Qwen owned Stage 4 review evidence; Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains for BANDIT-051 |
| tool-use rule pressure | Stage 6 still requires synchronization across generated retrospective evidence, `.bandit/bootstrap-gaps.json`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`; the artifact-create path covers the retrospective but not gap-ledger or roadmap edits. | explicit no-action decision - keep Stage 6 closeout as the current single step and update all source artifacts before creating BANDIT-052 |
| reviewer/model routing | CodeRabbit passed with no findings. Local Qwen returned non-blocking hardening findings, and Codex PM accepted and routed the real findings to durable candidates. No recorded smell trigger required escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains for BANDIT-051 |
| tool invocation friction | The established invocation paths for pre-PR CodeRabbit, Local Qwen, review-subject hash, risk classification, supply-chain gate, land-check, local landing, artifact creation, validation, gaps list, cockpit status, and diff hygiene were available. | explicit no-action decision - no new bootstrap gap is recorded for tool invocation friction |
| recurring inefficiency | The worktree bootstrap contract should prevent repeated downstream worker failures caused by treating a claimed worktree as runnable before setup and validation evidence exists. | explicit no-action decision - no duplicate Worktree Bootstrap Contract gap remains |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, benchmark spend, live external service, dependency install, or live SCA provider was introduced. | explicit no-action decision - no cost or paid-routing follow-up is required for BANDIT-051 |
| unresolved uncertainty | No uncertainty remains for the worktree bootstrap contract after focused tests, implementation evidence, review evidence, PM finding disposition, landing verdict, local-record landing action, and closeout. | explicit no-action decision - next uncertainty belongs to the queued Event-Driven Wake Scheduler gap, not BANDIT-051 |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The accepted Local Qwen hardening findings remain durable follow-up candidates in `docs/work/BANDIT-051/qwen-finding-disposition.md`: environment/runtime dependency validation, markdown template parsing, and future evidence freshness handling.

`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is resolved by `BANDIT-051`. The next queued bootstrap gap is `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER`; scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work remains blocked until the queued bootstrap gaps are resolved or explicitly dispositioned.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-051`. Focused pre-PR CodeRabbit review passed with no findings, Local Qwen returned `non_blocking` hardening findings, and Codex PM accepted/routed those findings without disputing the implementation's Stage 4 landability.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` remains queued behind the event-driven wake scheduler gap.
- `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` remains queued behind agent observability traces.
- `BANDIT-GAP-TOKEN-COST-FAILSAFE` remains queued behind stage capability scope.
- `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` remains queued behind token-cost fail-safe evidence.
- Unrelated Phase 8 cockpit work remains blocked while any open bootstrap gap remains queued or active.
