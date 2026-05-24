# Routing Decision: BANDIT-004

work_item: BANDIT-004
decision_kind: workflow
selected_route: tdd-green-implementation
applicable_smell_ids:
  - BANDIT-SMELL-PARSER-VALIDATOR
  - BANDIT-SMELL-MISSING-COVERAGE
  - BANDIT-SMELL-UNAVAILABLE-AGENT
  - BANDIT-SMELL-POLICY-DRIFT
evidence_used:
  - AGENTS.md
  - CLEAN_CODE.md
  - docs/verification/STAGE_RUBRICS.md
  - docs/work/BANDIT-004/brief.md
  - docs/work/BANDIT-004/red-evidence.md
  - test/routing.test.mjs
operator_input_status: none_required
bootstrap_gaps:
  - CodeRabbit automation unavailable during bootstrap.
  - Local Qwen adversarial gate unavailable during bootstrap.
  - Escalated adversarial review gate unavailable during bootstrap.
  - Landing Agent unavailable during bootstrap.
escalation_outcome: bootstrap_manual_evidence
final_decision: Continue with GREEN implementation under TDD using focused local tests, record unavailable reviewer and landing gates as bootstrap gaps before landing, and do not ask the operator for routine routing choices.
