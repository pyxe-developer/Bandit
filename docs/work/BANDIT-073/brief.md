# BANDIT-073: Gate Determinism And Flake Gate

## Status

Brief Created

work_type: chore

## Non-Product Work

Require critical trust-layer gates to produce repeatable output, stable ordering, stable hashes, and explicit nondeterminism dispositions.

## Origin

Operator direction on 2026-06-07 asked to add the remaining verification-layer opportunities to the roadmap. The earlier verification-layer review identified Gate Determinism / Flake Gate as a hardening opportunity because trust-layer commands should be repeatable and should not let nondeterministic tests, provider-dependent evidence, or unstable ordering masquerade as trusted verification.

## Scope

- Define which Bandit gates and projections are determinism-critical.
- Require stable ordering, stable hashes, deterministic machine-readable output, and bounded freshness rules for covered gates.
- Require explicit disposition for nondeterministic tests, provider-dependent evidence, wall-clock-sensitive checks, and unavailable external reviewers.
- Add repeat-run or snapshot comparison checks for covered local commands.
- Keep this chore focused on deterministic CLI gates, validators, docs, and tests.

## Out Of Scope

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or make this determinism policy canonical verifier authority for unrelated live work in this chore.
- Do not build live reviewer calibration, paid reviewer routing, model routing promotion, public benchmark publication, hosted replay services, telemetry, external reporting, merge/push/deploy behavior, guarded browser action execution, or unrelated cockpit/product scope.
- Do not use provider-dependent, wall-clock-sensitive, or flaky evidence as deterministic local proof without explicit disposition, freshness metadata, and replacement-evidence limits.
- Do not silently normalize unstable ordering, unstable hashes, nondeterministic output, provider timeout/refusal, dirty worktree state, or unavailable external reviewers.
- Do not start Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, Spec-To-Evidence Traceability Matrix, or unrelated Phase 8 product work until `BANDIT-073` has landing action evidence, retrospective/improvement dispositions, bootstrap-gap disposition, and synchronized routing files.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, gate determinism acceptance mappings, expected-output mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.

## Acceptance Criteria

- The chore brief links to `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` as the active bootstrap gap once it becomes the next queued work item.
- A policy artifact defines determinism-critical gates, allowed nondeterminism sources, required dispositions, repeat-run expectations, and output stability requirements.
- Covered commands produce stable machine-readable output for the same repo state or report a justified nondeterminism disposition.
- Validation fails closed when a covered trusted claim depends on undispositioned flaky tests, provider-dependent evidence, unstable ordering, or unstable hashes.
- Freshness-bounded external evidence remains allowed, but it must be recorded as external/provider-dependent and cannot silently replace deterministic local evidence.
- Determinism checks remain read-only against canonical workflow state unless a later stage explicitly writes ordinary stage evidence under the approved Work Item surfaces.
- The implementation preserves Bandit's CLI authority, repo-native canonical artifacts, source-of-truth/projection boundaries, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation.
- `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is resolved only after landing action and retrospective closeout evidence exist.

## Verification Plan

- Run focused tests proving covered outputs are stable across repeated runs.
- Run tests proving unstable ordering, hash drift, and undispositioned nondeterminism fail closed.
- Run tests proving provider-dependent evidence requires explicit freshness and availability disposition.
- Run tests proving freshness-bounded external evidence cannot silently replace deterministic local evidence.
- Run tests proving direct Qwen CLI routing is not accepted as Local Qwen evidence for Bandit gates.
- Run `npm run typecheck`.
- Run focused gate determinism tests, expected initially RED during Stage 2 and GREEN after Stage 3.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-073` for aggregate review evidence freshness once implementation changes exist.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-073 --base origin/main` before Stage 4 closeout unless provider-refusal or provider-timeout evidence is recorded.
- Run Local Qwen only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- land-check BANDIT-073` before landing.
- Run `npm test` when implementation touches shared validators or deterministic command output.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-08 before repairing this brief. This chore must keep determinism policy, gate selection, output normalization, hash computation, external-evidence disposition, diagnostics, and validation command wiring small, explicit, deterministic, locally testable, and separated so reviewers can distinguish canonical local proof from provider-dependent or freshness-bounded evidence.

## Expected Files

- docs/specs/BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE.json
- docs/work/BANDIT-073/brief.md
- docs/work/BANDIT-073/qwen-formation-review.md
- docs/work/BANDIT-073/coderabbit-formation-review.md
- docs/work/BANDIT-073/formation-review.md
- docs/work/BANDIT-073/coordination-log.jsonl
- .bandit/policy/gate-determinism-flake-gate.json
- src/state/gate-determinism.ts
- src/commands/validate.ts
- test/gate-determinism.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-073/brief.md
- docs/work/BANDIT-073/qwen-formation-review.md
- docs/work/BANDIT-073/coderabbit-formation-review.md
- docs/work/BANDIT-073/formation-review.md
- docs/work/BANDIT-073/coordination-log.jsonl
- docs/work/BANDIT-073/red-evidence.md
- docs/work/BANDIT-073/implementation-evidence.md
- docs/work/BANDIT-073/review-evidence.md
- docs/work/BANDIT-073/landing-verdict.md
- docs/work/BANDIT-073/landing-action.md
- docs/work/BANDIT-073/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. Codex PM owns the deterministic gate policy, command selection, tests, and review routing. Halt only if implementation would change product direction, UAT policy, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, paid/external tooling, merge/push/deploy authority, or unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, gate determinism acceptance mappings, expected-output mappings, nondeterminism-disposition tests, and RED evidence.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, gate determinism acceptance mappings, expected-output mappings, nondeterminism-disposition mappings, source-artifact mappings, or acceptance mappings for this Work Item.
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
allowed_tools:
- local shell commands
- Bandit CLI commands
- Node test runner
- TypeScript typecheck
- Local Qwen through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`
- CodeRabbit CLI when available
inputs:
- docs/specs/BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE.json
- .bandit/bootstrap-gaps.json
- repo-local policy, validator, reviewer, landing, and projection evidence artifacts
- deterministic local command output from covered gates
outputs:
- gate determinism and flake policy artifact
- focused RED/GREEN tests
- deterministic validation output
- stage evidence artifacts under docs/work/BANDIT-073/
required_skills:
- bandit
- tdd
- review
- superpowers:verification-before-completion
forbidden_actions:
- Do not treat flaky or provider-dependent evidence as deterministic local proof.
- Do not silently normalize unstable output without a recorded policy reason.
- Do not approve Trust Verifier cutover, paid routing, merge, push, deploy, or unrelated cockpit/product scope in this chore.
- Do not start Stage 2 RED evidence, implementation, review, landing, closeout, later queued bootstrap gaps, or unrelated Phase 8 product work before `formation_approved`.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Gate determinism design should prefer deterministic local commands, repo-native artifacts, and focused tests over paid services, live model routing, hosted benchmark services, or public benchmark publication.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation, provider-timeout, or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Paid reviewer/model routes, hosted benchmark services, public benchmark publishing, or recurring paid tooling remain blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If a gate cannot be made deterministic because it relies on provider output, record provider-dependent disposition and freshness limits instead of treating it as deterministic proof.
- If a repeat-run check detects drift, fail closed with evidence of the changed fields rather than normalizing it silently.
- If CodeRabbit or another external reviewer times out, record explicit provider-timeout/bootstrap evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Source-Of-Truth And Gate Determinism Boundary

- Repo-native `.bandit/` state, `docs/work/`, `docs/specs/`, `docs/roadmap/`, and CLI command output remain canonical.
- Gate determinism policy may classify deterministic local evidence, freshness-bounded external evidence, provider-dependent evidence, and explicit nondeterminism dispositions, but it cannot grant workflow authority outside the approved Work Item.
- Covered gate output must preserve stable ordering, stable machine-readable fields, stable hashes, and clear diagnostics for drift or nondeterminism.
- External reviewer evidence remains allowed only with explicit provider/freshness/availability metadata and cannot silently replace deterministic local evidence.
- Local Qwen reviewer routing is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path.
- Any future use of this policy for Trust Verifier cutover, live routing, reviewer promotion, model routing, or workflow policy change requires a separate Codex PM decision and any operator-owned approval required by policy.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-072` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, source-of-truth and gate-determinism boundary, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and cover stable ordering, stable hashes, repeat-run output comparison, provider-dependent evidence disposition, undispositioned flake refusal, direct-Qwen-CLI refusal, and freshness-bounded external evidence limits.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE`, linked to `BANDIT-073` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is resolved and linked to `BANDIT-072`; its closeout evidence authorizes this next queued gap.
- Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind this determinism gate.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Public benchmark publication, paid reviewer/model routing, hosted replay services, telemetry, Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving determinism-critical gate output has stable ordering, stable machine-readable fields, stable hashes, and repeat-run comparison behavior for unchanged repo state.
- Write RED tests proving unstable ordering, hash drift, undispositioned flake markers, provider-dependent evidence, wall-clock-sensitive evidence, and unavailable external reviewers fail closed or require explicit disposition.
- Write RED tests proving freshness-bounded external evidence remains allowed only with provider, captured-at, freshness, and availability metadata and cannot replace deterministic local evidence silently.
- Write RED tests proving Local Qwen evidence is accepted only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, not the direct `qwen` CLI.
- Write RED tests proving diagnostics identify the unstable fields or evidence class rather than producing vague failure text.
- Implement the smallest policy artifact, parser, validator, command wiring, docs, and validation needed to satisfy the approved RED evidence without expanding into Trust Verifier cutover, old-gate replacement/wrapping, paid services, hosted services, live routing, public benchmark publication, or unrelated product scope.

## Smell Triggers

- Any trusted gate output that changes ordering, hashes, verdict fields, or machine-readable payloads across identical repo state without explicit disposition is a blocker.
- Any provider-dependent, unavailable, flaky, dirty-worktree, wall-clock-sensitive, or freshness-bounded evidence treated as deterministic proof is a blocker.
- Any direct `qwen` CLI reviewer routing or direct-Qwen evidence accepted as Local Qwen proof is a blocker.
- Any Trust Verifier cutover, old-gate replacement, old-gate wrapping, workflow policy change, reviewer promotion, model routing change, paid route, public benchmark publication, hosted service, telemetry, merge, push, deploy, or unrelated cockpit expansion is out of scope without separate authorization.
- Any Stage 3 edit to tests, test helpers, fixtures, RED evidence, gate determinism acceptance mappings, expected-output mappings, nondeterminism-disposition mappings, source-artifact mappings, or acceptance mappings is a role-boundary blocker.
- Any large mixed function that combines policy classification, gate execution, output sorting, hashing, provider evidence parsing, diagnostics, artifact writing, and routing updates without clear boundaries is a clean-code blocker.
