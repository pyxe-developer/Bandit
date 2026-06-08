# BANDIT-074 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-074
work_type: chore
author: work_item_pm
created_at: 2026-06-08T03:15:00Z
verdict: pass

This plan is Work Item PM orchestration evidence only. It does not replace the
brief, coordination log, RED evidence, implementation evidence, review evidence,
landing evidence, retrospective, roadmap, current context, root status, or
bootstrap-gap ledger.

## Current Repo State

- verdict: pass
- evidence: `git status --short --branch` reported `## main...origin/main [ahead 1]` with no dirty files; `git log --oneline -5` showed `0a991ab Form BANDIT-074 metamorphic checks`, `1af5d12 Close out BANDIT-073 gate determinism flake gate`, `1626949 Record BANDIT-073 landing verdict`, `be860e6 Record BANDIT-073 review evidence`, and `0177a13 Record BANDIT-073 Qwen review evidence`.
- evidence: `node ./bin/bandit.mjs cockpit status --json` selected active work item `BANDIT-074`, current next action `Work Item PM should run plan-mode orchestration for BANDIT-074...`, required operator input `none_required`, Stage 1 brief `pass`, Stage 2 RED evidence `missing`, and coordination state `formation_approved`.
- evidence: `node ./bin/bandit.mjs session-context current --json` selected active work item `BANDIT-074`, active bootstrap gap `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS`, current stage `Stage 1: formation approved`, required operator input `none_required`, and allowed only plan-mode orchestration.
- evidence: `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` agree that `BANDIT-074` is Stage 1 formation approved and the next action is Work Item PM plan-mode orchestration.
- evidence: `node ./bin/bandit.mjs coordination validate BANDIT-073` passed; `docs/work/BANDIT-073/landing-action.md` and `docs/work/BANDIT-073/retrospective.md` exist, so the previous work item is fully landed and closed before this Work Item proceeds.

## 0. Context And Boundary

- Required reads complete: pass. Evidence: `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-074/brief.md`, `docs/work/BANDIT-074/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md` were read before this plan.
- Git status inspected and dirty state classified: pass. Evidence: clean working tree on `main`, ahead of `origin/main` by the local formation commit `0a991ab`.
- `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context agree: pass. Evidence: all name `BANDIT-074` as Stage 1 formation approved and route to plan-mode orchestration.
- Prior Work Item is fully closed: pass. Evidence: `docs/work/BANDIT-073/landing-action.md`, `docs/work/BANDIT-073/retrospective.md`, and `node ./bin/bandit.mjs coordination validate BANDIT-073`.
- Operator-input status is explicit: pass. Evidence: current context and session-context report `none_required`; brief halts only for product, UAT, policy, business, cost/risk, Trust Verifier cutover, paid/external tooling, live routing, merge/push/deploy, or ambiguous scope decisions.

## 1. Repo PM Formation Complete

- Brief exists and satisfies Stage 1: pass. Evidence: `docs/work/BANDIT-074/brief.md` includes work type, non-product work, origin, scope, out of scope, acceptance criteria, verification plan, `CLEAN_CODE.md` read evidence, expected files, required evidence, operator-input status, role boundaries, stage capability scope, token-cost failsafe, source-of-truth/projection boundary, first implementation order, smell triggers, and bootstrap gaps.
- Qwen formation review exists and is not blocking: pass. Evidence: `docs/work/BANDIT-074/qwen-formation-review.md` reports `verdict: pass`, no findings, and authorized MLX adapter route through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`.
- CodeRabbit formation review exists and is not blocking: bootstrap_gap. Evidence: `docs/work/BANDIT-074/coderabbit-formation-review.md` records provider timeout after the full 10-minute window, no CodeRabbit pass claimed, and bootstrap replacement evidence accepted by aggregate formation review.
- Aggregate formation review exists and is not blocking: pass. Evidence: `docs/work/BANDIT-074/formation-review.md` reports `verdict: pass` with the CodeRabbit provider timeout dispositioned as bootstrap replacement evidence. The artifact's pre-approval next-action wording is superseded by the later append-only `formation_approved` transition in `docs/work/BANDIT-074/coordination-log.jsonl`.
- `coordination-log.jsonl` records `formation_approved`: pass. Evidence: sequence 2 records state `formation_approved` from `repo-pm approve-formation` with evidence paths for Qwen, CodeRabbit, and aggregate formation review.

## 2. Stage 2 RED Checklist

- Test Writer owns tests, fixtures, RED evidence, and acceptance mappings: pass. Evidence: `docs/work/BANDIT-074/brief.md` role-boundary section assigns Stage 2 tests, helpers, fixtures, cross-projection acceptance mappings, perturbation fixtures, expected-output mappings, and RED evidence to Test Writer.
- RED evidence maps tests or verification plan to acceptance criteria: pass. Evidence required next: `docs/work/BANDIT-074/red-evidence.md` must map focused RED tests to acceptance criteria covering cross-projection agreement, fail-closed disagreement, harmless perturbation invariance, non-harmless semantic drift, and Local Qwen route restrictions where reviewer evidence is touched.
- Stage 3 Writer has zero test-edit authority: pass. Evidence: brief lines under Permanent Test Ownership Boundary forbid Stage 3 Writer changes to tests, helpers, fixtures, RED evidence, acceptance mappings, perturbation fixtures, expected outputs, source-artifact mappings, and related test surfaces.
- If Codex authors RED, Stage 3 routes to Claude/different model family: pass. Evidence: brief requires Claude-family Stage 3 implementation during bootstrap after Codex-authored RED evidence.
- `red_recorded` is required before implementation: pass. Evidence required next: append-only coordination transition from Stage 2 must exist before Stage 3 dispatch; implementation is blocked until `docs/work/BANDIT-074/red-evidence.md` exists and coordination records RED.

## 3. Stage 3 Implementation Checklist

- Implementation Writer owns source/chore delivery only: pass. Evidence: brief limits Stage 3 to source implementation only and assigns policy artifact, validator/parser/command wiring, docs, and validation behavior to implementation delivery.
- No Writer test-surface edits: pass. Evidence required later: `docs/work/BANDIT-074/implementation-evidence.md`, Writer report, and git diff must show no Stage 3 Writer edits to test surfaces, fixtures, RED evidence, or acceptance mappings.
- Focused tests pass or bootstrap gap is recorded: pass. Evidence required later: run focused metamorphic/cross-projection tests, `npm run typecheck`, and stage-appropriate Bandit commands; record bootstrap gaps only for unavailable final gates.
- `implementation-evidence.md` and Writer report exist: pass. Evidence required later: `docs/work/BANDIT-074/implementation-evidence.md` and implementation Writer report must map code paths to acceptance criteria, focused verification, clean-code posture, writer identity, and no-test-edit evidence.
- PM acceptance verifies spec alignment and clean-code posture: pass. Evidence required later: Codex PM acceptance must apply `CLEAN_CODE.md` before Stage 4 and reject hidden authority, broad normalization, unrelated product scope, or oversized mixed orchestration.
- Claude 15-minute rule: pass. Evidence required later: when Claude is dispatched for Stage 3, allow the run a full 15 minutes before interruption unless it exits or records a blocker earlier.

## 4. Stage 4 Review Checklist

- CodeRabbit review or provider-refusal/bootstrap-gap evidence: pass. Evidence required later: run `npm run bandit -- coderabbit-review pre-pr BANDIT-074 --base origin/main` and wait the full 10-minute window before timeout handling; record provider timeout/refusal without claiming pass if unavailable.
- Local Qwen review: pass. Evidence required later: run only `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; direct `qwen` CLI evidence is forbidden.
- Escalated review if policy smells require it: pass. Evidence required later: apply smell triggers, source-trust, supply-chain, layered risk, and reviewer disagreement rules; escalate only when policy requires and route Claude-authored-code adjudication back to Codex PM, not Claude.
- Risk classification: pass. Evidence required later: Stage 4 aggregate review must classify blast radius, never-auto-landable surfaces, source trust, input quarantine, supply-chain sensitivity, smell triggers, and auto-land eligibility.
- Supply-chain gate when applicable: pass. Evidence required later: if dependency, lockfile, package script, CI/release workflow, skill, fetched-prompt, or external install surfaces are touched, record supply-chain gate evidence or bootstrap gap.
- Every finding repaired or dispositioned: pass. Evidence required later: `docs/work/BANDIT-074/review-evidence.md` and finding-disposition artifacts must repair or disposition all actionable findings and cross-model tension.
- Aggregate review evidence current for the review subject: pass. Evidence required later: run `node ./bin/bandit.mjs review-subject-hash BANDIT-074` and ensure review evidence applies to the current source head.

## 5. Stage 5 Landing Checklist

- Landing verdict exists: pass. Evidence required later: `docs/work/BANDIT-074/landing-verdict.md` must provide an agent-owned verdict.
- Feature UAT handled when applicable: not_applicable. Evidence: brief marks `work_type: chore`; no product-facing UAT is required unless implementation changes product-facing behavior.
- `land-check` passes: pass. Evidence required later: `npm run bandit -- land-check BANDIT-074` must pass before landing or record the exact blocker.
- Local-record landing source/evidence commit precedes landing action: pass. Evidence required later: make a focused source/evidence commit first, refresh source-head/hash evidence, then run local-record landing.
- `landing-action.md` records commit SHA or merge evidence: pass. Evidence required later: `docs/work/BANDIT-074/landing-action.md` must record the landed local commit SHA before closeout.
- No next Work Item starts before landing action exists: pass. Evidence: brief and roadmap forbid starting queued reviewer calibration, evidence attestation, traceability, or product slices before `BANDIT-074` landing action and closeout evidence exist.

## 6. Stage 6 Closeout Checklist

- Retrospective exists: pass. Evidence required later: `docs/work/BANDIT-074/retrospective.md`.
- Structured improvement mining complete: pass. Evidence required later: retrospective must include failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use pressure, reviewer/model routing, tool invocation friction, recurring inefficiency, cost/latency signals, and unresolved uncertainty.
- Every lesson has durable disposition: pass. Evidence required later: improvement chore, cross-model tension, smell update, or explicit no-action decision for every material lesson.
- `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` updated if state changed: pass. Evidence required later: closeout must route to the next queued bootstrap gap, `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS`, while keeping the last closed work item as the active derived-status anchor until next formation.
- cockpit status and session-context agree: pass. Evidence required later: rerun both derived commands after closeout edits.
- `validate` and `git diff --check` pass: pass. Evidence required later: `npm run bandit -- validate` and `git diff --check`.

## Stage Sequence

1. Stage 2 RED evidence: Test Writer/Codex PM authors focused RED tests and `docs/work/BANDIT-074/red-evidence.md`, then records the RED coordination transition.
2. Stage 3 implementation: Claude implementation Writer delivers only source/chore implementation under the approved brief and unchanged RED surfaces; Work Item PM waits the required 15-minute window before interruption.
3. Stage 3 PM acceptance: Codex PM verifies focused tests, implementation evidence, no test edits, spec alignment, and clean-code posture.
4. Stage 4 review: CodeRabbit, Local Qwen MLX adapter, risk classification, supply-chain gate if applicable, review-subject hash, aggregate review, and finding dispositions.
5. Stage 5 landing: landing verdict, land-check, focused source/evidence commit, source-head/hash refresh, local-record landing action.
6. Stage 6 closeout: retrospective, structured improvement mining, bootstrap-gap disposition, routing/status synchronization, final validation, and closeout commit.

## Required Evidence

- Stage 2: `docs/work/BANDIT-074/red-evidence.md`, focused RED tests, acceptance mapping, no Stage 3 test-edit authority, and coordination transition.
- Stage 3: `docs/work/BANDIT-074/implementation-evidence.md`, Writer report, focused test results, typecheck result, clean-code self-check, writer identity/model-family evidence, and no-test-edit proof.
- Stage 4: `docs/work/BANDIT-074/review-evidence.md`, CodeRabbit evidence or timeout/refusal disposition, Local Qwen evidence through the MLX adapter route, review-subject hash, risk/supply-chain classification, and finding dispositions.
- Stage 5: `docs/work/BANDIT-074/landing-verdict.md`, land-check output, focused source/evidence commit SHA, refreshed source-head/hash evidence, and `docs/work/BANDIT-074/landing-action.md`.
- Stage 6: `docs/work/BANDIT-074/retrospective.md`, improvement/no-action dispositions, bootstrap-gap ledger update, `.bandit/events.jsonl` transition evidence, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, final derived status outputs, `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-074`, and `git diff --check`.

## Role Boundaries

- Repo PM: owns Stage 1 formation, formation approval, bootstrap-gap queue formation, and repo-level closure after Work Item closeout.
- Work Item PM: owns this orchestration plan and stage gate management for exactly `BANDIT-074`; it does not invent scope, approve formation, or skip stage evidence.
- Test Writer: owns Stage 2 tests, fixtures, helpers, RED evidence, perturbation fixtures, expected-output mappings, cross-projection acceptance mappings, and acceptance mappings.
- Implementation Writer: owns Stage 3 source/chore implementation only and has no authority over test surfaces, RED evidence, mappings, review evidence, landing evidence, or retrospective evidence.
- Reviewer: owns Stage 4 review evidence; Local Qwen must use the MLX adapter route and CodeRabbit must wait the full 10-minute window before timeout disposition.
- Landing Agent: owns Stage 5 landing verdict/action evidence after current tests, reviews, risk classification, and land-check.
- Closeout Agent/Codex PM: owns Stage 6 retrospective, structured improvement mining, durable dispositions, bootstrap-gap closeout, and routing/status synchronization.
- Permanent Test Ownership Boundary: the Stage 3 Writer must not create, edit, delete, regenerate, format, or mechanically adjust any test, helper, fixture, RED evidence, perturbation fixture, expected-output mapping, source-artifact mapping, or acceptance mapping for `BANDIT-074`.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap; Claude cannot serve as independent adjudication for its own implementation.

## Verification Commands

- `git status --short --branch`
- `git log --oneline -5`
- focused RED/GREEN test command selected after test file creation, expected to include `test/metamorphic-cross-projection-checks.test.mjs`
- `npm run typecheck`
- `npm test` if shared projections or validators are touched
- `npm run bandit -- validate`
- `npm run bandit -- gaps list`
- `node ./bin/bandit.mjs cockpit status --json`
- `node ./bin/bandit.mjs session-context current --json`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-074`
- `npm run bandit -- coderabbit-review pre-pr BANDIT-074 --base origin/main`
- Local Qwen review through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`
- `npm run bandit -- land-check BANDIT-074`
- `node ./bin/bandit.mjs coordination validate BANDIT-074`
- `git diff --check`

## Known Blockers

- verdict: pass
- evidence: no operator-owned input is currently required.
- evidence: CodeRabbit formation timed out and is already dispositioned as bootstrap replacement evidence; Stage 4 must rerun CodeRabbit or record fresh provider timeout/refusal evidence without claiming a pass.
- evidence: Local Qwen formation passed through the authorized MLX route; Stage 4 must use the same authorized route.
- evidence: active queued follow-ons remain blocked behind `BANDIT-074`: reviewer calibration, evidence bundle attestation, and spec-to-evidence traceability.

## Stop Conditions

- Missing or stale required stage evidence that cannot be mechanically repaired inside Work Item PM authority.
- Stage 2 cannot produce RED evidence or map tests to acceptance criteria.
- Stage 3 Writer edits any test surface, fixture, RED evidence, or acceptance mapping.
- Claude Stage 3 implementation cannot be dispatched or remains unavailable after the required 15-minute wait and no replacement evidence is authorized.
- CodeRabbit or Local Qwen review has unresolved actionable findings, or unavailable review lacks honest provider-timeout/refusal/bootstrap-gap evidence.
- Policy smells require escalation that cannot be satisfied without operator-owned approval.
- Implementation crosses product direction, UAT, Trust Verifier cutover, old-gate replacement/wrapping, business, cost/risk, paid/external tooling, public benchmark publication, hosted service, telemetry, merge, push, deploy, or unrelated product scope.
- Landing verdict is `needs-repair`, `blocked`, or requires operator-owned approval.
- Derived cockpit/session-context status disagrees after closeout and the mismatch cannot be repaired mechanically from repo artifacts.

## Forbidden Actions

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or make cross-projection checks canonical verifier authority for unrelated live work.
- Do not build reviewer calibration, evidence bundle attestation, spec-to-evidence traceability, paid reviewer routing, model routing promotion, public benchmark publication, hosted replay services, telemetry, external reporting, merge/push/deploy behavior, guarded browser action execution, or unrelated cockpit/product scope.
- Do not treat cockpit status, session-context, land-check, roadmap/status parsing, trust-verifier-compatible outputs, or any new derived view as independent workflow authority.
- Do not mask projection disagreement by selecting the most favorable derived surface or normalizing away trust-relevant drift.
- Do not start later queued bootstrap gaps or unrelated Phase 8 product work until `BANDIT-074` has landing action, retrospective, improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not accept direct `qwen` CLI reviewer output as Local Qwen evidence.
