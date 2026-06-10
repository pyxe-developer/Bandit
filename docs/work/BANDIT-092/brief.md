# BANDIT-092: Boundary Cell Movement Gate

## Status

Brief Created

work_type: slice

## Origin

`BANDIT-PRD-004` is accepted product and policy direction for
trust-boundary autonomy. The operator directed Repo PM on 2026-06-10 to
implement `BANDIT-PRD-004` and `BANDIT-PRD-005` before the V0 Closeout Claude
Code A/B Product-Value Trial. `BANDIT-089` landed and closed the prerequisite
schema-only Boundary Contour, Boundary Prediction Record, and
Notify-And-Revert Artifact evidence contracts. `BANDIT-090` landed and closed
the prerequisite Attribution Join Key evidence contracts and validation wiring.
`BANDIT-091` landed and closed the prerequisite Escape Candidate and Boundary
Escape Disposition workflow. `docs/prds/BANDIT-PRD-004-005-decomposition.md`,
`.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, and `STATUS.md` record PRD-004.4 Boundary Cell
Movement Gate as the next `BANDIT-PRD-004` implementation slice and keep
`BANDIT-PRD-005` plus `WIL-V0-TRIAL` deferred behind this slice boundary.

## Product Work

This is the fourth `BANDIT-PRD-004` implementation slice. It adds the
repo-native gate/evidence contract for future boundary-cell movement and
confirmed-escape contraction checks. It does not apply a contour update or
approve autonomy expansion.

## Goal

Implement the fourth BANDIT-PRD-004 slice: Workflow Trial-backed boundary-cell movement evidence and fail-closed contraction checks for confirmed escapes, without approving any autonomy expansion or moving any current boundary cell.

## Scope

- Use BANDIT-PRD-004 and docs/prds/BANDIT-PRD-004-005-decomposition.md as source authority for PRD-004.4 after BANDIT-089, BANDIT-090, and BANDIT-091 landed and closed PRD-004.1, PRD-004.2, and PRD-004.3.
- Add repo-native Boundary Cell Movement evidence for proposed or required contour-cell changes, including work item, source head, boundary contour path/version, source cell id, from autonomy level, to autonomy level, movement direction, movement reason, linked Workflow Trial or confirmed Boundary Escape evidence, operator decision status when expansion is requested, and rationale.
- Add deterministic validation helpers that fail closed for malformed Boundary Cell Movement evidence, including blank work item, malformed source head, missing contour version, unknown cell id, invalid autonomy levels, invalid movement direction, missing linked evidence, unsupported operator-decision status, or inconsistent direction between from/to autonomy levels.
- Enforce the PRD-004 asymmetric movement rule in validation: contraction may be required for confirmed escapes, but expansion requires Workflow Trial evidence, predeclared criteria, minimum-detectable-effect context, evaluation window, re-evaluation window, and an operator-reviewed Improvement Decision.
- Add fail-closed contraction checks for confirmed Boundary Escape Disposition evidence so future boundary-autonomy claims for escaped notify_and_revert or auto_land cells cannot proceed unless the relevant cell is already contracted in the active Boundary Contour or valid Boundary Cell Movement evidence records the required contraction.
- Add aggregate validation wiring so npm run bandit -- validate reports malformed boundary-cell movement artifacts and escape-driven contraction blockers in work-item evidence packages.
- Add template/init support for Boundary Cell Movement evidence while keeping templates non-authoritative source guidance.
- Preserve CLI authority, repo-native canonical state, and derived-only cockpit/session-context status. No actual contour update, autonomy expansion, Notify-And-Revert execution, rollback execution, model gateway, telemetry, local API, State Index, cockpit UI, hosted service, paid route, merge, push, deploy, or PRD-005 controller work is in scope.
- Record CLEAN_CODE.md read evidence in the brief and require the implementation to keep boundary movement evidence parsing, contraction checks, aggregate validation, template checks, and tests small, explicit, and separated from Workflow Trial policy execution or landing execution.

## Out Of Scope

- Do not approve Notify-And-Revert or Auto-Landing Scope for a new boundary cell.
- Do not move, rewrite, or expand any current Boundary Contour cell as part of this slice.
- Do not implement live Workflow Trial evaluation, automatic autonomy expansion, raw zero-escape expansion, telemetry collection, model-call gateway behavior, or public benchmark claims.
- Do not execute rollback behavior, send operator attention items, change UAT policy, change reviewer routing, change risk-classification policy, change supply-chain policy, replace Trust Verifier behavior, or start BANDIT-PRD-005 implementation.
- Do not require Boundary Cell Movement evidence for ordinary safe-to-land bootstrap flows that do not claim PRD-004 boundary autonomy and have no confirmed boundary escape.
- Do not start PRD-005, the V0 Closeout Claude Code A/B Product-Value Trial, cockpit UI, local API, State Index, hosted services, telemetry, public benchmark publication, paid routing, merge, push, deploy, credential handling, dependency changes, lockfile changes, package-script changes, CI/release workflow changes, external repo mutation, or unrelated Phase 8 work.

## Acceptance Criteria

- The slice adds Boundary Cell Movement evidence as a repo-native structured artifact for proposed or required contour-cell changes without applying a contour change by itself.
- Validation rejects malformed Boundary Cell Movement evidence, including blank work item, malformed source head, missing contour path/version, unknown cell id, invalid from/to autonomy levels, invalid movement direction, missing linked evidence, unsupported operator-decision status, and inconsistent direction semantics.
- Validation rejects autonomy expansion movement evidence unless it links a Workflow Trial with predeclared criteria, metric/baseline, minimum-detectable-effect context or uncertainty, evaluation window, re-evaluation window, proxy-risk notes, and an operator-reviewed Improvement Decision.
- Validation rejects any movement evidence that uses zero observed escapes alone as an autonomy expansion rationale.
- Validation accepts contraction movement evidence when it links a confirmed Boundary Escape Disposition to the affected Boundary Prediction Record, authorizing boundary cell, and target contracted autonomy level.
- Fail-closed contraction checks reject future notify_and_revert or auto_land boundary-autonomy claims for a cell with a confirmed escape unless the active Boundary Contour already contracts that cell or a valid Boundary Cell Movement artifact records the required contraction.
- Existing ordinary safe-to-land bootstrap flows remain unblocked when no boundary-autonomy claim and no confirmed boundary escape evidence exists.
- Boundary Cell Movement validation is included in aggregate bandit validate and template checks, with clear fail-closed diagnostics.
- The implementation keeps boundary movement evidence parsing, contraction checking, template seeding/checks, aggregate validation, and tests separated from Workflow Trial execution, contour rewrite execution, and landing execution.
- The work preserves role boundaries: Test Writer owns RED evidence and test edits; if Codex authors Stage 2 tests, Stage 3 implementation is routed to Claude or another non-Codex model family; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent owns Stage 6.
- Stage 4 review uses Local Qwen only through .bandit/reviewers/local-qwen.json and node bin/omlx-chat-completions.mjs, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review evidence, risk classification, and supply-chain evidence before landing.
- The work item does not start PRD-005, the V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, cockpit UI, local API, State Index, hosted services, telemetry, public benchmark publication, paid routing, merge, push, deploy, or unrelated Phase 8 work.

## Test Plan

- Stage 2 Test Writer writes RED tests for valid and malformed Boundary Cell Movement evidence, including source head, contour version, cell id, autonomy levels, movement direction, linked evidence, operator-decision status, and direction consistency.
- Stage 2 Test Writer writes RED tests proving expansion movement evidence fails without Workflow Trial guardrails, minimum-detectable-effect context or uncertainty, re-evaluation window, proxy-risk disposition, and operator-reviewed Improvement Decision.
- Stage 2 Test Writer writes RED tests proving zero observed escapes alone cannot support autonomy expansion.
- Stage 2 Test Writer writes RED tests proving confirmed escape evidence requires fail-closed contraction before future notify_and_revert or auto_land claims for the affected cell can proceed.
- Stage 2 Test Writer writes RED tests proving ordinary safe-to-land bootstrap flows remain unblocked when no boundary-autonomy claim or confirmed escape evidence exists.
- Run focused boundary movement or landing-gate tests after implementation.
- Run npm run typecheck.
- Run npm test if shared validators, landing gates, artifact parsers, template checks, or validate command behavior changes.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json after context artifacts are updated.
- Run git diff --check.

## Verification Plan

- Run `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-092` after
  Local Qwen formation review, CodeRabbit formation review or provider-timeout
  evidence, aggregate formation review, and coordination evidence exist.
- Run `node ./bin/bandit.mjs coordination validate BANDIT-092` after every
  accepted step transition.
- Run focused Stage 2 RED tests before implementation to prove Boundary Cell
  Movement validation, Workflow Trial expansion guardrails, zero-escape
  expansion refusal, confirmed-escape contraction checks, and ordinary
  safe-to-land non-regression.
- Run focused implementation tests, `npm run typecheck`, `npm test` when
  shared validators or landing gates change, `npm run bandit -- validate`,
  `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check` before Stage 4 review and landing.
- Before landing, run Local Qwen through the authorized MLX adapter route,
  CodeRabbit or honest provider-timeout/refusal evidence, aggregate review
  evidence, review-subject hash, risk classification, supply-chain gate,
  clean-code compliance review, landing verdict, land-check, local-record
  landing action, retrospective, and improvement or no-action disposition.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-10 before creating this source spec. The slice must keep Boundary Cell Movement evidence parsing, contraction checks, template checks, aggregate validation, and tests small and explicit; avoid hidden workflow authority; preserve role boundaries; and avoid mixing contour rewrite execution, Workflow Trial execution, model gateway, cockpit, or PRD-005 controller behavior into this movement-gate slice.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-091 landed and closed with landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, and no open bootstrap gaps; operator direction keeps PRD-004/005 ahead of WIL-V0-TRIAL.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, no-gap disposition, expected files, required evidence, role boundaries, operator-input status, source-of-truth boundary, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED tests for Boundary Cell Movement validation, Workflow Trial expansion guardrails, zero-escape expansion refusal, confirmed-escape contraction checks, and ordinary safe-to-land non-regression before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit RED tests, test helpers, fixtures, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through the authorized MLX route, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review, review-subject hash, risk/supply-chain checks where applicable, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not applicable unless the implementation changes an operator-facing product surface.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, and STATUS updates are required before PRD-005, V0 trial, or unrelated next work begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this PRD-004.4 implementation slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs against the MLX OpenAI-compatible endpoint at http://127.0.0.1:8000/v1. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- No actual boundary-cell movement, autonomy expansion, model gateway, live model-call capture, Trust Verifier cutover, Notify-And-Revert execution, public benchmark publication, merge, push, deploy, paid routing, hosted service, telemetry, local API, State Index, or cockpit UI authority is approved by this slice.

## Expected Files

- docs/specs/BANDIT-092-boundary-cell-movement-gate.json
- docs/work/BANDIT-092/brief.md
- docs/work/BANDIT-092/qwen-formation-review.md
- docs/work/BANDIT-092/coderabbit-formation-review.md
- docs/work/BANDIT-092/formation-review.md
- docs/work/BANDIT-092/coordination-log.jsonl
- docs/work/BANDIT-092/orchestration-plan.md
- docs/work/BANDIT-092/red-evidence.md
- docs/templates/boundary-cell-movement.md
- src/state/boundary-cell-movement.ts
- src/state/boundary-autonomy.ts
- src/state/boundary-escape.ts
- src/commands/validate.ts
- src/commands/land-check.ts
- src/state/templates.ts
- test/landing-gates.test.mjs
- docs/work/BANDIT-092/implementation-evidence.md
- docs/work/BANDIT-092/writer-report.md
- docs/work/BANDIT-092/stage3-pm-review.md
- docs/work/BANDIT-092/coderabbit-review.md
- docs/work/BANDIT-092/local-qwen-review.md
- docs/work/BANDIT-092/review-evidence.md
- docs/work/BANDIT-092/landing-verdict.md
- docs/work/BANDIT-092/landing-action.md
- docs/work/BANDIT-092/retrospective.md
- docs/work/BANDIT-092/improvement-disposition.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Repo PM creates the work item and records formation review evidence before Work Item PM execution.
- Work Item PM records orchestration-plan.md only after formation_approved and before RED evidence.
- Test Writer writes failing tests for Boundary Cell Movement validation, expansion guardrails, zero-escape expansion refusal, confirmed-escape contraction checks, and ordinary safe-to-land non-regression.
- Implementation Writer adds the minimal template, parser/validator helpers, contraction checks, template checks, and aggregate validate integration needed to satisfy RED tests, without editing Test Writer-owned files if Codex authored the RED tests.
- Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, and evidence freshness before Stage 4 review.
- Reviewers run Local Qwen through the authorized MLX route and CodeRabbit or honest provider-timeout/refusal evidence; PM dispositions any non-blocking findings before landing.
- Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, and synchronizes current context, roadmap, STATUS, and intake state.

## Smell Triggers

- Any implementation that expands autonomy, approves Notify-And-Revert or Auto-Landing Scope for a new boundary cell, rewrites the active contour, executes rollback behavior, sends operator attention, or runs live Workflow Trial evaluation is scope creep.
- Any implementation that treats zero observed escapes alone as evidence for autonomy expansion is a blocker.
- Any implementation that allows expansion movement evidence without Workflow Trial guardrails and an operator-reviewed Improvement Decision is a blocker.
- Any implementation that ignores confirmed Boundary Escape evidence for a notify_and_revert or auto_land cell instead of requiring fail-closed contraction is a blocker.
- Any implementation that requires Boundary Cell Movement evidence for ordinary safe-to-land bootstrap flows that do not claim PRD-004 boundary autonomy and have no confirmed boundary escape is a blocker.
- Any implementation that accepts malformed source head, contour version, boundary cell id, autonomy level, movement direction, linked evidence, operator-decision status, Workflow Trial reference, or confirmed escape reference is a blocker.
- Any implementation that starts PRD-005 command-controller work, model gateway, Trust Verifier cutover, cockpit UI, local API, State Index, hosted service, telemetry, paid routing, merge, push, deploy, public benchmark publication, or unrelated Phase 8 work is scope creep.
- Any large mixed function that combines boundary movement parsing, escape attribution, Workflow Trial execution, contour writes, operator inbox delivery, and landing execution is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-092/brief.md
- docs/work/BANDIT-092/qwen-formation-review.md
- docs/work/BANDIT-092/coderabbit-formation-review.md
- docs/work/BANDIT-092/formation-review.md
- docs/work/BANDIT-092/coordination-log.jsonl
- docs/work/BANDIT-092/orchestration-plan.md
- docs/work/BANDIT-092/red-evidence.md
- docs/work/BANDIT-092/implementation-evidence.md
- docs/work/BANDIT-092/review-evidence.md
- docs/work/BANDIT-092/landing-verdict.md
- docs/work/BANDIT-092/landing-action.md
- docs/work/BANDIT-092/retrospective.md
- docs/work/BANDIT-092/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create and form this PRD-004.4 Boundary Cell Movement Gate slice because BANDIT-PRD-004 is accepted, BANDIT-089 through BANDIT-091 landed the prerequisite boundary evidence, attribution, and escape workflow contracts, the operator directed PRD-004/005 implementation before WIL-V0-TRIAL, and the slice implements validation/gate behavior without approving a new boundary cell, expanding autonomy, applying a contour update, executing rollback, adding model gateway behavior, or starting PRD-005 controllers. Halt for operator input if later work would approve Notify-And-Revert or Auto-Landing Scope for a new boundary cell, apply an autonomy expansion, change product or UAT direction, approve public benchmark claims, approve paid or live reviewer/model routing, approve hosted services, approve telemetry, approve merge/push/deploy authority, approve Trust Verifier cutover, approve external side effects, or resolve genuinely ambiguous product, business, policy, UAT, or explicit cost/risk scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 source-spec creation, brief repair, formation review
  routing, formation approval, PRD decomposition, work-intake synchronization,
  and repo-level context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`;
  it may not write tests, implementation, reviewer evidence, landing evidence,
  UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence,
  and acceptance mappings for Boundary Cell Movement validation, Workflow Trial
  expansion guardrails, zero-escape expansion refusal, confirmed-escape
  contraction checks, and ordinary safe-to-land non-regression.
- Implementation Writer owns Stage 3 source implementation only. If Codex
  authors or materially edits Stage 2 RED tests, Stage 3 implementation must
  use a different model family during bootstrap unless an operator-approved
  policy exception is recorded.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence, or
  policy acceptance criteria for this Work Item.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
  verdict/action evidence. Closeout Agent owns Stage 6 retrospective and
  improvement/no-action disposition evidence. The operator owns any future
  decision that approves Notify-And-Revert or Auto-Landing Scope for a new
  boundary cell, applies an autonomy expansion, changes product or UAT
  direction, approves paid/live routing, hosted services, telemetry,
  merge/push/deploy authority, public benchmark claims, policy, business
  tradeoffs, or explicit cost/risk posture.

## Stage Capability Scope

- Authority role: Repo PM for Stage 1 formation only.
- Required skill: installed Bandit skill for repo-context restoration and
  strict slice-boundary enforcement.
- Allowed tools: local repo reads, focused file edits to Stage 1 artifacts,
  `node ./bin/bandit.mjs repo-pm create-work-item`,
  `node ./bin/bandit.mjs repo-pm approve-formation`, coordination validation,
  Bandit validation, cockpit/session-context status, work-intake validation,
  `git diff --check`, git status/log, Local Qwen through
  `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, and
  CodeRabbit formation review or honest provider-timeout evidence.
- Inputs: `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`,
  `docs/verification/STAGE_RUBRICS.md`,
  `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `docs/prds/BANDIT-PRD-004-trust-boundary-autonomy.md`,
  `docs/prds/BANDIT-PRD-004-005-decomposition.md`,
  `.bandit/work-intake-ledger.json`, `.bandit/bootstrap-gaps.json`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `BANDIT-089` through `BANDIT-091` closeout evidence.
- Outputs: source spec, brief, `brief_created` coordination event, Local Qwen
  formation review, CodeRabbit formation review or timeout evidence, aggregate
  formation review, `formation_approved` coordination event, and synchronized
  routing surfaces that hand off to Work Item PM plan mode.
- Evidence: `docs/work/BANDIT-092/brief.md`,
  `docs/work/BANDIT-092/coordination-log.jsonl`,
  `docs/work/BANDIT-092/qwen-formation-review.md`,
  `docs/work/BANDIT-092/coderabbit-formation-review.md`,
  `docs/work/BANDIT-092/formation-review.md`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `.bandit/work-intake-ledger.json` if PRD-004 queue state is updated.
- Soft budget/failsafe: CodeRabbit formation review must be allowed the
  prompt-required full 10-minute timeout. Local Qwen must use the authorized
  MLX route only; if unavailable, stop and ask the operator for help.
- Forbidden actions: do not create `orchestration-plan.md`, RED evidence,
  implementation evidence, review-loop evidence, landing evidence, UAT
  evidence, retrospective evidence, contour update evidence, Trust Verifier
  cutover evidence, PRD-005 evidence, V0 trial evidence, merge/push/deploy
  evidence, or unrelated Phase 8 artifacts during Stage 1 formation.

## Source-Of-Truth And Projection Boundary

- `.bandit/policy/boundary-contour.json` remains the canonical Boundary
  Contour policy data. This slice may add validation and movement-evidence
  contracts, but it may not rewrite the active contour during Stage 1.
- Boundary Cell Movement evidence is future per-work-item evidence, not an
  independent workflow authority and not a hidden contour mutator.
- `docs/work/<ID>/boundary-prediction.json`, Escape Candidate evidence,
  Boundary Escape Disposition evidence, and future Boundary Cell Movement
  evidence are repo-native artifacts. Cockpit/session-context outputs are
  derived, read-only projections.
- Workflow Trial and Improvement Decision artifacts are authority inputs for
  future expansion proposals; zero observed escapes alone is never authority
  for expansion.
- Confirmed escape evidence can force fail-closed contraction checks, but this
  Stage 1 formation run does not apply a contour contraction or grant expanded
  landing autonomy.

## Bootstrap Model-Family Separation

If Codex authors or materially edits Stage 2 RED tests for `BANDIT-092`, Stage
3 source implementation must be dispatched to Claude or another non-Codex model
family during bootstrap. The Implementation Writer may not edit Test
Writer-owned tests, fixtures, RED evidence, or acceptance mappings.

## Forbidden Actions

- Do not create `docs/work/BANDIT-092/orchestration-plan.md`.
- Do not create RED evidence, implementation evidence, review-loop evidence,
  landing evidence, UAT evidence, retrospective evidence, or closeout evidence.
- Do not approve, apply, or record actual boundary-cell movement.
- Do not approve autonomy expansion, Notify-And-Revert execution,
  Auto-Landing Scope, rollback execution, Trust Verifier cutover, PRD-005
  implementation, V0 trial work, telemetry, hosted services, local API,
  State Index, public benchmark publication, paid routing, merge, push,
  deploy, credential handling, dependency changes, CI/release workflow
  changes, external repo mutation, or unrelated Phase 8 work.
