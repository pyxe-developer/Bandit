# Install And Update Channel Template

policy: .bandit/policy/install-update-channel.json

distribution_posture:
license:
public_discovery:
public_npm_publishing:
selected_channels:
  public_npm:
    package_name:
    supported_install_command_shapes:
  public_git_tag:
    repository:
    development_channels:
    supported_install_command_shapes:
    reproducibility:
  packed_tarball:
    supported_install_command_shapes:
publish_authority:
version_ref_semantics:
update_source:
  type:
  manifest_fields:
    required:
    optional:
    reader_behavior:
update_check:
  command:
  deterministic_statuses:
  non_blocking_statuses:
  non_blocking_statuses_note:
  freshness_bounded_cache:
  normal_cli_alert:
data_minimization:
out_of_scope:
non_canonical_authority:
evidence_paths:
