# BANDIT-037: Workflow Trial Decision Guardrails

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Workflow Trials and workflow-policy changes can be kept, revised, reverted, or doubled down without enforced predeclared decision guardrails.

## Origin

The 2026-05-26 strategic review warned that Bandit's improvement loop can overstate causality at single-operator volume, reward proxy metrics, and create in-context reward-hacking pressure. The operator confirmed that Workflow Trials and workflow-policy changes require predeclared decision criteria, explicit uncertainty or minimum-detectable-effect context, proxy-risk disposition, and a later re-evaluation window before keep, revise, revert, or double_down decisions can change policy.

## Scope

- Add first-class Workflow Trial guardrail fields to improvement metadata and retrospective-derived chore contracts: decision criteria, uncertainty or minimum-detectable-effect context, re-evaluation window, and proxy-risk notes.
- Make improvement candidate discovery and evaluation validation fail closed when a policy-changing Workflow Trial or workflow-policy decision lacks the required guardrail fields.
- Update improvement chore and improvement-evaluation templates so future work records guardrail metadata before evaluation or policy-change decisions.
- Update focused improvement tests to cover missing decision criteria, missing uncertainty or minimum-detectable-effect context, missing re-evaluation window, and missing proxy-risk disposition.
- Update cockpit or reporting surfaces that summarize improvement health so they surface guardrail completeness and do not imply causal proof from metric movement alone.
- Preserve repo-native Markdown and JSON spec artifacts as canonical evidence; derived reports and cockpit outputs must not become hidden improvement-policy authority.
- Keep the repair limited to improvement metadata parsing, validation, templates, focused tests, reporting surfaces, and necessary roadmap/context/gap-ledger evidence.
- Record CLEAN_CODE.md read evidence in Stage 1 and perform clean-code evaluation before landing.
- Stage capability scope: Codex PM owns technical routing; Test Writer owns RED evidence; Writer may edit improvement metadata validators, improvement templates, evaluation/reporting surfaces, and focused tests; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Operator-blocking boundary: no operator-owned input is required unless implementation would change product direction, UAT policy, workflow policy beyond enforcing the already recorded Workflow Trial guardrail requirement, business tradeoffs, cost/risk posture, external service setup, or broader workflow scope.
- Layered risk and supply-chain scope: this chore touches local workflow metadata validation, templates, derived reports, and tests only; it must not change dependencies, lockfiles, CI/release workflow, external tool installation, auto-landing policy, paid reviewer policy, supply-chain-sensitive surfaces, live routing, scheduler execution, claim authority, or worktree lifecycle.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-037/brief.md and links to BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS.
- Improvement metadata contracts require predeclared keep, revise, revert, and double_down decision criteria for Workflow Trial or workflow-policy change candidates.
- Improvement metadata contracts require explicit uncertainty or minimum-detectable-effect context and reject policy-change candidates that omit both.
- Improvement metadata contracts require a re-evaluation window before a keep, revise, revert, or double_down decision can be treated as policy-changing.
- Improvement evaluation evidence requires proxy-risk or reward-hacking side-effect disposition before a policy-changing decision is accepted.
- Focused tests prove improvement candidate discovery and evaluation validation fail closed for missing guardrail fields and pass for complete guardrail metadata.
- Templates and docs render the new guardrail fields so future Stage 6 and Stage 7 evidence can be created without chat-only context.
- Cockpit or reporting surfaces expose guardrail completeness and uncertainty without presenting metric movement as causal proof.
- The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow, live reviewer routing change, paid reviewer route, external service integration, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run node --test test/improvements.test.mjs for focused RED/GREEN coverage.
- Run node --test test/validate.test.mjs if template validation behavior is touched.
- Run node --test test/cockpit-status.test.mjs and node --test test/cockpit-view-model.test.mjs if cockpit or reporting surfaces are touched.
- Run npm test if implementation touches shared command routing, validators, review evidence, landing gates, bootstrap gaps, roadmap/cockpit status parsing, retrospective parsing, or template validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-037 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-037 before Stage 4 closeout.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-037 for aggregate review evidence freshness.
- Run npm run bandit -- land-check BANDIT-037 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS.json
- docs/work/BANDIT-037/brief.md
- docs/work/BANDIT-037/red-evidence.md
- docs/work/BANDIT-037/implementation-evidence.md
- docs/work/BANDIT-037/coderabbit-review.md
- docs/work/BANDIT-037/local-qwen-review.md
- docs/work/BANDIT-037/review-evidence.md
- docs/work/BANDIT-037/landing-verdict.md
- docs/work/BANDIT-037/landing-action.md
- docs/work/BANDIT-037/retrospective.md
- docs/improvement/retrospective-chore-schema.md
- docs/templates/improvement-chore.md
- docs/templates/improvement-evaluation.md
- src/state/improvements.ts
- src/commands/improvements.ts
- src/state/cockpit-status.ts
- src/state/cockpit-view-model.ts
- test/improvements.test.mjs
- test/validate.test.mjs
- test/cockpit-status.test.mjs
- test/cockpit-view-model.test.mjs
- .bandit/bootstrap-gaps.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-037/brief.md
- docs/work/BANDIT-037/red-evidence.md
- docs/work/BANDIT-037/implementation-evidence.md
- docs/work/BANDIT-037/coderabbit-review.md
- docs/work/BANDIT-037/local-qwen-review.md
- docs/work/BANDIT-037/review-evidence.md
- docs/work/BANDIT-037/landing-verdict.md
- docs/work/BANDIT-037/landing-action.md
- docs/work/BANDIT-037/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the gap, source artifacts, rationale, implementation boundary, and verification target. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the already recorded Workflow Trial guardrail requirement, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, or broader workflow scope.
