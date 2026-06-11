# BANDIT-096 RED Evidence

contract_version: 1
work_item: BANDIT-096
stage: Stage 2 RED
actor: test_writer
created_at: 2026-06-11T12:34:13Z
verdict: pass
findings_status: no_findings
findings_disposition: no_action_required

## Scope

Stage 2 RED evidence covers the approved `BANDIT-096` brief for Work Item PM
Execute Controller And Route Registry. Codex authored the RED tests, so Stage
3 must route implementation to a different model family. During bootstrap,
Stage 3 routes to Claude first and may fall back to MiniMax-M3 only after
immediate Claude authentication failure or the required 20-minute timeout.

## Test Ownership Boundary

Test Writer owns:

- `test/work-execute-controller.test.mjs`
- `test/stage-route-registry.test.mjs`
- `test/role-input-packets.test.mjs`
- `test/provider-blocker-evidence.test.mjs`
- this RED evidence and acceptance mapping

The Stage 3 Implementation Writer has zero authority to edit tests, test
helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-096`.

## RED Tests Added

| Test surface | Acceptance criteria mapped |
| --- | --- |
| `test/work-execute-controller.test.mjs` | Execute controller refuses no eligible formed Work Item, ambiguous eligible Work Items, and selected Work Items without `formation_approved`; requires plan-mode evidence before Stage 2; selects authorized Stage 2 route after plan mode. |
| `test/stage-route-registry.test.mjs` | Route registry maps Stage 2 through Stage 6 to authorized roles, route types, process adapters, reviewer routes, expected evidence, stop conditions, and forbidden fallback behavior; refuses missing and unauthorized Local Qwen routes. |
| `test/role-input-packets.test.mjs` | Role Input Packet assembly produces internal `derived_non_canonical` packet content with source hierarchy, stage rubric, clean-code expectations, allowed writes, forbidden writes, evidence paths, operator boundary, and stop conditions; refuses public `bandit context <stage>` command exposure. |
| `test/provider-blocker-evidence.test.mjs` | Provider/blocker evidence distinguishes provider timeout, malformed output, unavailable route, replacement evidence, and blockers without claiming partial completion as success; enforces Local Qwen authorized route boundaries. |

## Command Evidence

```sh
node --test test/work-execute-controller.test.mjs
```

Result: `fail` as expected for RED.

Observed failure: `ERR_MODULE_NOT_FOUND` for
`src/state/work-execute-controller.ts`.

```sh
node --test test/stage-route-registry.test.mjs
```

Result: `fail` as expected for RED.

Observed failure: `ERR_MODULE_NOT_FOUND` for
`src/state/stage-route-registry.ts`.

```sh
node --test test/role-input-packets.test.mjs
```

Result: `fail` as expected for RED.

Observed failure: `ERR_MODULE_NOT_FOUND` for
`src/state/role-input-packets.ts`.

```sh
node --test test/provider-blocker-evidence.test.mjs
```

Result: `fail` as expected for RED.

Observed failure: `ERR_MODULE_NOT_FOUND` for
`src/state/provider-blocker-evidence.ts`.

## Acceptance Mapping

The RED suite requires Stage 3 implementation to add:

- An execute-controller state helper that selects exactly one eligible formed
  Work Item, refuses missing/ambiguous/unformed selections, requires
  Work Item PM plan-mode evidence before RED routing, and returns authorized
  stage route and internal role-packet support after plan mode.
- A stage route registry that explicitly maps Stage 2 through Stage 6 to
  authority roles, route types, command/process adapter details, reviewer
  routes, expected evidence, stop conditions, and forbidden fallbacks.
- Local Qwen reviewer routing enforcement through
  `.bandit/reviewers/local-qwen.json` and
  `node bin/omlx-chat-completions.mjs`, with direct `qwen`, Ollama, and ad hoc
  reviewer paths refused.
- Internal Role Input Packet assembly that is `derived_non_canonical`, includes
  source hierarchy, stage rubric and clean-code expectations, allowed writes,
  forbidden writes, evidence paths, operator-input boundary, and stop
  conditions, and does not create a public operator workflow command.
- Provider/blocker evidence helpers that record provider timeout, provider
  error, malformed provider output, unavailable route, missing
  operator-owned input, stale evidence, review blocker, gate failure, and
  successful stage transition without reporting partial completion as success.
- Preservation of source hierarchy: `ROADMAP.md`, `CURRENT_CONTEXT.md`,
  work-item artifacts, and coordination logs remain authority surfaces; route
  registry output, role input packets, prompt contracts, cockpit status,
  session-context packets, Work Intake Ledger, PRDs, specs, command output,
  and generated JSON do not become independent workflow authority.

## Stage 3 Route

Because Codex authored the RED tests and acceptance mapping, Stage 3
implementation must be performed by Claude first, preserving the Permanent
Test Ownership Boundary. If Claude authentication fails immediately or Claude
times out after the required 20-minute window, Stage 3 may fall back to
MiniMax-M3 through headless `pi`.
