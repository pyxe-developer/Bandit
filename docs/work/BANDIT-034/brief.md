# BANDIT-034: Cockpit Shell Hardening

## Status

Stage 3 Implementation Recorded

## Non-Product Work

Materialize the queued BANDIT-033 cockpit-shell hardening candidate into a focused Phase 8 improvement chore that consolidates guarded action affordance derivation and makes light queue/context mapping explicit while preserving CLI authority and repo-native canonical state.

## Origin

BANDIT-033 Local Qwen non-blocking Stage 4 findings were accepted and routed to BANDIT-033-COCKPIT-SHELL-HARDENING in docs/work/BANDIT-033/qwen-finding-disposition.md and docs/work/BANDIT-033/retrospective.md.

origin: Local Qwen non-blocking Stage 4 findings from BANDIT-033.
source_work_item: BANDIT-033
source_artifacts:
  - docs/work/BANDIT-033/local-qwen-review.md
  - docs/work/BANDIT-033/qwen-finding-disposition.md
  - docs/work/BANDIT-033/retrospective.md
  - docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md
  - docs/design/workflow-cockpit/design-review.md
  - src/state/cockpit-actions.ts
  - src/state/cockpit-view-model.ts
  - src/cockpit/render.ts
  - test/cockpit-view-model.test.mjs
  - test/cockpit-ui.test.mjs
lesson: The first attention-first cockpit shell should consolidate action affordance derivation and make light queue/context mapping explicit before the cockpit UI grows beyond the initial presentation shell.
hypothesis: Cockpit shell maintenance risk will decrease if guarded action affordances have one derived source and queue/context categories have explicit source-linked mapping before later cockpit slices add more views or actions.
metric: Future Stage 4 reviews of cockpit visual shell work do not repeat action derivation duplication or implicit queue-context mapping findings.
baseline: BANDIT-033 establishes the first presentation-only visual shell with source-linked attention categories, guarded controls, and no hidden workflow authority, while keeping action affordance derivation shallow and queue context lightweight.
expected_direction: Visual shell changes remain easier to audit as cockpit surfaces expand.
evaluation_window: Evaluate when the next cockpit visual shell, guarded action, queue/context, or evidence-drilldown slice changes these surfaces.
status: planned
outcome: pending

## Scope

- Use repo-native evidence from BANDIT-033, the attention-first cockpit PRD, workflow-cockpit design artifacts, current cockpit view-model/render tests, CURRENT_CONTEXT.md, ROADMAP.md, CLEAN_CODE.md, and Stage Rubrics to define the next narrow cockpit-shell hardening contract.
- Consolidate guarded action affordance derivation so the render layer consumes one explicit presentation source instead of duplicating eligibility logic.
- Make light queue/context mapping explicit and source-linked for the current presentation shell without introducing intake, scheduler, claimability, workstream, or full queue-management behavior.
- Preserve the presentation-only shell boundary: cockpit output remains deterministic, read-only, source-linked, and non-canonical.
- Record the improvement metadata and eventual outcome so the BANDIT-033 hypothesis can be evaluated after this cockpit-shell hardening work reaches Stage 4.

## Acceptance Criteria

- The work item is created from the queued BANDIT-033-COCKPIT-SHELL-HARDENING candidate using repo evidence rather than chat memory.
- Stage 1 records that Codex PM read CLEAN_CODE.md and shapes this spec so clean-code compliance can be evaluated before landing.
- Stage 2 RED evidence defines expected guarded action derivation and explicit queue/context mapping behavior before production implementation starts.
- Guarded action affordances have one derived presentation source consumed by render code, reducing duplicate action-eligibility logic while preserving guarded/refusal semantics.
- Queue/context mapping is explicit, deterministic, and source-linked for the current light cockpit shell without inventing future intake ledger, scheduler, claimability, workstream, product UAT, PR/CI, merge, push, deploy, or server/API behavior.
- The implementation remains presentation-only and does not mutate repo-native workflow state, create hidden cockpit state, or move source-of-truth authority into UI/render helpers.
- Tests cover normal action-affordance derivation, render consumption of derived affordances, explicit queue/context mapping, missing or ambiguous source refusal where applicable, and preservation of no hidden write authority.
- The work item does not choose local server/API shape, state-index persistence, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow, external service setup, policy change, business tradeoff, cost/risk override, or unrelated feature behavior.

## Verification Plan

- Run focused RED tests for cockpit shell hardening and record failing output in docs/work/BANDIT-034/red-evidence.md before production implementation.
- Run focused cockpit view-model and UI/render tests after implementation.
- Run npm test if implementation touches shared cockpit status, cockpit action, evidence, render, validation, or CLI command routing behavior.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- cockpit status --json to verify the derived cockpit report remains read-only and source-linked.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main before aggregate Stage 4 evidence when local CLI/auth support it; otherwise record fail-closed operator-input or honest replacement evidence.
- Run npm run bandit -- qwen-review BANDIT-034 before Stage 4 closeout.
- Run npm run bandit -- review-subject-hash BANDIT-034 for aggregate review evidence freshness.
- Run npm run bandit -- land-check BANDIT-034 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-034-cockpit-shell-hardening.json
- docs/work/BANDIT-034/brief.md
- docs/work/BANDIT-034/red-evidence.md
- docs/work/BANDIT-034/implementation-evidence.md
- docs/work/BANDIT-034/coderabbit-review.md
- docs/work/BANDIT-034/local-qwen-review.md
- docs/work/BANDIT-034/review-evidence.md
- docs/work/BANDIT-034/landing-verdict.md
- docs/work/BANDIT-034/landing-action.md
- docs/work/BANDIT-034/retrospective.md
- src/state/cockpit-actions.ts
- src/state/cockpit-view-model.ts
- src/cockpit/render.ts
- test/cockpit-view-model.test.mjs
- test/cockpit-ui.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-034/brief.md
- docs/work/BANDIT-034/red-evidence.md
- docs/work/BANDIT-034/implementation-evidence.md
- docs/work/BANDIT-034/coderabbit-review.md
- docs/work/BANDIT-034/local-qwen-review.md
- docs/work/BANDIT-034/review-evidence.md
- docs/work/BANDIT-034/landing-verdict.md
- docs/work/BANDIT-034/landing-action.md
- docs/work/BANDIT-034/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 improvement chore because the source candidate, hypothesis, metric, baseline, expected direction, evaluation window, and source artifacts are recorded in docs/work/BANDIT-033/qwen-finding-disposition.md and docs/work/BANDIT-033/retrospective.md. Halt for operator input if implementation would choose product-facing visual UI direction beyond the recorded shell hardening scope, require product UAT approval, change policy, approve business tradeoffs, approve explicit cost/risk, enable remote merge/push/deploy authority, select an external service, or resolve genuinely ambiguous scope.
