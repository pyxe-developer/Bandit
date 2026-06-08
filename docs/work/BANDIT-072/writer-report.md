# BANDIT-072 Stage 3 Writer Report

role: implementation_writer
work_item: BANDIT-072
model_family: claude
dispatch_source: docs/work/BANDIT-072/stage3-repair-dispatch.md

## Summary

Repaired `src/state/replay-regression-corpus.ts` to satisfy two previously failing RED tests:

- `replay-regression-corpus validate requires packet schema authority fields`
- `replay-regression-corpus validate rejects packet values outside policy taxonomy`

The Stage 3 initial implementation was missing authority-field validation (failure_mode,
expected_gate, expected_verdict, command_version, replay_only.read_only, replay_only.no_live_routing)
and policy-taxonomy validation. This repair adds both with fail-closed behavior and packet-id
diagnostics. All 6 tests now pass. The full suite also passes. No test surface was edited.

## Files Changed

| File | Type | Description |
| --- | --- | --- |
| `src/state/replay-regression-corpus.ts` | modified | Added authority-field validation, taxonomy validation, extended Policy type with expected_gates/expected_verdicts |

## Zero Test-Surface Edits Confirmed

The repair did not create, edit, delete, regenerate, format, or mechanically adjust
`test/replay-regression-corpus.test.mjs`, any test helper, any Test Writer-owned fixture,
RED evidence, replay packet acceptance mappings, expected-verdict mappings, or source-artifact
mappings. Git diff of test surfaces = zero changes.

## Verification Run

```
node --test test/replay-regression-corpus.test.mjs  → 6/6 pass
npm run typecheck                                    → pass
npm test                                             → 545/545 pass
npm run bandit -- validate                           → pass
node ./bin/bandit.mjs replay-regression-corpus validate --json  → pass
git diff --check                                     → pass (no whitespace errors)
```

## Clean-Code Self-Check

- `validatePacketStructure` now fully validates authority fields; errors include packet id.
- `validatePacketTaxonomy` validates failure_mode/expected_gate/expected_verdict against policy sets.
- Malformed packets (structural or taxonomy errors) do not satisfy required failure mode coverage.
- No existing passing test was broken; no test surface was touched.
