# Review Evidence: BANDIT-015

contract_version: 1
work_item: BANDIT-015
source_head: 3b78a641fb6a2d01adbac457f9ee28115db1aa9d
verification_state: pass
verification_evidence:
  - node --test test/coderabbit-state.test.mjs passed 16/16 tests at repair head 70ad098d378f93dbf07e16f003912873358cb184.
  - npm test passed 144/144 tests at repair head 70ad098d378f93dbf07e16f003912873358cb184.
  - npm run typecheck passed.
  - npm run bandit -- validate passed.
  - GITHUB_TOKEN=dummy-token npm run bandit -- coderabbit-review live BANDIT-015 --pr 15 --fixture /tmp/bandit-coderabbit-live.XXXXXX.json passed and refreshed docs/work/BANDIT-015/coderabbit-review.md at source_head 70ad098d378f93dbf07e16f003912873358cb184.
  - npm run bandit -- coderabbit-review BANDIT-015 passed after fixture-backed live CodeRabbit evidence was refreshed at the repair head.
  - npm run bandit -- qwen-review BANDIT-015 completed at repair evidence head 3b78a641fb6a2d01adbac457f9ee28115db1aa9d and recorded docs/work/BANDIT-015/local-qwen-review.md with a non_blocking reviewer verdict.
  - node --test test/coderabbit-state.test.mjs passed 16/16 after repairing the missing-PR-context evidence path.
coderabbit_state: pass
coderabbit_replacement_evidence:
  - not_applicable
local_qwen_state: non_blocking
local_qwen_replacement_evidence:
  - The prior local Qwen finding about missing refusal-path evidence was triaged and repaired in docs/work/BANDIT-015/qwen-finding-repair.md.
  - The current local Qwen rerun findings are dispositioned in docs/work/BANDIT-015/qwen-rerun-disposition.md.
  - The aggregate review-evidence mismatch is repaired: this artifact records local_qwen_state as non_blocking.
  - The redactSecrets substring over-redaction hardening concern is an explicit no-action decision for BANDIT-015 because conservative over-redaction is safer than fail-open exact-match redaction for untrusted provider diagnostics.
  - A Local Qwen rerun is required at the PM disposition head before escalated-review disposition and landing verdict.
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
