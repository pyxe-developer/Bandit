# BANDIT-082: Work Intake Ledger And Followups Migration

## Status

Brief Created

work_type: slice

## Product Work

Create the first repo-native Work Intake Ledger lane for Bandit's proposed
work so current follow-up and UI-polish proposals stop living in scattered
source files. The immediate product/workflow value is a validated
pre-Claude-bakeoff proposal queue that preserves source metadata from
`FOLLOWUPS.md`, the attached UI-polish source note, and legacy work-item
follow-up candidates without making those proposals claimable or executable.

## Origin

This slice is authorized by `docs/roadmap/CURRENT_CONTEXT.md` and
`docs/roadmap/ROADMAP.md` after `BANDIT-081` landed and closed the Operator
Attention / Operator Inbox Surface slice. The current routing says Repo PM must
form the Work Intake Ledger And Followups Migration slice first, preserving
`FOLLOWUPS.md` source metadata and queueing the triaged follow-up and UI-polish
work items before the V0 Closeout Claude Code A/B Product-Value Trial.

Source authority comes from `FOLLOWUPS.md`,
`docs/design/workflow-cockpit/bandit-ui-polish-source.md`,
`docs/work/BANDIT-022/follow-up-chores.md`,
`docs/prds/BANDIT-PRD-002-post-bootstrap-parallel-workstreams.md`,
`CONTEXT.md` Work Intake Ledger / Work Item Proposal / Work Intake Triage Skill
glossary entries, `docs/work/BANDIT-081/landing-action.md`,
`docs/work/BANDIT-081/retrospective.md`,
`docs/work/BANDIT-081/improvement-disposition.md`, `CLEAN_CODE.md`, and
`docs/verification/STAGE_RUBRICS.md`.

## Goal

Create the first repo-native Work Intake Ledger and migrate existing follow-up proposal surfaces into it so Bandit has one validated pre-queue lane for the six pre-Claude-bakeoff follow-up/UI-polish entries while keeping the V0 Closeout Claude Code A/B Product-Value Trial deferred behind that lane.

## Scope

- Define a v0 Work Intake Ledger artifact under `.bandit/` that records Work Item Proposals with stable IDs, source artifacts, origin dates when known, rationale, suggested Work Item type, proposed dependency or ordering edges, scope summary, risk/product-scope status, current intake outcome, and transition history.
- Import every current `FOLLOWUPS.md` open entry with preserved source metadata: Bandit Cockpit UI Polish From Attached Design, Claim-First Transition Policy Triage, Repo-Wide Transition Index Decision, Coordination Primitive Completion Triage, PR And CI/CD Landing Workflow Policy, and Installed-Copy Update Path.
- Import or explicitly disposition legacy work-item follow-up candidates from `docs/work/BANDIT-022/follow-up-chores.md` with preserved source artifacts, linked work item, lesson, hypothesis, metric, baseline, evaluation window, current status, and outcome.
- Represent the roadmapped V0 Closeout Claude Code A/B Product-Value Trial as deferred context behind the imported follow-up/UI-polish lane; this slice must not start the trial or treat it as ready while pre-Claude-bakeoff intake entries remain unformed or undispositioned.
- Add read-only validation and listing behavior for the Work Intake Ledger so agents can verify imported entries, required metadata, current outcome, transition history, source links, and ordering before future slices rely on the ledger.
- Mark `FOLLOWUPS.md` as deprecated source metadata after migration only if validation proves each open entry has a corresponding Work Intake Ledger entry and intake outcome; otherwise leave the file as active source metadata and record the missing import as a blocker.
- Keep Work Intake Ledger entries as proposals, not claimable Work Items; `accepted_to_queue` or equivalent imported queue outcome may authorize later Repo PM formation, but does not allocate a Work Item ID, start a Work Item PM, acquire a claim, or bypass Stage 1 formation.
- Update roadmap/current-context/status after landing so the next recorded action is the next intake-derived pre-Claude-bakeoff item, expected to be Bandit Cockpit UI Polish From Attached Design unless implementation evidence records a different validated intake order or disposition.
- Stage capability scope: Repo PM owns Stage 1 brief and formation; Work Item PM owns orchestration only after formation approval; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude-family Writer unless an operator-approved policy exception is recorded; Implementation Writer cannot edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, UAT evidence, or retrospective evidence; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent/Codex PM owns Stage 6.
- Token-cost failsafe boundary: use existing token-cost failsafe policy for abnormal reviewer execution; this slice approves no paid provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, merge, push, deploy, external service setup, hosted preview, public benchmark publication, or live action execution.

## Out Of Scope

- Do not implement the full Work Intake Triage Skill, operator-interactive ranking workflow, guided grill-with-docs integration, or operator-facing intake review UI in this slice.
- Do not materialize imported proposals into multiple new Work Item IDs, RED evidence, orchestration plans, claims, worktrees, scheduler work, claimability reports, or executable worker lanes.
- Do not implement claim leases, expired-claim repair, recovery_required_claim routing, work-surface wait-for graph checks, atomic claimability repair, Work Item PM wake payloads, or Single-Claim Heartbeat scheduling.
- Do not run, choose the PRD for, score, publish, or create repos for the V0 Closeout Claude Code A/B Product-Value Trial.
- Do not turn `FOLLOWUPS.md`, migrated ledger entries, roadmap projections, generated summaries, cockpit queue rows, browser state, or tests into claim authority, policy approval, UAT approval, landing authority, merge/push/deploy approval, or automatic work assignment.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace or wrap old gates, introduce local API/State Index/browser mutation authority, approve public benchmark publication, approve paid reviewer/model routing, approve hosted services, merge, push, deploy, or start unrelated Phase 8 product work.

## Acceptance Criteria

- The source spec and brief identify this as the authorized Phase 8 slice following BANDIT-081 and commit 8d24244, with no open bootstrap gaps and no required operator-owned input for Stage 1 formation.
- A Work Intake Ledger artifact exists in a repo-native location and stores current entry state plus transition history without requiring operators to edit ledger files directly.
- The ledger schema captures source artifact paths, source excerpt or source anchor when available, origin date when known, rationale, suggested Work Item type, dependency/ordering edges, scope summary, risk/product-scope status, current intake outcome, and transition history for each imported entry.
- `FOLLOWUPS.md` open entries are all represented with preserved source metadata and explicit intake outcomes: Bandit Cockpit UI Polish From Attached Design, Claim-First Transition Policy Triage, Repo-Wide Transition Index Decision, Coordination Primitive Completion Triage, PR And CI/CD Landing Workflow Policy, and Installed-Copy Update Path.
- The Bandit Cockpit UI Polish entry links to `docs/design/workflow-cockpit/bandit-ui-polish-source.md` and remains before the V0 Closeout Claude Code A/B Product-Value Trial in the intake-derived queue.
- `docs/work/BANDIT-022/follow-up-chores.md` candidates are imported or explicitly dispositioned with preserved source work item, source artifacts, lesson, hypothesis, metric, baseline, evaluation window, status, and outcome.
- The V0 Closeout Claude Code A/B Product-Value Trial remains deferred until the imported pre-Claude-bakeoff follow-up/UI-polish entries are formed, blocked on operator-owned input, or explicitly dispositioned.
- Validation fails closed if a migrated entry lacks required source metadata, intake outcome, transition history, scope summary, risk/product-scope status, or preserved source artifact link.
- Validation fails closed if `FOLLOWUPS.md` is marked deprecated while any open entry lacks a corresponding valid ledger entry and intake outcome.
- Listing/reporting behavior can show imported entries in deterministic order with current outcome, suggested kind, source artifacts, and deferred or queued rationale without making them claimable.
- The implementation preserves the role boundary that only Repo PM Coordinator and future Work Intake Triage Skill may mutate intake triage state; Work Item PM, workers, reviewers, retrospectives, and browser/cockpit surfaces may only propose or display entries.
- Imported proposals do not become claimable Work Items and do not trigger Work Item PM orchestration, RED evidence, implementation, review, landing, scheduler work, claims, worktrees, merge, push, or deploy.
- The slice includes focused RED/GREEN tests for ledger parsing, validation, source-preserving FOLLOWUPS import, legacy follow-up candidate import/disposition, deterministic ordering, deprecated FOLLOWUPS refusal, proposal-not-claimable boundary, and CLI authority boundaries.
- Clean-code compliance can be evaluated from the brief and implementation evidence: parsing, validation, migration, listing, and routing updates stay separated and avoid large mixed orchestration functions.
- Stage 4 review includes Local Qwen and CodeRabbit pre-landing evidence or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification and supply-chain evidence if the implementation touches policy, command routing, browser-facing projections, or package/dependency surfaces.

## Test Plan

- Write RED tests proving a Work Intake Ledger parser validates current state plus transition history and refuses missing source metadata, intake outcome, transition history, scope summary, or risk/product-scope status.
- Write RED tests proving all six `FOLLOWUPS.md` open entries import with preserved source metadata and deterministic ordering before the V0 Closeout Claude Code A/B Product-Value Trial.
- Write RED tests proving the Bandit Cockpit UI Polish entry links to `docs/design/workflow-cockpit/bandit-ui-polish-source.md` and remains a normal future slice proposal rather than browser mutation authority.
- Write RED tests proving `docs/work/BANDIT-022/follow-up-chores.md` candidates are imported or explicitly dispositioned with preserved source work item, source artifacts, lesson, hypothesis, metric, baseline, evaluation window, status, and outcome.
- Write RED tests proving `FOLLOWUPS.md` cannot be marked deprecated while any open entry lacks a valid ledger entry and intake outcome.
- Write RED tests proving ledger listing/reporting displays current outcome, suggested kind, source artifacts, and deferred or queued rationale without allocating Work Item IDs or marking proposals claimable.
- Write RED tests proving Work Item PM, workers, reviewers, retrospectives, browser/cockpit surfaces, generated projections, and tests cannot mutate intake triage state.
- Write RED tests proving the V0 Closeout Claude Code A/B Product-Value Trial remains deferred until the pre-Claude-bakeoff imported entries are formed, blocked on operator-owned input, or explicitly dispositioned.
- Run focused work-intake ledger, migration, validation, command, and roadmap/session-context tests after implementation.
- Run `npm test` if implementation touches shared command routing, validators, roadmap/current-context parsing, cockpit status/session-context projection, bootstrap gaps, coordination history, policy validators, risk classification, supply-chain gates, input quarantine, operator boundaries, token-cost failsafes, evidence freshness, or package scripts.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run the new Work Intake Ledger validation/listing commands in JSON mode.
- Run `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json` to verify current repo routing remains source-linked.
- Run Stage 4 Local Qwen only through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`; if the endpoint or adapter is unavailable, stop and ask the operator for help.
- Run CodeRabbit formation/review commands with the prompt-required full timeout allowance or record honest provider-timeout/bootstrap replacement evidence without claiming a pass.
- Run `git diff --check`.

## Verification Plan

- Stage 1 formation validation must pass after this brief, Local Qwen
  formation review, CodeRabbit formation review or provider-timeout evidence,
  aggregate formation review, and `formation_approved` coordination evidence
  are recorded.
- Stage 2 must produce RED evidence before implementation and map RED tests to
  ledger parsing, `FOLLOWUPS.md` import, legacy follow-up candidate
  import/disposition, deterministic ordering, deprecated-source refusal,
  proposal-not-claimable boundaries, and role-authority refusals.
- Stage 3 implementation must use a different model-family implementation
  writer if Codex authors or materially edits Stage 2 RED tests, and the Stage
  3 Writer has no authority to edit tests, test helpers, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, or retrospective evidence.
- Stage 4 must record Local Qwen, CodeRabbit pre-landing or provider-timeout
  evidence, aggregate review evidence, review-subject hash, layered
  risk-classification, supply-chain gate evidence when applicable, and
  clean-code review.
- Stage 5 must record landing verdict, land-check, auto-land-check when
  eligible, and local-record landing-action evidence before any later slice
  begins. Product UAT is not required unless the implementation changes an
  operator-facing browser surface.
- Stage 6 must record retrospective, improvement or no-action dispositions,
  updated `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-09 before creating this spec. The slice must keep Work Intake Ledger parsing, FOLLOWUPS migration, legacy follow-up candidate import/disposition, validation, listing, and routing synchronization small, explicit, testable, and separated from claimability, scheduler, cockpit, and Work Item execution authority.

## Role Boundary Evidence

- Repo PM owns Stage 1 source-spec creation, generated-brief repair, formation
  review routing, formation approval, and repo-level context synchronization.
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
- Only Repo PM Coordinator and the future Work Intake Triage Skill may mutate
  Work Intake Ledger triage state. Work Item PMs, workers, reviewers,
  retrospectives, browser/cockpit surfaces, generated projections, and tests may
  propose or display entries but may not mark proposals accepted, deferred,
  declined, superseded, duplicate, operator-needed, or claimable.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
  verdict/action evidence. Closeout Agent/Codex PM owns Stage 6 retrospective
  and closeout evidence.

## Source-Of-Truth And Projection Boundary

The Work Intake Ledger artifact under `.bandit/` is the proposed v0
repo-native intake source for proposal current state and transition history
after implementation. `FOLLOWUPS.md`, legacy work-item follow-up files, roadmap
projections, cockpit rows, generated reports, tests, and browser state are
source material or projections only. Imported proposals do not become claimable
Work Items until a later Repo PM materialization path allocates a real Work
Item ID through CLI Authority and normal Stage 1 formation.

## Stage Capability Scope

policy: `.bandit/policy/stage-capability-scope.json`

- stages: `stage1_brief`, `formation_review`, `work_item_pm_plan_mode`,
  `stage2_red_evidence`, `stage3_implementation`, `stage4_review`,
  `stage5_landing`, `stage6_retrospective`.
- authority roles: `codex_pm`, `repo_pm`, `work_item_pm`, `test_writer`,
  `implementation_writer`, `reviewer`, `landing_agent`, `closeout_agent`,
  `operator`.
- required skills: `bandit`, `tdd`, `review`.
- allowed tools: repo-local CLI commands, focused tests, typecheck, local-only
  validation, Local Qwen through `.bandit/reviewers/local-qwen.json` and
  `node bin/omlx-chat-completions.mjs`, and CodeRabbit through supported CLI
  automation.
- forbidden actions: do not write RED evidence before formation approval; do
  not run Work Item PM execution before `formation_approved`; do not let Stage
  3 Writer edit test surfaces; do not let Work Intake Ledger entries,
  `FOLLOWUPS.md`, roadmap projections, generated summaries, cockpit/browser
  state, static preview, fixture data, or validation output become claim
  authority, UAT authority, landing authority, merge/push/deploy authority, or
  policy approval authority; do not implement full Work Intake Triage Skill,
  claimability reports, scheduler, claim/worktree lifecycle, local API, State
  Index, browser mutation authority, V0 closeout trial execution, public
  benchmark publication, external services, paid routing, Trust Verifier
  cutover, or unrelated Phase 8 product features in this slice.

## Token-Cost Failsafe

policy: `.bandit/policy/token-cost-failsafe.json`

- Stage 1 formation uses local-only default guidance.
- Stage 2 and Stage 3 should use existing abnormal-run soft budget guidance and
  avoid brittle caps that force duplicate attempts.
- Stage 4 reviewer runs must record provider timeout, refusal, or continuation
  evidence honestly; absence of CodeRabbit or Local Qwen output is not pass
  evidence.
- No paid provider-pricing evidence, spend-class approval, paid reviewer
  promotion, recurring paid routing, external hosted service, hosted preview,
  public benchmark publication, guarded action execution, notification service,
  merge, push, or deploy authority is approved by this brief.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-081 is landed and closed with verification, landing verdict, landing-action evidence, UAT evidence, retrospective, improvement disposition, roadmap/status synchronization, and no open bootstrap gaps; CURRENT_CONTEXT.md and ROADMAP.md authorize Work Intake Ledger And Followups Migration as the next slice.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, product/workflow scope, out-of-scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, source-of-truth boundary, required evidence, and forbidden actions.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must write ledger parser, migration, validation, source-preservation, deprecation-refusal, proposal-not-claimable, role-boundary, and routing RED evidence before implementation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit any test surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen, risk-classification, supply-chain as applicable, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | UAT is not required unless implementation changes an operator-facing browser surface; landing verdict/action and local-record landing evidence are required before closeout.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and bootstrap-gap ledger state are required before the next slice.

## Bootstrap Gaps

- No open bootstrap gap blocks this Phase 8 slice.
- The full Work Intake Triage Skill, claimability reports, claim leases, scheduler behavior, worktree lifecycle, local API, State Index, browser mutation authority, public benchmark publication, merge, push, deploy, Trust Verifier cutover, and V0 Closeout Claude Code A/B Product-Value Trial execution remain future work outside this slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is available only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another route.

## Expected Files

- docs/specs/BANDIT-082-work-intake-ledger-and-followups-migration.json
- docs/work/BANDIT-082/brief.md
- docs/work/BANDIT-082/qwen-formation-review.md
- docs/work/BANDIT-082/coderabbit-formation-review.md
- docs/work/BANDIT-082/formation-review.md
- docs/work/BANDIT-082/coordination-log.jsonl
- docs/work/BANDIT-082/red-evidence.md
- docs/work/BANDIT-082/implementation-evidence.md
- docs/work/BANDIT-082/writer-report.md
- docs/work/BANDIT-082/stage3-pm-review.md
- docs/work/BANDIT-082/coderabbit-review.md
- docs/work/BANDIT-082/local-qwen-review.md
- docs/work/BANDIT-082/review-evidence.md
- docs/work/BANDIT-082/landing-verdict.md
- docs/work/BANDIT-082/landing-action.md
- docs/work/BANDIT-082/retrospective.md
- .bandit/work-intake-ledger.json
- FOLLOWUPS.md
- src/state/work-intake-ledger.ts
- src/commands/work-intake.ts
- src/commands/validate.ts
- src/cli.ts
- test/work-intake-ledger.test.mjs
- test/work-intake-migration.test.mjs
- test/validate.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Write RED tests for the Work Intake Ledger schema, parser, current-state plus transition-history validation, and required metadata refusal paths.
- Write RED tests for importing `FOLLOWUPS.md` entries and `docs/work/BANDIT-022/follow-up-chores.md` candidates with source metadata preserved.
- Write RED tests for deterministic intake order, V0 Closeout trial deferral, deprecated FOLLOWUPS refusal, and proposal-not-claimable boundaries.
- Implement the smallest ledger state module and validation/listing CLI path needed to satisfy RED evidence.
- Implement migration of current follow-up sources into `.bandit/work-intake-ledger.json` with append-only transition history and current-state projection inside the artifact.
- Update `FOLLOWUPS.md`, roadmap/current-context/status, and validation wiring only after ledger validation proves every migrated entry has a current outcome.
- Verify focused tests, typecheck, Bandit validation, current cockpit/session-context outputs, review, landing, and closeout evidence in the normal stage order.

## Smell Triggers

- Any ledger, migration helper, roadmap projection, browser/cockpit surface, test fixture, or generated summary becoming claim authority, work assignment authority, UAT authority, landing authority, merge/push/deploy authority, or policy approval authority is a blocker.
- Any imported follow-up that loses source artifact paths, source work item, operator request date, rationale, lesson, hypothesis, metric, baseline, evaluation window, or current outcome when the source provided it is a blocker.
- Any migration that marks `FOLLOWUPS.md` deprecated while entries remain unimported, unvalidated, or without explicit outcome is a blocker.
- Any implementation that materializes multiple Work Item IDs, starts RED/implementation/review for imported proposals, claims work, schedules work, wakes Work Item PMs, creates worktrees, runs the V0 closeout trial, or executes guarded browser actions is scope creep.
- Any large mixed function that combines source parsing, intake transition authoring, validation, listing, roadmap mutation, coordination mutation, claimability, scheduler logic, and UI rendering is a clean-code blocker.
- Any fallback that routes derivable migration bookkeeping drift to operator input instead of CLI-owned mechanical repair/PM disposition is a blocker.
- Any Trust Verifier cutover, old-gate replacement/wrapping, merge, push, deploy, paid reviewer/model routing, hosted service setup, public benchmark publication, dependency/lockfile change, local API, State Index, or unrelated Phase 8 product work inside this slice is scope creep.

## Required Evidence

- docs/work/BANDIT-082/brief.md
- docs/work/BANDIT-082/qwen-formation-review.md
- docs/work/BANDIT-082/coderabbit-formation-review.md
- docs/work/BANDIT-082/formation-review.md
- docs/work/BANDIT-082/coordination-log.jsonl
- docs/work/BANDIT-082/red-evidence.md
- docs/work/BANDIT-082/implementation-evidence.md
- docs/work/BANDIT-082/writer-report.md
- docs/work/BANDIT-082/stage3-pm-review.md
- docs/work/BANDIT-082/coderabbit-review.md
- docs/work/BANDIT-082/local-qwen-review.md
- docs/work/BANDIT-082/review-evidence.md
- docs/work/BANDIT-082/landing-verdict.md
- docs/work/BANDIT-082/landing-action.md
- docs/work/BANDIT-082/retrospective.md

## Operator Input Status

No operator-owned input is required to create this Work Intake Ledger And Followups Migration work item or complete Stage 1 formation because CURRENT_CONTEXT.md and ROADMAP.md explicitly authorize this slice, FOLLOWUPS.md and docs/design/workflow-cockpit/bandit-ui-polish-source.md identify the current follow-up/UI-polish source metadata, PRD-002 and CONTEXT.md define the Work Intake Ledger boundary, BANDIT-081 is landed and closed, and no bootstrap gaps remain open. Halt for operator input if implementation would change product direction, approve public benchmark publication, approve paid reviewer/model routing, approve hosted services, approve merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, choose live local API/State Index/browser mutation authority, approve guarded action execution, approve explicit cost/risk posture, or make a policy/business decision repo artifacts cannot answer.
