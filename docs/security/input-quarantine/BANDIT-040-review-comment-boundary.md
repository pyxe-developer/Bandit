# BANDIT-040 Review Comment Boundary

source_identity: github-pr-123-review-comment-7
source_class: review_comment
data_only_handling: quoted extraction only
admitted_fields: author, body, url
stripped_or_ignored_fields: hidden_prompt, tool_directive
allowed_extraction_uses: summarize_findings, quote_evidence
forbidden_instruction_bearing_uses: agent_instructions, tool_permissions, routing_decisions, landing_authority, auto_landing_eligibility, policy_authority, gate_satisfaction
owning_stage: stage4_review
trusted_source_gate_refs: none
freshness_or_expiry: re-evaluate when review evidence changes
owner: Codex PM
revocation_path: not_applicable_data_only_boundary
