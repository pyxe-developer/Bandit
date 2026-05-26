# BANDIT-032: Cockpit Status Coverage Hardening

## Status

Brief Created

## Non-Product Work

Materialize the queued BANDIT-031 cockpit-status hardening candidate into a focused Phase 8 improvement chore that broadens read-only cockpit status coverage for blocker, gate, next-action agreement, and stale-evidence states while preserving CLI authority and repo-native canonical state.

## Origin

BANDIT-031 Local Qwen non-blocking Stage 4 findings were accepted and routed to BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING in docs/work/BANDIT-031/qwen-finding-disposition.md and docs/work/BANDIT-031/retrospective.md.

origin: Local Qwen non-blocking Stage 4 findings from BANDIT-031.
source_work_item: BANDIT-031
source_artifacts:
  - docs/work/BANDIT-031/local-qwen-review.md
  - docs/work/BANDIT-031/qwen-finding-disposition.md
  - docs/work/BANDIT-031/retrospective.md
  - docs/design/workflow-cockpit-boundary.md
  - src/state/cockpit-status.ts
  - test/cockpit-status.test.mjs
lesson: Workflow cockpit status should expand beyond the first read-only foundation to summarize blocker, gate, next-action agreement, and stale evidence states from structured repo-native sources.
hypothesis: The cockpit will be more useful and less brittle if future status work replaces bounded Markdown heuristics with broader structured gate and blocker summaries while preserving CLI authority.
metric: Future Stage 4 reviews of cockpit status work do not repeat blocker breadth, gate breadth, next-action heuristic, or stale-marker findings.
baseline: BANDIT-031 provides the first read-only status payload with source links, fail-closed missing/contradictory source checks, and dynamic improvement-candidate source discovery, but keeps full gate and blocker breadth out of scope.
expected_direction: Cockpit status remains repo-native and fail-closed while reviewer findings about status breadth and brittle Markdown heuristics decrease.
evaluation_window: Evaluate when this cockpit status, gate matrix, blocker summary, claimability, or structured current-context hardening work reaches Stage 4 review.
status: planned
outcome: pending

## Scope

- Use repo-native evidence from BANDIT-031, docs/design/workflow-cockpit-boundary.md, CURRENT_CONTEXT.md, ROADMAP.md, Stage Rubrics, and existing cockpit status tests to define the next narrow cockpit-status coverage contract.
- Expand the read-only cockpit status foundation to summarize blocker breadth, gate breadth, next-action agreement, and stale-evidence state from structured or explicitly bounded repo-native sources.
- Preserve source artifact paths and fail-closed behavior for missing, contradictory, malformed, or stale evidence.
- Replace or reduce brittle bounded Markdown heuristics when structured repo evidence can support a clearer contract.
- Keep all derived cockpit output non-canonical and rebuildable; canonical workflow state remains in repo-native artifacts mutated only by approved Bandit CLI commands.
- Record the improvement metadata and eventual outcome so the BANDIT-031 hypothesis can be evaluated after this cockpit-status hardening work reaches Stage 4.

## Acceptance Criteria

- The work item is created from the queued BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING candidate using repo evidence rather than chat memory.
- Stage 2 RED evidence defines the expected blocker, gate, next-action agreement, and stale-evidence coverage before production implementation starts.
- Cockpit status output remains read-only, deterministic, source-linked, and explicitly non-canonical.
- The implementation summarizes broader blocker and gate states from available repo-native artifacts without inventing future claim lease, work surface reservation, scheduler, worktree, product UAT, PR/CI, merge, push, deploy, or visual UI behavior.
- Next-action agreement checking is hardened beyond the BANDIT-031 topic heuristic when structured or clearer bounded evidence is available, and still fails closed for unresolved contradictions.
- Stale-evidence reporting uses existing Bandit review, landing, UAT, coordination, or artifact freshness evidence where available instead of introducing an independent hidden staleness authority.
- Tests cover normal expanded status derivation, missing or contradictory evidence refusal, stale-evidence reporting, gate and blocker source links, and preservation of no hidden write authority.
- The work item does not choose Phase 8 visual UI, local server/API shape, state-index persistence, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy, product UAT approval, actor identity policy, PR/CI workflow, external service setup, policy change, business tradeoff, cost/risk override, or unrelated feature behavior.

## Verification Plan

- Run focused RED tests for cockpit status coverage hardening and record failing output in docs/work/BANDIT-032/red-evidence.md before production implementation.
- Run focused cockpit status tests after implementation.
- Run npm test if implementation touches shared command routing, validators, coordination status, improvement state, review gates, landing gates, UAT readers, or bootstrap-gap parsing.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- cockpit status --json to verify the derived report remains read-only and source-linked.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-032 --base origin/main before aggregate Stage 4 evidence when local CLI/auth support it; otherwise record fail-closed operator-input or honest replacement evidence.
- Run npm run bandit -- qwen-review BANDIT-032 before Stage 4 closeout.
- Run npm run bandit -- review-subject-hash BANDIT-032 for aggregate review evidence freshness.
- Run npm run bandit -- land-check BANDIT-032 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-032-cockpit-status-coverage-hardening.json
- docs/work/BANDIT-032/brief.md
- docs/work/BANDIT-032/red-evidence.md
- docs/work/BANDIT-032/implementation-evidence.md
- docs/work/BANDIT-032/coderabbit-review.md
- docs/work/BANDIT-032/local-qwen-review.md
- docs/work/BANDIT-032/review-evidence.md
- docs/work/BANDIT-032/landing-verdict.md
- docs/work/BANDIT-032/landing-action.md
- docs/work/BANDIT-032/retrospective.md
- src/commands/cockpit.ts
- src/state/cockpit-status.ts
- test/cockpit-status.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-032/brief.md
- docs/work/BANDIT-032/red-evidence.md
- docs/work/BANDIT-032/implementation-evidence.md
- docs/work/BANDIT-032/coderabbit-review.md
- docs/work/BANDIT-032/local-qwen-review.md
- docs/work/BANDIT-032/review-evidence.md
- docs/work/BANDIT-032/landing-verdict.md
- docs/work/BANDIT-032/landing-action.md
- docs/work/BANDIT-032/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 improvement chore because the source candidate, hypothesis, metric, baseline, expected direction, evaluation window, and source artifacts are recorded in docs/work/BANDIT-031/qwen-finding-disposition.md and docs/work/BANDIT-031/retrospective.md. Halt for operator input if implementation would choose product-facing visual UI direction, require product UAT approval, change policy, approve business tradeoffs, approve explicit cost/risk, enable remote merge/push/deploy authority, select an external service, or resolve genuinely ambiguous scope.
