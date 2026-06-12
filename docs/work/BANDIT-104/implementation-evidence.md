# BANDIT-104 Implementation Evidence

contract_version: 1
work_item: BANDIT-104
stage: Stage 3 Implementation
implementation_writer: minimax_m3
model_family: minimax
dispatch_packet: docs/work/BANDIT-104/stage3-minimax-dispatch.md
verdict: pass
clean_code_read_evidence: CLEAN_CODE.md read 2026-06-12 before source inspection
created_at: 2026-06-12T19:30:00Z
stage2_red_evidence: docs/work/BANDIT-104/red-evidence.md
coordination_state_at_implementation: red_recorded
coordination_log_sequence_at_implementation: 4

## Stage 3 Route

Codex authored the Stage 2 RED evidence for `BANDIT-104`
(`docs/work/BANDIT-104/red-evidence.md`, `actor: codex_test_writer`).
The brief's Bootstrap Model-Family Separation rule requires a
non-Codex Stage 3 writer. The Work Item PM plan-mode orchestration
(`docs/work/BANDIT-104/orchestration-plan.md`) routes Stage 3
implementation to MiniMax-M3 through the approved headless Pi Process
Adapter path. This implementation-evidence.md is the MiniMax-M3
artifact for the `red_recorded` coordination state.

The Stage 3 implementation route registry in
`src/state/stage-route-registry.ts` records:

```text
first_choice: "minimax_m3"
fallback: "claude"
fallback_after: "minimax_m3_failure_or_20_minute_timeout"
```

## Required Behavior Verification

| Required behavior | Evidence |
| --- | --- |
| `formation_approved` without `orchestration-plan.md` blocked with `missing_plan_mode` and `node ./bin/bandit.mjs work-item-pm start <ID>`. | `test/work-execute-controller.test.mjs` `execute controller requires plan-mode evidence before RED route` passes; `test/bandit-work-command-adapters.test.mjs` `work-execute adapter reports the plan-mode gate before RED evidence` passes. |
| `orchestration_plan_recorded` with plan-mode evidence returns the Stage 2 RED route and truthful Stage 2 status. | `test/work-execute-controller.test.mjs` `execute controller selects authorized routes after plan-mode evidence` passes; `test/bandit-work-command-adapters.test.mjs` `work-execute adapter delegates to the Stage 2 route after plan-mode evidence` passes. |
| `red_recorded` with RED evidence returns the Stage 3 implementation route and truthful Stage 3 status. | `test/work-execute-controller.test.mjs` `execute controller derives Stage 3 implementation route from red_recorded coordination state` passes; `test/bandit-work-command-adapters.test.mjs` `work-execute adapter derives the Stage 3 route from red_recorded coordination state` passes. |
| `red_recorded` without RED evidence fails closed with `missing_red_evidence`. | `test/work-execute-controller.test.mjs` `execute controller fails closed for unsupported or contradictory coordination states` passes for the contradictory branch. |
| Unsupported or blocked coordination states fail closed with `unsupported_coordination_state`; they must not fabricate readiness. | `test/work-execute-controller.test.mjs` `execute controller fails closed for unsupported or contradictory coordination states` passes for the unsupported branch (`coordination_state: "blocked"` returns `unsupported_coordination_state`). |
| Stage 3 route registry uses `minimax_m3` first, `claude` fallback, `minimax_m3_failure_or_20_minute_timeout` trigger. | `test/stage-route-registry.test.mjs` `stage route registry maps authorized stage routes and evidence outputs` passes. |
| Coordinator selection accepts formed work items at all three executable coordination states. | `test/work-execute-controller.test.mjs` `execute controller accepts a single formed work item at executable coordination states` passes. |
| Repo-native append-only coordination history is the source of truth; `work-execute` is a derived projection. | `node ./bin/bandit.mjs work-execute --json` on the live `BANDIT-104` `red_recorded` coordination log returns `Stage 3: implementation_required` with `route.process_adapter.first_choice: "minimax_m3"`. |

## Source Diff Summary

### `src/state/stage-route-registry.ts`

```diff
   {
     stage: "stage_3_implementation",
     authority_role: "implementation_writer",
     route_type: "model_family_separated",
     command: null,
     process_adapter: {
-      first_choice: "claude",
-      fallback: "minimax_m3",
-      fallback_after: "claude_auth_failure_or_20_minute_timeout"
+      first_choice: "minimax_m3",
+      fallback: "claude",
+      fallback_after: "minimax_m3_failure_or_20_minute_timeout"
     },
```

### `src/state/work-execute-controller.ts`

- Added a named `EXECUTABLE_COORDINATION_STATES` set.
- Replaced the selection validator to accept the three executable
  states and to include `formation_approved` in the error message so
  the existing "refuses unformed selection" assertion (`/formation_approved/i`)
  still matches.
- Replaced `resolveWorkExecuteControllerAction` to derive the route
  from the work item's coordination state and evidence. The
  `requestedStage` parameter is removed because the controller is now
  the source of truth for the state-to-stage mapping, not a downstream
  projection of a caller-supplied hint.
- Added `stage_reached` to the `ReadyAction` so the controller owns the
  operator-facing label and the adapter no longer hardcodes
  `Stage 2: ready_for_red`.
- Added private helpers `stageReachedFor`, `readyAction`, and
  `blockedAction` to keep the resolve body small and explicit.

### `src/commands/bandit-work-execute.ts`

- Removed the hardcoded `requestedStage: "stage_2_red"` argument.
- Read `red-evidence.md` presence into `red_evidence: string | null`
  on the work item so the controller's `red_recorded` branch can
  distinguish "RED evidence recorded" from "RED evidence missing".
- Replaced `stage_reached: "Stage 2: ready_for_red"` for ready
  payloads with `stage_reached: action.stage_reached` so the adapter
  projects the controller's label instead of fabricating one.

### `src/commands/work-execute-controller.ts`

- Dropped the `requestedStage` argument that is no longer part of the
  controller signature, keeping the internal resolver stub honest
  under `tsc --noEmit`.

## Verification Commands And Observed Results

### Focused RED command

```sh
node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs
```

Result: 16 tests, 16 pass, 0 fail. The five RED tests recorded in
`docs/work/BANDIT-104/red-evidence.md` are now GREEN; the eleven
previously GREEN tests remain GREEN.

### Typecheck

```sh
npm run typecheck
```

Result: `tsc --noEmit` completes with no output (clean).

### Full test surface

```sh
npm test
```

Result: 660 tests, 660 pass, 0 fail, 0 cancelled, 0 skipped.
Shared behavior changes (controller signature, adapter payload) are
verified across the full test surface, not just the focused
`bandit-work-command-adapters`, `work-execute-controller`, and
`stage-route-registry` tests.

### Bandit state validation

```sh
npm run bandit -- validate
```

Result: `Bandit state is valid.`

### Coordination log validation

```sh
node ./bin/bandit.mjs coordination validate BANDIT-104
```

Result: `Coordination log is valid: BANDIT-104`

### Live `work-execute` projection

```sh
node ./bin/bandit.mjs work-execute --json
```

Result (truncated to relevant fields):

```json
{
  "kind": "bandit_work_execute_result",
  "status": "ready",
  "work_item": "BANDIT-104",
  "stage_reached": "Stage 3: implementation_required",
  "route": {
    "stage": "stage_3_implementation",
    "authority_role": "implementation_writer",
    "route_type": "model_family_separated",
    "process_adapter": {
      "first_choice": "minimax_m3",
      "fallback": "claude",
      "fallback_after": "minimax_m3_failure_or_20_minute_timeout"
    }
  },
  "canonical_state_owner": "repo_native_artifacts",
  "role_input_packet": { "authority": "derived_non_canonical" },
  "next_safe_command": "bandit work-execute"
}
```

This is the BANDIT-100 regression shape fix: `work-execute` now
projects the latest accepted coordination state (`red_recorded`)
into the Stage 3 implementation route, with MiniMax-M3 as the
first implementation writer, instead of the stale Stage 2 route.

### Whitespace check

```sh
git diff --check
```

Result: no output (no whitespace errors in the working tree).

## Source Surfaces Not Touched

The implementation writer did not create, edit, delete, regenerate,
format, or mechanically adjust any of the following:

- `test/work-execute-controller.test.mjs`
- `test/bandit-work-command-adapters.test.mjs`
- `test/stage-route-registry.test.mjs`
- `docs/work/BANDIT-104/red-evidence.md`
- `docs/work/BANDIT-104/orchestration-plan.md`
- `docs/work/BANDIT-104/coordination-log.jsonl`
- `docs/work/BANDIT-104/brief.md`
- `docs/work/BANDIT-104/formation-review.md`,
  `coderabbit-formation-review.md`,
  `qwen-formation-review.md`
- any review, landing, retrospective, roadmap, status, PRD, source
  spec, or bootstrap-gap file
- dependencies, lockfiles, CI/release workflows, publish automation,
  hosted services, telemetry, Trust Verifier cutover, claim authority,
  cockpit UI, State Index, or Local Qwen reviewer routing

The test files and the coordination log show as modified in
`git status` because the Stage 2 Test Writer and Work Item PM placed
their Stage 2 evidence before this dispatch. The implementation
writer inspected those files read-only and did not modify them.

## Blockers Encountered

None. The focused RED tests gave a clear specification, the allowed
source files were sufficient to satisfy every required behavior, and
no operator-owned input, model-routing change, or scope expansion
became required during Stage 3.
