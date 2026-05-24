# Review Evidence: BANDIT-015

contract_version: 1
work_item: BANDIT-015
source_head: 70ad098d378f93dbf07e16f003912873358cb184
verification_state: pass
verification_evidence:
  - node --test test/coderabbit-state.test.mjs passed 16/16 tests at repair head 70ad098d378f93dbf07e16f003912873358cb184.
  - npm test passed 144/144 tests at repair head 70ad098d378f93dbf07e16f003912873358cb184.
  - npm run typecheck passed.
  - npm run bandit -- validate passed.
  - GITHUB_TOKEN=dummy-token npm run bandit -- coderabbit-review live BANDIT-015 --pr 15 --fixture /tmp/bandit-coderabbit-live.XXXXXX.json passed and refreshed docs/work/BANDIT-015/coderabbit-review.md at source_head 70ad098d378f93dbf07e16f003912873358cb184.
  - npm run bandit -- coderabbit-review BANDIT-015 passed after fixture-backed live CodeRabbit evidence was refreshed at the repair head.
  - npm run bandit -- qwen-review BANDIT-015 completed and recorded docs/work/BANDIT-015/local-qwen-review.md with a non_blocking reviewer verdict.
  - node --test test/coderabbit-state.test.mjs passed 16/16 after repairing the missing-PR-context evidence path.
coderabbit_state: pass
coderabbit_replacement_evidence:
  - not_applicable
local_qwen_state: blocker
local_qwen_replacement_evidence:
  - Local Qwen review recorded a non_blocking finding: several fail-closed refusal paths throw errors without first writing actionable evidence to the repo-native artifact.
  - Codex PM triage repaired the valid missing-PR-context path in src/commands/coderabbit-review.ts and recorded docs/work/BANDIT-015/qwen-finding-repair.md.
  - CodeRabbit and aggregate review evidence are now current at repair head 70ad098d378f93dbf07e16f003912873358cb184, but source changed after local Qwen review; rerun local Qwen before landing.
escalated_review_required: true
escalated_review_state: blocker
escalated_review_rationale: BANDIT-015 changes live CodeRabbit review authority, provider-state normalization, credential and PR-context refusal paths, source freshness behavior, and landing-gate inputs. Escalated-review disposition remains required after local Qwen review.
pm_disposition: blocker
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - Live escalated adversarial reviewer routing remains unavailable and requires closeout disposition.
  - PR comment repair orchestration and rerun automation remain out of scope for BANDIT-015 unless later artifacts explicitly resolve or disposition them.
