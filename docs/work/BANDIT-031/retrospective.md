# BANDIT-031 Retrospective

## Outcome

BANDIT-031 landed and closed out the first Phase 8 Workflow Cockpit status foundation as a read-only CLI-derived status payload. The slice kept repo-native artifacts as canonical authority, added source-linked cockpit status reporting, repaired the valid CodeRabbit hardcoded-source finding, accepted Local Qwen non-blocking breadth findings as future cockpit hardening, and introduced no visual UI, server mode, state index, scheduler, worktree lifecycle, claim lease, work surface reservation, automatic merge/push/deploy, product UAT approval, actor identity policy, PR/CI workflow, or unrelated feature work.

## What Worked

- Starting Phase 8 with a CLI-authoritative status payload kept the cockpit boundary concrete before visual UI or server choices.
- Pre-PR CodeRabbit found a real hardcoded improvement-candidate source issue, and the focused repair improved source discovery without widening the slice.
- Local Qwen's non-blocking findings identified the next useful cockpit-status expansion while preserving the current slice boundary.
- The status foundation exposes source paths and fail-closed checks, which gives future cockpit UI work a derived surface without hidden canonical state.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Cockpit status breadth should grow through structured gate, blocker, next-action, and stale-evidence summaries after the first read-only foundation lands. | improvement_chore | Durable candidate BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING is recorded in docs/work/BANDIT-031/qwen-finding-disposition.md with hypothesis, metric, baseline, expected direction, evaluation window, status, and source artifacts. |
| Hardcoded source paths in derived cockpit reports are brittle once improvement metadata can come from multiple disposition artifacts. | no_action | The valid CodeRabbit finding was repaired during Stage 4 with dynamic discovery across docs/work/*/*-finding-disposition.md artifacts and focused test coverage; no separate follow-up remains. |
| Visual UI, local server mode, state-index persistence, scheduler actions, worktree lifecycle, claim leases, work surface reservations, automatic remote actions, actor identity policy, and PR/CI workflow remain distinct future choices. | no_action | Those boundaries were preserved as explicit out-of-scope decisions in the brief, review evidence, landing verdict, and landing action; starting them now would violate the slice boundary. |

## Improvement Chores

### BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING

origin: Local Qwen non-blocking Stage 4 findings from BANDIT-031.
source_work_item: BANDIT-031
source_artifacts:
  - docs/work/BANDIT-031/local-qwen-review.md
  - docs/work/BANDIT-031/qwen-finding-disposition.md
lesson: Workflow cockpit status should expand beyond the first read-only foundation to summarize blocker, gate, next-action agreement, and stale evidence states from structured repo-native sources.
hypothesis: The cockpit will be more useful and less brittle if future status work replaces bounded Markdown heuristics with broader structured gate and blocker summaries while preserving CLI authority.
metric: Future Stage 4 reviews of cockpit status work do not repeat blocker breadth, gate breadth, next-action heuristic, or stale-marker findings.
baseline: BANDIT-031 provides the first read-only status payload with source links, fail-closed missing/contradictory source checks, and dynamic improvement-candidate source discovery, but keeps full gate and blocker breadth out of scope.
expected_direction: Cockpit status remains repo-native and fail-closed while reviewer findings about status breadth and brittle Markdown heuristics decrease.
evaluation_window: Evaluate when the next cockpit status, gate matrix, blocker summary, claimability, or structured current-context slice is changed.
status: evaluated
evaluating_work_item: BANDIT-032
evaluation_evidence: docs/work/BANDIT-032/retrospective.md
result: effective
decision: keep
outcome: keep

## Cross-Model Tension

No unresolved cross-model tension. CodeRabbit's actionable hardcoded-source finding was accepted and repaired. Local Qwen's remaining blocker breadth, gate breadth, next-action heuristic, and stale-marker findings were accepted as non_blocking and routed to BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING rather than treated as disagreement with CodeRabbit's pass.

## Bootstrap Gaps Remaining

- none
