# BANDIT-075 RED Evidence

## Status

`pass` for stage2_red_evidence.

Codex PM acted as Test Writer for Stage 2. The focused RED test suite defines the public `bandit reviewer-calibration validate --json` surface, replay-only policy validation, seeded blocker/non-issue packets, deterministic scoring output, provider-timeout evidence handling, direct-Qwen-CLI refusal, and read-only live-routing boundaries. Stage 2 also records `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json` as the Test Writer-owned seeded packet/gold-label evidence for the real repo. The current repo fails because the reviewer-calibration command does not exist yet.

## Test Command

```sh
node --test test/reviewer-calibration.test.mjs
```

## Observed Output

```text
exit_code=1
Initial RED: 7 failing tests, 0 passing tests
Primary failure symptom: Unknown command: reviewer-calibration
The missing command proved the approved reviewer calibration policy, packet validation, scoring, provider evidence, and no-live-routing behavior were not implemented yet.
PM acceptance tightened RED coverage before Stage 3 acceptance: 10 tests, 7 passing, 3 failing.
Tightening failure symptoms: policy with empty packets exited 0 instead of 1; packet missing failure-mode provenance exited 0 instead of 1; seeded case missing expected_finding_class exited 0 instead of 1.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A policy artifact defines calibration packet schema, gold labels, scoring metrics, reviewer eligibility, provider-refusal handling, and no-live-routing boundaries. | `test/reviewer-calibration.test.mjs` writes `.bandit/policy/reviewer-calibration.json` with required packet schema fields, allowed gold labels, reviewer eligibility, provider refusal handling, scorecard metrics, and no-live-routing boundaries, then exercises `bandit reviewer-calibration validate --json`. |
| Reviewer calibration policy must name concrete replay packets before scoring. | The tightened RED suite rejects a policy with an empty `packets` list, preventing an empty packet loop from vacuously producing a passing score. |
| Calibration packets include known blockers and known non-issues stratified by Bandit workflow failure mode rather than generic coding tasks only. | The RED fixtures and repo packet `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json` define a repo-derived unauthorized-reviewer-route failure mode, a seeded blocker, and a seeded non-issue; a negative test rejects generic-only packet sources. |
| Calibration packets carry failure-mode provenance and required seeded-case gold-label fields. | The tightened RED suite rejects empty `failure_mode_category`, empty `source_artifacts`, and seeded cases missing any field listed by `packet_schema.required_seeded_case_fields`, including `expected_finding_class`. |
| Calibration output is deterministic where local and records provider-dependent evidence honestly where external reviewers are unavailable or inconclusive. | The pass-path test expects deterministic blocker recall, actionable precision, useful finding yield, false-positive rate, and `provider_evidence_statuses: ["provider_timeout"]` from fixture reviewer outputs. |
| Calibration results cannot automatically promote, demote, or replace reviewer routing without a separate approved workflow trial or policy decision. | A negative policy test rejects live routing mutation, and a read-only test captures `.bandit/reviewers/local-qwen.json` plus `.bandit/policy/landing-agent.json` before and after validation to prove the command does not mutate live reviewer or landing authority. |
| Reviewer scoring prioritizes blocker recall and reports actionable precision, useful finding yield, false-positive rate, provider/tool friction, latency, and cost where the reviewer route supplies those fields. | The scorecard tests require `blocker_recall` as the primary metric, reject raw finding count as primary, and expect deterministic metric output from fixture reviewer findings. |
| Calibration packet-source policy requires repo-derived Bandit workflow failure modes before any broader generic benchmark tasks can count as first-harness acceptance. | The generic-only fixture must fail with a packet-source diagnostic instead of counting generic coding benchmark tasks as sufficient reviewer calibration evidence. |
| The implementation preserves CLI authority, repo-native canonical artifacts, replay-only benchmark boundary, no-live-routing boundary, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation. | Tests exercise only the public Bandit CLI in temporary repos, require replay-only/no-live-routing policy, reject direct `qwen` CLI eligibility, and this RED evidence routes Stage 3 to Claude with zero test-surface authority. |

## Next Action

Dispatch Stage 3 implementation to a Claude-family implementation Writer. Allowed implementation surfaces are source/chore delivery only; the Stage 3 Writer must not edit `test/reviewer-calibration.test.mjs`, `docs/work/BANDIT-075/red-evidence.md`, `docs/artifact-inputs/BANDIT-075-red-evidence.json`, `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`, seeded calibration packet fixtures, gold labels, acceptance mappings, or other Test Writer-owned surfaces.
