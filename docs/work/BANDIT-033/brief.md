# BANDIT-033: Attention-First Cockpit Visual Shell

## Status

Brief Created

## Goal

Create the first Phase 8 visual Workflow Cockpit UI slice by turning the accepted attention-first PRD and design artifacts into a production-oriented, testable cockpit shell and presentation boundary on top of the existing read-only cockpit status substrate, without giving the UI canonical workflow authority.

## Scope

- Use docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md, docs/design/workflow-cockpit/design-review.md, docs/design/workflow-cockpit/design-system.md, docs/design/workflow-cockpit/prototype-source/, docs/design/workflow-cockpit/screenshots/, and the existing bandit cockpit status --json substrate as the source material for this visual UI slice.
- Define the first usable attention-first cockpit UI surface around current operator attention, active work, blocked or stale state, landing readiness, improvement health, light queue context, and evidence/source traceability.
- Add a shallow presentation boundary that consumes typed, derived cockpit status or fixture data and maps it into Attention Categories, confidence cues, source links, and guarded action affordance states.
- Keep UI components shallow and product-facing: they render presentation data, show disabled or unavailable actions with reasons, and link to evidence without parsing repo artifacts or deciding workflow authority.
- Preserve CLI Authority by treating every mutation-capable control as a request for an approved Bandit CLI command family, with eligibility and execution validated outside the visual component layer.
- Include responsive and accessibility-oriented verification for the first screen and dense drill-down patterns so text, chips, buttons, and evidence panels do not overlap or truncate on desktop and mobile widths.
- Record product UAT evidence before landing if this slice produces an operator-facing usable UI surface.

## Out Of Scope

- Do not implement local server/API mode, state-index persistence, scheduler execution, worker heartbeat execution, claim leases, work surface reservations, worktree lifecycle controls, automatic merge, push, deploy, or production canary behavior in this slice.
- Do not let browser storage, generated UI state, a local cache, a fixture, a screenshot, or a web component become canonical workflow state.
- Do not make the UI approve UAT, policy overrides, business tradeoffs, cost/risk, external service setup, PR/CI decisions, merge readiness, or landing safety.
- Do not add direct editing of repo-native workflow artifacts outside approved CLI commands.
- Do not adopt the bundled standalone prototype as production code; use it as visual and interaction reference only.
- Do not broaden into cross-repo cockpit authority, model routing, actor identity policy, unrelated coordination hardening, or generic project-management backlog UI.
- Do not start unrelated Phase 8 backend, packaging, or state-index work unless a later work item explicitly scopes that authority.

## Acceptance Criteria

- The work item is created only after BANDIT-032 has landing action evidence, retrospective closeout, improvement disposition, and roadmap/current-context updates.
- Stage 2 RED evidence defines expected attention-category mapping, cockpit shell rendering, evidence confidence cues, disabled guarded actions, source traceability, responsive behavior, accessibility states, and no-hidden-authority guarantees before production implementation starts.
- The first UI surface visibly prioritizes operator-owned input, blocked or stale state, active work and next action, landing/readiness gates, improvement health, and light queue/context in the order approved by the PRD.
- Presentation data is derived from typed view-model fixtures or CLI-derived status output; UI components do not read or mutate repo-native artifacts directly.
- Every displayed workflow status includes a source, confidence cue, or fail-closed missing/blocked/stale state instead of unexplained green status.
- Guarded action affordances expose only approved CLI-backed requests, show unavailable actions as disabled with reasons, and never imply merge, push, deploy, UAT, policy override, or hidden workflow authority.
- Implementation keeps view-model mapping, action eligibility, evidence-detail normalization, and visual components separated enough that a reviewer can audit source-of-truth boundaries.
- Tests cover attention-category priority, active work detail, blocked/stale display, landing readiness display, improvement health display, evidence drill-down data, disabled action reasons, responsive rendering constraints, and no canonical browser/UI state.
- Product UAT is recorded through CLI-owned UAT evidence before landing if the slice produces an operator-facing usable UI surface.
- The slice does not choose local server/API mode, state-index persistence, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy behavior, actor identity policy, PR/CI workflow, external service setup, cost/risk approval, policy change, or unrelated feature behavior.

## Test Plan

- Write RED tests for mapping derived cockpit status or fixtures into Attention Categories, priority ordering, confidence cues, source links, and guarded action states.
- Write RED UI tests or snapshot-style render checks for the attention-first home surface, active Work Item detail, blocked or stale state, landing readiness, improvement health, queue/context, and evidence drill-down patterns.
- Write RED tests proving unsupported or unavailable actions are disabled with reasons and do not bypass CLI Authority.
- Write RED tests proving browser/UI state, fixtures, generated reports, or local cache state cannot become canonical workflow authority.
- Add responsive verification for desktop and mobile widths, including text overflow, chip/button fit, dense panel layout, and keyboard/focus states.
- Run focused cockpit UI/view-model tests after implementation.
- Run npm test if implementation touches shared command routing, cockpit status derivation, validators, view-model helpers, or generated UI artifacts.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- cockpit status --json to verify the read-only substrate remains source-linked.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-033 --base origin/main before aggregate Stage 4 evidence when local CLI/auth support it; otherwise record fail-closed operator-input or honest replacement evidence.
- Run npm run bandit -- qwen-review BANDIT-033 before Stage 4 closeout.
- Run npm run bandit -- review-subject-hash BANDIT-033 for aggregate review evidence freshness.
- Record CLI-owned product UAT evidence before landing if the delivered UI is operator-facing.
- Run npm run bandit -- land-check BANDIT-033 before landing.
- Run git diff --check.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-05-26 before creating this brief. The slice must keep view-model mapping, action eligibility, evidence-detail normalization, and visual components small, explicit, testable, and separated from canonical repo-state authority.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | CURRENT_CONTEXT.md and ROADMAP.md identify Phase 8, no active work before this brief, BANDIT-032 landing action and retrospective closeout, no open bootstrap gaps, and the accepted attention-first PRD/design artifacts as the source for creating exactly one next visual UI work item.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines goal, scope, out of scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator input status.
- Stage 2: Test Design And RED Evidence | required next | Tests must express the first visual cockpit shell, attention-first view model, guarded actions, source confidence, responsive behavior, and no hidden authority before production implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must keep view-model mapping, action eligibility, evidence-detail normalization, and visual rendering separated from repo parsing and workflow mutation.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit pre-PR review when available, Local Qwen, and aggregate review evidence must cover CLI Authority, source traceability, UI hidden-state risk, responsive UX, and role-boundary risks.
- Stage 5: Landing And UAT | required later | Landing verdict, current review gates, land-check, landing action evidence, and CLI-owned product UAT evidence are required if this slice delivers an operator-facing usable UI surface.
- Stage 6: Retrospective And Improvement Capture | required later | Closeout must disposition lessons and update CURRENT_CONTEXT.md and ROADMAP.md.

## Bootstrap Gaps

- No open bootstrap gaps are currently recorded. BANDIT-032 is landed and closed out, and all current bootstrap gaps are resolved.
- Local server/API mode, state-index persistence, scheduler execution, claim leases, work surface reservations, worktree lifecycle, cross-repo coordination, automatic merge/push/deploy, actor identity policy, and PR/CI workflow remain future work outside this slice.
- Live pre-PR CodeRabbit CLI review may require local CodeRabbit CLI installation and authentication; if unavailable at Stage 4, record fail-closed operator-input evidence or honest replacement evidence rather than claiming a pass.

## Expected Files

- docs/specs/BANDIT-033-attention-first-cockpit-visual-shell.json
- docs/work/BANDIT-033/brief.md
- docs/work/BANDIT-033/red-evidence.md
- docs/work/BANDIT-033/implementation-evidence.md
- docs/work/BANDIT-033/coderabbit-review.md
- docs/work/BANDIT-033/local-qwen-review.md
- docs/work/BANDIT-033/review-evidence.md
- docs/work/BANDIT-033/uat-approval.md
- docs/work/BANDIT-033/landing-verdict.md
- docs/work/BANDIT-033/landing-action.md
- docs/work/BANDIT-033/retrospective.md
- src/commands/cockpit.ts
- src/state/cockpit-status.ts
- src/state/cockpit-view-model.ts
- src/state/cockpit-actions.ts
- src/state/cockpit-evidence.ts
- src/cockpit/
- test/cockpit-status.test.mjs
- test/cockpit-view-model.test.mjs
- test/cockpit-ui.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## First Implementation Order

- Write RED view-model tests for attention-category mapping, source confidence, guarded action state, and evidence-detail normalization.
- Write RED UI/render tests for the attention-first home, active work detail, landing readiness, improvement health, queue/context, and evidence drill-down patterns.
- Define the production-oriented cockpit presentation boundary without adopting the bundled standalone prototype as app code.
- Implement typed view-model and action-eligibility helpers that consume derived cockpit status or fixtures without reading or mutating repo artifacts from UI components.
- Implement the first visual shell using the accepted design-system tokens and prototype references while keeping components shallow and source-linked.
- Verify responsive and accessibility states, then record implementation, UAT, Stage 4 review, landing, retrospective, CURRENT_CONTEXT.md, and ROADMAP.md evidence as each later stage completes.

## Smell Triggers

- Any browser state, fixture data, generated UI file, local cache, State Index, or visual component becoming canonical workflow state is a blocker.
- Any UI affordance that implies merge, push, deploy, UAT approval, policy override, cost/risk approval, or landing safety without a CLI-owned gate is a blocker.
- Any implementation that reads and mutates repo-native artifacts directly from UI components instead of using a typed derived boundary is a blocker.
- Any local server/API, state-index, scheduler, claim lease, work surface reservation, worktree lifecycle, actor identity policy, PR/CI, or unrelated feature implementation inside this slice is scope creep.
- Any visual layout that overlaps, truncates, or hides key operator attention, gate, blocker, source, or action state at supported desktop/mobile widths is a product-quality blocker.
- A large mixed function that combines repo parsing, action eligibility, evidence normalization, and rendering is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-033/brief.md
- docs/work/BANDIT-033/red-evidence.md
- docs/work/BANDIT-033/implementation-evidence.md
- docs/work/BANDIT-033/coderabbit-review.md
- docs/work/BANDIT-033/local-qwen-review.md
- docs/work/BANDIT-033/review-evidence.md
- docs/work/BANDIT-033/uat-approval.md
- docs/work/BANDIT-033/landing-verdict.md
- docs/work/BANDIT-033/landing-action.md
- docs/work/BANDIT-033/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 visual UI work item because the attention-first cockpit PRD, design review, design system, prototype source, screenshots, cockpit boundary, CLEAN_CODE.md, and Stage Rubrics define the first visual shell boundary. Halt for operator input if implementation would choose local server/API mode, state-index persistence timing, scheduler execution, claim leases, work surface reservations, worktree lifecycle behavior, automatic merge/push/deploy authority, actor identity policy, PR/CI workflow, external service setup, policy changes, business tradeoffs, explicit cost/risk approvals, or genuinely ambiguous scope. CLI-owned product UAT remains required before landing an operator-facing usable UI surface.
