# BANDIT-071: Private Installable Distribution And Update Notification Channel

## Status

Brief Created

work_type: chore

## Non-Product Work

Make Bandit installable across multiple private repos while keeping public npm publishing out of scope, and add a CLI-owned update notification path so installed repos can see when a newer private Bandit release is available.

## Origin

Operator direction on 2026-06-07 clarified the distribution posture: Bandit should not be public yet, but it should be installable in multiple private repos and the CLI should alert when updates are available so the operator can start using Bandit while continuing development. Current repo evidence shows the package has a `bandit` bin entry, but `package.json` is marked private, the runtime bin depends on package-local `tsx` from devDependencies, and packed tarball installation fails because `tsx` is missing. Bandit also has no private update-channel policy, no install source metadata, no update-check command, and no non-blocking CLI update alert.

## Scope

- Define a private, non-public distribution contract for installing Bandit in multiple repos without publishing to public npm.
- Prefer a private Git/tag or private registry compatible install path that preserves explicit versioning, reproducible installs, and operator control. Do not introduce public npm publishing in this chore.
- Make the CLI package installable from the selected private channel by fixing runtime dependency or build output issues, package file allow-listing, executable bin behavior, and packed-install smoke verification.
- Define repo-local install/update metadata such as installed package name, installed version, source channel, current source ref or tag, check cadence, last check result, and update alert state.
- Add a CLI-owned update check that compares the installed Bandit version or ref with the configured private update source and reports available updates without silently mutating the consumer repo.
- Show update alerts on normal CLI use only when update checking is configured, non-blocking, freshness-bounded, and unable to hide or downgrade command failures.
- Add an explicit `bandit update-check` or equivalent command for manual checks and machine-readable output.
- Keep update checks data-minimal: no telemetry, no usage reporting, no automatic model/reviewer calls, and no external service beyond the configured private source.
- Provide an explicit disable or no-action disposition for repos that cannot reach the private source.
- Keep this chore focused on private installability, package metadata, update metadata, update-check command wiring, docs, and tests. Do not approve public npm publishing, paid private registry setup, automatic self-update, merge/push/deploy behavior, product UAT changes, Trust Verifier cutover, or unrelated cockpit/product scope.

## Out Of Scope

- Do not publish Bandit to public npm, configure public package publication, or treat public npm availability as acceptance evidence.
- Do not approve paid private registry setup, hosted package infrastructure, external service setup, recurring paid reviewer/model usage, provider-pricing policy, spend-class policy, or business/cost tradeoffs without explicit operator-owned approval.
- Do not implement automatic self-update, silent consumer-repo mutation, merge automation, push automation, deploy automation, PR/CI orchestration, guarded browser action execution, or any remote side-effecting workflow.
- Do not send telemetry, repo contents, workflow state, user activity, package usage, model-call metadata, review packets, or hidden identifiers during update checks.
- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, change UAT policy, change dependency policy beyond the package/runtime changes required for private installability, or expand into unrelated Phase 8 cockpit product scope.
- Do not let update metadata, cached update results, package registries, private Git sources, or consumer-repo install state become canonical Bandit workflow authority; repo-native `.bandit/` state and CLI commands remain authoritative.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, install-smoke evidence, package allow-list acceptance mappings, update-channel acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Do not start later queued bootstrap gaps or product slices until `BANDIT-071` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.

## Acceptance Criteria

- The chore brief exists at `docs/work/BANDIT-071/brief.md` and links to `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` as the active bootstrap gap once it becomes the next queued work item.
- A repo-native policy or design artifact records the selected private distribution channel, supported install command shape, version/ref semantics, update source, non-public boundary, and explicit out-of-scope publishing behavior.
- The package can be installed into a fresh private consumer repo from the selected private channel and `bandit init` exits successfully without relying on this development checkout's existing `node_modules`.
- Package contents are intentionally scoped for CLI distribution; packed artifacts exclude unrelated active work history, tests, large design prototypes, or repo-local workflow state unless explicitly justified as install-time templates or defaults.
- The CLI runtime no longer depends on a devDependency-only `tsx` loader in installed packages, or the selected build path otherwise proves installed CLI execution works from a packed/private install.
- Installed repos can run `bandit update-check` or equivalent to compare their installed Bandit version/ref against the configured private update source and receive deterministic `current`, `update_available`, `unconfigured`, `unreachable`, or `disabled` status.
- Normal CLI commands emit a concise non-blocking update alert only when update checking is configured and a newer private release is known. Failed update checks do not block the requested command and do not mask the command's own exit status.
- Update checks are freshness-bounded and cache their last successful result so ordinary Bandit commands do not perform unbounded network work on every invocation.
- Update metadata is repo-local, reviewable, and data-minimal; it does not send telemetry, repo contents, workflow state, or user activity to any external service.
- The install/update channel includes explicit commands or docs for updating an installed repo, such as `npm install -D <private-source>@<tag>` or the selected equivalent. Automatic self-update remains out of scope unless separately approved.
- Validation, focused tests, and smoke tests cover packed/private install, update-available detection, current-version detection, disabled/unconfigured behavior, unreachable private source behavior, stale cache behavior, and non-blocking alert behavior.
- The implementation preserves Bandit's CLI authority, repo-native canonical artifacts, supply-chain gate expectations, layered risk classification, operator fail-closed boundary, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation.
- `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is resolved only after landing action and retrospective closeout evidence exist for this bounded gate chore.

## Verification Plan

- Run focused RED/GREEN tests proving packed or private-channel installation works in a fresh temporary consumer repo without this development checkout's `node_modules`.
- Run focused tests proving the package contents are allow-listed and do not include unrelated repo-local workflow history, active work packages, large prototypes, or tests unless explicitly allowed.
- Run focused tests proving `bandit update-check` reports `current`, `update_available`, `unconfigured`, `unreachable`, and `disabled` states with deterministic JSON output.
- Run focused tests proving normal CLI commands display update alerts only from current configured update metadata and never mask the underlying command exit status.
- Run focused tests proving update checks use a freshness-bounded cache and do not perform unbounded network work on every CLI invocation.
- Run focused tests proving update metadata does not include telemetry, repo contents, workflow state, or user activity fields.
- Run `npm pack --dry-run --json` and inspect the package file list.
- Run a packed install smoke test in a fresh temporary repo and execute `bandit init`, `bandit validate`, and `bandit update-check --json` or the final equivalent.
- Run `npm run typecheck`.
- Run `npm test` if implementation touches shared CLI startup, package metadata, init, validate, update-channel state, templates, or command routing beyond focused tests.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-071` for aggregate review evidence freshness.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-071 --base origin/main` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- qwen-review BANDIT-071` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- land-check BANDIT-071` before landing.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before repairing this brief. The chore must keep private distribution policy, package runtime changes, update-channel state, CLI alert wiring, cache behavior, and smoke-test fixtures small, explicit, deterministic, and separated so reviewers can distinguish install/update metadata from canonical Bandit workflow authority.

## Expected Files

- docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json
- docs/work/BANDIT-071/brief.md
- docs/work/BANDIT-071/qwen-formation-review.md
- docs/work/BANDIT-071/coderabbit-formation-review.md
- docs/work/BANDIT-071/formation-review.md
- docs/work/BANDIT-071/coordination-log.jsonl
- docs/work/BANDIT-071/red-evidence.md
- docs/work/BANDIT-071/implementation-evidence.md
- docs/work/BANDIT-071/coderabbit-review.md
- docs/work/BANDIT-071/local-qwen-review.md
- docs/work/BANDIT-071/review-evidence.md
- docs/work/BANDIT-071/landing-verdict.md
- docs/work/BANDIT-071/landing-action.md
- docs/work/BANDIT-071/retrospective.md
- package.json
- package-lock.json
- bin/bandit.mjs
- src/cli.ts
- src/commands/update-check.ts
- src/state/update-channel.ts
- .bandit/policy/private-install-update-channel.json
- docs/templates/private-install-update-channel.md
- docs/templates/update-channel.md
- README.md
- test/private-install-update-channel.test.mjs
- test/update-channel.test.mjs
- test/init.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-071/brief.md
- docs/work/BANDIT-071/qwen-formation-review.md
- docs/work/BANDIT-071/coderabbit-formation-review.md
- docs/work/BANDIT-071/formation-review.md
- docs/work/BANDIT-071/coordination-log.jsonl
- docs/work/BANDIT-071/red-evidence.md
- docs/work/BANDIT-071/implementation-evidence.md
- docs/work/BANDIT-071/coderabbit-review.md
- docs/work/BANDIT-071/local-qwen-review.md
- docs/work/BANDIT-071/review-evidence.md
- docs/work/BANDIT-071/landing-verdict.md
- docs/work/BANDIT-071/landing-action.md
- docs/work/BANDIT-071/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. The operator supplied the product/distribution posture: do not make Bandit public yet; make it installable across multiple private repos; alert from the CLI when private updates are available. Codex PM owns the bounded technical design, private-channel mechanics, package layout, update-check cadence, tests, and review routing. Halt only if implementation would publish to public npm, choose or require a paid private registry, change business tradeoffs, approve external service setup beyond an already accessible private source, enable automatic self-update, approve recurring paid tooling, change merge/push/deploy authority, alter UAT policy, change Trust Verifier cutover posture, or expand into unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, packed-install smoke-test fixtures, package allow-list acceptance mappings, update-channel acceptance mappings, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, install-smoke evidence, package allow-list acceptance mappings, update-channel acceptance mappings, or acceptance mappings for this Work Item.
- Bootstrap Model-Family Separation: Codex-authored RED evidence requires Claude-family Stage 3 implementation, and verification escalation returns to Codex PM because Claude authored the implementation.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing verdict/action evidence. Closeout Agent/Codex PM owns Stage 6 retrospective and closeout evidence.

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
- test_writer
- implementation_writer
- reviewer
- landing_agent
- closeout_agent
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not publish Bandit to public npm in this chore.
- Do not silently mutate consumer repos through automatic self-update.
- Do not send telemetry, repo contents, workflow state, or user activity during update checks.
- Do not approve paid private registry setup or external service setup without explicit operator input.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Private install/update design should prefer deterministic local tests, package metadata inspection, and temporary consumer-repo smoke tests over paid services or hosted infrastructure.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid private registry setup, paid reviewer/model routes, hosted update services, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If a configured private source is unreachable, record unreachable/disabled evidence instead of treating the update check as current.
- If packed-install smoke verification fails because the runtime depends on development checkout state, record the failure and repair the package/runtime boundary before implementation can proceed.
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-070` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover packed/private installability, package contents allow-listing, update-check states, cache behavior, disabled/unconfigured/unreachable behavior, non-blocking alert behavior, and data-minimal metadata.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL`, linked to `BANDIT-071` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` remains queued behind this chore and must not start until `BANDIT-071` lands and closes out or the private install/update gap is explicitly dispositioned.
- Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind the replay corpus.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Public npm publishing, paid private registry setup, automatic self-update, telemetry, external service setup, Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving packed/private-channel installation works in a fresh temporary consumer repo and that `bandit init` does not rely on this development checkout's existing `node_modules`.
- Write RED tests proving package contents are intentionally allow-listed and exclude unrelated active work history, tests, large prototypes, and repo-local workflow state unless explicitly justified as install-time templates or defaults.
- Write RED tests proving the installed CLI no longer depends on a devDependency-only `tsx` loader or otherwise proves the selected build/runtime path works from a packed/private install.
- Write RED tests proving `bandit update-check` or the final equivalent reports deterministic `current`, `update_available`, `unconfigured`, `unreachable`, and `disabled` JSON states.
- Write RED tests proving ordinary CLI commands emit non-blocking update alerts only from configured, fresh-enough update metadata and never mask the underlying command exit status.
- Write RED tests proving update checks use freshness-bounded cache behavior and do not perform unbounded network work on every invocation.
- Write RED tests proving repo-local update metadata is data-minimal and does not contain telemetry, repo contents, workflow state, user activity, model/reviewer metadata, or hidden identifiers.
- Implement the smallest policy/design artifact, package/runtime fix, update-channel state helper, update-check command, CLI alert hook, docs, and validation needed to satisfy the approved RED evidence without expanding into public publishing, automatic self-update, paid services, or unrelated product scope.

## Smell Triggers

- Any public npm publication, paid private registry setup, hosted update service, external service setup, recurring paid route, provider-pricing policy, spend-class policy, or business/cost tradeoff is operator-owned and out of scope without explicit approval.
- Any automatic self-update, silent consumer-repo mutation, merge, push, deploy, PR/CI orchestration, guarded browser action execution, or external side effect is out of scope for this chore.
- Any update-check path that sends telemetry, repo contents, workflow state, user activity, model/reviewer metadata, review packets, package usage, or hidden identifiers is a blocker.
- Any update metadata, cached update result, private source response, or installed package state treated as canonical Bandit workflow authority is a blocker; it may only inform install/update status.
- Any normal CLI command that lets an update-check failure block the requested command or mask the requested command's exit status is a blocker.
- Any unbounded network check on every CLI invocation is a blocker; update checks must be configured, freshness-bounded, and cache-aware.
- Any Stage 3 edit to tests, fixtures, RED evidence, install-smoke evidence, package allow-list acceptance mappings, update-channel acceptance mappings, or acceptance mappings is a role-boundary blocker.
- Any large mixed function that combines package metadata parsing, private-source comparison, cache mutation, alert rendering, command execution, install smoke setup, and validation without clear boundaries is a clean-code blocker.
