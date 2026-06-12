# BANDIT-104: Work-execute route should derive current stage from coordination state

## Status

Queued

## Non-Product Work

Repair the Bandit work-execute operator adapter so it derives the next executable route from current append-only coordination state instead of hardcoding the Stage 2 RED route after plan-mode evidence exists.

## Origin

BANDIT-100 Stage 2 and Stage 3 routing exposed a bootstrap gap: coordination status, cockpit status, and session-context had advanced to RED-recorded implementation routing, while `node ./bin/bandit.mjs work-execute --json` still reported the stale Stage 2 route.

origin: BANDIT-100 Stage 2 routing regression during work-execute command use.


source_work_item: BANDIT-100
source_artifacts:
  - docs/work/BANDIT-100/retrospective.md
  - docs/work/BANDIT-100/improvement-disposition.md
  - .bandit/bootstrap-gaps.json
  - src/commands/bandit-work-execute.ts
  - src/state/work-execute-controller.ts
lesson: `work-execute` route derivation must follow coordination state rather than a stale stage assumption.
hypothesis: Deriving the work-execute route from the latest accepted coordination state will prevent stale stage routing after Work Item PM advances a formed item.
metric: `node ./bin/bandit.mjs work-execute --json` reports a next route that agrees with `node ./bin/bandit.mjs coordination status <ID> --json` for active formed work.
baseline: During BANDIT-100 Stage 2, RED evidence and coordination state advanced while `work-execute --json` still returned stale Stage 2 route guidance.
expected_direction: Work-execute and coordination status agree for the next formed item after plan mode and after RED evidence.
decision_criteria: Keep if the first Work Item PM execution after this chore lands observes no stale work-execute route after RED evidence; revise if any supported coordination state still maps to the wrong route; revert if the route derivation blocks valid formed work without a clear blocker.
minimum_detectable_effect: The first evaluation window is small and detects only same-class route drift around plan mode, RED, and implementation handoff states.

evaluation_window: First Work Item PM execution after this chore lands, plus the next slice that progresses from RED to implementation.
reevaluation_window: Recheck after the next two work-execute-assisted slices or chores.
proxy_risk: A route-status agreement check can miss deeper orchestration defects, so Stage 2 through Stage 4 evidence must still verify real behavior.
status: queued

outcome: keep

## Scope

- Make `node ./bin/bandit.mjs work-execute --json` derive its requested stage and reported `stage_reached` from `docs/work/<ACTIVE_ID>/coordination-log.jsonl` for the active formed Work Item.
- Map `formation_approved` with no plan-mode evidence to the existing missing-plan-mode refusal.
- Map `orchestration_plan_recorded` to the Stage 2 RED route only when the plan-mode artifact exists and the coordination log agrees.
- Map `red_recorded` to the next Stage 3 implementation route, with evidence paths and next-safe command text that agree with coordination status and session context.
- Fail closed for unsupported, stale, or contradictory coordination states instead of silently returning the Stage 2 route.
- Keep repo-native artifacts and append-only coordination history as the source of truth; do not let the work-execute adapter own canonical state.
- Preserve Work Item PM plan-mode orchestration as a real gate before RED evidence.
- Keep this chore limited to work-execute route derivation, route-registry usage, focused tests, and related operator-adapter messages.

## Out Of Scope

- Do not start, form, or modify `BANDIT-101`, `BANDIT-102`, `BANDIT-103`, or unrelated PRD-006 product work.
- Do not implement typed reviewer adapters, public publish automation, hosted services, telemetry, automatic self-update, Trust Verifier cutover, claim authority, worktree lifecycle, cockpit UI, State Index, merge, push, deploy, or external repo mutation.
- Do not change Local Qwen reviewer routing; the only authorized path remains `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`.
- Do not weaken Work Item PM plan-mode orchestration, append-only coordination history, Formation Gate evidence, Stage 4 review requirements, Landing Agent authority, or Stage 6 closeout requirements.
- Do not grant implementation writers authority over tests, test helpers, fixtures, RED evidence, or acceptance mappings.

## Acceptance Criteria

- `work-execute --json` no longer hardcodes `requestedStage: "stage_2_red"` after plan mode; it selects the route from the latest accepted coordination state.
- A formed item at `formation_approved` without `orchestration-plan.md` still returns the existing `missing_plan_mode` blocker and `work-item-pm start BANDIT-104` next command.
- An item at `orchestration_plan_recorded` with plan-mode evidence returns the Stage 2 RED route and truthful Stage 2 status.
- An item at `red_recorded` returns a Stage 3 implementation route rather than a stale Stage 2 route.
- Unsupported or contradictory states fail closed with a clear blocker and do not fabricate readiness.
- Focused tests cover the BANDIT-100 regression shape: red evidence recorded while `work-execute --json` would previously return Stage 2.
- The implementation preserves CLI Authority, repo-native source-of-truth boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and Work Item PM plan-mode gate authority.
- The chore does not start `BANDIT-101`, change reviewer adapters, alter PRD-006 product scope, perform Trust Verifier cutover, introduce claim authority, mutate dependencies or lockfiles, create cockpit UI, merge, push, deploy, publish, or change Local Qwen reviewer routing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-06-12 before creating `BANDIT-104`.
The spec, acceptance criteria, and verification plan are scoped so clean-code
compliance can be evaluated against small surface area, explicit state,
failure clarity, role-boundary preservation, and no hidden authority. Stage 5
landing evidence must perform a fresh clean-code compliance check before any
landing action.

## Bootstrap Gaps

Active bootstrap gap:
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`.

This brief links that gap to `BANDIT-104` as an active chore. No additional
bootstrap gap is authorized by Stage 1 formation. If Stage 2 through Stage 6
find another missing final workflow capability, it must be recorded honestly in
`.bandit/bootstrap-gaps.json` and dispositioned during closeout.

## Verification Plan

- Run focused operator-adapter tests for `bandit work-execute --json` at `formation_approved`, `orchestration_plan_recorded`, `red_recorded`, and unsupported coordination states.
- Run focused execute-controller or route-registry tests if the state-to-route mapping moves into shared state code.
- Run `node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs`.
- Run `npm run typecheck`.
- Run `npm test` if shared coordination, session-context, or cockpit route projection behavior changes.
- Run `npm run bandit -- validate`.
- Run `node ./bin/bandit.mjs coordination validate BANDIT-104`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run Stage 4 CodeRabbit and authorized Local Qwen review before landing unless honest provider-timeout or provider-refusal evidence is recorded.
- Run `node ./bin/bandit.mjs land-check BANDIT-104` before landing.
- Run `git diff --check`.

## Expected Files

- docs/specs/BANDIT-104-work-execute-stage-route-advancement.json
- docs/work/BANDIT-104/brief.md
- docs/work/BANDIT-104/coordination-log.jsonl
- docs/work/BANDIT-104/qwen-formation-review.md
- docs/work/BANDIT-104/coderabbit-formation-review.md
- docs/work/BANDIT-104/formation-review.md
- docs/work/BANDIT-104/red-evidence.md
- docs/work/BANDIT-104/implementation-evidence.md
- docs/work/BANDIT-104/review-evidence.md
- docs/work/BANDIT-104/landing-verdict.md
- docs/work/BANDIT-104/landing-action.md
- docs/work/BANDIT-104/retrospective.md
- src/commands/bandit-work-execute.ts
- src/state/work-execute-controller.ts
- src/state/stage-route-registry.ts
- test/bandit-work-command-adapters.test.mjs
- test/work-execute-controller.test.mjs
- test/stage-route-registry.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-104/brief.md
- docs/work/BANDIT-104/coordination-log.jsonl
- docs/work/BANDIT-104/qwen-formation-review.md
- docs/work/BANDIT-104/coderabbit-formation-review.md
- docs/work/BANDIT-104/formation-review.md
- docs/work/BANDIT-104/red-evidence.md
- docs/work/BANDIT-104/implementation-evidence.md
- docs/work/BANDIT-104/review-evidence.md
- docs/work/BANDIT-104/landing-verdict.md
- docs/work/BANDIT-104/landing-action.md
- docs/work/BANDIT-104/retrospective.md

## Operator Input Status

none_required

No operator-owned input is required for Stage 1 formation or the next recorded
Work Item PM plan-mode orchestration. Halt only if later work would require
product direction, UAT, policy change, business tradeoff, explicit cost/risk
override, Trust Verifier cutover approval, old-gate replacement or wrapping,
merge/push/deploy authority, publish credentials, paid recurring reviewer/model
routing, external repo mutation, installed global skill mutation, or genuinely
ambiguous scope.

## Source Authority

- Highest authority: `AGENTS.md` for role boundaries, slice boundaries,
  reviewer routing, bootstrap-gap defaults, and operator-input boundaries.
- Current routing authority: `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, and `.bandit/bootstrap-gaps.json`.
- Source evidence: `docs/work/BANDIT-100/retrospective.md`,
  `docs/work/BANDIT-100/improvement-disposition.md`, and the
  `BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT` ledger entry.
- Source spec: `docs/specs/BANDIT-104-work-execute-stage-route-advancement.json`.
- Stage rubric authority: `docs/verification/STAGE_RUBRICS.md`.
- Clean-code authority: `CLEAN_CODE.md`.

## Source-of-Truth and Projection Boundary

`docs/work/<ID>/coordination-log.jsonl` is the append-only coordination history
for the active Work Item. `work-execute --json`, cockpit status,
session-context, and route payloads are derived projections. They may report
and route from coordination history, but they must not become independent
workflow authority or silently override the coordination log.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json
stages:
- stage1_brief
- work_item_pm_plan_mode
- stage2_red_evidence
- stage3_implementation
- stage4_review
- stage5_landing
- stage6_retrospective
authority_roles:
- codex_pm
- repo_pm
- work_item_pm
- test_writer
- implementation_writer
- reviewer
- landing_agent
- closeout_agent
required_skills:
- bandit
- bandit-stage1-formation
- bandit-stage2-red
- bandit-stage3-implementation
- bandit-stage4-review
- bandit-stage5-landing
- bandit-stage6-closeout
- tdd
allowed_tools:
- `node ./bin/bandit.mjs ...`
- `npm run bandit -- ...`
- `node --test ...`
- `npm run typecheck`
- `npm test` when shared behavior changes
- authorized reviewer tools described in this brief
inputs:
- `docs/work/BANDIT-104/brief.md`
- `docs/work/BANDIT-104/coordination-log.jsonl`
- `docs/specs/BANDIT-104-work-execute-stage-route-advancement.json`
- `.bandit/bootstrap-gaps.json`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
outputs:
- Stage 1 formation review artifacts.
- Stage 2 RED evidence and tests owned by Test Writer.
- Stage 3 source implementation evidence owned by Implementation Writer.
- Stage 4 review evidence owned by reviewers and PM disposition.
- Stage 5 landing verdict/action evidence owned by Landing Agent.
- Stage 6 retrospective and improvement disposition owned by Closeout Agent.
evidence:
- `docs/work/BANDIT-104/qwen-formation-review.md`
- `docs/work/BANDIT-104/coderabbit-formation-review.md`
- `docs/work/BANDIT-104/formation-review.md`
- `docs/work/BANDIT-104/red-evidence.md`
- `docs/work/BANDIT-104/implementation-evidence.md`
- `docs/work/BANDIT-104/review-evidence.md`
- `docs/work/BANDIT-104/landing-verdict.md`
- `docs/work/BANDIT-104/landing-action.md`
- `docs/work/BANDIT-104/retrospective.md`
forbidden_actions:
- Do not start BANDIT-101 or unrelated PRD-006 product work in this chore.
- Do not bypass Work Item PM plan-mode orchestration.
- Do not let work-execute adapter state replace append-only coordination history.
- Do not grant the Stage 3 Writer any test, fixture, RED evidence, or acceptance-mapping write authority.
- Do not change Local Qwen reviewer routing, Trust Verifier cutover policy, dependencies, lockfiles, merge, push, deploy, publish, or hosted service behavior.

## Permanent Test Ownership Boundary

Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, and
acceptance mappings. The Stage 3 Implementation Writer has zero authority to
create, edit, delete, regenerate, format, or mechanically adjust those
surfaces for `BANDIT-104`. If the Stage 3 Writer touches any test-owned
surface, the Stage 3 attempt is invalid and must be reverted and rerun from
unchanged RED evidence.

## Bootstrap Model-Family Separation

If Codex authors or materially edits Stage 2 RED evidence for `BANDIT-104`,
Stage 3 implementation must be assigned to a different model family. During
bootstrap, the default Stage 3 Writer path remains Claude through the approved
Process Adapter route unless the Work Item PM records an authorized fallback
with evidence. Claude-authored implementation cannot use Claude as independent
verification evidence for its own work; escalation returns to Codex PM plus
independent reviewers.

## Stage 1 Stop Boundary

Repo PM formation stops after `formation_approved`. Do not create an
orchestration plan, RED evidence, implementation evidence, review evidence,
landing evidence, UAT evidence, retrospective, or closeout artifacts during
Stage 1 formation.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 formation should stay within local Repo PM artifact repair plus reviewer evidence.
- Stage 4 reviewer runs may be long-running and must use the prompt-required full timeout before provider-timeout evidence is recorded.
provider_pricing_evidence:
- No new paid provider-pricing evidence is approved by this chore.
- Any paid reviewer, paid model, or recurring paid route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If Local Qwen is unavailable, stop and ask the operator for help.
- If CodeRabbit does not return a terminal formation-review verdict within the required window, record explicit bootstrap_gap provider-timeout evidence without claiming a pass.
stage_capability_profiles:
- repo-pm-stage1
- work-item-pm-plan-mode
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6
