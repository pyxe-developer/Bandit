# BANDIT-039 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the Agent Evaluation Harness before production implementation. They fail because Bandit does not yet require the agent-evaluation policy or packet templates during validation, and the agent-evaluation validation command does not exist.

## Test Command

```sh
node --test test/agent-evaluation-harness.test.mjs
```

## Observed Output

```text
tests 10
pass 0
fail 10
validate fails closed when the agent evaluation harness policy is missing failed: expected exit code 1, received 0
validate fails closed when the agent evaluation packet template is missing failed: expected exit code 1, received 0
agent evaluation validation rejects contracts that can affect live routing failed: Unknown command: agent-evaluation
agent evaluation validation rejects packet sets without calibration and locked holdout separation failed: Unknown command: agent-evaluation
agent evaluation validation rejects reviewer packets without gold labels and seeded cases failed: Unknown command: agent-evaluation
agent evaluation validation rejects scorecards without required review-quality and cost metrics failed: Unknown command: agent-evaluation
agent evaluation validation rejects one-off paid reviewer benchmarks without pricing evidence and approval failed: Unknown command: agent-evaluation
agent evaluation validation rejects recurring paid reviewer promotion without locked holdout thresholds failed: Unknown command: agent-evaluation
agent evaluation validation rejects skill variants without Skill Lifecycle Contract identity failed: Unknown command: agent-evaluation
agent evaluation validation accepts a complete replay-only benchmark contract failed: Unknown command: agent-evaluation
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| An Agent Evaluation Harness template or policy artifact names required fields for packet identity, packet source, benchmark mode, benchmark subject, expected observations, gold labels, seeded blockers, seeded non-issues, scorecard metrics, and result artifact paths. | The new tests expect docs/templates/agent-evaluation-packet.md, docs/templates/agent-evaluation-result.md, docs/evaluation/agents calibration and holdout packet directories, and .bandit/policy/agent-evaluation-harness.json to become required repo-native surfaces. |
| Validation fails closed when an agent evaluation run can affect live work, reviewer routing, model routing, skill policy, cost policy, paid reviewer policy, or workflow policy automatically. | The live-routing rejection test supplies replay_only false and automatic_policy_changes true and expects a fail-closed message before any trusted status. |
| Validation fails closed when calibration packets and locked holdout packets are not separated, versioned, or identified as distinct evidence classes. | The packet-set separation test removes the locked_holdout packet set and expects validation to reject the policy because visible calibration evidence alone cannot promote routing or policy. |
| Validation fails closed when reviewer benchmark packets are not repo-derived, failure-mode stratified, gold-labeled, or missing seeded blockers, seeded non-issues, expected observations, or scoring labels. | The reviewer-packet test removes gold labels and seeded non-issues from a repo-derived packet and expects validation to reject the contract. |
| Validation fails closed when scorecards omit blocker recall, missed blockers, actionable precision, useful finding yield, false-positive rate, tool friction, latency, provider-pricing-backed expected cost, pricing freshness or expiry, or spend approval state where applicable. | The scorecard test reduces required_metrics to blocker_recall and expects validation to report the first missing required scorecard metric. |
| Validation fails closed when one-off paid reviewer benchmark calls lack current Provider Pricing Evidence and per-run approval or active spend-class approval. | The one-off paid-reviewer test clears benchmark approval and expects validation to require Provider Pricing Evidence plus per-run or active spend-class approval. |
| Validation fails closed when recurring paid reviewer promotion thresholds lack scoped risk class or stage capability profile, locked-holdout blocker-recall improvement over Qwen, false-positive ceiling, Provider Pricing Evidence-backed expected-cost ceiling, or operator-supervised spend-class approval. | The recurring promotion test removes the blocker-recall improvement threshold and expects validation to reject promotion threshold evidence. |
| Validation fails closed when skill variants are benchmarked or promoted without stable Skill Lifecycle Contract identity and version evidence from BANDIT-038. | The skill-variant test clears lifecycle_contract_path for a bandit skill benchmark subject and expects validation to require stable Skill Lifecycle Contract identity and version evidence. |
| Focused tests prove invalid evaluation harness contracts are rejected before writes or trusted status, and prove a complete replay-only benchmark contract is accepted. | The focused test file covers missing policy, missing packet template, live-routing refusal, packet-set separation, reviewer-packet labels, scorecard metrics, paid benchmark approval, recurring promotion thresholds, skill lifecycle identity, and a complete replay-only acceptance report. |
| The implementation does not implement later Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, coordination authority, operator fail-closed boundary, claim authority, Git mutation serializer, worktree bootstrap contract, scheduler, observability traces, Stage Capability Scope, Token-Cost Failsafe, Evidence Freshness SLOs, or cockpit UI gaps. | This RED step adds only focused tests, the Stage 2 evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation, live routing, paid reviewer route, dependency, lockfile, scheduler, claim, worktree, or cockpit UI surface. |

## Next Action

Implement the narrow Agent Evaluation Harness repair: add the repo-native packet/result templates, policy surface, validation command, validate/init integration, calibration and locked-holdout evidence class checks, reviewer packet label checks, scorecard metric checks, paid reviewer pricing and approval checks, recurring promotion-threshold checks, and Skill Lifecycle Contract subject checks needed to make the focused RED tests pass without broadening into live routing, paid reviewer policy promotion, unrelated Phase 8 cockpit work, scheduler, claim, worktree, or dependency scope.
