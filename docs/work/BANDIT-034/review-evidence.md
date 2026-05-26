# Review Evidence: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: 77b668c436ce0027783ac57a67dbe61af11df475
review_subject_hash: 7932c57117ba0dce448160def5ed1aed1860d5819a035f61591b28e94f5ce536
review_subject_hash_status: stale
verification_state: blocker
verification_evidence:
  - node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs passed during Stage 3 implementation evidence.
  - npm test passed during Stage 3 implementation evidence.
  - npm run typecheck passed during Stage 3 implementation evidence.
  - npm run bandit -- validate passed during Stage 3 implementation evidence.
  - npm run bandit -- cockpit status --json passed during Stage 3 implementation evidence and again after CodeRabbit blocker evidence was recorded.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color completed at the then-current source head with 8 findings.
  - docs/specs/BANDIT-034-coderabbit-review-output.json records the completed CodeRabbit provider output normalized for repo evidence.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-review-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker and findings_status unresolved.
  - npm run bandit -- review-subject-hash BANDIT-034 produced 7932c57117ba0dce448160def5ed1aed1860d5819a035f61591b28e94f5ce536 from review-subject policy v1.
  - docs/work/BANDIT-034/coderabbit-finding-disposition.md records focused repairs for seven findings and no-action SRI verification for the script-integrity finding.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was rerun against repaired source head 1355a9462299247496000d1f00d22482a524fa89 and timed out after the 10-minute Stage 4 wait window while the provider was still in analyzing/reviewing status.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json records the normalized timeout output from the real provider rerun.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unavailable, source_drift_status current, and review_state timeout.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was retried against source head 9786d177c65f65f6983d704eb841c62a19845f8f and completed with 2 unresolved findings.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json now records the normalized completed provider output from the retry.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unresolved, source_drift_status current, and review_state completed.
  - docs/work/BANDIT-034/coderabbit-finding-disposition.md now records focused repair evidence for the two completed-retry findings; CodeRabbit provider evidence must be rerun against the repaired source before Stage 4 can proceed.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was rerun against repaired source head 00978d3585fecc3475f2480052e69b1847698be0 and completed with 3 unresolved findings.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json now records the normalized completed provider output from the repaired-source rerun.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unresolved, source_drift_status current, and review_state completed.
  - docs/work/BANDIT-034/coderabbit-finding-disposition.md now records focused repair / PM disposition evidence for the 3 repaired-source retry findings; CodeRabbit provider evidence is stale after source repair and must be rerun before Stage 4 can proceed.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was rerun against repaired source head 77b668c436ce0027783ac57a67dbe61af11df475 and completed with 1 unresolved minor finding.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json now records the normalized completed provider output from the current repaired-source rerun.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unresolved, source_drift_status current, and review_state completed.
coderabbit_state: blocker
coderabbit_replacement_evidence:
  - Real pre-PR CodeRabbit provider evidence was rerun against the current repaired source and completed with 1 unresolved minor finding in docs/design/workflow-cockpit/prototype-source/design-system/colors_and_type.css. No CodeRabbit pass is claimed; Stage 4 remains blocked until that finding is repaired or dispositioned and provider evidence no longer blocks.
local_qwen_state: not_applicable
local_qwen_replacement_evidence:
  - Local Qwen was not run because CodeRabbit pre-PR review still blocks Stage 4; no aggregate pass can be claimed until CodeRabbit completes without blocker evidence.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: BANDIT-034 is a bounded internal cockpit-shell hardening chore over presentation-only view-model and render surfaces. It introduces no local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, claim lease, work surface reservation, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow, authentication, billing, privacy boundary, security-sensitive data flow, or external service integration. No smell trigger requires escalated reviewer routing before the blocking CodeRabbit findings are repaired or dispositioned.
pm_disposition: blocker
pm_disposition_rationale: Stage 4 remains blocked because the current repaired-source CodeRabbit pre-PR rerun completed with 1 unresolved minor finding: remove unsupported OpenType feature "cv11" from the Instrument Sans font-feature-settings declaration. Repair or disposition that finding before Local Qwen, review-subject hash refresh if needed, and aggregate PM disposition can proceed.
non_blocking_findings_routing:
  - none
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - none
