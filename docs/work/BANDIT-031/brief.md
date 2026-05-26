# BANDIT-031: Workflow Cockpit Status Foundation

## Status

Brief Created

## Goal

Create the first Phase 8 Workflow Cockpit slice by defining a minimal, CLI-authoritative, read-only cockpit status foundation that reconciles current repo workflow state for display without starting UI product design, hidden state indexing, scheduler execution, or workflow mutation.

## Scope

- Define the first cockpit implementation step around a read-only status foundation sourced from existing repo-native artifacts: CURRENT_CONTEXT.md, ROADMAP.md, docs/work/BANDIT-031 evidence, coordination logs, bootstrap gaps, landing gates, UAT artifacts, and improvement evidence.
- Add or update CLI-owned behavior that can produce a deterministic cockpit status payload or report for the current repository with source artifact paths, validation status, current phase, active work item, next action, blockers, gate summaries, improvement health, and coordination state where available.
- Keep canonical authority in repo artifacts and Bandit CLI validation; any payload, report, cache, local API response, or future UI projection remains rebuildable derived state.
- Use the existing workflow-cockpit boundary artifact to distinguish available surfaces from deferred Phase 8 UI/product choices and later action buttons.
- Fail closed when required source artifacts are missing, contradictory, stale, or blocked by operator-owned input instead of synthesizing a confident cockpit state.
- Prepare the smallest foundation a later web cockpit can read, while preserving CLI Authority and evidence traceability.

## Out Of Scope

- Do not implement visual UI screens, component design, styling, routing, web bundling, local server mode, or browser-based cockpit interactions in this slice.
- Do not choose product-facing UI tradeoffs beyond the evidence-backed read-only status fields already authorized by the cockpit boundary.
- Do not implement scheduler execution, worker heartbeats beyond existing read-only inspection, claim leases, work surface reservations, worktree lifecycle, cross-repo coordination, automatic merge, push, deploy, or production canary behavior.
- Do not allow cockpit-derived state, SQLite, browser storage, local server memory, GitHub labels, or generated reports to become canonical workflow authority.
- Do not infer product UAT approval, policy overrides, business tradeoffs, cost/risk approvals, external service setup, or merge readiness beyond existing CLI gates.
- Do not implement actor identity policy, unrelated coordination hardening, PR/CI workflow changes, or new feature work inside this slice.

## Acceptance Criteria

- The brief identifies docs/design/workflow-cockpit-boundary.md, docs/plans/V0_PLAN.md, CURRENT_CONTEXT.md, ROADMAP.md, and current Phase 6/Phase 7 evidence as the source material for the first Phase 8 cockpit slice.
- RED evidence defines the missing read-only cockpit status foundation before production implementation starts.
- The implementation can derive a deterministic cockpit status payload or report from repo-native artifacts and include source artifact paths for every displayed workflow state.
- The status foundation reports current phase, active work item, next action, required operator input, known blockers, bootstrap-gap status, gate status, landing readiness summary, UAT status when applicable, improvement health, and coordination state when available.
- The implementation refuses missing, contradictory, or stale required source artifacts with clear fail-closed messages instead of hiding gaps or inventing status.
- Derived cockpit output is explicitly non-canonical and rebuildable; canonical workflow state remains in repo artifacts mutated only by approved Bandit CLI commands.
- Tests cover normal status derivation, missing-source refusal, contradictory next-action or active-work refusal, bootstrap-gap status reporting, gate status source links, improvement health source links, coordination-state reporting, and no hidden write authority.
- No Phase 8 visual UI, state-index persistence, local API/server, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy, product UAT approval, actor identity policy, PR/CI workflow, or unrelated feature behavior is introduced by this slice.

## Test Plan

- Write RED tests for deriving a cockpit status payload from fixture repo artifacts with phase, active work item, next action, blockers, bootstrap gaps, gate status, landing readiness, UAT status, improvement health, coordination state, and source artifact links.
- Write RED tests proving missing CURRENT_CONTEXT.md, ROADMAP.md, expected work-item evidence, or malformed bootstrap-gap data fail closed.
- Write RED tests proving contradictory current phase, active work item, next action, or closed-vs-active work evidence is refused with clear messages.
- Write RED tests proving derived reports do not create or mutate canonical state, require a web UI, require SQLite, or treat cockpit output as source of truth.
- Run focused cockpit status tests after implementation.
- Run npm test if implementation touches shared command routing, work-item readers, validators, coordination status, improvement state, review gates, landing gates, UAT readers, or bootstrap-gap parsing.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-031 --base origin/main before aggregate Stage 4 evidence when local CLI/auth support it; otherwise record fail-closed operator-input or honest replacement evidence.
- Run npm run bandit -- qwen-review BANDIT-031 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-031 before landing.
- Run git diff --check.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-05-26 before creating this brief. The slice must keep cockpit status derivation, artifact reading, validation, and derived reporting small, explicit, testable, and repo-native, with no hidden authority or UI-owned state.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | CURRENT_CONTEXT.md and ROADMAP.md identify Phase 8, no active work before brief creation, BANDIT-030 landing action and retrospective closeout, no open bootstrap gaps, and BANDIT-031 brief creation as the next action.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines goal, scope, out of scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator input status.
- Stage 2: Test Design And RED Evidence | required next | Tests must express read-only cockpit status derivation, source links, refusal paths, and no hidden authority before production implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must keep artifact readers, reconciliation, validation, and rendering separated with explicit repo-source boundaries.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit pre-PR review when available, Local Qwen, and aggregate review evidence must cover cockpit authority, stale-source, fail-closed, and hidden-index risks.
- Stage 5: Landing And UAT | required later | Landing verdict and landing action evidence are required; product UAT is not required unless this slice introduces product-facing feature behavior beyond read-only status foundation.
- Stage 6: Retrospective And Improvement Capture | required later | Closeout must disposition lessons and update CURRENT_CONTEXT.md and ROADMAP.md.

## Bootstrap Gaps

- No open bootstrap gaps are currently recorded. BANDIT-030 is landed and closed out, and all current bootstrap gaps are resolved.
- Phase 8 visual UI, state-index persistence, local API/server mode, scheduler execution, claim leases, work surface reservations, worktree lifecycle, cross-repo coordination, automatic merge/push/deploy, actor identity policy, and PR/CI workflow remain future work outside this slice.
- Live pre-PR CodeRabbit CLI review may require local CodeRabbit CLI installation and authentication; if unavailable at Stage 4, record fail-closed operator-input evidence or honest replacement evidence rather than claiming a pass.

## Expected Files

- docs/specs/BANDIT-031-workflow-cockpit-status-foundation.json
- docs/work/BANDIT-031/brief.md
- docs/work/BANDIT-031/red-evidence.md
- docs/work/BANDIT-031/implementation-evidence.md
- docs/work/BANDIT-031/coderabbit-review.md
- docs/work/BANDIT-031/local-qwen-review.md
- docs/work/BANDIT-031/review-evidence.md
- docs/work/BANDIT-031/landing-verdict.md
- docs/work/BANDIT-031/landing-action.md
- docs/work/BANDIT-031/retrospective.md
- src/commands/cockpit.ts
- src/state/cockpit-status.ts
- test/cockpit-status.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## First Implementation Order

- Write RED fixture artifacts and tests for read-only cockpit status derivation from repo-native sources.
- Write RED tests for fail-closed missing-source and contradictory-state cases.
- Select the narrow CLI syntax for read-only cockpit status inspection without introducing web UI, server mode, or hidden indexes.
- Implement focused artifact readers and reconciliation helpers that expose source paths and validation status.
- Implement derived status payload or report rendering without writing canonical state.
- Update implementation evidence, Stage 4 review evidence, landing evidence, retrospective, CURRENT_CONTEXT.md, and ROADMAP.md as each stage completes.

## Smell Triggers

- Any logic that lets cockpit output, SQLite, browser storage, local server memory, generated JSON, or a cache become canonical workflow state is a blocker.
- Any implementation that hides missing, contradictory, or stale repo evidence behind a green cockpit status is a blocker.
- Any Phase 8 visual UI/product choice, server/API packaging decision, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy, actor identity policy, or PR/CI workflow change inside this slice is scope creep.
- Any attempt to infer product UAT approval, policy override, business tradeoff, cost/risk approval, external-service setup, or merge readiness from cockpit state is a blocker.
- Artifact parsing, reconciliation, validation, and rendering must remain readable and separated; a large mixed orchestration function is a clean-code smell.

## Required Evidence

- docs/work/BANDIT-031/brief.md
- docs/work/BANDIT-031/red-evidence.md
- docs/work/BANDIT-031/implementation-evidence.md
- docs/work/BANDIT-031/coderabbit-review.md
- docs/work/BANDIT-031/local-qwen-review.md
- docs/work/BANDIT-031/review-evidence.md
- docs/work/BANDIT-031/landing-verdict.md
- docs/work/BANDIT-031/landing-action.md
- docs/work/BANDIT-031/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 brief because CURRENT_CONTEXT.md, ROADMAP.md, docs/design/workflow-cockpit-boundary.md, docs/plans/V0_PLAN.md, Phase 6 coordination evidence, Phase 7 improvement evidence, CLEAN_CODE.md, and Stage Rubrics define the read-only cockpit status foundation boundary. Halt for operator input if implementation would choose product-facing UI direction beyond evidence-backed status fields, require product UAT approval, change policy, approve business tradeoffs, approve cost/risk, enable remote merge/push/deploy authority, select an external service, or resolve genuinely ambiguous scope.
