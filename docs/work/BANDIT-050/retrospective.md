# BANDIT-050 Retrospective

## Outcome

`BANDIT-050` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY`. The work repairs `bandit cockpit status --json` in the valid interstitial state after a work item has landed and before the next bootstrap-gap work item is created. The implementation keeps cockpit status `derived_non_canonical`, reports the last closed work item separately from active work, keeps the next queued bootstrap gap and exact next action sourced from repo artifacts, preserves CLI authority, and avoids creating a false active work item. Stage 4 scoped pre-PR CodeRabbit passed, Local Qwen returned `non_blocking` evidence-hardening findings that Codex PM dispositioned to durable candidates or closed evidence refreshes, Stage 5 landing verdict and local-record landing action evidence are recorded, and no Worktree Bootstrap Contract implementation, scheduler execution, worktree lifecycle implementation, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, paid reviewer route, dependency or lockfile change, installed global skill edit, external service integration, or unrelated Phase 8 work was introduced.

## What Worked

- The cockpit status repair stayed a projection over existing roadmap, gap-ledger, and work-item artifacts instead of adding a new canonical cockpit state store.
- Focused RED and implementation evidence covered the interstitial state, last-closed-work separation, next queued gap selection, exact next action, operator-input status, forbidden actions, and source hierarchy.
- Stage 3 implementation stayed inside the cockpit-status command/state surface while preserving the Bootstrap Model-Family Separation and Test Ownership Boundary.
- Stage 4 review handled Qwen evidence-hardening findings without reopening implementation after CodeRabbit passed and the accepted findings were safe to route as future candidates.
- The local-record landing path used existing review-subject hash, layered risk-classification, supply-chain gate, input-quarantine, operator-boundary, coordination-authority, auto-land-check, land-check, and Landing Agent evidence without expanding workflow authority.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Cockpit status must recover the interstitial state after a closed work item and before the next bootstrap-gap work item exists. | bootstrap_gap_resolved | `BANDIT-050` adds focused cockpit-status tests, implementation repair, review evidence, Stage 5 landing verdict, local-record landing action, and Stage 6 closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` resolved during closeout. |
| Derived status surfaces must distinguish last closed work from active runnable work. | explicit no-action decision | The implemented cockpit status output reports `BANDIT-050` only while it remains active, supports the valid interstitial recovery path, and does not require a false active work item to satisfy the parser. |
| Review evidence should include normalized source diffs and command output rather than relying on truncated summaries. | durable follow-up candidate | `docs/work/BANDIT-050/qwen-finding-disposition.md` records `BANDIT-050-SOURCE-DIFF-NORMALIZATION` and `BANDIT-050-STAGE4-VERIFY-MATRIX` as future review-evidence hardening candidates. |
| Clean-code read evidence should become less prose-dependent in future Stage 1 and Stage 5 artifacts. | durable follow-up candidate | `docs/work/BANDIT-050/qwen-finding-disposition.md` records `BANDIT-050-CLEAN-CODE-READ-EVIDENCE`; `BANDIT-050` itself remains landable because the brief records the Stage 1 read and Stage 5 clean-code closure reread `CLEAN_CODE.md`. |
| Cockpit-status RED assertion wording should track the canonical fail-closed message when interstitial parser contracts evolve. | durable follow-up candidate | `docs/work/BANDIT-050/qwen-finding-disposition.md` records `BANDIT-050-COCKPIT-STATUS-ASSERT-CLAIM` for future acceptance-mapping hardening. |
| Interstitial status recovery still does not make a Bandit-created worktree runnable. | queued_bootstrap_gap | `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` remains queued behind cockpit-status interstitial recovery and must define runnable-worktree policy before scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | The source gap was `node ./bin/bandit.mjs cockpit status --json` failing in the valid no-active-work interstitial state after `BANDIT-049`; `BANDIT-050` repairs that path and Stage 6 verification reruns cockpit status. | bootstrap gap resolved - BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY |
| overreasoning | The work stayed bounded to cockpit-status interstitial recovery, focused tests, review evidence, landing evidence, retrospective closeout, bootstrap-gap disposition, and roadmap/current-context synchronization. | explicit no-action decision - no Worktree Bootstrap Contract behavior, scheduler, worktree lifecycle, cockpit UI/server/API, PR/CI workflow, merge, push, deploy, product UAT, paid-reviewer route, external service, dependency, lockfile, installed-skill, or unrelated Phase 8 work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: repair one derived cockpit-status recovery failure after session-context recovery landed, then close out before creating the next work item. | explicit no-action decision - Worktree Bootstrap Contract, event-driven wake scheduler, observability traces, stage capability scope, token-cost failsafes, and evidence freshness SLOs remain separate queued gaps |
| agent-scope fit | Codex PM owned routing, RED evidence, review disposition, landing readiness, and closeout; Claude owned Stage 3 implementation only; CodeRabbit and Local Qwen owned Stage 4 review evidence; Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains for BANDIT-050 |
| tool-use rule pressure | Stage 6 still requires synchronization across generated retrospective evidence, `.bandit/bootstrap-gaps.json`, `CURRENT_CONTEXT.md`, and `ROADMAP.md`; the artifact-create path covers the retrospective but not gap-ledger or roadmap edits. | explicit no-action decision - keep Stage 6 closeout as the current single step and update all source artifacts before creating the next work item |
| reviewer/model routing | CodeRabbit passed with no findings. Local Qwen returned non-blocking evidence-hardening findings, and Codex PM accepted and routed the real findings to durable candidates or closed-by-evidence-refresh decisions. No recorded smell trigger required escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains for BANDIT-050 |
| tool invocation friction | The established invocation paths for pre-PR CodeRabbit, Local Qwen, review-subject hash, risk classification, supply-chain gate, input quarantine, operator boundary, coordination authority, land-check, local landing, artifact creation, validation, gaps list, session-context, cockpit status, and diff hygiene were available. | explicit no-action decision - no new bootstrap gap is recorded for tool invocation friction |
| recurring inefficiency | The repaired cockpit status surface reduces repeated cold-start scanning when the repo is between closed work and the next active work item, complementing the prior session-context recovery repair. | explicit no-action decision - no duplicate session-context or cockpit-status interstitial gap remains |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, benchmark spend, live external service, dependency install, or live SCA provider was introduced. | explicit no-action decision - no cost or paid-routing follow-up is required for BANDIT-050 |
| unresolved uncertainty | No uncertainty remains for cockpit-status interstitial recovery after focused tests, implementation evidence, review evidence, PM finding disposition, landing verdict, local-record landing action, and closeout. | explicit no-action decision - next uncertainty belongs to the queued Worktree Bootstrap Contract gap, not BANDIT-050 |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The accepted Local Qwen hardening findings remain durable follow-up candidates in `docs/work/BANDIT-050/qwen-finding-disposition.md`: `BANDIT-050-SOURCE-DIFF-NORMALIZATION`, `BANDIT-050-STAGE4-VERIFY-MATRIX`, `BANDIT-050-CLEAN-CODE-READ-EVIDENCE`, and `BANDIT-050-COCKPIT-STATUS-ASSERT-CLAIM`.

`BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` is resolved by `BANDIT-050`. The next queued bootstrap gap is `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`; `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` remains queued behind the worktree bootstrap contract before scheduler execution, full worktree lifecycle enablement, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, or unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-050`. Focused pre-PR CodeRabbit review passed with no findings, Local Qwen returned `non_blocking` evidence-hardening findings, and Codex PM accepted/routed those findings without disputing the implementation's Stage 4 landability.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` remains queued behind the worktree bootstrap contract.
- `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` remains queued behind the event-driven wake scheduler gap.
- `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` remains queued behind agent observability traces.
- `BANDIT-GAP-TOKEN-COST-FAILSAFE` remains queued behind stage capability scope.
- `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` remains queued behind token-cost fail-safe evidence.
- Unrelated Phase 8 cockpit work remains blocked while any open bootstrap gap remains queued or active.

## Bootstrap-Gap Disposition

`BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` is resolved.

The resolution evidence is:

- `docs/specs/BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY.json`
- `docs/work/BANDIT-050/brief.md`
- `docs/specs/BANDIT-050-red-evidence.json`
- `docs/work/BANDIT-050/red-evidence.md`
- `test/cockpit-status.test.mjs`
- `docs/specs/BANDIT-050-implementation-evidence.json`
- `docs/work/BANDIT-050/implementation-evidence.md`
- `src/state/cockpit-status.ts`
- `src/commands/cockpit.ts`
- `docs/work/BANDIT-050/coderabbit-review.md`
- `docs/specs/BANDIT-050-coderabbit-review-output.json`
- `docs/work/BANDIT-050/local-qwen-review.md`
- `docs/work/BANDIT-050/qwen-finding-disposition.md`
- `docs/work/BANDIT-050/review-evidence.md`
- `.bandit/policy/risk-classifications/BANDIT-050-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-050-supply-chain-gate.json`
- `docs/work/BANDIT-050/landing-verdict.md`
- `docs/work/BANDIT-050/landing-action.md`
- `docs/specs/BANDIT-050-retrospective.json`
- `docs/work/BANDIT-050/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is open and is now the next queued
bootstrap-gap chore. The next Bandit step is to create exactly one work item
for that gap; do not start Worktree Bootstrap Contract RED evidence,
implementation, scheduler execution, full worktree lifecycle enablement,
cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy
behavior, product UAT scope, or unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-050`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, durable follow-up candidates, queued bootstrap gap, or explicit
  no-action decisions.
- Improvement disposition: `pass` - no new retrospective-derived improvement
  chore is created by this closeout; Local Qwen hardening candidates remain
  durably routed in `docs/work/BANDIT-050/qwen-finding-disposition.md`.
- Bootstrap-gap disposition: `pass` -
  `BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` is marked resolved in
  `.bandit/bootstrap-gaps.json`, and `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`
  is recorded as the next queued bootstrap gap.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Cockpit status interstitial check: `pass` - `node ./bin/bandit.mjs cockpit
  status --json` reports no active work item, last closed `BANDIT-050`, and
  next queued bootstrap gap `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`.
- Session-context interstitial check: `pass` - `node ./bin/bandit.mjs
  session-context current --json` reports no active work item, last closed
  `BANDIT-050`, and next queued bootstrap gap
  `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`.
- Coordination closeout: `not_applicable` - `BANDIT-050` has no
  `docs/work/BANDIT-050/coordination-log.jsonl`, and this closeout does not add
  coordination state.
