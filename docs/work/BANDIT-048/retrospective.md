# BANDIT-048 Retrospective

## Outcome

`BANDIT-048` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-FOCUSED-SESSION-CONTEXT`. The work adds a repo-native Focused Session Context Packet through `bandit session-context current --json|--markdown`, `src/state/focused-session-context.ts`, `src/commands/session-context.ts`, `src/cli.ts`, `docs/templates/focused-session-context.md`, and `docs/evaluation/skills/bandit-cold-start.md`. The packet is derived on demand from existing authoritative repo artifacts, marks itself `derived_non_canonical`, reports the current phase, active work item, active bootstrap gap, current stage, exact next action, required operator input, blockers, source hierarchy, required evidence, and deep-read pointers, and avoids creating a hand-maintained context packet file. Stage 4 pre-PR CodeRabbit timed out twice and is recorded as provider-refusal/bootstrap_gap replacement evidence rather than pass evidence; Local Qwen returned three non-blocking hardening findings and Codex PM disposition routed each to durable follow-up candidates. Stage 5 landing verdict, explicit risk-classification and supply-chain evidence, local-record landing action, and Stage 6 closeout evidence are recorded, and no Worktree Bootstrap Contract implementation, scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, product UAT scope, live routing change, paid reviewer route, dependency or lockfile change, installed global skill edit, external service integration, automatic merge/push/deploy behavior, or unrelated Phase 8 work was introduced.

## What Worked

- The focused packet stayed a projection over existing repo artifacts instead of becoming a new source of truth, which preserves AGENTS.md, CURRENT_CONTEXT.md, ROADMAP.md, .bandit/bootstrap-gaps.json, CLEAN_CODE.md, and STAGE_RUBRICS.md as authority.
- The Stage 2 RED tests and Claude Writer route kept the scope narrow: packet generation, JSON and Markdown rendering, source hierarchy, next-action recovery, required operator input, and missing-source refusal were all testable without starting cockpit UI, scheduler, worktree, or PR/CI work.
- Stage 4 handled provider friction honestly: CodeRabbit timeout evidence is recorded as bootstrap_gap replacement evidence, while Local Qwen completed and its real non-blocking findings have concrete PM rationale and durable follow-up candidates.
- The local-record landing path used existing layered risk-classification, supply-chain gate, input-quarantine, operator-boundary, coordination-authority, land-check, auto-land-check, and Landing Agent evidence without expanding workflow authority.
- The new session-context command gives future cold starts a compact first inspection surface while still pointing to deeper source artifacts for policy-sensitive decisions.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Bandit cold starts need a compact current-session packet before agents read long historical roadmap and glossary surfaces. | bootstrap_gap_resolved | `BANDIT-048` adds the Focused Session Context Packet model, command, Markdown rendering path, source hierarchy, deep-read pointers, focused tests, cold-start evaluation update, Stage 4 review evidence, Stage 5 landing verdict, local-record landing action, and retrospective closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-FOCUSED-SESSION-CONTEXT` resolved during closeout. |
| Focused session packets must remain non-canonical and source-linked, not a replacement for AGENTS.md, CURRENT_CONTEXT.md, ROADMAP.md, or the bootstrap-gap ledger. | explicit no-action decision | The implementation emits `authority: derived_non_canonical`, derives the packet on demand, and records source pointers. No new packet store, hidden index authority, cockpit state authority, or hand-maintained context file is introduced. |
| Stale or missing evidence notes, structured forbidden-action extraction, and explicit AGENTS.md authority summaries are useful hardening before focused packets become worker, reviewer, or cockpit trust inputs. | queued follow-up candidates | `docs/work/BANDIT-048/qwen-finding-disposition.md` records `BANDIT-048-SESSION-CONTEXT-EVIDENCE-NOTES`, `BANDIT-048-STRUCTURED-FORBIDDEN-ACTIONS`, and `BANDIT-048-AGENTS-AUTHORITY-SUMMARY` as durable candidates with source artifacts, hypotheses, metrics, baselines, expected direction, evaluation windows, and pending outcomes. |
| Focused session context must recover the interstitial state after a work item is closed but before the next work item is created. | queued_bootstrap_gap | Stage 6 verification found that `bandit session-context current --json` fails with no active bootstrap gap linked to the closed `BANDIT-048` work item. `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` is recorded so the command can report the last closed work item and next queued gap without inventing active work or making the packet canonical. |
| A focused context packet reduces cold-start context pressure but does not make a claim-owned worktree runnable. | queued_bootstrap_gap | `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` remains queued behind session-context interstitial recovery. It should become the next work item before scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Two scoped pre-PR CodeRabbit provider attempts timed out without a terminal reviewer verdict even though CLI and auth setup were valid. | explicit no-action decision - CodeRabbit timeout behavior is already recorded in docs/work/BANDIT-048/coderabbit-review.md, docs/specs/BANDIT-048-coderabbit-review-output.json, and docs/work/BANDIT-048/coderabbit-timeout-disposition.md as provider-refusal/bootstrap_gap evidence; no CodeRabbit pass is claimed |
| overreasoning | The work stayed bounded to focused session context projection, command routing, Markdown rendering, cold-start evaluation support, focused tests, review evidence, landing evidence, and closeout. | explicit no-action decision - no Worktree Bootstrap Contract behavior, scheduler, event-driven wakeup, worktree lifecycle, cockpit UI/server/API, state index, PR/CI workflow, merge, push, deploy, live routing, paid-reviewer route, external service, dependency, lockfile, installed-skill, or unrelated Phase 8 work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: create RED evidence for current-session packet recovery, run Claude Stage 3 implementation through the Process Adapter boundary, collect timeout and Qwen review evidence, land locally, then close out Stage 6. | explicit no-action decision - Worktree Bootstrap Contract, scheduler, observability traces, stage capability scope, token-cost failsafes, and evidence freshness SLOs remain separate queued gaps |
| agent-scope fit | Codex PM owned routing and RED evidence, Claude owned Stage 3 implementation only, CodeRabbit and Local Qwen owned Stage 4 review evidence, Codex PM owned timeout and finding disposition, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains for BANDIT-048 |
| tool-use rule pressure | Stage 6 still requires manual synchronization across generated retrospective evidence, `.bandit/bootstrap-gaps.json`, `CURRENT_CONTEXT.md`, and `ROADMAP.md`, but the established artifact-create, validate, gaps list, land-check, auto-land-check, cockpit status, and diff-hygiene commands cover the closeout. | explicit no-action decision - existing Stage 6 bookkeeping paths are sufficient for this closeout |
| reviewer/model routing | CodeRabbit was invoked through the approved scoped pre-PR path but timed out twice; Local Qwen completed with non-blocking hardening findings; no recorded smell trigger required escalated reviewer routing. | explicit no-action decision - unresolved CodeRabbit provider availability is recorded as bootstrap_gap replacement evidence for this item, and Local Qwen findings are durably routed as follow-up candidates rather than blocking landing |
| tool invocation friction | The work used established commands for artifact creation, focused tests, CodeRabbit pre-PR review, Local Qwen review, review-subject hash, risk classification, supply-chain gate, input quarantine, operator boundary, coordination authority, land-check, auto-land-check, local land, validation, gaps list, cockpit status, and diff hygiene. | explicit no-action decision - no new invocation-friction bootstrap gap is needed beyond the recorded CodeRabbit provider-timeout disposition |
| recurring inefficiency | The focused packet directly addresses the recurring cold-start inefficiency caused by long historical roadmap/current-context surfaces, but manual roadmap/current-context closeout remains expected Stage 6 work. | bootstrap_gap_resolved - BANDIT-GAP-FOCUSED-SESSION-CONTEXT is resolved by the session-context command and cold-start evaluation update; Stage 6 bookkeeping remains the current supported boundary |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, benchmark spend, live external service, dependency install, or live SCA provider was introduced. CodeRabbit timeout latency is recorded as provider-refusal evidence for this work item. | explicit no-action decision - no cost or paid-routing follow-up is required for BANDIT-048 |
| unresolved uncertainty | The focused-session-context gap is resolved for active work sessions, but Stage 6 verification found the command does not yet recover the valid interstitial state after a work item is closed and before the next work item is created. | queued bootstrap gap - BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is resolved by `BANDIT-048`. The three Local Qwen hardening candidates remain recorded in `docs/work/BANDIT-048/qwen-finding-disposition.md`: `BANDIT-048-SESSION-CONTEXT-EVIDENCE-NOTES`, `BANDIT-048-STRUCTURED-FORBIDDEN-ACTIONS`, and `BANDIT-048-AGENTS-AUTHORITY-SUMMARY`. They are candidates, not active work items.

Stage 6 verification records a new bootstrap gap, `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY`, because the focused packet command fails when the last work item is closed and the next work item has not yet been created. That gap should become the next work item before Worktree Bootstrap Contract work.

`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` remains queued behind session-context interstitial recovery and should still precede scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-048`. CodeRabbit produced no terminal reviewer verdict and is honestly recorded as provider-timeout/bootstrap_gap evidence rather than pass evidence. Local Qwen accepted the implementation with non-blocking hardening findings, and Codex PM disposition routes those findings to durable follow-up candidates without source repair for this work item.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` is open and is now the next queued bootstrap-gap chore.
- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` remains queued behind session-context interstitial recovery.
- `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` remains queued behind the worktree bootstrap contract.
- `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` remains queued behind the event-driven wake scheduler gap.
- `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` remains queued behind agent observability traces.
- `BANDIT-GAP-TOKEN-COST-FAILSAFE` remains queued behind stage capability scope.
- `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` remains queued behind token-cost failsafe.
- Unrelated Phase 8 cockpit work remains blocked while any open bootstrap gap remains queued or active.

## Bootstrap-Gap Disposition

`BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is resolved.

The resolution evidence is:

- `docs/specs/BANDIT-GAP-FOCUSED-SESSION-CONTEXT.json`
- `docs/work/BANDIT-048/brief.md`
- `docs/specs/BANDIT-048-red-evidence.json`
- `docs/work/BANDIT-048/red-evidence.md`
- `test/focused-session-context.test.mjs`
- `docs/work/BANDIT-048/dispatch.md`
- `docs/work/BANDIT-048/writer-report.md`
- `docs/specs/BANDIT-048-implementation-evidence.json`
- `docs/work/BANDIT-048/implementation-evidence.md`
- `src/state/focused-session-context.ts`
- `src/commands/session-context.ts`
- `src/cli.ts`
- `docs/templates/focused-session-context.md`
- `docs/evaluation/skills/bandit-cold-start.md`
- `docs/work/BANDIT-048/coderabbit-review.md`
- `docs/specs/BANDIT-048-coderabbit-review-output.json`
- `docs/work/BANDIT-048/coderabbit-timeout-disposition.md`
- `docs/work/BANDIT-048/local-qwen-review.md`
- `docs/work/BANDIT-048/qwen-finding-disposition.md`
- `docs/work/BANDIT-048/review-evidence.md`
- `.bandit/policy/risk-classifications/BANDIT-048-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-048-supply-chain-gate.json`
- `docs/specs/BANDIT-048-landing-verdict.json`
- `docs/work/BANDIT-048/landing-verdict.md`
- `docs/work/BANDIT-048/landing-action.md`
- `docs/specs/BANDIT-048-retrospective.json`
- `docs/work/BANDIT-048/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` is open and is now the next
queued bootstrap-gap chore. The next Bandit step is to create exactly one work
item for that gap; do not start Worktree Bootstrap Contract work, scheduler
execution, full worktree lifecycle enablement, cockpit UI/server/API work,
PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or
unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-048`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, queued follow-up candidates, queued bootstrap gap, or explicit
  no-action decisions, including the newly recorded session-context
  interstitial-recovery gap.
- Improvement disposition: `pass` - no new retrospective-derived improvement
  chore is created by this closeout; Local Qwen hardening candidates remain
  durably routed in `docs/work/BANDIT-048/qwen-finding-disposition.md`.
- Bootstrap-gap disposition: `pass` - `BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is
  marked resolved in `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-048` has no
  `docs/work/BANDIT-048/coordination-log.jsonl`, and this closeout does not add
  coordination state.
