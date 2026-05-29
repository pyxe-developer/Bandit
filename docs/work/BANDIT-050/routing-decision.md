# Routing Decision: BANDIT-050

work_item: BANDIT-050
decision_kind: workflow
selected_route: tdd-green-implementation
applicable_smell_ids:
  - BANDIT-SMELL-PARSER-VALIDATOR
  - BANDIT-SMELL-MISSING-COVERAGE
  - BANDIT-SMELL-COORDINATION-PROJECTION-AUTHORITY
evidence_used:
  - AGENTS.md
  - CONTEXT.md
  - CLEAN_CODE.md
  - docs/verification/STAGE_RUBRICS.md
  - docs/work/BANDIT-050/brief.md
  - docs/work/BANDIT-050/red-evidence.md
  - test/cockpit-status.test.mjs
  - .bandit/policy/smell-triggers.json
operator_input_status: none_required
bootstrap_gaps:
  - Active bootstrap gap: BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY.
  - Closed-work/no-active-work recovery for next queued gap is verified in Stage 2 tests and remains unavailable until implementation lands.
escalation_outcome: bootstrap_manual_evidence
final_decision: Continue with Stage 3 TDD GREEN implementation for BANDIT-050 through the bootstrap Process Adapter path, keep implementation to production command and state files only, and keep all review/test surface edits with Codex PM review.
