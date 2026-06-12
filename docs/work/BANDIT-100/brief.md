# BANDIT-100: Project-profile contract and identity-clean init

work_type: slice

## Status

Stage 1: brief_created

Source PRD: BANDIT-PRD-006
Source PRD Path: docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md

## Origin

Operator direction on 2026-06-12 to decompose `BANDIT-PRD-006` into slices
that solve the remaining consumer-agnostic bootstrap gaps observed in the
nntnos consumer repo. This first slice is the shared dependency for the later
reviewer, harness, and policy-tier slices.

## Product Work

This is a Phase 8 product slice. It turns Bandit's self-hosted bootstrap
identity into a consumer-configurable project-profile contract so a fresh repo
can initialize under its own name, work-item prefix, roadmap seed, reviewer
declarations, policy tiers, and target harnesses.

## Source Authority

- Primary source: `docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md`.
- Current routing: `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, `STATUS.md`, and
  `docs/work/BANDIT-100/coordination-log.jsonl`.
- Process authority: `AGENTS.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `CLEAN_CODE.md`, and `docs/verification/STAGE_RUBRICS.md`.
- Gap ledger authority: `.bandit/bootstrap-gaps.json`, which currently records
  no open bootstrap gap ahead of this active slice.

## Goal

A declarative, schema-validated project profile drives bandit init so a new repo is scaffolded deterministically under its own identity with zero Bandit-bootstrap leakage.

## Scope

- Versioned project-profile JSON schema (name, work_item_prefix, starter work item choice, roadmap seed, reviewers, policy_tiers, harnesses)
- bandit init --profile <file> validation and scaffold path
- Shipped profile template plus interview guidance doc for external agents
- Parameterize draft-work PRD H1 regex by configured prefix with BANDIT back-compat
- Remove Bandit roadmap/starter content from all scaffold templates

## Out Of Scope

- Interactive CLI prompts
- Reviewer adapter implementations beyond schema fields (slice 2)
- Harness shim generation (slice 3)
- Policy tier mechanics beyond schema fields (slice 4)

## Acceptance Criteria

- init --profile fails malformed profiles with diagnostics naming the offending field
- Scaffold from an ACME profile contains no BANDIT-001, no Phase 0 - Consumer Onboarding, and no Bandit roadmap strings
- draft-work parses # ACME-PRD-1: headers in an ACME-configured repo and still parses BANDIT-PRD-* documents
- bandit validate passes on a fresh profile-initialized repo

## Test Plan

- Unit tests for schema validation accept/reject cases with diagnostic assertions
- Unit tests for prefix-parameterized PRD header parsing including back-compat
- End-to-end temp-repo fixture: init --profile, validate, grep scaffold for forbidden Bandit-identity strings

## Verification Plan

- Use the Test Plan above as the RED and GREEN verification surface.
- Run focused init, draft-work, and profile-schema tests for this slice.
- Run `npm run typecheck`, `npm test` if shared CLI/init/draft-work behavior changes, `npm run bandit -- validate`, and `git diff --check` before Stage 5.
- Record CodeRabbit review evidence or honest provider-timeout/refusal evidence and authorized Local Qwen review evidence before landing.
- Record clean-code compliance in review and landing evidence before landing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-06-12 before decomposing PRD-006 and
again before repairing this Stage 1 formation brief. This slice must keep the
profile schema, init scaffold, draft-work prefix parser, template edits, and
tests small and explicit; preserve CLI-owned repo-native state as authority;
produce actionable validation diagnostics; and avoid hidden workflow authority
inside generated templates, docs, or projections.

The Implementer must record `CLEAN_CODE.md` read evidence in the work item
implementation evidence before Stage 3 begins.

## Stage-Rubric Checklist

- Stage 1 brief names the profile contract as the shared dependency of slices 2-4
- Stage 2 red evidence captures failing tests for schema validation and identity-leak greps before implementation
- Stage 3 implementation touches only files listed in expected scope
- Stage 4 review includes adversarial pass on schema diagnostics quality
- Landing evidence includes end-to-end fixture run output
- Stage 0 boundary is satisfied: `BANDIT-099` has landing action,
  retrospective, improvement disposition, and synchronized context/status
  evidence; `BANDIT-100` is the only active Stage 1 item.
- Stage 1 formation may proceed only after Local Qwen formation review through
  the authorized MLX adapter route, CodeRabbit terminal verdict or full-window
  timeout evidence, aggregate Repo PM inspection, and
  `repo-pm approve-formation`.
- Stage 2 must map RED tests to acceptance criteria and preserve Test
  Writer-owned tests, helpers, fixtures, RED evidence, and acceptance mappings.
- Stage 3 must use the bootstrap Claude Writer path if Codex authors or
  materially edits Stage 2 RED tests.
- Stage 4 must include CodeRabbit evidence or honest provider-timeout/refusal
  evidence, authorized Local Qwen evidence, risk classification, any
  supply-chain gate evidence if package/template distribution surfaces change,
  and PM disposition of all findings.
- Stage 5 must include landing verdict, clean-code compliance, land-check,
  local-record landing action, and any required UAT status before closeout.
- Stage 6 must record retrospective, improvement/no-action dispositions, and
  synchronized `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` before
  `BANDIT-101` or unrelated work becomes active.

## Bootstrap Gaps

- No active bootstrap gap is linked to `BANDIT-100`; the current gap ledger has
  no open gap ahead of this slice.
- Slice-local validation limitation: no second real consumer repo exists yet to
  validate project-profile generality beyond nntnos. This does not block
  Stage 1 because the acceptance plan requires an ACME-profile temp-repo
  fixture, prefix-native PRD parsing, and Bandit self-hosting continuity. If
  Stage 4 or Stage 6 evidence shows the limitation affects trust in the
  contract, record a durable improvement chore or explicit no-action decision.
- CodeRabbit formation or Stage 4 review may time out or be unavailable; if so,
  record provider-timeout/bootstrap replacement evidence after the full
  prompt-required window and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
  `http://127.0.0.1:8001/v1`. If the endpoint or adapter is unavailable, stop
  and ask the operator for help rather than substituting another reviewer route.

## Bootstrap Gap Or No-Gap Disposition

No open bootstrap gap is authorized ahead of this active slice. The
consumer-profile generality limitation is accepted as slice-local verification
context for Stage 1 only because the PRD already requires deterministic
fixture evidence and later closeout disposition. Any new bootstrap gap
discovered during RED, implementation, review, landing, or closeout must be
recorded in `.bandit/bootstrap-gaps.json` before unrelated work proceeds.

## Expected Files

- src/commands/init.ts
- src/state/project-profile.ts
- src/commands/draft-work.ts
- docs/templates/project-profile.md
- test/init.test.mjs
- test/draft-work.test.mjs
- docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md
- docs/work/BANDIT-100/brief.md
- docs/work/BANDIT-100/coordination-log.jsonl
- docs/work/BANDIT-100/qwen-formation-review.md
- docs/work/BANDIT-100/coderabbit-formation-review.md
- docs/work/BANDIT-100/formation-review.md
- docs/work/BANDIT-100/red-evidence.md
- docs/work/BANDIT-100/implementation-evidence.md
- docs/work/BANDIT-100/review-evidence.md
- docs/work/BANDIT-100/landing-verdict.md
- docs/work/BANDIT-100/landing-action.md
- docs/work/BANDIT-100/retrospective.md
- docs/work/BANDIT-100/improvement-disposition.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Stage 1 Boundary For Expected Files

Repo PM Stage 1 may create or edit only the PRD/source-material routing
artifacts, `BANDIT-100` brief, formation review artifacts, coordination log,
bootstrap-gap ledger if a gap must be recorded, and roadmap/current-status
routing files.

Later RED, implementation, review, landing, UAT, retrospective, and closeout
artifacts are expected downstream surfaces for Work Item PM, Test Writer,
Implementation Writer, reviewers, Landing Agent, and Closeout Agent. Repo PM
must not create `orchestration-plan.md`, RED evidence, implementation
evidence, Stage 4 review evidence, landing evidence, UAT evidence,
retrospective evidence, closeout evidence, or unrelated Phase 8 evidence in
this formation run.

## First Implementation Order

- Define and test the profile schema module
- Wire init --profile to the schema with diagnostics
- Purge Bandit identity from scaffold templates
- Parameterize the PRD header regex
- Add the end-to-end temp-repo fixture

## Smell Triggers

- Any hardcoded BANDIT literal surviving in scaffold output paths
- Schema validation that reports failure without naming the field
- Template content that references Bandit's own roadmap or phases

## Required Evidence

- Red evidence for schema and identity-leak tests
- End-to-end fixture transcript in implementation evidence
- Adversarial review verdict on the profile contract
- `docs/work/BANDIT-100/qwen-formation-review.md`
- `docs/work/BANDIT-100/coderabbit-formation-review.md`
- `docs/work/BANDIT-100/formation-review.md`
- `docs/work/BANDIT-100/coordination-log.jsonl`
- Stage 2 RED evidence with acceptance-criteria mapping
- Stage 3 implementation evidence with clean-code read evidence and Test
  Writer boundary compliance
- Stage 4 aggregate review evidence with CodeRabbit, Local Qwen, risk, and any
  required supply-chain disposition
- Stage 5 landing verdict and landing action evidence
- Stage 6 retrospective and improvement/no-action disposition evidence

## Operator Input Status

none_required.

No operator-owned input is required to approve Stage 1 formation. Halt and ask
the operator only if later work would expand public npm publish automation,
handle publish credentials, approve paid registry setup, approve hosted update
services, approve telemetry, approve automatic self-update, mutate external
repos, mutate installed global skills, mutate automation prompts, add
merge/push/deploy authority, approve Trust Verifier cutover, select a Trust
Goal, replace or wrap old gates, change product or UAT direction, approve
business tradeoffs, approve explicit cost/risk posture, approve paid/live
reviewer or model routing, or resolve genuinely ambiguous scope.

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
`BANDIT-100`, regardless of harness, model family, provider, or convenience.
Any Stage 3 attempt that changes those surfaces must be rejected or routed back
to Test Writer/Work Item PM before implementation evidence can be accepted.

## Bootstrap Model-Family Separation

If Codex authors or materially edits the Stage 2 RED tests for `BANDIT-100`,
Stage 3 implementation must route to the bootstrap Claude Writer path. Codex
may inspect and accept or reject Stage 3 evidence as PM, but Codex-authored RED
tests cannot be followed by Codex-authored Stage 3 implementation.

## Source-Of-Truth And Projection Boundary

The project profile, config, `.bandit/` repo-native state, and CLI-generated
artifacts remain canonical. Generated roadmap/current-context/status files,
templates, docs, profile interview guidance, and future cockpit views are
projections or scaffolds; they must not become independent workflow authority.
`bandit init --profile` may scaffold deterministic repo-local state, but it
must not invent approvals, override policy, or silently mutate external repos.

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
- tdd
- review
allowed_tools:
- local shell commands required for Bandit CLI validation and tests
- authorized Local Qwen MLX adapter route
- CodeRabbit CLI review path
outputs:
- profile schema and init behavior
- prefix-aware PRD parsing
- consumer-neutral scaffold templates and profile guidance
- repo-native evidence artifacts
forbidden_actions:
- orchestration-plan-before-formation-approval
- red-evidence-during-repo-pm-formation
- implementation-during-repo-pm-formation
- stage4-review-evidence-during-repo-pm-formation
- landing-evidence-during-repo-pm-formation
- retrospective-evidence-during-repo-pm-formation
- activate-bandit-101-through-bandit-103-before-bandit-100-closeout
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
- local-api
- state-index
- guarded-browser-action-execution
- unrelated-phase-8-product-work

## Forbidden Actions

- Create `docs/work/BANDIT-100/orchestration-plan.md`, RED evidence,
  implementation evidence, Stage 4 review evidence, landing evidence, UAT
  evidence, retrospective evidence, or closeout evidence during Repo PM Stage 1
  formation.
- Activate, approve, execute, or create downstream evidence for `BANDIT-101`,
  `BANDIT-102`, or `BANDIT-103` before `BANDIT-100` lands and closes.
- Run implementation writers, edit production implementation for this slice,
  create Trust Verifier cutover evidence, merge, push, deploy, publish, mutate
  installed global skills, mutate automation prompts, or start unrelated Phase
  8 work before formation is approved.
- Use direct `qwen` CLI, Ollama, paid/live reviewer routes, or another ad hoc
  reviewer route as Local Qwen evidence.
- Treat CodeRabbit timeout or provider failure as pass evidence.

## Skill Lifecycle Contracts

- `bandit`: required for Stage 1 formation, downstream routing, validation,
  cockpit status, session-context, review commands, and land-check. Owner:
  Bandit repo policy. Rollback: revert the slice before landing or route a
  bootstrap-gap repair if a command contract regresses.
- `tdd`: required for Stage 2 RED evidence and acceptance mapping before
  implementation. Owner: Bandit Test Writer boundary. Rollback: invalidate
  Stage 2 evidence and rerun from a clean Test Writer packet if tests are
  ambiguous, brittle, or weakened.
- `review`: required for CodeRabbit, Local Qwen, PM disposition, and escalated
  review if smell triggers require it. Owner: Bandit reviewer policy and Repo
  PM disposition. Rollback: treat stale, failed, unavailable, or unresolved
  review evidence as blocking until rerun or honestly recorded as a bootstrap
  gap when policy allows.

## Evidence Freshness SLO

All test, review, landing, cockpit, session-context, package, risk,
supply-chain, and review-subject evidence for `BANDIT-100` must be current
under `.bandit/policy/evidence-freshness-slos.json` before Stage 4 aggregation
and Stage 5 landing. Any source change after reviewer or landing evidence
requires freshness check and rerun or explicit stale-evidence disposition
before landing.

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
- CodeRabbit formation and Stage 4 review must receive the prompt-required
  timeout before timeout replacement evidence is recorded.
- Local Qwen unavailability is fail-closed and requires operator help rather
  than an alternate reviewer path.
- Any paid, live, or recurring model/reviewer route remains blocked unless a
  separate approved provider-pricing and spend-class artifact exists.
stage_capability_profiles:
- stage1_formation_only
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
