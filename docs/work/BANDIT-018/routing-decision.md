# Routing Decision: BANDIT-018

work_item: BANDIT-018
decision_kind: reviewer
selected_route: security-reviewer-paid
applicable_smell_ids:
  - BANDIT-SMELL-OPERATOR-INPUT-BOUNDARY
  - BANDIT-SMELL-ADVERSARIAL-REVIEW
  - BANDIT-SMELL-SECURITY-PRIVACY-AUTH
  - BANDIT-SMELL-INFRA-DEPLOY-RELEASE-BILLING
  - BANDIT-SMELL-PARSER-VALIDATOR
  - BANDIT-SMELL-MALFORMED-EVIDENCE
  - BANDIT-SMELL-POLICY-DRIFT
evidence_used:
  - AGENTS.md
  - CONTEXT.md
  - CLEAN_CODE.md
  - docs/verification/STAGE_RUBRICS.md
  - docs/work/BANDIT-018/brief.md
  - docs/work/BANDIT-018/red-evidence.md
  - docs/work/BANDIT-018/implementation-evidence.md
  - .bandit/policy/escalated-review-routing.json
  - .bandit/reviewers/escalated-reviewers.json
operator_input_status: none_required
bootstrap_gaps:
  - CodeRabbit PR-backed review is unavailable for this local-record bootstrap chore because main has no associated pull request.
escalation_outcome: require_escalated_review
final_decision: Require the configured escalated adversarial reviewer route for BANDIT-018 because this chore implements paid-provider setup refusal, credential and cost boundaries, reviewer routing policy, and escalated-review evidence parsing. Codex PM owns this technical reviewer routing decision; actual provider setup, credentials, and cost approval remain operator-owned if the configured paid reviewer is unavailable.
