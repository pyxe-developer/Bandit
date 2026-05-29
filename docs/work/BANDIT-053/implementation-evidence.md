# BANDIT-053 Implementation Evidence

## Status

`pass` for Stage 3: Implementation

## Writer Identity

Claude Writer, dispatched through the bootstrap Process Adapter path after
Codex-authored Stage 2 RED tests.

## Production Files Changed

- `src/state/agent-observability.ts` - added Agent Observability Trace policy
  validation and non-canonical projection logic.
- `src/commands/agent-observability.ts` - added the
  `bandit agent-observability validate [--json]` and
  `bandit agent-observability project [--json]` command handlers.
- `src/cli.ts` - registered the `agent-observability` command.

## Acceptance Criteria Coverage

| Criterion | Implementation |
| --- | --- |
| Validate a complete trace policy and trace fixture. | `validateAgentObservability()` reads `.bandit/policy/agent-observability.json`, loads JSON traces from `docs/agent-observability/`, and returns `status: "pass"` with `authority: "derived_non_canonical"`. |
| Require operation span work-item and stage correlation. | Each span must include string `correlation.work_item` and `correlation.stage`; missing values fail closed. |
| Expose non-canonical cost, latency, retry, and failure projections. | `projectAgentObservability()` derives total token count, latency, retry count, and failure types after validation succeeds. |
| Refuse trace or projection authority over canonical repo artifacts. | Validation fails if the policy says projections can satisfy required workflow artifacts. |
| Preserve input-quarantine boundaries for external payloads. | Validation fails if a span marks an external payload as instruction-bearing. |

## Verification Commands And Results

```sh
node --test test/agent-observability.test.mjs
# tests 5 / pass 5 / fail 0

npm run typecheck
# exit 0, no errors
```

## Stage 4 CodeRabbit Repair

Pre-PR CodeRabbit Stage 4 initially returned unresolved findings against the
Agent Observability Trace validator. The repair keeps the implementation scoped
to `src/state/agent-observability.ts` and now drives trace required fields,
span required fields, operation kinds, and correlation checks from
`.bandit/policy/agent-observability.json`, refuses empty trace directories, and
normalizes a missing `docs/agent-observability` directory to a friendly
fail-closed diagnostic.

Repair verification:

```sh
node --test test/agent-observability.test.mjs
# tests 5 / pass 5 / fail 0

npm run typecheck
# exit 0, no errors

npm run bandit -- validate
# Bandit state is valid.

coderabbit review --agent --base-commit 0953579d2044786ba710e611c45648793e797874 --files docs/specs/BANDIT-GAP-AGENT-OBSERVABILITY-TRACES.json docs/specs/BANDIT-053-red-evidence.json docs/roadmap/CURRENT_CONTEXT.md docs/work/BANDIT-053/brief.md docs/work/BANDIT-053/red-evidence.md docs/work/BANDIT-053/implementation-evidence.md src/cli.ts src/commands/agent-observability.ts src/state/agent-observability.ts test/agent-observability.test.mjs -c AGENTS.md --no-color
# review_completed / one out-of-scope BANDIT-052 finding dispositioned not applicable to BANDIT-053

npm run bandit -- coderabbit-review pre-pr BANDIT-053 --base 0953579d2044786ba710e611c45648793e797874 --fixture docs/specs/BANDIT-053-coderabbit-review-output.json
# CodeRabbit pre-PR review: pass
```

## Test Ownership Boundary

The Stage 3 Writer did not edit `test/agent-observability.test.mjs`, test
helpers, fixtures, RED evidence artifacts/specs, or acceptance mappings for
`BANDIT-053`.

## Clean-Code Self-Check

- **Spec alignment**: implements the narrow validation and projection surface
  defined by the Stage 2 RED evidence.
- **Small surface area**: one command module, one state module, and CLI routing
  registration.
- **Simple design**: command parsing delegates to state-level validation and
  projection functions.
- **Explicit state**: the projection reports `derived_non_canonical` authority
  and cannot satisfy required workflow artifacts.
- **No hidden authority**: traces and projections remain read-derived signals,
  not canonical workflow state.
- **Testable behavior**: the focused Agent Observability Trace test suite
  passes.
- **Readable flow**: command routing, validation, projection, and fail-closed
  refusal paths are separated.
- **Locality**: observability behavior is isolated under
  `src/state/agent-observability.ts` and
  `src/commands/agent-observability.ts`.
- **Failure clarity**: missing files, malformed JSON, missing span correlation,
  forbidden canonical authority, and instruction-bearing external payloads fail
  closed with direct diagnostics.
- **No role erosion**: the Writer did not modify Test Writer-owned files.
