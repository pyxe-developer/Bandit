# CodeRabbit Review: BANDIT-056

contract_version: 1
work_item: BANDIT-056
source_head: a43ca6e36beea55b34387205733e3e9cff2ec61f
provider: coderabbit-agent-pre-pr
review_target: local-diff:c5eb2700502237e3269a82818edd994a4006d878
review_state: completed
coderabbit_verdict: blocker
findings_status: open
findings_disposition: src/state/focused-session-context.ts should run the STAGE_EVIDENCE_INFOS pathExists checks in parallel for entries with stageNum <= current stage, then preserve the current dependency order when adding missing dependency trust signals.; .bandit/policy/evidence-freshness-slos.json uses source_identity current_review_subject_hash for review_subject_hash freshness budget entries; CodeRabbit recommends changing matching source_identity values to current or removing the redundant field if kind is sufficient.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit review --agent --base c5eb2700502237e3269a82818edd994a4006d878
bootstrap_gaps:
  - none
