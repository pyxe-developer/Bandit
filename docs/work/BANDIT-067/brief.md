# BANDIT-067: Live Cockpit Status View From CLI Payload

## Status

Brief Created

work_type: slice

## Product Work

Create the next operator-facing Workflow Cockpit slice after `BANDIT-066`: a
live-status view that renders the current CLI-derived cockpit status payload in
the browser-served shell. The product value is making the cockpit reflect the
repo's current workflow position without shifting workflow authority into the
browser.

## Origin

This slice is authorized by the Phase 8 product queue after `BANDIT-066`
landed and closed out the browser-served cockpit app shell. Source authority
comes from `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
`docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md`,
`docs/design/workflow-cockpit/design-review.md`,
`docs/design/workflow-cockpit/design-system.md`,
`docs/design/workflow-cockpit/prototype-source/`,
`docs/design/workflow-cockpit-boundary.md`,
`docs/work/BANDIT-066/retrospective.md`, `src/cockpit/browser-shell.ts`,
`src/cockpit/render.ts`, `src/state/cockpit-status.ts`,
`src/state/cockpit-view-model.ts`, `src/state/cockpit-actions.ts`,
`public/cockpit/index.html`, `CLEAN_CODE.md`, and
`docs/verification/STAGE_RUBRICS.md`.

## Goal

Make the browser-served Workflow Cockpit display current live status derived from the `bandit cockpit status --json` payload while preserving CLI authority, repo-native source traceability, and presentation-only browser state.

## Scope

- Use `node ./bin/bandit.mjs cockpit status --json` as the status payload authority for this slice; the browser layer may consume a generated static payload or build-time snapshot from that CLI output but must not invent a separate status model.
- Add a narrow typed adapter that maps the live cockpit-status JSON payload into the existing attention-first cockpit view model and browser shell presentation boundary.
- Update the static local preview so it reflects the current repo status payload for the active or recently closed work item instead of the BANDIT-066 fixture-oriented preview content.
- Display current phase, active or last closed work item, exact next action, operator-input state, blockers or stale evidence, Stage 0 through Stage 6 gate strip, landing readiness, UAT status, coordination state, bootstrap-gap state, improvement-health summary, and source artifact links when those fields are present in the CLI payload.
- Preserve fail-closed and source-linked semantics: missing, stale, contradictory, unavailable, or bootstrap-gap states must render as explicit attention cues rather than unexplained green status.
- Keep guarded action affordances as request-only UI tied to approved CLI command families; this slice may update labels, disabled reasons, and command-family display from live status but must not execute CLI commands from the browser.
- Keep the generated/static payload, browser process, HTML, CSS, fixture data, local cache, browser storage, and any preview script non-canonical and rebuildable from repo-native artifacts.
- Include desktop and mobile preview verification for live-status content, especially long source paths, current next-action text, gate labels, disabled reasons, and dense evidence detail.
- Record CLI-owned product UAT evidence before landing because this slice changes the operator-facing browser cockpit content from static shell preview to current-status view.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns orchestration only after formation approval; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude; Implementation Writer cannot edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent/Codex PM owns Stage 6.
- Token-cost failsafe boundary: use existing token-cost failsafe policy for abnormal reviewer or browser QA execution; this slice approves no paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, merge, push, deploy, external service setup, or hosted preview.

## Out Of Scope

- Do not implement browser-side CLI execution, a local API endpoint, live polling, websocket updates, server-side workflow actions, guarded action execution, State Index persistence, SQLite, browser storage, cross-repo aggregation, scheduler execution, claim leases, work-surface reservations, worktree lifecycle, PR/CI orchestration, automatic merge, push, deploy, or production canary behavior.
- Do not choose local API shape, State Index timing, hosted packaging, external service setup, framework migration, dependency additions, lockfile changes, or package-manager script changes unless a later explicitly authorized slice scopes them.
- Do not let generated JSON, preview files, fixture data, browser state, local cache, screenshots, static HTML, CSS, or UI component state become canonical workflow authority.
- Do not make the UI approve product UAT, policy overrides, business tradeoffs, explicit cost/risk posture, provider-pricing evidence, spend-class policy, Trust Verifier cutover, merge readiness, deploy safety, or landing safety.
- Do not replace current cockpit status, session-context, coordination, review, landing, UAT, retrospective, bootstrap-gap, risk-classification, supply-chain, or Trust Verifier authority.
- Do not implement broad evidence drilldown beyond the live status fields needed for this slice, guarded action execution, improvement analytics, local queue management, or later Phase 8 feature slices.

## Acceptance Criteria

- The source spec and brief identify this as the Phase 8 product slice following `BANDIT-066`, authorized by the roadmap next item `Live Cockpit Status View From CLI Payload`.
- The browser-served cockpit preview renders current status data derived from `node ./bin/bandit.mjs cockpit status --json`, not the stale BANDIT-066 fixture-oriented preview content.
- A typed adapter or equivalent bounded module maps the CLI JSON payload into presentation-ready cockpit view-model data without moving workflow authority into UI components.
- The first screen shows current phase, active or last closed work item, exact next action, operator-input state, blockers or stale evidence, gate strip, landing readiness, UAT status, bootstrap-gap state, coordination state, improvement-health summary, and source artifact links when available in the CLI payload.
- Missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, and blocked states are rendered explicitly with source or reason text rather than hidden or normalized to green.
- Every displayed workflow status remains traceable to source paths or payload source fields; the UI does not synthesize trust without evidence.
- Guarded action affordances remain disabled or request-only unless an approved CLI command family is available; no browser code invokes CLI commands, writes repo artifacts, approves UAT, decides landing safety, merges, pushes, deploys, or changes policy.
- The implementation keeps payload acquisition, payload-to-view-model mapping, browser shell rendering, action affordance rendering, evidence detail rendering, and static preview generation separated enough for clean-code review.
- Responsive verification covers desktop and mobile widths with no overlapping or truncated current next action, work item title, source paths, gate labels, disabled reasons, or evidence detail.
- Accessibility verification covers semantic landmarks, button roles and disabled states, focus order, source-link reachability, and readable status cues for the live-status view.
- Product UAT is recorded through CLI-owned UAT evidence before landing the operator-facing live-status cockpit view.
- Stage 4 review includes Local Qwen and CodeRabbit pre-PR evidence or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification and supply-chain evidence because the slice touches browser-facing source and generated/static preview surfaces.
- The slice does not choose local API shape, State Index timing, live polling, guarded action execution authority, scheduler/claim/worktree behavior, PR/CI behavior, merge/push/deploy authority, external service setup, product policy changes, cost/risk overrides, Trust Verifier cutover, or unrelated Phase 8 feature scope.

## Test Plan

- Write RED tests proving a live cockpit-status JSON payload maps into the attention-first view model with current phase, work item, next action, operator input, blockers/stale evidence, gate strip, landing readiness, UAT, bootstrap gaps, coordination, improvement health, and source links.
- Write RED tests proving the static/browser preview is generated from the live CLI payload or a deterministic saved payload from `bandit cockpit status --json`, not a stale hard-coded work item fixture.
- Write RED tests proving missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, and blocked statuses render with explicit source or reason text.
- Write RED tests proving browser/UI modules do not execute CLI commands, mutate repo artifacts, use browser storage as workflow state, approve UAT, decide landing safety, merge, push, deploy, or bypass CLI Authority.
- Write render or DOM tests for source-link wrapping, disabled guarded actions, action unavailable reasons, gate labels, landing readiness cues, UAT separation, and evidence drilldown content.
- Add responsive verification for desktop and mobile viewports covering text fit, source-path wrapping, button/chip dimensions, evidence panel density, and no overlap.
- Add accessibility checks for landmarks, button roles, disabled-state semantics, focus order, keyboard reachability, source-link reachability, and contrast.
- Run focused cockpit status, cockpit view-model, browser shell, and static preview generation tests after implementation.
- Run npm test if implementation touches shared cockpit status derivation, command routing, validators, action eligibility, render, package scripts, static asset generation, templates, risk classification, or supply-chain surfaces.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json to verify current repo status remains source-linked.
- Run a local browser or Playwright smoke test against the static preview before Stage 4/landing.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-067 --base origin/main before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-067 before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- review-subject-hash BANDIT-067 for aggregate review evidence freshness.
- Record CLI-owned product UAT evidence before landing the operator-facing live-status view.
- Run npm run bandit -- land-check BANDIT-067 before landing.
- Run git diff --check.

## Verification Plan

- Stage 1 formation validation must pass after this brief, Qwen formation review or honest provider-refusal evidence, CodeRabbit formation review or honest provider-timeout evidence, aggregate formation review, and `formation_approved` coordination evidence are recorded.
- Stage 2 must produce RED evidence before implementation and map RED tests to the acceptance criteria for live cockpit-status payload mapping, static/browser preview generation, fail-closed status rendering, authority boundaries, source traceability, responsive behavior, and accessibility states.
- Stage 3 implementation must run through the Claude implementation-writer path if Codex authors or materially edits Stage 2 RED tests, and the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence.
- Stage 4 must record Local Qwen, CodeRabbit pre-PR or provider-refusal evidence, aggregate review evidence, review-subject hash, layered risk-classification, supply-chain gate evidence, browser smoke evidence, and clean-code review because browser-facing and generated/static preview surfaces may be touched.
- Stage 5 must record CLI-owned product UAT approval, landing verdict, land-check, auto-land-check when eligible, and local-record landing-action evidence before any later slice begins.
- Stage 6 must record retrospective, improvement or no-action dispositions, updated `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before creating this brief. The slice must keep CLI-payload acquisition, payload-to-view-model mapping, browser rendering, action affordance rendering, evidence detail rendering, and static preview generation small, explicit, testable, and separated from canonical repo-state authority.

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
- forbidden actions: do not write RED evidence before formation approval; do not run Work Item PM execution before `formation_approved`; do not let Stage 3 Writer edit test surfaces; do not let CLI payload snapshots, browser shell, static preview, fixture data, local cache, browser storage, State Index, or generated UI state become canonical workflow authority; do not implement local API, live polling, browser-side CLI execution, guarded action execution, scheduler, claim/worktree lifecycle, PR/CI, merge, push, deploy, external services, Trust Verifier cutover, or unrelated cockpit features in this slice.

## Token-Cost Failsafe

policy: `.bandit/policy/token-cost-failsafe.json`

- Stage 1 formation uses local-only default guidance.
- Stage 2, Stage 3, and browser QA should use existing abnormal-run soft budget guidance and avoid brittle caps that force duplicate attempts.
- Stage 4 reviewer runs must record provider timeout, refusal, or continuation evidence honestly; absence of CodeRabbit or Local Qwen output is not pass evidence.
- No paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, external hosted service, hosted preview, merge, push, or deploy authority is approved by this brief.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-066 is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, and roadmap/status synchronization; roadmap and current context authorize Live Cockpit Status View From CLI Payload formation.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, product scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, and UAT requirement.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must write live-status payload mapping, browser preview generation, fail-closed status rendering, and authority-boundary RED evidence before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any test surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen, risk-classification, supply-chain, review-subject hash, browser smoke, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | CLI-owned product UAT, landing verdict/action, and local-record landing evidence are required before this operator-facing live-status view can land.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and bootstrap-gap ledger state are required before the next slice.

## Bootstrap Gaps

- No open bootstrap gap blocks this Phase 8 product slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen may be unavailable in non-interactive automation; if so, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Local API, State Index, live polling, guarded action execution, scheduler, claim/worktree lifecycle, cross-repo behavior, merge, push, deploy, and Trust Verifier cutover remain future work outside this slice.

## Expected Files

- docs/specs/BANDIT-067-live-cockpit-status-view-from-cli-payload.json
- docs/work/BANDIT-067/brief.md
- docs/work/BANDIT-067/qwen-formation-review.md
- docs/work/BANDIT-067/coderabbit-formation-review.md
- docs/work/BANDIT-067/formation-review.md
- docs/work/BANDIT-067/coordination-log.jsonl
- docs/work/BANDIT-067/red-evidence.md
- docs/work/BANDIT-067/implementation-evidence.md
- docs/work/BANDIT-067/writer-report.md
- docs/work/BANDIT-067/stage3-pm-review.md
- docs/work/BANDIT-067/coderabbit-review.md
- docs/work/BANDIT-067/local-qwen-review.md
- docs/work/BANDIT-067/review-evidence.md
- docs/work/BANDIT-067/uat-approval.md
- docs/work/BANDIT-067/landing-verdict.md
- docs/work/BANDIT-067/landing-action.md
- docs/work/BANDIT-067/retrospective.md
- src/cockpit/
- src/cockpit/browser-shell.ts
- src/cockpit/render.ts
- src/state/cockpit-status.ts
- src/state/cockpit-view-model.ts
- src/state/cockpit-actions.ts
- public/cockpit/index.html
- public/cockpit/cockpit.css
- test/cockpit-status.test.mjs
- test/cockpit-view-model.test.mjs
- test/cockpit-browser-shell.test.mjs
- test/cockpit-ui.test.mjs
- test/helpers/cockpit-status-fixture.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Write RED tests for live cockpit-status payload mapping into the existing attention-first view model, including current next action, gate strip, blockers, stale evidence, UAT, coordination, bootstrap gaps, improvement health, and source traceability.
- Write RED tests for static/browser preview generation from a current CLI payload or deterministic saved payload while preserving CLI Authority and presentation-only state.
- Implement the smallest typed adapter from `CockpitStatus` to cockpit view-model/browser shell data without changing canonical cockpit status authority.
- Refresh the static local preview using live-status-derived data and preserve the app-shell visual/accessibility/responsive constraints from BANDIT-066.
- Verify desktop/mobile browser preview, focused tests, typecheck, Bandit validation, current cockpit/session-context outputs, review, UAT, landing, and closeout evidence in the normal stage order.

## Smell Triggers

- Any browser, preview file, fixture, generated JSON, local cache, browser storage, screenshot, State Index, or UI component state becoming canonical workflow state is a blocker.
- Any browser code that invokes CLI commands, writes repo artifacts, records UAT, decides landing safety, merges, pushes, deploys, or grants policy/cost/risk authority is a blocker.
- Any adapter that silently normalizes missing, stale, contradictory, unavailable, `bootstrap_gap`, `not_applicable`, or blocked states into green/ready status is a blocker.
- Any live API, polling loop, State Index, scheduler, claim, worktree, PR/CI, external service, dependency, lockfile, package script, merge, push, deploy, or unrelated Phase 8 feature work inside this slice is scope creep.
- Any desktop or mobile overlap, truncation, inaccessible disabled action, source-path unreadability, or ambiguous gate/UAT/landing cue in critical operator flows is a product-quality blocker.
- Any large mixed function that combines CLI execution, payload parsing, view-model mapping, action eligibility, evidence rendering, static preview generation, and UI rendering is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-067/brief.md
- docs/work/BANDIT-067/qwen-formation-review.md
- docs/work/BANDIT-067/coderabbit-formation-review.md
- docs/work/BANDIT-067/formation-review.md
- docs/work/BANDIT-067/coordination-log.jsonl
- docs/work/BANDIT-067/red-evidence.md
- docs/work/BANDIT-067/implementation-evidence.md
- docs/work/BANDIT-067/writer-report.md
- docs/work/BANDIT-067/stage3-pm-review.md
- docs/work/BANDIT-067/coderabbit-review.md
- docs/work/BANDIT-067/local-qwen-review.md
- docs/work/BANDIT-067/review-evidence.md
- docs/work/BANDIT-067/uat-approval.md
- docs/work/BANDIT-067/landing-verdict.md
- docs/work/BANDIT-067/landing-action.md
- docs/work/BANDIT-067/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 live-status cockpit work item or complete Stage 1 formation because the roadmap, accepted cockpit PRD/design artifacts, cockpit boundary, BANDIT-066 closeout, current cockpit status payload, existing browser shell, CLEAN_CODE.md, and Stage Rubrics define a bounded product slice. CLI-owned product UAT is required before landing the operator-facing implementation. Halt for operator input if implementation would choose local API shape, State Index timing, live polling behavior, guarded action execution authority, scheduler execution, claim/worktree lifecycle behavior, automatic merge/push/deploy authority, PR/CI orchestration, external service setup, policy changes, business tradeoffs, explicit cost/risk approvals, Trust Verifier cutover, or genuinely ambiguous product scope.
