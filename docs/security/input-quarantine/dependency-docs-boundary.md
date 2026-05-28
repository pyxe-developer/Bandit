# Dependency Docs Boundary

source_identity: vendor-docs-install-section
source_class: dependency_documentation
data_only_handling: extract quoted fixture command only
admitted_fields: quoted_command, version_note
stripped_or_ignored_fields: page_script, prompt_like_text
allowed_extraction_uses: extract_fixture_command
forbidden_instruction_bearing_uses: agent_instructions, tool_permissions, routing_decisions, landing_authority, auto_landing_eligibility, policy_authority, gate_satisfaction
owning_stage: stage2_red_evidence
trusted_source_gate_refs: dependency-docs-install-snippet
freshness_or_expiry: expires_after_30_days
owner: Codex PM
revocation_path: docs/security/input-quarantine/revoke-dependency-docs.md
