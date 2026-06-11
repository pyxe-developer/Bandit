# BANDIT-097 RED Evidence

contract_version: 1
work_item: BANDIT-097
stage: Stage 2 Test Design And RED Evidence
author: codex_test_writer
timestamp: 2026-06-11T14:30:42Z
verdict: pass
coordination_state: red_recorded_pending
stage3_route_required: claude_non_codex_writer

## Summary

Focused Test Writer-owned RED tests define the PRD-005.4 operator command
adapter surface before production implementation. The current code fails
because the public `bandit work-create` and `bandit work-execute` adapters do
not exist; existing lower-level role entrypoints and controller helpers remain
available but are not yet wrapped in concise operator-facing adapter output.

The Test Writer for this stage is Codex. Because Codex authored these RED
tests, Stage 3 implementation must route to Claude or another non-Codex model
family. During bootstrap, Claude is the first Stage 3 Writer route, with
MiniMax-M3 fallback only after auth failure or the required timeout.

## Test Files

- `test/bandit-work-command-adapters.test.mjs`

## RED Command

```sh
node --test test/bandit-work-command-adapters.test.mjs
```

## RED Result

`fail` as expected.

Key failing evidence:

```text
not ok 1 - work-create adapter delegates to Repo PM create controller and stops before Stage 2
error: Unknown command: work-create

not ok 2 - work-create adapter reports already formed work idempotently
error: Unknown command: work-create

not ok 6 - work-execute adapter delegates to the Stage 2 route after plan-mode evidence
error: Unknown command: work-execute
```

The missing-command failures are the intended RED signal. Tests that parse
structured blocker JSON also fail because the current unknown-command fallback
is plain text instead of adapter-owned JSON diagnostics.

The command-separation regression test already passes:

```text
ok 7 - operator adapters keep command separation and do not expose public context command
```

That pass preserves the accepted PRD boundary that `bandit work create` is not
the public nested namespace and `bandit context <stage>` remains unavailable.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| Create adapter invokes existing Repo PM create-controller path and does not independently allocate or approve outside controller behavior. | `work-create adapter delegates to Repo PM create controller and stops before Stage 2` expects `delegate: "repo_pm_create_controller"` and source/evidence created only through normal Work Item artifacts. |
| Create adapter stops at `brief_created`, `already_formed`, blocker, or operator input and never creates Stage 2+ artifacts. | First and second tests assert `stage2_started: false` and absence of `orchestration-plan.md`, RED, implementation, review, landing, and retrospective artifacts after `work-create`. |
| Execute adapter invokes existing Work Item PM execute-controller path and refuses to create new Work Items. | Execute tests expect `delegate: "work_item_pm_execute_controller"` and assert no `BANDIT-098` work item is created. |
| Execute adapter refuses before `formation_approved`. | `work-execute adapter refuses before formation_approved and never creates new work` expects a structured blocker naming `formation_approved`. |
| Execute adapter preserves Work Item PM plan-mode gate before RED evidence. | `work-execute adapter reports the plan-mode gate before RED evidence` expects `missing_plan_mode`, required orchestration evidence, and next safe command `node ./bin/bandit.mjs work-item-pm start BANDIT-097`. |
| Execute adapter reports the Stage 2 route after plan-mode evidence. | `work-execute adapter delegates to the Stage 2 route after plan-mode evidence` expects route `stage_2_red`, authority role `test_writer`, canonical owner `repo_native_artifacts`, and non-canonical role packet status. |
| Adapter output is concise and operator-facing. | Tests require structured fields for work item, action/delegate, stage reached, evidence written or required, blocker, required operator input, and next safe command. |
| CLI Authority and non-canonical support surfaces are preserved. | Tests require controller delegation and `canonical_state_owner: "repo_native_artifacts"` / `role_input_packet.authority: "derived_non_canonical"` after execute routing. |
| Local Qwen route and reviewer behavior are not improvised by adapters. | Create fixtures require the authorized Local Qwen profile path before controller-backed formation work can proceed; Stage 4 reviewer execution remains out of scope for this adapter RED surface. |
| No public `bandit context <stage>` command and no nested `bandit work create` namespace. | `operator adapters keep command separation and do not expose public context command` asserts both command forms remain unknown. |

## Test Ownership Boundary

Test Writer owns:

- `test/bandit-work-command-adapters.test.mjs`
- this RED evidence
- acceptance mappings in this artifact

Stage 3 Writer has zero authority to create, edit, delete, regenerate, format,
or mechanically adjust tests, test helpers, fixtures, RED evidence, acceptance
mappings, formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, roadmap/status files, or PRD/source authority files
for this Work Item.

## Stage 3 Dispatch Requirements

Dispatch Stage 3 implementation to Claude through the bootstrap Process
Adapter path. The implementation target is narrow:

- add thin `bandit work-create` and `bandit work-execute` operator adapters;
- delegate create behavior to the existing Repo PM create-controller path;
- delegate execute behavior to existing Work Item PM execute-controller/state
  route helpers;
- render concise JSON and human-readable operator status;
- preserve fail-closed blocker diagnostics and required operator input fields;
- preserve command separation and keep `bandit context <stage>` unavailable;
- do not edit Test Writer-owned files.

## Verification For Stage 2

- `node --test test/bandit-work-command-adapters.test.mjs` - RED, expected
  failures for missing `work-create` and `work-execute` adapters.

