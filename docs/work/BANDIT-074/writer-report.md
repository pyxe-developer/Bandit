# BANDIT-074 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-074
stage: stage3_implementation
writer: claude-family (claude-sonnet-4-6)
recorded_at: 2026-06-08T03:30:00Z

## Files Changed

- `src/state/projection-consistency.ts` — new file; reads `.bandit/policy/metamorphic-cross-projection-checks.json`, validates cross-projection agreement on trust-relevant fields (with acceptable_differences normalization), validates harmless perturbations normalize to agreement, returns `MetamorphicCrossProjectionReport` or throws with diagnostics.
- `src/commands/validate.ts` — imported `validateProjectionConsistency` and `MetamorphicCrossProjectionReport`; called validator after existing gates; added `metamorphicCrossProjectionChecks` to the return value and `BanditValidationResult` type.
- `src/cli.ts` — added `metamorphic_cross_projection_checks` field to the `--json` output object for the `validate` command.
- `.bandit/policy/metamorphic-cross-projection-checks.json` — new file; real repo policy with empty `covered_projections` and `harmless_perturbations` (no live projection artifacts captured yet); defines `trust_relevant_fields` and `acceptable_differences` for future use.

## No Test-Edit Evidence

The Stage 3 Writer did not create, edit, delete, regenerate, format, or mechanically adjust any of the following:
- `test/metamorphic-cross-projection-checks.test.mjs`
- `docs/work/BANDIT-074/red-evidence.md`
- `docs/artifact-inputs/BANDIT-074-red-evidence.json`
- Any test helpers, fixtures, acceptance mappings, perturbation fixtures, expected-output mappings, or source-artifact mappings.

## Commands Run

```
node --test test/metamorphic-cross-projection-checks.test.mjs
# pass 2 / fail 0

npm run typecheck
# exit 0

npm run bandit -- validate
# "Bandit state is valid."

node ./bin/bandit.mjs cockpit status --json
# exit 0

node ./bin/bandit.mjs session-context current --json
# exit 0

git diff --check
# exit 0 (no whitespace errors)
```

## Acceptance Criteria Coverage

| Criterion | Coverage |
| --- | --- |
| Policy artifact defines covered projections, canonical sources, trust-relevant fields, harmless perturbations, acceptable differences | `.bandit/policy/metamorphic-cross-projection-checks.json` created with all required fields |
| Covered projections agree on trust-relevant claims | `checkProjectionAgreement` in `projection-consistency.ts` compares all covered projections pairwise on all trust-relevant fields, applying acceptable_differences normalization |
| Validation fails closed when projections disagree | Throws with error message containing "Metamorphic cross-projection checks", "projection disagreement", and field/projection diagnostics |
| Metamorphic tests prove harmless perturbations do not alter verdicts | `checkHarmlessPerturbations` normalizes by perturbation_type and acceptable_differences, fails if normalization still yields different values |
| Projection consistency checks remain read-only | Validator only reads the policy file; no writes to canonical workflow state |
| CLI authority and projection boundaries preserved | Validator is a pure reader; `bandit validate` remains the sole authority; no new projection is granted canonical status |

## Clean-Code Self-Check

- Small surface area: three source files changed, each with a single concern.
- Simple design: `projection-consistency.ts` separates parsing, cross-projection comparison, and perturbation check into distinct functions.
- No hidden authority: validator is read-only; policy file is explicitly named in the report.
- Failure clarity: error message names the check, disagreement type, projection id, field name, and both values.
- No role erosion: no test files were touched.

## Blockers

None.
