# BANDIT-041: Layered Risk Classification

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where review-depth, operator-supervision, and auto-landing decisions can still be made from smell triggers alone instead of a layered risk-classification gate.

## Origin

The 2026-05-26 strategic review and accepted Bandit PRDs identify smell-list-only safety as brittle. Bandit now has a Smell Trigger Catalog and an Input Quarantine Gate, but no CLI-readable policy, template, validation path, or focused tests force review-depth and auto-landing decisions to consider hard never-auto-landable exclusions, blast-radius signals, static-analysis signals, source trust, input-quarantine state, supply-chain state, and smell-trigger inputs together. The first repair must define a layered gate that can independently raise review depth, require operator supervision, or block auto-landing when any high-risk signal appears, even without smell-list concurrence.

## Scope

- Define a repo-native Layered Risk Classification Gate contract for release-authorized review-depth, operator-supervision, and auto-landing decisions.
- Define hard exclusions and Never Auto-Landable Surfaces for authentication, sessions, authorization, payment, billing, refunds, production data or schema migrations, secrets, credentials, CI or release workflow, dependency or fetched-prompt execution paths, privacy, telemetry, export, destructive operations, and external side-effecting automation.
- Define Blast-Radius Signal fields for files touched, ownership or code area, import or dependency reach, runtime path, data access, external side effects, migration or deploy scope, and user or product impact.
- Define Static Analysis Risk Signal fields for SAST, SCA, secrets scanning, IaC scanning, lint, typecheck, security tooling, unavailable-tool state, and stale or missing signal evidence.
- Consume source-trust and input-quarantine state from the Input Quarantine Gate without redefining input quarantine, and require explicit unknown or unavailable states to fail closed instead of becoming trusted defaults.
- Consume supply-chain state as an input to risk classification while keeping the later Supply-Chain Gate, dependency or lockfile policy, CI/release workflow policy, fetched-prompt execution policy, and external tool-install validation out of scope.
- Define smell-trigger inputs as one risk input, not the authority for review depth, operator supervision, or auto-landing eligibility.
- Define selected review-depth output, operator-supervision routing, auto-landing eligibility, auto-landing refusal rationale, and evidence paths for the risk classification decision.
- Add validation that fails closed when review depth, operator supervision, landing readiness, or auto-landing eligibility is decided without layered risk-classification evidence.
- Add validation that rejects never-auto-landable surfaces marked auto-landable, high-risk blast-radius or static-analysis signals ignored because no smell trigger matched, trusted status without source-trust and input-quarantine evidence, and missing supply-chain-state disposition.
- Add focused tests for missing gate evidence, smell-list-only decisions, never-auto-landable auto-land attempts, high-risk signal escalation, unknown source-trust or input-quarantine state, missing supply-chain disposition, malformed selected review depth, operator-supervision routing, auto-land refusal output, and a complete accepted low-risk classification.
- Keep the repair limited to layered risk-classification contracts, templates, CLI-readable policy or registry validation, auto-land or landing-readiness integration, focused tests, and necessary roadmap/context/gap-ledger evidence.
- Record CLEAN_CODE.md read evidence in Stage 1 and perform clean-code evaluation before landing.
- Stage capability scope: Codex PM owns technical routing; Test Writer owns RED evidence; Writer may edit risk classification templates, policy or registry parsing, validation, auto-land or landing-readiness integration, and focused tests; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Operator-blocking boundary: no operator-owned input is required unless implementation would change product direction, UAT policy, workflow policy beyond defining the already queued layered risk-classification gate, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, supply-chain gate policy, or broader workflow scope.
- Supply-chain and future-work scope: this chore may require a supply-chain-state input and fail-closed missing-state disposition, but it must not implement the later Supply-Chain Gate, dependency or lockfile validation, CI/release workflow policy, external tool-install validation, paid reviewer routing, live model routing, scheduler execution, claim authority, worktree lifecycle, local server/API mode, state-index persistence, or unrelated Phase 8 cockpit work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-041/brief.md and links to BANDIT-GAP-LAYERED-RISK-CLASSIFICATION.
- A Layered Risk Classification Gate template or policy artifact names required inputs for work item, changed surfaces, hard exclusions, never-auto-landable surfaces, blast-radius signals, static-analysis signals, source-trust state, input-quarantine state, supply-chain state, smell-trigger inputs, selected review depth, operator-supervision routing, auto-landing eligibility, rationale, and evidence paths.
- Validation fails closed when review depth, operator supervision, landing readiness, or auto-landing eligibility is decided without current layered risk-classification evidence.
- Validation fails closed when a never-auto-landable surface is marked auto-landable, even when tests, CodeRabbit, Local Qwen, escalated review, landing verdict, or smell triggers otherwise pass.
- Validation raises review depth, requires operator supervision, or blocks auto-landing when any high-risk blast-radius, static-analysis, source-trust, input-quarantine, supply-chain, or smell-trigger signal is present.
- Validation fails closed when high-risk blast-radius, static-analysis, source-trust, input-quarantine, or supply-chain signals are ignored because no smell trigger matched.
- Validation treats unknown, unavailable, stale, or missing source-trust, input-quarantine, static-analysis, or supply-chain state as explicit risk states, not green defaults.
- Auto-land or landing-readiness checks consume layered risk-classification output and refuse auto-landing when the gate records never-auto-landable, elevated-risk pending supervision, missing evidence, or stale evidence.
- Focused tests prove invalid layered risk-classification contracts are rejected before trusted status or auto-landing eligibility, and prove a complete low-risk classification is accepted.
- The implementation does not implement the later Supply-Chain Gate, coordination authority, operator fail-closed boundary, claim authority, Git mutation serializer, worktree bootstrap contract, scheduler, observability traces, Stage Capability Scope, Token-Cost Failsafe, Evidence Freshness SLOs, paid reviewer policy, live model routing, external service integration, dependency or lockfile policy, installed global skill edits, or cockpit UI gaps.
- The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-LAYERED-RISK-CLASSIFICATION is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow, live reviewer routing change, paid reviewer route, external service integration, dependency or lockfile change, supply-chain gate implementation, installed global skill edit, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused layered risk-classification tests for RED/GREEN coverage.
- Run node --test test/landing-gates.test.mjs if auto-land or landing-readiness behavior is touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/cockpit-status.test.mjs and node --test test/cockpit-view-model.test.mjs if cockpit status or action-affordance summaries are touched.
- Run npm test if implementation touches shared command routing, validators, policy parsing, review evidence, landing gates, bootstrap gaps, roadmap/cockpit status parsing, input quarantine validation, auto-landing policy, or template validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run npm run bandit -- auto-land-check BANDIT-041 before Stage 5 closeout if auto-landing eligibility behavior is touched.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-041 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-041 before Stage 4 closeout.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-041 for aggregate review evidence freshness.
- Run npm run bandit -- land-check BANDIT-041 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-LAYERED-RISK-CLASSIFICATION.json
- docs/work/BANDIT-041/brief.md
- docs/work/BANDIT-041/red-evidence.md
- docs/work/BANDIT-041/implementation-evidence.md
- docs/work/BANDIT-041/coderabbit-review.md
- docs/work/BANDIT-041/local-qwen-review.md
- docs/work/BANDIT-041/review-evidence.md
- docs/work/BANDIT-041/landing-verdict.md
- docs/work/BANDIT-041/landing-action.md
- docs/work/BANDIT-041/retrospective.md
- docs/templates/layered-risk-classification.md
- .bandit/policy/risk-classification.json
- src/state/risk-classification.ts
- src/commands/risk-classification.ts
- src/commands/auto-land-check.ts
- src/commands/land-check.ts
- src/commands/validate.ts
- test/risk-classification.test.mjs
- test/landing-gates.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-041/brief.md
- docs/work/BANDIT-041/red-evidence.md
- docs/work/BANDIT-041/implementation-evidence.md
- docs/work/BANDIT-041/coderabbit-review.md
- docs/work/BANDIT-041/local-qwen-review.md
- docs/work/BANDIT-041/review-evidence.md
- docs/work/BANDIT-041/landing-verdict.md
- docs/work/BANDIT-041/landing-action.md
- docs/work/BANDIT-041/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the gap, source artifacts, rationale, hard never-auto-landable exclusions, blast-radius and static-analysis signal need, source-trust and input-quarantine signal need, supply-chain-state input need, smell-trigger brittleness, review-depth and auto-landing policy concern, and dependency on the resolved Input Quarantine Gate gap. Halt only if implementation would change product direction, UAT policy, workflow policy beyond defining the already queued layered risk-classification gate, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer spend approval, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, supply-chain gate policy, or broader workflow scope.
