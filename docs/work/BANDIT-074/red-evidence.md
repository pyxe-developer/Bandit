# BANDIT-074 Stage 2 RED Evidence

contract_version: 1
work_item: BANDIT-074
stage: stage2_red_evidence
owner: test_writer
recorded_at: 2026-06-08T03:21:11Z
verdict: pass

## Test Writer Scope

Codex PM acted as Test Writer for Stage 2. Test Writer owns
`test/metamorphic-cross-projection-checks.test.mjs`, this RED evidence,
`docs/artifact-inputs/BANDIT-074-red-evidence.json`, cross-projection acceptance
mappings, perturbation fixtures, expected-output mappings, source-artifact
mappings, and all test-surface changes for `BANDIT-074`.

The Stage 3 Writer has zero authority to create, edit, delete, regenerate,
format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
cross-projection acceptance mappings, perturbation fixtures, expected-output
mappings, source-artifact mappings, or acceptance mappings.

Because Codex authored Stage 2 RED evidence, Stage 3 implementation must route
to a Claude-family implementation Writer during bootstrap. Claude may implement
source/chore delivery only and may not edit the Stage 2 surfaces listed above.

## RED Command

```sh
node --test test/metamorphic-cross-projection-checks.test.mjs
```

Result: `exit_code=1`.

Important failing assertions:

- `validate --json reports pass when covered projections agree under harmless perturbations`: `metamorphic_cross_projection_checks` was `undefined`, proving the validation report does not exist yet.
- `validate fails closed when covered projections disagree on trust-relevant claims`: exit code was `0` instead of `1`, proving projection disagreement is not yet a fail-closed validation error.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| A policy artifact defines covered projections, canonical source artifacts, trust-relevant fields, harmless perturbations, and acceptable differences. | The test writes `.bandit/policy/metamorphic-cross-projection-checks.json` with `canonical_sources`, `covered_projection_ids`, `trust_relevant_fields`, `acceptable_differences`, `covered_projections`, and `harmless_perturbations`. |
| Covered projections agree on active work item, stage, next action, blockers, required operator input, queued gaps, and gate verdict summaries. | The pass-path RED fixture compares `cockpit-status` and `session-context` claims for active work item, current stage, next action, required operator input, queued gaps, and gate verdicts. |
| Validation or focused checks fail closed when projections disagree on trust-relevant claims. | The fail-closed RED fixture changes only `session-context.claims.next_action` and expects `bandit validate` to exit `1` with diagnostics naming cross-projection checks, projection disagreement, `session-context`, and `next_action`. |
| Metamorphic tests prove harmless input changes do not alter covered verdicts or trusted status. | The pass-path RED fixture records a `whitespace` perturbation that normalizes stage and work-item whitespace while preserving trusted claims and expects a pass report with perturbation count. |
| Projection consistency checks remain read-only against canonical workflow state unless a later stage explicitly writes ordinary stage evidence under approved Work Item surfaces. | The RED tests exercise the public `bandit validate` command against temporary repos and assert validation output/exit status only; Stage 3 must keep the validator read-only except for approved Stage 3 evidence artifacts. |
| The implementation preserves CLI authority, repo-native canonical artifacts, source-of-truth/projection boundaries, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation. | The tests require `bandit validate` to consume an explicit policy artifact and emit a derived report without making any projection canonical authority; this RED evidence routes implementation to Claude and forbids all test-surface edits. |

## Stage 3 Dispatch Requirements

- Implementation Writer: Claude-family implementation Writer.
- Allowed implementation surfaces: `.bandit/policy/metamorphic-cross-projection-checks.json`, `src/state/projection-consistency.ts`, `src/commands/validate.ts`, `src/commands/init.ts`, `src/cli.ts` if command output wiring needs it, and source-only helpers needed for validation.
- Forbidden implementation surfaces: `test/metamorphic-cross-projection-checks.test.mjs`, this RED evidence, RED artifact inputs, test helpers, fixtures, acceptance mappings, perturbation fixtures, expected-output mappings, review evidence, landing evidence, retrospective evidence, roadmap/status routing, and bootstrap-gap closeout.
- Required focused GREEN command: `node --test test/metamorphic-cross-projection-checks.test.mjs`.
- Required broader verification before PM acceptance: `npm run typecheck`, `npm run bandit -- validate`, `node ./bin/bandit.mjs cockpit status --json`, `node ./bin/bandit.mjs session-context current --json`, and `git diff --check`.
