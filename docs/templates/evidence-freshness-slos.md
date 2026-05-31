# Evidence Freshness SLOs

work_item:
  policy:
    artifact_types:
      - id:
        source_artifacts:
        owner_or_authority_role:
        freshness_budget:
        allowed_freshness_states:
        staleness_reasons:
    trust_signal_requirements:
      - source_artifact
      - owner_or_authority_role
      - freshness_state
      - staleness_reason
    derived_projection_rules:
      - projection:
        source_artifacts:
        dependent_evidence:
        propagate_missing_or_stale_dependencies:
