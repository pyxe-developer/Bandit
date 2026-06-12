# BANDIT-098: Public Consumer Install Quickstart And Governance Scaffold

## Status

Queued

## Non-Product Work

Make public Bandit installation and day-1 governance onboarding reliable for a fresh consumer repository, so an installed repo has every required starter artifact and documented command needed to run Bandit smoothly from day 1.

## Origin

Operator testing on 2026-06-11 showed that README install and validation commands are not reliable for arbitrary consumer repos. `/Users/matthewflebbe/projects/nntnos` had no `package.json` or local `node_modules`, so the install landed in `/Users/matthewflebbe` and `./node_modules/.bin/bandit` did not exist in the target repo. Fresh temp consumer install evidence also showed that `bandit init` seeds policies and templates but not the starter governance artifacts required by cockpit and session-context commands. Audit evidence is recorded in `docs/reports/public-consumer-install-command-audit-2026-06-11.md` and the active gap ledger entry is `BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART`.

## Scope

- Define the day-1 public consumer contract for a Bandit-governed repository after install and onboarding.
- Make the README public quickstart copy-paste safe for a fresh repository, including the npm project boundary, interim GitHub install path, local binary invocation, and first successful validation sequence.
- Make install docs avoid unavailable public npm as the primary path until `bandit-workflow` is actually published.
- Remove or clearly mark shell placeholders that are not literal copy-paste commands.
- Define whether `bandit init` directly scaffolds starter governance artifacts or whether a separate explicit onboarding command does; implement the selected CLI-owned path.
- Ensure the selected onboarding path creates or preserves starter versions of `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/verification/STAGE_RUBRICS.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and root `STATUS.md` for a fresh consumer repo.
- Ensure scaffolded governance docs are starter contracts for the consumer repo, not copies of Bandit's own active project state, work history, reviewer evidence, roadmap queue, or private local assumptions.
- Ensure `bandit validate`, `bandit cockpit status --json`, and `bandit session-context current --json` have a documented and tested day-1 outcome after the selected onboarding path.
- Add a packed-install consumer smoke or contract test that installs Bandit into a temp repo and executes the documented quickstart plus governance onboarding commands.
- Preserve existing no-overwrite behavior for consumer repos that already have governance artifacts; init or onboarding must not silently replace user-owned files.
- Keep this chore focused on install docs, package distribution metadata, init/onboarding scaffolding, validation behavior, starter docs, and tests.

## Out Of Scope

- Public npm publish automation, publish credential handling, paid registry setup, hosted update services, telemetry, or automatic self-update.
- External repo mutation outside explicit local onboarding files created by the consumer's chosen Bandit init/onboarding command.
- Installed global skill mutation, automation prompt mutation, merge, push, deploy, Trust Verifier cutover, old-gate replacement or wrapping, local API, State Index, guarded browser action execution, and unrelated Phase 8 product work.
- Copying Bandit's active internal work history, reviewer evidence, roadmap queue, private local assumptions, or current project status into consumer starter governance artifacts.
- Claiming the day-1 install path is assured before the packed-install consumer test, focused scaffold tests, review gates, landing action, and retrospective are complete.

## Acceptance Criteria

- The work item brief exists at `docs/work/BANDIT-098/brief.md` and links to `BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART` as the active bootstrap gap.
- Stage 1 brief evidence records `CLEAN_CODE.md` read evidence, source authority, stage capability scope, operator-input status, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, expected files, required evidence, and forbidden actions.
- The public README has a first-use path that works in a repo with no `package.json`: create or detect the npm project boundary, install Bandit locally, run the local CLI safely, initialize/govern the repo, and validate the resulting state.
- The public README distinguishes source-checkout developer commands from consumer-repo commands and does not instruct consumer repos to run Bandit's source-checkout scripts such as `npm run typecheck` or `npm test` unless explicitly marked as source-checkout-only.
- The public README does not present unavailable public npm publishing as the primary install path until `bandit-workflow` is published, while still documenting the intended public npm command as future or post-publish behavior.
- The public README avoids literal angle-bracket placeholders in copy-pasteable shell blocks, or marks placeholder examples as non-copy-pasteable prose.
- Consumer command examples use `npx --no-install bandit`, `npm exec -- bandit`, or a documented local npm script after installation; bare `bandit ...` examples are either removed from copy-paste blocks or explicitly require PATH/global setup.
- The selected CLI-owned onboarding path creates starter `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/verification/STAGE_RUBRICS.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and root `STATUS.md` in a fresh consumer repo.
- Starter governance files state consumer-repo role authority, clean-code expectations, stage verdict vocabulary, bootstrap methodology, current context, roadmap, and operator status without importing Bandit's active work-item history or internal project queue.
- The selected onboarding path creates any directories required by those starter artifacts and preserves existing files without silent overwrite.
- After install plus onboarding in a fresh temp consumer repo, `npx --no-install bandit validate` exits 0.
- After install plus onboarding in a fresh temp consumer repo, `npx --no-install bandit cockpit status --json` exits 0 with a derived status that names the starter phase, current or no active work item, next action, required operator input, and bootstrap gap state.
- After install plus onboarding in a fresh temp consumer repo, `npx --no-install bandit session-context current --json` exits 0 with a focused session context packet based on the starter governance artifacts.
- The package allow-list includes every template or starter artifact needed by the selected onboarding path and excludes Bandit's active `docs/work/**` history, tests, local reports, private compatibility aliases, and repo-local workflow state not needed for consumer onboarding.
- Focused tests or a packed-install contract test prove the documented day-1 sequence in a temporary consumer repo, including the absence of parent-directory install ambiguity.
- Focused tests cover no-overwrite behavior for pre-existing consumer `AGENTS.md`, `CLEAN_CODE.md`, roadmap/current-context, and `STATUS.md` files.
- Focused tests cover the failure or guidance path when the target repo is not an npm package and the user skips the documented npm project boundary.
- Layered risk classification and supply-chain gate evidence are recorded before landing because this work touches package distribution, install docs, CLI init/onboarding behavior, and governance files.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- `BANDIT-GAP-PUBLIC-CONSUMER-INSTALL-QUICKSTART` is resolved only after landing action and retrospective closeout evidence exist for this bounded chore.

## Verification Plan

- Run focused RED evidence proving the current packed install plus `bandit init` does not create the starter governance artifacts and that cockpit/session-context fail in a fresh consumer repo.
- Run focused tests for the selected init/onboarding command creating the required starter governance files in a fresh temp repo.
- Run focused tests for no-overwrite behavior when consumer governance files already exist.
- Run a packed-install contract test in a fresh temporary repo that executes the documented quickstart and day-1 governance onboarding sequence.
- Run `npm pack --dry-run --json` and inspect the package file list for required starter artifacts and excluded active repo history.
- Run focused README command-surface tests or equivalent scripted extraction for copy-pasteable shell blocks if implemented in this slice.
- Run `node --test test/init.test.mjs` if init behavior changes.
- Run `node --test test/private-install-update-channel.test.mjs` if package allow-list behavior changes.
- Run `node --test test/focused-session-context.test.mjs` if starter context shape affects session-context behavior.
- Run `node --test test/cockpit-status.test.mjs` if starter context shape affects cockpit status behavior.
- Run `npm run typecheck`.
- Run `npm test` if implementation touches shared CLI startup, init, validation, package metadata, templates, cockpit status, session-context, roadmap parsing, or command routing.
- Run `npm run bandit -- validate`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-098` for aggregate review evidence freshness before Stage 4 closeout.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-098 --base origin/main` before Stage 4 closeout unless provider-refusal or timeout evidence is recorded.
- Run `npm run bandit -- qwen-review BANDIT-098` before Stage 4 closeout.
- Run `npm run bandit -- land-check BANDIT-098` before landing.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

`CLEAN_CODE.md` was read on 2026-06-11 before forming `BANDIT-098` and again before this formation repair. The slice must keep README command hardening, init/onboarding scaffolding, starter template rendering, package allow-list updates, status/session/cockpit parsing, and tests small and explicit. Any solution must avoid hidden workflow authority, preserve no-overwrite behavior, keep starter governance files consumer-neutral, and provide clear failure messages for missing npm project boundaries or skipped onboarding.

## Stage Rubric Checklist

| Requirement | Verdict | Evidence |
| --- | --- | --- |
| Stage 0 context readiness | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `.bandit/bootstrap-gaps.json` identify active gap chore `BANDIT-098` and the exact next action. |
| Stage 1 source authority | pass | Operator install failures, public-consumer audit report, gap ledger, numeric source spec, and brief all point to the same day-1 install/governance scaffold contract. |
| Stage 1 verifiable acceptance | pass | Acceptance covers README command safety, npm boundary, starter governance files, no-overwrite behavior, packed-install temp consumer test, cockpit/session-context outcomes, package allow-list, supply-chain evidence, and clean-code closeout. |
| Stage 1 clean-code readiness | pass | Dated `CLEAN_CODE.md` read evidence is recorded in this brief. |
| Stage 1 role boundaries | pass | Stage capability scope preserves Repo PM, Work Item PM, Test Writer, Implementation Writer, Reviewer, Landing Agent, and Closeout Agent boundaries. |
| Stage 1 forbidden actions | pass | Out-of-scope and forbidden-action sections exclude publish automation, credentials, hosted services, telemetry, global skill mutation, Trust Verifier cutover, local API, State Index, merge/push/deploy, and unrelated Phase 8 work. |

## Relevant Smell Triggers And Escalation Plan

- Supply-chain-sensitive surface: package metadata, package allow-list, install docs, local executable entrypoint, and onboarding templates require supply-chain gate evidence before landing.
- Workflow-authority surface: starter `AGENTS.md`, `CLEAN_CODE.md`, stage rubrics, current-context, roadmap, and status files must remain consumer starter contracts and must not become hidden Bandit project-state authority.
- Command-surface ambiguity: README shell blocks, npm project-boundary handling, `npx` usage, and bare `bandit` examples must be tested against fresh consumer behavior and fail with clear guidance when prerequisites are skipped.
- Evidence freshness: CodeRabbit, Local Qwen, review-subject hash, land-check, cockpit status, session-context, typecheck, tests, and package dry-run evidence must be current under `.bandit/policy/evidence-freshness-slos.json` before landing.
- Escalation path: unresolved supply-chain, package-distribution, command-surface, no-overwrite, source-trust, or starter-governance authority concerns become Stage 4 blockers unless explicitly dispositioned by Codex PM as non-blocking with durable follow-up or no-action rationale.

## Role Boundary Evidence

- Repo PM owns Stage 1 formation, formation review, and formation approval.
- Work Item PM may start only after `formation_approved` is recorded and must record plan-mode orchestration before RED evidence.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, and acceptance mappings.
- Implementation Writer owns Stage 3 production implementation only and has no authority to edit Stage 2 test surfaces for this work item.
- Reviewers own Stage 4 review evidence; Landing Agent owns the landing verdict and landing action evidence; Closeout Agent/Codex PM owns retrospective and improvement disposition.

## Permanent Test Ownership Boundary

The Stage 3 Implementation Writer must not edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-098`. If Stage 3 edits a test surface, the Stage 3 attempt is invalid and must be rerun from clean RED evidence.

## Bootstrap Model-Family Separation

If Codex authors or materially edits the Stage 2 RED tests for `BANDIT-098`, Stage 3 implementation must route to the bootstrap Claude Writer path. Codex may inspect and accept or reject Stage 3 evidence as PM, but Codex-authored RED tests cannot be followed by Codex-authored Stage 3 implementation.

## First Implementation Order

1. Record RED evidence showing the current packed install plus `bandit init` fails the day-1 governance scaffold contract in a fresh consumer repo.
2. Add or repair focused tests for starter governance scaffold creation, no-overwrite behavior, missing npm project boundary guidance, cockpit/session-context day-1 outcomes, and packed-install consumer quickstart execution.
3. Implement the selected CLI-owned onboarding path and starter governance templates with clear source-of-truth boundaries.
4. Repair README public consumer quickstart commands and source-checkout versus consumer-repo command separation.
5. Verify package allow-list contents and excluded active repo state.
6. Run focused tests, typecheck, full test suite if shared surfaces changed, Bandit validation, cockpit status, session-context, review-subject hash, CodeRabbit, Local Qwen, land-check, and `git diff --check`.

## Expected Files

- docs/specs/BANDIT-098-public-consumer-install-quickstart-and-governance-scaffold.json
- docs/work/BANDIT-098/brief.md
- docs/work/BANDIT-098/qwen-formation-review.md
- docs/work/BANDIT-098/coderabbit-formation-review.md
- docs/work/BANDIT-098/formation-review.md
- docs/work/BANDIT-098/coordination-log.jsonl
- docs/work/BANDIT-098/red-evidence.md
- docs/work/BANDIT-098/implementation-evidence.md
- docs/work/BANDIT-098/writer-report.md
- docs/work/BANDIT-098/stage3-pm-acceptance.md
- docs/work/BANDIT-098/coderabbit-review.md
- docs/work/BANDIT-098/local-qwen-review.md
- docs/work/BANDIT-098/review-evidence.md
- docs/work/BANDIT-098/landing-verdict.md
- docs/work/BANDIT-098/landing-action.md
- docs/work/BANDIT-098/retrospective.md
- docs/work/BANDIT-098/improvement-disposition.md
- README.md
- package.json
- bin/bandit.mjs
- src/cli.ts
- src/commands/init.ts
- src/commands/validate.ts
- src/commands/cockpit.ts
- src/commands/session-context.ts
- src/state/templates.ts
- src/state/paths.ts
- src/state/cockpit-status.ts
- src/state/focused-session-context.ts
- docs/templates
- test/init.test.mjs
- test/public-consumer-install-quickstart.test.mjs
- test/private-install-update-channel.test.mjs
- test/cockpit-status.test.mjs
- test/focused-session-context.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-098/brief.md
- docs/work/BANDIT-098/qwen-formation-review.md
- docs/work/BANDIT-098/coderabbit-formation-review.md
- docs/work/BANDIT-098/formation-review.md
- docs/work/BANDIT-098/coordination-log.jsonl
- docs/work/BANDIT-098/red-evidence.md
- docs/work/BANDIT-098/implementation-evidence.md
- docs/work/BANDIT-098/review-evidence.md
- docs/work/BANDIT-098/landing-verdict.md
- docs/work/BANDIT-098/landing-action.md
- docs/work/BANDIT-098/retrospective.md
- docs/work/BANDIT-098/improvement-disposition.md

## Operator Input Status

No further operator-owned input is required before forming this bootstrap-gap chore. The operator supplied the product expectation: installing Bandit in a new repo should provide everything required to run smoothly from day 1. Codex PM owns the technical boundary, scaffold contents, init/onboarding command design, README command shape, package allow-list, test strategy, and review routing. Halt only if implementation would add public npm publish automation, handle publish credentials, approve paid registry setup, approve hosted update services, approve telemetry, approve automatic self-update, mutate external repos outside explicit local onboarding files, mutate installed global skills or automation prompts, add merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, change product or UAT direction, approve business tradeoffs, approve explicit cost/risk posture, approve paid/live reviewer routing, or expand into unrelated Phase 8 product scope.

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

## Skill Lifecycle Contracts

- `bandit`: required for Stage 1 formation, Stage 2/3/4/5/6 routing, validation, cockpit status, session-context, review-subject hash, review commands, and land-check. Owner: Bandit repo policy. Rollback: revert the slice before landing or route a bootstrap-gap repair if a command contract regresses.
- `tdd`: required for Stage 2 RED evidence and acceptance mapping before implementation. Owner: Bandit Test Writer boundary. Rollback: invalidate Stage 2 evidence and rerun from a clean Test Writer packet if tests are ambiguous, brittle, or weakened.
- `review`: required for Stage 4 CodeRabbit, Local Qwen, PM disposition, and escalated review if smell triggers require it. Owner: Bandit reviewer policy and Repo PM disposition. Rollback: treat stale, failed, unavailable, or unresolved review evidence as blocking until rerun or honestly recorded as a bootstrap gap when policy allows.
- Existing lifecycle policy reference: `.bandit/policy/skill-lifecycle-contracts.json`; this brief records the slice-local lifecycle application and any missing centralized lifecycle metadata remains a future hardening concern, not authority to skip review or test gates.

## Evidence Freshness SLO

All test, review, landing, cockpit, session-context, package dry-run, and review-subject-hash evidence for `BANDIT-098` must be current under `.bandit/policy/evidence-freshness-slos.json` before Stage 4 aggregation and Stage 5 landing. Any source change after reviewer or landing evidence requires a freshness check and rerun or explicit stale-evidence disposition before landing.

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
