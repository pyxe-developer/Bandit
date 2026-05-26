# Review Evidence: BANDIT-034

contract_version: 1
work_item: BANDIT-034
source_head: df55118889d3472e947b395c581eb978c2e45240
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
  - docs/work/BANDIT-034/coderabbit-finding-disposition.md now records focused repair evidence for the current CSS font-feature finding; CodeRabbit provider evidence is stale after source repair and must be rerun before Stage 4 can proceed.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was rerun against repaired source head 43776fe84c7ba316f14fb3ff985ce6f97bbeac5b and completed with 2 unresolved findings.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json now records the normalized completed provider output from the latest rerun.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unresolved, source_drift_status current, and review_state completed.
  - docs/work/BANDIT-034/coderabbit-finding-disposition.md now records focused repair evidence for the latest ActionButton ARIA string and design-canvas keyboard-handler stability findings; CodeRabbit provider evidence is stale after source repair and must be rerun before Stage 4 can proceed.
  - Focused and repo verification passed: node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs, npm test, npm run typecheck, npm run bandit -- validate, npm run bandit -- cockpit status --json, and git diff --check.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was rerun against repaired source head df55118889d3472e947b395c581eb978c2e45240 and completed with 1 unresolved major finding.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json now records the normalized completed provider output from the current repaired-source rerun.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unresolved, source_drift_status current, and review_state completed.
  - docs/work/BANDIT-034/coderabbit-finding-disposition.md now records focused repair evidence for the current Babel standalone version / script-integrity finding; CodeRabbit provider evidence is stale after source repair and must be rerun before Stage 4 can proceed.
  - Current repair verification passed: recomputed pinned CDN SHA-384 SRI hashes, node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs, npm test, npm run typecheck, npm run bandit -- validate, npm run bandit -- cockpit status --json, and git diff --check.
  - coderabbit review --agent --base origin/main -c AGENTS.md --no-color was rerun against repaired source head c871b6251c8cd20176efcf9d33cac4e9b318ffb8 and completed with 4 unresolved findings.
  - docs/specs/BANDIT-034-coderabbit-rerun-output.json now records the normalized completed provider output from the latest rerun.
  - npm run bandit -- coderabbit-review pre-pr BANDIT-034 --base origin/main --fixture docs/specs/BANDIT-034-coderabbit-rerun-output.json recorded docs/work/BANDIT-034/coderabbit-review.md with coderabbit_verdict blocker, findings_status unresolved, source_drift_status current, and review_state completed.
coderabbit_state: blocker
coderabbit_replacement_evidence:
  - Real pre-PR CodeRabbit provider evidence was rerun against the repaired source and completed with 4 unresolved findings: stale hardcoded next-action UI copy in screens.jsx, missing malformed-global guards in app.jsx, missing queue-band row guards in screens.jsx, and missing trusted sender/origin validation in design-canvas.jsx. Stage 4 remains blocked until those findings are repaired or explicitly dispositioned and CodeRabbit is rerun against the repaired source.
local_qwen_state: not_applicable
local_qwen_replacement_evidence:
  - Local Qwen was not run because CodeRabbit pre-PR review still blocks Stage 4; no aggregate pass can be claimed until CodeRabbit completes without blocker evidence.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: BANDIT-034 is a bounded internal cockpit-shell hardening chore over presentation-only view-model and render surfaces. It introduces no local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, claim lease, work surface reservation, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, PR/CI workflow, authentication, billing, privacy boundary, security-sensitive data flow, or external service integration. No smell trigger requires escalated reviewer routing before the blocking CodeRabbit findings are repaired or dispositioned.
pm_disposition: blocker
pm_disposition_rationale: The latest CodeRabbit rerun produced four unresolved actionable findings. Stage 4 remains blocked until those findings are repaired or explicitly dispositioned and CodeRabbit is rerun against the repaired source. Do not run Local Qwen, refresh aggregate review-subject evidence, or claim aggregate PM disposition until CodeRabbit no longer blocks.
non_blocking_findings_routing:
  - none
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: stale
bootstrap_gaps:
  - none
