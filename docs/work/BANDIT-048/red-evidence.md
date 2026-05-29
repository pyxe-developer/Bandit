# BANDIT-048 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Focused Session Context Packet contract before production implementation. They fail because Bandit has no session-context command, no focused packet data model, no Markdown rendering path, no fail-closed source-artifact validation for the packet, and the cold-start evaluation packet has not yet been updated to exercise focused session context recovery.

## Test Command

```sh
node --test test/focused-session-context.test.mjs
```

## Observed Output

```text
tests 7
pass 0
fail 7
session-context current --json emits a focused non-canonical packet with source links failed: Unknown command: session-context
session-context current --markdown renders from the same focused packet model failed: Unknown command: session-context
session-context keeps historical roadmap narrative behind deep-read pointers failed: Unknown command: session-context
missing AGENTS authority source failed: expected Missing session context source artifact: AGENTS.md, received Unknown command: session-context
CURRENT_CONTEXT and ROADMAP next-action disagreement failed: expected Session context blocked disagreement diagnostic, received Unknown command: session-context
cold-start evaluation packet exercises focused session context recovery failed: missing Focused Session Context Packet references
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The focused session context command emits a structured JSON packet with current phase, active Work Item or bootstrap gap, current stage, exact next action, required operator input, blockers, allowed actions, forbidden actions, required evidence paths, source artifacts, source hierarchy, and stale or missing evidence notes when available. | test/focused-session-context.test.mjs runs bandit session-context current --json against a repo fixture for BANDIT-048 and expects a focused_session_context_packet with derived_non_canonical authority, current phase, active work item, active bootstrap gap, Stage 2 status, exact next action, required operator input, blockers, allowed/forbidden actions, required evidence paths, source artifacts, source hierarchy, and empty stale_or_missing_evidence for the healthy fixture. |
| The command supports optional Markdown rendering from the same data model without introducing a hand-maintained packet file or hidden source of truth. | The Markdown test runs bandit session-context current --json and bandit session-context current --markdown, then expects Markdown to render the same active work, authority, source paths, and RED evidence path while the JSON test verifies .bandit/session-context/current.json and docs/session-context/current.md are not created. |
| The packet identifies AGENTS.md, CLEAN_CODE.md, CURRENT_CONTEXT.md, ROADMAP.md, STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json, and smell-trigger policy sources explicitly where their authority affects the current activation. | The JSON packet test asserts source_artifacts includes AGENTS.md, CLEAN_CODE.md, docs/roadmap/CURRENT_CONTEXT.md, docs/roadmap/ROADMAP.md, docs/verification/STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json, .bandit/policy/smell-triggers.json, and docs/evaluation/skills/bandit-cold-start.md. |
| The packet keeps historical roadmap narrative, old closeout details, full glossary text, and deep source material behind pointers unless the current task requires a deep read. | The deep-read pointer test seeds OLD-CLOSEOUT-DETAIL-SHOULD-STAY-BEHIND-POINTER into CURRENT_CONTEXT.md and expects the JSON packet and Markdown rendering not to replay it while deep_read_pointers include CONTEXT.md, CURRENT_CONTEXT.md, and ROADMAP.md with reasons for historical roadmap narrative, full glossary text, or old closeout details. |
| Focused tests prove a session can recover the current next action, operator-input status, active Work Item or gap, and forbidden next-work boundaries from the packet without scanning full historical roadmap narrative. | The JSON packet test asserts exact_next_action equals the BANDIT-048 Stage 2 next action, required_operator_input is none_required, active_work_item is BANDIT-048, active_bootstrap_gap is BANDIT-GAP-FOCUSED-SESSION-CONTEXT, and forbidden_actions name Stage 3 implementation, Worktree Bootstrap Contract, and cockpit UI/server/API boundaries. |
| Focused tests prove the packet is derived from repo artifacts, marks itself derived_non_canonical, and refuses or reports blocker state when required current-state artifacts are missing or contradictory. | The fail-closed test deletes AGENTS.md and separately creates CURRENT_CONTEXT.md / ROADMAP.md next-action disagreement, then expects bandit session-context current --json to fail closed with source-specific diagnostics instead of emitting an optimistic packet. |
| The cold-start evaluation packet at docs/evaluation/skills/bandit-cold-start.md is updated to exercise the Focused Session Context Packet while preserving required authority checks and source-pointer deep reads. | The evaluation-packet test reads docs/evaluation/skills/bandit-cold-start.md and expects it to mention Focused Session Context Packet, bandit session-context current --json, source-pointer deep reads, and recovering the next action without reading full roadmap history. |
| If the implementation updates CURRENT_CONTEXT.md or ROADMAP.md structure, those files continue to answer the current phase, active work, next action, blockers, bootstrap gaps, and operator-input status for agents that have not yet adopted the new command. | The fixture keeps CURRENT_CONTEXT.md and ROADMAP.md as the packet source for phase, active work, next action, and operator-input status, and the tests require the command to report those source paths instead of replacing them with hidden packet authority. |
| Stage 2 RED evidence requires clear Test Writer ownership, model-family separation evidence, and zero Stage 3 Writer test-edit authority. | This RED evidence is Codex PM/Test Writer-authored; Stage 3 must be routed to Claude through the bootstrap Process Adapter path, and the Stage 3 Writer has no authority to edit test/focused-session-context.test.mjs, test helpers, fixtures, docs/work/BANDIT-048/red-evidence.md, docs/specs/BANDIT-048-red-evidence.json, or acceptance mappings. |
| No Worktree Bootstrap Contract implementation, scheduler execution, event-driven wakeup implementation, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim lease implementation, work surface reservation implementation, PR/CI workflow execution, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced. | This Stage 2 step adds only focused tests, the RED evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation, review evidence, landing evidence, retrospective, next-gap work, live routing, paid reviewer route, dependency or lockfile change, scheduler, claim/worktree authority, external service integration, installed global skill edit, or cockpit UI/server/API surface. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-048 to Claude through the bootstrap Process Adapter path: implement the narrow session-context current command, derive a focused non-canonical packet from repo artifacts, support --json and --markdown renderings from the same data model, preserve source hierarchy and deep-read pointers, fail closed for missing or contradictory current-state authority, update docs/evaluation/skills/bandit-cold-start.md, and keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence, acceptance mappings, Worktree Bootstrap Contract behavior, scheduler execution, cockpit UI/server/API work, local server/API mode, state-index persistence, PR/CI workflow, automatic merge/push/deploy behavior, product UAT, actor identity policy, claim leases, work surface reservations, live routing changes, paid reviewer routes, external services, installed global skills, dependency/lockfile changes, and unrelated Phase 8 work.
