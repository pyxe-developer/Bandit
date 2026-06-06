# Role Run Manifest

contract_version:
work_item_id:
stage:
role_contract_ref:
capability_profile:
subagent_identity:
base_revision:
allowed_target_files:
observed_changed_files:
forbidden_file_patterns:
required_input_packet_ref:
required_summary_path:
validation_commands:
source_artifacts:
authority_boundary:

## Field Guidance

- `contract_version`: Use `1` for historical append-only manifests. Use `2`
  (or higher) for new manifests so observed changed-file evidence is required.
- `observed_changed_files`: Required for `contract_version` 2 and above. List
  every file the Writer actually changed. Each entry must appear in
  `allowed_target_files` and must stay inside the referenced role contract write
  surfaces without matching any `forbidden_file_patterns`.
- `allowed_target_files`: For an `implementation_writer` run, artifact-input
  policy/support surfaces introduced by BANDIT-060 are now part of the contract:
  `.bandit/policy/artifact-inputs.json`, `docs/artifact-inputs/**`,
  `docs/reviewer-captures/.gitkeep`, and `docs/trust-snapshot-fixtures/.gitkeep`.
