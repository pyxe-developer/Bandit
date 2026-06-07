# BANDIT-068: Evidence Drilldown And Gate Matrix

## Status

Brief Created

work_type: slice

## Product Work

Create the next operator-facing Workflow Cockpit slice after `BANDIT-067`: a
source-linked evidence drilldown and gate matrix that lets the operator inspect
stage evidence, freshness, blockers, UAT, review, landing, and coordination
detail one level down. The product value is making the cockpit auditable for
decisions without shifting workflow authority into browser state.

## Origin

This slice is authorized by the Phase 8 product queue after `BANDIT-067`
landed and closed out the Live Cockpit Status View From CLI Payload slice.
Source authority comes from `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`,
`docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md`,
`docs/design/workflow-cockpit/design-review.md`,
`docs/design/workflow-cockpit/design-system.md`,
`docs/design/workflow-cockpit/prototype-source/`,
`docs/design/workflow-cockpit-boundary.md`,
`docs/work/BANDIT-067/retrospective.md`,
`src/state/cockpit-status.ts`, `src/state/cockpit-view-model.ts`,
`src/state/cockpit-actions.ts`, `src/cockpit/render.ts`,
`src/cockpit/browser-shell.ts`, `public/cockpit/index.html`,
`CLEAN_CODE.md`, and `docs/verification/STAGE_RUBRICS.md`.

## Goal

Add a source-linked evidence drilldown and gate matrix layer to the browser-served Workflow Cockpit so the operator can inspect stage evidence, freshness, blockers, UAT, review, landing, and coordination detail one level down without moving workflow authority into the browser.

## Scope

- Use `node ./bin/bandit.mjs cockpit status --json` and repo-native work-item artifacts as the evidence authority; the browser layer may render derived presentation data but must not parse or mutate canonical workflow state directly.
- Add a narrow evidence-detail view-model boundary that normalizes source paths, Stage 0 through Stage 6 gate evidence, review evidence, landing evidence, UAT evidence, coordination evidence, stale-evidence reasons, bootstrap-gap states, and artifact-specific Evidence Trust Signals for drilldown presentation.
- Render a dense but readable gate matrix in the cockpit shell with per-stage status, owner or authority role when available, source path, freshness state, blocker or missing-evidence reason, and next repair route when derivable from current CLI payload fields.
- Render an evidence drilldown panel or equivalent detail region for the selected or current stage that exposes source artifact links, hashes or review-subject freshness when present, provider bootstrap-gap evidence, UAT state, landing readiness, coordination state, and explicit unavailable reasons.
- Preserve fail-closed semantics: missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, blocked, or operator-owned states must remain visible and source-linked rather than hidden or normalized to pass.
- Keep guarded action affordances request-only and disabled unless an approved CLI command family already exists; this slice may show the command family and disabled reason but must not execute CLI commands from the browser.
- Keep generated/static payloads, browser process state, HTML, CSS, fixture data, screenshots, local cache, browser storage, and any preview output non-canonical and rebuildable from repo-native artifacts.
- Include desktop and mobile verification for dense matrix rows, long source paths, review hash text, stage labels, disabled reasons, evidence details, and source-link wrapping.
- Record CLI-owned product UAT evidence before landing because this slice deepens the operator-facing cockpit decision surface.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns orchestration only after formation approval; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude; Implementation Writer cannot edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent/Codex PM owns Stage 6.
- Token-cost failsafe boundary: use existing token-cost failsafe policy for abnormal reviewer or browser QA execution; this slice approves no paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, merge, push, deploy, external service setup, or hosted preview.

## Out Of Scope

- Do not implement browser-side CLI execution, local API endpoints, live polling, websocket updates, server-side workflow actions, guarded action execution, State Index persistence, SQLite, browser storage as workflow state, cross-repo aggregation, scheduler execution, claim leases, work-surface reservations, worktree lifecycle, PR/CI orchestration, automatic merge, push, deploy, or production canary behavior.
- Do not choose local API shape, State Index timing, hosted packaging, external service setup, framework migration, dependency additions, lockfile changes, or package-manager script changes unless a later explicitly authorized slice scopes them.
- Do not let generated JSON, preview files, fixture data, browser state, local cache, screenshots, static HTML, CSS, UI component state, or the evidence-detail view model become canonical workflow authority.
- Do not make the UI approve product UAT, policy overrides, business tradeoffs, explicit cost/risk posture, provider-pricing evidence, spend-class policy, Trust Verifier cutover, merge readiness, deploy safety, or landing safety.
- Do not replace current cockpit status, session-context, coordination, review, landing, UAT, retrospective, bootstrap-gap, risk-classification, supply-chain, or Trust Verifier authority.
- Do not implement the later Guarded CLI Action Requests slice, Improvement Health Surface, local queue management, historical analytics, or broader Phase 8 cockpit product scope inside this slice.

## Acceptance Criteria

- The source spec and brief identify this as the Phase 8 product slice following `BANDIT-067`, authorized by the roadmap next item `Evidence Drilldown And Gate Matrix`.
- The browser-served cockpit exposes a stage gate matrix derived from current `bandit cockpit status --json` payload fields and repo-native evidence paths rather than a separate browser-owned status model.
- A bounded evidence-detail module or equivalent view-model function maps CLI/repo evidence into presentation-ready drilldown rows without allowing UI components to parse or mutate canonical artifacts directly.
- The gate matrix includes Stage 0 through Stage 6 status, source path or source list, freshness or missing-evidence state, blocker/stale/unavailable reason, and derivable next repair route when present.
- The evidence drilldown exposes review evidence, review-subject freshness or hashes when available, landing evidence, UAT evidence, coordination evidence, bootstrap-gap replacement evidence, and artifact-specific Evidence Trust Signals with source links.
- Missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, blocked, and operator-owned states remain explicit with source or reason text and are never normalized to unexplained green.
- Guarded action affordances remain disabled or request-only unless an approved CLI command family exists; no browser code invokes CLI commands, writes repo artifacts, approves UAT, decides landing safety, merges, pushes, deploys, or changes policy.
- The implementation keeps cockpit status derivation, evidence-detail mapping, gate-matrix rendering, action affordance rendering, browser shell rendering, and static preview generation separated enough for clean-code review.
- Responsive verification covers desktop and mobile widths with no overlapping or truncated stage labels, source paths, SHAs, review hash text, disabled reasons, or evidence detail rows.
- Accessibility verification covers semantic landmarks, matrix/list labeling, button roles and disabled states, focus order, source-link reachability, and readable status cues for dense evidence detail.
- Product UAT is recorded through CLI-owned UAT evidence before landing the operator-facing drilldown and gate-matrix cockpit view.
- Stage 4 review includes Local Qwen and CodeRabbit pre-PR evidence or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification and supply-chain evidence because the slice touches browser-facing source and generated/static preview surfaces.
- The slice does not choose local API shape, State Index timing, live polling, guarded action execution authority, scheduler/claim/worktree behavior, PR/CI behavior, merge/push/deploy authority, external service setup, product policy changes, cost/risk overrides, Trust Verifier cutover, or unrelated Phase 8 feature scope.

## Test Plan

- Write RED tests proving a current cockpit-status JSON payload maps into a gate matrix with Stage 0 through Stage 6 status, source paths, missing/stale/bootstrap-gap states, and derivable repair reasons.
- Write RED tests proving evidence drilldown rows expose review evidence, review-subject freshness or hashes when present, landing evidence, UAT evidence, coordination evidence, bootstrap-gap replacement evidence, and artifact-specific Evidence Trust Signals.
- Write RED tests proving missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, blocked, and operator-owned states render with explicit source or reason text.
- Write RED tests proving browser/UI modules do not execute CLI commands, mutate repo artifacts, use browser storage as workflow state, approve UAT, decide landing safety, merge, push, deploy, or bypass CLI Authority.
- Write render or DOM tests for matrix row labels, source-link wrapping, disabled guarded actions, action unavailable reasons, evidence-detail density, gate-source traceability, and UAT/landing separation.
- Add responsive verification for desktop and mobile viewports covering text fit, source-path wrapping, SHA/hash wrapping, button/chip dimensions, evidence panel density, and no overlap.
- Add accessibility checks for landmarks, matrix/list semantics, button roles, disabled-state semantics, focus order, keyboard reachability, source-link reachability, and contrast.
- Run focused cockpit status, evidence-detail, cockpit view-model, browser shell, and static preview generation tests after implementation.
- Run npm test if implementation touches shared cockpit status derivation, command routing, validators, action eligibility, render, package scripts, static asset generation, templates, risk classification, or supply-chain surfaces.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json to verify current repo status remains source-linked.
- Run a local browser or Playwright smoke test against the static preview before Stage 4/landing.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-068 --base origin/main before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-068 before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- review-subject-hash BANDIT-068 for aggregate review evidence freshness.
- Record CLI-owned product UAT evidence before landing the operator-facing drilldown view.
- Run npm run bandit -- land-check BANDIT-068 before landing.
- Run git diff --check.

## Verification Plan

- Stage 1 formation validation must pass after this brief, Qwen formation review or honest provider-refusal evidence, CodeRabbit formation review or honest provider-timeout evidence, aggregate formation review, and `formation_approved` coordination evidence are recorded.
- Stage 2 must produce RED evidence before implementation and map RED tests to the acceptance criteria for gate-matrix derivation, evidence-detail drilldown, fail-closed status rendering, authority boundaries, source traceability, responsive behavior, and accessibility states.
- Stage 3 implementation must run through the Claude implementation-writer path if Codex authors or materially edits Stage 2 RED tests, and the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence.
- Stage 4 must record Local Qwen, CodeRabbit pre-PR or provider-refusal evidence, aggregate review evidence, review-subject hash, layered risk-classification, supply-chain gate evidence, browser smoke evidence, and clean-code review because browser-facing and generated/static preview surfaces may be touched.
- Stage 5 must record CLI-owned product UAT approval, landing verdict, land-check, auto-land-check when eligible, and local-record landing-action evidence before any later slice begins.
- Stage 6 must record retrospective, improvement or no-action dispositions, updated `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before creating this brief. The slice must keep cockpit status derivation, evidence-detail mapping, gate-matrix rendering, browser rendering, action affordance rendering, and static preview generation small, explicit, testable, and separated from canonical repo-state authority.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation, source-spec repair, formation review routing, formation approval, and context synchronization.
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
- allowed tools: repo-local CLI commands, focused tests, typecheck, local browser or Playwright smoke verification when implementation updates the browser-served preview.
- forbidden actions: do not write RED evidence before formation approval; do not run Work Item PM execution before `formation_approved`; do not let Stage 3 Writer edit test surfaces; do not let CLI payload snapshots, browser shell, static preview, fixture data, local cache, browser storage, State Index, evidence-detail view model, or generated UI state become canonical workflow authority; do not implement local API, live polling, browser-side CLI execution, guarded action execution, scheduler, claim/worktree lifecycle, PR/CI, merge, push, deploy, external services, Trust Verifier cutover, or unrelated cockpit features in this slice.

## Token-Cost Failsafe

policy: `.bandit/policy/token-cost-failsafe.json`

- Stage 1 formation uses local-only default guidance.
- Stage 2, Stage 3, and browser QA should use existing abnormal-run soft budget guidance and avoid brittle caps that force duplicate attempts.
- Stage 4 reviewer runs must record provider timeout, refusal, or continuation evidence honestly; absence of CodeRabbit or Local Qwen output is not pass evidence.
- No paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, external hosted service, hosted preview, merge, push, or deploy authority is approved by this brief.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-067 is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, and roadmap/status synchronization; roadmap and current context authorize Evidence Drilldown And Gate Matrix formation.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, product scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, and UAT requirement.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must write gate-matrix, evidence-detail, fail-closed state rendering, and authority-boundary RED evidence before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any test surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen, risk-classification, supply-chain, review-subject hash, browser smoke, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | CLI-owned product UAT, landing verdict/action, and local-record landing evidence are required before this operator-facing cockpit drilldown view can land.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and bootstrap-gap ledger state are required before the next slice.

## Bootstrap Gaps

- No open bootstrap gap blocks this Phase 8 product slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is available only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Local API, State Index, live polling, guarded action execution, scheduler, claim/worktree lifecycle, cross-repo behavior, merge, push, deploy, and Trust Verifier cutover remain future work outside this slice.

## Expected Files

- docs/specs/BANDIT-068-evidence-drilldown-and-gate-matrix.json
- docs/work/BANDIT-068/brief.md
- docs/work/BANDIT-068/qwen-formation-review.md
- docs/work/BANDIT-068/coderabbit-formation-review.md
- docs/work/BANDIT-068/formation-review.md
- docs/work/BANDIT-068/coordination-log.jsonl
- docs/work/BANDIT-068/red-evidence.md
- docs/work/BANDIT-068/implementation-evidence.md
- docs/work/BANDIT-068/writer-report.md
- docs/work/BANDIT-068/stage3-pm-review.md
- docs/work/BANDIT-068/coderabbit-review.md
- docs/work/BANDIT-068/local-qwen-review.md
- docs/work/BANDIT-068/review-evidence.md
- docs/work/BANDIT-068/uat-approval.md
- docs/work/BANDIT-068/landing-verdict.md
- docs/work/BANDIT-068/landing-action.md
- docs/work/BANDIT-068/retrospective.md
- src/state/cockpit-status.ts
- src/state/cockpit-view-model.ts
- src/state/cockpit-evidence-detail.ts
- src/state/cockpit-actions.ts
- src/cockpit/render.ts
- src/cockpit/browser-shell.ts
- src/cockpit/preview-status-snapshot.ts
- public/cockpit/index.html
- public/cockpit/cockpit.css
- test/cockpit-status.test.mjs
- test/cockpit-view-model.test.mjs
- test/cockpit-evidence-detail.test.mjs
- test/cockpit-browser-shell.test.mjs
- test/cockpit-ui.test.mjs
- test/helpers/cockpit-status-fixture.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Write RED tests for gate-matrix derivation from the current cockpit-status payload, including Stage 0 through Stage 6 source links, missing/stale/bootstrap-gap states, and repair reasons.
- Write RED tests for evidence-detail drilldown rows covering review, review-subject freshness, landing, UAT, coordination, bootstrap-gap replacement evidence, Evidence Trust Signals, and source traceability.
- Write RED tests for browser-shell rendering of dense matrix and drilldown detail with disabled action boundaries and no hidden workflow authority.
- Implement the smallest evidence-detail view-model boundary from existing cockpit status/view-model data without changing canonical cockpit status authority.
- Render the gate matrix and drilldown detail in the existing browser shell/static preview while preserving responsive, accessible, presentation-only behavior.
- Verify desktop/mobile browser preview, focused tests, typecheck, Bandit validation, current cockpit/session-context outputs, review, UAT, landing, and closeout evidence in the normal stage order.

## Smell Triggers

- Any browser, preview file, fixture, generated JSON, local cache, browser storage, screenshot, State Index, evidence-detail view model, or UI component state becoming canonical workflow state is a blocker.
- Any browser code that invokes CLI commands, writes repo artifacts, records UAT, decides landing safety, merges, pushes, deploys, or grants policy/cost/risk authority is a blocker.
- Any evidence-detail mapper that silently normalizes missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, blocked, or operator-owned states into green/ready status is a blocker.
- Any live API, polling loop, State Index, scheduler, claim, worktree, PR/CI, external service, dependency, lockfile, package script, merge, push, deploy, or unrelated Phase 8 feature work inside this slice is scope creep.
- Any desktop or mobile overlap, truncation, inaccessible disabled action, source-path unreadability, hash unreadability, or ambiguous gate/UAT/landing cue in critical operator flows is a product-quality blocker.
- Any large mixed function that combines CLI execution, payload parsing, evidence normalization, gate-matrix rendering, action eligibility, static preview generation, and UI rendering is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-068/brief.md
- docs/work/BANDIT-068/qwen-formation-review.md
- docs/work/BANDIT-068/coderabbit-formation-review.md
- docs/work/BANDIT-068/formation-review.md
- docs/work/BANDIT-068/coordination-log.jsonl
- docs/work/BANDIT-068/red-evidence.md
- docs/work/BANDIT-068/implementation-evidence.md
- docs/work/BANDIT-068/writer-report.md
- docs/work/BANDIT-068/stage3-pm-review.md
- docs/work/BANDIT-068/coderabbit-review.md
- docs/work/BANDIT-068/local-qwen-review.md
- docs/work/BANDIT-068/review-evidence.md
- docs/work/BANDIT-068/uat-approval.md
- docs/work/BANDIT-068/landing-verdict.md
- docs/work/BANDIT-068/landing-action.md
- docs/work/BANDIT-068/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 evidence-drilldown work item or complete Stage 1 formation because the roadmap, accepted cockpit PRD/design artifacts, cockpit boundary, BANDIT-067 closeout, current cockpit status payload, existing browser shell, CLEAN_CODE.md, and Stage Rubrics define a bounded product slice. CLI-owned product UAT is required before landing the operator-facing implementation. Halt for operator input if implementation would choose local API shape, State Index timing, live polling behavior, guarded action execution authority, scheduler execution, claim/worktree lifecycle behavior, automatic merge/push/deploy authority, PR/CI orchestration, external service setup, policy changes, business tradeoffs, explicit cost/risk approvals, Trust Verifier cutover, or genuinely ambiguous product scope.
