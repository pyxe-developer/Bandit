# BANDIT-049 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Session Context Interstitial Recovery contract before production implementation. They fail because the current Focused Session Context Packet requires an active work item and active bootstrap gap, so it cannot recover the valid closed-work/no-active-gap state or validate CURRENT_CONTEXT.md and ROADMAP.md agreement for that interstitial state.

## Test Command

```sh
node --test test/focused-session-context.test.mjs
```

## Observed Output

```text
tests 9
pass 6
fail 3
session-context recovers closed-work/no-active-gap interstitial state failed: Session context blocked: CURRENT_CONTEXT.md is missing active work item
interstitial next-action disagreement failed: expected CURRENT_CONTEXT.md and ROADMAP.md disagreement diagnostic, received Session context blocked: CURRENT_CONTEXT.md is missing active work item
session-context fails closed for missing or contradictory current-state authority failed because the interstitial disagreement subtest returned the wrong fail-closed diagnostic
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves the current failure: bandit session-context current --json blocks in the closed-work-item/no-active-gap interstitial state instead of reporting the next queued bootstrap gap. | test/focused-session-context.test.mjs now includes a closed-work/no-active-gap fixture where BANDIT-048 is closed, BANDIT-GAP-FOCUSED-SESSION-CONTEXT is resolved, and BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY is queued without a linked work item. The current command exits 1 with Session context blocked: CURRENT_CONTEXT.md is missing active work item. |
| The packet distinguishes last closed work item from active work item and does not report a closed work item as runnable active work. | The interstitial RED test expects active_work_item and active_bootstrap_gap to be null while last_closed_work_item reports BANDIT-048 from docs/work/BANDIT-048/retrospective.md. |
| The packet reports the next queued bootstrap gap from .bandit/bootstrap-gaps.json, the exact next action from CURRENT_CONTEXT.md and ROADMAP.md, and none_required operator-input status when repo artifacts say no operator-owned input is required. | The interstitial RED test expects next_queued_bootstrap_gap to report BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY with status open and disposition queued_chore, exact_next_action from the context fixture, and required_operator_input none_required. |
| The packet reports forbidden actions that keep Worktree Bootstrap Contract work, scheduler execution, worktree lifecycle implementation, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, and unrelated Phase 8 work blocked until the interstitial-recovery brief and later gates allow them. | The interstitial current-context fixture records the forbidden unrelated work, and the RED test expects packet.forbidden_actions to include Worktree Bootstrap Contract work and unrelated Phase 8 work. |
| The packet source artifacts and source hierarchy identify AGENTS.md, CLEAN_CODE.md, CURRENT_CONTEXT.md, ROADMAP.md, STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json, smell-trigger policy, and the cold-start evaluation packet where their authority affects recovery. | The interstitial fixture writes the same source artifacts used by the existing focused-session-context tests, preserving the derived_non_canonical source hierarchy contract for future implementation. |
| The packet's required evidence paths for interstitial recovery point at the next work item's expected Stage 1 through Stage 6 evidence without requiring that work item to exist before creation. | The interstitial RED test expects required_evidence_paths to include docs/work/BANDIT-049/brief.md, docs/work/BANDIT-049/red-evidence.md, and docs/work/BANDIT-049/retrospective.md even though the fixture does not create BANDIT-049. |
| Missing or contradictory current-state artifacts still fail closed with clear blocker messages; interstitial recovery is accepted only when repo artifacts agree that the previous work is closed and the next queued gap is the correct next action. | The interstitial next-action disagreement subtest mutates ROADMAP.md to route Worktree Bootstrap Contract work and expects the command to fail closed with the CURRENT_CONTEXT.md and ROADMAP.md disagreement diagnostic. |
| The cold-start evaluation packet or focused tests cover the interstitial recovery path so future Bandit sessions can identify the next action without scanning full roadmap history. | The focused session-context test suite now covers the interstitial recovery path directly, while the existing cold-start evaluation packet test continues to require Focused Session Context Packet and source-pointer recovery language. |
| Stage 2 RED evidence requires clear Test Writer ownership, model-family separation evidence, and zero Stage 3 Writer test-edit authority. | This RED evidence is Codex PM/Test Writer-authored; Stage 3 must be routed to Claude through the bootstrap Process Adapter path, and the Stage 3 Writer has no authority to edit test/focused-session-context.test.mjs, test helpers, fixtures, docs/work/BANDIT-049/red-evidence.md, docs/specs/BANDIT-049-red-evidence.json, or acceptance mappings. |
| No Worktree Bootstrap Contract implementation, scheduler execution, event-driven wakeup implementation, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim lease implementation, work surface reservation implementation, PR/CI workflow execution, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced. | This Stage 2 step adds only focused tests, the RED evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation, review evidence, landing evidence, retrospective, next-gap work, live routing, paid reviewer route, dependency or lockfile change, scheduler, claim/worktree authority, external service integration, installed global skill edit, or cockpit UI/server/API surface. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-049 to Claude through the bootstrap Process Adapter path: implement the narrow interstitial recovery path for bandit session-context current --json, report null active work and active gap when the latest closed work is complete and the next queued bootstrap gap has no linked work item, report last_closed_work_item and next_queued_bootstrap_gap from repo artifacts, preserve derived_non_canonical authority, source hierarchy, required evidence paths, operator-input status, allowed actions, forbidden actions, and fail-closed disagreement diagnostics, and keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence, acceptance mappings, Worktree Bootstrap Contract behavior, scheduler execution, cockpit UI/server/API work, local server/API mode, state-index persistence, PR/CI workflow, automatic merge/push/deploy behavior, product UAT, actor identity policy, claim leases, work surface reservations, live routing changes, paid reviewer routes, external services, installed global skills, dependency/lockfile changes, and unrelated Phase 8 work.
