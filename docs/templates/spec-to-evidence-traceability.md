# Spec-To-Evidence Traceability Matrix

This human-readable matrix guides authors of a per-work-item
`docs/work/<WORK_ITEM>/spec-to-evidence-traceability.json` file. It is derived
guidance only: it cannot mutate acceptance criteria, approve landing, approve
Trust Verifier cutover, replace or wrap old gates, or change reviewer/model
routing. Authority lives in
`.bandit/policy/spec-to-evidence-traceability.json` and the validator.

## How To Use

Map every acceptance criterion in the work-item brief to one matrix entry.
Each entry either records concrete verification evidence or an explicit
no-action/bootstrap disposition with rationale. The validator fails closed on
missing, vague, unsupported, behavior-mismatched, or rationale-free mappings.

Run the gate with:

```sh
bandit spec-to-evidence validate <WORK_ITEM> [--json]
```

## Entry Fields

- `criterion_id`: The acceptance-criterion identifier from the brief (for
  example `AC1`).
- `criterion`: The acceptance-criterion text the entry proves.
- `evidence_type`: One of `behavior_test`, `command`, `invariant`, `uat`,
  `reviewer`, `replay`, or `implementation_detail`. Omit for disposition-only
  entries.
- `source_artifacts`: Concrete files, tests, or evidence paths backing the
  claim.
- `evidence_summary`: A specific description of how the evidence proves the
  criterion. Existence-only summaries such as "tests exist" fail closed.
- `disposition`: One of `none`, `bootstrap_gap`, or `no_action`. Use a value
  other than `none` only for explicit no-action/bootstrap entries.
- `rationale`: Required and specific for disposition entries and for
  `implementation_detail` evidence used as behavior proof.

## Evidence Discipline

- Behavior evidence is preferred for behavior claims.
- Implementation-detail evidence may support a behavior claim only when the
  entry records explicit rationale and disposition explaining why that evidence
  proves the criterion.
- Raw line coverage, mutation score, reviewer counts, and bare artifact presence
  are not supported evidence types.

## Per-Entry Matrix Field Reference

criterion_id:
criterion:
evidence_type:
source_artifacts:
evidence_summary:
disposition:
rationale:
