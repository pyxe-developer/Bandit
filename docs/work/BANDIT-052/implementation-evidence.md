# BANDIT-052 Implementation Evidence

## Status

`pass` for Stage 3: Implementation

## Writer Identity

Claude Writer (`claude-sonnet-4-6`), dispatched through the bootstrap Process Adapter path after Codex-authored Stage 2 RED tests.

## Production Files Changed

- `src/state/paths.ts` — added `eventDrivenWakeSchedulerPolicy` path
- `src/state/event-driven-wake-scheduler.ts` — new policy reader and validator
- `src/commands/event-driven-wake-scheduler.ts` — new CLI command handler
- `src/cli.ts` — registered `event-driven-wake-scheduler` command
- `.bandit/policy/event-driven-wake-scheduler.json` — policy fixture for the repository
- `docs/templates/event-driven-wake-scheduler.md` — template document

## Acceptance Criteria Coverage

| Criterion | Implementation |
| --- | --- |
| `bandit event-driven-wake-scheduler validate --json` exits 0 for a complete fixture with `include_deterministic_sweeper: true` | `validateEventDrivenWakeSchedulerPolicy` parses and validates; passes for valid fixture |
| Unsupported options (e.g. `--yaml`) exit 1 with `Usage: bandit event-driven-wake-scheduler validate [--json]` | `validate()` rejects any arg that is not `--json` with that usage message |
| Absent or false `include_deterministic_sweeper` exits 1 with `deterministic sweeper contract is required` | Validator throws with that diagnostic before returning |
| Command is registered on the CLI routing table | `src/cli.ts` routes `event-driven-wake-scheduler` to the command handler |
| Validation is fail-closed | Missing policy file, invalid JSON, wrong contract_version, or wrong policy_id all throw before returning |

## Verification Commands And Results

```sh
node --test test/event-driven-wake-scheduler.test.mjs
# tests 3 / pass 3 / fail 0

npm run typecheck
# exit 0, no errors

npm run bandit -- validate
# Bandit state is valid.

npm run bandit -- event-driven-wake-scheduler validate --json
# {"status":"pass","policy":".bandit/policy/event-driven-wake-scheduler.json","include_deterministic_sweeper":true}

npm test
# tests 419 / pass 419 / fail 0

git diff --check
# exit 0, no whitespace errors
```

## Test Ownership Boundary

The Stage 3 Writer did not edit `test/event-driven-wake-scheduler.test.mjs`, any other test file, test helper, fixture, RED evidence artifact, RED evidence spec, or acceptance mapping for BANDIT-052.

## Clean-Code Self-Check

- **Spec alignment**: implements exactly `bandit event-driven-wake-scheduler validate [--json]`, no more.
- **Small surface area**: three new files, two small edits to existing files.
- **Simple design**: command/state split follows established `coordination-authority` pattern.
- **Explicit state**: validation result is a named typed report; failure throws with explicit messages.
- **No hidden authority**: policy file is the canonical source; validator reads it directly.
- **Testable behavior**: all three acceptance tests pass.
- **Readable flow**: command → validate() → validateEventDrivenWakeSchedulerPolicy() → parsePolicy() → refusal or pass.
- **Locality**: state logic in `src/state/`, command logic in `src/commands/`.
- **Failure clarity**: missing file, malformed JSON, wrong version, wrong id, missing sweeper all fail closed with named errors.
- **No role erosion**: Test Ownership Boundary preserved; no test surfaces touched.
