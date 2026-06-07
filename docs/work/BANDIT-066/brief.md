# BANDIT-066: Browser-Served Cockpit App Shell

## Status

Brief Created

work_type: slice

## Product Work

Create the first browser-served local Workflow Cockpit app shell for the accepted
attention-first cockpit product direction. The shell is an operator-facing
usable UI surface for a single Bandit-governed repository, backed by derived
cockpit presentation data and CLI-authority boundaries.

## Origin

This slice is authorized by the Phase 8 product queue after Repo PM recorded
explicit no-action for `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.
Source authority comes from
`docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md`,
`docs/design/workflow-cockpit/design-review.md`,
`docs/design/workflow-cockpit/design-system.md`,
`docs/design/workflow-cockpit/attention-first-workflow-cockpit-prototype.html`,
`docs/design/workflow-cockpit/prototype-source/`,
`docs/design/workflow-cockpit-boundary.md`, the existing cockpit
view-model/render code, `CLEAN_CODE.md`, and
`docs/verification/STAGE_RUBRICS.md`.

## Goal

Create the first browser-served local Workflow Cockpit app shell from the accepted attention-first cockpit PRD and design artifacts, backed by existing derived cockpit view-model data, without making browser state, a local server, fixture data, or UI components canonical workflow authority.

## Scope

- Use docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md, docs/design/workflow-cockpit/design-review.md, docs/design/workflow-cockpit/design-system.md, docs/design/workflow-cockpit/prototype-source/, docs/design/workflow-cockpit/screenshots/, docs/design/workflow-cockpit-boundary.md, src/state/cockpit-view-model.ts, src/state/cockpit-actions.ts, src/cockpit/render.ts, and current cockpit UI tests as source material.
- Add a browser-served app shell entrypoint that presents the usable cockpit experience as the first screen: attention categories, active work, blocked or stale state, gate strip, evidence drilldown, guarded CLI-backed action affordances, and light queue context.
- Keep the first browser shell presentation-focused and deterministic: it may consume an explicit typed fixture or generated static payload derived from current cockpit status, but it must not parse repo artifacts directly from UI components or store canonical workflow state in browser/app state.
- Reuse or map the existing cockpit view-model/action/render boundaries so the browser layer renders presentation data and does not decide workflow authority.
- Use the accepted design-system tokens and prototype as visual reference while implementing production-owned source rather than adopting bundled prototype code wholesale.
- Add a local development/preview path only as static serving or build tooling for the browser shell; any local API, live CLI invocation, state index, or persistent cache belongs to later slices.
- Include responsive and accessibility-oriented verification for desktop and mobile widths, including source path wrapping, button/chip fit, disabled reasons, keyboard focus order, and dense detail panels.
- Record CLI-owned product UAT evidence before landing because this slice creates an operator-facing usable browser UI.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns orchestration after formation approval; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude; Implementation Writer cannot edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent/Codex PM owns Stage 6.
- Token-cost failsafe boundary: use existing token-cost failsafe policy for abnormal reviewer or long-running execution; this slice approves no paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, merge, push, deploy, or external service setup.

## Out Of Scope

- Do not implement live CLI invocation from the browser, local API endpoints, server-side workflow actions, state-index persistence, SQLite, cross-repo aggregation, scheduler execution, claim leases, work-surface reservations, worktree lifecycle, PR/CI orchestration, automatic merge, push, deploy, or production canary behavior.
- Do not let browser storage, generated UI state, fixture data, screenshots, a local server process, a local cache, or web component state become canonical workflow state.
- Do not make the UI approve product UAT, policy overrides, business tradeoffs, explicit cost/risk posture, provider-pricing evidence, spend-class policy, Trust Verifier cutover, merge readiness, deploy safety, or landing safety.
- Do not replace current cockpit status, session-context, coordination, review, landing, UAT, retrospective, bootstrap-gap, or Trust Verifier authority.
- Do not create broad evidence drilldown, live status ingestion, guarded action execution, improvement-health analytics, State Index, or cockpit product queue behavior beyond what is needed for a coherent app shell.
- Do not add dependencies, package scripts, generated assets, or app framework choices without keeping the diff narrow and justified by the app shell contract.

## Acceptance Criteria

- The source spec and brief identify this as the first Phase 8 browser-served cockpit app shell slice after the role-scoped orchestration umbrella receives an explicit no-action disposition.
- The browser shell can be served or previewed locally through a documented repo command or static entrypoint without requiring network services, provider credentials, merge/push/deploy authority, or a mutable local workflow database.
- The first screen renders a usable attention-first cockpit experience, not a marketing page: attention categories, active work/next action, blocked or stale state, gate strip, evidence/source traceability, guarded actions, and light queue context are visible.
- The browser layer consumes typed presentation data from existing or newly bounded cockpit view-model surfaces and does not parse repo-native artifacts or decide workflow authority inside UI components.
- Every displayed workflow state has source-linked evidence, a freshness/missing/blocked cue, or an explicit unavailable reason rather than unexplained green status.
- Guarded action affordances are visibly tied to CLI command families, disabled when unavailable, and never imply UAT approval, policy override, landing authority, merge, push, deploy, or hidden workflow mutation.
- The implementation keeps app shell, visual tokens/styles, view-model/payload mapping, action affordance rendering, and evidence-detail rendering separated enough for clean-code review.
- Responsive verification covers desktop and mobile widths with no overlapping or truncated critical text, controls, source paths, status chips, or dense evidence panels.
- Accessibility verification covers semantic landmarks, button roles and disabled states, focus order, contrast, and keyboard reachability for the initial shell.
- Product UAT is recorded through CLI-owned UAT evidence before landing the operator-facing browser shell.
- Stage 4 review includes Local Qwen and CodeRabbit pre-PR evidence or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification and supply-chain evidence because the slice touches browser-facing source and package/build surfaces.
- The slice does not choose local API shape, State Index timing, live status ingestion, guarded action execution, scheduler/claim/worktree behavior, PR/CI behavior, merge/push/deploy authority, external service setup, product policy changes, cost/risk overrides, or unrelated Phase 8 feature scope.

## Test Plan

- Write RED tests proving the browser shell maps cockpit view-model or explicit static payload data into attention categories, active work, blocked/stale state, gate strip, evidence drilldown, guarded actions, and light queue context.
- Write RED tests proving the browser/UI layer does not parse repo-native artifacts directly, mutate repo state, store canonical workflow state in browser/app state, or bypass CLI Authority.
- Write RED render or DOM tests for disabled guarded actions, unavailable reasons, source links, evidence freshness/missing cues, and no hidden UAT/landing/merge/push/deploy authority.
- Add responsive verification for desktop and mobile viewports covering text fit, source-path wrapping, button/chip dimensions, evidence panel density, and no overlap.
- Add accessibility checks for landmarks, button roles, disabled state semantics, focus order, keyboard reachability, and contrast.
- Run focused cockpit browser-shell, view-model, and UI tests after implementation.
- Run npm test if implementation touches shared cockpit status, view-model, action eligibility, render, CLI command routing, package scripts, or validation behavior.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- cockpit status --json and node ./bin/bandit.mjs session-context current --json to verify current repo status remains source-linked.
- Run a local browser/Playwright smoke test against the served shell before Stage 4/landing if the implementation adds a browser-served entrypoint.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-066 --base origin/main before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-066 before Stage 4 closeout.
- Run npm run bandit -- review-subject-hash BANDIT-066 for aggregate review evidence freshness.
- Record CLI-owned product UAT evidence before landing the operator-facing shell.
- Run npm run bandit -- land-check BANDIT-066 before landing.
- Run git diff --check.

## Verification Plan

- Stage 1 formation validation must pass after this brief, Qwen formation review, CodeRabbit formation review or honest provider-timeout evidence, aggregate formation review, and `formation_approved` coordination evidence are recorded.
- Stage 2 must produce RED evidence before implementation and map RED tests to the acceptance criteria for the browser shell, responsive behavior, accessibility states, guarded actions, source traceability, and no-hidden-authority boundaries.
- Stage 3 implementation must run through the Claude implementation-writer path if Codex authors or materially edits Stage 2 RED tests, and the Stage 3 Writer has no test-surface authority.
- Stage 4 must record Local Qwen, CodeRabbit pre-PR or provider-refusal evidence, aggregate review evidence, review-subject hash, layered risk-classification, and supply-chain gate evidence because browser-facing and package/build surfaces may be touched.
- Stage 5 must record CLI-owned product UAT approval, landing verdict, land-check, and landing-action evidence before any later slice begins.
- Stage 6 must record retrospective, improvement or no-action dispositions, updated `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before creating this brief. The slice must keep the browser app shell, view-model/payload mapping, action affordance rendering, evidence-detail rendering, and static serving/build mechanics small, explicit, testable, and separated from canonical repo-state authority.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation, source-spec repair, formation review routing, and context synchronization.
- Work Item PM owns orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, and acceptance mappings.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, or acceptance mappings for this Work Item.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires Claude-family Stage 3 implementation, and verification escalation returns to Codex PM because Claude authored the implementation.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing verdict/action evidence. The operator owns product UAT approval. Closeout Agent/Codex PM owns Stage 6 retrospective and closeout evidence.

## Stage Capability Scope

policy: `.bandit/policy/stage-capability-scope.json`

- stages: `stage1_brief`, `formation_review`, `work_item_pm_plan_mode`, `stage2_red_evidence`, `stage3_implementation`, `stage4_review`, `feature_uat`, `stage5_landing`, `stage6_retrospective`.
- authority roles: `codex_pm`, `repo_pm`, `work_item_pm`, `test_writer`, `implementation_writer`, `reviewer`, `landing_agent`, `closeout_agent`, `operator`.
- required skills: `bandit`, `tdd`, `review`, `frontend-design`, `superpowers:verification-before-completion`.
- allowed tools: repo-local CLI commands, focused tests, typecheck, local browser/Playwright smoke verification when the implementation adds a browser-served shell.
- forbidden actions: do not write RED evidence before formation approval; do not run Work Item PM execution before `formation_approved`; do not let Stage 3 Writer edit test surfaces; do not let browser shell, fixture data, local server, browser storage, cache, or generated UI state become canonical workflow authority; do not implement live API, State Index, guarded action execution, scheduler, claim/worktree lifecycle, merge, push, deploy, external services, Trust Verifier cutover, or unrelated cockpit features in this slice.

## Token-Cost Failsafe

policy: `.bandit/policy/token-cost-failsafe.json`

- Stage 1 formation uses local-only default guidance.
- Stage 2, Stage 3, and browser QA should use existing abnormal-run soft budget guidance and avoid brittle caps that force duplicate attempts.
- Stage 4 reviewer runs must record provider timeout, refusal, or continuation evidence honestly; absence of CodeRabbit output is not pass evidence.
- No paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, external hosted service, merge, push, or deploy authority is approved by this brief.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-065 is landed and closed out; the role-scoped orchestration umbrella is dispositioned no_action; roadmap and current context authorize Phase 8 cockpit app-shell formation.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, product scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, and UAT requirement.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must write browser shell/view-model/authority-boundary RED evidence before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any test surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen, risk-classification, supply-chain, and review-subject hash evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict/action and CLI-owned product UAT are required before landing this operator-facing browser shell.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, and STATUS updates are required before the next slice.

## Bootstrap Gaps

- No open bootstrap gap blocks this Phase 8 slice after BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION is dispositioned no_action.
- Live CodeRabbit may time out or be unavailable; if so, record provider-refusal/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local API, State Index, live CLI invocation, guarded action execution, scheduler, claim/worktree lifecycle, and cross-repo behavior remain future work outside this app-shell slice.

## Expected Files

- docs/specs/BANDIT-066-browser-served-cockpit-app-shell.json
- docs/work/BANDIT-066/brief.md
- docs/work/BANDIT-066/qwen-formation-review.md
- docs/work/BANDIT-066/coderabbit-formation-review.md
- docs/work/BANDIT-066/formation-review.md
- docs/work/BANDIT-066/coordination-log.jsonl
- docs/work/BANDIT-066/red-evidence.md
- docs/work/BANDIT-066/implementation-evidence.md
- docs/work/BANDIT-066/coderabbit-review.md
- docs/work/BANDIT-066/local-qwen-review.md
- docs/work/BANDIT-066/review-evidence.md
- docs/work/BANDIT-066/uat-approval.md
- docs/work/BANDIT-066/landing-verdict.md
- docs/work/BANDIT-066/landing-action.md
- docs/work/BANDIT-066/retrospective.md
- src/cockpit/
- src/cockpit/render.ts
- src/state/cockpit-view-model.ts
- src/state/cockpit-actions.ts
- test/cockpit-ui.test.mjs
- test/cockpit-view-model.test.mjs
- test/cockpit-browser-shell.test.mjs
- package.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Write RED tests for browser shell payload/view-model mapping, attention-first rendering, guarded action disabled states, evidence traceability, responsive behavior, and no hidden authority.
- Define the smallest browser-served app shell file boundary and static serving or preview command without introducing a live API or mutable state store.
- Implement presentation-owned app shell source that consumes typed cockpit presentation data and keeps UI components shallow.
- Apply accepted design-system tokens and prototype references without copying bundled prototype code wholesale.
- Verify responsive and accessibility states before review, then record implementation, UAT, review, landing, and closeout evidence in the normal stage order.

## Smell Triggers

- Any browser, local server, fixture, cache, screenshot, generated UI state, or State Index becoming canonical workflow state is a blocker.
- Any UI affordance that implies UAT approval, policy override, landing safety, merge, push, deploy, or workflow mutation outside CLI Authority is a blocker.
- Any browser component that parses or mutates repo-native artifacts directly is a blocker.
- Any local API, live CLI invocation, State Index, scheduler, claim, worktree, PR/CI, external service, or unrelated Phase 8 feature work inside this slice is scope creep.
- Any desktop or mobile layout overlap, truncation, inaccessible control state, or source-path unreadability in critical operator flows is a product-quality blocker.
- Any large mixed function that combines repo parsing, payload mapping, action eligibility, evidence rendering, static serving, and UI rendering is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-066/brief.md
- docs/work/BANDIT-066/qwen-formation-review.md
- docs/work/BANDIT-066/coderabbit-formation-review.md
- docs/work/BANDIT-066/formation-review.md
- docs/work/BANDIT-066/coordination-log.jsonl
- docs/work/BANDIT-066/red-evidence.md
- docs/work/BANDIT-066/implementation-evidence.md
- docs/work/BANDIT-066/coderabbit-review.md
- docs/work/BANDIT-066/local-qwen-review.md
- docs/work/BANDIT-066/review-evidence.md
- docs/work/BANDIT-066/uat-approval.md
- docs/work/BANDIT-066/landing-verdict.md
- docs/work/BANDIT-066/landing-action.md
- docs/work/BANDIT-066/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 browser app-shell work item or complete Stage 1 formation because the cockpit PRD, design review, design system, prototype source, cockpit boundary, existing cockpit status/view-model code, CLEAN_CODE.md, and Stage Rubrics define a bounded first shell. CLI-owned product UAT is required before landing the operator-facing implementation. Halt for operator input if implementation would choose local API shape, State Index timing, live status ingestion, guarded action execution authority, scheduler execution, claim/worktree lifecycle behavior, automatic merge/push/deploy authority, PR/CI orchestration, external service setup, policy changes, business tradeoffs, explicit cost/risk approvals, Trust Verifier cutover, or genuinely ambiguous product scope.
