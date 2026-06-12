# BANDIT-104 RED Evidence

contract_version: 1
work_item: BANDIT-104
stage: Stage 2 Test Design And RED Evidence
author: codex_test_writer
timestamp: 2026-06-12T18:59:59Z
verdict: pass
coordination_state: red_recorded_pending
stage3_route_required: minimax_m3_non_codex_writer

## Summary

Focused Test Writer-owned RED tests define the `work-execute --json`
stage-route derivation contract before implementation. The current code fails
because the public adapter always asks the controller for `stage_2_red`, the
controller trusts the requested stage instead of deriving from coordination
state, executable in-progress states are rejected by selection validation, and
the Stage 3 route still reports Claude as the first implementation writer
despite the current Work Item PM instruction to use MiniMax-M3.

## Test Files

- `test/work-execute-controller.test.mjs`
- `test/bandit-work-command-adapters.test.mjs`
- `test/stage-route-registry.test.mjs`

## RED Command

```sh
node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs
```

## RED Result

The focused command fails as expected.

Key failing evidence:

```text
not ok 7 - work-execute adapter derives the Stage 3 route from red_recorded coordination state
actual: 'Stage 2: ready_for_red'
expected: 'Stage 3: implementation_required'

not ok 9 - stage route registry maps authorized stage routes and evidence outputs
actual first_choice: 'claude'
expected first_choice: 'minimax_m3'

not ok 12 - execute controller accepts a single formed work item at executable coordination states
Actual message: "Work Item selection requires formation_approved state; found: orchestration_plan_recorded"

not ok 15 - execute controller derives Stage 3 implementation route from red_recorded coordination state
actual: 'stage_2_red'
expected: 'stage_3_implementation'

not ok 16 - execute controller fails closed for unsupported or contradictory coordination states
actual status: 'ready'
expected status: 'blocked'
```

The same focused run passed 11 existing tests, including the missing
plan-mode blocker and Stage 2 route after `orchestration_plan_recorded`, so the
RED signal is isolated to route derivation after Stage 2 and fail-closed state
handling.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| `work-execute --json` no longer hardcodes `requestedStage: "stage_2_red"` after plan mode; it selects the route from the latest accepted coordination state. | `work-execute adapter derives the Stage 3 route from red_recorded coordination state` writes a fixture coordination log at `red_recorded` and expects `Stage 3: implementation_required`; current code returns `Stage 2: ready_for_red`. |
| A formed item at `formation_approved` without `orchestration-plan.md` still returns the existing `missing_plan_mode` blocker and `work-item-pm start BANDIT-104` next command. | Existing `work-execute adapter reports the plan-mode gate before RED evidence` and `execute controller requires plan-mode evidence before RED route` continue to pass. |
| An item at `orchestration_plan_recorded` with plan-mode evidence returns the Stage 2 RED route and truthful Stage 2 status. | Existing adapter/controller Stage 2 tests continue to pass around the new RED failures. |
| An item at `red_recorded` returns a Stage 3 implementation route rather than a stale Stage 2 route. | Controller and adapter RED tests both expect `stage_3_implementation` from `red_recorded`; current code returns `stage_2_red`. |
| Unsupported or contradictory states fail closed with a clear blocker and do not fabricate readiness. | `execute controller fails closed for unsupported or contradictory coordination states` expects `unsupported_coordination_state` for `blocked` and `missing_red_evidence` for `red_recorded` without RED evidence; current code returns ready Stage 2. |
| Focused tests cover the BANDIT-100 regression shape: red evidence recorded while `work-execute --json` would previously return Stage 2. | The adapter fixture writes RED evidence and a `red_recorded` transition, then calls the public `work-execute --json` command. |
| The implementation preserves CLI Authority, repo-native source-of-truth boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, and Work Item PM plan-mode gate authority. | Tests keep append-only coordination history as the route source, preserve existing plan-mode blocker tests, and assert Stage 3 route uses MiniMax-M3 as a non-Codex writer. |
| The chore does not start `BANDIT-101`, change reviewer adapters, alter PRD-006 product scope, perform Trust Verifier cutover, introduce claim authority, mutate dependencies or lockfiles, create cockpit UI, merge, push, deploy, publish, or change Local Qwen reviewer routing. | Focused tests touch only work-execute controller/adapter behavior and stage-route registry expectations. |

## Test Ownership Boundary

Test Writer owns:

- `test/work-execute-controller.test.mjs`
- `test/bandit-work-command-adapters.test.mjs`
- `test/stage-route-registry.test.mjs`
- this RED evidence
- acceptance mappings in this artifact

Stage 3 Writer has zero authority to create, edit, delete, regenerate, format,
or mechanically adjust tests, test helpers, fixtures, RED evidence, acceptance
mappings, formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, roadmap/status files, source specs, or PRD/source
authority files for this Work Item.

## Stage 3 Dispatch Requirements

Dispatch Stage 3 implementation to MiniMax-M3 through the approved headless Pi
Process Adapter path. The implementation target is narrow:

- derive the work-execute route from latest accepted coordination state instead
  of a stale caller-supplied stage;
- keep `formation_approved` without plan-mode evidence blocked on
  `missing_plan_mode`;
- keep `orchestration_plan_recorded` with plan-mode evidence on Stage 2 RED;
- map `red_recorded` plus RED evidence to Stage 3 implementation;
- fail closed for unsupported or contradictory states with explicit blockers;
- update the Stage 3 route registry to make MiniMax-M3 the first Writer path;
- preserve Local Qwen reviewer routing, append-only coordination authority,
  stage boundaries, and test-surface ownership.

The Stage 3 Writer may edit source files needed for the behavior, but must not
edit any test-owned or PM-owned evidence surface listed above.
