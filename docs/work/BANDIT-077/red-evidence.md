# BANDIT-077 RED Evidence

contract_version: 1
work_item: BANDIT-077
stage: 2
author: test_writer
recorded_at: 2026-06-08T16:50:57Z
verdict: pass

## Summary

Test Writer authored focused RED coverage for the Spec-To-Evidence
Traceability Matrix gate. The tests exercise the planned public CLI behavior
through `bin/bandit.mjs`, not private implementation details, and prove that
the current repository lacks the required traceability command and Stage 4
review-template fields.

## Test Surface

- `test/spec-to-evidence-traceability.test.mjs`

## RED Command Evidence

Command:

```sh
node --test test/spec-to-evidence-traceability.test.mjs
```

Result: fail, as expected for RED.

Observed failure classes:

- `Unknown command: spec-to-evidence`
- expected diagnostic `missing traceability mapping: AC2` was absent because the CLI command does not exist yet.
- expected diagnostic `vague traceability evidence: AC1` was absent because the CLI command does not exist yet.
- expected diagnostic `implementation-detail evidence cannot prove behavior without explicit rationale: AC1` was absent because the CLI command does not exist yet.
- expected diagnostic `disposition rationale is too vague: AC3` was absent because the CLI command does not exist yet.
- `docs/templates/review-evidence.md` is missing `traceability_state:`, `traceability_quality:`, and `traceability_disposition:`.

The RED failure is valid because the approved implementation does not exist
yet.

## RED Repair Evidence

After the initial Claude Stage 3 implementation, Codex PM found a real
acceptance gap: the command passed the RED fixture but failed closed against the
existing Bandit brief shape because `BANDIT-077` uses `work_type: chore` and
prose acceptance bullets rather than `risk_tier:` plus `ACn:` identifiers.

Test Writer added one focused repair test:

- `spec-to-evidence validate supports existing chore briefs with prose acceptance bullets`

Repair RED command:

```sh
node --test test/spec-to-evidence-traceability.test.mjs
```

Result: fail, as expected for the repair RED.

Observed repair failure:

- `missing risk_tier in brief: docs/work/BANDIT-999/brief.md`

Test Writer also added `docs/work/BANDIT-077/spec-to-evidence-traceability.json`
as the current work item's traceability matrix. Stage 3 repair remains routed
to Claude-family implementation and must not edit Test Writer-owned surfaces.

## Acceptance Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| The chore brief links to `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` as the active bootstrap gap once it becomes the next queued work item. | Verified by Stage 1 formation and context evidence; not re-tested in Stage 2 because `docs/work/BANDIT-077/brief.md`, `.bandit/bootstrap-gaps.json`, cockpit status, and session context already establish active gap linkage. |
| A policy or template defines traceability entry schema, supported evidence types, disposition values, required fields, and covered risk tiers. | `spec-to-evidence validate emits deterministic read-only traceability output` requires `.bandit/policy/spec-to-evidence-traceability.json`, `docs/templates/spec-to-evidence-traceability.md`, supported evidence types, disposition values, required fields, covered risk tiers, policy version output, and read-only authority flags. |
| Covered work items cannot land when acceptance criteria lack concrete verification mapping or explicit disposition. | `spec-to-evidence validate rejects acceptance criteria without concrete mappings` expects fail-closed diagnostics for missing AC2 and AC3 mappings. |
| Review evidence asks whether mapped tests and artifacts prove the stated behavior rather than only existing. | `review evidence template requires traceability-quality inspection` expects review-template fields for traceability state, quality, and disposition; `spec-to-evidence validate rejects vague or unsupported evidence mappings` rejects existence-only summaries such as `tests exist`. |
| Traceability output distinguishes behavior evidence, implementation-detail evidence, UAT evidence, reviewer evidence, replay evidence, and explicit no-action/bootstrap dispositions. | The deterministic-output test requires evidence type and disposition fields; the unsupported-mapping test rejects line coverage; the implementation-detail test refuses implementation detail as behavior proof without explicit rationale; the disposition-rationale test rejects vague no-action/bootstrap rationales. |
| `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` is resolved only after landing action and retrospective closeout evidence exist. | Stage 6 verification item; not implemented in RED beyond preserving the gap as active until closeout because the bootstrap-gap ledger update must occur after landing action and retrospective evidence. |
| Existing Bandit brief compatibility for this work item. | The RED repair test requires `work_type: chore` plus prose acceptance bullets to derive `bootstrap_chore` and deterministic `AC1`/`AC2`/`AC3` IDs. |

## Role Boundary

Test Writer owns this RED evidence, tests, fixtures, helper data, and acceptance
mappings. Stage 3 Implementation Writer has zero authority to edit
`test/spec-to-evidence-traceability.test.mjs`, this file, test helpers,
fixtures, traceability acceptance mappings, formation evidence, review evidence,
landing evidence, retrospective evidence, or traceability policy acceptance
criteria.

Because Codex authored the Stage 2 RED evidence, Stage 3 implementation must be
routed to the Claude-family implementation-writer path during bootstrap.

## Stage 3 Dispatch Instruction

Dispatch Stage 3 implementation for `BANDIT-077` to Claude through the bootstrap
Process Adapter path. Implement the narrow Spec-To-Evidence Traceability Matrix
gate:

- Add the smallest CLI command surface needed for `bandit spec-to-evidence validate <WORK_ITEM> [--json]`.
- Add `.bandit/policy/spec-to-evidence-traceability.json`.
- Add `docs/templates/spec-to-evidence-traceability.md`.
- Add source validation that reads work-item acceptance criteria and `docs/work/<ID>/spec-to-evidence-traceability.json`.
- Fail closed on missing mappings, vague mappings, unsupported evidence types, implementation-detail evidence used as behavior proof without explicit rationale, and vague dispositions.
- Update review evidence template language so Stage 4 asks whether mappings prove the stated behavior.
- Keep traceability read-only and derived; it must not mutate acceptance criteria, approve landing, approve Trust Verifier cutover, replace or wrap old gates, change reviewer/model routing, change gap status, change UAT authority, or become independent workflow authority.

Do not edit Test Writer-owned surfaces. Do not approve Trust Verifier cutover,
old-gate replacement or wrapping, merge, push, deploy, paid routing, external
services, hosted traceability, telemetry, public benchmark publication, guarded
browser action execution, unrelated cockpit/product work, or any other
operator-owned product/policy/cost/risk decision.
