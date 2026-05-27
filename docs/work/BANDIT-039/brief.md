# BANDIT-039: Agent Evaluation Harness

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Bandit has no repo-native replay-only harness for comparing agents, reviewer profiles, skills, models, or load-bearing component variants on fixed packets.

## Origin

The 2026-05-26 strategic review and accepted Bandit PRDs identify missing agent evaluation as a P0 workflow gap. Bandit currently has improvement-evaluation tooling for workflow trials, but it cannot replay fixed repo-derived packets against Qwen, Claude or paid reviewers, skill variants, reviewer profiles, or load-bearing component variants. The first harness must be benchmark-only, offline/replay-based, and evidence-only: it must not change live work, reviewer routing, model routing, skill policy, cost policy, or paid reviewer policy automatically.

## Scope

- Define a repo-native Agent Evaluation Harness contract for replay-only benchmark runs over fixed Agent Evaluation Packets.
- Define packet-set structure for visible calibration packets and versioned locked holdout packets so skills, reviewer prompts, and routing policy cannot be promoted from visible calibration results alone.
- Define reviewer benchmark packets as repo-derived, failure-mode stratified, gold-labeled packets with seeded blockers, seeded non-issues, expected observations, and scoring labels.
- Define scorecard fields that prioritize blocker recall before raw finding count and also record missed blockers, actionable precision, useful finding yield, false-positive rate, tool friction, latency, provider-pricing-backed expected cost, pricing freshness or expiry, and spend-class approval state.
- Add a CLI-readable policy or packet registry surface for benchmark packet sets, reviewer profiles, skill variants, component variants, replay-only run definitions, result artifacts, and promotion-threshold metadata.
- Add validation that fails closed when Agent Evaluation Harness work omits the replay-only/no-live-routing boundary, calibration versus locked-holdout separation, gold labels, seeded blockers, seeded non-issues, scorecard metrics, provider-pricing evidence for paid reviewers, spend approval state, or scoped promotion threshold rules.
- Define one-off paid reviewer benchmark calls as benchmark/evaluation spend requiring current Provider Pricing Evidence plus per-run approval or active spend-class approval; do not treat them as recurring reviewer routing policy.
- Define recurring paid reviewer promotion thresholds scoped by risk class or stage capability profile, requiring locked-holdout blocker-recall improvement over Qwen, false-positive ceiling, Provider Pricing Evidence-backed expected-cost ceiling, and operator-supervised spend-class approval.
- Reuse the stable Skill Lifecycle Contract from BANDIT-038 before skill variants can become benchmark subjects or stage-policy candidates.
- Keep the repair limited to agent evaluation packet contracts, benchmark policy or registry validation, templates, focused tests, CLI surfaces needed for replay-only local fixtures, and necessary roadmap/context/gap-ledger evidence.
- Record CLEAN_CODE.md read evidence in Stage 1 and perform clean-code evaluation before landing.
- Stage capability scope: Codex PM owns technical routing; Test Writer owns RED evidence; Writer may edit agent evaluation packet templates, benchmark policy or registry parsing, replay-only CLI surfaces, validation, and focused tests; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Operator-blocking boundary: no operator-owned input is required unless implementation would change product direction, UAT policy, workflow policy beyond defining the already queued replay-only evaluation harness, business tradeoffs, explicit cost/risk posture, paid reviewer spend approval, external service setup, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, or broader workflow scope.
- Layered risk and supply-chain scope: this chore may define benchmark packet and pricing-evidence contracts but must not install, fetch, rewrite, or execute external skills, dependencies, prompts, package scripts, lockfiles, CI/release workflow, paid reviewer routes, live model routing, scheduler execution, claim authority, worktree lifecycle, or unrelated Phase 8 cockpit work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-039/brief.md and links to BANDIT-GAP-AGENT-EVALUATION-HARNESS.
- An Agent Evaluation Harness template or policy artifact names required fields for packet identity, packet source, benchmark mode, benchmark subject, expected observations, gold labels, seeded blockers, seeded non-issues, scorecard metrics, and result artifact paths.
- Validation fails closed when an agent evaluation run can affect live work, reviewer routing, model routing, skill policy, cost policy, paid reviewer policy, or workflow policy automatically.
- Validation fails closed when calibration packets and locked holdout packets are not separated, versioned, or identified as distinct evidence classes.
- Validation fails closed when reviewer benchmark packets are not repo-derived, failure-mode stratified, gold-labeled, or missing seeded blockers, seeded non-issues, expected observations, or scoring labels.
- Validation fails closed when scorecards omit blocker recall, missed blockers, actionable precision, useful finding yield, false-positive rate, tool friction, latency, provider-pricing-backed expected cost, pricing freshness or expiry, or spend approval state where applicable.
- Validation fails closed when one-off paid reviewer benchmark calls lack current Provider Pricing Evidence and per-run approval or active spend-class approval.
- Validation fails closed when recurring paid reviewer promotion thresholds lack scoped risk class or stage capability profile, locked-holdout blocker-recall improvement over Qwen, false-positive ceiling, Provider Pricing Evidence-backed expected-cost ceiling, or operator-supervised spend-class approval.
- Validation fails closed when skill variants are benchmarked or promoted without stable Skill Lifecycle Contract identity and version evidence from BANDIT-038.
- Focused tests prove invalid evaluation harness contracts are rejected before writes or trusted status, and prove a complete replay-only benchmark contract is accepted.
- The implementation does not implement the later Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, coordination authority, operator fail-closed boundary, claim authority, Git mutation serializer, worktree bootstrap contract, scheduler, observability traces, Stage Capability Scope, Token-Cost Failsafe, Evidence Freshness SLOs, or cockpit UI gaps.
- The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-AGENT-EVALUATION-HARNESS is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow, live reviewer routing change, paid reviewer route, external service integration, dependency or lockfile change, installed global skill edit, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused agent evaluation harness tests for RED/GREEN coverage.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run npm test if implementation touches shared command routing, validators, policy parsing, review evidence, landing gates, bootstrap gaps, roadmap/cockpit status parsing, skill lifecycle validation, or template validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- skill-lifecycle validate --json.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-039 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-039 before Stage 4 closeout.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-039 for aggregate review evidence freshness.
- Run npm run bandit -- land-check BANDIT-039 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-AGENT-EVALUATION-HARNESS.json
- docs/work/BANDIT-039/brief.md
- docs/work/BANDIT-039/red-evidence.md
- docs/work/BANDIT-039/implementation-evidence.md
- docs/work/BANDIT-039/coderabbit-review.md
- docs/work/BANDIT-039/local-qwen-review.md
- docs/work/BANDIT-039/review-evidence.md
- docs/work/BANDIT-039/landing-verdict.md
- docs/work/BANDIT-039/landing-action.md
- docs/work/BANDIT-039/retrospective.md
- docs/templates/agent-evaluation-packet.md
- docs/templates/agent-evaluation-result.md
- .bandit/policy/agent-evaluation-harness.json
- docs/evaluation/agents/calibration/README.md
- docs/evaluation/agents/holdout/README.md
- src/state/agent-evaluation-harness.ts
- src/commands/agent-evaluation.ts
- test/agent-evaluation-harness.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-039/brief.md
- docs/work/BANDIT-039/red-evidence.md
- docs/work/BANDIT-039/implementation-evidence.md
- docs/work/BANDIT-039/coderabbit-review.md
- docs/work/BANDIT-039/local-qwen-review.md
- docs/work/BANDIT-039/review-evidence.md
- docs/work/BANDIT-039/landing-verdict.md
- docs/work/BANDIT-039/landing-action.md
- docs/work/BANDIT-039/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the gap, source artifacts, rationale, benchmark-only replay boundary, required packet separation, scoring metrics, paid reviewer spend boundary, promotion-threshold constraints, and dependency on BANDIT-038 Skill Lifecycle Contract evidence. Halt only if implementation would change product direction, UAT policy, workflow policy beyond defining the already queued replay-only evaluation harness, business tradeoffs, explicit cost/risk posture, paid reviewer spend approval, external service setup, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, or broader workflow scope.
