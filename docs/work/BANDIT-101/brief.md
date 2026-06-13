# BANDIT-101: Typed reviewer adapters with honest degradation

work_type: slice

## Status

Stage 1: brief_created

Source PRD: BANDIT-PRD-006
Source PRD Path: docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md
Source Spec Path: docs/specs/BANDIT-101-typed-reviewer-adapters-with-honest-degradation.json

## Origin

Operator direction on 2026-06-12 approved the public, consumer-agnostic
Bandit bootstrap direction and `BANDIT-PRD-006` decomposed that direction into
`BANDIT-100` through `BANDIT-103`. `BANDIT-100` landed the project-profile
dependency. `BANDIT-104` then resolved the blocking work-execute route
bootstrap gap. Live roadmap and current-context artifacts now authorize this
second PRD-006 slice, provided no open bootstrap gap takes precedence.

## Product Work

This is a Phase 8 product slice. It makes adversarial reviewer setup
consumer-agnostic by turning hardcoded Local Qwen assumptions into typed
reviewer adapter configuration while preserving fail-closed landing gates when
no reviewer exists.

## Source Authority

- Primary source: `docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md`.
- Source spec:
  `docs/specs/BANDIT-101-typed-reviewer-adapters-with-honest-degradation.json`.
- Current routing: `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, `STATUS.md`, and
  `docs/work/BANDIT-101/coordination-log.jsonl`.
- Process authority: `AGENTS.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `CLEAN_CODE.md`, and `docs/verification/STAGE_RUBRICS.md`.
- Gap ledger authority: `.bandit/bootstrap-gaps.json`, which currently records
  no open bootstrap gap ahead of this slice.

## Goal

Adversarial review works with any OpenAI-compatible endpoint, CLI command, or
human reviewer, and the absence of a reviewer is an explicit recorded gap that
blocks landing rather than a silent weakening.

## Scope

- Reviewer adapter contract with types `openai_compatible`, `cli_command`, and
  `human`.
- Type-specific reviewer adapter validation with actionable diagnostics.
- Profile-driven reviewer scaffolding under `.bandit/reviewers/`.
- Generalize the current Local Qwen review path to consume an
  `openai_compatible` adapter while keeping the current
  `.bandit/reviewers/local-qwen.json` route working unchanged.
- `reviewers: []` or equivalent no-reviewer state records an explicit
  bootstrap gap or no-reviewer state wired into landing-gate checks.
- Human reviewer adapter evidence satisfies the same review-gate contract
  without claiming a model review ran.
- Reviewer config, review evidence, gap state, and landing-gate decisions
  remain repo-native and CLI-owned.

## Out Of Scope

- Same-harness self-review defaults.
- Reviewer quality calibration changes, reviewer benchmark scoring, paid
  reviewer promotion thresholds, or recurring paid reviewer policy.
- Hosted reviewer services, telemetry, public benchmark publication, paid/live
  reviewer routing, provider-pricing evidence, or spend-class approval.
- Harness-neutral `AGENTS.md` generation, harness shims, policy tiers, V0
  trial work, local API, State Index, guarded browser actions, Trust Verifier
  cutover, old-gate replacement or wrapping, claim authority, worktree
  lifecycle, merge, push, deploy, public npm publish automation, credential
  handling, hosted update services, automatic self-update, dependency,
  lockfile, package-script, or CI/release workflow changes.
- Changing Local Qwen's authorized route away from
  `.bandit/reviewers/local-qwen.json` through
  `node bin/omlx-chat-completions.mjs`.
- RED evidence, implementation, review-loop evidence, landing evidence, UAT
  evidence, retrospective evidence, or closeout evidence during Repo PM Stage 1
  formation.

## Acceptance Criteria

- Each adapter type validates at init or profile/config load with
  type-specific required fields and diagnostics naming the offending field.
- Existing Local Qwen flow runs unchanged as an `openai_compatible` instance
  through `.bandit/reviewers/local-qwen.json` and
  `node bin/omlx-chat-completions.mjs`.
- Empty reviewer configuration yields an open no-reviewer gap or equivalent
  explicit state that blocks `land-check` until dispositioned.
- A `human` adapter produces or validates a review-evidence path that satisfies
  the same gate contract without claiming Local Qwen, CodeRabbit, or another
  model reviewer ran.
- Reviewer adapter config and generated `.bandit/reviewers/` files are
  data/config surfaces, not hidden workflow authority.
- Focused tests cover adapter validation, scaffold output, Local Qwen
  regression routing, empty-reviewer landing blockade, disposition unblock
  behavior, and human-reviewer evidence validation.
- The slice preserves CLI Authority, repo-native source-of-truth boundaries,
  Permanent Test Ownership Boundary, Bootstrap Model-Family Separation,
  authorized Local Qwen routing, and fail-closed reviewer evidence semantics.

## Test Plan

- Unit tests per adapter type for validation and scaffold output, including
  missing required fields and diagnostic text.
- Regression test that the existing Local Qwen policy fixture routes through
  `.bandit/reviewers/local-qwen.json` and
  `node bin/omlx-chat-completions.mjs`.
- Gate test: `land-check` blocks with open no-reviewer state and unblocks only
  after a valid disposition.
- Human adapter evidence test proving manual review evidence can satisfy the
  same gate contract without model-review claims.

## Verification Plan

- Use the Test Plan above as the RED and GREEN verification surface.
- Run focused reviewer-adapter, profile/init, Local Qwen routing, and
  landing-gate tests for this slice.
- Run `npm run typecheck`.
- Run `npm test` if shared CLI startup, profile parsing, reviewer commands,
  landing gates, bootstrap gaps, validation, risk classification,
  supply-chain gates, cockpit/session-context, or package scaffolding behavior
  changes.
- Run `npm run bandit -- validate`, `node ./bin/bandit.mjs cockpit status
  --json`, `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check` before landing.
- Record CodeRabbit terminal review evidence or only policy-accepted
  provider-failure evidence, plus authorized Local Qwen review evidence, before
  landing.
- Record clean-code compliance in review and landing evidence before landing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-06-12 before creating the explicit
`BANDIT-101` source spec and repairing this Stage 1 formation brief. This
slice must keep reviewer adapter validation, scaffold generation, Local Qwen
route reuse, no-reviewer gap recording, human review evidence, landing-gate
integration, diagnostics, and tests small and explicit; avoid hidden workflow
authority; preserve role boundaries; preserve the Permanent Test Ownership
Boundary; and avoid mixing harness shims, policy tiers, reviewer benchmark
policy, paid/live routing, Trust Verifier cutover, merge/push/deploy,
dependency, package-script, CI/release workflow, or unrelated Phase 8 behavior
into this slice.

The Implementer must record `CLEAN_CODE.md` read evidence in the work item
implementation evidence before Stage 3 begins.

## Stage-Rubric Checklist

- Stage 0 boundary is satisfied: `BANDIT-104` has verification evidence,
  landing verdict, landing-action evidence, retrospective evidence,
  improvement disposition evidence, closed coordination evidence, synchronized
  context/status routing, and no open bootstrap gap ahead of `BANDIT-101`.
- Stage 1 brief names source authority, scope, out-of-scope boundaries,
  acceptance criteria, verification plan, clean-code read evidence, no-gap
  disposition, expected files, required evidence, role boundaries,
  operator-input status, source-of-truth boundary, stage capability scope, and
  forbidden actions.
- Stage 2 RED evidence must include adapter validation, scaffold output, Local
  Qwen regression routing, blocked landing with no reviewer, disposition
  unblock behavior, and human-adapter evidence tests before implementation.
- Stage 3 implementation must use a different model family if Codex authors or
  materially edits RED tests and must not edit tests, test helpers, fixtures,
  RED evidence, acceptance mappings, or Test Writer-owned evidence.
- Stage 4 review must include CodeRabbit terminal evidence or policy-accepted
  provider failure evidence, authorized Local Qwen evidence, risk
  classification, any required supply-chain disposition, and PM disposition of
  all findings.
- Stage 5 must include landing verdict, clean-code compliance, land-check,
  local-record landing action, and any required UAT status before closeout.
- Stage 6 must record retrospective, improvement/no-action dispositions, and
  synchronized `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` before
  `BANDIT-102`, `BANDIT-103`, V0 trial work, or unrelated work becomes active.

## Bootstrap Gaps

- No open bootstrap gap is authorized ahead of this active slice.
- Only one real in-house live OpenAI-compatible reviewer endpoint, Local Qwen,
  is available for live verification of `openai_compatible` behavior in this
  slice. This does not block Stage 1 because acceptance requires Local Qwen
  regression tests and config-level adapter validation. If Stage 4 or Stage 6
  evidence shows the limitation affects trust in the adapter contract, record a
  durable improvement chore, bootstrap gap, or explicit no-action decision.
- CodeRabbit formation or Stage 4 review may time out or be unavailable; do
  not claim a CodeRabbit pass without terminal evidence.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
  `http://127.0.0.1:8001/v1`. If the endpoint or adapter is unavailable, stop
  and ask the operator for help rather than substituting another reviewer route.

## Bootstrap Gap Or No-Gap Disposition

No open bootstrap gap currently blocks `BANDIT-101`. `BANDIT-104` resolved the
only blocking gap ahead of this slice:
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`.

The one-real-live-endpoint limitation is accepted as slice-local verification
context at Stage 1 because this work's first contract is typed adapter
validation and fail-closed no-reviewer handling, not reviewer-quality
calibration or paid/live route promotion.

## Expected Files

- docs/specs/BANDIT-101-typed-reviewer-adapters-with-honest-degradation.json
- docs/work/BANDIT-101/brief.md
- docs/work/BANDIT-101/coordination-log.jsonl
- docs/work/BANDIT-101/qwen-formation-review.md
- docs/work/BANDIT-101/coderabbit-formation-review.md
- docs/work/BANDIT-101/formation-review.md
- docs/work/BANDIT-101/red-evidence.md
- docs/work/BANDIT-101/implementation-evidence.md
- docs/work/BANDIT-101/writer-report.md
- docs/work/BANDIT-101/stage3-pm-acceptance.md
- docs/work/BANDIT-101/coderabbit-review.md
- docs/work/BANDIT-101/local-qwen-review.md
- docs/work/BANDIT-101/review-evidence.md
- docs/work/BANDIT-101/landing-verdict.md
- docs/work/BANDIT-101/landing-action.md
- docs/work/BANDIT-101/retrospective.md
- docs/work/BANDIT-101/improvement-disposition.md
- src/state/reviewer-adapters.ts
- src/state/project-profile.ts
- src/commands/init.ts
- src/commands/qwen-review.ts
- src/commands/land-check.ts
- src/commands/validate.ts
- docs/templates/local-qwen-review.md
- test/reviewer-adapters.test.mjs
- test/local-qwen-review.test.mjs
- test/landing-gates.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/reviewers/local-qwen.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Stage 1 Boundary For Expected Files

Repo PM Stage 1 may create or edit only the source spec, `BANDIT-101` brief,
formation review artifacts, coordination log, and routing/status files needed
to record formation approval.

Later RED, implementation, review, landing, UAT, retrospective, and closeout
artifacts are expected downstream surfaces for Work Item PM, Test Writer,
Implementation Writer, reviewers, Landing Agent, and Closeout Agent. Repo PM
must not create `orchestration-plan.md`, RED evidence, implementation
evidence, Stage 4 review evidence, landing evidence, UAT evidence,
retrospective evidence, closeout evidence, or unrelated Phase 8 evidence in
this formation run.

## First Implementation Order

- Define and test the typed reviewer adapter contract.
- Refit the existing Local Qwen path onto the `openai_compatible` adapter
  without changing the authorized route.
- Add `cli_command` and `human` adapter validation and evidence handling.
- Wire the no-reviewer gap or state into `land-check`.
- Preserve focused tests and diagnostics for each failure path.

## Smell Triggers

- Reviewer identity hardcoded outside `.bandit/reviewers/`.
- A landing path that passes with zero review evidence and no dispositioned
  no-reviewer gap.
- Endpoint assumptions baked into review prompts, commands, or landing gates
  instead of typed adapter config.
- Direct `qwen` CLI, Ollama, paid/live reviewer routes, or another ad hoc
  local reviewer route treated as Local Qwen evidence.
- Reviewer config, generated templates, profile docs, cockpit/session-context
  output, or command output becoming canonical workflow authority.

## Required Evidence

- Red evidence for adapter validation, scaffold output, Local Qwen regression,
  no-reviewer landing blockade, disposition unblock behavior, and human
  adapter evidence validation.
- Local Qwen regression run output.
- Adversarial review verdict from a configured adapter.
- `docs/work/BANDIT-101/qwen-formation-review.md`
- `docs/work/BANDIT-101/coderabbit-formation-review.md`
- `docs/work/BANDIT-101/formation-review.md`
- `docs/work/BANDIT-101/coordination-log.jsonl`
- Stage 2 RED evidence with acceptance-criteria mapping.
- Stage 3 implementation evidence with clean-code read evidence and Test
  Writer boundary compliance.
- Stage 4 aggregate review evidence with CodeRabbit, Local Qwen, risk, and any
  required supply-chain disposition.
- Stage 5 landing verdict and landing action evidence.
- Stage 6 retrospective and improvement/no-action disposition evidence.

## Operator Input Status

none_required.

No operator-owned input is required to approve Stage 1 formation. Halt and ask
the operator only if later work would approve paid or live reviewer/model
routing, provider pricing, hosted services, telemetry, credential handling,
public npm publish automation, automatic self-update, external repo mutation,
installed global skill mutation, automation prompt mutation, merge/push/deploy
authority, Trust Verifier cutover, old-gate replacement/wrapping, product or
UAT direction changes, business tradeoffs, explicit cost/risk posture, or
genuinely ambiguous scope.

## Role Boundary Evidence

Repo PM owns this Stage 1 brief, formation review routing, and formation
approval. Test Writer owns Stage 2 RED evidence and test/fixture changes.
Implementation Writer owns Stage 3 source implementation after RED evidence and
must not edit tests, test helpers, fixtures, RED evidence, or acceptance
mappings for this work item. Reviewers and Landing Agent own their normal Stage
4 and Stage 5 artifacts.

## Permanent Test Ownership Boundary

The Stage 3 Implementation Writer has no authority to edit tests, test helpers,
fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence for
`BANDIT-101`, regardless of harness, model family, provider, or convenience.
Any Stage 3 attempt that changes those surfaces must be rejected or routed back
to Test Writer/Work Item PM before implementation evidence can be accepted.

## Bootstrap Model-Family Separation

If Codex authors or materially edits the Stage 2 RED tests for `BANDIT-101`,
Stage 3 implementation must route to the bootstrap Claude Writer path. Codex
may inspect and accept or reject Stage 3 evidence as PM, but Codex-authored RED
tests cannot be followed by Codex-authored Stage 3 implementation.

## Source-Of-Truth And Projection Boundary

Reviewer adapter config, `.bandit/reviewers/`, `.bandit/bootstrap-gaps.json`,
work-item evidence, and CLI-generated policy artifacts remain repo-native
workflow state. Generated profile guidance, scaffold templates, command output,
session-context packets, cockpit views, caches, or docs may summarize or
project reviewer setup, but they must not become independent review or landing
authority.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json
stages:
- stage1_brief
- formation_review
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
- tdd
- review
allowed_tools:
- local shell commands required for Bandit CLI validation and tests
- authorized Local Qwen MLX adapter route
- CodeRabbit CLI review path
outputs:
- typed reviewer adapter contract
- reviewer scaffold validation and output
- Local Qwen route regression evidence
- no-reviewer gap or state evidence
- human reviewer evidence contract
- repo-native evidence artifacts
forbidden_actions:
- orchestration-plan-before-formation-approval
- red-evidence-during-repo-pm-formation
- implementation-during-repo-pm-formation
- stage4-review-evidence-during-repo-pm-formation
- landing-evidence-during-repo-pm-formation
- uat-evidence-during-repo-pm-formation
- retrospective-evidence-during-repo-pm-formation
- closeout-evidence-during-repo-pm-formation
- paid-live-routing
- reviewer-benchmark-policy
- harness-shims
- policy-tiers
- public-npm-publish-automation
- publish-credential-handling
- paid-registry-setup
- hosted-update-service
- telemetry
- automatic-self-update
- external-repo-mutation
- installed-global-skill-mutation
- automation-prompt-mutation
- merge-push-deploy
- trust-verifier-cutover
- old-gate-replacement-or-wrapping
- dependency-change
- lockfile-change
- package-script-change
- ci-release-workflow-change
- unrelated-phase-8-product-work

## Forbidden Actions

- Create `docs/work/BANDIT-101/orchestration-plan.md`, RED evidence,
  implementation evidence, Stage 4 review evidence, landing evidence, UAT
  evidence, retrospective evidence, or closeout evidence during Repo PM Stage 1
  formation.
- Activate, approve, execute, or create downstream evidence for `BANDIT-102`,
  `BANDIT-103`, V0 trial work, Trust Verifier cutover, or unrelated work before
  `BANDIT-101` lands and closes.
- Run implementation writers, edit production implementation for this slice,
  merge, push, deploy, publish, mutate installed global skills, mutate
  automation prompts, mutate external repos, alter dependencies or lockfiles,
  alter CI/release workflows, or start unrelated Phase 8 work before formation
  is approved.
- Use direct `qwen` CLI, Ollama, paid/live reviewer routes, or another ad hoc
  reviewer route as Local Qwen evidence.
- Treat CodeRabbit timeout, provider failure, malformed output, missing route,
  stale evidence, or review blockers as pass evidence.

## Skill Lifecycle Contracts

- `bandit`: required for Stage 1 formation, downstream routing, validation,
  cockpit status, session-context, review commands, and land-check. Owner:
  Bandit repo policy. Rollback: revert the slice before landing or route a
  bootstrap-gap repair if a command contract regresses.
- `bandit-stage1-formation`: required for this Repo PM formation run. Owner:
  Bandit repo policy. Rollback: stop at the emitted Stage 1 blocker and repair
  only the missing prerequisite.
- `tdd`: required for Stage 2 RED evidence and acceptance mapping before
  implementation. Owner: Bandit Test Writer boundary. Rollback: invalidate
  Stage 2 evidence and rerun from a clean Test Writer packet if tests are
  ambiguous, brittle, or weakened.
- `review`: required for CodeRabbit, Local Qwen, PM disposition, and escalated
  review if smell triggers require it. Owner: Bandit reviewer policy and Repo
  PM disposition. Rollback: treat stale, failed, unavailable, or unresolved
  review evidence as blocking until rerun or honestly recorded under the
  applicable policy.

## Evidence Freshness SLO

All test, review, landing, cockpit, session-context, risk, supply-chain, and
review-subject evidence for `BANDIT-101` must be current under
`.bandit/policy/evidence-freshness-slos.json` before Stage 4 aggregation and
Stage 5 landing. Any source change after reviewer or landing evidence requires
freshness check and rerun or explicit stale-evidence disposition before
landing.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- formation_review
- stage3_implementation
- stage4_review
provider_pricing_evidence:
- not_applicable_local_qwen
- not_applicable_coderabbit_cli
spend_classes:
- local_or_included
continuation_decisions:
- CodeRabbit formation review must receive the full 600-second
  prompt-required timeout before any failed attempt is recorded.
- Repo PM must retry CodeRabbit formation review up to two more times after a
  timeout and stop for operator assistance if all three attempts fail to
  produce terminal evidence.
- Local Qwen unavailability is fail-closed and requires operator help rather
  than an alternate reviewer path.
- Any paid, live, or recurring model/reviewer route remains blocked unless a
  separate approved provider-pricing and spend-class artifact exists.
stage_capability_profiles:
- stage1_formation_only
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
