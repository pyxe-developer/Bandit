# Test Strength Evidence Template

Record adequacy evidence for a covered high-risk surface. Use exactly one
`mode`. Fill the fields required for that mode; leave the others removed.

contract_version:
work_item:
mode:
target_surface:
command:

## Mutation Mode

score:
threshold:
surviving_mutant_disposition:
excluded_mutants:
freshness_source:
wrong_behaviors_rejected:
  -

## Property / Fault-Injection Mode

invariants:
generated_state_space:
injected_failures:
replay_determinism:
freshness_source:
wrong_behavior_classes_rejected:
  -

## Table-Driven Adversarial Mode

sufficiency_rationale:
freshness_source:
adversarial_cases:
  -
targeted_wrong_implementations:
  -

## Explicit Disposition Mode

disposition_rationale:
