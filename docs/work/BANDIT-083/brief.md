# BANDIT-083: Bandit Cockpit UI Polish From Attached Design

## Status

Brief Created

work_type: slice

## Product Work

Adapt the existing browser-served Workflow Cockpit toward the attached
three-pane Evidence Row design source while preserving Bandit's CLI Authority,
repo-native source links, presentation-only browser boundary, and normal
product UAT/review/landing gates. The product value is faster operator scanning
of gate state, active work, attention, evidence, and safe action-request
affordances without turning the cockpit into workflow authority.

## Origin

This slice is authorized by the Phase 8 intake-derived product queue after
`BANDIT-082` landed and closed the Work Intake Ledger And Followups Migration
slice. Source authority comes from `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, `.bandit/work-intake-ledger.json` entry
`WIL-UI-POLISH`, `FOLLOWUPS.md` deprecated source metadata,
`docs/design/workflow-cockpit/bandit-ui-polish-source.md`, prior cockpit
implementation and UI slices, `CLEAN_CODE.md`, and
`docs/verification/STAGE_RUBRICS.md`.

## Goal

Adapt the current browser-served Bandit Workflow Cockpit toward the attached static three-pane Evidence Row design language while preserving CLI authority, repo-native source links, read-only browser behavior, and normal UAT/review/landing gates.

## Scope

- Use WIL-UI-POLISH as the intake-derived source proposal and form a bounded Phase 8 product-polish slice for the existing browser-served cockpit.
- Adapt the current cockpit visual language toward the attached design traits recorded in docs/design/workflow-cockpit/bandit-ui-polish-source.md: dense three-pane layout, attention navigation, active-work center, evidence/context rail, near-black canvas, coral attention accent, green pass state, red fail state, restrained blue source links, Instrument Sans and IBM Plex Mono typography where feasible, compact cards, 4px spacing grid, controls at 8px radius or less, and Evidence Row as the signature gate-state pattern.
- Keep the cockpit read-only and presentation-only: all displayed work, evidence, queue, attention, inbox, action, status, and source-link state must be derived from Bandit CLI payloads or repo-native artifacts.
- Preserve and visually clarify existing cockpit surfaces from prior Phase 8 slices, including status, evidence matrix, improvement health, queue/context, operator attention or inbox, and guarded CLI action request affordances where present.
- Improve responsive desktop and mobile presentation for the three-pane or collapsed layout, Evidence Rows, source links, status chips, action request rows, attention states, evidence detail rail, and current/next work labels without overlap, truncation, or layout shifts.
- Use the design package as product/design source material only; do not make the static design files, preview payloads, screenshots, generated HTML, generated CSS, local cache, browser storage, or design system canonical workflow state.
- Keep source code changes localized to the cockpit view-model/render/static preview surfaces and supporting tests unless Stage 2 evidence proves a narrowly necessary helper boundary.
- Record CLI-owned product UAT evidence before landing because the slice changes the operator-facing cockpit surface.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns orchestration only after formation approval; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to a different model-family Writer through the approved bootstrap route; Implementation Writer cannot edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent/Codex PM owns Stage 6.
- Token-cost failsafe boundary: use existing abnormal-run soft budget guidance for browser QA and reviewer execution; this slice approves no paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, merge, push, deploy, external service setup, hosted preview, public benchmark publication, or live action execution.

## Out Of Scope

- Do not implement new workflow authority, browser-side CLI execution, local API endpoints, live polling, websocket updates, State Index persistence, SQLite, browser storage as workflow state, notification delivery, scheduler execution, claim leases, worktree lifecycle, queue prioritization controls, or work intake mutation.
- Do not add, resolve, archive, approve, or mutate Operator Inbox, UAT, landing, review, improvement, roadmap, bootstrap-gap, queue, action-request, or Trust Verifier state from the browser.
- Do not run, form, score, publish, or create repos for the V0 Closeout Claude Code A/B Product-Value Trial.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace or wrap old gates, approve guarded action execution authority, approve public benchmark publication, approve paid reviewer/model routing, approve hosted services, merge, push, deploy, or start unrelated Phase 8 product work.
- Do not change package dependencies, lockfiles, CI/release workflow, external service configuration, telemetry, authentication, authorization, billing, production data, or secrets handling for visual polish.
- Do not copy the attached static design verbatim in a way that discards existing Bandit evidence hierarchy, source-link semantics, read-only boundaries, accessibility, or responsive constraints.

## Acceptance Criteria

- The source spec and brief identify this as the next authorized intake-derived Phase 8 product slice from WIL-UI-POLISH after BANDIT-082 closeout, with no open bootstrap gaps and no required operator-owned input for Stage 1 formation.
- The cockpit adopts the attached design's dense three-pane Evidence Row visual direction in a way that remains recognizably Bandit and preserves the existing repo-native evidence hierarchy.
- Evidence Row or equivalent gate rows become the primary visual pattern for stage/gate state, with clear pass, blocker, non_blocking, bootstrap_gap, unavailable, stale, and source-missing states.
- The UI keeps source artifact paths, current/next action text, work item IDs, required operator input, action-request affordance state, evidence freshness, and status labels readable on desktop and mobile.
- The cockpit remains presentation-only: browser/render/view-model/static preview code does not execute CLI commands, write repo artifacts, record approvals, record UAT, decide landing safety, schedule work, claim work, mutate intake, merge, push, deploy, change policy, route models, or treat generated UI state as canonical.
- The implementation keeps data derivation, status/evidence mapping, action-request presentation, layout rendering, CSS/design-token styling, and static preview generation separated enough for clean-code review.
- Responsive verification covers desktop and mobile widths with no overlapping or truncated source paths, work item IDs, status chips, attention labels, action request rows, Evidence Rows, side-rail content, or current/next text.
- Accessibility verification covers semantic grouping, keyboard focus order, source-link reachability, readable contrast, non-color-only status cues, and distinguishable pass/blocker/non_blocking/bootstrap_gap/unavailable/stale states.
- Product UAT is recorded through CLI-owned UAT evidence before landing the operator-facing UI polish.
- Stage 4 review includes Local Qwen through the authorized MLX adapter route and CodeRabbit pre-PR evidence or honest provider-timeout/bootstrap replacement evidence, with layered risk-classification and supply-chain evidence because browser-facing source and operator-decision presentation surfaces may be touched.
- The slice does not choose local API shape, State Index timing, live polling, scheduler/claim/worktree behavior, PR/CI behavior, merge/push/deploy authority, external service setup, product policy changes, cost/risk overrides, public benchmark publication, Trust Verifier cutover, or unrelated Phase 8 feature scope.

## Test Plan

- Write RED tests proving cockpit view-model or render inputs map stage/gate evidence into Evidence Row presentation states with source artifacts, freshness, owner, and pass/blocker/non_blocking/bootstrap_gap/unavailable/stale distinctions.
- Write RED tests proving current/next action, work item ID, required operator input, queue/context, operator attention or inbox, and guarded action-request affordance state remain source-linked and read-only after visual polish.
- Write RED tests proving browser/UI modules do not execute CLI commands, mutate repo artifacts, use browser storage as workflow state, record approvals, record UAT, decide landing safety, schedule work, claim work, mutate intake, merge, push, deploy, change policy, route models, or bypass CLI Authority.
- Write render or DOM tests for Evidence Rows, three-pane or collapsed layout regions, status chips, source links, action rows, evidence rail, focus order, and unavailable or empty states.
- Add responsive verification for desktop and mobile viewports covering text fit, source-path wrapping, stable row dimensions, compact cards, status chips, side rail collapse, and no overlap.
- Add accessibility checks for landmarks, keyboard reachability, source-link reachability, contrast, and screen-reader distinguishability for trusted evidence states.
- Run focused cockpit view-model, evidence-detail, action presentation, browser shell, static preview, and UI tests after implementation.
- Run npm test if implementation touches shared cockpit status derivation, action request rendering, evidence detail, queue/context, operator attention, command routing, validators, package scripts, static asset generation, templates, risk classification, supply-chain surfaces, or UAT/landing display.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json to verify current repo status remains source-linked.
- Run local browser or Playwright desktop/mobile smoke tests against the static cockpit preview before Stage 4 or landing.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-083 --base origin/main before Stage 4 closeout unless provider refusal evidence is recorded.
- Run Local Qwen only through .bandit/reviewers/local-qwen.json via node bin/omlx-chat-completions.mjs; if the endpoint or adapter is unavailable, stop and ask the operator for help.
- Run npm run bandit -- review-subject-hash BANDIT-083 for aggregate review evidence freshness.
- Record CLI-owned product UAT evidence before landing the operator-facing UI polish.
- Run npm run bandit -- land-check BANDIT-083 before landing.
- Run git diff --check.

## Verification Plan

- Stage 1 formation validation must pass after this brief, Local Qwen
  formation review, CodeRabbit formation review or provider-timeout evidence,
  aggregate formation review, and `formation_approved` coordination evidence
  are recorded.
- Stage 2 must produce RED evidence before implementation and map tests to
  Evidence Row state mapping, source-link preservation, read-only browser
  authority, responsive layout, accessibility, render behavior, and
  browser/static-preview smoke coverage.
- Stage 3 implementation must use a different model-family implementation
  writer if Codex authors or materially edits Stage 2 RED tests, and the Stage
  3 Writer has no authority to edit tests, test helpers, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, or retrospective evidence.
- Stage 4 must record Local Qwen, CodeRabbit pre-PR or provider-timeout
  evidence, aggregate review evidence, review-subject hash, layered
  risk-classification, supply-chain gate evidence when applicable, browser
  smoke evidence, and clean-code review because browser-facing and
  operator-decision presentation surfaces may be touched.
- Stage 5 must record CLI-owned product UAT approval, landing verdict,
  land-check, auto-land-check when eligible, and local-record landing-action
  evidence before any later slice begins.
- Stage 6 must record retrospective, improvement or no-action dispositions,
  updated `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-09 before creating this spec. The slice must keep visual styling, status/evidence derivation, source-link mapping, action-row presentation, responsive layout behavior, and static preview generation small, explicit, testable, and separated from canonical workflow authority.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation, source-spec repair, formation review
  routing, formation approval, and context synchronization.
- Work Item PM owns orchestration only after `formation_approved`; it may not
  write tests, implementation, reviewer evidence, landing evidence, UAT
  evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, and
  acceptance mappings.
- Implementation Writer owns Stage 3 source implementation only. If Codex
  authors or materially edits Stage 2 RED tests, Stage 3 implementation must
  use a different model-family implementation writer during bootstrap unless an
  operator-approved policy exception is recorded.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, or acceptance mappings for this Work Item.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires
  different-model-family Stage 3 implementation, and verification escalation
  returns to Codex PM because the implementation writer authored the source
  change.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
  verdict/action evidence. The operator owns product UAT approval. Closeout
  Agent/Codex PM owns Stage 6 retrospective and closeout evidence.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-082 is landed and closed with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, roadmap/status synchronization, and no open bootstrap gaps; CURRENT_CONTEXT.md, ROADMAP.md, and .bandit/work-intake-ledger.json authorize WIL-UI-POLISH as the next formation target.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, product scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, source-of-truth boundary, required evidence, and forbidden actions.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must write visual-state mapping, source-link preservation, read-only authority-boundary, responsive, accessibility, render, and browser/static-preview RED evidence before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit any test surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen, risk-classification, supply-chain as applicable, review-subject hash, browser smoke, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | CLI-owned product UAT, landing verdict/action, and local-record landing evidence are required before this operator-facing UI polish can land.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and bootstrap-gap ledger state are required before the next slice.

## Bootstrap Gaps

- No open bootstrap gap blocks this Phase 8 product-polish slice.
- The attached design package is source material only; repo-native Bandit artifacts and CLI payloads remain the authority for workflow state.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is available only through .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs against the MLX OpenAI-compatible endpoint at http://127.0.0.1:8000/v1; the direct qwen CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another route.
- Local API, State Index, live polling, guarded action execution, scheduler, claim/worktree lifecycle, work intake mutation, inbox mutation, cross-repo behavior, merge, push, deploy, public benchmark publication, paid routing, hosted services, and Trust Verifier cutover remain future work outside this slice.

## Expected Files

- docs/specs/BANDIT-083-bandit-cockpit-ui-polish-from-attached-design.json
- docs/work/BANDIT-083/brief.md
- docs/work/BANDIT-083/qwen-formation-review.md
- docs/work/BANDIT-083/coderabbit-formation-review.md
- docs/work/BANDIT-083/formation-review.md
- docs/work/BANDIT-083/coordination-log.jsonl
- docs/work/BANDIT-083/red-evidence.md
- docs/work/BANDIT-083/implementation-evidence.md
- docs/work/BANDIT-083/writer-report.md
- docs/work/BANDIT-083/stage3-pm-review.md
- docs/work/BANDIT-083/coderabbit-review.md
- docs/work/BANDIT-083/local-qwen-review.md
- docs/work/BANDIT-083/review-evidence.md
- docs/work/BANDIT-083/uat-approval.md
- docs/work/BANDIT-083/landing-verdict.md
- docs/work/BANDIT-083/landing-action.md
- docs/work/BANDIT-083/retrospective.md
- src/state/cockpit-view-model.ts
- src/state/cockpit-evidence-detail.ts
- src/state/cockpit-actions.ts
- src/cockpit/render.ts
- src/cockpit/browser-shell.ts
- src/cockpit/preview-status-snapshot.ts
- public/cockpit/index.html
- public/cockpit/cockpit.css
- test/cockpit-view-model.test.mjs
- test/cockpit-evidence-detail.test.mjs
- test/cockpit-actions.test.mjs
- test/cockpit-browser-shell.test.mjs
- test/cockpit-ui.test.mjs
- test/helpers/cockpit-status-fixture.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Write RED tests for Evidence Row state mapping and source-linked visual status semantics.
- Write RED tests for read-only browser authority boundaries across cockpit render, browser shell, action request rows, and static preview behavior.
- Write RED tests for responsive three-pane or collapsed layout behavior, source-path wrapping, status chip stability, focus order, and inaccessible-state refusal.
- Implement the smallest visual polish and helper/view-model changes needed to satisfy the RED evidence without changing canonical workflow state.
- Update CSS/static preview/browser render assets to adapt the attached design traits while preserving existing Bandit source links and evidence hierarchy.
- Verify desktop/mobile browser preview, focused tests, typecheck, Bandit validation, current cockpit/session-context outputs, review, UAT, landing, and closeout evidence in the normal stage order.

## Smell Triggers

- Any browser, preview file, design token, CSS variable, fixture, generated JSON, local cache, browser storage, screenshot, static design artifact, view model, or UI component state becoming canonical workflow state is a blocker.
- Any browser code that invokes CLI commands, writes repo artifacts, records approvals, records UAT, decides landing safety, schedules work, claims work, mutates intake, merges, pushes, deploys, grants policy/cost/risk authority, publishes benchmark claims, routes models, or starts guarded action execution is a blocker.
- Any UI polish that hides missing, stale, contradictory, unavailable, unsupported, operator-owned, not-yet-formed, deferred, blocked, bootstrap_gap, or source-missing states behind a generic healthy/complete state is a blocker.
- Any label, button, affordance, or layout that implies browser-owned approval storage, UAT acceptance, policy override, inbox resolution, action execution, backlog management, priority editing, scheduler authority, claimability, workstream assignment, public benchmark proof, merge, push, deploy, Trust Verifier cutover, paid routing, or external service authority is a blocker.
- Any live API, polling loop, State Index, scheduler, claim, worktree, PR/CI, external service, dependency, lockfile, package script, merge, push, deploy, benchmark publication, or unrelated Phase 8 feature work inside this slice is scope creep.
- Any desktop or mobile overlap, truncation, inaccessible evidence state, unreadable source path, unreadable work item ID, ambiguous status chip, hidden keyboard target, or non-color-only state regression in critical operator flows is a product-quality blocker.
- Any large mixed function that combines CLI execution, payload parsing, status derivation, action-request mutation, evidence normalization, static preview generation, and UI rendering is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-083/brief.md
- docs/work/BANDIT-083/qwen-formation-review.md
- docs/work/BANDIT-083/coderabbit-formation-review.md
- docs/work/BANDIT-083/formation-review.md
- docs/work/BANDIT-083/coordination-log.jsonl
- docs/work/BANDIT-083/red-evidence.md
- docs/work/BANDIT-083/implementation-evidence.md
- docs/work/BANDIT-083/writer-report.md
- docs/work/BANDIT-083/stage3-pm-review.md
- docs/work/BANDIT-083/coderabbit-review.md
- docs/work/BANDIT-083/local-qwen-review.md
- docs/work/BANDIT-083/review-evidence.md
- docs/work/BANDIT-083/uat-approval.md
- docs/work/BANDIT-083/landing-verdict.md
- docs/work/BANDIT-083/landing-action.md
- docs/work/BANDIT-083/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Bandit Cockpit UI Polish From Attached Design work item or complete Stage 1 formation because CURRENT_CONTEXT.md, ROADMAP.md, .bandit/work-intake-ledger.json, FOLLOWUPS.md source metadata, and docs/design/workflow-cockpit/bandit-ui-polish-source.md identify WIL-UI-POLISH as the next intake-derived product slice; BANDIT-082 is landed and closed; no bootstrap gaps remain open; and this spec keeps the design adaptation presentation-only with normal future UAT. CLI-owned product UAT is required before landing the operator-facing implementation. Halt for operator input if implementation would change product direction beyond the recorded design source, choose local API shape, choose State Index timing, add live polling, approve guarded action execution authority, approve scheduler execution, approve claim/worktree lifecycle behavior, approve automatic merge/push/deploy authority, approve PR/CI orchestration, approve external service setup, approve benchmark publication, change policy, approve business tradeoffs, approve explicit cost/risk posture, approve Trust Verifier cutover, or resolve genuinely ambiguous product scope.

## Stage Capability Scope

policy: `.bandit/policy/stage-capability-scope.json`

- stages: `stage1_brief`, `formation_review`, `work_item_pm_plan_mode`,
  `stage2_red_evidence`, `stage3_implementation`, `stage4_review`,
  `feature_uat`, `stage5_landing`, `stage6_retrospective`.
- authority roles: `codex_pm`, `repo_pm`, `work_item_pm`, `test_writer`,
  `implementation_writer`, `reviewer`, `landing_agent`, `closeout_agent`,
  `operator`.
- required skills: `bandit`, `tdd`, `review`, `frontend-design`.
- allowed tools: repo-local CLI commands, focused tests, typecheck, local
  browser or Playwright smoke verification when implementation updates the
  browser-served preview.
- forbidden actions: do not write RED evidence before formation approval; do
  not run Work Item PM execution before `formation_approved`; do not let Stage
  3 Writer edit test surfaces; do not let CLI payload snapshots, static design
  files, design tokens, generated previews, browser shell, fixture data, local
  cache, browser storage, State Index, view models, or generated UI state
  become canonical workflow authority; do not implement local API, live
  polling, browser-side CLI execution, guarded action execution, inbox
  mutation, work intake mutation, scheduler, claim/worktree lifecycle, PR/CI,
  merge, push, deploy, external services, public benchmark publication, Trust
  Verifier cutover, paid routing, or unrelated cockpit features in this slice.

## Token-Cost Failsafe

policy: `.bandit/policy/token-cost-failsafe.json`

- Stage 1 formation uses local-only default guidance.
- Stage 2, Stage 3, and browser QA should use existing abnormal-run soft budget
  guidance and avoid brittle caps that force duplicate attempts.
- Stage 4 reviewer runs must record provider timeout, refusal, or continuation
  evidence honestly; absence of CodeRabbit or Local Qwen output is not pass
  evidence.
- No paid provider-pricing evidence, spend-class approval, paid reviewer
  promotion, recurring paid routing, external hosted service, hosted preview,
  public benchmark publication, guarded action execution, notification service,
  merge, push, or deploy authority is approved by this brief.
