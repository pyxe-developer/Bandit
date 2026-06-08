# BANDIT-072 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define a replay-only regression corpus command before production implementation. The public interface is `bandit replay-regression-corpus validate [--json]`, backed by repo-native policy and replay packet fixtures. The initial RED run failed because the command did not exist. PM acceptance later found the approved brief also required explicit authority-field and policy-taxonomy validation, so Stage 2 was repaired with two additional RED tests. The current repair RED fails because implementation does not yet reject missing `failure_mode`, `expected_gate`, `expected_verdict`, `command_version`, `replay_only.read_only`, `replay_only.no_live_routing`, or values outside policy taxonomy.

## Test Command

```sh
node --test test/replay-regression-corpus.test.mjs
```

## Observed Output

```text
Subtest: replay-regression-corpus validate requires packet schema authority fields
not ok 3 - replay-regression-corpus validate requires packet schema authority fields
missing-authority: expected verdict undefined but replay produced blocker
required failure mode stale_review_subject_hash is missing a replay packet or explicit disposition
expected diagnostic was missing failure_mode
Subtest: replay-regression-corpus validate rejects packet values outside policy taxonomy
not ok 4 - replay-regression-corpus validate rejects packet values outside policy taxonomy
required failure mode stale_review_subject_hash is missing a replay packet or explicit disposition
expected diagnostic was outside-taxonomy
tests 6
pass 4
fail 2
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A repo-native policy or design artifact defines replay packet schema, failure-mode taxonomy, expected verdict semantics, source metadata, freshness/versioning, replay execution semantics, and replay-only boundaries. | test/replay-regression-corpus.test.mjs expects `.bandit/policy/replay-regression-corpus.json` with schema version, command version, required failure modes, allowed expected gates/verdicts, replay-only authority flags, and explicit failure-mode dispositions. Current CLI has no replay corpus command or policy reader. |
| At least the historically recurring Bandit failure classes are represented or explicitly dispositioned: stale review subject hash, provider timeout/refusal, dirty worktree, dropped bootstrap metadata, parser wording drift, weak reviewer disposition, and stale routing text. | The passing-path RED fixture requires packets for stale review subject hash, provider timeout/refusal, and dirty worktree, plus explicit dispositions for dropped bootstrap metadata, parser wording drift, weak reviewer disposition, and stale routing text. A separate RED test rejects required failure modes that are neither packeted nor dispositioned. |
| Replay execution produces deterministic machine-readable output and fails closed when expected blockers are missed. | The JSON-output RED test asserts stable sorted packet output with covered and dispositioned failure modes. The missed-blocker RED test expects refusal when a packet declares expected_verdict `blocker` but the simulated replay gate returns `pass`. |
| Replay packets cannot change live workflow state, claim authority, reviewer routing, model routing, landing authority, UAT, merge/push/deploy behavior, Trust Verifier cutover, or cost policy. | The read-only RED test snapshots `.bandit/bootstrap-gaps.json`, `docs/work/BANDIT-999/coordination-log.jsonl`, and `docs/roadmap/CURRENT_CONTEXT.md` before and after replay validation and expects byte-for-byte equality. Packet metadata must set replay_only.read_only, no_live_routing, and no_policy_promotion to true. |
| Replay packet fixtures have explicit source artifacts, expected gate, expected verdict, policy version, command version, and no-live-routing/no-policy-promotion metadata. | The malformed-packet and authority-field RED tests expect diagnostics for unsupported schema_version, missing source_artifacts, missing policy_version, missing failure_mode, missing expected_gate, missing expected_verdict, missing command_version, replay_only.read_only missing, replay_only.no_live_routing missing, replay_only.no_policy_promotion false, and empty simulated diagnostics. |
| Validation, focused tests, and replay command output cover stale review hash, provider timeout/refusal, dirty worktree, dropped bootstrap metadata, parser wording drift, weak reviewer disposition, stale routing text, malformed packets, unsupported packet versions, policy-taxonomy mismatches, and read-only execution. | The RED tests cover three concrete packets, four explicit dispositions, malformed/unsupported validation, missing authority fields, values outside policy expected gates/verdicts/failure modes, expected-verdict mismatch, required-mode coverage, deterministic JSON output, and read-only live state preservation. |
| Stage 4 review and Stage 5 landing evidence can reference replay corpus results only as supplemental evidence; replay results do not replace required live evidence, reviewer evidence, UAT evidence, risk evidence, supply-chain evidence, or landing evidence. | The RED packet contract requires replay_only.no_live_routing and replay_only.no_policy_promotion. Any packet that attempts policy promotion is rejected instead of becoming live workflow authority. |
| The implementation preserves Bandit's CLI authority, repo-native canonical artifacts, supply-chain gate expectations, layered risk classification, operator fail-closed boundary, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and replay-only benchmark boundary. | Codex authored `test/replay-regression-corpus.test.mjs` and this RED evidence. Stage 3 must be dispatched to Claude-family implementation and must not edit tests, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, formation evidence, review evidence, landing evidence, or retrospective evidence. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-072 to Claude Implementation Writer through the bootstrap Process Adapter path. Implement the smallest replay regression corpus policy reader, fixture loader, schema validator, deterministic replay validator, `bandit replay-regression-corpus validate [--json]` command, default policy/fixture artifacts, and init/package wiring needed to make `test/replay-regression-corpus.test.mjs` pass. Keep Stage 3 away from tests, test helpers, fixtures owned by Stage 2, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, formation evidence, review evidence, landing evidence, retrospective evidence, live workflow mutation, Trust Verifier cutover, old-gate replacement or wrapping, live reviewer/model routing, public benchmark publication, paid routing, hosted services, telemetry, merge, push, deploy, guarded browser action execution, and unrelated Phase 8 cockpit/product scope.
