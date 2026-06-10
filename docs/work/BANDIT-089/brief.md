# BANDIT-089: Trust Boundary Evidence Schema Contracts

## Status

Brief Created

work_type: slice

## Origin

`BANDIT-PRD-004` is accepted product and policy direction for trust-boundary
autonomy. The operator directed Repo PM on 2026-06-10 to implement
`BANDIT-PRD-004` and `BANDIT-PRD-005` before the V0 Closeout Claude Code A/B
Product-Value Trial. `docs/prds/BANDIT-PRD-004-005-decomposition.md`,
`.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, and `STATUS.md` now record PRD-004.1 as the next
slice target and keep `WIL-V0-TRIAL` deferred behind PRD-004/005.

## Goal

Implement the first BANDIT-PRD-004 slice: schema-only, fail-closed trust-boundary evidence contracts for Boundary Contour, Boundary Prediction Record, and Notify-And-Revert Artifact evidence without expanding live Notify-And-Revert or Auto-Landing authority.

## Scope

- Use BANDIT-PRD-004 and docs/prds/BANDIT-PRD-004-005-decomposition.md as source authority for the first trust-boundary autonomy implementation slice before BANDIT-PRD-005, the V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 work.
- Add a declarative .bandit/policy/boundary-contour.json initial conservative contour that records contract_version, policy_id, contour_version, default_movement_policy, risk_tiers, evidence_strength_tiers, landing_autonomy_levels, and cells matching PRD-004.
- Add repo-native templates or schema guidance for docs/work/BANDIT-089/boundary-prediction.json and docs/work/BANDIT-089/notify-and-revert-artifact.json or equivalent Markdown templates, keeping Boundary Prediction Records standalone and linked from landing verdicts only when required.
- Add CLI validation coverage so npm run bandit -- validate fails closed when the boundary contour, Boundary Prediction Record template/schema support, or Notify-And-Revert Artifact template/schema support is malformed.
- Add land-check behavior that requires a valid Boundary Prediction Record only when landing evidence claims notify_and_revert or auto_land autonomy, while preserving current ordinary safe-to-land bootstrap flows that have no PRD-004 autonomy claim.
- Add focused tests for valid contour/schema/template state, malformed contour refusal, malformed prediction record refusal when required, malformed Notify-And-Revert Artifact refusal when required, and no-regression behavior for existing ordinary safe-to-land landing verdicts.
- Preserve CLI authority, repo-native canonical state, and derived-only cockpit/session-context status. No cockpit UI, local API, State Index, gateway, telemetry, hosted service, public benchmark, merge, push, deploy, or paid model/reviewer route is in scope.
- Record CLEAN_CODE.md read evidence in the brief and require the implementation to keep validators small, explicit, testable, and separated from landing execution, reviewer routing, operator supervision, and future boundary movement policy.

## Out Of Scope

- Do not grant new Auto-Landing Scope or Notify-And-Revert Landing authority to any work class in this slice.
- Do not implement landing execution paths, rollback execution, asynchronous operator attention delivery, cockpit UI, local API, State Index, hosted services, telemetry, merge, push, deploy, public benchmark publication, paid reviewer/model routing, or model-call gateway behavior.
- Do not require Boundary Prediction Records for existing ordinary safe-to-land bootstrap flows unless the landing evidence explicitly claims notify_and_revert or auto_land autonomy.
- Do not change UAT policy, operator-supervision policy, never-auto-landable surfaces, Local Qwen reviewer routing, CodeRabbit routing, PR/CI/CD policy, installed-copy update policy, or Trust Verifier cutover policy.
- Do not start BANDIT-PRD-005 implementation, V0 Closeout Claude Code A/B Product-Value Trial work, future PRD-004 attribution wiring, escape workflow, boundary trial evaluation, or unrelated Phase 8 work.
- Do not create orchestration-plan.md, RED evidence, implementation evidence, Stage 4 review evidence, landing evidence, UAT evidence, or retrospective evidence before Stage 1 formation is approved and the next role owns that stage.

## Acceptance Criteria

- The slice adds a versioned .bandit/policy/boundary-contour.json that represents the Initial Conservative Boundary Contour from BANDIT-PRD-004 as declarative data, including risk tiers, evidence strength tiers, autonomy levels, and explicit cell rationale.
- Validation rejects malformed boundary contour data, including missing required top-level fields, unsupported risk tiers, unsupported evidence tiers, unsupported autonomy levels, cells that allow notify_and_revert or auto_land for material_risk or never_auto_landable tiers, and low_reversible notify_and_revert cells without a rollback-path requirement.
- The slice adds schema/template support for Boundary Prediction Records with PRD-004 minimum fields: contract_version, work_item, source_head, review_subject_hash, boundary_contour_version, boundary_contour_path, risk_tier, evidence_strength_tier, landing_autonomy_level, authorizing_boundary_cell, risk_classification_evidence, relied_on_evidence_artifacts, predicted_safety_outcome, operator_supervision_status, and rationale.
- Validation rejects a required Boundary Prediction Record when required fields are missing, enum values are unsupported, the authorizing cell does not exist in the contour, the record claims an autonomy level stronger than the authorizing contour cell, relied-on evidence artifacts are empty, or source/head/hash fields are blank.
- The slice adds schema/template support for Notify-And-Revert Artifacts with PRD-004 minimum fields for autonomy level, rollback path, operator attention reason, follow-up or expiry state, and Boundary Prediction Record link.
- Validation rejects a required Notify-And-Revert Artifact when landing evidence claims notify_and_revert and the artifact is missing, lacks rollback path evidence, lacks operator attention reason, lacks follow-up or expiry state, or does not link a valid Boundary Prediction Record.
- land-check requires a valid Boundary Prediction Record for landing verdicts that claim notify_and_revert or auto_land autonomy and requires a valid Notify-And-Revert Artifact for notify_and_revert autonomy.
- land-check does not block existing ordinary safe-to-land bootstrap flows merely because they lack Boundary Prediction Record evidence when the landing verdict does not claim notify_and_revert or auto_land autonomy.
- The implementation keeps Boundary Contour policy data, artifact parsing/validation, land-check integration, tests, templates, and documentation separate enough that a reviewer can follow failure paths without reconstructing intent from chat.
- The work preserves role boundaries: Test Writer owns RED evidence and test edits; if Codex authors Stage 2 tests, Stage 3 implementation is routed to Claude or another non-Codex model family; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent owns Stage 6.
- Stage 4 review uses Local Qwen only through .bandit/reviewers/local-qwen.json and node bin/omlx-chat-completions.mjs, CodeRabbit or honest provider-timeout/refusal evidence, and aggregate review evidence before landing.
- The work item does not start BANDIT-PRD-005, the V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, attribution gateway work, escape workflow implementation, boundary trial evaluation, cockpit UI, local API, State Index, hosted services, telemetry, public benchmark publication, paid routing, merge, push, deploy, or unrelated Phase 8 work.

## Test Plan

- Stage 2 Test Writer writes RED tests for boundary contour validation covering valid initial contour, missing required fields, unsupported enums, material-risk auto-land refusal, never-auto-landable notify-and-revert refusal, and low-reversible notify-and-revert rollback-path requirement.
- Stage 2 Test Writer writes RED tests for Boundary Prediction Record validation covering valid required record, missing fields, unsupported enum values, missing authorizing cell, autonomy stronger than contour cell, empty relied-on evidence, and blank source/head/hash fields.
- Stage 2 Test Writer writes RED tests for Notify-And-Revert Artifact validation covering valid required artifact, missing rollback path, missing operator attention reason, missing follow-up/expiry state, and missing or invalid Boundary Prediction Record link.
- Stage 2 Test Writer writes RED tests for land-check behavior proving notify_and_revert and auto_land autonomy claims require boundary evidence while ordinary safe-to-land bootstrap verdicts remain unblocked when no autonomy claim exists.
- Run focused boundary-autonomy/land-check validation tests after implementation.
- Run npm run typecheck.
- Run npm test if shared validators, landing gates, artifact parsers, or validate command behavior changes.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json after context artifacts are updated.
- Run git diff --check.

## Verification Plan

- Run `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-089` after
  Local Qwen formation review, CodeRabbit formation review or provider-timeout
  evidence, aggregate formation review, and coordination evidence exist.
- Run `node ./bin/bandit.mjs coordination validate BANDIT-089` after every
  accepted step transition.
- Run focused Stage 2 RED tests before implementation to prove boundary contour
  validation, Boundary Prediction Record validation, Notify-And-Revert Artifact
  validation, land-check autonomy evidence requirements, and ordinary
  safe-to-land non-regression.
- Run focused implementation tests, `npm run typecheck`, `npm test` when shared
  validators or landing gates change, `npm run bandit -- validate`,
  `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check` before Stage 4 review and landing.
- Before landing, run Local Qwen through the authorized MLX adapter route,
  CodeRabbit or honest provider-timeout/refusal evidence, aggregate review
  evidence, review-subject hash, clean-code compliance review, landing verdict,
  land-check, local-record landing action, retrospective, and improvement or
  no-action disposition.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-10 before creating this source spec. The slice must keep policy data, artifact parsing, validation, land-check integration, tests, and templates small and explicit; avoid hidden workflow authority; preserve role boundaries; and avoid mixing future boundary-movement, attribution gateway, cockpit, or landing-execution behavior into the first schema-only slice.

## Role Boundary Evidence

- Repo PM owns Stage 1 source-spec creation, brief repair, formation review
  routing, formation approval, PRD decomposition, work-intake synchronization,
  and repo-level context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`;
  it may not write tests, implementation, reviewer evidence, landing evidence,
  UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, and
  acceptance mappings for boundary contour validation, Boundary Prediction
  Record validation, Notify-And-Revert Artifact validation, land-check
  autonomy evidence requirements, and ordinary safe-to-land non-regression.
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
  improvement/no-action disposition evidence. The operator owns any decision
  that expands landing autonomy, approves Notify-And-Revert or Auto-Landing
  Scope for a new boundary cell, changes product or UAT direction, approves
  public benchmark claims, approves paid/live reviewer or model routing,
  approves hosted services, approves telemetry, approves merge/push/deploy
  authority, approves Trust Verifier cutover, approves external side effects,
  or resolves genuinely ambiguous product, business, policy, or explicit
  cost/risk scope.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-088 is landed and closed with landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, and no open bootstrap gaps; operator direction reprioritized PRD-004/005 before WIL-V0-TRIAL.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, no-gap disposition, expected files, required evidence, role boundaries, operator-input status, source-of-truth boundary, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED tests for boundary contour validation, Boundary Prediction Record validation, Notify-And-Revert Artifact validation, land-check autonomy evidence requirements, and ordinary safe-to-land non-regression before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit RED tests, test helpers, fixtures, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through the authorized MLX adapter route, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review, review-subject hash, risk/supply-chain/input-quarantine checks where applicable, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not applicable unless the implementation changes an operator-facing product surface.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, and STATUS updates are required before any PRD-005, V0 trial, or unrelated next item begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this PRD-004 schema-only implementation slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs against the MLX OpenAI-compatible endpoint at http://127.0.0.1:8000/v1. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- No Trust Verifier cutover, expanded auto-landing authority, Notify-And-Revert execution, public benchmark publication, merge, push, deploy, paid routing, hosted service, telemetry, local API, State Index, or cockpit UI authority is approved by this slice.

## Expected Files

- docs/specs/BANDIT-089-trust-boundary-evidence-schema-contracts.json
- docs/work/BANDIT-089/brief.md
- docs/work/BANDIT-089/qwen-formation-review.md
- docs/work/BANDIT-089/coderabbit-formation-review.md
- docs/work/BANDIT-089/formation-review.md
- docs/work/BANDIT-089/coordination-log.jsonl
- docs/work/BANDIT-089/orchestration-plan.md
- docs/work/BANDIT-089/red-evidence.md
- .bandit/policy/boundary-contour.json
- docs/templates/boundary-prediction-record.md
- docs/templates/notify-and-revert-artifact.md
- src/state/boundary-autonomy.ts
- src/commands/land-check.ts
- src/commands/validate.ts
- test/boundary-autonomy.test.mjs
- test/landing-gates.test.mjs
- docs/work/BANDIT-089/implementation-evidence.md
- docs/work/BANDIT-089/writer-report.md
- docs/work/BANDIT-089/stage3-pm-review.md
- docs/work/BANDIT-089/coderabbit-review.md
- docs/work/BANDIT-089/local-qwen-review.md
- docs/work/BANDIT-089/review-evidence.md
- docs/work/BANDIT-089/landing-verdict.md
- docs/work/BANDIT-089/landing-action.md
- docs/work/BANDIT-089/retrospective.md
- docs/work/BANDIT-089/improvement-disposition.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Repo PM creates the work item and records formation review evidence before Work Item PM execution.
- Work Item PM records orchestration-plan.md only after formation_approved and before RED evidence.
- Test Writer writes failing tests for contour validation, Boundary Prediction Record validation, Notify-And-Revert Artifact validation, land-check autonomy evidence requirements, and ordinary safe-to-land non-regression.
- Implementation Writer adds the minimal policy, templates, validator helpers, validate integration, and land-check integration needed to satisfy RED tests, without editing Test Writer-owned files if Codex authored the RED tests.
- Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, and evidence freshness before Stage 4 review.
- Reviewers run Local Qwen through the authorized MLX route and CodeRabbit or honest provider-timeout/refusal evidence; PM dispositions any non-blocking findings before landing.
- Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, and synchronizes current context, roadmap, STATUS, and intake state.

## Smell Triggers

- Any implementation that grants new Notify-And-Revert or Auto-Landing authority in this first schema-only slice is a blocker.
- Any implementation that makes cockpit output, session-context packets, work-intake entries, templates, static previews, generated JSON, update manifests, package registries, or cache state canonical workflow authority is a blocker.
- Any land-check change that blocks ordinary safe-to-land bootstrap flows without an explicit notify_and_revert or auto_land autonomy claim is a blocker.
- Any Boundary Contour cell that permits notify_and_revert or auto_land for material_risk or never_auto_landable work is a blocker.
- Any low_reversible notify_and_revert cell that does not require rollback path evidence is a blocker.
- Any parser or validator that silently accepts unsupported enum values, missing evidence artifacts, missing source/head/hash fields, missing operator supervision status, or non-existent authorizing cells is a blocker.
- Any implementation that starts PRD-005 command-controller work, attribution gateway work, escape workflow work, boundary trial movement, Trust Verifier cutover, local API, State Index, hosted service, telemetry, paid routing, merge, push, deploy, public benchmark publication, or unrelated Phase 8 work is scope creep.
- Any large mixed function that combines contour loading, prediction parsing, notify-and-revert validation, land-check policy, file writes, reviewer routing, landing action, operator inbox delivery, and boundary movement decisions is a clean-code blocker.
- Any fallback that routes derivable malformed local policy/template drift to operator input instead of fail-closed validation diagnostics is a blocker, while genuine autonomy expansion, product, UAT, business, policy, explicit cost/risk, or ambiguous scope decisions must halt for operator input.

## Required Evidence

- docs/work/BANDIT-089/brief.md
- docs/work/BANDIT-089/qwen-formation-review.md
- docs/work/BANDIT-089/coderabbit-formation-review.md
- docs/work/BANDIT-089/formation-review.md
- docs/work/BANDIT-089/coordination-log.jsonl
- docs/work/BANDIT-089/orchestration-plan.md
- docs/work/BANDIT-089/red-evidence.md
- docs/work/BANDIT-089/implementation-evidence.md
- docs/work/BANDIT-089/review-evidence.md
- docs/work/BANDIT-089/landing-verdict.md
- docs/work/BANDIT-089/landing-action.md
- docs/work/BANDIT-089/retrospective.md
- docs/work/BANDIT-089/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create and form this first PRD-004 schema-only slice because BANDIT-PRD-004 is accepted, the operator directed PRD-004/005 implementation before WIL-V0-TRIAL, and the slice explicitly avoids expanding landing autonomy. Halt for operator input if later work would expand Notify-And-Revert or Auto-Landing Scope, change boundary-cell movement policy, change product or UAT direction, approve public benchmark claims, approve paid or live reviewer/model routing, approve hosted services, approve telemetry, approve merge/push/deploy authority, approve Trust Verifier cutover, approve external side effects, or resolve genuinely ambiguous product, business, policy, or explicit cost/risk scope.
