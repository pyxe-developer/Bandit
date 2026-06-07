# BANDIT-070: Verification Oracle Provenance Gate

## Status

Brief Created

work_type: chore

## Non-Product Work

Create a provenance gate that requires verification verdicts to name the oracle they rely on and prove that oracle is independent enough for the claimed trust decision.

## Origin

Operator direction on 2026-06-07 accepted the Verification Oracle Provenance Gate as the next verification-layer strengthening idea after the queued Test Strength / Mutation Adequacy Gate. Bandit already records tests, review evidence, risk classification, supply-chain evidence, freshness, and landing verdicts, but it does not yet require each pass verdict to identify whether its oracle is a spec clause, invariant, independent command output, golden fixture, replay packet, reviewer finding, trusted source artifact, or another evidence class. Without oracle provenance, a gate can drift into circular verification where the same code path creates both the behavior and the evidence that claims the behavior is trustworthy.

## Scope

- Define a repo-native Verification Oracle Provenance Gate for trust-layer verdicts, pass evidence, aggregate review evidence, landing verdicts, and derived status projections.
- Require covered verification artifacts to identify their oracle type, oracle source artifact, oracle owner or authority role, independence class, freshness source, command or replay packet when applicable, and the claim the oracle supports.
- Classify oracle independence levels such as independent_external_artifact, independent_repo_artifact, independent_command_output, replay_packet, reviewer_finding, invariant_or_property, trusted_source_artifact, and self_reported_or_derived.
- Fail closed when a pass verdict relies only on self-reported or same-code-path evidence for a claim that requires independent proof.
- Require any derived status surface, including cockpit status, session-context, trust verify reports, review evidence, and landing evidence, to distinguish canonical source artifacts from projections and to avoid presenting derived output as the oracle for itself.
- Require Stage 1 briefs for covered verification or projection work to declare the oracle provenance strategy and explain which claims need independent or replay-backed evidence.
- Require Stage 2 RED evidence for covered gate work to include tests for missing oracle provenance, circular self-attestation, stale oracle source, unsupported oracle type, and mismatched claim-to-oracle mapping.
- Require Stage 4 reviewer packets to ask whether the reported oracle would still catch the claimed failure if the implementation or projection code were wrong.
- Allow explicit no-action or bootstrap-gap disposition for trivial metadata-only work, but require the disposition to name why independent oracle provenance is not needed for that risk tier.
- Keep replay packets as an allowed oracle type without requiring this chore to build the full replay regression corpus; a later replay-corpus chore may expand this gate.
- Keep this chore focused on policy, templates, validators, command wiring, reviewer-packet language, and focused tests. Do not approve Trust Verifier cutover, replace old gates, introduce live reviewer/model routing, install external services, alter UAT policy, add paid tooling, or expand unrelated Phase 8 cockpit product scope.
- Preserve Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: Stage 3 Writers cannot edit tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, or acceptance mappings for their work item.

## Out Of Scope

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or silently change verifier authority in this chore.
- Do not build the full replay regression corpus, evidence bundle attestation, private install/update channel, guarded CLI action execution, State Index, local API, live cockpit polling, external services, hosted previews, merge automation, push automation, deploy automation, PR/CI orchestration, claim/worktree lifecycle, or unrelated Phase 8 cockpit product scope.
- Do not approve paid or external oracle services, paid reviewers, recurring paid model usage, provider-pricing policy, spend-class policy, dependency policy changes, package-manager script changes, or lockfile changes unless separately authorized by repo artifacts and operator-owned approval where required.
- Do not let derived status projections, generated trust reports, validators, cockpit status, session-context, review packets, or landing reports become their own independent oracle for the correctness claims they expose.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Do not add blanket ceremony to trivial metadata-only work; low-risk self-reported or derived oracle classes must be explicitly scoped and dispositioned.

## Acceptance Criteria

- The chore brief exists at `docs/work/BANDIT-070/brief.md` and links to `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` as the active bootstrap gap once it becomes the next queued work item.
- A repo-native policy artifact or equivalent validator defines covered artifact types, covered trust claims, supported oracle types, oracle independence classes, required provenance fields, freshness requirements, and explicit no-action/bootstrap disposition rules.
- Covered Stage 1 briefs must declare oracle provenance strategy for verification, projection, aggregate review, landing, or trust-verifier work before Stage 2 begins.
- Validation rejects pass, safe-to-land, trusted, current, or ready verdicts for covered claims when the evidence lacks oracle type, oracle source, owner or authority role, independence class, freshness source, claim mapping, or command/replay reference when applicable.
- Validation rejects circular self-attestation where the same projection, validator, command output, or generated report is treated as the independent oracle for its own correctness.
- Validation rejects stale, missing, unsupported, or mismatched oracle sources before trusted status can be exposed in cockpit status, session-context, trust verify reports, review evidence, or landing evidence.
- Validation allows self-reported or derived oracle classes only for explicitly low-risk claims or when paired with a stronger independent oracle for the trust decision being made.
- Reviewer packet templates and aggregate Stage 4 evidence ask whether the named oracle would catch the relevant failure if the implementation or projection path were wrong.
- Landing, land-check, repo validation, or trust-verifier compatibility validation consumes current oracle-provenance evidence for covered high-risk verification surfaces and fails closed when provenance is missing, stale, circular, or generic.
- The implementation does not build the full replay regression corpus, approve Trust Verifier cutover, replace or wrap old gate paths, add blanket ceremony to trivial work, approve paid/external tooling, change product direction, alter UAT policy, change merge/push/deploy authority, or expand unrelated Phase 8 cockpit/product scope.
- The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation; Stage 3 Writers cannot edit oracle-provenance tests, fixtures, RED evidence, oracle evidence, or acceptance mappings.
- Stage 4 review uses CodeRabbit and Local Qwen or honest provider-refusal/bootstrap replacement evidence, with layered risk-classification, supply-chain, clean-code, and review-subject freshness evidence before landing.
- `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is resolved only after landing action and retrospective closeout evidence exist for this bounded gate chore.

## Verification Plan

- Run focused oracle-provenance validation tests proving covered pass/trusted/ready verdicts fail closed without oracle type, source, owner or authority role, independence class, freshness source, and claim mapping.
- Run focused tests proving circular self-attestation is rejected when a projection, validator, report, or generated artifact is treated as its own independent oracle.
- Run focused tests proving stale, missing, unsupported, and mismatched oracle sources fail closed.
- Run focused tests proving self-reported or derived oracle classes are accepted only for low-risk claims or when paired with an independent oracle.
- Run focused tests proving reviewer packets or aggregate review evidence include the oracle-quality question.
- Run focused landing, validation, or trust-verifier compatibility tests proving covered high-risk verification surfaces cannot expose trusted status without current oracle provenance.
- Run `npm test` if implementation touches shared validators, work-item parsing, review evidence, landing gates, trust verify, cockpit/session-context projections, templates, bootstrap gaps, or policy validation beyond focused tests.
- Run `npm run typecheck`.
- Run `npm run bandit -- validate`.
- Run `npm run bandit -- gaps list`.
- Run `node ./bin/bandit.mjs cockpit status --json`.
- Run `node ./bin/bandit.mjs session-context current --json`.
- Run `node ./bin/bandit.mjs review-subject-hash BANDIT-070` for aggregate review evidence freshness.
- Run `npm run bandit -- coderabbit-review pre-pr BANDIT-070 --base origin/main` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- qwen-review BANDIT-070` before Stage 4 closeout unless provider-refusal evidence is recorded.
- Run `npm run bandit -- land-check BANDIT-070` before landing.
- Run `git diff --check`.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-07 before creating this brief. The chore must keep oracle provenance policy, parser, validator, artifact-template, reviewer-packet, projection, and landing-gate changes small, explicit, testable, and separated so review can distinguish canonical source artifacts from derived projections and self-reported claims.

## Expected Files

- docs/specs/BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE.json
- docs/work/BANDIT-070/brief.md
- docs/work/BANDIT-070/qwen-formation-review.md
- docs/work/BANDIT-070/coderabbit-formation-review.md
- docs/work/BANDIT-070/formation-review.md
- docs/work/BANDIT-070/coordination-log.jsonl
- docs/work/BANDIT-070/red-evidence.md
- docs/work/BANDIT-070/implementation-evidence.md
- docs/work/BANDIT-070/coderabbit-review.md
- docs/work/BANDIT-070/local-qwen-review.md
- docs/work/BANDIT-070/review-evidence.md
- docs/work/BANDIT-070/landing-verdict.md
- docs/work/BANDIT-070/landing-action.md
- docs/work/BANDIT-070/retrospective.md
- .bandit/policy/verification-oracle-provenance.json
- docs/templates/verification-oracle-provenance.md
- docs/templates/review-evidence.md
- docs/templates/landing-verdict.md
- docs/verification/STAGE_RUBRICS.md
- src/state/verification-oracle-provenance.ts
- src/commands/verification-oracle-provenance.ts
- src/commands/validate.ts
- src/commands/land-check.ts
- src/state/review-evidence.ts
- src/state/landing-verdicts.ts
- src/state/cockpit-status.ts
- src/state/focused-session-context.ts
- src/state/trust-verify.ts
- test/verification-oracle-provenance.test.mjs
- test/landing-gates.test.mjs
- test/validate.test.mjs
- test/trust-verify.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-070/brief.md
- docs/work/BANDIT-070/qwen-formation-review.md
- docs/work/BANDIT-070/coderabbit-formation-review.md
- docs/work/BANDIT-070/formation-review.md
- docs/work/BANDIT-070/coordination-log.jsonl
- docs/work/BANDIT-070/red-evidence.md
- docs/work/BANDIT-070/implementation-evidence.md
- docs/work/BANDIT-070/coderabbit-review.md
- docs/work/BANDIT-070/local-qwen-review.md
- docs/work/BANDIT-070/review-evidence.md
- docs/work/BANDIT-070/landing-verdict.md
- docs/work/BANDIT-070/landing-action.md
- docs/work/BANDIT-070/retrospective.md

## Operator Input Status

No further operator-owned input is required to queue this bootstrap-gap chore. The operator supplied the workflow-policy direction: add a Verification Oracle Provenance Gate. Codex PM owns the technical shape of policy artifacts, validators, test strategy, reviewer packet wording, and review routing. Halt only if implementation would change product direction, UAT policy, business tradeoffs, explicit cost/risk posture, approve paid or external tooling, approve recurring paid model/reviewer routing, approve Trust Verifier cutover, alter merge/push/deploy authority, change dependency or lockfile policy, or expand into unrelated cockpit/product scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 brief creation and repair, source-spec interpretation, formation review routing, formation approval, and context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`; it may not write tests, implementation, reviewer evidence, landing evidence, UAT evidence, or final repo-level closeout state.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, and acceptance mappings.
- Implementation Writer owns Stage 3 source implementation only. If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation must use the Claude implementation-writer path during bootstrap.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, or acceptance mappings for this Work Item.
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
- Do not treat a projection, validator, generated report, or command output as its own independent oracle.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, or acceptance mappings.
- Do not replace existing gate authority or approve Trust Verifier cutover in this chore.
- Do not approve paid/external tooling, product UAT changes, merge, push, deploy, guarded action execution, or unrelated Phase 8 cockpit work in this chore.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Oracle-provenance validation should be deterministic and local; unavailable external oracle sources should be recorded as missing or bootstrap evidence rather than pass evidence.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation or provider-refusal evidence honestly.
provider_pricing_evidence:
- No paid provider-pricing evidence is approved by this queued chore.
- Any paid reviewer, paid model, paid oracle service, or recurring paid route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If oracle-provenance verification depends on unavailable provider evidence, record unavailable/bootstrap evidence instead of treating absence as pass.
- If CodeRabbit or another external reviewer times out, record explicit provider-refusal or continuation evidence instead of treating absence as pass.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | `BANDIT-069` is landed and closed out with verification, landing verdict, landing-action evidence, retrospective, improvement disposition, bootstrap-gap disposition, and roadmap/status synchronization; the gap ledger now authorizes this active bootstrap-gap chore before unrelated Phase 8 product work.
- Stage 1: Work-Item Brief And Spec | pass | This brief defines non-product work, origin/source authority, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap-gap disposition, expected files, role boundaries, operator-input status, required evidence, forbidden actions, stage capability scope, token-cost failsafe, first implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED evidence before implementation and map covered claims to oracle type, oracle source, owner or authority role, independence class, freshness source, and command or replay evidence where applicable.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to Claude if Codex authors RED tests and must not edit any Test Writer-owned surface.
- Stage 4: Review And Cross-Model Gates | required later | CodeRabbit, Local Qwen through the MLX adapter route, aggregate review, risk-classification, supply-chain, review-subject hash, and clean-code evidence are required or honestly dispositioned.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, auto-land-check when eligible, and local-record landing evidence are required; feature UAT is not applicable unless implementation changes product-facing behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, bootstrap-gap resolution, current context, roadmap, and STATUS updates are required before the next queued gap or product slice.

## Bootstrap Gaps

- Active bootstrap gap: `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE`, linked to `BANDIT-070` in `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` remains queued behind this chore and must not start until `BANDIT-070` lands and closes out or the oracle-provenance gap is explicitly dispositioned.
- Replay Regression Corpus, Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind the private install/update channel.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`; the direct `qwen` CLI is not an authorized Bandit reviewer path. If the endpoint or adapter is unavailable, record provider-refusal/bootstrap replacement evidence and do not claim a Qwen pass.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Paid/external oracle tooling, paid reviewers, Trust Verifier cutover, old-gate replacement or wrapping, merge, push, deploy, guarded browser action execution, and unrelated cockpit product scope remain future work unless separately authorized by repo artifacts and operator-owned approval where required.

## First Implementation Order

- Write RED tests proving covered Stage 1 briefs and verification/projection work require an oracle provenance strategy or explicit low-risk/no-action disposition before Stage 2 proceeds.
- Write RED tests proving covered pass, safe-to-land, trusted, current, or ready claims fail closed without oracle type, source artifact, owner or authority role, independence class, freshness source, claim mapping, and command/replay reference when applicable.
- Write RED tests proving circular self-attestation is rejected when a projection, validator, generated report, command output, cockpit status, session-context packet, review evidence, or landing evidence is treated as the independent oracle for its own correctness.
- Write RED tests proving stale, missing, unsupported, and mismatched oracle sources fail closed before trusted status is exposed.
- Write RED tests proving self-reported or derived oracle classes are accepted only for explicitly low-risk claims or when paired with a stronger independent oracle.
- Write RED tests proving reviewer packets and aggregate review evidence ask whether the named oracle would catch the relevant failure if the implementation or projection path were wrong.
- Implement the smallest policy, parser, validator, template, command wiring, reviewer-packet wording, and landing/validation integration needed to satisfy the approved RED evidence without expanding unrelated gates.

## Smell Triggers

- Any Trust Verifier cutover, old-gate replacement or wrapping, local API, State Index, guarded action execution, merge, push, deploy, external service, paid tooling, dependency policy, lockfile, package script, or unrelated cockpit product change is out of scope or operator-owned.
- Any derived projection, generated report, validator output, cockpit status, session-context packet, review packet, or landing report treated as its own independent oracle is a formation or implementation blocker.
- Any pass, safe-to-land, trusted, current, or ready claim that omits oracle type, oracle source, authority role, independence class, freshness source, or claim mapping is a blocker for covered trust decisions.
- Any Stage 3 edit to tests, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, or acceptance mappings is a role-boundary blocker.
- Any generic confidence badge, reviewer agreement, or command success that replaces artifact-specific oracle provenance without explicit low-risk disposition is a blocker.
- Any large mixed function that combines policy classification, evidence parsing, oracle-source freshness, projection rendering, reviewer-packet generation, landing-gate logic, and context projection without clear boundaries is a clean-code blocker.
