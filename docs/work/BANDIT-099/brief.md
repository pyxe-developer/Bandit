# BANDIT-099: Public Consumer Onboarding Hardening

## Status

Queued

## Non-Product Work

Repair the remaining public consumer onboarding gaps left after BANDIT-098: starter governance must be model-agnostic, README guidance must be scaffolded or explicitly linked from init, first-time command examples must use invocation forms that work before PATH/global setup, and day-1 onboarding must guide the operator through governance strictness and role/model choices.

## Origin

Operator review after BANDIT-098 closeout on 2026-06-12 identified four remaining onboarding gaps: the starter AGENTS contract still names Codex as PM/engineering manager even though Bandit is model agnostic; the user has no clear onboarding guidance for how to use Bandit, including governance strictness and role/model selection; README.md is packaged but not created or linked as a starter artifact by `bandit init`; and first-time command examples still include bare `bandit` commands that do not work in a newly installed consumer repo before npx, npm exec, npm scripts, or PATH setup.

## Out Of Scope

- Public npm publish automation, publish credential handling, paid registry setup, hosted update services, telemetry, automatic self-update, or external repo mutation beyond explicit local starter-onboarding files.
- Installed global skill mutation, automation prompt mutation, merge/push/deploy authority, Trust Verifier cutover, old-gate replacement or wrapping, local API work, State Index work, guarded browser action execution, V0 Closeout Claude Code A/B Product-Value Trial implementation, or unrelated Phase 8 product work.
- Replacing Bandit's role taxonomy with provider-specific defaults; this chore may explain role/model choices, but it must keep starter governance model-agnostic and operator-configurable.
- Weakening no-overwrite behavior for consumer-owned README.md or governance files.

## Scope

- Make starter governance artifacts model-agnostic: AGENTS.md, CLEAN_CODE.md, stage rubrics, and onboarding copy must refer to Bandit roles and configured agents/providers rather than declaring Codex as the repository PM or default authority.
- Define and implement a day-1 onboarding guidance surface for consumer repos that explains how to choose Bandit strictness, role ownership, reviewer availability, and model/provider routing without creating hosted services, telemetry, paid routing, or publish automation.
- Decide whether `bandit init` should scaffold a README.md, a Bandit-specific onboarding README, or an explicit pointer from existing README/governance files; implement the selected no-overwrite behavior.
- Remove or quarantine bare `bandit ...` first-time command examples from README and starter docs unless they are explicitly behind npm script, npm exec, npx, global install, or PATH setup prerequisites.
- Add focused tests or a packed-install consumer test proving the documented first-time commands work in a fresh consumer repo.
- Preserve existing no-overwrite behavior for consumer-owned README.md and governance files.
- Keep this chore focused on public consumer onboarding, starter documentation, init scaffolding, README command guidance, and tests.

## Acceptance Criteria

- The corrective work item brief exists at `docs/work/BANDIT-099/brief.md` and links to `BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING` as the active bootstrap gap.
- Starter `AGENTS.md` produced by `bandit init` is model-agnostic and does not declare Codex as the PM or engineering manager for arbitrary consumer repos.
- Starter clean-code and stage-rubric text does not imply Codex-only governance where Bandit roles, configured providers, or operator-selected agents are intended.
- Consumer onboarding guidance explains the decisions a first-time operator must make: governance strictness, role ownership, model/provider selection for implementation and review roles, Local Qwen availability, fallback behavior, and which decisions remain operator-owned.
- The onboarding guidance is available immediately after `bandit init` in a fresh consumer repo without requiring private Bandit repo history or chat context.
- `bandit init` handles README onboarding with explicit no-overwrite behavior: it creates a starter README or Bandit onboarding document when safe, or preserves an existing README and writes a clear Bandit-specific pointer elsewhere.
- First-time public README command blocks use `npx --no-install bandit`, `npm exec -- bandit`, or a documented npm script until a global/PATH setup is explicitly established.
- No copy-pasteable first-time command block contains bare `bandit init`, `bandit validate`, `bandit cockpit status --json`, `bandit session-context current --json`, or `bandit update-check --json` without an explicit prerequisite that makes bare `bandit` available.
- Focused tests or packed-install tests prove the day-1 documented command sequence succeeds in a fresh consumer repo.
- Focused tests prove no-overwrite behavior for an existing consumer README.md and existing governance artifacts.
- The package allow-list includes any new starter onboarding template required by `bandit init` and still excludes active Bandit work history and private local state.
- Layered risk classification and supply-chain gate evidence are recorded before landing because this work touches package distribution, install docs, CLI init/onboarding behavior, and governance files.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- `BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING` is resolved only after landing action and retrospective closeout evidence exist for this bounded chore.

## Verification Plan

- Run focused RED evidence showing the current starter AGENTS.md and starter clean-code/rubric text are Codex-specific where the consumer contract should be model-agnostic.
- Run focused RED evidence showing current first-time command examples include bare `bandit` commands before npm script, npm exec, npx, global install, or PATH setup.
- Run focused RED evidence showing `bandit init` does not create or link a README/onboarding guide that helps a consumer choose strictness and role/model configuration.
- Run focused tests for model-agnostic starter governance artifacts.
- Run focused tests for README or onboarding-guide creation and no-overwrite behavior.
- Run a packed-install consumer test in a fresh temporary repo that executes the documented first-time command sequence.
- Run `node --test test/init.test.mjs` if init behavior changes.
- Run `node --test test/public-consumer-install-quickstart.test.mjs` if public quickstart behavior changes.
- Run `node --test test/private-install-update-channel.test.mjs` if package allow-list behavior changes.
- Run `npm run typecheck`.
- Run `npm test` if implementation touches shared CLI startup, init, validation, package metadata, templates, cockpit status, session-context, roadmap parsing, or command routing.
- Run `npm run bandit -- validate`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-099` for aggregate review evidence freshness before Stage 4 closeout.
- Run CodeRabbit review before Stage 4 closeout unless provider-refusal or timeout evidence is recorded.
- Run authorized Local Qwen review before Stage 4 closeout.
- Run `node ./bin/bandit.mjs land-check BANDIT-099` before landing.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-12 before repairing this Stage 1 brief. This chore must keep onboarding, init scaffolding, package allow-list, README command guidance, and tests small and explicit; preserve source-of-truth and no-hidden-authority boundaries; preserve role boundaries; preserve the Permanent Test Ownership Boundary; and avoid mixing public publish automation, hosted services, telemetry, Trust Verifier cutover, merge/push/deploy, local API, State Index, guarded browser action execution, V0 trial implementation, or unrelated Phase 8 behavior into this onboarding-hardening slice.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-098 landed and closed with landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, and `BANDIT-099` is the active bootstrap-gap chore at `brief_created`.
- Stage 1: Work-Item Brief And Spec | pass after formation review | This brief defines non-product work, source authority, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, active bootstrap-gap disposition, expected files, required evidence, role boundaries, operator-input status, stage capability scope, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next after formation approval | Test Writer must produce RED evidence for model-agnostic starter governance, executable first-time command examples, onboarding/README init availability, no-overwrite behavior, and packed-install consumer verification.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must route to a different model family if Codex authors RED tests and must not edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit review or honest provider-timeout/refusal evidence, Local Qwen through the authorized MLX adapter route, layered risk classification, supply-chain gate, aggregate review, review-subject hash, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not active unless implementation adds a user-facing workflow surface beyond local onboarding/docs/init behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before V0 trial, Trust Verifier cutover, or unrelated next work begins.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING`.
- CodeRabbit formation or Stage 4 review may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence after the full prompt-required wait and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8001/v1`. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- No public npm publish automation, credential handling, paid registry setup, hosted update service, telemetry, automatic self-update, external repo mutation, installed global skill mutation, automation prompt mutation, merge/push/deploy, Trust Verifier cutover, old-gate replacement or wrapping, local API, State Index, guarded browser action execution, V0 trial implementation, or unrelated Phase 8 work is approved by this chore.

## Bootstrap Gap Or No-Gap Disposition

`BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING` is active and linked to this chore. It remains unresolved until Stage 5 landing action and Stage 6 retrospective/improvement disposition closeout evidence are recorded. No other open bootstrap gap is authorized ahead of this active chore in the current repo state.

## Expected Files

- docs/specs/BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING.json
- docs/work/BANDIT-099/brief.md
- docs/work/BANDIT-099/qwen-formation-review.md
- docs/work/BANDIT-099/coderabbit-formation-review.md
- docs/work/BANDIT-099/formation-review.md
- docs/work/BANDIT-099/coordination-log.jsonl
- docs/work/BANDIT-099/red-evidence.md
- docs/work/BANDIT-099/implementation-evidence.md
- docs/work/BANDIT-099/writer-report.md
- docs/work/BANDIT-099/stage3-pm-acceptance.md
- docs/work/BANDIT-099/coderabbit-review.md
- docs/work/BANDIT-099/local-qwen-review.md
- docs/work/BANDIT-099/review-evidence.md
- docs/work/BANDIT-099/landing-verdict.md
- docs/work/BANDIT-099/landing-action.md
- docs/work/BANDIT-099/retrospective.md
- docs/work/BANDIT-099/improvement-disposition.md
- README.md
- package.json
- src/commands/init.ts
- test/init.test.mjs
- test/public-consumer-install-quickstart.test.mjs
- test/private-install-update-channel.test.mjs
- .bandit/bootstrap-gaps.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Stage 1 Boundary For Expected Files

Only the source spec, brief, formation review artifacts, coordination log, bootstrap-gap ledger, roadmap/current-context, and STATUS routing may be created or edited during Repo PM Stage 1 formation.

Later listed RED, implementation, review-loop, landing, UAT, retrospective, and closeout artifacts are expected downstream surfaces for Work Item PM, Test Writer, Implementation Writer, reviewers, Landing Agent, and Closeout Agent. Repo PM must not create `orchestration-plan.md`, RED evidence, implementation evidence, Stage 4 review evidence, landing evidence, UAT evidence, retrospective evidence, closeout evidence, V0 trial evidence, Trust Verifier cutover evidence, or unrelated Phase 8 evidence in this run.

## First Implementation Order

1. Repo PM records formation review evidence and approves formation before Work Item PM execution.
2. Work Item PM records or verifies plan-mode orchestration only after `formation_approved` and before RED evidence.
3. Test Writer writes failing tests for model-agnostic starter governance, onboarding/README init availability, no-overwrite behavior, first-time command examples, package allow-list, and packed-install consumer command execution.
4. Implementation Writer makes the minimal README/template/init/package/test changes needed to satisfy RED evidence, without editing Test Writer-owned files if Codex authored the RED tests.
5. Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, layered risk classification, supply-chain gate evidence, review-subject hash, CodeRabbit, Local Qwen, land-check, and `git diff --check`.
6. Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, bootstrap-gap resolution, and synchronized current context, roadmap, and STATUS state.

## Smell Triggers

- Any implementation that keeps Codex-specific starter governance where Bandit roles or configured providers should be model-agnostic is a product and clean-code blocker.
- Any copy-pasteable first-time command block that uses bare `bandit` before npx, npm exec, npm script, global install, or PATH setup is a blocker.
- Any implementation that overwrites an existing consumer README.md or governance artifact without explicit no-overwrite behavior is a blocker.
- Any implementation that makes starter onboarding dependent on private Bandit repo history, chat context, hosted services, telemetry, paid routing, or public publish automation is a blocker.
- Any implementation that treats README, templates, cockpit projections, or onboarding text as canonical workflow state instead of CLI-owned repo-native artifacts is a blocker.
- Any implementation that uses direct `qwen` CLI, Ollama, paid/live reviewer routes, or another ad hoc reviewer route as Local Qwen evidence is a blocker.
- Any implementation that reports CodeRabbit timeout, provider error, malformed output, missing route, stale evidence, review blockers, or gate failure as success is a blocker.
- Any implementation that lets an Implementation Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence is a blocker.
- Any implementation that auto-approves product direction, UAT, policy, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, old-gate replacement/wrapping, merge/push/deploy, paid/live reviewer routing, hosted service, telemetry, external mutation, installed global skill mutation, automation prompt mutation, credential handling, public package publishing, paid registry setup, hosted update service, automatic self-update, or ambiguous scope is a blocker.

## Required Evidence

- docs/work/BANDIT-099/brief.md
- docs/work/BANDIT-099/qwen-formation-review.md
- docs/work/BANDIT-099/coderabbit-formation-review.md
- docs/work/BANDIT-099/formation-review.md
- docs/work/BANDIT-099/coordination-log.jsonl
- docs/work/BANDIT-099/red-evidence.md
- docs/work/BANDIT-099/implementation-evidence.md
- docs/work/BANDIT-099/review-evidence.md
- docs/work/BANDIT-099/landing-verdict.md
- docs/work/BANDIT-099/landing-action.md
- docs/work/BANDIT-099/retrospective.md
- docs/work/BANDIT-099/improvement-disposition.md

## Operator Input Status

No further operator-owned input is required before forming this bootstrap-gap chore. The operator supplied the product expectation: Bandit is model agnostic, day-1 users need onboarding guidance for strictness and role/model choices, README guidance should be available from init, and first-time commands must use invocations that actually work in a consumer repo. Codex PM owns the technical boundary, scaffold contents, command shape, package allow-list, test strategy, and review routing. Halt only if implementation would add public npm publish automation, handle publish credentials, approve paid registry setup, approve hosted update services, approve telemetry, approve automatic self-update, mutate external repos outside explicit local onboarding files, mutate installed global skills or automation prompts, add merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, change product or UAT direction, approve business tradeoffs, approve explicit cost/risk posture, approve paid/live reviewer routing, or expand into unrelated Phase 8 product scope.

## Permanent Test Ownership Boundary

The Stage 3 Implementation Writer has no authority to edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence for `BANDIT-099`, regardless of harness, model family, provider, or convenience. Any implementation attempt that changes those surfaces must be rejected or routed back to Test Writer/Work Item PM before Stage 3 evidence can be accepted.

## Bootstrap Model-Family Separation

If Codex authors or materially edits the Stage 2 RED tests for `BANDIT-099`, Stage 3 implementation must route to the bootstrap Claude Writer path. Codex may inspect and accept or reject Stage 3 evidence as PM, but Codex-authored RED tests cannot be followed by Codex-authored Stage 3 implementation.

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
forbidden_actions:
- npm-publish-automation
- publish-credential-handling
- paid-registry-setup
- hosted-update-service
- telemetry
- automatic-self-update
- external-repo-mutation-outside-explicit-local-onboarding
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

- Create `docs/work/BANDIT-099/orchestration-plan.md`, RED evidence, implementation evidence, Stage 4 review evidence, landing evidence, UAT evidence, retrospective evidence, or closeout evidence during Repo PM Stage 1 formation.
- Run implementation writers, edit production implementation for this chore, create Trust Verifier cutover evidence, merge, push, deploy, publish, mutate installed global skills, mutate automation prompts, or start unrelated Phase 8 work before formation is approved.
- Use direct `qwen` CLI, Ollama, paid/live reviewer routes, or another ad hoc reviewer route as Local Qwen evidence.
- Treat CodeRabbit timeout or provider failure as pass evidence.

## Skill Lifecycle Contracts

- `bandit`: required for Stage 1 formation, downstream routing, validation, cockpit status, session-context, review-subject hash, review commands, and land-check. Owner: Bandit repo policy. Rollback: revert the slice before landing or route a bootstrap-gap repair if a command contract regresses.
- `tdd`: required for Stage 2 RED evidence and acceptance mapping before implementation. Owner: Bandit Test Writer boundary. Rollback: invalidate Stage 2 evidence and rerun from a clean Test Writer packet if tests are ambiguous, brittle, or weakened.
- `review`: required for CodeRabbit, Local Qwen, PM disposition, and escalated review if smell triggers require it. Owner: Bandit reviewer policy and Repo PM disposition. Rollback: treat stale, failed, unavailable, or unresolved review evidence as blocking until rerun or honestly recorded as a bootstrap gap when policy allows.
- Existing lifecycle policy reference: `.bandit/policy/skill-lifecycle-contracts.json`; this brief records the slice-local lifecycle application and any missing centralized lifecycle metadata remains future hardening scope, not authority to skip review or test gates.

## Evidence Freshness SLO

All test, review, landing, cockpit, session-context, package dry-run, packed-install, risk/supply-chain, and review-subject-hash evidence for `BANDIT-099` must be current under `.bandit/policy/evidence-freshness-slos.json` before Stage 4 aggregation and Stage 5 landing. Any source change after reviewer or landing evidence requires a freshness check and rerun or explicit stale-evidence disposition before landing.

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
- CodeRabbit formation and Stage 4 review should receive the prompt-required timeout before timeout replacement evidence is recorded.
- Local Qwen unavailability is fail-closed and requires operator help rather than an alternate reviewer path.
- Any paid, live, or recurring model/reviewer route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
stage_capability_profiles:
- stage1_formation_only
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
