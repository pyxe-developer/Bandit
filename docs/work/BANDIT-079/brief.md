# BANDIT-079: Improvement Health Surface

## Status

Brief Created

work_type: slice

## Product Work

Create the next operator-facing Workflow Cockpit slice after `BANDIT-078`: a
compact Improvement Health surface that makes Bandit's workflow-learning loop
visible from existing repo-native evidence. The product value is helping the
operator see whether lessons are becoming evaluated workflow improvements
without making the browser an evaluator, scheduler, or source of truth.

## Origin

This slice is authorized by the Phase 8 product queue after `BANDIT-078`
landed and closed out the Guarded CLI Action Requests slice, and after the
bootstrap-gap ledger reported no open gaps. Source authority comes from
`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
`docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md`,
`docs/design/workflow-cockpit/design-review.md`,
`docs/design/workflow-cockpit/design-system.md`,
`docs/design/workflow-cockpit/prototype-source/`,
`docs/design/workflow-cockpit-boundary.md`,
`docs/decisions/2026-05-24-workflow-improvement-engine.md`,
`docs/improvement/metrics-catalog.md`,
`docs/improvement/retrospective-chore-schema.md`,
`docs/work/BANDIT-029/retrospective.md`,
`docs/work/BANDIT-037/retrospective.md`,
`docs/work/BANDIT-078/improvement-disposition.md`,
`src/state/cockpit-status.ts`, `src/state/cockpit-view-model.ts`,
`src/state/cockpit-actions.ts`, `src/state/cockpit-evidence-detail.ts`,
`src/cockpit/render.ts`, `src/cockpit/browser-shell.ts`, `CLEAN_CODE.md`,
and `docs/verification/STAGE_RUBRICS.md`.

## Goal

Make the browser-served Workflow Cockpit expose a compact, source-linked Improvement Health surface that shows whether Bandit's workflow-learning loop is healthy, including pending improvement candidates, evaluated outcomes, due or missing evaluation guardrails, repeated smells or cross-model tension signals, and keep/revise/revert/double_down decisions, without turning the cockpit into an improvement engine, scheduler, or canonical state store.

## Scope

- Use existing repo-native improvement artifacts and derived CLI outputs as authority inputs, including `npm run bandit -- improvements candidates --json`, `node ./bin/bandit.mjs cockpit status --json`, retrospective improvement sections, reviewer finding dispositions, and improvement schema/metrics docs.
- Add or deepen a presentation-only improvement-health view-model boundary that can summarize queued candidates, evaluated candidates, outcome counts, due or blocked evaluation windows, missing guardrail metadata, source artifacts, metrics, baselines, expected direction, and next evaluation route.
- Render a compact Improvement Health surface in the existing browser cockpit so the operator can scan the workflow-learning loop from the first screen and inspect detail one level down through source-linked rows.
- Show pending, candidate, queued_candidate, evaluated, keep, revise, revert, double_down, missing-metadata, not-due, and due-evaluation states honestly instead of flattening them into a generic green health badge.
- Expose workflow-trial guardrails where available: predeclared decision criteria, uncertainty or minimum-detectable-effect context, re-evaluation window, proxy-risk notes, and proxy-risk disposition for policy-changing decisions.
- Summarize repeated smell and cross-model tension patterns only from recorded repo-native artifacts; missing or incomplete evidence must be shown as missing or not available rather than inferred.
- Keep implementation read-only and derived: no browser state, generated snapshots, local cache, SQLite, preview data, or view-model row may become canonical improvement state.
- Do not create, evaluate, complete, or disposition improvement chores in this slice except through future Stage 6 closeout for this Work Item; this slice displays and links existing improvement evidence.
- Keep Phase 8 cockpit product scope narrow: improve the existing cockpit surface and tests without choosing local API shape, State Index timing, live polling, scheduler behavior, hosted services, or broader historical analytics.
- Include desktop and mobile verification for improvement-health cards, source paths, candidate IDs, outcome labels, metric and baseline text, guardrail summaries, and detail rows with no overlap or truncation.
- Record CLI-owned product UAT evidence before landing because this slice changes the operator-facing cockpit surface.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns orchestration only after formation approval; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude-family Writer unless an operator-approved policy exception is recorded; Implementation Writer cannot edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent/Codex PM owns Stage 6.
- Token-cost failsafe boundary: use existing token-cost failsafe policy for abnormal reviewer or browser QA execution; this slice approves no paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, merge, push, deploy, external service setup, hosted preview, or live action execution.

## Out Of Scope

- Do not implement an automatic improvement scheduler, heartbeat executor, background evaluator, claim/worktree lifecycle, local queue manager, cross-repo aggregation, hidden improvement index, State Index persistence, SQLite, browser storage as workflow state, local API endpoints, live polling, websocket updates, or server-side workflow actions.
- Do not automatically evaluate candidates, mark outcomes, create new improvement chores, change workflow policy, record keep/revise/revert/double_down decisions, or schedule re-evaluation windows outside explicit repo-native evidence and later stage closeout for this Work Item.
- Do not infer causality from metric movement, present single-repo observations as statistical proof, hide missing decision criteria, or omit uncertainty/minimum-detectable-effect context for workflow-trial or policy-changing items.
- Do not implement guarded action execution, browser-side CLI execution, UAT approval, landing approval, merge, push, deploy, production canary behavior, PR/CI orchestration, dynamic model routing, paid reviewer/model routing, hosted replay services, external telemetry, or Trust Verifier cutover.
- Do not replace current improvements CLI, cockpit status, session-context, coordination, review, landing, UAT, retrospective, bootstrap-gap, risk-classification, supply-chain, artifact-create, work-item-create, or Trust Verifier authority.
- Do not implement local queue management, historical analytics beyond compact existing-artifact summaries, State Index, live action execution, or broader Phase 8 cockpit product scope inside this slice.

## Acceptance Criteria

- The source spec and brief identify this as the Phase 8 product slice following `BANDIT-078`, authorized by the roadmap next item `Improvement Health Surface` after no open bootstrap gaps remain.
- The cockpit exposes a compact Improvement Health surface derived from repo-native improvement artifacts and derived CLI outputs, not from browser-owned workflow state.
- A bounded view-model or helper maps improvement candidates and evaluated outcomes into presentation-ready health rows with candidate id, status, outcome, source work item, source artifacts, metric, baseline, expected direction, evaluation window, and next route.
- The surface distinguishes pending/queued/candidate/evaluated items and keep/revise/revert/double_down outcomes without collapsing missing metadata, not-due items, due evaluations, or blocked evaluations into a generic healthy state.
- Workflow Trial and workflow-policy candidates expose guardrail completeness, decision criteria, uncertainty or minimum-detectable-effect context, re-evaluation windows, and proxy-risk notes where available; missing guardrails render as fail-closed presentation states.
- Repeated smell and cross-model tension summaries are sourced only from recorded retrospectives, reviewer dispositions, or improvement metadata and link back to their source artifacts.
- No browser/UI code creates or evaluates candidates, records outcomes, writes improvement artifacts, mutates repo state, invokes CLI commands, schedules background work, changes workflow policy, or treats generated UI state as canonical.
- The implementation keeps improvement candidate parsing, health derivation, evidence-detail mapping, browser rendering, and static preview generation separated enough for clean-code review.
- Responsive verification covers desktop and mobile widths with no overlapping or truncated candidate IDs, outcome labels, metric/baseline text, guardrail summaries, source paths, status chips, or dense detail rows.
- Accessibility verification covers semantic grouping, keyboard focus order, readable status cues, source-link reachability, and distinguishable missing/due/evaluated states.
- Product UAT is recorded through CLI-owned UAT evidence before landing the operator-facing Improvement Health surface.
- Stage 4 review includes Local Qwen and CodeRabbit pre-PR evidence or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification and supply-chain evidence because the slice touches browser-facing source and workflow-improvement presentation surfaces.
- The slice does not choose local API shape, State Index timing, live polling, scheduler/claim/worktree behavior, PR/CI behavior, merge/push/deploy authority, external service setup, product policy changes, cost/risk overrides, Trust Verifier cutover, or unrelated Phase 8 feature scope.

## Test Plan

- Write RED tests proving repo-native improvement candidate data maps into compact health rows with id, status, outcome, source work item, source artifacts, metric, baseline, expected direction, evaluation window, and next route.
- Write RED tests proving evaluated keep/revise/revert/double_down outcomes and pending/candidate/queued_candidate states render distinctly from due, not-due, missing-metadata, and blocked-evaluation states.
- Write RED tests proving workflow-trial guardrail completeness is shown without presenting metric movement as causal proof, including missing decision criteria, uncertainty/minimum-detectable-effect context, re-evaluation window, and proxy-risk notes.
- Write RED tests proving repeated smell and cross-model tension summaries only use recorded repo-native source artifacts and fail closed when evidence is missing or malformed.
- Write RED tests proving browser/UI modules do not execute CLI commands, mutate repo artifacts, use browser storage as workflow state, evaluate candidates, record outcomes, schedule background work, change policy, merge, push, deploy, or bypass CLI Authority.
- Write render or DOM tests for improvement-health cards, detail rows, source links, candidate IDs, outcome labels, guardrail summaries, focus order, and missing/due/evaluated state labels.
- Add responsive verification for desktop and mobile viewports covering text fit, source-path wrapping, chip dimensions, guardrail density, metric/baseline text, and no overlap.
- Add accessibility checks for landmarks around the improvement-health section, keyboard reachability, source-link reachability, contrast, and screen-reader distinguishability for missing, pending, evaluated, and due states.
- Run focused cockpit improvement-health, cockpit view-model, evidence-detail, browser shell, static preview, and UI tests after implementation.
- Run focused improvements tests if implementation touches improvement candidate parsing or report normalization.
- Run npm test if implementation touches shared cockpit status derivation, improvement metadata parsing, command routing, validators, render, package scripts, static asset generation, templates, risk classification, supply-chain surfaces, or UAT/landing display.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- improvements candidates --json.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json to verify current repo status remains source-linked.
- Run a local browser or Playwright smoke test against the static preview before Stage 4/landing.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-079 --base origin/main before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-079 before Stage 4 closeout unless provider refusal evidence is recorded.
- Run npm run bandit -- review-subject-hash BANDIT-079 for aggregate review evidence freshness.
- Record CLI-owned product UAT evidence before landing the operator-facing Improvement Health surface.
- Run npm run bandit -- land-check BANDIT-079 before landing.
- Run git diff --check.

## Verification Plan

- Stage 1 formation validation must pass after this brief, Qwen formation
  review, CodeRabbit formation review or provider-timeout evidence, aggregate
  formation review, and `formation_approved` coordination evidence are
  recorded.
- Stage 2 must produce RED evidence before implementation and map tests to
  improvement-health derivation, guardrail completeness, missing-state
  fail-closed rendering, source traceability, browser authority boundaries,
  responsive behavior, and accessibility states.
- Stage 3 implementation must use a different model-family implementation
  writer if Codex authors or materially edits Stage 2 RED tests, and the Stage
  3 Writer has no authority to edit tests, test helpers, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, or retrospective evidence.
- Stage 4 must record Local Qwen, CodeRabbit pre-PR or provider-timeout
  evidence, aggregate review evidence, review-subject hash, layered
  risk-classification, supply-chain gate evidence, browser smoke evidence, and
  clean-code review because browser-facing and workflow-improvement
  presentation surfaces may be touched.
- Stage 5 must record CLI-owned product UAT approval, landing verdict,
  land-check, auto-land-check when eligible, and local-record landing-action
  evidence before any later slice begins.
- Stage 6 must record retrospective, improvement or no-action dispositions,
  updated `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-08 before creating this brief. The slice must keep improvement candidate parsing, improvement-health derivation, evidence-detail mapping, browser rendering, and static preview generation small, explicit, testable, and separated from canonical repo-state authority.

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
  use a different model family during bootstrap unless an operator-approved
  policy exception is recorded.
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
  3 Writer edit test surfaces; do not let CLI payload snapshots, improvement
  candidate reports, browser shell, static preview, fixture data, local cache,
  browser storage, State Index, improvement-health view model, or generated UI
  state become canonical workflow authority; do not implement local API, live
  polling, browser-side CLI execution, automatic improvement evaluation,
  scheduler, guarded action execution, claim/worktree lifecycle, PR/CI, merge,
  push, deploy, external services, Trust Verifier cutover, paid routing, or
  unrelated cockpit features in this slice.

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
  automatic improvement evaluation service, guarded action execution, merge,
  push, or deploy authority is approved by this brief.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-078 is landed and closed out with verification, landing verdict, landing-action evidence, UAT evidence, retrospective, improvement disposition, bootstrap-gap disposition, roadmap/status synchronization, and no open bootstrap gaps; roadmap and current context authorize Improvement Health Surface triage/formation if product direction is sufficient.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, product scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, and UAT requirement.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must write improvement-health derivation, guardrail completeness, fail-closed missing-state rendering, source-traceability, and authority-boundary RED evidence before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit any test surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen, risk-classification, supply-chain, review-subject hash, browser smoke, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | CLI-owned product UAT, landing verdict/action, and local-record landing evidence are required before this operator-facing improvement-health surface can land.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and bootstrap-gap ledger state are required before the next slice.

## Bootstrap Gaps

- No open bootstrap gap blocks this Phase 8 product slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is available only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another route.
- Automatic improvement evaluation, scheduler execution, local API, State Index, live polling, guarded action execution, claim/worktree lifecycle, cross-repo behavior, merge, push, deploy, and Trust Verifier cutover remain future work outside this slice.

## Expected Files

- docs/specs/BANDIT-079-improvement-health-surface.json
- docs/work/BANDIT-079/brief.md
- docs/work/BANDIT-079/qwen-formation-review.md
- docs/work/BANDIT-079/coderabbit-formation-review.md
- docs/work/BANDIT-079/formation-review.md
- docs/work/BANDIT-079/coordination-log.jsonl
- docs/work/BANDIT-079/red-evidence.md
- docs/work/BANDIT-079/implementation-evidence.md
- docs/work/BANDIT-079/writer-report.md
- docs/work/BANDIT-079/stage3-pm-review.md
- docs/work/BANDIT-079/coderabbit-review.md
- docs/work/BANDIT-079/local-qwen-review.md
- docs/work/BANDIT-079/review-evidence.md
- docs/work/BANDIT-079/uat-approval.md
- docs/work/BANDIT-079/landing-verdict.md
- docs/work/BANDIT-079/landing-action.md
- docs/work/BANDIT-079/retrospective.md
- src/state/cockpit-status.ts
- src/state/cockpit-view-model.ts
- src/state/cockpit-evidence-detail.ts
- src/state/cockpit-improvement-health.ts
- src/cockpit/render.ts
- src/cockpit/browser-shell.ts
- src/cockpit/preview-status-snapshot.ts
- public/cockpit/index.html
- public/cockpit/cockpit.css
- test/cockpit-improvement-health.test.mjs
- test/cockpit-view-model.test.mjs
- test/cockpit-evidence-detail.test.mjs
- test/cockpit-browser-shell.test.mjs
- test/cockpit-ui.test.mjs
- test/improvements.test.mjs
- test/helpers/cockpit-status-fixture.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Write RED tests for deriving compact improvement-health rows from existing improvement candidate and cockpit-status data, including source links, status, outcome, metric, baseline, evaluation window, and next route.
- Write RED tests for guardrail completeness and fail-closed missing-state rendering for workflow-trial or policy-changing candidates.
- Write RED tests for browser-shell rendering of improvement-health cards and detail rows with source traceability, due/missing/evaluated distinctions, and no hidden workflow authority.
- Implement the smallest improvement-health view-model boundary from existing repo-native candidate outputs without changing canonical improvement or cockpit status authority.
- Render the Improvement Health surface in the existing browser shell/static preview while preserving responsive, accessible, presentation-only behavior.
- Verify desktop/mobile browser preview, focused tests, typecheck, Bandit validation, current improvements/cockpit/session-context outputs, review, UAT, landing, and closeout evidence in the normal stage order.

## Smell Triggers

- Any browser, preview file, fixture, generated JSON, local cache, browser storage, screenshot, State Index, improvement-health view model, or UI component state becoming canonical workflow state is a blocker.
- Any browser code that invokes CLI commands, writes repo artifacts, evaluates candidates, records outcomes, schedules background work, changes policy, records UAT, decides landing safety, merges, pushes, deploys, grants cost/risk authority, or starts guarded action execution is a blocker.
- Any improvement-health mapper that silently normalizes missing, stale, contradictory, unavailable, unsupported, not-due, due, or blocked-evaluation states into healthy/complete states is a blocker.
- Any metric or chart label that implies causal proof, statistically certain improvement, policy approval, recurring paid routing, or automatic keep/revise/revert/double_down authority is a blocker.
- Any live API, polling loop, State Index, scheduler, claim, worktree, PR/CI, external service, dependency, lockfile, package script, merge, push, deploy, or unrelated Phase 8 feature work inside this slice is scope creep.
- Any desktop or mobile overlap, truncation, inaccessible state cue, source-path unreadability, candidate-ID unreadability, metric/baseline unreadability, or ambiguous due/missing/evaluated cue in critical operator flows is a product-quality blocker.
- Any large mixed function that combines improvement parsing, CLI execution, payload parsing, health derivation, evidence normalization, rendering, static preview generation, and UI rendering is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-079/brief.md
- docs/work/BANDIT-079/qwen-formation-review.md
- docs/work/BANDIT-079/coderabbit-formation-review.md
- docs/work/BANDIT-079/formation-review.md
- docs/work/BANDIT-079/coordination-log.jsonl
- docs/work/BANDIT-079/red-evidence.md
- docs/work/BANDIT-079/implementation-evidence.md
- docs/work/BANDIT-079/writer-report.md
- docs/work/BANDIT-079/stage3-pm-review.md
- docs/work/BANDIT-079/coderabbit-review.md
- docs/work/BANDIT-079/local-qwen-review.md
- docs/work/BANDIT-079/review-evidence.md
- docs/work/BANDIT-079/uat-approval.md
- docs/work/BANDIT-079/landing-verdict.md
- docs/work/BANDIT-079/landing-action.md
- docs/work/BANDIT-079/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Phase 8 Improvement Health Surface work item or complete Stage 1 formation because the roadmap, accepted cockpit PRD/design artifacts, cockpit boundary, workflow-improvement decision, improvement metrics/schema docs, BANDIT-029 and BANDIT-037 improvement foundation evidence, BANDIT-078 closeout evidence, current cockpit status payload, existing improvements candidate CLI output, CLEAN_CODE.md, and Stage Rubrics define a bounded display-only product slice. CLI-owned product UAT is required before landing the operator-facing implementation. Halt for operator input if implementation would choose local API shape, State Index timing, live polling behavior, automatic improvement evaluation, scheduler execution, claim/worktree lifecycle behavior, guarded action execution authority, automatic merge/push/deploy authority, PR/CI orchestration, external service setup, policy changes, business tradeoffs, explicit cost/risk approvals, Trust Verifier cutover, or genuinely ambiguous product scope.
