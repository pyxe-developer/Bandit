# BANDIT-039 Implementation Evidence

## Status

`pass`

The Agent Evaluation Harness repair is implemented as a replay-only repo-native policy, packet/result templates, fixed packet evidence classes, a fail-closed validator, and a focused CLI command without changing live reviewer routing, model routing, skill policy, cost policy, paid reviewer policy, scheduler behavior, or cockpit scope.

## Implementation Summary

- Added docs/templates/agent-evaluation-packet.md and docs/templates/agent-evaluation-result.md as the required packet and result artifact contracts for replay-only benchmark evidence.
- Added .bandit/policy/agent-evaluation-harness.json with calibration and locked-holdout packet sets, repo-derived reviewer packet metadata, scorecard metrics, one-off benchmark spend evidence, recurring paid reviewer promotion thresholds, and Skill Lifecycle Contract subject identity.
- Added docs/evaluation/agents calibration and locked-holdout packet evidence so the first harness has repo-addressable fixed packets while preserving calibration versus holdout separation.
- Added src/state/agent-evaluation-harness.ts to validate configured harness contracts, fail closed on live routing or automatic policy changes, require packet-set separation, reviewer labels, scorecard metrics, provider-pricing-backed approval, promotion thresholds, and Skill Lifecycle Contract identity.
- Added bandit agent-evaluation validate [--json] and wired bandit init/validate to create and validate the policy while keeping fresh repos with an empty default harness policy compatible until a harness contract is configured.

## Verification

- node --test test/agent-evaluation-harness.test.mjs passed with 10 tests.
- node --test test/validate.test.mjs passed with 20 tests.
- node --test test/agent-evaluation-harness.test.mjs test/landing-gates.test.mjs test/routing.test.mjs passed with 86 tests after the empty-policy compatibility repair.
- npm test passed with 284 tests.
- npm run typecheck passed.
- npm run bandit -- agent-evaluation validate --json passed for the committed Agent Evaluation Harness policy.
- npm run bandit -- validate passed.
- npm run bandit -- gaps list passed.
- node ./bin/bandit.mjs cockpit status --json passed.
- git diff --check passed.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation follows BANDIT-039 Stage 1/2 evidence by adding the replay-only template, policy, validator, command, packet evidence, and validation integration only. |
| Small surface area | pass | The production diff is limited to the agent evaluation state validator, one command shim, validate/init wiring, path registration, and repo-native policy/template/evaluation artifacts. |
| Explicit state | pass | Packet sets, reviewer packets, scorecard metrics, pricing evidence, promotion thresholds, and benchmark subjects live in named repo artifacts; no cache, UI, or helper becomes workflow authority. |
| Failure clarity | pass | Missing policy/template surfaces, live-routing attempts, calibration-only packet sets, malformed reviewer packets, incomplete scorecards, missing paid-reviewer approval, missing promotion thresholds, and missing skill lifecycle identity fail closed with direct messages. |
| Testable behavior | pass | Focused tests cover missing policy/template surfaces, live-routing refusal, packet-set separation, reviewer packet labels, scorecard metrics, one-off paid benchmark approval, recurring promotion thresholds, skill lifecycle identity, and complete valid-contract output. |
| No hidden authority | pass | The harness is evidence-only and replay-only; result artifacts cannot automatically change reviewer routing, model routing, skill policy, cost policy, paid reviewer policy, workflow policy, or live work. |
| No role erosion | pass | The implementation reuses Codex PM, Test Writer, Writer, CodeRabbit, Local Qwen, and Landing Agent boundaries from the brief and does not introduce a new agent role. |

## Next Action

Run Stage 4 review gates for BANDIT-039: pre-PR CodeRabbit, Local Qwen, aggregate review evidence, and Codex PM disposition at the current review subject hash before any landing verdict, landing action, retrospective closeout, next bootstrap-gap chore, or unrelated Phase 8 work.
