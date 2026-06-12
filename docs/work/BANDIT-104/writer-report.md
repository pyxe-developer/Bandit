# BANDIT-104 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-104
stage: Stage 3 Implementation
implementation_writer: minimax_m3
model_family: minimax
dispatch_packet: docs/work/BANDIT-104/stage3-minimax-dispatch.md
verdict: pass
clean_code_read_evidence: CLEAN_CODE.md read 2026-06-12 before source inspection
created_at: 2026-06-12T19:30:00Z

## Dispatch Identity

MiniMax-M3 is the Stage 3 Implementation Writer for `BANDIT-104`. The
dispatch packet
(`docs/work/BANDIT-104/stage3-minimax-dispatch.md`) names MiniMax-M3 as
the implementation writer, with `claude` as fallback and
`minimax_m3_failure_or_20_minute_timeout` as the fallback trigger. The
author of Stage 2 RED evidence for `BANDIT-104` is `codex_test_writer`,
so the brief's Bootstrap Model-Family Separation rule requires a
non-Codex Stage 3 writer; MiniMax-M3 satisfies that requirement.

## CLEAN_CODE.md Read Evidence

`CLEAN_CODE.md` was read on 2026-06-12 before inspecting any source
file or running any verification command. The implementation was
reviewed against the eleven-point Bandit clean-code rubric. The
implementation complies with the rubric:

- **Spec alignment**: the source implements the approved
  work-execute route derivation contract without redefining the
  BANDIT-100/PRD-006 product contract.
- **Small surface area**: the diff is limited to three source files
  plus the internal `work-execute-controller` stub for typecheck
  honesty (`src/state/stage-route-registry.ts`,
  `src/state/work-execute-controller.ts`,
  `src/commands/bandit-work-execute.ts`,
  `src/commands/work-execute-controller.ts`).
- **Simple design**: the controller uses a small named set
  (`EXECUTABLE_COORDINATION_STATES`) plus a `switch` over
  coordination_state with one helper each for `ready` and `blocked`
  construction. No hidden state, no conditionals on
  caller-supplied requested stages.
- **Explicit state**: the four blocked stop conditions
  (`missing_plan_mode`, `missing_red_evidence`,
  `unsupported_coordination_state`) and the two executable routes
  (`stage_2_red`, `stage_3_implementation`) are named string
  constants visible at the call sites.
- **No hidden authority**: append-only coordination history remains
  the source of truth. The adapter now reads the latest coordination
  state and the on-disk `red-evidence.md` presence and projects from
  them; the controller's `resolve` is a pure function of the work
  item it receives.
- **Testable behavior**: all six required behaviors are covered by
  the Test Writer-owned focused tests in
  `test/work-execute-controller.test.mjs`,
  `test/bandit-work-command-adapters.test.mjs`, and
  `test/stage-route-registry.test.mjs`.
- **Readable flow**: the adapter reads the work item, reads evidence
  presence, calls the controller, formats the payload. The
  controller checks plan-mode evidence, switches on coordination
  state, checks RED evidence for `red_recorded`, and falls through
  to `unsupported_coordination_state` for everything else.
- **Locality**: state-to-route mapping lives in
  `src/state/work-execute-controller.ts`; the route registry change
  is a single field swap in `src/state/stage-route-registry.ts`; the
  adapter change is localized to `banditWorkExecute` in
  `src/commands/bandit-work-execute.ts`.
- **Failure clarity**: blocked actions return explicit
  `stop_condition`, `next_command`, and `required_evidence` strings.
  The `unsupported_coordination_state` fallback does not fabricate
  readiness.
- **No role erosion**: the implementation writer inspected Test
  Writer-owned surfaces read-only and did not edit any test, test
  helper, fixture, RED evidence, acceptance mapping, formation
  review, coordination log, roadmap, status, or PM-owned evidence
  file. Test files showing as modified in `git status` were placed
  there by the Stage 2 Test Writer before this dispatch and were not
  touched.
- **Improvement capture**: no new workflow lesson was uncovered
  beyond the bootstrap-gap entry the brief already records.

## Source Files Inspected

| File | Purpose | Changed? |
| --- | --- | --- |
| `src/state/work-execute-controller.ts` | Selection validator and route resolver. | Yes. |
| `src/state/stage-route-registry.ts` | Stage 3 implementation process_adapter. | Yes. |
| `src/commands/bandit-work-execute.ts` | Public `work-execute` operator adapter. | Yes. |
| `src/commands/work-execute-controller.ts` | Internal resolver CLI stub. | Yes (typecheck honesty). |
| `test/work-execute-controller.test.mjs` | Test Writer-owned RED tests. | No (read-only). |
| `test/bandit-work-command-adapters.test.mjs` | Test Writer-owned RED tests. | No (read-only). |
| `test/stage-route-registry.test.mjs` | Test Writer-owned RED tests. | No (read-only). |
| `docs/work/BANDIT-104/brief.md` | Brief, source-of-truth for scope. | No (read-only). |
| `docs/work/BANDIT-104/orchestration-plan.md` | Work Item PM plan-mode evidence. | No (read-only). |
| `docs/work/BANDIT-104/red-evidence.md` | Stage 2 RED evidence and acceptance mapping. | No (read-only). |
| `docs/work/BANDIT-104/coordination-log.jsonl` | Append-only coordination history. | No (read-only). |

## Source Files Changed

| File | Change |
| --- | --- |
| `src/state/stage-route-registry.ts` | Swapped `process_adapter` for `stage_3_implementation`: `first_choice: "minimax_m3"`, `fallback: "claude"`, `fallback_after: "minimax_m3_failure_or_20_minute_timeout"`. |
| `src/state/work-execute-controller.ts` | Replaced selection validator to accept the three executable coordination states (`formation_approved`, `orchestration_plan_recorded`, `red_recorded`). Replaced `resolveWorkExecuteControllerAction` to derive the route from coordination state and evidence rather than from a caller-supplied `requestedStage`. Added `stage_reached` to the ReadyAction so the controller owns the operator-facing label. Added private `readyAction` and `blockedAction` helpers plus a `stageReachedFor` mapper. |
| `src/commands/bandit-work-execute.ts` | Removed the hardcoded `requestedStage: "stage_2_red"` argument to the controller. Reads `red-evidence.md` presence and threads it into the work item. Uses `action.stage_reached` for ready payloads so the adapter no longer hardcodes `Stage 2: ready_for_red`. |
| `src/commands/work-execute-controller.ts` | Dropped the `requestedStage` argument that is no longer part of the controller signature, keeping the internal resolver stub honest under `tsc --noEmit`. |

## Behavior Mapping

| Required behavior | Implementation |
| --- | --- |
| `formation_approved` without `orchestration-plan.md` blocked with `missing_plan_mode` and `node ./bin/bandit.mjs work-item-pm start <ID>`. | First branch in `resolveWorkExecuteControllerAction` checks `workItem.evidence.orchestration_plan`; when null returns the `missing_plan_mode` blocked action with the work-item-PM next command. |
| `orchestration_plan_recorded` with plan-mode evidence returns the Stage 2 RED route. | Switch case `orchestration_plan_recorded` calls `readyAction(getStageRoute("stage_2_red"))`. |
| `red_recorded` with RED evidence returns the Stage 3 implementation route. | Switch case `red_recorded` calls `readyAction(getStageRoute("stage_3_implementation"))` when `workItem.evidence.red_evidence` is present. |
| `red_recorded` without RED evidence fails closed with `missing_red_evidence`. | Switch case `red_recorded` returns a blocked action with `stop_condition: "missing_red_evidence"` and the red-evidence plus coordination-log required evidence when `red_evidence` is null. |
| Unsupported or blocked coordination states fail closed with `unsupported_coordination_state`. | Switch `default` case returns a blocked action with `stop_condition: "unsupported_coordination_state"` and just the coordination-log required evidence. |
| Stage 3 route registry uses `minimax_m3` first, `claude` fallback, `minimax_m3_failure_or_20_minute_timeout` trigger. | Single `process_adapter` swap in `src/state/stage-route-registry.ts`. |
| Repo-native append-only coordination history is the source of truth. | The adapter reads the latest coordination state from the JSONL log; the controller is a pure function of the work item it receives. |

## Verification Commands And Results

```sh
node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs
```

```text
TAP version 13
# tests 16
# pass 16
# fail 0
```

All 16 focused tests pass. The five previously RED tests are now GREEN:

- `work-execute adapter derives the Stage 3 route from red_recorded coordination state` (now reports `Stage 3: implementation_required`).
- `stage route registry maps authorized stage routes and evidence outputs` (now reports `first_choice: "minimax_m3"`, `fallback: "claude"`, `fallback_after: "minimax_m3_failure_or_20_minute_timeout"`).
- `execute controller accepts a single formed work item at executable coordination states` (selection validator now accepts all three executable coordination states).
- `execute controller derives Stage 3 implementation route from red_recorded coordination state` (resolver now derives `stage_3_implementation` from `red_recorded`).
- `execute controller fails closed for unsupported or contradictory coordination states` (resolver now returns `unsupported_coordination_state` for `blocked` and `missing_red_evidence` for `red_recorded` without RED evidence).

The 11 previously GREEN tests remain GREEN, including the
`missing_plan_mode` blocker, the Stage 2 route after
`orchestration_plan_recorded`, the pre-`formation_approved` adapter
gate, and the missing-source-authority adapter refusal.

Additional verification commands run per the dispatch:

```sh
npm run typecheck
# tsc --noEmit with no output (clean).

npm test
# 660 tests, 0 failures across the full test surface.

npm run bandit -- validate
# "Bandit state is valid."

node ./bin/bandit.mjs coordination validate BANDIT-104
# "Coordination log is valid: BANDIT-104"

node ./bin/bandit.mjs work-execute --json
# ready with stage_reached "Stage 3: implementation_required",
# route.stage "stage_3_implementation",
# route.process_adapter.first_choice "minimax_m3",
# canonical_state_owner "repo_native_artifacts".

git diff --check
# (no output, no whitespace errors).
```

## Test And PM Surface Honesty

The implementation writer did **not** create, edit, delete,
regenerate, format, or mechanically adjust any of:

- `test/work-execute-controller.test.mjs`
- `test/bandit-work-command-adapters.test.mjs`
- `test/stage-route-registry.test.mjs`
- `docs/work/BANDIT-104/red-evidence.md`
- `docs/work/BANDIT-104/orchestration-plan.md`
- `docs/work/BANDIT-104/coordination-log.jsonl`
- `docs/work/BANDIT-104/brief.md`
- any formation-review, landing, retrospective, roadmap, status, PRD,
  source spec, or bootstrap-gap file.

`git status --short --branch` shows the test files and the
coordination log as modified; the diffs in those files are the
Test Writer-owned RED tests and the Stage 2 Work Item PM `red_recorded`
transition, both placed before this dispatch and not touched by
MiniMax-M3. The dispatch packet's Permanent Test Ownership Boundary
is preserved.

## Blockers Encountered

None. The implementation is small, the focused tests give clear
RED evidence, and the existing source has no overlap with the
permanent test-ownership or forbidden-action surfaces. No
operator-owned input became required during Stage 3.
