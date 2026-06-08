# BANDIT-076 Orchestration Plan

contract_version: 1
work_item: BANDIT-076
author: work_item_pm
created_at: 2026-06-08T15:25:00Z
status: plan_mode

## Current Repo State

- verdict: pass
- evidence: `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `node ./bin/bandit.mjs cockpit status --json`, `node ./bin/bandit.mjs session-context current --json`, `docs/work/BANDIT-076/brief.md`, `docs/work/BANDIT-076/coordination-log.jsonl`

`BANDIT-076` is the active formed bootstrap-gap chore for Evidence Bundle
Attestation. The current coordination state is `formation_approved`.
`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is active in
`.bandit/bootstrap-gaps.json`, and
`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued behind it.
The prior work item, `BANDIT-075`, is closed and remains the last closed
derived-status anchor until this item lands and closes.

No operator-owned input is required for the next recorded action. Operator
approval remains required for Trust Verifier cutover, old-gate replacement or
wrapping, product or UAT direction changes, policy changes, explicit cost or
risk overrides, paid or external services, merge, push, deploy, hosted
attestation, telemetry, public benchmark publication, and guarded browser
action execution.

## 0. Context And Boundary

- verdict: pass
- evidence: required reads completed: `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-076/brief.md`, `docs/work/BANDIT-076/coordination-log.jsonl`, `docs/templates/work-item-pm-plan.md`
- evidence: git status inspected with `git status --short --branch`; tree has no uncommitted file changes and branch is ahead of `origin/main` by two commits.
- evidence: `git log --oneline -5` shows `cf5b0d9 Approve BANDIT-076 formation`, `3d1f03a Record BANDIT-076 formation blocker`, and `fd16437 Close out BANDIT-075 reviewer calibration`.
- evidence: `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json` agree that `BANDIT-076` is active and Stage 2 RED evidence is missing.
- evidence: `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` all record the next action as drafting this plan and running `work-item-pm start BANDIT-076`.
- evidence: prior work item `BANDIT-075` has closeout commit `fd16437` in the latest git history and is recorded closed in roadmap/status.
- evidence: operator-input status is `none currently required`.

## 1. Repo PM Formation Complete

- verdict: pass
- evidence: `docs/work/BANDIT-076/brief.md` exists and records Stage 1 scope, acceptance criteria, verification plan, clean-code evidence, role boundaries, forbidden actions, and bootstrap-gap linkage.
- evidence: `docs/work/BANDIT-076/qwen-formation-review.md` records `verdict: pass` through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`.
- evidence: `docs/work/BANDIT-076/coderabbit-formation-review.md` records `verdict: bootstrap_gap` for a full 600-second provider timeout, with no CodeRabbit pass claimed.
- evidence: `docs/work/BANDIT-076/formation-review.md` records aggregate `verdict: pass` with CodeRabbit timeout accepted only as replacement evidence.
- evidence: `docs/work/BANDIT-076/coordination-log.jsonl` sequence 3 records `state: formation_approved`.

Work Item PM will not run `repo-pm approve-formation`; Repo PM already recorded
the required transition.

## 2. Stage 2 RED Checklist

- verdict: pass
- evidence: planned artifact `docs/work/BANDIT-076/red-evidence.md`; planned focused test surface `test/evidence-bundle-attestation.test.mjs`

Test Writer owns tests, helpers, fixtures, RED evidence, evidence-bundle
membership cases, freshness and mismatch cases, command-version cases, and
acceptance mappings. RED evidence must map tests or explicit verification plan
items to the accepted criteria in `docs/work/BANDIT-076/brief.md`.

Stage 3 Writer has zero authority to edit tests, test helpers, fixtures, RED
evidence, acceptance mappings, formation evidence, review evidence, landing
evidence, retrospective evidence, or bundle policy acceptance criteria. Because
Codex Work Item PM will author Stage 2 RED evidence during bootstrap, Stage 3
implementation must route to the Claude-family implementation-writer path.

The `red_recorded` coordination transition is required before implementation.

## 3. Stage 3 Implementation Checklist

- verdict: pass
- evidence: planned artifacts `docs/work/BANDIT-076/implementation-evidence.md` and `docs/work/BANDIT-076/writer-report.md`

Implementation Writer owns source/chore delivery only: the bundle policy
artifact, state helper, command wiring, and docs required by the RED evidence.
The Writer may not edit any Test Writer-owned surface. Focused tests must pass
or a bootstrap gap must be recorded honestly.

PM acceptance must verify spec alignment, read-only authority, fail-closed
diagnostics, deterministic hashing, command and policy version capture, source
and evidence freshness handling, and `CLEAN_CODE.md` posture.

Claude must be given 15 minutes to complete implementation-writer work before
the PM interrupts or repairs a stalled task.

## 4. Stage 4 Review Checklist

- verdict: pass
- evidence: planned artifacts `docs/work/BANDIT-076/review-evidence.md`, `docs/work/BANDIT-076/local-qwen-review.md`, `docs/work/BANDIT-076/coderabbit-review.md` or provider-timeout evidence, finding dispositions if needed, risk/supply-chain evidence, and review-subject hash evidence

CodeRabbit review must run or record provider-refusal/provider-timeout
`bootstrap_gap` evidence without claiming a pass. Do not interrupt CodeRabbit
until a full 10 minutes has elapsed.

The only permitted Local Qwen path is `.bandit/reviewers/local-qwen.json`
through `bin/omlx-chat-completions.mjs`. If that path is unavailable, stop and
ask the operator for help.

Escalated review runs only if policy smells require it. Risk classification,
supply-chain gate applicability, review-subject freshness, and every reviewer
finding must be repaired or dispositioned before Stage 5.

## 5. Stage 5 Landing Checklist

- verdict: pass
- evidence: planned artifacts `docs/work/BANDIT-076/landing-verdict.md`, `docs/work/BANDIT-076/landing-action.md`, land-check output, source-head/hash refresh evidence

Landing is local-record bootstrap landing. The expected sequence is a clean
source/evidence commit, source-head/hash refresh, `land-check`, landing verdict,
and `landing-action.md` recording the commit SHA. Feature UAT is expected to be
`not_applicable` unless implementation changes product-facing behavior.

No next work item may start before landing action evidence exists.

## 6. Stage 6 Closeout Checklist

- verdict: pass
- evidence: planned artifacts `docs/work/BANDIT-076/retrospective.md`, improvement dispositions or explicit no-action decisions, `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`

Closeout requires retrospective evidence, structured improvement mining, durable
disposition for every lesson, bootstrap-gap resolution only after landing action
and retrospective evidence exist, synchronized routing files, and final derived
status agreement.

Final verification must include `npm run bandit -- validate`,
`node ./bin/bandit.mjs coordination validate BANDIT-076`,
`node ./bin/bandit.mjs cockpit status --json`,
`node ./bin/bandit.mjs session-context current --json`, and `git diff --check`.

After closeout, keep the last closed work item as the active derived-status
anchor and keep the current-stage sentence in `docs/roadmap/CURRENT_CONTEXT.md`
in the form `The current stage is Stage ...`.

## Stage Sequence

- Stage 2 RED Evidence: Test Writer records RED tests and mappings in `docs/work/BANDIT-076/red-evidence.md`; PM records `red_recorded`.
- Stage 3 Implementation: Claude-family Implementation Writer changes source/chore files only and records `implementation-evidence.md` plus `writer-report.md`; PM records implementation acceptance.
- Stage 4 Review: CodeRabbit, Local Qwen, risk/supply-chain, review-subject hash, and aggregate review evidence run or are honestly dispositioned.
- Stage 5 Landing: Landing Agent records land-check, verdict, source/evidence commit, source-head/hash refresh, and local-record landing action.
- Stage 6 Closeout: Closeout Agent/Codex PM records retrospective, improvement disposition, bootstrap-gap resolution, routing synchronization, validation, and final status agreement.

## Required Evidence

- Stage 2: `docs/work/BANDIT-076/red-evidence.md`, focused RED tests, `coordination-log.jsonl` `red_recorded`.
- Stage 3: `docs/work/BANDIT-076/implementation-evidence.md`, `docs/work/BANDIT-076/writer-report.md`, focused test/typecheck output, PM acceptance.
- Stage 4: `docs/work/BANDIT-076/review-evidence.md`, reviewer artifacts, risk/supply-chain artifacts, review-subject hash evidence, finding dispositions if needed.
- Stage 5: `docs/work/BANDIT-076/landing-verdict.md`, `docs/work/BANDIT-076/landing-action.md`, land-check evidence, commit SHA.
- Stage 6: `docs/work/BANDIT-076/retrospective.md`, improvement/no-action dispositions, bootstrap-gap ledger update, synchronized roadmap/current-context/status files, final validation output.

## Role Boundaries

- Repo PM owns Stage 1 formation, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration and gate sequencing after `formation_approved`; it does not replace Writer, Reviewer, Landing Agent, or Closeout Agent evidence.
- Test Writer owns Stage 2 tests, helpers, fixtures, RED evidence, acceptance mappings, and evidence-bundle cases.
- Implementation Writer owns Stage 3 source/chore delivery only and may not edit Test Writer-owned surfaces.
- Reviewer owns Stage 4 review findings and review verdicts.
- Landing Agent owns Stage 5 landing verdict/action evidence.
- Closeout Agent/Codex PM owns Stage 6 retrospective, improvement dispositions, bootstrap-gap disposition, and routing synchronization.
- Permanent Test Ownership Boundary: Stage 3 Writer cannot create, edit, delete, regenerate, format, or mechanically adjust tests, helpers, fixtures, RED evidence, evidence-bundle mappings, source-artifact mappings, or acceptance mappings for this item.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.

## Verification Commands

- `node --test test/evidence-bundle-attestation.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- gaps list`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `npm test` when implementation touches landing gates, review-subject hashes, trust verify, or validators.
- `node ./bin/bandit.mjs coordination validate BANDIT-076`
- `git diff --check`

## Known Blockers

- verdict: pass
- evidence: `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, `docs/work/BANDIT-076/brief.md`

No current blocker prevents plan-mode orchestration. No operator-owned input is
currently required. Local Qwen unavailability during Stage 4 is a halt
condition requiring operator help. Any need to approve Trust Verifier cutover,
replace or wrap old gates, approve paid/external services, merge, push, deploy,
or alter product/UAT/policy/business/cost/risk posture is operator-owned and
must halt.

## Stop Conditions

- Missing, stale, contradictory, or blocking formation evidence.
- Failure to record `orchestration_plan_recorded`.
- Failure to record `red_recorded` before implementation.
- Stage 3 Writer edits any Test Writer-owned surface.
- Claude implementation-writer task stalls without file edits after the required 15-minute window.
- CodeRabbit returns actionable findings that remain unrepaired or undispositioned.
- CodeRabbit is interrupted before 10 minutes.
- Local Qwen configured route is unavailable.
- Evidence bundle attestation attempts to replace landing authority, Trust Verifier cutover authority, review-subject hash semantics, reviewer routing, UAT authority, gap status, or workflow policy.
- Bundle inputs are missing, stale, unsupported, changed after review, contradictory, or mismatched without fail-closed diagnostics.
- Clean-code blocker remains before landing.
- Required verification fails without an accepted bootstrap gap.
- Any operator-owned decision is required and repo artifacts cannot answer it.

## Forbidden Actions

- Do not approve Trust Verifier cutover or select a Trust Goal for cutover.
- Do not replace or wrap old gates.
- Do not let bundle attestation become canonical verifier, landing authority, reviewer/model routing authority, UAT authority, or gap authority.
- Do not hide missing, stale, unsupported, changed, contradictory, or mismatched evidence behind a hash.
- Do not approve merge, push, deploy, paid reviewer/model routing, paid tools, external services, hosted attestation, telemetry, public benchmark publication, guarded browser action execution, or unrelated cockpit/product scope.
- Do not start Spec-To-Evidence Traceability Matrix, Guarded CLI Action Requests, Improvement Health Surface, or unrelated Phase 8 product work before `BANDIT-076` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, or bundle policy acceptance criteria for this item.
