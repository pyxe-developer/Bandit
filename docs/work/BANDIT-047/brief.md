# BANDIT-047: Bootstrap Model-Family Separation

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Bandit does not yet enforce model-family separation between Codex-authored RED evidence and Stage 3 implementation, or the permanent Writer test-edit ban.

## Origin

The 2026-05-28 grill-with-docs review identified a bootstrap workflow breakdown: Codex had stopped consistently handing Stage 3 implementation to Claude after Codex-authored RED tests. Current repo language preserves role boundaries and Test Writer ownership, but the model-family separation rule and absolute Writer test-edit ban are not yet first-class enforced gates. During bootstrap, Codex writes Stage 2 RED tests, Claude writes Stage 3 implementation through the Process Adapter path with no authority to edit tests in any capacity, Qwen and CodeRabbit verify, and escalation after Claude-authored implementation returns to Codex PM rather than Claude. The repair is bounded by the Bootstrap Orchestration Boundary: Codex can enforce artifact and diff gates around Process Adapter runs, but live cross-model orchestration, bidirectional inter-agent messaging, scoped runtime permissions, and persistent worker context require a future Harness.

## Scope

- Define Bootstrap Model-Family Separation as an enforceable Stage 2 and Stage 3 gate: when Codex authored or materially edited RED tests, Stage 3 implementation must be assigned to a different model family; during bootstrap that path is Claude through the Process Adapter.
- Define the permanent Test Ownership Boundary as an enforced rule across bootstrap, future harnesses, true agents, model families, and providers: the Stage 3 Writer has zero authority to create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, or acceptance mappings for the Work Item it implements.
- Define Stage 3 attempt invalidation behavior: if Claude or another Stage 3 Writer touches any test surface, the Stage 3 attempt is invalid, the entire attempt must be fully reverted, and Stage 3 must rerun clean from unchanged Stage 2 RED evidence.
- Define verification escalation routing for Claude-authored implementation: escalation returns to Codex PM for disposition rather than Claude acting as independent reviewer or repair authority for its own work.
- Enforce model-family and test-ownership fields in work-item briefs, RED evidence, implementation evidence, review evidence, landing readiness checks, cockpit status where applicable, templates, validation, and tests.
- Record artifact and diff-gate evidence proving Stage 2 RED ownership, Stage 3 Writer identity and model family, Stage 3 allowed and forbidden write surfaces, implementation diff file classes, and any required invalidation or rerun decision.
- Preserve the Bootstrap Orchestration Boundary: this chore may enforce artifact and diff gates around Process Adapter runs, but it must not claim live cross-model orchestration, bidirectional A2A, scoped runtime permissions, or persistent worker context without a Harness.
- Preserve Manager-Owned Routing and Operator Input Boundary: Codex PM owns routine routing and enforcement mechanics; operator input is required only for product direction, UAT, policy changes beyond this accepted gap, business tradeoffs, explicit cost/risk overrides, external service setup, paid reviewer spend, live routing, scheduler authority, merge/push/deploy authority, installed global skill contents, or genuinely ambiguous scope.
- Consume existing Clean-Code, Stage Rubric, Layered Risk Classification, Supply-Chain Gate, Input Quarantine Gate, Skill Lifecycle Contract, Agent Evaluation Harness, Operator Fail-Closed Boundary, Coordination Event Log Authority, CAS Claim Authority, Git Mutation Serializer, and review-subject-hash vocabulary without redefining those gates.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-28 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope: Codex PM owns technical routing and RED authorship when needed; Test Writer owns Stage 2 RED evidence and acceptance mapping; Claude is the bootstrap Stage 3 Writer path when Codex authored or materially edited RED tests; Writer may edit production implementation surfaces only; CodeRabbit and Local Qwen own Stage 4 review evidence; Codex PM owns escalation disposition for Claude-authored code; Landing Agent owns Stage 5 verdict/action evidence.
- Future-work scope: this chore must not implement Focused Session Context Packets, Worktree Bootstrap Contract behavior, scheduler execution, full worktree lifecycle enablement, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow execution, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-047/brief.md and links to BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage capability scope, Codex-owned technical decisions, Bootstrap Model-Family Separation, the permanent Test Ownership Boundary, the Bootstrap Orchestration Boundary, and the operator-blocking boundary.
- Stage 2 RED evidence requires explicit Test Writer identity, RED author model family, material test-edit status, acceptance-mapping ownership, and a statement that Stage 3 has zero test-edit surfaces.
- Stage 2 or validation fails closed if Codex authored or materially edited RED tests and Stage 3 is not routed to a different model family; during bootstrap the accepted Stage 3 Writer path is Claude through the Process Adapter.
- Stage 3 implementation evidence requires Writer identity, model family, allowed production write surfaces, forbidden test surfaces, implementation diff file list, and evidence that no test, test helper, fixture, RED evidence, or acceptance-mapping surface was touched by the Writer.
- Validation or focused tests fail closed when Stage 3 implementation is authored by the same model family that authored or materially edited Stage 2 RED tests.
- Validation or focused tests fail closed when the Stage 3 Writer touches tests, test helpers, fixtures, RED evidence, or acceptance mappings, even if the edit is formatting, regeneration, fixture adjustment, or mechanical repair.
- Validation or focused tests require complete Stage 3 attempt invalidation and revert evidence before any rerun when a Writer test-surface edit occurs; partial repair around the contaminated diff is refused.
- Review and escalation evidence routes Claude-authored implementation escalation to Codex PM rather than Claude, and records any PM disposition of test ownership, model-family, or writer-surface findings.
- Cockpit status or derived status output exposes missing or failed model-family/test-ownership gates without making cockpit state canonical.
- Templates or artifact renderers guide future work items to record model-family separation and test-ownership evidence in briefs, RED evidence, implementation evidence, and review evidence.
- The implementation records that Bootstrap Orchestration Boundary enforcement is artifact and diff-gate based around Process Adapter runs, not live True Agent orchestration.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing if the implementation touches validators, parsers, templates, agent-skill surfaces, workflow gates, generated schemas, or other sensitive surfaces.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No Focused Session Context Packet implementation, Worktree Bootstrap Contract implementation, scheduler execution, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow execution, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused model-family separation tests for RED/GREEN coverage.
- Run focused work-item brief/template tests proving Stage 1 renders or validates model-family separation, Test Ownership Boundary, Stage capability scope, and allowed/forbidden surfaces.
- Run focused RED evidence validation tests proving Test Writer identity, RED author model family, material test-edit status, acceptance mappings, and Stage 3 no-test-edit authority are required.
- Run focused implementation evidence validation tests proving Writer identity, model family, implementation diff file list, allowed write surfaces, and zero test-surface edits are required.
- Run focused diff-classification tests for tests, test helpers, fixtures, RED evidence, acceptance mappings, generated schemas, and production implementation files.
- Run focused invalidation tests proving any Stage 3 Writer test-surface edit requires full attempt revert evidence before rerun.
- Run focused review or landing-gate tests proving Claude-authored implementation escalation routes to Codex PM rather than Claude.
- Run focused cockpit status tests if derived status exposes model-family or test-ownership gate state.
- Run node --test test/work-item-create.test.mjs test/artifact-create.test.mjs if brief or artifact renderer behavior is touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/landing-gates.test.mjs if landing readiness or Stage 4/Stage 5 gate behavior is touched.
- Run node --test test/cockpit-status.test.mjs if cockpit status behavior is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work item parsing, review evidence, landing gates, cockpit status, templates, bootstrap gaps, risk classification, supply-chain gates, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run npm run bandit -- supply-chain-gate validate --json if workflow-gate, template, agent-skill, generated-schema, dependency, lockfile, package-manager script, CI/release, fetched-prompt, or external tool-install surfaces are touched.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run npm run bandit -- coordination-authority validate --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-047 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-047 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-047 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-047 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json
- docs/work/BANDIT-047/brief.md
- docs/work/BANDIT-047/red-evidence.md
- docs/work/BANDIT-047/implementation-evidence.md
- docs/work/BANDIT-047/coderabbit-review.md
- docs/work/BANDIT-047/local-qwen-review.md
- docs/work/BANDIT-047/review-evidence.md
- docs/work/BANDIT-047/landing-verdict.md
- docs/work/BANDIT-047/landing-action.md
- docs/work/BANDIT-047/retrospective.md
- docs/templates/chore.md
- docs/templates/slice.md
- docs/templates/review-evidence.md
- docs/templates/model-family-separation.md
- .bandit/policy/model-family-separation.json
- src/state/model-family-separation.ts
- src/state/work-items.ts
- src/commands/work-item-create.ts
- src/commands/artifact-create-renderers.ts
- src/commands/validate.ts
- src/commands/cockpit.ts
- src/commands/land-check.ts
- test/model-family-separation.test.mjs
- test/work-item-create.test.mjs
- test/artifact-create.test.mjs
- test/validate.test.mjs
- test/cockpit-status.test.mjs
- test/landing-gates.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-047/brief.md
- docs/work/BANDIT-047/red-evidence.md
- docs/work/BANDIT-047/implementation-evidence.md
- docs/work/BANDIT-047/coderabbit-review.md
- docs/work/BANDIT-047/local-qwen-review.md
- docs/work/BANDIT-047/review-evidence.md
- docs/work/BANDIT-047/landing-verdict.md
- docs/work/BANDIT-047/landing-action.md
- docs/work/BANDIT-047/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, operator-identified bootstrap breakdown, current Stage Rubric requirements, Clean-Code role boundary, Bootstrap Orchestration Boundary, Process Adapter limitation, Bootstrap Model-Family Separation rule, permanent Test Ownership Boundary, and Codex PM boundary that routine technical routing is manager-owned when repo evidence and policy are sufficient. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the accepted model-family/test-ownership gap, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer spend approval, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
