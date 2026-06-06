# BANDIT-060: Artifact Input Directory Split

## Status

Brief Created

## Non-Product Work

Create a bounded cleanup chore that separates or explicitly models artifact-renderer JSON inputs, reviewer capture JSON, work-item/gap specs, and trust snapshot fixtures so future Trust Verifier cutover and parity work can rely on unambiguous path semantics.

## Origin

BANDIT-021 introduced `bandit artifact create <spec-path>` and intentionally used JSON command inputs under `docs/specs/`. Later workflow use overloaded that directory with work/gap specs, artifact-renderer inputs, CodeRabbit reviewer captures, and trust-verifier snapshot fixtures. BANDIT-059 closed the compatibility-mode trust verifier foundation while recording that Trust Verifier cutover or parity work should not depend on ambiguous `docs/specs/` semantics. Current repo context records no active work item and requires this cleanup before cutover, Pi/Aperture agent-scope, role packet, execution packet, or unrelated cockpit product work.

## Scope

- Define the supported artifact-input taxonomy for Bandit JSON files: work-item and bootstrap-gap specs, artifact-renderer command inputs, reviewer/provider capture JSON, and trust snapshot fixtures.
- Introduce a clear repo path contract for future artifact-renderer inputs and reviewer/provider captures without rewriting historical work-item evidence or moving canonical Markdown artifacts.
- Keep `docs/specs/` as the accepted location for work-item and bootstrap-gap creation specs unless the implementation proves a narrower backwards-compatible migration path.
- Move or route future `artifact create` JSON command inputs to a dedicated, explicit location such as `docs/artifact-inputs/` or an equivalent modeled path with type validation.
- Move or route future reviewer/provider capture JSON to a dedicated, explicit location such as `docs/reviewer-captures/` or an equivalent modeled path with type validation.
- Preserve existing historical `docs/specs/*-red-evidence.json`, `docs/specs/*-implementation-evidence.json`, `docs/specs/*-landing-verdict.json`, `docs/specs/*-retrospective.json`, and `docs/specs/*coderabbit-review-output*.json` as accepted legacy evidence inputs unless a safe compatibility alias is implemented.
- Add focused RED evidence before implementation for ambiguous `docs/specs/` classification, unsafe or unsupported artifact input paths, and missing validation of the new taxonomy.
- Add or update CLI validation so supported artifact-input classes are classified deterministically and ambiguous future writes fail closed with clear diagnostics.
- Update `artifact create` input path handling and tests only as far as needed to make the new taxonomy enforceable for future generated artifacts.
- Update role contract or role-run allowed/forbidden file patterns only if the path taxonomy would otherwise make Stage 3 writer authority ambiguous.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-06-06 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope for this chore: Codex PM/Repo PM owns Stage 1 brief creation, formation routing, and context-artifact synchronization; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; Stage 3 Implementation Writer has no authority to edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or canonical historical work evidence except as explicitly scoped in the dispatch packet; reviewers own Stage 4 evidence; Landing Agent owns Stage 5 verdict/action evidence; Closeout Agent/Codex PM owns Stage 6 closeout evidence.
- Token-cost failsafe boundary: use existing Token-Cost Failsafe policy for abnormal-run guardrails if paid, high-token, reviewer, or long-running execution becomes necessary; this chore must not approve new provider-pricing evidence, spend-class approval, paid reviewer promotion, recurring paid routing, or operator-owned cost/risk overrides.
- Future-work scope: this chore must not implement Trust Verifier cutover, parity replacement of old gates, live evidence capture helpers, reviewer execution, model calls, harness queues, auth or provider routing, live status, agent lifecycle, role input packets, generated execution packets, Pi/Aperture agent-scope schema/projection work, state-index persistence, local server/API mode, scheduler execution, worktree lifecycle execution, claim leases, work-surface reservations, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, dependency or lockfile changes, installed global skill edits, external service integration, or unrelated Phase 8 cockpit feature work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-060/brief.md and links to BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT as the active bootstrap gap.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage Capability Scope requirements, Codex-owned technical decisions, source hierarchy, Formation Gate requirement, artifact-input taxonomy, legacy compatibility boundary, canonical Markdown evidence boundary, Trust Verifier Compatibility Period boundary, Token-Cost Failsafe boundary, Evidence Freshness SLO boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, and Supply-Chain Gate requirements.
- Focused RED evidence proves Bandit currently cannot distinguish work/gap specs, artifact-renderer JSON inputs, reviewer captures, and trust snapshot fixtures under `docs/specs/` with deterministic validation.
- A repo-native taxonomy or policy artifact names the supported JSON input classes, canonical or preferred directory for each class, legacy compatibility rules, owner/authority role, allowed writer stage, expected consumers, and refusal behavior for ambiguous future paths.
- `bandit validate` or an equivalently narrow CLI validation path fails closed for new or future JSON inputs that do not match a supported class, have unsafe paths, use unsupported directories, or claim a class inconsistent with the file name or consumer.
- `bandit artifact create <spec-path>` accepts the new artifact-renderer input location and preserves safe path checks, no-overwrite behavior, lifecycle evidence behavior, and rollback behavior for supported artifact families.
- Historical `docs/specs/` files remain readable for existing work-item evidence, reviewer evidence, role-run manifests, model-family separation checks, and trust-verifier snapshot tests unless explicit compatibility aliases are implemented and verified.
- Reviewer/provider capture JSON has an explicit future path or modeled class separate from artifact-renderer command inputs and work/gap specs.
- Trust snapshot fixtures have an explicit future path or modeled class that does not imply they are work-item specs or generated artifact inputs.
- Role contracts, role-run manifests, and model-family separation policies remain consistent with the path taxonomy and continue to preserve Test Writer and Stage 3 Writer boundaries.
- No generated Markdown evidence, landing evidence, retrospective evidence, coordination history, roadmap/current-context state, bootstrap-gap ledger state, or trust-verifier report becomes less authoritative because of the JSON input taxonomy.
- The implementation does not start Trust Verifier cutover or parity replacement; any old-gate replacement remains blocked on a later per-trust-goal cutover decision with reproducible parity evidence.
- The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for this work item.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review-subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore changes repo path semantics, validators, command input boundaries, and role/file authority policy.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT is resolved only after landing action and retrospective closeout evidence exist for this bounded cleanup chore.
- No Trust Verifier cutover, old gate replacement, live evidence capture helper, reviewer execution, model call, harness queue, auth or provider routing, live status, agent lifecycle, role input packet, execution packet, Pi/Aperture agent-scope schema/projection work, state-index persistence, local server/API mode, scheduler, worktree lifecycle, claim lease, work-surface reservation, PR/CI workflow, automatic merge/push/deploy, product UAT approval, dependency or lockfile change, installed global skill edit, external service integration, or unrelated Phase 8 cockpit feature work is introduced.

## Verification Plan

- Run focused artifact-input taxonomy RED/GREEN tests proving the current ambiguity under `docs/specs/` and the new deterministic classification behavior.
- Run focused validation tests for supported classes, unsupported classes, unsafe paths, legacy accepted paths, future preferred paths, and class/name mismatch diagnostics.
- Run focused `artifact create` tests proving the command accepts the new artifact-renderer input location while preserving safe path checks, no-overwrite behavior, lifecycle event append, and rollback behavior.
- Run focused reviewer/provider capture tests if reviewer capture classification or paths are implemented in this chore.
- Run focused trust snapshot fixture tests if trust snapshot fixture classification or paths are implemented in this chore.
- Run focused role-contract and role-run manifest tests if allowed/forbidden path policies change.
- Run focused model-family separation tests if Test Writer or Stage 3 Writer path patterns change.
- Run node --test test/artifact-create.test.mjs for artifact command coverage.
- Run node --test test/work-item-create.test.mjs if work-item spec validation, brief rendering, bootstrap-gap linking, or Repo PM creation routing is touched.
- Run node --test test/role-entrypoints-formation.test.mjs if formation approval, role entrypoint routing, or Work Item PM readiness behavior is touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work-item parsing, templates, bootstrap gaps, coordination history, cockpit status, session-context packets, risk classification, supply-chain gates, input quarantine, operator boundaries, token-cost failsafes, evidence freshness, role contracts, role-run manifests, model-family separation, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run npm run bandit -- stage-capability-scope validate --json.
- Run npm run bandit -- token-cost-failsafe validate --json.
- Run npm run bandit -- evidence-freshness-slos validate --json.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- supply-chain-gate validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-060 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-060 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-060 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-060 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT.json
- docs/work/BANDIT-060/brief.md
- docs/work/BANDIT-060/qwen-formation-review.md
- docs/work/BANDIT-060/coderabbit-formation-review.md
- docs/work/BANDIT-060/formation-review.md
- docs/work/BANDIT-060/coordination-log.jsonl
- docs/work/BANDIT-060/red-evidence.md
- docs/work/BANDIT-060/implementation-evidence.md
- docs/work/BANDIT-060/coderabbit-review.md
- docs/work/BANDIT-060/local-qwen-review.md
- docs/work/BANDIT-060/review-evidence.md
- docs/work/BANDIT-060/landing-verdict.md
- docs/work/BANDIT-060/landing-action.md
- docs/work/BANDIT-060/retrospective.md
- docs/specs/BANDIT-060-red-evidence.json
- docs/specs/BANDIT-060-implementation-evidence.json
- docs/specs/BANDIT-060-landing-verdict.json
- docs/specs/BANDIT-060-retrospective.json
- docs/artifact-inputs/
- docs/reviewer-captures/
- .bandit/policy/artifact-inputs.json
- src/commands/artifact-create.ts
- src/commands/validate.ts
- src/state/artifact-inputs.ts
- test/artifact-inputs.test.mjs
- test/artifact-create.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-060/brief.md
- docs/work/BANDIT-060/qwen-formation-review.md
- docs/work/BANDIT-060/coderabbit-formation-review.md
- docs/work/BANDIT-060/formation-review.md
- docs/work/BANDIT-060/coordination-log.jsonl
- docs/work/BANDIT-060/red-evidence.md
- docs/work/BANDIT-060/implementation-evidence.md
- docs/work/BANDIT-060/coderabbit-review.md
- docs/work/BANDIT-060/local-qwen-review.md
- docs/work/BANDIT-060/review-evidence.md
- docs/work/BANDIT-060/landing-verdict.md
- docs/work/BANDIT-060/landing-action.md
- docs/work/BANDIT-060/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or running formation review. Repo artifacts identify the queued cleanup gap, current Stage Rubric requirements, Clean-Code authority, Formation Gate boundary, Trust Verifier Compatibility Period boundary, artifact-input ambiguity, reviewer capture ambiguity, work/gap spec boundary, Token-Cost Failsafe boundary, Evidence Freshness SLO boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, and Codex PM/Repo PM authority to route routine cleanup mechanics. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing explicit artifact-input path semantics, business tradeoffs, explicit cost/risk posture, provider-pricing approval, spend-class approval, paid reviewer promotion, recurring paid routing policy, external service setup, live routing policy, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, Trust Verifier cutover policy, or broader cockpit/product scope.

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
- superpowers:verification-before-completion
forbidden_actions:
- Do not write RED evidence before Stage 1 brief and Formation Gate evidence exist.
- Do not let Stage 3 Writer edit tests, test helpers, fixtures, RED evidence, or acceptance mappings.
- Do not infer Work Item PM readiness from brief existence alone.
- Do not let JSON command inputs become canonical evidence in place of generated Markdown and append-only lifecycle evidence.
- Do not implement Trust Verifier cutover, old gate replacement, live evidence capture, reviewer execution, model calls, Pi/Aperture agent-scope work, role input packets, execution packets, claim leases, worktrees, scheduler execution, merge, push, deploy, dependency changes, external services, or unrelated cockpit features in this chore.

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- Stage 1 Repo PM brief creation and formation review should use local-only default budget guidance.
- Stage 2 RED evidence and Stage 3 implementation should use existing abnormal-run soft budget guidance; do not set brittle caps that force duplicate attempts.
- Stage 4 reviewer runs may be long-running or provider-dependent and must record continuation or provider-refusal evidence honestly.
provider_pricing_evidence:
- No new paid provider-pricing evidence is approved by this work-item brief.
- Any paid reviewer, paid model, or recurring paid route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
spend_classes:
- local-only-default
- one-off-paid-evaluation-blocked-without-approval
- recurring-paid-routing-blocked-without-policy-promotion
continuation_decisions:
- If CodeRabbit or another external reviewer times out, record explicit provider-refusal or continuation evidence instead of treating absence as pass.
- If token or cost failsafe trips, halt the expensive action and record the continuation decision before retrying.
stage_capability_profiles:
- repo-pm-stage1-formation
- test-writer-stage2
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4
- landing-agent-stage5
- closeout-agent-stage6
