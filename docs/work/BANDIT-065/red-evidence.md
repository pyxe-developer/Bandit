# BANDIT-065 Stage 2 RED Evidence

contract_version: 1
work_item: BANDIT-065
stage: stage2_red_evidence
owner: test_writer
authored_by: codex
created_at: 2026-06-07T15:50:00Z
verdict: pass

## Scope

Stage 2 RED evidence proves the repo currently lacks a public, repo-native
Work Item PM orchestrator prompt contract validation path. The test surface is
focused on the CLI behavior approved in `docs/work/BANDIT-065/brief.md` and
`docs/work/BANDIT-065/orchestration-plan.md`.

## Acceptance Mapping

| Acceptance criterion | RED test evidence |
| --- | --- |
| Local prompt contract or policy artifact defines required prompt sections, repo-derived evidence boundaries, CLI authority, stage sequence, stop conditions, and forbidden actions. | `test/orchestrator-prompts.test.mjs` creates `.bandit/policy/orchestrator-prompts.json` and `docs/templates/work-item-pm-orchestrator-prompt.md`, then expects `bandit orchestrator-prompts validate --json` to pass for a compliant contract. |
| Validation fails closed for missing prompt sections. | `orchestrator prompt validation fails closed when prompt sections are missing` expects specific missing-section diagnostics. |
| Validation rejects canonical workflow authority, skipped gates, role erosion, Stage 3 test edits, same-model RED/implementation, and Trust Verifier cutover claims. | `orchestrator prompt validation rejects canonical authority and gate bypass claims` expects fail-closed diagnostics for prompt authority, missing Formation Gate, Stage 3 test-edit authority, and forbidden cutover authority. |
| Prompt remains adapter guidance and cannot replace canonical repo artifacts or Bandit CLI authority. | The valid fixture requires `prompt_is_authoritative: false`, `canonical_sources_replaced: []`, and `cli_state_mutation: "cli_only"`; invalid fixture violates those fields. |

## RED Test

Command:

```sh
node --test test/orchestrator-prompts.test.mjs
```

Result: fail, as expected for RED.

Observed signal:

```text
Unknown command: orchestrator-prompts
```

The first test expected a valid harness-portable guidance contract to pass, but
the command is not wired. The second and third tests expected deeper
fail-closed validation diagnostics, but they also fail at the missing command.
This is the correct RED signal for the missing public validation path.

## Test Ownership Boundary

Codex authored the Stage 2 RED tests. Per the Permanent Test Ownership Boundary
and Bootstrap Model-Family Separation, Stage 3 implementation must route to
Claude or another different model family. The Stage 3 Implementation Writer has
no authority to edit `test/orchestrator-prompts.test.mjs`, test helpers,
fixtures, this RED evidence, or acceptance mappings for `BANDIT-065`.

## Required Stage 3 Handoff

Dispatch Stage 3 implementation for `BANDIT-065` to Claude through the
bootstrap Process Adapter path. The implementation may add local policy,
template, state, command, CLI routing, path/init/validate wiring, and
implementation evidence only as needed to satisfy the focused RED tests and the
approved brief.
