# Routing Decision: BANDIT-010

work_item: BANDIT-010
decision_kind: reviewer
selected_route: escalated-adversarial-placeholder
applicable_smell_ids:
  - BANDIT-SMELL-SECURITY-PRIVACY-AUTH
  - BANDIT-SMELL-UNAVAILABLE-AGENT
  - BANDIT-SMELL-POLICY-DRIFT
evidence_used:
  - AGENTS.md
  - CONTEXT.md
  - CLEAN_CODE.md
  - docs/work/BANDIT-010/brief.md
  - docs/work/BANDIT-010/red-evidence.md
  - docs/work/BANDIT-010/implementation-evidence.md
operator_input_status: none_required
bootstrap_gaps:
  - Live escalated adversarial reviewer integration is unavailable during bootstrap.
escalation_outcome: require_escalated_review
final_decision: Require explicit escalated-review placeholder evidence and keep live paid-model routing out of scope.
