# BANDIT-072 Stage 3 Implementation Repair Dispatch

role: implementation_writer
work_item: BANDIT-072
model_family: claude
source_context: docs/work/BANDIT-072/red-evidence.md

## Mission

Repair the replay regression corpus validator so the repaired Stage 2 RED suite passes.

Codex PM found that the approved brief requires packet schema validation for authority fields and policy taxonomy. The current focused test result is:

```text
node --test test/replay-regression-corpus.test.mjs
tests 6
pass 4
fail 2
```

Failing tests:

- `replay-regression-corpus validate requires packet schema authority fields`
- `replay-regression-corpus validate rejects packet values outside policy taxonomy`

## Required Behavior

For each replay packet, fail closed with diagnostics that include the packet id when:

- `failure_mode` is missing or not a non-empty string: `missing failure_mode`
- `expected_gate` is missing or not a non-empty string: `missing expected_gate`
- `expected_verdict` is missing or not a non-empty string: `missing expected_verdict`
- `command_version` is missing or null: `missing command_version`
- `replay_only.read_only` is not `true`: `replay_only.read_only must be true`
- `replay_only.no_live_routing` is not `true`: `replay_only.no_live_routing must be true`
- `failure_mode` is not in the policy `required_failure_modes`: `failure_mode <value> is not in policy required_failure_modes`
- `expected_gate` is not in the policy `expected_gates`: `expected_gate <value> is not in policy expected_gates`
- `expected_verdict` is not in the policy `expected_verdicts`: `expected_verdict <value> is not in policy expected_verdicts`

Malformed packets must not satisfy required failure mode coverage.

## Allowed Files

You may edit only:

- `src/state/replay-regression-corpus.ts`
- `docs/work/BANDIT-072/writer-report.md`
- `docs/work/BANDIT-072/implementation-evidence.md`

If you find a source-only repair needs a different implementation file, explain why before editing it.

## Forbidden Files And Actions

Do not edit:

- `test/replay-regression-corpus.test.mjs`
- test helpers
- `docs/artifact-inputs/BANDIT-072-red-evidence.json`
- `docs/work/BANDIT-072/red-evidence.md`
- `docs/work/BANDIT-072/coordination-log.jsonl`
- formation, review, landing, retrospective, roadmap, status, or bootstrap-gap artifacts

Do not mutate live workflow state, promote replay output to live authority, route reviewers/models, approve Trust Verifier cutover, change UAT/landing/merge/push/deploy behavior, or start later work.

## Verification

Run and record:

```sh
node --test test/replay-regression-corpus.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
node ./bin/bandit.mjs replay-regression-corpus validate --json
git diff --check
```

If `npm test` is too slow, run it anyway unless a tool failure blocks it.
